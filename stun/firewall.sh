#!/usr/bin/env bash
set -euo pipefail
# Only the two STUN listener rules are owned by this service.
for protocol in udp tcp; do
  rule=(-p "$protocol" --dport 3478 -m comment --comment gamelink-stun -j ACCEPT)
  if [[ ${1:-start} == stop ]]; then
    iptables -C INPUT "${rule[@]}" 2>/dev/null && iptables -D INPUT "${rule[@]}" || true
  elif ! iptables -C INPUT "${rule[@]}" 2>/dev/null; then
    # Keep the host security agent's first rule ahead of this port exception.
    iptables -I INPUT 2 "${rule[@]}"
  fi
done
