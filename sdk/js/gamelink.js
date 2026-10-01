const DEFAULT_ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' },
]

/**
 * Browser JavaScript SDK for GameLink rooms, WebRTC signaling, and peer messages.
 * Game payloads are delivered as typed messages; the SDK does not interpret them.
 */
export class GameLinkClient {
  constructor({
    serverUrl = new URL(import.meta.url).origin,
    gameId,
    playerName,
    iceServers = DEFAULT_ICE_SERVERS,
    pollIntervalMs = 120,
    heartbeatIntervalMs = 8_000,
    roomRefreshIntervalMs = 1_500,
  }) {
    if (!gameId) throw new Error('gameId is required')
    if (!playerName?.trim()) throw new Error('playerName is required')
    this.serverUrl = serverUrl.replace(/\/$/, '')
    this.gameId = gameId
    this.playerName = playerName.trim()
    this.iceServers = iceServers
    this.pollIntervalMs = pollIntervalMs
    this.heartbeatIntervalMs = heartbeatIntervalMs
    this.roomRefreshIntervalMs = roomRefreshIntervalMs
    this.room = null
    this.selfMember = null
    this.members = []
    this.peerStates = new Map()
    this.localIceAddresses = new Map()
    this.remoteIceAddresses = new Map()
    this.connections = new Map()
    this.channels = new Map()
    this.pendingIce = new Map()
    this.listeners = new Map()
    this.timers = []
    this.polling = false
    this.disposed = false
    this.resuming = false
    this.loggedConnections = new WeakSet()
  }

  on(eventName, listener) {
    const listeners = this.listeners.get(eventName) || new Set()
    listeners.add(listener)
    this.listeners.set(eventName, listeners)
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) this.listeners.delete(eventName)
    }
  }

  static fromLocation(options = {}) {
    const params = new URL(window.location.href).searchParams
    const gameId = params.get('gameid')
    const playerName = params.get('username')
    if (!gameId || !playerName?.trim() || !params.get('room')) {
      throw new Error('链接缺少 gameid、room 或 username，请从平台首页进入游戏。')
    }
    return new GameLinkClient({ ...options, gameId, playerName })
  }

  async createLaunchUrl(entryUrl) {
    const url = new URL(entryUrl, window.location.href)
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('游戏入口必须为 HTTP(S) 地址')
    const result = await this._request('/v1/rooms', 'POST', {
      game_id: this.gameId, player_name: this.playerName, create_only: true,
    })
    url.search = new URLSearchParams({
      gameid: this.gameId, room: result.room.code, username: this.playerName,
    }).toString()
    url.hash = ''
    return url.href
  }

  async joinFromLocation() {
    const url = new URL(window.location.href)
    if (url.searchParams.get('gameid') !== this.gameId) throw new Error('游戏 ID 不匹配')
    return this.joinRoom(url.searchParams.get('room'))
  }

  async createRoom() {
    const result = await this._request('/v1/rooms', 'POST', {
      game_id: this.gameId,
      player_name: this.playerName,
    })
    await this._enterRoom(result)
    return result
  }

  async joinRoom(code) {
    const roomCode = String(code || '').trim().toUpperCase()
    if (!roomCode) throw new Error('room code is required')
    const resumeToken = this._getResumeToken(roomCode)
    const result = await this._request(`/v1/rooms/${encodeURIComponent(roomCode)}/join`, 'POST', {
      game_id: this.gameId,
      player_name: this.playerName,
      resume_token: resumeToken || undefined,
    })
    this._setResumeToken(roomCode, result.resume_token)
    await this._enterRoom(result, Boolean(resumeToken))
    return result
  }

  async _enterRoom(result, resumed = false) {
    this.disposed = false
    this.resuming = resumed
    this.room = result.room
    this.selfMember = result.self_member
    this._setResumeToken(result.room.code, result.resume_token)
    this._setMembers(result.room.members)
    this._emit('room', this.room)
    this._startLoops()
    await Promise.allSettled([this.refreshRoom(), this._pollSignals()])
    if (resumed && this.room && this.selfMember) {
      await Promise.allSettled(this.members
        .filter((member) => member.id !== this.selfMember.id)
        .map((member) => this._sendSignal(member.id, 'webrtc_restart', {})))
      this.resuming = false
      this._syncPeerConnections()
    }
  }

  _resumeStorageKey(code) { return `gamelink-resume:${this.gameId}:${String(code).toUpperCase()}` }

  _getResumeToken(code) {
    try { return window.sessionStorage.getItem(this._resumeStorageKey(code)) } catch { return null }
  }

  _setResumeToken(code, token) {
    try {
      if (token) window.sessionStorage.setItem(this._resumeStorageKey(code), token)
    } catch { /* Session storage can be unavailable in restricted browser contexts. */ }
  }

  _startLoops() {
    this._stopLoops()
    this._pollSignals()
    this.refreshRoom().catch((error) => this._reportError(error))
    this.timers.push(setInterval(() => this._pollSignals(), this.pollIntervalMs))
    this.timers.push(setInterval(() => this._heartbeat(), this.heartbeatIntervalMs))
    this.timers.push(setInterval(() => this.refreshRoom(), this.roomRefreshIntervalMs))
  }

  _stopLoops() {
    for (const timer of this.timers) clearInterval(timer)
    this.timers = []
  }

  async refreshRoom() {
    if (!this.room || this.disposed) return null
    const latest = await this._request(`/v1/rooms/${encodeURIComponent(this.room.code)}`)
    if (this.disposed) return null
    this.room = latest
    this._setMembers(latest.members)
    this._emit('room', latest)
    if (!latest.members.some((member) => member.id === this.selfMember?.id)) {
      this._emit('room-closed', { reason: 'You are no longer a member of this room.' })
      this.dispose()
    }
    return latest
  }

  async _heartbeat() {
    if (!this.room || !this.selfMember || this.disposed) return
    try {
      await this._request(`/v1/rooms/${encodeURIComponent(this.room.code)}/heartbeat`, 'POST', {
        member_id: this.selfMember.id,
      })
    } catch (error) {
      this._reportError(error)
    }
  }

  async _pollSignals() {
    if (this.polling || !this.room || !this.selfMember || this.disposed) return
    this.polling = true
    try {
      const result = await this._request(`/v1/rooms/${encodeURIComponent(this.room.code)}/signals/poll`, 'POST', {
        member_id: this.selfMember.id,
      })
      if (this.disposed) return
      this._setMembers([...result.members, this.selfMember])
      for (const signal of result.signals) await this._receiveSignal(signal)
    } catch (error) {
      this._reportError(error)
    } finally {
      this.polling = false
    }
  }

  async broadcast(kind, payload) {
    if (!this.room || !this.selfMember) throw new Error('not connected to a room')
    await this._request(`/v1/rooms/${encodeURIComponent(this.room.code)}/events`, 'POST', {
      from: this.selfMember.id,
      kind,
      payload,
    })
  }

  send(kind, payload, { target, reliability } = {}) {
    if (!this.selfMember) return
    const delivery = reliability || (kind === 'player_state' ? 'unreliable' : 'reliable')
    const serialized = JSON.stringify({ kind, payload })
    const destinations = target ? [target] : this.members
      .filter((member) => member.id !== this.selfMember.id)
      .map((member) => member.id)
    for (const peerId of destinations) {
      const channel = this.channels.get(peerId)?.[delivery === 'unreliable' ? 'state' : 'control']
      const peerName = this.members.find((member) => member.id === peerId)?.name || peerId
      if (channel?.readyState === 'open') {
        if (delivery === 'unreliable' && channel.bufferedAmount > 8192) continue
        try {
          channel.send(serialized)
          console.info('[GameLink SDK] message sent', {
            peerName,
            peerId,
            transport: 'WebRTC P2P DataChannel',
            address: this.remoteIceAddresses.get(peerId) || 'remote ICE address unavailable',
            message: { kind, payload },
          })
        } catch (error) {
          this._reportError(error)
        }
      } else if (this.peerStates.get(peerId) === 'relay') {
        this._sendSignal(peerId, 'game_relay', { kind, payload }).then(() => {
          console.info('[GameLink SDK] message sent', {
            peerName,
            peerId,
            transport: 'GameLink HTTP signaling fallback',
            address: new URL(`/v1/rooms/${this.room.code}/signals`, this.serverUrl || window.location.origin).href,
            message: { kind, payload },
          })
        }).catch((error) => this._reportError(error))
      }
    }
  }

  async leave() {
    const room = this.room
    const self = this.selfMember
    try {
      if (room && self) {
        await this._request(`/v1/rooms/${encodeURIComponent(room.code)}/leave`, 'POST', {
          member_id: self.id,
        })
      }
    } finally {
      if (room) {
        try { window.sessionStorage.removeItem(this._resumeStorageKey(room.code)) } catch {}
      }
      this.dispose()
    }
  }

  dispose() {
    if (this.disposed) return
    this.disposed = true
    this._stopLoops()
    for (const connection of this.connections.values()) connection.close()
    this.connections.clear()
    this.channels.clear()
    this.pendingIce.clear()
    this.peerStates.clear()
    this.localIceAddresses.clear()
    this.remoteIceAddresses.clear()
    this._emit('disposed', undefined)
  }

  _setMembers(members) {
    if (!this.selfMember) return
    const fullMembers = members.some((member) => member.id === this.selfMember.id)
      ? members
      : [...members, this.selfMember]
    this.members = fullMembers
    this.room = this.room ? { ...this.room, members: fullMembers } : this.room
    this._syncPeerConnections()
    this._emit('members', fullMembers)
  }

  _syncPeerConnections() {
    if (!this.selfMember || this.resuming) return
    const activeIds = new Set(this.members
      .filter((member) => member.id !== this.selfMember.id)
      .map((member) => member.id))
    for (const [peerId, connection] of this.connections) {
      if (activeIds.has(peerId)) continue
      connection.close()
      this.connections.delete(peerId)
      this.channels.delete(peerId)
      this.pendingIce.delete(peerId)
      this.peerStates.delete(peerId)
      this.localIceAddresses.delete(peerId)
      this.remoteIceAddresses.delete(peerId)
      this._emitPeerState(peerId, 'closed')
    }
    for (const member of this.members) {
      if (member.id !== this.selfMember.id) this._ensurePeerConnection(member)
    }
  }

  _ensurePeerConnection(member) {
    if (!this.selfMember || this.resuming || member.id === this.selfMember.id) return null
    const existing = this.connections.get(member.id)
    if (existing) return existing
    const connection = new RTCPeerConnection({ iceServers: this.iceServers })
    this.connections.set(member.id, connection)
    this.channels.set(member.id, {})
    this.peerStates.set(member.id, 'connecting')
    this._emitPeerState(member.id, 'connecting')
    connection.onicecandidate = (event) => {
      if (!event.candidate) return
      this._rememberIceCandidate(this.localIceAddresses, member.id, event.candidate.candidate)
      this._emitPeerState(member.id, this.peerStates.get(member.id) || 'connecting')
      this._sendSignal(member.id, 'webrtc_ice', event.candidate.toJSON())
        .catch((error) => this._reportError(error))
    }
    connection.ondatachannel = (event) => this._attachChannel(member.id, event.channel)
    connection.onconnectionstatechange = () => this._updatePeerState(member.id)
    if (this.selfMember.id.localeCompare(member.id) < 0) {
      this._attachChannel(member.id, connection.createDataChannel('control'))
      this._attachChannel(member.id, connection.createDataChannel('state', { ordered: false, maxRetransmits: 0 }))
      this._createOffer(member.id, connection)
    }
    return connection
  }

  _attachChannel(peerId, channel) {
    const channels = this.channels.get(peerId) || {}
    if (channel.label === 'state') channels.state = channel
    else channels.control = channel
    this.channels.set(peerId, channels)
    channel.onopen = () => this._updatePeerState(peerId)
    channel.onclose = () => this._updatePeerState(peerId)
    channel.onerror = () => this._setPeerState(peerId, 'relay')
    channel.onmessage = (event) => {
      try {
        const message = JSON.parse(String(event.data))
        if (!message || typeof message.kind !== 'string') return
        this._emit('message', {
          from: peerId,
          kind: message.kind,
          payload: message.payload,
          sent_at: Date.now(),
          transport: 'p2p',
        })
      } catch {
        // Ignore malformed or non-JSON game payloads.
      }
    }
    this._updatePeerState(peerId)
  }

  _updatePeerState(peerId) {
    const connection = this.connections.get(peerId)
    if (!connection) return
    const channels = this.channels.get(peerId)
    if (connection.connectionState === 'connected'
      && channels?.control?.readyState === 'open'
      && channels?.state?.readyState === 'open') {
      this._setPeerState(peerId, 'connected')
      this._updateIceAddresses(peerId, connection)
      this._logConnection(peerId, connection)
    } else if (connection.connectionState === 'failed' || connection.connectionState === 'closed') {
      this._setPeerState(peerId, 'relay')
    } else {
      this._setPeerState(peerId, 'connecting')
    }
  }

  _setPeerState(peerId, state) {
    this.peerStates.set(peerId, state)
    this._emitPeerState(peerId, state)
  }

  _emitPeerState(peerId, state) {
    this._emit('peer-state', {
      peerId,
      state,
      localIce: this.localIceAddresses.get(peerId) || '',
      remoteIce: this.remoteIceAddresses.get(peerId) || '',
    })
  }

  _rememberIceCandidate(map, peerId, line) {
    const match = line?.match(/candidate:\S+\s+\d+\s+(udp|tcp)\s+\d+\s+(\S+)\s+(\d+)\s+typ\s+(\S+)/i)
    if (!match) return
    const [, protocol, address, port, candidateType] = match
    const endpoint = address.includes(':') ? `[${address}]:${port}` : `${address}:${port}`
    const value = `${endpoint} · ${candidateType}/${protocol.toUpperCase()}`
    const values = (map.get(peerId) || '').split(' / ').filter(Boolean)
    if (!values.includes(value)) map.set(peerId, [...values, value].join(' / '))
  }

  async _updateIceAddresses(peerId, connection) {
    try {
      const stats = await connection.getStats()
      let pair
      for (const report of stats.values()) {
        if (report.type === 'transport' && report.selectedCandidatePairId) {
          pair = stats.get(report.selectedCandidatePairId)
          break
        }
        if (report.type === 'candidate-pair' && (report.selected || (report.nominated && report.state === 'succeeded'))) {
          if (!pair || report.selected) pair = report
        }
      }
      if (!pair?.localCandidateId || this.connections.get(peerId) !== connection) return
      const local = stats.get(pair.localCandidateId)
      const remote = pair.remoteCandidateId ? stats.get(pair.remoteCandidateId) : null
      const format = (candidate) => {
        const address = candidate?.address || candidate?.ip
        const port = candidate?.port
        if (!address || !port) return ''
        const endpoint = String(address).includes(':') ? `[${address}]:${port}` : `${address}:${port}`
        const protocol = candidate.protocol ? `/${String(candidate.protocol).toUpperCase()}` : ''
        return `${endpoint} · selected ${candidate.candidateType || 'ice'}${protocol}`
      }
      const localValue = format(local)
      const remoteValue = format(remote)
      if (localValue) this.localIceAddresses.set(peerId, localValue)
      if (remoteValue) this.remoteIceAddresses.set(peerId, remoteValue)
      this._emitPeerState(peerId, this.peerStates.get(peerId) || 'connecting')
    } catch {
      // Some browsers restrict ICE candidate details in getStats().
    }
  }

  _logConnection(peerId, connection) {
    const channels = this.channels.get(peerId)
    if (this.loggedConnections.has(connection)
      || connection.connectionState !== 'connected'
      || channels?.control?.readyState !== 'open'
      || channels?.state?.readyState !== 'open') return
    this.loggedConnections.add(connection)
    this._updateIceAddresses(peerId, connection).then(() => {
      const remoteName = this.members.find((member) => member.id === peerId)?.name || peerId
      console.info('[GameLink SDK] P2P connected', {
        localPeerId: this.selfMember?.id,
        remotePeerName: remoteName,
        remotePeerId: peerId,
        localIce: this.localIceAddresses.get(peerId) || 'browser did not expose candidate address',
      })
    })
  }

  async _createOffer(peerId, connection) {
    try {
      await connection.setLocalDescription(await connection.createOffer())
      const description = connection.localDescription
      if (description) await this._sendSignal(peerId, 'webrtc_offer', { type: description.type, sdp: description.sdp })
    } catch (error) {
      this._setPeerState(peerId, 'relay')
      this._reportError(error)
    }
  }

  async _receiveSignal(signal) {
    if (signal.kind === 'game_relay') {
      const payload = signal.payload || {}
      this._emit('message', {
        from: signal.from,
        kind: payload.kind,
        payload: payload.payload,
        sent_at: signal.sent_at,
        transport: 'server-forwarding',
      })
      return
    }
    if (!signal.kind.startsWith('webrtc_')) {
      this._emit('message', {
        from: signal.from,
        kind: signal.kind,
        payload: signal.payload,
        sent_at: signal.sent_at,
        transport: 'server-event',
      })
      return
    }
    const member = this.members.find((entry) => entry.id === signal.from)
      || { id: signal.from, name: signal.from, virtual_ip: '', endpoint: '' }
    if (signal.kind === 'webrtc_restart') {
      this.connections.get(signal.from)?.close()
      this.connections.delete(signal.from)
      this.channels.delete(signal.from)
      this.pendingIce.delete(signal.from)
      this.peerStates.delete(signal.from)
      this.localIceAddresses.delete(signal.from)
      this.remoteIceAddresses.delete(signal.from)
      this._ensurePeerConnection(member)
      return
    }
    const connection = this._ensurePeerConnection(member)
    if (!connection) return
    const payload = signal.payload || {}
    try {
      if (signal.kind === 'webrtc_offer') {
        await connection.setRemoteDescription(payload)
        await this._applyPendingIce(signal.from, connection)
        await connection.setLocalDescription(await connection.createAnswer())
        const description = connection.localDescription
        if (description) await this._sendSignal(signal.from, 'webrtc_answer', { type: description.type, sdp: description.sdp })
      } else if (signal.kind === 'webrtc_answer') {
        await connection.setRemoteDescription(payload)
        await this._applyPendingIce(signal.from, connection)
      } else if (signal.kind === 'webrtc_ice') {
        if (payload.candidate) this._rememberIceCandidate(this.remoteIceAddresses, signal.from, payload.candidate)
        if (payload.candidate && connection.remoteDescription) await connection.addIceCandidate(payload)
        else if (payload.candidate) this.pendingIce.set(signal.from, [...(this.pendingIce.get(signal.from) || []), payload])
      }
    } catch (error) {
      this._setPeerState(signal.from, 'relay')
      this._reportError(error)
    }
  }

  async _applyPendingIce(peerId, connection) {
    const candidates = this.pendingIce.get(peerId) || []
    this.pendingIce.delete(peerId)
    for (const candidate of candidates) await connection.addIceCandidate(candidate)
  }

  async _sendSignal(to, kind, payload) {
    if (!this.room || !this.selfMember) throw new Error('not connected to a room')
    await this._request(`/v1/rooms/${encodeURIComponent(this.room.code)}/signals`, 'POST', {
      from: this.selfMember.id,
      to,
      kind,
      payload,
    })
  }

  async _request(path, method = 'GET', payload) {
    const response = await fetch(`${this.serverUrl}${path}`, {
      method,
      headers: payload === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    })
    const body = await response.json().catch(() => null)
    if (!response.ok) throw new Error(body?.error || body?.message || `GameLink request failed (${response.status})`)
    return body
  }

  _reportError(reason) {
    const error = reason instanceof Error ? reason : new Error(String(reason))
    this._emit('error', error)
  }

  _emit(eventName, value) {
    for (const listener of this.listeners.get(eventName) || []) {
      try {
        listener(value)
      } catch (error) {
        console.error(`[GameLink SDK] ${eventName} listener failed`, error)
      }
    }
  }
}

export { DEFAULT_ICE_SERVERS }
