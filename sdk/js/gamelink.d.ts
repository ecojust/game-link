export interface GameLinkMember {
  id: string
  name: string
  virtual_ip: string
  endpoint: string
}

export interface GameLinkRoom {
  id: string
  code: string
  game_id: string
  members: GameLinkMember[]
}

export interface GameLinkJoinResponse {
  room: GameLinkRoom
  self_member: GameLinkMember
  resume_token: string
  handoff_token?: string
}

export interface GameLinkMessage<T = unknown> {
  from: string
  kind: string
  payload: T
  sent_at: number
  transport: 'p2p' | 'turn'
}

export interface GameLinkPeerState {
  peerId: string
  state: 'connecting' | 'connected' | 'reconnecting' | 'closed'
  attempt: number
  generation: number
  networkStage: 'lan' | 'stun' | 'turn'
  transport: 'p2p' | 'turn' | null
  localIce: string
  remoteIce: string
}

export interface GameLinkStunStatus {
  peerId: string
  generation: number
  status: 'server-error' | 'available' | 'failed' | 'unconfirmed'
  urls: string[]
  failures: { url: string; errorCode: number; errorText: string }[]
  publicCandidate: boolean
  code?: 'STUN_SERVER_ERROR' | 'STUN_ALL_FAILED' | 'STUN_NO_PUBLIC_CANDIDATE' | 'STUN_TIMEOUT'
  message?: string
  url?: string
  errorCode?: number
  errorText?: string
}

export interface GameLinkStunError extends Error, GameLinkStunStatus {
  code: 'STUN_SERVER_ERROR' | 'STUN_ALL_FAILED' | 'STUN_NO_PUBLIC_CANDIDATE' | 'STUN_TIMEOUT'
}

export interface GameLinkDebugEntry {
  time: string
  stage: string
  [key: string]: unknown
}

export interface GameLinkConnectionPlayer {
  id: string
  name: string
  isSelf: boolean
  state: 'local' | GameLinkPeerState['state']
  transport: 'p2p' | 'turn' | null
  networkStage: 'lan' | 'stun' | 'turn' | null
  attempt: number
  generation: number
  localIce: string
  remoteIce: string
}

export interface GameLinkConnectionsSnapshot {
  readonly roomCode: string | null
  readonly selfId: string | null
  readonly memberCount: number
  readonly maxMembers: number
  readonly disposed: boolean
  readonly players: readonly Readonly<GameLinkConnectionPlayer>[]
}

export type GameLinkLogsSnapshot = readonly Readonly<GameLinkDebugEntry>[]

export interface GameLinkDiagnosticOptions<T> {
  /** Defaults to dialog. Data mode never creates UI or accesses the DOM. */
  type?: 'dialog' | 'data'
  /** Receives the initial snapshot immediately, then each real-time update. */
  onChange?: (data: T) => void
}

export interface GameLinkDiagnosticView<T> {
  readonly type: 'dialog' | 'data'
  /** Latest immutable snapshot; never includes authentication credentials. */
  readonly data: T
  /** Subscribe immediately and on updates. Returns an unsubscribe function. */
  subscribe(listener: (data: T) => void): () => void
  /** Release subscriptions and close the optional dialog. Safe to call repeatedly. */
  dispose(): void
  close(): void
}

export interface GameLinkClientOptions {
  debug?: boolean
  serverUrl?: string
  gameId: string
  playerName: string
  iceServers?: RTCIceServer[]
  requestTimeoutMs?: number
  /** Retry delay after polling errors; 1.2 uses long polling. */
  pollIntervalMs?: number
  heartbeatIntervalMs?: number
  peerHeartbeatIntervalMs?: number
  peerTimeoutMs?: number
  /** Optional room refresh fallback; 0 by default. */
  roomRefreshIntervalMs?: number
}

export class GameLinkClient {
  constructor(options: GameLinkClientOptions)
  static fromLocation(options?: Partial<GameLinkClientOptions>): GameLinkClient
  getLogs(options?: GameLinkDiagnosticOptions<GameLinkLogsSnapshot>): GameLinkDiagnosticView<GameLinkLogsSnapshot>
  getConnections(options?: GameLinkDiagnosticOptions<GameLinkConnectionsSnapshot> & { maxMembers?: number }): GameLinkDiagnosticView<GameLinkConnectionsSnapshot>
  /** @deprecated Render app-owned buttons and call getLogs/getConnections instead. */
  mountConnectionBanner(options?: { container?: HTMLElement; expanded?: boolean; maxMembers?: number }): () => void
  createLaunchUrl(entryUrl: string): Promise<string>
  joinFromLocation(): Promise<GameLinkJoinResponse>
  debug: boolean
  debugLogs: GameLinkDebugEntry[]
  serverUrl: string
  gameId: string
  room: GameLinkRoom | null
  selfMember: GameLinkMember | null
  members: GameLinkMember[]
  peerStates: Map<string, string>
  peerTransports: Map<string, 'p2p' | 'turn'>
  networkStages: Map<string, number>
  localIceAddresses: Map<string, string>
  remoteIceAddresses: Map<string, string>
  on(event: 'room', listener: (room: GameLinkRoom) => void): () => void
  on(event: 'members', listener: (members: GameLinkMember[]) => void): () => void
  on(event: 'message', listener: (message: GameLinkMessage) => void): () => void
  on(event: 'peer-ready', listener: (event: { peerId: string; generation: number; recovered: boolean }) => void): () => void
  on(event: 'peer-state', listener: (state: GameLinkPeerState) => void): () => void
  on(event: 'delivery-skipped', listener: (event: { peerId: string; kind: string; reason: 'p2p-not-ready' }) => void): () => void
  on(event: 'stun-status', listener: (status: GameLinkStunStatus) => void): () => void
  on(event: 'error', listener: (error: Error) => void): () => void
  on(event: 'debug-log', listener: (entry: GameLinkDebugEntry) => void): () => void
  on(event: 'disposed', listener: () => void): () => void
  on(event: 'room-closed', listener: (event: { reason: string }) => void): () => void
  createRoom(): Promise<GameLinkJoinResponse>
  joinRoom(code: string): Promise<GameLinkJoinResponse>
  refreshRoom(): Promise<GameLinkRoom | null>
  broadcast(kind: string, payload: unknown): Promise<void>
  send(kind: string, payload: unknown, options?: { target?: string; reliability?: 'reliable' | 'unreliable' }): void
  leave(): Promise<void>
  dispose(): void
}

export const DEFAULT_ICE_SERVERS: RTCIceServer[]
