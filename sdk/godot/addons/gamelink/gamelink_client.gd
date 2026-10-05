extends Node
class_name GameLinkClient

## GameLink room, WebRTC signaling and DataChannel SDK for Godot 4.
signal room_changed(room: Dictionary)
signal members_changed(members: Array)
signal message_received(message: Dictionary)
signal peer_state_changed(peer_id: String, state: String, local_ice: String, remote_ice: String)
signal error_occurred(message: String)
signal room_closed(reason: String)

const DEFAULT_ICE_SERVERS := [{"urls": ["stun:stun.l.google.com:19302"]}, {"urls": ["stun:stun.cloudflare.com:3478"]}]
var server_url := ""
var game_id := ""
var player_name := ""
var ice_servers: Array = DEFAULT_ICE_SERVERS.duplicate(true)
var room: Dictionary = {}
var self_member: Dictionary = {}
var members: Array = []
var peer_states := {}
var local_ice := {}
var remote_ice := {}
var _peers := {}
var _channels := {}
var _pending_ice := {}
var _remote_ready := {}
var _last_peer_emission := {}
var _closed := true
var _poll_busy := false
var _member_token := ""
var _signal_revision: Variant = null
var _signal_acks: Array = []
var _seen_signals := {}
var _poll_epoch := 0
var _poll_time := 0.0
var _heartbeat_time := 0.0
var _refresh_time := 0.0
var poll_interval := 0.25
var heartbeat_interval := 8.0
var room_refresh_interval := 0.0

func _init(options: Dictionary = {}) -> void:
	server_url = str(options.get("server_url", "")).trim_suffix("/")
	game_id = str(options.get("game_id", ""))
	player_name = str(options.get("player_name", "")).strip_edges()
	ice_servers = options.get("ice_servers", DEFAULT_ICE_SERVERS).duplicate(true)
	poll_interval = float(options.get("poll_interval", poll_interval))
	heartbeat_interval = float(options.get("heartbeat_interval", heartbeat_interval))
	room_refresh_interval = float(options.get("room_refresh_interval", room_refresh_interval))

func create_room() -> Dictionary:
	return await _enter(await _request("/v1/rooms", HTTPClient.METHOD_POST, {"game_id": game_id, "player_name": player_name}))

func join_room(code: String) -> Dictionary:
	return await _enter(await _request("/v1/rooms/%s/join" % code.strip_edges().to_upper().uri_encode(), HTTPClient.METHOD_POST, {"game_id": game_id, "player_name": player_name}))

func _enter(result: Dictionary) -> Dictionary:
	if result.is_empty(): return result
	room = result.get("room", {})
	self_member = result.get("self_member", {})
	_member_token = str(result.get("resume_token", ""))
	_signal_revision = null
	_signal_acks.clear(); _seen_signals.clear()
	_poll_epoch += 1
	_poll_busy = false
	_closed = false
	_set_members(room.get("members", []))
	room_changed.emit(room)
	_poll_signals()
	return result

func send(kind: String, payload: Variant, target := "", reliability := "reliable") -> void:
	if self_member.is_empty(): error_occurred.emit("Not connected to a room"); return
	var destinations: Array = [target] if not target.is_empty() else members.filter(func(m): return m.get("id") != self_member.get("id")).map(func(m): return m.get("id", ""))
	var data := JSON.stringify({"kind": kind, "payload": payload}).to_utf8_buffer()
	for peer_id in destinations:
		var channel: WebRTCDataChannel = _channels.get(peer_id, {}).get("state" if reliability == "unreliable" else "control")
		if channel != null and channel.get_ready_state() == WebRTCDataChannel.STATE_OPEN:
			channel.put_packet(data)
		elif peer_states.get(peer_id) == "relay":
			_send_signal(peer_id, "game_relay", {"kind": kind, "payload": payload})

func broadcast(kind: String, payload: Variant) -> void:
	if self_member.is_empty(): return
	await _request("/v1/rooms/%s/events" % str(room.get("code", "")).uri_encode(), HTTPClient.METHOD_POST, {"from": self_member.get("id", ""), "kind": kind, "payload": payload})

func leave_room() -> void:
	if not self_member.is_empty(): await _request("/v1/rooms/%s/leave" % str(room.get("code", "")).uri_encode(), HTTPClient.METHOD_POST, {"member_id": self_member.get("id", "")})
	close()

func close() -> void:
	_closed = true
	_poll_epoch += 1
	for pc: WebRTCPeerConnection in _peers.values(): pc.close()
	_peers.clear(); _channels.clear(); _pending_ice.clear(); peer_states.clear()

func _process(delta: float) -> void:
	if _closed: return
	for peer_id in _peers:
		var pc: WebRTCPeerConnection = _peers[peer_id]
		pc.poll()
		if pc.get_connection_state() == WebRTCPeerConnection.STATE_FAILED or pc.get_connection_state() == WebRTCPeerConnection.STATE_CLOSED:
			_emit_peer_state(peer_id, "relay")
	for peer_id in _channels:
		for channel: WebRTCDataChannel in _channels[peer_id].values():
			if channel.get_ready_state() != WebRTCDataChannel.STATE_OPEN: continue
			while channel.get_available_packet_count() > 0:
				var parsed = JSON.parse_string(channel.get_packet().get_string_from_utf8())
				if parsed is Dictionary and parsed.has("kind"): message_received.emit({"from": peer_id, "kind": parsed.kind, "payload": parsed.get("payload"), "transport": "p2p"})
		if _channels[peer_id].get("control") != null and _channels[peer_id]["control"].get_ready_state() == WebRTCDataChannel.STATE_OPEN and _channels[peer_id].get("state") != null and _channels[peer_id]["state"].get_ready_state() == WebRTCDataChannel.STATE_OPEN:
			_emit_peer_state(peer_id, "connected")
	_poll_time += delta; _heartbeat_time += delta; _refresh_time += delta
	if _poll_time >= poll_interval: _poll_time = 0.0; _poll_signals()
	if _heartbeat_time >= heartbeat_interval: _heartbeat_time = 0.0; _heartbeat()
	if room_refresh_interval > 0 and _refresh_time >= room_refresh_interval: _refresh_time = 0.0; _refresh_room()

func _set_members(next: Array) -> void:
	if self_member.is_empty(): return
	members = next.duplicate(true)
	if not members.any(func(m): return m.get("id") == self_member.get("id")): members.append(self_member)
	var active := {}
	for member in members:
		var id := str(member.get("id", ""))
		if id == self_member.get("id"): continue
		active[id] = true
		_ensure_peer(member)
	for id in _peers.keys():
		if not active.has(id): _peers[id].close(); _peers.erase(id); _channels.erase(id); peer_states.erase(id)
	members_changed.emit(members)

func _ensure_peer(member: Dictionary) -> WebRTCPeerConnection:
	var id := str(member.get("id", ""))
	if _peers.has(id): return _peers[id]
	var pc := WebRTCPeerConnection.new()
	if pc.initialize({"iceServers": ice_servers}) != OK: error_occurred.emit("Could not initialize WebRTC peer"); return null
	_peers[id] = pc; _channels[id] = {}; peer_states[id] = "connecting"
	_remote_ready[id] = false
	pc.session_description_created.connect(func(t, s):
		if pc.set_local_description(t, s) == OK: _send_signal(id, "webrtc_offer" if t == "offer" else "webrtc_answer", {"type": t, "sdp": s})
	)
	pc.ice_candidate_created.connect(func(mid, index, candidate):
		_remember_ice(local_ice, id, candidate)
		_emit_peer_state(id, str(peer_states.get(id, "connecting")))
		_send_signal(id, "webrtc_ice", {"candidate": candidate, "sdpMid": mid, "sdpMLineIndex": index})
	)
	pc.data_channel_received.connect(func(channel): _attach_channel(id, channel))
	if str(self_member.get("id", "")) < id:
		_attach_channel(id, pc.create_data_channel("control"))
		_attach_channel(id, pc.create_data_channel("state", {"ordered": false, "maxRetransmits": 0}))
		pc.create_offer()
	return pc

func _attach_channel(id: String, channel: WebRTCDataChannel) -> void:
	if channel == null: return
	_channels[id][channel.get_label()] = channel

func _poll_signals() -> void:
	if _closed or _poll_busy or self_member.is_empty(): return
	_poll_busy = true
	var epoch := _poll_epoch
	var acks := _signal_acks.duplicate()
	var result = await _request("/v1/rooms/%s/signals/poll" % str(room.get("code", "")).uri_encode(), HTTPClient.METHOD_POST, {"member_id": self_member.get("id", ""), "ack_ids": acks, "revision": _signal_revision, "wait_ms": 15000})
	if epoch != _poll_epoch: return
	_poll_busy = false
	if _closed or result.is_empty(): return
	for id in acks: _signal_acks.erase(id)
	_signal_revision = result.get("revision")
	_set_members(result.get("members", []))
	room["members"] = members
	room_changed.emit(room)
	var now := Time.get_ticks_msec()
	for id in _seen_signals.keys():
		if now - int(_seen_signals[id]) > 120000: _seen_signals.erase(id)
	for signal_data in result.get("signals", []):
		var id := str(signal_data.get("id", ""))
		if id.is_empty(): error_occurred.emit("GameLink 1.2 requires a 1.2 signaling server"); continue
		if not _seen_signals.has(id):
			if not await _receive_signal(signal_data): continue
			_seen_signals[id] = now
		if not _signal_acks.has(id): _signal_acks.append(id)

func _receive_signal(sig: Dictionary) -> bool:
	var id := str(sig.get("from", "")); var kind := str(sig.get("kind", "")); var payload: Dictionary = sig.get("payload", {})
	if kind == "game_relay":
		message_received.emit({"from": id, "kind": payload.get("kind", ""), "payload": payload.get("payload"), "transport": "server-forwarding"}); return true
	if not kind.begins_with("webrtc_"):
		message_received.emit({"from": id, "kind": kind, "payload": payload, "transport": "server-event"}); return true
	var found := members.filter(func(m): return m.get("id") == id)
	var pc := _ensure_peer(found[0] if not found.is_empty() else {"id": id})
	if pc == null: return false
	match kind:
		"webrtc_offer":
			if pc.set_remote_description("offer", str(payload.get("sdp", ""))) != OK: return false
			_remote_ready[id] = true; _apply_pending_ice(id, pc)
			if pc.create_answer() != OK: return false
		"webrtc_answer":
			if pc.set_remote_description("answer", str(payload.get("sdp", ""))) != OK: return false
			_remote_ready[id] = true; _apply_pending_ice(id, pc)
		"webrtc_ice":
			_remember_ice(remote_ice, id, str(payload.get("candidate", "")))
			_emit_peer_state(id, str(peer_states.get(id, "connecting")))
			if not _remote_ready.get(id, false): _pending_ice[id] = _pending_ice.get(id, []) + [payload]
			else:
				if pc.add_ice_candidate(str(payload.get("sdpMid", "0")), int(payload.get("sdpMLineIndex", 0)), str(payload.get("candidate", ""))) != OK: return false

	return true

func _apply_pending_ice(id: String, pc: WebRTCPeerConnection) -> void:
	for item in _pending_ice.get(id, []): pc.add_ice_candidate(str(item.get("sdpMid", "0")), int(item.get("sdpMLineIndex", 0)), str(item.get("candidate", "")))
	_pending_ice.erase(id)

func _send_signal(to: String, kind: String, payload: Dictionary) -> void:
	if not self_member.is_empty(): await _request("/v1/rooms/%s/signals" % str(room.get("code", "")).uri_encode(), HTTPClient.METHOD_POST, {"from": self_member.get("id", ""), "to": to, "kind": kind, "payload": payload})

func _heartbeat() -> void:
	await _request("/v1/rooms/%s/heartbeat" % str(room.get("code", "")).uri_encode(), HTTPClient.METHOD_POST, {"member_id": self_member.get("id", "")})

func _refresh_room() -> void:
	var latest = await _request("/v1/rooms/%s" % str(room.get("code", "")).uri_encode())
	if not latest.is_empty(): room = latest; _set_members(latest.get("members", [])); room_changed.emit(room)

func _request(path: String, method := HTTPClient.METHOD_GET, body: Dictionary = {}) -> Dictionary:
	var req := HTTPRequest.new(); req.timeout = 20.0 if path.ends_with("/signals/poll") else 8.0; add_child(req)
	if method != HTTPClient.METHOD_GET and not _member_token.is_empty():
		body = body.duplicate(); body["auth_token"] = _member_token
	var headers := PackedStringArray(["Content-Type: application/json"])
	var err := req.request(server_url + path, headers, method, "" if body.is_empty() else JSON.stringify(body))
	if err != OK: req.queue_free(); error_occurred.emit("HTTP request could not start (%d)" % err); return {}
	var response: Array = await req.request_completed; req.queue_free()
	var status := int(response[1]); var parsed = JSON.parse_string((response[3] as PackedByteArray).get_string_from_utf8())
	if status < 200 or status >= 300:
		var reason := str(parsed.get("error", "HTTP %d" % status)) if parsed is Dictionary else "HTTP %d" % status
		error_occurred.emit(reason)
		if status in [401, 404, 410] and (path.ends_with("/signals/poll") or path.ends_with("/heartbeat")):
			close(); room_closed.emit(reason)
		return {}
	return parsed if parsed is Dictionary else {}

func _remember_ice(store: Dictionary, id: String, candidate: String) -> void:
	var parts := candidate.split(" ")
	if parts.size() < 6: return
	var value := "%s:%s" % [parts[4], parts[5]]; var values: Array = str(store.get(id, "")).split(" / ", false)
	if not values.has(value): values.append(value)
	store[id] = " / ".join(values)

func _emit_peer_state(id: String, state: String) -> void:
	var local := str(local_ice.get(id, "")); var remote := str(remote_ice.get(id, ""))
	var snapshot := "%s|%s|%s" % [state, local, remote]
	if _last_peer_emission.get(id, "") == snapshot: return
	_last_peer_emission[id] = snapshot
	peer_states[id] = state
	peer_state_changed.emit(id, state, local, remote)
