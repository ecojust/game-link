use axum::{
    Json, Router,
    extract::{ConnectInfo, DefaultBodyLimit, Path, State},
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
use tokio::sync::{Mutex, Notify, RwLock};
use tracing::info;
use uuid::Uuid;
const MAX_MEMBERS: usize = 4;
const MAX_PENDING_SIGNALS: usize = 256;
const MAX_SIGNAL_BYTES: usize = 64 * 1024;
const MAX_QUEUE_BYTES: usize = 256 * 1024;
const SIGNAL_TTL: u64 = 60;
const LONG_POLL_MS: u64 = 15_000;
#[derive(Clone)]
struct AppState {
    inner: Arc<RwLock<HashMap<String, Arc<RoomCell>>>>,
    heartbeat_timeout: Duration,
}
struct RoomCell {
    inner: Mutex<Room>,
    changed: Notify,
}
struct Room {
    id: String,
    code: String,
    game_id: String,
    members: HashMap<Uuid, Member>,
    next_ip: u16,
    empty_expires_at: Option<u64>,
    signals: HashMap<Uuid, VecDeque<Signal>>,
    revision: u64,
    closed: bool,
    generations: HashMap<(Uuid, Uuid), u64>,
}
impl RoomCell {
    fn new(room: Room) -> Self {
        Self {
            inner: Mutex::new(room),
            changed: Notify::new(),
        }
    }
}
#[derive(Clone, Serialize)]
struct Member {
    id: Uuid,
    name: String,
    virtual_ip: String,
    endpoint: SocketAddr,
    last_seen: u64,
    #[serde(skip)]
    resume_token: Uuid,
    #[serde(skip)]
    handoff_token: Option<Uuid>,
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
    resume_token: Uuid,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    handoff_token: Option<Uuid>,
}

#[derive(Deserialize)]
struct CreateRequest {
    game_id: String,
    player_name: String,
    #[serde(default)]
    handoff: bool,
    #[serde(default)]
    create_only: bool,
}

#[derive(Deserialize)]
struct JoinRequest {
    game_id: String,
    player_name: String,
    #[serde(default)]
    resume_token: Option<Uuid>,
    #[serde(default)]
    handoff_token: Option<Uuid>,
}

#[derive(Deserialize)]
struct SignalRequest {
    auth_token: Uuid,
    from: Uuid,
    to: Uuid,
    kind: String,
    payload: serde_json::Value,
}

#[derive(Serialize, Deserialize, Clone)]
struct Signal {
    #[serde(skip)]
    bytes: usize,
    id: Uuid,
    from: Uuid,
    kind: String,
    payload: serde_json::Value,
    sent_at: u64,
}

#[derive(Serialize, Deserialize)]
struct PollResponse {
    revision: u64,
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

// SDK calls carry no cookies; deployments may restrict the origin allowlist.
async fn cors(request: axum::extract::Request, next: axum::middleware::Next) -> Response {
    let origin = request.headers().get("origin").cloned();
    let allowed = std::env::var("GAMELINK_ALLOWED_ORIGINS").unwrap_or_else(|_| "*".into());
    let permitted = origin.as_ref().is_some_and(|o| {
        allowed == "*"
            || o.to_str()
                .is_ok_and(|o| allowed.split(',').any(|a| a.trim() == o))
    });
    let mut response = if request.method() == axum::http::Method::OPTIONS {
        StatusCode::NO_CONTENT.into_response()
    } else {
        next.run(request).await
    };
    if permitted {
        let headers = response.headers_mut();
        headers.insert("access-control-allow-origin", origin.unwrap());
        headers.insert("vary", "Origin".parse().unwrap());
        headers.insert(
            "access-control-allow-methods",
            "GET, POST, OPTIONS".parse().unwrap(),
        );
        headers.insert(
            "access-control-allow-headers",
            "Content-Type".parse().unwrap(),
        );
    }
    response
}

fn router(state: AppState) -> Router {
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
        .layer(DefaultBodyLimit::max(96 * 1024))
        .layer(axum::middleware::from_fn(cors))
        .with_state(state)
}
#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();
    let bind = std::env::var("GAMELINK_BIND").unwrap_or_else(|_| "0.0.0.0:8080".into());
    let timeout = std::env::var("GAMELINK_HEARTBEAT_TIMEOUT_SECS")
        .ok()
        .and_then(|v| v.parse::<u64>().ok())
        .unwrap_or(30)
        .max(20);
    let state = AppState {
        inner: Arc::new(RwLock::new(HashMap::new())),
        heartbeat_timeout: Duration::from_secs(timeout),
    };
    tokio::spawn(cleanup_loop(state.clone()));
    let listener = tokio::net::TcpListener::bind(&bind)
        .await
        .expect("bind server");
    info!(address=%bind,version="1.2.0","GameLink signaling server listening");
    axum::serve(
        listener,
        router(state).into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .expect("serve HTTP");
}
async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({"status":"ok","service":"gamelink-server","version":"1.2.0"}))
}
async fn room_cell(state: &AppState, code: &str) -> Result<Arc<RoomCell>, ApiError> {
    state
        .inner
        .read()
        .await
        .get(&normalize_code(code))
        .cloned()
        .ok_or_else(|| ApiError(StatusCode::NOT_FOUND, "room not found".into()))
}
fn auth(room: &Room, id: Uuid, token: Uuid) -> Result<(), ApiError> {
    if room.closed {
        return Err(ApiError(StatusCode::GONE, "room closed".into()));
    }
    match room.members.get(&id) {
        Some(m) if m.resume_token == token => Ok(()),
        _ => Err(ApiError(
            StatusCode::UNAUTHORIZED,
            "invalid member credential".into(),
        )),
    }
}
async fn list_rooms(State(state): State<AppState>) -> Json<Vec<RoomSummary>> {
    let cells: Vec<_> = state.inner.read().await.values().cloned().collect();
    let mut rooms = Vec::new();
    for cell in cells {
        let r = cell.inner.lock().await;
        if !r.closed {
            rooms.push(RoomSummary {
                code: r.code.clone(),
                game_id: r.game_id.clone(),
                member_count: r.members.len(),
                max_members: MAX_MEMBERS,
            })
        }
    }
    rooms.sort_by(|a, b| a.code.cmp(&b.code));
    Json(rooms)
}
async fn create_room(
    State(state): State<AppState>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    Json(req): Json<CreateRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), ApiError> {
    validate_game_id(&req.game_id)?;
    validate_name(&req.player_name)?;
    let mut directory = state.inner.write().await;
    let code = loop {
        let code = rand::rng()
            .sample_iter(&Alphanumeric)
            .take(6)
            .map(char::from)
            .collect::<String>()
            .to_uppercase();
        if !directory.contains_key(&code) {
            break code;
        }
    };
    let member = Member {
        id: Uuid::new_v4(),
        name: req.player_name,
        virtual_ip: "10.77.0.2".into(),
        endpoint: peer,
        last_seen: now_secs(),
        resume_token: Uuid::new_v4(),
        handoff_token: req.handoff.then(Uuid::new_v4),
    };
    let room = Room {
        id: Uuid::new_v4().to_string(),
        code: code.clone(),
        game_id: req.game_id,
        members: if req.create_only {
            HashMap::new()
        } else {
            HashMap::from([(member.id, member.clone())])
        },
        next_ip: if req.create_only { 2 } else { 3 },
        empty_expires_at: req.create_only.then(|| now_secs() + 120),
        signals: HashMap::new(),
        revision: 1,
        closed: false,
        generations: HashMap::new(),
    };
    let view = room_view(&room);
    let response = if req.create_only {
        serde_json::json!({"room":view})
    } else {
        serde_json::to_value(JoinResponse {
            room: view,
            self_member: public_member(&member),
            resume_token: member.resume_token,
            handoff_token: member.handoff_token,
        })
        .unwrap()
    };
    directory.insert(code, Arc::new(RoomCell::new(room)));
    Ok((StatusCode::CREATED, Json(response)))
}
async fn join_room(
    State(state): State<AppState>,
    Path(code): Path<String>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    Json(req): Json<JoinRequest>,
) -> Result<Json<JoinResponse>, ApiError> {
    validate_game_id(&req.game_id)?;
    validate_name(&req.player_name)?;
    let cell = room_cell(&state, &code).await?;
    let mut r = cell.inner.lock().await;
    if r.closed || r.empty_expires_at.is_some_and(|at| now_secs() >= at) {
        return Err(ApiError(StatusCode::GONE, "room expired".into()));
    }
    if r.game_id != req.game_id {
        return Err(ApiError(StatusCode::CONFLICT, "game_id mismatch".into()));
    }
    let resumed = if let Some(token) = req.handoff_token {
        Some(
            r.members
                .values()
                .find(|m| m.handoff_token == Some(token) && m.last_seen + 120 >= now_secs())
                .map(|m| m.id)
                .ok_or_else(|| {
                    ApiError(
                        StatusCode::UNAUTHORIZED,
                        "handoff token expired or already used".into(),
                    )
                })?,
        )
    } else if let Some(token) = req.resume_token {
        Some(
            r.members
                .values()
                .find(|m| m.resume_token == token)
                .map(|m| m.id)
                .ok_or_else(|| ApiError(StatusCode::UNAUTHORIZED, "resume token expired".into()))?,
        )
    } else {
        None
    };
    let member = if let Some(id) = resumed {
        let m = r.members.get_mut(&id).unwrap();
        m.name = req.player_name;
        m.endpoint = peer;
        m.last_seen = now_secs();
        if req.handoff_token.is_some() {
            m.handoff_token = None;
            m.resume_token = Uuid::new_v4()
        }
        let member = m.clone();
        clear_member_signals(&mut r, id);
        member
    } else {
        if r.members.len() >= MAX_MEMBERS {
            return Err(ApiError(StatusCode::CONFLICT, "room is full".into()));
        }
        let m = Member {
            id: Uuid::new_v4(),
            name: req.player_name,
            virtual_ip: format!("10.77.0.{}", r.next_ip),
            endpoint: peer,
            last_seen: now_secs(),
            resume_token: Uuid::new_v4(),
            handoff_token: None,
        };
        r.next_ip = r.next_ip.saturating_add(1);
        r.members.insert(m.id, m.clone());
        m
    };
    r.empty_expires_at = None;
    r.revision += 1;
    let response = JoinResponse {
        room: room_view(&r),
        self_member: public_member(&member),
        resume_token: member.resume_token,
        handoff_token: None,
    };
    drop(r);
    cell.changed.notify_waiters();
    Ok(Json(response))
}
async fn get_room(
    State(state): State<AppState>,
    Path(code): Path<String>,
) -> Result<Json<RoomView>, ApiError> {
    let cell = room_cell(&state, &code).await?;
    let r = cell.inner.lock().await;
    if r.closed {
        return Err(ApiError(StatusCode::GONE, "room closed".into()));
    }
    Ok(Json(room_view(&r)))
}
#[derive(Deserialize)]
struct MemberRequest {
    member_id: Uuid,
    auth_token: Uuid,
}
#[derive(Deserialize)]
struct PollRequest {
    member_id: Uuid,
    auth_token: Uuid,
    #[serde(default)]
    ack_ids: Vec<Uuid>,
    #[serde(default)]
    revision: Option<u64>,
    #[serde(default)]
    wait_ms: u64,
}
async fn delete_closed(state: &AppState, code: &str, cell: &Arc<RoomCell>) {
    let mut dir = state.inner.write().await;
    if dir.get(code).is_some_and(|other| Arc::ptr_eq(other, cell)) {
        dir.remove(code);
    }
}
async fn leave_room(
    State(state): State<AppState>,
    Path(code): Path<String>,
    Json(req): Json<MemberRequest>,
) -> Result<StatusCode, ApiError> {
    let cell = room_cell(&state, &code).await?;
    let mut r = cell.inner.lock().await;
    auth(&r, req.member_id, req.auth_token)?;
    remove_member(&mut r, req.member_id);
    let closed = r.closed;
    let code = r.code.clone();
    drop(r);
    cell.changed.notify_waiters();
    if closed {
        delete_closed(&state, &code, &cell).await
    }
    Ok(StatusCode::NO_CONTENT)
}
async fn heartbeat(
    State(state): State<AppState>,
    Path(code): Path<String>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    Json(req): Json<MemberRequest>,
) -> Result<StatusCode, ApiError> {
    let cell = room_cell(&state, &code).await?;
    let mut r = cell.inner.lock().await;
    auth(&r, req.member_id, req.auth_token)?;
    let m = r.members.get_mut(&req.member_id).unwrap();
    m.endpoint = peer;
    m.last_seen = now_secs();
    Ok(StatusCode::NO_CONTENT)
}
fn prune_signals(r: &mut Room) {
    let now = now_secs();
    r.signals.retain(|_, queue| {
        queue.retain(|s| now.saturating_sub(s.sent_at) < SIGNAL_TTL);
        !queue.is_empty()
    });
}
fn signal_bytes(s: &Signal) -> usize {
    s.bytes
}
fn measure_signal(mut s: Signal) -> Signal {
    s.bytes = serde_json::to_vec(&s).map_or(MAX_SIGNAL_BYTES + 1, |b| b.len());
    s
}
fn ensure_capacity(r: &Room, to: Uuid, size: usize) -> Result<(), ApiError> {
    if size > MAX_SIGNAL_BYTES {
        return Err(ApiError(
            StatusCode::PAYLOAD_TOO_LARGE,
            "signal exceeds 64 KiB".into(),
        ));
    }
    if let Some(q) = r.signals.get(&to) {
        if q.len() >= MAX_PENDING_SIGNALS
            || q.iter().map(signal_bytes).sum::<usize>() + size > MAX_QUEUE_BYTES
        {
            return Err(ApiError(
                StatusCode::TOO_MANY_REQUESTS,
                "recipient signal queue is full".into(),
            ));
        }
    }
    Ok(())
}
fn enqueue(r: &mut Room, to: Uuid, signal: Signal) -> Result<(), ApiError> {
    let signal = measure_signal(signal);
    if signal.bytes > MAX_SIGNAL_BYTES {
        return Err(ApiError(
            StatusCode::PAYLOAD_TOO_LARGE,
            "signal exceeds 64 KiB".into(),
        ));
    }
    prune_signals(r);
    if signal.kind.starts_with("webrtc_") {
        if let Some(g) = signal.payload.get("generation").and_then(|v| v.as_u64()) {
            let pair = if signal.from < to {
                (signal.from, to)
            } else {
                (to, signal.from)
            };
            let previous = r.generations.get(&pair).copied().unwrap_or(0);
            if g < previous {
                return Ok(());
            }
            if g > previous {
                for (recipient, q) in &mut r.signals {
                    q.retain(|s| {
                        !((*recipient == to && s.from == signal.from)
                            || (*recipient == signal.from && s.from == to))
                            || !s.kind.starts_with("webrtc_")
                            || s.payload
                                .get("generation")
                                .and_then(|v| v.as_u64())
                                .is_none_or(|v| v >= g)
                    })
                }
                r.generations.insert(pair, g);
            }
        }
    }
    ensure_capacity(r, to, signal_bytes(&signal))?;
    r.signals.entry(to).or_default().push_back(signal);
    Ok(())
}
async fn send_signal(
    State(state): State<AppState>,
    Path(code): Path<String>,
    Json(req): Json<SignalRequest>,
) -> Result<StatusCode, ApiError> {
    if req.kind.is_empty() || req.kind.len() > 32 {
        return Err(ApiError(
            StatusCode::BAD_REQUEST,
            "invalid signal kind".into(),
        ));
    }
    let cell = room_cell(&state, &code).await?;
    let mut r = cell.inner.lock().await;
    auth(&r, req.from, req.auth_token)?;
    if req.from == req.to || !r.members.contains_key(&req.to) {
        return Err(ApiError(
            StatusCode::FORBIDDEN,
            "recipient must be another room member".into(),
        ));
    }
    enqueue(
        &mut r,
        req.to,
        Signal {
            bytes: 0,
            id: Uuid::new_v4(),
            from: req.from,
            kind: req.kind,
            payload: req.payload,
            sent_at: now_secs(),
        },
    )?;
    drop(r);
    cell.changed.notify_waiters();
    Ok(StatusCode::ACCEPTED)
}
#[derive(Deserialize)]
struct BroadcastRequest {
    from: Uuid,
    auth_token: Uuid,
    kind: String,
    payload: serde_json::Value,
}
async fn broadcast_event(
    State(state): State<AppState>,
    Path(code): Path<String>,
    Json(req): Json<BroadcastRequest>,
) -> Result<StatusCode, ApiError> {
    if req.kind.is_empty() || req.kind.len() > 32 {
        return Err(ApiError(
            StatusCode::BAD_REQUEST,
            "invalid event kind".into(),
        ));
    }
    let cell = room_cell(&state, &code).await?;
    let mut r = cell.inner.lock().await;
    auth(&r, req.from, req.auth_token)?;
    prune_signals(&mut r);
    let recipients: Vec<_> = r
        .members
        .keys()
        .copied()
        .filter(|id| *id != req.from)
        .collect();
    let signal = measure_signal(Signal {
        bytes: 0,
        id: Uuid::new_v4(),
        from: req.from,
        kind: req.kind,
        payload: req.payload,
        sent_at: now_secs(),
    });
    let size = signal_bytes(&signal);
    for id in &recipients {
        ensure_capacity(&r, *id, size)?
    }
    for id in recipients {
        r.signals.entry(id).or_default().push_back(signal.clone());
    }
    drop(r);
    cell.changed.notify_waiters();
    Ok(StatusCode::ACCEPTED)
}
async fn poll_signals(
    State(state): State<AppState>,
    Path(code): Path<String>,
    Json(req): Json<PollRequest>,
) -> Result<Json<PollResponse>, ApiError> {
    if req.ack_ids.len() > MAX_PENDING_SIGNALS {
        return Err(ApiError(
            StatusCode::BAD_REQUEST,
            "too many acknowledgements".into(),
        ));
    }
    let cell = room_cell(&state, &code).await?;
    let deadline =
        tokio::time::Instant::now() + Duration::from_millis(req.wait_ms.min(LONG_POLL_MS));
    let mut first = true;
    loop {
        // Register before checking state to avoid losing a notification between checking and awaiting.
        let notified = cell.changed.notified();
        tokio::pin!(notified);
        notified.as_mut().enable();
        let mut r = cell.inner.lock().await;
        auth(&r, req.member_id, req.auth_token)?;
        r.members.get_mut(&req.member_id).unwrap().last_seen = now_secs();
        prune_signals(&mut r);
        if first {
            if let Some(q) = r.signals.get_mut(&req.member_id) {
                q.retain(|s| !req.ack_ids.contains(&s.id));
            }
            first = false;
        }
        let has_signals = r.signals.get(&req.member_id).is_some_and(|q| !q.is_empty());
        if has_signals
            || req.revision != Some(r.revision)
            || tokio::time::Instant::now() >= deadline
        {
            let response = PollResponse {
                revision: r.revision,
                signals: r
                    .signals
                    .get(&req.member_id)
                    .map(|q| q.iter().cloned().collect())
                    .unwrap_or_default(),
                members: r
                    .members
                    .values()
                    .filter(|m| m.id != req.member_id)
                    .map(public_member)
                    .collect(),
                relay: RelayInfo {
                    available: false,
                    transport: "p2p-only".into(),
                },
            };
            return Ok(Json(response));
        }
        drop(r);
        let _ = tokio::time::timeout_at(deadline, notified).await;
    }
}
fn clear_member_signals(r: &mut Room, id: Uuid) {
    r.signals.remove(&id);
    for q in r.signals.values_mut() {
        q.retain(|s| s.from != id);
    }
    r.generations.retain(|(a, b), _| *a != id && *b != id);
}
fn remove_member(r: &mut Room, id: Uuid) {
    r.members.remove(&id);
    clear_member_signals(r, id);
    r.revision += 1;
    if r.members.is_empty() {
        r.closed = true
    }
}
async fn cleanup_loop(state: AppState) {
    let mut interval = tokio::time::interval(Duration::from_secs(5));
    loop {
        interval.tick().await;
        let cells: Vec<_> = state.inner.read().await.values().cloned().collect();
        for cell in cells {
            let mut r = cell.inner.lock().await;
            let now = now_secs();
            let cutoff = now.saturating_sub(state.heartbeat_timeout.as_secs());
            let stale: Vec<_> = r
                .members
                .values()
                .filter(|m| {
                    m.last_seen < cutoff && !(m.handoff_token.is_some() && m.last_seen + 120 >= now)
                })
                .map(|m| m.id)
                .collect();
            let changed = !stale.is_empty();
            for id in stale {
                remove_member(&mut r, id)
            }
            prune_signals(&mut r);
            if r.members.is_empty() && r.empty_expires_at.is_none_or(|at| now >= at) {
                r.closed = true
            }
            let closed = r.closed;
            let code = r.code.clone();
            drop(r);
            if changed || closed {
                cell.changed.notify_waiters()
            }
            if closed {
                delete_closed(&state, &code, &cell).await
            }
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
fn test_app() -> Router {
    router(AppState {
        inner: Arc::new(RwLock::new(HashMap::new())),
        heartbeat_timeout: Duration::from_secs(30),
    })
}
#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::extract::connect_info::MockConnectInfo;
    use http_body_util::BodyExt;
    use tower::ServiceExt;
    #[tokio::test]
    async fn handoff_is_single_use_without_room_owner_role() {
        let app = test_app()
            .layer(axum::middleware::from_fn(cors))
            .layer(MockConnectInfo(
                "127.0.0.1:12345".parse::<SocketAddr>().unwrap(),
            ));
        let request = |path: String, body: serde_json::Value| {
            axum::http::Request::builder()
                .method("POST")
                .uri(path)
                .header("content-type", "application/json")
                .body(Body::from(body.to_string()))
                .unwrap()
        };
        let created = app
            .clone()
            .oneshot(request(
                "/v1/rooms".into(),
                serde_json::json!({"game_id":"tank-arena", "player_name":"host", "handoff":true}),
            ))
            .await
            .unwrap();
        assert_eq!(created.status(), StatusCode::CREATED);
        let created: JoinResponse =
            serde_json::from_slice(&created.into_body().collect().await.unwrap().to_bytes())
                .unwrap();
        let payload = serde_json::json!({"game_id":"tank-arena", "player_name":"host", "handoff_token":created.handoff_token.unwrap()});
        let path = format!("/v1/rooms/{}/join", created.room.code);
        let joined = app
            .clone()
            .oneshot(request(path.clone(), payload.clone()))
            .await
            .unwrap();
        assert_eq!(joined.status(), StatusCode::OK);
        let joined: JoinResponse =
            serde_json::from_slice(&joined.into_body().collect().await.unwrap().to_bytes())
                .unwrap();
        assert_eq!(joined.self_member.id, created.self_member.id);
        assert_eq!(joined.room.members.len(), 1);
        assert!(joined.handoff_token.is_none());
        assert_ne!(joined.resume_token, created.resume_token);
        let replay = app.clone().oneshot(request(path, payload)).await.unwrap();
        assert_eq!(replay.status(), StatusCode::UNAUTHORIZED);
        let preflight = app
            .oneshot(
                axum::http::Request::builder()
                    .method("OPTIONS")
                    .uri("/v1/rooms")
                    .header("origin", "https://example.org")
                    .header("access-control-request-method", "POST")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(preflight.status(), StatusCode::NO_CONTENT);
        assert_eq!(
            preflight.headers()["access-control-allow-origin"],
            "https://example.org"
        );
    }
    #[test]
    fn code_normalization_is_case_insensitive() {
        assert_eq!(normalize_code(" ab12cd "), "AB12CD");
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
                    .body(Body::from(
                        r#"{"game_id":"tank-arena","player_name":"host"}"#,
                    ))
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
                    .body(Body::from(
                        serde_json::json!({
                            "game_id": "tank-arena",
                            "player_name": "host",
                            "resume_token": created.resume_token,
                        })
                        .to_string(),
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();
        let resumed: JoinResponse =
            serde_json::from_slice(&response.into_body().collect().await.unwrap().to_bytes())
                .unwrap();
        assert_eq!(resumed.self_member.id, created.self_member.id);
        assert_eq!(resumed.room.members.len(), 1);
        let response = app
            .clone()
            .oneshot(
                axum::http::Request::builder()
                    .method("POST")
                    .uri(format!("/v1/rooms/{}/join", created.room.code))
                    .header("content-type", "application/json")
                    .body(Body::from(
                        r#"{"game_id":"tank-arena","player_name":"guest"}"#,
                    ))
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
                        serde_json::json!({"member_id":joined.self_member.id,"auth_token":joined.resume_token}).to_string(),
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
                    .body(Body::from(
                        r#"{"game_id":"tank-arena","player_name":"host"}"#,
                    ))
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
                    .body(Body::from(
                        r#"{"game_id":"tank-arena","player_name":"guest"}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();
        let joined: JoinResponse =
            serde_json::from_slice(&response.into_body().collect().await.unwrap().to_bytes())
                .unwrap();
        let signal = serde_json::json!({"auth_token":created.resume_token,"from":created.self_member.id,"to":joined.self_member.id,"kind":"offer","payload":{"sdp":"test"}}).to_string();
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
        let poll =
            serde_json::json!({"member_id":joined.self_member.id,"auth_token":joined.resume_token})
                .to_string();
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

    fn fixture_room() -> Room {
        Room {
            id: "r".into(),
            code: "ABC123".into(),
            game_id: "tank-arena".into(),
            members: HashMap::new(),
            next_ip: 2,
            empty_expires_at: None,
            signals: HashMap::new(),
            revision: 1,
            closed: false,
            generations: HashMap::new(),
        }
    }
    fn fixture_member(id: Uuid) -> Member {
        Member {
            id,
            name: "p".into(),
            virtual_ip: "10.77.0.2".into(),
            endpoint: "127.0.0.1:1000".parse().unwrap(),
            last_seen: now_secs(),
            resume_token: Uuid::new_v4(),
            handoff_token: None,
        }
    }
    #[test]
    fn removing_any_member_keeps_room_without_promotion() {
        let a = Uuid::new_v4();
        let b = Uuid::new_v4();
        let mut r = fixture_room();
        r.members.insert(a, fixture_member(a));
        r.members.insert(b, fixture_member(b));
        remove_member(&mut r, a);
        assert!(r.members.contains_key(&b));
        assert!(!r.closed);
    }
    #[test]
    fn removing_last_member_deletes_room() {
        let a = Uuid::new_v4();
        let mut r = fixture_room();
        r.members.insert(a, fixture_member(a));
        remove_member(&mut r, a);
        assert!(r.closed);
        assert!(r.members.is_empty());
    }
    #[test]
    fn resuming_member_clears_stale_signals_in_both_directions() {
        let a = Uuid::new_v4();
        let b = Uuid::new_v4();
        let mut r = fixture_room();
        let signal = |from| Signal {
            bytes: 0,
            id: Uuid::new_v4(),
            from,
            kind: "webrtc_offer".into(),
            payload: serde_json::json!({}),
            sent_at: now_secs(),
        };
        r.signals.insert(a, VecDeque::from([signal(b)]));
        r.signals.insert(b, VecDeque::from([signal(a)]));
        clear_member_signals(&mut r, a);
        assert!(!r.signals.contains_key(&a));
        assert!(r.signals[&b].is_empty());
    }
}
