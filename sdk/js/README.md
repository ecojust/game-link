# GameLink JavaScript SDK

A browser-first JavaScript SDK for GameLink room membership, WebRTC signaling, peer discovery, and game messages. It supports game-scoped rooms and sends each peer message over WebRTC DataChannels whenever the peer connection is open. When direct ICE fails, the current server signaling queue can carry messages as a limited HTTP fallback; this is not a TURN relay.

## Use from this repository

```ts
import { GameLinkClient } from '../../sdk/js/gamelink.js'

const game = new GameLinkClient({
  serverUrl: '', // same-origin; the web dev server proxies /v1
  gameId: 'your-stable-game-id',
  playerName: 'Player',
})

game.on('message', ({ from, kind, payload }) => {
  // Apply your own game protocol.
})
game.on('peer-state', ({ peerId, state, localIce, remoteIce }) => {
  // Update your lobby/network UI.
})

game.on('error', (error) => console.error(error))
const { room, self_member } = await game.createRoom()
// Or: await game.joinRoom('ABC123')

game.broadcast('match-started', { seed: 123 })
game.send('player-state', { x: 10, y: 20 }, { reliability: 'unreliable' })
game.send('chat', { text: 'hello' }, { reliability: 'reliable' })

await game.leave()
```

`broadcast` uses the room signaling/event API and is suited to small, infrequent lobby events. `send` uses WebRTC DataChannels and can target a peer with `{ target: peerId }`; unreliable messages use the unordered state channel, while reliable messages use the control channel. The SDK manages create/join, room refresh, member discovery, heartbeat, SDP/ICE exchange, connection cleanup, and the current server-forwarding fallback.

The browser SDK requires a secure context (HTTPS or localhost) and browser WebRTC support. `gameId` is required and must match the ID used to create the room. Native games need a platform-specific SDK and transport integration; this browser package does not create a virtual network adapter.
