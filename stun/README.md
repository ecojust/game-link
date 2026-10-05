# GameLink 独立 STUN 服务

基于 [coturn](https://github.com/coturn/coturn)，参考用户提供的[搭建说明](https://blog.csdn.net/Crystalyh22/article/details/106050524)，配置项按 [coturn 官方示例](https://github.com/coturn/coturn/blob/master/examples/etc/turnserver.conf)确定。使用系统包管理器安装，不使用文章中的旧源码版本与自签名证书。

## 文件与运行

- `turnserver.conf`：3478 端口，STUN Binding 地址发现，`stun-only`。
- `gamelink-stun.service`：独立 systemd 服务、动态用户、独立运行目录和最小文件系统权限。
- `firewall.sh` / `gamelink-stun-firewall.service`：没有活动防火墙管理器时，只管理两条带 `gamelink-stun` 标记的 IPv4 3478 入站规则，保留其他规则与安全代理。
- `install.sh`：在 Linux 服务器上安装 coturn 并安装本目录配置，已有 GameLink STUN 配置会备份。不会覆盖系统默认 coturn 配置。

```sh
sudo bash stun/install.sh
systemctl status gamelink-stun
journalctl -u gamelink-stun -n 50 --no-pager
```

部署位置：`/opt/gamelink-stun/turnserver.conf`，服务名 `gamelink-stun`。客户端地址 `stun:111.229.154.132:3478`，由 `sdk/js/gamelink.js` 默认 ICE 配置使用。

## 网络

云安全组和主机防火墙需要允许入站 UDP 3478；TCP 3478 可用于其他支持 TCP STUN 的客户端。浏览器使用 STUN UDP Binding，不能用 HTTPS 请求、ping 或只检查 TCP 端口来证明 UDP 可达。STUN 不经过 Nginx，不需要开放 TURN 中继端口范围。

如果启用了主机防火墙，只添加 3478 所需规则，不关闭防火墙。如果云安全组无法通过当前凭据管理，需要在腾讯云控制台添加对应规则。

实际验证需从公网发出 RFC 5389 Binding 请求并校验响应中的事务 ID 和 XOR-MAPPED-ADDRESS；浏览器可以通过 [Trickle ICE](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/) 只配置自建地址后收集 `srflx` 候选。服务端仅监听成功并不等于公网 UDP 可达。

STUN 可恢复公网地址发现，但对称 NAT 或 UDP 封锁仍可能使 P2P 失败；这种情况需要另行配置经过认证的 TURN 中继。

停止服务：`sudo systemctl disable --now gamelink-stun`。若安装了独立防火墙服务，执行 `sudo systemctl disable --now gamelink-stun-firewall` 仅移除本服务添加的两条规则。需要回滚时，从安装脚本打印的配置备份目录恢复配置和服务文件，再执行 `systemctl daemon-reload` 与 `systemctl restart gamelink-stun`。
