<script setup lang="ts">
import DoodleLogo from './DoodleLogo.vue'
import UiIcon from "../shared/UiIcon.vue"
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { GameLinkClient } from '../../../../sdk/js/gamelink.js'
import type { GameLinkMember, GameLinkMessage, GameLinkRoom } from '../../../../sdk/js/gamelink.js'
import DoodleCanvas from './DoodleCanvas.vue'
import RoomInviteButton from '../shared/RoomInviteButton.vue'

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
type TopicState = { round:number; topic:string; seed:string; topicIndex:number; leaderId:string; endsAt:number }
const TOPICS = ['会飞的房子','深海邮局','一只迷路的月亮','机器人野餐','云朵动物园','会说话的植物','外星人的早餐','雨天的游乐园','穿靴子的章鱼','未来城市的公园','巨型甜甜圈','森林里的小火车','海盗猫的宝藏','会跳舞的冰箱','太空中的水族馆','蘑菇旅馆','隐形人的宠物','会发光的鲸鱼','龙的生日派对','倒着长的树','糖果做的城堡','小熊的发明','海底火山餐厅','一只戴眼镜的青蛙','时间旅行书店','火星上的菜市场','会唱歌的雨伞','雪人的夏日假期','口袋里的小宇宙','魔法师的工作桌','长颈鹿开飞机','夜晚的灯塔','住在茶杯里的精灵','会生气的山','水母城市','云上的篮球场','章鱼理发店','月球温室','古怪的超级英雄','最奇妙的交通工具']
const topic = ref<TopicState>({round:0,topic:'',seed:'',topicIndex:-1,leaderId:'',endsAt:0})
const clock = ref(Date.now())
const coordinatorId = computed(() => [...members.value].sort((a,b) => a.id.localeCompare(b.id))[0]?.id || '')
const isCoordinator = computed(() => !!self.value && coordinatorId.value === self.value.id)
const secondsLeft = computed(() => Math.max(0, Math.ceil((topic.value.endsAt-clock.value)/1000)))
const timerLabel = computed(() => topic.value.round ? `${Math.floor(secondsLeft.value/60)}:${String(secondsLeft.value%60).padStart(2,'0')}` : '--:--')
const count = computed(() => members.value.length)
const topicPrompt = computed(() => topic.value.topic || (count.value > 1 ? '正在同步房间主题…' : '正在抽取主题…'))
const connectionText = computed(() => {
  const connected = members.value.filter(member => member.id !== self.value?.id && peersOnline.value[member.id] === 'connected').length
  return count.value <= 1 ? '等朋友加入' : `${connected}/${count.value - 1} 位朋友已连接`
})
async function leave() {
  try { await client.value?.leave() } finally { window.location.assign(home.value) }
}
function chooseTopic(seed:string,round:number,previous:number) {
  let hash = 2166136261
  for (const char of `${seed}:${round}`) hash = Math.imul(hash ^ char.charCodeAt(0),16777619)
  let index = (hash >>> 0) % TOPICS.length
  if (index === previous) index = (index + 1) % TOPICS.length
  return index
}
function publishNextTopic() {
  if (!isCoordinator.value) return
  const seed = topic.value.seed || crypto.getRandomValues(new Uint32Array(2)).join('-')
  const round = topic.value.round + 1
  const topicIndex = chooseTopic(seed,round,topic.value.topicIndex)
  const next:TopicState={round,topic:TOPICS[topicIndex]!,seed,topicIndex,leaderId:self.value?.id||'preview',endsAt:Date.now()+90_000}
  applyTopic(next)
  client.value?.send('doodle-topic-state',next,{reliability:'reliable'})
}
function applyTopic(next:TopicState) {
  if(next.round<topic.value.round)return
  if(next.round===topic.value.round){
    if(topic.value.round===0){topic.value=next;return}
    if(next.leaderId!==coordinatorId.value)return
    topic.value=next
    return
  }
  const hadPreviousRound = topic.value.round > 0
  topic.value = next
  if(hadPreviousRound)canvas.value?.clearForTopic()
  if (hadPreviousRound) window.setTimeout(() => client.value?.send('doodle-request',{}, {reliability:'reliable'}),250)
}
function requestNextTopic() {
  if (isCoordinator.value) publishNextTopic()
  else client.value?.send('doodle-topic-skip',{}, {reliability:'reliable'})
}
function syncTopic(peerId?:string){
 if(isCoordinator.value&&topic.value.round){
  const state={...topic.value,leaderId:self.value!.id};topic.value=state
  client.value?.send('doodle-topic-state',state,{...(peerId?{target:peerId}:{}),reliability:'reliable'})
 }else client.value?.send('doodle-topic-request',{}, {...(peerId?{target:peerId}:{}),reliability:'reliable'})
}
function updateTopicClock(){
 clock.value=Date.now()
 if(isCoordinator.value){if((!topic.value.round&&Date.now()-joinedAt>2500)||(topic.value.round>0&&secondsLeft.value===0))publishNextTopic();else if(topic.value.leaderId!==self.value?.id)syncTopic()}
 if(++syncTicks%3===0)syncTopic()
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
  else if (message.kind === 'doodle-topic-request' && isCoordinator.value && topic.value.round) client.value?.send('doodle-topic-state',topic.value,{target:message.from,reliability:'reliable'})
  else if (message.kind === 'doodle-topic-state' && (message.from===coordinatorId.value||topic.value.round===0) && data?.leaderId===message.from && typeof data?.topic === 'string' && Number.isInteger(data?.round) && typeof data?.seed === 'string' && typeof data?.leaderId==='string' && Number.isFinite(data?.endsAt)) applyTopic(data as TopicState)
  else if (message.kind === 'doodle-topic-skip' && isCoordinator.value) publishNextTopic()
}
let topicTimer=0,syncTicks=0,joinedAt=Date.now()
onMounted(async () => {
  if (!new URLSearchParams(location.search).has('room')) {
    self.value = { id: 'preview', name: '访客', virtual_ip: '', endpoint: '' }
    members.value = [self.value]; ready.value = true; network.value = '单人预览'; publishNextTopic(); topicTimer=window.setInterval(updateTopicClock,1000); return
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
    session.on('peer-ready', state => { canvas.value?.handshake(state.peerId); syncTopic(state.peerId) })
    session.on('message', onMessage)
    session.on('error', reason => { error.value = reason.message; network.value = '连接异常' })
    session.on('room-closed', () => { ready.value = false; error.value = '房间已关闭，请返回大厅重新加入。' })
    const joined = await session.joinFromLocation()
    room.value = joined.room; self.value = joined.self_member; members.value = joined.room.members; ready.value = true; network.value = '已加入房间'
    joinedAt=Date.now()
    for(const[id,status]of session.peerStates)if(status==='connected'){canvas.value?.handshake(id);syncTopic(id)}
    topicTimer=window.setInterval(updateTopicClock,1000)
  } catch (reason) { client.value?.dispose(); error.value = reason instanceof Error ? reason.message : String(reason) }
})
onBeforeUnmount(() => {window.clearInterval(topicTimer);client.value?.dispose()})
</script>

<template>
  <main class="doodle-app">
    <header class="doodle-header">
      <a class="doodle-brand" href="/"><span class="brand-mark"><DoodleLogo /></span><span><b>一起涂鸦</b><small>DRAW SOMETHING TOGETHER</small></span></a>
      <div class="doodle-room"><span class="live-dot"></span><b>{{ room?.code || (client ? '——' : '预览') }}</b><span>{{ connectionText }}</span></div>
      <div class="doodle-topic" :class="{'topic-waiting':!topic.topic}"><small>共同主题 · 第 {{ topic.round || 1 }} 题</small><b>{{ topicPrompt }}</b><span>{{ timerLabel }}</span></div>
      <div class="doodle-members"><span v-for="(member, index) in members.slice(0, 8)" :key="member.id" :title="member.name" :style="{ '--member-color': ['#f3a48e','#82afdb','#97bd87','#c59bd7','#e7bd68','#6fbdb0','#dc91a7','#91a4d6'][index] }">{{ member.name.slice(0,1) }}</span><small>{{ count }} 人</small></div>
      <RoomInviteButton v-if="room" variant="doodle" game-id="gamelink-doodle" :room-code="room.code" :member-count="count" :max-members="4" />
      <button class="gl-action doodle-next-topic" :title="isCoordinator ? '随机抽取下一题' : '请求房间抽取下一题'" @click="requestNextTopic"><UiIcon name="refresh" />换个主题</button>
      <button class="gl-action doodle-exit" @click="leave"><UiIcon name="exit" />退出房间</button>
    </header>
    <DoodleCanvas v-if="ready && self" ref="canvas" :client="client" :self="self" :members="members" :topic-round="topic.round" />
    <section v-else class="doodle-connect"><span class="connect-star"><DoodleLogo /></span><b>{{ error || '正在铺开画纸…' }}</b><small>{{ error ? '检查房间链接或网络后重试' : network }}</small><a v-if="error" :href="home">返回游戏大厅</a></section>
    <div v-if="error && ready" class="doodle-toast">{{ error }}<button class="gl-action" @click="error = ''"><UiIcon name="close" /></button></div>
  </main>
</template>
