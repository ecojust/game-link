<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { GameLinkClient, GameLinkMember, GameLinkRoom } from '../../sdk/js/gamelink.js'

type Racer = { id: string; name: string; progress: number; speed: number; lane: number; color: string; finished: boolean; targetProgress?: number; targetLane?: number; targetSpeed?: number }
const props = defineProps<{
  client: GameLinkClient
  room: GameLinkRoom
  self: GameLinkMember
  members: GameLinkMember[]
  peerStates: Record<string, string>
  localIce: string
  remoteIce: string
  connectionLabel: string
}>()

const W = 1100, H = 650
const CX = 550, CY = 328, RX = 352, RY = 222
const TRACK_LENGTH = 1850
const LAPS_TO_WIN = 3
const COLORS = ['#e66b42', '#55b9a6', '#6485d9', '#d8a63d', '#b36bc5', '#69a84c', '#db6580', '#59a6c5', '#bd8152', '#8d9b43']
const canvas = ref<HTMLCanvasElement | null>(null)
const racers = reactive<Record<string, Racer>>({})
const pressed = new Set<string>()
const boostLeft = ref(0)
const boostCooldown = ref(0)
const winner = ref('')
const notice = ref('')
const visibleLap = computed(() => Math.min(LAPS_TO_WIN, Math.floor(Math.max(0, (racers[props.self.id]?.progress ?? 0)) / TRACK_LENGTH) + 1))
const localRacer = computed(() => racers[props.self.id])
const leaderboard = computed(() => Object.values(racers).sort((a, b) => b.progress - a.progress))
let frameId = 0
let lastFrame = 0
let networkTimer = 0
let noticeTimer = 0
let sendUnsubscribe: (() => void) | undefined

function addMember(member: GameLinkMember, index: number) {
  if (racers[member.id]) return
  const lead = Math.max(0, ...Object.values(racers).map((racer) => racer.progress))
  const isLate = Object.keys(racers).length > 0
  racers[member.id] = {
    id: member.id,
    name: member.name,
    progress: isLate ? Math.max(0, lead - 115 - index * 28) : -index * 78,
    speed: 0,
    lane: index % 2 ? 25 : -25,
    color: COLORS[index % COLORS.length],
    finished: false,
  }
}
function syncRoster(members: GameLinkMember[]) {
  const sorted = [...members].sort((a, b) => a.id.localeCompare(b.id))
  sorted.forEach(addMember)
  for (const id of Object.keys(racers)) if (!sorted.some((member) => member.id === id)) delete racers[id]
}
function onMessage(message: { from: string; kind: string; payload: any }) {
  const data = message.payload || {}
  if (message.kind === 'racer_state') {
    const racer = racers[message.from]
    if (!racer) {
      const member = props.members.find((item) => item.id === message.from)
      if (member) addMember(member, Object.keys(racers).length)
    }
    const remote = racers[message.from]
    if (!remote || message.from === props.self.id) return
    if (!Number.isFinite(Number(data.progress)) || !Number.isFinite(Number(data.lane))) return
    remote.targetProgress = Number(data.progress)
    remote.targetLane = Number(data.lane)
    remote.targetSpeed = Number(data.speed) || 0
    remote.speed = remote.targetSpeed
    remote.color = String(data.color || remote.color)
    remote.finished = Boolean(data.finished)
    if (remote.finished && !winner.value) finishRace(remote.name)
  } else if (message.kind === 'racer_finish' && !winner.value) finishRace(String(data.name || '有车手冲线'))
  else if (message.kind === 'racer_boost' && message.from !== props.self.id) {
    const racer = racers[message.from]
    if (racer) racer.speed = Math.max(racer.speed, 390)
  }
}
function sendState() {
  const racer = localRacer.value
  if (!racer || winner.value) return
  props.client.send('racer_state', {
    progress: racer.progress,
    speed: racer.speed,
    lane: racer.lane,
    color: racer.color,
    finished: racer.finished,
  }, { reliability: 'unreliable' })
}
function triggerBoost() {
  if (boostCooldown.value > 0 || winner.value) return
  boostLeft.value = 1.25
  boostCooldown.value = 5
  props.client.send('racer_boost', { duration: 1.25 }, { reliability: 'reliable' })
}
function finishRace(name: string) {
  if (winner.value) return
  winner.value = name
  notice.value = `${name} 抢先冲线！`
}
function tick(delta: number) {
  const me = localRacer.value
  if (!me || winner.value) return
  const throttle = pressed.has('w') || pressed.has('arrowup') || pressed.has(' ')
  const brake = pressed.has('s') || pressed.has('arrowdown')
  const steer = Number(pressed.has('d') || pressed.has('arrowright')) - Number(pressed.has('a') || pressed.has('arrowleft'))
  boostLeft.value = Math.max(0, boostLeft.value - delta)
  boostCooldown.value = Math.max(0, boostCooldown.value - delta)
  const maxSpeed = boostLeft.value > 0 ? 405 : throttle ? 315 : 175
  const targetSpeed = brake ? 65 : maxSpeed
  me.speed += (targetSpeed - me.speed) * Math.min(1, delta * (throttle || boostLeft.value ? 1.8 : 1.15))
  me.lane = Math.max(-48, Math.min(48, me.lane + steer * 82 * delta))
  me.progress += me.speed * delta
  if (me.progress >= TRACK_LENGTH * LAPS_TO_WIN) {
    me.progress = TRACK_LENGTH * LAPS_TO_WIN
    me.finished = true
    finishRace(me.name)
    props.client.send('racer_finish', { name: me.name, progress: me.progress }, { reliability: 'reliable' })
  }
  for (const racer of Object.values(racers)) {
    if (racer.id === me.id || racer.targetProgress === undefined) continue
    const smoothing = Math.min(1, delta * 7)
    racer.progress += (racer.targetProgress - racer.progress) * smoothing
    racer.lane += ((racer.targetLane ?? racer.lane) - racer.lane) * smoothing
  }
  networkTimer += delta
  if (networkTimer >= 0.085) { networkTimer = 0; sendState() }
}
function pointAt(progress: number, lane: number) {
  const wrappedProgress = ((progress % TRACK_LENGTH) + TRACK_LENGTH) % TRACK_LENGTH
  const angle = (wrappedProgress / TRACK_LENGTH) * Math.PI * 2 - Math.PI / 2
  const nx = Math.cos(angle) / RX, ny = Math.sin(angle) / RY
  const normalLength = Math.hypot(nx, ny) || 1
  const x = CX + RX * Math.cos(angle) + (nx / normalLength) * lane
  const y = CY + RY * Math.sin(angle) + (ny / normalLength) * lane
  const tangent = Math.atan2(RY * Math.cos(angle), -RX * Math.sin(angle))
  return { x, y, tangent }
}
function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r)
}
function drawCar(ctx: CanvasRenderingContext2D, racer: Racer, mine: boolean) {
  const point = pointAt(racer.progress, racer.lane)
  ctx.save(); ctx.translate(point.x, point.y); ctx.rotate(point.tangent)
  ctx.shadowColor = mine ? '#f4c46488' : '#0008'; ctx.shadowBlur = mine ? 13 : 6
  ctx.fillStyle = '#171a1c'; roundedRect(ctx, -20, -12, 40, 24, 7); ctx.fill()
  ctx.fillStyle = racer.color; roundedRect(ctx, -17, -10, 34, 20, 6); ctx.fill()
  ctx.fillStyle = '#dce3df'; roundedRect(ctx, -4, -8, 12, 16, 4); ctx.fill()
  ctx.fillStyle = '#ffd876'; ctx.fillRect(13, -7, 4, 5); ctx.fillRect(13, 2, 4, 5)
  ctx.fillStyle = '#9e4b3e'; ctx.fillRect(-17, -6, 3, 4); ctx.fillRect(-17, 2, 3, 4)
  ctx.fillStyle = '#131719'; ctx.fillRect(-10, -13, 12, 3); ctx.fillRect(-10, 10, 12, 3)
  ctx.restore()
  ctx.font = mine ? '700 12px "DM Mono", monospace' : '10px "DM Mono", monospace'
  ctx.textAlign = 'center'; ctx.fillStyle = mine ? '#ffe09a' : '#d0d5ca'; ctx.fillText(mine ? `${racer.name} · 你` : racer.name, point.x, point.y - 20)
}
function draw() {
  const el = canvas.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  const dpr = window.devicePixelRatio || 1
  const pw = Math.round(rect.width * dpr), ph = Math.round(rect.height * dpr)
  if (el.width !== pw || el.height !== ph) { el.width = pw; el.height = ph }
  const ctx = el.getContext('2d')
  if (!ctx) return
  ctx.setTransform(pw / W, 0, 0, ph / H, 0, 0)
  ctx.fillStyle = '#18211d'; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#27382d'
  for (let y = 32; y < H; y += 44) for (let x = (y / 44) % 2 ? 26 : 48; x < W; x += 56) { ctx.fillRect(x, y, 2, 2) }
  ctx.beginPath(); ctx.ellipse(CX, CY, RX + 82, RY + 82, 0, 0, Math.PI * 2); ctx.fillStyle = '#b6ad94'; ctx.fill()
  ctx.beginPath(); ctx.ellipse(CX, CY, RX + 66, RY + 66, 0, 0, Math.PI * 2); ctx.fillStyle = '#3b4341'; ctx.fill()
  ctx.beginPath(); ctx.ellipse(CX, CY, RX + 48, RY + 48, 0, 0, Math.PI * 2); ctx.strokeStyle = '#646a65'; ctx.lineWidth = 2; ctx.stroke()
  ctx.beginPath(); ctx.ellipse(CX, CY, RX - 48, RY - 48, 0, 0, Math.PI * 2); ctx.strokeStyle = '#646a65'; ctx.lineWidth = 2; ctx.stroke()
  ctx.beginPath(); ctx.ellipse(CX, CY, RX, RY, 0, 0, Math.PI * 2); ctx.strokeStyle = '#4b5351'; ctx.lineWidth = 94; ctx.stroke()
  ctx.beginPath(); ctx.ellipse(CX, CY, RX, RY, 0, 0, Math.PI * 2); ctx.strokeStyle = '#d8d1b64b'; ctx.lineWidth = 2; ctx.setLineDash([17, 15]); ctx.stroke(); ctx.setLineDash([])
  ctx.beginPath(); ctx.ellipse(CX, CY, 245, 115, 0, 0, Math.PI * 2); ctx.fillStyle = '#344a37'; ctx.fill()
  ctx.fillStyle = '#d2c7aa'; ctx.font = '9px "DM Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText('PIT LANE', CX, CY + 6)
  for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI / 6
    const x = CX + (RX + 51) * Math.cos(angle), y = CY + (RY + 51) * Math.sin(angle)
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fillStyle = i % 2 ? '#f0a658' : '#e0d4b7'; ctx.fill()
  }
  const fx = CX, fy = CY - RY - 34
  ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.PI / 2)
  for (let row = 0; row < 4; row++) for (let col = 0; col < 8; col++) {
    ctx.fillStyle = (row + col) % 2 ? '#f1eee1' : '#282e2c'; ctx.fillRect(col * 8 - 32, row * 8 - 16, 8, 8)
  }
  ctx.restore()
  for (const racer of Object.values(racers).sort((a, b) => a.progress - b.progress)) drawCar(ctx, racer, racer.id === props.self.id)
}
function loop(now: number) {
  const delta = Math.min((now - lastFrame) / 1000 || 0, 0.05)
  lastFrame = now
  tick(delta); draw(); frameId = requestAnimationFrame(loop)
}
function onKeyDown(event: KeyboardEvent) {
  const key = event.key.toLowerCase()
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault()
  pressed.add(key)
  if (key === ' ' && !event.repeat) triggerBoost()
}
function onKeyUp(event: KeyboardEvent) { pressed.delete(event.key.toLowerCase()) }
function touchStart(key: string, event: PointerEvent) { (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); pressed.add(key) }
function touchEnd(key: string) { pressed.delete(key) }
function onBlur() { pressed.clear() }
function fireState() { if (notice.value) noticeTimer = window.setTimeout(() => notice.value = '', 2200) }
function leave() { emit('leave') }
const emit = defineEmits<{ leave: [] }>()

watch(() => props.members, syncRoster, { immediate: true, deep: true })
onMounted(() => {
  addMember(props.self, 0)
  sendUnsubscribe = props.client.on('message', onMessage)
  window.addEventListener('keydown', onKeyDown); window.addEventListener('keyup', onKeyUp); window.addEventListener('blur', onBlur)
  lastFrame = performance.now(); frameId = requestAnimationFrame(loop)
  fireState()
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frameId); window.clearTimeout(noticeTimer)
  window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); window.removeEventListener('blur', onBlur)
  sendUnsubscribe?.()
})
</script>

<template>
  <section class="race-screen">
    <div class="race-topline"><div class="race-title"><small>FAMILY CIRCUIT / MULTIPLAYER</small><h2>激斗四驱车</h2></div><div class="race-stats"><div><small>圈数</small><strong>{{ String(visibleLap).padStart(2, '0') }} / 03</strong></div><div><small>速度</small><strong>{{ Math.round(localRacer?.speed || 0) }} <i>KM/H</i></strong></div><div><small>车手</small><strong>{{ members.length }} / 16</strong></div></div><div class="race-network"><i :class="connectionLabel.includes('直连') ? 'online' : ''"></i>{{ connectionLabel }}</div></div>
    <div class="race-track-wrap"><canvas ref="canvas" class="race-canvas" aria-label="多人四驱车赛道"></canvas><div class="race-overlay"><span>3 LAPS · NO BRAKES</span><strong v-if="winner">{{ winner }} 冲过终点</strong><strong v-else>第 {{ visibleLap }} 圈 / 三圈冲刺</strong></div></div>
    <div class="race-toolbar"><button class="race-boost" :disabled="boostCooldown > 0 || Boolean(winner)" @click="triggerBoost">{{ boostCooldown > 0 ? `涡轮冷却 ${boostCooldown.toFixed(1)}s` : '涡轮增压 · SPACE' }}</button><div class="race-leaderboard"><span v-for="(racer, index) in leaderboard" :key="racer.id" :class="{ me: racer.id === self.id }"><b>{{ String(index + 1).padStart(2, '0') }}</b>{{ racer.name }}<small>{{ Math.min(3, Math.floor(Math.max(0, racer.progress) / TRACK_LENGTH) + 1) }}/3 圈</small></span></div><span class="race-ice" :title="`本机 ICE：${localIce || '暂未读取'}；对端 ICE：${remoteIce || '暂未读取'}`">ICE {{ localIce || '读取中' }}</span></div>
    <div class="race-mobile-controls"><div class="lane-pad"><button aria-label="向左并线" @pointerdown.prevent="touchStart('a', $event)" @pointerup="touchEnd('a')" @pointercancel="touchEnd('a')">◀</button><span>并线</span><button aria-label="向右并线" @pointerdown.prevent="touchStart('d', $event)" @pointerup="touchEnd('d')" @pointercancel="touchEnd('d')">▶</button></div><button class="race-gas" @pointerdown.prevent="touchStart('w', $event)" @pointerup="touchEnd('w')" @pointercancel="touchEnd('w')" @pointerleave="touchEnd('w')">按住加速</button><button class="race-boost mobile-boost" :disabled="boostCooldown > 0 || Boolean(winner)" @pointerdown.prevent="triggerBoost">BOOST</button></div>
    <div class="race-foot"><span><i></i> {{ connectionLabel }}</span><span>W / ↑ 加速　A D / ← → 并线　SPACE 涡轮</span><button v-if="winner" @click="leave">回到游戏库</button></div>
  </section>
</template>
