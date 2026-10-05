import { CatmullRomCurve3, Vector3 } from 'three'

export const ROAD_WIDTH = 24
export const TRACK_SAMPLES = 640
export const TRACK = new CatmullRomCurve3([
  [0,200],[0,-100],[110,-260],[310,-210],[390,10],[290,170],
  [140,320],[-70,380],[-230,210],[-230,-30],[-130,-110],[-80,100],
].map(([x,z]) => new Vector3(x,0,z)), true, 'centripetal')
export const TRACK_LENGTH = TRACK.getLength()
export const CENTERS = Array.from({length:TRACK_SAMPLES},(_,i)=>TRACK.getPointAt(i/TRACK_SAMPLES))
export type DriveInput = { throttle: number; brake: number; steer: number; boost: boolean }
export type CarState = { x:number; z:number; heading:number; speed:number; steer:number; nitro:number; boosting:boolean; distance:number; lap:number; elapsed:number; bestLap:number; lastLap:number; lapStarted:number; checkpoint:number; finished:boolean; collision:number }
export type WireCar = { x:number; z:number; heading:number; speed:number; lap:number; distance:number; boosting:boolean; finished:boolean }
export const clamp = (v:number,min:number,max:number)=>Math.max(min,Math.min(max,v))
export function angleDelta(a:number,b:number) { return Math.atan2(Math.sin(a-b),Math.cos(a-b)) }
export function trackPose(fraction:number,lane=0) {
  const t=((fraction%1)+1)%1, point=TRACK.getPointAt(t), tangent=TRACK.getTangentAt(t)
  const heading=Math.atan2(tangent.x,-tangent.z)
  return { x:point.x+Math.cos(heading)*lane,z:point.z+Math.sin(heading)*lane,heading }
}
export function spawnCar(index=0):CarState {
  // Grid sits just beyond the finish line, facing the first straight.
  const pose=trackPose(.012-Math.floor(index/4)*.003,(index%4-1.5)*4)
  return {...pose,speed:0,steer:0,nitro:100,boosting:false,distance:0,lap:1,elapsed:0,bestLap:0,lastLap:0,lapStarted:0,checkpoint:0,finished:false,collision:0}
}
export function nearestTrack(x:number,z:number) {
  let best=Infinity, index=0, fraction=0, px=0,pz=0
  for(let i=0;i<TRACK_SAMPLES;i++) {
    const a=CENTERS[i]!,b=CENTERS[(i+1)%TRACK_SAMPLES]!,dx=b.x-a.x,dz=b.z-a.z
    const f=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1)
    const qx=a.x+f*dx,qz=a.z+f*dz,d=(x-qx)**2+(z-qz)**2
    if(d<best){best=d;index=i;fraction=f;px=qx;pz=qz}
  }
  const a=CENTERS[index]!,b=CENTERS[(index+1)%TRACK_SAMPLES]!,heading=Math.atan2(b.x-a.x,-(b.z-a.z))
  return { x:px,z:pz,heading,offset:(x-px)*Math.cos(heading)+(z-pz)*Math.sin(heading),progress:(index+fraction)/TRACK_SAMPLES,distance:Math.sqrt(best) }
}
export function stepCar(car:CarState,input:DriveInput,dt:number) {
  dt=clamp(dt,0,1/30)
  car.collision=Math.max(0,car.collision-dt)
  if(car.finished){car.speed*=Math.exp(-dt*1.3);car.x+=Math.sin(car.heading)*car.speed*dt;car.z-=Math.cos(car.heading)*car.speed*dt;return}
  car.elapsed+=dt
  const old=nearestTrack(car.x,car.z)
  const requested=clamp(input.steer,-1,1)
  car.steer+=(requested-car.steer)*(1-Math.exp(-dt*9))
  const boost=input.boost&&input.throttle>0&&car.speed>8&&car.nitro>2
  car.boosting=boost
  car.nitro=clamp(car.nitro+(boost?-24:12)*dt,0,100)
  let acceleration=clamp(input.throttle,0,1)*(boost?26:15)
  if(input.brake>0) acceleration-=car.speed>1?36*input.brake:8*input.brake
  const drag=car.speed*(.045+Math.abs(car.speed)*.0035)+(Math.abs(car.speed)>.2?Math.sign(car.speed)*1.1:0)
  car.speed=clamp(car.speed+(acceleration-drag)*dt,-9,boost?78:62)
  if(!input.throttle&&!input.brake&&Math.abs(car.speed)<.12)car.speed=0
  // A bicycle steering model: steering becomes less abrupt as speed rises.
  const wheelAngle=car.steer*.52/(1+Math.abs(car.speed)*.036)
  car.heading+=Math.tan(wheelAngle)*car.speed/3.3*dt
  car.heading=Math.atan2(Math.sin(car.heading),Math.cos(car.heading))
  car.x+=Math.sin(car.heading)*car.speed*dt
  car.z-=Math.cos(car.heading)*car.speed*dt
  const next=nearestTrack(car.x,car.z)
  const maxOffset=ROAD_WIDTH/2-1.15
  if(Math.abs(next.offset)>maxOffset) {
    const offset=clamp(next.offset,-maxOffset,maxOffset)
    car.x=next.x+Math.cos(next.heading)*offset;car.z=next.z+Math.sin(next.heading)*offset
    if(car.collision<=0){car.speed*=.64;car.collision=.35}
    car.heading+=angleDelta(next.heading,car.heading)*.12
  }
  let delta=next.progress-old.progress
  if(delta<-.5)delta+=1
  if(delta>.5)delta-=1
  if(Math.abs(delta)<.04)car.distance=Math.max(0,car.distance+delta*TRACK_LENGTH)
  // Require sequential sectors so reversing over the start cannot earn a lap.
  const sector=Math.floor(next.progress*16)
  if(sector===car.checkpoint+1)car.checkpoint=sector
  if(old.progress>.92&&next.progress<.08&&delta>0&&car.checkpoint>=15){
    car.lastLap=car.elapsed-car.lapStarted
    car.bestLap=car.bestLap?Math.min(car.bestLap,car.lastLap):car.lastLap
    car.lapStarted=car.elapsed;car.checkpoint=0;car.lap++
    if(car.lap>3){car.finished=true;car.boosting=false}
  }
}
export function wireCar(car:CarState):WireCar { return {x:car.x,z:car.z,heading:car.heading,speed:car.speed,lap:car.lap,distance:car.distance,boosting:car.boosting,finished:car.finished} }
export function validWire(value:unknown):value is WireCar {
  if(!value||typeof value!=='object')return false
  const s=value as WireCar
  return [s.x,s.z,s.heading,s.speed,s.lap,s.distance].every(Number.isFinite)&&Math.abs(s.x)<1000&&Math.abs(s.z)<1000&&Math.abs(s.speed)<100&&s.lap>=1&&s.lap<=4&&s.distance>=0&&s.distance<TRACK_LENGTH*5&&typeof s.boosting==='boolean'&&typeof s.finished==='boolean'
}
