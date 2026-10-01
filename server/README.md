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
| `POST` | `/v1/rooms/{code}/join` | `{"game_id":"tank-arena","player_name":"Bob","resume_token":"<optional uuid>"}` | Join only when `game_id` matches the room (maximum 16 members); a valid resume token restores the existing member |
| `GET` | `/v1/rooms/{code}` | — | Room and member snapshot, including `game_id` |
| `POST` | `/v1/rooms/{code}/heartbeat` | `{"member_id":"<uuid>"}` | Refresh liveness |
| `POST` | `/v1/rooms/{code}/signals` | `{"from":"<uuid>","to":"<uuid>","kind":"offer","payload":{...}}` | Queue a room-scoped signal |
| `POST` | `/v1/rooms/{code}/signals/poll` | `{"member_id":"<uuid>"}` | Drain signals, refresh liveness, and discover other members |
| `POST` | `/v1/rooms/{code}/events` | `{"from":"<uuid>","kind":"game_state","payload":{...}}` | Broadcast one game event to all other room members |
| `POST` | `/v1/rooms/{code}/leave` | `{"member_id":"<uuid>"}` | Leave; promote a new host or delete an empty room |

## Client integration

Create and join responses include a private `resume_token`. Keep it in per-tab session storage and send it on a later join request to restore the same member ID and host role after a page refresh. The server clears queued stale signals for that member during resume; clients should restart WebRTC negotiation with the room peers. The token is not included in public room or member listings.

The `game_web` browser client uses the JavaScript SDK with these room and signaling APIs. The tank and mini 4WD games use room events for readiness and match start, and the targeted signal queue exchanges WebRTC offer/answer/ICE data; game state then travels over WebRTC data channels. The current path uses STUN and has no TURN/relay fallback yet. The HTTP endpoint observed by this server is not a UDP NAT mapping; a future virtual-LAN UDP transport still needs UDP registration and an authenticated, quota-limited relay data plane.

## State and deployment

Rooms and pending signals are in process memory and clear on restart. The MVP has no account authentication, persistence, TLS termination, UDP discovery, or relay packet forwarding. Deploy behind HTTPS and add signed client sessions, request/payload limits, rate limits, and persistence or single-instance routing before public launch.

## 独立网页创建空房间

大厅向 `POST /v1/rooms` 传 `game_id`、`player_name`、`create_only: true`，只创建空房间并预留房主昵称，返回 `{ room: { id, code, game_id, host_id: null, members: [], host_username } }`，不生成玩家或交接凭证。游戏页向 join 接口提交相同昵称，服务端创建首位成员并设为房主。房主进入前其他昵称收到 409；两分钟内没有房主加入则过期并清理。此昵称预留没有身份认证能力。省略 `create_only` 保持原有创建并加入行为；旧 handoff 请求保留兼容，但新大厅不再使用。

`GAMELINK_ALLOWED_ORIGINS` 支持逗号分隔的允许来源，默认 `*`；服务端响应 CORS 预检，不使用 Cookie 凭证。静态 SDK 的跨域响应头需另行在网页服务器配置。
