const programsScroll = document.querySelector('.programs-scroll');

if (programsScroll) {
  let isDragging = false;
  let startX;
  let scrollLeft;

  // Cursor inicial
  programsScroll.style.cursor = 'grab';

  // Mouse down → empieza el drag
  programsScroll.addEventListener('mousedown', (e) => {
    isDragging = true;
    programsScroll.style.cursor = 'grabbing';
    startX = e.pageX - programsScroll.offsetLeft;
    scrollLeft = programsScroll.scrollLeft;
  });

  // Mouse move → arrastra
  programsScroll.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - programsScroll.offsetLeft;
    const walk = (x - startX) * 2; // x2 velocidad
    programsScroll.scrollLeft = scrollLeft - walk;
  });

  // Mouse up → termina drag
  programsScroll.addEventListener('mouseup', () => {
    isDragging = false;
    programsScroll.style.cursor = 'grab';
  });

  // Touch events para móvil
  programsScroll.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollLeft = programsScroll.scrollLeft;
  });

  programsScroll.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 2;
    programsScroll.scrollLeft = scrollLeft - walk;
  });
}


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
const AUDIO_URL = 'https://stream-proxy.sebatan4.workers.dev';
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT0eko68LCU9ZrXD2HxEV1EkC1T5Hxd2LAWB4eNZ8FHkgWTuhx75V9YACSQT34JGMgMUv6GvlEtow2S/pub?output=csv'; // REPLACE WITH YOUR YOUTUBE LIVE

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

// Esta función ayuda a limpiar el link sin importar cómo lo pegues en el Excel
function extraerID(url) {
    if (!url) return null;
    // Si es un link largo (watch?v=...)
    if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
    // Si es un link de directo (live/...)
    if (url.includes('live/')) return url.split('live/')[1].split('?')[0];
    // Si es un link corto (youtu.be/...)
    if (url.includes('youtu.be/')) return url.split('.be/')[1].split('?')[0];
    // Si ya es solo el ID, lo devuelve tal cual
    return url.trim();
}

async function toggleVideo(checkbox) {
    const player = document.getElementById('videoPlayer');
    const iframe = document.getElementById('videoIframe');
    const audio = document.getElementById('audioElement');
    const btn = document.getElementById('audioBtn');
    const title = document.getElementById('audioTitle');
    const status = document.getElementById('audioStatus');
    const play = document.getElementById('audioPlay');

    if (checkbox.checked) {
        player.classList.add('active');
        
        try {
            // 1. Pedimos los datos a la hoja de Google
            const response = await fetch(SHEET_CSV_URL);
            const text = await response.text();
            
            // 2. Procesamos el texto de la hoja
            const rows = text.split('\n');
            const contenidoCelda = rows[1]?.trim(); 
            
            // 3. Limpiamos el contenido por si pegaste el link completo
            const idActual = extraerID(contenidoCelda);

            if (idActual) {
                iframe.src = `https://www.youtube.com/embed/${idActual}?autoplay=1&mute=0&controls=1`;
                console.log("Cargado con éxito:", idActual);
            } else {
                throw new Error("Celda vacía");
            }

        } catch (error) {
            console.warn("Fallo lectura de Sheets, usando respaldo:", error);
            // Respaldo automático si falla el Excel
            iframe.src = `https://www.youtube.com/embed/live_stream?channel=UCAvUKBmVQEzKT0vXH6pu4Dg&autoplay=1`;
        }

        // *** LÓGICA DE PAUSA DE AUDIO ***
        if (typeof audioPlaying !== 'undefined' && audioPlaying) {
            audio.pause();
            audio.currentTime = 0;
            audio.src = ''; 
            btn.classList.remove('active');
            title.textContent = 'ESCUCHAR +RADIOPB';
            status.textContent = 'Haz clic para reproducir';
            play.textContent = '▶';
            audioPlaying = false;
            addSystemMessage('📺 Cambiado a streaming de video.');
        } else {
            addSystemMessage('📺 Video iniciado.');
        }

        setTimeout(() => {
            player.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

    } else {
        player.classList.remove('active');
        // Limpiamos el iframe al apagar para que no siga consumiendo datos
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
