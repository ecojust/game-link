# GameLink Server API 版本记录

以下版本号按项目当前发布记录使用。**1.0** 指本次 API 调整前的服务端行为；**1.1** 于 2026-10-02 部署。

> 1.1 接口表中以 <mark>黄色底纹</mark> 标出的内容表示相较 1.0 有变化。

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
