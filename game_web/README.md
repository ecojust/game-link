# GameLink Web Game Hub

GameLink 网页多人游戏大厅。首页先列出当前公开房间（游戏名、`game_id`、人数），下面提供可玩的游戏。当前游戏：多人坦克竞技场（`tank-arena`）和 Three.js FC 风格车辆冲撞《激斗四驱车》（`fc-mini-4wd`）。房间按 `game_id` 隔离；创建即开局，新玩家可以在比赛中加入。网页无需安装 Tauri。

## 本地运行

```sh
npm install
npm run dev
```

打开 `http://127.0.0.1:1431` 查看游戏大厅。开发服务器会把 `/v1` API 请求代理到根目录 `.env.local` 中的 `VITE_API_TARGET`。该文件已加入 Git 忽略规则，不会提交。配置示例：

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

## 独立游戏网页入口

大厅与游戏完全分开：`src/App.vue` 仅提供大厅，`public/tank/index.html` 与 `public/four-wheel/index.html` 是独立游戏页面，各自加载本目录 `assets/` 下的游戏包、样式、SDK 和图标，不共享游戏资源目录。构建会生成游戏包、复制通用 SDK 到 `public/gamelink.js`，然后输出完整站点到 `dist/`。生成文件不提交 Git。

游戏目录维护在 `public/games.json`，新增游戏只需登记唯一 `id`、展示信息和 `entry_url`，后者支持其他域名的完整 URL。无须修改大厅代码。

统一跳转参数为 `?gameid=tank-arena&room=QTUZD3&username=玩家`，不添加 fragment 或交接凭证。大厅仅创建空房间并预留房主昵称；游戏调用 `GameLinkClient.fromLocation()` 和 `joinFromLocation()`，正式加入后成为房主。在房主进入前，其他昵称暂不能加入；无人进入的空房间两分钟后清理。昵称预留不提供身份认证，同昵称可以冒领。刷新仍通过游戏域名自己的 sessionStorage 恢复玩家身份。

独立游戏示例：

```js
import { GameLinkClient } from 'https://games.b14f.com/gamelink.js'
const client = GameLinkClient.fromLocation()
client.on('message', message => console.log(message))
await client.joinFromLocation()
```

跨域游戏需要平台的 `/gamelink.js` 静态响应允许 CORS；API 由服务端 `GAMELINK_ALLOWED_ORIGINS` 控制（默认 `*`，可设置逗号分隔的游戏来源）。每个游戏目录包含本地 SDK 副本，构建时默认将其 API 地址设为 `https://games.b14f.com`。本地联调在根目录 `.env.local` 配置 `VITE_PLATFORM_URL=http://127.0.0.1:1431` 后重新运行；SDK 默认请求其自身所在域名的 API。

## 联机机制

房间、成员列表、心跳、WebRTC 信令和 DataChannel 连接由仓库根目录的 `sdk/js/gamelink.js` 管理。两款游戏分别使用自己的 `game_id`；创建和加入时都会提交 ID，服务端拒绝跨游戏加入。坦克状态使用 `state` DataChannel 直传；四驱车采用房主统一模拟、客户端预测与画面插值。ICE 直连失败时，通过 SDK 的 GameLink 信令队列兜底。HTTP 队列转发不是 TURN，不能视为通用 UDP Relay。

## 激斗四驱车

参考 FC《激突四駆バトル》的俯视车辆冲撞玩法，使用 Three.js 正交相机和程序绘制的场景、车辆。当前是核心玩法重制，地图、车辆模型和音效为重新制作，不是原版 ROM 模拟或逐像素复刻；原版的全部车辆解锁、奖励关及精确数值尚未完整还原。玩法参考：[原作资料](https://w.atwiki.jp/gcmatome/pages/9017.html)。

- 车头攻击，侧面与车尾更脆弱；击退撞墙也会受伤。
- 地图由 40×32 格扩大到 128×100 格（256×200 世界单位，总面积 10 倍）；街道连接公园、湖区、工业废墟，新增树木、废墟、花草、路标与补给。
- 原创 8-bit 背景音乐与随车速变化的引擎声，首次操作后播放；顶部菜单可静音、调音量，切到后台暂停。
- 草地减速、油污打滑、水道木桥、护栏和可破坏岩石。
- LIFE 能量、TEKI 敌车数量、雷达、燃料、涡轮、悬挂、无敌星、旗帜和皇冠。
- 8 个重新设计的关卡；单人即可开局。1–16 人合作，或房主切换为 10 次击破获胜的玩家对战。
- 多人和玩家对战是本项目扩展；后来加入的玩家直接接收当前战场。
- 战场占满浏览器窗口；顶部仅显示房间号、关卡、生命、敌车/击破、人数及连接状态。点击房间号旁菜单查看车辆、模式、成员与 ICE 详情。手机只显示悬浮方向键和 A/B 键，支持安全区域及横竖屏。
- 方向键 / WASD 控制朝向，J / 空格加速，K / X 刹车。不加速时车辆仍缓慢前进；手机使用方向盘与 A/B 按钮，可同时按住。

### 四驱车消息协议

游戏 ID 保持 `fc-mini-4wd`，内部协议版本为 3。旧竞速版与新版不兼容，同房玩家需要刷新到同一版本。

| 消息 | 方向 | 用途 |
| --- | --- | --- |
| `fc2-input` | 玩家 → 房主，可靠 | 操作变化时发送方向、油门、刹车及递增序号 |
| `fc2-world` | 房主 → 玩家 | 最多 20 Hz 发布有变化的权威战场；加入及关卡结束使用可靠消息 |
| `fc2-request` | 玩家 → 房主，可靠 | 请求当前战场，掉线恢复时重试 |
| `fc2-car` | 玩家 → 房主，可靠 | 选择车辆类型 |

房主负责 AI、伤害、道具、击破数和过关判定；其他玩家预测自己的移动并平滑校正。房主离开后，新房主接管最近一次战场快照。服务器和通用 SDK API 无需更改。房主浏览器被系统挂起时模拟可能暂停；HTTP 兜底的延迟也会高于直连。

### 验证

```sh
npm run test:four-wheel
npm run build
```

测试覆盖冲撞伤害和冷却、撞墙朝向、地形、道具、关卡、成员同步与输入校验。渲染、触控和跨浏览器联机仍需在实际设备检查。

### 每个游戏一个目录

```text
public/
  games.json
  tank/
    index.html
    assets/    # game.js、style.css、gamelink.js、图标及构建资源
  four-wheel/
    index.html
    assets/    # 本游戏独立资源，无跨游戏共享包
```

大厅跳转到 `/tank/index.html?gameid=...&room=...&username=...` 或 `/four-wheel/index.html?...`。`index.html` 作为源文件保留，`assets/` 由 `npm run build:games` 生成。部署单个游戏时复制整个游戏文件夹即可；联机仍需访问 GameLink API。开发时修改游戏源码后重新运行 `npm run predev` 更新资源。

### 游戏源码目录

所有游戏源码集中在 `src/gamesource/`：

```text
src/gamesource/
  tank/         # 坦克入口、页面及玩法
  four-wheel/   # 四驱车入口、页面、模拟和渲染
  shared/       # 两个游戏共用的音效和战场样式
```

大厅入口仍是 `src/main.ts` 和 `src/App.vue`，`src/style.css` 是大厅与游戏使用的基础样式。构建输出继续分别位于 `public/tank/assets/` 和 `public/four-wheel/assets/`，线上入口不变。
