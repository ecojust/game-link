# 游戏源码

`gamesource` 集中维护 GameLink 内置网页游戏的源码。大厅的房间列表和游戏卡片仍位于 `src/App.vue`；本目录负责进入房间后的游戏运行。

## 目录与职责

```text
gamesource/
├── tank/
│   ├── main.ts              # Vue 入口
│   └── TankPage.vue         # 加入房间、坦克玩法、绘制、操作与同步
├── four-wheel/
│   ├── main.ts              # Vue 入口
│   ├── FourWheelPage.vue    # 链接参数、SDK 连接、成员和连接状态
│   ├── FourWheelGame.vue    # 游戏界面、操作、游戏循环与消息同步
│   ├── simulation.ts       # 车辆运动、地图、碰撞、道具和关卡计算
│   └── renderer.ts         # Three.js 场景与车辆渲染
├── doodle/
│   ├── main.ts             # 多人涂鸦入口
│   ├── DoodlePage.vue      # 房间接入、玩家及消息同步
│   ├── DoodleCanvas.vue    # 共同画布、笔刷及画布快照
│   └── doodle.css          # 涂鸦界面样式
├── flight-chess/
│   ├── main.ts             # 飞行棋入口
│   ├── FlightChessPage.vue # 房间接入、回合规则与状态同步
│   ├── FlightBoard.vue     # 四人棋盘及飞机交互
│   └── flight-chess.css    # 飞行棋界面样式
└── shared/
    ├── audio.ts            # 两款游戏使用的程序音效和背景音乐
    └── battle.css          # 全屏战场、顶部菜单及移动操作样式
```

`FourWheelPage.vue` 会挂载 `FourWheelGame.vue`，后者调用模拟、渲染和音效模块。这些文件都参与构建，不能因 `public` 下已有同名游戏而删除。两款游戏还使用 `src/style.css` 中的基础样式。

## 源码与发布目录

| 游戏 | 游戏 ID | 源码入口 | 网页入口 |
| --- | --- | --- | --- |
| 多人坦克竞技场 | `tank-arena` | `tank/main.ts` | `public/tank/index.html` |
| 激斗四驱车 | `fc-mini-4wd` | `four-wheel/main.ts` | `public/four-wheel/index.html` |
| 一起涂鸦 | `gamelink-doodle` | `doodle/main.ts` | `public/doodle/index.html` |
| 飞行棋 | `gamelink-flight-chess` | `flight-chess/main.ts` | `public/flight-chess/index.html` |

上表的源码入口相对于本目录，网页入口相对于 `game_web/`。

构建流程由 `game_web/scripts/build-games.mjs` 和 `game_web/vite.games.config.ts` 管理：

1. 分别编译两款游戏，不生成跨游戏共享的脚本包。
2. 输出到各自 `public/<游戏目录>/assets/`，包含 `game.js`、`style.css`、本地 `gamelink.js` 副本和图标。
3. 完整站点构建将大厅及上述目录一起输出到 `game_web/dist/`。

`public/<游戏目录>/index.html` 是需要维护的入口源文件。`assets/` 是被 Git 忽略的生成目录，每次游戏构建都会清空并重新生成；不要在那里直接修改代码或存放唯一一份手工资源。新增素材应保存在源码目录并通过构建引入，或明确添加复制步骤。

## 房间与 SDK 接入

大厅读取 `public/games.json` 中的游戏信息和 `entry_url`，创建空房间后跳转。游戏页统一读取三个查询参数：

```text
/tank/index.html?gameid=tank-arena&room=QTUZD3&username=玩家
```

- `gameid`：稳定的游戏 ID，必须与当前游戏页面匹配。
- `room`：房间号。
- `username`：玩家昵称。

当前源码流程不携带交接 fragment：大厅只创建空房间，不预留创建者身份；任何使用匹配 gameid 的玩家都可以加入。空房间两分钟后过期。游戏服务端不分配房主或游戏权限。

游戏通过仓库根目录的 `sdk/js/gamelink.js` 接入，例如从单个游戏子目录导入：

```js
import { GameLinkClient } from '../../../../sdk/js/gamelink.js'

const client = GameLinkClient.fromLocation()
client.on('members', members => {
  // 更新玩家列表。
})
client.on('message', message => {
  // 按游戏自己的消息协议更新状态。
})
await client.joinFromLocation()
```

游戏页面还应校验 `client.gameId`、处理连接错误和房间关闭，并在卸载时调用 `dispose()`。主动退出房间使用 `leave()`；刷新恢复依靠 SDK 在游戏域名的 `sessionStorage` 中保存的凭证。

SDK 负责房间、心跳、信令、WebRTC 连接和消息收发，玩法协议由各游戏定义。游戏消息通过 WebRTC DataChannel 在玩家之间 P2P 直传；服务端 HTTP 队列只传递 WebRTC 建连信令，不转发游戏数据，也不是 TURN 或 UDP Relay。SDK 会在 P2P 断开后自动重新协商。坦克由每位玩家控制自己的车辆并同步状态与战斗事件；四驱车由所有客户端运行本地模拟、交换玩家输入和较新世界快照。两款游戏都没有依赖某个浏览器标签页持续运行的房主模拟器。

## 本地开发与构建

以下命令在 `game_web/` 下执行：

```sh
npm install
npm run dev
```

开发站点为 `http://127.0.0.1:1431/`。`dev` 启动前会生成一次游戏资源。游戏页使用的是这些静态资源，修改本目录后需要重新生成并刷新游戏页：

```sh
npm run predev
```

生产构建：

```sh
npm run build:games   # 仅生成游戏资源，不执行完整类型检查
npm run build        # 类型检查、游戏构建及完整站点构建
```

根目录 `.env.local` 可配置：

```env
VITE_PLATFORM_URL=http://127.0.0.1:1431
VITE_API_TARGET=http://127.0.0.1:8088
```

`VITE_PLATFORM_URL` 在构建时写入每款游戏的 SDK 副本，决定联机 API 地址；开发模式默认本地站点，生产模式默认 `https://games.b14f.com`。`VITE_API_TARGET` 是开发站点的 API 代理目标，应与实际服务端监听地址一致。生产构建前确认没有遗留本地平台地址；环境配置不提交 Git。

## 新增游戏

仓库内新增游戏时：

1. 新建 `src/gamesource/<目录名>/main.ts` 和该游戏自己的源码、素材。
2. 新建 `public/<目录名>/index.html`，引用 `./assets/game.js` 和 `./assets/style.css`。
3. 在 `scripts/build-games.mjs` 的游戏列表和 `vite.games.config.ts` 的游戏名校验中加入目录名。
4. 在 `public/games.json` 登记唯一游戏 ID、展示信息及明确的 HTML 入口地址。
5. 使用 SDK 读取三个参数、校验游戏 ID、加入房间，并定义自己的游戏消息协议。

接入已独立部署的第三方游戏，只需在游戏目录登记其入口网址，第三方页面按同样的参数与 SDK 协议接入，无需将其源码放入本目录。跨域请求需要服务端允许对应来源。

进一步说明见 [网页项目 README](../../README.md) 和 [JavaScript SDK README](../../../../sdk/js/README.md)。
