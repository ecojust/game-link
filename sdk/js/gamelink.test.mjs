import test from 'node:test'
import assert from 'node:assert/strict'
import { GameLinkClient } from './gamelink.js'

function client() {
  const game = new GameLinkClient({ gameId: 'test', playerName: 'host' })
  game.selfMember = { id: 'a' }
  game.members = [{ id: 'a' }, { id: 'b' }]
  game.room = { code: 'TEST' }
  return game
}

test('send and broadcast never fall back to HTTP, including legacy relay state', async () => {
  const game = client(), skipped = [], messages = []
  game._request = () => { throw new Error('game data reached HTTP') }
  game.on('delivery-skipped', event => skipped.push(event))
  game.on('message', event => messages.push(event))
  game.peerStates.set('b', 'relay')
  game.send('shot', { id: 1 })
  await game.broadcast('ready', {})
  await game._receiveSignal({ from: 'b', kind: 'game_relay', payload: { kind: 'shot' } })
  await game._receiveSignal({ from: 'b', kind: 'ready', payload: {} })
  assert.equal(skipped.length, 2)
  assert.equal(messages.length, 0)
  const sent = []
  game.peerStates.set('b','connected')
  game.channels.set('b', { control: { readyState: 'open', send: value => sent.push(JSON.parse(value)) } })
  await game.broadcast('ready', { value: true })
  assert.deepEqual(sent, [{ kind: 'ready', payload: { value: true } }])
})

test('negotiation timeout retries with signaling only, and dispose cancels retry', async t => {
  const jobs = new Map(); let id = 0
  t.mock.method(globalThis, 'setTimeout', (fn, delay) => { jobs.set(++id, { fn, delay }); return id })
  t.mock.method(globalThis, 'clearTimeout', id => jobs.delete(id))
  const game = client(), signals = []
  game._sendSignal = async (peer, kind) => signals.push(kind)
  let rebuilt = 0
  game._ensurePeerConnection = () => { rebuilt++ }
  game._watchConnection('b')
  const timeout = game.retryTimers.get('b')
  assert.equal(jobs.get(timeout).delay, 4000)
  await jobs.get(timeout).fn(); jobs.delete(timeout)
  assert.equal(game.peerStates.get('b'), 'reconnecting')
  const retry = game.retryTimers.get('b')
  assert.equal(jobs.get(retry).delay, 0)
  await jobs.get(retry).fn(); jobs.delete(retry)
  assert.deepEqual(signals, ['webrtc_restart'])
  assert.equal(rebuilt, 1)
  game.dispose()
  assert.equal(jobs.size, 0)
})

test('TURN configuration is retained for the relay stage', () => {
  const game = new GameLinkClient({ gameId: 'test', playerName: 'host', iceServers: [
    { urls: ['turn:example.org', 'stun:example.org'] }, { urls: 'turns:example.org' },
  ] })
  assert.deepEqual(game.iceServers.map(s => s.urls), [['turn:example.org', 'stun:example.org'], ['turns:example.org']])
})

test('late answers and ICE from an earlier generation cannot mutate the active connection', async () => {
  const game = client(); let mutations = 0
  game.generations.set('b', 200)
  game.connections.set('b', { setRemoteDescription: () => mutations++, addIceCandidate: () => mutations++, close() {} })
  await game._receiveSignal({from:'b',kind:'webrtc_answer',payload:{generation:100,sdp:'old'}})
  await game._receiveSignal({from:'b',kind:'webrtc_ice',payload:{generation:100,candidate:'old'}})
  await game._receiveSignal({from:'b',kind:'webrtc_answer',payload:{sdp:'untagged'}})
  assert.equal(mutations,0)
  assert.equal(game.generations.get('b'),200)
  game.dispose()
})

test('ICE arriving before an offer is buffered by generation with a bounded queue', async () => {
  const game = client(); game.selfMember={id:'b'}
  for(let i=0;i<80;i++) await game._receiveSignal({from:'a',kind:'webrtc_ice',payload:{generation:200,candidate:'candidate:x 1 udp 1 127.0.0.1 9 typ host'}})
  assert.equal(game.futureIce.get('a').candidates.length,64)
  await game._receiveSignal({from:'a',kind:'webrtc_ice',payload:{generation:300,candidate:'candidate:new 1 udp 1 127.0.0.1 9 typ host'}})
  assert.equal(game.futureIce.get('a').generation,300)
  assert.equal(game.futureIce.get('a').candidates.length,1)
  game.dispose()
})

test('peer-ready fires once per transition, spontaneous recovery cancels retry', () => {
  const game = client(), events=[]
  game.on('peer-ready',e=>events.push(e))
  game._logConnection=()=>{}; game._updateIceAddresses=()=>{}
  const pc={connectionState:'connected',close(){}}
  game.connections.set('b',pc); game.generations.set('b',123)
  game.channels.set('b',{control:{readyState:'open'},state:{readyState:'open'}})
  game._updatePeerState('b'); game._updatePeerState('b')
  assert.equal(events.length,1); assert.equal(events[0].recovered,false)
  pc.connectionState='disconnected'; game._updatePeerState('b')
  assert.equal(game.peerStates.get('b'),'reconnecting')
  assert.equal(game.retryTimers.size,1)
  pc.connectionState='connected'; game._updatePeerState('b')
  assert.equal(events.length,2); assert.equal(events[1].recovered,true)
  assert.equal(game.retryTimers.size,0)
  game.dispose()
})

test('member departure clears retry even when no connection was created', () => {
  const game = client(); game.selfMember={id:'b'}
  game._watchConnection('a'); game.members=[game.selfMember]
  game._syncPeerConnections()
  assert.equal(game.retryTimers.size,0)
  game.dispose()
})

test('retry request advances the offerer clock floor after a clock rollback', async () => {
  const game=client(); game._retryPeer=()=>{}
  await game._receiveSignal({from:'b',kind:'webrtc_retry',payload:{generation:123456}})
  assert.equal(game.lastGeneration,123456)
  game.dispose()
})

test('delayed retry requests from an old generation do not replace a healthy connection', async () => {
  const game=client(); let retries=0; game._retryPeer=()=>retries++
  game.generations.set('b',200); game.peerStates.set('b','connected')
  await game._receiveSignal({from:'b',kind:'webrtc_retry',payload:{generation:100}})
  await game._receiveSignal({from:'b',kind:'webrtc_retry',payload:{generation:0}})
  assert.equal(retries,0)
  await game._receiveSignal({from:'b',kind:'webrtc_retry',payload:{generation:200}})
  assert.equal(retries,1)
  game.dispose()
})


test('game payloads are skipped for a peer once its P2P state is offline', () => {
  const game=client(), sent=[], skipped=[]
  game.peerStates.set('b','reconnecting')
  game.channels.set('b',{control:{readyState:'open',send:value=>sent.push(value)}})
  game.on('delivery-skipped',event=>skipped.push(event))
  game.send('shot',{})
  assert.equal(sent.length,0)
  assert.equal(skipped.length,1)
  game.dispose()
})

test('P2P heartbeat times out a silent peer and internal ping messages stay private', () => {
  const game=client(), outbound=[], delivered=[]
  game.peerHeartbeatAt.set('b',1000); game.peerStates.set('b','connected')
  game.channels.set('b',{control:{readyState:'open',send:value=>outbound.push(JSON.parse(value))}})
  let retries=0; game._retryPeer=()=>retries++
  game._checkPeerHeartbeats(5000)
  assert.equal(outbound[0].kind,'__gamelink_peer_ping')
  assert.equal(delivered.length,0)
  game._checkPeerHeartbeats(14001)
  assert.equal(retries,1)
  game.on('message',event=>delivered.push(event))
  game.connections.set('b',{})
  game._updatePeerState=()=>{}
  game.connections.set('b',{close(){}})
  const control={label:'control',readyState:'open',send:value=>outbound.push(JSON.parse(value))}
  game.channels.set('b',{})
  game._attachChannel('b',control)
  control.onmessage({data:JSON.stringify({kind:'__gamelink_peer_ping',payload:{seq:4}})})
  assert.equal(delivered.length,0)
  assert.equal(outbound.at(-1).kind,'__gamelink_peer_pong')
  game.dispose()
})

test('LAN starts without ICE servers, STUN uses discovery, TURN enforces relay', t => {
  const configurations = []
  const previousRTC = globalThis.RTCPeerConnection
  t.after(() => { if (previousRTC === undefined) delete globalThis.RTCPeerConnection; else globalThis.RTCPeerConnection = previousRTC })
  globalThis.RTCPeerConnection = class {
    constructor(configuration) { configurations.push(configuration) }
    addEventListener() {}
    createDataChannel() { return {} }
    close() {}
  }
  const game = client()
  game._createOffer = () => {}; game._attachChannel = () => {}; game._watchConnection = () => {}
  game.iceServers = [{ urls: ['stun:discovery.example:3478'] }]
  game.turnServers = [{ urls: ['turn:relay.example:3479?transport=tcp'], username:'temporary', credential:'private' }]
  for (const stage of [0, 1, 2]) {
    game.connections.clear(); game.networkStages.set('b', stage)
    game._ensurePeerConnection({id:'b'})
  }
  assert.deepEqual(configurations[0], {iceServers:[], iceTransportPolicy:'all'})
  assert.equal(configurations[1].iceServers[0].urls[0], 'stun:discovery.example:3478')
  assert.equal(configurations[1].iceTransportPolicy, 'all')
  assert.equal(configurations[2].iceServers[0].urls[0], 'turn:relay.example:3479?transport=tcp')
  assert.equal(configurations[2].iceTransportPolicy, 'relay')
  game.dispose()
})

test('TURN credentials are fetched only when advancing from STUN to relay', async t => {
  const jobs = new Map(); let id = 0
  t.mock.method(globalThis, 'setTimeout', (fn, delay) => {jobs.set(++id, {fn,delay});return id})
  t.mock.method(globalThis, 'clearTimeout', id => jobs.delete(id))
  const game = client(); let credentials=0
  game._loadTurnServers = async () => { credentials++ }
  game._sendSignal = async () => {}; game._ensurePeerConnection = () => {}
  game._watchConnection = () => {}
  game._retryPeer('b'); let job=game.retryTimers.get('b');await jobs.get(job).fn();jobs.delete(job)
  assert.equal(game.networkStages.get('b'),1);assert.equal(credentials,0)
  game._retryPeer('b');job=game.retryTimers.get('b');await jobs.get(job).fn();jobs.delete(job)
  assert.equal(game.networkStages.get('b'),2);assert.equal(credentials,1)
  game.dispose()
})

test('connections data mode provides immutable current state and real-time lifecycle without a DOM', () => {
  const game = client(), updates = []
  game.members = [{id:'a',name:'我'},{id:'b',name:'朋友'}]
  const view = game.getConnections({type:'data',onChange:data=>updates.push(data)})
  assert.equal(view.type,'data')
  assert.equal(updates.length,1)
  assert.equal(view.data.roomCode,'TEST')
  assert.equal(view.data.players[0].state,'local')
  assert.equal(view.data.players[1].state,'connecting')
  assert.throws(()=>{view.data.players[1].name='changed'},TypeError)
  assert.equal(game.members[1].name,'朋友')
  game.peerStates.set('b','connected'); game.peerTransports.set('b','turn'); game.networkStages.set('b',2)
  game.localIceAddresses.set('b','relay address'); game.retryAttempts.set('b',2); game.generations.set('b',12)
  game._emitPeerState('b','connected')
  assert.equal(view.data.players[1].transport,'turn')
  assert.equal(view.data.players[1].networkStage,'turn')
  assert.equal(view.data.players[1].localIce,'relay address')
  assert.equal(view.data.players[1].attempt,2)
  assert.equal(view.data.players[1].generation,12)
  assert.equal(updates[0].players[1].transport,null)
  game.peerStates.set('b','reconnecting'); game._emitPeerState('b','reconnecting')
  assert.equal(view.data.players[1].transport,null)
  let subscriberCalls=0
  const unsubscribe=view.subscribe(()=>subscriberCalls++)
  assert.equal(subscriberCalls,1)
  unsubscribe()
  game.members=[game.members[0]]; game._emit('members',game.members)
  assert.equal(view.data.memberCount,1)
  assert.equal(subscriberCalls,1)
  game.dispose()
  assert.equal(view.data.disposed,true)
  assert.equal(view.data.memberCount,0)
  assert.deepEqual(view.data.players,[])
  assert.equal(game.listeners.size,0)
  const finalCount=updates.length
  view.dispose();view.close();game._emit('members',[])
  assert.equal(updates.length,finalCount)
})

test('logs data mode activates real-time collection without debug and releases only its own consumers', t => {
  t.mock.method(console,'info',()=>{})
  const game=client(), updates=[]
  const first=game.getLogs({type:'data',onChange:data=>updates.push(data)})
  const second=game.getLogs({type:'data'})
  assert.equal(game.debug,false)
  assert.equal(game.logConsumers,2)
  assert.deepEqual(first.data,[])
  game._trace('http.test',null,{auth_token:'secret',payload:{resume_token:'private'},safe:'visible'})
  assert.equal(first.data.length,1)
  assert.equal(second.data.length,1)
  assert.equal(first.data[0].safe,'visible')
  assert.equal(JSON.stringify(first.data).includes('secret'),false)
  assert.equal(JSON.stringify(first.data).includes('private'),false)
  assert.throws(()=>{first.data[0].stage='changed'},TypeError)
  assert.equal(updates[0].length,0)
  first.dispose();first.close()
  assert.equal(game.logConsumers,1)
  game._trace('peer.test','b')
  assert.equal(first.data.length,1)
  assert.equal(second.data.length,2)
  for(let i=0;i<2001;i++)game._trace('limit.test','b')
  assert.equal(second.data.length,2000)
  second.dispose()
  assert.equal(game.logConsumers,0)
  const last=game.debugLogs.length
  game._trace('not.collected','b')
  assert.equal(game.debugLogs.length,last)
  assert.equal(game.listeners.size,0)
})

test('invalid diagnostic modes and failed default dialogs do not leak subscribers or log collection', () => {
  const game=client()
  assert.throws(()=>game.getConnections({type:'other'}),TypeError)
  assert.throws(()=>game.getLogs({type:'other'}),TypeError)
  assert.throws(()=>game.getConnections({type:'data',maxMembers:0}),TypeError)
  assert.throws(()=>game.getLogs({type:'data',onChange:'bad'}),TypeError)
  // The Node test process has no DOM: omitted type must try a dialog.
  const active=game.getLogs({type:'data'})
  assert.throws(()=>game.getLogs(),/Dialog mode requires/)
  assert.equal(game.logConsumers,1)
  assert.throws(()=>game.getConnections({type:'dialog'}),/Dialog mode requires/)
  active.dispose()
  assert.equal(game.logConsumers,0)
  assert.equal(game.listeners.size,0)
  game.dispose()
  const closed=game.getConnections({type:'data'})
  assert.equal(closed.data.disposed,true)
  assert.equal(game.listeners.size,0)
})
