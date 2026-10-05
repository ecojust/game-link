<script setup lang="ts">
import {computed,onMounted,onBeforeUnmount,ref,shallowRef} from 'vue'
import {GameLinkClient} from '../../../../sdk/js/gamelink.js'
import type {GameLinkMember,GameLinkMessage} from '../../../../sdk/js/gamelink.js'
import RoomInviteButton from '../shared/RoomInviteButton.vue'
import UiIcon from '../shared/UiIcon.vue'
import InkPad from './InkPad.vue'
import type {Stroke} from './InkPad.vue'
import {QUESTIONS,GAME_LENGTH,drawQuestions} from './questions'
type Round={id:string;number:number;question:number;deck:number[];players:GameLinkMember[];phase:'writing'|'revealing'|'results';nextAt:number}
type Answer={strokes:Stroke[];nonce:string}
const client=shallowRef<GameLinkClient>(),members=ref<GameLinkMember[]>([]),self=ref<GameLinkMember>(),code=ref(''),ready=ref(false),error=ref(''),notice=ref(''),home=ref('/')
const round=ref<Round>(),commits=ref<Record<string,string>>({}),answers=ref<Record<string,Stroke[]>>({}),ink=ref<Stroke[]>([]),locked=ref(false),submitting=ref(false),clock=ref(Date.now()),pad=ref<InstanceType<typeof InkPad>>()
const leader=computed(()=>[...members.value].sort((a,b)=>a.id.localeCompare(b.id))[0]?.id),isLeader=computed(()=>leader.value===self.value?.id)
const players=computed(()=>round.value?.players.filter(p=>members.value.some(m=>m.id===p.id))||[])
const participating=computed(()=>players.value.some(p=>p.id===self.value?.id))
const question=computed(()=>QUESTIONS[round.value?.question??0]!),submitted=computed(()=>players.value.filter(p=>commits.value[p.id]).length)
const questionNumber=computed(()=>((round.value?.number||1)-1)%GAME_LENGTH+1)
const finished=computed(()=>round.value?.phase==='results'&&questionNumber.value===GAME_LENGTH)
const seconds=computed(()=>Math.max(0,Math.ceil(((round.value?.nextAt||0)-clock.value)/1000)))
let own:Answer|undefined,timer=0,ticks=0,joinedAt=0,disposed=false
const fragments=new Map<string,{parts:string[];at:number}>()
function send(kind:string,payload:unknown,target?:string){client.value?.send('poem-'+kind,payload,{...(target?{target}:{}),reliability:'reliable'})}
async function digest(answer:Answer){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(answer)));return [...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('')}
function broadcast(target?:string){if(round.value)send('state',{round:round.value,commits:commits.value},target)}
function newRound(restart=false){
 if(!isLeader.value||!members.value.length||(!restart&&finished.value))return
 const number=(round.value?.number||0)+1,deck=!round.value||restart?drawQuestions():round.value.deck
 const index=(number-1)%GAME_LENGTH
 applyRound({id:crypto.randomUUID(),number,question:deck[index]!,deck,players:[...members.value],phase:'writing',nextAt:0},{});broadcast()
}
function replay(){if(!finished.value)return;if(isLeader.value)newRound(true);else send('replay',{id:round.value!.id})}

function applyRound(next:Round,nextCommits:Record<string,string>){
 if(round.value&&next.number<round.value.number)return
 if(round.value&&next.number===round.value.number&&next.id!==round.value.id)return
 if(next.id!==round.value?.id){ink.value=[];locked.value=false;own=undefined;answers.value={};commits.value={};fragments.clear()}
 else{const order={writing:0,revealing:1,results:2};if(order[next.phase]<order[round.value!.phase])return}
 round.value=next;commits.value={...commits.value,...nextCommits}
 if(next.phase!=='writing'){locked.value=true;void revealOwn()}
}
function sample(strokes:Stroke[]):Stroke[]{const total=strokes.reduce((n,s)=>n+s.length,0),stride=Math.max(1,Math.ceil(total/1200));return strokes.map(s=>s.filter((_,i)=>i===0||i===s.length-1||i%stride===0).map(([x,y])=>[+x.toFixed(3),+y.toFixed(3)] as [number,number]))}
async function submit(){if(locked.value||submitting.value||!participating.value||round.value?.phase!=='writing'||!ink.value.length)return;submitting.value=true;const id=round.value.id;try{const answer={strokes:sample(ink.value),nonce:crypto.randomUUID()},hash=await digest(answer);if(round.value?.id!==id||disposed)return;own=answer;locked.value=true;commits.value={...commits.value,[self.value!.id]:hash};send('commit',{id,hash});advance()}catch{notice.value='提交失败，请重试。'}finally{submitting.value=false}}
async function revealOwn(target?:string){if(!own||!round.value||round.value.phase==='writing')return;answers.value={...answers.value,[self.value!.id]:own.strokes};const data=JSON.stringify(own),parts=Math.ceil(data.length/6000);for(let index=0;index<parts;index++)send('answer',{id:round.value.id,index,total:parts,data:data.slice(index*6000,(index+1)*6000)},target);advance()}
function advance(){if(!isLeader.value||!round.value||!players.value.length)return
 if(round.value.phase==='writing'&&players.value.every(p=>commits.value[p.id])){round.value={...round.value,phase:'revealing'};broadcast();void revealOwn()}
 else if(round.value.phase==='revealing'&&players.value.every(p=>answers.value[p.id])){round.value={...round.value,phase:'results',nextAt:questionNumber.value===GAME_LENGTH?0:Date.now()+5000};broadcast()}
}
function validRound(r:any):r is Round{return r&&typeof r.id==='string'&&r.id.length<100&&Number.isInteger(r.number)&&r.number>0&&Number.isInteger(r.question)&&r.question>=0&&r.question<QUESTIONS.length&&Array.isArray(r.deck)&&r.deck.length===GAME_LENGTH&&new Set(r.deck).size===GAME_LENGTH&&r.deck.every((n:any)=>Number.isInteger(n)&&n>=0&&n<QUESTIONS.length)&&r.question===r.deck[(r.number-1)%GAME_LENGTH]&&['writing','revealing','results'].includes(r.phase)&&Number.isFinite(r.nextAt)&&Array.isArray(r.players)&&r.players.length>0&&r.players.length<=4&&r.players.every((p:any)=>typeof p.id==='string'&&typeof p.name==='string')&&new Set(r.players.map((p:any)=>p.id)).size===r.players.length}
function validAnswer(a:any):a is Answer{return a&&typeof a.nonce==='string'&&a.nonce.length<100&&Array.isArray(a.strokes)&&a.strokes.length>0&&a.strokes.length<=80&&a.strokes.reduce((n:number,s:any)=>n+(Array.isArray(s)?s.length:10000),0)<=1600&&a.strokes.every((s:any)=>Array.isArray(s)&&s.length>0&&s.every((p:any)=>Array.isArray(p)&&p.length===2&&p.every((v:any)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1)))}
async function onMessage(m:GameLinkMessage){if(disposed)return;if(!members.value.some(p=>p.id===m.from))return;const d=m.payload as any
 if(m.kind==='poem-request'){broadcast(m.from);if(locked.value&&round.value?.phase==='writing'&&own)send('commit',{id:round.value.id,hash:commits.value[self.value!.id]},m.from);else if(round.value?.phase!=='writing')void revealOwn(m.from);return}
 if(m.kind==='poem-state'&&(m.from===leader.value||!round.value)&&validRound(d?.round)){const hashes:Record<string,string>={};for(const [id,hash]of Object.entries(d.commits||{}))if(typeof hash==='string'&&/^[a-f0-9]{64}$/.test(hash))hashes[id]=hash;applyRound(d.round,hashes);return}
 if(!round.value||d?.id!==round.value.id||!players.value.some(p=>p.id===m.from))return
 if(m.kind==='poem-replay'&&isLeader.value&&finished.value){newRound(true);return}
 if(m.kind==='poem-commit'&&round.value.phase==='writing'&&typeof d.hash==='string'&&/^[a-f0-9]{64}$/.test(d.hash)&&!commits.value[m.from]){commits.value={...commits.value,[m.from]:d.hash};if(isLeader.value)broadcast();advance()}
 if(m.kind==='poem-answer'&&round.value.phase!=='writing'&&typeof d.data==='string'&&d.data.length<=6000&&Number.isInteger(d.total)&&d.total>0&&d.total<=12&&Number.isInteger(d.index)&&d.index>=0&&d.index<d.total){
  let transfer=fragments.get(m.from);if(!transfer||transfer.parts.length!==d.total){transfer={parts:new Array(d.total).fill(''),at:Date.now()};fragments.set(m.from,transfer)}transfer.parts[d.index]=d.data
  if(transfer.parts.every(Boolean)){const id=round.value.id;try{const a=JSON.parse(transfer.parts.join(''));if(validAnswer(a)&&await digest(a)===commits.value[m.from]&&round.value?.id===id){answers.value={...answers.value,[m.from]:a.strokes};advance()}}catch{/* Ignore malformed answer. */}fragments.delete(m.from)}
 }
}
function tick(){if(!ready.value)return;clock.value=Date.now();for(const[id,f]of fragments)if(Date.now()-f.at>30000)fragments.delete(id)
 if(isLeader.value){if(!round.value&&Date.now()-joinedAt>2500)newRound();advance();if(round.value?.phase==='results'&&!finished.value&&seconds.value===0)newRound()}
 if(++ticks%2===0){if(isLeader.value)broadcast();else send('request',{});if(own&&round.value){if(round.value.phase==='writing')send('commit',{id:round.value.id,hash:commits.value[self.value!.id]});else void revealOwn()}}
}
async function leave(){try{await client.value?.leave()}finally{location.assign(home.value)}}
onMounted(async()=>{try{
 if(!location.search.includes('room=')){self.value={id:'practice',name:'你',virtual_ip:'',endpoint:''};members.value=[self.value];ready.value=true;newRound()}
 else{const session=GameLinkClient.fromLocation();if(session.gameId!=='gamelink-poetry')throw Error('这不是诗词大会房间。');client.value=session;home.value=session.serverUrl+'/';session.on('members',m=>{members.value=m;advance()});session.on('message',m=>void onMessage(m));session.on('peer-ready',p=>{send('request',{},p.peerId);if(isLeader.value)broadcast(p.peerId);if(round.value?.phase!=='writing')void revealOwn(p.peerId)});session.on('error',e=>error.value=e.message);session.on('room-closed',()=>{ready.value=false;error.value='房间已关闭，请返回大厅。'});const joined=await session.joinFromLocation();if(disposed){session.dispose();return}self.value=joined.self_member;members.value=joined.room.members;code.value=joined.room.code;ready.value=true;joinedAt=Date.now();send('request',{})}
 timer=window.setInterval(tick,500)
 }catch(e){error.value=e instanceof Error?e.message:String(e)}})
onBeforeUnmount(()=>{disposed=true;clearInterval(timer);client.value?.dispose()})
</script>
<template>
<main class="poem-app">
<header class="poem-header"><a href="/" class="poem-brand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 3h14v18H5zM9 7h6M9 11h6m-6 4h4"/></svg><b>诗词大会</b></a><span class="poem-room">{{code||'单人练习'}} · {{members.length}} 人</span><RoomInviteButton v-if="code" game-id="gamelink-poetry" :room-code="code" :member-count="members.length" :max-members="4"/><button class="gl-action" @click="leave"><UiIcon name="exit"/>退出</button></header>
<div v-if="error" class="poem-error" role="alert">{{error}}</div>
<section v-if="ready&&round" class="poem-content">
<div class="poem-question"><small>第 {{questionNumber}} / {{GAME_LENGTH}} 题 · {{round.phase==='results'?'答案揭晓':'诗句补全'}}</small><h1>{{question.line}}</h1><p>{{question.author}} ·《{{question.title}}》</p></div>
<div class="poem-progress"><span>{{round.phase==='writing'?`${submitted} / ${players.length} 人已交卷`:round.phase==='revealing'?'所有人已交卷，正在打开答案…':finished?'本场 15 题已完成':`${seconds} 秒后进入下一题`}}</span><span>{{round.phase==='writing'?'手写缺失的字词':'共同赏读，下一题见'}}</span></div>
<template v-if="round.phase==='writing'"><section v-if="participating" class="poem-writing"><div class="poem-pad"><InkPad ref="pad" :key="round.id" :locked="locked||submitting" @change="ink=$event"/><div v-if="locked" class="poem-sealed"><UiIcon name="check"/>已交卷，笔迹已封存</div><span v-if="!ink.length&&!locked" class="poem-pad-hint">在这里手写答案</span></div><div class="poem-actions"><button class="gl-action" :disabled="locked||submitting" @click="pad?.undo()"><UiIcon name="undo"/>撤销</button><button class="gl-action" :disabled="locked||submitting" @click="pad?.clear()"><UiIcon name="trash"/>重写</button><button class="gl-action poem-submit" :disabled="locked||submitting||!ink.length" @click="submit">{{locked?'已提交':submitting?'正在封存…':'提交答案'}}<UiIcon name="check"/></button></div><p class="poem-note">提交后不可修改。所有人交卷后，才会公开笔迹与标准答案。</p></section><p v-else class="poem-note">本题已开始，你将在下一题加入答题。</p></template>
<template v-else-if="round.phase==='results'"><div class="poem-correct"><small>标准答案</small><strong>{{question.answer}}</strong><p>{{question.line.replace(/□+/,question.answer)}}</p></div><section class="poem-answers"><article v-for="p in players" :key="p.id"><header>{{p.name}}<small>{{p.id===self?.id?'你的答案':'手写答案'}}</small></header><InkPad v-if="answers[p.id]" :strokes="answers[p.id]" readonly/><p v-else>正在同步笔迹…</p></article></section></template>
<div v-else class="poem-opening">正在揭晓 {{Object.keys(answers).length}} / {{players.length}} 份答案</div>
<div v-if="finished" class="poem-finished"><h2>十五题，一卷收笔。</h2><p>本场答题完成，再随机抽取 15 道题继续挑战。</p><button class="gl-action poem-submit" @click="replay"><UiIcon name="refresh"/>再来一场</button></div>
<div class="poem-members"><span v-for="p in players" :key="p.id"><i :class="{done:commits[p.id]}"></i>{{p.name}}<small>{{commits[p.id]?'已交卷':'正在作答'}}</small></span></div><p v-if="notice" role="alert">{{notice}}</p>
</section><div v-else class="poem-opening">{{error||'正在准备诗卷…'}}</div>
</main>
</template>
