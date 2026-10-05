<script setup lang="ts">
import UiIcon from "../shared/UiIcon.vue"
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { GameLinkClient, GameLinkMember, GameLinkMessage, GameLinkRoom } from '../../../../sdk/js/gamelink.js'
import { BattleAudio } from '../shared/audio'
import { BattleRenderer } from './renderer'
import { BattleSimulation, createWorld, syncDrivers, idleInput, normalizeInput, makeMap, STAGES } from './simulation'
import type { Input, Mode, World } from './simulation'
import '../shared/battle.css'
import RoomInviteButton from '../shared/RoomInviteButton.vue'

const props = defineProps<{ client: GameLinkClient; room: GameLinkRoom; self: GameLinkMember; members: GameLinkMember[]; peerStates: Record<string, string>; localIce: string; remoteIce: string; connectionLabel: string }>()
defineEmits<{ leave: [] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const driveStick = ref<HTMLElement | null>(null)
const stickVector = ref({ x: 0, z: 0 })
let stickPointerId: number | null = null
const world = shallowRef(createWorld(props.members))
const hud = shallowRef(structuredClone(world.value))
const me = computed(() => hud.value.cars.find(c => c.id === props.self.id))
const roster = computed(() => hud.value.cars.filter(c => !c.bot).sort((a, b) => b.score - a.score))
const renderError = ref(''), help = ref(false), sound = ref(true), volume = ref(30), selectedCar = ref(0), snapshotAge = ref(0)
const pressed = new Set<string>(), pointers = new Map<number, string>()
let simulation = new BattleSimulation(world.value)
let renderer: BattleRenderer | undefined
let animation = 0, timer = 0, previous = 0, lastRender = 0, accumulator = 0, networkTime = 0, hudTime = 0
let inputSequence = 0, lastInput = '', lastSnapshot = '', lastReceive = performance.now(), mutedOnBlur = false
const receivedInputs = new Map<string, number>()
let resetStamp = { counter: 0, by: '' }
const disposers: (() => void)[] = []

const soundtrack = new BattleAudio()
let audioStarted = false
function unlockAudio() {
  if (!sound.value || audioStarted) return
  audioStarted = true
  void soundtrack.enable(true).catch(() => { sound.value = false; audioStarted = false })
}
function toggleSound() {
  sound.value = !sound.value; audioStarted = false
  if (sound.value) unlockAudio(); else void soundtrack.enable(false)
}
function changeVolume() { soundtrack.setVolume(volume.value / 100) }
function audioVisibility() {
  if (document.hidden) soundtrack.pause()
  else if (sound.value && audioStarted) void soundtrack.enable(true).catch(() => {})
}
function tone(frequency: number, duration = 0.08) { soundtrack.effect(frequency, duration) }
function currentInput(): Input {
  if (mutedOnBlur) return { ...idleInput(), brake: true }
  const keys = new Set([...pressed, ...pointers.values()])
  return { x: stickPointerId !== null ? stickVector.value.x : Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft')), z: stickPointerId !== null ? stickVector.value.z : Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup')), gas: keys.has('j') || keys.has(' '), brake: keys.has('k') || keys.has('x') }
}
function sendInput(force = false) {
  const input = currentInput(), signature = JSON.stringify(input)
  if (!force && lastInput === signature) return
  lastInput = signature
  simulation.inputs.set(props.self.id, input)
  props.client.send('fc2-input', { ...input, seq: ++inputSequence }, { reliability: 'unreliable' })
}
function sendSnapshot(target?: string, _reliable = false) {
  props.client.send('fc2-world', { world: world.value, round: resetStamp }, {
    target, reliability: 'unreliable',
  })
}
function requestWorld() {
  props.client.broadcast('fc2-request', { protocol: 4 }).catch(() => {})
  sendInput(true)
}
function validWorld(value: unknown): value is World {
  if (!value || typeof value !== 'object') return false
  const w = value as World
  return w.protocol === 4 && Number.isSafeInteger(w.rev) && Number.isInteger(w.stage) && w.stage >= 1 && w.stage <= 8
    && ['coop', 'versus'].includes(w.mode) && ['playing', 'over', 'clear', 'complete'].includes(w.phase)
    && Number.isFinite(w.time) && Number.isFinite(w.kills) && Number.isFinite(w.goal)
    && Array.isArray(w.cars) && w.cars.length <= 32 && w.cars.every(c => c && typeof c.id === 'string' && typeof c.name === 'string' && typeof c.paint === 'string' && /^#[0-9a-f]{6}$/i.test(c.paint) && [c.x, c.z, c.vx, c.vz, c.hp, c.angle, c.model, c.score, c.kills, c.star, c.hurt, c.spin, c.turbo, c.dead].every(Number.isFinite))
    && Array.isArray(w.pickups) && w.pickups.length <= 64 && w.pickups.every(i => i && typeof i.id === 'string' && Number.isFinite(i.x) && Number.isFinite(i.z) && ['fuel', 'turbo', 'suspension', 'star', 'flag', 'crown'].includes(i.kind))
    && Array.isArray(w.broken) && w.broken.length <= 12800 && w.broken.every(Number.isInteger)
    && Array.isArray(w.sparks) && w.sparks.length <= 128 && w.sparks.every(s => s && [s.id, s.x, s.z, s.age].every(Number.isFinite))
}
function compareRound(a: { counter: number; by: string }, b: { counter: number; by: string }) {
  return a.counter - b.counter || a.by.localeCompare(b.by)
}
function adoptRound(round: { counter: number; by: string }, next: World) {
  if (compareRound(round, resetStamp) < 0) return false
  if (compareRound(round, resetStamp) > 0) resetStamp = round
  simulation.world = structuredClone(next)
  simulation.map = makeMap(next.stage)
  world.value = simulation.world
  lastSnapshot = ''
  return true
}
function receive(message: GameLinkMessage) {
  if (!props.members.some(m => m.id === message.from)) return
  const data = message.payload && typeof message.payload === 'object' ? message.payload as Record<string, any> : {}
  if (message.kind === 'fc2-world') {
    const next = data?.world as World | undefined
    const round = data?.round as { counter: number; by: string } | undefined
    if (!round || !Number.isSafeInteger(round.counter) || typeof round.by !== 'string' || !next) return
    if (next.protocol !== 4) { renderError.value = '房间内玩家游戏版本不一致，请刷新所有玩家页面。'; return }
    if (!validWorld(next) || compareRound(round, resetStamp) < 0) return
    // Replicas advance independently. A lagging background tab cannot roll the
    // active peers back; the most advanced valid round/revision wins locally.
    if (compareRound(round, resetStamp) > 0 || next.rev > world.value.rev) {
      if (!adoptRound(round, next)) return
      const own = next.cars.find(c => c.id === props.self.id)
      if (own && own.hp < (me.value?.hp ?? own.hp)) tone(130, 0.14)
      lastReceive = performance.now()
      return
    }
    if (round.counter === resetStamp.counter && round.by === resetStamp.by && next.rev === world.value.rev) {
      lastReceive = performance.now()
    }
    return
  }
  if (message.kind === 'fc2-input') {
    const input = normalizeInput(data)
    if (!input || !Number.isSafeInteger(data?.seq) || Number(data.seq) <= (receivedInputs.get(message.from) ?? -1)) return
    receivedInputs.set(message.from, Number(data.seq)); simulation.inputs.set(message.from, input)
  } else if (message.kind === 'fc2-request') {
    syncDrivers(world.value, props.members); sendSnapshot(message.from, true)
  } else if (message.kind === 'fc2-car' && Number.isInteger(data?.model) && data.model >= 0 && data.model <= 2) {
    const car = world.value.cars.find(c => c.id === message.from)
    if (car) { car.model = data.model; world.value.rev++; sendSnapshot(undefined, true) }
  } else if (message.kind === 'fc2-reset') {
    const round = data?.round as { counter: number; by: string } | undefined
    const next = data?.world as World | undefined
    if (round && next && validWorld(next) && compareRound(round, resetStamp) > 0) {
      adoptRound(round, next); sendSnapshot(undefined, true)
    }
  }
}
function selectCar() {
  const car = world.value.cars.find(c => c.id === props.self.id)
  if (car) { car.model = Number(selectedCar.value); world.value.rev++; props.client.send('fc2-car', { model: car.model }, { reliability: 'reliable' }); sendSnapshot(undefined, true) }
}
function restart(mode = world.value.mode, advance = false) {
  const round = { counter: resetStamp.counter + 1, by: props.self.id }
  resetStamp = round
  simulation.reset(props.members, advance ? Math.min(8, world.value.stage + 1) : world.value.phase === 'complete' ? 1 : world.value.stage, mode)
  world.value = simulation.world; selectedCar.value = world.value.cars.find(c => c.id === props.self.id)?.model || 0
  lastSnapshot = ''; accumulator = 0; sendInput(true)
  props.client.send('fc2-reset', { round, world: world.value }, { reliability: 'reliable' })
  sendSnapshot(undefined, true)
}
function changeMode(event: Event) { restart((event.target as HTMLSelectElement).value as Mode) }
function keydown(event: KeyboardEvent) {
  if ((event.target as HTMLElement)?.closest('input, select, textarea')) return
  const key = event.key.toLowerCase()
  if (!['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'j', 'k', 'x', ' '].includes(key)) return
  event.preventDefault(); unlockAudio(); mutedOnBlur = false; pressed.add(key); sendInput()
}
function keyup(event: KeyboardEvent) { pressed.delete(event.key.toLowerCase()); sendInput() }
function pointerDown(key: string, event: PointerEvent) {
  unlockAudio();
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, key); mutedOnBlur = false; sendInput()
}
function pointerUp(event: PointerEvent) {
  if (!pointers.delete(event.pointerId)) return
  sendInput()
}
function updateDriveStick(event: PointerEvent) {
  const element = driveStick.value
  if (!element) return
  const bounds = element.getBoundingClientRect()
  const radius = Math.min(bounds.width, bounds.height) * 0.34
  let x = (event.clientX - bounds.left - bounds.width / 2) / radius
  let z = (event.clientY - bounds.top - bounds.height / 2) / radius
  const distance = Math.hypot(x, z)
  if (distance > 1) { x /= distance; z /= distance }
  stickVector.value = { x, z }
}
function driveStickDown(event: PointerEvent) {
  unlockAudio()
  driveStick.value?.setPointerCapture(event.pointerId)
  stickPointerId = event.pointerId; mutedOnBlur = false
  updateDriveStick(event); sendInput()
}
function driveStickMove(event: PointerEvent) {
  if (event.pointerId !== stickPointerId) return
  updateDriveStick(event); sendInput()
}
function driveStickUp(event: PointerEvent) {
  if (event.pointerId !== stickPointerId) return
  stickPointerId = null; stickVector.value = { x: 0, z: 0 }; sendInput()
}
function releasePointers() {
  if (!pointers.size && stickPointerId === null) return
  pointers.clear(); stickPointerId = null; stickVector.value = { x: 0, z: 0 }; sendInput(true)
}
function preventContextMenu(event: MouseEvent) { if ((event.target as HTMLElement)?.closest('.fc-controller')) event.preventDefault() }
function blur() { pressed.clear(); pointers.clear(); stickPointerId = null; stickVector.value = { x: 0, z: 0 }; mutedOnBlur = true; sendInput(true) }
function focus() { mutedOnBlur = false; sendInput() }
function tick() {
  const now = performance.now(), dt = Math.min((now - previous) / 1000, 0.2)
  previous = now; sendInput()
  {
    accumulator += dt
    const oldHp = world.value.cars.find(c => c.id === props.self.id)?.hp
    while (accumulator >= 1 / 60) { simulation.step(1 / 60); accumulator -= 1 / 60 }
    world.value = simulation.world
    if (oldHp !== undefined && (world.value.cars.find(c => c.id === props.self.id)?.hp ?? oldHp) < oldHp) tone(130, 0.14)
    networkTime += dt
    if (networkTime >= 0.1) {
      networkTime = 0
      const w = world.value, signature = JSON.stringify([w.stage, w.mode, w.phase, w.cars, w.pickups, w.broken, w.kills, w.winner])
      if (signature !== lastSnapshot) { lastSnapshot = signature; sendSnapshot() }
    }
  }
  const ownCar = world.value.cars.find(c => c.id === props.self.id)
  soundtrack.update(ownCar ? Math.hypot(ownCar.vx, ownCar.vz) : 0, world.value.phase === 'playing' && (ownCar?.hp || 0) > 0)
  hudTime += dt
  if (hudTime > 0.1) { hudTime = 0; hud.value = structuredClone(world.value); snapshotAge.value = Math.floor((now - lastReceive) / 1000) }
}
function render(now: number) {
  renderer?.render(world.value, props.self.id, Math.min((now - lastRender) / 1000 || 0.016, 0.1))
  lastRender = now; animation = requestAnimationFrame(render)
}
watch(() => props.members, members => {
  syncDrivers(world.value, members); world.value.rev++; sendSnapshot(undefined, true)
}, { deep: true })
onMounted(() => {
  try { renderer = new BattleRenderer(canvas.value!) }
  catch { renderError.value = '无法启动 3D 画面，请启用浏览器硬件加速后刷新。'; return }
  disposers.push(props.client.on('message', receive), props.client.on('peer-ready', ({ peerId }) => {
    receivedInputs.delete(peerId)
    syncDrivers(world.value, props.members); sendSnapshot(peerId, true); requestWorld()
  }), props.client.on('peer-state', ({ peerId, state }) => {
    if (state !== 'connected') {
      simulation.inputs.set(peerId, { ...idleInput(), brake: true })
    }
  }))
  window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup); window.addEventListener('blur', blur); window.addEventListener('focus', focus); window.addEventListener('pointercancel', releasePointers); window.addEventListener('contextmenu', preventContextMenu)
  document.addEventListener('visibilitychange', audioVisibility)
  previous = performance.now(); timer = window.setInterval(tick, 16); animation = requestAnimationFrame(render)
  sendInput(true); requestWorld()
  for (const member of props.members) if (member.id !== props.self.id && props.peerStates[member.id] === 'connected') sendSnapshot(member.id, true)
})
onBeforeUnmount(() => {
  blur(); clearInterval(timer); cancelAnimationFrame(animation); renderer?.dispose(); soundtrack.dispose(); document.removeEventListener('visibilitychange', audioVisibility); disposers.forEach(dispose => dispose())
  window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup); window.removeEventListener('blur', blur); window.removeEventListener('focus', focus); window.removeEventListener('pointercancel', releasePointers); window.removeEventListener('contextmenu', preventContextMenu)
})
</script>

<template>
  <section class="fc-game" aria-label="激斗四驱车 FC 冲撞战场">
    <header class="fc-banner">
      <button class="gl-action fc-room-tag" :title="`房间号 ${room.code}`" @click="help = !help" :aria-expanded="help" aria-controls="fc-menu">{{ room.code }} <UiIcon name="menu" /></button>
      <span>关卡 <b>{{ hud.stage }}</b></span><span>生命 <b :class="{ 'fc-low-life': (me?.hp || 0) < 30 }">{{ Math.ceil(me?.hp || 0) }}</b></span>
      <span>{{ hud.mode === 'coop' ? '敌车' : '击破' }} <b>{{ hud.mode === 'coop' ? Math.max(0, hud.goal - hud.kills) : `${me?.kills || 0}/${hud.goal}` }}</b></span>
      <span class="fc-banner-score">得分 <b>{{ me?.score || 0 }}</b></span><span>{{ members.length }} 人</span>
      <span class="fc-banner-network" :title="connectionLabel">{{ snapshotAge >= 3 && members.length > 1 ? '重新同步中' : connectionLabel }}</span>
      <span class="fc-banner-power" v-if="me?.star && me.star > 0">★</span><span class="fc-banner-power" v-else-if="me?.turbo && me.turbo > 0">T</span>
    </header>
    <div class="fc-console">
      <div class="fc-viewport">
        <div v-if="connectionLabel !== 'P2P 直连' && members.length > 1" class="network-recovery" role="status">{{ connectionLabel }} · 自动重试中，断线车辆已停止输入</div>
        <canvas ref="canvas" tabindex="0" class="fc-canvas" aria-label="四驱车战场，方向键或 WASD 转向，J 或空格加速，K 刹车"></canvas>
        <div v-if="renderError" class="fc-cover"><strong>画面未能启动</strong><p>{{ renderError }}</p><button class="gl-action" @click="$emit('leave')">返回大厅</button></div>
        <div v-else-if="hud.phase !== 'playing'" class="fc-cover"><small>{{ hud.phase === 'over' ? 'GAME OVER' : hud.phase === 'complete' ? 'ALL CLEAR' : 'STAGE CLEAR' }}</small><strong>{{ hud.phase === 'over' ? '四驱车已损坏' : hud.mode === 'versus' ? `${hud.winner} 获胜` : hud.phase === 'complete' ? '八个战场，全部突破！' : '本关敌车已清除' }}</strong><p>{{ hud.phase === 'over' ? '按继续重新挑战当前关卡。' : '车头攻击，保护侧面。下一场继续冲撞！' }}</p><button class="gl-action" @click="restart(hud.mode, hud.phase === 'clear' && hud.mode === 'coop')">{{ hud.phase === 'clear' && hud.mode === 'coop' ? '进入下一关' : '继续游戏' }}</button><p>所有玩家状态会通过 P2P 同步。</p><button class="gl-action fc-secondary" @click="$emit('leave')">回到游戏库</button></div>
        <div v-else-if="me && me.hp <= 0" class="fc-respawn">车辆维修中 · {{ Math.max(1, Math.ceil(me.dead)) }} 秒后归队</div>
      </div>
      <div class="fc-controller" @contextmenu.prevent>
        <div ref="driveStick" class="fc-stick" role="application" aria-label="四驱车方向摇杆" @pointerdown.prevent="driveStickDown" @pointermove.prevent="driveStickMove" @pointerup="driveStickUp" @pointercancel="driveStickUp" @lostpointercapture="driveStickUp"><div class="fc-stick-pad"><span class="fc-stick-crosshair"/><span class="fc-stick-thumb" :style="{ transform: `translate(${stickVector.x * 30}px, ${stickVector.z * 30}px)` }"/></div><small>方向</small></div>
        <div class="fc-ab"><div><button aria-label="B 刹车" @pointerdown.prevent="pointerDown('k', $event)" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp">B</button></div><div><button aria-label="A 加速" @pointerdown.prevent="pointerDown('j', $event)" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp">A</button></div></div>
      </div>
    </div>
    <aside v-if="help" id="fc-menu" class="fc-menu" aria-label="房间设置">
    <div class="fc-menu-heading"><strong>激斗四驱车 · {{ STAGES[hud.stage - 1] }}</strong><button class="gl-action" @click="help = false" aria-label="关闭菜单"><UiIcon name="close" /></button></div>
    <div class="fc-menu-actions"><button class="gl-action" @click="toggleSound" :aria-pressed="sound"><UiIcon :name="sound ? 'volume' : 'muted'" />{{ sound ? '关闭音乐与音效' : '开启音乐与音效' }}</button><RoomInviteButton game-id="fc-mini-4wd" :room-code="room.code" :member-count="members.length" :max-members="4"/><button class="gl-action" @click="$emit('leave')"><UiIcon name="exit" />离开房间</button></div>
    <label class="fc-volume">音量 {{ volume }}%<input v-model.number="volume" type="range" min="0" max="100" aria-label="音乐与音效音量" @input="changeVolume" /></label><p class="fc-ice">所有玩家平等参与；各端本地模拟并通过 P2P 同步。</p><p class="fc-ice">首次按方向键或 A/B 键启动音乐。</p>
    <div class="fc-session-bar"><label>车辆<select v-model.number="selectedCar" @change="selectCar"><option :value="0">回旋镖 · 均衡</option><option :value="1">飞狐 · 速度</option><option :value="2">战龙 · 稳重</option></select></label><label>模式<select :value="hud.mode" @change="changeMode"><option value="coop">合作闯关</option><option value="versus">玩家对战 · 10 次击破</option></select></label><span>{{ connectionLabel }}<small v-if="snapshotAge >= 3"> · 正在重新同步</small></span></div>
    <div class="fc-roster"><span v-for="car in roster" :key="car.id"><i :style="{ background: car.paint }"></i><b>{{ car.name }}</b><small>{{ car.id === self.id ? '你' : peerStates[car.id] === 'connected' ? 'P2P 直连' : peerStates[car.id] === 'reconnecting' ? 'P2P 重连中' : '连接中' }}</small><em>{{ Math.ceil(car.hp) }} HP · {{ car.kills }} 击破</em></span></div>
    <p v-if="localIce" class="fc-ice" :title="`本机 ICE：${localIce}；对端 ICE：${remoteIce}`">本机 ICE · {{ localIce }}</p>
    <div class="fc-manual"><h3>用车头撞击敌车侧面，把它推向墙壁。</h3><p>松开加速仍会缓慢行驶，按住 B 才能停车。草地减速；油污会使车辆打滑。正面护甲可抵挡撞击，侧面和车尾更脆弱。</p><p><b>+</b> 能量补满　<b>T</b> 涡轮加速　<b>S</b> 草地悬挂　<b>★</b> 短暂无敌　<b>⚑ / ♛</b> 减少敌车数</p><p>合作模式一起清除八关敌车；单人损坏后可继续，多人可在队友存活时维修归队。对战模式先击破 10 次获胜。新成员可随时加入，玩家状态通过 P2P 对等同步。</p></div>
    </aside>
  </section>
</template>
