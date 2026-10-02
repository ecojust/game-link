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
  assert.equal(jobs.get(timeout).delay, 15000)
  await jobs.get(timeout).fn(); jobs.delete(timeout)
  assert.equal(game.peerStates.get('b'), 'reconnecting')
  const retry = game.retryTimers.get('b')
  assert.ok(jobs.get(retry).delay >= 1000 && jobs.get(retry).delay < 1500)
  await jobs.get(retry).fn(); jobs.delete(retry)
  assert.deepEqual(signals, ['webrtc_restart'])
  assert.equal(rebuilt, 1)
  game.dispose()
  assert.equal(jobs.size, 0)
})

test('TURN configuration is removed in direct-only mode', () => {
  const game = new GameLinkClient({ gameId: 'test', playerName: 'host', iceServers: [
    { urls: ['turn:example.org', 'stun:example.org'] }, { urls: 'turns:example.org' },
  ] })
  assert.deepEqual(game.iceServers.map(s => s.urls), [['stun:example.org']])
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
