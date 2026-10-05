import {computed,nextTick,onBeforeUnmount,onMounted,ref,watch} from 'vue'
import type {Ref} from 'vue'
import {cards,findCard,heroes} from './cards'
import type {View} from './engine'

type Point={x:number;y:number}
type Drag={kind:'card'|'unit'|'power';index?:number;uid?:string;card?:string;start:Point;at:Point;origin:Point;pointer:number;rev:number;active:boolean;valid:boolean;position?:number;target?:{player:string;unit?:string}}
type Effect={id:number;x:number;y:number;kind:'damage'|'heal'|'shield'|'summon'|'death'|'cast';text:string;card?:string}
type Flight={id:number;from:Point;to:Point;card:string}
export function useBattleInteraction(screen:Ref<View>,self:Ref<string>,myTurn:Ref<boolean>,online:Ref<boolean>,handlers:{reset:()=>void;pick:(index:number)=>void;selectUnit:(uid:string)=>void;power:()=>void;play:(position?:number)=>void;target:(id:string,unit?:string)=>void;canTarget:(id:string,unit?:string)=>boolean}){
 const desktop=ref(false),drag=ref<Drag>(),hover=ref<string>(),effects=ref<Effect[]>([]),flights=ref<Flight[]>([]),announcement=ref(''),dropZone=ref(false)
 let media:MediaQueryList|undefined,blockUntil=0,serial=0,noticeTimer=0
 const timeouts=new Set<number>()
 const later=(fn:()=>void,ms:number)=>{const t=window.setTimeout(()=>{timeouts.delete(t);fn()},ms);timeouts.add(t)}
 const blocked=()=>Date.now()<blockUntil
 const me=()=>screen.value.players.find(p=>p.id===self.value)
 const hoverCard=computed(()=>hover.value?findCard(hover.value):undefined)
 const dragCard=computed(()=>drag.value?.kind==='card'&&drag.value.card?findCard(drag.value.card):undefined)
 const aimed=computed(()=>!!drag.value?.active&&(drag.value.kind!=='card'||['damage','heal','buff','freeze'].includes(dragCard.value?.kind||'')))
 const arrow=computed(()=>{const d=drag.value;if(!d)return '';const dy=Math.max(40,Math.abs(d.at.y-d.origin.y)*.25);return `M ${d.origin.x} ${d.origin.y} Q ${(d.origin.x+d.at.x)/2} ${Math.min(d.origin.y,d.at.y)-dy} ${d.at.x} ${d.at.y}`})
 function center(el:Element|null):Point|undefined{if(!el)return;const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}}
 function targetElement(player:string,unit?:string){return [...document.querySelectorAll<HTMLElement>('[data-target-player]')].find(el=>el.dataset.targetPlayer===player&&(el.dataset.targetUnit||'')===(unit||''))||null}
 function start(e:PointerEvent,kind:Drag['kind'],index?:number,uid?:string){
  if(!desktop.value||e.pointerType==='touch'||e.button!==0||!myTurn.value||!online.value||blocked())return
  const p=me();if(!p)return
  const card=index===undefined?undefined:p.hand[index],u=uid?p.units.find(u=>u.uid===uid):undefined
  if(kind==='card'&&(!card||p.mana<findCard(card).cost||findCard(card).kind==='unit'&&p.units.length>=5))return
  if(kind==='unit'&&(!u?.ready||u.frozen))return
  if(kind==='power'&&(p.power||p.mana<2||!heroes[p.hero].target))return
  const origin=center(e.currentTarget as Element)||{x:e.clientX,y:e.clientY}
  drag.value={kind,index,uid,card,start:{x:e.clientX,y:e.clientY},at:{x:e.clientX,y:e.clientY},origin,pointer:e.pointerId,rev:screen.value.rev,active:false,valid:false}
  hover.value=undefined
 }
 function move(e:PointerEvent){const d=drag.value;if(!d||d.pointer!==e.pointerId)return
  if(!d.active&&Math.hypot(e.clientX-d.start.x,e.clientY-d.start.y)<7)return
  if(!d.active){d.active=true;handlers.reset();if(d.kind==='card')handlers.pick(d.index!);else if(d.kind==='unit')handlers.selectUnit(d.uid!);else handlers.power()}
  e.preventDefault();d.at={x:e.clientX,y:e.clientY};d.target=undefined;d.valid=false;dropZone.value=false
  const hit=document.elementFromPoint(e.clientX,e.clientY),target=hit?.closest<HTMLElement>('[data-target-player]')
  if(aimed.value){if(target&&handlers.canTarget(target.dataset.targetPlayer!,target.dataset.targetUnit)){d.target={player:target.dataset.targetPlayer!,unit:target.dataset.targetUnit};d.valid=true}}
  else {const ownZone=hit?.closest('[data-summon-zone]'),board=hit?.closest('.battle-stage');d.valid=dragCard.value?.kind==='unit'?!!ownZone:!!board&&!hit?.closest('.hand');dropZone.value=d.valid
   if(dragCard.value?.kind==='unit'&&ownZone){const units=[...ownZone.querySelectorAll<HTMLElement>('.unit')];const index=units.findIndex(el=>e.clientX<(center(el)?.x||0));d.position=index<0?units.length:index}
  }
 }
 function cancel(){if(drag.value?.active){blockUntil=Date.now()+350;handlers.reset()}drag.value=undefined;dropZone.value=false}
 function release(e:PointerEvent){const d=drag.value;if(!d||d.pointer!==e.pointerId)return
  if(!d.active){drag.value=undefined;return}
  move(e);blockUntil=Date.now()+350
  const valid=d.valid&&d.rev===screen.value.rev&&myTurn.value&&online.value,target=d.target
  drag.value=undefined;dropZone.value=false
  if(valid){if(target)handlers.target(target.player,target.unit);else handlers.play(d.position)}else handlers.reset()
 }
 function key(e:KeyboardEvent){if(e.key==='Escape'){cancel();handlers.reset();hover.value=undefined}}
 function changeMode(){desktop.value=!!media?.matches;if(!desktop.value)cancel()}
 function highlight(player:string,unit?:string){return !!drag.value?.active&&drag.value.valid&&drag.value.target?.player===player&&drag.value.target?.unit===unit}
 function addEffect(point:Point|undefined,kind:Effect['kind'],text:string,card?:string){if(!point)return;const id=++serial;effects.value.push({id,...point,kind,text,card});later(()=>effects.value=effects.value.filter(e=>e.id!==id),1000)}
 let previous:View|undefined
 watch(screen,next=>{
  const old=previous;previous=JSON.parse(JSON.stringify(next));if(!old||old.phase!=='battle'||next.rev===old.rev)return
  if(drag.value&&drag.value.rev!==next.rev)cancel();hover.value=undefined
  if(next.round!==old.round||next.players[next.turn]?.id!==old.players[old.turn]?.id){announcement.value=next.players[next.turn]?.id===self.value?'你的回合':`${next.players[next.turn]?.name} 的回合`;clearTimeout(noticeTimer);noticeTimer=window.setTimeout(()=>announcement.value='',1800)}
  const impacts:{point:Point;enemy:boolean}[]=[],spent:{point:Point;card:string}[]=[]
  const freshLines=next.log.filter(line=>!old.log.includes(line))
  for(const p of next.players){const spell=cards.find(c=>c.kind!=='unit'&&freshLines.includes(`${p.name} 使用${c.name}`));if(spell)addEffect(center(document.querySelector('.arena-divider')),'cast','',spell.id)}
  for(const p of next.players){const prev=old.players.find(x=>x.id===p.id);if(!prev)continue;const point=center(targetElement(p.id));const loss=prev.hp+prev.armor-p.hp-p.armor
   if(loss>0){addEffect(point,'damage',`−${loss}`);if(point)impacts.push({point,enemy:p.id!==old.players[old.turn]?.id})}else if(p.hp>prev.hp)addEffect(point,'heal',`+${p.hp-prev.hp}`)
   if(p.armor>prev.armor)addEffect(point,'shield',`+${p.armor-prev.armor}`)
   for(const u of p.units){const before=prev.units.find(x=>x.uid===u.uid),at=center(targetElement(p.id,u.uid))||center(targetElement(p.id));if(!before){void nextTick(()=>addEffect(center(targetElement(p.id,u.uid)),'summon','',u.card));continue}
    if(before.health>u.health){addEffect(at,'damage',`−${before.health-u.health}`);if(at)impacts.push({point:at,enemy:p.id!==old.players[old.turn]?.id})}
    if(before.health<u.health)addEffect(at,'heal',`+${u.health-before.health}`)
    if(before.shield&&!u.shield){addEffect(at,'shield','破盾');if(at)impacts.push({point:at,enemy:p.id!==old.players[old.turn]?.id})}
    if(before.ready&&!u.ready&&next.turn===old.turn&&at)spent.push({point:at,card:u.card})
   }
   for(const u of prev.units.filter(u=>!p.units.some(n=>n.uid===u.uid))){const at=center(targetElement(p.id,u.uid));addEffect(at,'death','',u.card);if(at)impacts.push({point:at,enemy:p.id!==old.players[old.turn]?.id});if(u.ready&&p.id===old.players[old.turn]?.id&&at)spent.push({point:at,card:u.card})}
  }
  const attack=spent[0],victim=impacts.find(x=>x.enemy);if(attack&&victim){const id=++serial;flights.value.push({id,from:attack.point,to:victim.point,card:attack.card});later(()=>flights.value=flights.value.filter(f=>f.id!==id),550)}
 },{flush:'pre'})
 watch([myTurn,online],()=>{if(!myTurn.value||!online.value)cancel()})
 onMounted(()=>{media=window.matchMedia('(min-width: 901px) and (pointer: fine)');changeMode();media.addEventListener('change',changeMode);window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',release);window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);window.addEventListener('keydown',key)})
 onBeforeUnmount(()=>{media?.removeEventListener('change',changeMode);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',release);window.removeEventListener('pointercancel',cancel);window.removeEventListener('blur',cancel);window.removeEventListener('keydown',key);clearTimeout(noticeTimer);timeouts.forEach(t=>clearTimeout(t))})
 return {desktop,drag,dragCard,hover,hoverCard,effects,flights,announcement,dropZone,aimed,arrow,blocked,highlight,cancel,startCard:(e:PointerEvent,i:number)=>start(e,'card',i),startUnit:(e:PointerEvent,uid:string)=>start(e,'unit',undefined,uid),startPower:(e:PointerEvent)=>start(e,'power')}
}
