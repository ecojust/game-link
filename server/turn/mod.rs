use base64::{Engine, engine::general_purpose::STANDARD};
use hmac::{Hmac, Mac};
use sha1::Sha1;
use std::error::Error;
use tokio::process::Child;
use uuid::Uuid;

pub struct NetworkConfig {
    pub stun_urls: Vec<String>,
    pub turn_urls: Vec<String>,
    secret: String,
}
impl NetworkConfig {
    #[cfg(test)]
    pub fn disabled() -> Self {
        Self {
            stun_urls: vec![],
            turn_urls: vec![],
            secret: String::new(),
        }
    }
    pub fn from_env() -> Result<Self, Box<dyn Error + Send + Sync>> {
        let host = std::env::var("GAMELINK_PUBLIC_HOST")?;
        if host.contains(['\n', '\r', '/', ' ']) {
            return Err("Invalid public host".into());
        }
        let stun_port = std::env::var("GAMELINK_STUN_PORT")
            .unwrap_or_else(|_| "3478".into())
            .parse::<u16>()?;
        let turn_port = std::env::var("GAMELINK_TURN_PORT")
            .unwrap_or_else(|_| "3479".into())
            .parse::<u16>()?;
        if stun_port == turn_port {
            return Err("STUN and TURN require different ports".into());
        }
        let secret = std::env::var("GAMELINK_TURN_SECRET")?;
        if secret.len() < 32 || secret.contains(['\n', '\r']) {
            return Err("TURN secret must have at least 32 characters and no newlines".into());
        }
        Ok(Self {
            stun_urls: vec![format!("stun:{host}:{stun_port}")],
            turn_urls: vec![
                format!("turn:{host}:{turn_port}?transport=udp"),
                format!("turn:{host}:{turn_port}?transport=tcp"),
            ],
            secret,
        })
    }
    pub fn enabled(&self) -> bool {
        !self.secret.is_empty() && !self.turn_urls.is_empty()
    }
    pub fn credentials(&self, member: Uuid, now: u64) -> Option<serde_json::Value> {
        if !self.enabled() {
            return None;
        }
        let expires = now + 3600;
        let username = format!("{expires}:{member}");
        let mut mac = Hmac::<Sha1>::new_from_slice(self.secret.as_bytes()).ok()?;
        mac.update(username.as_bytes());
        Some(
            serde_json::json!({"ice_servers":[{"urls":self.turn_urls,"username":username,"credential":STANDARD.encode(mac.finalize().into_bytes())}],"expires_at":expires}),
        )
    }
}
pub async fn start(config: &NetworkConfig) -> Result<Child, Box<dyn Error + Send + Sync>> {
    let port = std::env::var("GAMELINK_TURN_PORT")
        .unwrap_or_else(|_| "3479".into())
        .parse::<u16>()?;
    let minimum = std::env::var("GAMELINK_TURN_MIN_PORT")
        .unwrap_or_else(|_| "49160".into())
        .parse::<u16>()?;
    let maximum = std::env::var("GAMELINK_TURN_MAX_PORT")
        .unwrap_or_else(|_| "49200".into())
        .parse::<u16>()?;
    if minimum > maximum || (minimum..=maximum).contains(&port) {
        return Err("Invalid TURN relay port range".into());
    }
    let mut text = format!(
        "listening-port={port}\nlistening-ip=0.0.0.0\nno-tls\nno-stun\nuse-auth-secret\nstatic-auth-secret={}\nrealm=gamelink\nfingerprint\nrelay-threads=1\nmin-port={minimum}\nmax-port={maximum}\nuser-quota=12\ntotal-quota=120\nmax-bps=262144\nbps-capacity=10485760\nno-multicast-peers\nno-tcp-relay\npidfile={}\nuserdb={}\nlog-file=stdout\nsimple-log\n",
        config.secret,
        super::stun::runtime_dir().join("turn.pid").display(),
        super::stun::runtime_dir().join("turn.db").display()
    );
    if let Ok(mapping) = std::env::var("GAMELINK_TURN_EXTERNAL_IP") {
        if mapping.contains(['\n', '\r', ' ']) {
            return Err("Invalid external IP mapping".into());
        }
        if !mapping.is_empty() {
            text.push_str(&format!("external-ip={mapping}\n"));
        }
    }
    if let Ok(ip) = std::env::var("GAMELINK_TURN_RELAY_IP") {
        let _: std::net::IpAddr = ip.parse()?;
        text.push_str(&format!("relay-ip={ip}\n"));
    }
    for range in [
        "0.0.0.0-0.255.255.255",
        "10.0.0.0-10.255.255.255",
        "127.0.0.0-127.255.255.255",
        "169.254.0.0-169.254.255.255",
        "172.16.0.0-172.31.255.255",
        "192.168.0.0-192.168.255.255",
        "::1",
        "fc00::-fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
    ] {
        text.push_str(&format!("denied-peer-ip={range}\n"));
    }
    super::stun::spawn("turn", text).await
}
