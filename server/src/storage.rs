use crate::signal::{Member, Room};
use mongodb::{
    Client, Collection,
    bson::{DateTime, doc},
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Clone)]
pub struct Store {
    rooms: Collection<StoredRoom>,
}
#[derive(Serialize, Deserialize)]
struct StoredMember {
    id: Uuid,
    name: String,
    virtual_ip: String,
    endpoint: std::net::SocketAddr,
    last_seen: u64,
    resume_token: Uuid,
    handoff_token: Option<Uuid>,
}
#[derive(Serialize, Deserialize)]
struct StoredRoom {
    #[serde(rename = "_id")]
    code: String,
    id: String,
    game_id: String,
    members: Vec<StoredMember>,
    next_ip: u16,
    empty_expires_at: Option<u64>,
    revision: u64,
    closed: bool,
    updated_at: DateTime,
}
impl Store {
    pub async fn connect() -> mongodb::error::Result<Self> {
        let uri = std::env::var("GAMELINK_MONGODB_URI")
            .unwrap_or_else(|_| "mongodb://127.0.0.1:27017/?serverSelectionTimeoutMS=5000".into());
        let client = Client::with_uri_str(uri).await?;
        let database = client.database(
            &std::env::var("GAMELINK_MONGODB_DATABASE").unwrap_or_else(|_| "gamelink".into()),
        );
        database.run_command(doc! {"ping": 1}).await?;
        Ok(Self {
            rooms: database.collection("rooms"),
        })
    }
    pub async fn save(&self, room: &Room) -> mongodb::error::Result<()> {
        let stored = StoredRoom {
            code: room.code.clone(),
            id: room.id.clone(),
            game_id: room.game_id.clone(),
            members: room
                .members
                .values()
                .map(|m| StoredMember {
                    id: m.id,
                    name: m.name.clone(),
                    virtual_ip: m.virtual_ip.clone(),
                    endpoint: m.endpoint,
                    last_seen: m.last_seen,
                    resume_token: m.resume_token,
                    handoff_token: m.handoff_token,
                })
                .collect(),
            next_ip: room.next_ip,
            empty_expires_at: room.empty_expires_at,
            revision: room.revision,
            closed: room.closed,
            updated_at: DateTime::now(),
        };
        self.rooms
            .replace_one(doc! {"_id": &room.code}, stored)
            .upsert(true)
            .await?;
        Ok(())
    }
    pub async fn delete(&self, code: &str) -> mongodb::error::Result<()> {
        self.rooms.delete_one(doc! {"_id":code}).await?;
        Ok(())
    }
    pub async fn load(&self) -> mongodb::error::Result<Vec<Room>> {
        let mut cursor = self.rooms.find(doc! {}).await?;
        let mut rooms = Vec::new();
        while cursor.advance().await? {
            let stored = cursor.deserialize_current()?;
            if stored.closed || (stored.members.is_empty() && stored.next_ip > 2) {
                self.delete(&stored.code).await?;
                continue;
            }
            rooms.push(Room {
                id: stored.id,
                code: stored.code,
                game_id: stored.game_id,
                members: stored
                    .members
                    .into_iter()
                    .map(|m| {
                        (
                            m.id,
                            Member {
                                id: m.id,
                                name: m.name,
                                virtual_ip: m.virtual_ip,
                                endpoint: m.endpoint,
                                last_seen: m.last_seen,
                                resume_token: m.resume_token,
                                handoff_token: m.handoff_token,
                            },
                        )
                    })
                    .collect(),
                next_ip: stored.next_ip,
                empty_expires_at: stored.empty_expires_at,
                revision: stored.revision.saturating_add(1),
                closed: false,
                signals: HashMap::new(),
                generations: HashMap::new(),
            });
        }
        Ok(rooms)
    }
}
