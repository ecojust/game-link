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

静态文件输出到 `dist/`。生产站点静态文件部署在 `/home/b14f/games`，API 由 Nginx 的 `8088` 入口转发至本机 `127.0.0.1:8089` 的 `gamelink-server` 服务。部署时使用 HTTPS，并让网页和 `/v1` API 处于同一域名；WebRTC 与剪贴板需要安全上下文。Nginx 反向代理 `/v1/` 时需保留该路径前缀。

如果网页和 API 使用不同域名，API 服务还需要配置允许该网页来源的 CORS 响应头；仅设置 `VITE_API_TARGET` 不会绕过浏览器的跨域限制。

## 房间大厅 API

房间列表由服务端 `GET /v1/rooms` 提供，返回房间号、`game_id`、当前人数和人数上限，不返回玩家身份、虚拟 IP 或网络端点。开发服务器从根目录 `.env.local` 的 `VITE_API_TARGET` 代理 `/v1` 请求。

## 独立游戏网页入口

大厅与游戏完全分开：`src/App.vue` 仅提供大厅，`public/tank/index.html` 与 `public/four-wheel/index.html` 是独立游戏页面，各自加载本目录 `assets/` 下的游戏包、样式、SDK 和图标，不共享游戏资源目录。构建会生成游戏包、复制通用 SDK 到 `public/gamelink.js`，然后输出完整站点到 `dist/`。生成文件不提交 Git。

游戏目录维护在 `public/games.json`，登记唯一 `id`、展示信息和 `entry_url`，后者支持其他域名的完整 URL；内置游戏同时加入游戏构建列表。

统一跳转参数为 `?gameid=tank-arena&room=QTUZD3&username=玩家`，不添加 fragment 或交接凭证。大厅只创建空房间，不预留玩家身份或房主；任何玩家都可以用匹配的 `gameid` 和自己的昵称加入。无人加入的空房间两分钟后清理。游戏调用 `GameLinkClient.fromLocation()` 和 `joinFromLocation()` 加入，刷新仍通过游戏域名自己的 sessionStorage 恢复玩家身份。

独立游戏示例：

```js
import { GameLinkClient } from 'https://games.b14f.com/gamelink.js'
const client = GameLinkClient.fromLocation()
client.on('message', message => console.log(message))
await client.joinFromLocation()
```

跨域游戏需要平台的 `/gamelink.js` 静态响应允许 CORS；API 由服务端 `GAMELINK_ALLOWED_ORIGINS` 控制（默认 `*`，可设置逗号分隔的游戏来源）。每个游戏目录包含本地 SDK 副本，构建时默认将其 API 地址设为 `https://games.b14f.com`。本地联调在根目录 `.env.local` 配置 `VITE_PLATFORM_URL=http://127.0.0.1:1431` 后重新运行；SDK 默认请求其自身所在域名的 API。

## 联机机制

房间、成员列表、心跳、WebRTC 信令和 DataChannel 连接由仓库根目录的 `sdk/js/gamelink.js` 管理。两款游戏分别使用自己的 `game_id`；创建和加入时都会提交 ID，服务端拒绝跨游戏加入。所有玩家平等，没有房主模拟器。坦克由每位玩家控制自己的车辆并同步状态与战斗事件；四驱车由所有客户端本地模拟、交换输入和世界快照。GameLink 服务端只负责房间管理与 WebRTC 信令，不转发游戏状态，也不提供 TURN/Relay；直连断开时 SDK 自动重新协商 P2P。

## 激斗四驱车

参考 FC《激突四駆バトル》的俯视车辆冲撞玩法，使用 Three.js 正交相机和程序绘制的场景、车辆。当前是核心玩法重制，地图、车辆模型和音效为重新制作，不是原版 ROM 模拟或逐像素复刻；原版的全部车辆解锁、奖励关及精确数值尚未完整还原。玩法参考：[原作资料](https://w.atwiki.jp/gcmatome/pages/9017.html)。

- 车头攻击，侧面与车尾更脆弱；击退撞墙也会受伤。
- 地图由 40×32 格扩大到 128×100 格（256×200 世界单位，总面积 10 倍）；街道连接公园、湖区、工业废墟，新增树木、废墟、花草、路标与补给。
- 原创 8-bit 背景音乐与随车速变化的引擎声，首次操作后播放；顶部菜单可静音、调音量，切到后台暂停。
- 草地减速、油污打滑、水道木桥、护栏和可破坏岩石。
- LIFE 能量、TEKI 敌车数量、雷达、燃料、涡轮、悬挂、无敌星、旗帜和皇冠。
- 8 个重新设计的关卡；单人即可开局。1–16 人合作，任何玩家都可切换为 10 次击破获胜的玩家对战。
- 多人和玩家对战是本项目扩展；后来加入的玩家直接接收当前战场。
- 战场占满浏览器窗口；顶部仅显示房间号、关卡、生命、敌车/击破、人数及连接状态。点击房间号旁菜单查看车辆、模式、成员与 ICE 详情。手机只显示悬浮方向键和 A/B 键，支持安全区域及横竖屏。
- 方向键 / WASD 控制朝向，J / 空格加速，K / X 刹车。不加速时车辆仍缓慢前进；手机使用方向盘与 A/B 按钮，可同时按住。

### 四驱车消息协议

游戏 ID 保持 `fc-mini-4wd`，内部世界协议版本为 4。旧版房主模拟协议与此版本不兼容，同房玩家需要刷新到同一版本。

| 消息 | 方向 | 用途 |
| --- | --- | --- |
| `fc2-input` | 玩家 → 所有对等玩家，可靠 | 操作变化时发送方向、油门、刹车及递增序号 |
| `fc2-world` | 任一玩家 → 所有对等玩家 | 发布本地模拟世界快照；加入、重同步和阶段变化使用可靠消息 |
| `fc2-request` | 玩家 → 所有对等玩家，可靠 | 新加入或重连时请求世界快照 |
| `fc2-car` | 玩家 → 所有对等玩家，可靠 | 同步车辆类型 |
| `fc2-reset` | 玩家 → 所有对等玩家，可靠 | 同步重开、模式切换和关卡切换；并发重开按轮次与玩家 ID 收敛 |

每个客户端都运行相同的本地模拟，并互发输入与较新快照；低版本快照不会覆盖本地已接收的较新轮次/修订，因此隐藏或挂起某个浏览器标签页不会让它成为全房间的模拟瓶颈。P2P 暂断期间，各端可能短暂分歧，连接恢复后交换快照。此设计不提供服务端反作弊或权威校验。

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
  doodle/
    index.html
    assets/    # 一起涂鸦独立资源
  flight-chess/
    index.html
    assets/    # 飞行棋独立资源
```

大厅跳转到 `/tank/index.html?gameid=...&room=...&username=...`、`/four-wheel/index.html?...`、`/doodle/index.html?...` 或 `/flight-chess/index.html?...`。`index.html` 作为源文件保留，`assets/` 由 `npm run build:games` 生成。部署单个游戏时复制整个游戏文件夹即可；联机仍需访问 GameLink API。开发时修改游戏源码后重新运行 `npm run predev` 更新资源。

### 游戏源码目录

所有游戏源码集中在 `src/gamesource/`：

```text
src/gamesource/
  tank/         # 坦克入口、页面及玩法
  four-wheel/   # 四驱车入口、页面、模拟和渲染
  doodle/      # 多人共同涂鸦与画布同步
  flight-chess/ # 2–4 人回合制飞行棋
  shared/       # 两个游戏共用的音效和战场样式
```

大厅入口仍是 `src/main.ts` 和 `src/App.vue`，`src/style.css` 是大厅与游戏使用的基础样式。游戏资源分别位于各自 `public/<game>/assets/` 目录。

## 飞行棋

`gamelink-flight-chess` 是 2–4 人同房回合制飞行棋。掷出 6 才能起飞，掷出 6 或撞回对手飞机后可再掷一次；按棋盘上的合法飞机执行移动，需刚好到达终点，先让四架飞机归航的人获胜。四个颜色和机库各自固定，非起飞格为安全格。玩家按开局时的房间成员顺序获得座位，动作由当前回合玩家广播后各端校验并推进局面；新加入者只能等待下一局。房间座位最多四人，等待阶段任一玩家均可开始游戏。

消息类型：`ludo-action`、`ludo-state`、`ludo-request` 和 `ludo-reject`。局面通过 GameLink P2P DataChannel 同步，不做服务端持久化。

## 一起涂鸦

`gamelink-doodle` 是房间共享画布，每轮随机抽取一个主题并给出 90 秒倒计时；本轮结束后自动换题并清空画布，任何玩家也可以提前换题。主题由房间协调玩家生成并同步，新加入者会请求当前题目。游戏支持触控或鼠标绘画、圆头笔、铅笔、马克笔、荧光笔、喷枪、霓虹笔、蜡笔、调色、笔刷粗细、橡皮擦、仅撤回自己的最近笔画、重做、全房间清空及 PNG 下载。正在画的笔迹通过不可靠消息快速同步，完成后的整笔通过可靠消息同步；新加入玩家会从已连接的房间成员取得画布快照。画布最多保留最近 600 笔，每笔最多 320 个采样点。当前没有云端持久化，房间内所有玩家离开后画布不保留。

消息类型：`doodle-progress`、`doodle-stroke`、`doodle-undo`、`doodle-clear`、`doodle-request` 和 `doodle-snapshot`。数据由房间成员经 GameLink P2P DataChannel 同步。

### 无限画布交互

涂鸦采用世界坐标，每位玩家独立平移和缩放视角。手机单指绘画、双指平移和捏合缩放；选择移动工具后可单指平移。电脑支持空格拖动、滚轮平移、Ctrl/⌘ 加滚轮缩放。回到原点可复位视角，保存视野导出当前可见区域。移动端禁用页面文字选择、长按菜单和画布原生滚动。旧归一化笔画转换到 1000×650 世界坐标；新版联机请所有玩家刷新到相同版本。画布仍最多保留 600 笔，无云端持久化。

## 一起白板

`gamelink-whiteboard` 使用开源 [`@excalidraw/excalidraw`](https://github.com/excalidraw/excalidraw) 组件提供白板交互，并通过 GameLink P2P DataChannel 同步 Excalidraw 场景元素。内置自由绘制、形状、箭头、文字、便签、选择、缩放、撤销重做和 PNG 导出；多人同时编辑时按元素版本合并，加入或重连时交换分块快照。每位用户独立控制视野，白板不做云端持久化。图片工具关闭，因此同步内容不包含图片文件。更新后请所有房间成员刷新到同一版本。
