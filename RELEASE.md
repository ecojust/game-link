# GameLink Server API 版本记录

以下版本号按项目当前发布记录使用。**1.0** 指本次 API 调整前的服务端行为；**1.1** 于 2026-10-02 部署。**1.2** 于 2026-10-03 部署。

> 1.1 接口表中以 <mark>黄色底纹</mark> 标出的内容表示相较 1.0 有变化。

## 1.2 服务端与 SDK（2026-10-03，已部署）

- 所有房间最多 4 位成员，前端卡片、加入检查、邀请按钮和服务端容量统一。
- 房间目录使用 RwLock，各房间独立 Mutex；长轮询等待期间不持有任何状态锁。房间号在目录写锁内检查碰撞，重名重新生成。
- 信令长轮询最多 15 秒，成员变化或有待收信令时立即返回；客户端请求超时至少 20 秒。JS/Godot 默认关闭重复的 1.5 秒房间查询，成员列表由长轮询提供。显式 refresh 仍可使用。
- 创建/加入返回的私有 resume_token 同时作为成员操作凭证。heartbeat、leave、signals、signals/poll、events 均需在请求 JSON 携带 auth_token；仅知道成员 ID 无法操作。
- 每条信令拥有 UUID id。poll 的 ack_ids 确认已成功处理的信令，确认后删除；未确认信令会在后续 poll 再次返回，SDK 按 id 去重。响应丢失时可重新读取，ACK 丢失时可重新提交。有效期届满后放弃重发。
- 信令有效期 60 秒，单条最多 64 KiB（包含信令封装），每位接收者最多 256 条、累计 256 KiB；HTTP JSON 请求体最多 96 KiB。旧 WebRTC generation 的待发信令在新代次到达时淘汰。
- 主动退出、超时离线和恢复身份均清理该成员双向信令，成员变化通知等待中的轮询。
- /events 保留，但也必须校验凭证且受到队列限制；浏览器游戏消息仍只走 P2P。
- JS SDK、Rust SDK 及网页包版本号为 1.2.0；healthz 返回 version: 1.2.0。

### 1.2 长轮询请求示例

```json
{"member_id":"成员 UUID","auth_token":"加入返回的 resume_token","ack_ids":[],"revision":null,"wait_ms":15000}
```

响应保留 signals/members/relay，新增 revision；signals 内新增 id。下次请求携带最新 revision，以及已处理的信令 id。只确认自己的收件队列，重复确认无副作用。

### 升级与已知边界

1. 服务端和 SDK 必须一起升级。1.1 SDK 没有 auth_token，不能操作 1.2 服务；旧页面需要刷新。接口仍使用 /v1 路径，但身份校验属于不向后兼容的协议变化。
2. 服务重启会清空内存房间和信令，玩家需重新创建/加入。无需引入数据库，本版本仍为单实例内存服务。
3. Nginx 的代理读取超时应大于 20 秒，保证 15 秒长轮询可以正常返回。
4. Rust 的 PeerMesh::handle_signal 成功后自动 ACK；自定义信令消费者成功处理后须调用 RoomClient::acknowledge_signal，并自行去重。
5. 保持已有 WebRTC P2P 模式，不新增 TURN。Godot 原生目标仍需已有的 WebRTC 扩展支持。
6. 完成前端、服务端和 Rust SDK 构建；未运行自动测试、Godot 运行验证、多人实测或负载测试。

## 1.0 服务端接口

| 方法与路径 | 请求/用途 | 响应与行为 |
| --- | --- | --- |
| `POST /v1/rooms` | 普通建房请求包含 `game_id`、`player_name`；`create_only: true` 创建大厅用的空房间。 | 普通建房立即加入创建者并将其设为房主，返回 `room`、`self_member`、`resume_token` 和可选 `handoff_token`。空房间保存预留房主昵称，返回 `host_id: null`、`host_username`，两分钟后过期。 |
| `POST /v1/rooms/{code}/join` | 用 `game_id`、`player_name` 加入；可附 `resume_token` 恢复成员，或用有效 `handoff_token` 交接旧凭证。 | 预留空房间只允许相同昵称加入，否则返回 HTTP 409。预留玩家成为首位成员及房主。跨游戏加入返回 HTTP 409。 |
| `GET /v1/rooms/{code}` | 查询房间详情。 | 返回 `room.id`、`room.code`、`room.game_id`、`room.host_id` 和成员列表。 |
| `GET /v1/rooms` | 查询公开房间列表。 | 返回房间号、游戏 ID、人数和容量摘要。 |
| `POST /v1/rooms/{code}/heartbeat` | 成员定期更新存活状态。 | 更新成员存活时间；超时成员由服务端清理。 |
| `POST /v1/rooms/{code}/signals` | 将 WebRTC offer、answer 或 ICE 信令排队给房间内其他成员。 | 服务端排队转交信令，不建立 PeerConnection。 |
| `POST /v1/rooms/{code}/signals/poll` | 客户端轮询待处理信令并发现其他成员。 | 返回排队信令及成员信息，同时更新成员存活时间。 |
| `POST /v1/rooms/{code}/events` | 向房间其他成员广播事件，供旧客户端消息转发路径使用。 | 事件由服务端转发；不提供 TURN 或 UDP Relay。 |
| `POST /v1/rooms/{code}/leave` | 成员主动离开房间。 | 删除成员；房主离开时提升一名剩余成员。房间无人后删除，未过期的预留空房间除外。 |
| 房间限制与错误 | 房间号大小写不敏感；加入时必须匹配 `game_id`。 | 最多 16 名成员；跨游戏加入返回 HTTP 409。 |

## 1.1 服务端接口

| 方法与路径 | 请求/用途 | 响应与行为 |
| --- | --- | --- |
| `POST /v1/rooms` | 普通建房请求包含 `game_id`、`player_name`；`create_only: true` 创建大厅用的空房间。 | 普通建房请求与响应结构保持不变，但 <mark>创建者是普通成员</mark>。`create_only` <mark>不预留昵称或身份</mark>，只返回 `room.id`、`room.code`、`room.game_id`、`room.members: []`，<mark>不含 `host_id` 或 `host_username`</mark>；空房间两分钟后过期。 |
| `POST /v1/rooms/{code}/join` | 用 `game_id`、`player_name` 加入；支持 `resume_token` 恢复成员及有效 `handoff_token` 旧式凭证交接。 | <mark>任何昵称均可加入未过期空房间；首位成员不获得特殊角色。</mark>`game_id` 不匹配返回 HTTP 409。 |
| `GET /v1/rooms/{code}` | 查询房间详情。 | 返回 `room.id`、`room.code`、`room.game_id` 和成员列表；<mark>不再返回 `room.host_id`</mark>。 |
| `GET /v1/rooms` | 查询公开房间列表。 | 返回房间号、游戏 ID、人数和容量摘要，结构与 1.0 相同。 |
| `POST /v1/rooms/{code}/heartbeat` | 成员定期更新存活状态。 | 更新成员存活时间；超时成员由服务端清理。 |
| `POST /v1/rooms/{code}/signals` | 将 WebRTC offer、answer 或 ICE 信令排队给房间内其他成员。 | 服务端排队转交建连信令，不建立 PeerConnection，也不转发游戏消息。 |
| `POST /v1/rooms/{code}/signals/poll` | 客户端轮询待处理信令并发现其他成员。 | 返回排队信令及成员信息，同时更新成员存活时间。 |
| `POST /v1/rooms/{code}/events` | 为旧客户端保留的事件广播接口。 | 路由继续兼容已有集成；<mark>1.1 JavaScript SDK 游戏数据通过 P2P DataChannel 发送</mark>，此接口不是 TURN 或 UDP Relay。 |
| `POST /v1/rooms/{code}/leave` | 成员主动离开房间。 | 只删除离开成员，<mark>不做房主提升</mark>。活跃房间无人后删除；未过期的 `create_only` 空房间保留至过期。 |
| 房间限制与错误 | 房间号大小写不敏感；加入时必须匹配 `game_id`。 | 最多 16 名成员；跨游戏加入返回 HTTP 409。 |

## 1.0 接口逻辑详述

1. 普通创建请求会同时分配房间和首位成员，并把该成员 ID 写入 `host_id`。
2. 大厅的 `create_only` 请求会建一个两分钟有效的空房间，并把创建时提交的昵称作为唯一可先加入的昵称；其他玩家在预留玩家加入前会收到 `409 waiting for room creator to join`。
3. 预留玩家通过 join 成为房间首位成员及房主。房间快照暴露 `host_id`，客户端据此决定房主专属行为。
4. 房主主动离开或心跳超时后，服务端把一名剩余成员提升为房主。空房间达到预留期限后由清理任务删除。
5. 其他 API 管理房间列表、成员心跳、WebRTC 信令排队和事件广播；服务端本身不建立 WebRTC PeerConnection。

## 1.1 接口逻辑详述

1. `host_id` 从内部 `Room` 状态、`RoomView` 响应及 JavaScript `GameLinkRoom` 类型中移除；退出和超时清理不再有成员晋升流程。
2. `create_only` 不再保存预留昵称。任何匹配 `game_id` 的用户都可调用 join；用户身份由正常 join 返回的 `self_member` 与 `resume_token` 管理。
3. 房间查询结构不再包含 `host_id`。`GET /v1/rooms` 的公开摘要、心跳、信令、poll 与离开接口保持原有用途。
4. 空房间过期、成员心跳超时、房间人数上限和跨游戏隔离规则保持不变。
5. 服务端仍提供 `/events` 路由以兼容旧客户端，但当前 SDK 的游戏状态通信使用玩家之间的 WebRTC DataChannel；服务端只管理房间及 WebRTC 信令，不提供 TURN/Relay 游戏数据转发。

## 1.1 验证与部署

| 项目 | 结果 |
| --- | --- |
| 服务端构建 | 在部署服务器上以 Cargo Release 模式构建成功。 |
| 网页构建 | `game_web` 的 `npm run build` 通过，包含 Vue/TypeScript 检查及生产构建。 |
| API 冒烟检查 | 健康接口与 HTTPS API 可用；验证了不同昵称加入新建空房间，响应不再包含 `host_id`。 |
| 服务端部署 | `/home/b14f/gamelink/target/release/gamelink-server`；systemd 单元 `gamelink-server`，监听 `127.0.0.1:8089`，Nginx API 入口为 `8088`。 |
| 网页部署 | `/home/b14f/games`，站点 `https://games.b14f.com/`。 |
| 回滚备份 | 服务端：`/home/b14f/gamelink/deploy-backup-20261002-1356`；网页：`/home/b14f/games-previous-20261002-1356`。 |

## 兼容性说明

- 1.1 的 `RoomView` 不再返回 `host_id`，旧客户端若依赖该字段需要同步升级。
- 服务端接口仍接受旧式 `handoff_token` 字段用于凭证交接；新大厅建房流程不再使用房主昵称预留。
- `/v1/rooms/{code}/events` 路由仍保留，但不代表服务端提供 TURN 或通用 UDP Relay。

### 1.2 部署记录

2026-10-03 13:54（Asia/Shanghai）发布到 games.b14f.com / 111.229.154.132。服务端健康接口返回 1.2.0。网页、独立游戏和 SDK 同步更新为 4 人上限，资源入口带 v=1.2.0；API 代理读取与发送超时为 30 秒。服务端备份 /home/b14f/gamelink/deploy-backup-1.2-20261003-135102，网页备份 /home/b14f/games-previous-20261003-135102。

## 2026-10-05 10:34（Asia/Shanghai）网页发布

- 线上地址：https://games.b14f.com/；构建版本 `26.1005.1033`。
- 狂野炉石：54 张独立生成的卡牌插画，单张小于 50 KB；桌面牌桌、扇形手牌、拖动出牌与随从落位、拖动攻击和目标法术/技能，以及悬停放大与动作反馈。手机保留点选。
- 所有游戏 SDK：新增 STUN 错误地址与错误码提示、全部失败汇总、10 秒未获取公网候选的超时提示和 60 秒提示去重；不改变 P2P 连接策略，未新增 TURN。
- 部署前网页备份 `/home/b14f/games-previous-20261005-103456`，随后同步完整 `game_web/dist/`。
- 76 个公网资源 SHA-256 与本地构建一致，房间 API 返回成功，`gamelink-server` 为 active，健康接口返回 `status: ok` / `version: 1.2.0`。
- 尚未进行异地设备联机或真实 STUN 不可达环境验证。

## 2026-10-05 11:01（Asia/Shanghai）STUN 配置发布

- 线上 https://games.b14f.com/，构建版本 `26.1005.1101`。
- 默认六个 STUN 地址：新增 miwifi、antisip、linphone、zadarma，保留 Google 和 Cloudflare；保留失败、超时及去重诊断。
- 独立游戏入口资源和 SDK 导入参数改为内容摘要，防止浏览器复用旧版 STUN 配置。
- 回滚备份 `/home/b14f/games-previous-20261005-110140`。
- 35 个公网资源 SHA-256 与本地构建一致，覆盖全部九个游戏的入口、脚本及 SDK；房间 API 正常，服务 active，健康接口 status ok / 1.2.0。
- 本次核对配置发布，未验证各玩家网络的 STUN 可达性或真实跨网络联机，未新增 TURN。

## 2026-10-05 11:25（Asia/Shanghai）自建 STUN 客户端发布

- 构建版本 `26.1005.1124`，所有网页游戏默认改为 `stun:111.229.154.132:3478`，保留错误与超时诊断以及显式 iceServers 覆盖。
- 回滚备份 `/home/b14f/games-previous-20261005-112503`。
- 部署完成后十份线上 SDK SHA-256 与本地构建一致，房间 API 正常，gamelink-server 与 gamelink-stun 均 active，健康接口 status ok / 1.2.0。
- TCP 公网 STUN Binding 成功；UDP 抓包确认服务器收到请求并回复，但测试端未收到回包。尚未确认真实玩家网络的浏览器 STUN 候选或跨网络联机。

## 2026-10-05 11:38 自建 STUN 服务复测

- 更新 coturn 配置并重启，备份 `/opt/gamelink-stun-backup-20261005-113819`。
- 公网直连路径三次 UDP、三次 TCP Binding 均通过；经仅本地诊断转发的浏览器 WebRTC 成功获取 srflx。
- 本地 utun6 虚拟网络路径仍超时，公共 Cloudflare STUN 同样超时。服务已验证可用，未宣称默认 VPN 路径或真实异地游戏联机通过。
- 新增 `stun/probe.py` 与 `stun/probe.html`，便于复现诊断。

## 2026-10-05 13:38 WebRTC 控制台诊断发布

- 构建版本 `26.1005.1337`，默认打印 `[GameLink RTC]` 分阶段日志：加入、信令发送/接受/接收、SDP、ICE、STUN、通道和重试统计。无令牌、完整 SDP 或游戏消息。
- 构建与 JavaScript 语法检查通过；服务器坦克 SDK SHA-256 与本地相同，两项服务 active，健康接口正常。
- 网页备份 `/home/b14f/games-previous-20261005-133845`。诊断日志增加不代表跨网络联机问题已解决。

## 1.3 — 分级 WebRTC 连接

- 服务端按 signal、stun、turn 拆分，由一个主入口监督启动；房间与私有恢复凭证保存至 MongoDB。
- 网页 SDK 对每对成员依次尝试 LAN、STUN 公网直连和认证 TURN 中继。
- 九个游戏及协作应用显示玩家与你之间的 P2P / TURN 连接方式，连接建立前显示连接或重连状态。
- 原生部署需停止旧独立 STUN 服务，配置 MongoDB 与 TURN 密钥，并放行 3479 TCP/UDP、49160–49200 UDP。旧内存房间需重新创建。

## 2026-10-05 18:13（Asia/Shanghai）统一游戏顶部面板发布

- 构建版本 `26.1005.1809`，已发布至 https://games.b14f.com/。
- 九个游戏统一顶部顺序：游戏标识、游戏名、房间号、邀请、退出、日志、玩家连接；移动端按钮使用紧凑图标布局。
- 移动端限制页面缩放与长按选字，保留输入控件编辑；临时消息可关闭并在 6 秒后收起。
- 回滚备份 `/home/b14f/games-previous-20261005-181302`。
- 41 个公网资源 HTTP 200，SHA-256 与本地构建一致，覆盖首页与九个游戏的入口、脚本、样式及 SDK。线上诗词页面已确认显示新面板。
- `gamelink-server` active，服务器本机健康接口返回 `status: ok` / `version: 1.3.0`。公开 `/v1/rooms` 路由正常；站点未公开 `/healthz`。
- 本次发布未验证真实手机手势或异地多人联机。

## 2026-10-05 18:21（Asia/Shanghai）玩家连接弹窗修复

- 构建版本 `26.1005.1818`，已发布至 https://games.b14f.com/。
- SDK 玩家连接列表改为浏览器顶层 modal dialog，避开各游戏画布层级、transform 和 overflow 容器裁切；保留锚点定位和屏幕边缘约束。
- 增加关闭按钮、点外侧关闭与 Esc 关闭；关闭后恢复玩家连接按钮状态。
- 在带裁切父容器及高层覆盖画布的浏览器测试页面验证，桌面与 375px 窄屏显示正常，关闭按钮和 Esc 可用。13 项 SDK 测试及完整构建通过。
- 回滚备份 `/home/b14f/games-previous-20261005-182020`。线上 41 个资源 SHA-256 与本地构建一致，公开房间 API HTTP 200；服务 active，本机健康接口 status ok / 1.3.0。

## 2026-10-05 18:33（Asia/Shanghai）SDK 日志与连接实时接口发布

- 构建版本 `26.1005.1829`，已发布至 https://games.b14f.com/。
- 新增 `client.getLogs(options)` 与 `client.getConnections(options)`：`type: 'dialog'` 或省略打开默认顶层弹窗；`type: 'data'` 仅提供实时数据，不访问 DOM。
- 返回句柄支持 `data`、`onChange` 选项、`subscribe`、`dispose` 和 `close`；快照不可修改，生命周期结束自动清理。日志句柄存续期间采集已脱敏日志，保留最多 2000 条。
- 九个游戏的日志及连接按钮、图标、人数由应用自身渲染，SDK 仅通过显式调用提供数据或默认弹窗。旧 `mountConnectionBanner` 标为 deprecated，保留兼容。
- TypeScript 类型与 SDK README 已更新。16 项 SDK 测试、完整构建及浏览器自定义数据界面、默认连接弹窗和日志脱敏验证通过。
- 回滚备份 `/home/b14f/games-previous-20261005-183204`；41 个线上资源 HTTP 200 且 SHA-256 匹配发布包，公开房间 API HTTP 200。服务 active，本机健康接口 status ok / 1.3.0。
