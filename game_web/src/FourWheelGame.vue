<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { GameLinkClient, GameLinkMember, GameLinkMessage, GameLinkRoom } from '../../sdk/js/gamelink.js'
import { BattleAudio } from './four-wheel/audio'
import { BattleRenderer } from './four-wheel/renderer'
import { BattleSimulation, createWorld, syncDrivers, idleInput, normalizeInput, moveCar, makeMap, STAGES } from './four-wheel/simulation'
import type { Car, Input, Mode, World } from './four-wheel/simulation'
import './four-wheel/battle.css'

const props = defineProps<{ client: GameLinkClient; room: GameLinkRoom; self: GameLinkMember; members: GameLinkMember[]; peerStates: Record<string, string>; localIce: string; remoteIce: string; connectionLabel: string }>()
defineEmits<{ leave: [] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const world = shallowRef(createWorld(props.members))
const hud = shallowRef(structuredClone(world.value))
const isHost = computed(() => props.room.host_id === props.self.id)
const me = computed(() => hud.value.cars.find(c => c.id === props.self.id))
const roster = computed(() => hud.value.cars.filter(c => !c.bot).sort((a, b) => b.score - a.score))
const waiting = ref(!isHost.value), renderError = ref(''), help = ref(false), sound = ref(true), volume = ref(30), selectedCar = ref(0), snapshotAge = ref(0)
const pressed = new Set<string>(), pointers = new Map<number, string>()
let simulation = new BattleSimulation(world.value)
let renderer: BattleRenderer | undefined, predicted: Car | undefined
let animation = 0, timer = 0, previous = 0, lastRender = 0, accumulator = 0, networkTime = 0, hudTime = 0
let inputSequence = 0, lastInput = '', lastSnapshot = '', lastHostRev = -1, lastReceive = performance.now(), lastRequest = 0, mutedOnBlur = false
const receivedInputs = new Map<string, number>()
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
  return { x: Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft')), z: Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup')), gas: keys.has('j') || keys.has(' '), brake: keys.has('k') || keys.has('x') }
}
function sendInput(force = false) {
  const input = currentInput(), signature = JSON.stringify(input)
  if (!force && lastInput === signature) return
  lastInput = signature
  if (isHost.value) simulation.inputs.set(props.self.id, input)
  else props.client.send('fc2-input', { ...input, seq: ++inputSequence }, { target: props.room.host_id, reliability: 'reliable' })
}
function sendSnapshot(target?: string, reliable = false) {
  if (isHost.value) props.client.send('fc2-world', world.value, { target, reliability: reliable ? 'reliable' : 'unreliable' })
}
function requestWorld() {
  if (isHost.value) return
  props.client.send('fc2-request', { protocol: 3 }, { target: props.room.host_id, reliability: 'reliable' })
  sendInput(true); lastRequest = performance.now()
}
function validWorld(value: unknown): value is World {
  if (!value || typeof value !== 'object') return false
  const w = value as World
  return w.protocol === 3 && Number.isSafeInteger(w.rev) && Number.isInteger(w.stage) && w.stage >= 1 && w.stage <= 8
    && ['coop', 'versus'].includes(w.mode) && ['playing', 'over', 'clear', 'complete'].includes(w.phase)
    && Number.isFinite(w.time) && Number.isFinite(w.kills) && Number.isFinite(w.goal)
    && Array.isArray(w.cars) && w.cars.length <= 32 && w.cars.every(c => c && typeof c.id === 'string' && typeof c.name === 'string' && typeof c.paint === 'string' && /^#[0-9a-f]{6}$/i.test(c.paint) && [c.x, c.z, c.vx, c.vz, c.hp, c.angle, c.model, c.score, c.kills, c.star, c.hurt, c.spin, c.turbo, c.dead].every(Number.isFinite))
    && Array.isArray(w.pickups) && w.pickups.length <= 64 && w.pickups.every(i => i && typeof i.id === 'string' && Number.isFinite(i.x) && Number.isFinite(i.z) && ['fuel', 'turbo', 'suspension', 'star', 'flag', 'crown'].includes(i.kind))
    && Array.isArray(w.broken) && w.broken.length <= 12800 && w.broken.every(Number.isInteger)
    && Array.isArray(w.sparks) && w.sparks.length <= 128 && w.sparks.every(s => s && [s.id, s.x, s.z, s.age].every(Number.isFinite))
}
function receive(message: GameLinkMessage) {
  if (!props.members.some(m => m.id === message.from)) return
  if (message.kind === 'fc2-world' && !isHost.value && message.from === props.room.host_id) {
    if ((message.payload as { protocol?: number })?.protocol !== 3) { renderError.value = '房主游戏版本不同，请所有玩家刷新网页后重新创建房间。'; return }
    if (!validWorld(message.payload) || message.payload.rev < lastHostRev) return
    const next = message.payload, own = next.cars.find(c => c.id === props.self.id)
    if (own && predicted && own.hp < predicted.hp) tone(130, 0.14)
    if (own) {
      const distance = predicted ? Math.hypot(own.x - predicted.x, own.z - predicted.z) : Infinity
      if (!predicted || next.stage !== world.value.stage || next.phase !== world.value.phase || own.hp <= 0 || distance > 4 || own.hurt > 0) predicted = { ...own }
      else {
        const x = predicted.x + (own.x - predicted.x) * 0.3, z = predicted.z + (own.z - predicted.z) * 0.3
        predicted = { ...own, x, z, angle: predicted.angle }
      }
    }
    world.value = next; lastHostRev = next.rev; lastReceive = performance.now(); waiting.value = false
    return
  }
  if (!isHost.value) return
  const data = message.payload as Record<string, unknown> | null
  if (message.kind === 'fc2-input') {
    const input = normalizeInput(data)
    if (!input || !data || !Number.isSafeInteger(data.seq) || Number(data.seq) <= (receivedInputs.get(message.from) ?? -1)) return
    receivedInputs.set(message.from, Number(data.seq)); simulation.inputs.set(message.from, input)
  } else if (message.kind === 'fc2-request') {
    syncDrivers(world.value, props.members); sendSnapshot(message.from, true)
  } else if (message.kind === 'fc2-car' && data && Number.isInteger(data.model) && Number(data.model) >= 0 && Number(data.model) <= 2) {
    const car = world.value.cars.find(c => c.id === message.from)
    if (car) { car.model = Number(data.model); world.value.rev++; sendSnapshot(undefined, true) }
  }
}
function selectCar() {
  if (isHost.value) {
    const car = world.value.cars.find(c => c.id === props.self.id)
    if (car) car.model = Number(selectedCar.value)
    world.value.rev++; sendSnapshot(undefined, true)
  } else props.client.send('fc2-car', { model: Number(selectedCar.value) }, { target: props.room.host_id, reliability: 'reliable' })
}
function restart(mode = world.value.mode, advance = false) {
  if (!isHost.value) return
  simulation.reset(props.members, advance ? Math.min(8, world.value.stage + 1) : world.value.phase === 'complete' ? 1 : world.value.stage, mode)
  world.value = simulation.world; selectCar(); lastSnapshot = ''; accumulator = 0; sendInput(true); sendSnapshot(undefined, true)
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
function releasePointers() {
  if (!pointers.size) return
  pointers.clear(); sendInput(true)
}
function preventContextMenu(event: MouseEvent) { if ((event.target as HTMLElement)?.closest('.fc-controller')) event.preventDefault() }
function blur() { pressed.clear(); pointers.clear(); mutedOnBlur = true; sendInput(true) }
function focus() { mutedOnBlur = false; sendInput() }
function tick() {
  const now = performance.now(), dt = Math.min((now - previous) / 1000, 0.2)
  previous = now; sendInput()
  if (isHost.value) {
    accumulator += dt
    const oldHp = world.value.cars.find(c => c.id === props.self.id)?.hp
    while (accumulator >= 1 / 60) { simulation.step(1 / 60); accumulator -= 1 / 60 }
    world.value = simulation.world
    if (oldHp !== undefined && (world.value.cars.find(c => c.id === props.self.id)?.hp ?? oldHp) < oldHp) tone(130, 0.14)
    networkTime += dt
    if (networkTime >= 0.05) {
      networkTime = 0
      const w = world.value, signature = JSON.stringify([w.stage, w.mode, w.phase, w.cars, w.pickups, w.broken, w.kills, w.winner])
      if (signature !== lastSnapshot) { lastSnapshot = signature; sendSnapshot(undefined, w.phase !== 'playing') }
    }
  } else {
    if (predicted && world.value.phase === 'playing' && now - lastReceive < 1500) moveCar(predicted, currentInput(), dt, makeMap(world.value.stage), world.value)
    if ((waiting.value || now - lastReceive > 3000) && now - lastRequest > 1500) requestWorld()
  }
  const ownCar = predicted || world.value.cars.find(c => c.id === props.self.id)
  soundtrack.update(ownCar ? Math.hypot(ownCar.vx, ownCar.vz) : 0, world.value.phase === 'playing' && (ownCar?.hp || 0) > 0)
  hudTime += dt
  if (hudTime > 0.1) { hudTime = 0; hud.value = structuredClone(world.value); snapshotAge.value = isHost.value ? 0 : Math.floor((now - lastReceive) / 1000) }
}
function render(now: number) {
  renderer?.render(world.value, props.self.id, Math.min((now - lastRender) / 1000 || 0.016, 0.1), isHost.value ? undefined : predicted)
  lastRender = now; animation = requestAnimationFrame(render)
}
watch(() => props.members, members => {
  if (isHost.value) { syncDrivers(world.value, members); world.value.rev++; sendSnapshot(undefined, true) }
}, { deep: true })
watch(() => props.room.host_id, () => {
  lastHostRev = -1; receivedInputs.clear()
  if (isHost.value) {
    simulation = new BattleSimulation(structuredClone(world.value)); syncDrivers(simulation.world, props.members)
    simulation.world.rev++; world.value = simulation.world; waiting.value = false; sendInput(true); sendSnapshot(undefined, true)
  } else { waiting.value = true; requestWorld() }
})
onMounted(() => {
  try { renderer = new BattleRenderer(canvas.value!) }
  catch { renderError.value = '无法启动 3D 画面，请启用浏览器硬件加速后刷新。'; return }
  disposers.push(props.client.on('message', receive), props.client.on('peer-state', ({ peerId, state }) => {
    if (state === 'connected' || state === 'relay') {
      if (isHost.value) { syncDrivers(world.value, props.members); sendSnapshot(peerId, true) }
      else if (peerId === props.room.host_id) { requestWorld(); selectCar() }
    } else if (state === 'closed' && isHost.value) simulation.inputs.set(peerId, { ...idleInput(), brake: true })
  }))
  window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup); window.addEventListener('blur', blur); window.addEventListener('focus', focus); window.addEventListener('pointercancel', releasePointers); window.addEventListener('contextmenu', preventContextMenu)
  document.addEventListener('visibilitychange', audioVisibility)
  previous = performance.now(); timer = window.setInterval(tick, 16); animation = requestAnimationFrame(render)
  if (isHost.value) sendInput(true); else requestWorld()
})
onBeforeUnmount(() => {
  blur(); clearInterval(timer); cancelAnimationFrame(animation); renderer?.dispose(); soundtrack.dispose(); document.removeEventListener('visibilitychange', audioVisibility); disposers.forEach(dispose => dispose())
  window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup); window.removeEventListener('blur', blur); window.removeEventListener('focus', focus); window.removeEventListener('pointercancel', releasePointers); window.removeEventListener('contextmenu', preventContextMenu)
})
</script>

<template>
  <section class="fc-game" aria-label="激斗四驱车 FC 冲撞战场">
    <header class="fc-banner">
      <button class="fc-room-tag" :title="`房间号 ${room.code}`" @click="help = !help" :aria-expanded="help" aria-controls="fc-menu">{{ room.code }} <span>☰</span></button>
      <span>关卡 <b>{{ hud.stage }}</b></span><span>生命 <b :class="{ 'fc-low-life': (me?.hp || 0) < 30 }">{{ Math.ceil(me?.hp || 0) }}</b></span>
      <span>{{ hud.mode === 'coop' ? '敌车' : '击破' }} <b>{{ hud.mode === 'coop' ? Math.max(0, hud.goal - hud.kills) : `${me?.kills || 0}/${hud.goal}` }}</b></span>
      <span class="fc-banner-score">得分 <b>{{ me?.score || 0 }}</b></span><span>{{ members.length }} 人</span>
      <span class="fc-banner-network" :title="connectionLabel">{{ !isHost && snapshotAge >= 3 ? '重新同步中' : connectionLabel }}</span>
      <span class="fc-banner-power" v-if="me?.star && me.star > 0">★</span><span class="fc-banner-power" v-else-if="me?.turbo && me.turbo > 0">T</span>
    </header>
    <div class="fc-console">
      <div class="fc-viewport">
        <canvas ref="canvas" tabindex="0" class="fc-canvas" aria-label="四驱车战场，方向键或 WASD 转向，J 或空格加速，K 刹车"></canvas>
        <div v-if="renderError || waiting" class="fc-cover"><strong>{{ renderError ? '画面未能启动' : '正在加入战场' }}</strong><p>{{ renderError || '正在连接房主并同步车辆与关卡…' }}</p><button @click="$emit('leave')">返回大厅</button></div>
        <div v-else-if="hud.phase !== 'playing'" class="fc-cover"><small>{{ hud.phase === 'over' ? 'GAME OVER' : hud.phase === 'complete' ? 'ALL CLEAR' : 'STAGE CLEAR' }}</small><strong>{{ hud.phase === 'over' ? '四驱车已损坏' : hud.mode === 'versus' ? `${hud.winner} 获胜` : hud.phase === 'complete' ? '八个战场，全部突破！' : '本关敌车已清除' }}</strong><p>{{ hud.phase === 'over' ? '按继续重新挑战当前关卡。' : '车头攻击，保护侧面。下一场继续冲撞！' }}</p><button v-if="isHost" @click="restart(hud.mode, hud.phase === 'clear' && hud.mode === 'coop')">{{ hud.phase === 'clear' && hud.mode === 'coop' ? '进入下一关' : '继续游戏' }}</button><p v-else>等待房主继续</p><button class="fc-secondary" @click="$emit('leave')">回到游戏库</button></div>
        <div v-else-if="me && me.hp <= 0" class="fc-respawn">车辆维修中 · {{ Math.max(1, Math.ceil(me.dead)) }} 秒后归队</div>
      </div>
      <div class="fc-controller" @contextmenu.prevent>
        <div class="fc-dpad" aria-label="方向控制"><button class="fc-up" aria-label="向上行驶" @pointerdown.prevent="pointerDown('w', $event)" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp">▲</button><button class="fc-left" aria-label="向左行驶" @pointerdown.prevent="pointerDown('a', $event)" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp">◀</button><span>✚</span><button class="fc-right" aria-label="向右行驶" @pointerdown.prevent="pointerDown('d', $event)" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp">▶</button><button class="fc-down" aria-label="向下行驶" @pointerdown.prevent="pointerDown('s', $event)" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp">▼</button></div>
        <div class="fc-ab"><div><button aria-label="B 刹车" @pointerdown.prevent="pointerDown('k', $event)" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp">B</button></div><div><button aria-label="A 加速" @pointerdown.prevent="pointerDown('j', $event)" @pointerup="pointerUp" @pointercancel="pointerUp" @lostpointercapture="pointerUp">A</button></div></div>
      </div>
    </div>
    <aside v-if="help" id="fc-menu" class="fc-menu" aria-label="房间设置">
    <div class="fc-menu-heading"><strong>激斗四驱车 · {{ STAGES[hud.stage - 1] }}</strong><button @click="help = false" aria-label="关闭菜单">×</button></div>
    <div class="fc-menu-actions"><button @click="toggleSound" :aria-pressed="sound">{{ sound ? '关闭音乐与音效' : '开启音乐与音效' }}</button><button @click="$emit('leave')">离开房间</button></div>
    <label class="fc-volume">音量 {{ volume }}%<input v-model.number="volume" type="range" min="0" max="100" aria-label="音乐与音效音量" @input="changeVolume" /></label><p class="fc-ice">首次按方向键或 A/B 键启动音乐。</p>
    <div class="fc-session-bar"><label>车辆<select v-model.number="selectedCar" @change="selectCar"><option :value="0">回旋镖 · 均衡</option><option :value="1">飞狐 · 速度</option><option :value="2">战龙 · 稳重</option></select></label><label>模式<select :value="hud.mode" :disabled="!isHost" @change="changeMode"><option value="coop">合作闯关</option><option value="versus">玩家对战 · 10 次击破</option></select></label><span>{{ connectionLabel }}<small v-if="!isHost && snapshotAge >= 3"> · 正在重新同步</small></span></div>
    <div class="fc-roster"><span v-for="car in roster" :key="car.id"><i :style="{ background: car.paint }"></i><b>{{ car.name }}</b><small>{{ car.id === self.id ? '你' : peerStates[car.id] === 'connected' ? 'P2P 直连' : peerStates[car.id] === 'relay' ? '服务器转发' : '连接中' }}</small><em>{{ Math.ceil(car.hp) }} HP · {{ car.kills }} 击破</em></span></div>
    <p v-if="localIce" class="fc-ice" :title="`本机 ICE：${localIce}；对端 ICE：${remoteIce}`">本机 ICE · {{ localIce }}</p>
    <div class="fc-manual"><h3>用车头撞击敌车侧面，把它推向墙壁。</h3><p>松开加速仍会缓慢行驶，按住 B 才能停车。草地减速；油污会使车辆打滑。正面护甲可抵挡撞击，侧面和车尾更脆弱。</p><p><b>+</b> 能量补满　<b>T</b> 涡轮加速　<b>S</b> 草地悬挂　<b>★</b> 短暂无敌　<b>⚑ / ♛</b> 减少敌车数</p><p>合作模式一起清除八关敌车；单人损坏后可继续，多人可在队友存活时维修归队。对战模式先击破 10 次获胜。新成员可随时加入，房主离开后由新房主接管。</p></div>
    </aside>
  </section>
</template>
