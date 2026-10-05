# GameLink 1.3 Server

一个 Rust 主入口管理三个服务：

- `signal/`：HTTP 房间、成员认证、长轮询、WebRTC 信令、临时 TURN 凭证。
- `stun/`：启动 coturn STUN 服务，默认 TCP/UDP 3478。
- `turn/`：启动 coturn TURN 服务，默认 TCP/UDP 3479，中继 UDP 49160–49200。
- `src/storage.rs`：MongoDB 房间和成员持久化，包含恢复凭证；公开接口不会返回其他成员的凭证。
- `src/main.rs`：统一启动、监督子进程、退出时关闭子进程。任一 ICE 服务退出会使主进程退出，由容器或 systemd 重启。

## 连接顺序

浏览器 SDK 对每一对玩家分别尝试：

1. 仅使用本地 ICE 地址，4 秒连接窗口。
2. 使用 STUN 获取公网地址，12 秒连接窗口。
3. 从信令服务获取一小时有效的 TURN 凭证，强制中继，20 秒连接窗口；后续重试使用退避。

信令服务始终交换 offer、answer、ICE 和重连通知。STUN 不转发游戏数据；TURN 转发加密的 WebRTC 数据。游戏状态继续由客户端维护。旧客户端不会自动获得这套回退逻辑，需要同步发布新 SDK。

## Docker Compose 启动

```sh
cd server
cp .env.example .env
# 修改公网地址、MongoDB 密码和至少 32 字符的 TURN 密钥
# 密码建议使用随机十六进制，避免 MongoDB URI 特殊字符需要编码
openssl rand -hex 32
docker compose up -d --build
```

MongoDB 使用持久卷，不向主机开放端口。HTTP 映射到 `127.0.0.1:8089`，交给现有 HTTPS 反向代理。云安全组和主机防火墙均须允许 TCP/UDP 3478、TCP/UDP 3479、UDP 49160–49200。代理长轮询超时应超过 20 秒。

云主机若只有私网网卡，将 `GAMELINK_TURN_EXTERNAL_IP` 设为 `公网IP/私网IP`；容器端口映射模式可设置为公网 IP，并确保端口一对一映射。

## 原生启动

安装 Rust、coturn、MongoDB，按 `deploy/server.env.example` 配置环境，运行 `cargo run --release`。systemd 示例为 `deploy/gamelink-server.service`。`GAMELINK_COTURN_BIN` 可指定 turnserver 路径；`GAMELINK_RUNTIME_DIR` 可指定私有运行目录。

`GAMELINK_ICE_MODE=external` 只启动信令服务，STUN/TURN 由外部管理；外部 TURN 必须配置相同共享密钥。默认 `managed` 统一启动三个服务。

升级现有部署前备份 MongoDB 和旧程序，停止原独立 `gamelink-stun` 服务，避免 3478 冲突；先准备 MongoDB 和端口，再部署 1.3 服务与新网页。旧内存房间不能自动迁移，升级时需重新创建房间。

## 持久化范围

创建、加入、主动退出时同步写入 MongoDB；心跳及清理状态每 5 秒保存一次。异常停止可能丢失最后 5 秒的状态。重启恢复房间与成员身份，过期成员由清理任务移除。待处理信令和 ICE 协商代数保留在内存，ACK 后删除、60 秒过期；重启后客户端重新协商。

MongoDB 不存储 TURN 数据包、游戏状态或视频流。目前为单实例信令服务，不能直接启动多个共享同一数据库的信令实例。

## 接口

原有 `/v1/rooms`、加入、退出、心跳、信令发送和长轮询接口保持兼容，房间人数上限 4。

新增接口均为 POST，要求 `{ "member_id": "...", "auth_token": "私有恢复凭证" }`：

| 路径 | 返回 |
| --- | --- |
| `/v1/rooms/{code}/network` | `stun_urls`、`turn_available` |
| `/v1/rooms/{code}/turn` | `ice_servers`、`expires_at` |

TURN 凭证采用 coturn REST HMAC-SHA1 格式，仅房间成员可申请。默认每用户最多 12 个分配、全局 120 个分配、每会话 256 KiB/s、全局 10 MiB/s；私网、回环和组播目标禁止中继。实时容量仍受主机带宽及 coturn 配额约束。

## 退出与重新加入

最后一位成员退出后立即关闭房间并删除 MongoDB 记录；超时移除最后一位成员也会删除房间。大厅只显示有成员的房间，服务启动时清理旧版遗留的已使用空房间。新建跳转期间的临时预留房间不出现在大厅，首位成员加入前最多保留两分钟。恢复成员身份时会轮换私有认证凭证，旧页面的迟到退出和心跳请求不能操作新的会话。

## STUN 诊断工具

统一服务使用 `server/stun/mod.rs` 启动 STUN，并自动生成运行配置。原根目录 `stun/` 的独立安装脚本及配置已移除，诊断工具保留在本目录的 `stun/` 下。

从仓库根目录运行：

```sh
python3 server/stun/probe.py
# macOS 指定真实 Wi-Fi 网卡，对照 VPN/TUN 路径，不修改系统路由
python3 server/stun/probe.py --interface en0
# 也可指定测试主机、端口和重复次数
python3 server/stun/probe.py --host 111.229.154.132 --port 3478 --count 3
python3 -m http.server 18765 --bind 127.0.0.1 --directory server/stun
```

浏览器打开 `http://127.0.0.1:18765/probe.html`，检查 `srflx` 候选和 ICE 错误。检测页只建立 DataChannel offer；Python 工具分别验证 UDP/TCP Binding 响应的事务 ID、消息长度与 XOR-MAPPED-ADDRESS。诊断结果用于判断 STUN 可达性，真实多人联机仍需在玩家设备之间验证。

当前 Cargo 项目位于 `server/`，默认编译产物为 `server/target/`。根目录 `target/` 是旧缓存，可清理；从 `server/` 执行 Cargo 构建时会重新生成当前缓存。systemd 示例中的 `/home/b14f/gamelink/target/release/gamelink-server` 是服务器安装位置，与仓库根目录缓存无关。
