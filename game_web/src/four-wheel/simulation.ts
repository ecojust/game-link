// FC-style car combat. The room host owns damage, pickups, AI and stage transitions.
export const COLS = 128, ROWS = 100, TILE = 2, WIDTH = COLS * TILE, HEIGHT = ROWS * TILE
export const PAINTS = ['#f8f8e8', '#ef5058', '#42b9ef', '#f3c44d', '#ae78ed', '#59d192']
export type Tile = 'road' | 'grass' | 'water' | 'bridge' | 'wall' | 'rock' | 'oil' | 'tree' | 'ruin'
export type Mode = 'coop' | 'versus'
export type Input = { x: number; z: number; gas: boolean; brake: boolean }
export type Driver = { id: string; name: string }
export type Car = Driver & { bot: boolean; x: number; z: number; vx: number; vz: number; angle: number; hp: number; score: number; kills: number; paint: string; model: number; turbo: number; suspension: boolean; star: number; spin: number; hurt: number; dead: number; attacker: string }
export type Pickup = { id: string; x: number; z: number; kind: 'fuel' | 'turbo' | 'suspension' | 'star' | 'flag' | 'crown' }
export type Spark = { id: number; x: number; z: number; age: number; big: boolean }
export type World = { protocol: 3; rev: number; stage: number; mode: Mode; phase: 'playing' | 'clear' | 'over' | 'complete'; time: number; kills: number; goal: number; spawned: number; cars: Car[]; pickups: Pickup[]; broken: number[]; sparks: Spark[]; winner: string }
export const idleInput = (): Input => ({ x: 0, z: 0, gas: false, brake: false })
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
export const angleDelta = (a: number, b: number) => Math.atan2(Math.sin(b - a), Math.cos(b - a))
export const STAGES = ['春日公园', '河岸交锋', '夏日工场', '双桥突击', '秋色庭院', '石阵围攻', '冬日要塞', '最终激突']
const maps = new Map<number, Tile[]>()
export function makeMap(stage: number): Tile[] {
  if (maps.has(stage)) return maps.get(stage)!
  const map = buildMap(stage); maps.set(stage, map); return map
}
function buildMap(stage: number): Tile[] {
  return Array.from({ length: COLS * ROWS }, (_, i): Tile => {
    const x = i % COLS, z = Math.floor(i / COLS)
    if (x === 0 || z === 0 || x === COLS - 1 || z === ROWS - 1) return 'wall'
    const lx = x % 40, lz = z % 32
    // Wide connected streets separate the districts; spawn lanes stay clear.
    if (x > 39 || z > 31) {
      if (lx < 5 || lz < 5 || lx > 35 || lz > 28) return 'road'
      const district = (Math.floor(x / 40) + Math.floor(z / 32) + stage) % 3
      if (district === 0) {
        if (lx >= 14 && lx <= 28 && lz >= 10 && lz <= 19) return lz >= 14 && lz <= 16 ? 'bridge' : 'water'
        return (x * 7 + z * 11) % 17 === 0 ? 'tree' : 'grass'
      }
      if (district === 1) {
        if (lx >= 10 && lx <= 16 && lz >= 8 && lz <= 13) return 'ruin'
        if (lx >= 25 && lx <= 30 && lz >= 20 && lz <= 24) return 'ruin'
        if (lx >= 23 && lx <= 27 && lz >= 9 && lz <= 12) return 'oil'
        if (lx === 11 && lz >= 21 && lz <= 24) return 'rock'
        return 'road'
      }
      if (lx >= 8 && lx <= 14 && lz >= 9 && lz <= 23) return 'grass'
      if (lx >= 20 && lx <= 28 && lz >= 10 && lz <= 14) return 'water'
      if (lx === 26 && lz >= 21 && lz <= 24) return 'rock'
      return 'road'
    }
    if ((x === 8 || x === 11) && (z === 7 || z === 9)) return 'tree'
    if (x >= 28 && x <= 31 && z >= 7 && z <= 9) return 'ruin'
    if (stage % 2 === 0 && z >= 14 && z <= 16) return (x >= 7 && x <= 11) || (x >= 28 && x <= 32) ? 'bridge' : 'water'
    if ((x >= 7 && x <= 12 && z >= 6 && z <= 10) || (x >= 27 && x <= 32 && z >= 21 && z <= 25)) return 'grass'
    if ((x >= 27 && x <= 32 && z >= 6 && z <= 10) || (x >= 7 && x <= 12 && z >= 21 && z <= 25)) return stage > 4 ? 'grass' : 'road'
    if ((z === 10 || z === 21) && x >= 17 && x <= 22) return 'rock'
    if (stage > 2 && (x === 15 || x === 24) && z >= 13 && z <= 18) return 'rock'
    if ((x >= 17 && x <= 20 && z >= 24 && z <= 25) || (stage > 3 && x >= 18 && x <= 21 && z >= 5 && z <= 6) || (stage === 8 && (x + z) % 13 === 0)) return 'oil'
    return 'road'
  })
}
export function tileIndex(x: number, z: number) { return Math.floor(z / TILE) * COLS + Math.floor(x / TILE) }
export function terrain(map: Tile[], world: World, x: number, z: number): Tile {
  if (x < 0 || z < 0 || x >= WIDTH || z >= HEIGHT) return 'wall'
  const i = tileIndex(x, z)
  return world.broken.includes(i) ? 'road' : map[i] || 'wall'
}
const solid = (tile: Tile) => tile === 'wall' || tile === 'water' || tile === 'rock' || tile === 'tree' || tile === 'ruin'
function hash(id: string) { return [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0) }
export function createCar(driver: Driver, index: number, bot = false): Car {
  return { id: driver.id, name: driver.name, bot, x: 9 + (index % 8) * 8, z: bot ? HEIGHT - 9 : 9 + Math.floor(index / 8) * 5, vx: 0, vz: 0, angle: bot ? -Math.PI / 2 : Math.PI / 2, hp: 100, score: 0, kills: 0, paint: bot ? '#ef5058' : PAINTS[hash(driver.id) % PAINTS.length]!, model: 0, turbo: 0, suspension: false, star: 2, spin: 0, hurt: 0, dead: 0, attacker: '' }
}
export function createWorld(drivers: Driver[], stage = 1, mode: Mode = 'coop'): World {
  const world: World = { protocol: 3, rev: 0, stage, mode, phase: 'playing', time: 0, kills: 0, goal: mode === 'coop' ? 8 + stage * 2 : 10, spawned: 0, cars: drivers.map((d, i) => createCar(d, i)), pickups: [], broken: [], sparks: [], winner: '' }
  const kinds: Pickup['kind'][] = ['fuel', 'turbo', 'suspension', 'star', 'flag']
  const positions = [[20, 35], [59, 22], [9, 48], [68, 48], [40, 34]]
  kinds.forEach((kind, i) => world.pickups.push({ id: `item-${i}`, x: positions[i]![0]!, z: positions[i]![1]!, kind }))
  const map = makeMap(stage)
  for (let z = 12; z < ROWS - 5; z += 16) for (let x = 44; x < COLS - 5; x += 20) {
    const i = z * COLS + x
    if (!solid(map[i]!)) world.pickups.push({ id: `supply-${i}`, x: x * TILE + 1, z: z * TILE + 1, kind: kinds[(x + z) % 4]! })
  }
  return world
}
export function syncDrivers(world: World, drivers: Driver[]) {
  world.cars = world.cars.filter(c => c.bot || drivers.some(d => d.id === c.id))
  for (const [index, driver] of drivers.entries()) {
    const car = world.cars.find(c => c.id === driver.id)
    if (car) car.name = driver.name
    else world.cars.push(createCar(driver, index))
  }
}
export function normalizeInput(value: unknown): Input | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  if (typeof v.x !== 'number' || typeof v.z !== 'number' || !Number.isFinite(v.x) || !Number.isFinite(v.z)) return null
  return { x: clamp(v.x, -1, 1), z: clamp(v.z, -1, 1), gas: v.gas === true, brake: v.brake === true }
}
export function moveCar(car: Car, input: Input, dt: number, map: Tile[], world: World, damage?: (car: Car, amount: number, attacker?: string) => void) {
  if (car.hp <= 0) return
  const ground = terrain(map, world, car.x, car.z)
  if (ground === 'oil' && car.spin <= 0) car.spin = 0.7
  if (car.spin > 0) { car.angle += dt * 9; car.spin = Math.max(0, car.spin - dt) }
  else if (input.x || input.z) car.angle += angleDelta(car.angle, Math.atan2(input.z, input.x)) * Math.min(1, dt * 12)
  const top = (car.model === 1 ? 17 : car.model === 2 ? 13 : 15) + (car.turbo > 0 ? 6 : 0)
  const speed = (input.brake ? 0 : input.gas ? top : 5) * (ground === 'grass' && !car.suspension ? 0.43 : 1)
  const traction = car.spin > 0 ? 0.6 : input.brake ? 13 : 4.2
  car.vx += (Math.cos(car.angle) * speed - car.vx) * Math.min(1, dt * traction)
  car.vz += (Math.sin(car.angle) * speed - car.vz) * Math.min(1, dt * traction)
  const radius = 0.78
  for (const axis of ['x', 'z'] as const) {
    const v = axis === 'x' ? car.vx : car.vz
    const next = car[axis] + v * dt
    const x = axis === 'x' ? next : car.x, z = axis === 'z' ? next : car.z
    const samples = [[x - radius, z], [x + radius, z], [x, z - radius], [x, z + radius]]
    const blocked = samples.find(([sx, sz]) => solid(terrain(map, world, sx!, sz!)))
    if (blocked) {
      const nose = axis === 'x' ? Math.cos(car.angle) * Math.sign(v) : Math.sin(car.angle) * Math.sign(v)
      if (Math.abs(v) > 6 && nose < 0.6) damage?.(car, Math.abs(v) * 1.7, car.attacker)
      const index = tileIndex(blocked[0]!, blocked[1]!)
      if (damage && map[index] === 'rock' && Math.abs(v) > 13 && !world.broken.includes(index)) world.broken.push(index)
      if (axis === 'x') car.vx *= -0.5; else car.vz *= -0.5
    } else car[axis] = next
  }
}
export class BattleSimulation {
  map: Tile[]
  inputs = new Map<string, Input>()
  private routes = new Map<string, { until: number; path: number[] }>()
  private contacts = new Map<string, number>()
  constructor(public world: World) { this.map = makeMap(world.stage) }
  reset(drivers: Driver[], stage = this.world.stage, mode = this.world.mode) {
    const previous = this.world
    this.world = createWorld(drivers, stage, mode)
    this.world.rev = previous.rev + 1
    if (stage > previous.stage) for (const car of this.world.cars) {
      const old = previous.cars.find(c => c.id === car.id)
      if (old) { car.score = old.score; car.kills = old.kills; car.model = old.model; car.suspension = old.suspension }
    }
    this.map = makeMap(stage); this.contacts.clear(); this.routes.clear()
  }
  private navigate(car: Car, target: Car): number {
    let route = this.routes.get(car.id)
    if (!route || route.until < this.world.time) {
      const start = tileIndex(car.x, car.z), goal = tileIndex(target.x, target.z)
      const previous = new Int32Array(COLS * ROWS).fill(-1), queue = [start]
      previous[start] = start
      for (let head = 0; head < queue.length && previous[goal] === -1; head++) {
        const current = queue[head]!, x = current % COLS, z = Math.floor(current / COLS)
        for (const [nx, nz] of [[x + 1, z], [x - 1, z], [x, z + 1], [x, z - 1]]) {
          if (nx! < 1 || nz! < 1 || nx! >= COLS - 1 || nz! >= ROWS - 1) continue
          const next = nz! * COLS + nx!
          if (previous[next] !== -1 || solid(terrain(this.map, this.world, nx! * TILE + 1, nz! * TILE + 1))) continue
          previous[next] = current; queue.push(next)
        }
      }
      const path: number[] = []
      if (previous[goal] !== -1) for (let at = goal; at !== start; at = previous[at]!) path.push(at)
      route = { until: this.world.time + 1.2, path: path.reverse() }; this.routes.set(car.id, route)
    }
    while (route.path.length && Math.hypot((route.path[0]! % COLS) * TILE + 1 - car.x, Math.floor(route.path[0]! / COLS) * TILE + 1 - car.z) < 1.2) route.path.shift()
    const next = route.path[0]
    return next === undefined ? Math.atan2(target.z - car.z, target.x - car.x) : Math.atan2(Math.floor(next / COLS) * TILE + 1 - car.z, (next % COLS) * TILE + 1 - car.x)
  }
  damage = (car: Car, amount: number, attacker = '') => {
    if (car.hp <= 0 || car.hurt > 0 || car.star > 0) return
    car.hp = Math.max(0, car.hp - Math.round(amount)); car.hurt = 0.48; car.attacker = attacker
    this.world.sparks.push({ id: this.world.rev * 100 + this.world.sparks.length, x: car.x, z: car.z, age: 0, big: car.hp === 0 })
    if (car.hp === 0) {
      car.dead = 3
      const killer = this.world.cars.find(c => c.id === attacker)
      if (killer) { killer.kills++; killer.score += 200 }
      if (car.bot && this.world.mode === 'coop') {
        this.world.kills++
        if (this.world.kills % 3 === 0) this.world.pickups.push({ id: `drop-${this.world.rev}`, x: car.x, z: car.z, kind: this.world.kills % 9 === 0 ? 'crown' : 'flag' })
      }
      if (this.world.mode === 'versus' && killer && killer.kills >= this.world.goal) { this.world.phase = 'clear'; this.world.winner = killer.name }
    }
  }
  step(dt: number) {
    const w = this.world
    if (w.phase !== 'playing') return
    w.time += dt; w.rev++
    w.sparks = w.sparks.filter(s => (s.age += dt) < 0.65)
    for (const [key, end] of this.contacts) if (end < w.time) this.contacts.delete(key)
    for (const id of this.routes.keys()) if (!w.cars.some(c => c.id === id && c.hp > 0)) this.routes.delete(id)
    const humans = w.cars.filter(c => !c.bot)
    if (w.mode === 'coop' && humans.length > 0 && humans.every(c => c.hp <= 0)) { w.phase = 'over'; return }
    const wanted = w.mode === 'coop' ? Math.min(4, w.goal - w.kills) : humans.length < 2 ? 3 : 0
    if (w.mode === 'versus' && humans.length >= 2) w.cars = w.cars.filter(c => !c.bot)
    while (w.cars.filter(c => c.bot && c.hp > 0).length < wanted) {
      const serial = ++w.spawned
      const bot = createCar({ id: `cpu-${serial}`, name: `敌车 ${serial}` }, (serial * 3) % 8, true)
      const anchor = humans.filter(c => c.hp > 0)[serial % Math.max(1, humans.filter(c => c.hp > 0).length)]
      if (anchor) {
        for (let n = 0; n < 40; n++) {
          const angle = (serial * 2.4 + n) * 0.8
          const x = clamp(anchor.x + Math.cos(angle) * (22 + n % 8), 5, WIDTH - 5)
          const z = clamp(anchor.z + Math.sin(angle) * (22 + n % 8), 5, HEIGHT - 5)
          if (!solid(terrain(this.map, w, x, z)) && !w.cars.some(c => c.hp > 0 && Math.hypot(c.x - x, c.z - z) < 3)) { bot.x = x; bot.z = z; break }
        }
      }
      bot.hp = 35 + w.stage * 4; bot.model = serial % 3; w.cars.push(bot)
    }
    for (const car of w.cars) {
      car.hurt = Math.max(0, car.hurt - dt); car.star = Math.max(0, car.star - dt); car.turbo = Math.max(0, car.turbo - dt)
      if (car.hp <= 0) {
        car.dead -= dt
        if (!car.bot && car.dead <= 0 && (w.mode === 'versus' || humans.length > 1)) {
          const respawn = createCar(car, humans.findIndex(c => c.id === car.id))
          Object.assign(car, respawn, { score: car.score, kills: car.kills, model: car.model, star: 3 })
        }
        continue
      }
      let input = this.inputs.get(car.id) || idleInput()
      if (car.bot) {
        const targets = w.cars.filter(c => c.hp > 0 && c.id !== car.id && (w.mode === 'versus' || !c.bot))
        const target = targets.sort((a, b) => Math.hypot(a.x - car.x, a.z - car.z) - Math.hypot(b.x - car.x, b.z - car.z))[0]
        let heading = target ? this.navigate(car, target) : car.angle
        const blockedAhead = (a: number) => solid(terrain(this.map, w, car.x + Math.cos(a) * 3, car.z + Math.sin(a) * 3))
        if (blockedAhead(heading)) {
          for (const turn of [1, -1, 2, -2, 3, -3, 4]) if (!blockedAhead(heading + turn * Math.PI / 4)) { heading += turn * Math.PI / 4; break }
        }
        input = { x: Math.cos(heading), z: Math.sin(heading), gas: w.time % 3 > 0.8, brake: false }
      }
      moveCar(car, input, dt, this.map, w, this.damage)
    }
    const alive = w.cars.filter(c => c.hp > 0)
    for (let i = 0; i < alive.length; i++) for (let j = i + 1; j < alive.length; j++) {
      const a = alive[i]!, b = alive[j]!, dx = b.x - a.x, dz = b.z - a.z, distance = Math.hypot(dx, dz)
      if (distance >= 1.85) continue
      const nx = distance > 0.001 ? dx / distance : 1, nz = distance > 0.001 ? dz / distance : 0
      const overlap = (1.85 - distance) * 0.5
      a.x -= nx * overlap; a.z -= nz * overlap; b.x += nx * overlap; b.z += nz * overlap
      const key = [a.id, b.id].sort().join(':')
      if (this.contacts.has(key)) continue
      this.contacts.set(key, w.time + 0.5)
      const impact = Math.max(4, (a.vx - b.vx) * nx + (a.vz - b.vz) * nz)
      const noseA = Math.cos(a.angle) * nx + Math.sin(a.angle) * nz
      const noseB = -Math.cos(b.angle) * nx - Math.sin(b.angle) * nz
      const friendly = w.mode === 'coop' && a.bot === b.bot
      if (!friendly) {
        if (noseA > 0.45 || a.star > 0) this.damage(b, a.star > 0 ? 120 : impact * (noseB > 0.6 ? 0.4 : 2.4), a.id)
        if (noseB > 0.45 || b.star > 0) this.damage(a, b.star > 0 ? 120 : impact * (noseA > 0.6 ? 0.4 : 2.4), b.id)
      }
      a.vx -= nx * impact * 0.8; a.vz -= nz * impact * 0.8; b.vx += nx * impact * 0.8; b.vz += nz * impact * 0.8
      if (!friendly) { a.attacker = b.id; b.attacker = a.id }
    }
    for (const car of alive.filter(c => !c.bot)) {
      w.pickups = w.pickups.filter(item => {
        if (Math.hypot(car.x - item.x, car.z - item.z) > 1.8) return true
        car.score += item.kind === 'crown' ? 2000 : 100
        if (item.kind === 'fuel') car.hp = 100
        if (item.kind === 'turbo') car.turbo = 20
        if (item.kind === 'suspension') car.suspension = true
        if (item.kind === 'star') car.star = 8
        if (w.mode === 'coop' && (item.kind === 'flag' || item.kind === 'crown')) w.kills = Math.min(w.goal, w.kills + (item.kind === 'crown' ? 5 : 1))
        return false
      })
    }
    w.cars = w.cars.filter(c => !c.bot || c.hp > 0 || c.dead > 2.3)
    if (w.mode === 'coop' && w.kills >= w.goal) w.phase = w.stage === 8 ? 'complete' : 'clear'
    else if (w.mode === 'coop' && humans.length > 0 && humans.every(c => c.hp <= 0)) w.phase = 'over'
  }
}
