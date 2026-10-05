# GameLink

GameLink 提供多人房间、成员认证、WebRTC 信令和 STUN/TURN 服务。当前项目功能版本为 **1.3.0**，客户端采用 **P2P 优先 → STUN 辅助直连 → TURN 兜底**，游戏状态由客户端维护。

## 文档

| 文件 | 内容 |
| --- | --- |
| [server.md](server.md) | 最新服务端功能、部署配置和出入站规则表 |
| [sdk.md](sdk.md) | 最新客户端接入、连接策略、重连、日志及连接数据接口 |
| [releasenote.md](releasenote.md) | 各版本 Server / SDK 功能变化、升级要点和历史记录 |
| [协议契约](sdk/PROTOCOL.md) | 房间、信令及消息格式 |

server.md 和 sdk.md 只描述当前功能，版本历史集中在 releasenote.md。SDK 包清单目前仍标记为 1.2.0，项目功能版本不等于各语言包的发布版本。

## 仓库结构

- `server/`：Rust/Axum 信令、coturn STUN/TURN、MongoDB 持久化及部署配置。
- `sdk/`：JavaScript/TypeScript、Godot、Rust 客户端实现。
- [gamelink_web](https://github.com/ecojust/gamelink_web)：独立的前端游戏仓库，维护网页构建与部署说明。
