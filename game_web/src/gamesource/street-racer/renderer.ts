import * as THREE from 'three'
import { CENTERS, ROAD_WIDTH, TRACK_SAMPLES, TRACK, trackPose, angleDelta, nearestTrack } from './simulation'
import type { CarState, WireCar } from './simulation'

const PAINTS=[0x28d8eb,0xff563d,0xffc857,0xb182ff,0x87dfae,0xf47ebc,0xeeeeee,0x2e81f1]
const random=(n:number)=>{const x=Math.sin(n*127.1+31.7)*43758.5453;return x-Math.floor(x)}
function mat(color:number,metalness=.0,roughness=.65){return new THREE.MeshStandardMaterial({color,metalness,roughness})}
function glow(color:number){return new THREE.MeshBasicMaterial({color})}
function box(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.Material):THREE.Mesh<THREE.BufferGeometry,THREE.Material>{
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh
}
function carModel(color:number) {
  const car=new THREE.Group(),body=mat(color,.65,.24),dark=mat(0x080e17,.3,.35),glass=mat(0x152d45,.8,.13),rubber=mat(0x101115,0,.9),chrome=mat(0x8b9bae,.95,.2)
  const chassis=box(car,2.02,.52,4.45,0,.58,0,body)
  // Chamfered body contours: low nose, wide rear, tapered glass cabin.
  chassis.geometry.dispose()
  const outline=new THREE.Shape();outline.moveTo(-.83,-2.26);outline.lineTo(.83,-2.26);outline.lineTo(1.02,-1.55);outline.lineTo(1.02,1.58);outline.lineTo(.87,2.12);outline.lineTo(-.87,2.12);outline.lineTo(-1.02,1.58);outline.lineTo(-1.02,-1.55);outline.closePath()
  const geo=new THREE.ExtrudeGeometry(outline,{depth:.38,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.11,bevelThickness:.11});geo.rotateX(Math.PI/2)
  chassis.geometry=geo;chassis.position.y=.82
  box(car,1.72,.38,1.6,0,.97,.2,glass)
  box(car,1.45,.08,1.13,0,1.21,.38,body)
  const windshield=box(car,1.64,.05,.72,0,1.04,-.79,glass);windshield.rotation.x=-.42
  const rear=box(car,1.5,.06,.52,0,1.04,1.14,glass);rear.rotation.x=.42
  box(car,1.85,.08,.18,0,.96,1.96,dark)
  box(car,.08,.26,.1,-.7,.79,1.96,dark);box(car,.08,.26,.1,.7,.79,1.96,dark)
  box(car,1.8,.12,.16,0,.28,-2.15,dark);box(car,1.8,.15,.15,0,.27,2.02,dark)
  for(const x of [-.59,.59]){
    box(car,.62,.075,.07,x,.65,-2.4,glow(0xc7faff))
    box(car,.68,.075,.075,x,.67,2.26,glow(0xff393f))
    box(car,.08,.025,1.56,x*.43,.846,-1.37,dark)
  }
  box(car,1.4,.035,.065,0,.68,2.27,glow(0xff323f))
  for(const x of [-.6,.6]){
    const beamGeo=new THREE.BufferGeometry();beamGeo.setAttribute('position',new THREE.Float32BufferAttribute([x,.08,-2.4,x-4,.08,-30,x+4,.08,-30],3))
    car.add(new THREE.Mesh(beamGeo,new THREE.MeshBasicMaterial({color:0xb5e5ff,transparent:true,opacity:.035,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending})))
  }
  const wheels:THREE.Group[]=[]
  for(const x of [-1.01,1.01])for(const z of [-1.38,1.36]){
    const wheel=new THREE.Group();wheel.position.set(x,.4,z)
    const tire=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.3,16),rubber);tire.rotation.z=Math.PI/2;wheel.add(tire)
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.32,10),chrome);rim.rotation.z=Math.PI/2;wheel.add(rim);car.add(wheel);wheels.push(wheel)
  }
  const underglow=box(car,1.6,.025,3.3,0,.11,0,glow(color));underglow.material.transparent=true;underglow.material.opacity=.45
  const flame=new THREE.Group()
  for(const x of [-.57,.57]){
    const mesh=new THREE.Mesh(new THREE.ConeGeometry(.15,1.3,8),glow(0x6eefff));mesh.rotation.x=Math.PI/2;mesh.position.set(x,.35,2.67);flame.add(mesh)
  }
  flame.visible=false;car.add(flame)
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(2.5,5.3),new THREE.MeshBasicMaterial({color:0x000009,transparent:true,opacity:.48,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.055;car.add(shadow)
  return {car,wheels,flame}
}
function roadRibbon(offset:number,width:number,y:number,material:THREE.Material){
  const vertices:number[]=[],uvs:number[]=[],indices:number[]=[]
  for(let i=0;i<=TRACK_SAMPLES;i++){
    const pose=trackPose(i/TRACK_SAMPLES),nx=Math.cos(pose.heading),nz=Math.sin(pose.heading)
    for(const edge of [-.5,.5]){const lateral=offset+width*edge;vertices.push(pose.x+nx*lateral,y,pose.z+nz*lateral);uvs.push(edge+.5,i/12)}
    if(i<TRACK_SAMPLES){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2)}
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals()
  return new THREE.Mesh(geo,material)
}
function asphaltTexture(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d')!
  ctx.fillStyle='#353e50';ctx.fillRect(0,0,128,128)
  for(let i=0;i<4500;i++){const v=35+Math.floor(random(i)*65);ctx.fillStyle=`rgba(${v},${v+5},${v+13},.18)`;ctx.fillRect(random(i+5000)*128,random(i+9999)*128,1,1)}
  const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(4,1);texture.colorSpace=THREE.SRGBColorSpace;return texture
}
function labelTexture(text:string){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d')!
  ctx.fillStyle='#10142b';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#50e3ff';ctx.lineWidth=4;ctx.strokeRect(3,3,506,122)
  ctx.fillStyle='#d9fcff';ctx.font='bold 42px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,65)
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t
}
export class RaceRenderer {
  readonly scene=new THREE.Scene()
  readonly camera=new THREE.PerspectiveCamera(58,1,.1,1200)
  readonly renderer:THREE.WebGLRenderer
  private local=carModel(PAINTS[0]!)
  private remote=new Map<string,{model:ReturnType<typeof carModel>;current:WireCar;target:WireCar;seen:number}>()
  private bots:Array<{model:ReturnType<typeof carModel>;fraction:number;lane:number;speed:number}>=[]
  private resizeObserver:ResizeObserver
  private cameraReady=false
  private viewMode: 'chase'|'cockpit'='chase'
  private cockpit=new THREE.Group()
  private steeringWheel=new THREE.Group()
  private time=0
  private minimap:HTMLCanvasElement
  private buildingsMaterial=mat(0x1c2940,.35,.6)
  constructor(private host:HTMLCanvasElement,minimap:HTMLCanvasElement,mobile:boolean){
    this.minimap=minimap
    this.renderer=new THREE.WebGLRenderer({canvas:host,antialias:true,powerPreference:'high-performance'})
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:2))
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.35
    this.scene.background=new THREE.Color(0x111b35);this.scene.fog=new THREE.FogExp2(0x14213c,.0022)
    this.scene.add(new THREE.HemisphereLight(0x8bbdff,0x323244,2.2))
    const moonlight=new THREE.DirectionalLight(0xa7cfff,2.6);moonlight.position.set(-200,200,-160);this.scene.add(moonlight)
    const sunset=new THREE.DirectionalLight(0xfc739a,1);sunset.position.set(260,35,100);this.scene.add(sunset)
    this.world(mobile);this.scene.add(this.local.car)
    this.scene.add(this.camera);this.camera.add(this.cockpit)
    const trim=mat(0x101b28,.2,.55),rim=mat(0x26374b,.4,.4)
    box(this.cockpit,2.5,.35,.7,0,-.68,-.85,trim)
    box(this.cockpit,.62,.18,.03,-.3,-.46,-.6,glow(0x183c4c))
    for(const x of [-.49,-.28,-.07])box(this.cockpit,.12,.015,.015,x,-.44,-.575,glow(0x65e9ef))
    for(const x of [-1.02,1.02]){const pillar=box(this.cockpit,.08,1.5,.1,x,.04,-1.05,rim);pillar.rotation.z=x>0?.22:-.22}
    box(this.cockpit,2.4,.09,.12,0,.75,-1.05,trim)
    box(this.cockpit,.32,.11,.07,.32,.49,-.95,rim)
    this.steeringWheel.position.set(-.3,-.5,-.48)
    this.steeringWheel.add(new THREE.Mesh(new THREE.TorusGeometry(.22,.025,8,24),rim))
    for(const angle of [0,2.1,4.2]){const spoke=box(this.steeringWheel,.018,.2,.025,0,0,0,rim);spoke.rotation.z=angle}
    this.cockpit.add(this.steeringWheel);this.cockpit.visible=false
    for(let i=0;i<4;i++){const model=carModel(PAINTS[i+1]!);this.scene.add(model.car);this.bots.push({model,fraction:.04+i*.032,lane:[-6,-2,2,6][i]!,speed:19+i*2.6})}
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize()
  }
  setView(mode:'chase'|'cockpit'){
    if(this.viewMode===mode)return
    this.viewMode=mode;this.cameraReady=false
    this.local.car.visible=mode==='chase';this.cockpit.visible=mode==='cockpit'
  }
  private resize(){const r=this.host.getBoundingClientRect();this.renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);this.camera.aspect=Math.max(.1,r.width/Math.max(1,r.height));this.camera.updateProjectionMatrix()}
  private world(mobile:boolean){
    const scene=this.scene
    const sky=new THREE.Mesh(new THREE.SphereGeometry(1000,24,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,vertexShader:'varying vec3 v; void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 v;void main(){float h=normalize(v).y;vec3 c=mix(vec3(.29,.16,.27),vec3(.025,.065,.16),smoothstep(-.04,.5,h));gl_FragColor=vec4(c,1.);}'}));scene.add(sky)
    const moon=new THREE.Mesh(new THREE.SphereGeometry(15,24,16),glow(0xc8e1ff));moon.position.set(-360,320,-590);scene.add(moon)
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(2400,2400),mat(0x142337,.25,.58));ground.rotation.x=-Math.PI/2;ground.position.y=-.06;scene.add(ground)
    const asphalt=new THREE.MeshStandardMaterial({map:asphaltTexture(),color:0xaeb8cc,roughness:.43,metalness:.25,side:THREE.DoubleSide})
    scene.add(roadRibbon(0,ROAD_WIDTH,.02,asphalt))
    for(const side of [-1,1]){
      scene.add(roadRibbon(side*(ROAD_WIDTH/2+2),4,.03,mat(0x344458)))
      scene.add(roadRibbon(side*(ROAD_WIDTH/2-.3),.14,.047,glow(0xacc3d3)))
      scene.add(roadRibbon(side*(ROAD_WIDTH/2+4),.12,.075,glow(side===1?0x42d8e8:0xd675bb)))
    }
    // Instanced lane dashes, barriers, buildings and windows keep draw calls low.
    const dash=new THREE.InstancedMesh(new THREE.BoxGeometry(.13,.018,3.2),glow(0xbcc3b9),320)
    const curb=new THREE.InstancedMesh(new THREE.BoxGeometry(.62,.34,3.1),mat(0x45586e),320)
    const o=new THREE.Object3D()
    for(let i=0;i<320;i++){
      const pose=trackPose(i/320,i%2===0?-4:4);o.position.set(pose.x,.055,pose.z);o.rotation.set(0,-pose.heading,0);o.scale.set(1,1,1);o.updateMatrix();dash.setMatrixAt(i,o.matrix)
      const q=trackPose(i/320,(i%2?1:-1)*(ROAD_WIDTH/2+3.2));o.position.set(q.x,.2,q.z);o.rotation.y=-q.heading;o.updateMatrix();curb.setMatrixAt(i,o.matrix)
    }
    scene.add(dash,curb)
    const total=mobile?180:250,buildings=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),this.buildingsMaterial,total)
    const windows=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),glow(0x7ac6d8),total*18)
    let wi=0,bi=0
    for(let i=0;i<total;i++){
      const side=i%2?1:-1,pose=trackPose((i*.61803398875)%1,side*(35+random(i+25)*110)),w=12+random(i)*18,d=12+random(i+1)*18,h=14+random(i+2)**2*105
      if(nearestTrack(pose.x,pose.z).distance<Math.hypot(w,d)/2+ROAD_WIDTH/2+4)continue
      o.position.set(pose.x,h/2,pose.z);o.rotation.set(0,-pose.heading,0);o.scale.set(w,h,d);o.updateMatrix();buildings.setMatrixAt(bi,o.matrix);buildings.setColorAt(bi,new THREE.Color().setHSL(.59+random(i+5)*.04,.25,.09+random(i+6)*.055))
      bi++
      for(let j=0;j<18;j++){
        const col=j%3,row=Math.floor(j/3),local=new THREE.Vector3((col-1)*w*.25,(row+1)*h/7-h/2,-d/2-.035).applyAxisAngle(new THREE.Vector3(0,1,0),-pose.heading)
        o.position.set(pose.x+local.x,h/2+local.y,pose.z+local.z);o.scale.set(w*.1,1.1,.08);o.updateMatrix();windows.setMatrixAt(wi,o.matrix);windows.setColorAt(wi,new THREE.Color(random(i+j)>.68?0xf5b26d:0x73b4ce).multiplyScalar(.45+random(i+j+67)*.55));wi++
      }
    }
    buildings.count=bi;windows.count=wi;scene.add(buildings,windows)
    const poles=new THREE.InstancedMesh(new THREE.CylinderGeometry(.12,.15,7,6),mat(0x3a5069,.7,.45),64)
    const lights=new THREE.InstancedMesh(new THREE.BoxGeometry(2.5,.16,.65),glow(0xbaebff),64)
    for(let i=0;i<64;i++){
      const pose=trackPose(i/64,(i%2?1:-1)*(ROAD_WIDTH/2+2)),normal=new THREE.Vector3(Math.cos(pose.heading),0,Math.sin(pose.heading))
      o.position.set(pose.x,3.5,pose.z);o.rotation.set(0,-pose.heading,0);o.scale.set(1,1,1);o.updateMatrix();poles.setMatrixAt(i,o.matrix)
      o.position.addScaledVector(normal,i%2?-1:1);o.position.y=7;o.updateMatrix();lights.setMatrixAt(i,o.matrix)
      const pool=new THREE.Mesh(new THREE.PlaneGeometry(12,17),new THREE.MeshBasicMaterial({color:0x8cdeff,transparent:true,opacity:.045,depthWrite:false}));pool.position.set(pose.x,.07,pose.z);pool.rotation.set(-Math.PI/2,0,-pose.heading);scene.add(pool)
    }
    scene.add(poles,lights)
    // Finish gantry, chevrons and elevated advertisement boards.
    const start=trackPose(0),gantry=new THREE.Group();gantry.position.set(start.x,0,start.z);gantry.rotation.y=-start.heading
    box(gantry,.5,9,.5,-14,4.5,0,mat(0x688097,.65));box(gantry,.5,9,.5,14,4.5,0,mat(0x688097,.65))
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(28,4),new THREE.MeshBasicMaterial({map:labelTexture('MIDNIGHT / CIRCUIT'),side:THREE.DoubleSide}));sign.position.y=8;gantry.add(sign)
    for(let i=0;i<24;i++)for(let j=0;j<2;j++)box(gantry,1,.025,1,i-11.5,.09,j-.5,glow((i+j)%2?0x0e1626:0xd5e5ea))
    scene.add(gantry)
    for(let i=1;i<9;i++){
      const pose=trackPose(i/9,ROAD_WIDTH/2+4.7),group=new THREE.Group();group.position.set(pose.x,0,pose.z);group.rotation.y=-pose.heading
      box(group,.2,4,.2,0,2,0,mat(0x5d7183));const panel=new THREE.Mesh(new THREE.PlaneGeometry(5.4,1.8),new THREE.MeshBasicMaterial({map:labelTexture(i%2?'>>>   >>>':'NIGHT RUN'),side:THREE.DoubleSide}));panel.position.y=3.6;panel.rotation.y=-Math.PI/2;group.add(panel);scene.add(group)
    }
  }
  trafficPositions(){return [...this.bots.map(b=>({x:b.model.car.position.x,z:b.model.car.position.z})),...Array.from(this.remote.values()).filter(e=>performance.now()-e.seen<1500).map(e=>({x:e.current.x,z:e.current.z}))]}
  setLocalPaint(index:number){const old=this.local;this.scene.remove(old.car);this.disposeObject(old.car);this.local=carModel(PAINTS[index%PAINTS.length]!);this.scene.add(this.local.car)}
  receive(id:string,state:WireCar,index:number){
    let entry=this.remote.get(id)
    if(!entry){const model=carModel(PAINTS[index%PAINTS.length]!);this.scene.add(model.car);entry={model,current:{...state},target:{...state},seen:performance.now()};this.remote.set(id,entry)}
    entry.target={...state};entry.seen=performance.now()
  }
  removeMissing(ids:Set<string>){for(const[id,e]of this.remote)if(!ids.has(id)){this.scene.remove(e.model.car);this.disposeObject(e.model.car);this.remote.delete(id)}}
  private pose(model:ReturnType<typeof carModel>,state:WireCar|CarState,dt:number){
    model.car.position.set(state.x,.03+Math.sin(this.time*20)*Math.min(.025,Math.abs(state.speed)*.0006),state.z);model.car.rotation.y=-state.heading
    model.car.rotation.z=('steer' in state?state.steer:0)*Math.min(.045,Math.abs(state.speed)*.001)
    model.flame.visible=state.boosting;model.flame.scale.z=.8+Math.sin(this.time*70)*.25
    for(let i=0;i<model.wheels.length;i++){const wheel=model.wheels[i]!;wheel.rotation.x-=state.speed*dt/.4;if(i%2===0)wheel.rotation.y='steer' in state?-state.steer*.25:0}
  }
  render(car:CarState,dt:number,running:boolean){
    this.time+=dt;this.pose(this.local,car,dt)
    for(const e of this.remote.values()){
      const k=1-Math.exp(-dt*12);e.current.x+=(e.target.x-e.current.x)*k;e.current.z+=(e.target.z-e.current.z)*k;e.current.heading+=angleDelta(e.target.heading,e.current.heading)*k
      e.current.speed=performance.now()-e.seen<1500?e.target.speed:0;e.current.boosting=performance.now()-e.seen<500&&e.target.boosting;this.pose(e.model,e.current,dt)
      e.model.car.visible=performance.now()-e.seen<6000
    }
    for(const bot of this.bots){if(running)bot.fraction+=bot.speed*dt/TRACK.getLength();const p=trackPose(bot.fraction,bot.lane);this.pose(bot.model,{...p,speed:running?bot.speed:0,lap:1,distance:0,boosting:false,finished:false},dt)}
    const forward=new THREE.Vector3(Math.sin(car.heading),0,-Math.cos(car.heading)),position=new THREE.Vector3(car.x,0,car.z)
    const inside=this.viewMode==='cockpit'
    const desired=position.clone().addScaledVector(forward,inside?.15:-(10.5+Math.abs(car.speed)*.035));desired.y=inside?1.13:4.5
    if(inside||!this.cameraReady){this.camera.position.copy(desired);this.cameraReady=true}
    else this.camera.position.lerp(desired,1-Math.exp(-dt*7))
    const look=position.clone().addScaledVector(forward,inside?60:12+Math.abs(car.speed)*.16);look.y=inside?1.13:1.15;this.camera.lookAt(look)
    this.steeringWheel.rotation.z=-car.steer*.65
    const fov=(inside?72:58)+Math.min(9,Math.abs(car.speed)*.095)+(car.boosting?4:0);this.camera.fov+=(fov-this.camera.fov)*(1-Math.exp(-dt*3));this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene,this.camera);this.map(car)
  }
  private map(car:CarState){
    const ctx=this.minimap.getContext('2d')!;const w=this.minimap.width,h=this.minimap.height;ctx.clearRect(0,0,w,h)
    const project=(x:number,z:number)=>[(x+280)/730*w,(z+300)/730*h]
    ctx.beginPath();for(let i=0;i<=TRACK_SAMPLES;i++){const p=CENTERS[i%TRACK_SAMPLES]!,[x,y]=project(p.x,p.z);if(i===0)ctx.moveTo(x!,y!);else ctx.lineTo(x!,y!)}ctx.strokeStyle='#62728c';ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle='#b3c2d7';ctx.lineWidth=1.2;ctx.stroke()
    const dot=(x:number,z:number,color:string,r:number)=>{const p=project(x,z);ctx.beginPath();ctx.arc(p[0]!,p[1]!,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
    for(const bot of this.bots)dot(bot.model.car.position.x,bot.model.car.position.z,'#9ba7ba',2)
    for(const e of this.remote.values())if(e.model.car.visible)dot(e.current.x,e.current.z,'#ff945e',3)
    dot(car.x,car.z,'#53f5ff',4)
  }
  private disposeObject(object:THREE.Object3D){object.traverse(item=>{const mesh=item as THREE.Mesh;if(!mesh.isMesh)return;mesh.geometry.dispose();const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];for(const m of materials){const material=m as THREE.MeshStandardMaterial;material.map?.dispose();material.dispose()}})}
  dispose(){this.resizeObserver.disconnect();this.disposeObject(this.scene);this.renderer.dispose();this.renderer.forceContextLoss()}
}
