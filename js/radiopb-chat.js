import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getDatabase, 
  ref, 
  push, 
  onChildAdded, 
  query, 
  limitToLast
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpAGuzIF0Rs__ew8gl6hmJ_BCnSQGA1EM",
  authDomain: "chat-radiopb.firebaseapp.com",
  databaseURL: "https://chat-radiopb-default-rtdb.firebaseio.com",
  projectId: "chat-radiopb",
  storageBucket: "chat-radiopb.firebasestorage.app",
  messagingSenderId: "904642345701",
  appId: "1:904642345701:web:99f1614562a0ceaf44720c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const chatRef = ref(db, "chat");

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

  push(chatRef, {
    user: name,
    text: text,
    timestamp: Date.now()
  });

  chatInput.value = "";
};

/* =========================
   RECIBIR MENSAJES
========================= */
const chatQuery = query(chatRef, limitToLast(100));

onChildAdded(chatQuery, (snapshot) => {
  const msg = snapshot.val();

  const div = document.createElement("div");
  div.classList.add("chat-msg");

  div.innerHTML = `
    <div class="msg-content">
      <div class="msg-name">${escapeHtml(msg.user)}</div>
      <div class="msg-text">${escapeHtml(msg.text)}</div>
    </div>
  `;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

/* =========================
   ESCAPE HTML
========================= */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
