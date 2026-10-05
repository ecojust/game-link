<script setup lang="ts">
import {computed,onMounted,onBeforeUnmount,ref,watch} from 'vue'
import type {GameLinkClient,GameLinkMember,GameLinkMessage} from '../../../../sdk/js/gamelink.js'
const props=defineProps<{client?:GameLinkClient;self?:GameLinkMember;members:GameLinkMember[];connected:string[]}>()
type Pose={x:number;y:number;seat:number;dir:number;moving:boolean;epoch:number;seq:number}
const canvas=ref<HTMLCanvasElement>(),poses=new Map<string,Pose>()
const colors=['#e9b46c','#85bfd0','#c696c4','#90c49b'],seatX=[110,143,176,209],epoch=Date.now()
let own:Pose={x:160,y:145,seat:-1,dir:0,moving:false,epoch,seq:0},raf=0,last=0,lastSent=0,lastHeartbeat=0,dirty=true,destination:{x:number;y:number;seat:number}|undefined,unsubscribe:(()=>void)|undefined,disposed=false
const names=computed(()=>[...props.members].sort((a,b)=>a.id.localeCompare(b.id)))
function send(kind:string,payload:unknown,target?:string){props.client?.send('tv-lounge-'+kind,payload,{reliability:'reliable',...(target?{target}:{})})}
function publish(target?:string){if(!props.self)return;own.seq++;poses.set(props.self.id,{...own});send('pose',{...own},target);dirty=false}
function freeSeat(index:number){return ![...poses.entries()].some(([id,p])=>id!==props.self?.id&&props.members.some(m=>m.id===id)&&p.seat===index)}
function stand(){if(own.seat<0)return;own.x=seatX[own.seat]!;own.y=110;own.seat=-1;dirty=true;}
function sit(index:number){if(!freeSeat(index)){return}own={...own,x:seatX[index]!,y:86,seat:index,dir:2,moving:false};destination=undefined;dirty=true;publish()}
function passable(x:number,y:number){return x>=14&&x<=306&&y>=42&&y<=166&&!(x>82&&x<238&&y>52&&y<99)&&!(x<49&&y<84)&&!(x>275&&y<80)}
function pointer(event:PointerEvent){const c=canvas.value;if(!c)return;c.focus();const r=c.getBoundingClientRect(),x=(event.clientX-r.left)*320/r.width,y=(event.clientY-r.top)*180/r.height
 if(y>=55&&y<=103&&x>=92&&x<=228){const index=seatX.map((n,i)=>({i,d:Math.abs(n-x)})).sort((a,b)=>a.d-b.d)[0]!.i;if(!freeSeat(index)){return}stand();destination={x:seatX[index]!,y:108,seat:index};return}
 if(passable(x,y)){stand();destination={x,y,seat:-1};}
}
function message(m:GameLinkMessage){if(!props.members.some(p=>p.id===m.from))return;if(m.kind==='tv-lounge-request'){publish(m.from);return}if(m.kind!=='tv-lounge-pose')return;const p=m.payload as Pose
 if(!p||![p.x,p.y,p.epoch,p.seq].every(Number.isFinite)||p.x<14||p.x>306||p.y<42||p.y>166||!Number.isInteger(p.seat)||p.seat< -1||p.seat>3||![0,1,2,3].includes(p.dir)||typeof p.moving!=='boolean'||!Number.isSafeInteger(p.seq)||p.seq<0||!Number.isSafeInteger(p.epoch)||p.epoch<0)return
 if(p.seat>=0&&(Math.abs(p.x-seatX[p.seat]!)>1||Math.abs(p.y-86)>1))return
 const old=poses.get(m.from);if(old&&(p.epoch<old.epoch||(p.epoch===old.epoch&&p.seq<=old.seq)))return;poses.set(m.from,{...p})
 if(own.seat>=0&&p.seat===own.seat&&m.from.localeCompare(props.self?.id||'')<0){stand();publish()}
}
watch(()=>props.client,client=>{unsubscribe?.();unsubscribe=client?.on('message',message);if(client)send('request',{})},{immediate:true})
watch(()=>props.self?.id,id=>{if(!id)return;const index=Math.max(0,names.value.findIndex(p=>p.id===id));own={...own,x:100+index*40,y:145,seat:-1};poses.set(id,{...own});publish();send('request',{})})
watch(()=>props.members,m=>{for(const id of poses.keys())if(!m.some(p=>p.id===id))poses.delete(id)})
function character(ctx:CanvasRenderingContext2D,x:number,y:number,color:string,p:Pose,time:number){x=Math.round(x);y=Math.round(y);const step=p.moving?Math.floor(time/140)%2:0
 if(p.seat>=0){
  ctx.fillStyle='#14263b55';ctx.fillRect(x-11,y+9,22,4)
  ctx.fillStyle='#25364e';ctx.fillRect(x-9,y-4,18,5);ctx.fillRect(x-9,y,5,9);ctx.fillRect(x+4,y,5,9);ctx.fillStyle='#18273c';ctx.fillRect(x-10,y+7,7,4);ctx.fillRect(x+3,y+7,7,4)
  ctx.fillStyle=color;ctx.fillRect(x-8,y-18,16,14);ctx.fillRect(x-11,y-14,4,11);ctx.fillRect(x+7,y-14,4,11);ctx.fillStyle='#ecc5a4';ctx.fillRect(x-11,y-5,4,3);ctx.fillRect(x+7,y-5,4,3);ctx.fillRect(x-7,y-31,14,13)
  ctx.fillStyle='#293349';ctx.fillRect(x-8,y-34,16,7);ctx.fillRect(x-8,y-28,16,8);ctx.fillStyle='#43516a';ctx.fillRect(x-5,y-32,9,2);return
 }
 ctx.fillStyle='#14263b55';ctx.fillRect(x-9,y-2,18,4);ctx.fillStyle='#25364e';ctx.fillRect(x-6,y-9,5,p.seat>=0?7:9-step*2);ctx.fillRect(x+1,y-9,5,p.seat>=0?7:7+step*2)
 ctx.fillStyle=color;ctx.fillRect(x-7,y-23,14,15);ctx.fillRect(x-10,y-21+step,3,11);ctx.fillRect(x+7,y-21-step,3,11)
 ctx.fillStyle='#ecc5a4';ctx.fillRect(x-7,y-36,14,13);ctx.fillRect(x-5,y-23,10,2);ctx.fillStyle='#293349';ctx.fillRect(x-8,y-39,16,6);ctx.fillRect(x-8,y-33,3,6);if(p.dir===2){ctx.fillRect(x-7,y-33,14,9)}else{ctx.fillRect(x+(p.dir===3?-4:3),y-30,2,2)}
}
function draw(time:number){const c=canvas.value,ctx=c?.getContext('2d');if(!ctx)return;ctx.imageSmoothingEnabled=false;ctx.fillStyle='#364962';ctx.fillRect(0,0,320,180)
 for(let y=35;y<180;y+=12){for(let x=0;x<320;x+=32){ctx.fillStyle=((x/32+y/12)|0)%2?'#866d61':'#91766a';ctx.fillRect(x,y,31,11);ctx.fillStyle='#5e505255';ctx.fillRect(x,y+10,31,1)}}
 ctx.fillStyle='#415975';ctx.fillRect(0,0,320,35);ctx.fillStyle='#223a55';ctx.fillRect(0,31,320,5);ctx.fillStyle='#bac8d8';ctx.fillRect(125,8,70,17);ctx.fillStyle='#263d59';ctx.fillRect(129,11,62,10);ctx.fillStyle='#92c5cf';ctx.fillRect(148,14,24,4)
 ctx.fillStyle='#293a5e';ctx.fillRect(55,104,210,55);ctx.fillStyle='#637a91';ctx.fillRect(59,108,202,47);ctx.strokeStyle='#8ea8ba';ctx.strokeRect(64.5,113.5,191,36)
 ctx.fillStyle='#514852';ctx.fillRect(23,57,15,25);ctx.fillStyle='#799d7c';ctx.fillRect(15,40,29,17);ctx.fillStyle='#a5bf91';ctx.fillRect(20,36,17,14)
 ctx.fillStyle='#c3ac7d';ctx.fillRect(292,42,3,35);ctx.fillStyle='#eee0af';ctx.fillRect(283,38,21,10);ctx.fillStyle='#5c535e';ctx.fillRect(286,76,16,4)
 ctx.fillStyle='#263b52';ctx.fillRect(80,52,160,45);ctx.fillStyle='#5f8299';ctx.fillRect(85,54,150,24);ctx.fillStyle='#92acb5';ctx.fillRect(87,55,146,3)
 for(let i=0;i<4;i++){ctx.fillStyle='#82a3b0';ctx.fillRect(95+i*33,77,31,14);ctx.fillStyle='#476981';ctx.fillRect(95+i*33,89,31,4)}ctx.fillStyle='#7898a8';ctx.fillRect(81,68,12,29);ctx.fillRect(228,68,12,29);ctx.fillStyle='#24364f';ctx.fillRect(89,96,5,5);ctx.fillRect(226,96,5,5)
 const list=names.value.map((member,index)=>({member,index,p:member.id===props.self?.id?own:poses.get(member.id)})).filter(item=>item.p).sort((a,b)=>a.p!.y-b.p!.y)
 for(const{member,index,p}of list){character(ctx,p!.x,p!.y,colors[index%4]!,p!,time);ctx.font='7px sans-serif';ctx.textAlign='center';const label=member.id===props.self?.id?member.name+' · 你':member.name;ctx.fillStyle=member.id===props.self?.id?'#fff1bd':'#e4eef6';ctx.fillText(label.slice(0,12),Math.round(p!.x),Math.round(p!.y-44));}
 ctx.textAlign='left';ctx.fillStyle='#d2dbe3';ctx.font='7px monospace';ctx.fillText('LITTLE THEATER / LOUNGE',9,20)
}
function frame(now:number){if(disposed)return;const dt=Math.min(.05,(now-last)/1000||0);last=now
 let dx=0,dy=0
 if(destination){const x=destination.x-own.x,y=destination.y-own.y;if(Math.hypot(x,y)<3){const seat=destination.seat;destination=undefined;if(seat>=0)sit(seat)}else{dx=x;dy=y}}
 const norm=Math.hypot(dx,dy),oldX=own.x,oldY=own.y;if(norm&&own.seat<0){const step=65*dt*(destination?1:Math.min(1,norm));const x=own.x+dx/norm*step,y=own.y+dy/norm*step;if(passable(x,own.y))own.x=x;if(passable(own.x,y))own.y=y;own.dir=Math.abs(dx)>Math.abs(dy)?dx<0?3:1:dy<0?2:0;if(destination&&Math.abs(own.x-oldX)+Math.abs(own.y-oldY)<.01)destination=undefined}
 const moving=Math.abs(own.x-oldX)+Math.abs(own.y-oldY)>.01;if(moving||moving!==own.moving)dirty=true;own.moving=moving
 if((dirty&&now-lastSent>100)||now-lastHeartbeat>2000){publish();lastSent=now;lastHeartbeat=now}draw(now);raf=requestAnimationFrame(frame)
}
onMounted(()=>{if(props.self){poses.set(props.self.id,{...own});publish()}raf=requestAnimationFrame(frame)})
onBeforeUnmount(()=>{disposed=true;cancelAnimationFrame(raf);unsubscribe?.();})
</script>
<template><section class="pixel-lounge"><div class="pixel-lounge-heading"><span>像素客厅 <small>{{members.length}} / 4 人</small></span></div><canvas ref="canvas" width="320" height="180" tabindex="0" aria-label="像素客厅，点击地板移动或点击空沙发入座" @pointerdown="pointer"/></section></template>
<style scoped>
.pixel-lounge{max-width:760px;margin:24px auto 12px}.pixel-lounge-heading{margin-bottom:10px;font-size:12px;color:#c8d7e8}.pixel-lounge-heading small{color:#91a8c2;margin-left:8px}.pixel-lounge canvas{width:100%;display:block;image-rendering:pixelated;image-rendering:crisp-edges;border:4px solid #18283f;box-shadow:0 0 0 1px #5f7895;border-radius:3px;cursor:crosshair;touch-action:none;outline-offset:4px}@media(max-width:600px){.pixel-lounge canvas{border-width:3px}}
</style>
