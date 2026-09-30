# GameLink SDKs

All SDKs implement the shared room/signaling contract in [PROTOCOL.md](PROTOCOL.md). A room is scoped to one stable `game_id`. Game traffic uses peer-to-peer WebRTC DataChannels; the current server's HTTP queue is an application-message fallback and is not a TURN server.

| Runtime | Directory | Transport | Status |
| --- | --- | --- | --- |
| Browser JavaScript / TypeScript | [js](js/README.md) | Browser WebRTC | Implemented; used by `game_web` |
| Godot 4 / GDScript | [godot](godot/README.md) | Godot WebRTC DataChannels | Implemented; target needs WebRTC extension support |
| Native Rust | [rust](rust/README.md) | `webrtc-rs` DataChannels | Implemented |

Each SDK supports create/join/leave, member discovery, heartbeat, WebRTC offer/answer/ICE exchange, lobby events, typed JSON messages, and the common `control` (reliable) / `state` (unreliable where supported) channel labels. A game remains responsible for its own message kinds and payload schema.

## Shared message contract

Reliable messages are sent on `control`; rapidly replaced state snapshots can use `state`. Both carry UTF-8 JSON:

```json
{"kind":"player_state","payload":{"x":120,"y":64}}
```

Connect the SDK's room/member/peer/message callbacks to the game's UI and simulation. Send only state changes the game needs to replicate. See each runtime README for a minimal setup example and platform notes.
