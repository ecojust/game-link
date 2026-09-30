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
  host_id: string
  members: GameLinkMember[]
}

export interface GameLinkJoinResponse {
  room: GameLinkRoom
  self_member: GameLinkMember
}

export interface GameLinkMessage<T = unknown> {
  from: string
  kind: string
  payload: T
  sent_at: number
  transport: 'p2p' | 'server-forwarding' | 'server-event'
}

export interface GameLinkPeerState {
  peerId: string
  state: 'connecting' | 'connected' | 'relay' | 'closed'
  localIce: string
  remoteIce: string
}

export interface GameLinkClientOptions {
  serverUrl?: string
  gameId: string
  playerName: string
  iceServers?: RTCIceServer[]
  pollIntervalMs?: number
  heartbeatIntervalMs?: number
  roomRefreshIntervalMs?: number
}

export class GameLinkClient {
  constructor(options: GameLinkClientOptions)
  room: GameLinkRoom | null
  selfMember: GameLinkMember | null
  members: GameLinkMember[]
  peerStates: Map<string, string>
  localIceAddresses: Map<string, string>
  remoteIceAddresses: Map<string, string>
  on(event: 'room', listener: (room: GameLinkRoom) => void): () => void
  on(event: 'members', listener: (members: GameLinkMember[]) => void): () => void
  on(event: 'message', listener: (message: GameLinkMessage) => void): () => void
  on(event: 'peer-state', listener: (state: GameLinkPeerState) => void): () => void
  on(event: 'error', listener: (error: Error) => void): () => void
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
