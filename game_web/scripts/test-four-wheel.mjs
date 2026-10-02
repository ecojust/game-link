import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

const directory = await mkdtemp(join(tmpdir(), 'gamelink-fc-'))
const source = await readFile(new URL('../src/gamesource/four-wheel/simulation.ts', import.meta.url), 'utf8')
const moduleFile = join(directory, 'simulation.mjs')
await writeFile(moduleFile, ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText)
const { createWorld, BattleSimulation, makeMap, moveCar, idleInput, syncDrivers, normalizeInput } = await import(pathToFileURL(moduleFile))
const players = [{ id: 'one', name: '一号' }, { id: 'two', name: '二号' }]
const parked = { ...idleInput(), brake: true }
function arena() {
  const sim = new BattleSimulation(createWorld(players, 1, 'versus'))
  sim.world.pickups = []
  sim.world.cars.forEach(c => { c.star = 0; sim.inputs.set(c.id, parked) })
  return sim
}

await test('side impact damages victim and repeated contact is not counted every frame', () => {
  const sim = arena(), [a, b] = sim.world.cars
  Object.assign(a, { x: 30, z: 25, angle: 0, vx: 15, vz: 0 })
  Object.assign(b, { x: 31.5, z: 25, angle: Math.PI / 2, vx: 0, vz: 0 })
  sim.step(1 / 60)
  assert.ok(b.hp < 100); assert.equal(a.hp, 100)
  const hp = b.hp
  Object.assign(a, { x: 30, z: 25 }); Object.assign(b, { x: 31.5, z: 25 })
  sim.step(1 / 60); assert.equal(b.hp, hp)
})
await test('front wall collision is protected; sideways wall collision costs life', () => {
  const sim = arena(), car = sim.world.cars[0]
  Object.assign(car, { x: 3, z: 12, angle: Math.PI, vx: -18, vz: 0 })
  moveCar(car, idleInput(), 0.04, sim.map, sim.world, sim.damage)
  assert.equal(car.hp, 100)
  Object.assign(car, { x: 3, z: 12, angle: Math.PI / 2, vx: -18, vz: 0 })
  moveCar(car, idleInput(), 0.04, sim.map, sim.world, sim.damage)
  assert.ok(car.hp < 100)
})
await test('suspension removes grass slowdown and oil causes spin', () => {
  const w = createWorld(players), map = makeMap(1), a = w.cars[0], b = structuredClone(a)
  Object.assign(a, { x: 18, z: 15, angle: 0, vx: 0, vz: 0 }); Object.assign(b, a, { suspension: true })
  const gas = { ...idleInput(), gas: true }
  moveCar(a, gas, 0.1, map, w); moveCar(b, gas, 0.1, map, w)
  assert.ok(b.vx > a.vx * 2)
  Object.assign(a, { x: 35, z: 49, spin: 0 }); moveCar(a, gas, 0.1, map, w); assert.ok(a.spin > 0)
})
await test('fuel is collected only once and restores life', () => {
  const sim = arena(), car = sim.world.cars[0]
  car.hp = 10; sim.world.pickups = [{ id: 'fuel', kind: 'fuel', x: car.x, z: car.z }]
  sim.step(1 / 60); assert.equal(car.hp, 100); assert.equal(sim.world.pickups.length, 0)
  const score = car.score; sim.step(1 / 60); assert.equal(car.score, score)
})
await test('co-op clear and final clear advance; continue restores current stage', () => {
  const sim = new BattleSimulation(createWorld(players))
  sim.world.kills = sim.world.goal; sim.step(1 / 60); assert.equal(sim.world.phase, 'clear')
  sim.reset(players, 8); sim.world.kills = sim.world.goal; sim.step(1 / 60); assert.equal(sim.world.phase, 'complete')
  sim.reset(players, 5); sim.world.cars.forEach(c => c.hp = 0); sim.step(1 / 60); assert.equal(sim.world.phase, 'over')
  sim.reset(players); assert.equal(sim.world.stage, 5); assert.equal(sim.world.cars[0].hp, 100)
})
await test('later joins preserve ongoing combat and replicas preserve world state', () => {
  const sim = arena(); sim.world.cars[0].hp = 48; sim.world.kills = 3
  syncDrivers(sim.world, [...players, { id: 'three', name: '三号' }]); assert.equal(sim.world.cars.length, 3); assert.equal(sim.world.cars[0].hp, 48)
  const replica = new BattleSimulation(structuredClone(sim.world))
  syncDrivers(replica.world, players.slice(1)); assert.equal(replica.world.kills, 3); assert.equal(replica.world.cars[0].id, 'two')
})
await test('invalid input rejected and finite axes are bounded', () => {
  assert.equal(normalizeInput({ x: NaN, z: 0 }), null)
  assert.equal(normalizeInput({ x: '1', z: 0 }), null)
  assert.deepEqual(normalizeInput({ x: 500, z: -500, gas: 'true', brake: true }), { x: 1, z: -1, gas: false, brake: true })
})
await rm(directory, { recursive: true, force: true })
