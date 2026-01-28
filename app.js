const WS_URL = "wss://AQUI_TU_NGROK_URL"; // 👈 MISMA del server
const TOKEN = "MI_TOKEN_SIMPLE"; // el que validas en server.js

const log = (msg) => {
  document.getElementById("log").textContent += msg + "\n";
};

const ws = new WebSocket(WS_URL);

ws.onopen = () => {
  log("🟢 Conectado al servidor");

  ws.send(JSON.stringify({
    type: "auth",
    token: TOKEN
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  log("📩 " + JSON.stringify(data, null, 2));
};

function turnOn() {
  ws.send(JSON.stringify({
    type: "call_service",
    domain: "switch",
    service: "turn_on",
    entity_id: "switch.it_hab_2_2"
  }));
}

function turnOff() {
  ws.send(JSON.stringify({
    type: "call_service",
    domain: "switch",
    service: "turn_off",
    entity_id: "switch.it_hab_2_2"
  }));
}