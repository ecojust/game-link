<script setup lang="ts">
import {computed,nextTick,onMounted,onBeforeUnmount,ref,shallowRef} from 'vue'
import Hls from 'hls.js'
import channels from './channels.json'
import PixelLounge from './PixelLounge.vue'
import {GameLinkClient} from '../../../../sdk/js/gamelink.js'
import type {GameLinkMember,GameLinkMessage} from '../../../../sdk/js/gamelink.js'
import RoomInviteButton from '../shared/RoomInviteButton.vue'
import UiIcon from '../shared/UiIcon.vue'
type Playback={mode?:'video'|'web';hls?:boolean;live:boolean;url:string;position:number;paused:boolean;rate:number;counter:number;actor:string;at:number}
const client=shallowRef<GameLinkClient>(),video=ref<HTMLVideoElement>(),dialog=ref<HTMLDialogElement>(),members=ref<GameLinkMember[]>([]),self=ref<GameLinkMember>(),room=ref(''),ready=ref(false),error=ref(''),sourceError=ref(''),draft=ref(''),blocked=ref(false),connected=ref<string[]>([])
const webScreen=ref<HTMLElement>(),draftMode=ref<'auto'|'video'|'web'>('auto'),detecting=ref(false)
const draftLive=ref(false),volume=ref(1),localPaused=ref(true)
const state=ref<Playback>({live:false,url:'',position:0,paused:true,rate:1,counter:0,actor:'',at:Date.now()})
const seats=computed(()=>Array.from({length:4},(_,i)=>[...members.value].sort((a,b)=>a.id.localeCompare(b.id))[i]))
const leader=computed(()=>seats.value[0]?.id===self.value?.id)
const sourceLabel=computed(()=>{try{return channels.find(c=>c.url===state.value.url)?.name||new URL(state.value.url).hostname}catch{return '还没有选片'}})
let hls:Hls|undefined,loadedUrl='',loadedMode='',timer=0,suppressUntil=0,disposed=false,seekTarget:number|undefined
function send(kind:string,payload:unknown,target?:string){client.value?.send('tv-'+kind,payload,{reliability:'reliable',...(target?{target}:{})})}
function validUrl(value:string){try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password&&value.length<=4096}catch{return false}}
function validState(s:any):s is Playback{return s&&(s.mode===undefined||s.mode==='video'||s.mode==='web')&&(s.hls===undefined||typeof s.hls==='boolean')&&typeof s.live==='boolean'&&typeof s.url==='string'&&(s.url===''||validUrl(s.url))&&Number.isFinite(s.position)&&s.position>=0&&typeof s.paused==='boolean'&&Number.isFinite(s.rate)&&s.rate>=0.25&&s.rate<=4&&Number.isSafeInteger(s.counter)&&s.counter>=0&&typeof s.actor==='string'&&s.actor.length<100&&Number.isFinite(s.at)}
function newer(s:Playback){return s.counter>state.value.counter||(s.counter===state.value.counter&&s.actor.localeCompare(state.value.actor)>0)}
function position(s=state.value){return s.position+(s.paused?0:Math.max(0,Date.now()-s.at)/1000*s.rate)}
function broadcast(target?:string){send('state',state.value,target)}
function publish(change:Partial<Playback>={}){if(!ready.value)return;const v=video.value;state.value={...state.value,position:v?.currentTime||0,paused:v?.paused??true,rate:v?.playbackRate||1,...change,counter:state.value.counter+1,actor:self.value!.id,at:Date.now()};broadcast()}
async function detectSource(url:string):Promise<{mode:'video'|'web';hls:boolean}>{
 const parsed=new URL(url),paths=[parsed.pathname,...parsed.searchParams.values()]
 if(paths.some(p=>/\.m3u8(?:[?#]|$)/i.test(p)))return {mode:'video',hls:true}
 if(paths.some(p=>/\.(mp4|webm|m4v|mov|ogv|ogg|mp3|m4a)(?:[?#]|$)/i.test(p)))return {mode:'video',hls:false}
 if(/\.html?$/i.test(parsed.pathname))return {mode:'web',hls:false}
 const controller=new AbortController(),timeout=window.setTimeout(()=>controller.abort(),4000)
 try{const response=await fetch(url,{method:'HEAD',signal:controller.signal,credentials:'omit'}),type=response.headers.get('content-type')?.split(';')[0].trim().toLowerCase()||''
 if(/mpegurl/.test(type))return {mode:'video',hls:true}
 if(type.startsWith('video/')||type.startsWith('audio/'))return {mode:'video',hls:false}
 }catch{}finally{clearTimeout(timeout)}
 return {mode:'web',hls:false}
}
async function changeSource(){if(detecting.value)return;const url=draft.value.trim();if(!validUrl(url)){sourceError.value='请输入完整的 HTTP 或 HTTPS 地址。';return}if(location.protocol==='https:'&&url.startsWith('http:')){sourceError.value='请使用 HTTPS 地址，浏览器无法在此页面加载 HTTP 内容。';return}
 const selection=draftMode.value,live=draftLive.value;detecting.value=true;sourceError.value=''
 try{const detected=selection==='auto'?await detectSource(url):{mode:selection,hls:/\.m3u8(?:[?#]|$)/i.test(url)};if(disposed)return
 publish({...detected,url,live:detected.mode==='video'&&(live||channels.some(c=>c.url===url)),position:0,paused:false,rate:1});loadSource();dialog.value?.close();if(detected.mode==='web')void nextTick(()=>{void webScreen.value?.requestFullscreen().catch(()=>{})})
 }finally{detecting.value=false}}
function openSource(){draft.value=state.value.url;draftMode.value='auto';draftLive.value=state.value.live;sourceError.value='';dialog.value?.showModal()}
function mediaError(){if(state.value.url&&state.value.mode!=='web')error.value='无法播放这个地址。请检查地址是否为视频直链、是否允许跨域访问，或点击换片。'}
function loadSource(){const v=video.value;if(!v||(loadedUrl===state.value.url&&loadedMode===`${state.value.mode||'video'}:${!!state.value.hls}`))return;loadedUrl=state.value.url;loadedMode=`${state.value.mode||'video'}:${!!state.value.hls}`;suppressUntil=Date.now()+1200;seekTarget=undefined;hls?.destroy();hls=undefined;error.value='';blocked.value=false;v.pause();v.removeAttribute('src');v.load();if(!loadedUrl||state.value.mode==='web')return
 if((state.value.hls||/\.m3u8(?:[?#]|$)/i.test(loadedUrl))&&!v.canPlayType('application/vnd.apple.mpegurl')&&Hls.isSupported()){hls=new Hls();hls.on(Hls.Events.LEVEL_LOADED,(_,data)=>{if(data.details.live&&!state.value.live){publish({live:true,rate:1,paused:state.value.paused});void applyPlayback()}});hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)mediaError()});hls.loadSource(loadedUrl);hls.attachMedia(v)}else{v.src=loadedUrl;v.load()}}
async function applyPlayback(){const v=video.value;if(state.value.mode==='web'||!v||!state.value.url||v.readyState<1||disposed)return;suppressUntil=Date.now()+800
 if(!Number.isFinite(v.duration)&&v.duration!==0&&!state.value.live)publish({live:true,rate:1,paused:state.value.paused})
 let target=state.value.live?(hls?.liveSyncPosition??(v.seekable.length?v.seekable.end(v.seekable.length-1)-2:v.currentTime)):position();if(v.seekable.length){target=Math.max(v.seekable.start(0),Math.min(target,v.seekable.end(v.seekable.length-1)))}else if(Number.isFinite(v.duration)){target=Math.min(target,v.duration)}
 if((!state.value.live||v.currentTime===0)&&Math.abs(v.currentTime-target)>0.8){seekTarget=target;try{v.currentTime=target}catch{seekTarget=undefined}}
 v.playbackRate=state.value.live?1:state.value.rate
 if(state.value.paused){v.pause();blocked.value=false}else if(v.paused){try{await v.play();blocked.value=false}catch{blocked.value=true}}
}
function mediaAction(kind:'play'|'pause'|'rate'|'seek'|'ended'){const v=video.value;localPaused.value=v?.paused??true;if(state.value.mode==='web'||!v||!ready.value||loadedUrl!==state.value.url||!state.value.url)return
 if(state.value.live&&kind==='rate'){v.playbackRate=1;return}
 if(state.value.live&&kind==='seek'){return}
 if(kind==='seek'&&seekTarget!==undefined&&Math.abs(v.currentTime-seekTarget)<1){seekTarget=undefined;return}
 if(kind!=='seek'&&Date.now()<suppressUntil)return
 seekTarget=undefined
 if((kind==='play'&&!state.value.paused)||(kind==='pause'&&state.value.paused)||(kind==='rate'&&v.playbackRate===state.value.rate))return
 publish();blocked.value=false}
function selectChannel(channel:typeof channels[number]){draftMode.value='auto';draft.value=channel.url;draftLive.value=true;changeSource()}
function togglePlay(){const v=video.value;if(!v)return;publish({paused:!v.paused,position:v.currentTime});void applyPlayback()}
function changeVolume(){if(video.value)video.value.volume=volume.value}
function fullscreen(){void (state.value.mode==='web'?webScreen.value:video.value?.parentElement)?.requestFullscreen().catch(()=>{})}
function selectMovie(){draftMode.value='auto';draft.value='https://www.disneyplus.com/fr-fr/browse/entity-ed94de01-f394-4d37-9888-1186bd143ec8';draftLive.value=false;changeSource()}
async function unlock(){await applyPlayback()}
function message(m:GameLinkMessage){if(!members.value.some(p=>p.id===m.from))return
 if(m.kind==='tv-request'){broadcast(m.from);return}
 if(m.kind==='tv-state'&&validState(m.payload)){const incoming=m.payload as Playback;if(newer(incoming)){state.value={...incoming};loadSource();void applyPlayback()}else if(incoming.counter===state.value.counter&&incoming.actor===state.value.actor)void applyPlayback()}
}
async function leave(){try{await client.value?.leave()}finally{location.assign(client.value?client.value.serverUrl+'/':'/')}}
onMounted(async()=>{try{if(!new URLSearchParams(location.search).has('room')){self.value={id:'preview',name:'你',virtual_ip:'',endpoint:''};members.value=[self.value];ready.value=true;return}
 const session=GameLinkClient.fromLocation();if(session.gameId!=='gamelink-watch-tv')throw Error('这不是小小小剧院房间。');client.value=session
 session.on('members',m=>{members.value=m});session.on('message',message);session.on('peer-ready',p=>{connected.value=[...new Set([...connected.value,p.peerId])];send('request',{},p.peerId);broadcast(p.peerId)});session.on('peer-state',p=>{if(p.state!=='connected')connected.value=connected.value.filter(id=>id!==p.peerId)});session.on('error',e=>error.value=e.message);session.on('room-closed',()=>{ready.value=false;error.value='房间已关闭，请返回大厅。'})
 const joined=await session.joinFromLocation();if(disposed){session.dispose();return}self.value=joined.self_member;members.value=joined.room.members;room.value=joined.room.code;ready.value=true;send('request',{})
 timer=window.setInterval(()=>{if(leader.value)broadcast();if(!state.value.url)send('request',{});},3000)
 }catch(e){error.value=e instanceof Error?e.message:String(e)}})
onBeforeUnmount(()=>{disposed=true;clearInterval(timer);hls?.destroy();client.value?.dispose()})
</script>
<template>
<main class="tv-room">
<header class="tv-header"><a href="/" class="tv-brand"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="9" width="26" height="19" rx="4"/><path d="m10 3 6 6 6-6M12 31h8m-6-16 7 4-7 4z"/></svg><span>小小小剧院<small>朋友的客厅</small></span></a><div class="tv-header-actions"><span class="tv-room-code">{{room||'预览客厅'}} · {{members.length}} / 4</span><RoomInviteButton v-if="room" game-id="gamelink-watch-tv" :room-code="room" :member-count="members.length" :max-members="4"/><button class="gl-action" @click="leave"><UiIcon name="exit"/>退出</button></div></header>
<section class="tv-living-room"><div class="tv-topline"><span><i :class="{on:state.url}"></i>{{state.url?'正在放映':'今晚看点什么'}}</span><button class="gl-action tv-switch" :disabled="!ready" @click="openSource"><UiIcon name="refresh"/>{{state.url?'换片':'选择视频'}}</button></div>
<div class="television"><div class="tv-screen" ref="webScreen"><iframe v-if="state.url&&state.mode==='web'" :src="state.url" title="网页影片播放器" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="no-referrer"/><video v-show="state.mode!=='web'" ref="video" :controls="!!state.url&&!state.live" playsinline preload="metadata" @loadedmetadata="applyPlayback" @canplay="applyPlayback" @play="mediaAction('play')" @pause="mediaAction('pause')" @seeked="mediaAction('seek')" @ratechange="mediaAction('rate')" @ended="mediaAction('ended')" @error="mediaError" @timeupdate="localPaused=video?.paused??true"/><div v-if="!state.url" class="tv-empty"><span class="tv-test-pattern"></span><h1>沙发留好了。<br>就差一部好片。</h1><p>贴一个视频地址，和朋友一起看。</p><button class="gl-action" :disabled="!ready" @click="openSource">选择视频<UiIcon name="refresh"/></button></div><button v-if="blocked" class="tv-unlock gl-action" @click="unlock">点击开启播放与声音</button></div><div class="tv-bezel"><span>TOGETHER / TV</span><span class="tv-power"></span></div></div>
<div v-if="state.url&&state.live&&state.mode!=='web'" class="tv-live-controls"><span class="tv-live-badge">LIVE · 直播</span><button class="gl-action" @click="togglePlay">{{localPaused?'播放':'暂停'}}</button><label>音量<input v-model.number="volume" type="range" min="0" max="1" step="0.05" aria-label="音量" @input="changeVolume"/></label><button class="gl-action" @click="fullscreen">全屏</button><small>直播不可快进</small></div><div v-if="state.url&&state.mode==='web'" class="tv-live-controls"><button class="gl-action" @click="fullscreen">全屏网页</button><a class="gl-action" :href="state.url" target="_blank" rel="noopener noreferrer">在新窗口打开</a><small>网页播放只同步片源；播放进度由平台控制。若平台禁止嵌入，请在新窗口打开。</small></div><div class="tv-caption"><span>{{sourceLabel}}</span><span>{{state.mode==='web'?'网页片源一起同步':state.live?'直播频道与播放状态一起同步':'播放、暂停、进度与倍速一起同步'}}</span></div><p v-if="error" class="tv-error" role="alert">{{error}}</p><p v-if="!ready&&!error" class="tv-note">正在进入客厅…</p>
<PixelLounge v-if="ready" :client="client" :self="self" :members="members" :connected="connected"/>
</section>
<dialog ref="dialog" class="tv-source-dialog"><form @submit.prevent="changeSource"><header><h2>{{state.url?'换一部，一起看':'今晚的片单'}}</h2><button class="gl-action" type="button" aria-label="关闭换片弹窗" @click="dialog?.close()"><UiIcon name="close"/></button></header><div class="tv-channel-list"><small>内置直播频道</small><div><button v-for="channel in channels" :key="channel.id" type="button" class="gl-action" @click="selectChannel(channel)">{{channel.name}}</button></div></div><div class="tv-channel-list"><small>备选电影 · 网页播放</small><div><button type="button" class="gl-action" @click="selectMovie">泰坦尼克号 · Disney+</button></div></div><label for="tv-mode">播放模式</label><select id="tv-mode" v-model="draftMode"><option value="auto">自动识别（推荐）</option><option value="video">视频直链 / HLS</option><option value="web">网页播放（iframe）</option></select><label for="tv-source">视频或网页地址</label><input id="tv-source" v-model="draft" type="url" required maxlength="4096" placeholder="https://…/movie.mp4 或 live.m3u8" autofocus/><label v-if="draftMode!=='web'" class="tv-live-option"><input v-model="draftLive" :disabled="channels.some(c=>c.url===draft.trim())" type="checkbox"/>这是直播（禁用快进与倍速）</label><p>自动识别视频、m3u8 和网页。无扩展名地址会读取内容类型；若服务器不允许识别，按网页打开，也可手动指定模式。网页播放受平台嵌入权限限制。</p><p v-if="sourceError" class="tv-error" role="alert">{{sourceError}}</p><button type="submit" :disabled="detecting" class="gl-action tv-confirm">{{detecting?'正在识别片源…':state.url?'换片并同步给大家':'开始一起看'}}<UiIcon name="check"/></button></form></dialog>
</main>
</template>
