# Rust SDK

Native Rust implementation using Tokio, Reqwest, Serde, and `webrtc-rs`.

```toml
[dependencies]
gamelink-sdk = { path = "../sdk/rust" }
tokio = { version = "1", features = ["macros", "rt-multi-thread", "time"] }
serde_json = "1"
```

```rust,no_run
use gamelink_sdk::{PeerMesh, RoomClient};
use serde_json::json;
use std::time::Duration;
use tokio::time::sleep;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let rooms = RoomClient::new("https://games.b14f.com", "tank-arena", "Alice");
    let _joined = rooms.create_room().await?; // Or rooms.join_room("ABCD12").await?
    let mesh = PeerMesh::new(rooms.clone(), vec![]).await?;
    let rooms_for_heartbeat = rooms.clone();
    tokio::spawn(async move { let _ = rooms_for_heartbeat.run_heartbeat(Duration::from_secs(8)).await; });
    let mut incoming = mesh.subscribe_messages();
    loop {
        // Poll refreshes room members; sync_members negotiates peers that joined later.
        for signal in rooms.poll_signals_once().await? { mesh.handle_signal(signal).await?; }
        mesh.sync_members().await?;
        while let Ok(message) = incoming.try_recv() { println!("{}: {}", message.from, message.kind); }
        // Call mesh.send_all("player_state", state, true) when the game state changes.
        sleep(Duration::from_millis(120)).await;
    }
}
```

`RoomClient::poll_signals_once` yields signals and refreshes members; pass each signal to `PeerMesh::handle_signal` and call `sync_members` to discover later joiners. `PeerMesh::subscribe_messages` emits remote messages with `transport = "p2p"`. The optional `RoomClient::send_relay` method uses the server's queued `game_relay` signal and should be treated as server forwarding, not TURN.

Build with `cargo check` from this directory. The first build downloads `webrtc-rs` and its native Rust dependencies.

## 1.2 协议升级

服务端和 SDK 必须同步升级。创建/加入返回的 resume_token 用作成员操作的 auth_token。收信采用最长 15 秒长轮询，请求超时 20 秒；成员列表随轮询更新。信令按 UUID 去重，成功处理后通过下一轮 poll 的 ack_ids 确认删除；断网未收到的消息会重发，60 秒后过期。每房间人数上限 4。JS/Godot 默认关闭单独定时刷新房间，显式刷新仍保留。服务重启清空内存房间。

PeerMesh::handle_signal 成功后自动调用 acknowledge_signal。自行处理 poll_signals_once 返回值时，成功处理后调用 RoomClient::acknowledge_signal(&signal.id)，并去重；仅收到消息不能确认。
