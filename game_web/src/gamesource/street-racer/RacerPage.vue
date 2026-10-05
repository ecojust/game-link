<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { GameLinkClient } from '../../../../sdk/js/gamelink.js'
import type { GameLinkMember, GameLinkRoom } from '../../../../sdk/js/gamelink.js'
import RoomInviteButton from '../shared/RoomInviteButton.vue'
import UiIcon from '../shared/UiIcon.vue'
import { RaceRenderer } from './renderer'
import { TiltSteering } from './motion'
import { spawnCar, stepCar, wireCar, validWire, clamp } from './simulation'
import type { WireCar } from './simulation'

type Phase='garage'|'countdown'|'racing'|'paused'|'finished'
const canvas=ref<HTMLCanvasElement>(),minimap=ref<HTMLCanvasElement>()
const client=shallowRef<GameLinkClient>(),room=ref<GameLinkRoom>(),self=ref<GameLinkMember>(),members=ref<GameLinkMember[]>([])
const phase=ref<Phase>('garage'),loading=ref(true),error=ref(''),sensorError=ref(''),starting=ref(false)
const requestedControls=new URLSearchParams(location.search).get('controls')
const mobile=ref(matchMedia('(pointer:coarse)').matches||requestedControls==='touch'||requestedControls==='gyro'),portrait=ref(innerHeight>innerWidth)
const motionMode=ref<'gyro'|'touch'>(requestedControls==='touch'?'touch':'gyro'),sound=ref(true),accel=ref(false)
const viewMode=ref<'chase'|'cockpit'>('chase'),joystick=ref<HTMLDivElement>(),stick=ref({x:0,y:0})
function toggleView(){viewMode.value=viewMode.value==='chase'?'cockpit':'chase';renderer?.setView(viewMode.value)}
const sensor=new TiltSteering(),car=spawnCar(),hud=ref({...car}),countdown=ref(3),home=ref('/')
const remoteStates=ref<Record<string,WireCar>>({}),peerStates=ref<Record<string,string>>({})
const connected=computed(()=>members.value.filter(m=>m.id===self.value?.id||peerStates.value[m.id]==='connected').length)
const standings=computed(()=>members.value.map(m=>({id:m.id,distance:m.id===self.value?.id?hud.value.distance:remoteStates.value[m.id]?.distance||0,finished:m.id===self.value?.id?hud.value.finished:remoteStates.value[m.id]?.finished||false})).sort((a,b)=>b.distance-a.distance))
const position=computed(()=>Math.max(1,standings.value.findIndex(s=>s.id===self.value?.id)+1))
const formatTime=(value:number)=>`${Math.floor(value/60)}:${(value%60).toFixed(2).padStart(5,'0')}`
let renderer:RaceRenderer|undefined,frame=0,lastTime=0,netTime=0,hudTime=0,remaining=0,accumulator=0,disposed=false,touchSteer=0,steerPointer:number|null=null,accelPointer:number|null=null,lastTap=0
const pressed=new Set<string>()
let audio:AudioContext|undefined,engine:OscillatorNode|undefined,engineGain:GainNode|undefined,wakeLock:WakeLockSentinel|undefined
function resize(){portrait.value=innerHeight>innerWidth;if(mobile.value&&portrait.value&&phase.value==='racing')pause();sensor.calibrate()}
function clearInput(){accumulator=0;pressed.clear();accel.value=false;touchSteer=0;stick.value={x:0,y:0};steerPointer=null;accelPointer=null}
function pause(){if(phase.value==='racing'||phase.value==='countdown'){phase.value='paused';clearInput();if(engineGain)engineGain.gain.setTargetAtTime(0,audio!.currentTime,.1)}}
function keyDown(event:KeyboardEvent){
  if(['KeyW','KeyA','KeyS','KeyD','Enter','Escape','KeyC'].includes(event.code)){event.preventDefault();if(event.code==='KeyC'){if(!event.repeat&&!(event.target instanceof HTMLInputElement))toggleView();return}if(event.code==='Escape'&&!event.repeat){if(phase.value==='racing'||phase.value==='countdown')pause();else if(phase.value==='paused')void begin();return}if(event.target instanceof HTMLInputElement||phase.value!=='racing')return;pressed.add(event.code)}
}
function keyUp(event:KeyboardEvent){pressed.delete(event.code)}
function visibility(){if(document.hidden){pause();clearInput()}else if(mobile.value&&phase.value==='racing')void requestWakeLock()}
async function requestWakeLock(){try{if('wakeLock' in navigator)wakeLock=await navigator.wakeLock.request('screen')}catch{/* Browser may deny this in low power mode. */}}
function enableAudio(){
  if(!sound.value)return
  try{
    audio ||= new AudioContext()
    if(!engine){engine=audio.createOscillator();engine.type='sawtooth';const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=350;engineGain=audio.createGain();engineGain.gain.value=0;engine.connect(filter).connect(engineGain).connect(audio.destination);engine.start()}
    void audio.resume()
  }catch{sound.value=false}
}
function toggleSound(){sound.value=!sound.value;if(sound.value)enableAudio();else engineGain?.gain.setTargetAtTime(0,audio!.currentTime,.1)}
async function enterLandscape(){
  if(!mobile.value)return
  try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen()}catch{/* iOS supports manual landscape rotation. */}
  try{await (screen.orientation as ScreenOrientation & {lock?:(orientation:string)=>Promise<void>}).lock?.('landscape')}catch{/* Manual rotation remains available. */}
  void requestWakeLock()
}
async function begin(){
  if(loading.value||starting.value||error.value)return
  starting.value=true;sensorError.value=''
  try{
    enableAudio()
    // Sensor permission must be requested directly from this user's tap.
    if(mobile.value&&motionMode.value==='gyro')await sensor.enable()
    if(disposed)return
    await enterLandscape();sensor.calibrate();clearInput()
    if(phase.value==='paused')phase.value='racing'
    else{Object.assign(car,spawnCar(Math.max(0,members.value.findIndex(m=>m.id===self.value?.id))));remaining=3;countdown.value=3;phase.value='countdown';hud.value={...car}}
  }catch(reason){sensorError.value=reason instanceof Error?reason.message:String(reason)}finally{starting.value=false}
}
function pressAccel(event:PointerEvent){if(phase.value!=='racing')return;event.preventDefault();accelPointer=event.pointerId;accel.value=true;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)}
function releaseAccel(event:PointerEvent){if(accelPointer===event.pointerId){accelPointer=null;accel.value=false}}
function canvasDown(){
  if(!mobile.value||phase.value!=='racing')return
  const now=performance.now()
  if(now-lastTap<280){pause();lastTap=0;return}lastTap=now

}
function stickDown(event:PointerEvent){
  if(phase.value!=='racing'||steerPointer!==null)return
  event.preventDefault();steerPointer=event.pointerId;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);stickMove(event)
}
function stickMove(event:PointerEvent){
  if(event.pointerId!==steerPointer)return
  const r=joystick.value!.getBoundingClientRect(),radius=r.width*.32
  let x=event.clientX-r.left-r.width/2,y=event.clientY-r.top-r.height/2
  const length=Math.hypot(x,y);if(length>radius){x*=radius/length;y*=radius/length}
  stick.value={x,y};const input=x/radius;touchSteer=Math.abs(input)<.06?0:clamp((Math.abs(input)-.06)/.94,0,1)*Math.sign(input)
}
function stickUp(event:PointerEvent){if(event.pointerId===steerPointer){steerPointer=null;touchSteer=0;stick.value={x:0,y:0}}}
async function leave(){clearInput();try{await client.value?.leave()}finally{location.assign(home.value)}}
function tick(time:number){
  if(disposed)return
  const dt=Math.min((time-lastTime)/1000||1/60,.1);lastTime=time
  const blocked=mobile.value&&portrait.value
  if(phase.value==='countdown'&&!blocked){remaining-=dt;countdown.value=Math.max(1,Math.ceil(remaining));if(remaining<=0)phase.value='racing'}
  if(phase.value==='racing'&&!blocked){
    const throttle=mobile.value?(accel.value?1:0):(pressed.has('KeyW')||pressed.has('Enter')?1:0)
    const steer=mobile.value?(motionMode.value==='gyro'?sensor.value():touchSteer):Number(pressed.has('KeyD'))-Number(pressed.has('KeyA'))
    accumulator+=dt
    while(accumulator>=1/60){stepCar(car,{throttle,brake:mobile.value?0:Number(pressed.has('KeyS')),steer,boost:mobile.value?accel.value:pressed.has('Enter')},1/60);accumulator-=1/60}
    if(car.collision<=0)for(const other of renderer?.trafficPositions()||[]){
      const dx=car.x-other.x,dz=car.z-other.z,d=Math.hypot(dx,dz)
      if(d<2.05&&d>.01){car.speed*=.55;car.x+=dx/d*.6;car.z+=dz/d*.6;car.collision=.5;break}
    }
    if(car.finished){phase.value='finished';clearInput()}
  }
  const moving=phase.value==='racing'&&!blocked
  if(engine&&engineGain&&audio){engine.frequency.setTargetAtTime(38+Math.abs(car.speed)*3+(car.boosting?20:0),audio.currentTime,.06);engineGain.gain.setTargetAtTime(sound.value&&moving ? .016+Math.abs(car.speed)*.00035:0,audio.currentTime,.1)}
  renderer?.render(car,dt,moving)
  netTime+=dt;hudTime+=dt
  if(hudTime>.08){hud.value={...car};hudTime=0}
  if(netTime>.065){netTime=0;client.value?.send('street-car',{...wireCar(car),speed:moving?car.speed:0,boosting:moving&&car.boosting},{reliability:'unreliable'})}
  frame=requestAnimationFrame(tick)
}
onMounted(async()=>{
  window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('blur',pause);window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility)
  try{
    await nextTick();renderer=new RaceRenderer(canvas.value!,minimap.value!,mobile.value)
    const params=new URLSearchParams(location.search)
    if(params.has('room')){
      const session=GameLinkClient.fromLocation();if(session.gameId!=='gamelink-street-racer')throw Error('这个链接不是街头竞速房间。')
      client.value=session;home.value=session.serverUrl+'/'
      session.on('members',list=>{members.value=list;renderer?.removeMissing(new Set(list.map(m=>m.id)));const ids=new Set(list.map(m=>m.id));remoteStates.value=Object.fromEntries(Object.entries(remoteStates.value).filter(([id])=>ids.has(id)))})
      session.on('peer-state',peer=>peerStates.value={...peerStates.value,[peer.peerId]:peer.state})
      session.on('peer-ready',peer=>session.send('street-car',wireCar(car),{target:peer.peerId,reliability:'reliable'}))
      session.on('message',message=>{if(message.kind!=='street-car'||!validWire(message.payload)||!members.value.some(m=>m.id===message.from))return;remoteStates.value={...remoteStates.value,[message.from]:message.payload};renderer?.receive(message.from,message.payload,members.value.findIndex(m=>m.id===message.from))})
      session.on('error',reason=>{sensorError.value=reason.message})
      session.on('room-closed',()=>{pause();error.value='房间已经关闭，请返回大厅重新创建。'})
      const joined=await session.joinFromLocation();if(disposed){session.dispose();return}room.value=joined.room;self.value=joined.self_member;members.value=joined.room.members
      const index=Math.max(0,members.value.findIndex(m=>m.id===self.value!.id));Object.assign(car,spawnCar(index));renderer.setLocalPaint(index)
    }else{self.value={id:'practice',name:'你',virtual_ip:'',endpoint:''};members.value=[self.value]}
    hud.value={...car};loading.value=false;frame=requestAnimationFrame(tick)
  }catch(reason){client.value?.dispose();loading.value=false;error.value=reason instanceof Error?reason.message:String(reason)}
})
onBeforeUnmount(()=>{disposed=true;cancelAnimationFrame(frame);sensor.dispose();renderer?.dispose();client.value?.dispose();clearInput();window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',pause);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);void audio?.close();void wakeLock?.release()})
</script>

<template>
  <main class="street-racer" :class="{ 'race-live':phase==='racing','race-boosting':hud.boosting,'race-mobile':mobile,'race-touch':mobile&&motionMode==='touch' }" @contextmenu.prevent>
    <canvas ref="canvas" class="race-canvas" aria-label="Three.js 城市竞速赛道" @pointerdown="canvasDown" />
    <div class="race-vignette" />
    <header class="race-top"><div class="race-wordmark"><i></i><span>MIDNIGHT<strong>RUN</strong></span></div><div class="race-session"><span>{{ room?.code || '单人试驾' }}</span><small v-if="room">{{ connected }} / {{ members.length }} 已连接</small><small v-else>城市环线 · 三圈挑战</small></div></header>
    <div v-if="phase==='racing'||phase==='countdown'" class="race-hud">
      <div class="race-laps"><small>LAP</small><b>{{ Math.min(hud.lap,3) }}<span>/ 3</span></b><time>{{ formatTime(hud.elapsed) }}</time></div>
      <div class="race-speed"><span class="race-nitro">NITRO <i><b :style="{width:`${hud.nitro}%`}" /></i></span><strong>{{ Math.round(Math.abs(hud.speed)*3.6) }}</strong><small>KM/H <span>{{ hud.boosting?'BOOST':hud.speed<0?'REVERSE':'DRIVE' }}</span></small></div>
      <span v-if="room" class="race-position">{{ position }}<small> / {{ members.length }} 位</small></span>
      <p v-if="!mobile" class="race-key-hint">WASD 驾驶 <span>ENTER 加速</span><span>C 切换视角</span><span>ESC 暂停</span></p>
    </div>
    <canvas ref="minimap" class="race-minimap" width="180" height="170" aria-label="赛道小地图" />
    <div v-if="phase==='countdown'&&!(mobile&&portrait)" class="race-countdown" aria-live="assertive">{{ countdown }}<small>准备出发</small></div>
    <button v-if="phase==='racing'||phase==='countdown'" class="gl-action race-view-toggle" :aria-label="viewMode==='chase'?'切换到车内第一人称':'切换到第三人称'" @click="toggleView"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="3.5"/></svg>{{ viewMode==='chase'?'车内视角':'第三人称' }}</button>
    <div v-if="mobile&&motionMode==='touch'&&phase==='racing'&&!portrait" ref="joystick" class="race-joystick" :class="{active:steerPointer!==null}" role="group" aria-label="转向摇杆：左右拖动" @pointerdown="stickDown" @pointermove="stickMove" @pointerup="stickUp" @pointercancel="stickUp" @lostpointercapture="stickUp"><span class="race-stick-axis"/><span class="race-stick-knob" :style="{transform:`translate(${stick.x}px,${stick.y}px)`}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m8 8-4 4 4 4m8-8 4 4-4 4M4 12h16"/></svg></span><small>转向</small></div>
    <button v-if="mobile&&phase==='racing'&&!portrait" class="race-accelerator" :class="{held:accel}" aria-label="按住加速" @pointerdown="pressAccel" @pointerup="releaseAccel" @pointercancel="releaseAccel" @lostpointercapture="releaseAccel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 15 6-6 6 6M6 21l6-6 6 6" /></svg><span>加速</span></button>
    <section v-if="phase==='garage'||phase==='paused'||phase==='finished'||error" class="race-overlay">
      <article class="race-panel">
        <div class="race-panel-eyebrow"><span>GAMELINK / STREET RACING</span><b>{{ phase==='paused'?'PAUSED':phase==='finished'?'FINISH':'01 / CITY CIRCUIT' }}</b></div>
        <h1>{{ phase==='paused'?'稍作停靠。':phase==='finished'?'冲过终点。':'极品飞车' }}<em>{{ phase==='garage'?'午夜街头':phase==='paused'?'继续疾驰。':'下一程，继续。' }}</em></h1>
        <p class="race-lead">{{ phase==='finished'?'三圈挑战完成。再跑一场，刷新你的最佳成绩。':'穿过霓虹街区，在长直道释放氮气，沿着城市环线追逐速度。' }}</p>
        <div v-if="phase==='finished'" class="race-results"><div><small>总用时</small><b>{{ formatTime(hud.elapsed) }}</b></div><div><small>最快单圈</small><b>{{ formatTime(hud.bestLap) }}</b></div></div>
        <div v-if="mobile" class="race-instructions"><svg viewBox="0 0 72 44" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="8" width="54" height="28" rx="5"/><path d="M14 17v10M59 20v4M27 2l-7 4 7 4M45 42l7-4-7-4" /></svg><div><b>{{ motionMode==='gyro'?'横握手机，倾斜转向':'横握手机，拖动左侧摇杆转向' }}</b><span>按住加速，松手减速。双击赛道暂停。</span></div></div>
        <div v-else class="race-instructions"><div class="race-keyboard"><kbd>W</kbd><div><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div></div><div><b>W 前进 · S 刹车 / 倒车 · A / D 转向</b><span>Enter 加速 / 氮气 · C 切换视角 · Esc 暂停</span></div></div>
        <div v-if="mobile" class="race-control-choice"><label><input v-model="motionMode" value="gyro" type="radio" />陀螺仪转向</label><label><input v-model="motionMode" value="touch" type="radio" />触摸转向</label><span v-if="motionMode==='touch'">拖动左下角摇杆转向，松手自动回正</span></div>
        <p v-if="sensorError" class="race-alert" role="alert">{{ sensorError }}</p>
        <p v-if="error" class="race-alert" role="alert">{{ error }}</p>
        <button class="race-start" :disabled="loading||starting||!!error" @click="begin"><span>{{ loading?'正在铺设赛道…':starting?'正在连接传感器…':phase==='paused'?'继续驾驶':phase==='finished'?'再跑一场':mobile&&motionMode==='gyro'?'启用陀螺仪 · 出发':'启动引擎' }}</span><UiIcon name="play" /></button>
        <div class="race-panel-actions"><button class="gl-action" @click="toggleView">{{ viewMode==='chase'?'第三人称 · 切换车内':'车内第一人称 · 切换跟随' }}</button><RoomInviteButton v-if="room" game-id="gamelink-street-racer" :room-code="room.code" :member-count="members.length" :max-members="4"/><button class="gl-action" :aria-pressed="sound" @click="toggleSound"><UiIcon :name="sound?'volume':'muted'" />{{ sound?'音效开启':'音效关闭' }}</button><button class="gl-action" @click="leave"><UiIcon name="exit" />返回大厅</button></div>
        <footer class="race-panel-footer"><span>{{ room?'同房实时竞速 · 每位车手独立计时':'单人试驾 · 可在大厅创建多人房间' }}</span><span>3 LAPS / 4 TRAFFIC CARS</span></footer>
      </article>
    </section>
    <div v-if="mobile&&portrait&&(phase==='racing'||phase==='countdown')" class="race-rotate"><svg viewBox="0 0 72 44" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="8" width="54" height="28" rx="5"/><path d="M27 2l-7 4 7 4M45 42l7-4-7-4" /></svg><b>横过来，赛道更宽。</b><span>请将手机横向握持，保持舒适角度后出发。</span></div>
  </main>
</template>
