#[path = "../signal/mod.rs"]
mod signal;
mod storage;
#[path = "../stun/mod.rs"]
mod stun;
#[path = "../turn/mod.rs"]
mod turn;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();
    let network = turn::NetworkConfig::from_env()?;
    let mut services = Vec::new();
    if std::env::var("GAMELINK_ICE_MODE").unwrap_or_else(|_| "managed".into()) == "managed" {
        services.push(stun::start().await?);
        services.push(turn::start(&network).await?);
    }
    let server = signal::run(network);
    tokio::pin!(server);
    let result = tokio::select! {
        result = &mut server => result,
        result = shutdown() => result.map_err(Into::into),
        result = async {
            loop {
                for child in &mut services {
                    if let Some(status) = child.try_wait()? { return Err(format!("ICE service exited: {status}").into()); }
                }
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
            }
        } => result,
    };
    for mut child in services {
        let _ = child.kill().await;
        let _ = child.wait().await;
    }
    result
}

async fn shutdown() -> std::io::Result<()> {
    #[cfg(unix)]
    {
        let mut terminate =
            tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())?;
        tokio::select! { result = tokio::signal::ctrl_c() => result, _ = terminate.recv() => Ok(()) }
    }
    #[cfg(not(unix))]
    {
        tokio::signal::ctrl_c().await
    }
}
