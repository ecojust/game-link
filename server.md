# GameLink Server — 当前版本 1.3.0

本文只描述当前版本的服务端功能与部署要求；历史变化见 [releasenote.md](releasenote.md)。命令默认从仓库根目录执行，除非已明确切换到 `server/`。

一个 Rust 主入口管理三个服务：

- `signal/`：HTTP 房间、成员认证、长轮询、WebRTC 信令、临时 TURN 凭证。
- `stun/`：启动 coturn STUN 服务，默认 TCP/UDP 3478。
- `turn/`：启动 coturn TURN 服务，默认 TCP/UDP 3479，中继 UDP 49160–49200。
- `src/storage.rs`：MongoDB 房间和成员持久化，包含恢复凭证；公开接口不会返回其他成员的凭证。
- `src/main.rs`：统一启动、监督子进程、退出时关闭子进程。任一 ICE 服务退出会使主进程退出，由容器或 systemd 重启。

## 服务职责

服务端持续提供房间管理及 offer、answer、ICE 信令交换；STUN 帮助客户端发现公网地址，TURN 使用临时认证凭证转发加密 WebRTC 数据。客户端决定何时从直连切换到中继，具体连接阶段见 [sdk.md](sdk.md#连接策略)。服务端不模拟游戏，也不负责维护游戏状态。

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

## 网络与出入站规则

以下为当前默认部署要求。云安全组、主机防火墙和容器端口映射必须同时满足；公网服务的来源应覆盖实际玩家地址。表中的 443/80 属于 HTTPS 反向代理，8089 是 Compose 映射到主机的信令端口（容器内为 8080）。

### 服务端入站

| 协议 | 目标端口    | 允许来源                  | 要求与用途                                                                              |
| ---- | ----------- | ------------------------- | --------------------------------------------------------------------------------------- |
| TCP  | 443         | 玩家客户端                | 生产 HTTPS 网页与 `/v1` 信令 API；需配置反向代理                                        |
| TCP  | 80          | 公网客户端 / 证书验证服务 | 可选：HTTP 跳转 HTTPS、HTTP 证书验证；不用这些功能可关闭                                |
| UDP  | 3478        | 玩家客户端                | STUN 地址发现，浏览器直连协商需要                                                       |
| TCP  | 3478        | 玩家客户端 / 诊断设备     | 当前 STUN 服务同时提供 TCP，允许 TCP STUN 客户端及诊断工具访问                          |
| UDP  | 3479        | 玩家客户端                | TURN 的 UDP 接入                                                                        |
| TCP  | 3479        | 玩家客户端                | TURN 的 TCP 接入，供客户端无法使用 UDP 接入时尝试                                       |
| UDP  | 49160–49200 | 公网玩家及对端 ICE 地址   | TURN 分配的中继端口，接收对端数据；完整兜底必须放行                                     |
| TCP  | 8089        | 仅本机反向代理            | Compose 的 HTTP 映射，绑定 `127.0.0.1`，不要向公网开放；原生部署以 `GAMELINK_BIND` 为准 |
| TCP  | 27017       | 仅信令服务所在的私有网络  | MongoDB；Compose 不发布此端口，不要向公网开放                                           |

### 服务端出站

| 协议      | 本地源端口      | 目标地址 / 目标端口                            | 要求与用途                                                          |
| --------- | --------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| UDP       | 49160–49200     | 公网玩家的 ICE 地址 / 动态 UDP 端口            | TURN 向对端转发数据；不能把出站目标端口仅限制为 3479 或 49160–49200 |
| UDP       | 3478、3479      | 请求客户端 / 客户端动态 UDP 端口               | STUN、TURN 请求的响应                                               |
| TCP       | 443、3478、3479 | 已连接客户端 / 客户端动态 TCP 端口             | HTTPS、STUN/TCP、TURN/TCP 的响应                                    |
| TCP       | 动态端口        | 配置的 MongoDB 主机 / 27017（或 URI 指定端口） | 数据库访问；仅允许所用数据库地址，容器内部网络也需可达              |
| UDP / TCP | 动态端口        | 配置的 DNS 解析器 / 53                         | 使用域名连接数据库等服务时需要；按实际解析器配置放行                |

有状态安全组/防火墙通常自动允许已建立连接的响应流量；无状态 ACL 需要显式允许表中的返回流量及客户端临时端口。构建、拉取镜像和系统更新所需的出站访问应另按部署环境配置。

**TCP 3479 不能替代 UDP 中继端口。** 当前 coturn 配置使用 `no-tcp-relay`：客户端可通过 TCP 连接 TURN，但 TURN 与对端之间仍通过 UDP 中继。当前配置没有启用 TLS TURN 监听，因此不要将 5349 或 TCP 443 当作默认 TURN 接入端口。

云主机使用公网/私网映射时，配置 `GAMELINK_TURN_EXTERNAL_IP=公网IP/私网IP` 和正确的 `GAMELINK_TURN_RELAY_IP`；容器部署按实际网络配置公网 IP，并保持中继端口一对一映射。修改 `GAMELINK_STUN_PORT`、`GAMELINK_TURN_PORT`、`GAMELINK_TURN_MIN_PORT` 或 `GAMELINK_TURN_MAX_PORT` 时，需同步修改 Compose 映射、防火墙和安全组。外部 ICE 模式下，这些规则应用到实际 STUN/TURN 主机。

协议与配置参考：[coturn 配置说明](https://github.com/coturn/coturn/blob/master/examples/etc/turnserver.conf)、[TURN RFC 8656](https://www.rfc-editor.org/rfc/rfc8656.html)。

## 原生启动

安装 Rust、coturn、MongoDB，按 [`server/deploy/server.env.example`](server/deploy/server.env.example) 配置环境，在 `server/` 目录运行 `cargo run --release`。systemd 示例为 [`server/deploy/gamelink-server.service`](server/deploy/gamelink-server.service)。`GAMELINK_COTURN_BIN` 可指定 turnserver 路径；`GAMELINK_RUNTIME_DIR` 可指定私有运行目录。

`GAMELINK_ICE_MODE=external` 只启动信令服务，STUN/TURN 由外部管理；外部 TURN 必须配置相同共享密钥。默认 `managed` 统一启动三个服务。

## 部署检查

服务端包版本和 `GET /healthz` 返回的 `version` 均为 `1.3.0`。Compose 启动后可在主机检查：

```sh
curl --fail http://127.0.0.1:8089/healthz
```

HTTPS 反向代理需保留完整 `/v1` 路径，读取超时超过 20 秒。健康接口正常只证明 HTTP 服务可用；还需检查 STUN/TURN 端口及真实玩家之间的连接。网页由独立仓库 [gamelink_web](https://github.com/ecojust/gamelink_web) 构建和部署。

部署前备份数据库与现有程序，确认没有其他 STUN 进程占用 3478，配置 MongoDB、至少 32 字符的 TURN 密钥及网络规则。服务端与浏览器 SDK 应配套部署；已有内存房间无法导入 MongoDB，需重新创建。数据库恢复不包含游戏状态，客户端需重新协商并同步状态。

## 持久化范围

创建、加入、主动退出时同步写入 MongoDB；心跳及清理状态每 5 秒保存一次。异常停止可能丢失最后 5 秒的状态。重启恢复房间与成员身份，过期成员由清理任务移除。待处理信令和 ICE 协商代数保留在内存，ACK 后删除、60 秒过期；重启后客户端重新协商。

MongoDB 不存储 TURN 数据包、游戏状态或视频流。目前为单实例信令服务，不能直接启动多个共享同一数据库的信令实例。

## 接口

`/v1/rooms`、加入、退出、心跳、信令发送和长轮询接口保持兼容，房间人数上限 4。

网络配置与 TURN 凭证接口均为 POST，要求 `{ "member_id": "...", "auth_token": "私有恢复凭证" }`：

| 路径                       | 返回                          |
| -------------------------- | ----------------------------- |
| `/v1/rooms/{code}/network` | `stun_urls`、`turn_available` |
| `/v1/rooms/{code}/turn`    | `ice_servers`、`expires_at`   |

TURN 凭证采用 coturn REST HMAC-SHA1 格式，仅房间成员可申请。默认每用户最多 12 个分配、全局 120 个分配、每会话 256 KiB/s、全局 10 MiB/s；私网、回环和组播目标禁止中继。实时容量仍受主机带宽及 coturn 配额约束。

## 退出与重新加入

最后一位成员退出后立即关闭房间并删除 MongoDB 记录；超时移除最后一位成员也会删除房间。大厅只显示有成员的房间，服务启动时清理旧版遗留的已使用空房间。新建跳转期间的临时预留房间不出现在大厅，首位成员加入前最多保留两分钟。恢复成员身份时会轮换私有认证凭证，旧页面的迟到退出和心跳请求不能操作新的会话。

## STUN 诊断工具

统一服务使用 `server/stun/mod.rs` 启动 STUN，并自动生成运行配置。诊断工具位于 `server/stun/`。

从仓库根目录运行：

```sh
python3 server/stun/probe.py
# macOS 指定真实 Wi-Fi 网卡，对照 VPN/TUN 路径，不修改系统路由
python3 server/stun/probe.py --interface en0
# 也可指定测试主机、端口和重复次数
python3 server/stun/probe.py --host xx.xx.xx.xx --port 3478 --count 3
python3 -m http.server 18765 --bind 127.0.0.1 --directory server/stun
```

浏览器打开 `http://127.0.0.1:18765/probe.html`，检查 `srflx` 候选和 ICE 错误。检测页只建立 DataChannel offer；Python 工具分别验证 UDP/TCP Binding 响应的事务 ID、消息长度与 XOR-MAPPED-ADDRESS。诊断结果用于判断 STUN 可达性，真实多人联机仍需在玩家设备之间验证。

当前 Cargo 项目位于 `server/`，默认编译产物为 `server/target/`。systemd 示例中的 `/home/b14f/gamelink/target/release/gamelink-server` 是服务器安装位置。
