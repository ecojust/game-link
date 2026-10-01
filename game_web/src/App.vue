<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { GameLinkClient } from '../../sdk/js/gamelink.js'
type Game = { id: string; title: string; description: string; players: string; tag: string; theme: string; glyph: string; entry_url: string }
type Room = { code: string; game_id: string; member_count: number; max_members: number }
const games = ref<Game[]>([]), rooms = ref<Room[]>([])
const username = ref(localStorage.getItem('gamelink-game-name') || '')
const busy = ref(false), error = ref(''), loading = ref(true)
const serverUrl = import.meta.env.VITE_API_BASE_URL || ''
const integrationDialog = ref<HTMLDialogElement | null>(null)
const nameDialog = ref<HTMLDialogElement | null>(null)
const nameDraft = ref('')
const pendingRoom = ref<Room | null>(null)
let timer = 0
function gameFor(id: string) { return games.value.find(game => game.id === id) }
function persist() { localStorage.setItem('gamelink-game-name', username.value.trim()) }
function validName() {
  if (!username.value.trim()) { error.value = '先填写你的游戏昵称。'; return false }
  persist(); error.value = ''; return true
}
async function refreshRooms() {
  try {
    const response = await fetch(serverUrl + '/v1/rooms')
    if (!response.ok) throw new Error('房间列表读取失败')
    rooms.value = await response.json()
  } catch (reason) { error.value = String(reason) } finally { loading.value = false }
}
async function createRoom(game: Game) {
  if (!validName() || busy.value) return
  busy.value = true
  try {
    const client = new GameLinkClient({ serverUrl, gameId: game.id, playerName: username.value.trim() })
    const url = await client.createLaunchUrl(game.entry_url)
    window.location.assign(url)
  } catch (reason) { error.value = reason instanceof Error ? reason.message : String(reason); busy.value = false }
}
function joinRoom(room: Room) {
  if (busy.value) return
  if (!username.value.trim()) {
    pendingRoom.value = room
    nameDraft.value = ''
    nameDialog.value?.showModal()
    return
  }
  if (!validName()) return
  navigateToRoom(room)
}
function navigateToRoom(room: Room) {
  const game = gameFor(room.game_id)
  if (!game) { error.value = '尚未登记此游戏入口。'; return }
  const url = new URL(game.entry_url, window.location.href)
  if (!['https:', 'http:'].includes(url.protocol)) { error.value = '游戏入口地址无效'; return }
  url.search = new URLSearchParams({ gameid: game.id, room: room.code, username: username.value.trim() }).toString()
  url.hash = ''
  window.location.assign(url.href)
}
function submitName() {
  const name = nameDraft.value.trim()
  if (!name || !pendingRoom.value) return
  username.value = name
  persist()
  const room = pendingRoom.value
  pendingRoom.value = null
  nameDialog.value?.close()
  navigateToRoom(room)
}
onMounted(async () => {
  try {
    const response = await fetch('/games.json', { cache: 'no-cache' })
    if (!response.ok) throw new Error('游戏目录读取失败')
    games.value = await response.json()
    await refreshRooms()
    timer = window.setInterval(refreshRooms, 5000)
  } catch (reason) { error.value = String(reason); loading.value = false }
})
onBeforeUnmount(() => window.clearInterval(timer))
</script>
<template>
  <main class="game-shell">
    <header class="masthead"><a class="brand" href="/"><img class="brand-logo" src="/gamelink-logo.svg" alt="GameLink" width="156" height="52" /></a><div class="masthead-actions"><button class="info-button" type="button" aria-label="个人游戏接入说明" title="个人游戏如何接入" @click="integrationDialog?.showModal()"><span aria-hidden="true">i</span></button><div class="version-label">GAME NETWORK <b>0.1</b></div></div></header>
    <dialog ref="integrationDialog" class="integration-dialog" aria-labelledby="integration-title">
      <div class="integration-heading"><div><span class="integration-kicker">GAMELINK / DEVELOPER GUIDE</span><h2 id="integration-title">接入你自己的游戏</h2></div><button class="dialog-close" type="button" aria-label="关闭" @click="integrationDialog?.close()">×</button></div>
      <p class="integration-lead">准备一个能通过浏览器打开的游戏页面。GameLink 负责房间、玩家列表与 P2P 通讯，你的游戏负责玩法和游戏状态。</p>
      <ol class="integration-steps">
        <li><b>给游戏登记入口</b><span>在平台游戏目录登记唯一的 <code>gameid</code>、游戏名称和入口 URL。入口可以是独立域名。</span></li>
        <li><b>接收房间参数</b><span>平台会打开你的页面，并传入 <code>gameid</code>、<code>room</code>、<code>username</code> 三个查询参数。</span></li>
        <li><b>用 JS SDK 加入房间</b><span>成功加入后，首位玩家成为房主；监听成员和消息事件，再把游戏操作与状态通过 SDK 同步。</span></li>
      </ol>
      <div class="integration-code-label">坦克大战实际使用方式 · Game ID: tank-arena</div>
      <pre class="integration-code"><code>import { GameLinkClient } from
  'https://games.b14f.com/gamelink.js'

// URL 中必须有 gameid、room、username
const client = GameLinkClient.fromLocation()
if (client.gameId !== 'tank-arena') throw new Error('游戏 ID 不匹配')

client.on('members', members =&gt; syncPlayers(members))
client.on('message', ({ kind, from, payload }) =&gt; {
  if (kind === 'player_state') updateTank(from, payload)
  if (kind === 'shot') addBullet(payload)
  if (kind === 'hit' &amp;&amp; payload.target === myPlayerId) takeDamage(payload.damage)
})
await client.joinFromLocation()

// 坦克移动后发送状态；开火时发送可靠事件
client.send('player_state', tankSnapshot, { reliability: 'unreliable' })
client.send('shot', shot, { reliability: 'reliable' })</code></pre>
      <p class="integration-note">这段示例对应平台内置坦克游戏的真实消息协议：移动状态使用不可靠通道，减少过时位置堆积；炮弹、受击等事件使用可靠消息。返回大厅前调用 <code>client.leave()</code>。</p>
      <a class="integration-doc-link" href="https://github.com/ecojust/game-link/tree/master/sdk/js" target="_blank" rel="noreferrer">查看 JS SDK 文档 ↗</a>
    </dialog>
    <dialog ref="nameDialog" class="name-dialog" aria-labelledby="name-dialog-title">
      <form class="name-dialog-form" @submit.prevent="submitName">
        <div class="name-dialog-heading"><div><span class="integration-kicker">JOIN ROOM / PLAYER NAME</span><h2 id="name-dialog-title">先告诉大家你是谁</h2></div><button class="dialog-close" type="button" aria-label="关闭" @click="nameDialog?.close()">×</button></div>
        <p class="name-dialog-copy">进入房间前需要设置一个游戏昵称。</p>
        <label class="name-dialog-label" for="join-player-name">游戏昵称</label>
        <input id="join-player-name" v-model="nameDraft" class="name-dialog-input" name="username" maxlength="32" autocomplete="nickname" placeholder="输入你的昵称" required autofocus />
        <button class="name-dialog-submit" type="submit">继续进入房间 <span aria-hidden="true">↗</span></button>
      </form>
    </dialog>
    <section class="home-hub">
      <div class="hub-intro"><div><div class="kicker"><span></span> GAMELINK / 多人游戏车库</div><h1>现在开局。<em>马上见。</em></h1><p>选一款游戏创建房间，和朋友一起进入游戏。</p></div><label class="driver-name"><small>你的名字</small><input v-model="username" maxlength="32" placeholder="输入游戏昵称" @change="persist" /></label></div>
      <section class="room-board">
        <div class="hub-section-heading"><div><small>LIVE PIT BOARD</small><h2>正在开的房间</h2></div><span class="room-count">{{ rooms.length }} 个房间</span></div>
        <div v-if="loading" class="room-empty">正在读取房间列表…</div>
        <div v-else-if="!rooms.length" class="room-empty">从下面选一款游戏，创建第一间房。</div>
        <div v-else class="live-room-strip">
          <button v-for="room in rooms" :key="room.code" class="live-room-card" :disabled="busy || room.member_count >= room.max_members || !gameFor(room.game_id)" @click="joinRoom(room)">
            <span class="room-card-top"><b>{{ gameFor(room.game_id)?.title || room.game_id }}</b><i>{{ room.member_count >= room.max_members ? '已满' : '进行中' }}</i></span>
            <strong class="live-room-code">{{ room.code }}</strong><span class="room-card-bottom"><code>{{ room.game_id }}</code><span>{{ room.member_count }} / {{ room.max_members }} 人 →</span></span>
          </button>
        </div>
      </section>
      <section class="game-library">
        <div class="hub-section-heading"><div><small>SELECT A GAME</small><h2>选择一款游戏</h2></div><span class="room-count">{{ games.length }} 款可玩</span></div>
        <div class="game-card-grid">
          <article v-for="game in games" :key="game.id" class="game-card" :class="`game-${game.theme}`">
            <div class="game-poster" :class="`poster-${game.theme}`" aria-hidden="true">
              <template v-if="game.theme === 'racer'"><div class="poster-track"><i></i><b></b></div><span class="poster-car car-one">4WD</span><span class="poster-car car-two">4WD</span><small>RAM! CRASH! 4WD BATTLE</small><strong>激斗<br />四驱车</strong></template>
              <template v-else><div class="poster-grid"></div><div class="poster-tank"><i></i><b></b></div><span class="poster-lock">{{ game.tag }}</span><strong>{{ game.title }}</strong></template>
              <span class="poster-index">{{ game.glyph }}</span>
            </div>
            <div class="game-card-copy"><div class="game-card-meta"><span>{{ game.tag }}</span><code>{{ game.id }}</code></div><h3>{{ game.title }}</h3><p>{{ game.description }}</p><div class="game-card-footer"><span>{{ game.players }}</span><button :disabled="busy" @click="createRoom(game)">{{ busy ? '正在进入…' : '创建房间' }} ↗</button></div></div>
          </article>
        </div>
      </section>
      <p v-if="error" class="home-error" role="alert">{{ error }}</p>
    </section>
  </main>
</template>
