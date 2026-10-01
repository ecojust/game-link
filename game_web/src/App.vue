<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { GameLinkClient } from '../../sdk/js/gamelink.js'
import type { GameLinkMessage, GameLinkRoom } from '../../sdk/js/gamelink.js'
const FourWheelGame = defineAsyncComponent(() => import('./FourWheelGame.vue'))

type Member = { id: string; name: string; virtual_ip: string; endpoint: string }
type Room = GameLinkRoom
type Tank = { id: string; name: string; x: number; y: number; angle: number; hp: number; kills: number; color: string; alive: boolean; targetX?: number; targetY?: number; targetAngle?: number; hasRemoteState?: boolean }
type Bullet = { id: string; owner: string; x: number; y: number; angle: number; ttl: number; hit: Set<string> }

const GAME_CATALOG = [
  { id: 'tank-arena', title: '多人坦克竞技场', subtitle: 'IRON FIELD / REAL-TIME BATTLE', description: '占领掩体，和队友在战场里正面对决。', players: '2–16 人', tag: '即时对战', glyph: 'T', theme: 'tank' },
  { id: 'fc-mini-4wd', title: '激斗四驱车', subtitle: 'GEKITOTSU / 4WD BATTLE', description: '车头冲撞、击退敌车，重返 FC 的俯视战场。支持合作闯关和玩家对战。', players: '1–16 人', tag: 'FC 冲撞对战', glyph: '4WD', theme: 'racer' },
]
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

const serverUrl = import.meta.env.VITE_API_BASE_URL || ''
const playerName = ref(localStorage.getItem('gamelink-game-name') || '')
const activeRooms = ref<Array<{ code: string; game_id: string; member_count: number; max_members: number }>>([])
const roomsLoading = ref(true)
const roomListError = ref('')
const activeGameId = ref('tank-arena')
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
const gameMessage = ref('')
const shotCooldown = ref(0)
const peerStates = reactive<Record<string, string>>({})
const localIceAddresses = reactive<Record<string, string>>({})
const remoteIceAddresses = reactive<Record<string, string>>({})
let clientSession: GameLinkClient | null = null
let roomListTimer = 0
let stateFlushTimeout = 0
let localStateDirty = false
let lastStateSentAt = 0
let animationFrame = 0
let lastFrame = 0
const keys = new Set<string>()
const touchPointers = new Map<number, string>()
const membersSorted = computed(() => [...members.value].sort((a, b) => a.id.localeCompare(b.id)))
const isHost = computed(() => Boolean(room.value && self.value && room.value.host_id === self.value.id))
const readyCount = computed(() => members.value.filter((member) => member.id === self.value?.id ? selfReady.value : Boolean(readyMap[member.id])).length)
const connectedPeerCount = computed(() => members.value.filter((member) => member.id !== self.value?.id && peerStates[member.id] === 'connected').length)
const relayPeerCount = computed(() => members.value.filter((member) => member.id !== self.value?.id && peerStates[member.id] === 'relay').length)
const peerTotalCount = computed(() => Math.max(0, members.value.length - (self.value ? 1 : 0)))
const localIceSummary = computed(() => [...new Set(Object.values(localIceAddresses))].join(' / '))
const remoteIceSummary = computed(() => [...new Set(Object.values(remoteIceAddresses))].join(' / '))
const networkMode = computed(() => {
  if (peerTotalCount.value === 0) return '等待队友'
  if (connectedPeerCount.value + relayPeerCount.value < peerTotalCount.value) return '连接协商中'
  if (relayPeerCount.value === 0) return 'P2P 直连'
  if (connectedPeerCount.value === 0) return '服务器转发'
  return '混合连接'
})
const networkModeClass = computed(() => networkMode.value === 'P2P 直连' ? 'p2p' : networkMode.value === '服务器转发' ? 'relay' : networkMode.value === '混合连接' ? 'mixed' : 'pending')
const allPeerPathsReady = computed(() => members.value.length > 1 && members.value.filter((member) => member.id !== self.value?.id).every((member) => ['connected', 'relay'].includes(peerStates[member.id] || '')))
const canStart = computed(() => allPeerPathsReady.value && readyCount.value === members.value.length)
const scores = computed(() => [localTank, ...Object.values(remoteTanks)].filter((tank) => tank.id).sort((a, b) => b.kills - a.kills))
const activeGame = computed(() => GAME_CATALOG.find((game) => game.id === (room.value?.game_id || activeGameId.value)))

function gameName(gameId: string) {
  return GAME_CATALOG.find((game) => game.id === gameId)?.title || gameId
}

async function refreshRooms() {
  try {
    const response = await fetch(`${serverUrl}/v1/rooms`)
    if (response.status === 405) throw new Error('服务器版本暂不支持房间列表，请更新 server 后重试。')
    if (!response.ok) throw new Error(`房间列表获取失败（${response.status}）`)
    activeRooms.value = await response.json()
    roomListError.value = ''
  } catch (reason) {
    roomListError.value = messageOf(reason)
  } finally {
    roomsLoading.value = false
  }
}

function persist() {
  localStorage.setItem('gamelink-game-name', playerName.value.trim())
}

function validate() {
  error.value = ''
  if (!playerName.value.trim()) error.value = '先填写你的游戏昵称。'
  return !error.value
}

async function createGameRoom(gameId: string) {
  activeGameId.value = gameId
  await connectRoom('create', undefined, gameId)
}

async function joinListedRoom(liveRoom: { code: string; game_id: string; member_count: number; max_members: number }) {
  if (!GAME_CATALOG.some((game) => game.id === liveRoom.game_id)) {
    error.value = `暂不支持加入 ${liveRoom.game_id} 的房间。`
    return
  }
  activeGameId.value = liveRoom.game_id
  await connectRoom('join', liveRoom.code, liveRoom.game_id)
}

async function connectRoom(action: 'create' | 'join', code?: string, gameId = activeGameId.value) {
  if (!validate()) return
  busy.value = true
  error.value = ''
  activeGameId.value = gameId
  const session = new GameLinkClient({
    serverUrl,
    gameId,
    playerName: playerName.value.trim(),
  })
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
    } else {
      peerStates[peerId] = state
      if (localIce) localIceAddresses[peerId] = localIce
      if (remoteIce) remoteIceAddresses[peerId] = remoteIce
      if (state !== 'connected') delete localIceAddresses[peerId]
      if (state === 'connected') markLocalStateDirty()
      if (state === 'relay') note.value = 'P2P 直连失败，正在使用服务器信令队列转发。'
    }
    clearReadyIfDisconnected()
  })
  session.on('message', receiveEvent)
  session.on('error', (reason) => { error.value = messageOf(reason) })
  session.on('room-closed', () => {
    error.value = '你已离开房间，请重新加入。'
    void leaveRoom(false)
  })

  try {
    const result = action === 'create' ? await session.createRoom() : await session.joinRoom(code || '')
    if (clientSession !== session) return
    room.value = result.room
    self.value = result.self_member
    members.value = result.room.members
    selfReady.value = false
    readyMap[result.self_member.id] = false
    for (const member of members.value) readyMap[member.id] ??= false
    persist()
    if (gameId === 'tank-arena') beginBattle(result.room.members.map(({ id, name }) => ({ id, name })))
    else phase.value = 'battle'
  } catch (reason) {
    session.dispose()
    if (clientSession === session) clientSession = null
    error.value = messageOf(reason)
  } finally {
    busy.value = false
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
  const minimumInterval = relayPeerCount.value > 0 ? 200 : 50
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
    error.value = '正在建立玩家连接；直连失败时会自动切换服务器转发。'
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
  if (!isHost.value || !canStart.value || !room.value) return
  const roster = membersSorted.value.map((member) => ({ id: member.id, name: member.name }))
  try {
    await broadcast('game_started', { roster })
    beginBattle(roster)
  } catch (reason) { error.value = messageOf(reason) }
}

function receiveEvent(signal: GameLinkMessage<any>) {
  const payload = signal.payload || {}
  if (signal.kind === 'ready') readyMap[signal.from] = Boolean(payload.ready)
  else if (signal.kind === 'game_started') beginBattle(payload.roster || [])
  else if (signal.kind === 'player_state') {
    if (signal.from !== self.value?.id) {
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
    if (relayPeerCount.value) modes.push('服务器转发')
    if (connectedPeerCount.value + relayPeerCount.value < peerTotalCount.value) modes.push('连接协商中')
    return modes.join(' + ')
  }
  if (peerStates[memberId] === 'connected') return 'P2P 已连接'
  if (peerStates[memberId] === 'relay') return '服务器转发'
  return 'P2P 连接中'
}

function beginBattle(roster: Array<{ id: string; name: string }>) {
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
  if (!animationFrame) animationFrame = requestAnimationFrame(frame)
}

function tankSnapshot(tank: Tank) {
  return { x: tank.x, y: tank.y, angle: tank.angle, hp: tank.hp, kills: tank.kills, color: tank.color, alive: tank.alive, name: tank.name }
}

function stopBattleLoop() {
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
  if (living.length === 1 && allMembersSpawned && (room.value?.members.length ?? 0) > 1 && isHost.value) {
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
  if (!self.value || shotCooldown.value > 0 || !localTank.alive) return
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
  ctx.setTransform(pixelWidth / WIDTH, 0, 0, pixelHeight / HEIGHT, 0, 0)
  ctx.fillStyle = '#101b21'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
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
  const key = event.key.toLowerCase()
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault()
  keys.add(key)
}
function onKeyUp(event: KeyboardEvent) { keys.delete(event.key.toLowerCase()) }
function startTouchMove(key: string, event: PointerEvent) {
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
  void refreshRooms()
}

function leaveRoomFromButton() { void leaveRoom() }

function messageOf(reason: unknown) { return reason instanceof Error ? reason.message : String(reason) }

onMounted(() => {
  void refreshRooms()
  roomListTimer = window.setInterval(refreshRooms, 5000)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onWindowBlur)
  animationFrame = requestAnimationFrame(frame)
})
onBeforeUnmount(() => {
  window.clearInterval(roomListTimer)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', onWindowBlur)
  clientSession?.dispose(); clientSession = null
  stopBattleLoop()
})
</script>

<template>
  <main class="game-shell" :class="{ 'fc-playing': phase === 'battle' && room?.game_id === 'fc-mini-4wd' }">
    <header class="masthead">
      <div class="brand"><img class="brand-logo" src="/gamelink-logo.svg" alt="GameLink" width="156" height="52" /></div>
      <div class="server-indicator"><span></span>SERVER / 8088</div>
      <div class="version-label">FIELD TEST <b>0.1</b></div>
    </header>

    <section v-if="phase === 'start'" class="home-hub">
      <div class="hub-intro">
        <div>
          <div class="kicker"><span></span> GAMELINK / 多人游戏车库</div>
          <h1>现在开局。<em>马上见。</em></h1>
          <p>看看朋友正在玩的房间，再选一款游戏加入。每个房间按游戏匹配，互不串场。</p>
        </div>
        <label class="driver-name"><small>你的名字</small><input v-model="playerName" maxlength="32" placeholder="输入游戏昵称" @change="persist" @keydown.enter="persist" /></label>
      </div>

      <section class="room-board">
        <div class="hub-section-heading"><div><small>LIVE PIT BOARD</small><h2>正在开的房间</h2></div><span class="room-count"><i></i>{{ activeRooms.length }} 个房间</span></div>
        <div v-if="roomsLoading" class="room-empty">正在读取房间列表…</div>
        <div v-else-if="roomListError && !activeRooms.length" class="room-empty room-empty-error">{{ roomListError }}<button @click="refreshRooms">重新读取</button></div>
        <div v-else-if="!activeRooms.length" class="room-empty"><span>暂时没有正在进行的比赛。</span><small>从下面选一款游戏，创建第一间房。</small></div>
        <div v-else class="live-room-strip">
          <button v-for="liveRoom in activeRooms" :key="liveRoom.code" class="live-room-card" :disabled="busy || liveRoom.member_count >= liveRoom.max_members || !GAME_CATALOG.some(game => game.id === liveRoom.game_id)" @click="joinListedRoom(liveRoom)">
            <span class="room-card-top"><b>{{ gameName(liveRoom.game_id) }}</b><i>{{ liveRoom.member_count >= liveRoom.max_members ? '已满' : '进行中' }}</i></span>
            <strong class="live-room-code">{{ liveRoom.code }}</strong>
            <span class="room-card-bottom"><code>{{ liveRoom.game_id }}</code><span>{{ liveRoom.member_count }} / {{ liveRoom.max_members }} 人 <b>→</b></span></span>
          </button>
        </div>
      </section>

      <section class="game-library">
        <div class="hub-section-heading"><div><small>SELECT A GAME</small><h2>选择一款游戏</h2></div><span class="room-count">{{ GAME_CATALOG.length }} 款可玩</span></div>
        <div class="game-card-grid">
          <article v-for="game in GAME_CATALOG" :key="game.id" class="game-card" :class="`game-${game.theme}`">
            <div class="game-poster" :class="`poster-${game.theme}`" aria-hidden="true">
              <template v-if="game.theme === 'racer'"><div class="poster-track"><i></i><b></b></div><span class="poster-car car-one">4WD</span><span class="poster-car car-two">4WD</span><small>RAM! CRASH! 4WD BATTLE</small><strong>激斗<br />四驱车</strong></template>
              <template v-else><div class="poster-grid"></div><div class="poster-tank"><i></i><b></b></div><span class="poster-lock">ARENA / 01</span><strong>铁锈峡谷</strong></template>
              <span class="poster-index">{{ game.glyph }}</span>
            </div>
            <div class="game-card-copy"><div class="game-card-meta"><span>{{ game.tag }}</span><code>{{ game.id }}</code></div><h3>{{ game.title }}</h3><p>{{ game.description }}</p><div class="game-card-footer"><span>{{ game.players }}</span><button :disabled="busy" @click="createGameRoom(game.id)">{{ busy && activeGameId === game.id ? '正在开房…' : '创建房间' }} <b>↗</b></button></div></div>
          </article>
        </div>
      </section>
      <p v-if="error" class="home-error" role="alert">{{ error }}</p>
    </section>

    <section v-else class="room-screen">
      <div class="room-toolbar"><div><div class="kicker"><span></span> {{ activeGame?.subtitle || room?.game_id }}</div><h1>{{ activeGame?.title || room?.game_id }}<i>.</i></h1><p>{{ room?.game_id === 'fc-mini-4wd' ? '用车头击破敌车，保护侧面与车尾。' : phase === 'lobby' ? '分享房间号，所有人准备就绪后由房主开始。' : phase === 'battle' ? '击中对手，留在战场上。' : gameMessage }}</p></div><button class="room-code" @click="copyRoomCode"><small>作战房间 · 点击复制</small><strong>{{ room?.code }}</strong><span>▢</span></button><button class="exit-button" @click="leaveRoomFromButton">离开房间 ↗</button></div>

      <div v-if="phase === 'lobby'" class="lobby-grid">
        <section class="roster-card"><div class="panel-heading"><div><small>DEPLOYMENT ROSTER</small><h2>作战成员 <span>{{ members.length }} / 16</span></h2></div><span class="sync-label" :class="networkModeClass"><i></i>{{ networkMode }} · P2P {{ connectedPeerCount }} / 转发 {{ relayPeerCount }}</span></div><div class="roster-list"><div v-for="(member, index) in membersSorted" :key="member.id" class="roster-row" :class="{ mine: member.id === self?.id }"><span class="player-index">{{ String(index + 1).padStart(2, '0') }}</span><span class="player-badge" :style="{ '--paint': PALETTE[index % PALETTE.length] }">{{ member.name.slice(0, 1).toUpperCase() }}</span><div class="player-copy"><strong>{{ member.name }}<small v-if="member.id === self?.id">你</small></strong><span>{{ member.id === room?.host_id ? '房主 · 作战指挥' : '作战成员' }}</span></div><code class="peer-state" :class="{ linked: peerStates[member.id] === 'connected', relayed: peerStates[member.id] === 'relay' }">{{ peerStatusLabel(member.id) }}</code><span class="ready-pill" :class="{ ready: member.id === self?.id ? selfReady : readyMap[member.id] }"><i></i>{{ member.id === self?.id ? selfReady ? '已准备' : '待命中' : readyMap[member.id] ? '已准备' : '等待准备' }}</span></div><div v-if="members.length < 2" class="recruit-note"><span>⌁</span><div><strong>还需要一位对手</strong><p>把房间号发给朋友。至少两位玩家才能开始。</p></div></div></div><div class="roster-actions"><button class="ready-button" :class="{ active: selfReady }" :disabled="!allPeerPathsReady" @click="toggleReady">{{ selfReady ? '取消准备' : '我已准备' }} <span>{{ selfReady ? '✓' : '＋' }}</span></button><button v-if="isHost" class="start-button" :disabled="!canStart" @click="startBattle">开始对战 <span>→</span></button><div v-else class="host-wait"><span v-if="!allPeerPathsReady">正在建立 P2P / 服务器转发连接…</span><span v-else>等待房主开始 · {{ readyCount }}/{{ members.length }} 已准备</span></div></div></section>
        <aside class="lobby-side"><div class="map-preview"><div class="map-label"><small>ARENA MAP</small><strong>铁锈峡谷</strong></div><div class="mini-arena"><i v-for="(member, index) in membersSorted" :key="member.id" class="mini-tank" :style="{ left: `${12 + (index * 19) % 76}%`, top: `${18 + (index * 31) % 64}%`, '--paint': PALETTE[index % PALETTE.length] }"></i><b class="block block-a"></b><b class="block block-b"></b><b class="block block-c"></b></div><div class="map-meta"><span>场地 01</span><span>障碍物 · 5</span><span>队伍 · {{ members.length }}</span></div></div><div class="control-card"><small>FIELD MANUAL</small><h3>准备好就按下开战</h3><div><kbd>W A S D</kbd><span>移动坦克</span></div><div><kbd>↑ ↓ ← →</kbd><span>同样可移动</span></div><div><kbd>SPACE</kbd><span>发射炮弹</span></div></div><p class="network-footnote">优先通过 WebRTC 直连坦克数据；直连失败时会经服务端信令队列转发，不是通用 UDP Relay。</p></aside>
      </div>

      <FourWheelGame v-else-if="phase === 'battle' && room?.game_id === 'fc-mini-4wd' && clientSession && self && room" :client="clientSession" :room="room" :self="self" :members="members" :peer-states="peerStates" :local-ice="localIceSummary" :remote-ice="remoteIceSummary" :connection-label="networkMode" @leave="leaveRoomFromButton" />
      <section v-else class="battle-layout"><div class="battle-hud"><div class="hud-chip"><small>ROOM</small><strong>{{ room?.code }}</strong></div><div class="hud-chip health-chip"><small>装甲</small><strong><i :style="{ width: `${localTank.hp}%` }"></i>{{ localTank.hp }}%</strong></div><div class="hud-chip"><small>淘汰</small><strong>{{ localTank.kills }}</strong></div><div class="hud-phase" :class="networkModeClass"><span></span>当前连接：{{ networkMode }} · P2P {{ connectedPeerCount }} / 转发 {{ relayPeerCount }}</div><div v-if="connectedPeerCount" class="ice-address" :title="`本机 ICE：${localIceSummary || '浏览器未暴露候选地址'}；对端 ICE：${remoteIceSummary || '未获取'}`">本机 ICE · {{ localIceSummary || '浏览器未暴露候选地址' }}　↔　对端 ICE · {{ remoteIceSummary || '未获取' }}</div><div class="score-strip"><span v-for="tank in scores" :key="tank.id"><i :style="{ background: tank.color }"></i>{{ tank.name }} <b>{{ tank.kills }}</b></span></div></div><div class="arena-frame"><canvas ref="canvas" class="arena-canvas" aria-label="多人坦克战场"></canvas><div v-if="phase === 'result'" class="result-cover"><small>ARENA COMPLETE</small><h2>{{ gameMessage }}</h2><button @click="leaveRoomFromButton">返回大厅</button></div><div v-else-if="!localTank.alive" class="disabled-cover"><strong>坦克已被击毁</strong><span>观战中 · 等待本局结束</span></div></div><div class="touch-controls" aria-label="触屏操作"><div class="touch-pad"><button class="pad-up" aria-label="向上移动" @pointerdown.prevent="startTouchMove('w', $event)" @pointerup="stopTouchMove" @pointercancel="stopTouchMove">▲</button><button class="pad-left" aria-label="向左移动" @pointerdown.prevent="startTouchMove('a', $event)" @pointerup="stopTouchMove" @pointercancel="stopTouchMove">◀</button><span class="pad-center">MOVE</span><button class="pad-right" aria-label="向右移动" @pointerdown.prevent="startTouchMove('d', $event)" @pointerup="stopTouchMove" @pointercancel="stopTouchMove">▶</button><button class="pad-down" aria-label="向下移动" @pointerdown.prevent="startTouchMove('s', $event)" @pointerup="stopTouchMove" @pointercancel="stopTouchMove">▼</button></div><div class="touch-action"><small>按住移动 · 横屏视野更宽</small><button class="touch-fire" aria-label="按住发射炮弹" @pointerdown.prevent="fireHeld = true" @pointerup="fireHeld = false" @pointercancel="fireHeld = false" @pointerleave="fireHeld = false">开火 <b>✦</b></button></div></div><div class="battle-footer"><span><i></i> 你 · {{ localTank.name }}</span><span>WASD / 方向键 移动</span><span>SPACE / 按住开火</span><button @pointerdown.prevent="fireHeld = true" @pointerup="fireHeld = false" @pointerleave="fireHeld = false">按住发射 <b>✦</b></button><span class="net-state" :class="networkModeClass">当前连接：{{ networkMode }}</span></div></section>

      <div v-if="error || note" class="toast" :class="{ danger: error }" role="status">{{ error || note }}<button @click="error = ''; note = ''">×</button></div>
    </section>
  </main>
</template>
