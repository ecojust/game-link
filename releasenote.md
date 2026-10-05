# GameLink Release Notes

按项目版本分别记录 Server 与 SDK 的功能变化。最新功能说明见 [server.md](server.md) 和 [sdk.md](sdk.md)。下面的版本号是项目发布口径，SDK 包清单的实际版本以各自 manifest 为准。

## 1.3.0（2026-10-05）

### Server

- 从仅房间/信令服务扩展为统一管理 signal、STUN、TURN；支持 managed / external ICE 模式。
- 增加认证的 `/network` 配置接口和 `/turn` 临时凭证接口，凭证有效期一小时，提供中继配额限制。
- 默认 STUN TCP/UDP 3478、TURN TCP/UDP 3479、中继 UDP 49160–49200；TURN 的 TCP 接入仍需 UDP 对端中继。
- 新增 MongoDB 房间与成员身份持久化；最后一人退出或过期后删除房间，恢复身份时轮换凭证。
- 信令仍在内存，重启后重新协商；保持单实例部署，旧内存房间无法迁移。

### SDK

- 浏览器 JS 新增逐对连接回退：本地 P2P（4 秒）→ STUN 辅助 P2P（12 秒）→ 认证 TURN（20 秒），后续退避重试。
- 连接状态提供协商阶段、P2P / TURN 路径及 ICE 地址，增加 STUN 与 WebRTC 诊断。
- 增加 `getLogs` / `getConnections`：省略 type 或 dialog 打开默认顶层弹窗，data 只返回实时数据；支持订阅、不可变快照和释放句柄。
- 默认弹窗支持关闭按钮、Esc 和外侧关闭；应用自行定义按钮与数据界面，旧连接横幅接口标为 deprecated。
- 日志最多保留 2000 条并隐藏凭证及 SDP；退出和恢复流程隔离旧请求，避免旧会话影响新会话。
- JS / Rust 包清单仍为 1.2.0；以上新增浏览器能力不代表 Godot / Rust 已实现相同接口。

### 升级要点

备份数据库与程序，停用原独立 STUN 服务，配置 MongoDB、TURN 密钥及安全组/防火墙，同步更新浏览器 SDK。旧房间重新创建，具体配置见 [server.md](server.md)。

## 1.2.0（2026-10-03）

### Server

- 房间人数统一为 4，加入检查与容量响应一致。
- 成员操作改为私有 token 认证；信令增加 UUID、ACK、去重、60 秒过期和队列容量限制。
- 新增最长 15 秒长轮询、成员变化通知、房间独立锁及碰撞安全建房。
- 仍是单实例内存服务，没有 TURN 或数据库持久化。

### SDK

- JS / Rust 包版本为 1.2.0；成员请求携带 auth_token。
- 接收信令采用长轮询和 ACK，按 ID 去重；JS / Godot 默认关闭重复的定时房间查询。
- Rust PeerMesh 处理信令成功后自动 ACK；自定义消费者负责确认与去重。
- 游戏消息继续使用 WebRTC P2P，房间容量同步为 4。

## 1.1（2026-10-02）

### Server

- 移除 host_id 和房主晋升；首位加入者与其他玩家平等。
- create_only 空房间不再预留创建者昵称，任何匹配 game_id 的玩家均可加入。
- 保留房间目录、心跳、信令及旧 events 路由，没有 TURN 中继。

### SDK

- JS 房间类型移除 host_id；大厅到游戏使用普通加入，不再依赖房主身份或昵称预留。
- 当前游戏消息路径使用 WebRTC DataChannel，HTTP 负责房间及建连信令。

## 1.0（初始基线）

### Server

- 提供按 game_id 隔离的房间、创建/加入/退出、成员心跳、信令队列和 events 广播，最多 16 人。
- 创建者具有 host_id；空房间预留创建昵称，房主离开后提升其他成员。
- 房间存在内存中，不提供 TURN。

### SDK

- 基础房间与信令接入、WebRTC offer/answer/ICE 交换及游戏消息契约。
- 客户端可使用房主字段区分角色；具体初始包版本未在现有记录中标明。
