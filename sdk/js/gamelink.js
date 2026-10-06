// Self-hosted STUN; reachability is diagnosed by each browser.
const DEFAULT_ICE_SERVERS = [{ urls: "stun:xx.xx.xx.xx:3478" }];

const DEBUG_CSS =
  ".debug-button{border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:9px;background:transparent;color:inherit;cursor:pointer;font:600 12px/1.4 monospace;padding:7px 10px}.debug-button[hidden]{display:none}.debug-dialog{box-sizing:border-box;width:min(960px,calc(100vw - 24px));height:min(720px,calc(100dvh - 24px));max-width:calc(100vw - 24px);max-height:calc(100dvh - 24px);margin:auto;padding:16px;border:1px solid #405166;border-radius:14px;background:#101a27;color:#e8eef6;overflow:hidden;font:13px/1.5 system-ui,sans-serif}.debug-dialog::backdrop{background:#0009}.debug-dialog[open]{display:flex;flex-direction:column;gap:10px}.debug-dialog header{display:flex;align-items:center;justify-content:space-between;gap:12px}.debug-dialog button{cursor:pointer;border:1px solid #405166;border-radius:8px;color:inherit;background:#233245;padding:6px 14px}.debug-dialog p{margin:0;color:#9badc0;font-size:11px}.debug-output{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;background:#0a121e;border-radius:8px;padding:12px;font:11px/1.65 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;user-select:text}.debug-output>div{padding:5px 0;border-bottom:1px solid #ffffff0b}";

function sanitizeDebug(value, depth = 0) {
  if (depth > 8) return "[truncated]";
  if (value == null || typeof value === "number" || typeof value === "boolean")
    return value;
  if (typeof value === "string")
    return value.length > 4000 ? value.slice(0, 4000) + "…" : value;
  if (Array.isArray(value))
    return value.slice(0, 256).map((item) => sanitizeDebug(item, depth + 1));
  if (typeof value !== "object") return String(value);
  if (value.kind && !String(value.kind).startsWith("webrtc_"))
    return { kind: value.kind, data: "[game data omitted]" };
  const output = {};
  for (const [key, item] of Object.entries(value)) {
    output[key] = /token|credential|password|secret|authorization/i.test(key)
      ? "[hidden]"
      : key === "sdp"
        ? "[SDP omitted]"
        : sanitizeDebug(item, depth + 1);
  }
  return output;
}

/**
 * Browser JavaScript SDK for GameLink rooms, WebRTC signaling, and peer messages.
 * Game payloads are delivered as typed messages; the SDK does not interpret them.
 */
export class GameLinkClient {
  constructor({
    serverUrl = new URL(import.meta.url).origin,
    gameId,
    playerName,
    iceServers = DEFAULT_ICE_SERVERS,
    pollIntervalMs = 250,
    requestTimeoutMs = 8000,
    heartbeatIntervalMs = 8_000,
    peerHeartbeatIntervalMs = 4_000,
    peerTimeoutMs = 12_000,
    roomRefreshIntervalMs = 0,
    debug = false,
  }) {
    if (!gameId) throw new Error("gameId is required");
    if (!playerName?.trim()) throw new Error("playerName is required");
    this.serverUrl = serverUrl.replace(/\/$/, "");
    this.gameId = gameId;
    this.playerName = playerName.trim();
    this.customIceServers = iceServers !== DEFAULT_ICE_SERVERS;
    this.iceServers = iceServers
      .map((server) => ({
        ...server,
        urls: (Array.isArray(server.urls) ? server.urls : [server.urls]).filter(
          (url) => /^(stuns?|turns?):/i.test(url),
        ),
      }))
      .filter((server) => server.urls.length);
    this.requestTimeoutMs = requestTimeoutMs;
    this.pollIntervalMs = pollIntervalMs;
    this.heartbeatIntervalMs = heartbeatIntervalMs;
    this.peerHeartbeatIntervalMs = peerHeartbeatIntervalMs;
    this.peerTimeoutMs = peerTimeoutMs;
    this.roomRefreshIntervalMs = roomRefreshIntervalMs;
    this.debug = Boolean(debug);
    this.debugLogs = [];
    this.logConsumers = 0;
    this.room = null;
    this.selfMember = null;
    this.members = [];
    this.peerStates = new Map();
    this.localIceAddresses = new Map();
    this.remoteIceAddresses = new Map();
    this.connections = new Map();
    this.channels = new Map();
    this.pendingIce = new Map();
    this.listeners = new Map();
    this.timers = [];
    this.polling = false;
    this.pollEpoch = 0;
    this.pollTimer = null;
    this.pollController = null;
    this.signalRevision = null;
    this.signalAcks = new Set();
    this.seenSignals = new Map();
    this.memberToken = null;
    this.disposed = false;
    this.resuming = false;
    this.loggedConnections = new WeakSet();
    this.stunErrorNotices = new Map();
    this.stunDiagnosticTimers = new Map();
    this.retryTimers = new Map();
    this.retryAttempts = new Map();
    this.generations = new Map();
    this.futureIce = new Map();
    this.connectedOnce = new Set();
    this.networkStages = new Map();
    this.peerTransports = new Map();
    this.turnServers = [];
    this.turnExpiresAt = 0;
    this.turnAvailable = true;
    this.lastGeneration = 0;
    this.peerHeartbeatAt = new Map();
    this.peerHeartbeatPending = new Map();
    this.peerHeartbeatSequence = 0;
  }

  // Log only explicit diagnostic fields: never tokens, full SDP, or game payloads.
  _trace(stage, peerId, details = {}) {
    const entry = {
      time: new Date().toISOString(),
      room: this.room?.code,
      self: this.selfMember?.id,
      peer: peerId,
      generation: peerId ? this.generations.get(peerId) : undefined,
      stage,
      ...sanitizeDebug(details),
    };
    console.info("[GameLink RTC]", JSON.stringify(entry));
    if (this.debug || this.logConsumers > 0) {
      this.debugLogs.push(entry);
      if (this.debugLogs.length > 2000) this.debugLogs.shift();
      this._emit("debug-log", entry);
    }
  }

  async _traceStats(peerId, connection, reason) {
    if (!connection) return;
    try {
      const stats = await connection.getStats();
      const pairs = [...stats.values()]
        .filter((r) => r.type === "candidate-pair")
        .map((r) => ({
          state: r.state,
          nominated: r.nominated,
          requestsSent: r.requestsSent,
          responsesReceived: r.responsesReceived,
          requestsReceived: r.requestsReceived,
          bytesSent: r.bytesSent,
          bytesReceived: r.bytesReceived,
          localType: stats.get(r.localCandidateId)?.candidateType,
          remoteType: stats.get(r.remoteCandidateId)?.candidateType,
        }));
      this._trace("ice.summary", peerId, {
        reason,
        connection: connection.connectionState,
        ice: connection.iceConnectionState,
        signaling: connection.signalingState,
        gathering: connection.iceGatheringState,
        localIce: this.localIceAddresses.get(peerId),
        remoteIce: this.remoteIceAddresses.get(peerId),
        pairs,
        channels: Object.fromEntries(
          Object.entries(this.channels.get(peerId) || {}).map(
            ([key, channel]) => [key, channel.readyState],
          ),
        ),
      });
    } catch (error) {
      this._trace("ice.stats-error", peerId, { name: error.name });
    }
  }

  on(eventName, listener) {
    const listeners = this.listeners.get(eventName) || new Set();
    listeners.add(listener);
    this.listeners.set(eventName, listeners);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) this.listeners.delete(eventName);
    };
  }

  /** Live diagnostic history. Omit type for the SDK dialog, or use data for custom UI. */
  getLogs(options = {}) {
    this._validateDiagnosticOptions(options);
    this.logConsumers++;
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      this.logConsumers = Math.max(0, this.logConsumers - 1);
    };
    try {
      return this._createDiagnosticView(
        "logs",
        options,
        () => this.debugLogs,
        ["debug-log"],
        release,
      );
    } catch (error) {
      release();
      throw error;
    }
  }

  /** Live room and player connection states, with no DOM access in data mode. */
  getConnections(options = {}) {
    this._validateDiagnosticOptions(options);
    const maxMembers = options.maxMembers ?? 4;
    if (!Number.isInteger(maxMembers) || maxMembers < 1)
      throw new TypeError("maxMembers must be a positive integer");
    return this._createDiagnosticView(
      "connections",
      options,
      () => ({
        roomCode: this.room?.code || null,
        selfId: this.selfMember?.id || null,
        memberCount: this.disposed ? 0 : this.members.length,
        maxMembers,
        disposed: this.disposed,
        players: this.disposed
          ? []
          : this.members.map((member) => {
              const isSelf = member.id === this.selfMember?.id;
              const state = isSelf
                ? "local"
                : this.peerStates.get(member.id) || "connecting";
              return {
                id: member.id,
                name: member.name || "",
                isSelf,
                state,
                transport:
                  !isSelf && state === "connected"
                    ? this.peerTransports.get(member.id) ||
                      (this.networkStages.get(member.id) === 2 ? "turn" : "p2p")
                    : null,
                networkStage: isSelf
                  ? null
                  : ["lan", "stun", "turn"][
                      this.networkStages.get(member.id) || 0
                    ],
                attempt: this.retryAttempts.get(member.id) || 0,
                generation: this.generations.get(member.id) || 0,
                localIce: this.localIceAddresses.get(member.id) || "",
                remoteIce: this.remoteIceAddresses.get(member.id) || "",
              };
            }),
      }),
      ["room", "members", "peer-state"],
    );
  }

  _validateDiagnosticOptions(options) {
    if (!options || !["dialog", "data"].includes(options.type ?? "dialog"))
      throw new TypeError("type must be dialog or data");
    if (
      options.onChange !== undefined &&
      typeof options.onChange !== "function"
    )
      throw new TypeError("onChange must be a function");
  }

  _createDiagnosticView(kind, options, snapshot, events, cleanup = () => {}) {
    const type = options.type ?? "dialog";
    const listeners = new Set();
    let stopped = false;
    let dialog;
    let stops = [];
    const copy = () => {
      const freeze = (value) => {
        if (value && typeof value === "object") {
          Object.values(value).forEach(freeze);
          Object.freeze(value);
        }
        return value;
      };
      return freeze(JSON.parse(JSON.stringify(snapshot())));
    };
    let data = copy();
    const notify = (listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error("[GameLink SDK] diagnostic listener failed", error);
      }
    };
    const refresh = () => {
      if (stopped) return;
      data = copy();
      dialog?.render(data);
      for (const listener of listeners) notify(listener);
    };
    const dispose = () => {
      if (stopped) return;
      stopped = true;
      stops.forEach((stop) => stop());
      listeners.clear();
      dialog?.destroy();
      cleanup();
    };
    const handle = {
      type,
      get data() {
        return data;
      },
      subscribe(listener) {
        if (typeof listener !== "function")
          throw new TypeError("listener must be a function");
        if (stopped) return () => {};
        listeners.add(listener);
        notify(listener);
        return () => listeners.delete(listener);
      },
      dispose,
      close: dispose,
    };
    try {
      if (type === "dialog" && !this.disposed) {
        dialog = this._createDiagnosticDialog(kind, dispose);
        dialog.render(data);
      }
      if (!this.disposed) {
        stops = [
          ...events.map((event) => this.on(event, refresh)),
          this.on("disposed", () => {
            refresh();
            dispose();
          }),
        ];
        if (options.onChange) handle.subscribe(options.onChange);
      } else {
        if (options.onChange) notify(options.onChange);
        dispose();
      }
      return handle;
    } catch (error) {
      dispose();
      throw error;
    }
  }

  _createDiagnosticDialog(kind, close) {
    if (typeof document === "undefined" || !document.body)
      throw new Error(
        "Dialog mode requires a browser document; use type: data outside the browser",
      );
    const host = document.createElement("div");
    host.setAttribute("data-gamelink-diagnostic", kind);
    const root = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent =
      DEBUG_CSS +
      ".connection-dialog{height:auto;width:min(420px,calc(100vw - 24px))}.connection-list{overflow:auto;min-height:0}.connection-player{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #ffffff15}.connection-player span{overflow-wrap:anywhere}.connection-player b{flex-shrink:0;color:#8ce3b0;font-size:11px}.connection-player b.pending{color:#b9c3cf}.connection-player b.relay{color:#aec9ff}";
    const dialog = document.createElement("dialog");
    dialog.className = `debug-dialog${kind === "connections" ? " connection-dialog" : ""}`;
    const title = kind === "logs" ? "SDK 通讯日志" : "玩家连接";
    dialog.setAttribute("aria-label", title);
    const header = document.createElement("header");
    const heading = document.createElement("strong");
    heading.textContent = title;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "关闭";
    button.setAttribute("aria-label", `关闭${title}`);
    button.addEventListener("click", close);
    header.append(heading, button);
    const hint = document.createElement("p");
    const output = document.createElement("div");
    output.className = kind === "logs" ? "debug-output" : "connection-list";
    dialog.append(header, hint, output);
    dialog.addEventListener("close", close);
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      )
        close();
    });
    for (const event of ["keydown", "pointerdown", "pointerup", "selectstart"])
      dialog.addEventListener(event, (e) => e.stopPropagation());
    root.append(style, dialog);
    document.body.append(host);
    try {
      dialog.showModal();
    } catch (error) {
      host.remove();
      throw error;
    }
    return {
      render(data) {
        if (kind === "logs") {
          hint.textContent = "最近 2000 条 · 已过滤游戏数据 · 凭证已隐藏";
          const sticky =
            output.scrollHeight - output.scrollTop - output.clientHeight < 40;
          const lines = data.map((entry) => {
            const line = document.createElement("div");
            line.textContent = JSON.stringify(entry);
            return line;
          });
          output.replaceChildren(...lines);
          if (sticky) output.scrollTop = output.scrollHeight;
        } else {
          hint.textContent = `${data.roomCode ? `房间 ${data.roomCode}` : "尚未加入房间"} · ${data.memberCount} / ${data.maxMembers} · 显示与你之间的连接`;
          const rows = data.players.map((player) => {
            const row = document.createElement("div");
            row.className = "connection-player";
            const name = document.createElement("span");
            name.textContent = player.name + (player.isSelf ? " · 你" : "");
            const badge = document.createElement("b");
            badge.textContent = player.isSelf
              ? "本机"
              : player.state === "connected"
                ? player.transport === "turn"
                  ? "TURN 中继"
                  : "P2P 直连"
                : player.state === "reconnecting"
                  ? "重连中"
                  : player.state === "closed"
                    ? "已断开"
                    : "连接中";
            badge.className =
              player.transport === "turn"
                ? "relay"
                : player.state !== "connected" && !player.isSelf
                  ? "pending"
                  : "";
            row.append(name, badge);
            return row;
          });
          output.replaceChildren(...rows);
        }
      },
      destroy() {
        if (dialog.open) dialog.close();
        host.remove();
      },
    };
  }

  /** @deprecated Applications should render their own buttons and call getLogs/getConnections. */
  mountConnectionBanner({
    container = document.querySelector("[data-gamelink-toolbar]"),
    expanded = false,
    maxMembers = 4,
  } = {}) {
    if (this.disposed) return () => {};
    if (!container)
      throw new Error("Connection banner requires a toolbar container");
    const host = document.createElement("span");
    const views = new Set();
    const open = (kind) => {
      const view =
        kind === "logs" ? this.getLogs() : this.getConnections({ maxMembers });
      views.add(view);
    };
    const logs = document.createElement("button");
    logs.type = "button";
    logs.textContent = "日志";
    logs.onclick = () => open("logs");
    const connections = document.createElement("button");
    connections.type = "button";
    connections.textContent = "玩家连接";
    connections.onclick = () => open("connections");
    host.append(logs, connections);
    container.append(host);
    const stream = this.getConnections({
      type: "data",
      maxMembers,
      onChange: (data) => {
        connections.textContent = `玩家连接 ${data.memberCount} / ${data.maxMembers}`;
      },
    });
    let stop = () => {};
    const destroy = () => {
      stop();
      stream.dispose();
      views.forEach((view) => view.dispose());
      views.clear();
      host.remove();
    };
    stop = this.on("disposed", destroy);
    if (expanded) open("connections");
    return destroy;
  }

  static fromLocation(options = {}) {
    const params = new URL(window.location.href).searchParams;
    const gameId = params.get("gameid");
    const playerName = params.get("username");
    if (!gameId || !playerName?.trim() || !params.get("room")) {
      throw new Error(
        "链接缺少 gameid、room 或 username，请从平台首页进入游戏。",
      );
    }
    return new GameLinkClient({ ...options, gameId, playerName });
  }

  async createLaunchUrl(entryUrl) {
    const url = new URL(entryUrl, window.location.href);
    if (!["http:", "https:"].includes(url.protocol))
      throw new Error("游戏入口必须为 HTTP(S) 地址");
    const result = await this._request("/v1/rooms", "POST", {
      game_id: this.gameId,
      player_name: this.playerName,
      create_only: true,
    });
    url.search = new URLSearchParams({
      gameid: this.gameId,
      room: result.room.code,
      username: this.playerName,
    }).toString();
    url.hash = "";
    return url.href;
  }

  async joinFromLocation() {
    const url = new URL(window.location.href);
    if (url.searchParams.get("gameid") !== this.gameId)
      throw new Error("游戏 ID 不匹配");
    return this.joinRoom(url.searchParams.get("room"));
  }

  async createRoom() {
    const result = await this._request("/v1/rooms", "POST", {
      game_id: this.gameId,
      player_name: this.playerName,
    });
    await this._enterRoom(result);
    return result;
  }

  async joinRoom(code) {
    const roomCode = String(code || "")
      .trim()
      .toUpperCase();
    if (!roomCode) throw new Error("room code is required");
    this._trace("room.join.start", null, { room: roomCode });
    const resumeToken = this._getResumeToken(roomCode);
    let result;
    let resumed = Boolean(resumeToken);
    try {
      result = await this._request(
        `/v1/rooms/${encodeURIComponent(roomCode)}/join`,
        "POST",
        {
          game_id: this.gameId,
          player_name: this.playerName,
          resume_token: resumeToken || undefined,
        },
      );
    } catch (error) {
      if (!resumeToken || error.status !== 401) throw error;
      resumed = false;
      try {
        window.sessionStorage.removeItem(this._resumeStorageKey(roomCode));
      } catch {}
      result = await this._request(
        `/v1/rooms/${encodeURIComponent(roomCode)}/join`,
        "POST",
        { game_id: this.gameId, player_name: this.playerName },
      );
    }
    this._setResumeToken(roomCode, result.resume_token);
    await this._enterRoom(result, resumed);
    return result;
  }

  async _enterRoom(result, resumed = false) {
    this._stopLoops();
    const entryEpoch = this.pollEpoch;
    this.disposed = false;
    this.resuming = resumed;
    this.room = result.room;
    this.selfMember = result.self_member;
    this.memberToken = result.resume_token;
    this.signalRevision = null;
    this.signalAcks.clear();
    this.seenSignals.clear();
    this._setResumeToken(result.room.code, result.resume_token);
    try {
      const network = await this._request(
        `/v1/rooms/${encodeURIComponent(this.room.code)}/network`,
        "POST",
        { member_id: this.selfMember.id },
      );
      if (this.disposed || entryEpoch !== this.pollEpoch) return;
      if (!this.customIceServers && Array.isArray(network.stun_urls))
        this.iceServers = [
          { urls: network.stun_urls.filter((url) => /^stuns?:/i.test(url)) },
        ];
      this.turnAvailable =
        network.turn_available === true ||
        this.iceServers.some((s) =>
          s.urls.some((url) => /^turns?:/i.test(url)),
        );
    } catch (error) {
      if (this.disposed || entryEpoch !== this.pollEpoch) return;
      if (error.status !== 404) {
        await this.leave();
        throw error;
      }
      this.turnAvailable = this.iceServers.some((s) =>
        s.urls.some((url) => /^turns?:/i.test(url)),
      );
    }
    this._trace("room.join.ok", null, {
      resumed,
      memberCount: result.room.members.length,
    });
    this._setMembers(result.room.members);
    this._emit("room", this.room);
    this._startLoops();
    const activeEpoch = this.pollEpoch;
    await Promise.allSettled([this.refreshRoom(), this._pollSignals()]);
    if (this.disposed || activeEpoch !== this.pollEpoch) return;
    if (resumed && this.room && this.selfMember) {
      await Promise.allSettled(
        this.members
          .filter((member) => member.id !== this.selfMember.id)
          .map((member) => this._sendSignal(member.id, "webrtc_restart", {})),
      );
      this.resuming = false;
      this._syncPeerConnections();
    }
  }

  _resumeStorageKey(code) {
    return `gamelink-resume:${this.gameId}:${String(code).toUpperCase()}`;
  }

  _getResumeToken(code) {
    try {
      return window.sessionStorage.getItem(this._resumeStorageKey(code));
    } catch {
      return null;
    }
  }

  _setResumeToken(code, token) {
    try {
      if (token)
        window.sessionStorage.setItem(this._resumeStorageKey(code), token);
    } catch {
      /* Session storage can be unavailable in restricted browser contexts. */
    }
  }

  _startLoops() {
    this._stopLoops();
    void this._pollSignals();
    this.timers.push(
      setInterval(() => this._heartbeat(), this.heartbeatIntervalMs),
    );
    this.timers.push(
      setInterval(
        () => this._checkPeerHeartbeats(),
        this.peerHeartbeatIntervalMs,
      ),
    );
    // Optional explicit fallback; membership normally arrives through long polling.
    if (this.roomRefreshIntervalMs > 0)
      this.timers.push(
        setInterval(
          () => this.refreshRoom().catch((error) => this._reportError(error)),
          this.roomRefreshIntervalMs,
        ),
      );
  }

  _stopLoops() {
    for (const timer of this.timers) clearInterval(timer);
    this.timers = [];
    this.pollEpoch++;
    clearTimeout(this.pollTimer);
    this.pollController?.abort();
    this.polling = false;
  }

  async refreshRoom() {
    if (!this.room || this.disposed) return null;
    const epoch = this.pollEpoch;
    const latest = await this._request(
      `/v1/rooms/${encodeURIComponent(this.room.code)}`,
    );
    if (this.disposed || epoch !== this.pollEpoch) return null;
    this.room = latest;
    this._setMembers(latest.members);
    this._emit("room", latest);
    if (!latest.members.some((member) => member.id === this.selfMember?.id)) {
      this._emit("room-closed", {
        reason: "You are no longer a member of this room.",
      });
      this.dispose();
    }
    return latest;
  }

  async _heartbeat() {
    if (!this.room || !this.selfMember || this.disposed) return;
    const epoch = this.pollEpoch;
    try {
      await this._request(
        `/v1/rooms/${encodeURIComponent(this.room.code)}/heartbeat`,
        "POST",
        {
          member_id: this.selfMember.id,
        },
      );
    } catch (error) {
      if (!this.disposed && epoch === this.pollEpoch) this._reportError(error);
    }
  }

  async _pollSignals() {
    if (this.polling || !this.room || !this.selfMember || this.disposed) return;
    this.polling = true;
    const epoch = this.pollEpoch;
    const controller = new AbortController();
    this.pollController = controller;
    const acknowledgements = [...this.signalAcks];
    let delay = 0;
    try {
      const result = await this._request(
        `/v1/rooms/${encodeURIComponent(this.room.code)}/signals/poll`,
        "POST",
        {
          member_id: this.selfMember.id,
          ack_ids: acknowledgements,
          revision: this.signalRevision,
          wait_ms: 15000,
        },
        {
          timeoutMs: Math.max(this.requestTimeoutMs, 20000),
          signal: controller.signal,
        },
      );
      if (this.disposed || epoch !== this.pollEpoch) return;
      for (const id of acknowledgements) this.signalAcks.delete(id);
      this.signalRevision = result.revision;
      this._setMembers([...result.members, this.selfMember]);
      this._emit("room", this.room);
      const now = Date.now();
      for (const [id, at] of this.seenSignals)
        if (now - at > 120000) this.seenSignals.delete(id);
      for (const signal of result.signals) {
        if (!signal.id)
          throw new Error("GameLink 1.2 SDK requires a 1.2 signaling server");
        if (!this.seenSignals.has(signal.id)) {
          await this._receiveSignal(signal);
          this.seenSignals.set(signal.id, now);
        }
        this.signalAcks.add(signal.id);
      }
    } catch (error) {
      if (
        !this.disposed &&
        epoch === this.pollEpoch &&
        !controller.signal.aborted
      ) {
        this._reportError(error);
        if ([401, 404, 410].includes(error.status)) {
          this._emit("room-closed", { reason: error.message });
          this.dispose();
        }
      }
      delay = Math.max(this.pollIntervalMs, 1000);
    } finally {
      if (epoch === this.pollEpoch) {
        this.polling = false;
        this.pollController = null;
        if (!this.disposed)
          this.pollTimer = setTimeout(() => void this._pollSignals(), delay);
      }
    }
  }

  async broadcast(kind, payload) {
    if (this.disposed || !this.room || !this.selfMember)
      throw new Error("not connected to a room");
    this.send(kind, payload, { reliability: "reliable" });
  }

  send(kind, payload, { target, reliability } = {}) {
    if (this.disposed || !this.selfMember) return;
    const delivery =
      reliability || (kind === "player_state" ? "unreliable" : "reliable");
    const serialized = JSON.stringify({ kind, payload });
    const destinations = target
      ? [target]
      : this.members
          .filter((member) => member.id !== this.selfMember.id)
          .map((member) => member.id);
    for (const peerId of destinations) {
      const channel =
        this.channels.get(peerId)?.[
          delivery === "unreliable" ? "state" : "control"
        ];
      const peerName =
        this.members.find((member) => member.id === peerId)?.name || peerId;
      if (
        this.peerStates.get(peerId) === "connected" &&
        channel?.readyState === "open"
      ) {
        if (delivery === "unreliable" && channel.bufferedAmount > 8192)
          continue;
        try {
          channel.send(serialized);
          console.info("[GameLink SDK] message sent", {
            peerName,
            peerId,
            transport: "WebRTC P2P DataChannel",
            address:
              this.remoteIceAddresses.get(peerId) ||
              "remote ICE address unavailable",
            message: { kind, payload },
          });
        } catch (error) {
          this._reportError(error);
        }
      } else {
        this._emit("delivery-skipped", {
          peerId,
          kind,
          reason: "p2p-not-ready",
        });
      }
    }
  }

  async leave() {
    const room = this.room;
    const self = this.selfMember;
    const token = this.memberToken;
    // Stop old polls before leaving; their 401 responses must not affect a new session.
    this.dispose();
    try {
      if (room && self)
        await this._request(
          `/v1/rooms/${encodeURIComponent(room.code)}/leave`,
          "POST",
          {
            member_id: self.id,
            auth_token: token,
          },
        );
    } finally {
      if (room) {
        try {
          const key = this._resumeStorageKey(room.code);
          if (window.sessionStorage.getItem(key) === token)
            window.sessionStorage.removeItem(key);
        } catch {}
      }
    }
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this._stopLoops();
    for (const timer of this.retryTimers.values()) clearTimeout(timer);
    this.retryTimers.clear();
    for (const timer of this.stunDiagnosticTimers.values()) clearTimeout(timer);
    this.stunDiagnosticTimers.clear();
    this.stunErrorNotices.clear();
    this.retryAttempts.clear();
    this.generations.clear();
    this.networkStages.clear();
    this.peerTransports.clear();
    this.turnServers = [];
    this.turnExpiresAt = 0;
    this.futureIce.clear();
    this.connectedOnce.clear();
    this.peerHeartbeatAt.clear();
    this.peerHeartbeatPending.clear();
    for (const connection of this.connections.values()) connection.close();
    this.connections.clear();
    this.channels.clear();
    this.pendingIce.clear();
    this.peerStates.clear();
    this.localIceAddresses.clear();
    this.remoteIceAddresses.clear();
    this._emit("disposed", undefined);
  }

  _setMembers(members) {
    if (!this.selfMember) return;
    const fullMembers = members.some(
      (member) => member.id === this.selfMember.id,
    )
      ? members
      : [...members, this.selfMember];
    this.members = fullMembers;
    this.room = this.room ? { ...this.room, members: fullMembers } : this.room;
    this._syncPeerConnections();
    this._emit("members", fullMembers);
  }

  _syncPeerConnections() {
    if (this.disposed || !this.selfMember || this.resuming) return;
    const activeIds = new Set(
      this.members
        .filter((member) => member.id !== this.selfMember.id)
        .map((member) => member.id),
    );
    for (const peerId of new Set([
      ...this.connections.keys(),
      ...this.retryTimers.keys(),
      ...this.generations.keys(),
    ])) {
      const connection = this.connections.get(peerId);
      if (activeIds.has(peerId)) continue;
      clearTimeout(this.retryTimers.get(peerId));
      this.retryTimers.delete(peerId);
      this.retryAttempts.delete(peerId);
      this.generations.delete(peerId);
      this.networkStages.delete(peerId);
      this.peerTransports.delete(peerId);
      this.futureIce.delete(peerId);
      this.connectedOnce.delete(peerId);
      this.peerHeartbeatAt.delete(peerId);
      this.peerHeartbeatPending.delete(peerId);
      this.connections.delete(peerId);
      connection?.close();
      this.channels.delete(peerId);
      this.pendingIce.delete(peerId);
      this.peerStates.delete(peerId);
      this.localIceAddresses.delete(peerId);
      this.remoteIceAddresses.delete(peerId);
      this._emitPeerState(peerId, "closed");
    }
    for (const member of this.members) {
      if (member.id !== this.selfMember.id) this._ensurePeerConnection(member);
    }
  }

  _ensurePeerConnection(member, generation) {
    if (
      !member ||
      this.disposed ||
      !this.selfMember ||
      this.resuming ||
      member.id === this.selfMember.id
    )
      return null;
    const existing = this.connections.get(member.id);
    if (existing) return existing;
    const offerer = this.selfMember.id.localeCompare(member.id) < 0;
    if (!offerer && !generation) {
      this._watchConnection(member.id);
      return null;
    }
    if (offerer)
      generation = this.lastGeneration = Math.max(
        Date.now() * 1000,
        this.lastGeneration + 1,
      );
    this.peerTransports.delete(member.id);
    this.generations.set(member.id, generation);
    const stage = this.networkStages.get(member.id) || 0;
    const stunServers = this.iceServers
      .map((server) => ({
        ...server,
        urls: server.urls.filter((url) => /^stuns?:/i.test(url)),
      }))
      .filter((server) => server.urls.length);
    const relayServers = [
      ...this.turnServers,
      ...this.iceServers
        .map((server) => ({
          ...server,
          urls: server.urls.filter((url) => /^turns?:/i.test(url)),
        }))
        .filter((server) => server.urls.length),
    ];
    const iceServers =
      stage === 0 ? [] : stage === 1 ? stunServers : relayServers;
    this._trace("network.stage", member.id, {
      stage: ["lan", "stun", "turn"][stage],
    });
    const connection = new RTCPeerConnection({
      iceServers,
      iceTransportPolicy: stage === 2 ? "relay" : "all",
    });
    this.connections.set(member.id, connection);
    this._trace("peer.create", member.id, {
      role: offerer ? "offerer" : "answerer",
      stunUrls: this.iceServers.flatMap((s) => s.urls),
    });
    for (const event of ["iceconnectionstatechange", "signalingstatechange"]) {
      connection.addEventListener(event, () => {
        if (this.connections.get(member.id) !== connection) return;
        this._trace("peer." + event, member.id, {
          ice: connection.iceConnectionState,
          signaling: connection.signalingState,
        });
      });
    }
    this.channels.set(member.id, {});
    this._setPeerState(
      member.id,
      this.connectedOnce.has(member.id) || this.retryAttempts.has(member.id)
        ? "reconnecting"
        : "connecting",
    );
    // STUN is contacted by the browser, so report its ICE errors at the client.
    const stunUrls = [
      ...new Set(
        iceServers
          .flatMap((server) => server.urls)
          .filter((url) => /^stuns?:/i.test(url)),
      ),
    ];
    const stunFailures = new Map();
    let publicCandidate = false;
    let gatheringReported = false;
    const current = () =>
      !this.disposed && this.connections.get(member.id) === connection;
    const reportStun = (status, details = {}) => {
      if (!current()) return;
      const diagnostic = {
        peerId: member.id,
        generation,
        status,
        urls: stunUrls,
        failures: [...stunFailures.values()],
        publicCandidate,
        ...details,
      };
      this._trace("stun." + status, member.id, {
        publicCandidate,
        url: diagnostic.url,
        errorCode: diagnostic.errorCode,
        errorText: diagnostic.errorText,
        code: diagnostic.code,
      });
      this._emit("stun-status", diagnostic);
      if (!diagnostic.message) return;
      // Three peers and continuous retries must not flood the same warning.
      const key =
        diagnostic.code + ":" + (diagnostic.url || stunUrls.join(","));
      const now = Date.now();
      if (now - (this.stunErrorNotices.get(key) || 0) < 60000) return;
      this.stunErrorNotices.set(key, now);
      const error = Object.assign(new Error(diagnostic.message), diagnostic, {
        name: "GameLinkStunError",
      });
      this._reportError(error);
    };
    const clearStunTimer = () => {
      clearTimeout(this.stunDiagnosticTimers.get(connection));
      this.stunDiagnosticTimers.delete(connection);
    };
    const finishStun = (timedOut = false) => {
      if (!current() || gatheringReported || !stunUrls.length) return;
      gatheringReported = true;
      clearStunTimer();
      if (publicCandidate) {
        reportStun("available");
        return;
      }
      const normalize = (url) =>
        url.toLowerCase().replace(/\?transport=udp$/, "");
      const allFailed = stunUrls.every((url) =>
        [...stunFailures.keys()].some(
          (failed) => normalize(failed) === normalize(url),
        ),
      );
      reportStun(allFailed ? "failed" : "unconfirmed", {
        code: allFailed
          ? "STUN_ALL_FAILED"
          : timedOut
            ? "STUN_TIMEOUT"
            : "STUN_NO_PUBLIC_CANDIDATE",
        message: allFailed
          ? "STUN 失败：所有配置的 STUN 服务请求均失败，未获取公网连接地址。跨网络联机可能失败；局域网直连仍会继续尝试。"
          : timedOut
            ? "STUN 检测超时：3 秒内未获取公网连接地址，尚无法确认服务是否可达。跨网络联机可能失败，仍在尝试连接。"
            : "STUN 未获取公网连接地址，无法确认服务是否可达。跨网络联机可能失败，请检查网络或 STUN 配置。",
      });
    };
    connection.onicecandidateerror = (event) => {
      if (!current()) return;
      if (/^turns?:/i.test(event.url || "")) {
        this._trace("turn.server-error", member.id, {
          url: event.url,
          errorCode: event.errorCode,
          errorText: event.errorText,
        });
        return;
      }
      if (!/^stuns?:/i.test(event.url || "")) return;
      const failure = {
        url: event.url,
        errorCode: event.errorCode,
        errorText: event.errorText || "",
      };
      stunFailures.set(event.url, failure);
      reportStun("server-error", {
        ...failure,
        code: "STUN_SERVER_ERROR",
        message: `STUN 请求失败：${event.url}（错误码 ${event.errorCode}）。仍会尝试其他连接路径。`,
      });
      if (connection.iceGatheringState === "complete" && !publicCandidate) {
        gatheringReported = false;
        finishStun();
      }
    };
    if (stunUrls.length)
      this.stunDiagnosticTimers.set(
        connection,
        setTimeout(() => {
          clearStunTimer();
          finishStun(true);
        }, 3000),
      );
    connection.addEventListener("connectionstatechange", () => {
      if (connection.connectionState === "closed") clearStunTimer();
    });
    connection.onicegatheringstatechange = () => {
      if (!current()) return;
      this._trace("ice.gathering", member.id, {
        state: connection.iceGatheringState,
      });
      if (connection.iceGatheringState === "complete") finishStun();
    };
    connection.onicecandidate = (event) => {
      if (!current()) return;
      if (!event.candidate) {
        finishStun();
        return;
      }
      if (
        event.candidate.type === "srflx" ||
        / typ srflx(?: |$)/.test(event.candidate.candidate)
      ) {
        if (!publicCandidate) {
          publicCandidate = true;
          clearStunTimer();
          reportStun("available");
        }
      }
      this._trace("ice.local", member.id, {
        type: event.candidate.type,
        protocol: event.candidate.protocol,
        address: event.candidate.address,
        port: event.candidate.port,
      });
      this._rememberIceCandidate(
        this.localIceAddresses,
        member.id,
        event.candidate.candidate,
      );
      this._emitPeerState(
        member.id,
        this.peerStates.get(member.id) || "connecting",
      );
      this._sendSignal(member.id, "webrtc_ice", {
        ...event.candidate.toJSON(),
        generation,
      }).catch((error) => this._reportError(error));
    };
    connection.ondatachannel = (event) => {
      if (this.connections.get(member.id) === connection)
        this._attachChannel(member.id, event.channel);
    };
    connection.onconnectionstatechange = () => {
      if (this.connections.get(member.id) === connection) {
        this._trace("peer.connection", member.id, {
          state: connection.connectionState,
        });
        this._updatePeerState(member.id);
      }
    };
    if (offerer) {
      this._attachChannel(member.id, connection.createDataChannel("control"));
      this._attachChannel(
        member.id,
        connection.createDataChannel("state", {
          ordered: false,
          maxRetransmits: 0,
        }),
      );
      this._createOffer(member.id, connection);
    }
    this._watchConnection(member.id);
    return connection;
  }

  _attachChannel(peerId, channel) {
    const connection = this.connections.get(peerId);
    const current = () =>
      !this.disposed && this.connections.get(peerId) === connection;
    const channels = this.channels.get(peerId) || {};
    if (channel.label === "state") channels.state = channel;
    else channels.control = channel;
    this.channels.set(peerId, channels);
    this._trace("channel.attach", peerId, {
      label: channel.label,
      state: channel.readyState,
    });
    channel.onopen = () => {
      if (!current()) return;
      this._trace("channel.open", peerId, { label: channel.label });
      this.peerHeartbeatAt.set(peerId, Date.now());
      this._updatePeerState(peerId);
    };
    channel.onclose = () => {
      if (current()) {
        this._trace("channel.close", peerId, { label: channel.label });
        this._retryPeer(peerId);
      }
    };
    channel.onerror = (event) => {
      if (current()) {
        this._trace("channel.error", peerId, {
          label: channel.label,
          detail: event.error?.errorDetail,
        });
        this._retryPeer(peerId);
      }
    };
    channel.onmessage = (event) => {
      if (!current()) return;
      try {
        const message = JSON.parse(String(event.data));
        if (!message || typeof message.kind !== "string") return;
        this.peerHeartbeatAt.set(peerId, Date.now());
        if (message.kind === "__gamelink_peer_ping") {
          const control = this.channels.get(peerId)?.control;
          if (control?.readyState === "open")
            control.send(
              JSON.stringify({
                kind: "__gamelink_peer_pong",
                payload: message.payload,
              }),
            );
          return;
        }
        if (message.kind === "__gamelink_peer_pong") {
          if (message.payload?.seq === this.peerHeartbeatPending.get(peerId))
            this.peerHeartbeatPending.delete(peerId);
          return;
        }
        this.peerHeartbeatPending.delete(peerId);
        this._emit("message", {
          from: peerId,
          kind: message.kind,
          payload: message.payload,
          sent_at: Date.now(),
          transport:
            this.peerTransports.get(peerId) ||
            (this.networkStages.get(peerId) === 2 ? "turn" : "p2p"),
        });
      } catch {
        // Ignore malformed or non-JSON game payloads.
      }
    };
    this._updatePeerState(peerId);
  }

  _checkPeerHeartbeats(now = Date.now()) {
    if (this.disposed) return;
    for (const [peerId, state] of this.peerStates) {
      if (state !== "connected") continue;
      const channel = this.channels.get(peerId)?.control;
      if (channel?.readyState !== "open") {
        this._retryPeer(peerId);
        continue;
      }
      const lastSeen = this.peerHeartbeatAt.get(peerId) || now;
      if (now - lastSeen > this.peerTimeoutMs) {
        this.peerHeartbeatPending.delete(peerId);
        this._retryPeer(peerId);
        continue;
      }
      if (this.peerHeartbeatPending.has(peerId)) continue;
      const seq = ++this.peerHeartbeatSequence;
      try {
        channel.send(
          JSON.stringify({ kind: "__gamelink_peer_ping", payload: { seq } }),
        );
        this.peerHeartbeatPending.set(peerId, seq);
      } catch (error) {
        this._retryPeer(peerId);
        this._reportError(error);
      }
    }
  }

  _updatePeerState(peerId) {
    const connection = this.connections.get(peerId);
    if (!connection) return;
    const channels = this.channels.get(peerId);
    if (
      connection.connectionState === "connected" &&
      channels?.control?.readyState === "open" &&
      channels?.state?.readyState === "open"
    ) {
      clearTimeout(this.retryTimers.get(peerId));
      this.retryTimers.delete(peerId);
      this.retryAttempts.delete(peerId);
      const recovered = this.connectedOnce.has(peerId);
      const changed = this.peerStates.get(peerId) !== "connected";
      this.connectedOnce.add(peerId);
      this.peerHeartbeatAt.set(peerId, Date.now());
      this.peerHeartbeatPending.delete(peerId);
      this._setPeerState(peerId, "connected");
      if (changed)
        this._emit("peer-ready", {
          peerId,
          generation: this.generations.get(peerId),
          recovered,
        });
      this._updateIceAddresses(peerId, connection);
      this._logConnection(peerId, connection);
    } else if (
      connection.connectionState === "failed" ||
      connection.connectionState === "closed" ||
      connection.connectionState === "disconnected"
    ) {
      this._retryPeer(peerId);
    } else {
      this._setPeerState(
        peerId,
        this.retryAttempts.has(peerId) ? "reconnecting" : "connecting",
      );
      this._watchConnection(peerId);
    }
  }

  _watchConnection(peerId) {
    if (
      this.disposed ||
      !this.members.some((m) => m.id === peerId) ||
      this.peerStates.get(peerId) === "connected" ||
      this.retryTimers.has(peerId)
    )
      return;
    this.retryTimers.set(
      peerId,
      setTimeout(
        () => {
          this.retryTimers.delete(peerId);
          this._retryPeer(peerId);
        },
        [4000, 12000, 20000][this.networkStages.get(peerId) || 0],
      ),
    );
  }

  _retryPeer(peerId) {
    if (this.disposed || !this.members.some((m) => m.id === peerId)) return;
    // Replace the negotiation timeout once; repeated error events must not delay retry.
    if (
      this.peerStates.get(peerId) === "reconnecting" &&
      this.retryTimers.has(peerId)
    )
      return;
    clearTimeout(this.retryTimers.get(peerId));
    const attempt = (this.retryAttempts.get(peerId) || 0) + 1;
    this._traceStats(peerId, this.connections.get(peerId), "retry");
    this._trace("peer.retry", peerId, { attempt });
    this.retryAttempts.set(peerId, attempt);
    this._setPeerState(peerId, "reconnecting");
    const stage = this.networkStages.get(peerId) || 0;
    const delay =
      stage < 2
        ? 0
        : Math.min(30000, 1000 * 2 ** Math.min(attempt - 1, 5)) +
          Math.floor(Math.random() * 500);
    this.retryTimers.set(
      peerId,
      setTimeout(async () => {
        this.retryTimers.delete(peerId);
        if (this.disposed || !this.members.some((m) => m.id === peerId)) return;
        try {
          if (this.selfMember.id.localeCompare(peerId) < 0) {
            // Only the deterministic offerer rebuilds the pair, avoiding offer glare.
            const nextStage = Math.min(
              this.turnAvailable ? 2 : 1,
              (this.networkStages.get(peerId) || 0) + 1,
            );
            if (nextStage === 2) await this._loadTurnServers();
            if (this.disposed || !this.members.some((m) => m.id === peerId))
              return;
            this.networkStages.set(peerId, nextStage);
            await this._sendSignal(peerId, "webrtc_restart", {});
            if (this.disposed || !this.members.some((m) => m.id === peerId))
              return;
            const old = this.connections.get(peerId);
            this.connections.delete(peerId);
            this.peerTransports.delete(peerId);
            old?.close();
            this.channels.delete(peerId);
            this.pendingIce.delete(peerId);
            this.localIceAddresses.delete(peerId);
            this.remoteIceAddresses.delete(peerId);
            this._ensurePeerConnection(
              this.members.find((m) => m.id === peerId),
            );
          } else {
            await this._sendSignal(peerId, "webrtc_retry", {
              generation: this.generations.get(peerId) || 0,
            });
          }
        } catch (error) {
          this._reportError(error);
        }
        this._watchConnection(peerId);
      }, delay),
    );
  }

  _setPeerState(peerId, state) {
    this.peerStates.set(peerId, state);
    this._emitPeerState(peerId, state);
  }

  _emitPeerState(peerId, state) {
    this._emit("peer-state", {
      peerId,
      state,
      attempt: this.retryAttempts.get(peerId) || 0,
      generation: this.generations.get(peerId) || 0,
      localIce: this.localIceAddresses.get(peerId) || "",
      remoteIce: this.remoteIceAddresses.get(peerId) || "",
      networkStage: ["lan", "stun", "turn"][
        this.networkStages.get(peerId) || 0
      ],
      transport:
        state === "connected"
          ? this.peerTransports.get(peerId) ||
            (this.networkStages.get(peerId) === 2 ? "turn" : "p2p")
          : null,
    });
  }

  _rememberIceCandidate(map, peerId, line) {
    const match = line?.match(
      /candidate:\S+\s+\d+\s+(udp|tcp)\s+\d+\s+(\S+)\s+(\d+)\s+typ\s+(\S+)/i,
    );
    if (!match) return;
    const [, protocol, address, port, candidateType] = match;
    const endpoint = address.includes(":")
      ? `[${address}]:${port}`
      : `${address}:${port}`;
    const value = `${endpoint} · ${candidateType}/${protocol.toUpperCase()}`;
    const values = (map.get(peerId) || "").split(" / ").filter(Boolean);
    if (!values.includes(value))
      map.set(peerId, [...values, value].join(" / "));
  }

  async _updateIceAddresses(peerId, connection) {
    try {
      const stats = await connection.getStats();
      let pair;
      for (const report of stats.values()) {
        if (report.type === "transport" && report.selectedCandidatePairId) {
          pair = stats.get(report.selectedCandidatePairId);
          break;
        }
        if (
          report.type === "candidate-pair" &&
          (report.selected ||
            (report.nominated && report.state === "succeeded"))
        ) {
          if (!pair || report.selected) pair = report;
        }
      }
      if (
        !pair?.localCandidateId ||
        this.connections.get(peerId) !== connection
      )
        return;
      const local = stats.get(pair.localCandidateId);
      const remote = pair.remoteCandidateId
        ? stats.get(pair.remoteCandidateId)
        : null;
      this.peerTransports.set(
        peerId,
        local?.candidateType === "relay" || remote?.candidateType === "relay"
          ? "turn"
          : "p2p",
      );
      const format = (candidate) => {
        const address = candidate?.address || candidate?.ip;
        const port = candidate?.port;
        if (!address || !port) return "";
        const endpoint = String(address).includes(":")
          ? `[${address}]:${port}`
          : `${address}:${port}`;
        const protocol = candidate.protocol
          ? `/${String(candidate.protocol).toUpperCase()}`
          : "";
        return `${endpoint} · selected ${candidate.candidateType || "ice"}${protocol}`;
      };
      const localValue = format(local);
      const remoteValue = format(remote);
      if (localValue) this.localIceAddresses.set(peerId, localValue);
      if (remoteValue) this.remoteIceAddresses.set(peerId, remoteValue);
      this._emitPeerState(peerId, this.peerStates.get(peerId) || "connecting");
    } catch {
      // Some browsers restrict ICE candidate details in getStats().
    }
  }

  _logConnection(peerId, connection) {
    const channels = this.channels.get(peerId);
    if (
      this.loggedConnections.has(connection) ||
      connection.connectionState !== "connected" ||
      channels?.control?.readyState !== "open" ||
      channels?.state?.readyState !== "open"
    )
      return;
    this.loggedConnections.add(connection);
    this._traceStats(peerId, connection, "connected");
    this._updateIceAddresses(peerId, connection).then(() => {
      const remoteName =
        this.members.find((member) => member.id === peerId)?.name || peerId;
      console.info("[GameLink SDK] RTC connected", {
        localPeerId: this.selfMember?.id,
        remotePeerName: remoteName,
        remotePeerId: peerId,
        localIce:
          this.localIceAddresses.get(peerId) ||
          "browser did not expose candidate address",
      });
    });
  }

  async _loadTurnServers() {
    const configured = this.iceServers.filter((s) =>
      s.urls.some((url) => /^turns?:/i.test(url)),
    );
    if (configured.length) {
      this.turnServers = configured;
      this.turnExpiresAt = Infinity;
      return;
    }
    if (this.turnServers.length && Date.now() / 1000 < this.turnExpiresAt - 60)
      return;
    const result = await this._request(
      `/v1/rooms/${encodeURIComponent(this.room.code)}/turn`,
      "POST",
      { member_id: this.selfMember.id },
    );
    if (!Array.isArray(result.ice_servers) || !result.ice_servers.length)
      throw new Error("TURN credentials unavailable");
    this.turnServers = result.ice_servers
      .map((server) => ({
        ...server,
        urls: (Array.isArray(server.urls) ? server.urls : [server.urls]).filter(
          (url) => /^turns?:/i.test(url),
        ),
      }))
      .filter((server) => server.urls.length);
    if (!this.turnServers.length) throw new Error("No TURN URLs provided");
    this.turnExpiresAt = result.expires_at;
    this._trace("turn.credentials-ready", null, {
      expiresAt: result.expires_at,
    });
  }

  async _createOffer(peerId, connection) {
    try {
      this._trace("offer.create", peerId);
      await connection.setLocalDescription(await connection.createOffer());
      this._trace("offer.local-set", peerId);
      const description = connection.localDescription;
      if (this.disposed || this.connections.get(peerId) !== connection) return;
      if (description)
        await this._sendSignal(peerId, "webrtc_offer", {
          type: description.type,
          sdp: description.sdp,
          generation: this.generations.get(peerId),
          networkStage: this.networkStages.get(peerId) || 0,
        });
    } catch (error) {
      if (this.disposed || this.connections.get(peerId) !== connection) return;
      this._retryPeer(peerId);
      this._reportError(error);
    }
  }

  async _receiveSignal(signal) {
    if (
      this.disposed ||
      !signal.kind.startsWith("webrtc_") ||
      !this.members.some((m) => m.id === signal.from)
    )
      return;
    const member = this.members.find((entry) => entry.id === signal.from) || {
      id: signal.from,
      name: signal.from,
      virtual_ip: "",
      endpoint: "",
    };
    const peerId = signal.from;
    this._trace("signal.receive", peerId, {
      kind: signal.kind,
      receivedGeneration: signal.payload?.generation,
    });
    const offerer = this.selfMember.id.localeCompare(peerId) < 0;
    if (signal.kind === "webrtc_retry" || signal.kind === "webrtc_restart") {
      if (offerer) {
        const observed = signal.payload?.generation;
        if (
          signal.kind === "webrtc_retry" &&
          ((observed > 0 && observed < (this.generations.get(peerId) || 0)) ||
            (!observed && this.peerStates.get(peerId) === "connected"))
        )
          return;
        if (Number.isSafeInteger(observed) && observed > 0)
          this.lastGeneration = Math.max(this.lastGeneration, observed);
        this._retryPeer(peerId);
      }
      return;
    }
    const payload = { ...(signal.payload || {}) };
    const generation = payload.generation;
    const networkStage = payload.networkStage ?? 1;
    delete payload.generation;
    delete payload.networkStage;
    if (!Number.isSafeInteger(generation) || generation <= 0) return;
    const active = this.generations.get(peerId) || 0;
    if (generation < active) {
      this._trace("signal.ignore.stale", peerId, {
        receivedGeneration: generation,
      });
      return;
    }
    if (signal.kind === "webrtc_offer") {
      if (offerer || generation === active) return;
      if (![0, 1, 2].includes(networkStage)) return;
      if (networkStage === 2) await this._loadTurnServers();
      if (this.disposed) return;
      this.networkStages.set(peerId, networkStage);
      clearTimeout(this.retryTimers.get(peerId));
      this.retryTimers.delete(peerId);
      const old = this.connections.get(peerId);
      this.connections.delete(peerId);
      old?.close();
      this.channels.delete(peerId);
      this.pendingIce.delete(peerId);
      this.localIceAddresses.delete(peerId);
      this.remoteIceAddresses.delete(peerId);
      this._ensurePeerConnection(member, generation);
      const queued = this.futureIce.get(peerId);
      if (queued?.generation === generation)
        this.pendingIce.set(peerId, queued.candidates);
      this.futureIce.delete(peerId);
    } else if (generation !== active) {
      // ICE may overtake the offer because HTTP signal requests are independent.
      if (!offerer && signal.kind === "webrtc_ice" && payload.candidate) {
        let queued = this.futureIce.get(peerId);
        if (!queued || generation > queued.generation) {
          queued = { generation, candidates: [] };
          this.futureIce.set(peerId, queued);
        }
        if (queued.generation === generation && queued.candidates.length < 64)
          queued.candidates.push(payload);
      }
      return;
    }
    const connection = this.connections.get(peerId);
    if (!connection) return;
    const current = () =>
      !this.disposed && this.connections.get(peerId) === connection;
    try {
      if (signal.kind === "webrtc_offer") {
        await connection.setRemoteDescription(payload);
        this._trace("sdp.remote-set", peerId, { type: payload.type });
        if (!current()) return;
        await this._applyPendingIce(signal.from, connection);
        if (!current()) return;
        await connection.setLocalDescription(await connection.createAnswer());
        this._trace("answer.local-set", peerId);
        const description = connection.localDescription;
        if (current() && description)
          await this._sendSignal(signal.from, "webrtc_answer", {
            type: description.type,
            sdp: description.sdp,
            generation,
          });
      } else if (signal.kind === "webrtc_answer") {
        await connection.setRemoteDescription(payload);
        this._trace("sdp.remote-set", peerId, { type: payload.type });
        if (!current()) return;
        await this._applyPendingIce(signal.from, connection);
      } else if (signal.kind === "webrtc_ice") {
        if (payload.candidate)
          this._rememberIceCandidate(
            this.remoteIceAddresses,
            signal.from,
            payload.candidate,
          );
        if (payload.candidate && connection.remoteDescription) {
          await connection.addIceCandidate(payload);
          this._trace("ice.remote-applied", peerId, {
            candidates: this.remoteIceAddresses.get(peerId),
          });
        } else if (payload.candidate)
          this.pendingIce.set(signal.from, [
            ...(this.pendingIce.get(signal.from) || []),
            payload,
          ]);
      }
    } catch (error) {
      if (this.disposed || this.connections.get(signal.from) !== connection)
        return;
      this._retryPeer(signal.from);
      this._reportError(error);
      throw error;
    }
  }

  async _applyPendingIce(peerId, connection) {
    const candidates = this.pendingIce.get(peerId) || [];
    this.pendingIce.delete(peerId);
    for (const candidate of candidates)
      await connection.addIceCandidate(candidate);
    if (candidates.length)
      this._trace("ice.pending-applied", peerId, { count: candidates.length });
  }

  async _sendSignal(to, kind, payload) {
    if (this.disposed || !this.room || !this.selfMember)
      throw new Error("not connected to a room");
    this._trace("signal.send", to, {
      kind,
      sentGeneration: payload.generation,
    });
    await this._request(
      `/v1/rooms/${encodeURIComponent(this.room.code)}/signals`,
      "POST",
      {
        from: this.selfMember.id,
        to,
        kind,
        payload,
      },
    );
    this._trace("signal.sent", to, { kind });
  }

  async _request(path, method = "GET", payload, options = {}) {
    this._trace("http.send", null, {
      path,
      method,
      data: path.endsWith("/events") ? "[game data omitted]" : payload,
    });
    if (
      payload !== undefined &&
      this.memberToken &&
      payload.auth_token === undefined
    )
      payload = { ...payload, auth_token: this.memberToken };
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (options.signal?.aborted) abort();
    else options.signal?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(
      abort,
      options.timeoutMs || this.requestTimeoutMs,
    );
    try {
      const response = await fetch(`${this.serverUrl}${path}`, {
        method,
        signal: controller.signal,
        headers:
          payload === undefined
            ? undefined
            : { "Content-Type": "application/json" },
        body: payload === undefined ? undefined : JSON.stringify(payload),
      });
      const body = await response.json().catch(() => null);
      this._trace("http.receive", null, {
        path,
        method,
        status: response.status,
        data: path.endsWith("/events") ? "[game data omitted]" : body,
      });
      if (!response.ok) {
        const error = new Error(
          body?.error ||
            body?.message ||
            `GameLink request failed (${response.status})`,
        );
        error.status = response.status;
        throw error;
      }
      // Signaling and event endpoints acknowledge delivery with an empty 202.
      if (![202, 204].includes(response.status) && body === null)
        throw new Error("Invalid GameLink JSON response");
      return body;
    } catch (error) {
      this._trace("http.error", null, {
        path,
        method,
        status: error.status,
        name: error.name,
      });
      throw error;
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener("abort", abort);
    }
  }

  _reportError(reason) {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    this._trace("error", error.peerId, {
      name: error.name,
      code: error.code,
      status: error.status,
      message: error.message,
    });
    if (error.name === "GameLinkStunError" || /^STUN_/.test(error.code || ""))
      return;
    this._emit("error", error);
  }

  _emit(eventName, value) {
    for (const listener of this.listeners.get(eventName) || []) {
      try {
        listener(value);
      } catch (error) {
        console.error(`[GameLink SDK] ${eventName} listener failed`, error);
      }
    }
  }
}

export { DEFAULT_ICE_SERVERS };
