/* ── CURSOR ── */
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();

/* ── PARTICLES ── */
const canvas=document.getElementById('particleCanvas'),ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
resize();addEventListener('resize',resize);
const pts=Array.from({length:80},()=>({
  x:Math.random()*innerWidth,y:Math.random()*innerHeight,
  vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25-(Math.random()*.15),
  r:Math.random()*1.4+.3,a:Math.random()*.35+.05,
  life:0,max:220+Math.random()*280
}));
(function anim(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.life++;
    if(p.life>p.max){Object.assign(p,{x:Math.random()*canvas.width,y:Math.random()*canvas.height,life:0});}
    const t=p.life/p.max,a=p.a*Math.sin(t*Math.PI);
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(212,168,67,${a})`;ctx.fill();
  });
  requestAnimationFrame(anim);
})();

/* ── TABS ── */
function switchTab(name,btn){
  document.querySelectorAll('.method-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+name).classList.add('active');
  setTimeout(()=>{
    document.querySelectorAll('#panel-'+name+' .reveal').forEach(el=>el.classList.add('in'));
  },60);
}

/* ── AMOUNT CHIPS ── */
function selectAmount(el,val){
  document.querySelectorAll('.amount-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  const wrap=document.getElementById('customAmountWrap');
  wrap.style.display=(val==='otro')?'flex':'none';
}

/* ── COPY ── */
function copyText(text,btn){
  navigator.clipboard.writeText(text).catch(()=>{});
  btn.classList.add('copied');
  showToast('✓ Copiado: '+text.substring(0,22)+(text.length>22?'…':''));
  setTimeout(()=>btn.classList.remove('copied'),2000);
}

/* ── TOAST ── */
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

/* ── VERSES ── */
const verses=[
  {text:'El que siembra escasamente, también segará escasamente; y el que siembra generosamente, generosamente también segará.',ref:'2 Corintios 9:6'},
  {text:'Traed todos los diezmos al alfolí... y probadme ahora en esto, dice Jehová de los ejércitos.',ref:'Malaquías 3:10'},
  {text:'Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre.',ref:'2 Corintios 9:7'},
  {text:'Dad, y se os dará; medida buena, apretada, remecida y rebosando darán en vuestro regazo.',ref:'Lucas 6:38'},
];
let verseIdx=0;
function buildDots(){
  const c=document.getElementById('verseDots');c.innerHTML='';
  verses.forEach((_,i)=>{
    const b=document.createElement('button');b.className='verse-dot'+(i===verseIdx?' active':'');
    b.onclick=()=>goVerse(i);c.appendChild(b);
  });
}
function goVerse(i){
  verseIdx=i;
  const vc=document.getElementById('verseCard');
  vc.style.opacity='0';vc.style.transform='translateY(8px)';
  setTimeout(()=>{
    document.getElementById('verseText').textContent=verses[i].text;
    document.getElementById('verseRef').textContent=verses[i].ref;
    buildDots();
    vc.style.opacity='1';vc.style.transform='translateY(0)';
  },250);
}
buildDots();
document.getElementById('verseCard').style.transition='opacity .3s ease,transform .3s ease';
setInterval(()=>goVerse((verseIdx+1)%verses.length),5500);

/* ── SCROLL REVEAL ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');});
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
setTimeout(()=>{
  document.querySelectorAll('#panel-nequi .reveal').forEach(el=>el.classList.add('in'));
},200);
