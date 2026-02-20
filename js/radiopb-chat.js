/* =========================
   CONFIGURAR PUSHER
========================= */

const pusher = new Pusher("8ac472c4fd3463c85dbd", {
  cluster: "us2"
});

const channel = pusher.subscribe("radiopb-chat");

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatName = document.getElementById("chatName");

/* =========================
   GUARDAR NOMBRE LOCAL
========================= */
if(localStorage.getItem("radioName")){
  chatName.value = localStorage.getItem("radioName");
}

chatName.addEventListener("change", () => {
  localStorage.setItem("radioName", chatName.value);
});

/* =========================
   ENVIAR MENSAJE
========================= */
window.sendMessage = function() {

  const text = chatInput.value.trim();
  const name = chatName.value.trim();

  if (!name) {
    alert("Escribe tu nombre primero");
    return;
  }

  if (!text) return;

  fetch("/api/send-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message: text })
  });

  chatInput.value = "";
};

/* =========================
   RECIBIR MENSAJES
========================= */
channel.bind("nuevo-mensaje", function(data) {

  const div = document.createElement("div");
  div.classList.add("chat-msg");

  div.innerHTML = `
    <div class="msg-content">
      <div class="msg-name">${escapeHtml(data.name)}</div>
      <div class="msg-text">${escapeHtml(data.message)}</div>
    </div>
  `;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

/* =========================
   ESCAPE HTML
========================= */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}