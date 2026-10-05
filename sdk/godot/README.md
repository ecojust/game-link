# Godot 4 SDK

The add-on source is `addons/gamelink/gamelink_client.gd`. Copy the `addons/gamelink` folder into a Godot 4 project, then create and configure the client:

```gdscript
var network := GameLinkClient.new({
    "server_url": "https://games.b14f.com",
    "game_id": "tank-arena",
    "player_name": "Alice",
})
add_child(network)
network.members_changed.connect(_on_members_changed)
network.message_received.connect(_on_game_message)
network.peer_state_changed.connect(_on_peer_state)
var room := await network.create_room() # or await network.join_room("ABCD12")
network.send("player_state", {"x": 120, "y": 64}, "", "unreliable")
```

Call `await network.leave_room()` when leaving. Signals expose room/member changes, received JSON messages, connection state and ICE candidate endpoints. Reliable messages use `control`; set reliability to `"unreliable"` for replaceable snapshots on `state`.

Godot's WebRTC peer classes need a working `WebRTCPeerConnectionExtension` on the export target. The SDK intentionally does not bundle a platform-specific native extension binary: configure the project's WebRTC extension/plugin for desktop or mobile builds. The browser export target can use the platform's WebRTC implementation. STUN is configurable with the `ice_servers` option; GameLink's server does not currently provide TURN.

`project.godot` here is a tiny validation project; the add-on can be copied into another Godot 4 project without copying it.

## 1.2 协议升级

服务端和 SDK 必须同步升级。创建/加入返回的 resume_token 用作成员操作的 auth_token。收信采用最长 15 秒长轮询，请求超时 20 秒；成员列表随轮询更新。信令按 UUID 去重，成功处理后通过下一轮 poll 的 ack_ids 确认删除；断网未收到的消息会重发，60 秒后过期。每房间人数上限 4。JS/Godot 默认关闭单独定时刷新房间，显式刷新仍保留。服务重启清空内存房间。
