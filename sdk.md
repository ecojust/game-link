# GameLink SDK — 当前功能说明（1.3.0）

本文只描述当前代码的客户端功能；版本变化见 [releasenote.md](releasenote.md)，服务部署见 [server.md](server.md)。这里的 1.3.0 是项目当前功能版本；JS 和 Rust 包清单目前仍标记为 1.2.0，不代表已经发布同名的 1.3.0 包。

## 支持范围

| 客户端 | 实现与接入文档 | 当前能力与限制 |
| --- | --- | --- |
| 浏览器 JavaScript / TypeScript | [实现](sdk/js/gamelink.js)、[类型](sdk/js/gamelink.d.ts) | 房间、信令、WebRTC、分级 STUN/TURN、实时诊断接口；需要 HTTPS 或 localhost 和浏览器 WebRTC 支持 |
| Godot 4 | [平台说明](sdk/godot/README.md) | 房间、信令和 WebRTC 消息；目标平台需要 WebRTC 扩展支持 |
| Rust | [平台说明](sdk/rust/README.md) | 房间、信令及 webrtc-rs DataChannel 消息 |

下述分级回退、日志和弹窗接口描述浏览器 JS SDK；不要将这些能力默认视为其他语言 SDK 已实现。SDK 不创建虚拟网卡，游戏需定义自己的消息协议。

## 连接策略

当前浏览器 JavaScript SDK 对每一对玩家分别采用 **P2P 优先 → STUN 辅助直连 → TURN 兜底**。STUN 阶段仍然是 P2P，不经过服务器转发游戏数据。

| 顺序 | 方式 | 游戏数据路径 | 默认连接窗口 |
| --- | --- | --- | --- |
| 1 | 直接 P2P：仅使用本地 ICE 候选地址 | 玩家之间直连，优先尝试局域网等可直接访问的地址 | 4 秒 |
| 2 | STUN：发现 NAT 映射后的公网地址，再尝试 P2P | 玩家之间直连；STUN 只协助发现地址 | 12 秒 |
| 3 | TURN：获取临时凭证，强制使用中继候选 | 经 TURN 转发加密的 WebRTC 数据 | 20 秒，失败后退避重试 |

信令服务在所有阶段交换 offer、answer、ICE 和重连通知；游戏状态仍由客户端维护。同一房间的不同玩家连接可以使用不同路径。TURN 兜底需要服务可用、凭证有效且网络放行；若 TURN 不可用，SDK 继续重试 STUN 直连。


服务端 `/network` 返回默认 STUN 配置与 TURN 可用状态；进入中继阶段时通过 `/turn` 获取临时凭证。可用 `iceServers` 显式覆盖默认配置。应用可根据每个对端的 `networkStage` 和 `transport` 显示连接中、重连中、P2P 或 TURN，连接建立前不要显示为已连通。

分级回退需要客户端使用当前 SDK，并配套部署支持上述接口的服务端及 TURN 网络规则；更新服务端本身不会给旧客户端增加回退能力。

## 浏览器接入

直接引用当前仓库的 `sdk/js/gamelink.js`，或使用包含当前源码的 `@gamelink/sdk-js` 本地包：

```js
import { GameLinkClient } from '@gamelink/sdk-js'

const client = new GameLinkClient({
  serverUrl: '', // 同源 /v1；也可设置完整 API 地址
  gameId: 'your-game-id',
  playerName: 'Player',
})
client.on('message', ({ from, kind, payload }) => {
  // 应用游戏消息。
})
client.on('error', error => console.error(error))
await client.createRoom() // 或 await client.joinRoom('ABC123')
client.send('player-state', { x: 10, y: 20 }, { reliability: 'unreliable' })
client.send('chat', { text: 'hello' }, { reliability: 'reliable' })
// 退出时：await client.leave()
```

`gameId` 必须与房间一致，房间最多 4 人，所有玩家地位平等。`createRoom()` 创建并加入；`createLaunchUrl(entryUrl)` 创建两分钟有效的空房间，生成包含 `gameid`、`room`、`username` 的游戏入口。游戏入口使用 `GameLinkClient.fromLocation(options)` 和 `joinFromLocation()` 加入。

`serverUrl: ''` 显式选择同源；省略时默认使用 SDK 模块所在域名。跨域 API 需按部署环境配置。恢复凭证保存在当前浏览器标签页的 `sessionStorage`，刷新后可恢复成员；主动退出清除自己的凭证。昵称不是认证凭证。

## 消息与重连

- `send(kind, payload, { target, reliability })` 可指定对端；不传 `target` 时发给其他玩家。`broadcast` 使用可靠 DataChannel，不使用 HTTP `/events` 转发。
- `control` 是可靠通道，`state` 为无序、不可靠通道；消息为 JSON `{ kind, payload }`，游戏自行定义字段和状态同步规则。
- 成员操作携带私有 `auth_token`；信令最长 15 秒长轮询，按 UUID 去重并通过 `ack_ids` 确认，60 秒过期。普通请求默认超时 8 秒，长轮询至少 20 秒。
- 每对玩家使用协商批次 `generation`，丢弃旧批次信令；重连采用退避，由固定一方重新发起协商，避免双方同时重建。
- 未连通时不缓存游戏消息；不可用目标触发 `delivery-skipped`。重新连通后应用负责交换完整状态，可靠通道不保证断线期间的事件送达。
- P2P 心跳默认每 4 秒探测；12 秒未收到对端数据则重连。服务端成员心跳与此独立，房间在线不等于玩家间已连通。

```js
client.on('peer-ready', ({ peerId }) => {
  client.send('snapshot', currentState(), {
    target: peerId,
    reliability: 'reliable',
  })
})
```

SDK 不理解游戏状态，应用负责快照授权、版本校验和应用；服务端持久化房间身份不等于恢复比赛状态。

## 连接状态与诊断

`peer-state` 返回 `state`（connecting / reconnecting / connected / closed）、`attempt`、`generation`、`networkStage`（lan / stun / turn）、`transport`（p2p / turn / null）和选中的本地、远端 ICE 地址。成员的 HTTP `endpoint` 不是 ICE 地址。

`stun-status` 提供候选发现及错误信息：available / server-error / failed / unconfirmed；未发现公网候选不能直接证明服务不可达，STUN 可用也不等于 P2P 已连接。诊断进入事件和日志，应用自行决定提示方式。`debug: true` 可记录调用诊断接口之前的日志；控制台可筛选 `[GameLink RTC]`。

## 日志与玩家连接接口

SDK 不自动注入应用的顶部按钮。应用自行绘制“日志”和“玩家连接”入口，再调用 `getLogs(options)` / `getConnections(options)`。两个接口都有两种模式：

- `type: 'dialog'` 或省略 `type`：打开 SDK 默认弹窗，返回实时数据句柄。
- `type: 'data'`：只返回实时数据句柄，不创建任何元素、不访问 DOM，应用可以完全自定义展示。

### 默认弹窗

```js
// 在应用自己的按钮事件里调用。
const logs = client.getLogs() // 等价于 { type: 'dialog' }
const connections = client.getConnections({ type: 'dialog', maxMembers: 4 })

// 也可由应用主动关闭；弹窗支持关闭按钮、Esc 和点击外侧关闭。
logs.close()
connections.close()
```

默认弹窗使用浏览器顶层 modal dialog，样式通过 Shadow DOM 隔离，不被游戏画布的层级、transform 或 overflow 裁切。日志弹窗与连接弹窗分别独立调用。应用如果希望同时只开一个，先 `close()` 上一个句柄。

### 只返回实时数据

```js
const connections = client.getConnections({
  type: 'data',
  maxMembers: 4,
  onChange(snapshot) {
    // 立即返回当前快照；成员、连接状态、ICE 或连接方式变化时继续通知。
    renderMyConnectionPanel(snapshot)
  },
})

console.log(connections.data) // 随时读取最新快照
// { roomCode, selfId, memberCount, maxMembers, disposed, players }
// players: [{ id, name, isSelf, state, transport, networkStage,
//             attempt, generation, localIce, remoteIce }]
// state: local / connecting / connected / reconnecting / closed
// transport: p2p / turn / null；非 connected 状态为 null
// networkStage: lan / stun / turn；本机为 null

const logs = client.getLogs({ type: 'data' })
// data 为最近 2000 条已脱敏日志数组，包含 time、stage 及诊断字段。
const unsubscribe = logs.subscribe(entries => renderMyLogPanel(entries))
// subscribe 也会立即通知一次，之后持续通知。

// 页面或自定义面板销毁时释放订阅。
unsubscribe()
logs.dispose()
connections.dispose()
```

两个接口返回 `{ type, data, subscribe, dispose, close }`；`data` 是不可修改的独立快照，旧快照不会随之后事件改变，应用无法通过修改它影响 SDK 内部状态。`onChange` 与 `subscribe` 接收同样的数据。`subscribe` 返回取消该监听的函数；`dispose` / `close` 释放整个句柄的监听并关闭其弹窗，可重复调用。SDK 销毁时先推送最终连接快照（`disposed: true`、人数为 0、玩家为空），再自动释放所有句柄。

调用 `getLogs` 时会在该句柄存续期间采集诊断日志，无需 `debug: true`；关闭后若其他日志句柄和 debug 均未启用则停止内存采集。若要保留打开窗口之前的日志，在加入前使用 `new GameLinkClient({ gameId, playerName, debug: true })` 或 `GameLinkClient.fromLocation({ debug: true })`。日志记录房间请求、信令、ICE、STUN/TURN、连接及重试事件；过滤游戏数据，隐藏凭证、TURN 密钥和 SDP。STUN 失败只进入诊断日志，不触发页面 error 提示。

`mountConnectionBanner` 已标为 deprecated；应用应自行渲染按钮，通过以上接口获取状态或打开弹窗。

退出先停止轮询和关闭旧连接，再提交退出请求；清理凭证时只删除旧会话自己的凭证。新会话忽略旧轮询、刷新和心跳响应，失效恢复凭证清除后按新成员加入。最后一人退出后房间立即删除；仍有其他成员时可以重新加入。

## 玩家网络要求

### 玩家网络

| 方向 | 协议与目标 | 用途 |
| --- | --- | --- |
| 出站 | TCP：网站 HTTPS 443 | 网页、房间及信令请求 |
| 出站 | UDP：STUN 主机 3478 | 发现公网候选地址 |
| 出站 | UDP / TCP：TURN 主机 3479 | 中继接入 |
| 出站 | UDP：其他玩家的动态 ICE 端口，或 TURN 主机 49160–49200 | P2P 数据或对端中继数据 |
| 入站 | 允许上述连接的返回流量及 ICE 协商流量 | 玩家设备通常由 NAT / 有状态防火墙处理，无需统一手动映射固定端口 |

完整服务端端口与出入站规则见 [server.md](server.md#网络与出入站规则)。

## 验证

从仓库根目录运行 `node --test sdk/js/gamelink.test.mjs`。多人网络验证还应覆盖直连、TURN、断线恢复及应用状态同步；单元测试通过不等于真实玩家网络已验证。
