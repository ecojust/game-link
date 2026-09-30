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
