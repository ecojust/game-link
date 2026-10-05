<script setup lang="ts">
import DoodleLogo from './DoodleLogo.vue'
import UiIcon from "../shared/UiIcon.vue"
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { GameLinkClient, GameLinkMember } from '../../../../sdk/js/gamelink.js'

type Point = { x: number; y: number }
type Brush = 'pen'|'pencil'|'marker'|'highlighter'|'spray'|'neon'|'crayon'
type Stroke = { id: string; owner: string; name: string; color: string; width: number; brush: Brush; space?: 'world'; round?: number; points: Point[] }
const props = defineProps<{ client?: GameLinkClient; self: GameLinkMember; members: GameLinkMember[]; topicRound:number }>()
const COLORS = ['#26332f','#f06b53','#f3a83b','#edcf51','#77ae73','#50a9a1','#5d83c8','#a279c7','#e783a5','#ffffff']
const canvas = ref<HTMLCanvasElement>(), wrap = ref<HTMLElement>()
const color = ref(COLORS[0]!), size = ref(7), tool = ref<'pen'|'eraser'|'pan'>('pen')
const brush = ref<Brush>('pen')
const brushes: { id: Brush; name: string }[] = [
  { id: 'pen', name: '圆头笔' }, { id: 'pencil', name: '铅笔' },
  { id: 'marker', name: '马克笔' }, { id: 'highlighter', name: '荧光笔' },
  { id: 'spray', name: '喷枪' }, { id: 'neon', name: '霓虹笔' },
  { id: 'crayon', name: '蜡笔' },
]
const strokes = ref<Stroke[]>([]), undoStack = ref<string[]>([]), redoStack = ref<Stroke[]>([])
const active = ref(false), showHelp = ref(false)
const canUndo = computed(() => undoStack.value.length > 0)
const canRedo = computed(() => redoStack.value.length > 0)
const palette = COLORS
let ctx: CanvasRenderingContext2D | null = null, observer: ResizeObserver, current: Stroke | null = null, drawing = false
const finished = new Set<string>()
const cancelled = new Set<string>()
let lastProgressAt = 0
const background = '#f8f9fd'
const camera = ref({ x: 0, y: 0, zoom: 1 })
const pointers = new Map<number, Point>()
let gesture = false, spaceHeld = false, frame = 0
const zoomLabel = computed(() => `${Math.round(camera.value.zoom * 100)}%`)
const gridStyle = computed(() => ({ backgroundSize: `${24 * camera.value.zoom}px ${24 * camera.value.zoom}px`, backgroundPosition: `${camera.value.x}px ${camera.value.y}px` }))
function scheduleDraw() { if (!frame) frame = requestAnimationFrame(() => { frame = 0; redraw() }) }
function zoomAt(factor: number, anchor?: Point) {
  const rect = canvas.value!.getBoundingClientRect(), at = anchor || { x: rect.width / 2, y: rect.height / 2 }
  const c = camera.value, zoom = Math.max(.15, Math.min(5, c.zoom * factor)), k = zoom / c.zoom
  camera.value = { x: at.x - (at.x-c.x)*k, y: at.y - (at.y-c.y)*k, zoom }; scheduleDraw()
}
function resetView() { camera.value = { x: 0, y: 0, zoom: 1 }; scheduleDraw() }
function wheel(event: WheelEvent) {
  event.preventDefault()
  const rect = canvas.value!.getBoundingClientRect()
  if (event.ctrlKey || event.metaKey) zoomAt(Math.exp(-event.deltaY*.01), { x:event.clientX-rect.left, y:event.clientY-rect.top })
  else { camera.value.x -= event.deltaX; camera.value.y -= event.deltaY; scheduleDraw() }
}
function localPoint(event: PointerEvent): Point {
  const rect = canvas.value!.getBoundingClientRect(); return { x:event.clientX-rect.left, y:event.clientY-rect.top }
}
function keyUp(event: KeyboardEvent) { if (event.code === 'Space') spaceHeld = false }
function blur() { up(); pointers.clear(); gesture = false; spaceHeld = false }

function paintStroke(context: CanvasRenderingContext2D, stroke: Stroke, from = 0) {
  const points = stroke.points
  if (!points.length) return
  context.save(); context.globalCompositeOperation = stroke.color === 'erase' ? 'destination-out' : stroke.brush === 'highlighter' ? 'multiply' : 'source-over'
  context.strokeStyle = stroke.color === 'erase' ? '#000' : stroke.color; context.fillStyle = context.strokeStyle
  const brushWidth = stroke.width * (stroke.brush === 'marker' ? 1.65 : stroke.brush === 'highlighter' ? 3.2 : 1)
  context.lineWidth = brushWidth; context.lineCap = 'round'; context.lineJoin = 'round'
  context.globalAlpha = stroke.brush === 'pencil' ? 0.62 : stroke.brush === 'marker' ? 0.58 : stroke.brush === 'highlighter' ? 0.3 : stroke.brush === 'crayon' ? 0.82 : 1
  if (stroke.brush === 'neon') { context.shadowColor = stroke.color; context.shadowBlur = Math.max(5, stroke.width * 1.5) }
  if (stroke.brush === 'spray') {
    const seed = [...stroke.id].reduce((value, char) => (value * 31 + char.charCodeAt(0)) | 0, 7)
    const random = (segment: number, dot: number, axis: number) => { const v = Math.sin(seed * 0.001 + segment * 78.233 + dot * 39.425 + axis * 11.73) * 43758.5453; return v - Math.floor(v) }
    const first = points.length === 1 ? 0 : Math.max(1, from)
    for (let i = first; i < points.length; i++) {
      const a = points[Math.max(0, i - 1)]!, b = points[i]!
      for (let dot = 0; dot < 16; dot++) {
        const t = random(i, dot, 0), spread = brushWidth * (1.6 + random(i, dot, 1) * 1.4)
        const px = a.x + (b.x - a.x) * t + (random(i, dot, 2) - 0.5) * spread
        const py = a.y + (b.y - a.y) * t + (random(i, dot, 3) - 0.5) * spread
        const radius = 0.9 + random(i, dot, 4) * Math.max(1.5, stroke.width * 0.28)
        context.beginPath(); context.arc(px, py, radius, 0, Math.PI * 2); context.fill()
      }
    }
  } else {
    const first = points.length === 1 ? 0 : Math.max(1, from)
    context.beginPath(); context.moveTo(points[Math.max(0, first - 1)]!.x, points[Math.max(0, first - 1)]!.y)
    for (let i = first; i < points.length; i++) context.lineTo(points[i]!.x, points[i]!.y)
    context.stroke()
    if (points.length === 1 || points.every(p => p.x === points[0]!.x && p.y === points[0]!.y)) { context.beginPath(); context.arc(points[0]!.x, points[0]!.y, brushWidth/2, 0, Math.PI*2); context.fill() }
    if (stroke.brush === 'crayon') {
      context.globalAlpha = 0.22; context.lineWidth = Math.max(1, stroke.width * 0.22)
      context.setLineDash([1, Math.max(2, stroke.width * 0.5)]); context.stroke(); context.setLineDash([])
    }
  }
  context.restore()
}
function redraw() {
  if (!canvas.value || !ctx) return
  const rect = canvas.value.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 2)
  const width = Math.max(1, Math.floor(rect.width * ratio)), height = Math.max(1, Math.floor(rect.height * ratio))
  if (canvas.value.width !== width || canvas.value.height !== height) { canvas.value.width = width; canvas.value.height = height }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, rect.width, rect.height)
  for (const stroke of strokes.value) paintStroke(ctx, scaled(stroke))
  if (current) paintStroke(ctx, scaled(current))
}
function point(event: PointerEvent): Point {
  const p = localPoint(event), c = camera.value
  return { x: (p.x-c.x)/c.zoom, y: (p.y-c.y)/c.zoom }
}
function scaled(stroke: Stroke): Stroke {
  const c = camera.value
  return { ...stroke, width: stroke.width*c.zoom, points: stroke.points.map(p => ({ x:p.x*c.zoom+c.x, y:p.y*c.zoom+c.y })) }
}
function down(event: PointerEvent) {
  if (!props.topicRound) return
  if (event.button !== 0 && event.button !== 1 && event.pointerType !== 'touch') return
  event.preventDefault(); canvas.value!.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, localPoint(event))
  if (pointers.size > 1) {
    if (current && current.points.length < 4) {
      cancelled.add(current.id); props.client?.send('doodle-cancel', { id:current.id }, { reliability:'reliable' })
      current = null; drawing = false; active.value = false; scheduleDraw()
    } else up()
    gesture = true; return
  }
  gesture = tool.value === 'pan' || spaceHeld || event.button === 1
  if (gesture) return
  drawing = true; active.value = true
  current = { id: `${props.self.id}:${crypto.randomUUID()}`, owner: props.self.id, name: props.self.name, space:'world', round:props.topicRound, color: tool.value === 'eraser' ? 'erase' : color.value, width: tool.value === 'eraser' ? size.value * 3 : size.value, brush: tool.value === 'eraser' ? 'pen' : brush.value, points: [point(event)] }
  lastProgressAt = performance.now(); props.client?.send('doodle-progress', current, { reliability: 'unreliable' }); scheduleDraw()
}
function move(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return
  event.preventDefault()
  const before = [...pointers.values()], old = pointers.get(event.pointerId)!, next = localPoint(event)
  pointers.set(event.pointerId, next)
  if (pointers.size >= 2) {
    const after = [...pointers.values()], a = before[0]!, b = before[1]!, c = after[0]!, d = after[1]!
    const from = {x:(a.x+b.x)/2,y:(a.y+b.y)/2}, to = {x:(c.x+d.x)/2,y:(c.y+d.y)/2}
    zoomAt(Math.hypot(c.x-d.x,c.y-d.y)/Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),from)
    camera.value.x += to.x-from.x; camera.value.y += to.y-from.y; scheduleDraw(); return
  }
  if (gesture) { camera.value.x += next.x-old.x; camera.value.y += next.y-old.y; scheduleDraw(); return }
  if (!drawing || !current) return
  const p = point(event), last = current.points[current.points.length-1]!
  if (Math.hypot(p.x-last.x,p.y-last.y)*camera.value.zoom < 1) return
  if (current.points.length >= 320) {
    const previous = current; up(); drawing = true; active.value = true
    current = { ...previous, id:`${props.self.id}:${crypto.randomUUID()}`, points:[last] }
  }
  current.points.push(p); scheduleDraw()
  const now = performance.now()
  if (now-lastProgressAt >= 40) { lastProgressAt = now; props.client?.send('doodle-progress', current, { reliability:'unreliable' }) }
}
function endPointer(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return
  up(); pointers.delete(event.pointerId)
  if (!pointers.size) gesture = false
}
function up() {
  if (!drawing || !current) return
  drawing = false; const completed = current; current = null
  if (completed.points.length === 1) completed.points.push({ ...completed.points[0]! })
  strokes.value.push(completed); if (strokes.value.length > 600) strokes.value.shift()
  finished.add(completed.id)
  undoStack.value.push(completed.id); redoStack.value = []; active.value = false
  props.client?.send('doodle-stroke', completed, { reliability: 'reliable' }); redraw()
}
function addRemote(raw: Record<string, unknown>, final = true) {
  if (typeof raw.id === 'string' && cancelled.has(raw.id)) return
  if (props.topicRound > 0 && raw.round !== props.topicRound) return
  if (typeof raw.id !== 'string' || typeof raw.owner !== 'string' || typeof raw.color !== 'string' || !Array.isArray(raw.points) || !raw.points.length || raw.points.length > 320 || finished.has(raw.id)) return
  if (typeof raw.width !== 'number' || !Number.isFinite(raw.width) || raw.width < 1 || raw.width > 100 || raw.color !== 'erase' && !/^#[\da-f]{6}$/i.test(raw.color)) return
  const allowedBrushes: Brush[] = ['pen','pencil','marker','highlighter','spray','neon','crayon']
  if (typeof raw.brush !== 'string' || !allowedBrushes.includes(raw.brush as Brush)) return
  const points = raw.points.filter((p): p is Point => !!p && typeof p === 'object' && Number.isFinite((p as Point).x) && Number.isFinite((p as Point).y) && Math.abs((p as Point).x) < 1e12 && Math.abs((p as Point).y) < 1e12)
  if (!points.length) return
  const worldPoints = raw.space === 'world' ? points : points.map(p => ({ x:p.x*1000, y:p.y*650 }))
  const stroke: Stroke = { space:'world', id: raw.id, owner: raw.owner, name: typeof raw.name === 'string' ? raw.name.slice(0,32) : '朋友', color: raw.color, width: raw.width, brush: raw.brush as Brush, points: worldPoints }
  const existing = strokes.value.findIndex(item => item.id === stroke.id)
  if (existing >= 0) strokes.value[existing] = stroke
  else strokes.value.push(stroke)
  if (final) finished.add(stroke.id)
  if (strokes.value.length > 600) strokes.value.shift()
  redraw()
}
function addSnapshot(raw: unknown[]) { for (const stroke of raw) if (stroke && typeof stroke === 'object') addRemote(stroke as Record<string, unknown>) }
function cancelStroke(id: string) { cancelled.add(id); removeStroke(id) }
function removeStroke(id: string) { strokes.value = strokes.value.filter(stroke => stroke.id !== id); undoStack.value = undoStack.value.filter(item => item !== id); finished.delete(id); redraw() }
function undo() {
  const index = [...undoStack.value].reverse().findIndex(id => strokes.value.some(stroke => stroke.id === id))
  if (index < 0) return
  const id = undoStack.value[undoStack.value.length - 1 - index]!, strokeIndex = strokes.value.findIndex(stroke => stroke.id === id)
  const [stroke] = strokes.value.splice(strokeIndex, 1)
  undoStack.value = undoStack.value.filter(item => item !== id)
  if (stroke) { redoStack.value.push(stroke); finished.delete(id); props.client?.send('doodle-undo', { id }, { reliability: 'reliable' }) }
  redraw()
}
function redo() {
  const stroke = redoStack.value.pop(); if (!stroke) return
  strokes.value.push(stroke); finished.add(stroke.id); undoStack.value.push(stroke.id); props.client?.send('doodle-stroke', stroke, { reliability: 'reliable' }); redraw()
}
function clearBoard() {
  if (!strokes.value.length) return
  strokes.value = []; undoStack.value = []; redoStack.value = []; finished.clear(); props.client?.send('doodle-clear', {}, { reliability: 'reliable' }); redraw()
}
function clearRemote() { strokes.value = []; undoStack.value = []; redoStack.value = []; finished.clear(); redraw() }
function clearForTopic() {
  if(current){cancelled.add(current.id);props.client?.send('doodle-cancel',{id:current.id},{reliability:'reliable'})}
  current=null;drawing=false;active.value=false;pointers.clear();gesture=false
  clearRemote()
}
function sendSnapshot(target: string) {
  const complete = strokes.value.filter(stroke => finished.has(stroke.id))
  for (let i = 0; i < complete.length; i += 5) props.client?.send('doodle-snapshot', { strokes: complete.slice(i, i + 5) }, { target, reliability: 'reliable' })
}
function handshake(peerId: string) {
  props.client?.send('doodle-request', {}, { target: peerId, reliability: 'reliable' })
  sendSnapshot(peerId)
}
function download() {
  if (!canvas.value) return
  up(); redraw()
  const output = document.createElement('canvas'); output.width = canvas.value.width; output.height = canvas.value.height
  const context = output.getContext('2d')!; context.fillStyle = background; context.fillRect(0,0,output.width,output.height)
  context.drawImage(canvas.value,0,0)
  const link = document.createElement('a'); link.download = `gamelink-doodle-${new Date().toISOString().slice(0,10)}.png`; link.href = output.toDataURL('image/png'); link.click()
}
function hotkey(event: KeyboardEvent) {
  if (event.target instanceof HTMLInputElement) return
  if (event.code === 'Space') { event.preventDefault(); spaceHeld = true }
  if (event.key.toLowerCase() === 'h') tool.value = 'pan'
  if (event.key.toLowerCase() === 'b') tool.value = 'pen'
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo() }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); redo() }
  if (event.key === 'Escape') showHelp.value = false
}
onMounted(() => {
  ctx = canvas.value!.getContext('2d'); observer = new ResizeObserver(redraw); observer.observe(wrap.value!); addEventListener('keydown', hotkey); addEventListener('keyup', keyUp); addEventListener('blur', blur); redraw()
  for (const member of props.client?.members || []) if (member.id !== props.self.id && props.client?.peerStates.get(member.id) === 'connected') handshake(member.id)
})
onBeforeUnmount(() => { observer?.disconnect(); cancelAnimationFrame(frame); removeEventListener('keydown', hotkey); removeEventListener('keyup', keyUp); removeEventListener('blur', blur) })
watch(() => props.members, () => nextTick(redraw), { deep: true })
defineExpose({ cancelStroke, addRemote, addSnapshot, removeStroke, clearRemote, clearForTopic, sendSnapshot, handshake })
</script>

<template>
  <section class="doodle-workspace" @contextmenu.prevent @selectstart.prevent @dragstart.prevent>
    <aside class="doodle-tools">
      <div class="tool-group"><small>画笔颜色</small><div class="doodle-palette"><button v-for="swatch in palette" :key="swatch" :class="{ selected: color === swatch && tool === 'pen' }" :style="{ '--swatch': swatch }" :aria-label="`选择颜色 ${swatch}`" @click="color = swatch; tool = 'pen'" /></div></div>
      <i class="tool-divider"></i>
      <div class="brush-picker" role="group" aria-label="选择笔刷"><button v-for="item in brushes" :key="item.id" :class="{ selected: brush === item.id && tool === 'pen' }" :aria-pressed="brush === item.id && tool === 'pen'" :aria-label="item.name" :title="item.name" @click="brush = item.id; tool = 'pen'"><UiIcon :name="item.id" /><small>{{ item.name }}</small></button></div>
      <div class="tool-group size-group"><small>粗细 <b>{{ size }}</b></small><input v-model.number="size" type="range" min="2" max="24" aria-label="笔刷粗细" /></div>
      <i class="tool-divider"></i>
      <div class="tool-actions"><button class="gl-action" :class="{ active: tool === 'pan' }" :aria-pressed="tool === 'pan'" aria-label="移动画布" title="移动画布 H / 空格" @click="tool='pan'"><UiIcon name="pan" /></button><button class="gl-action" :class="{ active: tool === 'pen' }" :aria-pressed="tool === 'pen'" aria-label="画笔" title="画笔" @click="tool='pen'"><UiIcon name="pen" /></button><button class="gl-action" :class="{ active: tool === 'eraser' }" :aria-pressed="tool === 'eraser'" aria-label="橡皮擦" title="橡皮擦" @click="tool='eraser'"><UiIcon name="eraser" /></button><button class="gl-action" :disabled="!canUndo" aria-label="撤销" title="撤销 Ctrl/⌘ Z" @click="undo"><UiIcon name="undo" /></button><button class="gl-action" :disabled="!canRedo" aria-label="重做" title="重做 Ctrl/⌘ Shift Z" @click="redo"><UiIcon name="redo" /></button></div>
      <i class="tool-divider"></i>
      <button class="gl-action clear-button" :disabled="!strokes.length" @click="clearBoard"><UiIcon name="trash" />清空画布</button>
      <button class="gl-action save-button" @click="download"><UiIcon name="download" />保存视野</button>
    </aside>
    <div ref="wrap" class="paper-wrap" :class="{ drawing: active, panning: tool === 'pan' }" :style="gridStyle">
      <div class="paper-caption"><span>无限画室 / INFINITE STUDIO</span><span>{{ strokes.length }} 笔创作</span></div>
      <canvas ref="canvas" class="shared-canvas" @pointerdown="down" @pointermove="move" @pointerup="endPointer" @pointercancel="endPointer" @lostpointercapture="endPointer" @wheel="wheel" @contextmenu.prevent />
      <div v-if="!strokes.length" class="paper-empty" @click="showHelp=true"><span><DoodleLogo /></span><b>在这里，让想象铺开</b><small>单指绘画 · 双指移动与缩放 · 每个人都有自己的视角</small></div>
      <div class="view-controls"><button class="gl-action" aria-label="缩小" @click="zoomAt(1/1.25)"><UiIcon name="minus" /></button><span>{{ zoomLabel }}</span><button class="gl-action" aria-label="放大" @click="zoomAt(1.25)"><UiIcon name="plus" /></button><button class="gl-action origin-button" @click="resetView"><UiIcon name="target" />回到原点</button></div>
      <div class="paper-corner">{{ Math.round(-camera.x/camera.zoom) }}, {{ Math.round(-camera.y/camera.zoom) }}</div>
    </div>
    <footer class="doodle-footer"><span><i></i> {{ strokes.length ? '共同创作中' : '画纸已准备好' }}</span><span>双指移动 / 缩放 · 保留最近 600 笔</span><button class="gl-action" @click="showHelp = !showHelp"><UiIcon name="help" />使用说明</button></footer>
    <div v-if="showHelp" class="help-overlay" @click.self="showHelp=false"><article><button class="gl-action help-close" aria-label="关闭说明" @click="showHelp=false"><UiIcon name="close" /></button><small>MAKE A MARK</small><h2>一起画，<em>一起玩。</em></h2><p>单指或鼠标绘画；双指拖动和捏合缩放。选择移动工具后，单指也可以拖动画布。电脑可按住空格拖动，滚轮平移，Ctrl/⌘ + 滚轮缩放。视角只影响自己，回到原点可找到朋友的第一笔。每个人的笔画会实时同步给房间里的朋友，新加入的人也会收到当前画布。</p><p>工具栏可切换圆头笔、铅笔、马克笔、荧光笔、喷枪、霓虹笔和蜡笔。选颜色与粗细；橡皮擦会擦掉经过的画迹。撤销仅撤回自己的最近一笔，清空会清除所有人的画布。</p><p>用 <kbd>⌘/Ctrl Z</kbd> 撤销，<kbd>Shift ⌘/Ctrl Z</kbd> 重做。保存视野会导出当前看到的区域。</p><button class="gl-action help-done" @click="showHelp=false"><UiIcon name="play" />开始涂鸦</button></article></div>
  </section>
</template>
