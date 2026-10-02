<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef, reactive, computed } from 'vue'
import { GameLinkClient } from '../../../../sdk/js/gamelink.js'
import type { GameLinkRoom, GameLinkMember } from '../../../../sdk/js/gamelink.js'
import FourWheelGame from './FourWheelGame.vue'
const client = shallowRef<GameLinkClient>()
const room = ref<GameLinkRoom>()
const self = ref<GameLinkMember>()
const members = ref<GameLinkMember[]>([])
const states = reactive<Record<string,string>>({})
const local = reactive<Record<string,string>>({}), remote = reactive<Record<string,string>>({})
const error = ref(''), ready = ref(false)
const home = ref('https://games.b14f.com/')
const localIce = computed(() => [...new Set(Object.values(local))].join(' / '))
const remoteIce = computed(() => [...new Set(Object.values(remote))].join(' / '))
const label = computed(() => {
  const peers = members.value.filter(m => m.id !== self.value?.id)
  if (!peers.length) return '等待队友'
  const direct = peers.filter(m => states[m.id] === 'connected').length
  if (peers.some(m => states[m.id] === 'reconnecting')) return 'P2P 重连中'
  return direct === peers.length ? 'P2P 直连' : 'P2P 连接中'
})
async function leave() {
  ready.value = false
  try { await client.value?.leave() } finally { window.location.assign(home.value) }
}
onMounted(async () => {
  try {
    const session = GameLinkClient.fromLocation()
    if (session.gameId !== 'fc-mini-4wd') throw new Error('此页面只支持激斗四驱车。')
    client.value = session; home.value = session.serverUrl + '/'
    session.on('room', value => { room.value = value })
    session.on('members', value => { members.value = value })
    session.on('peer-state', value => {
      states[value.peerId] = value.state
      if (value.state === 'connected') { local[value.peerId] = value.localIce; remote[value.peerId] = value.remoteIce }
      else { delete local[value.peerId]; delete remote[value.peerId] }
    })
    session.on('peer-ready', () => { error.value = '' })
    session.on('error', reason => { error.value = reason.message })
    session.on('room-closed', () => { ready.value = false; error.value = '房间已关闭，请返回大厅重新加入。' })
    const result = await session.joinFromLocation()
    room.value = result.room; self.value = result.self_member; members.value = result.room.members; ready.value = true
  } catch (reason) { client.value?.dispose(); error.value = reason instanceof Error ? reason.message : String(reason) }
})
onBeforeUnmount(() => client.value?.dispose())
</script>
<template>
  <main class="game-shell fc-playing">
    <FourWheelGame v-if="ready && client && room && self" :client="client" :room="room" :self="self" :members="members" :peer-states="states" :local-ice="localIce" :remote-ice="remoteIce" :connection-label="label" @leave="leave" />
    <div v-else class="launch-status"><p>{{ error || '正在加入四驱车房间…' }}</p><a :href="home">返回平台大厅</a></div>
    <div v-if="ready && error" class="toast">{{ error }}<button @click="error = ''">×</button></div>
  </main>
</template>
