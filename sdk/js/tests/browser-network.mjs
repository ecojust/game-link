// Run after npm run build --prefix game_web, with a local server on API_URL.
// PLAYWRIGHT_MODULE can point to an external playwright installation.
import { createRequire } from 'node:module'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const api = process.env.API_URL || 'http://127.0.0.1:18088'
const root = fileURLToPath(new URL('../../../game_web/dist/', import.meta.url))
const sdk = await readFile(new URL('../gamelink.js', import.meta.url), 'utf8')
let origin
const server = createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/v1/')) {
      const chunks = []; for await (const c of req) chunks.push(c)
      const response = await fetch(api + req.url, { method: req.method, headers: { 'content-type': 'application/json' }, body: ['GET','HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) })
      res.writeHead(response.status, {'content-type':'application/json'}); res.end(await response.text()); return
    }
    const path = new URL(req.url, 'http://localhost').pathname
    if (path.endsWith('/gamelink.js')) {
      // Test-only instrumentation. Production code has no global client access.
      const instrumented = sdk.replace('this.lastGeneration = 0', `this.lastGeneration = 0; window.testClient = this; window.testEvents = []; window.testMessages = []; this.on('error',e=>console.error('SDK',e.message)); this.on('peer-ready', e => window.testEvents.push(e)); this.on('message', e => window.testMessages.push(e))`)
        .replace('serverUrl = new URL(import.meta.url).origin', `serverUrl = ${JSON.stringify(origin)}`)
      res.writeHead(200, {'content-type':'text/javascript'}); res.end(instrumented); return
    }
    const data = await readFile(root + path)
    res.writeHead(200, { 'content-type': path.endsWith('.html') ? 'text/html' : path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : 'application/octet-stream' }); res.end(data)
  } catch { res.writeHead(404); res.end() }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
origin = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, headless: true, args: ['--disable-features=WebRtcHideLocalIpsWithMdns', '--allow-loopback-in-peer-connection', '--force-webrtc-ip-handling-policy=default', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const errors = [], report = []
const connected = p => p.waitForFunction(() => window.testClient?.peerStates.size === 1 && [...window.testClient.peerStates.values()].every(s => s === 'connected'), null, {timeout:30000}).catch(async error => { console.error(await p.evaluate(()=>({url:location.href,text:document.body.innerText,states:window.testClient ? [...testClient.peerStates] : null, members:window.testClient?.members, localIce:window.testClient ? [...testClient.localIceAddresses] : null,remoteIce:window.testClient ? [...testClient.remoteIceAddresses] : null, connections:window.testClient ? [...testClient.connections].map(([id,c])=>({id,state:c.connectionState,ice:c.iceConnectionState,signal:c.signalingState,local:c.localDescription?.type,remote:c.remoteDescription?.type})) : null, generations:window.testClient ? [...testClient.generations] : null}))); throw error })
try {
  for (const [gameid, path, snapshot] of [['tank-arena','tank','tank-recovery'], ['fc-mini-4wd','four-wheel','fc2-world']]) {
    const room = await (await fetch(api+'/v1/rooms', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({game_id:gameid,player_name:'Network A',create_only:true})})).json()
    assert.ok(room.room?.code, JSON.stringify(room))
    const contexts = await Promise.all([browser.newContext({viewport:{width:640,height:360}}),browser.newContext({viewport:{width:640,height:360}})])
    for (const context of contexts) {
      await context.grantPermissions(['microphone'], {origin})
      await context.addInitScript(() => {
        // Fake media device enables all local interfaces in this isolated browser;
        // otherwise the machine's VPN default interface may be the only candidate.
        navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{window.testMedia=stream}).catch(()=>{})
      })
    }
    const [a,b] = await Promise.all(contexts.map(c=>c.newPage()))
    for (const p of [a,b]) { p.on('pageerror', e=>{errors.push(e.message); console.error('pageerror',e.message)}); p.on('console',m=>{if(m.type()==='error' && !m.text().includes('ERR_INTERNET_DISCONNECTED') && !m.text().includes('SDK Failed to fetch')) console.error(m.text())}) }
    console.log('Starting',gameid)
    await a.goto(`${origin}/${path}/index.html?gameid=${gameid}&room=${room.room.code}&username=Network+A`)
    await b.goto(`${origin}/${path}/index.html?gameid=${gameid}&room=${room.room.code}&username=Network+B`)
    await Promise.all([connected(a), connected(b)])
    await b.waitForFunction(k => window.testMessages.some(m=>m.kind===k), snapshot)
    if(path==='tank') await b.waitForFunction(()=>!document.querySelector('.network-recovery'))
    console.log(gameid,'initial connection + snapshot passed')
    const old = await a.evaluate(()=>({generation:[...testClient.generations.values()][0], from:testClient.selfMember.id}))
    const start = Date.now()
    // HTTP offline alone does not stop WebRTC. Close the transport explicitly too.
    await contexts[1].setOffline(true)
    await b.evaluate(()=>{ for(const c of testClient.connections.values()) c.close() })
    await b.waitForFunction(()=>document.querySelector('.network-recovery') || document.querySelector('.fc-cover'))
    await new Promise(r=>setTimeout(r,3500))
    assert.equal(await b.evaluate(()=>[...testClient.peerStates.values()].some(s=>s==='connected')),false)
    await contexts[1].setOffline(false)
    await Promise.all([connected(a), connected(b)])
    await b.waitForFunction(()=>testEvents.some(e=>e.recovered))
    if(path==='tank') await b.waitForFunction(()=>!document.querySelector('.network-recovery'))
    else await b.waitForFunction(()=>!document.querySelector('[data-network-recovery]'))
    // A delayed ICE candidate from the dead generation must never enter the new PC.
    await b.evaluate(async old => {
      const c = testClient.connections.get(old.from), active = testClient.generations.get(old.from)
      let calls=0; const add=c.addIceCandidate.bind(c); c.addIceCandidate=(...args)=>{calls++; return add(...args)}
      await testClient._receiveSignal({from:old.from,kind:'webrtc_ice',payload:{generation:old.generation,candidate:'candidate:old 1 udp 1 127.0.0.1 9 typ host'}})
      if(calls || testClient.generations.get(old.from)!==active) throw Error('stale ICE accepted')
    }, old)
    console.log(gameid,'outage recovery passed')
    const elapsed = Date.now()-start
    const id = await b.evaluate(()=>testClient.selfMember.id)
    await b.reload()
    await Promise.all([connected(a),connected(b)])
    assert.equal(await b.evaluate(()=>testClient.selfMember.id),id)
    await b.waitForFunction(k=>testMessages.some(m=>m.kind===k),snapshot)
    if(path==='tank') await b.waitForFunction(()=>!document.querySelector('.network-recovery'))
    else {
      await b.waitForFunction(()=>!document.querySelector('[data-network-recovery]'))
      await b.keyboard.down('ArrowRight'); await b.keyboard.up('ArrowRight')
      await a.waitForFunction(()=>testMessages.some(m=>m.kind==='fc2-input' && m.payload.x===1))
    }
    report.push({game:gameid, fault:'transport closed + HTTP offline 3.5s', recoveryMs:elapsed, staleIce:'ignored', reload:'same member, snapshot restored'})
    await a.evaluate(()=>testClient.leave()); await b.evaluate(()=>testClient.leave())
    await Promise.all(contexts.map(c=>c.close()))
  }
  assert.deepEqual(errors,[])
  console.log(JSON.stringify({passed:true,report},null,2))
} finally { await browser.close(); await new Promise(r=>server.close(r)) }
