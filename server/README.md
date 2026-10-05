# GameLink 1.2 Server

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
| `POST` | `/v1/rooms` | `{"game_id":"tank-arena","player_name":"Alice"}` | Create a game-scoped room; creator joins as an equal member |
| `POST` | `/v1/rooms/{code}/join` | `{"game_id":"tank-arena","player_name":"Bob","resume_token":"<optional uuid>"}` | Join only when `game_id` matches the room (maximum 4 members); a valid resume token restores the existing member |
| `GET` | `/v1/rooms/{code}` | — | Room and member snapshot, including `game_id` |
| `POST` | `/v1/rooms/{code}/heartbeat` | `{"member_id":"<uuid>","auth_token":"<resume_token>"}` | Refresh liveness |
| `POST` | `/v1/rooms/{code}/signals` | `{"from":"<uuid>","to":"<uuid>","kind":"webrtc_offer","payload":{...},"auth_token":"<resume_token>"}` | Queue a room-scoped signal |
| `POST` | `/v1/rooms/{code}/signals/poll` | `{"member_id":"<uuid>","auth_token":"<resume_token>"}` | Long-poll signals, acknowledge processed IDs, refresh liveness, and discover other members; supports ack_ids/revision/wait_ms |
| `POST` | `/v1/rooms/{code}/events` | `{"from":"<uuid>","kind":"game_state","payload":{...},"auth_token":"<resume_token>"}` | Broadcast one game event to all other room members |
| `POST` | `/v1/rooms/{code}/leave` | `{"member_id":"<uuid>","auth_token":"<resume_token>"}` | Leave; delete the room when it has no members |

## Client integration

Create and join responses include a private `resume_token`. Keep it in per-tab session storage and send it on a later join request to restore the same member ID after a page refresh. The server clears queued stale signals for that member during resume; clients should restart WebRTC negotiation with the room peers. The token is not included in public room or member listings.

The `game_web` browser client uses the JavaScript SDK with these room and signaling APIs. The tank and mini 4WD games use room events for readiness and match start; no player is assigned host authority, and the targeted signal queue exchanges WebRTC offer/answer/ICE data; all players have equal standing and game state travels only over WebRTC data channels. The current path uses STUN and has no TURN/relay fallback yet. The HTTP endpoint observed by this server is not a UDP NAT mapping; a future virtual-LAN UDP transport still needs UDP registration and an authenticated, quota-limited relay data plane.

## State and deployment

Rooms and pending signals are in process memory and clear on restart. Version 1.2 authenticates member operations with private tokens and bounds signaling payloads/queues. It has no account system, persistence, TLS termination, per-IP rate limiting, UDP discovery, or relay forwarding. Deploy behind HTTPS with single-instance routing; proxy read timeout must exceed 20 seconds.

## 当前生产服务

生产环境的 systemd unit 名为 `gamelink-server`，程序位于 `/home/b14f/gamelink/target/release/gamelink-server`，仅监听 `127.0.0.1:8089`；Nginx 在 `8088` 接收 API 流量并转发到该服务。发布新版本后执行 `systemctl restart gamelink-server`，再检查 `http://127.0.0.1:8089/healthz`。

## 独立网页创建空房间

大厅向 `POST /v1/rooms` 传 `game_id`、`player_name`、`create_only: true`，只创建没有玩家归属的空房间，返回 `{ room: { id, code, game_id, members: [] } }`，不生成玩家或交接凭证。任何玩家都可以用对应 `game_id` 和自己的昵称加入；首位加入者不获得额外权限。两分钟内仍为空的房间会过期并清理。省略 `create_only` 保持原有创建并加入行为；旧 handoff 请求保留兼容，但新大厅不再使用。

`GAMELINK_ALLOWED_ORIGINS` 支持逗号分隔的允许来源，默认 `*`；服务端响应 CORS 预检，不使用 Cookie 凭证。静态 SDK 的跨域响应头需另行在网页服务器配置。

## 1.2 信令机制

采用按房间独立锁、15 秒长轮询、信令 UUID 去重与 ACK 删除。单条 64 KiB，收件队列 256 条 / 256 KiB，60 秒过期，JSON 请求体 96 KiB。详情与升级步骤见 [版本记录](../RELEASE.md)。
