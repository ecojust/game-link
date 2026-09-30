# GameLink Web Game Hub

GameLink 网页多人游戏大厅。首页先列出当前公开房间（游戏名、`game_id`、人数），下面提供可玩的游戏。当前游戏：多人坦克竞技场（`tank-arena`）和 FC 风格多人竞速《激斗四驱车》（`fc-mini-4wd`）。房间按 `game_id` 隔离；创建即开局，新玩家可以在比赛中加入。网页无需安装 Tauri。

## 本地运行

```sh
npm install
npm run dev
```

打开 `http://127.0.0.1:1431`。开发服务器会把 `/v1` API 请求代理到根目录 `.env.local` 中的 `VITE_API_TARGET`。该文件已加入 Git 忽略规则，不会提交。配置示例：

```env
VITE_API_TARGET=http://your-server:8088
```

## 构建与部署

```sh
npm run build
```

静态文件输出到 `dist/`。部署时建议使用 HTTPS，并让网页和 `/v1` API 处于同一域名：WebRTC 与剪贴板功能需要安全上下文；同源 API 代理也避免浏览器跨域限制。Nginx 可将网页目录设为 `dist/`，并将 `/v1/` 反向代理到现有 GameLink 服务端（保留 `/v1/` 前缀）。

如果网页和 API 使用不同域名，API 服务还需要配置允许该网页来源的 CORS 响应头；仅设置 `VITE_API_TARGET` 不会绕过浏览器的跨域限制。

## 房间大厅 API

房间列表由服务端 `GET /v1/rooms` 提供，返回房间号、`game_id`、当前人数和人数上限，不返回玩家身份、虚拟 IP 或网络端点。开发服务器从根目录 `.env.local` 的 `VITE_API_TARGET` 代理 `/v1` 请求。

## 联机机制

房间、成员列表、心跳、WebRTC 信令和 DataChannel 连接由仓库根目录的 `sdk/js/gamelink.js` 管理。两款游戏分别使用自己的 `game_id`；创建和加入时都会提交 ID，服务端拒绝跨游戏加入。坦克状态与四驱车位置、圈数使用 `state` DataChannel 直传，涡轮和冲线事件使用可靠消息。ICE 直连失败时，坦克 SDK 当前通过 GameLink 信令队列兜底；四驱车游戏展示连接状态并通过同一 SDK 发送游戏消息。HTTP 队列转发不是 TURN，不能视为通用 UDP Relay。
