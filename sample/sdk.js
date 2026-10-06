import { GameLinkClient } from "../sdk/js/gamelink.js";

const SERVER_URL = "http://xx.xx.xx.xx:8088";
const GAME_ID = "square-demo";
const PALETTE = [
  "#37c2b8",
  "#9b8cff",
  "#e8c15a",
  "#ff7ba6",
  "#6fb2ff",
  "#a6d96a",
];
const FLUSH_MS = 50;
const KEEPALIVE_MS = 1200;

const handlers = new Map();
let client = null;
let flushTimer = null;
let dirty = false;
let lastSentAt = 0;

const clamp = (value) => Math.min(0.98, Math.max(0.02, Number(value) || 0));
const round = (value) => Math.round(value * 10000) / 10000;

function hashOf(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makePlayer(member, self) {
  const hash = hashOf(member.id);
  const player = {
    id: member.id,
    name: member.name,
    color: PALETTE[hash % PALETTE.length],
    self,
    x: self ? 0.5 : 0.2 + (hash % 600) / 1000,
    y: self ? 0.5 : 0.2 + ((hash >>> 10) % 600) / 1000,
    synced: self,
  };
  player.tx = player.x;
  player.ty = player.y;
  return player;
}

function stopFlushing() {
  clearInterval(flushTimer);
  flushTimer = null;
}

function startFlushing() {
  stopFlushing();
  flushTimer = setInterval(() => {
    const self = sdk.players.get(sdk.selfId);
    if (!client || !self) return;
    if (!dirty && performance.now() - lastSentAt < KEEPALIVE_MS) return;
    client.send(
      "move",
      { x: round(self.x), y: round(self.y) },
      { reliability: "unreliable" },
    );
    lastSentAt = performance.now();
    dirty = false;
  }, FLUSH_MS);
}

export const sdk = {
  selfId: null,
  players: new Map(),

  get inRoom() {
    return Boolean(client && !client.disposed);
  },

  on(event, handler) {
    const set = handlers.get(event) || new Set();
    set.add(handler);
    handlers.set(event, set);
    return () => set.delete(handler);
  },

  emit(event, data) {
    for (const handler of handlers.get(event) || []) handler(data);
  },

  async enter({ name, mode, code }) {
    const next = new GameLinkClient({
      serverUrl: SERVER_URL,
      gameId: GAME_ID,
      playerName: name,
    });
    this.players.clear();
    this.selfId = null;
    this._bind(next);
    try {
      const result =
        mode === "create" ? await next.createRoom() : await next.joinRoom(code);
      if (next.disposed) throw new Error("房间已关闭，请重试");
      client = next;
      startFlushing();
      // 服务器 members 事件可能稍晚到达，先按 self_member 建好自己，避免房间界面空名单
      if (!this.players.size && next.selfMember) {
        this.selfId = next.selfMember.id;
        this.players.set(next.selfMember.id, makePlayer(next.selfMember, true));
        this.emit("members", [next.selfMember]);
      }
      this.emit("joined", result.room.code);
      return result;
    } catch (error) {
      next.dispose();
      throw error;
    }
  },

  async leave() {
    const active = client;
    this._reset();
    if (active && !active.disposed) await active.leave();
  },

  setSelfPosition(x, y) {
    const self = this.players.get(this.selfId);
    if (!self) return;
    if (self.x !== x || self.y !== y) dirty = true;
    self.x = x;
    self.y = y;
  },

  tick(dt) {
    const ease = Math.min(1, dt * 14);
    for (const player of this.players.values()) {
      if (player.self) continue;
      player.x += (player.tx - player.x) * ease;
      player.y += (player.ty - player.y) * ease;
    }
  },

  peerState(id) {
    if (id === this.selfId) return "local";
    return client?.peerStates.get(id) || "connecting";
  },

  peerTransport(id) {
    return client?.peerTransports.get(id) || null;
  },

  openLogs() {
    if (!client || client.disposed) throw new Error("先进入一个房间");
    return client.getLogs();
  },

  openConnections() {
    if (!client || client.disposed) throw new Error("先进入一个房间");
    return client.getConnections({ type: "dialog", maxMembers: 4 });
  },

  _reset() {
    stopFlushing();
    client = null;
    this.selfId = null;
    this.players.clear();
    dirty = false;
    this.emit("left");
  },

  _bind(next) {
    // 房间成员变化：增删玩家模型，再通知 UI
    next.on("members", (members) => {
      this.selfId = next.selfMember?.id ?? this.selfId;
      for (const id of [...this.players.keys()]) {
        if (!members.some((member) => member.id === id))
          this.players.delete(id);
      }
      for (const member of members) {
        if (!this.players.has(member.id))
          this.players.set(
            member.id,
            makePlayer(member, member.id === this.selfId),
          );
      }
      this.emit("members", members);
    });

    // 对方连上后补发一次完整状态，然后通知 UI 更新连接状态
    next.on("peer-ready", ({ peerId }) => {
      const self = this.players.get(this.selfId);
      if (self)
        next.send(
          "move",
          { x: round(self.x), y: round(self.y) },
          { target: peerId, reliability: "reliable" },
        );
      this.emit("peer-state", peerId);
    });

    next.on("peer-state", (state) => this.emit("peer-state", state));

    // 收到对方位置：只更新目标坐标，插值放在 tick()
    next.on("message", ({ from, kind, payload }) => {
      if (kind !== "move") return;
      const player = this.players.get(from);
      if (!player) return;
      player.tx = clamp(payload.x);
      player.ty = clamp(payload.y);
      player.synced = true;
    });

    next.on("error", (error) => this.emit("error", error));

    next.on("room-closed", ({ reason }) => {
      this._reset();
      this.emit("closed", reason);
    });
  },
};

globalThis.gameLink = sdk;
