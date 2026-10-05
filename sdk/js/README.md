# GameLink JavaScript SDK

A browser-first JavaScript SDK for GameLink room membership, WebRTC signaling, peer discovery, and game messages. It supports game-scoped rooms and sends each peer message over WebRTC DataChannels whenever the peer connection is open. Game messages use direct P2P only. Failed connections are retried continuously; no HTTP fallback or TURN candidates are used.

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

`broadcast` now uses reliable P2P DataChannels, just like `send` to all peers. `send` uses WebRTC DataChannels and can target a peer with `{ target: peerId }`; unreliable messages use the unordered state channel, while reliable messages use the control channel. The SDK manages create/join, room refresh, member discovery, heartbeat, SDP/ICE exchange, connection cleanup, and automatic P2P reconnection.

The browser SDK requires a secure context (HTTPS or localhost) and browser WebRTC support. `gameId` is required and must match the ID used to create the room. Native games need a platform-specific SDK and transport integration; this browser package does not create a virtual network adapter.

After a successful create or join, the SDK keeps the server-issued room resume token in this browser tab's `sessionStorage`. Calling `joinRoom` again for that room reuses the same member identity; a resumed client also asks peers to restart WebRTC negotiation. This lets a page refresh recover the room and its peer connections without adding another member. The token is not included in public room/member listings. Clearing the tab's session data, or opening the room link in a browser context without that token, creates a normal new membership.

## 独立游戏网页接入

平台跳转统一使用 `gameid`、`room`、`username` 三个查询参数。游戏端调用 `GameLinkClient.fromLocation(options)`，注册事件后 `await client.joinFromLocation()`。默认 API 地址为 SDK 模块所在域名，可用 `serverUrl` 显式覆盖。

大厅使用 `await client.createLaunchUrl(entryUrl)`，通过 `create_only: true` 创建没有玩家归属的空房间，不创建玩家、不启动连接。返回地址仅包含 `gameid`、`room`、`username`，没有交接 fragment。游戏端 `joinFromLocation()` 加入后，各玩家在游戏协议中平等；服务端不分配房主，也不授予首位加入者额外权限。空房间两分钟过期。游戏消息只通过 WebRTC DataChannel 在玩家间直传；HTTP 接口负责房间、心跳和建连信令，不转发游戏消息。昵称不是身份凭证。刷新凭证留在 sessionStorage，主动 leave 清除。传统 `createRoom()` 仍保留创建并加入的行为，兼容直接由游戏发起的开局。

## P2P-only 重连

本版本只允许 JS SDK 的游戏消息通过 P2P DataChannel 发送，`broadcast` 也不再调用服务器 events API。服务器仍负责房间、成员、心跳以及 SDP/ICE 信令。传入的 TURN URL 与对端 relay 候选会被过滤，旧客户端的服务器游戏转发消息会被忽略。

协商 15 秒未完成或连接/通道失败会重试，以 1、2、4、8、16、30 秒的上限退避并加少量随机延迟；只由固定的一方重建连接并发起 offer，另一方请求重连。成功后重置退避，离开和销毁时清理定时器。状态为 `connecting`、`reconnecting`、`connected`、`closed`。双方都应更新 SDK。

未连通时不缓存游戏消息；`send` 会对每个不可用的目标触发 `delivery-skipped`（peerId、kind、reason）。游戏应在 `connected` 事件后重新发送当前快照。可靠通道只保证已建立连接内的传输，不保证断线期间的事件送达。某些 NAT/防火墙无法直接互通，持续重试不保证最终成功。

### 重连与游戏状态恢复

双方必须使用同一版 SDK。Offer、Answer、ICE 携带 `generation`，由固定发起方生成递增批次；旧批次和无批次信令被丢弃。先于 Offer 到达的 ICE 按批次缓存，最多 64 条。新连接替代旧连接后，旧连接的回调不再交付消息。

`peer-state` 新增 `attempt` 和 `generation`。新增 `peer-ready` 事件，在首次连接或断线恢复时触发一次（ICE 地址更新不会重复触发）：

```js
client.on('peer-ready', ({ peerId, recovered, generation }) => {
  // 无论首次连接还是恢复，都通过可靠通道发送最新完整状态。
  client.send('snapshot', currentState(), { target: peerId, reliability: 'reliable' })
  client.send('snapshot-request', {}, { target: peerId, reliability: 'reliable' })
})
```

SDK 不理解游戏状态，完整快照的授权、版本检查和应用由游戏实现。不要重放断线期间的攻击等一次性操作。坦克会暂停战斗并交换玩家状态和准备状态；四驱车停止断线玩家输入，恢复后从任一在线玩家接收世界快照并重置输入序号检查。游戏逻辑不依赖某位玩家持续处于前台。

普通 HTTP 请求默认 8 秒超时，长轮询至少 20 秒；可用 `requestTimeoutMs` 配置，避免信令网络黑洞永久占用轮询。超过服务端成员保留时间后，需要重新加入房间。

### 故障测试

```sh
node --test sdk/js/gamelink.test.mjs
npm run build --prefix game_web
# 启动本地服务端（可用 API_URL 指定已有的测试服务端）
GAMELINK_BIND=127.0.0.1:18088 GAMELINK_HEARTBEAT_TIMEOUT_SECS=120 cargo run --manifest-path server/Cargo.toml
# 另一个终端，需可导入 playwright 及可用的 Chromium
node sdk/js/tests/browser-network.mjs
```

浏览器脚本支持 `PLAYWRIGHT_MODULE`（外部 playwright 包的绝对路径）和 `CHROME_PATH`（Chrome 可执行文件路径）。测试启动临时静态站点，用两个浏览器上下文运行实际游戏，关闭 RTC 连接并阻断 HTTP 后恢复，检查旧 ICE 丢弃、页面提示及刷新后的同步。此故障注入不等价于跨运营商 NAT、真实 UDP 丢包或手机切网验证。


### 房间成员、ICE 与 P2P 心跳

`joinRoom` 返回的 `room.members`、`members` 事件，以及每次 `/signals/poll` 返回的 `members` 都是房间当前其他成员数组；`selfMember` 是本机成员。服务端已有成员汇总和超时清理，无需新增 ICE 汇总接口。成员上的 `endpoint` 是服务端看到的 HTTP 传输端点，不是 ICE 地址。ICE 候选和选中的 ICE 地址由每一对浏览器各自协商，并通过 `peer-state.localIce` / `remoteIce` 提供；它们不是可由服务器准确汇总后供所有客户端复用的公共地址。

JS SDK 已在 `control` DataChannel 上增加内部 P2P ping/pong：默认每 4 秒探测，12 秒没有收到该 peer 的任何 P2P 数据则转为重连状态。`send()` 和 `broadcast()` 只向 SDK 标记为 `connected` 且通道打开的 peer 发游戏数据；其他 peer 触发 `delivery-skipped`，状态恢复后游戏通过 `peer-ready` 发送新快照。可用 `peerHeartbeatIntervalMs` 和 `peerTimeoutMs` 配置阈值。该心跳不经过服务器。服务器侧 HTTP 心跳仍独立维护房间成员存在状态。

## 1.2 协议升级

服务端和 SDK 必须同步升级。创建/加入返回的 resume_token 用作成员操作的 auth_token。收信采用最长 15 秒长轮询，请求超时 20 秒；成员列表随轮询更新。信令按 UUID 去重，成功处理后通过下一轮 poll 的 ack_ids 确认删除；断网未收到的消息会重发，60 秒后过期。每房间人数上限 4。JS/Godot 默认关闭单独定时刷新房间，显式刷新仍保留。服务重启清空内存房间。

### STUN 诊断

SDK 监听浏览器 `icecandidateerror`，将失败服务 URL、浏览器错误码、原因和对端 ID 通过 `stun-status` 事件返回。收到 `srflx` 公网候选时状态为 `available`；收集结束后，没有公网候选且所有配置服务都有失败记录时为 `failed`，否则为 `unconfirmed`（不能仅根据缺少公网候选断言服务不可达）。

失败同时通过现有 `error` 事件显示中文提示，所有游戏无需另接错误 UI。错误名称 `GameLinkStunError`，`code` 分别为 `STUN_SERVER_ERROR`、`STUN_ALL_FAILED`、`STUN_NO_PUBLIC_CANDIDATE`、`STUN_TIMEOUT`。10 秒内无公网候选时提示检测超时（不将超时等同于服务不可达），避免连接重试在浏览器报告错误之前重建连接而长期没有提示。同类同地址提示在 60 秒内去重，避免多对端与持续重试刷屏。失败提示不会中止局域网直连，也不代表某个服务失败就必然无法联机。STUN 请求由玩家浏览器发起，服务端无法替玩家网络判断可达性。不同浏览器的错误事件支持和报告时机可能不同。

### 默认 STUN 地址

参照[国内可访问的 STUN 服务器](https://zhuanlan.zhihu.com/p/1928418712958010287)的地址列表，新增 `stun.miwifi.com:3478`、`stun.antisip.com:3478`、`stun.linphone.org:3478`、`stun.zadarma.com:3478`，保留 Google `stun.l.google.com:19302` 与 Cloudflare `stun.cloudflare.com:3478`，共六个默认服务。浏览器 ICE 会收集这些服务的候选，选择能连通的候选；不是按数组顺序逐个尝试。

文章记录的是作者 2025-07-15 的网络验证结果，不代表当前所有运营商网络都可达。SDK 保留逐地址失败、全部失败和超时诊断；调用者仍可通过 `iceServers` 覆盖默认列表。没有增加 TURN 中继。独立游戏入口与 SDK 导入的缓存参数随文件内容变化，保证发布新配置后浏览器获取新版本。
