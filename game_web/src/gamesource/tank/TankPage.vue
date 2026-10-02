<script setup lang="ts">
import '../shared/battle.css'
import { BattleAudio } from '../shared/audio'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { GameLinkClient } from '../../../../sdk/js/gamelink.js'
import type { GameLinkMessage, GameLinkRoom } from '../../../../sdk/js/gamelink.js'

type Member = { id: string; name: string; virtual_ip: string; endpoint: string }
type Room = GameLinkRoom
type Tank = { id: string; name: string; x: number; y: number; angle: number; hp: number; kills: number; color: string; alive: boolean; targetX?: number; targetY?: number; targetAngle?: number; hasRemoteState?: boolean }
type Bullet = { id: string; owner: string; x: number; y: number; angle: number; ttl: number; hit: Set<string> }

const WIDTH = 1000
const HEIGHT = 620
const PALETTE = ['#79e2ba', '#ffb65d', '#75b8ff', '#e982a4', '#c49cff', '#f3e16f', '#64d7d1', '#ff8d65', '#a9d878', '#efa8ff', '#82c4d0', '#ffd28c', '#92a5ff', '#d2df78', '#f28fba', '#a6dcb7']
const SPAWNS = [
  [86, 86], [360, 86], [640, 86], [914, 86],
  [86, 230], [360, 230], [640, 230], [914, 230],
  [86, 390], [360, 390], [640, 390], [914, 390],
  [86, 534], [360, 534], [640, 534], [914, 534],
]
const WALLS = [
  { x: 440, y: 115, w: 120, h: 38 },
  { x: 440, y: 467, w: 120, h: 38 },
  { x: 272, y: 266, w: 88, h: 88 },
  { x: 640, y: 266, w: 88, h: 88 },
  { x: 465, y: 267, w: 70, h: 86 },
]

const platformHome = ref('https://games.b14f.com/')
const room = ref<Room | null>(null)
const self = ref<Member | null>(null)
const phase = ref<'start' | 'lobby' | 'battle' | 'result'>('start')
const busy = ref(false)
const error = ref('')
const note = ref('')
const members = ref<Member[]>([])
const readyMap = reactive<Record<string, boolean>>({})
const selfReady = ref(false)
const remoteTanks = reactive<Record<string, Tank>>({})
const localTank = reactive<Tank>({ id: '', name: '', x: WIDTH / 2, y: HEIGHT / 2, angle: 0, hp: 100, kills: 0, color: PALETTE[0], alive: true })
const bullets: Bullet[] = []
const canvas = ref<HTMLCanvasElement | null>(null)
const fireHeld = ref(false)
const tankMenu = ref(false)
const tankMusic = ref(true), tankVolume = ref(30)
let tankAudio: BattleAudio | undefined
let tankAudioStarted = false
function unlockTankAudio() {
  if (!tankMusic.value || tankAudioStarted || room.value?.game_id !== 'tank-arena' || phase.value !== 'battle') return
  tankAudio ||= new BattleAudio()
  tankAudio.setVolume(tankVolume.value / 100)
  tankAudioStarted = true
  void tankAudio.enable(true).catch(() => { tankAudioStarted = false; tankMusic.value = false })
}
function toggleTankMusic() {
  tankMusic.value = !tankMusic.value; tankAudioStarted = false
  if (tankMusic.value) unlockTankAudio(); else void tankAudio?.enable(false)
}
function tankAudioVisibility() {
  if (document.hidden) tankAudio?.pause()
  else if (tankAudioStarted && tankMusic.value && phase.value === 'battle') void tankAudio?.enable(true).catch(() => {})
}
function disposeTankAudio() { tankAudio?.dispose(); tankAudio = undefined; tankAudioStarted = false }

const gameMessage = ref('')
const shotCooldown = ref(0)
const peerStates = reactive<Record<string, string>>({})
const localIceAddresses = reactive<Record<string, string>>({})
const remoteIceAddresses = reactive<Record<string, string>>({})
let clientSession: GameLinkClient | null = null
let stateFlushTimeout = 0
let localStateDirty = false
let lastStateSentAt = 0
let animationFrame = 0
let lastFrame = 0
const keys = new Set<string>()
const touchPointers = new Map<number, string>()
const membersSorted = computed(() => [...members.value].sort((a, b) => a.id.localeCompare(b.id)))
const readyCount = computed(() => members.value.filter((member) => member.id === self.value?.id ? selfReady.value : Boolean(readyMap[member.id])).length)
const connectedPeerCount = computed(() => members.value.filter((member) => member.id !== self.value?.id && peerStates[member.id] === 'connected').length)
const peerTotalCount = computed(() => Math.max(0, members.value.length - (self.value ? 1 : 0)))
const localIceSummary = computed(() => [...new Set(Object.values(localIceAddresses))].join(' / '))
const remoteIceSummary = computed(() => [...new Set(Object.values(remoteIceAddresses))].join(' / '))
const networkMode = computed(() => {
  if (peerTotalCount.value === 0) return '等待队友'
  if (members.value.some(member => peerStates[member.id] === 'reconnecting')) return 'P2P 重连中'
  return connectedPeerCount.value < peerTotalCount.value ? 'P2P 连接中' : 'P2P 直连'
})
const networkModeClass = computed(() => networkMode.value === 'P2P 直连' ? 'p2p' : 'pending')
const allPeerPathsReady = computed(() => members.value.length > 1 && members.value.filter((member) => member.id !== self.value?.id).every((member) => peerStates[member.id] === 'connected'))
const canStart = computed(() => allPeerPathsReady.value && readyCount.value === members.value.length)
const scores = computed(() => [localTank, ...Object.values(remoteTanks)].filter((tank) => tank.id).sort((a, b) => b.kills - a.kills))
const activeGame = { title: '多人坦克竞技场', subtitle: 'IRON FIELD' }

async function connectRoom() {
  busy.value = true
  error.value = ''
  let session: GameLinkClient
  try {
    session = GameLinkClient.fromLocation()
    if (session.gameId !== 'tank-arena') throw new Error('此页面只支持坦克游戏。')
  } catch (reason) { error.value = messageOf(reason); busy.value = false; return }
  platformHome.value = session.serverUrl + '/'
  clientSession = session
  session.on('room', (latest) => {
    room.value = latest
    members.value = latest.members
  })
  session.on('members', (latest) => {
    members.value = latest
    for (const member of latest) readyMap[member.id] ??= false
    if (phase.value === 'battle' && room.value?.game_id === 'tank-arena') {
      const lineup = [...latest].sort((a, b) => a.id.localeCompare(b.id))
      const newcomers = lineup.filter((member) => member.id !== self.value?.id && !remoteTanks[member.id])
      lineup.forEach((member, index) => {
        if (member.id !== self.value?.id) remoteTanks[member.id] ||= newTank(member.id, member.name, index)
      })
      if (newcomers.length) note.value = `${newcomers.map((member) => member.name).join('、')} 加入了战场`
    }
  })
  session.on('peer-state', ({ peerId, state, localIce, remoteIce }) => {
    if (state === 'closed') {
      delete peerStates[peerId]
      delete localIceAddresses[peerId]
      delete remoteIceAddresses[peerId]
      delete remoteTanks[peerId]
      delete syncingPeers[peerId]
      stateVersions.delete(peerId)
    } else {
      peerStates[peerId] = state
      if (localIce) localIceAddresses[peerId] = localIce
      if (remoteIce) remoteIceAddresses[peerId] = remoteIce
      if (state !== 'connected') delete localIceAddresses[peerId]
      if (state === 'connected') markLocalStateDirty()
      if (state === 'reconnecting') note.value = 'P2P 连接中断，正在自动重连。'
    }
    clearReadyIfDisconnected()
  })
  session.on('peer-ready', ({ peerId }) => {
    error.value = ''
    requestPeerRecovery(peerId)
  })
  session.on('message', receiveEvent)
  session.on('error', (reason) => { error.value = messageOf(reason) })
  session.on('room-closed', () => {
    error.value = '你已离开房间，请重新加入。'
    void leaveRoom(false)
  })

  try {
    const result = await session.joinFromLocation()
    if (clientSession !== session) return
    room.value = result.room
    self.value = result.self_member
    members.value = result.room.members
    selfReady.value = false
    readyMap[result.self_member.id] = false
    for (const member of members.value) readyMap[member.id] ??= false
    beginBattle(result.room.members.map(({ id, name }) => ({ id, name })))
  } catch (reason) {
    session.dispose()
    if (clientSession === session) clientSession = null
    error.value = messageOf(reason)
  } finally {
    busy.value = false
  }
}

// Each owner supplies its current tank; old shots/hits are intentionally not replayed.
const syncingPeers = reactive<Record<string, boolean>>({})
const stateVersions = new Map<string, number>()
let stateRevision = 0
const recoveryNotice = computed(() => {
  const missing = members.value.filter(m => m.id !== self.value?.id && (peerStates[m.id] !== 'connected' || syncingPeers[m.id]))
  return missing.length ? `${missing.map(m => m.name).join('、')} · 连接中断或正在同步，战斗暂停；自动重连中` : ''
})
function sendRecovery(peerId: string) {
  if (!self.value || !localTank.id) return
  sendPeerData('tank-recovery', { tank: tankSnapshot(localTank), ready: selfReady.value, result: phase.value === 'result' ? gameMessage.value : '' }, peerId)
}

function requestPeerRecovery(peerId: string) {
  if (!self.value || !localTank.id || peerStates[peerId] !== 'connected') return
  syncingPeers[peerId] = true
  stateVersions.delete(peerId)
  sendRecovery(peerId)
  sendPeerData('tank-recovery-request', {}, peerId)
}

function synchronizeConnectedPeers() {
  for (const member of members.value) {
    if (member.id !== self.value?.id) requestPeerRecovery(member.id)
  }
}

async function broadcast(kind: string, payload: unknown) {
  if (!clientSession) return
  await clientSession.broadcast(kind, payload)
}

function sendPeerData(kind: string, payload: unknown, target?: string) {
  clientSession?.send(kind, payload, {
    target,
    reliability: kind === 'player_state' ? 'unreliable' : 'reliable',
  })
}

function markLocalStateDirty() {
  if (phase.value !== 'battle') return
  localStateDirty = true
  flushLocalState()
}

function flushLocalState() {
  if (!localStateDirty || phase.value !== 'battle') return
  if (!clientSession || peerTotalCount.value === 0) {
    localStateDirty = false
    return
  }
  const minimumInterval = 50
  const remaining = minimumInterval - (performance.now() - lastStateSentAt)
  if (remaining > 0) {
    if (!stateFlushTimeout) {
      stateFlushTimeout = window.setTimeout(() => {
        stateFlushTimeout = 0
        flushLocalState()
      }, remaining)
    }
    return
  }
  localStateDirty = false
  lastStateSentAt = performance.now()
  sendPeerData('player_state', tankSnapshot(localTank))
}

async function toggleReady() {
  if (!self.value) return
  if (!allPeerPathsReady.value) {
    error.value = '正在建立玩家连接；直连失败时会自动重试。'
    return
  }
  selfReady.value = !selfReady.value
  readyMap[self.value.id] = selfReady.value
  try { await broadcast('ready', { ready: selfReady.value }) }
  catch (reason) { selfReady.value = !selfReady.value; readyMap[self.value.id] = selfReady.value; error.value = messageOf(reason) }
}

function clearReadyIfDisconnected() {
  if (!self.value || !selfReady.value || allPeerPathsReady.value) return
  selfReady.value = false
  readyMap[self.value.id] = false
  void broadcast('ready', { ready: false }).catch((reason) => { error.value = messageOf(reason) })
}

async function startBattle() {
  if (!canStart.value || !room.value) return
  const roster = membersSorted.value.map((member) => ({ id: member.id, name: member.name }))
  try {
    await broadcast('game_started', { roster })
    beginBattle(roster)
  } catch (reason) { error.value = messageOf(reason) }
}

function receiveEvent(signal: GameLinkMessage<any>) {
  const payload = signal.payload || {}
  if (signal.kind === 'tank-recovery-request') { sendRecovery(signal.from); return }
  if (signal.kind === 'tank-recovery') {
    if (!payload.tank || !Number.isSafeInteger(payload.tank.revision) || ![payload.tank.x, payload.tank.y, payload.tank.angle, payload.tank.hp].every(Number.isFinite)) return
    receiveEvent({ ...signal, kind: 'player_state', payload: payload.tank })
    readyMap[signal.from] = Boolean(payload.ready)
    delete syncingPeers[signal.from]
    note.value = 'P2P 已恢复，玩家状态已同步。'
    if (payload.result) {
      gameMessage.value = payload.result; phase.value = 'result'; stopBattleLoop()
    }
    return
  }
  if (signal.kind === 'ready') readyMap[signal.from] = Boolean(payload.ready)
  else if (signal.kind === 'game_started') beginBattle(payload.roster || [])
  else if (signal.kind === 'player_state') {
    if (signal.from !== self.value?.id) {
      if (!Number.isSafeInteger(payload.revision) || payload.revision <= (stateVersions.get(signal.from) ?? -1)) return
      stateVersions.set(signal.from, payload.revision)
      const tank = remoteTanks[signal.from] ||= newTank(signal.from, payload.name || '队友', 0)
      const x = Number(payload.x)
      const y = Number(payload.y)
      const angle = Number(payload.angle)
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(angle)) return
      if (!tank.hasRemoteState) {
        tank.x = x
        tank.y = y
        tank.angle = angle
        tank.hasRemoteState = true
      }
      tank.targetX = x
      tank.targetY = y
      tank.targetAngle = angle
      tank.hp = Number(payload.hp ?? tank.hp)
      tank.kills = Number(payload.kills ?? tank.kills)
      tank.color = payload.color || tank.color
      tank.alive = payload.alive !== false
      tank.name = payload.name || tank.name
    }
  } else if (signal.kind === 'shot') {
    if (!bullets.some((bullet) => bullet.id === payload.id)) bullets.push({ ...payload, ttl: 2.3, hit: new Set<string>() })
  } else if (signal.kind === 'hit' && payload.target === self.value?.id) {
    localTank.hp = Math.max(0, localTank.hp - Number(payload.damage || 25))
    if (localTank.hp === 0) localTank.alive = false
    markLocalStateDirty()
    note.value = localTank.alive ? '装甲受损' : '坦克被击毁'
  } else if (signal.kind === 'game_over') {
    gameMessage.value = payload.winner_name ? `${payload.winner_name} 获得胜利` : '本局结束'
    phase.value = 'result'
    stopBattleLoop()
  }
}

function newTank(id: string, name: string, slot: number): Tank {
  const [x, y] = SPAWNS[slot % SPAWNS.length]
  return { id, name, x, y, angle: Math.atan2(HEIGHT / 2 - y, WIDTH / 2 - x), hp: 100, kills: 0, color: PALETTE[slot % PALETTE.length], alive: true }
}

function peerStatusLabel(memberId: string) {
  if (memberId === self.value?.id) {
    if (peerTotalCount.value === 0) return '等待玩家接入'
    const modes: string[] = []
    if (connectedPeerCount.value) modes.push('P2P 直连')
    if (connectedPeerCount.value < peerTotalCount.value) modes.push('连接协商中')
    return modes.join(' + ')
  }
  if (peerStates[memberId] === 'connected') return 'P2P 已连接'
  if (peerStates[memberId] === 'reconnecting') return 'P2P 重连中'
  return 'P2P 连接中'
}

function beginBattle(roster: Array<{ id: string; name: string }>) {
  tankMenu.value = false
  if (!self.value) return
  const lineup = [...roster].sort((a, b) => a.id.localeCompare(b.id))
  for (const key of Object.keys(remoteTanks)) delete remoteTanks[key]
  bullets.splice(0)
  lineup.forEach((entry, index) => {
    if (entry.id === self.value?.id) Object.assign(localTank, newTank(entry.id, entry.name, index))
    else remoteTanks[entry.id] = newTank(entry.id, entry.name, index)
  })
  phase.value = 'battle'
  gameMessage.value = ''
  lastFrame = performance.now()
  markLocalStateDirty()
  synchronizeConnectedPeers()
  if (!animationFrame) animationFrame = requestAnimationFrame(frame)
}

function tankSnapshot(tank: Tank) {
  return { revision: ++stateRevision, x: tank.x, y: tank.y, angle: tank.angle, hp: tank.hp, kills: tank.kills, color: tank.color, alive: tank.alive, name: tank.name }
}

function stopBattleLoop() {
  tankAudio?.pause()
  cancelAnimationFrame(animationFrame)
  animationFrame = 0
  window.clearTimeout(stateFlushTimeout)
  stateFlushTimeout = 0
  localStateDirty = false
  keys.clear()
  fireHeld.value = false
}

function frame(now: number) {
  animationFrame = requestAnimationFrame(frame)
  const dt = Math.min((now - lastFrame) / 1000 || 0, 0.045)
  lastFrame = now
  if (phase.value === 'battle' && room.value?.game_id === 'tank-arena') tick(dt)
  drawArena()
}

function tick(dt: number) {
  if (recoveryNotice.value) { bullets.splice(0); keys.clear(); fireHeld.value = false; return }
  if (localTank.alive) {
    const previousX = localTank.x
    const previousY = localTank.y
    const previousAngle = localTank.angle
    const horizontal = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'))
    const vertical = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'))
    if (horizontal || vertical) {
      const length = Math.hypot(horizontal, vertical)
      const dx = (horizontal / length) * 175 * dt
      const dy = (vertical / length) * 175 * dt
      localTank.angle = Math.atan2(dy, dx)
      moveTank(dx, dy)
    }
    if (localTank.x !== previousX || localTank.y !== previousY || localTank.angle !== previousAngle) markLocalStateDirty()
    shotCooldown.value = Math.max(0, shotCooldown.value - dt)
    if ((keys.has(' ') || fireHeld.value) && shotCooldown.value === 0) fire()
  }
  const smoothing = 1 - Math.exp(-18 * dt)
  for (const tank of Object.values(remoteTanks)) {
    if (tank.targetX === undefined || tank.targetY === undefined || tank.targetAngle === undefined) continue
    tank.x += (tank.targetX - tank.x) * smoothing
    tank.y += (tank.targetY - tank.y) * smoothing
    const angleDelta = Math.atan2(Math.sin(tank.targetAngle - tank.angle), Math.cos(tank.targetAngle - tank.angle))
    tank.angle += angleDelta * smoothing
  }
  for (let index = bullets.length - 1; index >= 0; index--) {
    const bullet = bullets[index]
    bullet.x += Math.cos(bullet.angle) * 400 * dt
    bullet.y += Math.sin(bullet.angle) * 400 * dt
    bullet.ttl -= dt
    if (bullet.owner === self.value?.id) {
      for (const tank of Object.values(remoteTanks)) {
        if (!tank.alive || bullet.hit.has(tank.id)) continue
        if (Math.hypot(tank.x - bullet.x, tank.y - bullet.y) < 23) {
          bullet.hit.add(tank.id)
          bullets.splice(index, 1)
          sendPeerData('hit', { target: tank.id, damage: 25, bullet: bullet.id }, tank.id)
          const kill = tank.hp <= 25
          if (kill) {
            localTank.kills += 1
            markLocalStateDirty()
          }
          break
        }
      }
    }
    if (bullet.ttl <= 0 || bullet.x < 28 || bullet.x > WIDTH - 28 || bullet.y < 28 || bullet.y > HEIGHT - 28 || WALLS.some((wall) => bullet.x > wall.x && bullet.x < wall.x + wall.w && bullet.y > wall.y && bullet.y < wall.y + wall.h)) {
      bullets.splice(index, 1)
    }
  }
  const living = [localTank, ...Object.values(remoteTanks)].filter((tank) => tank.alive)
  const allMembersSpawned = Boolean(room.value && room.value.members.every((member) => member.id === self.value?.id || remoteTanks[member.id]))
  if (living.length === 1 && allMembersSpawned && (room.value?.members.length ?? 0) > 1) {
    const winner = living[0]
    gameMessage.value = `${winner.name} 获得胜利`
    phase.value = 'result'
    sendPeerData('game_over', { winner_name: winner.name })
    stopBattleLoop()
  }
}

function moveTank(dx: number, dy: number) {
  const radius = 17
  const nextX = Math.max(radius + 24, Math.min(WIDTH - radius - 24, localTank.x + dx))
  const nextY = Math.max(radius + 24, Math.min(HEIGHT - radius - 24, localTank.y + dy))
  const blocked = (x: number, y: number) => WALLS.some((wall) => x + radius > wall.x && x - radius < wall.x + wall.w && y + radius > wall.y && y - radius < wall.y + wall.h)
  if (!blocked(nextX, localTank.y)) localTank.x = nextX
  if (!blocked(localTank.x, nextY)) localTank.y = nextY
}

function fire() {
  if (recoveryNotice.value || !self.value || shotCooldown.value > 0 || !localTank.alive) return
  shotCooldown.value = 0.42
  const id = crypto.randomUUID()
  const shot = { id, owner: self.value.id, x: localTank.x + Math.cos(localTank.angle) * 28, y: localTank.y + Math.sin(localTank.angle) * 28, angle: localTank.angle }
  bullets.push({ ...shot, ttl: 2.3, hit: new Set<string>() })
  sendPeerData('shot', shot)
}

function drawArena() {
  const element = canvas.value
  if (!element) return
  const rect = element.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  const dpr = window.devicePixelRatio || 1
  const pixelWidth = Math.round(rect.width * dpr)
  const pixelHeight = Math.round(rect.height * dpr)
  if (element.width !== pixelWidth || element.height !== pixelHeight) { element.width = pixelWidth; element.height = pixelHeight }
  const ctx = element.getContext('2d')
  if (!ctx) return
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.fillStyle = '#101b21'; ctx.fillRect(0, 0, pixelWidth, pixelHeight)
  const scale = Math.max(pixelWidth / WIDTH, pixelHeight / HEIGHT)
  const halfViewX = pixelWidth / scale / 2, halfViewY = pixelHeight / scale / 2
  const cameraX = Math.max(halfViewX, Math.min(WIDTH - halfViewX, localTank.x))
  const cameraY = Math.max(halfViewY, Math.min(HEIGHT - halfViewY, localTank.y))
  const offsetX = pixelWidth / 2 - cameraX * scale
  const offsetY = pixelHeight / 2 - cameraY * scale
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY)
  ctx.strokeStyle = '#1c2a2f'
  ctx.lineWidth = 1
  for (let x = 28; x < WIDTH; x += 32) { ctx.beginPath(); ctx.moveTo(x, 26); ctx.lineTo(x, HEIGHT - 26); ctx.stroke() }
  for (let y = 26; y < HEIGHT; y += 32) { ctx.beginPath(); ctx.moveTo(26, y); ctx.lineTo(WIDTH - 26, y); ctx.stroke() }
  ctx.strokeStyle = '#56635b'; ctx.lineWidth = 3; ctx.strokeRect(25, 25, WIDTH - 50, HEIGHT - 50)
  for (const wall of WALLS) {
    ctx.fillStyle = '#26343a'; ctx.fillRect(wall.x, wall.y, wall.w, wall.h)
    ctx.strokeStyle = '#61706c'; ctx.lineWidth = 2; ctx.strokeRect(wall.x + 2, wall.y + 2, wall.w - 4, wall.h - 4)
    ctx.strokeStyle = '#35464a'; ctx.lineWidth = 1
    for (let x = wall.x + 10; x < wall.x + wall.w; x += 15) { ctx.beginPath(); ctx.moveTo(x, wall.y + 5); ctx.lineTo(x, wall.y + wall.h - 5); ctx.stroke() }
  }
  for (const bullet of bullets) {
    ctx.beginPath(); ctx.fillStyle = bullet.owner === self.value?.id ? '#ffe19b' : '#ff8d61'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10; ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
  }
  if (phase.value !== 'lobby' && phase.value !== 'start') {
    drawTank(ctx, localTank, true)
    for (const tank of Object.values(remoteTanks)) drawTank(ctx, tank, false)
  }
}

function drawTank(ctx: CanvasRenderingContext2D, tank: Tank, mine: boolean) {
  if (!tank.id) return
  ctx.save(); ctx.translate(tank.x, tank.y); ctx.rotate(tank.angle)
  ctx.globalAlpha = tank.alive ? 1 : 0.35
  ctx.fillStyle = '#25302f'; ctx.strokeStyle = tank.color; ctx.lineWidth = 2
  ctx.beginPath(); ctx.roundRect(-19, -15, 38, 30, 6); ctx.fill(); ctx.stroke()
  ctx.fillStyle = tank.color
  ctx.fillRect(-16, -19, 32, 5); ctx.fillRect(-16, 14, 32, 5)
  ctx.fillStyle = '#18231f'; ctx.fillRect(-12, -18, 4, 3); ctx.fillRect(-2, -18, 4, 3); ctx.fillRect(8, -18, 4, 3); ctx.fillRect(-12, 15, 4, 3); ctx.fillRect(-2, 15, 4, 3); ctx.fillRect(8, 15, 4, 3)
  ctx.fillStyle = tank.color; ctx.fillRect(0, -4, 27, 8)
  ctx.beginPath(); ctx.arc(-1, 0, 10, 0, Math.PI * 2); ctx.fill()
  ctx.restore(); ctx.globalAlpha = 1
  ctx.font = mine ? 'bold 11px sans-serif' : '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = tank.color; ctx.fillText(mine ? `${tank.name} · 你` : tank.name, tank.x, tank.y - 28)
  ctx.fillStyle = '#293331'; ctx.fillRect(tank.x - 19, tank.y - 23, 38, 4)
  ctx.fillStyle = tank.hp > 50 ? '#79e2ba' : tank.hp > 25 ? '#ffb65d' : '#ff6c61'; ctx.fillRect(tank.x - 19, tank.y - 23, 38 * Math.max(0, tank.hp) / 100, 4)
}

function onKeyDown(event: KeyboardEvent) {
  if (room.value?.game_id !== 'tank-arena' || phase.value !== 'battle') return
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(event.key.toLowerCase())) unlockTankAudio()
  const key = event.key.toLowerCase()
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault()
  keys.add(key)
}
function onKeyUp(event: KeyboardEvent) { keys.delete(event.key.toLowerCase()) }
function startFire(event: PointerEvent) {
  unlockTankAudio()
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  fireHeld.value = true
}
function stopFire() { fireHeld.value = false }
function startTouchMove(key: string, event: PointerEvent) {
  unlockTankAudio()
  const button = event.currentTarget as HTMLElement
  button.setPointerCapture(event.pointerId)
  touchPointers.set(event.pointerId, key)
  keys.add(key)
}
function stopTouchMove(event: PointerEvent) {
  const key = touchPointers.get(event.pointerId)
  if (!key) return
  touchPointers.delete(event.pointerId)
  if (![...touchPointers.values()].includes(key)) keys.delete(key)
}
function onWindowBlur() { touchPointers.clear(); keys.clear(); fireHeld.value = false }

async function copyRoomCode() {
  if (!room.value) return
  try {
    await navigator.clipboard.writeText(room.value.code)
    note.value = '房间号已复制'
  } catch {
    note.value = `房间号：${room.value.code}`
  }
}

async function leaveRoom(tryApi = true) {
  disposeTankAudio()
  const resumeStorageKey = room.value ? `gamelink-resume:${room.value.game_id}:${room.value.code.toUpperCase()}` : ''
  const session = clientSession
  clientSession = null
  stopBattleLoop()
  if (session) {
    try {
      if (tryApi) await session.leave()
      else session.dispose()
    } catch (reason) { error.value = messageOf(reason) }
  }
  room.value = null; self.value = null; members.value = []; selfReady.value = false
  for (const id of Object.keys(readyMap)) delete readyMap[id]
  for (const id of Object.keys(remoteTanks)) delete remoteTanks[id]
  for (const id of Object.keys(peerStates)) delete peerStates[id]
  for (const id of Object.keys(localIceAddresses)) delete localIceAddresses[id]
  for (const id of Object.keys(remoteIceAddresses)) delete remoteIceAddresses[id]
  phase.value = 'start'
  try { if (resumeStorageKey) sessionStorage.removeItem(resumeStorageKey) } catch {}
  window.location.assign(platformHome.value)
}

function leaveRoomFromButton() { void leaveRoom() }

function messageOf(reason: unknown) { return reason instanceof Error ? reason.message : String(reason) }

onMounted(() => {
  document.addEventListener('visibilitychange', tankAudioVisibility)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onWindowBlur)
  animationFrame = requestAnimationFrame(frame)
  void connectRoom()
})
onBeforeUnmount(() => {
  disposeTankAudio()
  document.removeEventListener('visibilitychange', tankAudioVisibility)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', onWindowBlur)
  clientSession?.dispose(); clientSession = null
  stopBattleLoop()
})
</script>
<template>
  <main class="game-shell tank-playing">
    <div v-if="phase === 'start'" class="launch-status"><p>{{ error || '正在加入坦克房间…' }}</p><a :href="platformHome">返回平台大厅</a></div>
    <section v-else class="room-screen">
      <div class="room-toolbar"><div><div class="kicker"><span></span> {{ activeGame.subtitle || room?.game_id }}</div><h1>{{ activeGame.title || room?.game_id }}<i>.</i></h1><p>{{ room?.game_id === 'fc-mini-4wd' ? '用车头击破敌车，保护侧面与车尾。' : phase === 'lobby' ? '分享房间号，所有人准备就绪后即可开始。' : phase === 'battle' ? '击中对手，留在战场上。' : gameMessage }}</p></div><button class="room-code" @click="copyRoomCode"><small>作战房间 · 点击复制</small><strong>{{ room?.code }}</strong><span>▢</span></button><button class="exit-button" @click="leaveRoomFromButton">离开房间 ↗</button></div>

      <div v-if="phase === 'lobby'" class="lobby-grid">
        <section class="roster-card"><div class="panel-heading"><div><small>DEPLOYMENT ROSTER</small><h2>作战成员 <span>{{ members.length }} / 16</span></h2></div><span class="sync-label" :class="networkModeClass"><i></i>{{ networkMode }} · P2P {{ connectedPeerCount }} / {{ peerTotalCount }}</span></div><div class="roster-list"><div v-for="(member, index) in membersSorted" :key="member.id" class="roster-row" :class="{ mine: member.id === self?.id }"><span class="player-index">{{ String(index + 1).padStart(2, '0') }}</span><span class="player-badge" :style="{ '--paint': PALETTE[index % PALETTE.length] }">{{ member.name.slice(0, 1).toUpperCase() }}</span><div class="player-copy"><strong>{{ member.name }}<small v-if="member.id === self?.id">你</small></strong><span>{{ member.id === self?.id ? '玩家 · 本机控制' : '玩家 · P2P 对等连接' }}</span></div><code class="peer-state" :class="{ linked: peerStates[member.id] === 'connected' }">{{ peerStatusLabel(member.id) }}</code><span class="ready-pill" :class="{ ready: member.id === self?.id ? selfReady : readyMap[member.id] }"><i></i>{{ member.id === self?.id ? selfReady ? '已准备' : '待命中' : readyMap[member.id] ? '已准备' : '等待准备' }}</span></div><div v-if="members.length < 2" class="recruit-note"><span>⌁</span><div><strong>还需要一位对手</strong><p>把房间号发给朋友。至少两位玩家才能开始。</p></div></div></div><div class="roster-actions"><button class="ready-button" :class="{ active: selfReady }" :disabled="!allPeerPathsReady" @click="toggleReady">{{ selfReady ? '取消准备' : '我已准备' }} <span>{{ selfReady ? '✓' : '＋' }}</span></button><button class="start-button" :disabled="!canStart" @click="startBattle">开始对战 <span>→</span></button><div v-if="!canStart" class="room-hint"><span v-if="!allPeerPathsReady">正在建立 P2P 连接…</span><span v-else>等待所有玩家准备 · {{ readyCount }}/{{ members.length }}</span></div></div></section>
        <aside class="lobby-side"><div class="map-preview"><div class="map-label"><small>ARENA MAP</small><strong>铁锈峡谷</strong></div><div class="mini-arena"><i v-for="(member, index) in membersSorted" :key="member.id" class="mini-tank" :style="{ left: `${12 + (index * 19) % 76}%`, top: `${18 + (index * 31) % 64}%`, '--paint': PALETTE[index % PALETTE.length] }"></i><b class="block block-a"></b><b class="block block-b"></b><b class="block block-c"></b></div><div class="map-meta"><span>场地 01</span><span>障碍物 · 5</span><span>队伍 · {{ members.length }}</span></div></div><div class="control-card"><small>FIELD MANUAL</small><h3>准备好就按下开战</h3><div><kbd>W A S D</kbd><span>移动坦克</span></div><div><kbd>↑ ↓ ← →</kbd><span>同样可移动</span></div><div><kbd>SPACE</kbd><span>发射炮弹</span></div></div><p class="network-footnote">游戏数据仅通过 WebRTC 直连，连接失败后自动重试。</p></aside>
      </div>


      <section v-else class="fc-game tank-game" aria-label="坦克全屏战场">
        <header class="fc-banner">
          <button class="fc-room-tag" :title="`房间号 ${room?.code}`" @click="tankMenu = !tankMenu" :aria-expanded="tankMenu" aria-controls="tank-room-menu">{{ room?.code }} <span>☰</span></button>
          <span>装甲 <b :class="{ 'fc-low-life': localTank.hp < 30 }">{{ localTank.hp }}</b></span>
          <span>击破 <b>{{ localTank.kills }}</b></span><span>{{ members.length }} 人</span>
          <span class="fc-banner-network" :title="networkMode">{{ networkMode }}</span>
        </header>
        <div class="fc-console">
          <div class="fc-viewport">
            <div v-if="recoveryNotice" class="network-recovery" role="status">{{ recoveryNotice }}</div>
            <canvas ref="canvas" class="fc-canvas" aria-label="多人坦克战场"></canvas>
            <div v-if="phase === 'result'" class="fc-cover"><small>ARENA COMPLETE</small><strong>{{ gameMessage }}</strong><button @click="leaveRoomFromButton">返回大厅</button></div>
            <div v-else-if="!localTank.alive" class="fc-respawn">坦克已被击毁 · 观战中</div>
          </div>
          <div class="fc-controller" aria-label="触屏操作" @contextmenu.prevent>
            <div class="fc-dpad" aria-label="方向控制"><button class="fc-up" aria-label="向上移动" @pointerdown.prevent="startTouchMove('w', $event)" @pointerup="stopTouchMove" @pointercancel="stopTouchMove" @lostpointercapture="stopTouchMove">▲</button><button class="fc-left" aria-label="向左移动" @pointerdown.prevent="startTouchMove('a', $event)" @pointerup="stopTouchMove" @pointercancel="stopTouchMove" @lostpointercapture="stopTouchMove">◀</button><button class="fc-right" aria-label="向右移动" @pointerdown.prevent="startTouchMove('d', $event)" @pointerup="stopTouchMove" @pointercancel="stopTouchMove" @lostpointercapture="stopTouchMove">▶</button><button class="fc-down" aria-label="向下移动" @pointerdown.prevent="startTouchMove('s', $event)" @pointerup="stopTouchMove" @pointercancel="stopTouchMove" @lostpointercapture="stopTouchMove">▼</button><span>✚</span></div>
            <div class="fc-ab"><div><button aria-label="A 按住发射炮弹" @pointerdown.prevent="startFire" @pointerup="stopFire" @pointercancel="stopFire" @lostpointercapture="stopFire">A</button></div></div>
          </div>
        </div>
        <aside v-if="tankMenu" id="tank-room-menu" class="fc-menu" aria-label="房间设置">
          <div class="fc-menu-heading"><strong>多人坦克竞技场 · 铁锈峡谷</strong><button @click="tankMenu = false" aria-label="关闭菜单">×</button></div>
          <div class="fc-menu-actions"><button @click="copyRoomCode">复制房间号</button><button @click="leaveRoomFromButton">离开房间</button></div>
          <div class="fc-menu-actions"><button @click="toggleTankMusic" :aria-pressed="tankMusic">{{ tankMusic ? '关闭背景音乐' : '开启背景音乐' }}</button></div>
          <label class="fc-volume">音量 {{ tankVolume }}%<input v-model.number="tankVolume" type="range" min="0" max="100" aria-label="背景音乐音量" @input="tankAudio?.setVolume(tankVolume / 100)" /></label>
          <p class="fc-ice">首次按方向键或开火键启动音乐，切到后台暂停。</p>
          <div class="fc-roster"><span v-for="tank in scores" :key="tank.id"><i :style="{ background: tank.color }"></i><b>{{ tank.name }}</b><small>{{ peerStatusLabel(tank.id) }}</small><em>{{ tank.hp }} HP · {{ tank.kills }} 击破</em></span></div>
          <p class="fc-ice">当前连接 · {{ networkMode }}</p>
          <p v-if="connectedPeerCount" class="fc-ice">本机 ICE · {{ localIceSummary || '浏览器未暴露候选地址' }}<br>对端 ICE · {{ remoteIceSummary || '未获取' }}</p>
          <div class="fc-manual"><h3>利用掩体躲避炮弹，击破其他坦克。</h3><p>方向键 / WASD 移动，空格发射。手机按住方向键移动，按住 A 连续发射，可同时操作。</p></div>
        </aside>
      </section>

      <div v-if="error || note" class="toast" :class="{ danger: error }" role="status">{{ error || note }}<button @click="error = ''; note = ''">×</button></div>
    </section>
  </main>
</template>
