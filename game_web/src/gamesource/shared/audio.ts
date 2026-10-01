// Original synthesized chiptune. No external recordings or music downloads.
export class BattleAudio {
  private context?: AudioContext
  private master?: GainNode
  private engine?: OscillatorNode
  private engineGain?: GainNode
  private timer = 0
  private beat = 0
  private nextBeat = 0
  enabled = false
  volume = 0.3
  async enable(enabled: boolean) {
    this.enabled = enabled
    if (!enabled) { this.pause(); return }
    if (!this.context) {
      this.context = new AudioContext()
      this.master = this.context.createGain(); this.master.connect(this.context.destination)
      this.engine = this.context.createOscillator(); this.engine.type = 'sawtooth'
      this.engineGain = this.context.createGain(); this.engineGain.gain.value = 0
      this.engine.connect(this.engineGain); this.engineGain.connect(this.master); this.engine.start()
    }
    this.setVolume(this.volume)
    try { await this.context.resume() } catch { return }
    if (!this.enabled || document.hidden) { this.pause(); return }
    this.nextBeat = this.context.currentTime + 0.04
    if (!this.timer) this.timer = window.setInterval(() => this.schedule(), 50)
  }
  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value))
    this.master?.gain.setTargetAtTime(this.volume, this.context!.currentTime, 0.03)
  }
  private note(frequency: number, start: number, duration: number, gain: number, type: OscillatorType = 'square') {
    const ctx = this.context
    if (!ctx || !this.master) return
    const oscillator = ctx.createOscillator(), envelope = ctx.createGain()
    oscillator.type = type; oscillator.frequency.value = frequency
    envelope.gain.setValueAtTime(0, start); envelope.gain.linearRampToValueAtTime(gain, start + 0.008)
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(envelope); envelope.connect(this.master)
    oscillator.start(start); oscillator.stop(start + duration + 0.02)
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect() }
  }
  private schedule() {
    const ctx = this.context
    if (!ctx || ctx.state !== 'running' || !this.enabled) return
    if (this.nextBeat < ctx.currentTime) this.nextBeat = ctx.currentTime
    const melody = [76,79,83,79,74,78,81,78,72,76,79,83,74,78,81,86,76,83,79,76,74,81,78,74,72,79,76,72,71,74,78,83]
    const bass = [40,38,36,35]
    while (this.nextBeat < ctx.currentTime + 0.15) {
      const n = this.beat % melody.length, t = this.nextBeat
      this.note(440 * 2 ** ((melody[n]! - 69) / 12), t, 0.17, 0.045)
      if (n % 2 === 0) this.note(440 * 2 ** ((bass[Math.floor(n / 8)]! - 69) / 12), t, 0.26, 0.11, 'triangle')
      if (n % 4 === 0) this.note(65, t, 0.09, 0.15, 'sine')
      else if (n % 2 === 0) this.note(1300, t, 0.025, 0.018, 'triangle')
      this.nextBeat += 0.18; this.beat++
    }
  }
  update(speed: number, active: boolean) {
    if (!this.context || this.context.state !== 'running') return
    this.engine?.frequency.setTargetAtTime(38 + Math.min(speed, 24) * 5, this.context.currentTime, 0.1)
    this.engineGain?.gain.setTargetAtTime(active ? 0.014 + Math.min(speed, 24) * 0.001 : 0, this.context.currentTime, 0.1)
  }
  effect(frequency: number, duration = 0.1) {
    if (this.enabled && this.context?.state === 'running') this.note(frequency, this.context.currentTime, duration, 0.15, 'triangle')
  }
  pause() { clearInterval(this.timer); this.timer = 0; void this.context?.suspend().catch(() => {}) }
  dispose() { clearInterval(this.timer); this.timer = 0; this.enabled = false; this.engine?.stop(); void this.context?.close().catch(() => {}) }
}
