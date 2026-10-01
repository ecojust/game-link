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

After a successful create or join, the SDK keeps the server-issued room resume token in this browser tab's `sessionStorage`. Calling `joinRoom` again for that room reuses the same member identity; a resumed client also asks peers to restart WebRTC negotiation. This lets a page refresh recover the room and its peer connections without adding another member. The token is not included in public room/member listings. Clearing the tab's session data, or opening the room link in a browser context without that token, creates a normal new membership.

## 独立游戏网页接入

平台跳转统一使用 `gameid`、`room`、`username` 三个查询参数。游戏端调用 `GameLinkClient.fromLocation(options)`，注册事件后 `await client.joinFromLocation()`。默认 API 地址为 SDK 模块所在域名，可用 `serverUrl` 显式覆盖。

大厅使用 `await client.createLaunchUrl(entryUrl)`，通过 `create_only: true` 仅创建空房间并预留房主昵称，不创建玩家、不启动连接。返回地址仅包含 `gameid`、`room`、`username`，没有交接 fragment。游戏端 `joinFromLocation()` 正式加入后成为房主；房主进入前其他昵称暂不能加入，空房间两分钟过期。昵称不是身份凭证。刷新凭证留在 sessionStorage，主动 leave 清除。传统 `createRoom()` 仍保留创建并加入的行为，兼容直接由游戏发起的开局。
