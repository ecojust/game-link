# GameLink Server

The server is the room and signaling control plane. It creates rooms, assigns room-local virtual IPv4 addresses, exchanges client signaling messages, and removes members that stop heartbeating. Its observed endpoint is the HTTP/TCP peer endpoint and must not be used as a UDP NAT mapping.

This is not a VPN or packet forwarder. UDP relay is reserved as a capability boundary and currently reports unavailable.

## Run

Requirements: Rust stable and Cargo.

```sh
cargo run --release
```

Default listen address is `0.0.0.0:8080`.

| Variable | Default | Meaning |
| --- | --- | --- |
| `GAMELINK_BIND` | `0.0.0.0:8080` | HTTP listen address |
| `GAMELINK_HEARTBEAT_TIMEOUT_SECS` | `30` | Remove a member after this many seconds without heartbeat or signaling poll |
| `RUST_LOG` | crate default | `tracing` filter, e.g. `info` |

## HTTP API (JSON)

Room codes are case-insensitive. `game_id` is required on create and join, uses 1–64 ASCII letters, digits, `.`, `_` or `-`, and is returned in room snapshots. Joining with a different ID returns HTTP 409. IDs are UUIDs. Errors have shape `{"error":"..."}`.

| Method | Path | Request | Result |
| --- | --- | --- | --- |
| `GET` | `/healthz` | — | Health status |
| `GET` | `/v1/rooms` | — | List public room summaries (`code`, `game_id`, member count and capacity); does not expose member identities or endpoints |
| `POST` | `/v1/rooms` | `{"game_id":"tank-arena","player_name":"Alice"}` | Create a game-scoped room; creator is host and first member |
| `POST` | `/v1/rooms/{code}/join` | `{"game_id":"tank-arena","player_name":"Bob"}` | Join only when `game_id` matches the room (maximum 16 members) |
| `GET` | `/v1/rooms/{code}` | — | Room and member snapshot, including `game_id` |
| `POST` | `/v1/rooms/{code}/heartbeat` | `{"member_id":"<uuid>"}` | Refresh liveness |
| `POST` | `/v1/rooms/{code}/signals` | `{"from":"<uuid>","to":"<uuid>","kind":"offer","payload":{...}}` | Queue a room-scoped signal |
| `POST` | `/v1/rooms/{code}/signals/poll` | `{"member_id":"<uuid>"}` | Drain signals, refresh liveness, and discover other members |
| `POST` | `/v1/rooms/{code}/events` | `{"from":"<uuid>","kind":"game_state","payload":{...}}` | Broadcast one game event to all other room members |
| `POST` | `/v1/rooms/{code}/leave` | `{"member_id":"<uuid>"}` | Leave; promote a new host or delete an empty room |

## Client integration

The `game_web` browser client uses the JavaScript SDK with these room and signaling APIs. The tank and mini 4WD games use room events for readiness and match start, and the targeted signal queue exchanges WebRTC offer/answer/ICE data; game state then travels over WebRTC data channels. The current path uses STUN and has no TURN/relay fallback yet. The HTTP endpoint observed by this server is not a UDP NAT mapping; a future virtual-LAN UDP transport still needs UDP registration and an authenticated, quota-limited relay data plane.

## State and deployment

Rooms and pending signals are in process memory and clear on restart. The MVP has no account authentication, persistence, TLS termination, UDP discovery, or relay packet forwarding. Deploy behind HTTPS and add signed client sessions, request/payload limits, rate limits, and persistence or single-instance routing before public launch.
