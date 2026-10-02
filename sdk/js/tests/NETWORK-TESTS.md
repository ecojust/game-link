# P2P 恢复验证记录

## 范围

JS SDK、坦克网页、四驱车网页。游戏消息保持纯 P2P；服务端仍负责房间、心跳及信令。双方需更新 SDK，旧版无批次信令不兼容。

## 自动验证

- `node --test sdk/js/gamelink.test.mjs`：9 项通过。覆盖禁止转发、重试清理、TURN 过滤、旧 Answer/ICE、ICE 先于 Offer、恢复事件去重、成员离开、时钟回拨、旧重试请求。
- `npm run build --prefix game_web`：类型检查和两个游戏、主页构建通过。
- `browser-network.mjs`：真实 Chrome + 当前 Rust 服务端，两个隔离浏览器会话运行实际游戏。初次 P2P、断线提示、关闭 RTC 通道并阻断 HTTP 3.5 秒后的恢复、完整状态消息、旧 ICE 丢弃、刷新后同成员重连均通过；四驱车另检查刷新后输入消息。

首轮成功测试中，从故障注入到恢复确认（含 3.5 秒断网），坦克约 18.6 秒，四驱车约 3.7 秒。这不是性能保证：固定发起方、重试时机、候选可达性都会影响时间。

## 测试环境与限制

- 本机默认路由为 VPN TUN，Chrome 最初只收集该接口地址，ICE 无法建立。测试浏览器使用虚拟媒体设备授权收集物理网卡候选后成功；没有修改系统 VPN 或生产游戏权限。
- HTTP offline 不会自动切断 WebRTC，所以脚本同时主动关闭 RTC 连接。验证的是实际浏览器连接重建和恢复流程，不是路由器级 UDP 丢包测试。
- 尚未验证跨运营商 NAT、手机 Wi-Fi/蜂窝切换、长时间多玩家压力、超过服务端成员超时后的自动重新入房。
- 额外运行现有 `npm run test:four-wheel --prefix game_web`：6/7 通过；`suspension removes grass slowdown and oil causes spin` 中 `b.vx > a.vx * 2` 失败。本次未修改对应的物理模拟代码或该测试。
- 本次未部署线上。

复现命令及环境变量见上一层 SDK README。
