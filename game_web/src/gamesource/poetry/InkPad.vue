<script setup lang="ts">
import {onMounted,onBeforeUnmount,ref,watch} from 'vue'
export type Stroke=Array<[number,number]>
const props=defineProps<{locked?:boolean;strokes?:Stroke[];readonly?:boolean}>()
const emit=defineEmits<{change:[Stroke[]]}>()
const canvas=ref<HTMLCanvasElement>();let ink:Stroke[]=[],pointer:number|null=null,observer:ResizeObserver
function draw(){const c=canvas.value;if(!c)return;const r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio,2);c.width=Math.max(1,r.width*d);c.height=Math.max(1,r.height*d);const ctx=c.getContext('2d')!;ctx.scale(d,d);ctx.strokeStyle='#213d50';ctx.lineWidth=props.readonly?2:3;ctx.lineCap='round';ctx.lineJoin='round';for(const stroke of ink){ctx.beginPath();stroke.forEach(([x,y],i)=>{if(i)ctx.lineTo(x*r.width,y*r.height);else{ctx.moveTo(x*r.width,y*r.height);ctx.lineTo(x*r.width+.1,y*r.height+.1)}});ctx.stroke()}}
function point(e:PointerEvent):[number,number]{const r=canvas.value!.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))]}
function down(e:PointerEvent){if(props.locked||props.readonly||pointer!==null||ink.length>=80)return;e.preventDefault();pointer=e.pointerId;canvas.value!.setPointerCapture(pointer);ink.push([point(e)]);draw()}
function move(e:PointerEvent){if(pointer!==e.pointerId||props.locked)return;const stroke=ink[ink.length-1]!;if(stroke.length<1500)stroke.push(point(e));draw()}
function up(e:PointerEvent){if(pointer!==e.pointerId)return;pointer=null;emit('change',ink.map(s=>[...s]))}
function clear(){if(props.locked||props.readonly)return;ink=[];draw();emit('change',[])}
function undo(){if(props.locked||props.readonly)return;ink.pop();draw();emit('change',ink.map(s=>[...s]))}
watch(()=>props.strokes,value=>{ink=(value||[]).map(s=>[...s]);draw()},{deep:true})
onMounted(()=>{ink=(props.strokes||[]).map(s=>[...s]);observer=new ResizeObserver(draw);observer.observe(canvas.value!);draw()})
onBeforeUnmount(()=>observer?.disconnect())
defineExpose({clear,undo})
</script>
<template><canvas ref="canvas" class="poem-ink" :class="{'ink-readonly':readonly}" :aria-label="readonly?'手写答案':'手写答题区'" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up" @lostpointercapture="up" /></template>
