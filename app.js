const WS_URL = "wss://c558e2d08663.ngrok-free.app"; // 👈 MISMA del server
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlYzY0OTg1ZWEzOWE0ZmFkOGI4ZDJmYmIyMjFhNmM4OCIsImlhdCI6MTc2OTUzMTEwOSwiZXhwIjoyMDg0ODkxMTA5fQ.fBFH_4POEB5QWl9rcN1MjaGB8tBgiBNreVMHADtLBVo"; // el que validas en server.js

const ENTITY_ID = "switch.it_hab_2_2";

const toggle = document.getElementById("toggle");
const status = document.getElementById("status");
const log = document.getElementById("log");

let internalChange = false;

const ws = new WebSocket(WS_URL);

ws.onopen = () => {
  status.textContent = "Conectado";
  ws.send(JSON.stringify({
    type: "auth",
    token: TOKEN
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  log.textContent += JSON.stringify(data) + "\n";

  // Evento desde Home Assistant
  if (
    data.type === "ha_event" &&
    data.entity_id === ENTITY_ID
  ) {
    internalChange = true;
    toggle.checked = data.new_state === "on";
    internalChange = false;
  }
};

toggle.addEventListener("change", () => {
  if (internalChange) return;

  ws.send(JSON.stringify({
    type: "call_service",
    domain: "switch",
    service: toggle.checked ? "turn_on" : "turn_off",
    entity_id: ENTITY_ID
  }));
});