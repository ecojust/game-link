use axum::{
    Json, Router,
    extract::{ConnectInfo, Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
};
use rand::{Rng, distr::Alphanumeric};
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, VecDeque},
    net::SocketAddr,
    sync::Arc,
    time::Duration,
};
use tokio::sync::Mutex;
use tracing::info;
use uuid::Uuid;

const MAX_MEMBERS: usize = 16;
const MAX_PENDING_SIGNALS: usize = 256;

#[derive(Clone)]
struct AppState {
    inner: Arc<Mutex<ServerState>>,
    heartbeat_timeout: Duration,
}

#[derive(Default)]
struct ServerState {
    rooms: HashMap<String, Room>,
    signals: HashMap<Uuid, VecDeque<Signal>>,
}

#[derive(Clone, Serialize)]
struct Room {
    id: String,
    code: String,
    game_id: String,
    host_id: Uuid,
    members: HashMap<Uuid, Member>,
    next_ip: u16,
}

#[derive(Clone, Serialize)]
struct Member {
    id: Uuid,
    name: String,
    virtual_ip: String,
    endpoint: SocketAddr,
    last_seen: u64,
}

#[derive(Clone, Serialize, Deserialize)]
struct PublicMember {
    id: Uuid,
    name: String,
    virtual_ip: String,
    endpoint: SocketAddr,
}

#[derive(Serialize, Deserialize)]
struct RoomView {
    id: String,
    code: String,
    game_id: String,
    host_id: Uuid,
    members: Vec<PublicMember>,
}

#[derive(Serialize)]
struct RoomSummary {
    code: String,
    game_id: String,
    member_count: usize,
    max_members: usize,
}

#[derive(Serialize, Deserialize)]
struct JoinResponse {
    room: RoomView,
    self_member: PublicMember,
}

#[derive(Deserialize)]
struct CreateRequest {
    game_id: String,
    player_name: String,
}

#[derive(Deserialize)]
struct JoinRequest {
    game_id: String,
    player_name: String,
}

#[derive(Deserialize)]
struct SignalRequest {
    from: Uuid,
    to: Uuid,
    kind: String,
    payload: serde_json::Value,
}

#[derive(Serialize, Deserialize, Clone)]
struct Signal {
    from: Uuid,
    kind: String,
    payload: serde_json::Value,
    sent_at: u64,
}

#[derive(Serialize, Deserialize)]
struct PollResponse {
    signals: Vec<Signal>,
    members: Vec<PublicMember>,
    relay: RelayInfo,
}

#[derive(Serialize, Deserialize)]
struct RelayInfo {
    available: bool,
    transport: String,
}

#[derive(Serialize)]
struct ErrorBody {
    error: String,
}

#[derive(Debug)]
struct ApiError(StatusCode, String);
impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        (self.0, Json(ErrorBody { error: self.1 })).into_response()
    }
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();
    let bind = std::env::var("GAMELINK_BIND").unwrap_or_else(|_| "0.0.0.0:8080".into());
    let timeout = std::env::var("GAMELINK_HEARTBEAT_TIMEOUT_SECS")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(30u64);
    let state = AppState {
        inner: Arc::new(Mutex::new(ServerState::default())),
        heartbeat_timeout: Duration::from_secs(timeout),
    };
    let app = Router::new()
        .route("/healthz", get(health))
        .route("/v1/rooms", get(list_rooms).post(create_room))
        .route("/v1/rooms/{code}/join", post(join_room))
        .route("/v1/rooms/{code}", get(get_room))
        .route("/v1/rooms/{code}/leave", post(leave_room))
        .route("/v1/rooms/{code}/heartbeat", post(heartbeat))
        .route("/v1/rooms/{code}/signals", post(send_signal))
        .route("/v1/rooms/{code}/signals/poll", post(poll_signals))
        .route("/v1/rooms/{code}/events", post(broadcast_event))
        .with_state(state.clone());
    tokio::spawn(cleanup_loop(state.clone()));
    let listener = tokio::net::TcpListener::bind(&bind)
        .await
        .expect("bind server address");
    info!(address = %bind, "GameLink signaling server listening");
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .expect("serve HTTP");
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({"status":"ok","service":"gamelink-server"}))
}

async fn list_rooms(State(state): State<AppState>) -> Json<Vec<RoomSummary>> {
    let guard = state.inner.lock().await;
    let mut rooms: Vec<RoomSummary> = guard
        .rooms
        .values()
        .map(|room| RoomSummary {
            code: room.code.clone(),
            game_id: room.game_id.clone(),
            member_count: room.members.len(),
            max_members: MAX_MEMBERS,
        })
        .collect();
    rooms.sort_by(|a, b| a.code.cmp(&b.code));
    Json(rooms)
}

#[cfg(test)]
fn test_app() -> Router {
    Router::new()
        .route("/healthz", get(health))
        .route("/v1/rooms", get(list_rooms).post(create_room))
        .route("/v1/rooms/{code}/join", post(join_room))
        .route("/v1/rooms/{code}", get(get_room))
        .route("/v1/rooms/{code}/leave", post(leave_room))
        .route("/v1/rooms/{code}/heartbeat", post(heartbeat))
        .route("/v1/rooms/{code}/signals", post(send_signal))
        .route("/v1/rooms/{code}/signals/poll", post(poll_signals))
        .route("/v1/rooms/{code}/events", post(broadcast_event))
        .with_state(AppState {
            inner: Arc::new(Mutex::new(ServerState::default())),
            heartbeat_timeout: Duration::from_secs(30),
        })
}

async fn create_room(
    State(state): State<AppState>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    Json(req): Json<CreateRequest>,
) -> Result<(StatusCode, Json<JoinResponse>), ApiError> {
    validate_game_id(&req.game_id)?;
    validate_name(&req.player_name)?;
    let id = Uuid::new_v4();
    let code: String = rand::rng()
        .sample_iter(&Alphanumeric)
        .take(6)
        .map(char::from)
        .collect::<String>()
        .to_uppercase();
    let now = now_secs();
    let member = Member {
        id,
        name: req.player_name,
        virtual_ip: "10.77.0.2".into(),
        endpoint: peer,
        last_seen: now,
    };
    let room = Room {
        id: Uuid::new_v4().to_string(),
        code: code.clone(),
        game_id: req.game_id,
        host_id: id,
        members: HashMap::from([(id, member.clone())]),
        next_ip: 3,
    };
    let view = room_view(&room);
    let mut guard = state.inner.lock().await;
    guard.rooms.insert(code, room);
    Ok((
        StatusCode::CREATED,
        Json(JoinResponse {
            room: view,
            self_member: public_member(&member),
        }),
    ))
}

async fn join_room(
    State(state): State<AppState>,
    Path(code): Path<String>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    Json(req): Json<JoinRequest>,
) -> Result<Json<JoinResponse>, ApiError> {
    validate_game_id(&req.game_id)?;
    validate_name(&req.player_name)?;
    let mut guard = state.inner.lock().await;
    let room = guard
        .rooms
        .get_mut(&normalize_code(&code))
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "room not found".into()))?;
    if room.game_id != req.game_id {
        return Err(ApiError(
            StatusCode::CONFLICT,
            format!("game_id mismatch: room is for {}", room.game_id),
        ));
    }
    if room.members.len() >= MAX_MEMBERS {
        return Err(ApiError(StatusCode::CONFLICT, "room is full".into()));
    }
    let id = Uuid::new_v4();
    let ip = format!("10.77.0.{}", room.next_ip);
    room.next_ip = room.next_ip.saturating_add(1);
    let member = Member {
        id,
        name: req.player_name,
        virtual_ip: ip,
        endpoint: peer,
        last_seen: now_secs(),
    };
    room.members.insert(id, member.clone());
    Ok(Json(JoinResponse {
        room: room_view(room),
        self_member: public_member(&member),
    }))
}

async fn get_room(
    State(state): State<AppState>,
    Path(code): Path<String>,
) -> Result<Json<RoomView>, ApiError> {
    let guard = state.inner.lock().await;
    let room = guard
        .rooms
        .get(&normalize_code(&code))
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "room not found".into()))?;
    Ok(Json(room_view(room)))
}

async fn leave_room(
    State(state): State<AppState>,
    Path(code): Path<String>,
    Json(req): Json<MemberRequest>,
) -> Result<StatusCode, ApiError> {
    let mut guard = state.inner.lock().await;
    remove_member(&mut guard, &normalize_code(&code), req.member_id)?;
    Ok(StatusCode::NO_CONTENT)
}

#[derive(Deserialize)]
struct MemberRequest {
    member_id: Uuid,
}

async fn heartbeat(
    State(state): State<AppState>,
    Path(code): Path<String>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    Json(req): Json<MemberRequest>,
) -> Result<StatusCode, ApiError> {
    let mut guard = state.inner.lock().await;
    let room = guard
        .rooms
        .get_mut(&normalize_code(&code))
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "room not found".into()))?;
    let member = room
        .members
        .get_mut(&req.member_id)
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "member not found".into()))?;
    member.endpoint = peer;
    member.last_seen = now_secs();
    Ok(StatusCode::NO_CONTENT)
}

async fn send_signal(
    State(state): State<AppState>,
    Path(code): Path<String>,
    Json(req): Json<SignalRequest>,
) -> Result<StatusCode, ApiError> {
    if req.kind.len() > 32 {
        return Err(ApiError(
            StatusCode::BAD_REQUEST,
            "signal kind is too long".into(),
        ));
    }
    let mut guard = state.inner.lock().await;
    let room = guard
        .rooms
        .get(&normalize_code(&code))
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "room not found".into()))?;
    if !room.members.contains_key(&req.from) || !room.members.contains_key(&req.to) {
        return Err(ApiError(
            StatusCode::FORBIDDEN,
            "sender and recipient must belong to the room".into(),
        ));
    }
    let queue = guard.signals.entry(req.to).or_default();
    if queue.len() >= MAX_PENDING_SIGNALS {
        return Err(ApiError(
            StatusCode::TOO_MANY_REQUESTS,
            "recipient signal queue is full".into(),
        ));
    }
    queue.push_back(Signal {
        from: req.from,
        kind: req.kind,
        payload: req.payload,
        sent_at: now_secs(),
    });
    Ok(StatusCode::ACCEPTED)
}

#[derive(Deserialize)]
struct BroadcastRequest {
    from: Uuid,
    kind: String,
    payload: serde_json::Value,
}

async fn broadcast_event(
    State(state): State<AppState>,
    Path(code): Path<String>,
    Json(req): Json<BroadcastRequest>,
) -> Result<StatusCode, ApiError> {
    if req.kind.len() > 32 {
        return Err(ApiError(
            StatusCode::BAD_REQUEST,
            "event kind is too long".into(),
        ));
    }
    let mut guard = state.inner.lock().await;
    let room = guard
        .rooms
        .get(&normalize_code(&code))
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "room not found".into()))?;
    if !room.members.contains_key(&req.from) {
        return Err(ApiError(
            StatusCode::FORBIDDEN,
            "sender must belong to the room".into(),
        ));
    }
    let recipients: Vec<Uuid> = room
        .members
        .keys()
        .copied()
        .filter(|id| *id != req.from)
        .collect();
    if recipients.iter().any(|id| {
        guard
            .signals
            .get(id)
            .is_some_and(|queue| queue.len() >= MAX_PENDING_SIGNALS)
    }) {
        return Err(ApiError(
            StatusCode::TOO_MANY_REQUESTS,
            "room event queue is full".into(),
        ));
    }
    let sent_at = now_secs();
    for recipient in recipients {
        guard
            .signals
            .entry(recipient)
            .or_default()
            .push_back(Signal {
                from: req.from,
                kind: req.kind.clone(),
                payload: req.payload.clone(),
                sent_at,
            });
    }
    Ok(StatusCode::ACCEPTED)
}

async fn poll_signals(
    State(state): State<AppState>,
    Path(code): Path<String>,
    Json(req): Json<MemberRequest>,
) -> Result<Json<PollResponse>, ApiError> {
    let mut guard = state.inner.lock().await;
    let room = guard
        .rooms
        .get_mut(&normalize_code(&code))
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "room not found".into()))?;
    let member = room
        .members
        .get_mut(&req.member_id)
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "member not found".into()))?;
    member.last_seen = now_secs();
    let members = room
        .members
        .values()
        .filter(|m| m.id != req.member_id)
        .map(public_member)
        .collect();
    let signals = guard
        .signals
        .remove(&req.member_id)
        .unwrap_or_default()
        .into_iter()
        .collect();
    Ok(Json(PollResponse {
        signals,
        members,
        relay: RelayInfo {
            available: false,
            transport: "udp-relay-v1 (not enabled)".into(),
        },
    }))
}

fn remove_member(state: &mut ServerState, code: &str, member_id: Uuid) -> Result<(), ApiError> {
    let room = state
        .rooms
        .get_mut(code)
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "room not found".into()))?;
    if room.members.remove(&member_id).is_none() {
        return Err(ApiError(StatusCode::NOT_FOUND, "member not found".into()));
    }
    state.signals.remove(&member_id);
    if room.members.is_empty() {
        state.rooms.remove(code);
    } else if room.host_id == member_id {
        room.host_id = *room.members.keys().next().expect("room has members");
    }
    Ok(())
}

async fn cleanup_loop(state: AppState) {
    let mut interval = tokio::time::interval(Duration::from_secs(5));
    loop {
        interval.tick().await;
        let cutoff = now_secs().saturating_sub(state.heartbeat_timeout.as_secs());
        let mut guard = state.inner.lock().await;
        let mut removed = Vec::new();
        let mut stale_all = Vec::new();
        for (code, room) in guard.rooms.iter_mut() {
            let stale: Vec<Uuid> = room
                .members
                .values()
                .filter(|m| m.last_seen < cutoff)
                .map(|m| m.id)
                .collect();
            for member in stale {
                room.members.remove(&member);
                stale_all.push(member);
            }
            if room.members.is_empty() {
                removed.push(code.clone());
            } else if !room.members.contains_key(&room.host_id) {
                room.host_id = *room.members.keys().next().unwrap();
            }
        }
        for member in stale_all {
            guard.signals.remove(&member);
        }
        for code in removed {
            guard.rooms.remove(&code);
        }
    }
}

fn public_member(member: &Member) -> PublicMember {
    PublicMember {
        id: member.id,
        name: member.name.clone(),
        virtual_ip: member.virtual_ip.clone(),
        endpoint: member.endpoint,
    }
}
fn room_view(room: &Room) -> RoomView {
    RoomView {
        id: room.id.clone(),
        code: room.code.clone(),
        game_id: room.game_id.clone(),
        host_id: room.host_id,
        members: room.members.values().map(public_member).collect(),
    }
}
fn validate_game_id(game_id: &str) -> Result<(), ApiError> {
    let valid = !game_id.is_empty()
        && game_id.len() <= 64
        && game_id
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_' | b'.'));
    if valid {
        Ok(())
    } else {
        Err(ApiError(
            StatusCode::BAD_REQUEST,
            "game_id must be 1 to 64 ASCII letters, digits, '.', '_' or '-'".into(),
        ))
    }
}
fn validate_name(name: &str) -> Result<(), ApiError> {
    if name.trim().is_empty() || name.len() > 32 {
        Err(ApiError(
            StatusCode::BAD_REQUEST,
            "player_name must contain 1 to 32 bytes".into(),
        ))
    } else {
        Ok(())
    }
}
fn normalize_code(code: &str) -> String {
    code.trim().to_ascii_uppercase()
}
fn now_secs() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::extract::connect_info::MockConnectInfo;
    use http_body_util::BodyExt;
    use tower::ServiceExt;
    #[test]
    fn code_normalization_is_case_insensitive() {
        assert_eq!(normalize_code(" ab12cd "), "AB12CD");
    }
    #[test]
    fn removing_host_keeps_room_and_promotes_member() {
        let host = Uuid::new_v4();
        let guest = Uuid::new_v4();
        let member = |id, ip: &str| Member {
            id,
            name: "p".into(),
            virtual_ip: ip.into(),
            endpoint: "127.0.0.1:1000".parse().unwrap(),
            last_seen: 1,
        };
        let mut state = ServerState {
            rooms: HashMap::from([(
                "ABC123".into(),
                Room {
                    id: "r".into(),
                    code: "ABC123".into(),
                    game_id: "tank-arena".into(),
                    host_id: host,
                    members: HashMap::from([
                        (host, member(host, "10.77.0.2")),
                        (guest, member(guest, "10.77.0.3")),
                    ]),
                    next_ip: 4,
                },
            )]),
            signals: HashMap::new(),
        };
        remove_member(&mut state, "ABC123", host).unwrap();
        assert_eq!(state.rooms["ABC123"].host_id, guest);
        assert_eq!(state.rooms["ABC123"].members.len(), 1);
    }
    #[test]
    fn removing_last_member_deletes_room() {
        let id = Uuid::new_v4();
        let mut state = ServerState {
            rooms: HashMap::from([(
                "ABC123".into(),
                Room {
                    id: "r".into(),
                    code: "ABC123".into(),
                    game_id: "tank-arena".into(),
                    host_id: id,
                    members: HashMap::from([(
                        id,
                        Member {
                            id,
                            name: "p".into(),
                            virtual_ip: "10.77.0.2".into(),
                            endpoint: "127.0.0.1:1000".parse().unwrap(),
                            last_seen: 1,
                        },
                    )]),
                    next_ip: 3,
                },
            )]),
            signals: HashMap::new(),
        };
        remove_member(&mut state, "ABC123", id).unwrap();
        assert!(state.rooms.is_empty());
    }
    #[tokio::test]
    async fn create_join_discover_and_leave_room() {
        let app = test_app().layer(MockConnectInfo(
            "127.0.0.1:12345".parse::<SocketAddr>().unwrap(),
        ));
        let response = app
            .clone()
            .oneshot(
                axum::http::Request::builder()
                    .method("POST")
                    .uri("/v1/rooms")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"game_id":"tank-arena","player_name":"host"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::CREATED);
        let bytes = response.into_body().collect().await.unwrap().to_bytes();
        let created: JoinResponse = serde_json::from_slice(&bytes).unwrap();
        assert_eq!(created.self_member.virtual_ip, "10.77.0.2");
        let response = app
            .clone()
            .oneshot(
                axum::http::Request::builder()
                    .method("POST")
                    .uri(format!("/v1/rooms/{}/join", created.room.code))
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"game_id":"tank-arena","player_name":"guest"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let bytes = response.into_body().collect().await.unwrap().to_bytes();
        let joined: JoinResponse = serde_json::from_slice(&bytes).unwrap();
        assert_eq!(joined.self_member.virtual_ip, "10.77.0.3");
        let response = app
            .clone()
            .oneshot(
                axum::http::Request::builder()
                    .uri(format!("/v1/rooms/{}", created.room.code))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let response = app
            .oneshot(
                axum::http::Request::builder()
                    .method("POST")
                    .uri(format!("/v1/rooms/{}/leave", created.room.code))
                    .header("content-type", "application/json")
                    .body(Body::from(
                        serde_json::json!({"member_id":joined.self_member.id}).to_string(),
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::NO_CONTENT);
    }
    #[tokio::test]
    async fn signaling_is_room_scoped_and_pollable() {
        let app = test_app().layer(MockConnectInfo(
            "127.0.0.1:12345".parse::<SocketAddr>().unwrap(),
        ));
        let response = app
            .clone()
            .oneshot(
                axum::http::Request::builder()
                    .method("POST")
                    .uri("/v1/rooms")
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"game_id":"tank-arena","player_name":"host"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        let created: JoinResponse =
            serde_json::from_slice(&response.into_body().collect().await.unwrap().to_bytes())
                .unwrap();
        let response = app
            .clone()
            .oneshot(
                axum::http::Request::builder()
                    .method("POST")
                    .uri(format!("/v1/rooms/{}/join", created.room.code))
                    .header("content-type", "application/json")
                    .body(Body::from(r#"{"game_id":"tank-arena","player_name":"guest"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        let joined: JoinResponse =
            serde_json::from_slice(&response.into_body().collect().await.unwrap().to_bytes())
                .unwrap();
        let signal = serde_json::json!({"from":created.self_member.id,"to":joined.self_member.id,"kind":"offer","payload":{"sdp":"test"}}).to_string();
        let response = app
            .clone()
            .oneshot(
                axum::http::Request::builder()
                    .method("POST")
                    .uri(format!("/v1/rooms/{}/signals", created.room.code))
                    .header("content-type", "application/json")
                    .body(Body::from(signal))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::ACCEPTED);
        let poll = serde_json::json!({"member_id":joined.self_member.id}).to_string();
        let response = app
            .clone()
            .oneshot(
                axum::http::Request::builder()
                    .method("POST")
                    .uri(format!("/v1/rooms/{}/signals/poll", created.room.code))
                    .header("content-type", "application/json")
                    .body(Body::from(poll))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body: PollResponse =
            serde_json::from_slice(&response.into_body().collect().await.unwrap().to_bytes())
                .unwrap();
        assert_eq!(body.signals.len(), 1);
        assert_eq!(body.signals[0].kind, "offer");
        assert_eq!(body.members.len(), 1);
        assert!(!body.relay.available);
    }
}
