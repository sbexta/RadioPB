/* ── CURSOR ── */
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
  cur.classList.remove('hidden');ring.classList.remove('hidden');});
document.addEventListener('mouseleave',()=>{cur.classList.add('hidden');ring.classList.add('hidden');});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();

/* ── PARTICLES ── */
const canvas=document.getElementById('particleCanvas'),ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();addEventListener('resize',resize);
const pts=Array.from({length:80},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,
  vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.3+.3,
  a:Math.random()*.3+.05,life:0,max:200+Math.random()*280}));
(function anim(){ctx.clearRect(0,0,canvas.width,canvas.height);
  pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life++;
    if(p.life>p.max){p.x=Math.random()*canvas.width;p.y=Math.random()*canvas.height;p.life=0;}
    const a=p.a*Math.sin((p.life/p.max)*Math.PI);
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(212,168,67,${a})`;ctx.fill();});
  requestAnimationFrame(anim);})();

/* ── SCHEDULE ── */
const schedule=[
  {day:'Lunes',    dow:1, time:'Cerrado',         closed:true},
  {day:'Martes',   dow:2, time:'7:00 – 9:00 PM',  closed:false},
  {day:'Miércoles',dow:3, time:'Cerrado',          closed:true},
  {day:'Jueves',   dow:4, time:'7:00 – 9:00 PM',  closed:false},
  {day:'Viernes',  dow:5, time:'Cerrado',          closed:true},
  {day:'Sábado',   dow:6, time:'7:00 – 9:00 PM',  closed:false},
  {day:'Domingo',  dow:0, time:'10:00 AM – 12:00 PM',closed:false},
];
function buildSchedule(){
  const today=new Date().getDay();
  const rows=document.getElementById('scheduleRows');
  schedule.forEach(s=>{
    const isToday=s.dow===today;
    const div=document.createElement('div');
    div.className='sch-row'+(isToday?' today':'');
    div.innerHTML=`
      <span class="sch-day">${s.day}${isToday?'<span class="today-tag">Hoy</span>':''}</span>
      ${s.closed
        ? `<span class="sch-closed">Cerrado</span>`
        : `<span class="sch-time">${s.time}</span>`
      }`;
    rows.appendChild(div);
  });
}
buildSchedule();

/* ── TOPIC PILLS ── */
function selectTopic(el){
  document.querySelectorAll('.topic-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
}

/* ── FORM SUBMIT ── */
function submitForm(){
  const btn=document.getElementById('submitBtn');
  const icon=document.getElementById('submitIcon');
  const text=document.getElementById('submitText');
  const name=document.getElementById('fName').value.trim();
  const email=document.getElementById('fEmail').value.trim();
  const msg=document.getElementById('fMsg').value.trim();

  if(!name||!email||!msg){
    btn.style.animation='shake .4s ease';
    setTimeout(()=>btn.style.animation='',450);
    // highlight empty
    [['fName',name],['fEmail',email],['fMsg',msg]].forEach(([id,val])=>{
      const el=document.getElementById(id);
      if(!val){el.style.borderColor='rgba(232,64,64,.6)';el.focus();
        setTimeout(()=>el.style.borderColor='',2500);}
    });
    return;
  }

  // Sending state
  icon.textContent='⏳'; text.textContent='Enviando...';
  btn.style.opacity='.8'; btn.style.pointerEvents='none';

  setTimeout(()=>{
    document.getElementById('formContent').style.display='none';
    document.getElementById('formSuccess').classList.add('visible');
  },1600);
}

/* ── CSS shake ── */
const style=document.createElement('style');
style.textContent=`@keyframes shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-6px);}40%,80%{transform:translateX(6px);}}`;
document.head.appendChild(style);

function resetForm(){
  document.getElementById('formContent').style.display='block';
  document.getElementById('formSuccess').classList.remove('visible');
  document.getElementById('submitBtn').style.opacity='';
  document.getElementById('submitBtn').style.pointerEvents='';
  document.getElementById('submitIcon').textContent='✉';
  document.getElementById('submitText').textContent='Enviar Mensaje';
  ['fName','fLast','fEmail','fPhone','fMsg'].forEach(id=>document.getElementById(id).value='');
}

/* ── SCROLL REVEAL ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');});
},{threshold:.1});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el=>obs.observe(el));
