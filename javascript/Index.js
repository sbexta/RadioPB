/* ── CURSOR ── */
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';cur.classList.remove('hidden');ring.classList.remove('hidden');});
document.addEventListener('mouseleave',()=>{cur.classList.add('hidden');ring.classList.add('hidden');});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();

/* ── PARTICLES ── */
const canvas=document.getElementById('particleCanvas'),ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();addEventListener('resize',resize);
const pts=Array.from({length:100},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,
  vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.4+.3,
  a:Math.random()*.35+.05,life:0,max:200+Math.random()*300}));
(function anim(){ctx.clearRect(0,0,canvas.width,canvas.height);
  pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life++;
    if(p.life>p.max){p.x=Math.random()*canvas.width;p.y=Math.random()*canvas.height;p.life=0;}
    const a=p.a*Math.sin((p.life/p.max)*Math.PI);
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(212,168,67,${a})`;ctx.fill();});
  requestAnimationFrame(anim);})();

addEventListener('scroll',()=>document.getElementById('mainNav').classList.toggle('scrolled',scrollY>40));

/* ══ STREAM CONFIG ══
   Reemplaza con tus URLs reales:
   AUDIO_SRC → URL de tu stream de audio o embed YouTube live
   VIDEO_SRC → embed de YouTube video live
*/
const AUDIO_SRC = 'https://www.youtube.com/embed/4GQl1_ItREU?autoplay=1&rel=0';
const VIDEO_SRC = 'https://www.youtube.com/embed/4GQl1_ItREU?list=RD4GQl1_ItREU&autoplay=1&rel=0&modestbranding=1';

let currentMode = 'audio';
let audioPlaying = false;

/* ── MODE SWITCH (audio ↔ video) ── */
function switchMode(mode, btn){
  if(currentMode === mode) return;
  currentMode = mode;

  document.querySelectorAll('.stream-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');

  const audioEl = document.getElementById('audioMode');
  const videoEl = document.getElementById('videoMode');
  const badge   = document.getElementById('pbbBadge');
  const title   = document.getElementById('pbbTitle');
  const sub     = document.getElementById('pbbSub');
  const vif     = document.getElementById('videoIframe');
  const vsp     = document.getElementById('videoSpinner');

  if(mode === 'audio'){
    videoEl.classList.remove('active');
    audioEl.style.display = 'flex';
    vif.src = '';
    badge.className = 'pbb-badge audio';
    title.textContent = '+RadioPB · Transmisión de Audio';
    sub.textContent   = 'Bogotá, Colombia · 24/7';
  } else {
    audioEl.style.display = 'none';
    videoEl.classList.add('active');
    vsp.classList.remove('hidden');
    vif.src = VIDEO_SRC;
    badge.className = 'pbb-badge video';
    title.textContent = '+RadioPB · Streaming de Video';
    sub.textContent   = 'Cultos en vivo · Estudios bíblicos';
  }
}

/* ── AUDIO TOGGLE ── */
function toggleAudio(){
  const btn   = document.getElementById('bigPlayBtn');
  const label = document.getElementById('bigPlayLabel');
  const wave  = document.getElementById('liveWave');
  const bars  = wave.querySelectorAll('.lw-bar');
  const iframe= document.getElementById('audioIframe');

  audioPlaying = !audioPlaying;
  if(audioPlaying){
    iframe.src = AUDIO_SRC;
    btn.textContent='⏸'; btn.classList.add('playing');
    label.textContent='Reproduciendo...'; label.classList.add('on');
    wave.classList.add('visible'); bars.forEach(b=>b.classList.add('on'));
    document.querySelectorAll('.prog-card.on-air').forEach(c=>c.classList.add('playing-card'));
    addSystemMsg('📻 Radio iniciada — ¡Que lo disfrutes!');
    updateOnline(+1);
  } else {
    iframe.src='';
    btn.textContent='▶'; btn.classList.remove('playing');
    label.textContent='Reproducir Radio'; label.classList.remove('on');
    wave.classList.remove('visible'); bars.forEach(b=>b.classList.remove('on'));
    document.querySelectorAll('.prog-card').forEach(c=>c.classList.remove('playing-card'));
  }
}

/* hero buttons scroll + auto-switch */
function goLive(mode){
  document.getElementById('en-vivo').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>{
    const tab = mode==='audio' ? document.getElementById('tabAudio') : document.getElementById('tabVideo');
    switchMode(mode, tab);
  }, 600);
}

/* ══ CHAT ENGINE ══ */
const nameColors = ['n-gold','n-red','n-blue','n-green','n-purple'];
const botUsers = [
  {name:'Rodrigo M.', color:'n-gold'},
  {name:'Diego C.',   color:'n-blue'},
  {name:'Anyith E.',  color:'n-green'},
  {name:'Fam. Radio', color:'n-purple'},
  {name:'PBKids',     color:'n-red'},
];
const botMsgs = [
  '¡Dios les bendiga a todos! 🙏','¡Excelente transmisión hoy!','¡Gloria a Dios! 🔥',
  '¡El Señor es bueno! ✝️','Escuchando desde Bogotá ❤️','¡Que bendición estar aquí!',
  'Saludos a toda la comunidad 👏','¡El Faro es mi programa favorito!','¡Feliz de escuchar +RadioPB!',
  'Amén hermanos 🌟','¡Que siga la bendición!','¡Los saludo con mucho amor!',
];

let onlineBase = 3;
function updateOnline(delta){
  onlineBase = Math.max(1, onlineBase + delta);
  document.getElementById('onlineCount').textContent = onlineBase + ' conectados';
}

function getTime(){
  return new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
}

function addMsg(name, text, type='other', color=''){
  const area = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'chat-msg ' + type;

  const avatarBg = type==='own'   ? 'background:rgba(212,168,67,.15);border-color:rgba(212,168,67,.25);' :
                   type==='system'? 'background:rgba(34,197,94,.1);border-color:rgba(34,197,94,.2);' :
                                    'background:rgba(255,255,255,.05);';
  const initials = name.slice(0,2).toUpperCase();

  div.innerHTML = type === 'system' ? `
    <div class="chat-bubble-wrap" style="width:100%;">
      <div class="chat-bubble system">${text}</div>
    </div>` : `
    <div class="chat-avatar" style="${avatarBg}">${type==='own'?'👤':initials.slice(0,1)}</div>
    <div class="chat-bubble-wrap">
      <span class="chat-name ${color}">${name}</span>
      <div class="chat-bubble">${text}</div>
      <span class="chat-time">${getTime()}</span>
    </div>`;

  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function addSystemMsg(text){
  addMsg('', text, 'system');
}

function sendMsg(){
  const inp  = document.getElementById('chatInput');
  const nick = document.getElementById('nickInput').value.trim() || 'Oyente';
  const text = inp.value.trim();
  if(!text) return;
  addMsg(nick, escapeHtml(text), 'own', 'n-gold');
  inp.value = '';
  // simulate reply
  setTimeout(simulateBotMsg, 1200 + Math.random()*2000);
}

function addEmoji(e){
  document.getElementById('chatInput').value += e;
  document.getElementById('chatInput').focus();
}

function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function simulateBotMsg(){
  const u = botUsers[Math.floor(Math.random()*botUsers.length)];
  const m = botMsgs[Math.floor(Math.random()*botMsgs.length)];
  addMsg(u.name, m, 'other', u.color);
}

function clearChat(){
  document.getElementById('chatMessages').innerHTML='';
  addSystemMsg('💬 Chat limpiado · Bienvenido de nuevo');
}

/* Initial bot messages */
function seedChat(){
  addSystemMsg('✝️ Bienvenido al chat de +RadioPB · ¡Escucha en vivo!');
  setTimeout(()=>{ addMsg(botUsers[0].name,'¡Buenas! escuchando desde Bogotá 🙏','other',botUsers[0].color); },700);
  setTimeout(()=>{ addMsg(botUsers[2].name,'¡Que bendición esta programación! ✝️','other',botUsers[2].color); },1600);
  setTimeout(()=>{ addMsg(botUsers[1].name,'¡Saludos a todos los oyentes! 🎵','other',botUsers[1].color); },2800);
}
seedChat();

/* Auto bot messages every 18-35s */
function scheduleBot(){
  const delay = 18000 + Math.random()*17000;
  setTimeout(()=>{
    // show typing
    const ti = document.getElementById('typingIndicator');
    const tn = document.getElementById('typingName');
    const u  = botUsers[Math.floor(Math.random()*botUsers.length)];
    tn.textContent = u.name + ' está escribiendo...';
    ti.classList.add('visible');
    setTimeout(()=>{
      ti.classList.remove('visible');
      addMsg(u.name, botMsgs[Math.floor(Math.random()*botMsgs.length)], 'other', u.color);
      updateOnline(Math.random()>.5?1:-1);
      scheduleBot();
    }, 1400 + Math.random()*800);
  }, delay);
}
scheduleBot();

/* ══ PROGRAMS ══ */
const programs=[
  {emoji:'🌅',time:'05:00–06:00am',day:'diario',dayLabel:'Lun–Sáb',name:'Despierto y Aún Estoy Contigo',host:'Pastor Rodrigo Muñoz',schedule:{days:[1,2,3,4,5,6],startH:5,startM:0,endH:6,endM:0}},
  {emoji:'🛣️',time:'08:00–09:00pm',day:'lunes',dayLabel:'Lunes',name:'El Camino de la Salvación',host:'Misiones PB',schedule:{days:[1],startH:20,startM:0,endH:21,endM:0}},
  {emoji:'🌊',time:'08:00–09:30pm',day:'viernes',dayLabel:'Viernes',name:'El Faro',host:'Jóvenes PB',schedule:{days:[5],startH:20,startM:0,endH:21,endM:30}},
  {emoji:'🌺',time:'04:00–05:00pm',day:'viernes',dayLabel:'Viernes',name:'Talita Cumi',host:'Jaidin Ortega',schedule:{days:[5],startH:16,startM:0,endH:17,endM:0}},
  {emoji:'🎺',time:'10:00am–12:00pm',day:'sabado',dayLabel:'Sábados',name:'Conexión Tropical',host:'Anyith Estrada',schedule:{days:[6],startH:10,startM:0,endH:12,endM:0}},
  {emoji:'📜',time:'07:30–09:00pm',day:'miercoles',dayLabel:'Miércoles',name:'Raíces de Antaño',host:'Diego Calderón',schedule:{days:[3],startH:19,startM:30,endH:21,endM:0}},
  {emoji:'👶',time:'03:00–04:00pm',day:'sabado',dayLabel:'Sábados',name:'Más Radio PBKids',host:'Escuela Infantil',schedule:{days:[6],startH:15,startM:0,endH:16,endM:0}},
  {emoji:'👑',time:'09:00–10:30am',day:'diario',dayLabel:'Lun–Vie',name:'Mujer VIP',host:'Dorcas Nacional',schedule:{days:[1,2,3,4,5],startH:9,startM:0,endH:10,endM:30}},
];
function isOnAir(p){
  const now=new Date(),dow=now.getDay(),mins=now.getHours()*60+now.getMinutes(),s=p.schedule;
  return s.days.includes(dow)&&mins>=s.startH*60+s.startM&&mins<s.endH*60+s.endM;
}
function renderPrograms(filter='todos'){
  const grid=document.getElementById('progGrid');
  const list=filter==='todos'?programs:programs.filter(p=>p.day===filter);
  grid.innerHTML='';
  list.forEach((p,i)=>{
    const onAir=isOnAir(p);
    const card=document.createElement('div');
    card.className='prog-card reveal'+(onAir?' on-air':'');
    card.style.transitionDelay=(i*.05)+'s';
    card.innerHTML=`
      <div class="prog-visual">
        <div class="prog-emoji">${p.emoji}</div>
        <div class="prog-time">${p.time}</div>
        <div class="on-air-badge${onAir?' visible':''}"><div class="on-air-dot"></div><span class="on-air-text">En Vivo</span></div>
        <div class="card-wave">
          <div class="cw-bar${onAir?' on':''}" style="animation-delay:.00s"></div>
          <div class="cw-bar${onAir?' on':''}" style="animation-delay:.12s"></div>
          <div class="cw-bar${onAir?' on':''}" style="animation-delay:.06s"></div>
          <div class="cw-bar${onAir?' on':''}" style="animation-delay:.18s"></div>
          <div class="cw-bar${onAir?' on':''}" style="animation-delay:.09s"></div>
        </div>
      </div>
      <div class="prog-body">
        <div class="prog-day-tag">${p.dayLabel}</div>
        <div class="prog-name">${p.name}</div>
        <div class="prog-host">${p.host}</div>
      </div>`;
    grid.appendChild(card);
  });
  setTimeout(()=>grid.querySelectorAll('.reveal').forEach(el=>el.classList.add('in')),60);
}
renderPrograms();
function filterDay(btn,day){
  document.querySelectorAll('.day-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');renderPrograms(day);
}
setInterval(()=>renderPrograms(document.querySelector('.day-tab.active')?.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]||'todos'),60000);

/* scroll reveal */
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');});},{threshold:.1});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el=>obs.observe(el));
