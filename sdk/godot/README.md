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
