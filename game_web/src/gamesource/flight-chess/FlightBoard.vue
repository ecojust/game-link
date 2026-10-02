<script setup lang="ts">
import { computed } from 'vue'
type Player = { id:string; name:string; color:string; planes:number[] }
type State = { players:Player[]; turn:number; phase:string; dice:number }
const props = defineProps<{ state:State; selfId:string }>()
defineEmits<{ move:[plane:number] }>()
const colors: Record<string,string> = { red:'#e75b4f', blue:'#4784c5', yellow:'#eab844', green:'#52a77a' }
const order = ['red','blue','yellow','green']
const path = Array.from({length:52},(_,index)=> {
  const angle = (-135 + index*360/52)*Math.PI/180
  return {x:300+216*Math.cos(angle),y:300+216*Math.sin(angle)}
})
const bases = [{x:24,y:24},{x:446,y:24},{x:446,y:446},{x:24,y:446}]
const seat = (color:string) => props.state.players.find(p => p.color === color)
const homeStarts: Record<string,number> = { red:0, blue:13, yellow:26, green:39 }
const lanes: Record<string,{x:number;y:number}[]> = Object.fromEntries(['red','blue','yellow','green'].map(color => {
  const start = path[(homeStarts[color]!+51)%52]!, steps=Array.from({length:6},(_,i)=>({x:start.x+(300-start.x)*(i === 5 ? 1 : (36+i*27)/216),y:start.y+(300-start.y)*(i === 5 ? 1 : (36+i*27)/216)}))
  return [color,steps]
}))
const homes: Record<string,{x:number;y:number}[]> = Object.fromEntries(order.map((color,index) => {
  const base = bases[index]!
  return [color,[{x:base.x+40,y:base.y+42},{x:base.x+90,y:base.y+42},{x:base.x+40,y:base.y+85},{x:base.x+90,y:base.y+85}]]
}))
const active = computed(() => props.state.players[props.state.turn])
const validPlane = (player:Player,index:number) => props.state.phase === 'move' && active.value?.id === props.selfId && active.value.id === player.id && player.planes[index] !== 57 && ((player.planes[index] === -1 && props.state.dice === 6) || (player.planes[index]! >= 0 && player.planes[index]! + props.state.dice <= 57))
function position(player:Player,plane:number) {
  const progress=player.planes[plane]!, col=player.color
  if(progress<0) return homes[col]?.[plane] || {x:300,y:300}
  if(progress<52) return path[(progress+['red','blue','yellow','green'].indexOf(col)*13)%52]!
  return lanes[col]?.[Math.min(5,progress-52)] || {x:300,y:300}
}
function offset(player:Player,plane:number) {
  const p=position(player,plane), same=props.state.players.flatMap(item=>item.planes.map((_,i)=>({item,i,p:position(item,i)}))).filter(item=>Math.hypot(item.p.x-p.x,item.p.y-p.y)<1)
  const index=same.findIndex(item=>item.item.id===player.id&&item.i===plane),angle=(Math.max(0,index)/Math.max(1,same.length))*Math.PI*2
  return {x:p.x+(same.length>1?Math.cos(angle)*15:0),y:p.y+(same.length>1?Math.sin(angle)*15:0)}
}
</script>

<template>
  <svg class="flight-board" viewBox="0 0 600 600" role="group" aria-label="飞行棋四方棋盘">
    <defs>
      <linearGradient id="tile-glaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white" stop-opacity=".55"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
      <linearGradient id="board-surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#edf2fa"/></linearGradient>
      <symbol id="aircraft" viewBox="-18 -20 36 40"><path d="M0 -18 C3 -18 4 -14 4 -10 L4 -4 L16 4 L16 8 L4 4 L3 12 L8 16 L8 18 L0 16 L-8 18 L-8 16 L-3 12 L-4 4 L-16 8 L-16 4 L-4 -4 L-4 -10 C-4 -14 -3 -18 0 -18Z" fill="currentColor" stroke="white" stroke-width="1.4" stroke-linejoin="round"/><path d="M-2 -11 Q0 -15 2 -11 L2 -6 L-2 -6Z" fill="#223e60" opacity=".65"/><path d="M0 -3 L0 12" stroke="white" stroke-opacity=".5" stroke-width="1.2"/></symbol>
      <pattern id="board-grain" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#274136" opacity=".07"/></pattern><filter id="plane-shadow" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#13221c" flood-opacity=".22"/></filter></defs>
    <rect x="8" y="8" width="584" height="584" rx="18" fill="url(#board-surface)"/><rect x="8" y="8" width="584" height="584" rx="18" fill="url(#board-grain)"/>
    <rect x="14" y="14" width="572" height="572" rx="16" fill="none" stroke="#dbe4f0" stroke-width="1.5"/><circle cx="300" cy="300" r="193" fill="none" stroke="#e0e7f1" stroke-width="1"/><circle cx="300" cy="300" r="239" fill="none" stroke="#e0e7f1" stroke-width="1" stroke-dasharray="3 7"/>
    <circle cx="300" cy="300" r="216" fill="none" stroke="#e5ebf4" stroke-width="36"/>
    <g v-for="(color,index) in order" :key="color" :opacity="seat(color) ? 1 : .48">
      <rect :x="bases[index]!.x" :y="bases[index]!.y" width="130" height="130" rx="25" :fill="colors[color]" opacity=".12"/>
      <rect :x="bases[index]!.x" :y="bases[index]!.y" width="130" height="130" rx="25" fill="none" :stroke="colors[color]" stroke-width="2"/>
      <circle v-for="(spot,i) in homes[color]" :key="i" :cx="spot.x" :cy="spot.y" r="19" fill="white" :stroke="colors[color]" stroke-opacity=".22"/>
      <text :x="bases[index]!.x+65" :y="bases[index]!.y+117" text-anchor="middle" :fill="colors[color]" font-size="10" font-weight="700">{{ seat(color)?.name.slice(0,9) || '空位 · 无需等满' }}</text>
    </g>
    <g v-for="(point,index) in path" :key="index" :transform="`translate(${point.x} ${point.y}) rotate(${-45+index*360/52})`">
      <rect x="-11.5" y="-12" width="23" height="29" rx="6" fill="#a8b9d0" opacity=".48"/>
      <rect x="-11.5" y="-15" width="23" height="29" rx="6" fill="white" stroke="#ccd7e5" stroke-width=".7"/>
      <rect x="-9" y="-12.5" width="18" height="24" rx="4" :fill="colors[order[index%4]!]"/>
      <rect x="-9" y="-12.5" width="18" height="24" rx="4" fill="url(#tile-glaze)"/>
      <path v-if="[0,8,13,21,26,34,39,47].includes(index)" d="M0 -7 L2 -2 L7 -2 L3 1 L4 6 L0 3 L-4 6 L-3 1 L-7 -2 L-2 -2Z" fill="white" stroke="#ffffff88" stroke-width=".7"/>
      <path v-else d="M-3 -1 L0 2 L3 -1" fill="none" stroke="white" stroke-opacity=".65" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <g v-for="color in order" :key="`lane-${color}`"><path :d="`M ${lanes[color]![0]!.x} ${lanes[color]![0]!.y} L 300 300`" :stroke="colors[color]" stroke-width="24" opacity=".12"/>
      <circle v-for="(spot,index) in lanes[color]" :key="index" :cx="spot.x" :cy="spot.y" r="9" :fill="colors[color]" opacity=".7" stroke="white" stroke-width="2"/>
    </g>
    <circle cx="300" cy="300" r="47" fill="white" stroke="#e0e7f1" stroke-width="2"/>
    <path d="M300 259 L341 300 L300 341 L259 300 Z" fill="#edf2fb"/>
    <text x="300" y="293" text-anchor="middle" fill="#596c8d" font-size="19">✦</text><text x="300" y="315" text-anchor="middle" fill="#596c8d" font-size="10" letter-spacing="2">归 航</text>
    <g v-for="player in state.players" :key="`planes-${player.id}`"><g v-for="(_,index) in player.planes" :key="index" class="plane-token" :class="[`plane-${player.color}`, { selectable:validPlane(player,index) }]" :transform="`translate(${offset(player,index).x} ${offset(player,index).y})`" :tabindex="validPlane(player,index)?0:-1" :role="validPlane(player,index)?'button':undefined" :aria-label="`${player.name} 的第 ${index+1} 架飞机${validPlane(player,index)?'，点击行棋':''}`" @click="validPlane(player,index) && $emit('move',index)" @keydown.enter="validPlane(player,index) && $emit('move',index)" @keydown.space.prevent="validPlane(player,index) && $emit('move',index)"><circle class="plane-hit" r="23" fill="transparent" stroke="none"/>
      <circle class="plane-base" cy="3" r="18" :fill="colors[player.color]"/>
      <circle class="plane-top" r="18" fill="white" :stroke="colors[player.color]" stroke-width="2"/>
      <circle r="14.5" :fill="colors[player.color]" opacity=".1" stroke="none"/>
      <use href="#aircraft" x="-16" y="-19" width="32" height="36" :style="{ color: colors[player.color] }"/>
      <circle cx="13" cy="13" r="6" :fill="colors[player.color]" stroke="white" stroke-width="1"/>
      <text class="plane-number" x="13" y="15.5" text-anchor="middle">{{ index+1 }}</text></g></g>
    <g class="board-mark"><text x="300" y="52">✈  FLIGHT CLUB</text><text x="300" y="548">顺时针飞行 · 星标安全格</text></g>
  </svg>
</template>
