import { sdk } from './sdk.js'
import { render } from './ui.js'

const SPEED = 0.42
const EDGE = 0.085 / 2
const KEY_MAP = { arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right', arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down' }

const keys = new Set()
const position = { x: 0.5, y: 0.5 }

const clamp = value => Math.min(1 - EDGE, Math.max(EDGE, value))

function resetPosition() {
  position.x = 0.5
  position.y = 0.5
  keys.clear()
}

function move(dt) {
  const dx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0)
  const dy = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0)
  if (dx || dy) {
    const length = Math.hypot(dx, dy)
    position.x = clamp(position.x + (dx / length) * SPEED * dt)
    position.y = clamp(position.y + (dy / length) * SPEED * dt)
  }
  sdk.setSelfPosition(position.x, position.y)
}

let previous = performance.now()
function loop(now) {
  const dt = Math.min(0.05, (now - previous) / 1000)
  previous = now
  move(dt)
  sdk.tick(dt)
  render()
  requestAnimationFrame(loop)
}

sdk.on('joined', resetPosition)

window.addEventListener('keydown', event => {
  if (document.activeElement?.tagName === 'INPUT') return
  const key = KEY_MAP[event.key.toLowerCase()]
  if (!key) return
  keys.add(key)
  event.preventDefault()
})

window.addEventListener('keyup', event => {
  const key = KEY_MAP[event.key.toLowerCase()]
  if (key) keys.delete(key)
})

window.addEventListener('blur', () => keys.clear())

window.addEventListener('pagehide', () => {
  if (sdk.inRoom) sdk.leave()
})

requestAnimationFrame(loop)
