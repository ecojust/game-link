import { sdk } from "./sdk.js";

const ui = {
  lobby: document.querySelector("#lobby"),
  room: document.querySelector("#room"),
  name: document.querySelector("#name"),
  code: document.querySelector("#code"),
  status: document.querySelector("#status"),
  roomCode: document.querySelector("#room-code"),
  players: document.querySelector("#players"),
  create: document.querySelector("#create"),
  join: document.querySelector("#join"),
  leave: document.querySelector("#leave"),
  canvas: document.querySelector("#board"),
};

const ctx = ui.canvas.getContext("2d");

function setStatus(text) {
  ui.status.textContent = text;
}

function stateOf(player) {
  const state = sdk.peerState(player.id);
  if (state === "local") return ["本机", "self"];
  if (state === "connected")
    return sdk.peerTransport(player.id) === "turn"
      ? ["TURN", "turn"]
      : ["P2P", "p2p"];
  if (state === "reconnecting") return ["重连中", "busy"];
  if (state === "closed") return ["已断开", "busy"];
  return ["连接中", "busy"];
}

function renderRoster() {
  const items = [...sdk.players.values()].map((player) => {
    const li = document.createElement("li");
    const [label, kind] = stateOf(player);
    li.innerHTML =
      '<span class="swatch"></span><span class="name"></span><span class="state"></span>';
    li.querySelector(".swatch").style.background = player.color;
    li.querySelector(".name").textContent = player.self
      ? `${player.name}（我）`
      : player.name;
    const state = li.querySelector(".state");
    state.className = `state ${kind}`;
    state.textContent = label;
    return li;
  });
  ui.players.replaceChildren(...items);
}

function showLobby(statusText) {
  ui.lobby.hidden = false;
  ui.room.hidden = true;
  ui.leave.hidden = true;
  ui.players.replaceChildren();
  setStatus(statusText);
}

sdk.on("joined", (code) => {
  ui.lobby.hidden = true;
  ui.room.hidden = false;
  ui.leave.hidden = false;
  ui.roomCode.textContent = code;
  setStatus("房间里所有人都能看到你的方块");
});

sdk.on("members", renderRoster);
sdk.on("peer-state", renderRoster);
sdk.on("error", (error) => setStatus(error.message));
sdk.on("left", () => showLobby("输入昵称，创建或加入房间"));
sdk.on("closed", (reason) => setStatus(reason));

async function enter(mode) {
  const name = ui.name.value.trim();
  const code = ui.code.value.trim().toUpperCase();
  if (!name) return setStatus("先填一个昵称");
  if (mode === "join" && code.length !== 6)
    return setStatus("房间码是 6 位字符");

  ui.create.disabled = true;
  ui.join.disabled = true;
  try {
    await sdk.enter({ name, mode, code });
  } catch (error) {
    setStatus(error.message);
  } finally {
    ui.create.disabled = false;
    ui.join.disabled = false;
  }
}

ui.create.addEventListener("click", () => enter("create"));
ui.join.addEventListener("click", () => enter("join"));
ui.leave.addEventListener("click", async () => {
  try {
    await sdk.leave();
  } catch (error) {
    setStatus(error.message);
  }
});
ui.code.addEventListener("keydown", (event) => {
  if (event.key === "Enter") enter("join");
});

document.querySelector("#logs").addEventListener("click", () => {
  if (document.querySelector('[data-gamelink-diagnostic="logs"]')) return;
  try {
    sdk.openLogs();
  } catch (error) {
    setStatus(error.message);
  }
});

document.querySelector("#connections").addEventListener("click", () => {
  if (document.querySelector('[data-gamelink-diagnostic="connections"]'))
    return;
  try {
    sdk.openConnections();
  } catch (error) {
    setStatus(error.message);
  }
});

function render() {
  const w = ui.canvas.width;
  const h = ui.canvas.height;
  ctx.fillStyle = "#12171d";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#ffffff0d";
  for (let i = 1; i < 10; i++) {
    const p = Math.round((w * i) / 10) + 0.5;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, h);
    ctx.moveTo(0, p);
    ctx.lineTo(w, p);
    ctx.stroke();
  }

  const size = w * 0.085;
  for (const player of sdk.players.values()) {
    const cx = Math.min(w - size / 2, Math.max(size / 2, player.x * w));
    const cy = Math.min(h - size / 2, Math.max(size / 2, player.y * h));
    ctx.globalAlpha = player.synced ? 1 : 0.35;
    ctx.fillStyle = player.color;
    ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
    if (player.self) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - size / 2 - 4, cy - size / 2 - 4, size + 8, size + 8);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = player.self ? "#fff" : "#c9d2dd";
    ctx.font = "600 13px ui-monospace, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.fillText(player.name, cx, cy - size / 2 - 9);
  }
}

showLobby("输入昵称，创建或加入房间");

export { ui, setStatus, render, showLobby };
