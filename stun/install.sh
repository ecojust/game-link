#!/usr/bin/env bash
set -euo pipefail
if [[ ${EUID} -ne 0 ]]; then
  echo 'Run as root: sudo bash stun/install.sh' >&2
  exit 1
fi
source_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
if ! command -v turnserver >/dev/null; then
  if command -v dnf >/dev/null; then
    dnf install -y coturn
  elif command -v apt-get >/dev/null; then
    apt-get update
    apt-get install -y coturn
  else
    echo 'Install coturn from your distribution package repository first.' >&2
    exit 1
  fi
fi
if [[ $(command -v turnserver) != /usr/bin/turnserver ]]; then
  echo 'Expected package executable /usr/bin/turnserver; adjust the service for this host.' >&2
  exit 1
fi
# Do not overwrite an unrelated coturn configuration or start its default service.
if systemctl is-active --quiet coturn || systemctl is-active --quiet turnserver; then
  echo 'An existing coturn service is running; check its listening port before installing.' >&2
  exit 1
fi
backup_dir="/opt/gamelink-stun-backup-$(date +%Y%m%d-%H%M%S)"
if [[ -e /opt/gamelink-stun/turnserver.conf || -e /etc/systemd/system/gamelink-stun.service ]]; then
  mkdir -p "$backup_dir"
  [[ ! -e /opt/gamelink-stun/turnserver.conf ]] || cp -a /opt/gamelink-stun/turnserver.conf "$backup_dir/"
  [[ ! -e /etc/systemd/system/gamelink-stun.service ]] || cp -a /etc/systemd/system/gamelink-stun.service "$backup_dir/"
  echo "Previous configuration saved to $backup_dir"
fi
install -d -m 0755 /opt/gamelink-stun
install -m 0644 "$source_dir/turnserver.conf" /opt/gamelink-stun/turnserver.conf
install -m 0644 "$source_dir/gamelink-stun.service" /etc/systemd/system/gamelink-stun.service
# Respect an active firewall manager; otherwise own only two iptables rules.
if systemctl is-active --quiet firewalld; then
  firewall-cmd --add-port=3478/udp
  firewall-cmd --add-port=3478/tcp
  firewall-cmd --permanent --add-port=3478/udp
  firewall-cmd --permanent --add-port=3478/tcp
elif command -v ufw >/dev/null && ufw status | grep -q 'Status: active'; then
  ufw allow 3478/udp
  ufw allow 3478/tcp
elif command -v iptables >/dev/null; then
  install -m 0755 "$source_dir/firewall.sh" /opt/gamelink-stun/firewall.sh
  install -m 0644 "$source_dir/gamelink-stun-firewall.service" /etc/systemd/system/gamelink-stun-firewall.service
  systemctl daemon-reload
  systemctl enable gamelink-stun-firewall
  systemctl restart gamelink-stun-firewall
fi
systemctl daemon-reload
systemctl enable gamelink-stun
systemctl restart gamelink-stun
systemctl is-active gamelink-stun
printf 'Cloud security group must allow inbound UDP 3478 (and TCP 3478 if required).\n'
