// Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  menuOverlay.classList.toggle('open');
});

document.querySelectorAll('.menu-nav a').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    menuOverlay.classList.remove('open');
  });
});

// STREAMING
const AUDIO_URL = 'https://stream.zeno.fm/your-radio-stream'; // REPLACE WITH YOUR STREAM
const VIDEO_URL = 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=1'; // REPLACE WITH YOUR YOUTUBE LIVE

let audioPlaying = false;

function toggleAudio() {
  const btn = document.getElementById('audioBtn');
  const title = document.getElementById('audioTitle');
  const status = document.getElementById('audioStatus');
  const play = document.getElementById('audioPlay');
  const audio = document.getElementById('audioElement');
  
  audioPlaying = !audioPlaying;
  
  if (audioPlaying) {
    btn.classList.add('active');
    title.textContent = '+RADIOPB EN VIVO';
    status.textContent = '🔴 Transmitiendo desde Bogotá';
    play.textContent = '⏸';
    
    audio.src = AUDIO_URL;
    audio.play().catch(e => {
      console.log('Audio error:', e);
      setTimeout(() => audio.play(), 500);
    });
    
    // Show welcome message in chat
    addSystemMessage('📻 Radio iniciada. ¡Bienvenido a +RadioPB!');
  } else {
    btn.classList.remove('active');
    title.textContent = 'ESCUCHAR +RADIOPB';
    status.textContent = 'Haz clic para reproducir';
    play.textContent = '▶';
    
    audio.pause();
    audio.currentTime = 0;
  }
}

function toggleVideo(checkbox) {
  const player = document.getElementById('videoPlayer');
  const iframe = document.getElementById('videoIframe');
  const audio = document.getElementById('audioElement');
  const btn = document.getElementById('audioBtn');
  const title = document.getElementById('audioTitle');
  const status = document.getElementById('audioStatus');
  const play = document.getElementById('audioPlay');
  
  if (checkbox.checked) {
    player.classList.add('active');
    iframe.src = VIDEO_URL;
    
    // *** STOP AUDIO IF PLAYING ***
    if (audioPlaying) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = ''; // Clear source
      btn.classList.remove('active');
      title.textContent = 'ESCUCHAR +RADIOPB';
      status.textContent = 'Haz clic para reproducir';
      play.textContent = '▶';
      audioPlaying = false;
      
      // Notify in chat
      addSystemMessage('📺 Cambiado a streaming de video.');
    } else {
      addSystemMessage('📺 Video iniciado.');
    }
    
    setTimeout(() => {
      player.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  } else {
    player.classList.remove('active');
    setTimeout(() => iframe.src = '', 400);
  }
}

function closeVideo() {
  const checkbox = document.getElementById('videoCheck');
  const player = document.getElementById('videoPlayer');
  const iframe = document.getElementById('videoIframe');
  
  checkbox.checked = false;
  player.classList.remove('active');
  setTimeout(() => iframe.src = '', 400);
}

// ═══════════════════════════════════════════════════
// CHAT FUNCTIONALITY
// ═══════════════════════════════════════════════════

function addSystemMessage(text) {
  const messagesContainer = document.getElementById('chatMessages');
  
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg system';
  msgDiv.innerHTML = `
    <span class="msg-icon">✝️</span>
    <span class="msg-text">${text}</span>
  `;
  
  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}



// Copy to clipboard
function copy(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ COPIADO';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove('copied');
    }, 2000);
  });
}
