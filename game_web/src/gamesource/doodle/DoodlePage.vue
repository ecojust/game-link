<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { GameLinkClient } from '../../../../sdk/js/gamelink.js'
import type { GameLinkMember, GameLinkMessage, GameLinkRoom } from '../../../../sdk/js/gamelink.js'
import DoodleCanvas from './DoodleCanvas.vue'

const client = shallowRef<GameLinkClient>()
const room = ref<GameLinkRoom>()
const self = ref<GameLinkMember>()
const members = ref<GameLinkMember[]>([])
const error = ref('')
const ready = ref(false)
const home = ref('/')
const network = ref('正在连接')
const peersOnline = ref<Record<string, string>>({})
const canvas = ref<InstanceType<typeof DoodleCanvas>>()
const count = computed(() => members.value.length)
const connectionText = computed(() => {
  const connected = members.value.filter(member => member.id !== self.value?.id && peersOnline.value[member.id] === 'connected').length
  return count.value <= 1 ? '等朋友加入' : `${connected}/${count.value - 1} 位朋友已连接`
})
async function leave() {
  try { await client.value?.leave() } finally { window.location.assign(home.value) }
}
function onMessage(message: GameLinkMessage) {
  if (!members.value.some(member => member.id === message.from)) return
  const data = message.payload as Record<string, unknown>
  if (message.kind === 'doodle-stroke') canvas.value?.addRemote(data)
  else if (message.kind === 'doodle-progress') canvas.value?.addRemote(data, false)
  else if (message.kind === 'doodle-cancel' && typeof data?.id === 'string') canvas.value?.cancelStroke(data.id)
  else if (message.kind === 'doodle-undo' && typeof data?.id === 'string') canvas.value?.removeStroke(data.id)
  else if (message.kind === 'doodle-clear') canvas.value?.clearRemote()
  else if (message.kind === 'doodle-request') canvas.value?.sendSnapshot(message.from)
  else if (message.kind === 'doodle-snapshot' && Array.isArray(data?.strokes)) canvas.value?.addSnapshot(data.strokes)
}
onMounted(async () => {
  if (!new URLSearchParams(location.search).has('room')) {
    self.value = { id: 'preview', name: '访客', virtual_ip: '', endpoint: '' }
    members.value = [self.value]; ready.value = true; network.value = '单人预览'; return
  }
  try {
    const session = GameLinkClient.fromLocation()
    if (session.gameId !== 'gamelink-doodle') throw new Error('此页面只支持多人涂鸦房间。')
    client.value = session; home.value = `${session.serverUrl}/`
    session.on('members', value => {
      members.value = value
      const valid = new Set(value.map(member => member.id))
      peersOnline.value = Object.fromEntries(Object.entries(peersOnline.value).filter(([id]) => valid.has(id)))
    })
    session.on('peer-state', state => { peersOnline.value = { ...peersOnline.value, [state.peerId]: state.state } })
    session.on('peer-state', state => { if (state.state === 'connected') canvas.value?.handshake(state.peerId) })
    session.on('message', onMessage)
    session.on('error', reason => { error.value = reason.message; network.value = '连接异常' })
    session.on('room-closed', () => { ready.value = false; error.value = '房间已关闭，请返回大厅重新加入。' })
    const joined = await session.joinFromLocation()
    room.value = joined.room; self.value = joined.self_member; members.value = joined.room.members; ready.value = true; network.value = '已加入房间'
  } catch (reason) { client.value?.dispose(); error.value = reason instanceof Error ? reason.message : String(reason) }
})
onBeforeUnmount(() => client.value?.dispose())
</script>

<template>
  <main class="doodle-app">
    <header class="doodle-header">
      <a class="doodle-brand" href="/"><span class="brand-mark">✳</span><span><b>一起涂鸦</b><small>DRAW SOMETHING TOGETHER</small></span></a>
      <div class="doodle-room"><span class="live-dot"></span><b>{{ room?.code || (client ? '——' : '预览') }}</b><span>{{ connectionText }}</span></div>
      <div class="doodle-members"><span v-for="(member, index) in members.slice(0, 8)" :key="member.id" :title="member.name" :style="{ '--member-color': ['#f3a48e','#82afdb','#97bd87','#c59bd7','#e7bd68','#6fbdb0','#dc91a7','#91a4d6'][index] }">{{ member.name.slice(0,1) }}</span><small>{{ count }} 人</small></div>
      <button class="doodle-exit" @click="leave">退出房间 ↗</button>
    </header>
    <DoodleCanvas v-if="ready && self" ref="canvas" :client="client" :self="self" :members="members" />
    <section v-else class="doodle-connect"><span class="connect-star">✳</span><b>{{ error || '正在铺开画纸…' }}</b><small>{{ error ? '检查房间链接或网络后重试' : network }}</small><a v-if="error" :href="home">返回游戏大厅</a></section>
    <div v-if="error && ready" class="doodle-toast">{{ error }}<button @click="error = ''">×</button></div>
  </main>
</template>
