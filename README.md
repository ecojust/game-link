<p align="center"><img src="game_web/public/gamelink-logo-readme.svg" alt="GameLink" width="600"></p>

GameLink is a multiplayer room and signaling service with browser game demos and client SDKs. Rooms are scoped by a stable `game_id`, so players can only join a room for the same game.

Gameplay uses WebRTC peer-to-peer (P2P) DataChannels when a direct connection succeeds. The server handles rooms, presence, and WebRTC signaling. SDKs may use the server's queued HTTP message fallback when supported; this is not a TURN service or a general UDP relay. GameLink does not create a virtual LAN, so games need to integrate an SDK or provide their own compatible network layer.

## Games

| Game ID       | Game                                                    | Players |
| ------------- | ------------------------------------------------------- | ------- |
| `tank-arena`  | Multiplayer tank arena                                  | 2–16    |
| `fc-mini-4wd` | FC-inspired multiplayer Mini 4WD racing, **激斗四驱车** | 2–16    |

The browser hub lists active rooms with their game name, game ID, and player count, and lets players create or join a game-specific room. New players can join while a match is running.

## Repository layout

- [`server/`](server/README.md): Rust/Axum room, member presence, signaling, and game-event API.
- [`game_web/`](game_web/README.md): Vue/Vite browser game hub and games. Branding assets are in [`game_web/public/`](game_web/public/), including the SVG logo, high-resolution PNG, and browser favicon.
- [`sdk/`](sdk/README.md): shared protocol and SDKs for JavaScript/TypeScript, Godot 4, and Rust.

## Run locally

Requirements: Rust stable with Cargo, Node.js, and npm.

### Start the server

```sh
cd server
cargo run --release
```

By default, the server listens on `0.0.0.0:8080`. Set `GAMELINK_BIND` to change the address, for example `GAMELINK_BIND=127.0.0.1:8080` for local-only access.

### Start the browser games

In another terminal:

```sh
cd game_web
npm install
npm run dev
```

Open <http://127.0.0.1:1431>. The Vite development server proxies `/v1` requests to `http://127.0.0.1:8088` by default. To use another API target, set `VITE_API_TARGET` in the ignored repository-root `.env.local` file:

```env
VITE_API_TARGET=https://your-game-link-host
```

Do not commit `.env.local`; it is excluded by `.gitignore`. For production, serve the built static files from `game_web/dist/` over HTTPS and route `/v1` to the GameLink server on the same origin.

The production site is written to `game_web/dist/`.

## Room and signaling API

The complete request and message contract is in [`sdk/PROTOCOL.md`](sdk/PROTOCOL.md). Common endpoints include:

| Method | Path                            | Purpose                                                     |
| ------ | ------------------------------- | ----------------------------------------------------------- |
| `GET`  | `/healthz`                      | Server health                                               |
| `GET`  | `/v1/rooms`                     | Public room list: code, game ID, player count, and capacity |
| `POST` | `/v1/rooms`                     | Create a room with a `game_id` and player name              |
| `POST` | `/v1/rooms/{code}/join`         | Join a room when its `game_id` matches                      |
| `GET`  | `/v1/rooms/{code}`              | Read room and member state                                  |
| `POST` | `/v1/rooms/{code}/signals`      | Queue WebRTC offer, answer, or ICE signaling                |
| `POST` | `/v1/rooms/{code}/signals/poll` | Refresh presence, discover members, and receive signaling   |

The public room list omits player identities and network endpoints. The server supports up to 16 members per room. Each game must use a stable, unique `game_id`.

## SDKs

The JavaScript SDK is used by `game_web`. Godot and Rust SDKs implement the shared room and peer-messaging contract; see their individual setup notes in [`sdk/README.md`](sdk/README.md). The SDK handles room membership, member discovery, heartbeats, ICE negotiation, and message transport. Games define their own message types and payloads.
