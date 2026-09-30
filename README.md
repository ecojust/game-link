# GameLink

GameLink is a LAN-style multiplayer platform prototype with a separate room/signaling server and client SDKs for games. Every room is scoped to a stable `game_id`; clients with a different game ID cannot join it.

## Repository layout

- [`server/`](server/README.md): Rust/Axum room, membership, liveness, and signaling API.
- [`game/`](game/README.md): Tauri 2 multiplayer tank arena.
- [`game_web/`](game_web/README.md): browser version of the multiplayer tank arena, integrated with the shared JavaScript SDK.
- [`sdk/`](sdk/README.md): JavaScript, Godot 4, and Rust SDKs; the JavaScript SDK currently powers `game_web`.

## Start the server

```sh
cd server
cargo run --release
```

It listens on `0.0.0.0:8080`. Override this with `GAMELINK_BIND`, for example `127.0.0.1:8080` for local testing.

## Deployed server

The current instance is deployed at `/home/b14f/gamelink` and is managed by `gamelink-server.service`. Nginx listens on public port 8088 and forwards to the service on loopback port 8089. Set the local `VITE_API_TARGET` in the ignored root `.env.local` to point clients at the server. The current prototype endpoint uses HTTP and has no user authentication or persistent room storage.

## Start the browser game

```sh
cd game_web
npm install
npm run dev
```

Open `http://127.0.0.1:1431`. The browser game shares the desktop game's room and WebRTC P2P gameplay flow. See [`game_web/README.md`](game_web/README.md) for production build and same-origin HTTPS deployment notes.

## Current boundaries

Rooms/signals live in server memory and disappear on restart. The MVP has no account authentication or persistent database. Put the server behind HTTPS before exposing it publicly. The server observes the control-plane TCP endpoint; clients must register their game UDP socket with a future UDP discovery endpoint before attempting NAT traversal.
