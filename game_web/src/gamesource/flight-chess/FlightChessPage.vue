<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { GameLinkClient } from '../../../../sdk/js/gamelink.js'
import type { GameLinkMember, GameLinkMessage, GameLinkRoom } from '../../../../sdk/js/gamelink.js'
import FlightBoard from './FlightBoard.vue'

type Phase = 'waiting' | 'roll' | 'move' | 'done'
type Player = { id: string; name: string; color: string; planes: number[] }
type GameState = { rev: number; players: Player[]; turn: number; phase: Phase; dice: number; winner: string | null; notice: string }
const COLORS = ['red','blue','yellow','green']
const SAFE = new Set([0, 8, 13, 21, 26, 34, 39, 47])
const START = { red: 0, blue: 13, yellow: 26, green: 39 } as const
const freshState = (): GameState => ({ rev: 0, players: [], turn: 0, phase: 'waiting', dice: 0, winner: null, notice: '等待第二位玩家加入' })
const client = shallowRef<GameLinkClient>()
const room = ref<GameLinkRoom>()
const self = ref<GameLinkMember>()
const members = ref<GameLinkMember[]>([])
const state = ref<GameState>(freshState())
const error = ref('')
const home = ref('/')
const ready = ref(false)
const preview = ref(false)
const rolling = ref(false)
const peers = ref<Record<string,string>>({})
const connection = (id:string) => id === localId.value ? '你 · 本机' : peers.value[id] === 'connected' ? '已连接' : peers.value[id] === 'reconnecting' ? '重连中' : '连接中'
const connected = computed(() => state.value.players.filter(p => p.id === localId.value || peers.value[p.id] === 'connected').length)
const allConnected = computed(() => preview.value || connected.value === state.value.players.length)
const turnTitle = computed(() => state.value.phase === 'waiting' ? state.value.players.length >= 2 ? '两人即可出发' : '等一位朋友' : state.value.phase === 'done' ? '本局结束' : myTurn.value ? '轮到你了' : `等待 ${active.value?.name || '玩家'}`)

let rollTimer = 0
const localId = computed(() => self.value?.id || '')
const active = computed(() => state.value.players[state.value.turn])
const myTurn = computed(() => active.value?.id === localId.value)
const canRoll = computed(() => state.value.phase === 'roll' && myTurn.value && !rolling.value && allConnected.value)
const canStart = computed(() => state.value.phase === 'waiting' && state.value.players.length >= 2 && allConnected.value)
function playerFor(member: GameLinkMember, players: Player[]) { return players.find(player => player.id === member.id) }
function publish(next: GameState) { state.value = next; if (client.value) void client.value.broadcast('ludo-state', next) }
function updatePlayers(list: GameLinkMember[]) {
  if (!ready.value) return
  const next = (JSON.parse(JSON.stringify(state.value)) as GameState), currentId = next.players[next.turn]?.id
  if (next.phase !== 'waiting') {
    for (const member of list) if (member.id !== localId.value && !playerFor(member, next.players)) client.value?.send('ludo-reject', { reason: '这局已经开始，下一局再来吧。' }, { target: member.id, reliability: 'reliable' })
    const valid = new Set(list.map(member => member.id))
    next.players = next.players.filter(player => valid.has(player.id))
    const currentIndex = next.players.findIndex(player => player.id === currentId)
    if (currentIndex < 0 && currentId) {
      next.turn = Math.min(Math.max(0, next.turn), Math.max(0, next.players.length - 1))
      next.phase = 'roll'; next.dice = 0
      next.notice = `${currentId === localId.value ? '一位玩家' : '当前玩家'}离开了房间，游戏继续`
    }
  } else {
    next.players = [...list].sort((a,b) => a.id.localeCompare(b.id)).slice(0,4).map((member,index) => ({id:member.id,name:member.name,color:COLORS[index]!,planes:[-1,-1,-1,-1]}))
  }
  next.turn = Math.max(0, next.players.findIndex(player => player.id === currentId))
  next.notice = next.phase === 'waiting' ? next.players.length >= 2 ? '飞行员到齐，可以开局' : '等待第二位玩家加入' : next.notice
  if (JSON.stringify(next) !== JSON.stringify(state.value)) { next.rev++; publish(next) }
}
function validState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false
  const next = value as GameState
  return Number.isSafeInteger(next.rev) && next.rev >= 0 && Array.isArray(next.players) && next.players.length <= 4 && Number.isInteger(next.turn) && next.turn >= 0 && next.turn < Math.max(1,next.players.length) && ['waiting','roll','move','done'].includes(next.phase) && Number.isInteger(next.dice) && next.dice >= 0 && next.dice <= 6 && (next.winner === null || typeof next.winner === 'string') && next.players.every(p => p && typeof p.id === 'string' && typeof p.name === 'string' && COLORS.includes(p.color) && Array.isArray(p.planes) && p.planes.length === 4 && p.planes.every(n => Number.isInteger(n) && n >= -1 && n <= 57))
}
function receive(message: GameLinkMessage) {
  const data = message.payload as Record<string, unknown>
  if (!members.value.some(member => member.id === message.from) || !data || typeof data !== 'object') return
  if (message.kind === 'ludo-reject' && typeof data?.reason === 'string') {
    error.value = data.reason; void leaveRoom(); return
  }
  if (message.kind === 'ludo-state' && validState(data) && data.rev > state.value.rev) state.value = data
  if (message.kind === 'ludo-request') client.value?.send('ludo-state', state.value, { target: message.from, reliability: 'reliable' })
  if (message.kind === 'ludo-start' && state.value.phase === 'waiting' && state.value.players.length >= 2 && state.value.players.some(p => p.id === message.from)) {
    const next = JSON.parse(JSON.stringify(state.value)) as GameState; next.phase = 'roll'; next.rev++; next.notice = `${next.players[next.turn]!.name}，掷出 6 让飞机起飞`; publish(next)
  }
  if (message.kind === 'ludo-action') handleAction(message.from, data)
}
function begin() {
  if (!canStart.value) return
  const next = JSON.parse(JSON.stringify(state.value)) as GameState; next.phase = 'roll'; next.notice = `${next.players[next.turn]!.name}，掷出 6 让飞机起飞`
  next.rev++; publish(next)
}
function nextLivingTurn(next: GameState) {
  if (!next.players.length) { next.phase = 'waiting'; next.turn = 0; return }
  next.turn = (next.turn + 1) % next.players.length
  next.phase = 'roll'
  next.notice = `${next.players[next.turn]!.name} 的回合`
}
function possibleMoves(player: Player, dice: number) {
  return player.planes.flatMap((progress, index) => ((progress === -1 && dice === 6) || (progress >= 0 && progress < 57 && progress + dice <= 57)) ? [index] : [])
}
function handleAction(from: string, action: Record<string, unknown>) {
  const next = (JSON.parse(JSON.stringify(state.value)) as GameState), player = next.players[next.turn]
  if (action.rev !== state.value.rev) return
  if (!player || player.id !== from || next.phase === 'waiting' || next.phase === 'done') return
  if (action.type === 'roll' && next.phase === 'roll') {
    if (!Number.isInteger(action.dice) || Number(action.dice) < 1 || Number(action.dice) > 6) return
    next.dice = Number(action.dice)
    const moves = possibleMoves(player, next.dice)
    if (moves.length) { next.phase = 'move'; next.notice = `${player.name} 掷出 ${next.dice}，请选择一架飞机` }
    else if (next.dice === 6) next.notice = `${player.name} 掷出 6，没有可走的飞机，再掷一次`
    else nextLivingTurn(next)
    next.rev++; publish(next); return
  }
  if (action.type !== 'move' || next.phase !== 'move' || !Number.isInteger(action.plane)) return
  const planeIndex = Number(action.plane)
  if (!possibleMoves(player, next.dice).includes(planeIndex)) return
  const before = player.planes[planeIndex]!, after = before === -1 ? 0 : before + next.dice
  player.planes[planeIndex] = after
  let captures = 0
  if (after < 52) {
    const global = (START[player.color as keyof typeof START] + after) % 52
    const safe = SAFE.has(global)
    if (!safe) for (const opponent of next.players) if (opponent.id !== player.id) opponent.planes = opponent.planes.map(progress => {
      if (progress >= 0 && progress < 52 && (START[opponent.color as keyof typeof START] + progress) % 52 === global) { captures++; return -1 }
      return progress
    })
  }
  if (player.planes.every(progress => progress === 57)) { next.phase = 'done'; next.winner = player.id; next.notice = `${player.name} 的四架飞机全部到达终点，赢得本局！` }
  else if (next.dice === 6 || captures > 0) { next.phase = 'roll'; next.notice = captures ? `${player.name} 撞回 ${captures} 架对手飞机，再掷一次` : `${player.name} 掷出 6，再掷一次` }
  else nextLivingTurn(next)
  next.rev++; publish(next)
}
function sendAction(type: string, plane?: number) {
  if (!allConnected.value) return
  const action = { type, plane, rev:state.value.rev, dice:type === 'roll' ? Math.floor(Math.random()*6)+1 : undefined }
  handleAction(localId.value, action)
}
function roll() {
  if (!canRoll.value) return
  rolling.value = true; rollTimer = window.setTimeout(() => { sendAction('roll'); rolling.value = false }, 380)
}
function movePlane(index: number) { if (state.value.phase === 'move' && myTurn.value && active.value && possibleMoves(active.value, state.value.dice).includes(index)) sendAction('move', index) }
async function leaveRoom() {
  try { await client.value?.leave() } finally { if (home.value) window.location.assign(home.value) }
}
onMounted(async () => {
  if (!new URLSearchParams(location.search).has('room')) {
    preview.value = true; self.value = { id: 'preview', name: '你', virtual_ip: '', endpoint: '' }
    state.value = { rev: 1, players: [{ id: 'preview', name: '你', color: 'red', planes: [-1,-1,-1,-1] }], turn: 0, phase: 'roll', dice: 0, winner: null, notice: '掷出 6，让第一架飞机起飞' }; ready.value = true; return
  }
  try {
    const session = GameLinkClient.fromLocation()
    if (session.gameId !== 'gamelink-flight-chess') throw new Error('此页面只支持飞行棋房间。')
    client.value = session; home.value = `${session.serverUrl}/`
    session.on('room', value => { room.value = value })
    session.on('members', value => { members.value = value; updatePlayers(value) })
    session.on('message', receive)
    session.on('peer-state', peer => {
      peers.value = { ...peers.value, [peer.peerId]:peer.state }
      if (peer.state !== 'connected') return
      session.send('ludo-request', {}, { target: peer.peerId, reliability: 'reliable' })
    })
    session.on('error', reason => { error.value = reason.message })
    session.on('room-closed', () => { ready.value = false; error.value = '房间已关闭，请回到大厅重新加入。' })
    const joined = await session.joinFromLocation()
    room.value = joined.room; self.value = joined.self_member; members.value = joined.room.members
    if (members.value.length > 4) { error.value = '飞行棋房间最多 4 位玩家。'; await session.leave(); return }
    state.value = { ...freshState(), players: [...members.value].sort((a,b) => a.id.localeCompare(b.id)).slice(0,4).map((member, index) => ({ id: member.id, name: member.name, color: COLORS[index]!, planes: [-1,-1,-1,-1] })), notice: members.value.length >= 2 ? '飞行员到齐，等待开局' : '等待第二位玩家加入' }
    ready.value = true
    for (const [id,status] of session.peerStates) { peers.value[id] = status; if (status === 'connected') session.send('ludo-request', {}, { target:id, reliability:'reliable' }) }
  } catch (reason) { client.value?.dispose(); error.value = reason instanceof Error ? reason.message : String(reason) }
})
onBeforeUnmount(() => { window.clearTimeout(rollTimer); client.value?.dispose() })
</script>

<template>
  <main class="flight-game board-first">
    <header class="flight-header">
      <a href="/" class="flight-brand"><span class="brand-plane">✈</span><b>飞行棋</b></a>
      <div class="flight-room"><small>房间</small><b>{{ room?.code || '练习' }}</b></div>
      <span class="compact-network" role="status">{{ preview ? '单人练习' : `${connected}/${state.players.length} 已连接` }}</span>
      <button class="flight-exit" @click="leaveRoom">退出 ↗</button>
    </header>
    <section v-if="ready" class="board-stage">
      <div class="board-turn" aria-live="polite"><b>{{ turnTitle }}</b><span>{{ !allConnected ? '等待连接恢复…' : state.phase === 'waiting' ? '2 人即可开始 · 最多 4 人' : state.notice }}</span></div>
      <p v-if="error" class="flight-error" role="alert">{{ error }}</p>
      <div class="board-arena">
        <FlightBoard :state="state" :self-id="localId" @move="movePlane" />
        <div class="center-control">
          <button v-if="state.phase === 'waiting'" class="center-dice start-dice" :disabled="!canStart" @click="begin"><span>✈</span><small>{{ canStart ? `${state.players.length} 人开始` : state.players.length < 2 ? '等待朋友' : '连接中' }}</small></button>
          <button v-else class="center-dice" :class="{ rolling, 'is-mine': myTurn && state.phase === 'roll' }" :disabled="!canRoll" :aria-label="canRoll ? '掷骰子' : state.phase === 'move' ? '请选择飞机' : '等待回合'" @click="roll"><span>{{ state.dice ? ['','⚀','⚁','⚂','⚃','⚄','⚅'][state.dice] : '⚄' }}</span><small>{{ rolling ? '掷骰中' : state.phase === 'done' ? '已结束' : !allConnected ? '连接中' : myTurn ? state.phase === 'move' ? '选择飞机' : '掷骰子' : '等待对手' }}</small></button>
        </div>
      </div>
      <div class="players-strip" aria-label="玩家状态">
        <div v-for="player in state.players" :key="player.id" class="player-chip" :class="[`roster-${player.color}`, { current: active?.id === player.id && state.phase !== 'waiting' && state.phase !== 'done' }]" :title="connection(player.id)"><i></i><b>{{ player.name }}{{ player.id === localId ? ' · 你' : '' }}</b><span>{{ player.planes.filter(p => p === 57).length }}/4</span><small>{{ connection(player.id) }}</small></div>
      </div>
      <details class="compact-rules"><summary>玩法说明</summary><p>2 人即可开局。掷出 6 起飞或再掷一次；点击亮起的飞机行棋。星标格安全，其他格撞回对手可再掷一次。刚好点数抵达终点，四架全部归航获胜。</p></details>
    </section>
    <section v-else class="flight-loading"><span>✈</span><b>{{ error || '正在加入房间…' }}</b><a v-if="error" :href="home">返回大厅</a></section>
  </main>
</template>
