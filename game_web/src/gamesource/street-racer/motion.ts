import { clamp } from './simulation'

type OrientationAPI = typeof DeviceOrientationEvent & { requestPermission?:()=>Promise<string> }
export class TiltSteering {
  steer=0
  ready=false
  lastReading=0
  private neutral:number|null=null
  private angle=0
  private resolve:((v:boolean)=>void)|undefined
  private timer=0
  private onReading=(event:DeviceOrientationEvent)=>{
    if(event.beta===null||event.gamma===null)return
    const angle=screen.orientation?.angle??(window as Window & {orientation?:number}).orientation??0
    // Project the gravity vector onto the screen's horizontal axis, including
    // either landscape orientation. atan2 remains stable around +/-90deg gamma.
    const beta=event.beta*Math.PI/180,gamma=event.gamma*Math.PI/180,a=angle*Math.PI/180
    const gx=Math.cos(beta)*Math.sin(gamma),gy=Math.sin(beta),gz=Math.cos(beta)*Math.cos(gamma)
    const horizontal=gx*Math.cos(a)+gy*Math.sin(a)
    const tilt=Math.atan2(horizontal,Math.sqrt(gz*gz+(-gx*Math.sin(a)+gy*Math.cos(a))**2))*180/Math.PI
    if(this.angle!==angle){this.angle=angle;this.neutral=null;this.steer=0}
    if(this.neutral===null)this.neutral=tilt
    const delta=tilt-this.neutral
    this.steer=clamp(Math.abs(delta)<2?0:(delta-Math.sign(delta)*2)/23,-1,1)
    this.ready=true;this.lastReading=performance.now();this.resolve?.(true);this.resolve=undefined
  }
  async enable() {
    if(!window.isSecureContext)throw Error('倾斜转向需要 HTTPS，请通过安全链接打开游戏。')
    if(!('DeviceOrientationEvent' in window))throw Error('这台设备没有提供方向传感器。')
    const api=DeviceOrientationEvent as OrientationAPI
    if(api.requestPermission&&await api.requestPermission()!=='granted')throw Error('没有获得运动与方向权限。请允许后重试，或使用触摸转向。')
    window.removeEventListener('deviceorientation',this.onReading)
    window.addEventListener('deviceorientation',this.onReading)
    this.neutral=null;this.ready=false
    const received=await new Promise<boolean>(resolve=>{this.resolve=resolve;this.timer=window.setTimeout(()=>{this.resolve=undefined;resolve(false)},2400)})
    window.clearTimeout(this.timer)
    if(!received)throw Error('尚未收到陀螺仪数据。请检查手机传感器权限，或使用触摸转向。')
  }
  calibrate(){this.neutral=null;this.steer=0}
  value(){return performance.now()-this.lastReading<1500?this.steer:0}
  dispose(){window.removeEventListener('deviceorientation',this.onReading);window.clearTimeout(this.timer);this.resolve?.(false);this.resolve=undefined}
}
