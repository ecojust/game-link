use std::{error::Error, path::PathBuf};
use tokio::process::{Child, Command};
type Result<T> = std::result::Result<T, Box<dyn Error + Send + Sync>>;
pub fn runtime_dir() -> PathBuf {
    std::env::var_os("GAMELINK_RUNTIME_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| std::env::temp_dir().join("gamelink-ice"))
}
pub async fn spawn(name: &str, config: String) -> Result<Child> {
    let dir = runtime_dir();
    tokio::fs::create_dir_all(&dir).await?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        tokio::fs::set_permissions(&dir, std::fs::Permissions::from_mode(0o700)).await?;
    }
    let path = dir.join(format!("{name}.conf"));
    // A private directory protects the generated TURN secret from other users.
    tokio::fs::write(&path, config).await?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        tokio::fs::set_permissions(&path, std::fs::Permissions::from_mode(0o600)).await?;
    }
    let binary = std::env::var("GAMELINK_COTURN_BIN").unwrap_or_else(|_| "turnserver".into());
    Ok(Command::new(binary)
        .arg("-c")
        .arg(path)
        .kill_on_drop(true)
        .spawn()?)
}
pub async fn start() -> Result<Child> {
    let port = std::env::var("GAMELINK_STUN_PORT")
        .unwrap_or_else(|_| "3478".into())
        .parse::<u16>()?;
    spawn("stun", format!("listening-port={port}\nlistening-ip=0.0.0.0\nstun-only\nno-auth\nno-tls\nfingerprint\nrelay-threads=1\npidfile={}\nuserdb={}\nlog-file=stdout\nsimple-log\n", runtime_dir().join("stun.pid").display(), runtime_dir().join("stun.db").display())).await
}
