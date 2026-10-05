// Additional providers from the 2025-07-15 list; reachability is checked by each browser.
const DEFAULT_ICE_SERVERS = [
  { urls: 'stun:stun.miwifi.com:3478' },
  { urls: 'stun:stun.antisip.com:3478' },
  { urls: 'stun:stun.linphone.org:3478' },
  { urls: 'stun:stun.zadarma.com:3478' },
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
    pollIntervalMs = 250,
    requestTimeoutMs = 8000,
    heartbeatIntervalMs = 8_000,
    peerHeartbeatIntervalMs = 4_000,
    peerTimeoutMs = 12_000,
    roomRefreshIntervalMs = 0,
  }) {
    if (!gameId) throw new Error('gameId is required')
    if (!playerName?.trim()) throw new Error('playerName is required')
    this.serverUrl = serverUrl.replace(/\/$/, '')
    this.gameId = gameId
    this.playerName = playerName.trim()
    this.iceServers = iceServers.map(server => ({ ...server,
      urls: (Array.isArray(server.urls) ? server.urls : [server.urls]).filter(url => /^stuns?:/i.test(url)),
    })).filter(server => server.urls.length)
    this.requestTimeoutMs = requestTimeoutMs
    this.pollIntervalMs = pollIntervalMs
    this.heartbeatIntervalMs = heartbeatIntervalMs
    this.peerHeartbeatIntervalMs = peerHeartbeatIntervalMs
    this.peerTimeoutMs = peerTimeoutMs
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
    this.pollEpoch = 0
    this.pollTimer = null
    this.pollController = null
    this.signalRevision = null
    this.signalAcks = new Set()
    this.seenSignals = new Map()
    this.memberToken = null
    this.disposed = false
    this.resuming = false
    this.loggedConnections = new WeakSet()
    this.stunErrorNotices = new Map()
    this.stunDiagnosticTimers = new Map()
    this.retryTimers = new Map()
    this.retryAttempts = new Map()
    this.generations = new Map()
    this.futureIce = new Map()
    this.connectedOnce = new Set()
    this.lastGeneration = 0
    this.peerHeartbeatAt = new Map()
    this.peerHeartbeatPending = new Map()
    this.peerHeartbeatSequence = 0
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
    let result
    try { result = await this._request(`/v1/rooms/${encodeURIComponent(roomCode)}/join`, 'POST', {
      game_id: this.gameId,
      player_name: this.playerName,
      resume_token: resumeToken || undefined,
    })
    } catch (error) {
      if (!resumeToken || error.status !== 401) throw error
      result = await this._request(`/v1/rooms/${encodeURIComponent(roomCode)}/join`, 'POST', {game_id:this.gameId, player_name:this.playerName})
    }
    this._setResumeToken(roomCode, result.resume_token)
    await this._enterRoom(result, Boolean(resumeToken))
    return result
  }

  async _enterRoom(result, resumed = false) {
    this.disposed = false
    this.resuming = resumed
    this.room = result.room
    this.selfMember = result.self_member
    this.memberToken = result.resume_token
    this.signalRevision = null
    this.signalAcks.clear()
    this.seenSignals.clear()
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
    void this._pollSignals()
    this.timers.push(setInterval(() => this._heartbeat(), this.heartbeatIntervalMs))
    this.timers.push(setInterval(() => this._checkPeerHeartbeats(), this.peerHeartbeatIntervalMs))
    // Optional explicit fallback; membership normally arrives through long polling.
    if (this.roomRefreshIntervalMs > 0) this.timers.push(setInterval(() => this.refreshRoom().catch(error => this._reportError(error)), this.roomRefreshIntervalMs))
  }

  _stopLoops() {
    for (const timer of this.timers) clearInterval(timer)
    this.timers = []
    this.pollEpoch++
    clearTimeout(this.pollTimer)
    this.pollController?.abort()
    this.polling = false
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
    const epoch = this.pollEpoch
    const controller = new AbortController()
    this.pollController = controller
    const acknowledgements = [...this.signalAcks]
    let delay = 0
    try {
      const result = await this._request(`/v1/rooms/${encodeURIComponent(this.room.code)}/signals/poll`, 'POST', {
        member_id: this.selfMember.id, ack_ids: acknowledgements,
        revision: this.signalRevision, wait_ms: 15000,
      }, { timeoutMs: Math.max(this.requestTimeoutMs, 20000), signal: controller.signal })
      if (this.disposed || epoch !== this.pollEpoch) return
      for (const id of acknowledgements) this.signalAcks.delete(id)
      this.signalRevision = result.revision
      this._setMembers([...result.members, this.selfMember])
      this._emit('room', this.room)
      const now = Date.now()
      for (const [id, at] of this.seenSignals) if (now-at > 120000) this.seenSignals.delete(id)
      for (const signal of result.signals) {
        if (!signal.id) throw new Error('GameLink 1.2 SDK requires a 1.2 signaling server')
        if (!this.seenSignals.has(signal.id)) {
          await this._receiveSignal(signal)
          this.seenSignals.set(signal.id, now)
        }
        this.signalAcks.add(signal.id)
      }
    } catch (error) {
      if (!this.disposed && epoch === this.pollEpoch && !controller.signal.aborted) {
        this._reportError(error)
        if ([401,404,410].includes(error.status)) {
          this._emit('room-closed', { reason: error.message })
          this.dispose()
        }
      }
      delay = Math.max(this.pollIntervalMs, 1000)
    } finally {
      if (epoch === this.pollEpoch) {
        this.polling = false
        this.pollController = null
        if (!this.disposed) this.pollTimer = setTimeout(() => void this._pollSignals(), delay)
      }
    }
  }

  async broadcast(kind, payload) {
    if (this.disposed || !this.room || !this.selfMember) throw new Error('not connected to a room')
    this.send(kind, payload, { reliability: 'reliable' })
  }

  send(kind, payload, { target, reliability } = {}) {
    if (this.disposed || !this.selfMember) return
    const delivery = reliability || (kind === 'player_state' ? 'unreliable' : 'reliable')
    const serialized = JSON.stringify({ kind, payload })
    const destinations = target ? [target] : this.members
      .filter((member) => member.id !== this.selfMember.id)
      .map((member) => member.id)
    for (const peerId of destinations) {
      const channel = this.channels.get(peerId)?.[delivery === 'unreliable' ? 'state' : 'control']
      const peerName = this.members.find((member) => member.id === peerId)?.name || peerId
      if (this.peerStates.get(peerId) === 'connected' && channel?.readyState === 'open') {
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
      } else {
        this._emit('delivery-skipped', { peerId, kind, reason: 'p2p-not-ready' })
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
    for (const timer of this.retryTimers.values()) clearTimeout(timer)
    this.retryTimers.clear()
    for (const timer of this.stunDiagnosticTimers.values()) clearTimeout(timer)
    this.stunDiagnosticTimers.clear()
    this.stunErrorNotices.clear()
    this.retryAttempts.clear()
    this.generations.clear()
    this.futureIce.clear()
    this.connectedOnce.clear()
    this.peerHeartbeatAt.clear()
    this.peerHeartbeatPending.clear()
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
    if (this.disposed || !this.selfMember || this.resuming) return
    const activeIds = new Set(this.members
      .filter((member) => member.id !== this.selfMember.id)
      .map((member) => member.id))
    for (const peerId of new Set([...this.connections.keys(), ...this.retryTimers.keys(), ...this.generations.keys()])) {
      const connection = this.connections.get(peerId)
      if (activeIds.has(peerId)) continue
      clearTimeout(this.retryTimers.get(peerId))
      this.retryTimers.delete(peerId)
      this.retryAttempts.delete(peerId)
      this.generations.delete(peerId)
      this.futureIce.delete(peerId)
      this.connectedOnce.delete(peerId)
      this.peerHeartbeatAt.delete(peerId)
      this.peerHeartbeatPending.delete(peerId)
      this.connections.delete(peerId)
      connection?.close()
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

  _ensurePeerConnection(member, generation) {
    if (!member || this.disposed || !this.selfMember || this.resuming || member.id === this.selfMember.id) return null
    const existing = this.connections.get(member.id)
    if (existing) return existing
    const offerer = this.selfMember.id.localeCompare(member.id) < 0
    if (!offerer && !generation) { this._watchConnection(member.id); return null }
    if (offerer) generation = this.lastGeneration = Math.max(Date.now() * 1000, this.lastGeneration + 1)
    this.generations.set(member.id, generation)
    const connection = new RTCPeerConnection({ iceServers: this.iceServers })
    this.connections.set(member.id, connection)
    this.channels.set(member.id, {})
    this._setPeerState(member.id, this.connectedOnce.has(member.id) || this.retryAttempts.has(member.id) ? 'reconnecting' : 'connecting')
    // STUN is contacted by the browser, so report its ICE errors at the client.
    const stunUrls = [...new Set(this.iceServers.flatMap(server => server.urls))]
    const stunFailures = new Map()
    let publicCandidate = false
    let gatheringReported = false
    const current = () => !this.disposed && this.connections.get(member.id) === connection
    const reportStun = (status, details = {}) => {
      if (!current()) return
      const diagnostic = { peerId: member.id, generation, status, urls: stunUrls,
        failures: [...stunFailures.values()], publicCandidate, ...details }
      this._emit('stun-status', diagnostic)
      if (!diagnostic.message) return
      // Three peers and continuous retries must not flood the same warning.
      const key = diagnostic.code + ':' + (diagnostic.url || stunUrls.join(','))
      const now = Date.now()
      if (now - (this.stunErrorNotices.get(key) || 0) < 60000) return
      this.stunErrorNotices.set(key, now)
      const error = Object.assign(new Error(diagnostic.message), diagnostic, { name: 'GameLinkStunError' })
      this._reportError(error)
    }
    const clearStunTimer = () => {
      clearTimeout(this.stunDiagnosticTimers.get(connection))
      this.stunDiagnosticTimers.delete(connection)
    }
    const finishStun = (timedOut = false) => {
      if (!current() || gatheringReported || !stunUrls.length) return
      gatheringReported = true
      clearStunTimer()
      if (publicCandidate) { reportStun('available'); return }
      const normalize = url => url.toLowerCase().replace(/\?transport=udp$/, '')
      const allFailed = stunUrls.every(url => [...stunFailures.keys()].some(failed => normalize(failed) === normalize(url)))
      reportStun(allFailed ? 'failed' : 'unconfirmed', {
        code: allFailed ? 'STUN_ALL_FAILED' : timedOut ? 'STUN_TIMEOUT' : 'STUN_NO_PUBLIC_CANDIDATE',
        message: allFailed
          ? 'STUN 失败：所有配置的 STUN 服务请求均失败，未获取公网连接地址。跨网络联机可能失败；局域网直连仍会继续尝试。'
          : timedOut ? 'STUN 检测超时：10 秒内未获取公网连接地址，尚无法确认服务是否可达。跨网络联机可能失败，仍在尝试连接。'
          : 'STUN 未获取公网连接地址，无法确认服务是否可达。跨网络联机可能失败，请检查网络或 STUN 配置。',
      })
    }
    connection.onicecandidateerror = event => {
      if (!current() || !/^stuns?:/i.test(event.url || '')) return
      const failure = { url: event.url, errorCode: event.errorCode, errorText: event.errorText || '' }
      stunFailures.set(event.url, failure)
      reportStun('server-error', { ...failure, code: 'STUN_SERVER_ERROR',
        message: `STUN 请求失败：${event.url}（错误码 ${event.errorCode}）。仍会尝试其他连接路径。`,
      })
      if (connection.iceGatheringState === 'complete' && !publicCandidate) { gatheringReported = false; finishStun() }
    }
    if (stunUrls.length) this.stunDiagnosticTimers.set(connection, setTimeout(() => { clearStunTimer(); finishStun(true) }, 10000))
    connection.addEventListener('connectionstatechange', () => {
      if (connection.connectionState === 'closed') clearStunTimer()
    })
    connection.onicegatheringstatechange = () => {
      if (connection.iceGatheringState === 'complete') finishStun()
    }
    connection.onicecandidate = (event) => {
      if (!current()) return
      if (!event.candidate) { finishStun(); return }
      if (event.candidate.type === 'srflx' || / typ srflx(?: |$)/.test(event.candidate.candidate)) {
        if (!publicCandidate) {
          publicCandidate = true
          clearStunTimer()
          reportStun('available')
        }
      }
      this._rememberIceCandidate(this.localIceAddresses, member.id, event.candidate.candidate)
      this._emitPeerState(member.id, this.peerStates.get(member.id) || 'connecting')
      this._sendSignal(member.id, 'webrtc_ice', { ...event.candidate.toJSON(), generation })
        .catch((error) => this._reportError(error))
    }
    connection.ondatachannel = (event) => { if (this.connections.get(member.id) === connection) this._attachChannel(member.id, event.channel) }
    connection.onconnectionstatechange = () => { if (this.connections.get(member.id) === connection) this._updatePeerState(member.id) }
    if (offerer) {
      this._attachChannel(member.id, connection.createDataChannel('control'))
      this._attachChannel(member.id, connection.createDataChannel('state', { ordered: false, maxRetransmits: 0 }))
      this._createOffer(member.id, connection)
    }
    this._watchConnection(member.id)
    return connection
  }

  _attachChannel(peerId, channel) {
    const connection = this.connections.get(peerId)
    const current = () => !this.disposed && this.connections.get(peerId) === connection
    const channels = this.channels.get(peerId) || {}
    if (channel.label === 'state') channels.state = channel
    else channels.control = channel
    this.channels.set(peerId, channels)
    channel.onopen = () => {
      if (!current()) return
      this.peerHeartbeatAt.set(peerId, Date.now())
      this._updatePeerState(peerId)
    }
    channel.onclose = () => { if (current()) this._retryPeer(peerId) }
    channel.onerror = () => { if (current()) this._retryPeer(peerId) }
    channel.onmessage = (event) => {
      if (!current()) return
      try {
        const message = JSON.parse(String(event.data))
        if (!message || typeof message.kind !== 'string') return
        this.peerHeartbeatAt.set(peerId, Date.now())
        if (message.kind === '__gamelink_peer_ping') {
          const control = this.channels.get(peerId)?.control
          if (control?.readyState === 'open') control.send(JSON.stringify({ kind: '__gamelink_peer_pong', payload: message.payload }))
          return
        }
        if (message.kind === '__gamelink_peer_pong') {
          if (message.payload?.seq === this.peerHeartbeatPending.get(peerId)) this.peerHeartbeatPending.delete(peerId)
          return
        }
        this.peerHeartbeatPending.delete(peerId)
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

  _checkPeerHeartbeats(now = Date.now()) {
    if (this.disposed) return
    for (const [peerId, state] of this.peerStates) {
      if (state !== 'connected') continue
      const channel = this.channels.get(peerId)?.control
      if (channel?.readyState !== 'open') {
        this._retryPeer(peerId)
        continue
      }
      const lastSeen = this.peerHeartbeatAt.get(peerId) || now
      if (now - lastSeen > this.peerTimeoutMs) {
        this.peerHeartbeatPending.delete(peerId)
        this._retryPeer(peerId)
        continue
      }
      if (this.peerHeartbeatPending.has(peerId)) continue
      const seq = ++this.peerHeartbeatSequence
      try {
        channel.send(JSON.stringify({ kind: '__gamelink_peer_ping', payload: { seq } }))
        this.peerHeartbeatPending.set(peerId, seq)
      } catch (error) {
        this._retryPeer(peerId)
        this._reportError(error)
      }
    }
  }

  _updatePeerState(peerId) {
    const connection = this.connections.get(peerId)
    if (!connection) return
    const channels = this.channels.get(peerId)
    if (connection.connectionState === 'connected'
      && channels?.control?.readyState === 'open'
      && channels?.state?.readyState === 'open') {
      clearTimeout(this.retryTimers.get(peerId))
      this.retryTimers.delete(peerId)
      this.retryAttempts.delete(peerId)
      const recovered = this.connectedOnce.has(peerId)
      const changed = this.peerStates.get(peerId) !== 'connected'
      this.connectedOnce.add(peerId)
      this.peerHeartbeatAt.set(peerId, Date.now())
      this.peerHeartbeatPending.delete(peerId)
      this._setPeerState(peerId, 'connected')
      if (changed) this._emit('peer-ready', { peerId, generation: this.generations.get(peerId), recovered })
      this._updateIceAddresses(peerId, connection)
      this._logConnection(peerId, connection)
    } else if (connection.connectionState === 'failed' || connection.connectionState === 'closed' || connection.connectionState === 'disconnected') {
      this._retryPeer(peerId)
    } else {
      this._setPeerState(peerId, this.retryAttempts.has(peerId) ? 'reconnecting' : 'connecting')
      this._watchConnection(peerId)
    }
  }

  _watchConnection(peerId) {
    if (this.disposed || !this.members.some(m => m.id === peerId) || this.peerStates.get(peerId) === 'connected' || this.retryTimers.has(peerId)) return
    this.retryTimers.set(peerId, setTimeout(() => {
      this.retryTimers.delete(peerId)
      this._retryPeer(peerId)
    }, 15000))
  }

  _retryPeer(peerId) {
    if (this.disposed || !this.members.some(m => m.id === peerId)) return
    // Replace the negotiation timeout once; repeated error events must not delay retry.
    if (this.peerStates.get(peerId) === 'reconnecting' && this.retryTimers.has(peerId)) return
    clearTimeout(this.retryTimers.get(peerId))
    const attempt = (this.retryAttempts.get(peerId) || 0) + 1
    this.retryAttempts.set(peerId, attempt)
    this._setPeerState(peerId, 'reconnecting')
    const delay = Math.min(30000, 1000 * 2 ** Math.min(attempt - 1, 5)) + Math.floor(Math.random() * 500)
    this.retryTimers.set(peerId, setTimeout(async () => {
      this.retryTimers.delete(peerId)
      if (this.disposed || !this.members.some(m => m.id === peerId)) return
      try {
        if (this.selfMember.id.localeCompare(peerId) < 0) {
          // Only the deterministic offerer rebuilds the pair, avoiding offer glare.
          await this._sendSignal(peerId, 'webrtc_restart', {})
          if (this.disposed || !this.members.some(m => m.id === peerId)) return
          const old = this.connections.get(peerId)
          this.connections.delete(peerId)
          old?.close()
          this.channels.delete(peerId)
          this.pendingIce.delete(peerId)
          this.localIceAddresses.delete(peerId)
          this.remoteIceAddresses.delete(peerId)
          this._ensurePeerConnection(this.members.find(m => m.id === peerId))
        } else {
          await this._sendSignal(peerId, 'webrtc_retry', { generation: this.generations.get(peerId) || 0 })
        }
      } catch (error) { this._reportError(error) }
      this._watchConnection(peerId)
    }, delay))
  }

  _setPeerState(peerId, state) {
    this.peerStates.set(peerId, state)
    this._emitPeerState(peerId, state)
  }

  _emitPeerState(peerId, state) {
    this._emit('peer-state', {
      peerId,
      state,
      attempt: this.retryAttempts.get(peerId) || 0,
      generation: this.generations.get(peerId) || 0,
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
      if (this.disposed || this.connections.get(peerId) !== connection) return
      if (description) await this._sendSignal(peerId, 'webrtc_offer', { type: description.type, sdp: description.sdp, generation: this.generations.get(peerId) })
    } catch (error) {
      if (this.disposed || this.connections.get(peerId) !== connection) return
      this._retryPeer(peerId)
      this._reportError(error)
    }
  }

  async _receiveSignal(signal) {
    if (this.disposed || !signal.kind.startsWith('webrtc_') || !this.members.some(m => m.id === signal.from)) return
    const member = this.members.find((entry) => entry.id === signal.from)
      || { id: signal.from, name: signal.from, virtual_ip: '', endpoint: '' }
    const peerId = signal.from
    const offerer = this.selfMember.id.localeCompare(peerId) < 0
    if (signal.kind === 'webrtc_retry' || signal.kind === 'webrtc_restart') {
      if (offerer) {
        const observed = signal.payload?.generation
        if (signal.kind === 'webrtc_retry' && ((observed > 0 && observed < (this.generations.get(peerId) || 0)) || (!observed && this.peerStates.get(peerId) === 'connected'))) return
        if (Number.isSafeInteger(observed) && observed > 0) this.lastGeneration = Math.max(this.lastGeneration, observed)
        this._retryPeer(peerId)
      }
      return
    }
    const payload = { ...(signal.payload || {}) }
    const generation = payload.generation
    delete payload.generation
    if (!Number.isSafeInteger(generation) || generation <= 0) return
    const active = this.generations.get(peerId) || 0
    if (generation < active) return
    if (signal.kind === 'webrtc_offer') {
      if (offerer || generation === active) return
      clearTimeout(this.retryTimers.get(peerId))
      this.retryTimers.delete(peerId)
      const old = this.connections.get(peerId)
      this.connections.delete(peerId)
      old?.close()
      this.channels.delete(peerId)
      this.pendingIce.delete(peerId)
      this.localIceAddresses.delete(peerId)
      this.remoteIceAddresses.delete(peerId)
      this._ensurePeerConnection(member, generation)
      const queued = this.futureIce.get(peerId)
      if (queued?.generation === generation) this.pendingIce.set(peerId, queued.candidates)
      this.futureIce.delete(peerId)
    } else if (generation !== active) {
      // ICE may overtake the offer because HTTP signal requests are independent.
      if (!offerer && signal.kind === 'webrtc_ice' && payload.candidate && !/ typ relay(?: |$)/.test(payload.candidate)) {
        let queued = this.futureIce.get(peerId)
        if (!queued || generation > queued.generation) {
          queued = { generation, candidates: [] }; this.futureIce.set(peerId, queued)
        }
        if (queued.generation === generation && queued.candidates.length < 64) queued.candidates.push(payload)
      }
      return
    }
    const connection = this.connections.get(peerId)
    if (!connection) return
    const current = () => !this.disposed && this.connections.get(peerId) === connection
    if (payload.sdp) payload.sdp = payload.sdp.split("\r\n").filter(line => !/^a=candidate:.* typ relay(?: |$)/.test(line)).join("\r\n")
    if (payload.candidate && / typ relay(?: |$)/.test(payload.candidate)) return
    try {
      if (signal.kind === 'webrtc_offer') {
        await connection.setRemoteDescription(payload)
        if (!current()) return
        await this._applyPendingIce(signal.from, connection)
        if (!current()) return
        await connection.setLocalDescription(await connection.createAnswer())
        const description = connection.localDescription
        if (current() && description) await this._sendSignal(signal.from, 'webrtc_answer', { type: description.type, sdp: description.sdp, generation })
      } else if (signal.kind === 'webrtc_answer') {
        await connection.setRemoteDescription(payload)
        if (!current()) return
        await this._applyPendingIce(signal.from, connection)
      } else if (signal.kind === 'webrtc_ice') {
        if (payload.candidate) this._rememberIceCandidate(this.remoteIceAddresses, signal.from, payload.candidate)
        if (payload.candidate && connection.remoteDescription) await connection.addIceCandidate(payload)
        else if (payload.candidate) this.pendingIce.set(signal.from, [...(this.pendingIce.get(signal.from) || []), payload])
      }
    } catch (error) {
      if (this.disposed || this.connections.get(signal.from) !== connection) return
      this._retryPeer(signal.from)
      this._reportError(error)
      throw error
    }
  }

  async _applyPendingIce(peerId, connection) {
    const candidates = this.pendingIce.get(peerId) || []
    this.pendingIce.delete(peerId)
    for (const candidate of candidates) await connection.addIceCandidate(candidate)
  }

  async _sendSignal(to, kind, payload) {
    if (this.disposed || !this.room || !this.selfMember) throw new Error('not connected to a room')
    await this._request(`/v1/rooms/${encodeURIComponent(this.room.code)}/signals`, 'POST', {
      from: this.selfMember.id,
      to,
      kind,
      payload,
    })
  }

  async _request(path, method = 'GET', payload, options = {}) {
    if (payload !== undefined && this.memberToken) payload = { ...payload, auth_token: this.memberToken }
    const controller = new AbortController()
    const abort = () => controller.abort()
    if (options.signal?.aborted) abort()
    else options.signal?.addEventListener('abort', abort, { once: true })
    const timeout = setTimeout(abort, options.timeoutMs || this.requestTimeoutMs)
    try {
      const response = await fetch(`${this.serverUrl}${path}`, {
        method, signal: controller.signal,
        headers: payload === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: payload === undefined ? undefined : JSON.stringify(payload),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) { const error = new Error(body?.error || body?.message || `GameLink request failed (${response.status})`); error.status = response.status; throw error }
      // Signaling and event endpoints acknowledge delivery with an empty 202.
      if (![202, 204].includes(response.status) && body === null) throw new Error('Invalid GameLink JSON response')
      return body
    } finally {
      clearTimeout(timeout)
      options.signal?.removeEventListener('abort', abort)
    }
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
