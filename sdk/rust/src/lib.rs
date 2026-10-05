//! GameLink room and signaling SDK. `RoomClient` owns the shared HTTP control plane;
//! `PeerMesh` implements WebRTC DataChannels for native Rust games.
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{
    collections::{HashMap, VecDeque},
    sync::Arc,
    time::Duration,
};
use thiserror::Error;
use tokio::sync::{broadcast, Mutex};
use webrtc::{
    api::{
        interceptor_registry::register_default_interceptors, media_engine::MediaEngine, APIBuilder,
    },
    data_channel::{data_channel_init::RTCDataChannelInit, RTCDataChannel},
    ice_transport::{ice_candidate::RTCIceCandidateInit, ice_server::RTCIceServer},
    interceptor::registry::Registry,
    peer_connection::{
        configuration::RTCConfiguration, peer_connection_state::RTCPeerConnectionState,
        sdp::session_description::RTCSessionDescription, RTCPeerConnection,
    },
};

#[derive(Debug, Error)]
pub enum GameLinkError {
    #[error("HTTP: {0}")]
    Http(#[from] reqwest::Error),
    #[error("WebRTC: {0}")]
    WebRtc(#[from] webrtc::Error),
    #[error("not connected to a room")]
    NotInRoom,
    #[error("invalid server response: {0}")]
    InvalidResponse(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Member {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub virtual_ip: String,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Room {
    pub code: String,
    #[serde(default)]
    pub game_id: String,
    #[serde(default)]
    pub members: Vec<Member>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Signal {
    pub id: String,
    pub from: String,
    #[serde(default)]
    pub to: String,
    pub kind: String,
    #[serde(default)]
    pub payload: Value,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Envelope {
    pub kind: String,
    #[serde(default)]
    pub payload: Value,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub from: String,
    pub kind: String,
    pub payload: Value,
    pub transport: String,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoomResponse {
    pub room: Room,
    pub self_member: Member,
    pub resume_token: String,
}

/// HTTP room and signaling control-plane client shared by native SDK adapters.
#[derive(Clone)]
pub struct RoomClient {
    http: reqwest::Client,
    base: String,
    game_id: String,
    player_name: String,
    room: Arc<Mutex<Option<RoomResponse>>>,
    signals: broadcast::Sender<Signal>,
    acknowledgements: Arc<Mutex<Vec<String>>>,
    revision: Arc<Mutex<Option<u64>>>,
    poll_lock: Arc<Mutex<()>>,
}
impl RoomClient {
    pub fn new(
        server_url: impl Into<String>,
        game_id: impl Into<String>,
        player_name: impl Into<String>,
    ) -> Self {
        let (signals, _) = broadcast::channel(256);
        Self {
            http: reqwest::Client::new(),
            base: server_url.into().trim_end_matches('/').to_owned(),
            game_id: game_id.into(),
            player_name: player_name.into(),
            room: Arc::new(Mutex::new(None)),
            signals,
            acknowledgements: Arc::new(Mutex::new(Vec::new())),
            revision: Arc::new(Mutex::new(None)),
            poll_lock: Arc::new(Mutex::new(())),
        }
    }
    pub fn subscribe_signals(&self) -> broadcast::Receiver<Signal> {
        self.signals.subscribe()
    }
    pub async fn create_room(&self) -> Result<RoomResponse, GameLinkError> {
        let value = self
            .http
            .post(format!("{}/v1/rooms", self.base))
            .json(&serde_json::json!({"game_id":self.game_id,"player_name":self.player_name}))
            .send()
            .await?
            .error_for_status()?
            .json::<RoomResponse>()
            .await?;
        *self.room.lock().await = Some(value.clone());
        self.acknowledgements.lock().await.clear();
        *self.revision.lock().await = None;
        Ok(value)
    }
    pub async fn join_room(&self, code: &str) -> Result<RoomResponse, GameLinkError> {
        let value = self
            .http
            .post(format!(
                "{}/v1/rooms/{}/join",
                self.base,
                urlencoding::encode(&code.trim().to_uppercase())
            ))
            .json(&serde_json::json!({"game_id":self.game_id,"player_name":self.player_name}))
            .send()
            .await?
            .error_for_status()?
            .json::<RoomResponse>()
            .await?;
        *self.room.lock().await = Some(value.clone());
        self.acknowledgements.lock().await.clear();
        *self.revision.lock().await = None;
        Ok(value)
    }
    pub async fn room(&self) -> Option<RoomResponse> {
        self.room.lock().await.clone()
    }
    pub async fn refresh(&self) -> Result<Room, GameLinkError> {
        let current = self.room().await.ok_or(GameLinkError::NotInRoom)?;
        let room = self
            .http
            .get(format!(
                "{}/v1/rooms/{}",
                self.base,
                urlencoding::encode(&current.room.code)
            ))
            .send()
            .await?
            .error_for_status()?
            .json::<Room>()
            .await?;
        if let Some(session) = self.room.lock().await.as_mut() {
            session.room = room.clone();
        }
        Ok(room)
    }
    pub async fn send_signal(
        &self,
        to: &str,
        kind: &str,
        payload: Value,
    ) -> Result<(), GameLinkError> {
        let current = self.room().await.ok_or(GameLinkError::NotInRoom)?;
        self.http.post(format!("{}/v1/rooms/{}/signals", self.base, urlencoding::encode(&current.room.code))).json(&serde_json::json!({"auth_token":current.resume_token,"from":current.self_member.id,"to":to,"kind":kind,"payload":payload})).send().await?.error_for_status()?;
        Ok(())
    }
    pub async fn broadcast_event(&self, kind: &str, payload: Value) -> Result<(), GameLinkError> {
        let current = self.room().await.ok_or(GameLinkError::NotInRoom)?;
        self.http.post(format!("{}/v1/rooms/{}/events", self.base, urlencoding::encode(&current.room.code))).json(&serde_json::json!({"auth_token":current.resume_token,"from":current.self_member.id,"kind":kind,"payload":payload})).send().await?.error_for_status()?;
        Ok(())
    }
    pub async fn send_relay(
        &self,
        to: &str,
        kind: &str,
        payload: Value,
    ) -> Result<(), GameLinkError> {
        self.send_signal(
            to,
            "game_relay",
            serde_json::json!({"kind":kind,"payload":payload}),
        )
        .await
    }
    pub async fn leave(&self) -> Result<(), GameLinkError> {
        let current = self.room().await.ok_or(GameLinkError::NotInRoom)?;
        self.http.post(format!("{}/v1/rooms/{}/leave", self.base, urlencoding::encode(&current.room.code))).json(&serde_json::json!({"member_id":current.self_member.id,"auth_token":current.resume_token})).send().await?.error_for_status()?;
        *self.room.lock().await = None;
        Ok(())
    }
    pub async fn run_heartbeat(&self, interval: Duration) -> Result<(), GameLinkError> {
        loop {
            tokio::time::sleep(interval).await;
            let Some(current) = self.room().await else {
                return Ok(());
            };
            self.http.post(format!("{}/v1/rooms/{}/heartbeat",self.base,urlencoding::encode(&current.room.code))).json(&serde_json::json!({"member_id":current.self_member.id,"auth_token":current.resume_token})).send().await?.error_for_status()?;
        }
    }
    /// Confirm only after successfully handling a signal; duplicate confirmations are harmless.
    pub async fn acknowledge_signal(&self, id: &str) {
        let mut acks = self.acknowledgements.lock().await;
        if !acks.iter().any(|v| v == id) {
            acks.push(id.to_owned());
        }
    }
    pub async fn poll_signals_once(&self) -> Result<Vec<Signal>, GameLinkError> {
        let _poll = self.poll_lock.lock().await;
        let current = self.room().await.ok_or(GameLinkError::NotInRoom)?;
        let acks = self.acknowledgements.lock().await.clone();
        let revision = *self.revision.lock().await;
        let data: Value = self.http.post(format!("{}/v1/rooms/{}/signals/poll",self.base,urlencoding::encode(&current.room.code)))
            .timeout(Duration::from_secs(20)).json(&serde_json::json!({"member_id":current.self_member.id,"auth_token":current.resume_token,"ack_ids":acks,"revision":revision,"wait_ms":15000}))
            .send().await?.error_for_status()?.json().await?;
        if self.room().await.as_ref().map(|r| &r.self_member.id) != Some(&current.self_member.id) {
            return Ok(Vec::new());
        }
        self.acknowledgements
            .lock()
            .await
            .retain(|id| !acks.contains(id));
        *self.revision.lock().await = data.get("revision").and_then(Value::as_u64);
        if let Some(members) = data.get("members").cloned() {
            if let Ok(mut members) = serde_json::from_value::<Vec<Member>>(members) {
                members.push(current.self_member.clone());
                if let Some(session) = self.room.lock().await.as_mut() {
                    session.room.members = members;
                }
            }
        }
        let list: Vec<Signal> =
            serde_json::from_value(data.get("signals").cloned().unwrap_or(Value::Array(vec![])))
                .map_err(|e| GameLinkError::InvalidResponse(e.to_string()))?;
        for signal in &list {
            let _ = self.signals.send(signal.clone());
        }
        Ok(list)
    }
    pub async fn run_signal_polling(&self, interval: Duration) -> Result<(), GameLinkError> {
        loop {
            if self.room().await.is_none() {
                return Ok(());
            }
            self.poll_signals_once().await?;
            tokio::time::sleep(interval.max(Duration::from_millis(250))).await;
        }
    }
    async fn base_url(&self) -> Result<(String, RoomResponse), GameLinkError> {
        Ok((
            self.base.clone(),
            self.room().await.ok_or(GameLinkError::NotInRoom)?,
        ))
    }
}

/// Native WebRTC mesh. Call `handle_signal` for each signal received from `RoomClient`.
pub struct PeerMesh {
    client: RoomClient,
    api: Arc<webrtc::api::API>,
    peers: Mutex<HashMap<String, Arc<RTCPeerConnection>>>,
    channels: Mutex<HashMap<String, Arc<Mutex<HashMap<String, Arc<RTCDataChannel>>>>>>,
    incoming: broadcast::Sender<Message>,
    stun_urls: Vec<String>,
    pending_ice: Mutex<HashMap<String, Vec<RTCIceCandidateInit>>>,
    handled: Mutex<VecDeque<String>>,
}
impl PeerMesh {
    pub async fn new(client: RoomClient, stun_urls: Vec<String>) -> Result<Self, GameLinkError> {
        let mut media = MediaEngine::default();
        media.register_default_codecs()?;
        let registry = register_default_interceptors(Registry::new(), &mut media)?;
        let api = APIBuilder::new()
            .with_media_engine(media)
            .with_interceptor_registry(registry)
            .build();
        let (incoming, _) = broadcast::channel(512);
        let stun_urls = if stun_urls.is_empty() {
            vec![
                "stun:stun.l.google.com:19302".to_owned(),
                "stun:stun.cloudflare.com:3478".to_owned(),
            ]
        } else {
            stun_urls
        };
        Ok(Self {
            client,
            api: Arc::new(api),
            peers: Mutex::new(HashMap::new()),
            channels: Mutex::new(HashMap::new()),
            incoming,
            stun_urls,
            pending_ice: Mutex::new(HashMap::new()),
            handled: Mutex::new(VecDeque::new()),
        })
    }
    pub fn subscribe_messages(&self) -> broadcast::Receiver<Message> {
        self.incoming.subscribe()
    }
    /// Synchronize the mesh with current room members. The member with the lower stable ID offers.
    pub async fn sync_members(&self) -> Result<(), GameLinkError> {
        let Some(session) = self.client.room().await else {
            return Err(GameLinkError::NotInRoom);
        };
        let active: std::collections::HashSet<String> = session
            .room
            .members
            .iter()
            .filter(|m| m.id != session.self_member.id)
            .map(|m| m.id.clone())
            .collect();
        let stale: Vec<String> = self
            .peers
            .lock()
            .await
            .keys()
            .filter(|id| !active.contains(*id))
            .cloned()
            .collect();
        for id in stale {
            if let Some(pc) = self.peers.lock().await.remove(&id) {
                let _ = pc.close().await;
            }
            self.channels.lock().await.remove(&id);
        }
        for member in session
            .room
            .members
            .iter()
            .filter(|m| m.id != session.self_member.id)
        {
            let offerer = session.self_member.id < member.id;
            if !self.peers.lock().await.contains_key(&member.id) {
                if offerer {
                    self.start_offer(&member.id).await?;
                } else {
                    self.peer(&member.id, false).await?;
                }
            }
        }
        Ok(())
    }
    async fn peer(&self, id: &str, offerer: bool) -> Result<Arc<RTCPeerConnection>, GameLinkError> {
        if let Some(pc) = self.peers.lock().await.get(id) {
            return Ok(pc.clone());
        }
        let (base, room) = self.client.base_url().await?;
        let me = room.self_member.id.clone();
        let code = room.room.code.clone();
        let config = RTCConfiguration {
            ice_servers: vec![RTCIceServer {
                urls: self.stun_urls.clone(),
                ..Default::default()
            }],
            ..Default::default()
        };
        let pc = Arc::new(self.api.new_peer_connection(config).await?);
        let http = self.client.http.clone();
        let incoming = self.incoming.clone();
        let channels_ref = Arc::new(Mutex::new(HashMap::<String, Arc<RTCDataChannel>>::new()));
        let chref = channels_ref.clone();
        let peerid = id.to_owned();
        pc.on_data_channel(Box::new(move |dc| {
            let chref = chref.clone();
            let incoming = incoming.clone();
            let peerid = peerid.clone();
            Box::pin(async move {
                let label = dc.label().to_owned();
                chref.lock().await.insert(label, dc.clone());
                let incoming2 = incoming.clone();
                let pid = peerid.clone();
                dc.on_message(Box::new(move |msg| {
                    let incoming = incoming2.clone();
                    let pid = pid.clone();
                    Box::pin(async move {
                        if let Ok(env) = serde_json::from_slice::<Envelope>(&msg.data) {
                            let _ = incoming.send(Message {
                                from: pid,
                                kind: env.kind,
                                payload: env.payload,
                                transport: "p2p".into(),
                            });
                        }
                    })
                }));
            })
        }));
        let http2 = http.clone();
        let code2 = code.clone();
        let me2 = me.clone();
        let id2 = id.to_owned();
        let base2 = base.clone();
        let token2 = room.resume_token.clone();
        pc.on_ice_candidate(Box::new(move |candidate| { let http=http2.clone();let code=code2.clone();let me=me2.clone();let id=id2.clone();let base=base2.clone();let token=token2.clone();Box::pin(async move { if let Some(c)=candidate { if let Ok(json)=c.to_json() { let _=http.post(format!("{base}/v1/rooms/{code}/signals")).json(&serde_json::json!({"auth_token":token,"from":me,"to":id,"kind":"webrtc_ice","payload":json})).send().await; } } }) }));
        let _ = RTCPeerConnectionState::New;
        if offerer {
            let control = pc.create_data_channel("control", None).await?;
            channels_ref
                .lock()
                .await
                .insert("control".into(), control.clone());
            let state = pc
                .create_data_channel(
                    "state",
                    Some(RTCDataChannelInit {
                        ordered: Some(false),
                        max_retransmits: Some(0),
                        ..Default::default()
                    }),
                )
                .await?;
            channels_ref.lock().await.insert("state".into(), state);
            for dc in channels_ref.lock().await.values() {
                let inc = self.incoming.clone();
                let pid = id.to_owned();
                dc.on_message(Box::new(move |msg| {
                    let inc = inc.clone();
                    let pid = pid.clone();
                    Box::pin(async move {
                        if let Ok(env) = serde_json::from_slice::<Envelope>(&msg.data) {
                            let _ = inc.send(Message {
                                from: pid,
                                kind: env.kind,
                                payload: env.payload,
                                transport: "p2p".into(),
                            });
                        }
                    })
                }));
            }
        }
        self.channels
            .lock()
            .await
            .insert(id.into(), channels_ref.clone());
        self.peers.lock().await.insert(id.into(), pc.clone());
        Ok(pc)
    }
    pub async fn start_offer(&self, peer_id: &str) -> Result<(), GameLinkError> {
        let pc = self.peer(peer_id, true).await?;
        let offer = pc.create_offer(None).await?;
        pc.set_local_description(offer.clone()).await?;
        self.client
            .send_signal(
                peer_id,
                "webrtc_offer",
                serde_json::json!({"type":"offer","sdp":offer.sdp}),
            )
            .await?;
        Ok(())
    }
    pub async fn handle_signal(&self, signal: Signal) -> Result<(), GameLinkError> {
        let mut handled = self.handled.lock().await;
        let id = signal.id.clone();
        if handled.contains(&id) {
            self.client.acknowledge_signal(&id).await;
            return Ok(());
        }
        match signal.kind.as_str() {
            "game_relay" => {
                let kind = signal
                    .payload
                    .get("kind")
                    .and_then(Value::as_str)
                    .unwrap_or_default()
                    .to_owned();
                let payload = signal
                    .payload
                    .get("payload")
                    .cloned()
                    .unwrap_or(Value::Null);
                let _ = self.incoming.send(Message {
                    from: signal.from,
                    kind,
                    payload,
                    transport: "server-forwarding".into(),
                });
            }
            "webrtc_offer" => {
                let pc = self.peer(&signal.from, false).await?;
                let sdp = signal
                    .payload
                    .get("sdp")
                    .and_then(Value::as_str)
                    .unwrap_or_default();
                pc.set_remote_description(RTCSessionDescription::offer(sdp.to_owned())?)
                    .await?;
                self.flush_ice(&signal.from, &pc).await?;
                let answer = pc.create_answer(None).await?;
                pc.set_local_description(answer.clone()).await?;
                self.client
                    .send_signal(
                        &signal.from,
                        "webrtc_answer",
                        serde_json::json!({"type":"answer","sdp":answer.sdp}),
                    )
                    .await?;
            }
            "webrtc_answer" => {
                let pc = self.peer(&signal.from, false).await?;
                let sdp = signal
                    .payload
                    .get("sdp")
                    .and_then(Value::as_str)
                    .unwrap_or_default();
                pc.set_remote_description(RTCSessionDescription::answer(sdp.to_owned())?)
                    .await?;
                self.flush_ice(&signal.from, &pc).await?;
            }
            "webrtc_ice" => {
                let pc = self.peer(&signal.from, false).await?;
                let c = RTCIceCandidateInit {
                    candidate: signal
                        .payload
                        .get("candidate")
                        .and_then(Value::as_str)
                        .unwrap_or_default()
                        .into(),
                    sdp_mid: signal
                        .payload
                        .get("sdpMid")
                        .and_then(Value::as_str)
                        .map(str::to_owned),
                    sdp_mline_index: signal
                        .payload
                        .get("sdpMLineIndex")
                        .and_then(Value::as_u64)
                        .map(|v| v as u16),
                    username_fragment: signal
                        .payload
                        .get("usernameFragment")
                        .and_then(Value::as_str)
                        .map(str::to_owned),
                };
                if pc.remote_description().await.is_some() {
                    pc.add_ice_candidate(c).await?;
                } else {
                    self.pending_ice
                        .lock()
                        .await
                        .entry(signal.from.clone())
                        .or_default()
                        .push(c);
                }
            }
            kind if !kind.starts_with("webrtc_") => {
                let _ = self.incoming.send(Message {
                    from: signal.from,
                    kind: kind.to_owned(),
                    payload: signal.payload,
                    transport: "server-event".into(),
                });
            }
            _ => {}
        }
        handled.push_back(id.clone());
        if handled.len() > 2048 {
            handled.pop_front();
        }
        self.client.acknowledge_signal(&id).await;
        Ok(())
    }
    async fn flush_ice(&self, id: &str, pc: &Arc<RTCPeerConnection>) -> Result<(), GameLinkError> {
        let list = self.pending_ice.lock().await.remove(id).unwrap_or_default();
        for candidate in list {
            pc.add_ice_candidate(candidate).await?;
        }
        Ok(())
    }
    pub async fn send(
        &self,
        peer_id: &str,
        kind: &str,
        payload: Value,
        unreliable: bool,
    ) -> Result<(), GameLinkError> {
        let label = if unreliable { "state" } else { "control" };
        let channels = self.channels.lock().await;
        let Some(peer_channels) = channels.get(peer_id) else {
            return Err(GameLinkError::InvalidResponse(format!(
                "DataChannel {label} is not ready"
            )));
        };
        let peer_channels = peer_channels.lock().await;
        let Some(dc) = peer_channels.get(label) else {
            return Err(GameLinkError::InvalidResponse(format!(
                "DataChannel {label} is not ready"
            )));
        };
        let bytes = serde_json::to_vec(&Envelope {
            kind: kind.into(),
            payload,
        })
        .map_err(|e| GameLinkError::InvalidResponse(e.to_string()))?;
        dc.send(&bytes.into()).await?;
        Ok(())
    }
    pub async fn send_all(
        &self,
        kind: &str,
        payload: Value,
        unreliable: bool,
    ) -> Result<(), GameLinkError> {
        let ids: Vec<String> = self.peers.lock().await.keys().cloned().collect();
        for id in ids {
            self.send(&id, kind, payload.clone(), unreliable).await?
        }
        Ok(())
    }
}
