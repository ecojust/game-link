<script setup lang="ts">
import UiIcon from "../shared/UiIcon.vue"
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { GameLinkClient } from '../../../../sdk/js/gamelink.js'
import type { GameLinkClient as Client, GameLinkMember, GameLinkMessage, GameLinkRoom } from '../../../../sdk/js/gamelink.js'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { mountExcalidraw, type ExcalidrawMount } from './ExcalidrawHost'
import RoomInviteButton from '../shared/RoomInviteButton.vue'

const palette=['#7466dc','#ed785f','#e7ae4f','#54a184','#5688d4','#a17bd1']
const client=shallowRef<Client>(),room=ref<GameLinkRoom>(),self=ref<GameLinkMember>(),members=ref<GameLinkMember[]>([]),peers=ref<Record<string,string>>({})
const ready=ref(false),error=ref(''),home=ref('/'),host=ref<HTMLElement>(),showHelp=ref(false),drawing=shallowRef<ExcalidrawMount>()
const count=computed(()=>members.value.length),online=computed(()=>members.value.filter(m=>m.id===self.value?.id||peers.value[m.id]==='connected').length)
const restoreDialog=ref<HTMLDialogElement>(),savedDate=ref(''),saveError=ref('')
const STORAGE_KEY='gamelink-whiteboard-draft-v1'
const params=new URLSearchParams(location.search),roomCode=params.get('room')||'preview'
const roomStorageKey=`${STORAGE_KEY}:${roomCode}`
let saveTimer=0,storageActive=false,restoreDecision:((resume:boolean)=>void)|undefined
function readDraft(key:string):ExcalidrawElement[]{
 try{const data=JSON.parse(localStorage.getItem(key)||'null');if(data?.version!==1||!Array.isArray(data.elements))return [];savedDate.value=new Date(data.savedAt).toLocaleString();return data.elements.filter((e:any)=>e&&typeof e.id==='string'&&Number.isFinite(e.version)&&Number.isFinite(e.versionNonce))}catch{return []}
}
function saveDraft(){
 if(!storageActive)return
 try{const data=JSON.stringify({version:1,savedAt:Date.now(),elements:[...localElements.values()]});localStorage.setItem(roomStorageKey,data);localStorage.setItem(STORAGE_KEY,data);saveError.value=''}catch{saveError.value='浏览器本地保存失败，请导出 PNG 备份，或释放浏览器存储空间。'}
}
function scheduleSave(){if(!storageActive)return;window.clearTimeout(saveTimer);saveTimer=window.setTimeout(saveDraft,400)}
function decideRestore(resume:boolean){restoreDialog.value?.close();restoreDecision?.(resume);restoreDecision=undefined}
async function prepareDraft(){
 let elements:ExcalidrawElement[]=[]
 if(params.get('newboard')==='1'){
  const saved=readDraft(STORAGE_KEY)
  if(saved.some(e=>!e.isDeleted)){
   const resume=await new Promise<boolean>(resolve=>{restoreDecision=resolve;restoreDialog.value?.showModal()})
   if(resume)elements=saved
  }
  const url=new URL(location.href);url.searchParams.delete('newboard');history.replaceState(null,'',url)
 }else elements=readDraft(roomStorageKey)
 for(const element of elements)localElements.set(element.id,element)
}
function flushDraft(){window.clearTimeout(saveTimer);saveDraft()}
let incoming=false,disposed=false,appReady=false,changeTimer=0
const localElements=new Map<string,ExcalidrawElement>(),lastSent=new Map<string,string>()
const pendingFragments=new Map<string,{parts:string[];received:number;bytes:number;timer:number}>()
const MAX_PACKET_BYTES=10000
const PROTOCOL=2,peerProtocols=new Map<string,number>(),protocolTimers=new Map<string,number>()

function send(kind:string,payload:unknown,target?:string){client.value?.send(kind,payload,{...(target?{target}:{}),reliability:'reliable'})}
function elementKey(e:ExcalidrawElement){return `${e.version}:${e.versionNonce}:${e.isDeleted?1:0}`}
function newer(a:ExcalidrawElement,b:ExcalidrawElement){return a.version>b.version||a.version===b.version&&a.versionNonce>b.versionNonce}
function mergeElements(incomingElements:unknown){
 if(!Array.isArray(incomingElements))return
 let changed=false
 for(const candidate of incomingElements){
  if(!candidate||typeof candidate.id!=='string'||typeof candidate.version!=='number'||typeof candidate.versionNonce!=='number')continue
  const element=candidate as ExcalidrawElement,existing=localElements.get(element.id)
  if(!existing||newer(element,existing)){localElements.set(element.id,element);lastSent.set(element.id,elementKey(element));changed=true}
 }
 if(changed){scheduleSave();incoming=true;drawing.value?.updateScene([...localElements.values()]);queueMicrotask(()=>{incoming=false})}
}
function splitUtf8(value:string,maxBytes=8000){
 const chunks:string[]=[];let chunk='',size=0
 for(const char of value){const bytes=new TextEncoder().encode(char).length;if(size+bytes>maxBytes&&chunk){chunks.push(chunk);chunk='';size=0}chunk+=char;size+=bytes}
 if(chunk)chunks.push(chunk)
 return chunks
}
function sendElements(kind:string,elements:readonly ExcalidrawElement[],target?:string,snapshotId?:string){
 const batches:ExcalidrawElement[][]=[];let batch:ExcalidrawElement[]=[],bytes=128
 const flush=()=>{if(batch.length){batches.push(batch);batch=[];bytes=128}}
 for(const element of elements){
  const serialized=JSON.stringify(element),size=new TextEncoder().encode(serialized).length
  if(size>MAX_PACKET_BYTES){
   flush();const transferId=crypto.randomUUID(),parts=splitUtf8(serialized)
   parts.forEach((part,index)=>send('whiteboard-fragment',{transferId,index,total:parts.length,data:part},target))
  }else{
   if(bytes+size>MAX_PACKET_BYTES)flush()
   batch.push(element);bytes+=size
  }
 }
 flush()
 batches.forEach((items,index)=>send(kind,{elements:items,...(snapshotId?{snapshotId,index,total:batches.length}:{})},target))
}
function sendSnapshot(to:string){
 if(!appReady)return
 try{sendElements('whiteboard-snapshot',drawing.value?.getElements()||[...localElements.values()],to,crypto.randomUUID())}
 catch(e){error.value=e instanceof Error?e.message:String(e)}
}
function publishChanges(elements:readonly ExcalidrawElement[]){
 if(incoming||disposed)return
 for(const element of elements)localElements.set(element.id,element)
 scheduleSave()
 window.clearTimeout(changeTimer)
 changeTimer=window.setTimeout(()=>{
  const changed=elements.filter(element=>lastSent.get(element.id)!==elementKey(element))
  if(!changed.length)return
  try{sendElements('whiteboard-delta',changed);for(const element of changed)lastSent.set(element.id,elementKey(element))}
  catch(e){error.value=e instanceof Error?e.message:String(e)}
 },120)
}
function handshake(id:string){
 send('whiteboard-hello',{protocol:PROTOCOL},id);send('whiteboard-request',{},id);sendSnapshot(id)
 window.clearTimeout(protocolTimers.get(id));protocolTimers.set(id,window.setTimeout(()=>{if(client.value?.peerStates.get(id)==='connected'&&peerProtocols.get(id)!==PROTOCOL)error.value='有协作者仍在使用旧版白板。请让房间内所有人刷新页面后重新加入。'},5000))
}
function onExcalidrawReady(){appReady=true;if(localElements.size)drawing.value?.updateScene([...localElements.values()]);for(const[id,status]of client.value?.peerStates||[])if(status==='connected')handshake(id)}
const pendingSnapshots=new Map<string,{total:number;received:Set<number>}>()
function onMessage(message:GameLinkMessage){
 if(!members.value.some(member=>member.id===message.from))return
 const data=message.payload as any
 if(message.kind==='whiteboard-hello'){const protocol=Number(data?.protocol);peerProtocols.set(message.from,protocol);send('whiteboard-hello-ack',{protocol:PROTOCOL},message.from);if(protocol!==PROTOCOL)error.value='有协作者仍在使用旧版白板。请让房间内所有人刷新页面后重新加入。'}
 else if(message.kind==='whiteboard-hello-ack'){const protocol=Number(data?.protocol);peerProtocols.set(message.from,protocol);window.clearTimeout(protocolTimers.get(message.from));if(protocol!==PROTOCOL)error.value='有协作者仍在使用旧版白板。请让房间内所有人刷新页面后重新加入。'}
 else if(['whiteboard-object','whiteboard-progress'].includes(message.kind)||(message.kind==='whiteboard-snapshot'&&!data?.snapshotId))error.value='检测到旧版白板连接，请让房间内所有人刷新页面后重新加入。'
 else if(message.kind==='whiteboard-request')sendSnapshot(message.from)
 else if(message.kind==='whiteboard-delta'&&Array.isArray(data?.elements))mergeElements(data.elements)
 else if(message.kind==='whiteboard-fragment'&&typeof data?.transferId==='string'&&typeof data?.data==='string'&&Number.isInteger(data.index)&&Number.isInteger(data.total)&&data.total>0&&data.total<=512&&data.index>=0&&data.index<data.total){
  let state=pendingFragments.get(data.transferId);if(!state){state={parts:new Array(data.total),received:0,bytes:0,timer:window.setTimeout(()=>pendingFragments.delete(data.transferId),30000)};pendingFragments.set(data.transferId,state)}
  if(state.parts.length===data.total&&!state.parts[data.index]){state.parts[data.index]=data.data;state.received++;state.bytes+=new TextEncoder().encode(data.data).length}
  if(state.bytes>2_000_000){window.clearTimeout(state.timer);pendingFragments.delete(data.transferId);return}
  if(state.received===state.parts.length){window.clearTimeout(state.timer);pendingFragments.delete(data.transferId);try{mergeElements([JSON.parse(state.parts.join(''))])}catch{error.value='收到的白板对象无法解析，请重新加入房间同步。'}}
 }
 else if(message.kind==='whiteboard-snapshot'&&typeof data?.snapshotId==='string'&&Array.isArray(data.elements)){
  let state=pendingSnapshots.get(data.snapshotId);if(!state){state={total:data.total,received:new Set()};pendingSnapshots.set(data.snapshotId,state)}
  if(Number.isInteger(data.index)&&data.index>=0&&data.index<state.total){state.received.add(data.index);mergeElements(data.elements)}
  if(state.received.size>=state.total)pendingSnapshots.delete(data.snapshotId)
 }
}
async function download(){try{const blob=await drawing.value?.exportPng();if(!blob)return;const url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download='gamelink-whiteboard.png';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}catch(e){error.value=e instanceof Error?e.message:String(e)}}
function leave(){flushDraft();if(client.value)void client.value.leave().finally(()=>location.assign(home.value));else location.assign(home.value)}

onMounted(async()=>{
 window.addEventListener('pagehide',flushDraft)
 await prepareDraft();if(disposed)return
 if(!new URLSearchParams(location.search).has('room')){self.value={id:'preview',name:'你',virtual_ip:'',endpoint:''};members.value=[self.value];storageActive=true;ready.value=true;drawing.value=mountExcalidraw(host.value!,[...localElements.values()],publishChanges,onExcalidrawReady);return}
 try{
  const session=GameLinkClient.fromLocation();if(session.gameId!=='gamelink-whiteboard')throw Error('此页面只支持一起白板房间。')
  client.value=session;home.value=`${session.serverUrl}/`;session.on('members',value=>members.value=value)
  session.on('peer-state',value=>{peers.value={...peers.value,[value.peerId]:value.state};if(value.state==='connected')handshake(value.peerId)})
  session.on('message',onMessage);session.on('error',value=>error.value=value.message)
  session.on('room-closed',()=>{ready.value=false;error.value='房间已关闭，请回到大厅。'})
  const joined=await session.joinFromLocation();room.value=joined.room;self.value=joined.self_member;members.value=joined.room.members;storageActive=true;ready.value=true
  drawing.value=mountExcalidraw(host.value!,[...localElements.values()],publishChanges,onExcalidrawReady)
  for(const [id,status] of session.peerStates)if(status==='connected')handshake(id)
 }catch(e){error.value=e instanceof Error?e.message:String(e);client.value?.dispose()}
})
onBeforeUnmount(()=>{flushDraft();window.removeEventListener('pagehide',flushDraft);restoreDecision?.(false);disposed=true;window.clearTimeout(changeTimer);for(const state of pendingFragments.values())window.clearTimeout(state.timer);for(const timer of protocolTimers.values())window.clearTimeout(timer);pendingFragments.clear();protocolTimers.clear();drawing.value?.unmount();client.value?.dispose()})
</script>

<template>
 <main class="wb-app" @contextmenu.prevent @selectstart.prevent @dragstart.prevent>
  <header class="wb-top"><a class="wb-brand" href="/"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m7 16 1-4 6-6 3 3-6 6-4 1zm5-8 3 3M7 19h10"/></svg></span><b>一起白板</b></a><div class="wb-room"><i :class="{online:online>=count}"></i>{{room?.code||'自由画布'}}<small>{{online}} / {{count}} 在线</small></div><div class="wb-avatars"><span v-for="(member,index) in members.slice(0,6)" :key="member.id" :title="member.name" :style="{'--avatar':palette[index%palette.length]}">{{member.name.slice(0,1)}}</span><small>{{count}} 位协作者</small></div><RoomInviteButton v-if="room" variant="whiteboard" game-id="gamelink-whiteboard" :room-code="room.code" :member-count="count" :max-members="4"/><button class="gl-action wb-quiet" @click="showHelp=!showHelp"><UiIcon name="help" />使用说明</button><button class="gl-action wb-quiet" @click="download"><UiIcon name="download" />导出 PNG</button><button class="gl-action wb-quiet" @click="leave"><UiIcon name="exit" />退出</button></header>
  <section class="wb-canvas"><div ref="host" class="wb-excalidraw"/><div v-if="!ready" class="wb-loading">正在连接白板…</div></section>
  <aside v-if="saveError" class="wb-error" role="alert">{{saveError}}</aside>
  <aside v-if="error" class="wb-error">{{error}} <a :href="home">返回大厅</a></aside>
  <div v-if="showHelp" class="wb-help" @click.self="showHelp=false"><article><button class="gl-action wb-close" aria-label="关闭说明" @click="showHelp=false"><UiIcon name="close" /></button><small>GAMELINK · WHITEBOARD</small><h2>用 Excalidraw，<em>一起画。</em></h2><p>画布使用 Excalidraw 开源白板的完整交互：自由绘制、箭头、形状、便签、文字、选择移动、缩放与撤销重做。</p><p>加入同一 GameLink 房间后，白板对象会在协作者之间实时同步。每个人都可以同时编辑。画板会自动保存在当前浏览器，重新进入同一房间可恢复；创建新房间时可以选择继续之前的工作。</p><button class="gl-action wb-start" @click="showHelp=false"><UiIcon name="play" />开始共创</button></article></div>
  <dialog ref="restoreDialog" class="wb-restore" @cancel.prevent="decideRestore(false)"><form @submit.prevent="decideRestore(true)"><small>一起白板 · 本地画板</small><h2>继续之前的工作？</h2><p>发现此浏览器中保存的画板。你可以带入新房间，和大家继续编辑。</p><p class="wb-saved-date">上次保存：{{savedDate}}</p><div><button type="button" class="gl-action" @click="decideRestore(false)">新建空白画板</button><button type="submit" class="gl-action wb-start" autofocus>继续之前的工作</button></div></form></dialog>
 </main>
</template>
