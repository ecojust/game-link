# Shared GameLink SDK Protocol — 1.2

## Room identity

Every room belongs to exactly one `game_id`. Create and join requests must include the same ID; the server rejects mismatched IDs with HTTP 409. IDs are stable ASCII identifiers, 1–64 characters using letters, digits, `.`, `_`, or `-`.

## Control plane

| Action | Request |
| --- | --- |
| List current rooms | `GET /v1/rooms` (returns room code, `game_id`, member count, and capacity only) |
| Create room | `POST /v1/rooms` with `{ game_id, player_name }` |
| Join room | `POST /v1/rooms/{code}/join` with `{ game_id, player_name }` |
| Read room | `GET /v1/rooms/{code}` |
| Heartbeat | `POST /v1/rooms/{code}/heartbeat` with `{ member_id, auth_token }` |
| Send targeted signal | `POST /v1/rooms/{code}/signals` with `{ from, to, kind, payload, auth_token }` |
| Receive signals/discover peers | `POST /v1/rooms/{code}/signals/poll` with `{ member_id, auth_token, ack_ids, revision, wait_ms }` |
| Broadcast lobby event | `POST /v1/rooms/{code}/events` with `{ from, kind, payload, auth_token }` |
| Leave | `POST /v1/rooms/{code}/leave` with `{ member_id, auth_token }` |

WebRTC setup messages use `webrtc_offer`, `webrtc_answer`, and `webrtc_ice` signal kinds. Game data should travel over WebRTC DataChannels after connection establishment. The current server queue fallback (`game_relay`) carries application messages over HTTP polling; it is not TURN and should be reported separately from a WebRTC relay candidate.

## Credentials, delivery and limits

`auth_token` is the private `resume_token` returned by create/join. Never use a public member ID as a credential. 1.1 clients must upgrade together with the 1.2 server.

Poll waits up to 15 seconds. Supply the response's `revision` on the next poll; changed membership wakes the poll. Each signal has an `id`. ACK successfully processed IDs using `ack_ids`; unacknowledged messages are returned again, so consumers must deduplicate. Signals expire after 60 seconds. SDK request timeouts are at least 20 seconds for long polling.

Limits: 4 members per room, 256 queued signals / 256 KiB per recipient, 64 KiB per signal, 96 KiB JSON request body. Members leaving or expiring clear both directions of their signaling queues. Newer WebRTC generations invalidate older queued messages for that peer pair.

## Data channels

Use two in-band channels with matching labels across all SDKs:

- `control`: ordered and reliable, for discrete events, chat, and commands.
- `state`: unordered and zero-retransmit where supported, for snapshots that will quickly be superseded.

Game payloads use JSON envelopes `{ "kind": string, "payload": any }`. SDKs do not impose a game-specific schema.
