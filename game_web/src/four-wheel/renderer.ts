import * as THREE from 'three'
import { COLS, ROWS, TILE, WIDTH, HEIGHT, makeMap, clamp, angleDelta } from './simulation'
import type { Car, World, Tile } from './simulation'

// Orthographic 3D geometry, deliberately rendered at a limited resolution.
export class BattleRenderer {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-24, 24, 18, -18, 0.1, 200)
  private ground = new THREE.Group()
  private vehicles = new Map<string, THREE.Group>()
  private items = new Map<string, THREE.Group>()
  private effects = new THREE.Group()
  private terrainKey = ''
  private cameraX = 16
  private cameraZ = 16
  private observer: ResizeObserver
  private materials = new Map<string, THREE.MeshBasicMaterial>()
  private box = new THREE.BoxGeometry(1, 1, 1)
  private viewWidth = 48
  private viewHeight = 36
  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(1)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.scene.background = new THREE.Color('#12142c')
    this.scene.add(this.ground, this.effects)
    this.camera.up.set(0, 0, -1)
    this.observer = new ResizeObserver(() => this.resize())
    this.observer.observe(canvas)
    this.resize()
  }
  private material(color: string) {
    let material = this.materials.get(color)
    if (!material) { material = new THREE.MeshBasicMaterial({ color }); this.materials.set(color, material) }
    return material
  }
  private block(parent: THREE.Group, x: number, y: number, z: number, w: number, h: number, d: number, color: string) {
    const mesh = new THREE.Mesh(this.box, this.material(color))
    mesh.position.set(x, y, z); mesh.scale.set(w, h, d); parent.add(mesh)
    return mesh
  }
  private resize() {
    const rect = this.canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const resolution = Math.min(rect.width, 960)
    this.renderer.setSize(resolution, resolution * rect.height / rect.width, false)
    const aspect = rect.width / rect.height
    this.viewHeight = Math.min(HEIGHT, 44 / Math.min(1, aspect))
    this.viewWidth = Math.min(WIDTH, this.viewHeight * aspect)
    this.viewHeight = this.viewWidth / aspect
    this.camera.left = -this.viewWidth / 2; this.camera.right = this.viewWidth / 2
    this.camera.top = this.viewHeight / 2; this.camera.bottom = -this.viewHeight / 2
    this.camera.updateProjectionMatrix()
  }
  private terrain(world: World) {
    this.ground.traverse(object => {
      const mesh = object as THREE.Mesh
      if (mesh instanceof THREE.InstancedMesh) mesh.dispose()
      if (mesh.geometry && mesh.geometry !== this.box) mesh.geometry.dispose()
      const mat = mesh.material as THREE.MeshBasicMaterial | undefined
      if (mat?.map) { mat.map.dispose(); mat.dispose() }
    })
    this.ground.clear()
    const map = makeMap(world.stage)
    const surface = document.createElement('canvas'); surface.width = COLS * 16; surface.height = ROWS * 16
    const ctx = surface.getContext('2d')!
    const winter = world.stage > 6, autumn = world.stage > 4
    const brick = winter ? '#607fa0' : autumn ? '#825333' : '#74611e'
    const mortar = winter ? '#283856' : '#1c1d20'
    for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
      const index = row * COLS + col, tile: Tile = world.broken.includes(index) ? 'road' : map[index]!
      const x = col * 16, y = row * 16
      ctx.fillStyle = mortar; ctx.fillRect(x, y, 16, 16)
      ctx.fillStyle = brick; ctx.fillRect(x + 1, y + 1, 14, 6); ctx.fillRect(x, y + 9, 7, 6); ctx.fillRect(x + 9, y + 9, 7, 6)
      ctx.fillStyle = winter ? '#a2b7c6' : '#bca34b'; ctx.fillRect(x + 2, y + 1, 12, 1); ctx.fillRect(x, y + 9, 6, 1)
      if (tile === 'grass' || tile === 'tree') {
        ctx.fillStyle = winter ? '#d0dfeb' : autumn ? '#be852f' : '#80d34d'; ctx.fillRect(x, y, 16, 16)
        ctx.fillStyle = winter ? '#95b8c6' : autumn ? '#866e29' : '#3a922e'
        for (let n = 0; n < 20; n++) ctx.fillRect(x + ((n * 7 + col) % 15), y + ((n * 11 + row) % 15), 1, 2)
      }
      if (tile === 'water') {
        ctx.fillStyle = '#333dd0'; ctx.fillRect(x, y, 16, 16); ctx.fillStyle = '#7888f8'
        for (let n = 0; n < 10; n++) ctx.fillRect(x + (n * 7 % 14), y + ((n * 5 + col) % 14), 2, 3)
      }
      if (tile === 'bridge') {
        ctx.fillStyle = '#ccad4b'; ctx.fillRect(x, y, 16, 16)
        for (let n = 0; n < 16; n += 4) { ctx.fillStyle = '#544520'; ctx.fillRect(x + n, y, 1, 16); ctx.fillStyle = '#edce72'; ctx.fillRect(x + n + 1, y, 1, 16) }
      }
      if (tile === 'oil') {
        ctx.fillStyle = '#111424'; ctx.fillRect(x + 1, y + 4, 14, 9); ctx.fillRect(x + 3, y + 1, 10, 14)
        ctx.fillStyle = '#514077'; ctx.fillRect(x + 4, y + 5, 6, 2)
      }
      const wx = col * TILE + 1, wz = row * TILE + 1
      if (tile === 'wall') {
        this.block(this.ground, wx, 0.7, wz, 1.9, 1.2, 1.9, '#23304b')
        this.block(this.ground, wx, 1.4, wz, 1.8, 0.2, 1.8, '#f5f2dd')
        this.block(this.ground, wx, 1.55, wz, 1.5, 0.1, 0.3, '#7890a1')
      }
      if (tile === 'tree') {
        this.block(this.ground, wx, 0.1, wz, 1.95, 0.12, 1.95, '#325541')
        this.block(this.ground, wx, 0.9, wz, 0.4, 1.8, 0.4, '#715032')
        this.block(this.ground, wx, 1.8, wz, 1.7, 0.6, 1.7, winter ? '#d4e8e1' : autumn ? '#ab672d' : '#326838')
        this.block(this.ground, wx - 0.2, 2.2, wz - 0.2, 1.2, 0.3, 1.2, winter ? '#f1f7ee' : autumn ? '#daa74c' : '#71a957')
      }
      if (tile === 'ruin') {
        this.block(this.ground, wx, 1, wz, 1.94, 2, 1.94, '#53555a')
        this.block(this.ground, wx, 2.1, wz, 1.86, 0.2, 1.86, '#a7997c')
        this.block(this.ground, wx - 0.3, 2.3, wz, 0.9, 0.3, 1.3, '#695e55')
        this.block(this.ground, wx + 0.55, 2.31, wz, 0.3, 0.3, 0.8, '#bbd4d2')
      }
      if (tile === 'road' && col % 40 === 2 && row % 4 < 2) {
        ctx.fillStyle = '#d4c692'; ctx.fillRect(x + 7, y + 2, 2, 12)
      }
      if (tile === 'grass' && (col * 13 + row * 7) % 11 === 0) {
        for (let n = 0; n < 4; n++) { ctx.fillStyle = n % 2 ? '#f3d170' : '#ed9da7'; ctx.fillRect(x + 2 + n * 3, y + 3 + n % 2 * 7, 2, 2) }
      }
      if (tile === 'road' && col % 40 === 6 && row % 32 === 6) {
        this.block(this.ground, wx, 0.3, wz, 0.85, 0.6, 0.85, '#d5753e')
        this.block(this.ground, wx, 0.66, wz, 0.45, 0.15, 0.45, '#f0e5b7')
      }
      if (tile === 'rock') {
        this.block(this.ground, wx, 0.55, wz, 1.8, 1.1, 1.8, '#676277')
        this.block(this.ground, wx - 0.15, 1.15, wz - 0.15, 1.5, 0.16, 1.5, '#bbc1cf')
        this.block(this.ground, wx + 0.3, 1.25, wz, 0.18, 0.1, 1.2, '#868494')
      }
    }
    // Batch the static scenery by color so a tenfold world does not mean thousands of draw calls.
    const batches = new Map<THREE.Material, THREE.Mesh[]>()
    for (const object of [...this.ground.children]) {
      const mesh = object as THREE.Mesh
      if (mesh.geometry !== this.box) continue
      const material = mesh.material as THREE.Material
      if (!batches.has(material)) batches.set(material, [])
      batches.get(material)!.push(mesh)
    }
    for (const [material, meshes] of batches) {
      const batch = new THREE.InstancedMesh(this.box, material, meshes.length)
      meshes.forEach((mesh, i) => { mesh.updateMatrix(); batch.setMatrixAt(i, mesh.matrix); this.ground.remove(mesh) })
      batch.computeBoundingSphere(); this.ground.add(batch)
    }
    const texture = new THREE.CanvasTexture(surface)
    texture.colorSpace = THREE.SRGBColorSpace; texture.magFilter = THREE.NearestFilter; texture.minFilter = THREE.NearestFilter
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(WIDTH, HEIGHT), new THREE.MeshBasicMaterial({ map: texture }))
    plane.rotation.x = -Math.PI / 2; plane.position.set(WIDTH / 2, -0.02, HEIGHT / 2); this.ground.add(plane)
  }
  private carMesh(car: Car, mine: boolean) {
    const group = new THREE.Group()
    group.userData.design = `${car.paint}-${car.model}-${car.name}`
    this.block(group, 0, 0.06, 0.08, 2.4, 0.1, 1.65, '#202033')
    for (const x of [-0.7, 0.7]) for (const z of [-0.72, 0.72]) {
      this.block(group, x, 0.25, z, 0.6, 0.48, 0.4, '#111322')
      this.block(group, x, 0.51, z, 0.4, 0.05, 0.28, '#607186')
    }
    this.block(group, 0, 0.36, 0, 1.9, 0.45, 0.94, car.paint)
    this.block(group, 0.38, 0.65, 0, 0.95, 0.16, car.model === 1 ? 0.48 : 0.8, car.paint)
    this.block(group, -0.25, 0.69, 0, 0.55, 0.22, 0.58, '#2d5389')
    this.block(group, -0.2, 0.82, -0.12, 0.34, 0.04, 0.16, '#80e0ef')
    this.block(group, 0.65, 0.75, 0, 0.55, 0.06, 0.16, '#f17b5c')
    this.block(group, -0.91, 0.73, 0, 0.22, 0.18, car.model === 2 ? 1.8 : 1.55, car.paint)
    for (const x of [-1.1, 1.12]) {
      this.block(group, x, 0.3, 0, 0.16, 0.16, 1.85, '#c9dedb')
      for (const z of [-0.91, 0.91]) this.block(group, x, 0.4, z, 0.28, 0.12, 0.28, '#48d3df')
    }
    if (mine) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.56, 24), this.material('#fce45d'))
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; group.add(ring)
    }
    this.scene.add(group); return group
  }
  render(world: World, selfId: string, dt: number, predicted?: Car) {
    const key = `${world.stage}:${world.broken.join(',')}`
    if (key !== this.terrainKey) { this.terrainKey = key; this.terrain(world) }
    for (const [id, mesh] of this.vehicles) if (!world.cars.some(c => c.id === id)) { this.disposeGroup(mesh); this.vehicles.delete(id) }
    for (const authoritative of world.cars) {
      const car = authoritative.id === selfId && predicted ? predicted : authoritative
      let mesh = this.vehicles.get(car.id)
      if (mesh && mesh.userData.design !== `${car.paint}-${car.model}-${car.name}`) { this.disposeGroup(mesh); this.vehicles.delete(car.id); mesh = undefined }
      if (!mesh) { mesh = this.carMesh(car, car.id === selfId); mesh.position.set(car.x, 0, car.z); this.vehicles.set(car.id, mesh) }
      const blend = car.id === selfId ? 1 : Math.min(1, dt * 18)
      if (Math.hypot(mesh.position.x - car.x, mesh.position.z - car.z) > 7) mesh.position.set(car.x, 0, car.z)
      mesh.position.x += (car.x - mesh.position.x) * blend; mesh.position.z += (car.z - mesh.position.z) * blend
      mesh.rotation.y += angleDelta(mesh.rotation.y, -car.angle) * blend
      mesh.visible = car.hp > 0 && !(car.hurt > 0 && Math.floor(world.time * 20) % 2)
      mesh.position.y = car.star > 0 ? 0.09 + Math.sin(world.time * 16) * 0.08 : 0
    }
    for (const [id, mesh] of this.items) if (!world.pickups.some(i => i.id === id)) { this.disposeGroup(mesh); this.items.delete(id) }
    const itemColors = { fuel: '#eb5252', turbo: '#51bdf5', suspension: '#67de88', star: '#ffff7c', flag: '#ecab4a', crown: '#ffe471' }
    const glyphs = { fuel: '+', turbo: 'T', suspension: 'S', star: '★', flag: '⚑', crown: '♛' }
    for (const item of world.pickups) {
      let mesh = this.items.get(item.id)
      if (!mesh) {
        mesh = new THREE.Group(); this.block(mesh, 0, 0.35, 0, 1.5, 0.5, 1.5, itemColors[item.kind])
        const c = document.createElement('canvas'); c.width = c.height = 64
        const ctx = c.getContext('2d')!; ctx.fillStyle = '#12142c'; ctx.font = 'bold 52px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(glyphs[item.kind], 32, 34)
        const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter
        const label = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), new THREE.MeshBasicMaterial({ map: t, transparent: true }))
        label.rotation.x = -Math.PI / 2; label.position.y = 0.7; mesh.add(label)
        mesh.position.set(item.x, 0, item.z); this.scene.add(mesh); this.items.set(item.id, mesh)
      }
      mesh.position.y = 0.1 + Math.sin(world.time * 4) * 0.1
    }
    this.effects.clear()
    for (const spark of world.sparks) for (let n = 0; n < 8; n++) {
      const angle = n * Math.PI / 4, r = spark.age * (spark.big ? 7 : 4)
      this.block(this.effects, spark.x + Math.cos(angle) * r, 0.9, spark.z + Math.sin(angle) * r, 0.3, 0.3, 0.3, n % 2 ? '#ffee8a' : '#ed6742')
    }
    const me = predicted || world.cars.find(c => c.id === selfId)
    if (me) {
      const cx = clamp(me.x, this.viewWidth / 2, WIDTH - this.viewWidth / 2)
      const cz = clamp(me.z, this.viewHeight / 2, HEIGHT - this.viewHeight / 2)
      const blend = 1 - Math.exp(-dt * 8)
      this.cameraX += (cx - this.cameraX) * blend; this.cameraZ += (cz - this.cameraZ) * blend
    }
    this.camera.position.set(this.cameraX, 90, this.cameraZ); this.camera.lookAt(this.cameraX, 0, this.cameraZ)
    this.renderer.render(this.scene, this.camera)
  }
  private disposeGroup(group: THREE.Group) {
    group.traverse(object => {
      const mesh = object as THREE.Mesh
      if (mesh instanceof THREE.InstancedMesh) mesh.dispose()
      if (mesh.geometry && mesh.geometry !== this.box) mesh.geometry.dispose()
      const mat = mesh.material as THREE.MeshBasicMaterial | undefined
      if (mat?.map) { mat.map.dispose(); mat.dispose() }
    })
    this.scene.remove(group)
  }
  dispose() {
    this.observer.disconnect()
    for (const group of [...this.vehicles.values(), ...this.items.values(), this.ground]) this.disposeGroup(group)
    this.box.dispose(); for (const material of this.materials.values()) material.dispose()
    this.renderer.dispose(); this.renderer.forceContextLoss()
  }
}
