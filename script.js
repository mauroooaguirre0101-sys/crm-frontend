// ========== SUPABASE ==========

const API_URL = "https://noble-determination-production.up.railway.app";

const _sb = (typeof supabase !== 'undefined')
  ? supabase.createClient(
      "https://zyoqgyjshjvttwypiqhp.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5b3FneWpzaGp2dHR3eXBpcWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTU4MzcsImV4cCI6MjA5MjczMTgzN30.NZHO9QGpb0ANRU8qPNEc6Y_Ow5qMVtcAGN-IvxDfSDA"
    )
  : null;

// ========== UTILS ==========
function ld(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}

// ========== SPLASH ==========
const _splashDone = new Promise(res => setTimeout(res, 5500));
function hideSplash(){
  return _splashDone.then(()=>{
    const s = document.getElementById('splash');
    if(!s || s.dataset.hidden) return;
    s.dataset.hidden = '1';
    s.classList.add('hiding');
    return new Promise(r => setTimeout(r, 560));
  });
}
const SPLASH_NAME_MAP = {
  'tomasfernandezhuguenine@gmail.com': 'Tomi',
  'lopezvalen.biz@gmail.com':          'Valen',
  'maurooo.aguirre0101@gmail.com':     'Mauro',
};

// ── Nickname system ──────────────────────────────────────────────
const _NICKNAMES_KEY = 'crm_user_nicknames';
function _getNicknameMap(){ try{ return JSON.parse(localStorage.getItem(_NICKNAMES_KEY)||'{}'); } catch{ return {}; } }
function _getNickname(email){
  if(!email) return null;
  const key = email.trim().toLowerCase();
  const map  = _getNicknameMap();
  return map[key] || SPLASH_NAME_MAP[key] || null;
}
function _storeNickname(email, nick){
  const map = _getNicknameMap();
  map[email.trim().toLowerCase()] = nick.trim();
  localStorage.setItem(_NICKNAMES_KEY, JSON.stringify(map));
}
function _updateUserNickname(){
  const nick = _getNickname(currentUser?.email);
  const el   = document.getElementById('user-email-label');
  if(el) el.textContent = nick || currentUser?.email || '—';
}
function saveNickname(){
  const input = document.getElementById('nickname-input');
  const nick  = (input?.value || '').trim();
  if(!nick){ toast('Ingresá un apodo'); input?.focus(); return; }
  if(!currentUser?.email) return;
  _storeNickname(currentUser.email, nick);
  closeModal('modal-nickname');
  setSplashName(currentUser.email);
  _updateUserNickname();
  toast(`Bienvenido, ${nick} ✓`);
}
function _checkNicknamePrompt(){
  if(!currentUser?.email) return;
  if(_getNickname(currentUser.email)) return;
  setTimeout(()=>openModal('modal-nickname'), 900);
}
// ────────────────────────────────────────────────────────────────

function setSplashName(email){
  const el = document.getElementById('sp-name-val');
  if(!el) return;
  if(!email){ el.textContent = 'Bienvenido'; return; }
  const nick = _getNickname(email);
  if(nick){ el.textContent = `Bienvenido, ${nick}`; return; }
  const local  = email.split('@')[0];
  const first  = local.split('.')[0];
  const noNums = first.replace(/\d+$/, '');
  const clean  = noNums.replace(/(.)\1+/g, '$1');
  const name   = clean ? clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase() : '';
  el.textContent = name ? `Bienvenido, ${name}` : 'Bienvenido';
}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2)}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
let _audioCtx=null;
document.addEventListener('click',()=>{
  if(!_audioCtx){try{_audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}
  else if(_audioCtx.state==='suspended') _audioCtx.resume();
},{capture:true,passive:true});
function playCashSound(){
  try{
    if(!_audioCtx) _audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    const ctx=_audioCtx;
    const play=()=>{
      const now=ctx.currentTime;
      // "cha" — mechanical clank: filtered noise burst
      const nBuf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.055),ctx.sampleRate);
      const nd=nBuf.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=(Math.random()*2-1);
      const nSrc=ctx.createBufferSource();nSrc.buffer=nBuf;
      const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2800;bp.Q.value=1.2;
      const nGain=ctx.createGain();
      nSrc.connect(bp);bp.connect(nGain);nGain.connect(ctx.destination);
      nGain.setValueAtTime(0.55,now);nGain.exponentialRampToValueAtTime(0.001,now+0.055);
      nSrc.start(now);
      // "ching" — bell ring with harmonics (cash register tone)
      [
        [2093,0.04,0.004,0.55,0.38],
        [4186,0.04,0.003,0.40,0.22],
        [6279,0.04,0.002,0.28,0.10],
        [1396,0.04,0.004,0.45,0.12],
      ].forEach(([freq,delay,atk,dur,vol])=>{
        const osc=ctx.createOscillator();const g=ctx.createGain();
        osc.connect(g);g.connect(ctx.destination);
        osc.type='sine';osc.frequency.value=freq;
        const t=now+delay;
        g.gain.setValueAtTime(0.001,t);
        g.gain.linearRampToValueAtTime(vol,t+atk);
        g.gain.exponentialRampToValueAtTime(0.001,t+dur);
        osc.start(t);osc.stop(t+dur+0.05);
      });
    };
    ctx.state==='suspended'?ctx.resume().then(play):play();
  }catch(e){}
}
function fmt(n){return n?n.toLocaleString('es-AR',{minimumFractionDigits:0}):'0'}
function fmtUSD(n){return n?'$'+fmt(n):'$0'}

// ========== apiFetch GLOBAL ==========
function apiFetch(url, options={}){
  const cliente_id = localStorage.getItem('clienteSeleccionado')||'';
  const email      = localStorage.getItem('userEmail')||'';
  if(!cliente_id || !email){
  throw new Error('Faltan headers de autenticación');
}
  return fetch(url,{
    ...options,
    headers:{
      'Content-Type':'application/json',
      'x-cliente-id': cliente_id,
      'x-user-email': email,
      ...(options.headers||{}),
    },
  });
}

// ========== STATE (localStorage — namespaced por cliente) ==========
// Dynamic client id — always reads current selection so saves never go to the wrong client
function getCid(){return localStorage.getItem('clienteSeleccionado')||'default';}
function getKeys(){
  const cid=getCid();
  return{
    tasks:   `exp2_tasks_${cid}`,
    found:   `exp2_found_${cid}`,
    content: `exp2_content_${cid}`,
    hists:   `exp2_hists_${cid}`,
    comps:   `exp2_comps_${cid}`,
    mets:    `exp2_mets_${cid}`,
    clients: `exp2_clients_${cid}`,
    ing:     `exp2_ing_${cid}`,
    gas:     `exp2_gas_${cid}`,
    angulos: `exp2_angulos_${cid}`,
    refs:    `exp2_refs_${cid}`,
    cuotas:  `exp2_cuotas_${cid}`,
    sops:    `crm_sops_${cid}`,
  };
}

// S is initialized from localStorage at page load (page always reloads on client switch)
let S=(()=>{const K=getKeys();return{
  tasks:   ld(K.tasks,   initTasks()),
  found:   ld(K.found,   {}),
  content: ld(K.content, []),
  hists:   ld(K.hists,   []),
  comps:   ld(K.comps,   []),
  mets:    ld(K.mets,    []),
  clients: ld(K.clients, []),
  ing:     ld(K.ing,     []),
  gas:     ld(K.gas,     []),
  angulos: ld(K.angulos, []),
  refs:    ld(K.refs,    []),
  cuotas:  ld(K.cuotas,  []),
  sops:    ld(K.sops,    []),
};})();

let leadsCache = [];
window.leadsCache = leadsCache;


function save(key){sv(getKeys()[key],S[key]);}

// ========== DEFAULT TASKS ==========
function initTasks(){
  return [
    {id:'f1',fase:1,label:'Fase 1 — Onboarding',tasks:[
      {id:uid(),text:'Ver el Pre-Onboarding y agendar llamada',done:false},
      {id:uid(),text:'Ver el Módulo 1',done:false},
      {id:uid(),text:'Ver el Módulo 2',done:false},
    ]},
    {id:'f2',fase:2,label:'Fase 2 — Fundaciones',tasks:[
      {id:uid(),text:'Ver el Módulo 2 y 3 y completar los documentos',done:false},
      {id:uid(),text:'Definir Nicho y Subnicho',done:false},
      {id:uid(),text:'Definir Cliente ideal PC 1, 2 y 3',done:false},
      {id:uid(),text:'Oferta creada',done:false},
      {id:uid(),text:'Promesa creada (Para Bio)',done:false},
      {id:uid(),text:'Documento de Avatar completo',done:false},
      {id:uid(),text:'Documento de Oferta OER completo',done:false},
      {id:uid(),text:'Oferta, Precio y Entregables armados',done:false},
      {id:uid(),text:'Roadmap del Cliente hecho (Miro)',done:false},
    ]},
    {id:'f3',fase:3,label:'Fase 3 — Contenido',tasks:[
      {id:uid(),text:'Ver el Módulo 4',done:false},
      {id:uid(),text:'Crear cuenta fantasma',done:false},
      {id:uid(),text:'Anotar 5-10 Referentes (Posicionamiento)',done:false},
      {id:uid(),text:'Seguir a 30-40 Referentes (Contenido)',done:false},
      {id:uid(),text:'Tener el Avatar - Oferta - Servicio (Definido)',done:false},
      {id:uid(),text:'Tengo el Notion Completo (Estrategia de Marca)',done:false},
      {id:uid(),text:'Agendar 1-1 con Alex (Estrategia de Contenido)',done:false},
      {id:uid(),text:'Optimización de perfil (Foto - Desc cambiada)',done:false},
      {id:uid(),text:'Historia Destacada "Que hago" (Creada)',done:false},
      {id:uid(),text:'Historia Destacada "Quien soy" (Creada)',done:false},
      {id:uid(),text:'Reel/Carrusel "Que hago" (Creado)',done:false},
      {id:uid(),text:'Reel/Carrusel "Que Logre" (Creado)',done:false},
      {id:uid(),text:'Reel/Carrusel "Quien soy" (Creado)',done:false},
      {id:uid(),text:'Anotar las métricas (Hecho)',done:false},
    ]},
    {id:'f4',fase:4,label:'Fase 4 — Ventas',tasks:[
      {id:uid(),text:'Ver el Módulo 5',done:false},
      {id:uid(),text:'Armar tu estructura de prospección',done:false},
      {id:uid(),text:'Buscar y anotar +100 leads (Para prospectar)',done:false},
      {id:uid(),text:'Tengo mi CRM (Para métricas de prospección)',done:false},
      {id:uid(),text:'Revise Chats con Lucas',done:false},
      {id:uid(),text:'Arme las automatizaciones de Manychat',done:false},
      {id:uid(),text:'Tengo el Guión de Ventas',done:false},
      {id:uid(),text:'Ya agende mi primer llamada',done:false},
      {id:uid(),text:'Ya revise las llamadas con Guido',done:false},
      {id:uid(),text:'Cerré mi primer venta',done:false},
      {id:uid(),text:'Mejoré mi AOV',done:false},
    ]},
    {id:'f5',fase:5,label:'Fase 5 — Sistemas',tasks:[
      {id:uid(),text:'Tengo el Calendly configurado (preguntas y horarios)',done:false},
      {id:uid(),text:'Conecté Zapier a Calendly y Whatsapp (EOD)',done:false},
      {id:uid(),text:'Armé las etapas del servicio (Roadmap de Cliente)',done:false},
      {id:uid(),text:'Tengo la trazabilidad hecha de mi contenido',done:false},
      {id:uid(),text:'Tengo la trazabilidad hecha de mis llamadas',done:false},
      {id:uid(),text:'Tengo Ángulos de Venta',done:false},
      {id:uid(),text:'Tengo Ángulos de Contenido',done:false},
      {id:uid(),text:'Tengo Claude con el negocio (Información)',done:false},
      {id:uid(),text:'Armé SOPs para contratar equipo',done:false},
      {id:uid(),text:'Contraté un Editor',done:false},
      {id:uid(),text:'Prendí ADS',done:false},
    ]},
  ];
}

// ========== CURRENCY SYSTEM ==========
const CURRENCIES={
  USD:{name:'Dólar Estadounidense',code:'USD',symbol:'USD $',rate:1,locale:'en-US'},
  UYU:{name:'Peso Uruguayo',code:'UYU',symbol:'$U',rate:41,locale:'es-UY'},
  ARS:{name:'Peso Argentino',code:'ARS',symbol:'$',rate:1050,locale:'es-AR'},
  BRL:{name:'Real Brasileño',code:'BRL',symbol:'R$',rate:5.1,locale:'pt-BR'},
  EUR:{name:'Euro',code:'EUR',symbol:'€',rate:0.92,locale:'de-DE'},
  MXN:{name:'Peso Mexicano',code:'MXN',symbol:'$',rate:17.1,locale:'es-MX'},
  COP:{name:'Peso Colombiano',code:'COP',symbol:'$',rate:4000,locale:'es-CO'},
  CLP:{name:'Peso Chileno',code:'CLP',symbol:'$',rate:950,locale:'es-CL'},
  PEN:{name:'Sol Peruano',code:'PEN',symbol:'S/',rate:3.75,locale:'es-PE'},
  GBP:{name:'Libra Esterlina',code:'GBP',symbol:'£',rate:0.79,locale:'en-GB'},
};
let currState=ld('crm_currency',{code:'USD',rate:1});

function getCurr(){return CURRENCIES[currState.code]||CURRENCIES.USD;}
function fmtMoney(usdAmount){
  const curr=getCurr();
  const val=(+usdAmount||0)*currState.rate;
  if(currState.code==='USD')return 'USD $'+fmt(val);
  return curr.symbol+' '+fmt(Math.round(val));
}
function onCurrencyChange(){
  const sel=document.getElementById('currency-select');
  const code=sel.value;
  const curr=CURRENCIES[code];
  currState.code=code;
  currState.rate=curr.rate;
  document.getElementById('currency-rate').value=curr.rate;
  document.getElementById('currency-code-label').textContent=code;
  document.getElementById('currency-info-text').textContent=
    code==='USD'?'Moneda base del sistema':`1 USD = ${curr.rate} ${curr.name.split(' ').slice(0,2).join(' ')}`;
  sv('crm_currency',currState);
  renderDash();
}
function onRateChange(){
  const rate=parseFloat(document.getElementById('currency-rate').value)||1;
  currState.rate=rate;
  const code=currState.code;
  const curr=CURRENCIES[code]||{name:code};
  document.getElementById('currency-info-text').textContent=
    code==='USD'?'Moneda base del sistema':`1 USD = ${rate} ${curr.name.split(' ').slice(0,2).join(' ')}`;
  sv('crm_currency',currState);
  renderDash();
}
function initCurrencyUI(){
  const sel=document.getElementById('currency-select');
  sel.value=currState.code;
  document.getElementById('currency-rate').value=currState.rate;
  document.getElementById('currency-code-label').textContent=currState.code;
  const curr=getCurr();
  document.getElementById('currency-info-text').textContent=
    currState.code==='USD'?'Moneda base del sistema':`1 USD = ${currState.rate} ${curr.name.split(' ').slice(0,2).join(' ')}`;
}

// ========== NAV ==========
let dashFilter='mes';
let contFilterTipo='Todos',contFilterTime='todo',contFilterWinner=false,_contView='produccion';
let _contStatsFilter='semana';   // 'semana' | 'mes' | 'custom'
let _contStatsFrom='';           // YYYY-MM-DD  (used when custom)
let _contStatsTo='';

function setContView(v){
  _contView=v;
  document.getElementById('cont-main-section').style.display=v==='produccion'?'':'none';
  document.getElementById('cont-subido-section').style.display=v==='subido'?'':'none';
  document.getElementById('cont-view-prod').classList.toggle('active',v==='produccion');
  document.getElementById('cont-view-sub').classList.toggle('active',v==='subido');
  renderCont();
}
let dashChart=null;
let dashChartRestricted=null;
let _contCharts=[null,null,null,null,null,null,null,null];
let _calView='mes';
let _calDate=new Date();
let _calPanelItem=null;
let _calPanelFecha=null;

function nav(id,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active','page-entering'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const pg=document.getElementById('page-'+id);
  pg.classList.add('active','page-entering');
  requestAnimationFrame(()=>requestAnimationFrame(()=>pg.classList.remove('page-entering')));
  if(el)el.classList.add('active');
  if(id!=='leads'){
    if(_leadsInterval)        {clearInterval(_leadsInterval);_leadsInterval=null;}
    if(_leadsFullRefreshTimer){clearInterval(_leadsFullRefreshTimer);_leadsFullRefreshTimer=null;}
    if(_leadsPageInterval)    {clearInterval(_leadsPageInterval);_leadsPageInterval=null;}
  }
  const renders={dash:renderDash,acc:renderSOPS,found:renderFound,cont:renderCont,
    ang:renderAng,ref:renderRef,leads:renderLeads,funnel:renderFunnelMetricas,calls:renderCallsPage,
    clients:renderClients,fin:renderFin,ig:renderIG,formatos:renderFormatos,lab:renderLab,forms:renderForms,tasks:renderTasks,reports:renderReports,ideas:renderCrmIdeas};
  // Re-fetch server data on navigation so changes by other users are always visible
  const refetch={
    cont:fetchContenido, found:fetchFundaciones, ang:fetchAngulos,
    ref:fetchReferentes, ig:fetchIG,
    clients:()=>{const sel=document.getElementById('clients-mes-select');if(sel)sel.value=String(new Date().getMonth());return Promise.all([fetchClients(),fetchCuotas()]).then(_seedMissingCuotas);}, fin:()=>{fetchIngresos();fetchEgresos();},
    formatos:fetchFormatos, lab:fetchLaboratorio,
    ideas:fetchCrmIdeas,
  };
  if(id==='equipo'){
    fetchEquipoMembers();
  } else if(renders[id]){
    if(refetch[id]){
      refetch[id]().then(()=>renders[id]()).catch(()=>renders[id]());
    } else {
      renders[id]();
    }
  }
  setTimeout(_gfSyncTabs, 0);
}

// ========== MODAL HELPERS ==========
function openModal(id){
  document.getElementById(id).classList.add('open');
  document.querySelectorAll('#'+id+' input, #'+id+' select, #'+id+' textarea').forEach(el=>{
    if(el.dataset.noReset==='1') return;
    if(el.type==='number')el.value='0';
    else if(el.type==='date')el.value='';
    else if(el.tagName==='SELECT')el.selectedIndex=0;
    else if(!el.disabled)el.value='';
  });
  if(id==='modal-nickname') setTimeout(()=>document.getElementById('nickname-input')?.focus(),150);
  ['a-pc','a-uc'].forEach(id2=>{
    const w=document.getElementById(id2+'-wrap');
    if(w){w.querySelectorAll('.chip').forEach(c=>c.remove());}
  });
  currentChips={};
  const preview=document.getElementById('cl2-whatsapp-preview');
  if(preview) preview.textContent='+598';
}
function closeModal(id){document.getElementById(id).classList.remove('open')}
function closeBg(e,el){if(e.target===el)el.classList.remove('open')}

// ========== CHIPS ==========
let currentChips={'a-pc':[],'a-uc':[]};
function chipsKey(e,ns){
  if(e.key==='Enter'||e.key===','){e.preventDefault();addChip(ns);}
}
function addChip(ns){
  const inp=document.getElementById(ns+'-input');
  const val=inp.value.trim();
  if(!val)return;
  if(!currentChips[ns])currentChips[ns]=[];
  currentChips[ns].push(val);
  renderChips(ns);
  inp.value='';
}
function removeChip(ns,i){
  currentChips[ns].splice(i,1);
  renderChips(ns);
}
function renderChips(ns){
  const wrap=document.getElementById(ns+'-wrap');
  wrap.querySelectorAll('.chip').forEach(c=>c.remove());
  (currentChips[ns]||[]).forEach((v,i)=>{
    const c=document.createElement('div');c.className='chip';
    c.innerHTML=`${v}<button class="chip-x" onclick="removeChip('${ns}',${i})">×</button>`;
    wrap.insertBefore(c,document.getElementById(ns+'-input'));
  });
}

// ========== AVATAR COLORS ==========
const avatarColors=['#3d6aaa','#7a4ab8','#3d8a5a','#b84848','#c4882a','#4a7a6a','#8a4a6a'];
function avatarChip(name){
  const initials=(name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const col=avatarColors[(name||'').charCodeAt(0)%avatarColors.length];
  return `<div class="avatar-chip" style="background:${col}">${initials}</div>`;
}

// ========== STATUS BADGE ==========
function leadBadge(s){
  const m={Nuevo:'bgy',Contactado:'bb',Agendado:'bg',Seguimiento:'ba',Cerrado:'bgr',Perdido:'br'};
  return `<span class="badge ${m[s]||'bgy'}">${s}</span>`;
}
function clientBadge(s){
  const m={'Al día':'bgr',Pendiente:'ba',Vencido:'br',Inactivo:'bgy'};
  return `<span class="badge ${m[s]||'bgy'}">${s}</span>`;
}
function contBadge(s){
  const m={Idea:'bgy','Guión listo':'bb',Grabando:'ba',Editando:'bp',Subido:'bgr','Creando Guión':'bgy','Producción':'ba','Listo para Subir':'bgr'};
  return `<span class="badge ${m[s]||'bgy'}">${s||'—'}</span>`;
}
function tipoContBadge(s){
  const m={Reel:'bg',Carrusel:'bb',Historia:'bp',YouTube:'bgr'};
  return `<span class="badge ${m[s]||'bgy'}">${s}</span>`;
}

// ========== GLOBAL FILTER SYSTEM ==========
let _gf = {period:'mes', mes:''};

// Parse YYYY-MM-DD as LOCAL midnight (not UTC) to avoid timezone offset bugs
function _parseDate(s){
  if(!s) return null;
  if(s.length>=10&&s[4]==='-'&&s[7]==='-'){
    const[y,m,d]=s.slice(0,10).split('-').map(Number);
    return new Date(y,m-1,d);
  }
  return new Date(s);
}

function _gfInRange(dateStr){
  if(!dateStr) return _gf.period==='año' && _gf.mes==='';
  const d=_parseDate(dateStr), now=new Date();
  if(!d||isNaN(d)) return false;
  if(_gf.mes!==''){
    const m=parseInt(_gf.mes,10), yr=now.getFullYear();
    return d.getMonth()===m && d.getFullYear()===yr;
  }
  switch(_gf.period){
    case 'dia':    return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&d.getDate()===now.getDate();
    case 'semana': {const w=new Date(now);w.setDate(now.getDate()-7);w.setHours(0,0,0,0);return d>=w;}
    case 'mes':    {const c=new Date(now);c.setDate(now.getDate()-30);c.setHours(0,0,0,0);return d>=c;}
    case 'año':    {const c=new Date(now);c.setFullYear(now.getFullYear()-1);c.setHours(0,0,0,0);return d>=c;}
    default: return true;
  }
}
function _gfPrevInRange(dateStr){
  if(!dateStr) return false;
  const d=_parseDate(dateStr), now=new Date();
  if(!d||isNaN(d)) return false;
  if(_gf.mes!==''){
    let pm=parseInt(_gf.mes,10)-1, py=now.getFullYear();
    if(pm<0){pm=11;py--;}
    return d.getMonth()===pm && d.getFullYear()===py;
  }
  switch(_gf.period){
    case 'dia':    {const y=new Date(now);y.setDate(now.getDate()-1);return d.getFullYear()===y.getFullYear()&&d.getMonth()===y.getMonth()&&d.getDate()===y.getDate();}
    case 'semana': {const s=new Date(now),e=new Date(now);s.setDate(now.getDate()-14);s.setHours(0,0,0,0);e.setDate(now.getDate()-7);e.setHours(0,0,0,0);return d>=s&&d<e;}
    case 'mes':    {const s=new Date(now),e=new Date(now);s.setDate(now.getDate()-60);s.setHours(0,0,0,0);e.setDate(now.getDate()-30);e.setHours(0,0,0,0);return d>=s&&d<e;}
    case 'año':    {const s=new Date(now),e=new Date(now);s.setFullYear(now.getFullYear()-2);s.setHours(0,0,0,0);e.setFullYear(now.getFullYear()-1);e.setHours(0,0,0,0);return d>=s&&d<e;}
    default: return false;
  }
}
function _delta(curr, prev){
  if(prev===0 && curr===0) return '';
  if(prev===0) return null;
  const pct=Math.round(((curr-prev)/Math.abs(prev))*100);
  return (pct>=0?'+':'')+pct+'%';
}
function _gfSet(period){
  _gf.period=period; _gf.mes='';
  _gfSyncTabs(); _gfRenderCurrent();
}
function _gfSetMes(m){
  _gf.mes=m;
  if(m!=='') _gf.period='';
  _gfSyncTabs(); _gfRenderCurrent();
}
function _gfSyncTabs(){
  ['dash-tabs','leads-filter-tabs','calls-filter-tabs','fin-filter-tabs'].forEach(gid=>{
    const grp=document.getElementById(gid);
    if(!grp) return;
    grp.querySelectorAll('[data-period]').forEach(t=>{
      t.classList.toggle('active', t.dataset.period===_gf.period && _gf.mes==='');
    });
  });
  ['leads-mes-select','calls-mes-select','fin-mes-select'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value=_gf.mes;
  });
}
function _gfRenderCurrent(){
  const active=document.querySelector('.page.active');
  if(!active) return;
  const id=active.id.replace('page-','');
  const map={dash:renderDash,leads:()=>_applyLeadsFilter(),calls:()=>_applyCallsFilter(),fin:renderFin,ig:renderIG};
  if(map[id]) map[id]();
}
// Shim para contenido (su propio filtro independiente)
function inDateRange(dateStr,range){
  if(!dateStr||range==='todo'||range==='año') return true;
  const d=new Date(dateStr),now=new Date();
  if(range==='hoy'||range==='dia') return d.toDateString()===now.toDateString();
  if(range==='semana'){const w=new Date(now);w.setDate(now.getDate()-7);return d>=w;}
  if(range==='mes') return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
  return true;
}

// ========== DASHBOARD ==========
function setDashFilter(f,el){ _gfSet(f); }
function setFinFilter(f,el){ _gfSet(f); }

function renderDash(){
  const ing=S.ing.filter(x=>_gfInRange(x.fecha));
  const gas=S.gas.filter(x=>_gfInRange(x.fecha));
  const ingP=S.ing.filter(x=>_gfPrevInRange(x.fecha));
  const gasP=S.gas.filter(x=>_gfPrevInRange(x.fecha));
  const totalIng=ing.reduce((a,x)=>a+(+x.usd||0),0);
  const totalGas=gas.reduce((a,x)=>a+(+x.usd||0),0);
  const totalIngP=ingP.reduce((a,x)=>a+(+x.usd||0),0);
  const totalGasP=gasP.reduce((a,x)=>a+(+x.usd||0),0);
  const neto=totalIng-totalGas, netoP=totalIngP-totalGasP;
  const cashCC=getCashCollected(_gfInRange), cashCCP=getCashCollected(_gfPrevInRange);

  const activeClients=S.clients.filter(c=>c.estado==='Al día').length;
  const now2=new Date(), tm=now2.getMonth(), ty=now2.getFullYear();
  const pm2=tm===0?11:tm-1, py2=tm===0?ty-1:ty;
  const newClientsThis=S.clients.filter(c=>{const d=_parseDate(c.inicio);return d&&d.getMonth()===tm&&d.getFullYear()===ty;}).length;
  const newClientsPrev=S.clients.filter(c=>{const d=_parseDate(c.inicio);return d&&d.getMonth()===pm2&&d.getFullYear()===py2;}).length;
  const retA=gas.filter(x=>x.tipo==='Retiro A').reduce((a,x)=>a+(+x.usd||0),0);
  const retB=gas.filter(x=>x.tipo==='Retiro B').reduce((a,x)=>a+(+x.usd||0),0);

  const leadsF=leadsCache.filter(l=>_gfInRange(l.created_at));
  const leadsP=leadsCache.filter(l=>_gfPrevInRange(l.created_at));
  const callsF=callsCache.filter(c=>_gfInRange(c.created_at));
  const callsP=callsCache.filter(c=>_gfPrevInRange(c.created_at));
  const cerradosF=leadsF.filter(l=>l.estado==='Cerrado'||l.estado==='Seña').length;
  const cerradosP=leadsP.filter(l=>l.estado==='Cerrado'||l.estado==='Seña').length;

  const _isRestricted = ['setter','closer','closer_content'].includes(currentUserRole);

  if(_isRestricted){
    const agendasF=leadsF.filter(l=>l.estado==='Agendado').length;
    const agendasP=leadsP.filter(l=>l.estado==='Agendado').length;

    document.getElementById('dash-metrics').innerHTML=`
      ${metCard('Ingresos',fmtMoney(totalIng),'green',_delta(totalIng,totalIngP))}
    `;
    document.getElementById('dash-metrics2').innerHTML=`
      ${metCard('Leads',leadsF.length,'',_delta(leadsF.length,leadsP.length))}
      ${metCard('Cerrados',cerradosF,'green',_delta(cerradosF,cerradosP))}
      ${metCard('Agendas',agendasF,'',_delta(agendasF,agendasP))}
      ${metCard('Calls',callsF.length,'',_delta(callsF.length,callsP.length))}
    `;
    document.getElementById('dash-savings').innerHTML='';
    const movCard=document.getElementById('dash-mov-card');
    if(movCard) movCard.style.display='none';

    // Annual chart: monthly agendas (bars) + calls (bars) + facturación (line) — current year only
    const chartCard=document.getElementById('dash-chart-card');
    if(chartCard) chartCard.style.display='';

    const labels=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const monthAgendas=Array(12).fill(0);
    const monthCalls=Array(12).fill(0);
    const monthFact=Array(12).fill(0);
    const _curYr=new Date().getFullYear();

    leadsCache.forEach(l=>{
      if(l.estado==='Agendado'&&l.created_at){
        const d=new Date(l.created_at);
        if(d.getFullYear()===_curYr) monthAgendas[d.getMonth()]++;
      }
    });
    callsCache.forEach(c=>{
      if(c.created_at){
        const d=new Date(c.created_at);
        if(d.getFullYear()===_curYr) monthCalls[d.getMonth()]++;
      }
    });
    S.ing.forEach(x=>{
      if(x.fecha){
        const d=new Date(x.fecha);
        if(d.getFullYear()===_curYr) monthFact[d.getMonth()]+=(+x.usd||0)*currState.rate;
      }
    });

    const ctxR=document.getElementById('dashChart');
    if(dashChart){dashChart.destroy();dashChart=null;}
    if(dashChartRestricted) dashChartRestricted.destroy();
    dashChartRestricted=new Chart(ctxR,{
      type:'bar',
      data:{
        labels,
        datasets:[
          {label:'Agendas',data:monthAgendas,backgroundColor:'rgba(212,168,50,0.5)',borderColor:'rgba(212,168,50,0.85)',borderWidth:1,borderRadius:4,yAxisID:'y'},
          {label:'Calls',data:monthCalls,backgroundColor:'rgba(100,160,230,0.45)',borderColor:'rgba(100,160,230,0.85)',borderWidth:1,borderRadius:4,yAxisID:'y'},
          {label:'Facturación',data:monthFact,type:'line',fill:false,borderColor:'rgba(80,220,150,0.85)',backgroundColor:'rgba(80,220,150,0.15)',borderWidth:2,pointRadius:3,tension:0.3,yAxisID:'y2'},
        ]
      },
      options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{legend:{labels:{color:'rgba(232,230,222,0.5)',font:{family:'Barlow',size:11}}}},
        scales:{
          x:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'rgba(122,120,112,0.8)',font:{family:'Barlow',size:11}}},
          y:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'rgba(122,120,112,0.8)',font:{family:'Barlow',size:11}},title:{display:true,text:'Cantidad',color:'rgba(122,120,112,0.6)',font:{size:10}}},
          y2:{position:'right',grid:{drawOnChartArea:false},ticks:{color:'rgba(80,220,150,0.7)',font:{family:'Barlow',size:11},callback:v=>fmtMoney(v/currState.rate)},title:{display:true,text:'Facturación',color:'rgba(80,220,150,0.6)',font:{size:10}}}
        }
      }
    });
    return;
  }

  document.getElementById('dash-metrics').innerHTML=`
    ${metCard('Ingresos',fmtMoney(totalIng),'green',_delta(totalIng,totalIngP))}
    ${metCard('Egresos',fmtMoney(totalGas),'red',_delta(totalGas,totalGasP))}
    ${metCard('Cash Collected',fmtMoney(cashCC),'green',_delta(cashCC,cashCCP))}
    ${metCard('Clientes activos',activeClients,'',_delta(newClientsThis,newClientsPrev))}
  `;
  document.getElementById('dash-metrics2').innerHTML=`
    ${metCard('Leads',leadsF.length,'',_delta(leadsF.length,leadsP.length))}
    ${metCard('Cerrados',cerradosF,'green',_delta(cerradosF,cerradosP))}
    ${metCard('Calls',callsF.length,'',_delta(callsF.length,callsP.length))}
    ${metCard('Personal A+B',fmtMoney(retA+retB),'')}
  `;
  const chartCard=document.getElementById('dash-chart-card');
  const movCard=document.getElementById('dash-mov-card');
  if(chartCard) chartCard.style.display='';
  if(movCard)   movCard.style.display='';

  // === SAVINGS BOXES ===
  const ventasNuevas=ing.filter(x=>x.concepto==='Venta Nueva');
  const vnTotal=ventasNuevas.reduce((a,x)=>a+(+x.usd||0),0);
  const vnCount=ventasNuevas.length;

  const cuotasItems=ing.filter(x=>['Cuota','Venta Interna','Recompra'].includes(x.concepto));
  const cuotasTotal=cuotasItems.reduce((a,x)=>a+(+x.usd||0),0);
  const cuotasCount=cuotasItems.filter(x=>x.concepto==='Cuota').length;
  const upsellCount=cuotasItems.filter(x=>x.concepto==='Venta Interna').length;
  const recompraCount=cuotasItems.filter(x=>x.concepto==='Recompra').length;

  document.getElementById('dash-savings').innerHTML=`
    <div class="savings-card ventas-nuevas">
      <span class="savings-icon">💰</span>
      <div class="savings-label">Ventas Nuevas</div>
      <div class="savings-amount">${fmtMoney(vnTotal)}</div>
      <div class="savings-breakdown">
        <span class="savings-pill">Ventas nuevas: ${vnCount}</span>
      </div>
      <div class="savings-count">${vnCount} transaccion${vnCount!==1?'es':''} en el rango</div>
    </div>
    <div class="savings-card cuotas-upsells">
      <span class="savings-icon">📦</span>
      <div class="savings-label">Cuotas / Upsells / Recompras</div>
      <div class="savings-amount">${fmtMoney(cuotasTotal)}</div>
      <div class="savings-breakdown">
        ${cuotasCount?`<span class="savings-pill">Cuotas: ${cuotasCount}</span>`:''}
        ${upsellCount?`<span class="savings-pill">Upsells: ${upsellCount}</span>`:''}
        ${recompraCount?`<span class="savings-pill">Recompras: ${recompraCount}</span>`:''}
        ${!cuotasItems.length?`<span class="savings-pill" style="opacity:.4">Sin movimientos</span>`:''}
      </div>
      <div class="savings-count">${cuotasItems.length} transaccion${cuotasItems.length!==1?'es':''} en el rango</div>
    </div>
  `;

  // Chart — current year only
  const labels=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const monthIng=Array(12).fill(0),monthGas=Array(12).fill(0);
  const _yr=new Date().getFullYear();
  S.ing.forEach(x=>{if(x.fecha){const d=new Date(x.fecha);if(d.getFullYear()===_yr)monthIng[d.getMonth()]+=(+x.usd||0)*currState.rate;}});
  S.gas.forEach(x=>{if(x.fecha){const d=new Date(x.fecha);if(d.getFullYear()===_yr)monthGas[d.getMonth()]+=(+x.usd||0)*currState.rate;}});

  const ctx=document.getElementById('dashChart');
  if(dashChartRestricted){dashChartRestricted.destroy();dashChartRestricted=null;}
  if(dashChart)dashChart.destroy();
  dashChart=new Chart(ctx,{
    type:'bar',
    data:{
      labels,
      datasets:[
        {label:'Ingresos',data:monthIng,backgroundColor:'rgba(212,168,50,0.45)',borderColor:'rgba(212,168,50,0.8)',borderWidth:1,borderRadius:4},
        {label:'Egresos',data:monthGas,backgroundColor:'rgba(184,72,72,0.35)',borderColor:'rgba(184,72,72,0.7)',borderWidth:1,borderRadius:4},
      ]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'rgba(232,230,222,0.5)',font:{family:'Barlow',size:11}}}},
      scales:{
        x:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'rgba(122,120,112,0.8)',font:{family:'Barlow',size:11}}},
        y:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'rgba(122,120,112,0.8)',font:{family:'Barlow',size:11},callback:v=>fmtMoney(v/currState.rate)}}
      }
    }
  });

  // Last movements
  const all=[
    ...S.ing.map(x=>({concepto:x.concepto,tipo:'Ingreso',monto:fmtMoney(+x.usd||0),c:'bgr',fecha:x.fecha})),
    ...S.gas.map(x=>({concepto:x.concepto,tipo:'Egreso',monto:fmtMoney(+x.usd||0),c:'br',fecha:x.fecha})),
  ].sort((a,b)=>new Date(b.fecha)-new Date(a.fecha)).slice(0,10);

  document.getElementById('dash-mov').innerHTML=all.map(x=>`
    <tr><td>${x.concepto||'—'}</td><td><span class="badge ${x.c}">${x.tipo}</span></td><td style="color:var(--gold-light)">${x.monto}</td></tr>
  `).join('')||'<tr><td colspan="3" style="color:var(--text3);text-align:center;padding:20px">Sin movimientos</td></tr>';
}

function metCard(label,val,cls='',delta=''){
  let deltaHtml='';
  if(delta){
    const isUp=delta.startsWith('+');
    const cls2=isUp?'up':'down';
    deltaHtml=`<div class="metric-delta ${cls2}">${delta} vs anterior</div>`;
  }
  return `<div class="metric-card"><div class="metric-label">${label}</div><div class="metric-value ${cls}">${val}</div>${deltaHtml}</div>`;
}
function metCardSm(label,val,cls='',delta=''){
  let deltaHtml='';
  if(delta){
    const isUp=delta.startsWith('+');
    deltaHtml=`<div class="metric-delta ${isUp?'up':'down'}" style="font-size:10px">${delta}</div>`;
  }
  return `<div class="metric-card" style="padding:8px 12px"><div class="metric-label" style="font-size:10px;margin-bottom:2px">${label}</div><div class="metric-value ${cls}" style="font-size:15px">${val}</div>${deltaHtml}</div>`;
}

// ========== SOPS ==========
function _getSopsKey(){return`crm_sops_${getCid()}`;}
function _loadSOPS(){return ld(_getSopsKey(),[]);}
function _saveSOPS(arr){sv(_getSopsKey(),arr);}

const SOP_AREAS=['Marketing','Ventas','Productos','Operaciones','Otro'];
const ROLE_SOP_AREAS={admin:null,content:['Marketing'],closer:['Ventas'],setter:['Ventas'],closer_content:['Ventas']};
function _sopAreasForRole(){return ROLE_SOP_AREAS[currentUserRole]??null;}
function sopAreaBadge(a){
  const m={Marketing:'bb',Ventas:'bgr',Productos:'bg',Operaciones:'ba',Otro:'bgy'};
  return `<span class="badge ${m[a]||'bgy'}">${a||'—'}</span>`;
}

function renderSOPS(){
  const el=document.getElementById('sops-table-body');if(!el)return;
  const areas=_sopAreasForRole();
  const canEdit=currentUserRole==='admin';
  const list=(S.sops||[]).filter(s=>!areas||areas.includes(s.area));
  const btnAdd=document.getElementById('btn-new-sop');
  if(btnAdd) btnAdd.style.display=canEdit?'':'none';
  el.innerHTML=list.map(s=>`
    <tr>
      <td>${s.link?`<a href="${s.link}" target="_blank" style="color:var(--blue);font-size:12px">Ver SOP ↗</a>`:'<span style="color:var(--text3)">—</span>'}</td>
      <td>${sopAreaBadge(s.area)}</td>
      <td style="color:var(--text2);font-size:13px">${s.detalles||'—'}</td>
      <td style="color:var(--text2);font-size:13px">${s.entregables||'—'}</td>
      <td>${canEdit?`<button class="btn-icon" onclick="delSOP('${s.id}')">×</button>`:''}</td>
    </tr>`).join('')||`<tr><td colspan="5" style="color:var(--text3);text-align:center;padding:28px">Sin SOPs${areas?' de '+areas.join('/'):''}. ${canEdit?"Usá '+ Nuevo SOP' para agregar uno.":'Pedí a un admin que agregue SOPs.'}</td></tr>`;
}
async function saveSOP(){
  const link=(document.getElementById('sop-link')?.value||'').trim();
  const area=document.getElementById('sop-area')?.value||'Otro';
  const detalles=(document.getElementById('sop-detalles')?.value||'').trim();
  const entregables=(document.getElementById('sop-entregables')?.value||'').trim();
  if(!detalles&&!link){toast('✗ Completá al menos el link o los detalles');return;}
  try{
    const res=await apiFetch(`${API_URL}/sops`,{method:'POST',body:JSON.stringify({link,area,detalles,entregables})});
    if(!res.ok) throw new Error();
    const saved=await res.json();
    S.sops.unshift({id:saved.id||uid(),link,area,detalles,entregables});
    closeModal('modal-sop');renderSOPS();toast('✓ SOP guardado');
  }catch(e){
    const item={id:uid(),link,area,detalles,entregables};
    const local=_loadSOPS();local.unshift(item);_saveSOPS(local);
    S.sops.unshift(item);
    closeModal('modal-sop');renderSOPS();toast('✓ SOP guardado localmente (sin conexión)');
  }
}
async function delSOP(id){
  if(!confirm('¿Eliminar este SOP?'))return;
  try{
    const r=await apiFetch(`${API_URL}/sops/${id}`,{method:'DELETE'});
    if(!r.ok) throw new Error();
    S.sops=S.sops.filter(s=>s.id!==id);
    renderSOPS();toast('✓ SOP eliminado');
  }catch(e){toast('✗ Error al eliminar');}
}

// ========== FUNDACIONES ==========
const foundAvatarFields=[
  {k:'nombre_ficticio',label:'Nombre ficticio'},
  {k:'edad',label:'Edad'},
  {k:'nicho',label:'Nicho'},
  {k:'descripcion',label:'Descripción'},
  {k:'ocupacion',label:'Ocupación'},
  {k:'problemas',label:'Problemas principales'},
  {k:'deseos',label:'Deseos principales'},
  {k:'situacion',label:'Situación actual'},
  {k:'ingresos',label:'Ingresos actuales'},
  {k:'objeciones',label:'Objeciones frecuentes'},
  {k:'angulos_venta',label:'Ángulos de venta'},
];
const foundOfertaFields=[
  {k:'oferta_corta',label:'Oferta mensaje corto'},
  {k:'oferta_completa',label:'Oferta completa'},
  {k:'promesa',label:'Promesa de la oferta / Bio de IG'},
  {k:'mecanismo',label:'Mecanismo único'},
  {k:'precio',label:'Precio (pago único)'},
  {k:'estructura_cobro',label:'Estructura de cobro (% o fijo)'},
];
function renderFound(){
  const v=k=>S.found[k]||'';
  const inp=(id,ph,extra='')=>`<input id="ff-${id}" type="text" value="${v(id).replace(/"/g,'&quot;')}" placeholder="${ph}"
    style="background:transparent;border:none;color:var(--text);font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:600;width:100%;text-align:center;outline:none;padding:0" ${extra}>`;

  // ── AVATAR PERSONA CARD ─────────────────────────────────────────
  document.getElementById('found-avatar-form').innerHTML=`
    <div style="background:linear-gradient(135deg,rgba(212,168,50,.05) 0%,rgba(255,255,255,.01) 100%);
                border:1px solid rgba(212,168,50,.18);border-radius:16px;padding:28px 22px 22px;text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;top:-50px;left:50%;transform:translateX(-50%);width:220px;height:220px;
                  background:radial-gradient(circle,rgba(212,168,50,.07) 0%,transparent 70%);border-radius:50%;pointer-events:none"></div>

      <!-- Silueta persona -->
      <div style="margin-bottom:16px">
        <svg viewBox="0 0 100 96" width="72" height="72" fill="none" style="filter:drop-shadow(0 0 14px rgba(212,168,50,.3))">
          <circle cx="50" cy="32" r="22" fill="rgba(212,168,50,.38)"/>
          <path d="M4 96c0-25.4 20.6-46 46-46s46 20.6 46 46" fill="rgba(212,168,50,.28)"/>
          <circle cx="50" cy="32" r="22" stroke="rgba(212,168,50,.2)" stroke-width="1.5" fill="none"/>
        </svg>
      </div>

      <!-- Nombre ficticio -->
      <input id="ff-nombre_ficticio" type="text" value="${v('nombre_ficticio').replace(/"/g,'&quot;')}"
        placeholder="Nombre ficticio · ej. Marcos García"
        style="background:transparent;border:none;border-bottom:1.5px solid rgba(212,168,50,.3);color:var(--text);
               font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;letter-spacing:.04em;
               text-align:center;width:100%;padding:4px 8px 8px;margin-bottom:20px;outline:none"
        onfocus="this.style.borderBottomColor='rgba(212,168,50,.8)'"
        onblur="this.style.borderBottomColor='rgba(212,168,50,.3)'">

      <!-- Stats row -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border:1px solid rgba(255,255,255,.06);
                  border-radius:10px;overflow:hidden;margin-bottom:18px">
        <div style="padding:10px 6px;border-right:1px solid rgba(255,255,255,.06)">
          <div style="font-size:8px;font-weight:700;letter-spacing:.1em;color:var(--text3);text-transform:uppercase;margin-bottom:5px">Edad</div>
          ${inp('edad','35 años')}
        </div>
        <div style="padding:10px 6px;border-right:1px solid rgba(255,255,255,.06)">
          <div style="font-size:8px;font-weight:700;letter-spacing:.1em;color:var(--text3);text-transform:uppercase;margin-bottom:5px">Ingresos</div>
          ${inp('ingresos','$2.000/mes')}
        </div>
        <div style="padding:10px 6px">
          <div style="font-size:8px;font-weight:700;letter-spacing:.1em;color:var(--text3);text-transform:uppercase;margin-bottom:5px">Ocupación</div>
          ${inp('ocupacion','Emprendedor')}
        </div>
      </div>

      <!-- Descripción principal -->
      <textarea id="ff-descripcion"
        placeholder="Describí al avatar ideal: sus problemas, deseos, objeciones frecuentes, situación actual y ángulos de venta que más le resuenan…"
        style="width:100%;min-height:118px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);
               border-radius:10px;color:var(--text2);font-family:inherit;font-size:13px;line-height:1.65;
               padding:12px 14px;resize:vertical;outline:none;box-sizing:border-box;text-align:left"
        onfocus="this.style.borderColor='rgba(212,168,50,.4)'"
        onblur="this.style.borderColor='rgba(255,255,255,.07)'">${v('descripcion')}</textarea>
    </div>`;

  // ── OFERTA CARD ─────────────────────────────────────────────────
  // Pre-poblar desde campos viejos si oferta_completa está vacío
  const legacyOferta=[v('promesa'),v('mecanismo'),
    v('precio')?`Precio: ${v('precio')}`:null,
    v('estructura_cobro')?`Cobro: ${v('estructura_cobro')}`:null,
  ].filter(Boolean).join('\n\n');
  const ofertaCompleta = v('oferta_completa') || legacyOferta;

  document.getElementById('found-oferta-form').innerHTML=`
    <div style="background:linear-gradient(135deg,rgba(96,144,212,.05) 0%,rgba(255,255,255,.01) 100%);
                border:1px solid rgba(96,144,212,.18);border-radius:16px;padding:22px;position:relative;overflow:hidden">
      <div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;
                  background:radial-gradient(circle,rgba(96,144,212,.07) 0%,transparent 70%);border-radius:50%;pointer-events:none"></div>

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:14px;
                  border-bottom:1px solid rgba(255,255,255,.06)">
        <div style="width:36px;height:36px;flex-shrink:0;border-radius:8px;
                    background:rgba(96,144,212,.15);border:1px solid rgba(96,144,212,.25);
                    display:flex;align-items:center;justify-content:center;font-size:17px">🎯</div>
        <input id="ff-oferta_corta" type="text" value="${v('oferta_corta').replace(/"/g,'&quot;')}"
          placeholder="Mensaje corto de la oferta…"
          style="flex:1;background:transparent;border:none;color:var(--text);
                 font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;
                 letter-spacing:.02em;outline:none">
      </div>

      <!-- Cuerpo de la oferta -->
      <textarea id="ff-oferta_completa"
        placeholder="Describí la oferta completa: promesa principal, mecanismo único, qué incluye el servicio, precio, estructura de cobro, garantía…"
        style="width:100%;min-height:155px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);
               border-radius:10px;color:var(--text2);font-family:inherit;font-size:13px;line-height:1.65;
               padding:12px 14px;resize:vertical;outline:none;box-sizing:border-box"
        onfocus="this.style.borderColor='rgba(96,144,212,.4)'"
        onblur="this.style.borderColor='rgba(255,255,255,.06)'">${ofertaCompleta}</textarea>
    </div>`;
}
async function saveFound(){
  [...foundAvatarFields,...foundOfertaFields].forEach(f=>{
    const el=document.getElementById('ff-'+f.k);
    if(el)S.found[f.k]=el.value;
  });
  try{
    await apiFetch(`${API_URL}/fundaciones`,{method:'PUT',body:JSON.stringify(S.found)});
    toast('Fundaciones guardadas ✓');
  }catch(e){save('found');toast('Fundaciones guardadas localmente ✓');}
}

// ========== CONTENIDO ==========
// ========== CONTENT CALENDAR ==========
function _calAllItems(){return[...S.content,...S.hists];}
function _calFmt(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return`${y}-${m}-${day}`;}
function _calItemsByDate(ds){return _calAllItems().filter(x=>x.fecha===ds&&x.estado!=='Subido');}
function _calItemColor(it){
  if(it.esHistoria)return{bg:'rgba(122,74,184,.18)',col:'#B890F0'};
  const m={Reel:{bg:'rgba(212,168,50,.18)',col:'#E0B832'},Carrusel:{bg:'rgba(61,106,170,.18)',col:'#6A9FE0'},YouTube:{bg:'rgba(204,0,0,.18)',col:'#FF5555'}};
  return m[it.tipo]||{bg:'rgba(255,255,255,.08)',col:'var(--text2)'};
}
function _calGetFormatos(cat){const k=`crm_formatos_${(cat||'reel').toLowerCase()}_${getCid()}`;try{return JSON.parse(localStorage.getItem(k)||'[]');}catch{return[];}}
function _calSaveFormato(f,cat){const k=`crm_formatos_${(cat||'reel').toLowerCase()}_${getCid()}`;const fs=_calGetFormatos(cat);if(f&&!fs.includes(f)){fs.push(f);localStorage.setItem(k,JSON.stringify(fs));}}

function calSetView(v,el){
  _calView=v;
  document.querySelectorAll('#cal-view-tabs .tab').forEach(t=>t.classList.remove('active'));
  if(el)el.classList.add('active');
  renderCalendar();
}
function calGoToday(){_calDate=new Date();renderCalendar();}
function calPrev(){
  const d=new Date(_calDate);
  if(_calView==='mes')d.setMonth(d.getMonth()-1);
  else if(_calView==='semana')d.setDate(d.getDate()-7);
  else d.setDate(d.getDate()-1);
  _calDate=d;renderCalendar();
}
function calNext(){
  const d=new Date(_calDate);
  if(_calView==='mes')d.setMonth(d.getMonth()+1);
  else if(_calView==='semana')d.setDate(d.getDate()+7);
  else d.setDate(d.getDate()+1);
  _calDate=d;renderCalendar();
}
function renderCalendar(){
  const g=document.getElementById('cal-grid');const lbl=document.getElementById('cal-label');
  if(!g)return;
  const meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const dias=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  if(_calView==='mes')_renderCalMes(g,lbl,meses,dias);
  else if(_calView==='semana')_renderCalSemana(g,lbl,meses,dias);
  else _renderCalDia(g,lbl,meses,dias);
}
function _calDayCell(dateStr,items,isToday,dim){
  const d=parseInt(dateStr.split('-')[2],10);
  const chips=items.map(it=>{
    const{bg,col}=_calItemColor(it);
    const tipoLabel=it.esHistoria?'Historia':it.tipo;
    const fmtStr=(it.formato||it.angulo||'').slice(0,16);
    const winnerBadge=it.winner?'<span style="color:#f5d27a;font-size:9px;margin-right:2px">★</span>':'';
    const eid=it.id.replace(/['"]/g,'');
    return`<div draggable="true" ondragstart="event.dataTransfer.setData('calItemId','${eid}');event.dataTransfer.setData('calFromDate','${dateStr}');event.stopPropagation()" onclick="event.stopPropagation();calShowDetail('${dateStr}','${eid}')" style="font-size:10px;padding:2px 6px;margin:1px 0;border-radius:4px;background:${bg};color:${col};cursor:grab;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500">${winnerBadge}<span style="font-weight:700">${tipoLabel}</span>${fmtStr?' · '+fmtStr:''}</div>`;
  }).join('');
  const numStyle=isToday?'background:rgba(212,168,50,.15);width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(212,168,50,.5);':'';
  return`<div ondragover="event.preventDefault()" ondrop="_calDropItem(event,'${dateStr}')" onclick="calOpenPanel('${dateStr}',null)" style="min-height:72px;padding:5px;border-radius:6px;border:1px solid var(--line);cursor:pointer;opacity:${dim?'0.3':'1'};transition:background .12s" onmouseover="this.style.background='rgba(255,255,255,.03)'" onmouseout="this.style.background=''">
    <div style="font-size:11px;font-weight:${isToday?'700':'500'};color:${isToday?'var(--gold)':'var(--text3)'};margin-bottom:3px;${numStyle}">${d}</div>
    ${chips}
  </div>`;
}
async function _calDropItem(event,newDate){
  event.preventDefault();event.stopPropagation();
  const itemId=event.dataTransfer.getData('calItemId');
  if(!itemId||!newDate)return;
  const item=_calAllItems().find(x=>x.id===itemId);
  if(!item||item.fecha===newDate)return;
  const updated={...item,fecha:newDate};
  try{const r=await apiFetch(`${API_URL}/contenido/${item.id}`,{method:'PATCH',body:JSON.stringify(updated)});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al mover');return;}
  if(item.esHistoria){const idx=S.hists.findIndex(x=>x.id===item.id);if(idx>=0)S.hists[idx]=updated;}
  else{const idx=S.content.findIndex(x=>x.id===item.id);if(idx>=0)S.content[idx]=updated;}
  renderCont();toast('Pieza movida ✓');
}
function _renderCalMes(g,lbl,meses,dias){
  const y=_calDate.getFullYear(),m=_calDate.getMonth();
  lbl.textContent=`${meses[m]} ${y}`;
  const startDow=new Date(y,m,1).getDay();
  const daysInMonth=new Date(y,m+1,0).getDate();
  const prevDays=new Date(y,m,0).getDate();
  const today=_calFmt(new Date());
  let html=`<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:3px">`;
  dias.forEach(d=>{html+=`<div style="text-align:center;font-size:11px;color:var(--text3);padding:3px 0;font-weight:600">${d}</div>`;});
  html+=`</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">`;
  for(let i=startDow-1;i>=0;i--){const ds=_calFmt(new Date(y,m-1,prevDays-i));html+=_calDayCell(ds,_calItemsByDate(ds),false,true);}
  for(let d2=1;d2<=daysInMonth;d2++){const ds=_calFmt(new Date(y,m,d2));html+=_calDayCell(ds,_calItemsByDate(ds),ds===today,false);}
  const total=startDow+daysInMonth;const nextFill=(7-total%7)%7;
  for(let d2=1;d2<=nextFill;d2++){const ds=_calFmt(new Date(y,m+1,d2));html+=_calDayCell(ds,_calItemsByDate(ds),false,true);}
  g.innerHTML=html+`</div>`;
}
function _renderCalSemana(g,lbl,meses,dias){
  const d=new Date(_calDate);
  const monday=new Date(d);monday.setDate(d.getDate()-d.getDay());
  const end=new Date(monday);end.setDate(monday.getDate()+6);
  lbl.textContent=`${monday.getDate()} – ${end.getDate()} ${meses[end.getMonth()]} ${end.getFullYear()}`;
  const today=_calFmt(new Date());
  let html=`<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">`;
  for(let i=0;i<7;i++){
    const day=new Date(monday);day.setDate(monday.getDate()+i);
    const ds=_calFmt(day);const items=_calItemsByDate(ds);const isToday=ds===today;
    html+=`<div><div style="text-align:center;font-size:10px;color:${isToday?'var(--gold)':'var(--text3)'};font-weight:${isToday?'700':'500'};margin-bottom:3px">${dias[day.getDay()]}<br><span style="font-size:15px">${day.getDate()}</span></div>${_calDayCell(ds,items,isToday,false)}</div>`;
  }
  g.innerHTML=html+`</div>`;
}
function _renderCalDia(g,lbl,meses,dias){
  const d=_calDate;const ds=_calFmt(d);const items=_calItemsByDate(ds);
  lbl.textContent=`${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  let html=`<div style="padding:4px 0">`;
  if(!items.length){
    html+=`<div style="text-align:center;color:var(--text3);padding:40px 0;font-size:13px">Sin piezas para este día</div>`;
  }else{
    items.forEach(it=>{
      const{col}=_calItemColor(it);
      const eid=it.id.replace(/['"]/g,'');
      const tipoLabel=it.esHistoria?'Historia':it.tipo;
      html+=`<div onclick="calShowDetail('${ds}','${eid}')" style="display:flex;gap:12px;align-items:start;padding:12px;margin-bottom:8px;border-radius:8px;border:1px solid var(--line);cursor:pointer;background:rgba(255,255,255,.02)" onmouseover="this.style.background='rgba(255,255,255,.05)'" onmouseout="this.style.background='rgba(255,255,255,.02)'">
        <div style="width:4px;align-self:stretch;border-radius:4px;background:${col};flex-shrink:0"></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:11px;font-weight:700;color:${col};margin-bottom:4px">${tipoLabel}</div>
          <div style="font-size:13px;color:var(--text);margin-bottom:6px">${it.angulo||'Sin ángulo/dolor'}</div>
          ${contBadge(it.estado)}
        </div>
      </div>`;
    });
  }
  html+=`<button onclick="calOpenPanel('${ds}',null)" class="btn btn-outline" style="width:100%;margin-top:8px;font-size:13px">+ Agregar pieza</button></div>`;
  g.innerHTML=html;
}

// ===== DETAIL POPUP =====
function calShowDetail(fecha,itemId){
  document.getElementById('cal-detail-overlay')?.remove();
  const item=_calAllItems().find(x=>x.id===itemId);if(!item)return;
  const{col}=_calItemColor(item);
  const tipoLabel=item.esHistoria?'Historia':item.tipo;
  const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const el=document.createElement('div');el.id='cal-detail-overlay';
  el.style.cssText='position:fixed;inset:0;z-index:350;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box';
  el.onclick=e=>{if(e.target===el)el.remove();};
  const guionHtml=item.guion?`<div style="margin-bottom:14px"><div style="font-size:11px;color:var(--text3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">Guión</div><div style="font-size:13px;color:var(--text2);line-height:1.65;white-space:pre-wrap;max-height:130px;overflow-y:auto;background:rgba(0,0,0,.2);border-radius:6px;padding:10px">${esc(item.guion)}</div></div>`:'';
  const referenciaHtml=item.referencia?`<div style="margin-bottom:14px"><div style="font-size:11px;color:var(--text3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">Referencia</div><a href="${esc(item.referencia)}" target="_blank" rel="noopener noreferrer" style="font-size:13px;color:var(--gold);word-break:break-all">${esc(item.referencia)}</a></div>`:'';
  const showVL=['Reel','YouTube'].includes(tipoLabel);
  const videoCrudoHtml=showVL&&item.video_crudo?`<div style="margin-bottom:10px"><div style="font-size:11px;color:var(--text3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">🎥 Video crudo</div><a href="${esc(item.video_crudo)}" target="_blank" rel="noopener noreferrer" style="font-size:13px;color:#6090d4;word-break:break-all">${esc(item.video_crudo)}</a></div>`:'';
  const resultadoFinalHtml=showVL&&item.resultado_final?`<div style="margin-bottom:14px"><div style="font-size:11px;color:var(--text3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">✅ Resultado final</div><a href="${esc(item.resultado_final)}" target="_blank" rel="noopener noreferrer" style="font-size:13px;color:#5cb87a;word-break:break-all">${esc(item.resultado_final)}</a></div>`:'';
  el.innerHTML=`<div style="background:var(--surface-2);border:1px solid var(--line);border-left:4px solid ${col};border-radius:12px;padding:22px;max-width:480px;width:100%;max-height:88vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:16px">
      <div>${tipoContBadge(tipoLabel)}<div style="font-size:16px;font-weight:700;color:var(--text);margin-top:8px">${esc(item.angulo||'Sin ángulo/dolor')}</div><div style="font-size:12px;color:var(--text3);margin-top:3px">${item.fecha||'—'}</div></div>
      <button onclick="document.getElementById('cal-detail-overlay').remove()" style="background:none;border:none;color:var(--text3);font-size:22px;cursor:pointer;line-height:1;flex-shrink:0;margin-left:12px">×</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;font-size:13px">
      <div><div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Formato</div><div style="color:var(--text)">${esc(item.formato)||'—'}</div></div>
      <div><div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Estado</div>${contBadge(item.estado)}</div>
      <div><div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Notas</div><div style="color:var(--text)">${esc(item.cta)||'—'}</div></div>
      <div><div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">Agendas / Ventas</div><div style="color:var(--text);font-weight:600">${item.agendas||0} / ${item.ventas||0}</div></div>
    </div>
    ${guionHtml}
    ${referenciaHtml}
    ${videoCrudoHtml}
    ${resultadoFinalHtml}
    <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">
      <button class="btn btn-outline" onclick="document.getElementById('cal-detail-overlay').remove()">Cerrar</button>
      <button class="btn btn-outline" onclick="document.getElementById('cal-detail-overlay').remove();_calDuplicate('${itemId}')">Duplicar</button>
      <button class="btn btn-gold" onclick="document.getElementById('cal-detail-overlay').remove();calOpenPanel('${fecha}','${itemId}')">Editar</button>
    </div>
  </div>`;
  document.body.appendChild(el);
}

// ===== SIDE PANEL =====
function calOpenPanel(fecha,itemId){
  const item=itemId?_calAllItems().find(x=>x.id===itemId):null;
  _calPanelItem=item||null;
  _calPanelFecha=fecha||(item?.fecha)||_calFmt(_calDate);
  document.getElementById('cal-panel-overlay').style.display='block';
  document.getElementById('cal-panel').style.display='block';
  document.getElementById('cal-panel-title').textContent=item?'Editar pieza':'Nueva pieza';
  renderCalPanel();
}
function calClosePanel(){
  _calPanelItem=null;_calPanelFecha=null;
  document.getElementById('cal-panel-overlay').style.display='none';
  document.getElementById('cal-panel').style.display='none';
}
function _calPanelOnCatChange(){
  const vals={
    fecha:document.getElementById('cp-fecha')?.value,
    angulo:document.getElementById('cp-angulo')?.value,
    objetivo:document.getElementById('cp-objetivo')?.value,
    formato:document.getElementById('cp-formato')?.value,
    cta:document.getElementById('cp-cta')?.value,
    estado:document.getElementById('cp-estado')?.value,
    guion:document.getElementById('cp-guion')?.value,
    agendas:document.getElementById('cp-agendas')?.value,
    ventas:document.getElementById('cp-ventas')?.value,
    cat:document.getElementById('cp-categoria')?.value,
    winner:document.getElementById('cp-winner')?.checked||false,
    estructura:document.getElementById('cp-estructura')?.value||'',
    referencia:document.getElementById('cp-referencia')?.value||'',
    video_crudo:document.getElementById('cp-video-crudo')?.value||'',
    resultado_final:document.getElementById('cp-resultado-final')?.value||'',
  };
  renderCalPanel(vals);
}
function renderCalPanel(vals){
  const it=_calPanelItem;
  const fecha=(vals?.fecha)||_calPanelFecha||_calFmt(_calDate);
  let defCat=(vals?.cat)||(it?(it.esHistoria?'Historia':((['Reel','Carrusel','YouTube'].includes(it.tipo)?it.tipo:'Reel'))):' Reel');
  defCat=defCat.trim();
  if(!['Reel','Carrusel','Historia','YouTube'].includes(defCat))defCat='Reel';
  const fmts=_calGetFormatos(defCat);
  const curFmt=(vals?.formato!==undefined?vals.formato:(it?.formato||''));
  const fmtOpts=[...new Set([...fmts,...(curFmt?[curFmt]:[])])];
  const estados=['Creando Guión','Producción','Editando','Listo para Subir','Subido'];
  const selEstado=(vals?.estado)||(it?.estado)||'Creando Guión';
  const selAngulo=(vals?.angulo!==undefined?vals.angulo:(it?.angulo||''));
  const selObjetivo=(vals?.objetivo!==undefined?vals.objetivo:(it?.objetivo||''));
  const selCta=(vals?.cta!==undefined?vals.cta:(it?.cta||''));
  const selGuion=(vals?.guion!==undefined?vals.guion:(it?.guion||''));
  const selAgendas=(vals?.agendas!==undefined?vals.agendas:(it?.agendas||0));
  const selVentas=(vals?.ventas!==undefined?vals.ventas:(it?.ventas||0));
  const selWinner=vals?.winner!==undefined?vals.winner:(it?.winner||false);
  const selEstructura=(vals?.estructura!==undefined?vals.estructura:(it?.estructura||''));
  const selReferencia=(vals?.referencia!==undefined?vals.referencia:(it?.referencia||''));
  const selVideoCrudo=(vals?.video_crudo!==undefined?vals.video_crudo:(it?.video_crudo||''));
  const selResultadoFinal=(vals?.resultado_final!==undefined?vals.resultado_final:(it?.resultado_final||''));
  const showVideoLinks=['Reel','YouTube'].includes(defCat);
  const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const catOpts=['Reel','Carrusel','Historia','YouTube'].map(c=>`<option${defCat===c?' selected':''}>${c}</option>`).join('');
  const estadoOpts=estados.map(s=>`<option${selEstado===s?' selected':''}>${s}</option>`).join('');
  const fmtSel=fmtOpts.map(f=>`<option value="${esc(f)}"${curFmt===f?' selected':''}>${esc(f)}</option>`).join('');
  const isHistoria=(defCat==='Historia');
  document.getElementById('cal-panel-body').innerHTML=`
  <div class="form-group"><label class="form-label">Fecha</label><input type="date" id="cp-fecha" value="${fecha}"></div>
  <div class="form-group"><label class="form-label">Categoría</label><select id="cp-categoria" onchange="_calPanelOnCatChange()">${catOpts}</select></div>
  <div class="form-group"><label class="form-label">Objetivo de la pieza</label><input type="text" id="cp-objetivo" placeholder="Ej: Generar leads, educar, viralizar" value="${esc(selObjetivo)}"></div>
  <div class="form-group"><label class="form-label">Ángulo / Dolor</label><input type="text" id="cp-angulo" placeholder="Ej: Dolor del cliente" value="${esc(selAngulo)}"></div>
  <div class="form-group"><label class="form-label">Formato</label>
    <div style="display:flex;gap:6px;align-items:center">
      <select id="cp-formato-sel" style="flex:1" onchange="document.getElementById('cp-formato').value=this.value"><option value="">— Guardados —</option>${fmtSel}</select>
      <input type="text" id="cp-formato" placeholder="Nuevo formato" value="${esc(curFmt)}" style="flex:1.4">
    </div>
  </div>
  ${isHistoria?`<div class="form-group"><label class="form-label">Estructura</label><textarea id="cp-estructura" rows="3" style="resize:vertical" placeholder="Ej: Hook → Problema → Solución → CTA">${esc(selEstructura)}</textarea></div>`:'<input type="hidden" id="cp-estructura" value="">'}
  <div class="form-group"><label class="form-label">Estado de producción</label><select id="cp-estado">${estadoOpts}</select></div>
  <div class="form-group"><label class="form-label">Notas</label><input type="text" id="cp-cta" placeholder="Notas, observaciones…" value="${esc(selCta)}"></div>
  <div class="form-group"><label class="form-label">Referencia</label><input type="url" id="cp-referencia" placeholder="https://…  URL de video de referencia" value="${esc(selReferencia)}" style="width:100%"></div>
  ${showVideoLinks?`
  <div class="form-group"><label class="form-label">🎥 Video crudo</label><input type="url" id="cp-video-crudo" placeholder="https://…  Link al video sin editar" value="${esc(selVideoCrudo)}" style="width:100%"></div>
  <div class="form-group"><label class="form-label">✅ Resultado final</label><input type="url" id="cp-resultado-final" placeholder="https://…  Link al reel/video editado y publicado" value="${esc(selResultadoFinal)}" style="width:100%"></div>
  `:`<input type="hidden" id="cp-video-crudo" value=""><input type="hidden" id="cp-resultado-final" value="">`}
  <input type="hidden" id="cp-agendas" value="0">
  <input type="hidden" id="cp-ventas" value="0">
  <div class="form-group" style="display:flex;align-items:center;gap:10px">
    <input type="checkbox" id="cp-winner" ${selWinner?'checked':''} style="width:16px;height:16px;cursor:pointer;accent-color:#f5d27a">
    <label for="cp-winner" style="font-size:13px;font-weight:600;color:var(--text);cursor:pointer">★ Pieza Winner</label>
  </div>
  <div class="form-group"><label class="form-label">Guión</label><textarea id="cp-guion" rows="9" style="resize:vertical" placeholder="Escribí el guión completo...">${selGuion}</textarea></div>
  <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
    ${it?`<span style="font-size:11px;color:var(--text3);align-self:center">Para eliminar, usá la tabla</span>`:''}
    <button class="btn btn-outline" onclick="calClosePanel()" style="margin-left:auto">Cancelar</button>
    <button class="btn btn-gold" onclick="calSavePanel()">Guardar</button>
  </div>`;
}
async function calSavePanel(){
  const cat=document.getElementById('cp-categoria')?.value||'Reel';
  const isHist=cat==='Historia';
  const tipo=isHist?'Historia':cat;
  const fecha=document.getElementById('cp-fecha')?.value||'';
  const angulo=document.getElementById('cp-angulo')?.value||'';
  const objetivo=document.getElementById('cp-objetivo')?.value||'';
  const formato=document.getElementById('cp-formato')?.value||document.getElementById('cp-formato-sel')?.value||'';
  const cta=document.getElementById('cp-cta')?.value||'';
  const estado=document.getElementById('cp-estado')?.value||'Creando Guión';
  const guion=document.getElementById('cp-guion')?.value||'';
  const agendas=Number(document.getElementById('cp-agendas')?.value)||0;
  const ventas=Number(document.getElementById('cp-ventas')?.value)||0;
  const winner=document.getElementById('cp-winner')?.checked||false;
  const estructura=document.getElementById('cp-estructura')?.value||'';
  const referencia=document.getElementById('cp-referencia')?.value||'';
  const video_crudo=document.getElementById('cp-video-crudo')?.value||'';
  const resultado_final=document.getElementById('cp-resultado-final')?.value||'';
  const esHistoria=isHist;
  if(formato)_calSaveFormato(formato,cat);
  if(_calPanelItem){
    const updated={..._calPanelItem,tipo,fecha,angulo,objetivo,formato,cta,estado,guion,agendas,ventas,esHistoria,winner,estructura,referencia,video_crudo,resultado_final};
    try{const r=await apiFetch(`${API_URL}/contenido/${_calPanelItem.id}`,{method:'PATCH',body:JSON.stringify(updated)});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al guardar');return;}
    if(_calPanelItem.esHistoria)S.hists=S.hists.filter(x=>x.id!==_calPanelItem.id);
    else S.content=S.content.filter(x=>x.id!==_calPanelItem.id);
    if(esHistoria)S.hists.unshift(updated);else S.content.unshift(updated);
    calClosePanel();renderCont();toast('Guardado ✓');
  }else{
    const item={id:uid(),fecha,tipo,angulo,objetivo,formato,cta,estado,guion,agendas,ventas,esHistoria,winner,estructura,referencia,video_crudo,resultado_final};
    try{
      const r=await apiFetch(`${API_URL}/contenido`,{method:'POST',body:JSON.stringify(item)});
      if(!r.ok)throw new Error();
      const saved=await r.json();
      if(esHistoria)S.hists.unshift(saved);else S.content.unshift(saved);
    }catch(e){if(esHistoria){S.hists.unshift(item);save('hists');}else{S.content.unshift(item);save('content');}toast('Guardado localmente (sin conexión)');}
    calClosePanel();renderCont();
  }
}
async function calDeletePanel(){
  if(!_calPanelItem||!confirm('¿Eliminar esta pieza?'))return;
  const id=_calPanelItem.id;
  try{const r=await apiFetch(`${API_URL}/contenido/${id}`,{method:'DELETE'});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al eliminar');return;}
  if(_calPanelItem.esHistoria)S.hists=S.hists.filter(x=>x.id!==id);
  else S.content=S.content.filter(x=>x.id!==id);
  calClosePanel();renderCont();toast('Eliminado ✓');
}

function _calDuplicate(itemId){
  const item=_calAllItems().find(x=>x.id===itemId);
  if(!item)return;
  _calPanelItem=null;
  _calPanelFecha=item.fecha;
  document.getElementById('cal-panel-overlay').style.display='block';
  document.getElementById('cal-panel').style.display='block';
  document.getElementById('cal-panel-title').textContent='Duplicar pieza';
  const cat=item.esHistoria?'Historia':(item.tipo||'Reel');
  renderCalPanel({fecha:item.fecha,angulo:item.angulo||'',formato:item.formato||'',objetivo:item.objetivo||'',cta:item.cta||'',estado:item.estado||'Creando Guión',guion:item.guion||'',agendas:0,ventas:0,cat,winner:false,estructura:item.estructura||'',referencia:item.referencia||'',video_crudo:'',resultado_final:''});
}
function renderContCounters(){
  const el=document.getElementById('cont-stats-section');if(!el)return;
  const today=_calFmt(new Date());

  // ── Calcular rango de fechas según filtro ──
  let from='',to='',viewLabel='';
  if(_contStatsFilter==='semana'){
    const d=new Date();const mon=new Date(d);mon.setDate(d.getDate()-((d.getDay()+6)%7));
    const sun=new Date(mon);sun.setDate(mon.getDate()+6);
    from=_calFmt(mon);to=_calFmt(sun);viewLabel='Esta semana';
  } else if(_contStatsFilter==='mes'){
    const d=new Date();
    from=_calFmt(new Date(d.getFullYear(),d.getMonth(),1));
    to=_calFmt(new Date(d.getFullYear(),d.getMonth()+1,0));
    viewLabel='Este mes';
  } else {
    from=_contStatsFrom;to=_contStatsTo;
    viewLabel=from&&to?`${from} → ${to}`:'Seleccioná un rango';
  }

  // ── Solo piezas SUBIDAS en el rango ──
  const inRange=x=>x.estado==='Subido'&&x.fecha>=from&&x.fecha<=to;
  const items=(from&&to)?_calAllItems().filter(inRange):[];
  const total=items.length;

  const tipos=[
    {label:'Reels',     n:items.filter(x=>x.tipo==='Reel'&&!x.esHistoria).length, col:'var(--gold)'},
    {label:'Carruseles',n:items.filter(x=>x.tipo==='Carrusel').length,             col:'#6A9FE0'},
    {label:'Historias', n:items.filter(x=>x.esHistoria).length,                    col:'#B890F0'},
    {label:'YouTube',   n:items.filter(x=>x.tipo==='YouTube').length,              col:'#FF5555'},
  ];

  const tab=(f,label)=>`<button onclick="contStatsSetFilter('${f}')" style="padding:5px 14px;font-size:12px;font-weight:600;border-radius:6px;border:1px solid ${_contStatsFilter===f?'var(--gold)':'rgba(255,255,255,.1)'};background:${_contStatsFilter===f?'rgba(224,181,74,.12)':'transparent'};color:${_contStatsFilter===f?'var(--gold)':'var(--text3)'};cursor:pointer">${label}</button>`;

  const customPickers=_contStatsFilter==='custom'?`
    <div style="display:flex;gap:8px;align-items:center;margin-top:10px">
      <input type="date" value="${_contStatsFrom}" onchange="_contStatsFrom=this.value;renderContCounters()"
        style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 10px;font-size:12px;color:var(--text1)">
      <span style="color:var(--text3);font-size:12px">→</span>
      <input type="date" value="${_contStatsTo}" onchange="_contStatsTo=this.value;renderContCounters()"
        style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 10px;font-size:12px;color:var(--text1)">
    </div>`:'';

  el.innerHTML=`
    <div class="card" style="padding:16px 18px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:13px;font-weight:700;color:var(--text1)">Piezas subidas</span>
          ${from&&to?`<span style="font-size:12px;color:var(--text3)">${viewLabel}</span>`:''}
          ${from&&to?`<span style="font-size:13px;font-weight:800;color:var(--gold);margin-left:4px">${total}</span>`:''}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${tab('semana','Semana')}
          ${tab('mes','Mes')}
          ${tab('custom','Rango')}
        </div>
      </div>
      ${customPickers}
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;${_contStatsFilter==='custom'&&(!from||!to)?'opacity:.4':''}margin-top:${customPickers?'12':'0'}px">
        ${tipos.map(({label,n,col})=>`
          <div style="text-align:center;padding:14px 8px;border-radius:8px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05)">
            <div style="font-size:28px;font-weight:800;color:${col};line-height:1">${n}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:5px;text-transform:uppercase;letter-spacing:.5px">${label}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

function contStatsSetFilter(f){
  _contStatsFilter=f;
  if(f!=='custom'){_contStatsFrom='';_contStatsTo='';}
  renderContCounters();
}

function contFilter(type,val,el){
  if(type==='tipo'){contFilterTipo=val;document.querySelectorAll('#cont-type-tabs .tab').forEach(t=>t.classList.remove('active'));}
  else if(type==='time'){contFilterTime=val;document.querySelectorAll('#cont-time-tabs .tab').forEach(t=>t.classList.remove('active'));}
  else if(type==='winner'){contFilterWinner=!contFilterWinner;el.classList.toggle('active',contFilterWinner);renderCont();return;}
  el.classList.add('active');
  renderCont();
}
function _guionPrev(g){if(!g)return'<span style="color:var(--text3)">—</span>';const t=g.slice(0,32);return`<span style="font-size:11px;color:var(--text3)">${t}${g.length>32?'…':''}</span>`;}
function showGuion(id){
  document.getElementById('guion-overlay')?.remove();
  const item=_calAllItems().find(x=>x.id===id);if(!item)return;
  const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const el=document.createElement('div');el.id='guion-overlay';
  el.style.cssText='position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box';
  el.onclick=e=>{if(e.target===el)el.remove();};
  el.innerHTML=`<div style="background:var(--surface-2);border:1px solid var(--line);border-radius:12px;padding:24px;max-width:580px;width:100%;max-height:80vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-size:14px;font-weight:700;color:var(--text)">${esc(item.angulo||item.tipo||'Guión')}</div>
      <button onclick="document.getElementById('guion-overlay').remove()" style="background:none;border:none;color:var(--text3);font-size:22px;cursor:pointer;line-height:1">×</button>
    </div>
    <div style="font-size:14px;color:var(--text2);line-height:1.75;white-space:pre-wrap">${esc(item.guion||'Sin guión')}</div>
  </div>`;
  document.body.appendChild(el);
}
function renderCont(){
  // ── Build live stats from leadsCache + S.ing ──
  const _piezaStatsMap={};
  if(leadsCache.length>0){
    const __pMap={};
    [...S.content,...S.hists].forEach(p=>{if(p.id)__pMap[_angPiezaLabel(p)]=p;});
    leadsCache.forEach(lead=>{
      const ets=_getEtiquetas(lead);
      if(!ets.length)return;
      const pieza=__pMap[ets[ets.length-1]]||_findContentByEtiqueta(ets[ets.length-1]);
      if(!pieza)return;
      if(!_piezaStatsMap[pieza.id])_piezaStatsMap[pieza.id]={agendas:0,ventas:0,cal:0,descal:0,leads:0,igsClosed:new Set()};
      const st=_piezaStatsMap[pieza.id];
      st.leads++;
      if(lead.estado==='Agendado') st.agendas++;
      if(ESTADO_CERRADO.has(lead.estado)){st.ventas++;if(lead.instagram)st.igsClosed.add((lead.instagram||'').toLowerCase());}
      if(lead.calificado===true)  st.cal++;
      if(lead.descalificado===true) st.descal++;
    });
    Object.values(_piezaStatsMap).forEach(st=>{
      st.facturacion=(S.ing||[]).filter(i=>i.concepto==='Venta Nueva'&&st.igsClosed.has((i.instagram||'').toLowerCase())).reduce((a,i)=>a+(Number(i.usd)||0),0);
    });
  }
  const _contExtraCols=x=>{
    const st=_piezaStatsMap[x.id]||{agendas:0,ventas:0,cal:0,descal:0,leads:0,facturacion:0};
    const pctAg=st.leads>0?Math.round(st.agendas/st.leads*100)+'%':'—';
    const cashCC=st.ventas>0?(Number(x.cashCollected)||0):0;
    const facBadge=st.facturacion>0?`<div style="font-size:9px;color:#5cb87a;font-weight:600;margin-top:1px;white-space:nowrap;opacity:.85">${fmtMoney(st.facturacion)}</div>`:'';
    return{cal:st.cal,descal:st.descal,pctAg,cashCC,facBadge,agendas:st.agendas,ventas:st.ventas};
  };

  // ── Piece sets ──
  const allPosts=S.content.filter(x=>!x.esHistoria&&x.tipo!=='YouTube');
  const allHists=S.hists;
  const allYts=S.content.filter(x=>x.tipo==='YouTube');
  const sf=(a,b)=>(b.fecha||'').localeCompare(a.fecha||'');
  const eid=id=>id.replace(/['"]/g,'');

  const _applyFilters=(posts,hists,yts)=>{
    if(contFilterTipo!=='Todos'){
      if(contFilterTipo==='Historia'){posts=[];yts=[];}
      else if(contFilterTipo==='YouTube'){posts=[];hists=[];}
      else{hists=[];yts=[];posts=posts.filter(x=>x.tipo===contFilterTipo);}
    }
    if(contFilterTime!=='todo'){
      posts=posts.filter(x=>inDateRange(x.fecha,contFilterTime));
      hists=hists.filter(x=>inDateRange(x.fecha,contFilterTime));
      yts=yts.filter(x=>inDateRange(x.fecha,contFilterTime));
    }
    if(contFilterWinner){posts=posts.filter(x=>x.winner);hists=hists.filter(x=>x.winner);yts=yts.filter(x=>x.winner);}
    posts.sort(sf);hists.sort(sf);yts.sort(sf);
    return{reels:posts.filter(x=>x.tipo==='Reel'),carruseles:posts.filter(x=>x.tipo==='Carrusel'),hists,yts};
  };

  const rowPost=(x,delFn)=>{
    const{col}=_calItemColor(x);
    const winBadge=x.winner?'<span style="color:#f5d27a;margin-right:3px">★</span>':'';
    const{cal,descal,pctAg,cashCC,facBadge,agendas,ventas}=_contExtraCols(x);
    return`<tr onclick="calOpenPanel('${x.fecha}','${eid(x.id)}')" style="cursor:pointer;border-left:3px solid ${col}60">
      <td>${x.fecha||'—'}</td>
      <td><span class="trunc" title="${x.angulo}">${winBadge}${x.angulo||'—'}</span></td>
      <td>${x.formato||'—'}</td>
      <td>${x.objetivo?`<span style="font-size:11px;color:var(--text2)">${x.objetivo}</span>`:'—'}</td>
      <td>${x.cta||'—'}</td>
      <td>${contBadge(x.estado)}</td>
      <td onclick="event.stopPropagation();showGuion('${eid(x.id)}')" style="cursor:pointer">${_guionPrev(x.guion)}</td>
      <td style="text-align:center">${agendas}</td>
      <td style="text-align:center;color:#5cb87a;font-weight:600">${cal||'—'}</td>
      <td style="text-align:center;color:#d46060;font-weight:600">${descal||'—'}</td>
      <td style="text-align:center;font-size:11px;color:var(--gold);font-weight:600">${pctAg}</td>
      <td style="text-align:center"><div style="font-weight:700">${ventas}</div>${facBadge}</td>
      <td style="text-align:center;font-size:11px;color:#5cb87a;font-weight:600">${cashCC>0?fmtMoney(cashCC):'—'}</td>
      <td><button class="btn-icon" onclick="event.stopPropagation();${delFn}('${eid(x.id)}')">×</button></td>
    </tr>`;
  };
  const rowHist=(x,delFn)=>{
    const winBadge=x.winner?'<span style="color:#f5d27a;margin-right:3px">★</span>':'';
    const{cal,descal,pctAg,cashCC,facBadge,agendas,ventas}=_contExtraCols(x);
    return`<tr onclick="calOpenPanel('${x.fecha}','${eid(x.id)}')" style="cursor:pointer;border-left:3px solid #B890F0">
      <td>${x.fecha||'—'}</td>
      <td><span class="trunc" title="${x.angulo}">${winBadge}${x.angulo||'—'}</span></td>
      <td>${x.formato||'—'}</td>
      ${x.estructura?`<td><span style="font-size:11px;color:var(--text3)">${x.estructura.slice(0,30)}…</span></td>`:`<td>—</td>`}
      <td>${x.cta||'—'}</td>
      <td>${contBadge(x.estado)}</td>
      <td onclick="event.stopPropagation();showGuion('${eid(x.id)}')" style="cursor:pointer">${_guionPrev(x.guion)}</td>
      <td style="text-align:center">${agendas}</td>
      <td style="text-align:center;color:#5cb87a;font-weight:600">${cal||'—'}</td>
      <td style="text-align:center;color:#d46060;font-weight:600">${descal||'—'}</td>
      <td style="text-align:center;font-size:11px;color:var(--gold);font-weight:600">${pctAg}</td>
      <td style="text-align:center"><div style="font-weight:700">${ventas}</div>${facBadge}</td>
      <td style="text-align:center;font-size:11px;color:#5cb87a;font-weight:600">${cashCC>0?fmtMoney(cashCC):'—'}</td>
      <td><button class="btn-icon" onclick="event.stopPropagation();${delFn}('${eid(x.id)}')">×</button></td>
    </tr>`;
  };
  const MT='<tr><td colspan="14" style="color:var(--text3);text-align:center;padding:20px">';

  // ── En producción tables ──
  const prod=_applyFilters(
    allPosts.filter(x=>x.estado!=='Subido'),
    allHists.filter(x=>x.estado!=='Subido'),
    allYts.filter(x=>x.estado!=='Subido')
  );
  document.getElementById('reel-table').innerHTML=prod.reels.map(x=>rowPost(x,'delCont')).join('')||MT+'Sin reels</td></tr>';
  document.getElementById('carrusel-table').innerHTML=prod.carruseles.map(x=>rowPost(x,'delCont')).join('')||MT+'Sin carruseles</td></tr>';
  document.getElementById('hist-table').innerHTML=prod.hists.map(x=>rowHist(x,'delHist')).join('')||MT+'Sin historias</td></tr>';
  const ytEl=document.getElementById('yt-table');
  if(ytEl)ytEl.innerHTML=prod.yts.map(x=>rowPost(x,'delCont')).join('')||MT+'Sin videos</td></tr>';

  // ── Subido tables ──
  const sub=_applyFilters(
    allPosts.filter(x=>x.estado==='Subido'),
    allHists.filter(x=>x.estado==='Subido'),
    allYts.filter(x=>x.estado==='Subido')
  );
  const rSel=document.getElementById('reel-s-table');
  const cSel=document.getElementById('carrusel-s-table');
  const hSel=document.getElementById('hist-s-table');
  const ySel=document.getElementById('yt-s-table');
  if(rSel)rSel.innerHTML=sub.reels.map(x=>rowPost(x,'delCont')).join('')||MT+'Sin reels subidos</td></tr>';
  if(cSel)cSel.innerHTML=sub.carruseles.map(x=>rowPost(x,'delCont')).join('')||MT+'Sin carruseles subidos</td></tr>';
  if(hSel)hSel.innerHTML=sub.hists.map(x=>rowHist(x,'delHist')).join('')||MT+'Sin historias subidas</td></tr>';
  if(ySel)ySel.innerHTML=sub.yts.map(x=>rowPost(x,'delCont')).join('')||MT+'Sin videos subidos</td></tr>';

  renderCalendar();
  renderContCounters();
  renderContCharts(_piezaStatsMap);
}
async function delCont(id){
  if(!confirm('¿Eliminar?'))return;
  try{const r=await apiFetch(`${API_URL}/contenido/${id}`,{method:'DELETE'});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al eliminar');return;}
  S.content=S.content.filter(x=>x.id!==id);renderCont();
}
async function delHist(id){
  if(!confirm('¿Eliminar?'))return;
  try{const r=await apiFetch(`${API_URL}/contenido/${id}`,{method:'DELETE'});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al eliminar');return;}
  S.hists=S.hists.filter(x=>x.id!==id);renderCont();
}

function renderContCharts(piezaStatsMap={}){
  const buildChart=(idx,canvasId,items,field,label,col,border)=>{
    const sorted=items.filter(x=>x.fecha).sort((a,b)=>a.fecha.localeCompare(b.fecha));
    const lbls=sorted.map(x=>{const p=x.fecha.split('-');return`${p[2]}/${p[1]}`;});
    const data=leadsCache.length===0?sorted.map(()=>0):sorted.map(x=>Number((piezaStatsMap[x.id]||{})[field])||0);
    const angulos=sorted.map(x=>x.angulo||x.tipo||x.fecha||'');
    const ctx=document.getElementById(canvasId);if(!ctx)return;
    if(_contCharts[idx])_contCharts[idx].destroy();
    _contCharts[idx]=new Chart(ctx,{
      type:'bar',
      data:{labels:lbls,datasets:[{label,data,backgroundColor:col,borderColor:border,borderWidth:1,borderRadius:4}]},
      options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{
          legend:{labels:{color:'rgba(232,230,222,0.5)',font:{family:'Inter',size:11}}},
          tooltip:{callbacks:{title(items){const d=items[0].label;const a=angulos[items[0].dataIndex]||'';return a?`${d} · ${a}`:d;}}}
        },
        scales:{
          x:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'rgba(122,120,112,0.8)',font:{size:9},maxRotation:45,minRotation:30}},
          y:{beginAtZero:true,grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'rgba(122,120,112,0.8)',font:{size:10},stepSize:1,precision:0}}
        }
      }
    });
  };
  const allPosts=_calAllItems().filter(x=>!x.esHistoria&&x.tipo!=='YouTube');
  const reels=allPosts.filter(x=>x.tipo==='Reel');
  const carruseles=allPosts.filter(x=>x.tipo==='Carrusel');
  buildChart(0,'contChartReelAgendas',reels,'agendas','Agendas — Reels','rgba(212,168,50,.5)','rgba(212,168,50,.9)');
  buildChart(1,'contChartReelVentas',reels,'ventas','Ventas — Reels','rgba(61,106,170,.5)','rgba(61,106,170,.9)');
  buildChart(2,'contChartCarruselAgendas',carruseles,'agendas','Agendas — Carruseles','rgba(180,130,60,.5)','rgba(180,130,60,.9)');
  buildChart(3,'contChartCarruselVentas',carruseles,'ventas','Ventas — Carruseles','rgba(80,130,190,.5)','rgba(80,130,190,.9)');
  buildChart(4,'contChartHistAgendas',S.hists,'agendas','Agendas — Historias','rgba(122,74,184,.5)','rgba(122,74,184,.9)');
  buildChart(5,'contChartHistVentas',S.hists,'ventas','Ventas — Historias','rgba(160,122,224,.5)','rgba(160,122,224,.9)');
  const yts=S.content.filter(x=>x.tipo==='YouTube');
  buildChart(6,'contChartYTAgendas',yts,'agendas','Agendas — YouTube','rgba(204,0,0,.5)','rgba(204,0,0,.9)');
  buildChart(7,'contChartYTVentas',yts,'ventas','Ventas — YouTube','rgba(255,85,85,.5)','rgba(255,85,85,.9)');
}

let _angSortBy='ventas';
const _angExpanded=new Set();

function _angPiezaLabel(p){
  const SHORT={Historia:'H',Reel:'Reel',Carrusel:'C',YouTube:'YT'};
  const t=SHORT[p.tipo]||p.tipo||'';
  const parts=(p.fecha||'').split('-');
  const d=parts.length===3?`${parseInt(parts[2])}/${parseInt(parts[1])}`:p.fecha||'—';
  return`${t} ${d}`.trim();
}

function _toggleAngPiezas(angulo){
  const key=angulo;
  if(_angExpanded.has(key)) _angExpanded.delete(key);
  else _angExpanded.add(key);
  renderAng();
}

let _hiddenAngulos=new Set();
// ========== ÁNGULOS ==========
function renderAng(){
  // Build a fast lookup: tipo+fecha → content piece
  const _piezaMap={};
  [...S.content,...S.hists].forEach(p=>{
    if(p.angulo) _piezaMap[_angPiezaLabel(p)]=p;
  });

  // Derive stats from actual leads, not from stored counters on content pieces
  const angStats={};
  const angPiezas={}; // { angulo: { piezaLabel: {ventas,agendas} } }

  leadsCache.forEach(lead=>{
    const etiquetas=_getEtiquetas(lead);
    if(!etiquetas.length) return;
    const lastEt=etiquetas[etiquetas.length-1];
    // Try fast map first (label matches exactly), fallback to full parse
    const pieza=_piezaMap[lastEt]||_findContentByEtiqueta(lastEt);
    if(!pieza||!pieza.angulo) return;

    const ang=pieza.angulo;
    if(!angStats[ang]) angStats[ang]={ventas:0,agendas:0,facturacion:0,calificados:0,descalificados:0};
    const plabel=_angPiezaLabel(pieza);
    if(!angPiezas[ang]) angPiezas[ang]={};
    if(!angPiezas[ang][plabel]) angPiezas[ang][plabel]={ventas:0,agendas:0};

    if(ESTADO_CERRADO.has(lead.estado)){
      angStats[ang].ventas++;
      angPiezas[ang][plabel].ventas++;
    }
    if(lead.estado==='Agendado'){
      angStats[ang].agendas++;
      angPiezas[ang][plabel].agendas++;
    }
    if(lead.calificado===true)  angStats[ang].calificados++;
    if(lead.descalificado===true) angStats[ang].descalificados++;
  });

  // Facturación from real ingresos: match ingreso → lead (by instagram) → etiqueta → pieza → angulo
  (S.ing||[]).forEach(ing=>{
    if(ing.concepto!=='Venta Nueva'||!(Number(ing.usd)>0)||!ing.instagram) return;
    const igLow=(ing.instagram||'').toLowerCase();
    const lead=leadsCache.find(l=>(l.instagram||'').toLowerCase()===igLow);
    if(!lead) return;
    const ets=_getEtiquetas(lead);
    if(!ets.length) return;
    const pieza=_piezaMap[ets[ets.length-1]]||_findContentByEtiqueta(ets[ets.length-1]);
    if(!pieza||!pieza.angulo) return;
    if(!angStats[pieza.angulo]) angStats[pieza.angulo]={ventas:0,agendas:0,facturacion:0,calificados:0,descalificados:0};
    angStats[pieza.angulo].facturacion+=Number(ing.usd)||0;
  });

  const bestVentas=Object.entries(angStats).sort((a,b)=>b[1].ventas-a[1].ventas)[0];
  const bestAgendas=Object.entries(angStats).sort((a,b)=>b[1].agendas-a[1].agendas)[0];
  const bestFac=Object.entries(angStats).filter(([,s])=>s.ventas>0).sort((a,b)=>b[1].facturacion-a[1].facturacion)[0];

  const leftCard=_angSortBy==='agendas'
    ? metCard('Ángulo con más agendas',bestAgendas&&bestAgendas[1].agendas>0?`${bestAgendas[0]} (${bestAgendas[1].agendas})`:'—','')
    : metCard('Ángulo con más ventas',bestVentas&&bestVentas[1].ventas>0?`${bestVentas[0]} (${bestVentas[1].ventas})`:'—','');

  const rightCard=_angSortBy==='agendas'
    ? metCard('Mayor cantidad de agendas',bestAgendas&&bestAgendas[1].agendas>0?`${bestAgendas[0]} · ${bestAgendas[1].agendas} agenda${bestAgendas[1].agendas!==1?'s':''}`:'—','')
    : metCard('Mayor facturación',bestFac&&bestFac[1].facturacion>0?`${bestFac[0]} · ${fmtMoney(bestFac[1].facturacion)}`:'—','green');

  document.getElementById('ang-metrics').innerHTML=leftCard+rightCard;

  // Merge manual S.angulos with auto-detected ángulos that have real lead data
  const knownAngNames=new Set(S.angulos.map(x=>x.angulo));
  // Auto-show any angulo with real stats (ventas or agendas from leads), ignoring hidden list
  const autoAngItems=Object.keys(angStats)
    .filter(n=>!knownAngNames.has(n)&&(angStats[n].ventas>0||angStats[n].agendas>0))
    .map(n=>({id:'_auto_'+n,angulo:n,tipo:'—',pc:[],uc:[],ad:'No'}));
  const angulos=[...S.angulos,...autoAngItems].filter(x=>{
    const st=angStats[x.angulo]||{ventas:0,agendas:0,facturacion:0};
    if(_angSortBy==='ventas')     return st.ventas>0;
    if(_angSortBy==='agendas')    return st.agendas>0;
    if(_angSortBy==='facturacion')return st.facturacion>0;
    return true;
  }).sort((a,b)=>{
    const sa=angStats[a.angulo]||{ventas:0,agendas:0,facturacion:0};
    const sb=angStats[b.angulo]||{ventas:0,agendas:0,facturacion:0};
    if(_angSortBy==='ventas')return sb.ventas-sa.ventas;
    if(_angSortBy==='agendas')return sb.agendas-sa.agendas;
    if(_angSortBy==='facturacion')return sb.facturacion-sa.facturacion;
    return 0;
  });

  // Sort buttons
  const sortBtn=(key,label)=>`<button class="tab${_angSortBy===key?' active':''}" onclick="_angSortBy='${key}';renderAng()" style="font-size:11px;padding:4px 10px">${label}</button>`;

  document.getElementById('ang-sort-btns').innerHTML=sortBtn('ventas','Por ventas')+sortBtn('agendas','Por agendas')+sortBtn('facturacion','Por facturación');

  document.getElementById('ang-table').innerHTML=angulos.map((x)=>{
    const st=angStats[x.angulo]||{ventas:0,agendas:0,facturacion:0,calificados:0,descalificados:0};
    const pctCierre=st.agendas>0?Math.round(st.ventas/st.agendas*100)+'%':'—';
    const isAuto=x.id.startsWith('_auto_');
    const piezas=Object.entries(angPiezas[x.angulo]||{}).map(([label,s])=>({label,...s}))
      .filter(p=>_angSortBy==='agendas'?p.agendas>0:_angSortBy==='ventas'?p.ventas>0:p.ventas>0||p.agendas>0);
    const isExpanded=_angExpanded.has(x.angulo);
    const hasPiezas=piezas.length>0;
    const angKey=x.angulo.replace(/'/g,"\\'");

    const mainRow=`<tr style="cursor:${hasPiezas?'pointer':'default'}" onclick="${hasPiezas?`_toggleAngPiezas('${angKey}')`:''}" title="${hasPiezas?'Clic para ver desglose por pieza':''}">
      <td><b style="color:var(--text)">${x.angulo}</b>${hasPiezas?`<span style="font-size:10px;color:var(--text3);margin-left:6px">${isExpanded?'▾':'▸'} ${piezas.length} pieza${piezas.length!==1?'s':''}</span>`:''}
      </td>
      <td style="text-align:center;font-weight:700;color:var(--gold)">${st.agendas||0}</td>
      <td style="text-align:center;font-weight:700;color:#5cb87a">${st.calificados||0}</td>
      <td style="text-align:center;font-weight:700;color:#d46060">${st.ventas||0}</td>
      <td style="text-align:center;color:var(--text2)">${pctCierre}</td>
      <td style="text-align:right;color:#5cb87a;font-weight:600">${st.facturacion>0?fmtMoney(st.facturacion):'—'}</td>
      <td onclick="event.stopPropagation()">${isAuto?`<button class="btn-icon" onclick="_hideAutoAng('${angKey}')">×</button>`:`<button class="btn-icon" onclick="delAng('${x.id}')">×</button>`}</td>
    </tr>`;

    if(!isExpanded||!hasPiezas) return mainRow;

    const sorted=[...piezas].sort((a,b)=>_angSortBy==='agendas'?b.agendas-a.agendas:b.ventas-a.ventas);
    const subRows=sorted.map(p=>`
      <tr style="background:rgba(255,255,255,0.02)">
        <td style="padding-left:28px;font-size:12px;color:var(--text2)">
          <span style="background:rgba(212,168,50,0.08);border:1px solid rgba(212,168,50,0.18);border-radius:4px;padding:2px 7px;font-size:11px;font-weight:600;color:var(--gold)">${p.label}</span>
        </td>
        <td style="text-align:center;font-size:12px;color:var(--gold)">${p.agendas||0}</td>
        <td style="text-align:center;font-size:12px;color:var(--text3)">—</td>
        <td style="text-align:center;font-size:12px;color:#5cb87a">${p.ventas||0}</td>
        <td colspan="3"></td>
      </tr>`).join('');

    return mainRow+subRows;
  }).join('')||'<tr><td colspan="7" style="color:var(--text3);text-align:center;padding:20px">Sin ángulos</td></tr>';
}
async function saveAng(){
  const item={id:uid(),angulo:v('a-angulo'),tipo:v('a-tipo'),pc:[...(currentChips['a-pc']||[])],uc:[...(currentChips['a-uc']||[])],ad:v('a-ad')};
  try{
    const res=await apiFetch(`${API_URL}/angulos`,{method:'POST',body:JSON.stringify(item)});
    if(!res.ok) throw new Error();
    const saved=await res.json();
    S.angulos.unshift(saved);
    closeModal('modal-ang');renderAng();toast('Ángulo guardado ✓');
  }catch(e){S.angulos.unshift(item);save('angulos');closeModal('modal-ang');renderAng();toast('Ángulo guardado ✓');}
}
async function delAng(id){
  if(!confirm('¿Eliminar?'))return;
  try{const r=await apiFetch(`${API_URL}/angulos/${id}`,{method:'DELETE'});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al eliminar');return;}
  S.angulos=S.angulos.filter(x=>x.id!==id);renderAng();
}
async function _hideAutoAng(name){
  _hiddenAngulos.add(name);
  renderAng();
  try{await apiFetch(`${API_URL}/angulos`,{method:'POST',body:JSON.stringify({angulo:name,hidden:true})});}
  catch(e){console.warn('No se pudo guardar ángulo oculto:',e);}
  renderAng();
}

// ========== REFERENTES ==========
function renderRef(){
  document.getElementById('ref-table').innerHTML=S.refs.map((x,i)=>`
    <tr>
      <td><div style="display:flex;align-items:center">${avatarChip(x.nombre)}<span style="color:var(--text)">${x.nombre}</span></div></td>
      <td>${x.nicho||'—'}</td>
      <td>${x.seg?fmt(+x.seg):'—'}</td>
      <td><span class="trunc" title="${x.rec}">${x.rec||'—'}</span></td>
      <td>
        ${x.link?`<a href="${x.link.startsWith('http')?x.link:'https://instagram.com/'+x.link}" target="_blank" class="roadmap-link">Ver perfil</a>`:'—'}
        <button class="btn-icon" onclick="delRef('${x.id}')" style="margin-left:4px">×</button>
      </td>
    </tr>`).join('')||'<tr><td colspan="5" style="color:var(--text3);text-align:center;padding:20px">Sin referentes</td></tr>';
}
async function saveRef(){
  const item={id:uid(),nombre:v('r-nombre'),link:v('r-link'),seg:v('r-seg'),nicho:v('r-nicho'),rec:v('r-rec')};
  try{
    const res=await apiFetch(`${API_URL}/referentes`,{method:'POST',body:JSON.stringify(item)});
    if(!res.ok) throw new Error();
    const saved=await res.json();
    S.refs.unshift(saved);
    closeModal('modal-ref');renderRef();toast('Referente guardado ✓');
  }catch(e){S.refs.unshift(item);save('refs');closeModal('modal-ref');renderRef();toast('Referente guardado ✓');}
}
async function delRef(id){
  if(!confirm('¿Eliminar?'))return;
  try{const r=await apiFetch(`${API_URL}/referentes/${id}`,{method:'DELETE'});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al eliminar');return;}
  S.refs=S.refs.filter(x=>x.id!==id);renderRef();
}

// ========== MÉTRICAS ==========
function renderMet(){
  const totalLeads=S.mets.reduce((a,x)=>a+(+x.leads||0),0);
  const totalVentas=S.mets.reduce((a,x)=>a+(x.ventas?x.ventas.split(',').filter(Boolean).length:0),0);
  const segProm=S.mets.length?Math.round(S.mets.reduce((a,x)=>a+(+x.seg||0),0)/S.mets.length):0;
  const angCount={};
  S.mets.forEach(m=>{if(m.angulo&&m.ventas){const c=m.ventas.split(',').filter(Boolean).length;if(c>0)angCount[m.angulo]=(angCount[m.angulo]||0)+c;}});
  const best=Object.entries(angCount).sort((a,b)=>b[1]-a[1])[0];

  document.getElementById('met-metrics').innerHTML=`
    ${metCard('Ángulo con más ventas',best?best[0]:'—','')}
    ${metCard('Prom. seg. nuevos',segProm,'')}
    ${metCard('Leads generados',totalLeads,'')}
    ${metCard('Ventas realizadas',totalVentas,'green')}
  `;
  document.getElementById('met-table').innerHTML=S.mets.map((x,i)=>`
    <tr>
      <td>${x.fecha||'—'}</td>
      <td>${x.angulo||'—'}</td>
      <td>${tipoContBadge(x.tipo)}</td>
      <td>${x.leads||0}</td>
      <td>${x.com||0}</td>
      <td>${x.ventas||'—'}</td>
      <td><span class="api-badge">API</span></td>
      <td><button class="btn-icon" onclick="delMet('${x.id}')">×</button></td>
    </tr>`).join('')||'<tr><td colspan="8" style="color:var(--text3);text-align:center;padding:20px">Sin métricas</td></tr>';
}
async function saveMet(){
  const item={id:uid(),fecha:v('m-fecha'),tipo:v('m-tipo'),angulo:v('m-angulo'),cta:v('m-cta'),com:v('m-com'),seg:v('m-seg'),leads:v('m-leads'),ventas:v('m-ventas'),pc:v('m-pc'),uc:v('m-uc')};
  try{
    const res=await apiFetch(`${API_URL}/metricas`,{method:'POST',body:JSON.stringify(item)});
    if(!res.ok) throw new Error();
    const saved=await res.json();
    S.mets.unshift(saved);
    closeModal('modal-met');renderMet();toast('Métrica guardada ✓');
  }catch(e){S.mets.unshift(item);save('mets');closeModal('modal-met');renderMet();toast('Métrica guardada ✓');}
}
async function delMet(id){
  if(!confirm('¿Eliminar?'))return;
  try{const r=await apiFetch(`${API_URL}/metricas/${id}`,{method:'DELETE'});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al eliminar');return;}
  S.mets=S.mets.filter(x=>x.id!==id);renderMet();
}

// ========== MÉTRICAS COMPARATIVAS — API ==========
async function fetchMetrics(range='month'){
  try{
    const res=await apiFetch(`${API_URL}/metrics?range=${range}`);
    if(!res.ok){ console.warn('[fetchMetrics] HTTP',res.status); return null; }
    return await res.json();
  }catch(e){
    console.error('[fetchMetrics]',e);
    return null;
  }
}

async function fetchClients(){
  try{
    const res=await apiFetch(`${API_URL}/clientes`);
    if(!res.ok){console.warn('[fetchClients] HTTP',res.status);return;}
    const data=await res.json();
    if(!Array.isArray(data)) return;
    S.clients=data;
    save('clients');
    if(S.cuotas?.length){
      const ids=new Set(S.clients.map(c=>String(c.id)));
      S.cuotas=S.cuotas.filter(q=>ids.has(String(q.clienteId)));
      save('cuotas');
    }
    if(document.getElementById('page-clients')?.classList.contains('active')) renderClients();
    renderDash();
  }catch(e){console.error('[fetchClients]',e);}
}
async function fetchIngresos(){
  try{
    const res=await apiFetch(`${API_URL}/ingresos`);
    if(!res.ok){console.warn('[fetchIngresos] HTTP',res.status);return;}
    const data=await res.json();
    S.ing=Array.isArray(data)?data:[];
    save('ing');
    if(document.getElementById('page-fin')?.classList.contains('active')) renderFin();
    renderDash();
  }catch(e){console.error('[fetchIngresos]',e);}
}
async function fetchEgresos(){
  try{
    const res=await apiFetch(`${API_URL}/egresos`);
    if(!res.ok){console.warn('[fetchEgresos] HTTP',res.status);return;}
    const data=await res.json();
    S.gas=Array.isArray(data)?data:[];
    save('gas');
    if(document.getElementById('page-fin')?.classList.contains('active')) renderFin();
    renderDash();
  }catch(e){console.error('[fetchEgresos]',e);}
}
async function fetchCuotas(){
  try{
    const res=await apiFetch(`${API_URL}/cuotas`);
    if(!res.ok){console.warn('[fetchCuotas] HTTP',res.status);return;}
    const data=await res.json();
    S.cuotas=Array.isArray(data)?data:[];
    save('cuotas');
    if(document.getElementById('page-clients')?.classList.contains('active')){renderClients();}
    _renderMoneyCounters();
  }catch(e){console.error('[fetchCuotas]',e);}
}
async function sincronizarCuotas(){
  await Promise.all([fetchClients(),fetchCuotas()]);
  _seedMissingCuotas();
  toast('Cuotas sincronizadas ✓');
}
function _seedMissingCuotas(){
  if(!S.clients?.length) return;
  const hasCuotaPP=c=>['cuota','cuotas'].includes((c.pp||'').toLowerCase());
  const cuotaClientes=S.cuotas||[];

  // 1. Crear cuotas faltantes para clientes sin ninguna entrada
  const seeded=new Set(cuotaClientes.map(q=>String(q.clienteId)));
  const toSeed=S.clients.filter(c=>hasCuotaPP(c)&&!seeded.has(String(c.id)));
  for(const c of toSeed){
    const monto=+c.cash_collected||0;
    generarCuotasCliente(c,1,monto);
  }

  // 2. Actualizar monto=0 en cuotas existentes usando cash_collected del cliente
  const conMontoCero=cuotaClientes.filter(q=>!q.pagado&&(+q.monto||0)===0);
  for(const q of conMontoCero){
    const cliente=S.clients.find(c=>String(c.id)===String(q.clienteId));
    const monto=+(cliente?.cash_collected)||0;
    if(!monto) continue;
    q.monto=monto;
    apiFetch(`${API_URL}/cuotas/${q.id}`,{method:'PATCH',body:JSON.stringify({monto})}).catch(()=>{});
  }

  save('cuotas');
  _renderMoneyCounters();
}
async function fetchActivityLog(){
  try{
    const res=await apiFetch(`${API_URL}/activity`);
    if(!res.ok){console.warn('[fetchActivityLog] HTTP',res.status);return;}
    const data=await res.json();
    _activityLog=Array.isArray(data)?data:[];
    sv('crm_activity_log',_activityLog);
    if(document.getElementById('page-fin')?.classList.contains('active')) renderActivityLog();
  }catch(e){console.error('[fetchActivityLog]',e);}
}

// ========== LEADS — SUPABASE ==========
// IDs eliminados localmente — el polling no los vuelve a insertar aunque el server falle
const _pendingDeletes = new Set();
let _leadsInterval        = null;
let _leadsFullRefreshTimer = null;
let _leadsPageInterval    = null;
let _leadsLastFetchTs     = null;
let leadsTableCache       = [];   // current server page (full leads, for table)
let leadsTableTotal       = 0;    // total matching leads on server
let leadsCurrentPage      = 1;
const LEADS_SERVER_PAGE   = 100;
let leadsFilter    = 'mes';
let leadsMes       = '';
let leadsBusqueda       = '';
let _leadsEstadoFiltro  = '';
let _leadsEtiquetaFiltro = '';
let _leadsVistaFiltro   = 'todos';
let _leadsSortBy        = null;
let _leadsSortDir       = 'desc';

const LEAD_ESTADOS = [
  'Primer contacto',
  'Descubrimiento (Problemas-Objetivos)',
  'Recurso de nutrición',
  'PITCH VSL CHAT',
  'VSL CHAT',
  'Proponer Call',
  'Calendly Enviado',
  'Agendado',
  'Seña',
  'Cerrada',
  'Perdido',
];
const ESTADO_PERDIDO = new Set(['Perdido']);
const ESTADO_CERRADO = new Set(['Cerrada','Seña']);
function _esPerdidoEfectivo(l){ return ESTADO_PERDIDO.has(l.estado)||((l.seguimientos||0)>=4&&l.respondio_seguimiento_4==='NO'); }

const ESTADO_COLOR = {
  'Primer contacto':                    { bg:'rgba(100,96,90,0.35)',   border:'rgba(120,116,108,0.3)', text:'#9a9690' },
  'Descubrimiento (Problemas-Objetivos)':{ bg:'rgba(61,106,170,0.15)', border:'rgba(61,106,170,0.3)', text:'#6090d4' },
  'Recurso de nutrición':               { bg:'rgba(122,74,184,0.15)',  border:'rgba(122,74,184,0.3)', text:'#a070d8' },
  'PITCH VSL CHAT':                     { bg:'rgba(196,136,42,0.13)',  border:'rgba(196,136,42,0.3)', text:'#e0a848' },
  'VSL CHAT':                           { bg:'rgba(196,136,42,0.13)',  border:'rgba(196,136,42,0.3)', text:'#e0a848' },
  'Proponer Call':                      { bg:'rgba(196,136,42,0.13)',  border:'rgba(196,136,42,0.3)', text:'#e0a848' },
  'Calendly Enviado':                   { bg:'rgba(212,168,50,0.1)',   border:'rgba(212,168,50,0.2)', text:'#d4a832' },
  'Agendado':                           { bg:'rgba(212,168,50,0.07)',  border:'rgba(212,168,50,0.18)',text:'#d4a832' },
  'Seña':                               { bg:'rgba(61,138,90,0.08)',   border:'rgba(61,138,90,0.2)',  text:'#4aaa6a' },
  'Cerrada':                            { bg:'rgba(61,138,90,0.12)',   border:'rgba(61,138,90,0.25)', text:'#5cb87a' },
  'Perdido':                            { bg:'rgba(184,72,72,0.12)',   border:'rgba(184,72,72,0.25)', text:'#d46060' },
};

function tipoBadge(t){
  const m = {Ads:'bb', Organico:'bgr', Outbound:'bp'};
  return `<span class="badge ${m[t]||'bgy'}">${t||'—'}</span>`;
}
function origenBadge(o){
  return `<span class="badge ${o==='Inbound'?'bgr':'bb'}">${o||'—'}</span>`;
}

function estadoSelect(lead){
  const estado  = lead.estado || 'Primer Contacto';
  const col     = ESTADO_COLOR[estado] || ESTADO_COLOR['Primer Contacto'];
  const canSeña = ['admin','closer','closer_content'].includes(currentUserRole);
  const options = LEAD_ESTADOS.filter(e => e !== 'Seña' || canSeña).map(e =>
    `<option value="${e}" ${e === estado ? 'selected' : ''}>${e}</option>`
  ).join('');
  let calHtml = '';
  if(estado === 'Agendado'){
    const calVal  = lead.calificado===true ? 'si' : lead.descalificado===true ? 'no' : 'normal';
    const calColor= calVal==='si' ? '#5cb87a' : calVal==='no' ? '#d46060' : 'var(--text3)';
    calHtml = `<select onchange="actualizarCalificacion('${lead.id}',this.value,this)"
      style="margin-top:4px;font-size:10px;font-weight:700;padding:2px 6px;border-radius:20px;cursor:pointer;width:100%;
        background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:${calColor};outline:none">
      <option value="normal" ${calVal==='normal'?'selected':''}>— Normal —</option>
      <option value="si"     ${calVal==='si'    ?'selected':''}>✓ Calificado</option>
      <option value="no"     ${calVal==='no'    ?'selected':''}>✗ Descalificado</option>
    </select>`;
  }
  return `<div style="min-width:180px">
    <select
      onchange="actualizarEstado('${lead.id}', this.value, this)"
      style="
        font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
        padding:3px 8px;border-radius:20px;cursor:pointer;width:100%;
        background:${col.bg};border:1px solid ${col.border};color:${col.text};
        outline:none;box-shadow:none;
      "
    >${options}</select>${calHtml}
  </div>`;
}

function formatearFecha(fechaISO){
  if(!fechaISO) return '—';
  const d = new Date(fechaISO);
  if(isNaN(d)) return '—';
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}
function formatearFechaHora(fechaISO){
  if(!fechaISO) return '—';
  const d = new Date(fechaISO);
  if(isNaN(d)) return '—';
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
async function actualizarSeguimientos(id, valor, selectEl){
  const n = parseInt(valor, 10) || 0;
  const lead = leadsCache.find(l=>l.id===id);
  const leadT = leadsTableCache.find(l=>l.id===id);
  if(lead) lead.seguimientos = n;
  if(leadT) leadT.seguimientos = n;
  const tr = selectEl?.closest('tr');
  const badge = tr?.querySelector('.seg-ultimatum');
  if(badge) badge.style.display = n >= 4 ? '' : 'none';
  const respondioWrap = tr?.querySelector('.seg-respondio-wrap');
  if(respondioWrap) respondioWrap.style.display = n >= 4 ? '' : 'none';
  selectEl?.blur();
  try{
    const res = await apiFetch(`${API_URL}/leads/${id}`,{method:'PATCH',body:JSON.stringify({seguimientos:n})});
    if(!res.ok){ const e=await res.json().catch(()=>({})); toast(`✗ Error seguimientos: ${e.error||res.status}`); }
  }catch(e){ console.error('[actualizarSeguimientos]',e); }
}

async function actualizarRespondio4(id, valor, selectEl){
  const lead = leadsCache.find(l=>l.id===id);
  const leadT = leadsTableCache.find(l=>l.id===id);
  const now = new Date().toISOString();
  const patch = { respondio_seguimiento_4: valor||null, updated_at: now };

  if(valor==='NO' && lead && lead.estado !== 'Perdido'){
    const estadoAnterior = lead.estado || 'Primer contacto';
    patch.estado = 'Perdido';
    patch.estado_anterior = estadoAnterior;
    patch.estado_updated_at = now;
    lead.estado_anterior = estadoAnterior;
    lead.estado = 'Perdido';
    lead.estado_updated_at = now;
    if(leadT){ leadT.estado_anterior = estadoAnterior; leadT.estado = 'Perdido'; leadT.estado_updated_at = now; }
  }

  if(lead) lead.respondio_seguimiento_4 = valor || null;
  if(leadT) leadT.respondio_seguimiento_4 = valor || null;
  selectEl.style.color = valor==='NO' ? '#d46060' : valor==='SI' ? '#5cb87a' : 'var(--text3)';
  const tr = selectEl?.closest('tr');
  const lostBadge = tr?.querySelector('.seg-perdido-etapa');
  if(lostBadge) lostBadge.style.display = valor==='NO' ? '' : 'none';

  apiFetch(`${API_URL}/leads/${id}`,{method:'PATCH',body:JSON.stringify(patch)}).catch(()=>{});

  if(patch.estado === 'Perdido'){
    _renderEstadoCounters(leadsCache);
    _applyLeadsFilter();
  }
}

function _getFaseForEstado(estado){
  return FUNNEL_FASES.find(f=>f.estados.includes(estado)) || null;
}

function _getLostAtStage(lead){
  if(lead.estado==='Perdido' && lead.estado_anterior){
    return lead.estado_anterior;
  }
  if((lead.seguimientos||0)>=4 && lead.respondio_seguimiento_4==='NO' && lead.estado!=='Perdido'){
    return lead.estado;
  }
  return null;
}

function _computeLostBreakdown(leads){
  const breakdown = {};
  FUNNEL_FASES.forEach(f=>{ breakdown[f.label]=0; });
  leads.forEach(lead=>{
    const lostAt = _getLostAtStage(lead);
    if(!lostAt) return;
    const fase = _getFaseForEstado(lostAt);
    if(fase) breakdown[fase.label]++;
  });
  return breakdown;
}

function _renderLostBreakdown(leads){
  const el = document.getElementById('funnel-lost-breakdown');
  if(!el) return;
  const breakdown = _computeLostBreakdown(leads);
  const total = Object.values(breakdown).reduce((a,b)=>a+b,0);
  if(total===0){
    el.innerHTML='<div style="color:var(--text3);font-size:12px;padding:4px 0">Sin datos aún</div>';
    return;
  }
  el.innerHTML = FUNNEL_FASES.map(f=>{
    const count = breakdown[f.label]||0;
    if(count===0) return '';
    const pct = Math.round(count/total*100);
    return `
      <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
        <div style="width:8px;height:8px;border-radius:2px;background:${f.color};flex-shrink:0"></div>
        <div style="flex:1;font-size:11px;color:var(--text2);font-weight:600">${f.label}</div>
        <div style="font-size:14px;font-weight:700;color:#d46060;font-family:'Inter',sans-serif;min-width:20px;text-align:right">${count}</div>
        <div style="font-size:10px;color:var(--text3);min-width:28px;text-align:right">${pct}%</div>
      </div>`;
  }).join('');
}

function filtrarLeadsPorTiempo(leads, filtro){
  const now = new Date();
  return leads.filter(lead => {
    if(!lead.created_at) return filtro === 'año';
    const d = new Date(lead.created_at);
    switch(filtro){
      case 'dia':
        return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth() && d.getDate()===now.getDate();
      case 'semana': { const c=new Date(now); c.setDate(now.getDate()-7); return d>=c; }
      case 'mes':    { const c=new Date(now); c.setDate(now.getDate()-30); return d>=c; }
      case 'año':    { const c=new Date(now); c.setFullYear(now.getFullYear()-1); return d>=c; }
      default: return true;
    }
  });
}

function filtrarPorMes(leads, mesSeleccionado){
  if(mesSeleccionado===''||mesSeleccionado===null) return leads;
  const mes=parseInt(mesSeleccionado,10), year=new Date().getFullYear();
  return leads.filter(l=>{ const d=new Date(l.created_at||0); return d.getMonth()===mes&&d.getFullYear()===year; });
}

function agruparPorEtiqueta(leads){
  const grupos={};
  leads.forEach(l=>{
    const ets=_getEtiquetas(l);
    if(!ets.length){ grupos['(sin etiqueta)']=(grupos['(sin etiqueta)']||0)+1; return; }
    ets.forEach(e=>{ grupos[e]=(grupos[e]||0)+1; });
  });
  return Object.entries(grupos).sort((a,b)=>b[1]-a[1]).reduce((acc,[k,v])=>{acc[k]=v;return acc;},{});
}

// Returns the etiquetas array for a lead (handles legacy single-string etiqueta)
function _getEtiquetas(lead){
  if(Array.isArray(lead.etiquetas)&&lead.etiquetas.length) return lead.etiquetas;
  if(lead.etiqueta) return [lead.etiqueta];
  return [];
}

// Finds a content piece matching an etiqueta string like "Reel 15/5" or "Carrusel 3/6"
function _findContentByEtiqueta(etiqueta){
  if(!etiqueta) return null;
  const parts=etiqueta.trim().split(/\s+/);
  if(parts.length<2) return null;
  const TIPO_ALIAS={'H':'Historia','R':'Reel','C':'Carrusel','YT':'YouTube','historia':'Historia','reel':'Reel','carrusel':'Carrusel','youtube':'YouTube'};
  const tipo=TIPO_ALIAS[parts[0]]||parts[0];
  const dateStr=parts[1]; // "15/5"
  const [dayStr,monthStr]=dateStr.split('/');
  const day=parseInt(dayStr,10), month=parseInt(monthStr,10);
  if(!day||!month) return null;
  const pad=n=>String(n).padStart(2,'0');
  const yr=new Date().getFullYear();
  const f1=`${yr}-${pad(month)}-${pad(day)}`;
  const f2=`${yr-1}-${pad(month)}-${pad(day)}`;
  const all=[...S.content,...S.hists];
  return all.find(x=>x.tipo===tipo&&x.fecha===f1)||
         all.find(x=>x.tipo===tipo&&x.fecha===f2)||null;
}

// Increments campo ('agendas','ventas','calificados','descalificados') on the content piece matching lead's last etiqueta
async function _atribuirContenido(lead,campo){
  const etiquetas=_getEtiquetas(lead);
  if(!etiquetas.length) return;
  const pieza=_findContentByEtiqueta(etiquetas[etiquetas.length-1]);
  if(!pieza) return;
  const nuevo=(Number(pieza[campo])||0)+1;
  pieza[campo]=nuevo;
  const updated={...pieza,[campo]:nuevo};
  if(pieza.esHistoria){const idx=S.hists.findIndex(x=>x.id===pieza.id);if(idx>=0)S.hists[idx]=updated;}
  else{const idx=S.content.findIndex(x=>x.id===pieza.id);if(idx>=0)S.content[idx]=updated;}
  try{await apiFetch(`${API_URL}/contenido/${pieza.id}`,{method:'PATCH',body:JSON.stringify(updated)});}
  catch(e){console.warn('[_atribuirContenido]',e.message);}
}

// Adds revenue amount to facturacion on the content piece matching lead's last etiqueta
async function _atribuirContenidoMonto(lead,monto){
  if(!(monto>0))return;
  const etiquetas=_getEtiquetas(lead);
  if(!etiquetas.length)return;
  const pieza=_findContentByEtiqueta(etiquetas[etiquetas.length-1]);
  if(!pieza)return;
  const nuevaFac=(Number(pieza.facturacion)||0)+monto;
  pieza.facturacion=nuevaFac;
  const updated={...pieza,facturacion:nuevaFac};
  if(pieza.esHistoria){const idx=S.hists.findIndex(x=>x.id===pieza.id);if(idx>=0)S.hists[idx]=updated;}
  else{const idx=S.content.findIndex(x=>x.id===pieza.id);if(idx>=0)S.content[idx]=updated;}
  try{await apiFetch(`${API_URL}/contenido/${pieza.id}`,{method:'PATCH',body:JSON.stringify(updated)});}
  catch(e){console.warn('[_atribuirContenidoMonto]',e.message);}
}

// Decrements campo on the content piece matching lead's last etiqueta (never below 0)
async function _desatribuirContenido(lead,campo){
  const etiquetas=_getEtiquetas(lead);
  if(!etiquetas.length)return;
  const pieza=_findContentByEtiqueta(etiquetas[etiquetas.length-1]);
  if(!pieza)return;
  const nuevo=Math.max(0,(Number(pieza[campo])||0)-1);
  pieza[campo]=nuevo;
  const updated={...pieza,[campo]:nuevo};
  if(pieza.esHistoria){const idx=S.hists.findIndex(x=>x.id===pieza.id);if(idx>=0)S.hists[idx]=updated;}
  else{const idx=S.content.findIndex(x=>x.id===pieza.id);if(idx>=0)S.content[idx]=updated;}
  try{await apiFetch(`${API_URL}/contenido/${pieza.id}`,{method:'PATCH',body:JSON.stringify(updated)});}
  catch(e){console.warn('[_desatribuirContenido]',e.message);}
}

// Adds cash collected amount to cashCollected on the content piece matching lead's last etiqueta
async function _atribuirCashCollected(lead,monto){
  if(!(monto>0))return;
  const etiquetas=_getEtiquetas(lead);
  if(!etiquetas.length)return;
  const pieza=_findContentByEtiqueta(etiquetas[etiquetas.length-1]);
  if(!pieza)return;
  const nuevoCash=(Number(pieza.cashCollected)||0)+monto;
  pieza.cashCollected=nuevoCash;
  const updated={...pieza,cashCollected:nuevoCash};
  if(pieza.esHistoria){const idx=S.hists.findIndex(x=>x.id===pieza.id);if(idx>=0)S.hists[idx]=updated;}
  else{const idx=S.content.findIndex(x=>x.id===pieza.id);if(idx>=0)S.content[idx]=updated;}
  try{await apiFetch(`${API_URL}/contenido/${pieza.id}`,{method:'PATCH',body:JSON.stringify(updated)});}
  catch(e){console.warn('[_atribuirCashCollected]',e.message);}
}

function filtrarPorBusqueda(leads, q){
  if(!q||!q.trim()) return leads;
  const t=q.trim().toLowerCase();
  return leads.filter(l=>(l.nombre||'').toLowerCase().includes(t)||(l.instagram||'').toLowerCase().includes(t));
}

function _filtrarLeads(){
  let r=leadsCache.filter(l=>_gfInRange(l.created_at));
  r=filtrarPorBusqueda(r,leadsBusqueda);
  if(_leadsVistaFiltro==='activos')  r=r.filter(l=>!_esPerdidoEfectivo(l));
  else if(_leadsVistaFiltro==='perdidos') r=r.filter(l=>_esPerdidoEfectivo(l));
  if(_leadsEstadoFiltro) r=r.filter(l=>l.estado===_leadsEstadoFiltro);
  if(_leadsEtiquetaFiltro) r=r.filter(l=>_getEtiquetas(l).includes(_leadsEtiquetaFiltro));
  return r;
}

function toggleEtiquetaFiltro(et){
  _leadsEtiquetaFiltro = _leadsEtiquetaFiltro===et ? '' : et;
  leadsCurrentPage=1;
  _applyLeadsFilter();
  fetchLeadsPage(1);
}
function onLeadsEstadoChange(){
  _leadsEstadoFiltro=document.getElementById('leads-estado-select')?.value||'';
  leadsCurrentPage=1;
  _applyLeadsFilter();
  fetchLeadsPage(1);
}
function onLeadsVistaChange(){
  _leadsVistaFiltro=document.getElementById('leads-vista-select')?.value||'todos';
  leadsCurrentPage=1;
  _applyLeadsFilter();
  fetchLeadsPage(1);
}

async function actualizarEstado(id, nuevoEstado, selectEl){
  console.log('ID:', id);
  console.log('NUEVO ESTADO:', nuevoEstado);

  if(!id){
    console.error('ID inválido:', id);
    return;
  }

  if(!nuevoEstado){
    console.error('[actualizarEstado] Estado vacío'); return;
  }
  const lead = leadsCache.find(l=>l.id===id);
  const leadT = leadsTableCache.find(l=>l.id===id);
  const estadoAnterior = lead?.estado;
  const tsNow = new Date().toISOString();
  if(lead){ lead.estado = nuevoEstado; lead.estado_updated_at = tsNow; }
  if(leadT){ leadT.estado = nuevoEstado; leadT.estado_updated_at = tsNow; }

  if(selectEl){
    selectEl.blur();
    const col = ESTADO_COLOR[nuevoEstado] || ESTADO_COLOR['Primer Contacto'];
    selectEl.style.background = col.bg;
    selectEl.style.borderColor = col.border;
    selectEl.style.color = col.text;
    const tr = selectEl.closest('tr');
    if(tr){
      if(ESTADO_PERDIDO.has(nuevoEstado)){
        tr.style.background = 'rgba(184,72,72,0.06)';
        tr.style.borderLeft = '2px solid rgba(184,72,72,0.3)';
      } else {
        tr.style.background = '';
        tr.style.borderLeft = '';
      }
    }
  }

  if(nuevoEstado === 'Agendado'){
    _mostrarPopupReporteAgenda(id, lead);
    if(lead) _atribuirContenido(lead,'agendas').catch(()=>{});
  }
  if((nuevoEstado === 'Cerrada' || nuevoEstado === 'Seña') && lead) _atribuirContenido(lead,'ventas').catch(()=>{});
  _logActivity(`Estado → ${nuevoEstado}`, lead, estadoAnterior?`Antes: ${estadoAnterior}`:'');

  _renderEstadoCounters(leadsCache);

  // Pausar el polling durante el update para que no re-renderice la tabla y cierre el dropdown
  const hadInterval = !!_leadsInterval;
  if(hadInterval){ clearInterval(_leadsInterval); _leadsInterval=null; }

  try{
    const patch={estado:nuevoEstado, estado_updated_at:tsNow, updated_at:tsNow};
    if(nuevoEstado==='Perdido' && estadoAnterior && estadoAnterior!=='Perdido'){
      patch.estado_anterior=estadoAnterior;
      if(lead) lead.estado_anterior=estadoAnterior;
    }
    const res = await apiFetch(`${API_URL}/leads/${id}`,{method:'PATCH',body:JSON.stringify(patch)});
    if(!res.ok){
      const body=await res.text().catch(()=>'');
      console.error('[actualizarEstado] HTTP',res.status,body);
      throw new Error(`HTTP ${res.status}`);
    }
  }catch(e){
    console.error('[actualizarEstado]',e.message);
    toast(`✗ Error al actualizar estado (${e.message})`);
    if(lead) lead.estado = estadoAnterior;
    if(selectEl && estadoAnterior){
      const col = ESTADO_COLOR[estadoAnterior] || ESTADO_COLOR['Primer Contacto'];
      selectEl.style.background = col.bg;
      selectEl.style.borderColor = col.border;
      selectEl.style.color = col.text;
      selectEl.value = estadoAnterior;
    }
  }finally{
    if(hadInterval){
      _leadsInterval = setInterval(()=>fetchLeads(true),3000);
      if(!_leadsPageInterval) _leadsPageInterval = setInterval(()=>fetchLeadsPage(leadsCurrentPage),15000);
    }
  }
}

function _renderEstadoCounters(leads){
  const el = document.getElementById('leads-estado-counters');
  if(!el) return;
  const conteo={};
  leads.forEach(l=>{ const e=l.estado||'Primer Contacto'; conteo[e]=(conteo[e]||0)+1; });
  el.innerHTML = LEAD_ESTADOS
    .filter(e=>conteo[e])
    .map(e=>{
      const col=ESTADO_COLOR[e]||ESTADO_COLOR['Primer Contacto'];
      return `<span style="display:inline-flex;align-items:center;gap:5px;
                padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;
                background:${col.bg};border:1px solid ${col.border};color:${col.text};
                text-transform:uppercase;letter-spacing:.04em;white-space:nowrap">
        ${e} <span style="opacity:.6">${conteo[e]}</span>
      </span>`;
    }).join('');
}

function _applyLeadsFilter(){
  const filtrados = _filtrarLeads();
  const total     = filtrados.length;

  const badge = document.getElementById('leads-count-badge');
  if(badge) badge.textContent = total;

  const LABEL_FILTRO = {dia:'hoy',semana:'últimos 7 días',mes:'últimos 30 días',año:'último año'};
  const labelEl = document.getElementById('leads-filter-label');
  if(labelEl){
    const partes=_gf.mes!==''?[['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][+_gf.mes]]:[LABEL_FILTRO[_gf.period]||''];
    if(leadsBusqueda.trim()) partes.push(`"${leadsBusqueda.trim()}"`);
    labelEl.textContent=partes.filter(Boolean).join(' · ');
  }

  const metricsEl=document.getElementById('leads-metrics');
  if(metricsEl){
    const agendados    = filtrados.filter(l=>l.estado==='Agendado').length;
    const perdidos     = filtrados.filter(_esPerdidoEfectivo).length;
    const calificados  = filtrados.filter(l=>l.calificado===true).length;
    const descalificados = filtrados.filter(l=>l.descalificado===true).length;
    const prev         = leadsCache.filter(l=>_gfPrevInRange(l.created_at));
    const prevTot      = prev.length;
    const prevAg       = prev.filter(l=>l.estado==='Agendado').length;
    const prevPerd     = prev.filter(_esPerdidoEfectivo).length;
    const prevCal      = prev.filter(l=>l.calificado===true).length;
    metricsEl.style.justifyContent='center';
    metricsEl.innerHTML =
      metCard('Total',          total,          '', _delta(total,prevTot))+
      metCard('Agendados',      agendados,      '', _delta(agendados,prevAg))+
      metCard('Calificados',    calificados,    'green', _delta(calificados,prevCal))+
      metCard('Descalificados', descalificados, 'red', '')+
      metCard('Perdidos',       perdidos,       'red', _delta(perdidos,prevPerd));
  }

  const _sinSegNuevo=l=>!_getEtiquetas(l).some(e=>e.trim().toLowerCase()==='seguidor nuevo');
  _renderFunnel(leadsCache.filter(_sinSegNuevo));
  _renderEstadoCounters(leadsCache.filter(_sinSegNuevo));
  _renderEtiquetas(filtrados);
  _renderLeadsTable();
}

function _renderEtiquetas(leads){
  const wrap=document.getElementById('leads-etiquetas-wrap');
  const grid=document.getElementById('leads-etiquetas-grid');
  if(!wrap||!grid) return;
  // Use all leadsCache for counts (unaffected by etiqueta filter itself)
  const base=_leadsEtiquetaFiltro
    ? leadsCache.filter(l=>_gfInRange(l.created_at))
    : leads;
  const grupos=agruparPorEtiqueta(base);
  const entries=Object.entries(grupos);
  if(!entries.length){ wrap.style.display='none'; return; }
  wrap.style.display='block';
  const max=entries[0][1];
  const periodLabel=document.getElementById('leads-etiquetas-period');
  if(periodLabel) periodLabel.textContent=_leadsEtiquetaFiltro?`Filtrando: ${_leadsEtiquetaFiltro} · Clic para quitar filtro`:'';
  grid.innerHTML=entries.map(([etiqueta,count])=>{
    const pct=Math.round((count/max)*100);
    const isActive=_leadsEtiquetaFiltro===etiqueta;
    const isSinEt=etiqueta==='(sin etiqueta)';
    const color=isSinEt?'var(--text3)':'var(--gold)';
    const activeBorder=isActive?`border-color:${isSinEt?'rgba(154,150,144,0.6)':'rgba(212,168,50,0.6)'};box-shadow:0 0 0 1px ${isSinEt?'rgba(154,150,144,0.3)':'rgba(212,168,50,0.25)'};`:''
    return `<div onclick="toggleEtiquetaFiltro('${etiqueta.replace(/'/g,"\\'")}')"
      style="background:${isActive?'rgba(212,168,50,0.07)':'rgba(255,255,255,0.025)'};border:1px solid ${isActive?(isSinEt?'rgba(154,150,144,0.5)':'rgba(212,168,50,0.45)'):'rgba(255,255,255,0.05)'};
             border-radius:var(--rs);padding:10px 14px;min-width:160px;flex:1;max-width:240px;cursor:pointer;transition:border-color .15s,background .15s"
      title="${isActive?'Clic para quitar filtro':'Clic para filtrar por esta etiqueta'}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:12px;font-weight:600;color:${isActive?color:'var(--text)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px" title="${etiqueta}">${etiqueta}</span>
        <span style="font-family:'Inter',sans-serif;font-weight:700;font-size:18px;letter-spacing:-0.02em;color:${color};margin-left:8px">${count}</span>
      </div>
      <div style="height:3px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${color};border-radius:2px;transition:width .4s ease;${color==='var(--gold)'?'box-shadow:0 0 6px rgba(212,168,50,0.4)':''}"></div>
      </div>
      <div style="font-size:10px;color:var(--text3);margin-top:4px">${isActive?'✓ Filtrando':count+' lead'+(count!==1?'s':'')}</div>
    </div>`;
  }).join('');
}

function leadsGoPage(delta){
  const totalPages = Math.max(1, Math.ceil(leadsTableTotal / LEADS_SERVER_PAGE));
  leadsCurrentPage = Math.max(1, Math.min(leadsCurrentPage + delta, totalPages));
  fetchLeadsPage(leadsCurrentPage);
}
function _renderLeadsTable(){
  const tbody=document.getElementById('leads-table');
  if(!tbody) return;
  // Don't re-render while the user has a select open — avoids reverting mid-interaction
  const active=document.activeElement;
  if(active&&active.tagName==='SELECT'&&active.closest('#leads-table')) return;
  const rows = _leadsEtiquetaFiltro
    ? leadsTableCache.filter(l => _getEtiquetas(l).includes(_leadsEtiquetaFiltro))
    : leadsTableCache;
  const totalPages = Math.max(1, Math.ceil(leadsTableTotal / LEADS_SERVER_PAGE));
  const pageOffset = (leadsCurrentPage - 1) * LEADS_SERVER_PAGE;
  const pagBar = document.getElementById('leads-pagination');
  if(pagBar){
    if(totalPages <= 1){ pagBar.style.display='none'; }
    else{
      pagBar.style.display='flex';
      pagBar.innerHTML=`
        <button onclick="leadsGoPage(-1)" ${leadsCurrentPage<=1?'disabled':''} style="padding:4px 12px;border-radius:6px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:var(--text2);cursor:pointer;font-size:12px;${leadsCurrentPage<=1?'opacity:.35;cursor:default':''}">← Ant</button>
        <span style="font-size:12px;color:var(--text3)">Pág ${leadsCurrentPage} / ${totalPages} &nbsp;·&nbsp; ${leadsTableTotal} leads</span>
        <button onclick="leadsGoPage(1)" ${leadsCurrentPage>=totalPages?'disabled':''} style="padding:4px 12px;border-radius:6px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:var(--text2);cursor:pointer;font-size:12px;${leadsCurrentPage>=totalPages?'opacity:.35;cursor:default':''}">Sig →</button>`;
    }
  }
  const sortIcon=document.getElementById('leads-sort-icon');
  if(sortIcon) sortIcon.textContent=_leadsSortBy==='updated_at'?(_leadsSortDir==='desc'?'↓':'↑'):'';
  tbody.innerHTML=rows.map((x,idx)=>{
    const _origIdx = pageOffset + idx;
    const estado    = x.estado||'Primer Contacto';
    const esPerdido = ESTADO_PERDIDO.has(estado);
    const esCerrado = ESTADO_CERRADO.has(estado);
    const esAgendado= estado==='Agendado';
    const rowStyle  = esPerdido
      ? 'background:rgba(184,72,72,0.06);border-left:2px solid rgba(184,72,72,0.3);'
      : esCerrado
      ? 'background:rgba(61,138,90,0.05);border-left:2px solid rgba(61,138,90,0.25);'
      : '';

    const seg = x.seguimientos||0;
    const respondio = x.respondio_seguimiento_4 || '';
    const segOpts=[0,1,2,3,4].map(n=>`<option value="${n}" ${n===seg?'selected':''}>${n===0?'—':n}</option>`).join('');
    const respondioOpts=[
      `<option value="" ${respondio===''?'selected':''}>¿Respondió?</option>`,
      `<option value="SI" ${respondio==='SI'?'selected':''}>SI</option>`,
      `<option value="NO" ${respondio==='NO'?'selected':''}>NO</option>`,
    ].join('');
    const faseR = _getFaseForEstado(x.estado);
    const faseLabelR = faseR ? faseR.label : (x.estado||'—');
    const faseColorR = faseR ? faseR.color : '#d46060';
    // Info previa button for Agendado leads — find matching call by instagram, fallback to nombre
    let infoCallBtn='<span style="color:var(--text3)">—</span>';
    if(esAgendado){
      const ig=(x.instagram||'').toLowerCase();
      const callMatch=callsCache.find(c=>(c.instagram||'').toLowerCase()===ig&&c.estado==='Pendiente')
        ||callsCache.find(c=>(c.instagram||'').toLowerCase()===ig)
        ||(x.nombre?callsCache.find(c=>(c.nombre||'').toLowerCase()===(x.nombre||'').toLowerCase()&&c.estado==='Pendiente'):null);
      if(callMatch){
        const hasInfo=!!(callMatch.info_previa&&callMatch.info_previa.trim());
        const n=(callMatch.nombre||'').replace(/'/g,"\\'");
        infoCallBtn=`<button class="btn btn-outline" style="font-size:10px;padding:3px 8px;white-space:nowrap" onclick="abrirInfoPreviaEdit('${callMatch.id}','${n}');event.stopPropagation()">${hasInfo?'Editar Info Previa':'Agregar Info Previa'}</button>`;
      }
    }

    return `
    <tr style="${rowStyle}">
      <td style="text-align:center;width:30px;padding:4px 2px;color:var(--text3);font-size:10px">${_origIdx+1}</td>
      <td style="color:var(--text3);font-size:12px;white-space:nowrap">${formatearFecha(x.created_at)}</td>
      <td style="color:var(--text3);font-size:11px;white-space:nowrap">${formatearFechaHora(x.estado_updated_at||x.updated_at)}</td>
      <td style="color:var(--text);font-weight:600;cursor:text" title="Clic para editar" onclick="_editLeadText(event,'${x.id}','nombre',false)">${x.nombre||'<span style="color:var(--text3);font-style:italic">Sin nombre</span>'}</td>
      <td>${x.instagram?`<a href="https://instagram.com/${(x.instagram||'').replace('@','')}" target="_blank"
             style="color:var(--blue);text-decoration:none;font-size:12px">@${x.instagram}</a>`:'<span style="color:var(--text3)">—</span>'}</td>
      <td style="cursor:pointer" title="Clic para editar" onclick="_editLeadSelect(event,'${x.id}','origen')">${origenBadge(x.origen)}</td>
      <td style="cursor:pointer" title="Clic para editar" onclick="_editLeadSelect(event,'${x.id}','tipo')">${tipoBadge(x.tipo)}</td>
      <td style="cursor:text" title="Clic para editar etiquetas" onclick="_editLeadEtiqueta(event,'${x.id}')">${(()=>{const ets=_getEtiquetas(x);return ets.length?ets.map(e=>`<span class="badge bgy" style="display:inline-block;margin:1px 2px">${e}</span>`).join(''):'<span style="color:var(--text3)">—</span>';})()}</td>
      <td>${estadoSelect(x)}</td>
      <td onclick="event.stopPropagation()">${infoCallBtn}</td>
      <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:text" title="Clic para editar" onclick="_editLeadText(event,'${x.id}','ultima_accion',false)">${x.ultima_accion||'<span style="color:var(--text3)">—</span>'}</td>
      <td style="cursor:text" title="Clic para editar notas" onclick="_editLeadText(event,'${x.id}','notas',true)"><span class="trunc" title="${x.notas||''}">${x.notas||'<span style="color:var(--text3)">—</span>'}</span></td>
      <td>${x.source==='manychat'?'<span class="api-badge">MC</span>':'<span style="color:var(--text3);font-size:11px">manual</span>'}</td>
      <td style="text-align:center;min-width:90px">
        <select onchange="actualizarSeguimientos('${x.id}',this.value,this)"
          style="font-size:11px;font-weight:700;padding:2px 4px;border-radius:4px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:${seg>=4?'#d46060':seg>0?'var(--gold)':'var(--text3)'};cursor:pointer;outline:none">
          ${segOpts}
        </select>
        <span class="seg-ultimatum" style="display:${seg>=4?'block':'none'};font-size:9px;font-weight:700;color:#d46060;border:1px solid rgba(184,72,72,0.35);border-radius:4px;padding:2px 4px;margin-top:3px;white-space:nowrap;line-height:1.3">Último seg. — Hacer ultimátum</span>
        <div class="seg-respondio-wrap" style="display:${seg>=4?'':'none'};margin-top:4px">
          <select onchange="actualizarRespondio4('${x.id}',this.value,this)"
            style="font-size:10px;padding:2px 4px;border-radius:4px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:${respondio==='NO'?'#d46060':respondio==='SI'?'#5cb87a':'var(--text3)'};cursor:pointer;outline:none;width:100%">
            ${respondioOpts}
          </select>
          <span class="seg-perdido-etapa" style="display:${respondio==='NO'?'block':'none'};font-size:9px;font-weight:700;color:${faseColorR};border:1px solid ${faseColorR}55;border-radius:4px;padding:2px 4px;margin-top:3px;white-space:nowrap;line-height:1.3">Perdido en: ${faseLabelR}</span>
        </div>
      </td>
      <td style="text-align:center;padding:4px 2px">
        <button class="btn-icon" onclick="delLead('${x.id}')" style="color:var(--red);font-size:16px;line-height:1;padding:2px 6px" title="Eliminar lead">×</button>
      </td>
    </tr>`;
  }).join('')||'<tr><td colspan="15" style="color:var(--text3);text-align:center;padding:24px">Sin leads para este filtro</td></tr>';
}

function _renderFunnel(leads){
  const grid = document.getElementById('leads-funnel-grid');
  if(!grid) return;

  const total       = leads.length;
  const agendados   = leads.filter(l=>l.estado==='Agendado').length;
  const calificados = leads.filter(l=>l.calificado===true).length;
  const descalificados = leads.filter(l=>l.descalificado===true).length;
  const cerrados    = leads.filter(l=>ESTADO_CERRADO&&ESTADO_CERRADO.has(l.estado)).length;

  const pct = (num, den) => den > 0 ? ((num/den)*100).toFixed(1)+'%' : '—';
  const agendamiento   = pct(agendados, total);
  const calificadasPct = pct(calificados, agendados);
  const conversion     = pct(cerrados, agendados);

  function semaforo(numStr, verde, amarillo){
    if(numStr==='—') return 'var(--text3)';
    const n = parseFloat(numStr);
    if(n >= verde)   return '#5cb87a';
    if(n >= amarillo) return '#e0a848';
    return '#d46060';
  }

  const metrics = [
    { label:'% Agendamiento',  val:agendamiento,   verde:30, amarillo:15,
      sub:`${agendados} de ${total} leads` },
    { label:'% Calificadas',   val:calificadasPct,  verde:60, amarillo:40,
      sub:`${calificados} cal · ${descalificados} descal de ${agendados}` },
    { label:'% Conversión',    val:conversion,      verde:25, amarillo:12,
      sub:`${cerrados} cierres de ${agendados} agendados` },
  ];

  grid.innerHTML = metrics.map(m => {
    const color = semaforo(m.val, m.verde, m.amarillo);
    return `
      <div style="
        background:linear-gradient(135deg,rgba(20,19,18,0.97),rgba(12,11,11,0.99));
        border:1px solid rgba(60,58,55,0.2);
        border-radius:var(--r);padding:8px 10px;position:relative;overflow:hidden;
        box-shadow:0 0 0 1px rgba(0,0,0,0.3),0 2px 8px rgba(0,0,0,0.45)">
        <div style="position:absolute;bottom:0;left:0;right:0;height:2px;
                    background:linear-gradient(90deg,transparent,${color},transparent);opacity:.6"></div>
        <div style="position:absolute;top:0;left:0;right:0;height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)"></div>
        <div style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;
                    letter-spacing:.08em;margin-bottom:4px">${m.label}</div>
        <div style="font-family:'Inter',sans-serif;font-weight:700;font-size:18px;letter-spacing:-0.025em;color:${color};line-height:1;margin-bottom:3px">${m.val}</div>
        <div style="font-size:9px;color:var(--text3);line-height:1.3">${m.sub}</div>
      </div>`;
  }).join('');
}

async function actualizarCalificacion(id, valor, selectEl){
  const lead = leadsCache.find(l=>l.id===id);
  const leadT = leadsTableCache.find(l=>l.id===id);
  const patch = { calificado: valor==='si', descalificado: valor==='no' };
  if(lead){ lead.calificado=patch.calificado; lead.descalificado=patch.descalificado; }
  if(leadT){ leadT.calificado=patch.calificado; leadT.descalificado=patch.descalificado; }
  if(valor==='si'&&lead) _atribuirContenido(lead,'calificados').catch(()=>{});
  if(valor==='no'&&lead) _atribuirContenido(lead,'descalificados').catch(()=>{});
  if(selectEl){ selectEl.style.color = valor==='si'?'#5cb87a':valor==='no'?'#d46060':'var(--text3)'; selectEl.blur(); }
  _renderEstadoCounters(leadsCache);
  _applyLeadsFilter();
  try{
    const res = await apiFetch(`${API_URL}/leads/${id}`,{method:'PATCH',body:JSON.stringify(patch)});
    if(!res.ok) toast('✗ Error al actualizar calificación');
  }catch(e){ toast('✗ Error al actualizar calificación'); }
}

async function actualizarCampo(id, campo, valor){
  if(!id){ console.error('[actualizarCampo] ID inválido:', id); return; }
  if(!['show','calificado','descalificado'].includes(campo)){ console.error('[actualizarCampo] Campo inválido:', campo); return; }

  const lead = leadsCache.find(l=>l.id===id);
  const leadT = leadsTableCache.find(l=>l.id===id);
  if(lead) lead[campo] = valor;
  if(leadT) leadT[campo] = valor;

  _renderFunnel(leadsCache);

  try{
    console.log(`[actualizarCampo] ${campo}=${valor} para id=${id}`);
    const patch = { [campo]: valor };
    const res = await apiFetch(`${API_URL}/leads/${id}`,{method:'PATCH',body:JSON.stringify(patch)});
    if(!res.ok){
      const body=await res.text().catch(()=>'');
      console.error('[actualizarCampo] HTTP',res.status,body);
      throw new Error(`HTTP ${res.status}`);
    }
  }catch(e){
    console.error('[actualizarCampo]',e.message);
    toast(`✗ Error al guardar (${e.message})`);
    if(lead) lead[campo] = !valor;
    _renderFunnel(leadsCache);
  }
}

function _leadEditBtns(saveFn){
  const w=document.createElement('div');
  w.style.cssText='display:flex;gap:3px;margin-top:3px;';
  const ok=document.createElement('button');
  ok.textContent='Guardar';
  ok.style.cssText='background:var(--gold);border:none;border-radius:4px;color:#000;font-weight:700;font-size:11px;padding:2px 8px;cursor:pointer;';
  const ca=document.createElement('button');
  ca.textContent='Cancelar';
  ca.style.cssText='background:rgba(255,255,255,0.08);border:none;border-radius:4px;color:var(--text2);font-size:11px;padding:2px 8px;cursor:pointer;';
  ok.addEventListener('mousedown',e2=>{e2.preventDefault();saveFn();});
  ca.addEventListener('mousedown',e2=>{e2.preventDefault();_renderLeadsTable();});
  w.appendChild(ok);w.appendChild(ca);
  return w;
}
function _editLeadText(e, id, campo, multiline){
  const cell=e.target.closest('td');
  if(!cell||cell.querySelector('input,textarea'))return;
  const lead=leadsTableCache.find(l=>l.id===id)||leadsCache.find(l=>l.id===id);
  const valor=lead?(lead[campo]||''):'';
  const el=multiline?document.createElement('textarea'):document.createElement('input');
  el.value=valor;
  if(multiline){
    el.rows=3;
    el.style.cssText='background:rgba(255,255,255,0.05);border:1px solid var(--gold);border-radius:4px;color:var(--text);font-size:12px;width:100%;min-width:140px;outline:none;padding:4px 6px;resize:vertical;font-family:inherit;box-sizing:border-box;';
  } else {
    el.style.cssText='background:transparent;border:none;border-bottom:1px solid var(--gold);color:var(--text);font-weight:600;font-size:inherit;width:100%;min-width:80px;outline:none;padding:0;';
  }
  async function save(){
    const nuevo=el.value.trim();
    if(nuevo===valor.trim()){_renderLeadsTable();return;}
    try{
      await apiFetch(`${API_URL}/leads/${id}`,{method:'PATCH',body:JSON.stringify({[campo]:nuevo,updated_at:new Date().toISOString()})});
      [leadsCache,leadsTableCache].forEach(arr=>{const l=arr.find(x=>x.id===id);if(l)l[campo]=nuevo;});
      toast('Guardado ✓');
    }catch(err){toast('✗ Error al guardar');}
    _renderLeadsTable();
  }
  el.addEventListener('keydown',e2=>{
    if(!multiline&&e2.key==='Enter'){e2.preventDefault();save();}
    if(e2.key==='Escape')_renderLeadsTable();
  });
  cell.innerHTML='';cell.appendChild(el);cell.appendChild(_leadEditBtns(save));
  el.focus();if(!multiline)el.select();
}
function _editLeadSelect(e, id, campo){
  const OPTS={origen:['Inbound','Outbound'],tipo:['Ads','Organico','Outbound']};
  const cell=e.target.closest('td');
  if(!cell||cell.querySelector('select'))return;
  const lead=leadsTableCache.find(l=>l.id===id)||leadsCache.find(l=>l.id===id);
  const valor=lead?(lead[campo]||''):'';
  const sel=document.createElement('select');
  sel.style.cssText='background:var(--bg);border:1px solid var(--gold);border-radius:4px;color:var(--text);font-size:12px;outline:none;padding:3px 4px;cursor:pointer;';
  (OPTS[campo]||[]).forEach(o=>{
    const opt=document.createElement('option');
    opt.value=o;opt.textContent=o;
    if(o===valor)opt.selected=true;
    sel.appendChild(opt);
  });
  async function save(){
    const nuevo=sel.value;
    if(nuevo===valor){_renderLeadsTable();return;}
    try{
      await apiFetch(`${API_URL}/leads/${id}`,{method:'PATCH',body:JSON.stringify({[campo]:nuevo,updated_at:new Date().toISOString()})});
      [leadsCache,leadsTableCache].forEach(arr=>{const l=arr.find(x=>x.id===id);if(l)l[campo]=nuevo;});
      toast('Guardado ✓');
    }catch(err){toast('✗ Error al guardar');}
    _renderLeadsTable();
  }
  cell.innerHTML='';cell.appendChild(sel);cell.appendChild(_leadEditBtns(save));
  sel.focus();
}
function _editLeadEtiqueta(e, id){
  const cell=e.target.closest('td');
  if(!cell||cell.querySelector('input'))return;
  const lead=leadsTableCache.find(l=>l.id===id)||leadsCache.find(l=>l.id===id);
  const ets=Array.isArray(lead?.etiquetas)&&lead.etiquetas.length?lead.etiquetas:(lead?.etiqueta?[lead.etiqueta]:[]);
  const inp=document.createElement('input');
  inp.value=ets.join(', ');
  inp.placeholder='Ej: CTA BIO, Seguidor Nuevo';
  inp.style.cssText='background:transparent;border:none;border-bottom:1px solid var(--gold);color:var(--text);font-size:12px;width:100%;min-width:130px;outline:none;padding:0;';
  async function save(){
    const nuevas=inp.value.split(',').map(s=>s.trim()).filter(Boolean);
    const patch={etiqueta:nuevas[0]||'',etiquetas:nuevas,updated_at:new Date().toISOString()};
    try{
      await apiFetch(`${API_URL}/leads/${id}`,{method:'PATCH',body:JSON.stringify(patch)});
      [leadsCache,leadsTableCache].forEach(arr=>{const l=arr.find(x=>x.id===id);if(l){l.etiqueta=patch.etiqueta;l.etiquetas=patch.etiquetas;}});
      toast('Etiquetas guardadas ✓');
    }catch(err){toast('✗ Error al guardar');}
    _renderLeadsTable();_applyLeadsFilter();
  }
  inp.addEventListener('keydown',e2=>{if(e2.key==='Enter'){e2.preventDefault();save();}if(e2.key==='Escape')_renderLeadsTable();});
  cell.innerHTML='';cell.appendChild(inp);cell.appendChild(_leadEditBtns(save));
  inp.focus();inp.select();
}
function _toggleLeadsSort(){
  if(_leadsSortBy==='updated_at'){
    _leadsSortDir=_leadsSortDir==='desc'?'asc':'desc';
  } else {
    _leadsSortBy='updated_at';_leadsSortDir='desc';
  }
  leadsCurrentPage=1;
  fetchLeadsPage(1);
}

// Builds query params for the current active filters
function _leadsFilterParams(){
  const p = new URLSearchParams();
  if(_leadsEstadoFiltro)    p.set('estado',  _leadsEstadoFiltro);
  if(leadsBusqueda.trim())  p.set('search',  leadsBusqueda.trim());
  if(_leadsVistaFiltro && _leadsVistaFiltro !== 'todos') p.set('vista', _leadsVistaFiltro);
  if(_gf.mes !== '')        p.set('mes',     _gf.mes);
  else if(_gf.period)       p.set('period',  _gf.period);
  if(_leadsSortBy)          { p.set('sort_by', _leadsSortBy); p.set('sort_dir', _leadsSortDir); }
  if(_leadsEtiquetaFiltro)  p.set('etiqueta_filter', _leadsEtiquetaFiltro);
  return p;
}

// Fetches ALL leads with lite fields → updates leadsCache (stats)
async function fetchLeads(incremental=false){
  try{
    const fetchTs = new Date().toISOString();
    let url = `${API_URL}/leads?lite=1`;
    if(incremental && _leadsLastFetchTs){
      url += `&after=${encodeURIComponent(_leadsLastFetchTs)}`;
    }
    const res = await apiFetch(url);
    if(!res.ok){
      if(res.status===401||res.status===403) toast('✗ Sin acceso — verificá el cliente seleccionado');
      return;
    }
    const data = await res.json();
    const raw = Array.isArray(data) ? data : (data?.leads || data?.data || []);
    const processed = raw
      .filter(l => !_pendingDeletes.has(String(l.id)))
      .map(l=>({
        ...l,
        estado:        l.estado        || 'Primer Contacto',
        show:          l.show          === true,
        calificado:    l.calificado    === true,
        descalificado: l.descalificado === true,
      }));
    if(incremental && _leadsLastFetchTs){
      const updatedIds = new Set(processed.map(l=>l.id));
      leadsCache = window.leadsCache = [
        ...leadsCache.filter(l=>!updatedIds.has(l.id) && !_pendingDeletes.has(String(l.id))),
        ...processed,
      ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    } else {
      leadsCache = window.leadsCache = processed;
    }
    _leadsLastFetchTs = fetchTs;
  }catch(e){
    console.error('[fetchLeads]',e);
  }finally{
    _applyLeadsFilter();
  }
}

// Fetches one page of FULL leads with current filters → updates leadsTableCache (table)
async function fetchLeadsPage(page=1){
  leadsCurrentPage = page;
  try{
    const p = _leadsFilterParams();
    p.set('page',     page);
    p.set('per_page', LEADS_SERVER_PAGE);
    const res = await apiFetch(`${API_URL}/leads?${p.toString()}`);
    if(!res.ok) return;
    const data = await res.json();
    const raw = Array.isArray(data) ? data : (data?.leads || []);
    leadsTableCache = raw
      .filter(l => !_pendingDeletes.has(String(l.id)))
      .map(l=>({
        ...l,
        estado:        l.estado        || 'Primer Contacto',
        show:          l.show          === true,
        calificado:    l.calificado    === true,
        descalificado: l.descalificado === true,
      }));
    leadsTableTotal = Array.isArray(data) ? raw.length : (data?.total ?? raw.length);
    _renderLeadsTable();
  }catch(e){
    console.error('[fetchLeadsPage]',e);
  }
}

function renderLeads(){
  leadsCurrentPage = 1;
  _applyLeadsFilter();
  fetchLeads(false);
  fetchLeadsPage(1);
  if(_leadsInterval)        clearInterval(_leadsInterval);
  if(_leadsFullRefreshTimer) clearInterval(_leadsFullRefreshTimer);
  if(_leadsPageInterval)    clearInterval(_leadsPageInterval);
  _leadsInterval         = setInterval(()=>fetchLeads(true),        3000);
  _leadsFullRefreshTimer = setInterval(()=>fetchLeads(false),       2*60*1000);
  _leadsPageInterval     = setInterval(()=>fetchLeadsPage(leadsCurrentPage), 15000);
}

// ========== FUNNEL MÉTRICAS ==========
const FUNNEL_FASES = [
  { label:'Primer Contacto',  estados:['Primer contacto'],                                      color:'#9a9690', bg:'rgba(154,150,144,0.22)' },
  { label:'Descubrimiento',   estados:['Descubrimiento (Problemas-Objetivos)'],                 color:'#6090d4', bg:'rgba(61,106,170,0.22)'  },
  { label:'Nutrición',        estados:['Recurso de nutrición'],                                  color:'#a070d8', bg:'rgba(122,74,184,0.22)'  },
  { label:'Agendamiento',     estados:['PITCH VSL CHAT','VSL CHAT','Proponer Call','Calendly Enviado'], color:'#e0a848', bg:'rgba(196,136,42,0.22)'  },
  { label:'Cierre',           estados:['Agendado'],                                              color:'#d4a832', bg:'rgba(212,168,50,0.2)'   },
  { label:'Cerrados',         estados:['Cerrada','Seña'],                                         color:'#5cb87a', bg:'rgba(61,138,90,0.22)'   },
];
let _funnelFilter = { period:'mes', mes:'' };
let _funnelFasesCache = [];

function _getFunnelLeads(){
  let leads = leadsCache;
  const {period, mes} = _funnelFilter;
  if(mes !== ''){
    const m=parseInt(mes,10), yr=new Date().getFullYear();
    leads=leads.filter(l=>{const d=new Date(l.created_at||0);return d.getMonth()===m&&d.getFullYear()===yr;});
  } else {
    const now=new Date();
    switch(period){
      case 'dia':    leads=leads.filter(l=>{const d=new Date(l.created_at||0);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&d.getDate()===now.getDate();}); break;
      case 'semana': {const c=new Date(now);c.setDate(now.getDate()-7);leads=leads.filter(l=>new Date(l.created_at||0)>=c);} break;
      case 'mes':    {const c=new Date(now);c.setDate(now.getDate()-30);leads=leads.filter(l=>new Date(l.created_at||0)>=c);} break;
      case 'año':    {const c=new Date(now);c.setFullYear(now.getFullYear()-1);leads=leads.filter(l=>new Date(l.created_at||0)>=c);} break;
    }
  }
  return leads.filter(l=>!_getEtiquetas(l).some(e=>e.trim().toLowerCase()==='seguidor nuevo'));
}

function setFunnelFilter(period, el){
  _funnelFilter.period=period;
  _funnelFilter.mes='';
  const sel=document.getElementById('funnel-mes-select');
  if(sel) sel.value='';
  document.querySelectorAll('#page-funnel .tab').forEach(t=>t.classList.remove('active'));
  if(el) el.classList.add('active');
  renderFunnelMetricas();
}
function onFunnelMesChange(){
  const s=document.getElementById('funnel-mes-select');
  _funnelFilter.mes=s?s.value:'';
  document.querySelectorAll('#page-funnel .tab').forEach(t=>t.classList.remove('active'));
  renderFunnelMetricas();
}

function renderFunnelMetricas(){
  const all = _getFunnelLeads();
  const perdidos = all.filter(_esPerdidoEfectivo);
  const activos  = all.filter(l=>!_esPerdidoEfectivo(l));
  const total    = activos.length;
  const totalAll = all.length;

  // Build phase data
  _funnelFasesCache = FUNNEL_FASES.map(f=>{
    const leadsInFase=activos.filter(l=>f.estados.includes(l.estado));
    return{
      ...f,
      detail: f.estados.map(e=>({ estado:e, count:activos.filter(l=>l.estado===e).length })),
      count:  leadsInFase.length,
      pct:    total>0 ? Math.round(leadsInFase.length/total*100) : 0,
      cal:    leadsInFase.filter(l=>l.calificado===true).length,
      descal: leadsInFase.filter(l=>l.descalificado===true).length,
    };
  });

  // Badge
  const badge=document.getElementById('funnel-total-badge');
  if(badge) badge.textContent=`${total} lead${total!==1?'s':''} activos`;

  // Perdidos
  const pCount=document.getElementById('funnel-perdidos-count');
  const pPct  =document.getElementById('funnel-perdidos-pct');
  if(pCount) pCount.textContent=perdidos.length;
  if(pPct)   pPct.textContent=totalAll>0?`${Math.round(perdidos.length/totalAll*100)}% del total`:'—';

  _renderFunnelSVG();
  _renderFunnelTable();
  _renderLostBreakdown(all);
}

function _renderFunnelSVG(){
  const wrap=document.getElementById('funnel-svg-wrap');
  if(!wrap) return;
  const fases=_funnelFasesCache;
  const W=700, sliceH=68, gap=3, n=fases.length;
  const H=n*sliceH+(n-1)*gap;
  const indent=35;

  const polygons=fases.map((f,i)=>{
    const y1=i*(sliceH+gap);
    const y2=y1+sliceH;
    const x1L=i*indent, x1R=W-i*indent;
    const x2L=(i+1)*indent, x2R=W-(i+1)*indent;
    const cx=W/2, cy=(y1+y2)/2;
    return `
      <defs><linearGradient id="fg${i}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${f.color}" stop-opacity="0.38"/>
        <stop offset="100%" stop-color="${f.color}" stop-opacity="0.18"/>
      </linearGradient></defs>
      <polygon points="${x1L},${y1} ${x1R},${y1} ${x2R},${y2} ${x2L},${y2}"
        fill="url(#fg${i})" stroke="${f.color}" stroke-width="0.8" style="cursor:pointer"
        onmouseenter="_showFunnelTip(event,${i})" onmousemove="_moveFunnelTip(event)" onmouseleave="_hideFunnelTip()"/>
      <text x="${cx}" y="${cy-10}" text-anchor="middle" font-family="'Inter',sans-serif" font-weight="900" font-size="24" fill="${f.color}">${f.pct}%</text>
      <text x="${cx}" y="${cy+12}" text-anchor="middle" font-family="'Inter',sans-serif" font-weight="600" font-size="11" fill="${f.color}" opacity="0.85" letter-spacing="1">${f.label.toUpperCase()}</text>
      <text x="${cx}" y="${cy+27}" text-anchor="middle" font-family="'Inter',sans-serif" font-weight="500" font-size="10" fill="${f.color}" opacity="0.55">${f.count} lead${f.count!==1?'s':''}</text>
      <text x="${cx-145}" y="${cy+20}" text-anchor="end" font-family="'Inter',sans-serif" font-weight="700" font-size="12" fill="#5cb87a" opacity="${f.cal>0?'1':'0.25'}">C${f.cal}</text>
      <text x="${cx+145}" y="${cy+20}" text-anchor="start" font-family="'Inter',sans-serif" font-weight="700" font-size="12" fill="#d46060" opacity="${f.descal>0?'1':'0.25'}">D${f.descal}</text>`;
  }).join('');

  wrap.innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;max-width:720px;margin:0 auto">${polygons}</svg>`;
}

function _renderFunnelTable(){
  const tbody=document.getElementById('funnel-table-body');
  if(!tbody) return;
  const all=_getFunnelLeads();
  tbody.innerHTML=_funnelFasesCache.map(f=>{
    const leadsInFase=all.filter(l=>f.estados.includes(l.estado));
    const cal=leadsInFase.filter(l=>l.calificado===true).length;
    const descal=leadsInFase.filter(l=>l.descalificado===true).length;
    return`<tr>
      <td style="font-weight:700;color:${f.color}">${f.label}</td>
      <td style="color:var(--text3);font-size:12px">${f.estados.join(', ')}</td>
      <td style="text-align:right;font-family:'Inter',sans-serif;font-weight:700;font-size:16px;color:${f.color}">${f.count}</td>
      <td style="text-align:right;color:var(--text2);font-size:13px;font-weight:600">${f.pct}%</td>
      <td style="text-align:center"><span style="color:#5cb87a;font-weight:700;font-size:13px">${cal||'—'}</span></td>
      <td style="text-align:center"><span style="color:#d46060;font-weight:700;font-size:13px">${descal||'—'}</span></td>
    </tr>`;
  }).join('');
}

function _showFunnelTip(event, idx){
  const f=_funnelFasesCache[idx];
  if(!f) return;
  const tip=document.getElementById('funnel-tooltip');
  if(!tip) return;
  const lines=f.detail.map(d=>`
    <div style="display:flex;justify-content:space-between;gap:14px;padding:3px 0">
      <span style="font-size:11px;color:var(--text2)">${d.estado}</span>
      <span style="font-size:11px;font-weight:700;color:var(--text)">${d.count}</span>
    </div>`).join('');
  tip.innerHTML=`
    <div style="font-size:10px;font-weight:800;color:${f.color};text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">${f.label}</div>
    ${lines}
    <div style="margin-top:8px;padding-top:7px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:14px">
      <span style="font-size:11px;color:var(--text3)">Total</span>
      <span style="font-size:11px;font-weight:800;color:${f.color}">${f.count} (${f.pct}%)</span>
    </div>`;
  tip.style.display='block';
  _moveFunnelTip(event);
}
function _moveFunnelTip(event){
  const tip=document.getElementById('funnel-tooltip');
  if(!tip) return;
  const tw=tip.offsetWidth||200, th=tip.offsetHeight||100;
  let x=event.clientX+14, y=event.clientY-20;
  if(x+tw>window.innerWidth-10) x=event.clientX-tw-14;
  if(y+th>window.innerHeight-10) y=event.clientY-th-10;
  tip.style.left=x+'px'; tip.style.top=y+'px';
}
function _hideFunnelTip(){
  const tip=document.getElementById('funnel-tooltip');
  if(tip) tip.style.display='none';
}

function setLeadsFilter(filtro,el){ leadsCurrentPage=1; _gfSet(filtro); fetchLeadsPage(1); }
function onLeadsMesChange(){ leadsCurrentPage=1; const s=document.getElementById('leads-mes-select'); _gfSetMes(s?s.value:''); fetchLeadsPage(1); }
function onLeadsSearch(){
  leadsCurrentPage=1;
  leadsBusqueda=document.getElementById('leads-search')?.value||'';
  _applyLeadsFilter();
  fetchLeadsPage(1);
}

let _isSavingLead = false;
async function saveLead(){
  if(_isSavingLead) return;
  _isSavingLead = true;
  const btn = document.querySelector('#modal-lead .btn-gold[onclick="saveLead()"]');
  if(btn) btn.disabled = true;
  try{
  const nombre    =v('l-nombre').trim();
  const instagram =v('l-instagram').trim().replace(/^@/,'').toLowerCase();
  const origen    =v('l-origen');
  const tipo      =v('l-tipo');
  if(!nombre)   {toast('✗ Nombre obligatorio');return;}
  if(!origen)   {toast('✗ Origen obligatorio');return;}
  if(!tipo)     {toast('✗ Tipo obligatorio');return;}

  const now=new Date().toISOString();
  const payload={
    nombre,instagram,origen,tipo,
    cliente_id:    localStorage.getItem('clienteSeleccionado')||'',
    etiqueta:      v('l-etiqueta').trim()||'',
    estado:        v('l-estado')||'Primer contacto',
    ultima_accion: v('l-accion').trim()||'',
    notas:         v('l-notas').trim()||'',
    seguimientos:  parseInt(v('l-seguimientos')||'0',10)||0,
    source:        'manual',
    updated_at:    now,
    estado_updated_at: now,
  };

  const RANK={};
  LEAD_ESTADOS.forEach((e,i)=>RANK[e]=i);
  const existing=instagram?leadsCache.find(l=>(l.instagram||'').toLowerCase()===instagram):null;
  if(existing){
    if((RANK[existing.estado]??0)>(RANK[payload.estado]??0)) payload.estado=existing.estado;
    if(!payload.notas) payload.notas=existing.notas||'';
    const ur=await apiFetch(`${API_URL}/leads/${existing.id}`,{method:'PATCH',body:JSON.stringify(payload)});
    if(!ur.ok){const e=await ur.json().catch(()=>({}));console.error('[update lead]',e);toast('✗ Error al actualizar');return;}
    toast('Lead actualizado ✓');
  } else {
    payload.created_at=now;
    const ir=await apiFetch(`${API_URL}/leads`,{method:'POST',body:JSON.stringify(payload)});
    if(!ir.ok){const e=await ir.json().catch(()=>({}));console.error('[insert lead]',e);toast(`✗ ${e.error||'Error al guardar ('+ir.status+')'}`);return;}
    if(payload.etiqueta) _atribuirContenido({etiqueta:payload.etiqueta},'leads').catch(()=>{});
    toast('Lead guardado ✓');
  }
  closeModal('modal-lead');
  await fetchLeads();
  fetchLeadsPage(leadsCurrentPage);
  }finally{
    _isSavingLead = false;
    if(btn) btn.disabled = false;
  }
}

function vaciarPipeline(){
  if(!confirm(`¿Vaciar todo el pipeline? Se eliminarán los ${leadsCache.length} leads de la vista. Esta acción no se puede deshacer.`)) return;
  const ids=[...leadsCache.map(l=>l.id)];
  leadsCache=window.leadsCache=[];
  _applyLeadsFilter();
  // Intentar eliminar en el servidor (best-effort, sin bloquear UI)
  ids.forEach(id=>{
    apiFetch(`${API_URL}/leads/${id}`,{method:'DELETE'}).catch(()=>{});
  });
  toast(`✓ Pipeline vaciado`);
}
async function delLead(id){
  if(!confirm('¿Seguro que querés eliminar este lead?')) return;
  if(!id){ console.warn('[delLead] id vacío'); return; }
  const sid=String(id);

  // 0. Descontar del contenido atribuido antes de eliminarlo del cache
  const leadToDelete=leadsCache.find(l=>String(l.id)===sid);
  if(leadToDelete){
    _desatribuirContenido(leadToDelete,'leads').catch(()=>{});
    if(leadToDelete.estado==='Agendado') _desatribuirContenido(leadToDelete,'agendas').catch(()=>{});
    if(['Cerrado','Seña','Cerrada'].includes(leadToDelete.estado)) _desatribuirContenido(leadToDelete,'ventas').catch(()=>{});
  }

  // 1. Marcar como eliminado → el polling NO lo va a reinsertar aunque el server falle
  _pendingDeletes.add(sid);

  // 2. Quitar del cache local inmediatamente → UI reactivo sin esperar API
  leadsCache=window.leadsCache=leadsCache.filter(l=>String(l.id)!==sid);
  leadsTableCache=leadsTableCache.filter(l=>String(l.id)!==sid);
  leadsTableTotal=Math.max(0, leadsTableTotal-1);
  _applyLeadsFilter();

  // 3. Intentar DELETE en el servidor con logs claros
  console.log('[delLead] Deleting lead:', sid);
  try{
    const res=await apiFetch(`${API_URL}/leads/${sid}`,{method:'DELETE'});
    console.log('[delLead] DELETE response:', res.status, res.ok);
    if(res.ok){
      console.log('[delLead] Lead eliminado en servidor ✓');
      // id puede salir de _pendingDeletes; el server ya no lo tiene
      _pendingDeletes.delete(sid);
    } else {
      const body=await res.text().catch(()=>'');
      console.warn('[delLead] Server respondió',res.status,body);
      toast('⚠ Lead eliminado localmente — el servidor respondió '+res.status+'. Recargá para sincronizar.');
      // dejamos el id en _pendingDeletes → el polling no lo restaurará en esta sesión
    }
  }catch(e){
    console.warn('[delLead] Error de red:', e.message);
    toast('⚠ Lead eliminado localmente — sin conexión al servidor.');
    // dejamos el id en _pendingDeletes → el polling no lo restaurará en esta sesión
  }
}
// Alias global para compatibilidad con cualquier botón que llame deleteLead
window.deleteLead=function(id){ return delLead(id); };

// ========== CLIENTES ==========
function _clientOrigenBadge(x){
  // Search leadsCache by instagram first, then by name → use etiqueta
  let etiqueta=null;
  if(leadsCache?.length){
    const ig=(x.instagram||'').toLowerCase();
    let lead=ig?leadsCache.find(l=>(l.instagram||'').toLowerCase()===ig):null;
    if(!lead){
      const nom=(x.nombre||'').toLowerCase();
      lead=nom?leadsCache.find(l=>(l.nombre||'').toLowerCase()===nom):null;
    }
    const ets=lead?_getEtiquetas(lead):[];
    etiqueta=ets.length?ets[ets.length-1]:null;
  }
  if(!etiqueta) return '<span style="color:var(--text3);font-size:11px">—</span>';
  return `<span style="font-size:10px;font-weight:600;padding:2px 7px;border-radius:20px;background:rgba(224,181,74,.1);border:1px solid rgba(224,181,74,.2);color:var(--gold);white-space:nowrap">${etiqueta}</span>`;
}

function _clientsRow(x,i){
  const ig=(x.instagram||'').replace(/^@/,'');
  const _xid=String(x.id);
  const proxCuota=(S.cuotas||[]).filter(c=>String(c.clienteId)===_xid&&!c.pagado).sort((a,b)=>new Date(a.fecha)-new Date(b.fecha))[0];
  const isPIF=(x.pp||'').toUpperCase()==='PIF';
  const isMensualidad=(x.pp||'').toLowerCase()==='mensualidad';
  let proxCuotaTd;
  if(isMensualidad&&x.proxpago){
    const overdue=new Date(x.proxpago)<new Date();
    const col=overdue?'#d46060':'#5cb87a';
    const icon=overdue?'⚠ ':'💳 ';
    proxCuotaTd=`<td style="font-size:11px;color:${col};white-space:nowrap;font-weight:600">${icon}${x.proxpago}</td>`;
  } else {
    proxCuotaTd=proxCuota
      ?`<td style="font-size:11px;color:#d46060;white-space:nowrap">${proxCuota.fecha}</td>`
      :`<td style="font-size:11px;color:var(--text3)">—</td>`;
  }
  const cuota2=(S.cuotas||[]).find(c=>String(c.clienteId)===_xid&&c.numero===2);
  const cuota3=(S.cuotas||[]).find(c=>String(c.clienteId)===_xid&&c.numero===3);
  const selectStyle='background:var(--bg2);border:1px solid var(--line);border-radius:var(--rs);color:var(--gold-light);font-size:11px;padding:2px 4px;cursor:pointer';
  const cuota2Td=(isPIF||isMensualidad)
    ?`<td style="text-align:center;font-size:11px;color:var(--text3)">—</td>`
    :`<td onclick="event.stopPropagation()" style="text-align:center">
        <select onchange="_toggleOrCreateCuota('${x.id}',2,this.value)" style="${selectStyle}">
          <option value="pendiente" ${!cuota2?.pagado?'selected':''}>Pendiente</option>
          <option value="pago" ${cuota2?.pagado?'selected':''}>Pagó</option>
        </select>
        <div style="font-size:9px;color:var(--text3);margin-top:2px">${cuota2?.monto?fmtMoney(+cuota2.monto):''}</div>
      </td>`;
  const cuota3Td=(isPIF||isMensualidad)
    ?`<td style="text-align:center;font-size:11px;color:var(--text3)">—</td>`
    :cuota2?.pagado
      ?`<td onclick="event.stopPropagation()" style="text-align:center">
          <select onchange="_toggleOrCreateCuota('${x.id}',3,this.value)" style="${selectStyle}">
            <option value="pendiente" ${!cuota3?.pagado?'selected':''}>Pendiente</option>
            <option value="pago" ${cuota3?.pagado?'selected':''}>Pagó</option>
          </select>
          <div style="font-size:9px;color:var(--text3);margin-top:2px">${cuota3?.monto?fmtMoney(+cuota3.monto):''}</div>
        </td>`
      :`<td style="text-align:center;font-size:11px;color:var(--text3)">—</td>`;
  const inputStyle='width:72px;padding:2px 5px;font-size:11px;background:var(--bg2);border:1px solid var(--line);border-radius:var(--rs);color:var(--gold-light);text-align:center';
  const c2ccTd=(isPIF||isMensualidad)
    ?`<td style="text-align:center;color:var(--text3);font-size:11px">—</td>`
    :cuota2
      ?`<td onclick="event.stopPropagation()" style="text-align:center">
          <div style="font-size:9px;color:var(--text3);margin-bottom:2px">CC C2</div>
          <input type="number" value="${+cuota2.cash_collected||''}" min="0" step="any" placeholder="0"
            onchange="updateCuotaCC('${cuota2.id}',this.value)" style="${inputStyle}">
        </td>`
      :`<td style="text-align:center;color:var(--text3);font-size:11px">—</td>`;
  const c3ccTd=(isPIF||isMensualidad)
    ?`<td style="text-align:center;color:var(--text3);font-size:11px">—</td>`
    :cuota3
      ?`<td onclick="event.stopPropagation()" style="text-align:center">
          <div style="font-size:9px;color:var(--text3);margin-bottom:2px">CC C3</div>
          <input type="number" value="${+cuota3.cash_collected||''}" min="0" step="any" placeholder="0"
            onchange="updateCuotaCC('${cuota3.id}',this.value)" style="${inputStyle}">
        </td>`
      :`<td style="text-align:center;color:var(--text3);font-size:11px">—</td>`;
  return `<tr>
    <td>${x.inicio||'—'}</td>
    <td style="color:var(--text);font-weight:500">${x.nombre}</td>
    <td>${x.inicio||'—'}</td>
    <td>${x.fin||'—'}</td>
    <td><span class="badge bg">${x.pp||'—'}</span></td>
    <td style="font-size:12px;color:var(--text2)">${x.proxpaso||'—'}</td>
    <td>${clientBadge(x.estado)}</td>
    <td>${ig?`<a href="https://instagram.com/${ig}" target="_blank" style="color:var(--blue);font-size:12px;text-decoration:none">@${ig}</a>`:'<span style="color:var(--text3)">—</span>'}</td>
    <td style="text-align:center">${_clientOrigenBadge(x)}</td>
    <td onclick="event.stopPropagation()"><input type="number" value="${+x.cash_collected||0}" min="0" step="any" onchange="updateClientCC('${x.id}',this.value)" style="width:80px;padding:2px 5px;font-size:12px;text-align:center;background:var(--bg2);border:1px solid var(--line);border-radius:var(--rs);color:var(--gold-light)" title="Cash Collected inicial"></td>
    ${proxCuotaTd}
    ${cuota2Td}
    ${cuota3Td}
    ${c2ccTd}
    ${c3ccTd}
    <td style="white-space:nowrap">
      ${x.road?`<a href="${x.road}" target="_blank" class="roadmap-link">🗺️</a>`:''}
      <button class="btn-icon" onclick="abrirEditCliente('${x.id}')" style="font-size:13px;margin-right:2px" title="Editar">✏</button>
      <button class="btn-icon" onclick="delClient('${x.id}')">×</button>
    </td>
  </tr>`;
}

function renderClients(){
  const now=new Date();
  const thisYear=now.getFullYear();

  // Read month filter from select
  const selMes=document.getElementById('clients-mes-select');
  const mesFiltro=selMes?selMes.value:'';
  const mesNum=mesFiltro!==''?parseInt(mesFiltro):now.getMonth();
  const prevMes=mesNum===0?11:mesNum-1;
  const prevYear=mesNum===0?thisYear-1:thisYear;

  // Filter clients active during the selected month (started before end of month, ended after start of month or no end date)
  let base=S.clients;
  if(mesFiltro!==''){
    const firstDay=new Date(thisYear,mesNum,1);
    const lastDay=new Date(thisYear,mesNum+1,0);
    base=S.clients.filter(c=>{
      const d=c.inicio?_parseDate(c.inicio):null;
      if(!d||d>lastDay) return false;
      const f=c.fin?_parseDate(c.fin):null;
      return !f||f>=firstDay;
    });
  }

  const activos=base.filter(c=>c.estado==='Al día');
  const inactivos=base.filter(c=>c.estado==='Inactivo');
  const pendientes=base.filter(c=>c.estado==='Pendiente');
  const vencidos=base.filter(c=>c.estado==='Vencido');

  // Nuevos en el mes seleccionado vs mes anterior (por fecha de inicio)
  const newThisMonth=S.clients.filter(c=>{
    if(!c.inicio) return false;
    const d=_parseDate(c.inicio);
    return d&&d.getMonth()===mesNum&&d.getFullYear()===thisYear;
  }).length;
  const newLastMonth=S.clients.filter(c=>{
    if(!c.inicio) return false;
    const d=_parseDate(c.inicio);
    return d&&d.getMonth()===prevMes&&d.getFullYear()===prevYear;
  }).length;
  const deltaNew=newThisMonth-newLastMonth;
  const deltaNewStr=deltaNew===0?'igual que el mes anterior':(deltaNew>0?`+${deltaNew} más que el mes anterior`:`${deltaNew} menos que el mes anterior`);

  const metricsEl=document.getElementById('clients-metrics');
  if(metricsEl){
    metricsEl.innerHTML=`
      ${metCard('Activos',activos.length,'green',activos.length!==0?_delta(activos.length,activos.length-newThisMonth):'')}
      ${metCard('Inactivos',inactivos.length,inactivos.length>0?'red':'')}
      ${metCard('Pendientes / Vencidos',pendientes.length+vencidos.length,pendientes.length+vencidos.length>0?'':'','')}
      ${metCard('Nuevos este mes',newThisMonth,'',deltaNew!==0?(deltaNew>0?`+${deltaNew}`:`${deltaNew}`)+' vs mes anterior':'')}
    `;
  }

  const subEl=document.getElementById('clients-sub');
  if(subEl){
    if(mesFiltro!==''){
      const nombreMes=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][mesNum];
      subEl.textContent=`${base.length} cliente${base.length!==1?'s':''} activos en ${nombreMes} · ${newThisMonth} nuevo${newThisMonth!==1?'s':''} · ${deltaNewStr}`;
    } else {
      subEl.textContent=`${S.clients.length} cliente${S.clients.length!==1?'s':''} en programa · ${deltaNewStr}`;
    }
  }

  _renderMoneyCounters();

  const clientsRowsFor=(arr)=>arr.map(x=>_clientsRow(x,S.clients.indexOf(x))).join('')||
    '<tr><td colspan="14" style="color:var(--text3);text-align:center;padding:16px">Sin clientes en esta categoría</td></tr>';

  const thead=`<thead><tr><th>Fecha</th><th>Cliente</th><th>Inicio</th><th>Final</th><th>PP</th><th>Próximo paso</th><th>Estado</th><th>Instagram</th><th>Origen</th><th>Cobrado</th><th>Próx. cuota</th><th style="text-align:center">Cuota 2</th><th style="text-align:center">Cuota 3</th><th style="text-align:center">CC C2</th><th style="text-align:center">CC C3</th><th></th></tr></thead>`;

  const sectionsEl=document.getElementById('clients-sections');
  if(sectionsEl){
    sectionsEl.innerHTML=`
      <div class="client-section">
        <div class="client-section-hdr" onclick="toggleClientSection('cs-active')">
          <span>Activos <span class="badge bgr" style="margin-left:6px">${activos.length}</span></span>
          <span class="client-section-arrow" id="cs-active-arrow">▼</span>
        </div>
        <div id="cs-active" class="client-section-body">
          <div class="table-wrap"><table>${thead}<tbody>${clientsRowsFor(activos)}</tbody></table></div>
        </div>
      </div>
      <div class="client-section" style="margin-top:12px">
        <div class="client-section-hdr" onclick="toggleClientSection('cs-pending')" style="background:rgba(196,136,42,0.06);border-color:rgba(196,136,42,0.15)">
          <span>Pendientes / Vencidos <span class="badge ba" style="margin-left:6px">${pendientes.length+vencidos.length}</span></span>
          <span class="client-section-arrow" id="cs-pending-arrow">▼</span>
        </div>
        <div id="cs-pending" class="client-section-body">
          <div class="table-wrap"><table>${thead}<tbody>${clientsRowsFor([...pendientes,...vencidos])}</tbody></table></div>
        </div>
      </div>
      <div class="client-section" style="margin-top:12px">
        <div class="client-section-hdr" onclick="toggleClientSection('cs-inactive')" style="background:rgba(255,255,255,0.02);border-color:rgba(255,255,255,0.05)">
          <span style="color:var(--text3)">Inactivos <span class="badge bgy" style="margin-left:6px">${inactivos.length}</span></span>
          <span class="client-section-arrow" id="cs-inactive-arrow">▶</span>
        </div>
        <div id="cs-inactive" class="client-section-body" style="display:none">
          <div class="table-wrap"><table>${thead}<tbody>${clientsRowsFor(inactivos)}</tbody></table></div>
        </div>
      </div>`;
  }
  renderCuotas();
}
function _onClientsMesChange(val){
  renderClients();
}
function toggleClientSection(id){
  const body=document.getElementById(id);
  const arrow=document.getElementById(id+'-arrow');
  if(!body) return;
  const open=body.style.display!=='none';
  body.style.display=open?'none':'block';
  if(arrow) arrow.textContent=open?'▶':'▼';
}
function toggleClientCuotaSection(val){
  const cuotaSec=document.getElementById('cl-cuota-section');
  const enableRow=document.getElementById('cl-enable-cuotas-row');
  const proxpagoRow=document.getElementById('cl-proxpago-row');
  const enableChk=document.getElementById('cl-enable-cuotas');
  if(cuotaSec) cuotaSec.style.display='none';
  if(enableRow) enableRow.style.display='none';
  if(proxpagoRow) proxpagoRow.style.display='none';
  if(enableChk) enableChk.checked=false;
  if(val==='Cuotas'){
    if(cuotaSec) cuotaSec.style.display='block';
    if(proxpagoRow) proxpagoRow.style.display='block';
  } else if(val==='Seña'){
    if(proxpagoRow) proxpagoRow.style.display='block';
  } else if(['RESELL','UPSELL','DOWNSELL'].includes(val)){
    if(enableRow) enableRow.style.display='block';
  }
  // PIF: todo oculto
}
function toggleClientEnableCuotas(checked){
  const cuotaSec=document.getElementById('cl-cuota-section');
  const proxpagoRow=document.getElementById('cl-proxpago-row');
  if(cuotaSec) cuotaSec.style.display=checked?'block':'none';
  if(proxpagoRow) proxpagoRow.style.display=checked?'block':'none';
}
function _clUpdateFin(){
  const inicio=document.getElementById('cl-inicio')?.value;
  const programa=parseInt(document.getElementById('cl-programa')?.value)||0;
  const finEl=document.getElementById('cl-fin');
  if(!finEl||!inicio||!programa) return;
  const d=new Date(inicio+'T00:00:00');
  d.setMonth(d.getMonth()+programa);
  finEl.value=d.toISOString().slice(0,10);
}
function _previewClientComprobanteImg(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{const prev=document.getElementById('cl-comprobante-preview');if(prev){prev.src=e.target.result;prev.style.display='block';}};
  reader.readAsDataURL(file);
}
async function saveClient(){
  const nombre=(document.getElementById('cl-nombre')?.value||'').trim();
  const instagram=(document.getElementById('cl-instagram')?.value||'').replace(/^@/,'').toLowerCase();
  const pp=document.getElementById('cl-pp')?.value||'PIF';
  const cash=parseFloat(document.getElementById('cl-cash')?.value)||0;
  const programa=parseInt(document.getElementById('cl-programa')?.value)||0;
  const estado=document.getElementById('cl-estado')?.value||'Al día';
  const inicio=document.getElementById('cl-inicio')?.value||null;
  const proxpago=document.getElementById('cl-proxpago')?.value||null;
  const proxpaso=(document.getElementById('cl-proxpaso')?.value||'Onboarding').trim();
  const comprobante=document.getElementById('cl-comprobante')?.value||'';
  // Calcular fin según programa si no se especificó
  let fin=document.getElementById('cl-fin')?.value||null;
  if(!fin && inicio && programa){
    const d=new Date(inicio+'T00:00:00');
    d.setMonth(d.getMonth()+programa);
    fin=d.toISOString().slice(0,10);
  }
  if(!nombre){toast('Ingresá el nombre del cliente');return;}
  const payload={
    nombre,instagram,inicio,fin,tipo_pago:pp,cash_collected:cash,
    comprobante,estado,pp,proxpaso,proxpago,
    programa:programa||null,
  };
  let apiId=null;
  try{
    const res=await apiFetch(`${API_URL}/clientes`,{method:'POST',body:JSON.stringify(payload)});
    if(res.ok){
      const d=await res.json().catch(()=>({}));
      apiId=d?.id||null;
    } else {
      const b=await res.text().catch(()=>'');
      console.error('[saveClient] POST /clientes respondió',res.status,b);
      toast('Error al guardar cliente: '+res.status);
      return;
    }
  }catch(e){
    console.error('[saveClient]',e.message);
    toast('Error de conexión al guardar cliente');
    return;
  }
  const nc={id:apiId||uid(),nombre,instagram,inicio,fin,pp,proxpago,estado,proxpaso,comprobante,cash_collected:cash,programa};
  S.clients.push(nc);save('clients');
  // Registrar ingreso si hay monto cobrado
  if(cash>0){
    const ing={concepto:'Venta Nueva',tipo:pp,tipoPago:pp,nombre,usd:cash,ars:0,eur:0,
      fecha:new Date().toISOString().slice(0,10),origen:'manual',instagram,
      clienteId:nc.id,clienteNombre:nombre};
    try{
      const r2=await apiFetch(`${API_URL}/ingresos`,{method:'POST',body:JSON.stringify(ing)});
      if(r2.ok){const d2=await r2.json().catch(()=>({}));ing.id=d2.id||uid();}
    }catch(e){}
    S.ing.push(ing);save('ing');
  }
  if(pp==='Cuotas'){
    const nCuotas=parseInt(document.getElementById('cl-nro-cuotas')?.value)||2;
    generarCuotasCliente(nc,nCuotas);
  }
  playCashSound();closeModal('modal-client');renderClients();renderDash();toast('Cliente guardado ✓');
}
async function delClient(id){
  if(!confirm('¿Eliminar?'))return;
  const i=S.clients.findIndex(x=>String(x.id)===String(id));
  const c=i>=0?S.clients[i]:null;
  try{
    const r=await apiFetch(`${API_URL}/clientes/${id}`,{method:'DELETE'});
    if(!r.ok) throw new Error();
  }catch(e){toast('✗ Error al eliminar cliente');return;}
  if(c){
    S.cuotas=(S.cuotas||[]).filter(q=>String(q.clienteId)!==String(c.id));
    save('cuotas');
    const ig=(c.instagram||'').toLowerCase();
    const toDelIng=S.ing.filter(x=>(x.concepto==='Venta Nueva'&&ig&&(x.instagram||'').toLowerCase()===ig)||(x.origen==='cuota'&&String(x.clienteId||x.ref_cliente_id)===String(c.id)));
    for(const x of toDelIng){try{await apiFetch(`${API_URL}/ingresos/${x.id}`,{method:'DELETE'});}catch(e){}}
    S.ing=S.ing.filter(x=>!toDelIng.includes(x));
    save('ing');
  }
  if(i>=0){S.clients.splice(i,1);save('clients');}
  _renderMoneyCounters();renderClients();renderFin();
}

function generarCuotasCliente(nc, n, montoEstimado=0){
  if((S.cuotas||[]).some(c=>String(c.clienteId)===String(nc.id))){return;}
  const base=nc.inicio?new Date(nc.inicio+'T00:00:00'):new Date();
  for(let i=0;i<n;i++){
    const f=new Date(base);
    f.setMonth(f.getMonth()+i);
    const cuota={id:uid(),clienteId:String(nc.id),clienteNombre:nc.nombre,clienteIg:nc.instagram||'',numero:i+2,fecha:f.toISOString().slice(0,10),monto:montoEstimado,pagado:false};
    S.cuotas.push(cuota);
    apiFetch(`${API_URL}/cuotas`,{method:'POST',body:JSON.stringify({id:cuota.id,ref_cliente_id:cuota.clienteId,cliente_nombre:cuota.clienteNombre,cliente_ig:cuota.clienteIg,numero:cuota.numero,fecha:cuota.fecha,monto:montoEstimado,pagado:false})})
      .then(r=>r.ok?r.json():null)
      .then(d=>{if(d?.id&&d.id!==cuota.id){const f=S.cuotas.find(x=>x.id===cuota.id);if(f){f.id=d.id;save('cuotas');}}})
      .catch(()=>{});
  }
  save('cuotas');
}

function renderCuotas(){
  const el=document.getElementById('clients-cuotas-section');
  if(!el)return;
  const cuotas=S.cuotas||[];
  if(!cuotas.length){el.innerHTML='';return;}
  const hoy=new Date();hoy.setHours(0,0,0,0);
  const rows=cuotas.map(c=>{
    const vencida=!c.pagado&&new Date(c.fecha)<hoy;
    const badge=c.pagado
      ?'<span class="badge green">Pagada</span>'
      :vencida
        ?'<span class="badge red">Vencida</span>'
        :'<span class="badge">Pendiente</span>';
    return `<tr>
      <td><input type="checkbox" ${c.pagado?'checked':''} onchange="toggleCuotaPagada('${c.id}')"></td>
      <td style="font-weight:500">${c.clienteNombre}</td>
      <td style="font-size:12px;color:var(--text2)">${c.clienteIg?'@'+c.clienteIg:'—'}</td>
      <td>Cuota ${c.numero}</td>
      <td>${c.fecha||'—'}</td>
      <td><input type="number" value="${c.monto||0}" min="0"
        style="width:80px;background:var(--bg2);border:1px solid var(--line);color:var(--text);border-radius:4px;padding:2px 6px"
        onchange="updateCuotaMonto('${c.id}',this.value)">
      </td>
      <td>${badge}</td>
      <td><button class="btn-icon" onclick="delCuota('${c.id}')" title="Eliminar cuota">×</button></td>
    </tr>`;
  }).join('');
  el.innerHTML=`<div class="section-title" style="margin-top:24px">Cuotas</div>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th></th><th>Cliente</th><th>Instagram</th><th>Cuota</th><th>Fecha</th><th>Monto</th><th>Estado</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}
function delCuota(id){
  if(!confirm('¿Eliminar esta cuota?'))return;
  S.cuotas=(S.cuotas||[]).filter(c=>c.id!==id);
  save('cuotas');
  apiFetch(`${API_URL}/cuotas/${id}`,{method:'DELETE'}).catch(()=>{});
  _renderMoneyCounters();
  renderCuotas();
}

function toggleCuotaPagada(id){
  const c=S.cuotas.find(x=>x.id===id);
  if(!c)return;
  c.pagado=!c.pagado;
  save('cuotas');
  apiFetch(`${API_URL}/cuotas/${id}`,{method:'PATCH',body:JSON.stringify({pagado:c.pagado})}).catch(()=>{});
  if(c.pagado){
    const yaExiste=S.ing.some(x=>(x.cuotaId||x.cuota_id)===c.id);
    if(!yaExiste){
      const ingItem={id:uid(),concepto:'Cuota',tipo:'Cuota',clienteId:c.clienteId,clienteNombre:c.clienteNombre,usd:c.monto,ars:0,eur:0,fecha:new Date().toISOString().slice(0,10),origen:'cuota',cuotaId:c.id};
      S.ing.push(ingItem);save('ing');
      apiFetch(`${API_URL}/ingresos`,{method:'POST',body:JSON.stringify(ingItem)}).then(r=>r.ok?r.json():null).then(d=>{if(d?.id){const f=S.ing.find(x=>x.id===ingItem.id);if(f){f.id=d.id;save('ing');}}}).catch(()=>{});
    }
  } else {
    const toRemove=S.ing.filter(x=>(x.cuotaId||x.cuota_id)===c.id);
    for(const x of toRemove){apiFetch(`${API_URL}/ingresos/${x.id}`,{method:'DELETE'}).catch(()=>{});}
    S.ing=S.ing.filter(x=>(x.cuotaId||x.cuota_id)!==c.id);
    c.cash_collected=0;
    save('ing');save('cuotas');
  }
  renderDash();
  renderFin();
  renderCuotas();
  renderClients();
  _renderMoneyCounters();
}

function _toggleOrCreateCuota(clientId,numero,val){
  const _cid=String(clientId);
  const wantPagado=(val==='pago');
  let cuota=(S.cuotas||[]).find(c=>String(c.clienteId)===_cid&&c.numero===numero);
  if(!cuota){
    const client=S.clients.find(c=>String(c.id)===_cid);
    if(!client) return;
    cuota={id:uid(),clienteId:_cid,clienteNombre:client.nombre,clienteIg:client.instagram||'',numero,fecha:new Date().toISOString().slice(0,10),monto:0,pagado:false};
    if(!S.cuotas) S.cuotas=[];
    S.cuotas.push(cuota);
    save('cuotas');
    apiFetch(`${API_URL}/cuotas`,{method:'POST',body:JSON.stringify({id:cuota.id,ref_cliente_id:cuota.clienteId,cliente_nombre:cuota.clienteNombre,cliente_ig:cuota.clienteIg,numero:cuota.numero,fecha:cuota.fecha,monto:0,pagado:false})}).catch(()=>{});
  }
  if(val!==undefined&&cuota.pagado===wantPagado) return;
  toggleCuotaPagada(cuota.id);
}


function getCashCollected(filterFn){
  const fromClients=(S.clients||[]).reduce((a,c)=>{
    if(filterFn&&!filterFn(c.inicio))return a;
    return a+(+c.cash_collected||0);
  },0);
  const fromCuotas=(S.cuotas||[]).reduce((a,c)=>{
    if(filterFn&&!filterFn(c.fecha))return a;
    return a+(+c.cash_collected||0);
  },0);
  return fromClients+fromCuotas;
}
function updateClientCC(id,val){
  const c=S.clients.find(x=>x.id===id);
  if(!c)return;
  c.cash_collected=+val||0;
  save('clients');
  apiFetch(`${API_URL}/clientes/${id}`,{method:'PATCH',body:JSON.stringify({cash_collected:+val||0})}).catch(()=>{});
  _renderMoneyCounters();renderDash();renderFin();
}
function updateCuotaCC(id,val){
  const c=(S.cuotas||[]).find(x=>x.id===id);
  if(!c)return;
  c.cash_collected=+val||0;
  save('cuotas');
  apiFetch(`${API_URL}/cuotas/${id}`,{method:'PATCH',body:JSON.stringify({cash_collected:c.cash_collected})}).catch(()=>{});
  _renderMoneyCounters();renderDash();renderFin();renderClients();
}
function updateCuotaMonto(id,val){
  const c=(S.cuotas||[]).find(x=>x.id===id);
  if(!c)return;
  c.monto=+val||0;
  save('cuotas');
  apiFetch(`${API_URL}/cuotas/${id}`,{method:'PATCH',body:JSON.stringify({monto:c.monto})}).catch(()=>{});
  _syncCuotasCounter();
}
function getCuotasMetrics(){
  const totalCobrado      =S.clients.reduce((a,c)=>a+(+c.cash_collected||0),0);
  const ingVentas         =S.ing.filter(x=>x.concepto==='Venta Nueva').reduce((a,x)=>a+(+x.usd||0),0);
  const cuotasUnpaid      =(S.cuotas||[]).filter(c=>!c.pagado);
  const cuotasPendientes  =new Set(cuotasUnpaid.map(c=>c.clienteId)).size;
  const dineroCobrar      =cuotasUnpaid.reduce((a,c)=>a+(+c.monto||0),0);
  const cobradoCuotas     =(S.ing||[]).filter(x=>x.origen==='cuota').reduce((a,x)=>a+(+x.usd||0),0);
  const cobradoEste       =(S.ing||[]).filter(x=>x.origen==='cuota'&&_gfInRange(x.fecha)).reduce((a,x)=>a+(+x.usd||0),0);
  const cobradoPrev       =(S.ing||[]).filter(x=>x.origen==='cuota'&&_gfPrevInRange(x.fecha)).reduce((a,x)=>a+(+x.usd||0),0);
  const pctCobranza       =(cobradoCuotas+dineroCobrar)>0?Math.round(cobradoCuotas/(cobradoCuotas+dineroCobrar)*100):0;
  return {totalCobrado,ingVentas,cuotasPendientes,dineroCobrar,cobradoCuotas,cobradoEste,cobradoPrev,pctCobranza};
}



function _renderMoneyCounters(){
  const el=document.getElementById('clients-money-counters');
  if(!el)return;
  const m=getCuotasMetrics();
  const cc=(label,val,cls='',delta='')=>{
    const dHtml=delta?`<div class="metric-delta ${delta.startsWith('+')?'up':'down'}" style="font-size:10px">${delta} vs anterior</div>`:'';
    return `<div class="metric-card" style="padding:8px 12px;min-width:0">
      <div class="metric-label" style="font-size:10px;margin-bottom:2px">${label}</div>
      <div class="metric-value ${cls}" style="font-size:15px">${val}</div>${dHtml}</div>`;
  };
  el.style.cssText='margin-bottom:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;';
  el.innerHTML=
    cc('Clientes con cuotas',m.cuotasPendientes)+
    cc('Dinero a cobrar en cuotas',fmtMoney(m.dineroCobrar),m.dineroCobrar>0?'red':'')+
    cc('Cobrado por cuotas',fmtMoney(m.cobradoCuotas),'green',_delta(m.cobradoEste,m.cobradoPrev))+
    cc('% Cobranza',m.pctCobranza+'%',m.pctCobranza>=80?'green':m.pctCobranza>=50?'':'red')+
    `<button onclick="sincronizarCuotas()" class="btn btn-outline" style="font-size:11px;padding:5px 12px;margin-left:4px" title="Generar cuotas faltantes para clientes existentes">🔄 Sincronizar cuotas</button>`;
}

function getCallsMetrics(shows,closes,calls,usePrev=false){
  const filterFn=usePrev?_gfPrevInRange:_gfInRange;
  const showRate      =calls>0  ?Math.round(shows/calls*100)  :0;
  const closeRate     =calls>0  ?Math.round(closes/calls*100) :0;
  const closeShowRate =shows>0  ?Math.round(closes/shows*100) :0;
  const facturacion   =S.ing.filter(x=>filterFn(x.fecha)&&x.concepto==='Venta Nueva').reduce((a,x)=>a+(+x.usd||0),0);
  const cobradoCuotas =S.ing.filter(x=>filterFn(x.fecha)&&x.origen==='cuota').reduce((a,x)=>a+(+x.usd||0),0);
  const cashCollected =getCashCollected(filterFn);
  const noCerradas    =Math.max(0,shows-closes);
  const aov           =closes>0 ?facturacion/closes:0;
  const cashPorAgenda =calls>0  ?facturacion/calls:0;
  const cashPorShow   =shows>0  ?facturacion/shows:0;
  return {showRate,closeRate,closeShowRate,facturacion,cobradoCuotas,cashCollected,noCerradas,aov,cashPorAgenda,cashPorShow};
}

function _renderCallsMetrics2(shows,closes,calls){
  const el=document.getElementById('calls-metrics2');
  if(!el)return;
  const m=getCallsMetrics(shows,closes,calls);
  const prevCalls=callsCache.filter(c=>_gfPrevInRange(c.created_at));
  const pShows=prevCalls.filter(c=>c.estado!=='No asistió'&&c.estado!=='Cancelada'&&c.estado!=='Re agenda').length;
  const pCloses=prevCalls.filter(c=>['Cierre','Cierre Cuotas'].includes(c.estado||'')).length;
  const mp=getCallsMetrics(pShows,pCloses,prevCalls.length,true);
  el.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px';
  el.innerHTML=
    metCardSm('Show rate',m.showRate+'%',m.showRate>=70?'green':m.showRate>=50?'':'red',_delta(m.showRate,mp.showRate))+
    metCardSm('Close rate',m.closeRate+'%',m.closeRate>=30?'green':m.closeRate>=15?'':'red',_delta(m.closeRate,mp.closeRate))+
    metCardSm('Close/Shows',m.closeShowRate+'%',m.closeShowRate>=40?'green':m.closeShowRate>=20?'':'red',_delta(m.closeShowRate,mp.closeShowRate))+
    metCardSm('Facturación',fmtMoney(m.facturacion),'green',_delta(m.facturacion,mp.facturacion))+
    metCardSm('Cobrado cuotas',fmtMoney(m.cobradoCuotas),'green',_delta(m.cobradoCuotas,mp.cobradoCuotas))+
    metCardSm('Cash Collected',fmtMoney(m.cashCollected),'green',_delta(m.cashCollected,mp.cashCollected))+
    metCardSm('AOV',fmtMoney(m.aov),'',_delta(m.aov,mp.aov))+
    metCardSm('Cash/Agenda',fmtMoney(m.cashPorAgenda),'',_delta(m.cashPorAgenda,mp.cashPorAgenda))+
    metCardSm('Cash/Show',fmtMoney(m.cashPorShow),'',_delta(m.cashPorShow,mp.cashPorShow));
}

function _syncCuotasCounter(){
  _renderMoneyCounters();
}

function abrirEditCliente(id){
  const c=S.clients.find(x=>x.id===id);
  if(!c){toast('Cliente no encontrado');return;}
  document.getElementById('ec-cli-id').value=id;
  document.getElementById('ec-cli-nombre').value=c.nombre||'';
  document.getElementById('ec-cli-instagram').value=c.instagram||'';
  document.getElementById('ec-cli-inicio').value=c.inicio||'';
  document.getElementById('ec-cli-fin').value=c.fin||'';
  document.getElementById('ec-cli-estado').value=c.estado||'Al día';
  document.getElementById('ec-cli-proxpaso').value=c.proxpaso||'';
  document.getElementById('modal-edit-cliente').classList.add('open');
}

async function saveEditCliente(){
  const id=document.getElementById('ec-cli-id').value;
  const c=S.clients.find(x=>x.id===id);
  if(!c){toast('Cliente no encontrado');return;}
  const cambios={
    nombre:   document.getElementById('ec-cli-nombre').value.trim(),
    instagram:document.getElementById('ec-cli-instagram').value.trim().replace(/^@/,'').toLowerCase(),
    inicio:   document.getElementById('ec-cli-inicio').value,
    fin:      document.getElementById('ec-cli-fin').value,
    estado:   document.getElementById('ec-cli-estado').value,
    proxpaso: document.getElementById('ec-cli-proxpaso').value.trim(),
  };
  if(!cambios.nombre){toast('⚠ Nombre obligatorio');return;}
  Object.assign(c,cambios);
  save('clients');
  try{
    const res=await apiFetch(`${API_URL}/clientes/${id}`,{method:'PATCH',body:JSON.stringify(cambios)});
    if(!res.ok) console.warn('[saveEditCliente] HTTP',res.status);
  }catch(e){console.warn('[saveEditCliente]',e.message);}
  closeModal('modal-edit-cliente');
  renderClients();
  toast('Cliente actualizado ✓');
}

// ========== FINANZAS ==========
function renderFin(){
  const ing  =S.ing.filter(x=>_gfInRange(x.fecha));
  const gas  =S.gas.filter(x=>_gfInRange(x.fecha));
  const ingP =S.ing.filter(x=>_gfPrevInRange(x.fecha));
  const gasP =S.gas.filter(x=>_gfPrevInRange(x.fecha));
  const totalIng =ing.reduce((a,x)=>a+(+x.usd||0),0);
  const totalGas =gas.reduce((a,x)=>a+(+x.usd||0),0);
  const totalIngP=ingP.reduce((a,x)=>a+(+x.usd||0),0);
  const totalGasP=gasP.reduce((a,x)=>a+(+x.usd||0),0);
  const finCC=getCashCollected(_gfInRange), finCCP=getCashCollected(_gfPrevInRange);
  const ganancia =finCC-totalGas;
  const gananciaP=finCCP-totalGasP;
  const margen   =finCC>0?((ganancia/finCC)*100).toFixed(1):0;


  document.getElementById('fin-metrics').innerHTML=
    metCard('Ingresos',fmtMoney(totalIng),'green',_delta(totalIng,totalIngP))+
    metCard('Egresos',fmtMoney(totalGas),'red',_delta(totalGas,totalGasP))+
    metCard('Cash Collected',fmtMoney(finCC),'green',_delta(finCC,finCCP))+
    metCard('Balance Neto',fmtMoney(ganancia),ganancia>=0?'green':'red',_delta(ganancia,gananciaP))+
    metCard('Margen',margen+'%',+margen>=30?'green':+margen>=15?'':'red')+
    '';

  document.getElementById('ing-table').innerHTML=ing.map(x=>{
    let cc=null;
    if(x.concepto==='Venta Nueva'&&x.instagram){
      const cli=S.clients.find(c=>(c.instagram||'').toLowerCase()===(x.instagram||'').toLowerCase());
      if(cli&&(+cli.cash_collected||0)>0) cc=+cli.cash_collected;
    } else if(x.origen==='cuota'&&x.cuotaId){
      const cuota=(S.cuotas||[]).find(c=>c.id===x.cuotaId);
      if(cuota&&(+cuota.cash_collected||0)>0) cc=+cuota.cash_collected;
    }
    const ccCell=cc!=null?`<td style="color:var(--gold-light);font-weight:600">${fmtMoney(cc)}</td>`:`<td style="color:var(--text3)">—</td>`;
    const nombreIng=x.nombre||x.clienteNombre||(x.instagram?S.clients.find(c=>(c.instagram||'').toLowerCase()===(x.instagram||'').toLowerCase())?.nombre:null)||'—';
    return `<tr>
      <td style="color:var(--text)">${x.tipoPago||x.concepto||'—'}</td>
      <td style="color:var(--text2);font-size:12px">${nombreIng}<button class="btn-icon" onclick="editIngNombre('${x.id}')" style="font-size:11px;margin-left:4px" title="Editar nombre">✏</button></td>
      <td>${x.fecha||'—'}</td>
      <td style="color:var(--gold-light)">${fmtMoney(+x.usd||0)}</td>
      ${ccCell}
      <td><span class="badge bgr">${x.tipoPago||x.tipo||'—'}</span></td>
      <td><button class="btn-icon" onclick="delIng('${x.id}')">×</button></td>
    </tr>`;
  }).join('')||'<tr><td colspan="7" style="color:var(--text3);text-align:center;padding:20px">Sin ingresos</td></tr>';

  document.getElementById('gas-table').innerHTML=gas.map(x=>`
    <tr>
      <td style="color:var(--text)">${x.concepto||'—'}</td>
      <td>${x.fecha||'—'}</td>
      <td style="color:#d46060">${fmtMoney(+x.usd||0)}</td>
      <td><span class="badge br">${x.tipo||'—'}</span></td>
      <td><button class="btn-icon" onclick="delGas('${x.id}')">×</button></td>
    </tr>`).join('')||'<tr><td colspan="5" style="color:var(--text3);text-align:center;padding:20px">Sin egresos</td></tr>';

  renderRenovaciones();
  renderActivityLog();
  _renderFinAnnualChart();
}

let _finAnnualChart=null;
function _renderFinAnnualChart(){
  const canvas=document.getElementById('fin-annual-chart');
  if(!canvas)return;
  if(_finAnnualChart){_finAnnualChart.destroy();_finAnnualChart=null;}
  const yr=new Date().getFullYear();
  const meses=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const ingPerMonth=meses.map((_,m)=>S.ing.filter(x=>{const d=new Date(x.fecha);return d.getFullYear()===yr&&d.getMonth()===m;}).reduce((a,x)=>a+(+x.usd||0),0));
  const gasPerMonth=meses.map((_,m)=>S.gas.filter(x=>{const d=new Date(x.fecha);return d.getFullYear()===yr&&d.getMonth()===m;}).reduce((a,x)=>a+(+x.usd||0),0));
  _finAnnualChart=new Chart(canvas,{
    type:'bar',
    data:{labels:meses,datasets:[
      {label:'Ingresos',data:ingPerMonth,backgroundColor:'rgba(61,138,90,.45)',borderColor:'rgba(61,138,90,.9)',borderWidth:1,borderRadius:4},
      {label:'Egresos',data:gasPerMonth,backgroundColor:'rgba(184,72,72,.45)',borderColor:'rgba(184,72,72,.9)',borderWidth:1,borderRadius:4},
    ]},
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'rgba(232,230,222,.5)',font:{family:'Inter',size:11}}}},
      scales:{
        x:{grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'rgba(122,120,112,.8)',font:{size:10}}},
        y:{beginAtZero:true,grid:{color:'rgba(255,255,255,.03)'},ticks:{color:'rgba(122,120,112,.8)',font:{size:10}}},
      },
    },
  });
}

async function saveIng(){
  const item={
    id:uid(),concepto:v('i-concepto'),fecha:v('i-fecha'),
    nombre:document.getElementById('i-nombre')?.value?.trim()||'',
    tipoPago:v('i-tipo'),tipo:v('i-tipo'),
    usd:+v('i-usd')||0,ars:0,eur:0,
    cash_collected:parseFloat(document.getElementById('i-cash')?.value)||0,
  };
  try{const res=await apiFetch(`${API_URL}/ingresos`,{method:'POST',body:JSON.stringify(item)});if(res.ok){const d=await res.json().catch(()=>({}));if(d?.id)item.id=d.id;}}catch(e){console.warn('[saveIng]',e.message);}
  S.ing.push(item);save('ing');closeModal('modal-ing');renderFin();toast('Ingreso guardado ✓');
}
async function saveGas(){
  const item={id:uid(),concepto:v('g-concepto'),fecha:v('g-fecha'),usd:+v('g-usd')||0,ars:0,eur:0};
  try{const res=await apiFetch(`${API_URL}/egresos`,{method:'POST',body:JSON.stringify(item)});if(res.ok){const d=await res.json().catch(()=>({}));if(d?.id)item.id=d.id;}}catch(e){console.warn('[saveGas]',e.message);}
  S.gas.push(item);save('gas');closeModal('modal-gas');renderFin();toast('Egreso guardado ✓');
}
async function delIng(id){if(!confirm('¿Eliminar?'))return;try{const r=await apiFetch(`${API_URL}/ingresos/${id}`,{method:'DELETE'});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al eliminar');return;}S.ing=S.ing.filter(x=>x.id!==id);save('ing');renderFin();}
async function delGas(id){if(!confirm('¿Eliminar?'))return;try{const r=await apiFetch(`${API_URL}/egresos/${id}`,{method:'DELETE'});if(!r.ok)throw new Error();}catch(e){toast('✗ Error al eliminar');return;}S.gas=S.gas.filter(x=>x.id!==id);save('gas');renderFin();}
function editIngNombre(id){
  const x=S.ing.find(x=>x.id===id);if(!x)return;
  const nuevo=prompt('Nombre:',x.nombre||x.clienteNombre||'');
  if(nuevo===null)return;
  x.nombre=nuevo.trim();
  save('ing');
  apiFetch(`${API_URL}/ingresos/${id}`,{method:'PATCH',body:JSON.stringify({nombre:nuevo.trim()})}).catch(()=>{});
  renderFin();
}

// ========== EXPORT / IMPORT ==========
function renderExp(){
  const total=[
    {label:'Tareas',n:S.tasks.reduce((a,f)=>a+f.tasks.length,0)},
    {label:'Contenido',n:S.content.length},
    {label:'Historias',n:S.hists.length},
    {label:'Referentes',n:S.refs.length},
    {label:'Métricas',n:S.mets.length},
    {label:'Leads',n:leadsCache.length},
    {label:'Clientes',n:S.clients.length},
    {label:'Ingresos',n:S.ing.length},
    {label:'Egresos',n:S.gas.length},
    {label:'Ángulos',n:S.angulos.length},
  ];
  document.getElementById('exp-stats').innerHTML=total.map(x=>`
    <div class="export-stat">
      <div class="export-stat-num">${x.n}</div>
      <div class="export-stat-label">${x.label}</div>
    </div>
  `).join('');
}
function exportData(){
  const KEYS=getKeys();
  const data={};Object.entries(KEYS).forEach(([k,key])=>{data[key]=S[k];});
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  const d=new Date().toISOString().slice(0,10);
  a.download=`crm-backup-${d}.json`;a.click();
  toast('Backup exportado ✓ (Leads en Supabase — no incluidos en backup local)');
}
function importData(inp){
  const file=inp.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=e=>{
    try{
      const KEYS=getKeys();
      const data=JSON.parse(e.target.result);
      Object.entries(KEYS).forEach(([k,key])=>{if(data[key]!==undefined){S[k]=data[key];sv(key,data[key]);}});
      toast('Datos importados ✓');renderExp();
    }catch{toast('Error al importar el archivo');}
  };
  r.readAsText(file);
  inp.value='';
}

// ========== AUTH & ROLES ==========
let currentUser     = null;
let currentUserRole = 'setter';
let callsCache      = window.callsCache = [];

const ROLE_PAGES = {
  admin:  ['dash','acc','found','cont','ang','ref','leads','calls','clients','fin','ig','equipo'],
  closer: ['dash','acc','leads','calls'],
  setter: ['dash','acc','leads','calls'],
};
const ROLE_ALLOWED = {
  admin:          ['dash','acc','found','cont','ang','ref','leads','funnel','calls','clients','fin','ig','formatos','lab','equipo','forms'],
  closer:         ['dash','acc','leads','funnel','calls'],
  setter:         ['dash','acc','leads','funnel','calls'],
  content:        ['acc','found','cont','ang','ref','ig','formatos','lab'],
  closer_content: ['dash','acc','found','cont','ang','ref','leads','funnel','calls','clients','ig','formatos','lab','forms'],
};

const TASKS_ALLOWED_EMAILS = [
  'maurooo.aguirre0101@gmail.com',
  'tomasfernandezhuguenine@gmail.com',
  'lopezvalen.biz@gmail.com',
];

function getAuthHeaders(){
  return {
    'Content-Type': 'application/json',
    'x-cliente-id': localStorage.getItem('clienteSeleccionado')||'',
    'x-user-email': localStorage.getItem('userEmail')||currentUser?.email||'',
  };
}

function _getClientes(){
  try{ return JSON.parse(localStorage.getItem('clientes')||'[]'); }catch{ return []; }
}
function _getClienteSeleccionado(){
  return localStorage.getItem('clienteSeleccionado')||'';
}

const _ALIASES_KEY='crm_client_aliases';
const _CID_HIDDEN_KEY='crm_cid_hidden';
function _getAliases(){try{return JSON.parse(localStorage.getItem(_ALIASES_KEY)||'{}')}catch{return {}}}
function _saveAlias(cid,alias){const a=_getAliases();if(alias)a[cid]=alias;else delete a[cid];localStorage.setItem(_ALIASES_KEY,JSON.stringify(a));}
function _isCidHidden(){return localStorage.getItem(_CID_HIDDEN_KEY)==='1';}
function _toggleCidHidden(){localStorage.setItem(_CID_HIDDEN_KEY,_isCidHidden()?'0':'1');renderClienteSelector();}
function _displayName(cid,role){
  const aliases=_getAliases();
  const alias=aliases[cid];
  const roleStr=role?` (${role})`:'';
  if(alias){
    return _isCidHidden()?alias:`${alias} · ${cid}${roleStr}`;
  }
  return `${cid}${roleStr}`;
}

function editClienteAlias(){
  const cid=_getClienteSeleccionado();
  if(!cid) return;
  const actual=_getAliases()[cid]||'';
  const nuevo=prompt(`Apodo para ${cid}:\n(Dejá vacío para quitar el apodo)`,actual);
  if(nuevo===null) return;
  _saveAlias(cid,nuevo.trim());
  renderClienteSelector();
}

const _eyeOpen=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const _eyeOff=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

function renderClienteSelector(){
  const clientes=_getClientes();
  const selected=_getClienteSeleccionado();
  const wrap=document.getElementById('cliente-selector-wrap');
  const sel=document.getElementById('cliente-selector');
  if(!wrap||!sel) return;
  if(clientes.length===0){ wrap.style.display='none'; return; }
  const hasHolding=clientes.some(c=>c.cliente_id==='holding');
  const normalClients=clientes.filter(c=>c.cliente_id!=='holding');
  sel.innerHTML=normalClients.map(c=>`
    <option value="${c.cliente_id}" ${c.cliente_id===selected?'selected':''}>
      ${_displayName(c.cliente_id,c.role)}
    </option>`).join('')+
    (hasHolding?`<option value="holding" ${selected==='holding'?'selected':''}>🏢 Holding</option>`:'');

  // Botón editar apodo
  let btnEdit=document.getElementById('cs-alias-btn');
  if(!btnEdit){
    btnEdit=document.createElement('button');
    btnEdit.id='cs-alias-btn';
    btnEdit.title='Editar apodo';
    btnEdit.onclick=editClienteAlias;
    btnEdit.style.cssText='background:none;border:none;cursor:pointer;color:var(--text3);font-size:13px;padding:2px 4px;line-height:1;flex-shrink:0';
    btnEdit.textContent='✎';
    wrap.appendChild(btnEdit);
  }

  // Botón ojo — solo visible si el cliente seleccionado tiene apodo
  const hasAlias=!!(_getAliases()[selected]);
  let btnEye=document.getElementById('cs-eye-btn');
  if(!btnEye){
    btnEye=document.createElement('button');
    btnEye.id='cs-eye-btn';
    btnEye.onclick=_toggleCidHidden;
    btnEye.style.cssText='background:none;border:none;cursor:pointer;padding:2px 4px;line-height:1;flex-shrink:0;display:flex;align-items:center;';
    wrap.appendChild(btnEye);
  }
  if(hasAlias){
    const hidden=_isCidHidden();
    btnEye.style.display='flex';
    btnEye.title=hidden?'Mostrar ID del cliente':'Ocultar ID del cliente';
    btnEye.style.color=hidden?'var(--text3)':'var(--gold)';
    btnEye.innerHTML=hidden?_eyeOff:_eyeOpen;
  } else {
    btnEye.style.display='none';
  }

  wrap.style.display='flex';
  wrap.style.alignItems='center';
  wrap.style.gap='4px';
}

function onClienteChange(clienteId){
  if(!clienteId) return;
  localStorage.setItem('clienteSeleccionado', clienteId);
  document.body.style.transition='opacity .22s ease';
  document.body.style.opacity='0';
  setTimeout(()=>location.reload(),230);
}

async function loginRailway(email){
  try{
    const res=await fetch(`${API_URL}/login`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email}),
    });
    if(!res.ok){ console.warn('[loginRailway] status',res.status); return; }
    const data=await res.json().catch(()=>({}));
    console.log('[loginRailway] respuesta:',data);

    localStorage.setItem('userEmail', email);

    const clientes = data.clientes||
      (data.cliente_id?[{cliente_id:data.cliente_id,role:data.rol||data.role||'setter'}]:[]);
    localStorage.setItem('clientes', JSON.stringify(clientes));

    const prevSelected=_getClienteSeleccionado();
    const stillValid=clientes.some(c=>c.cliente_id===prevSelected);
    if(!stillValid && clientes.length>0){
      localStorage.setItem('clienteSeleccionado', clientes[0].cliente_id);
    }

    renderClienteSelector();
  }catch(e){ console.warn('[loginRailway]',e); }
}

async function getUser(){
  const {data:{user}} = await _sb.auth.getUser();
  return user;
}

function getUserRole(){
  const clientes = _getClientes();
  const selected = _getClienteSeleccionado();
  const found = clientes.find(c => c.cliente_id === selected);
  return found?.role || found?.rol || 'setter';
}

function toggleAuthPass(btn){
  const inp=document.getElementById('auth-pass');
  const show=inp.type==='password';
  inp.type=show?'text':'password';
  btn.innerHTML=show
    ?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    :'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

async function login(){
  const email = document.getElementById('auth-email').value.trim();
  const pass  = document.getElementById('auth-pass').value;
  const errEl = document.getElementById('auth-error');
  const btn   = document.getElementById('auth-btn');

  errEl.style.display='none';
  btn.disabled=true;
  btn.textContent='Iniciando…';

  if(!_sb){
    errEl.textContent='Error de conexión. Recargá la página e intentá de nuevo.';
    errEl.style.display='block';
    btn.disabled=false;
    btn.textContent='Iniciar sesión';
    return;
  }

  const {data,error} = await _sb.auth.signInWithPassword({email,password:pass});
  if(error){
    errEl.textContent = error.message==='Invalid login credentials'
      ? 'Email o contraseña incorrectos.' : error.message;
    errEl.style.display='block';
    btn.disabled=false;
    btn.textContent='Iniciar sesión';
    return;
  }
  await initApp(data.user);
}

async function logout(){
  if(_leadsInterval)        { clearInterval(_leadsInterval);_leadsInterval=null; }
  if(_leadsFullRefreshTimer){ clearInterval(_leadsFullRefreshTimer);_leadsFullRefreshTimer=null; }
  if(_leadsPageInterval)    { clearInterval(_leadsPageInterval);_leadsPageInterval=null; }
  _leadsLastFetchTs=null;
  await _sb.auth.signOut();
  localStorage.removeItem('userEmail');
  localStorage.removeItem('clientes');
  localStorage.removeItem('clienteSeleccionado');
  localStorage.removeItem('crm_railway_user');
  currentUser=null;currentUserRole='setter';
  _crmStarted=false;
  document.getElementById('user-header').style.display='none';
  document.getElementById('menu-screen').style.display='none';
  const btnBack=document.getElementById('btn-back-menu');
  if(btnBack) btnBack.style.display='none';
  document.getElementById('alumnos-screen').style.display='none';
  document.getElementById('auth-overlay').classList.remove('hidden');
  document.getElementById('auth-email').value='';
  const authPass=document.getElementById('auth-pass');
  authPass.value='';
  authPass.type='password';
  const eye=document.getElementById('auth-pass-eye');
  if(eye) eye.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

async function toggleUserMenu(){
  const menu = document.getElementById('user-menu');
  menu.classList.toggle('open');
  if(!menu.classList.contains('open')) return;
  const email = localStorage.getItem('userEmail') || currentUser?.email || '';
  document.getElementById('ump-name').textContent = document.getElementById('user-email-label').textContent || email || '—';
  document.getElementById('ump-email-detail').textContent = email;
  document.getElementById('ump-tasks').innerHTML = '<span style="font-size:11px;color:var(--text3)">Cargando...</span>';
  try {
    const res = await apiFetch(`${API_URL}/tasks`);
    if(res.ok){
      const tasks = await res.json();
      const mine = tasks.filter(t=>{
        try{ return JSON.parse(t.responsable||'[]').includes(email); }catch{ return t.responsable===email; }
      });
      const activas = mine.filter(t=>t.columna!=='terminado').length;
      const negocioName = _displayName(getCid()).split(' · ')[0];
      document.getElementById('ump-tasks').innerHTML =
        `<div style="width:100%">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);margin-bottom:5px">${negocioName}</div>
          <div style="display:flex;gap:6px;align-items:center">
            <span style="font-size:11px;color:var(--text3)">${mine.length} tarea${mine.length!==1?'s':''}</span>
            ${mine.length ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:rgba(224,181,74,.12);border:1px solid rgba(224,181,74,.3);color:var(--gold)">${activas} activa${activas!==1?'s':''}</span>` : ''}
          </div>
        </div>`;
    } else {
      document.getElementById('ump-tasks').innerHTML = '';
    }
  } catch {
    document.getElementById('ump-tasks').innerHTML = '';
  }
}
document.addEventListener('click',e=>{
  const menu=document.getElementById('user-menu');
  if(menu&&!e.target.closest('.user-badge')) menu.classList.remove('open');
});

function applyRolePermissions(){
  const allowed = ROLE_ALLOWED[currentUserRole]||[];
  const allPages= ['dash','acc','found','cont','ang','ref','met','leads','funnel','calls','clients','fin','ig','formatos','lab','equipo','forms'];

  allPages.forEach(pid=>{
    const navEl=document.getElementById('nav-'+pid);
    if(!navEl) return;
    const canUse=allowed.includes(pid);
    if(canUse){
      navEl.classList.remove('locked');
      navEl.style.opacity='';
      navEl.style.cursor='';
      navEl.title='';
      const lockIcon=navEl.querySelector('.nav-lock-icon');
      if(lockIcon) lockIcon.remove();
      navEl.onclick=function(){nav(pid,this);};
    } else {
      navEl.classList.add('locked');
      navEl.style.opacity='.4';
      navEl.style.cursor='not-allowed';
      navEl.title='No tenés acceso a esta sección';
      if(!navEl.querySelector('.nav-lock-icon')){
        const icon=document.createElement('span');
        icon.className='nav-lock-icon';
        icon.textContent='🔒';
        icon.style.cssText='font-size:10px;margin-left:auto;opacity:.6;flex-shrink:0';
        navEl.appendChild(icon);
      }
      navEl.onclick=function(e){
        e.stopPropagation();
        toast('🔒 No tenés acceso a esta sección');
      };
    }
  });

  const tasksSection=document.getElementById('nav-tasks-section');
  if(tasksSection){
    const email=(localStorage.getItem('userEmail')||'').toLowerCase();
    const tasksVisible=TASKS_ALLOWED_EMAILS.includes(email);
    tasksSection.style.display=tasksVisible?'':'none';
  }

  const roleColors={admin:'var(--gold)',closer:'#6090d4',setter:'#5cb87a',content:'#B890F0',closer_content:'#7B8FD4'};
  const roleLabels={admin:'admin',closer:'closer',setter:'setter',content:'content',closer_content:'closer'};
  _updateUserNickname();
  document.getElementById('user-role-label').textContent=roleLabels[currentUserRole]||currentUserRole;
  document.getElementById('user-role-label').style.color=roleColors[currentUserRole]||'var(--text2)';
  if(currentUserRole==='content'){
    setTimeout(()=>nav('cont',document.getElementById('nav-cont')),100);
  } else if(['setter','closer','closer_content'].includes(currentUserRole)){
    setTimeout(()=>nav('dash',document.getElementById('nav-dash')),100);
  }
  document.getElementById('user-header').style.display='flex';

  const thLink=document.getElementById('calls-th-link');
  if(thLink) thLink.style.display=['admin','closer','closer_content'].includes(currentUserRole)?'':'none';
  const btnNewCall=document.getElementById('btn-new-call');
  if(btnNewCall) btnNewCall.style.display=['admin','closer','closer_content'].includes(currentUserRole)?'':'none';
}

function setupAutoLogout(){
  const KEY='crm_last_activity';
  const MAX=5*24*60*60*1000;
  const last=parseInt(localStorage.getItem(KEY)||'0',10);
  if(Date.now()-last>MAX && last>0){
    _sb.auth.signOut().then(()=>location.reload());
    return;
  }
  const bump=()=>localStorage.setItem(KEY,Date.now());
  bump();
  ['click','keydown','mousemove','touchstart'].forEach(e=>
    document.addEventListener(e,bump,{passive:true}));
}

function _flattenSOP(s){ return s.data ? {id:s.id,created_at:s.created_at,...s.data} : s; }
async function fetchSOPS(){
  try{
    const res=await apiFetch(`${API_URL}/sops`);
    if(!res.ok) return;
    const data=await res.json();
    if(!Array.isArray(data)) return;
    const local=_loadSOPS();
    if(local.length>0){
      for(const s of local) await apiFetch(`${API_URL}/sops`,{method:'POST',body:JSON.stringify({link:s.link,area:s.area,detalles:s.detalles,entregables:s.entregables||''})}).catch(()=>{});
      _saveSOPS([]);
      const r2=await apiFetch(`${API_URL}/sops`);
      if(r2.ok){const d2=await r2.json();if(Array.isArray(d2))S.sops=d2.map(_flattenSOP);}
      return;
    }
    S.sops=data.map(_flattenSOP);
  }catch(e){console.warn('[fetchSOPS]',e);}
}
async function fetchFundaciones(){
  try{
    const res=await apiFetch(`${API_URL}/fundaciones`);
    if(!res.ok) return;
    const data=await res.json();
    S.found=data||{};
  }catch(e){console.warn('[fetchFundaciones]',e);}
}
async function fetchContenido(){
  try{
    const res=await apiFetch(`${API_URL}/contenido`);
    if(!res.ok) return;
    const data=await res.json();
    if(!Array.isArray(data)) return;
    S.content=data.filter(x=>!x.esHistoria);
    S.hists  =data.filter(x=> x.esHistoria);
  }catch(e){console.warn('[fetchContenido]',e);}
}
async function fetchAngulos(){
  try{
    const res=await apiFetch(`${API_URL}/angulos`);
    if(!res.ok) return;
    const data=await res.json();
    if(!Array.isArray(data)) return;
    _hiddenAngulos=new Set(data.filter(x=>x.hidden).map(x=>x.angulo));
    S.angulos=data.filter(x=>!x.hidden);
  }catch(e){console.warn('[fetchAngulos]',e);}
}
async function fetchReferentes(){
  try{
    const res=await apiFetch(`${API_URL}/referentes`);
    if(!res.ok) return;
    const data=await res.json();
    if(!Array.isArray(data)) return;
    S.refs=data;
  }catch(e){console.warn('[fetchReferentes]',e);}
}
async function fetchMetricasCloud(){
  try{
    const res=await apiFetch(`${API_URL}/metricas`);
    if(!res.ok) return;
    const data=await res.json();
    if(!Array.isArray(data)) return;
    S.mets=data;
  }catch(e){console.warn('[fetchMetricasCloud]',e);}
}
async function fetchIG(){
  try{
    const [cRes,rRes,carsRes]=await Promise.all([
      apiFetch(`${API_URL}/ig/cuenta`),
      apiFetch(`${API_URL}/ig/reels`),
      apiFetch(`${API_URL}/ig/carruseles`)
    ]);
    if(cRes.ok){
      const cuenta=await cRes.json();
      const hasCuenta=Object.keys(cuenta||{}).some(k=>cuenta[k]);
      if(!hasCuenta&&(_igData.account||_igData.followers)){
        await apiFetch(`${API_URL}/ig/cuenta`,{method:'PUT',body:JSON.stringify({account:_igData.account,followers:_igData.followers,followersGrowth:_igData.followersGrowth,watchTime:_igData.watchTime})}).catch(()=>{});
      } else if(hasCuenta){
        Object.assign(_igData,cuenta);
      }
    }
    if(rRes.ok){
      const reels=await rRes.json();
      if(reels.length===0&&_igData.reels.length>0){
        for(const r of _igData.reels) await apiFetch(`${API_URL}/ig/reels`,{method:'POST',body:JSON.stringify(r)}).catch(()=>{});
        _igData.reels=[];_saveIG();
        return fetchIG();
      }
      if(reels.length>0) _igData.reels=reels;
    }
    if(carsRes.ok){
      const cars=await carsRes.json();
      if(cars.length===0&&_igData.carruseles.length>0){
        for(const c of _igData.carruseles) await apiFetch(`${API_URL}/ig/carruseles`,{method:'POST',body:JSON.stringify(c)}).catch(()=>{});
        _igData.carruseles=[];_saveIG();
        return fetchIG();
      }
      if(cars.length>0) _igData.carruseles=cars;
    }
  }catch(e){console.warn('[fetchIG]',e);}
}

let _crmStarted = false;

function _startCRM(){
  if(_crmStarted) return;
  _crmStarted=true;
  // Clear all data before fetching so no stale localStorage from another client is ever shown
  S.found={};S.content=[];S.hists=[];S.comps=[];S.mets=[];
  S.clients=[];S.ing=[];S.gas=[];S.angulos=[];S.refs=[];
  S.cuotas=[];S.sops=[];
  leadsCache.splice(0);
  _igData=ld(_getIgKey(),_igDefaults);
  if(!Array.isArray(_igData.reels)) _igData.reels=[];
  if(!Array.isArray(_igData.carruseles)) _igData.carruseles=[];
  initCurrencyUI();
  renderDash();
  fetchLeads();
  fetchCalls();
  Promise.all([fetchClients(),fetchCuotas()]).then(_seedMissingCuotas);
  fetchIngresos();
  fetchEgresos();
  fetchActivityLog();
  fetchSOPS();
  fetchFundaciones();
  fetchContenido();
  fetchAngulos();
  fetchReferentes();
  fetchMetricasCloud();
  fetchIG();
}

function enterCRM(){
  document.getElementById('menu-screen').style.display='none';
  const btnBack=document.getElementById('btn-back-menu');
  if(btnBack) btnBack.style.display='block';
  const main=document.getElementById('main');
  if(main){main.classList.add('crm-slide-in');setTimeout(()=>main.classList.remove('crm-slide-in'),420);}
  _startCRM();
}

function backToMenu(){
  const btnBack=document.getElementById('btn-back-menu');
  if(btnBack) btnBack.style.display='none';
  document.getElementById('menu-screen').style.display='flex';
}

function enterAlumnos(){
  const iframe=document.querySelector('#alumnos-screen iframe');
  const currentCid=localStorage.getItem('clienteSeleccionado')||'';
  if(iframe && iframe.dataset.loadedFor!==currentCid){
    iframe.src=iframe.src;
    iframe.dataset.loadedFor=currentCid;
  }
  document.getElementById('menu-screen').style.display='none';
  const as=document.getElementById('alumnos-screen');
  as.style.display='flex';
  as.classList.add('section-slide-in');
  setTimeout(()=>as.classList.remove('section-slide-in'),420);
}

function exitAlumnos(){
  document.getElementById('alumnos-screen').style.display='none';
  document.getElementById('menu-screen').style.display='flex';
}

function enterHolding(){
  const iframe=document.getElementById('holding-iframe');
  if(iframe && !iframe.dataset.loaded){
    iframe.src=iframe.src;
    iframe.dataset.loaded='1';
  }
  document.getElementById('menu-screen').style.display='none';
  const hs=document.getElementById('holding-screen');
  hs.style.display='flex';
  hs.classList.add('section-slide-in');
  setTimeout(()=>hs.classList.remove('section-slide-in'),420);
}

function exitHolding(){
  document.getElementById('holding-screen').style.display='none';
  document.getElementById('menu-screen').style.display='flex';
}

async function initApp(user){
  currentUser=user;
  setupAutoLogout();

  await loginRailway(user.email).catch(()=>{});
  currentUserRole=getUserRole();
  applyRolePermissions();
  _initTeam();
  checkHoldingNotifications(user.email);

  renderClienteSelector();

  await hideSplash();
  document.getElementById('auth-overlay').classList.add('hidden');
  document.getElementById('auth-loader').classList.add('hidden');

  if(currentUserRole==='admin'){
    const selCid=_getClienteSeleccionado();
    const isHolding=selCid==='holding';
    const cardCrm=document.getElementById('menu-card-crm');
    const cardAlumnos=document.getElementById('menu-card-alumnos');
    const cardHolding=document.getElementById('menu-card-holding');
    if(cardCrm)     cardCrm.style.display    =isHolding?'none':'';
    if(cardAlumnos) cardAlumnos.style.display =isHolding?'none':'';
    if(cardHolding) cardHolding.style.display =isHolding?'':'none';
    document.getElementById('menu-screen').style.display='flex';
    _checkNicknamePrompt();
    return;
  }

  if(currentUserRole==='closer_content'){
    const cardCrm=document.getElementById('menu-card-crm');
    const cardAlumnos=document.getElementById('menu-card-alumnos');
    const cardHolding=document.getElementById('menu-card-holding');
    if(cardCrm)     cardCrm.style.display    ='';
    if(cardAlumnos) cardAlumnos.style.display ='';
    if(cardHolding) cardHolding.style.display ='none';
    document.getElementById('menu-screen').style.display='flex';
    _checkNicknamePrompt();
    return;
  }

  _startCRM();
  _checkNicknamePrompt();
}

(async()=>{
  setSplashName(localStorage.getItem('userEmail')||'');
  const user=await getUser();
  if(user){
    setSplashName(user.email);
    await initApp(user);
  } else {
    await hideSplash();
    document.getElementById('auth-loader').classList.add('hidden');
    document.getElementById('auth-overlay').classList.remove('hidden');
  }
})();

// ========== LLAMADAS ==========
const CALL_ESTADOS = ['Cierre Cuotas','Seña','Seguimiento Post Call','Re agenda','No Cierre','No asistió','Cancelada'];

const CALL_ESTADO_COLOR = {
  'Cierre':                {bg:'rgba(61,138,90,0.12)', border:'rgba(61,138,90,0.25)',  text:'#5cb87a'},
  'Cierre Cuotas':         {bg:'rgba(61,138,90,0.12)', border:'rgba(61,138,90,0.25)',  text:'#5cb87a'},
  'Seña':                  {bg:'rgba(212,168,50,0.15)', border:'rgba(212,168,50,0.35)', text:'#d4a832'},
  'Seguimiento Post Call': {bg:'rgba(61,106,170,0.12)',border:'rgba(61,106,170,0.25)', text:'#6090d4'},
  'Re agenda':             {bg:'rgba(196,136,42,0.12)',border:'rgba(196,136,42,0.25)', text:'#e0a848'},
  'No Cierre':             {bg:'rgba(184,72,72,0.12)', border:'rgba(184,72,72,0.25)',  text:'#d46060'},
  'No asistió':            {bg:'rgba(120,40,40,0.15)', border:'rgba(150,50,50,0.3)',   text:'#b04040'},
  'Cancelada':             {bg:'rgba(100,30,30,0.18)', border:'rgba(140,40,40,0.35)',  text:'#c04040'},
};
const CALL_ESTADOS_MOTIVO = new Set(['No Cierre']);

const CALL_TO_LEAD_ESTADO = {
  'Cierre':                'Cerrado',
  'Cierre Cuotas':         'Cerrado',
  'Seña':                  'Seña',
  'Seguimiento Post Call': 'Seguimiento Post Call',
  'Re agenda':             'Re agendado',
  'No Cierre':             'Perdido Post Call',
  'No asistió':            'No Show',
  'Cancelada':             'No Show',
};

let callsFilter = 'mes';
let callsMes    = '';

function filtrarCallsPorTiempo(calls, filtro){
  const now = new Date();
  return calls.filter(c=>{
    if(!c.created_at) return filtro==='año';
    const d=new Date(c.created_at);
    switch(filtro){
      case 'dia':    return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&d.getDate()===now.getDate();
      case 'semana': { const x=new Date(now); x.setDate(now.getDate()-7); return d>=x; }
      case 'mes':    { const x=new Date(now); x.setDate(now.getDate()-30); return d>=x; }
      case 'año':    { const x=new Date(now); x.setFullYear(now.getFullYear()-1); return d>=x; }
      default: return true;
    }
  });
}
function filtrarCallsPorMes(calls,mes){
  if(mes===''||mes===null) return calls;
  const m=parseInt(mes,10),yr=new Date().getFullYear();
  return calls.filter(c=>{const d=new Date(c.created_at||0);return d.getMonth()===m&&d.getFullYear()===yr;});
}
let callsBusqueda='';
function onCallsBusquedaInput(){
  callsBusqueda=(document.getElementById('calls-busqueda')?.value||'').trim().toLowerCase();
  _applyCallsFilter();
}
function _filtrarCalls(){
  let r=callsCache.filter(c=>_gfInRange(c.created_at));
  if(callsBusqueda) r=r.filter(c=>
    (c.nombre||'').toLowerCase().includes(callsBusqueda)||
    (c.instagram||'').toLowerCase().includes(callsBusqueda)
  );
  return r;
}
function setCallsFilter(filtro,el){ _gfSet(filtro); }
function onCallsMesChange(){ const s=document.getElementById('calls-mes-select'); _gfSetMes(s?s.value:''); }

async function _applyCallsFilter(){
  const filtradas=_filtrarCalls();
  const total=filtradas.length;

  const badge=document.getElementById('calls-count-badge');
  if(badge) badge.textContent=total;

  const LABEL={dia:'hoy',semana:'últimos 7 días',mes:'últimos 30 días',año:'último año'};
  const lbl=document.getElementById('calls-filter-label');
  if(lbl){
    const parts=_gf.mes!==''?[['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][+_gf.mes]]:[LABEL[_gf.period]||''];
    lbl.textContent=parts.filter(Boolean).join(' · ');
  }

  // Re-agendas siempre desde cache local
  const reagendas=filtradas.filter(c=>(c.estado||'').toLowerCase()==='re agenda').length;

  // Tabla: render inmediato con datos locales, sin esperar API
  _renderCallsTable(filtradas);

  // Cards: intentar desde API, fallback a cálculo local
  const metricsEl=document.getElementById('calls-metrics');
  if(!metricsEl) return;

  const PERIOD_TO_RANGE={dia:'day',semana:'week',mes:'month',año:'month'};
  const apiRange=PERIOD_TO_RANGE[_gf.period]||'month';

  const data=await fetchMetrics(apiRange);

  if(data){
    const c=data.current||{}, p=data.previous||{};
    // Cierres siempre desde callsCache local para no mezclar con estados de leads
    const cierres =filtradas.filter(x=>['Cierre','Cierre Cuotas'].includes(x.estado||'')).length;
    const cierresP=callsCache.filter(x=>_gfPrevInRange(x.created_at)&&['Cierre','Cierre Cuotas'].includes(x.estado||'')).length;
    const noCerradas=Math.max(0,(c.shows||0)-cierres);
    const senasCalls=filtradas.filter(x=>x.estado==='Seña');
    const senasTotal=senasCalls.reduce((s,x)=>s+(parseFloat(x.monto_sena)||0),0);
    const senaLabel=senasCalls.length+(senasTotal>0?` · ${fmtMoney(senasTotal)}`:'');
    metricsEl.style.cssText='display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:12px';
    metricsEl.innerHTML=
      metCardSm('Total llamadas',c.calls||0,'',_delta(c.calls||0,p.calls||0))+
      metCardSm('Shows (asistió)',c.shows||0,'',_delta(c.shows||0,p.shows||0))+
      metCardSm('Cierres',cierres,'green',_delta(cierres,cierresP))+
      metCardSm('Señas',senaLabel,'','')+
      metCardSm('No cerradas',noCerradas,noCerradas>0?'red':'')+
      `<div class="metric-card" style="padding:8px 12px;cursor:pointer" onclick="abrirAgendados()" title="Ver lista">
        <div class="metric-label" style="font-size:10px;margin-bottom:2px">Re agendas</div>
        <div class="metric-value" style="font-size:15px">${reagendas}</div>
       </div>`;
    _renderCallsMetrics2(c.shows||0, cierres, c.calls||0);
  } else {
    // Fallback local si la API no responde
    const prev   =callsCache.filter(c=>_gfPrevInRange(c.created_at));
    const hechas =filtradas.filter(c=>c.estado!=='No asistió'&&c.estado!=='Cancelada'&&c.estado!=='Re agenda'&&c.estado!=='Pendiente').length;
    const hechasP=prev.filter(c=>c.estado!=='No asistió'&&c.estado!=='Cancelada'&&c.estado!=='Re agenda'&&c.estado!=='Pendiente').length;
    const cierres =filtradas.filter(c=>['Cierre','Cierre Cuotas'].includes(c.estado||'')).length;
    const cierresP=prev.filter(c=>['Cierre','Cierre Cuotas'].includes(c.estado||'')).length;
    const noCerradas=Math.max(0,hechas-cierres);
    const senasCalls=filtradas.filter(c=>c.estado==='Seña');
    const senasTotal=senasCalls.reduce((s,c)=>s+(parseFloat(c.monto_sena)||0),0);
    const senaLabel=senasCalls.length+(senasTotal>0?` · ${fmtMoney(senasTotal)}`:'');
    metricsEl.style.cssText='display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:12px';
    metricsEl.innerHTML=
      metCardSm('Total llamadas',total,'',_delta(total,prev.length))+
      metCardSm('Llamadas hechas',hechas,'',_delta(hechas,hechasP))+
      metCardSm('Cierres',cierres,'green',_delta(cierres,cierresP))+
      metCardSm('Señas',senaLabel,'','')+
      metCardSm('No cerradas',noCerradas,noCerradas>0?'red':'')+
      `<div class="metric-card" style="padding:8px 12px;cursor:pointer" onclick="abrirAgendados()" title="Ver lista">
        <div class="metric-label" style="font-size:10px;margin-bottom:2px">Re agendas</div>
        <div class="metric-value" style="font-size:15px">${reagendas}</div>
       </div>`;
    _renderCallsMetrics2(hechas, cierres, total);
  }
}

async function fetchCalls(){
  const loader=document.getElementById('calls-loading');
  if(loader) loader.style.display='inline';
  try{
    const res=await apiFetch(`${API_URL}/calls`);
    if(!res.ok){
      console.error('[fetchCalls] HTTP', res.status);
      if(res.status===401||res.status===403) toast('✗ Sin acceso a calls — verificá el cliente seleccionado');
      return;
    }
    const data=await res.json();
    console.log('CALLS:',data);
    window.callsCache=callsCache=Array.isArray(data)?data:(data?.calls||data?.data||[]);
  }catch(e){console.error('Error fetchCalls:',e);}
  finally{
    if(loader) loader.style.display='none';
    _applyCallsFilter();
  }
}
function renderCallsPage(){
  const isC2 = getCid() === 'cliente_2';
  const thCloser = document.getElementById('calls-th-closer');
  if(thCloser) thCloser.style.display = isC2 ? '' : 'none';
  const ghlFields = document.getElementById('pc-ghl-fields');
  if(ghlFields) ghlFields.style.display = isC2 ? 'block' : 'none';
  _applyCallsFilter();
  fetchCalls();
}

// Canonical question order for GHL qualification form.
// Matching is done by normalized key (lowercase, no punctuation/spaces) so minor
// variations in the actual key string still land in the right position.
const _GHL_QUESTION_ORDER = [
  'nombre completo',
  'correo electrónico',
  'número de whatsapp',
  'cuál es tu instagram',
  'a que te dedicas',
  'escala del 1 al 10',
  'motivo real y profundo',
  'dispones capital',
  'estás buscando cambiar',
  'entiendes que nos estamos reservando',
];

function _ghlQuestionRank(q){
  const n = q.toLowerCase().replace(/[¿?*\s]+/g,' ').trim();
  const idx = _GHL_QUESTION_ORDER.findIndex(k => n.includes(k));
  return idx === -1 ? 999 : idx;
}

function _sortGHLEntries(entries){
  return [...entries].sort((a,b) => _ghlQuestionRank(a[0]) - _ghlQuestionRank(b[0]));
}

function _parsePreguntas(raw){
  if(!raw) return [];
  try{
    const obj=typeof raw==='string'?JSON.parse(raw):raw;
    if(obj&&typeof obj==='object'&&!Array.isArray(obj))
      return Object.entries(obj).filter(([,v])=>v&&v.toString().trim());
  }catch{}
  // plain-text fallback
  if(typeof raw==='string'&&raw.trim()) return [['Respuestas',raw.trim()]];
  return [];
}

function _getCalendlyFormText(r){
  // GHL / preguntas_calificacion path (also logs for debugging)
  if(r.preguntas_calificacion){
    console.log('preguntas_calificacion raw',r.id,r.preguntas_calificacion);
    const entries=_parsePreguntas(r.preguntas_calificacion);
    if(entries.length) return entries.map(([q,a])=>`${q}: ${a}`).join('\n');
  }
  // Calendly form responses
  try{
    const cf=typeof r.calendly_form_responses==='string'?JSON.parse(r.calendly_form_responses):r.calendly_form_responses;
    if(cf&&typeof cf==='object'){
      const entries=Object.entries(cf).filter(([,v])=>v&&v.toString().trim());
      if(entries.length) return entries.map(([q,a])=>`${q}: ${a}`).join('\n');
    }
  }catch{}
  if(r.origen==='Calendly'&&r.info_previa&&r.info_previa.trim()) return r.info_previa.trim();
  return '';
}

function verCalendlyForm(callId){
  const call=callsCache.find(c=>c.id===callId);
  if(!call) return;

  console.log('preguntas_calificacion',call.preguntas_calificacion);

  let entries=[];

  // 1. GHL preguntas_calificacion
  if(call.preguntas_calificacion){
    entries=_sortGHLEntries(_parsePreguntas(call.preguntas_calificacion));
  }

  // 2. Calendly form responses
  if(!entries.length){
    try{
      const cf=typeof call.calendly_form_responses==='string'?JSON.parse(call.calendly_form_responses):call.calendly_form_responses;
      if(cf&&typeof cf==='object') entries=Object.entries(cf).filter(([,v])=>v&&v.toString().trim());
    }catch{}
  }

  // 3. info_previa "Pregunta: Respuesta" lines (old Calendly calls)
  if(!entries.length&&call.origen==='Calendly'&&call.info_previa&&call.info_previa.trim()){
    entries=call.info_previa.trim().split('\n').filter(l=>l.trim()).map(l=>{
      const i=l.indexOf(':');
      return i>0?[l.slice(0,i).trim(),l.slice(i+1).trim()]:[l,''];
    });
  }

  if(!entries.length) return;

  const cfTitle = document.querySelector('#modal-calendly-form .modal-title');
  if(cfTitle) cfTitle.textContent = call.origen==='GHL' ? '📋 Preguntas de Calificación' : '📋 Formulario Calendly';
  document.getElementById('modal-cf-nombre').textContent=call.nombre||'';
  document.getElementById('modal-cf-body').innerHTML=entries.map(([q,a])=>{
    const sq=q.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const sa=(a||'').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `<details ontoggle="this.querySelector('.cf-chev').style.transform=this.open?'rotate(180deg)':'rotate(0deg)'"
      style="border:1px solid rgba(255,255,255,0.07);border-radius:8px;margin-bottom:8px;overflow:hidden">
      <summary style="padding:12px 14px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;background:rgba(255,255,255,0.03)">
        <span style="font-size:12px;font-weight:600;color:var(--text);line-height:1.4">${sq}</span>
        <span class="cf-chev" style="color:var(--gold);font-size:10px;flex-shrink:0;margin-top:2px;transition:transform .2s">▼</span>
      </summary>
      <div style="padding:12px 14px;font-size:13px;color:var(--text2);background:rgba(255,255,255,0.015);border-top:1px solid rgba(255,255,255,0.06);white-space:pre-wrap;line-height:1.6">${sa||'—'}</div>
    </details>`;
  }).join('');

  document.getElementById('modal-calendly-form').classList.add('open');
}

function _renderCallsTable(rows){
  const tbody=document.getElementById('calls-table');
  if(!tbody) return;
  const canLink=['admin','closer','closer_content'].includes(currentUserRole);

  const countByIG={};
  callsCache.forEach(c=>{const ig=(c.instagram||'').toLowerCase();countByIG[ig]=(countByIG[ig]||0)+1;});
  const callNumByIG={};

  tbody.innerHTML=rows.map((r,idx)=>{
    const ig=(r.instagram||'').toLowerCase();
    if(!callNumByIG[ig]) callNumByIG[ig]=0;
    callNumByIG[ig]++;
    const callNum=countByIG[ig]>1?`<span class="badge bgy" style="font-size:9px;margin-left:4px">Call #${callNumByIG[ig]}</span>`:'';

    const estado=r.estado||r.estado_llamada||'';
    const col=CALL_ESTADO_COLOR[estado]||{bg:'rgba(60,58,55,0.5)',border:'rgba(80,78,74,0.3)',text:'#7a7870'};
    const isCierre=['Cierre','Cierre Cuotas'].includes(estado);
    const isPostCall = estado === 'Seguimiento Post Call';
    let pagoHtml='';
    if(isCierre){
      const pagoTotal=(S.ing||[]).filter(x=>x.concepto==='Venta Nueva'&&(x.instagram||'').toLowerCase()===ig).reduce((a,x)=>a+(+x.usd||0),0);
      if(pagoTotal>0) pagoHtml=`<div style="font-size:10px;color:#5cb85c;font-weight:700;margin-top:3px">${fmtMoney(pagoTotal)}</div>`;
    }
    const _fmtFecha=f=>new Date(f).toLocaleString('es-AR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
    const fechaSub=(r.reagendada||estado==='Re agenda'||estado==='Pendiente')&&r.fecha_llamada
      ?`<span style="font-size:10px;font-weight:600;white-space:nowrap;color:${(r.reagendada||estado==='Re agenda')?'#e0a848':'#6090d4'};margin-top:3px">${(r.reagendada||estado==='Re agenda')?'🔄':'📅'} ${_fmtFecha(r.fecha_llamada)}</span>`
      :'';
    const estadoBadge=`<div style="display:inline-flex;flex-direction:column;align-items:flex-start">
      <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
        padding:3px 8px;border-radius:20px;background:${col.bg};border:1px solid ${col.border};color:${col.text};white-space:nowrap">${estado||'—'}</span>${pagoHtml}${fechaSub}</div>`;

    const infoPrevia=`<button class="btn btn-outline" style="font-size:10px;padding:3px 8px" onclick="abrirInfoPreviaEdit('${r.id}','${(r.nombre||'').replace(/'/g,"\\'")}');event.stopPropagation()">${r.info_previa?'Ver / Editar':'+ Agregar'}</button>`;

    let rJSON={};
    try{ if(r.reporte) rJSON=typeof r.reporte==='string'?JSON.parse(r.reporte):r.reporte; }catch{}
    const tieneReporte=Object.values(rJSON).some(v=>v&&v.toString().trim());
    const avatarIdeal=(rJSON.avatar_ideal||'').toLowerCase()==='si';

    const motivoText=CALL_ESTADOS_MOTIVO.has(estado)&&r.motivo_no_cierre
      ?`<span class="trunc" style="max-width:110px;display:inline-block;color:#d46060" title="${r.motivo_no_cierre}">${r.motivo_no_cierre}</span>`
      :'<span style="color:var(--text3)">—</span>';
    const linkCell=canLink&&r.link_llamada&&r.link_llamada.startsWith('http')
      ?`<a href="${r.link_llamada}" target="_blank" class="link-btn">Link meet</a>`
      :'<span style="color:var(--text3)">—</span>';
    const grabacionCell=r.link_grabacion&&r.link_grabacion.startsWith('http')
      ?`<a href="${r.link_grabacion}" target="_blank" class="link-btn">▶ Ver</a>`
      :'<span style="color:var(--text3)">—</span>';

    const hasCalendlyForm=_getCalendlyFormText(r)!=='';
    const reporteCalendlyCell=hasCalendlyForm
      ?`<button class="btn btn-outline" style="font-size:10px;padding:3px 8px" onclick="verCalendlyForm('${r.id}');event.stopPropagation()">Ver</button>`
      :'<span style="color:var(--text3)">—</span>';
    const reporteCloserCell=tieneReporte
      ?`<button class="btn btn-outline" style="font-size:10px;padding:3px 8px" onclick="verReporteCall('${r.id}');event.stopPropagation()">Ver</button>`
      :'<span style="color:var(--text3)">—</span>';

    console.log('closer',r.closer,'calendar_id',r.calendar_id,'preguntas_calificacion',r.preguntas_calificacion);

    const isC2 = getCid() === 'cliente_2';
    const leadOrigen=leadsCache.find(l=>(l.instagram||'').toLowerCase()===ig);
    const origenVal=r.origen||leadOrigen?.origen||'';

    // Closer: show first name only to keep the cell compact
    const closerText=r.closer?(r.closer.split(' ')[0]):'<span style="color:var(--text3)">—</span>';

    const rowBg=(estado==='No asistió'||estado==='Cancelada')?'background:rgba(200,60,60,0.1);':'';
    return `<tr onclick="abrirEditCall('${r.id}')" style="cursor:pointer;${rowBg}" title="Click para editar" class="${avatarIdeal?'avatar-ideal-si':''}">
      <td style="color:var(--text3);font-size:10px;text-align:center">${idx+1}</td>
      <td style="color:var(--text);font-weight:600">${r.nombre||'—'}${callNum}</td>
      <td><a href="https://instagram.com/${ig}" target="_blank" style="color:var(--blue);text-decoration:none;font-size:12px" onclick="event.stopPropagation()">@${r.instagram||'—'}</a></td>
      <td style="font-size:12px;color:var(--text2)">${r.whatsapp||'—'}</td>
      <td>${origenBadge(origenVal)}</td>
      ${isC2?`<td style="font-size:12px;color:var(--text2)">${closerText}</td>`:''}
      <td onclick="event.stopPropagation()">${infoPrevia}</td>
      <td>${estadoBadge}</td>
      <td>${motivoText}</td>
      <td style="text-align:center">${(()=>{
        if(!isPostCall) return '<span style="color:var(--text3)">—</span>';
        if(!r.spc_date) return '<span style="font-size:11px;color:var(--text3)">hoy</span>';
        const dias=Math.floor((Date.now()-new Date(r.spc_date))/(86400000));
        const col=dias<=2?'#5cb87a':dias<=5?'#e0b54a':'#d46060';
        const label=dias===0?'hoy':dias===1?'1 día':`${dias} días`;
        const notasIcon=r.notas_spc?`<span title="${r.notas_spc.replace(/"/g,'&quot;')}" style="margin-left:4px;cursor:help;opacity:.7">📋</span>`:'';
        return `<span style="font-size:12px;font-weight:700;color:${col}">${label}</span>${notasIcon}`;
      })()}</td>
      <td>${isPostCall?`<span class="badge ${r.responde?'bgr':'bgy'}">${r.responde?'Sí':'No'}</span>`:'<span style="color:var(--text3)">—</span>'}</td>
      <td onclick="event.stopPropagation()">${linkCell}</td>
      <td onclick="event.stopPropagation()">${grabacionCell}</td>
      <td onclick="event.stopPropagation()">${reporteCloserCell}</td>
      <td onclick="event.stopPropagation()">${reporteCalendlyCell}</td>
      <td style="font-size:11px;color:var(--text3);white-space:nowrap">${formatearFecha(r.created_at)}</td>
      <td onclick="event.stopPropagation()">
        <button class="btn-icon" onclick="deleteCall('${r.id}')" style="color:var(--red)" title="Eliminar">×</button>
      </td>
    </tr>`;
  }).join('')||'<tr><td colspan="17" style="color:var(--text3);text-align:center;padding:24px">Sin llamadas</td></tr>';
}

// ========== WHATSAPP HELPERS ==========
function onPCCountryChange(){
  _updatePCPreview(document.getElementById('pc-country')?.value||'');
}
function onPCWAInput(){
  _updatePCPreview(document.getElementById('pc-country')?.value||'');
}
function _updatePCPreview(prefix){
  const num=(document.getElementById('pc-whatsapp')?.value||'').trim();
  const preview=document.getElementById('pc-whatsapp-preview');
  if(preview) preview.textContent=num?`${prefix}${num}`:prefix;
}
function _getPCFullWhatsApp(){
  const prefix=document.getElementById('pc-country')?.value||'';
  const num=(document.getElementById('pc-whatsapp')?.value||'').trim();
  if(!num) return '';
  if(num.startsWith('+')) return num;
  return `${prefix}${num}`;
}
function onCountryChange(){ onPCCountryChange(); }
function onWhatsAppInput(){ onPCWAInput(); }
function _getFullWhatsApp(){ return _getPCFullWhatsApp(); }
function onCallModalEstadoChange(){
  const el=document.getElementById('cl2-motivo-wrap');
  if(el) el.style.display='none';
}

// ========== SETTER: savePreCall ==========
function _showPcDuplicate(call){
  const notice=document.getElementById('pc-duplicate-notice');
  const actions=document.getElementById('pc-duplicate-actions');
  const footer=document.getElementById('pc-footer-normal');
  if(!notice||!actions) return;
  notice.style.display='block';
  if(footer) footer.style.display='none';
  const hasInfo=!!(call.info_previa&&call.info_previa.trim());
  const n=(call.nombre||'').replace(/'/g,"\\'");
  actions.innerHTML=
    `<button class="btn btn-gold" onclick="abrirInfoPreviaEdit('${call.id}','${n}');closeModal('modal-call')">${hasInfo?'Editar Info Previa':'Agregar info previa'}</button>`+
    `<button class="btn btn-outline" onclick="closeModal('modal-call')">Cerrar</button>`;
}

function _resetPcModal(){
  const notice=document.getElementById('pc-duplicate-notice');
  const footer=document.getElementById('pc-footer-normal');
  if(notice) notice.style.display='none';
  if(footer) footer.style.display='';
  ['pc-closer','pc-calendar-name','pc-email'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.value='';
  });
}

async function savePreCall(){
  const nombre   =(document.getElementById('pc-nombre')?.value||'').trim();
  const instagram=(document.getElementById('pc-instagram')?.value||'').trim().replace(/^@/,'').toLowerCase();
  const whatsapp =_getPCFullWhatsApp();
  const info_previa=(document.getElementById('pc-info')?.value||'').trim();

  if(!instagram){toast('✗ Instagram es obligatorio');return;}

  // Reset any previous duplicate notice
  _resetPcModal();

  // Check for existing pending call with the same instagram
  const existingPending=callsCache.find(c=>(c.instagram||'').toLowerCase()===instagram&&c.estado==='Pendiente');
  if(existingPending){ _showPcDuplicate(existingPending); return; }

  const pendingLead=_pendingReporteLeadId?leadsCache.find(l=>l.id===_pendingReporteLeadId):leadsCache.find(l=>(l.instagram||'').toLowerCase()===instagram.toLowerCase());
  const rawFechaPC=(document.getElementById('pc-fecha-llamada')?.value||'').trim();
  const _pc_isC2 = getCid() === 'cliente_2';
  const data={nombre,instagram,whatsapp,info_previa,origen:pendingLead?.origen||(_pc_isC2?'GHL':''),
    fecha_llamada:rawFechaPC?new Date(rawFechaPC).toISOString():null,
    ...(_pc_isC2 && {
      closer:       (document.getElementById('pc-closer')?.value||'').trim()||undefined,
      calendar_name:(document.getElementById('pc-calendar-name')?.value||'').trim()||undefined,
      email:        (document.getElementById('pc-email')?.value||'').trim()||undefined,
    }),
  };
  console.log('DATA ENVIADA (pre-call):',data);

  const btn=document.getElementById('pc-save-btn');
  if(btn){btn.disabled=true;btn.textContent='Guardando…';}
  try{
    const res=await apiFetch(`${API_URL}/call/precall`,{
      method:'POST',
      body:JSON.stringify(data),
    });
    let result={};
    try{result=await res.json();}catch{}
    console.log('RESPUESTA (pre-call):',result);
    if(!res.ok){toast(`✗ ${result?.error||result?.message||'Error '+res.status}`);return;}

    if(_pendingReporteLeadId && info_previa){
      try{
        await apiFetch(`${API_URL}/leads/${_pendingReporteLeadId}`,{method:'PATCH',body:JSON.stringify({reporte_agenda:info_previa,updated_at:new Date().toISOString()})});
        const lead=leadsCache.find(l=>l.id===_pendingReporteLeadId);
        if(lead) lead.reporte_agenda=info_previa;
      }catch(e){ console.warn('[savePreCall] No se pudo guardar reporte_agenda:',e); }
    }
    _pendingReporteLeadId=null;

    closeModal('modal-call');
    toast('✓ Llamada agendada correctamente');
    await fetchCalls();
  }catch(e){
    console.error('[savePreCall]',e);
    toast('✗ Error de conexión con el servidor');
  }finally{
    if(btn){btn.disabled=false;btn.textContent='Guardar y agendar';}
  }
}

function saveNewCall(){return savePreCall();}

// ========== CLOSER: abrirEditCall ==========
function abrirEditCall(id){
  const r=callsCache.find(c=>c.id===id);
  if(!r) return;
  document.getElementById('ec-id').value=id;
  document.getElementById('ec-nombre').value=r.nombre||'';
  document.getElementById('ec-instagram').value=r.instagram||'';
  document.getElementById('ec-whatsapp').value=r.whatsapp||'';
  document.getElementById('ec-info').value=r.info_previa||'';
  const estadoEl=document.getElementById('ec-estado');
  if(estadoEl) estadoEl.value=r.estado||r.estado_llamada||'Cierre';
  const fechaEl=document.getElementById('ec-fecha-llamada');
  if(fechaEl) fechaEl.value=r.fecha_llamada?r.fecha_llamada.slice(0,16):'';
  document.getElementById('ec-motivo').value=r.motivo_no_cierre||'';
  document.getElementById('ec-seguimientos').value=r.seguimientos||0;
  if(r.responde){document.getElementById('ec-resp-si').checked=true;}
  else{document.getElementById('ec-resp-no').checked=true;}
  document.getElementById('ec-link').value=r.link_llamada||'';
  document.getElementById('ec-grabacion').value=r.link_grabacion||'';

  const _isC2 = getCid() === 'cliente_2';
  const closerWrap = document.getElementById('ec-closer-wrap');
  if(closerWrap) closerWrap.style.display = _isC2 ? 'block' : 'none';
  const ecCloser = document.getElementById('ec-closer');
  if(ecCloser) ecCloser.value = r.closer || '';

  const ecNotasSpc = document.getElementById('ec-notas-spc');
  if(ecNotasSpc) ecNotasSpc.value = r.notas_spc || '';

  let rJSON={};
  try{ if(r.reporte) rJSON=typeof r.reporte==='string'?JSON.parse(r.reporte):r.reporte; }catch{}
  document.getElementById('ec-atraccion').value=rJSON.atraccion||'';
  document.getElementById('ec-contenido').value=rJSON.contenido||'';
  document.getElementById('ec-motivacion').value=rJSON.motivacion||'';
  document.getElementById('ec-dolor').value=rJSON.dolor||'';
  document.getElementById('ec-objecion').value=rJSON.objecion||'';
  document.getElementById('ec-perfil').value=rJSON.perfil||'';
  document.getElementById('ec-aporte').value=rJSON.aporte_marketing||'';
  if((rJSON.avatar_ideal||'').toLowerCase()==='si'){
    document.getElementById('ec-avatar-si').checked=true;
  } else {
    document.getElementById('ec-avatar-no').checked=true;
  }

  onEditCallEstadoChange();
  document.getElementById('modal-edit-call').classList.add('open');
}
function onEditCallEstadoChange(){
  const estado=document.getElementById('ec-estado')?.value||'';
  const isPostCall  = estado === 'Seguimiento Post Call';
  const isPendiente = estado === 'Pendiente';
  const isReagenda  = estado === 'Re agenda';
  const isSeña      = estado === 'Seña';
  const motivoWrap=document.getElementById('ec-motivo-wrap');
  const segWrap=document.getElementById('ec-seg-wrap');
  const respWrap=document.getElementById('ec-resp-wrap');
  const fechaWrap=document.getElementById('ec-fecha-wrap');
  const fechaLabel=fechaWrap?.querySelector('label');
  const senaWrap=document.getElementById('ec-monto-sena-wrap');
  const spcNotasWrap=document.getElementById('ec-spc-notas-wrap');
  if(motivoWrap)   motivoWrap.style.display=CALL_ESTADOS_MOTIVO.has(estado)?'block':'none';
  if(segWrap)      segWrap.style.display=isPostCall?'block':'none';
  if(respWrap)     respWrap.style.display=isPostCall?'block':'none';
  if(spcNotasWrap) spcNotasWrap.style.display=isPostCall?'block':'none';
  if(fechaWrap)    fechaWrap.style.display=(isPendiente||isReagenda)?'block':'none';
  if(fechaLabel)   fechaLabel.textContent=isReagenda?'🔄 Nueva fecha de reagenda':'📅 Fecha y hora de llamada';
  if(senaWrap)     senaWrap.style.display=isSeña?'block':'none';
}

// ========== CLOSER: saveEditCall ==========
async function saveEditCall(){
  const id=document.getElementById('ec-id').value;
  if(!id){toast('✗ ID inválido');return;}
  const estado=document.getElementById('ec-estado').value;
  const motivo=(document.getElementById('ec-motivo')?.value||'').trim();
  if(CALL_ESTADOS_MOTIVO.has(estado)&&!motivo){toast('✗ Motivo de no cierre obligatorio');return;}
  const montoSenaRaw=(document.getElementById('ec-monto-sena')?.value||'').trim();
  if(estado==='Seña'&&!montoSenaRaw){toast('✗ El monto de la seña es obligatorio');return;}
  const monto_sena=montoSenaRaw?parseFloat(montoSenaRaw):null;
  const _ec_isC2 = getCid() === 'cliente_2';
  const closer=_ec_isC2?(document.getElementById('ec-closer')?.value||'').trim():undefined;
  const link=(document.getElementById('ec-link')?.value||'').trim();
  if(link&&!link.startsWith('http')){toast('✗ El link debe empezar con http');return;}
  const grabacion=(document.getElementById('ec-grabacion')?.value||'').trim();
  if(grabacion&&!grabacion.startsWith('http')){toast('✗ El link de grabación debe empezar con http');return;}

  const avatar_ideal=document.getElementById('ec-avatar-si')?.checked?'Si':'No';
  const reporte=JSON.stringify({
    atraccion:   (document.getElementById('ec-atraccion')?.value||'').trim(),
    contenido:   (document.getElementById('ec-contenido')?.value||'').trim(),
    motivacion:  (document.getElementById('ec-motivacion')?.value||'').trim(),
    dolor:       (document.getElementById('ec-dolor')?.value||'').trim(),
    objecion:    (document.getElementById('ec-objecion')?.value||'').trim(),
    perfil:      (document.getElementById('ec-perfil')?.value||'').trim(),
    avatar_ideal,
    aporte_marketing:(document.getElementById('ec-aporte')?.value||'').trim(),
  });

  const rawFecha=(document.getElementById('ec-fecha-llamada')?.value||'').trim();
  const payload={
    estado,
    motivo_no_cierre:CALL_ESTADOS_MOTIVO.has(estado)?motivo:'',
    seguimientos:parseInt(document.getElementById('ec-seguimientos')?.value||'0',10),
    responde:document.getElementById('ec-resp-si')?.checked===true,
    link_llamada:link,
    link_grabacion:grabacion,
    reporte,
    notas_spc:(document.getElementById('ec-notas-spc')?.value||'').trim()||null,
    fecha_llamada:(estado==='Pendiente'||estado==='Re agenda')&&rawFecha?new Date(rawFecha).toISOString():null,
    ...(monto_sena!==null && {monto_sena}),
    ...(closer!==undefined && {closer}),
  };

  console.log('DATA ENVIADA (edit-call):',payload);

  const btn=document.getElementById('ec-save-btn');
  if(btn){btn.disabled=true;btn.textContent='Guardando…';}
  try{
    const res=await apiFetch(`${API_URL}/call/${id}`,{
      method:'PATCH',
      body:JSON.stringify(payload),
    });
    let result={};
    try{result=await res.json();}catch{}
    console.log('RESPUESTA (edit-call):',result);
    if(!res.ok){toast(`✗ ${result?.error||result?.message||'Error '+res.status}`);return;}

    const call=callsCache.find(c=>c.id===id);
    if(call){
      Object.assign(call,payload);
      const leadEstado=CALL_TO_LEAD_ESTADO[estado];
      if(leadEstado&&LEAD_ESTADOS.includes(leadEstado)){
        const ig=(call.instagram||'').toLowerCase();
        const nombre=(call.nombre||'').toLowerCase();
        // primary: match by instagram; secondary: match by nombre
        const lead=leadsCache.find(l=>(l.instagram||'').toLowerCase()===ig&&ig)
          ||leadsCache.find(l=>(l.nombre||'').toLowerCase()===nombre&&nombre);
        if(lead){
          lead.estado=leadEstado;
          await apiFetch(`${API_URL}/leads/${lead.id}`,{method:'PATCH',body:JSON.stringify({estado:leadEstado})});
          console.log(`[sync] matched lead id=${lead.id} → estado="${leadEstado}"`);
          if(document.getElementById('page-leads')?.classList.contains('active')) _applyLeadsFilter();
        }
      }
    }

    if(['Cierre','Cierre Cuotas'].includes(estado)){
      const ig2=(call?.instagram||'').toLowerCase();
      const leadForCierre=leadsCache.find(l=>(l.instagram||'').toLowerCase()===ig2);
      if(leadForCierre) _atribuirContenido(leadForCierre,'ventas').catch(()=>{});
      _mostrarPopupCierre(call?.id||id, leadForCierre||{nombre:call?.nombre||'',instagram:call?.instagram||''});
    }
    closeModal('modal-edit-call');
    toast('✓ Llamada actualizada');
    await fetchCalls();
  }catch(e){
    console.error('[saveEditCall]',e);
    toast('✗ Error de conexión');
  }finally{
    if(btn){btn.disabled=false;btn.textContent='Guardar cambios';}
  }
}

async function deleteCall(id){
  if(!confirm('¿Eliminar esta llamada?')) return;
  const call=callsCache.find(c=>String(c.id)===String(id));
  try{
    const res=await apiFetch(`${API_URL}/call/${id}`,{method:'DELETE'});
    if(!res.ok){toast('✗ Error al eliminar');return;}
    if(call&&['Cierre','Cierre Cuotas'].includes(call.estado||'')){
      const ig=(call.instagram||'').toLowerCase();
      if(ig){
        const toDelIng=S.ing.filter(x=>x.concepto==='Venta Nueva'&&(x.instagram||'').toLowerCase()===ig);
        for(const x of toDelIng){apiFetch(`${API_URL}/ingresos/${x.id}`,{method:'DELETE'}).catch(()=>{});}
        S.ing=S.ing.filter(x=>!toDelIng.includes(x));
        save('ing');
        _renderMoneyCounters();
        renderFin();
      }
    }
    toast('✓ Llamada eliminada');
    fetchCalls();
  }catch(e){console.error('[deleteCall]',e);toast('✗ Error de conexión');}
}

let _editingInfoPreviaCallId=null;

function verInfoPreviaModal(texto, nombre){
  _editingInfoPreviaCallId=null;
  document.getElementById('modal-info-meta').textContent=nombre||'';
  document.getElementById('modal-info-body').value=texto||'';
  document.getElementById('modal-info-body').readOnly=true;
  const saveBtn=document.getElementById('modal-info-save-btn');
  if(saveBtn) saveBtn.style.display='none';
  document.getElementById('modal-info-previa').classList.add('open');
}

function abrirInfoPreviaEdit(callId, nombre){
  const call=callsCache.find(c=>c.id===callId);
  _editingInfoPreviaCallId=callId;
  document.getElementById('modal-info-meta').textContent=nombre||'';
  document.getElementById('modal-info-body').value=call?.info_previa||'';
  document.getElementById('modal-info-body').readOnly=false;
  const saveBtn=document.getElementById('modal-info-save-btn');
  if(saveBtn) saveBtn.style.display='';
  document.getElementById('modal-info-previa').classList.add('open');
}

async function guardarInfoPrevia(){
  if(!_editingInfoPreviaCallId) return;
  const texto=(document.getElementById('modal-info-body')?.value||'').trim();
  const btn=document.getElementById('modal-info-save-btn');
  if(btn){btn.disabled=true;btn.textContent='Guardando…';}
  try{
    const res=await apiFetch(`${API_URL}/call/${_editingInfoPreviaCallId}`,{method:'PATCH',body:JSON.stringify({info_previa:texto})});
    if(!res.ok) throw new Error();
    const call=callsCache.find(c=>c.id===_editingInfoPreviaCallId);
    if(call) call.info_previa=texto;
    closeModal('modal-info-previa');
    toast('✓ Info previa guardada');
  }catch(e){
    toast('✗ Error al guardar');
  }finally{
    if(btn){btn.disabled=false;btn.textContent='Guardar';}
  }
}

function verReporteGHL(callId){
  verCalendlyForm(callId);
}

const REPORTE_LABELS={
  atraccion:       '¿Qué fue lo que más le llamó la atención/atrajo de la oferta?',
  contenido:       '¿Qué mencionó el lead que podemos usar para contenido?',
  motivacion:      '¿Qué lo motivó a estar en la llamada?',
  dolor:           '¿Cuál es el dolor más fuerte que tenía?',
  objecion:        '¿Qué objeción apareció?',
  perfil:          '¿Qué tipo de perfil tiene el lead?',
  avatar_ideal:    '¿Este lead representa al avatar ideal?',
  aporte_marketing:'¿Qué puedo aportar para marketing desde la llamada?',
};
function verReporteCall(id){
  const call=callsCache.find(c=>c.id===id);
  if(!call) return;
  let rJSON={};
  try{ if(call.reporte) rJSON=typeof call.reporte==='string'?JSON.parse(call.reporte):call.reporte; }catch{}
  const esAvatar=(rJSON.avatar_ideal||'').toLowerCase()==='si';
  document.getElementById('modal-reporte-meta').innerHTML=
    `<span style="color:var(--text)">@${call.instagram||'—'}</span> · ${call.nombre||''}`+
    (esAvatar?` <span class="badge bg" style="margin-left:6px">⭐ Avatar ideal</span>`:'');
  const body=document.getElementById('modal-reporte-body');
  if(!Object.values(rJSON).some(v=>v?.toString().trim())){
    body.innerHTML='<div style="color:var(--text3);font-size:13px;padding:12px">Sin reporte cargado.</div>';
  } else {
    body.innerHTML=Object.entries(REPORTE_LABELS).map(([k,q])=>{
      const val=(rJSON[k]||'').toString().trim();
      if(!val) return '';
      const isAvatarSi=k==='avatar_ideal'&&val.toLowerCase()==='si';
      return `<div style="margin-bottom:14px">
        <div class="reporte-question">${q}</div>
        <div class="reporte-answer${isAvatarSi?' highlight':''}">${val}</div>
      </div>`;
    }).filter(Boolean).join('')||'<div style="color:var(--text3);font-size:13px;padding:12px">Sin respuestas cargadas.</div>';
  }
  document.getElementById('modal-ver-reporte').classList.add('open');
}

function verInfoLead(instagram){
  const ig=(instagram||'').replace('@','').toLowerCase();
  const lead=leadsCache.find(l=>(l.instagram||'').toLowerCase()===ig);
  if(!lead){toast('Lead no encontrado');return;}
  document.getElementById('modal-agenda-meta').textContent=`${lead.nombre||'—'} · @${lead.instagram||'—'} · ${lead.estado||''}`;
  document.getElementById('modal-agenda-body').textContent=lead.reporte_agenda||'(Sin reporte de agenda)';
  document.getElementById('modal-ver-reporte-agenda').classList.add('open');
}

function abrirAgendados(){
  const reagendados=callsCache.filter(c=>(c.estado||'').toLowerCase()==='re agenda');
  const tbody=document.getElementById('modal-agendados-body');
  if(!tbody) return;
  tbody.innerHTML=reagendados.map(c=>{
    const ig=(c.instagram||'').replace('@','').toLowerCase();
    const lead=leadsCache.find(l=>(l.instagram||'').toLowerCase()===ig);
    return `<tr>
      <td style="color:var(--text);font-weight:600">${c.nombre||'—'}</td>
      <td style="color:var(--blue);font-size:12px">@${c.instagram||'—'}</td>
      <td>${lead?.reporte_agenda
        ?`<button class="btn btn-outline" style="font-size:11px;padding:3px 8px"
            onclick="verInfoLead('${ig}');closeModal('modal-agendados')">Ver info</button>`
        :'<span style="color:var(--text3);font-size:11px">Sin reporte</span>'}</td>
    </tr>`;
  }).join('')||'<tr><td colspan="3" style="color:var(--text3);text-align:center;padding:16px">Sin re-agendas</td></tr>';
  document.getElementById('modal-agendados').classList.add('open');
}

let _pendingReporteLeadId=null;
function _mostrarPopupReporteAgenda(leadId, leadObj){
  _pendingReporteLeadId=leadId;
  const lead=leadObj||leadsCache.find(l=>l.id===leadId);
  if(document.getElementById('pc-nombre'))
    document.getElementById('pc-nombre').value=lead?.nombre||'';
  if(document.getElementById('pc-instagram'))
    document.getElementById('pc-instagram').value=lead?.instagram||'';
  if(document.getElementById('pc-whatsapp'))
    document.getElementById('pc-whatsapp').value='';
  if(document.getElementById('pc-info'))
    document.getElementById('pc-info').value='';
  if(document.getElementById('pc-country'))
    document.getElementById('pc-country').selectedIndex=0;
  const preview=document.getElementById('pc-whatsapp-preview');
  if(preview) preview.textContent='+598';
  document.getElementById('modal-call').classList.add('open');
}

function guardarReporteAgenda(){
  toast('Usá el formulario de Pre-Call para guardar el reporte.');
}

function openAddCallModal(){
  const isC2 = getCid() === 'cliente_2';
  const ghlFields = document.getElementById('pc-ghl-fields');
  if(ghlFields) ghlFields.style.display = isC2 ? 'block' : 'none';
  _resetPcModal();
  openModal('modal-call');
}
async function _addCall(){}

// ========== HELPER ==========
function v(id){const el=document.getElementById(id);return el?el.value:'';}

// ========== ACTIVITY LOG ==========
let _activityLog=ld('crm_activity_log',[]);
function _logActivity(accion, lead, detalle=''){
  const ts=new Date().toISOString();
  const entry={ts,leadId:lead?.id||'',nombre:lead?.nombre||'—',instagram:lead?.instagram||'',accion,detalle,usuario:localStorage.getItem('userEmail')||'—'};
  _activityLog.unshift(entry);
  if(_activityLog.length>100) _activityLog=_activityLog.slice(0,100);
  sv('crm_activity_log',_activityLog);
  apiFetch(`${API_URL}/activity`,{method:'POST',body:JSON.stringify({accion,lead_nombre:lead?.nombre||'',lead_instagram:lead?.instagram||'',detalle,usuario:localStorage.getItem('userEmail')||'',lead_id:lead?.id||'',ts_iso:ts})}).catch(()=>{});
}
function renderActivityLog(){
  const el=document.getElementById('activity-log-container');
  if(!el) return;
  if(!_activityLog.length){el.innerHTML='<div style="color:var(--text3);text-align:center;padding:24px;font-size:13px">Sin actividad registrada</div>';return;}
  const isAdmin=currentUserRole==='admin';
  el.innerHTML=_activityLog.slice(0,40).map((e,i)=>{
    const ts=new Date(e.ts);
    const time=ts.toLocaleDateString('es-AR',{day:'2-digit',month:'short'})+' '+ts.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    const delRef=e.id?`'${e.id}'`:i;
    return `<div class="activity-item">
      <div class="activity-dot"></div>
      <div class="activity-content">
        <div class="activity-title">${e.accion} · <span style="color:var(--text2)">${e.nombre}</span>${e.instagram?` · <span style="color:var(--blue);font-size:11px">@${e.instagram}</span>`:''}</div>
        ${e.detalle?`<div class="activity-detail">${e.detalle}</div>`:''}
        <div style="font-size:10px;color:var(--text3);margin-top:2px">${e.usuario}</div>
      </div>
      <div class="activity-time">${time}</div>
      ${isAdmin?`<button class="btn-icon" onclick="delActivityEntry(${delRef})" style="color:var(--red);margin-left:8px;flex-shrink:0" title="Eliminar registro">×</button>`:''}
    </div>`;
  }).join('');
}
async function delActivityEntry(idOrIdx){
  if(!confirm('¿Eliminar este registro de actividad?'))return;
  if(typeof idOrIdx==='string'){
    try{await apiFetch(`${API_URL}/activity/${idOrIdx}`,{method:'DELETE'});}catch(e){}
    _activityLog=_activityLog.filter(x=>x.id!==idOrIdx);
  } else {
    _activityLog.splice(idOrIdx,1);
  }
  sv('crm_activity_log',_activityLog);
  renderActivityLog();
}

// ========== RENOVACIONES ==========
function renderRenovaciones(){
  const el=document.getElementById('reno-container');
  if(!el) return;
  const hoy=new Date();
  const clients=S.clients.filter(c=>c.fin).map(c=>{
    const fin=new Date(c.fin);
    const diff=Math.round((fin-hoy)/(1000*60*60*24));
    let tipo=null;
    if(diff<0) tipo='overdue';
    else if(diff===0) tipo='danger';
    else if(diff<=7) tipo='warn';
    return{...c,finDate:fin,diff,tipo};
  }).filter(c=>c.tipo).sort((a,b)=>a.diff-b.diff);

  const sumEl=document.getElementById('reno-summary');
  if(sumEl) sumEl.textContent=clients.length?`${clients.length} cliente${clients.length!==1?'s':''} próximos a renovar`:'Sin renovaciones próximas';

  if(!clients.length){el.innerHTML='<div style="color:var(--text3);text-align:center;padding:24px;font-size:13px">No hay clientes próximos a renovar</div>';return;}
  el.innerHTML=clients.map(c=>{
    const label=c.diff<0?`Vencido hace ${Math.abs(c.diff)} días`:c.diff===0?'Renueva hoy':`En ${c.diff} día${c.diff!==1?'s':''}`;
    const idx=S.clients.indexOf(c);
    return `<div class="reno-card ${c.tipo}">
      <div style="flex:1">
        <div style="font-weight:600;color:var(--text);font-size:13px">${c.nombre||'—'}</div>
        ${c.instagram?`<div style="font-size:11px;color:var(--blue)">@${c.instagram}</div>`:''}
        <div style="font-size:11px;color:var(--text3);margin-top:2px">Vence: ${c.finDate.toLocaleDateString('es-AR')}</div>
      </div>
      ${c.cash_collected?`<div style="font-size:13px;font-weight:700;color:var(--gold-light)">${fmtMoney(+c.cash_collected)}</div>`:''}
      <span class="reno-badge ${c.tipo}">${label}</span>
      <button class="btn-icon" onclick="delClient(${idx})" style="color:var(--red);margin-left:8px" title="Eliminar cliente">×</button>
    </div>`;
  }).join('');
}

// ========== CIERRE → CLIENTE ==========
function _mostrarPopupCierre(leadId, lead){
  if(!document.getElementById('modal-cierre')) return;
  const el=id=>document.getElementById(id);
  if(el('cierre-nombre')) el('cierre-nombre').value=lead?.nombre||'';
  if(el('cierre-instagram')) el('cierre-instagram').value=lead?.instagram||'';
  if(el('cierre-cash')) el('cierre-cash').value='';
  const isC4=getCid()==='cliente_4';
  const optMen=el('cierre-opt-mensualidad');
  if(optMen) optMen.style.display=isC4?'':'none';
  if(el('cierre-tipo-pago')){ el('cierre-tipo-pago').value='PIF'; }
  if(el('cierre-comprobante')) el('cierre-comprobante').value='';
  if(el('cierre-comprobante-img')) el('cierre-comprobante-img').value='';
  if(el('cierre-comprobante-preview')){el('cierre-comprobante-preview').src='';el('cierre-comprobante-preview').style.display='none';}
  if(el('cierre-nro-cuotas')) el('cierre-nro-cuotas').value='1';
  if(el('cierre-cuota-section')) el('cierre-cuota-section').style.display='none';
  if(el('cierre-mensualidad-section')) el('cierre-mensualidad-section').style.display='none';
  if(el('cierre-programa-row')) el('cierre-programa-row').style.display='';
  if(el('cierre-cash-label')) el('cierre-cash-label').textContent='Monto cobrado hoy (USD)';
  if(el('cierre-programa')) el('cierre-programa').value='';
  updateCuotaFechas();
  const hoy=new Date();
  const c1=new Date(hoy); c1.setDate(hoy.getDate()+30);
  const c2=new Date(hoy); c2.setDate(hoy.getDate()+60);
  const meses=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  if(el('cierre-fecha-inicio')) el('cierre-fecha-inicio').textContent=hoy.toLocaleDateString('es-AR');
  if(el('cierre-cuota1-fecha')) el('cierre-cuota1-fecha').textContent=c1.toLocaleDateString('es-AR');
  if(el('cierre-cuota2-fecha')) el('cierre-cuota2-fecha').textContent=c2.toLocaleDateString('es-AR');
  if(el('cierre-segunda-cuota')) el('cierre-segunda-cuota').textContent=c1.toLocaleDateString('es-AR');
  if(el('cierre-dia-salida')) el('cierre-dia-salida').textContent='—';
  if(el('cierre-mes')) el('cierre-mes').textContent=meses[hoy.getMonth()]+' '+hoy.getFullYear();
  window._pendingCierre={leadId,lead};
  document.getElementById('modal-cierre').classList.add('open');
}
function toggleCierteCuotaSection(val){
  const sec=document.getElementById('cierre-cuota-section');
  const menSec=document.getElementById('cierre-mensualidad-section');
  const progRow=document.getElementById('cierre-programa-row');
  const progReq=document.getElementById('cierre-programa-req');
  const cashLabel=document.getElementById('cierre-cash-label');
  const esMensualidad=val==='Mensualidad';
  if(sec)     sec.style.display=val==='Cuotas'?'block':'none';
  if(menSec)  menSec.style.display=esMensualidad?'block':'none';
  if(progRow) progRow.style.display=esMensualidad?'none':'';
  if(progReq) progReq.style.display=esMensualidad?'none':'';
  if(cashLabel) cashLabel.textContent=esMensualidad?'Monto mensual (USD)':'Monto cobrado hoy (USD)';
  if(val==='Cuotas') updateCuotaFechas();
  if(esMensualidad){
    const d=new Date(); d.setDate(d.getDate()+30);
    const el=document.getElementById('cierre-proxpago-display');
    if(el) el.textContent=d.toLocaleDateString('es-AR',{day:'2-digit',month:'long',year:'numeric'});
  }
}
function _cierreUpdatePrograma(meses){
  const el=document.getElementById('cierre-dia-salida');
  if(!el) return;
  if(!meses){el.textContent='—';return;}
  const sal=new Date(); sal.setMonth(sal.getMonth()+parseInt(meses));
  el.textContent=sal.toLocaleDateString('es-AR');
}
function _tryIGPreview(url){
  const prev=document.getElementById('igr-url-preview');
  if(!prev) return;
  const match=(url||'').match(/instagram\.com\/(reel|p)\/([A-Za-z0-9_-]+)/);
  if(!match){prev.style.display='none';prev.innerHTML='';return;}
  const code=match[2];
  prev.style.display='block';
  prev.innerHTML=`<iframe src="https://www.instagram.com/p/${code}/embed/" width="320" height="380" frameborder="0" scrolling="no" allowtransparency="true" style="border:none;border-radius:8px;max-width:100%;background:var(--bg2)"></iframe><div style="font-size:10px;color:var(--text3);margin-top:4px">Vista previa (requiere perfil público y conexión)</div>`;
}
function _previewComprobanteImg(input){
  const file=input.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    const prev=document.getElementById('cierre-comprobante-preview');
    if(prev){prev.src=e.target.result;prev.style.display='block';}
  };
  reader.readAsDataURL(file);
}
function updateCuotaFechas(){
  const n=Math.max(1,Math.min(12,parseInt(document.getElementById('cierre-nro-cuotas')?.value)||1));
  const cont=document.getElementById('cierre-cuotas-fechas');
  if(!cont) return;
  const hoy=new Date();
  const rows=[];
  for(let i=1;i<=n;i++){
    const d=new Date(hoy); d.setDate(hoy.getDate()+i*30);
    rows.push(`<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <span style="font-size:11px;color:var(--text3);min-width:56px">Cuota ${i}:</span>
      <span style="color:var(--gold-light);font-weight:600;font-size:11px;min-width:80px">${d.toLocaleDateString('es-AR')}</span>
      <input type="number" id="cierre-monto-cuota-${i}" placeholder="USD" min="0" step="any"
        style="width:110px;padding:4px 8px;font-size:12px;background:var(--bg2);border:1px solid var(--line);border-radius:var(--rs);color:var(--text)">
    </div>`);
  }
  cont.innerHTML=rows.join('');
}
async function saveCierre(){
  const nombre=(document.getElementById('cierre-nombre')?.value||'').trim();
  const instagram=(document.getElementById('cierre-instagram')?.value||'').trim().replace(/^@/,'').toLowerCase();
  const tipoPago=document.getElementById('cierre-tipo-pago')?.value||'Contado';
  const cash=parseFloat(document.getElementById('cierre-cash')?.value)||0;
  const nroCuotas=Math.max(1,parseInt(document.getElementById('cierre-nro-cuotas')?.value)||1);
  const montosCuota=Array.from({length:nroCuotas},(_,i)=>parseFloat(document.getElementById(`cierre-monto-cuota-${i+1}`)?.value)||0);
  const comprobante=(document.getElementById('cierre-comprobante')?.value||'').trim();
  const comprovanteImgEl=document.getElementById('cierre-comprobante-preview');
  const comprovanteImg=comprovanteImgEl?.src&&comprovanteImgEl.style.display!=='none'?comprovanteImgEl.src:'';
  const esCuotas=tipoPago==='Cuotas';
  const esMensualidad=tipoPago==='Mensualidad';
  const programaMeses=parseInt(document.getElementById('cierre-programa')?.value)||0;
  if(!nombre){toast('✗ Nombre es obligatorio');return;}
  if(!esMensualidad&&!programaMeses){toast('✗ Seleccioná el programa');return;}
  if(esMensualidad&&(!cash||cash<=0)){toast('✗ Ingresá el monto mensual');return;}
  if(esCuotas&&montosCuota.every(m=>m<=0)){toast('✗ Ingresá al menos el monto de una cuota');return;}

  // Chequear duplicado por instagram en localStorage
  if(instagram){
    const existe=S.clients.find(c=>(c.instagram||'').toLowerCase()===instagram);
    if(existe){
      toast(`⚠️ Ya existe cliente con @${instagram} — no se duplica`);
      closeModal('modal-cierre');
      window._pendingCierre=null;
      return;
    }
  }

  const hoy=new Date();
  const c1=new Date(hoy); c1.setDate(hoy.getDate()+30);
  const c2=new Date(hoy); c2.setDate(hoy.getDate()+60);
  const sal=esMensualidad?null:new Date(hoy);
  if(!esMensualidad){ sal.setMonth(hoy.getMonth()+programaMeses); }
  const origenLead=window._pendingCierre?.lead?.origen||null;
  const clienteData={
    id:uid(),
    nombre,
    instagram,
    inicio:hoy.toISOString().slice(0,10),
    fin:esMensualidad?null:sal.toISOString().slice(0,10),
    pp:esCuotas?'CUOTA':tipoPago,
    mod:'—',
    proxpago:c1.toISOString().slice(0,10),
    estado:'Al día',
    proxpaso:'Onboarding',
    road:'',
    cash_collected:cash,
    programa:esMensualidad?'Mensualidad':programaMeses+' meses',
    ...(esCuotas?{nroCuotas}:{}),
    comprobante,
    comprovanteImg,
    origen:origenLead
  };

  // Intentar crear en Railway; si no existe endpoint, guardamos local
  try{
    const res=await apiFetch(`${API_URL}/clientes`,{method:'POST',body:JSON.stringify({nombre,instagram,inicio:clienteData.inicio,fin:clienteData.fin,tipo_pago:tipoPago,cash_collected:cash,comprobante,estado:'Al día',pp:clienteData.pp,proxpaso:clienteData.proxpaso,road:clienteData.road,mod:clienteData.mod,proxpago:clienteData.proxpago,programa:clienteData.programa,origen:origenLead})});
    if(res.ok){
      const data=await res.json().catch(()=>({}));
      if(data?.id) clienteData.id=data.id;
      console.log('[saveCierre] cliente creado en Railway:', data);
    } else {
      const body=await res.text().catch(()=>'');
      if(res.status===409){
        toast(`⚠️ Ya existe cliente con @${instagram} en el sistema`);
        closeModal('modal-cierre'); window._pendingCierre=null; return;
      }
      console.warn('[saveCierre] Railway respondió',res.status,body,'— guardando local');
    }
  }catch(e){
    console.warn('[saveCierre] Sin endpoint /clientes, guardando local:',e.message);
  }

  if(cash>0){
    const ingItem={id:uid(),concepto:'Venta Nueva',fecha:hoy.toISOString().slice(0,10),tipo:'Venta Nueva',tipoPago,usd:cash,ars:0,eur:0,nombre,instagram};
    S.ing.push(ingItem);save('ing');
    apiFetch(`${API_URL}/ingresos`,{method:'POST',body:JSON.stringify(ingItem)}).then(r=>r.ok?r.json():null).then(d=>{if(d?.id){const f=S.ing.find(x=>x.id===ingItem.id);if(f){f.id=d.id;save('ing');}}}).catch(()=>{});
  }
  S.clients.push(clienteData);
  save('clients');
  if(esCuotas){
    for(let i=0;i<nroCuotas;i++){
      const f=new Date(hoy); f.setDate(hoy.getDate()+(i+1)*30);
      const cuota={id:uid(),clienteId:String(clienteData.id),clienteNombre:nombre,clienteIg:instagram,numero:i+2,fecha:f.toISOString().slice(0,10),monto:montosCuota[i]||0,pagado:false};
      S.cuotas.push(cuota);
      apiFetch(`${API_URL}/cuotas`,{method:'POST',body:JSON.stringify({id:cuota.id,ref_cliente_id:cuota.clienteId,cliente_nombre:cuota.clienteNombre,cliente_ig:cuota.clienteIg,numero:cuota.numero,fecha:cuota.fecha,monto:cuota.monto,pagado:false})})
        .then(r=>r.ok?r.json():null)
        .then(d=>{if(d?.id&&d.id!==cuota.id){const x=S.cuotas.find(q=>q.id===cuota.id);if(x){x.id=d.id;save('cuotas');}}})
        .catch(()=>{});
    }
    save('cuotas');
  }
  // Atribución y cambio de estado del lead
  const leadCerrado = instagram
    ? leadsCache.find(l=>(l.instagram||'').toLowerCase()===instagram)
        || leadsCache.find(l=>(l.nombre||'').toLowerCase()===nombre.toLowerCase())
    : leadsCache.find(l=>(l.nombre||'').toLowerCase()===nombre.toLowerCase());

  if(leadCerrado){
    const totalBilled=esCuotas?montosCuota.reduce((a,b)=>a+b,0):cash;
    _atribuirContenido(leadCerrado,'ventas').catch(()=>{});
    if(totalBilled>0) _atribuirContenidoMonto(leadCerrado,totalBilled).catch(()=>{});
    if(cash>0) _atribuirCashCollected(leadCerrado,cash).catch(()=>{});

    // Cambiar estado del lead a Cerrada
    if(leadCerrado.estado !== 'Cerrada'){
      const tsNow=new Date().toISOString();
      leadCerrado.estado='Cerrada';
      leadCerrado.estado_updated_at=tsNow;
      leadCerrado.updated_at=tsNow;
      apiFetch(`${API_URL}/leads/${leadCerrado.id}`,{
        method:'PATCH',
        body:JSON.stringify({estado:'Cerrada',estado_updated_at:tsNow,updated_at:tsNow})
      }).catch(e=>console.warn('[saveCierre] estado lead:',e.message));
      _renderEstadoCounters(leadsCache);
      _renderFunnel(leadsCache);
    }
  }
  _logActivity('Cliente creado',{nombre,instagram},'Desde cierre de lead');
  if(typeof renderClients==='function') renderClients();
  playCashSound();closeModal('modal-cierre');
  window._pendingCierre=null;
  toast('✓ Cliente creado y venta registrada');
}

// ========== TEAM TRACKING ==========
let _teamPanelOpen=false;
const _teamSessions=[];

function _initTeam(){
  const email=localStorage.getItem('userEmail')||'';
  const rol=currentUserRole||'setter';
  const raw=email.split('@')[0]||email;
  const nombre=raw.replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  _teamSessions.splice(0,_teamSessions.length,{email,rol,nombre,lastSeen:new Date().toISOString()});
  const badge=document.getElementById('team-count');
  if(badge) badge.textContent=_teamSessions.length;
  _heartbeat();
  _pollTeam();
  setInterval(_heartbeat, 2*60*1000);
  setInterval(_pollTeam, 2*60*1000);
}

async function _heartbeat(){
  const email=localStorage.getItem('userEmail')||'';
  const rol=currentUserRole||'setter';
  const raw=email.split('@')[0]||email;
  const nombre=raw.replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  try{await apiFetch(`${API_URL}/team/heartbeat`,{method:'POST',body:JSON.stringify({rol,nombre})});}catch{}
}

function toggleTeamPanel(){
  _teamPanelOpen=!_teamPanelOpen;
  const panel=document.getElementById('team-panel');
  if(!panel) return;
  panel.classList.toggle('open',_teamPanelOpen);
  if(_teamPanelOpen) renderTeamPanel();
}

function renderTeamPanel(){
  const panel=document.getElementById('team-panel');
  if(!panel) return;
  const roleColors={admin:'#e0a848',closer:'#6090d4',setter:'#5cb87a'};
  const isAdmin=currentUserRole==='admin';
  const me=localStorage.getItem('userEmail')||'';
  panel.innerHTML=`
    <div class="team-panel-hdr">
      <span>Sesiones activas hoy</span>
      <span style="color:var(--text2)">${_teamSessions.length} online</span>
    </div>
    ${_teamSessions.map(u=>{
      const col=roleColors[u.rol]||'var(--text3)';
      const init=(u.nombre||u.email).slice(0,2).toUpperCase();
      const isMe=u.email===me;
      return `<div class="team-panel-row">
        <div class="team-avatar" style="background:${col}22;border:1px solid ${col}44;color:${col}">${init}</div>
        <div class="team-info">
          <div class="team-name">${u.nombre||u.email}${isMe?' <span style="font-size:9px;color:var(--text3)">(vos)</span>':''}</div>
          <div class="team-role" style="color:${col}">${u.rol}</div>
        </div>
        ${isAdmin?`<span style="font-size:9px;color:var(--text3);padding:1px 6px;border-radius:10px;border:1px solid rgba(255,255,255,0.06)">${u.email}</span>`:''}
      </div>`;
    }).join('')}
    <div style="padding:8px 14px;font-size:10px;color:var(--text3);border-top:1px solid var(--line)">El conteo se actualiza en tiempo real si la API /team está activa</div>`;
}

document.addEventListener('click',e=>{
  if(_teamPanelOpen && !e.target.closest('.team-badge')){
    _teamPanelOpen=false;
    document.getElementById('team-panel')?.classList.remove('open');
  }
});

async function _pollTeam(){
  try{
    const res=await apiFetch(`${API_URL}/team`);
    if(res.ok){
      const d=await res.json();
      if(Array.isArray(d)&&d.length){
        _teamSessions.splice(0,_teamSessions.length,...d);
        const badge=document.getElementById('team-count');
        if(badge) badge.textContent=_teamSessions.length;
        if(_teamPanelOpen) renderTeamPanel();
      }
    }
  }catch{}
}

// ========== INSTAGRAM MODULE ==========
function _getIgKey(){return'crm_ig_'+getCid();}
const _igDefaults={
  account:'@tucuenta',followers:0,followersGrowth:0,watchTime:0,reels:[],carruseles:[]
};
let _igData=ld(_getIgKey(),_igDefaults);
if(!Array.isArray(_igData.reels)) _igData.reels=[];
if(!Array.isArray(_igData.carruseles)) _igData.carruseles=[];
function _saveIG(){sv(_getIgKey(),_igData);}

let _igSelectedReel=null;

let _igSelectedCarrusel=null;

function renderIG(){
  const ig=_igData;
  const reels=ig.reels||[];
  const cars=ig.carruseles||[];
  const n=reels.length, nc=cars.length;
  const avg=(arr,key)=>arr.length?Math.round(arr.reduce((a,r)=>a+(+r[key]||0),0)/arr.length):0;
  const avgEng=arr=>arr.length?+(arr.reduce((a,r)=>{
    const v=+r.views||0; return v>0?a+((+r.likes||0)+(+r.comments||0)+(+r.saves||0))/v*100:a;
  },0)/arr.length).toFixed(1):0;
  const totalFollowersReels=reels.reduce((a,r)=>a+(+r.followersFromReel||0),0);
  const totalFollowersCars=cars.reduce((a,c)=>a+(+c.followersFromCarrusel||0),0);
  const totalFollowers=(ig.followers||0)+totalFollowersReels+totalFollowersCars;
  const fmtK=v=>v>=1000?(v/1000).toFixed(1)+'K':String(v);
  const metricsEl=document.getElementById('ig-metrics');
  if(!metricsEl) return;
  metricsEl.innerHTML=`
    <div class="ig-stat-card" style="cursor:pointer" onclick="openModal('modal-ig-cuenta')" title="Editar datos de cuenta">
      <div class="ig-stat-label">Seguidores totales <span style="font-size:8px;opacity:.4">✎</span></div>
      <div class="ig-stat-value">${totalFollowers?fmt(totalFollowers):'—'}</div>
      <div class="ig-stat-sub" style="color:#5cb87a">${ig.followersGrowth?'+'+ig.followersGrowth+'% este mes':'Ingresar datos →'}</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Views prom. reels</div>
      <div class="ig-stat-value">${n?fmtK(avg(reels,'views')):'—'}</div>
      <div class="ig-stat-sub">por reel · ${n} reels</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Eng. prom. reels</div>
      <div class="ig-stat-value">${n?avgEng(reels)+'%':'—'}</div>
      <div class="ig-stat-sub">likes+coment+guard / views</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Seguidores de reels</div>
      <div class="ig-stat-value">${totalFollowersReels?fmtK(totalFollowersReels):'—'}</div>
      <div class="ig-stat-sub">total acumulado</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Prom. seg. por reel</div>
      <div class="ig-stat-value">${n?fmtK(Math.round(totalFollowersReels/n)):'—'}</div>
      <div class="ig-stat-sub">promedio por pieza</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Views prom. carruseles</div>
      <div class="ig-stat-value">${nc?fmtK(avg(cars,'views')):'—'}</div>
      <div class="ig-stat-sub">por carrusel · ${nc} carruseles</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Eng. prom. carruseles</div>
      <div class="ig-stat-value">${nc?avgEng(cars)+'%':'—'}</div>
      <div class="ig-stat-sub">likes+coment+guard / views</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Seguidores de carruseles</div>
      <div class="ig-stat-value">${totalFollowersCars?fmtK(totalFollowersCars):'—'}</div>
      <div class="ig-stat-sub">total acumulado</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Prom. seg. por carrusel</div>
      <div class="ig-stat-value">${nc?fmtK(Math.round(totalFollowersCars/nc)):'—'}</div>
      <div class="ig-stat-sub">promedio por pieza</div>
    </div>
    <div class="ig-stat-card" style="cursor:pointer" onclick="openModal('modal-ig-cuenta')" title="Editar Watch Time">
      <div class="ig-stat-label">Watch Time prom <span style="font-size:8px;opacity:.4">✎</span></div>
      <div class="ig-stat-value">${ig.watchTime?ig.watchTime+'s':'—'}</div>
      <div class="ig-stat-sub">desde Instagram Insights</div>
    </div>`;

  _igSelectedReel=null;
  _igSelectedCarrusel=null;
  _renderIGReels();
  _renderIGCarruseles();
}

function _renderIGReels(){
  const grid=document.getElementById('ig-reels-grid');
  if(!grid) return;
  const detail=document.getElementById('ig-reel-detail');
  if(detail) detail.style.display='none';
  const fmtK=n=>n>=1000?(n/1000).toFixed(1)+'K':String(n);
  if(!_igData.reels.length){
    grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);font-size:13px">Sin reels cargados. Usá "+ Agregar reel" para registrar uno.</div>';
    return;
  }
  grid.innerHTML=_igData.reels.map(r=>{
    const igMatch=r.url?(r.url.match(/instagram\.com\/(reel|p)\/([A-Za-z0-9_-]+)/)):null;
    const thumb=igMatch
      ?`<iframe src="https://www.instagram.com/p/${igMatch[2]}/embed/" style="position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:none" scrolling="no" frameborder="0" allowtransparency="true"></iframe>`
      :`<div class="ig-reel-play">▶</div>`;
    return `
    <div class="ig-reel-card" onclick="_abrirIGReel('${r.id}')">
      <div class="ig-reel-thumb">
        ${thumb}
        <div class="ig-reel-views">${fmtK(r.views)} views</div>
      </div>
      <div class="ig-reel-info">
        <div class="ig-reel-title" title="${r.title}">${r.title}</div>
        ${r.url?`<div style="font-size:10px;color:var(--blue);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px"><a href="${r.url}" target="_blank" onclick="event.stopPropagation()" style="color:var(--blue)">Ver en Instagram ↗</a></div>`:''}
        <div class="ig-reel-stats">
          <div class="ig-reel-stat">❤ <span>${fmtK(r.likes)}</span></div>
          <div class="ig-reel-stat">💬 <span>${r.comments}</span></div>
          <div class="ig-reel-stat" title="Comentarios únicos">👤 <span>${r.comentariosUnicos??Math.round((r.comments||0)/2)}</span></div>
          <div class="ig-reel-stat">🔖 <span>${fmtK(r.saves)}</span></div>
          <div class="ig-reel-stat">📤 <span>${r.shares}</span></div>
        </div>
        <div style="margin-top:6px;text-align:right">
          <button class="btn-icon" onclick="deleteIGReel('${r.id}',event)" style="color:var(--red)" title="Eliminar reel">×</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function _abrirIGReel(id){
  const r=_igData.reels.find(x=>x.id===id);
  if(!r) return;
  _igSelectedReel=r;
  const detail=document.getElementById('ig-reel-detail');
  if(!detail) return;
  detail.style.display='block';
  document.getElementById('ig-detail-title').textContent=r.title;
  document.getElementById('ig-detail-date').textContent=r.date+(r.url?` · `:'');
  const urlEl=document.getElementById('ig-detail-url');
  if(urlEl){urlEl.style.display=r.url?'inline':'none';urlEl.href=r.url||'#';}
  const retColor=r.retention>=70?'var(--green)':r.retention>=50?'var(--amber)':'var(--red)';
  detail.querySelector('.ig-detail-stats').innerHTML=`
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.views>=1000?(r.views/1000).toFixed(1)+'K':r.views}</div><div class="ig-detail-lbl">Views</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.likes}</div><div class="ig-detail-lbl">Likes</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.comments}</div><div class="ig-detail-lbl">Comentarios</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.comentariosUnicos??Math.round((r.comments||0)/2)}</div><div class="ig-detail-lbl">Únicos</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.saves}</div><div class="ig-detail-lbl">Guardados</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.shares}</div><div class="ig-detail-lbl">Compartidos</div></div>
    ${r.followersFromReel?`<div class="ig-detail-stat"><div class="ig-detail-val" style="color:#5cb87a">${r.followersFromReel}</div><div class="ig-detail-lbl">Seguidores</div></div>`:''}`;
  detail.querySelector('.ig-retention-fill').style.cssText=`width:${r.retention||0}%;background:${retColor}`;
  detail.querySelector('.ig-retention-pct').textContent=(r.retention||0)+'%';
}

function openIGReelModal(){
  // Limpiar campos antes de abrir
  ['igr-titulo','igr-url','igr-fecha','igr-views','igr-likes','igr-comments','igr-saves','igr-shares','igr-retention','igr-followers'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.value=el.type==='number'?'0':'';}
  });
  const fecha=document.getElementById('igr-fecha');
  if(fecha) fecha.value=new Date().toISOString().slice(0,10);
  const prev=document.getElementById('igr-url-preview');
  if(prev){prev.style.display='none';prev.innerHTML='';}
  openModal('modal-ig-reel');
}

async function saveIGReel(){
  const titulo=(document.getElementById('igr-titulo')?.value||'').trim();
  if(!titulo){toast('✗ Ingresá el título del reel');return;}
  const comments=parseInt(document.getElementById('igr-comments')?.value)||0;
  const reel={
    id:'ig'+uid().slice(0,8),
    title:titulo,
    url:(document.getElementById('igr-url')?.value||'').trim(),
    date:document.getElementById('igr-fecha')?.value||new Date().toISOString().slice(0,10),
    views:parseInt(document.getElementById('igr-views')?.value)||0,
    likes:parseInt(document.getElementById('igr-likes')?.value)||0,
    comments,
    comentariosUnicos:Math.round(comments/2),
    saves:parseInt(document.getElementById('igr-saves')?.value)||0,
    shares:parseInt(document.getElementById('igr-shares')?.value)||0,
    retention:Math.min(100,Math.max(0,parseInt(document.getElementById('igr-retention')?.value)||0)),
    followersFromReel:parseInt(document.getElementById('igr-followers')?.value)||0,
  };
  try{
    const res=await apiFetch(`${API_URL}/ig/reels`,{method:'POST',body:JSON.stringify(reel)});
    if(!res.ok) throw new Error();
    const saved=await res.json();
    _igData.reels.unshift(saved);
  }catch(e){_igData.reels.unshift(reel);_saveIG();}
  closeModal('modal-ig-reel');renderIG();toast('✓ Reel agregado');
}

async function deleteIGReel(id,e){
  e.stopPropagation();
  if(!confirm('¿Eliminar este reel?')) return;
  try{await apiFetch(`${API_URL}/ig/reels/${id}`,{method:'DELETE'});}catch(e){}
  _igData.reels=_igData.reels.filter(r=>r.id!==id);
  _saveIG();
  const detail=document.getElementById('ig-reel-detail');
  if(detail) detail.style.display='none';
  renderIG();toast('✓ Reel eliminado');
}

function openIGCuentaModal(){
  const ig=_igData;
  ['ig-c-account','ig-c-followers','ig-c-growth','ig-c-watchtime'].forEach((fid,i)=>{
    const keys=['account','followers','followersGrowth','watchTime'];
    const el=document.getElementById(fid);
    if(el) el.value=ig[keys[i]]||'';
  });
  openModal('modal-ig-cuenta');
}

async function saveIGCuenta(){
  _igData.account=(document.getElementById('ig-c-account')?.value||'').trim()||'@tucuenta';
  _igData.followers=parseInt(document.getElementById('ig-c-followers')?.value)||0;
  _igData.followersGrowth=parseFloat(document.getElementById('ig-c-growth')?.value)||0;
  _igData.watchTime=parseFloat(document.getElementById('ig-c-watchtime')?.value)||0;
  _saveIG();
  try{
    await apiFetch(`${API_URL}/ig/cuenta`,{method:'PUT',body:JSON.stringify({
      account:_igData.account,followers:_igData.followers,
      followersGrowth:_igData.followersGrowth,watchTime:_igData.watchTime
    })});
  }catch(e){}
  closeModal('modal-ig-cuenta');renderIG();toast('✓ Métricas de cuenta actualizadas');
}

// ===== CARRUSELES =====
function _renderIGCarruseles(){
  const grid=document.getElementById('ig-carruseles-grid');
  if(!grid) return;
  const detail=document.getElementById('ig-carrusel-detail');
  if(detail) detail.style.display='none';
  const fmtK=n=>n>=1000?(n/1000).toFixed(1)+'K':String(n);
  if(!_igData.carruseles.length){
    grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);font-size:13px">Sin carruseles cargados. Usá "+ Agregar carrusel" para registrar uno.</div>';
    return;
  }
  grid.innerHTML=_igData.carruseles.map(r=>{
    const igMatch=r.url?(r.url.match(/instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/)):null;
    const thumb=igMatch
      ?`<iframe src="https://www.instagram.com/p/${igMatch[2]}/embed/" style="position:absolute;inset:0;width:100%;height:100%;border:none;pointer-events:none" scrolling="no" frameborder="0" allowtransparency="true"></iframe>`
      :`<div class="ig-reel-play">▶</div>`;
    return `
    <div class="ig-reel-card" onclick="_abrirIGCarrusel('${r.id}')">
      <div class="ig-reel-thumb">
        ${thumb}
        <div class="ig-reel-views">${fmtK(r.views)} views</div>
      </div>
      <div class="ig-reel-info">
        <div class="ig-reel-title" title="${r.title}">${r.title}</div>
        ${r.url?`<div style="font-size:10px;color:var(--blue);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px"><a href="${r.url}" target="_blank" onclick="event.stopPropagation()" style="color:var(--blue)">Ver en Instagram ↗</a></div>`:''}
        <div class="ig-reel-stats">
          <div class="ig-reel-stat">❤ <span>${fmtK(r.likes)}</span></div>
          <div class="ig-reel-stat">💬 <span>${r.comments}</span></div>
          <div class="ig-reel-stat">🔖 <span>${fmtK(r.saves)}</span></div>
          <div class="ig-reel-stat">📤 <span>${r.shares}</span></div>
        </div>
        <div style="margin-top:6px;text-align:right">
          <button class="btn-icon" onclick="deleteIGCarrusel('${r.id}',event)" style="color:var(--red)" title="Eliminar carrusel">×</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function _abrirIGCarrusel(id){
  const r=_igData.carruseles.find(x=>x.id===id);
  if(!r) return;
  _igSelectedCarrusel=r;
  const detail=document.getElementById('ig-carrusel-detail');
  if(!detail) return;
  detail.style.display='block';
  document.getElementById('ig-carrusel-detail-title').textContent=r.title;
  document.getElementById('ig-carrusel-detail-date').textContent=r.date+(r.url?' · ':'');
  const urlEl=document.getElementById('ig-carrusel-detail-url');
  if(urlEl){urlEl.style.display=r.url?'inline':'none';urlEl.href=r.url||'#';}
  const retColor=r.retention>=70?'var(--green)':r.retention>=50?'var(--amber)':'var(--red)';
  detail.querySelector('.ig-carrusel-detail-stats').innerHTML=`
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.views>=1000?(r.views/1000).toFixed(1)+'K':r.views}</div><div class="ig-detail-lbl">Views</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.likes}</div><div class="ig-detail-lbl">Likes</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.comments}</div><div class="ig-detail-lbl">Comentarios</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.saves}</div><div class="ig-detail-lbl">Guardados</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.shares}</div><div class="ig-detail-lbl">Compartidos</div></div>
    ${r.followersFromCarrusel?`<div class="ig-detail-stat"><div class="ig-detail-val" style="color:#5cb87a">${r.followersFromCarrusel}</div><div class="ig-detail-lbl">Seguidores</div></div>`:''}`;
  detail.querySelector('.ig-carrusel-retention-fill').style.cssText=`width:${r.retention||0}%;background:${retColor}`;
  detail.querySelector('.ig-carrusel-retention-pct').textContent=(r.retention||0)+'%';
}

function openIGCarruselModal(){
  ['igc-titulo','igc-url','igc-fecha','igc-views','igc-likes','igc-comments','igc-saves','igc-shares','igc-retention','igc-followers'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.value=el.type==='number'?'0':'';}
  });
  const fecha=document.getElementById('igc-fecha');
  if(fecha) fecha.value=new Date().toISOString().slice(0,10);
  openModal('modal-ig-carrusel');
}

async function saveIGCarrusel(){
  const titulo=(document.getElementById('igc-titulo')?.value||'').trim();
  if(!titulo){toast('✗ Ingresá el título del carrusel');return;}
  const comments=parseInt(document.getElementById('igc-comments')?.value)||0;
  const car={
    id:'igc'+Date.now().toString(36),
    title:titulo,
    url:(document.getElementById('igc-url')?.value||'').trim(),
    date:document.getElementById('igc-fecha')?.value||new Date().toISOString().slice(0,10),
    views:parseInt(document.getElementById('igc-views')?.value)||0,
    likes:parseInt(document.getElementById('igc-likes')?.value)||0,
    comments,
    saves:parseInt(document.getElementById('igc-saves')?.value)||0,
    shares:parseInt(document.getElementById('igc-shares')?.value)||0,
    retention:Math.min(100,Math.max(0,parseInt(document.getElementById('igc-retention')?.value)||0)),
    followersFromCarrusel:parseInt(document.getElementById('igc-followers')?.value)||0,
  };
  try{
    const res=await apiFetch(`${API_URL}/ig/carruseles`,{method:'POST',body:JSON.stringify(car)});
    if(!res.ok) throw new Error();
    const saved=await res.json();
    _igData.carruseles.unshift(saved);
  }catch(e){_igData.carruseles.unshift(car);_saveIG();}
  closeModal('modal-ig-carrusel');renderIG();toast('✓ Carrusel agregado');
}

async function deleteIGCarrusel(id,e){
  e.stopPropagation();
  if(!confirm('¿Eliminar este carrusel?')) return;
  try{await apiFetch(`${API_URL}/ig/carruseles/${id}`,{method:'DELETE'});}catch(e){}
  _igData.carruseles=_igData.carruseles.filter(r=>r.id!==id);
  _saveIG();
  const detail=document.getElementById('ig-carrusel-detail');
  if(detail) detail.style.display='none';
  renderIG();toast('✓ Carrusel eliminado');
}

// ========== EQUIPO ==========
let _equipo = { period: 'semana', mes: '' };

let _equipoMembers=[];
let _equipoExpanded=new Set();
let _equipoAddingRole=null;
let _equipoRuleTimer=null;

function calcCommission(revenue, rules){
  const gteRules=(rules||[]).filter(r=>r.cond==='gte').sort((a,b)=>b.val-a.val);
  const ltRules =(rules||[]).filter(r=>r.cond==='lt').sort((a,b)=>a.val-b.val);
  for(const r of gteRules){ if(revenue>=r.val) return {pct:r.pct,rule:r}; }
  for(const r of ltRules){  if(revenue<r.val)  return {pct:r.pct,rule:r}; }
  return {pct:0,rule:null};
}
function _eqInRange(dateStr){
  if(!dateStr) return false;
  const d=_parseDate(dateStr), now=new Date();
  if(!d||isNaN(d)) return false;
  if(_equipo.mes!==''){
    const m=parseInt(_equipo.mes,10), yr=now.getFullYear();
    return d.getMonth()===m && d.getFullYear()===yr;
  }
  if(_equipo.period==='semana'){
    const w=new Date(now); w.setDate(now.getDate()-7); w.setHours(0,0,0,0);
    return d>=w;
  }
  return false;
}
function equipoSetPeriod(p){ _equipo.period=p; _equipo.mes=''; renderEquipo(); }
function equipoSetMes(m){ _equipo.mes=m; if(m!=='') _equipo.period=''; renderEquipo(); }

async function fetchEquipoMembers(){
  try{
    const res=await apiFetch(`${API_URL}/equipo/members`);
    if(res.ok) _equipoMembers=await res.json();
  }catch(e){}
  renderEquipo();
}
function equipoToggleExpand(id){ _equipoExpanded.has(id)?_equipoExpanded.delete(id):_equipoExpanded.add(id); renderEquipo(); }
function equipoShowAddForm(role){ _equipoAddingRole=role; renderEquipo(); setTimeout(()=>document.getElementById('eq-new-nombre')?.focus(),50); }
function equipoHideAddForm(){ _equipoAddingRole=null; renderEquipo(); }
async function equipoConfirmAddMember(){
  const nombre=(document.getElementById('eq-new-nombre')?.value||'').trim();
  const role=_equipoAddingRole;
  if(!nombre){toast('Ingresá un nombre');return;}
  try{
    const res=await apiFetch(`${API_URL}/equipo/members`,{method:'POST',body:JSON.stringify({nombre,role})});
    if(!res.ok){toast('✗ Error al agregar');return;}
    const m=await res.json();
    _equipoMembers.push(m);
    _equipoExpanded.add(m.id);
    _equipoAddingRole=null;
    renderEquipo();
    toast(`${role} agregado ✓`);
  }catch(e){toast('✗ Error de conexión');}
}
async function equipoDeleteMember(id){
  if(!confirm('¿Eliminar este miembro del equipo?'))return;
  try{
    const res=await apiFetch(`${API_URL}/equipo/members/${id}`,{method:'DELETE'});
    if(!res.ok){toast('✗ Error al eliminar');return;}
    _equipoMembers=_equipoMembers.filter(m=>m.id!==id);
    _equipoExpanded.delete(id);
    renderEquipo();
  }catch(e){toast('✗ Error de conexión');}
}
async function equipoMemberAddRule(memberId){
  const m=_equipoMembers.find(x=>x.id===memberId); if(!m) return;
  const rules=[...(m.rules||[]),{id:uid(),cond:'gte',val:0,pct:0}];
  await _equipoSaveMemberRules(memberId,rules);
}
async function equipoMemberDeleteRule(memberId,ruleId){
  const m=_equipoMembers.find(x=>x.id===memberId); if(!m) return;
  const rules=(m.rules||[]).filter(r=>r.id!==ruleId);
  await _equipoSaveMemberRules(memberId,rules);
}
function equipoMemberUpdateRule(memberId,ruleId,field,val){
  const m=_equipoMembers.find(x=>x.id===memberId); if(!m) return;
  const rule=(m.rules||[]).find(r=>r.id===ruleId); if(!rule) return;
  if(field==='val'||field==='pct') rule[field]=parseFloat(val)||0; else rule[field]=val;
  clearTimeout(_equipoRuleTimer);
  _equipoRuleTimer=setTimeout(()=>_equipoSaveMemberRules(memberId,m.rules),600);
}
async function _equipoSaveMemberRules(memberId,rules){
  const m=_equipoMembers.find(x=>x.id===memberId); if(!m) return;
  m.rules=rules;
  try{ await apiFetch(`${API_URL}/equipo/members/${memberId}`,{method:'PATCH',body:JSON.stringify({rules})}); }catch(e){}
  renderEquipo();
}

function renderEquipo(){
  const container=document.getElementById('equipo-content');
  if(!container) return;
  const revenue=S.ing.filter(x=>_eqInRange(x.fecha)).reduce((a,x)=>a+(+x.usd||0),0);
  const periodCalls=callsCache.filter(c=>_eqInRange(c.created_at));
  const agendasCount=periodCalls.length;
  const cuotasCount=periodCalls.filter(c=>(c.estado||'')==='Cierre Cuotas').length;
  const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const periodLabel=_equipo.mes!==''?MESES[parseInt(_equipo.mes,10)]:'Esta semana';

  const setters=_equipoMembers.filter(m=>m.role==='setter');
  const closers=_equipoMembers.filter(m=>m.role==='closer');

  function getMemberRevenue(m){
    if(m.role==='setter') return revenue;
    const closedByMe=periodCalls.filter(c=>['Cierre','Cierre Cuotas'].includes(c.estado||'')&&(c.closer||'').toLowerCase().trim()===m.nombre.toLowerCase().trim());
    const igs=new Set(closedByMe.map(c=>(c.instagram||'').toLowerCase().replace(/^@/,'')).filter(Boolean));
    if(!igs.size) return 0;
    return S.ing.filter(x=>_eqInRange(x.fecha)&&x.concepto==='Venta Nueva'&&igs.has((x.instagram||'').toLowerCase().replace(/^@/,''))).reduce((a,x)=>a+(+x.usd||0),0);
  }

  const totalTeam=_equipoMembers.reduce((a,m)=>{
    const mr=getMemberRevenue(m);
    const c=calcCommission(mr,m.rules||[]);
    return a+mr*(c.pct/100);
  },0);

  function ruleRow(memberId,r){
    return `<div class="eq-rule-row">
      <span class="eq-rule-if">Si facturación</span>
      <select class="eq-rule-sel" onchange="equipoMemberUpdateRule('${memberId}','${r.id}','cond',this.value)">
        <option value="gte" ${r.cond==='gte'?'selected':''}>≥</option>
        <option value="lt"  ${r.cond==='lt' ?'selected':''}>＜</option>
      </select>
      <input class="eq-rule-inp" type="number" value="${r.val}" min="0"
        onblur="equipoMemberUpdateRule('${memberId}','${r.id}','val',this.value)" onclick="this.select()">
      <span class="eq-rule-arrow">→</span>
      <input class="eq-rule-inp eq-rule-pct" type="number" value="${r.pct}" min="0" max="100" step="0.1"
        onblur="equipoMemberUpdateRule('${memberId}','${r.id}','pct',this.value)" onclick="this.select()">
      <span class="eq-rule-pct-sym">%</span>
      <button class="eq-rule-del" onclick="equipoMemberDeleteRule('${memberId}','${r.id}')">×</button>
    </div>`;
  }

  function memberCard(m, countersHtml, memberRevenue){
    const comm=calcCommission(memberRevenue,m.rules||[]);
    const amt=memberRevenue*(comm.pct/100);
    const expanded=_equipoExpanded.has(m.id);
    const roleColor=m.role==='setter'?'var(--green)':'var(--blue)';
    const detail=!(m.rules||[]).length?'Sin reglas configuradas'
      :!comm.rule?'Sin regla que aplique al monto actual'
      :`${comm.pct}% sobre ${fmtUSD(memberRevenue)} · regla: ${comm.rule.cond==='gte'?'≥':'<'} $${fmt(comm.rule.val)}`;
    return `<div class="eq-member-card">
      <div class="eq-member-hdr">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:34px;height:34px;border-radius:50%;background:${roleColor}22;border:1px solid ${roleColor}44;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:${roleColor}">${m.nombre.slice(0,2).toUpperCase()}</div>
          <div>
            <div style="font-size:14px;font-weight:600;color:var(--text)">${m.nombre}</div>
            <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">${m.role}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="text-align:right">
            <div style="font-size:18px;font-weight:700;color:var(--text);font-family:'Inter',sans-serif">${fmtUSD(amt)}</div>
            <div style="font-size:10px;color:${comm.rule?'var(--gold)':'var(--text3)'}">${comm.rule?comm.pct+'% comisión':'sin regla'}</div>
          </div>
          <button class="eq-add-btn" onclick="equipoToggleExpand('${m.id}')" style="padding:5px 10px">${expanded?'▲ Reglas':'▼ Reglas'}</button>
          <button class="eq-rule-del" onclick="equipoDeleteMember('${m.id}')" style="font-size:16px;opacity:.4" title="Eliminar">×</button>
        </div>
      </div>
      ${countersHtml?`<div class="eq-counters" style="margin:10px 0 0">${countersHtml}</div>`:''}
      ${expanded?`<div class="eq-member-rules">
        <div style="font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">
          Reglas de comisión
          <span style="font-size:10px;color:var(--text3);font-weight:400;margin-left:6px">· ${detail}</span>
        </div>
        ${(m.rules||[]).length===0?'<div class="eq-empty-rules">Sin reglas. Agregá una para calcular comisiones.</div>':''}
        ${(m.rules||[]).map(r=>ruleRow(m.id,r)).join('')}
        <button class="eq-add-btn" style="margin-top:8px" onclick="equipoMemberAddRule('${m.id}')">+ Agregar regla</button>
      </div>`:''}
    </div>`;
  }

  function addForm(role){
    return `<div class="eq-add-form">
      <input id="eq-new-nombre" class="eq-rule-inp" placeholder="Nombre del ${role}…" style="width:200px"
        onkeydown="if(event.key==='Enter')equipoConfirmAddMember();if(event.key==='Escape')equipoHideAddForm()">
      <button class="btn btn-gold" style="padding:6px 14px;font-size:12px" onclick="equipoConfirmAddMember()">Guardar</button>
      <button class="btn btn-outline" style="padding:6px 12px;font-size:12px" onclick="equipoHideAddForm()">Cancelar</button>
    </div>`;
  }

  container.innerHTML=`
<style>
.eq-wrap{max-width:960px;margin:0 auto;}
.eq-filter-row{display:flex;align-items:center;gap:8px;margin-bottom:24px;flex-wrap:wrap;}
.eq-mes-sel{background:var(--surface-2);border:1px solid var(--line);color:var(--text2);border-radius:var(--rs);padding:7px 12px;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;letter-spacing:.04em;text-transform:uppercase;}
.eq-mes-sel:focus{outline:none;border-color:var(--gold-border);}
.eq-top-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:22px;}
@media(max-width:700px){.eq-top-grid{grid-template-columns:1fr;}}
.eq-kpi{background:var(--metric);border:1px solid var(--line);border-radius:var(--r);padding:18px 20px 16px;box-shadow:var(--shadow-md);position:relative;overflow:hidden;}
.eq-kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);}
.eq-kpi-label{font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;}
.eq-kpi-val{font-family:'Inter',sans-serif;font-weight:700;font-size:26px;color:var(--text);line-height:1.1;letter-spacing:-0.025em;}
.eq-kpi-val.gold{color:var(--gold);}
.eq-kpi-val.red{color:var(--red);}
.eq-kpi-sub{font-size:12px;color:var(--text3);margin-top:6px;}
.eq-section{margin-bottom:22px;}
.eq-section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.eq-section-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text2);display:flex;align-items:center;gap:8px;}
.eq-section-title::before{content:'';width:8px;height:8px;border-radius:50%;display:inline-block;}
.eq-section-title.setter::before{background:var(--green);}
.eq-section-title.closer::before{background:var(--blue);}
.eq-member-card{background:var(--metric);border:1px solid var(--line);border-radius:var(--r);padding:16px 18px;box-shadow:var(--shadow-md);margin-bottom:10px;}
.eq-member-hdr{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.eq-member-rules{background:var(--surface-2);border-radius:var(--rs);padding:14px 16px;margin-top:14px;border:1px solid var(--line);}
.eq-add-form{display:flex;align-items:center;gap:8px;padding:12px 16px;background:var(--metric);border:1px dashed rgba(224,181,74,.2);border-radius:var(--r);margin-bottom:10px;flex-wrap:wrap;}
.eq-counters{display:flex;gap:10px;}
.eq-counter{flex:1;background:var(--surface-3);border:1px solid var(--line);border-radius:var(--rs);padding:10px 12px;text-align:center;}
.eq-counter-val{font-size:20px;font-weight:700;margin-bottom:2px;font-family:'Inter',sans-serif;letter-spacing:-0.02em;}
.eq-counter-label{color:var(--text3);font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;}
.eq-add-btn{background:transparent;border:1px dashed rgba(224,181,74,.25);color:var(--text3);border-radius:var(--rs);padding:4px 12px;font-size:12px;font-family:'Inter',sans-serif;cursor:pointer;transition:.15s;}
.eq-add-btn:hover{border-color:var(--gold-border);color:var(--gold);}
.eq-rule-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;}
.eq-rule-if{color:var(--text3);font-size:13px;white-space:nowrap;}
.eq-rule-sel{background:var(--surface-3);border:1px solid var(--line);color:var(--text2);border-radius:var(--rs);padding:5px 8px;font-size:13px;font-family:'Inter',sans-serif;}
.eq-rule-inp{background:var(--surface-3);border:1px solid var(--line);color:var(--text);border-radius:var(--rs);padding:5px 8px;font-size:13px;font-family:'Inter',sans-serif;width:90px;text-align:right;}
.eq-rule-inp:focus{outline:none;border-color:var(--gold-border);}
.eq-rule-inp.eq-rule-pct{width:60px;}
.eq-rule-arrow{color:var(--gold);font-size:14px;opacity:.7;}
.eq-rule-pct-sym{color:var(--text3);font-size:13px;}
.eq-rule-del{background:transparent;border:none;color:var(--text3);font-size:19px;cursor:pointer;padding:0 4px;line-height:1;transition:.15s;opacity:.5;}
.eq-rule-del:hover{color:var(--red);opacity:1;}
.eq-empty-rules{color:var(--text3);font-size:13px;font-style:italic;padding:4px 0;}
.eq-empty-section{color:var(--text3);font-size:13px;padding:16px;text-align:center;background:var(--surface-2);border-radius:var(--rs);border:1px dashed var(--line);margin-bottom:10px;}
</style>
<div class="eq-wrap">
  <h1 class="page-title">Equipo</h1>
  <p class="page-sub">Comisiones y rendimiento del período — ${periodLabel}</p>

  <div class="eq-filter-row">
    <div class="tabs" style="margin-bottom:0">
      <div class="tab ${_equipo.period==='semana'&&_equipo.mes===''?'active':''}" onclick="equipoSetPeriod('semana')">Semana</div>
    </div>
    <select class="eq-mes-sel" onchange="equipoSetMes(this.value)">
      <option value="" ${_equipo.mes===''?'selected':''}>Mes específico…</option>
      ${MESES.map((m,i)=>`<option value="${i}" ${_equipo.mes===String(i)?'selected':''}>${m}</option>`).join('')}
    </select>
  </div>

  <div class="eq-top-grid">
    <div class="eq-kpi">
      <div class="eq-kpi-label">Facturación del Período</div>
      <div class="eq-kpi-val">${fmtUSD(revenue)}</div>
      ${revenue===0?'<div class="eq-kpi-sub">Sin ingresos en este período</div>':''}
    </div>
    <div class="eq-kpi">
      <div class="eq-kpi-label">Gasto Total Equipo</div>
      <div class="eq-kpi-val red">${fmtUSD(totalTeam)}</div>
      ${revenue>0?`<div class="eq-kpi-sub">${((totalTeam/revenue)*100).toFixed(1)}% de la facturación</div>`:''}
    </div>
    <div class="eq-kpi">
      <div class="eq-kpi-label">Margen Neto</div>
      <div class="eq-kpi-val gold">${fmtUSD(revenue-totalTeam)}</div>
      ${revenue>0?`<div class="eq-kpi-sub">${(((revenue-totalTeam)/revenue)*100).toFixed(1)}% del total facturado</div>`:''}
    </div>
  </div>

  <div class="eq-section">
    <div class="eq-section-hdr">
      <div class="eq-section-title setter">Setters <span style="color:var(--text3);font-weight:400">(${setters.length})</span></div>
      <button class="eq-add-btn" onclick="equipoShowAddForm('setter')">+ Agregar setter</button>
    </div>
    ${_equipoAddingRole==='setter'?addForm('setter'):''}
    ${setters.length===0&&_equipoAddingRole!=='setter'?'<div class="eq-empty-section">No hay setters. Agregá uno con el botón de arriba.</div>':''}
    ${setters.map(m=>{
      const cntHtml=`<div class="eq-counter" style="border-color:rgba(224,181,74,.15)">
        <div class="eq-counter-val" style="color:var(--gold)">${agendasCount}</div>
        <div class="eq-counter-label">Agendas</div>
      </div>`;
      return memberCard(m,cntHtml,getMemberRevenue(m));
    }).join('')}
  </div>

  <div class="eq-section">
    <div class="eq-section-hdr">
      <div class="eq-section-title closer">Closers <span style="color:var(--text3);font-weight:400">(${closers.length})</span></div>
      <button class="eq-add-btn" onclick="equipoShowAddForm('closer')">+ Agregar closer</button>
    </div>
    ${_equipoAddingRole==='closer'?addForm('closer'):''}
    ${closers.length===0&&_equipoAddingRole!=='closer'?'<div class="eq-empty-section">No hay closers. Agregá uno con el botón de arriba.</div>':''}
    ${closers.map(m=>{
      const myRevenue=getMemberRevenue(m);
      const closedByMe=periodCalls.filter(c=>['Cierre','Cierre Cuotas'].includes(c.estado||'')&&(c.closer||'').toLowerCase().trim()===m.nombre.toLowerCase().trim());
      const myClosures=closedByMe.length;
      const myCuotas=closedByMe.filter(c=>(c.estado||'')==='Cierre Cuotas').length;
      const cntHtml=`
        <div class="eq-counter" style="border-color:rgba(96,144,212,.2)">
          <div class="eq-counter-val" style="color:var(--blue)">${myClosures}</div>
          <div class="eq-counter-label">Cierres</div>
        </div>
        <div class="eq-counter" style="border-color:rgba(96,144,212,.2)">
          <div class="eq-counter-val" style="color:var(--blue)">${myCuotas}</div>
          <div class="eq-counter-label">Cierre Cuotas</div>
        </div>
        <div class="eq-counter" style="border-color:rgba(96,144,212,.2)">
          <div class="eq-counter-val" style="color:var(--blue);font-size:14px">${fmtUSD(myRevenue)}</div>
          <div class="eq-counter-label">Facturado</div>
        </div>`;
      return memberCard(m,cntHtml,myRevenue);
    }).join('')}
  </div>
</div>`;
}

// ========================================
// 🎨 FORMATOS
// ========================================
let formatosCache = [];
let _editFormatoId = null;
let _formatoColor = '#e0b54a';

function _igCode(url){
  const m = (url||'').match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

async function fetchFormatos(){
  try{
    const res = await apiFetch(`${API_URL}/formatos`);
    if(!res.ok) return;
    const data = await res.json();
    if(Array.isArray(data)) formatosCache = data;
  }catch(e){ console.warn('[fetchFormatos]',e); }
}

function renderFormatos(){
  const grid = document.getElementById('formatos-grid');
  if(!grid) return;
  if(!formatosCache.length){
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text3);padding:60px 0;font-size:13px">Sin formatos todavía. Agregá el primero.</div>';
    return;
  }
  grid.innerHTML = formatosCache.map(f=>{
    const code = _igCode(f.url||'');
    const color = f.color || '#e0b54a';
    const embedHtml = code
      ? `<iframe src="https://www.instagram.com/p/${code}/embed/" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`
      : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);font-size:11px">Sin vista previa</div>`;
    return `<div class="formato-card" onclick="openFormatoModal('${f.id}')">
      <div class="formato-embed">${embedHtml}</div>
      <div class="formato-info">
        <div class="formato-badge" style="background:${color}22;color:${color}">${escHtml(f.nombre||'Sin nombre')}</div>
        ${f.desc ? `<div class="formato-desc">${escHtml(f.desc)}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function escHtml(s){ const d=document.createElement('div');d.textContent=s||'';return d.innerHTML; }

function openFormatoModal(id){
  _editFormatoId = id;
  const f = id ? formatosCache.find(x=>String(x.id)===String(id)) : null;
  document.getElementById('formato-modal-title').textContent = f ? 'Editar formato' : 'Nuevo formato';
  document.getElementById('f-url').value = f?.url||'';
  document.getElementById('f-nombre').value = f?.nombre||'';
  document.getElementById('f-desc').value = f?.desc||'';
  _formatoColor = f?.color || '#e0b54a';
  document.querySelectorAll('.fcolor-opt').forEach(el=>{
    const active = el.dataset.color === _formatoColor;
    el.style.borderColor = active ? el.dataset.color : 'transparent';
  });
  document.getElementById('f-delete-btn').style.display = f ? '' : 'none';
  document.getElementById('f-preview').innerHTML = '';
  if(f?.url) _showFormatoPreview(f.url);
  openModal('modal-formato');
}

function selectFormatoColor(color, el){
  _formatoColor = color;
  document.querySelectorAll('.fcolor-opt').forEach(e=>{ e.style.borderColor='transparent'; });
  el.style.borderColor = color;
}

function previewFormato(){
  _showFormatoPreview(document.getElementById('f-url').value);
}

function _showFormatoPreview(url){
  const code = _igCode(url);
  const prev = document.getElementById('f-preview');
  if(!prev) return;
  if(code){
    prev.innerHTML = `<iframe src="https://www.instagram.com/p/${code}/embed/" width="100%" height="280" frameborder="0" scrolling="no" allowtransparency="true" style="border-radius:8px;border:none;background:var(--surface-2)"></iframe>`;
  } else {
    prev.innerHTML = '';
  }
}

async function saveFormato(){
  const nombre = document.getElementById('f-nombre').value.trim();
  if(!nombre){ toast('El nombre es obligatorio'); return; }
  const body = { nombre, url: document.getElementById('f-url').value.trim(), desc: document.getElementById('f-desc').value.trim(), color: _formatoColor };
  try{
    if(_editFormatoId){
      await apiFetch(`${API_URL}/formatos/${_editFormatoId}`,{method:'PATCH',body:JSON.stringify(body)});
      const idx = formatosCache.findIndex(x=>String(x.id)===String(_editFormatoId));
      if(idx>=0) formatosCache[idx] = {...formatosCache[idx],...body};
    } else {
      const res = await apiFetch(`${API_URL}/formatos`,{method:'POST',body:JSON.stringify(body)});
      if(!res.ok){ toast('Error al guardar'); return; }
      const created = await res.json();
      formatosCache.unshift(created);
    }
    closeModal('modal-formato');
    renderFormatos();
    toast('Formato guardado ✓');
  }catch(e){ toast('Error al guardar'); }
}

async function deleteFormato(){
  if(!_editFormatoId) return;
  if(!confirm('¿Eliminar este formato?')) return;
  await apiFetch(`${API_URL}/formatos/${_editFormatoId}`,{method:'DELETE'});
  formatosCache = formatosCache.filter(x=>String(x.id)!==String(_editFormatoId));
  closeModal('modal-formato');
  renderFormatos();
  toast('Formato eliminado');
}

// ========================================
// 🔬 LABORATORIO DE CONTENIDO
// ========================================
let labCache = [];
let _labTab = 'reel';
let _editLabId = null;
let _histFrames = []; // base64 images for historia frames
let _labConclusions = {}; // { reel: {text,from,to}, carrusel:…, historia:…, youtube:… }
let labArchiveCache = [];

function _getLabArchiveKey(){ return `crm_lab_archivo_${getCid()}`; }
function _loadLabArchive(){ try{ const v=localStorage.getItem(_getLabArchiveKey()); labArchiveCache=v?JSON.parse(v):[]; }catch{ labArchiveCache=[]; } }
function _persistLabArchive(){ try{ localStorage.setItem(_getLabArchiveKey(),JSON.stringify(labArchiveCache)); }catch{} }

// ---- Formula helpers ----
function _calcRendCTA(respuestas_cta, views_ultima){
  if(!respuestas_cta||!views_ultima) return null;
  const pct=respuestas_cta/views_ultima;
  if(pct>0.07) return{pct,label:'Muy bueno',color:'#5cb87a'};
  if(pct>0.03) return{pct,label:'Bueno',color:'#e0b54a'};
  return{pct,label:'Malo',color:'#d46060'};
}
function _calcRendRetencion(duracion, retencion){
  if(!duracion||retencion==null||retencion==='') return null;
  const d=Number(duracion), r=Number(retencion);
  if(!d||isNaN(r)) return null;
  let lo,hi;
  if(d<10){lo=40;hi=50;}
  else if(d<=25){lo=30;hi=40;}
  else{lo=15;hi=25;}
  if(r>=lo&&r<=hi) return{label:'Ideal',color:'#5cb87a'};
  if(r<lo) return{label:'Mala',color:'#d46060'};
  return{label:'Muy buena',color:'#6090d4'};
}
function _calcRendCTR(ctr){
  if(ctr==null||ctr==='') return null;
  const c=Number(ctr); if(isNaN(c)) return null;
  if(c>=10) return{label:'Muy bueno',color:'#5cb87a'};
  if(c>=4)  return{label:'Bueno',color:'#e0b54a'};
  return{label:'Malo',color:'#d46060'};
}

// ---- Live form calcs ----
function _refreshComUnicos(){
  const com=parseFloat(document.getElementById('lab-comentarios')?.value)||0;
  const el=document.getElementById('lab-com-unicos-display');
  if(el) el.textContent=Math.round(com/2);
}
function _refreshHistCTACalc(){
  const wrap=document.getElementById('hist-views-rows'); if(!wrap) return;
  const inputs=[...wrap.querySelectorAll('input[id^="lab-hist-v-"]')];
  const lastViews=inputs.length?(parseFloat(inputs[inputs.length-1].value)||0):0;
  const respuestas=parseFloat(document.getElementById('lab-respuestas-cta')?.value)||0;
  const el=document.getElementById('lab-cta-calc-display'); if(!el) return;
  const rend=_calcRendCTA(respuestas,lastViews);
  el.innerHTML=rend?`${(rend.pct*100).toFixed(1)}% &nbsp;<span style="font-weight:700;color:${rend.color}">${rend.label}</span>`:'—';
}
function _refreshYTCalc(){
  const ctr=document.getElementById('lab-ctr')?.value;
  const ret=document.getElementById('lab-retencion')?.value;
  const dur=document.getElementById('lab-duracion')?.value;
  const elCTR=document.getElementById('lab-rend-ctr');
  const elRet=document.getElementById('lab-rend-retencion');
  if(elCTR){ const r=_calcRendCTR(ctr); elCTR.innerHTML=r?`<span style="font-weight:700;color:${r.color}">${r.label}</span>`:'—'; }
  if(elRet){ const r=_calcRendRetencion(dur,ret); elRet.innerHTML=r?`<span style="font-weight:700;color:${r.color}">${r.label}</span>`:'—'; }
}

// ---- Archive modal / snapshot ----
function _openArchiveModal(){
  const input=document.getElementById('lab-archivo-nombre');
  const dateInput=document.getElementById('lab-archivo-fecha');
  if(input) input.value='';
  if(dateInput) dateInput.value=new Date().toISOString().slice(0,10);
  openModal('modal-lab-archivo');
}
function confirmarArchivoLab(){
  const nombre=(document.getElementById('lab-archivo-nombre')?.value||'').trim();
  if(!nombre){toast('Ingresá un nombre para el laboratorio');return;}
  _loadLabArchive();
  const snapshot={
    id:uid(),
    nombre,
    fecha:document.getElementById('lab-archivo-fecha')?.value||new Date().toISOString().slice(0,10),
    conclusiones:JSON.parse(JSON.stringify(_labConclusions)),
    piezas:{
      reel:     labCache.filter(x=>x.tipo==='reel'),
      carrusel: labCache.filter(x=>x.tipo==='carrusel'),
      historia: labCache.filter(x=>x.tipo==='historia'),
      youtube:  labCache.filter(x=>x.tipo==='youtube'),
    }
  };
  labArchiveCache.unshift(snapshot);
  _persistLabArchive();
  closeModal('modal-lab-archivo');
  toast(`Laboratorio "${nombre}" archivado ✓`);
}

// ---- Archive page ----
function renderLabArchive(){
  _loadLabArchive();
  const listEl=document.getElementById('lab-archive-list');
  const detailEl=document.getElementById('lab-archive-detail');
  if(!listEl) return;
  if(detailEl) detailEl.style.display='none';
  listEl.style.display='';
  if(!labArchiveCache.length){
    listEl.innerHTML='<div style="text-align:center;color:var(--text3);padding:60px 0;font-size:13px">No hay laboratorios archivados.<br><span style="font-size:11px">Guardá una conclusión para crear el primer archivo.</span></div>';
    return;
  }
  listEl.innerHTML=labArchiveCache.map(lab=>`
    <div class="card" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;margin-bottom:10px;cursor:pointer" onclick="_openSavedLab('${lab.id}')">
      <div>
        <div style="font-size:14px;font-weight:700;color:var(--text)">${escHtml(lab.nombre)}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${lab.fecha||'—'}</div>
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        ${['reel','carrusel','historia','youtube'].map(t=>`<span style="font-size:10px;font-weight:700;color:var(--text3)">${lab.piezas[t]?.length||0} ${t}</span>`).join('<span style="color:var(--line)">·</span>')}
        <button onclick="event.stopPropagation();_deleteSavedLab('${lab.id}')" class="btn-icon" style="color:var(--red);margin-left:4px;font-size:16px">×</button>
      </div>
    </div>`).join('');
}
function _deleteSavedLab(id){
  if(!confirm('¿Eliminar este laboratorio archivado?')) return;
  labArchiveCache=labArchiveCache.filter(x=>x.id!==id);
  _persistLabArchive();
  renderLabArchive();
}
function _openSavedLab(id){
  const lab=labArchiveCache.find(x=>x.id===id); if(!lab) return;
  const listEl=document.getElementById('lab-archive-list');
  const detailEl=document.getElementById('lab-archive-detail');
  if(!detailEl||!listEl) return;
  listEl.style.display='none';
  detailEl.style.display='';
  const TABS=[{key:'reel',label:'Reels'},{key:'carrusel',label:'Carruseles'},{key:'historia',label:'Historias'},{key:'youtube',label:'YouTube'}];
  detailEl.innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <button onclick="_backToLabArchive()" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px;font-weight:700">← Volver</button>
      <div>
        <div style="font-size:18px;font-weight:800;color:var(--text)">${escHtml(lab.nombre)}</div>
        <div style="font-size:11px;color:var(--text3)">${lab.fecha||'—'}</div>
      </div>
    </div>
    ${TABS.map(({key,label})=>{
      const piezas=lab.piezas[key]||[];
      const conc=lab.conclusiones[key]||{};
      return `<div style="margin-bottom:24px">
        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gold);margin-bottom:10px">${label}</div>
        ${piezas.length
          ? piezas.map(p=>_renderSavedPieza(p,key)).join('')
          : `<div style="color:var(--text3);font-size:12px;padding:10px 0">No se analizaron ${label.toLowerCase()}</div>`}
        ${conc.text?`<div style="background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:10px 14px;margin-top:8px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--text3);margin-bottom:4px">Conclusión${conc.from?' · '+conc.from+(conc.to?' → '+conc.to:''):''}</div>
          <div style="font-size:12.5px;color:var(--text);white-space:pre-wrap">${escHtml(conc.text)}</div>
        </div>`:''}
      </div>`;
    }).join('')}`;
}
function _backToLabArchive(){
  document.getElementById('lab-archive-detail').style.display='none';
  document.getElementById('lab-archive-list').style.display='';
}
function _renderSavedPieza(p,tipo){
  const stats=[];
  if(tipo==='reel'||tipo==='carrusel'){
    if(p.views!=null) stats.push(`Views: <b>${_fmt(p.views)}</b>`);
    if(p.likes!=null) stats.push(`Likes: <b>${_fmt(p.likes)}</b>`);
    const cu=p.com_unicos??(p.comentarios?Math.round(p.comentarios/2):null);
    if(cu!=null) stats.push(`Coments únicos: <b>${_fmt(cu)}</b>`);
    if(p.guardados!=null) stats.push(`Guardados: <b>${_fmt(p.guardados)}</b>`);
  } else if(tipo==='historia'){
    const vf=p.views_frames||[];
    const vu=vf[vf.length-1]||0;
    const rend=_calcRendCTA(p.respuestas_cta,vu);
    if(p.views!=null) stats.push(`Views (1ra): <b>${_fmt(p.views)}</b>`);
    if(rend) stats.push(`CTA: <b style="color:${rend.color}">${(rend.pct*100).toFixed(1)}% — ${rend.label}</b>`);
  } else if(tipo==='youtube'){
    if(p.views!=null) stats.push(`Views: <b>${_fmt(p.views)}</b>`);
    const rCTR=_calcRendCTR(p.ctr);
    const rRet=_calcRendRetencion(p.duracion,p.retencion);
    if(p.ctr!=null) stats.push(`CTR: <b style="color:${rCTR?.color||'var(--text)'}">${p.ctr}%${rCTR?' — '+rCTR.label:''}</b>`);
    if(p.retencion!=null) stats.push(`Retención: <b style="color:${rRet?.color||'var(--text)'}">${p.retencion}%${rRet?' — '+rRet.label:''}</b>`);
  }
  return `<div style="background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:10px 14px;margin-bottom:6px">
    ${p.dolor?`<div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:4px">${escHtml(p.dolor)}</div>`:''}
    ${p.tipo_contenido?`<span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:${_labTipoColor(p.tipo_contenido)}22;color:${_labTipoColor(p.tipo_contenido)}">${escHtml(p.tipo_contenido)}</span>`:''}
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;font-size:11px;color:var(--text3)">${stats.join(' <span style="opacity:.4">·</span> ')}</div>
    ${p.obs?`<div style="font-size:11px;color:var(--text2);margin-top:6px;white-space:pre-wrap">${escHtml(p.obs)}</div>`:''}
  </div>`;
}

const LAB_TIPOS_DEFAULT = {
  reel:     ['Educativo','Entretenimiento','Autoridad','Caso de éxito','Nutrición','Lifestyle','CTA','Venta directa'],
  carrusel: ['Educativo','Tips','Caso de éxito','Autoridad','CTA'],
  historia: ['Nutrición','Autoridad','Caso de éxito','Lifestyle','CTA','Venta directa'],
  youtube:  ['Educativo','Caso de éxito','Autoridad','Tutorial','Vlog'],
};

function _getLabTiposKey(tab){ return `crm_lab_tipos_${tab}_${getCid()}`; }
function _getLabTipos(tab){
  try{ const v=localStorage.getItem(_getLabTiposKey(tab)); return v?JSON.parse(v):LAB_TIPOS_DEFAULT[tab]||[]; }catch{ return LAB_TIPOS_DEFAULT[tab]||[]; }
}
function _saveLabTipos(tab,arr){ localStorage.setItem(_getLabTiposKey(tab),JSON.stringify(arr)); }

function _getLabConcKey(){ return `crm_lab_conc_${getCid()}`; }
function _loadLabConclusions(){
  try{ const v=localStorage.getItem(_getLabConcKey()); _labConclusions=v?JSON.parse(v):{}; }catch{ _labConclusions={}; }
}
function saveLabConclusion(){
  const tab=_labTab;
  _labConclusions[tab]={
    text: document.getElementById('lab-conclusion-text')?.value||'',
    from: document.getElementById('lab-conc-from')?.value||'',
    to:   document.getElementById('lab-conc-to')?.value||'',
  };
  localStorage.setItem(_getLabConcKey(),JSON.stringify(_labConclusions));
  toast('Conclusión guardada ✓');
  _openArchiveModal();
}
function clearLabConclusion(){
  const txtEl=document.getElementById('lab-conclusion-text');
  const fromEl=document.getElementById('lab-conc-from');
  const toEl=document.getElementById('lab-conc-to');
  if(txtEl) txtEl.value='';
  if(fromEl) fromEl.value='';
  if(toEl) toEl.value='';
  _labConclusions[_labTab]={text:'',from:'',to:''};
  localStorage.setItem(_getLabConcKey(),JSON.stringify(_labConclusions));
  toast('Observaciones limpiadas ✓');
}

async function fetchLaboratorio(){
  try{
    const res = await apiFetch(`${API_URL}/laboratorio`);
    if(!res.ok) return;
    const data = await res.json();
    if(Array.isArray(data)) labCache = data;
    _loadLabConclusions();
  }catch(e){ console.warn('[fetchLaboratorio]',e); }
}

function switchLabTab(tab){
  _labTab = tab;
  document.querySelectorAll('.lab-tab').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById('lab-tab-'+tab); if(btn)btn.classList.add('active');
  const isArchivos = tab==='archivos';
  const conclusionEl=document.getElementById('lab-conclusion-wrap');
  const gridEl=document.getElementById('lab-grid');
  const controlsEl=document.getElementById('lab-analysis-controls');
  const archiveWrap=document.getElementById('lab-archive-wrap');
  if(conclusionEl) conclusionEl.style.display=isArchivos?'none':'';
  if(gridEl)       gridEl.style.display=isArchivos?'none':'';
  if(controlsEl)   controlsEl.style.display=isArchivos?'none':'';
  if(archiveWrap)  archiveWrap.style.display=isArchivos?'':'none';
  if(isArchivos){ renderLabArchive(); return; }
  _updateLabTipoFilter();
  _updateLabConclusion();
  renderLabGrid();
}

function _updateLabTipoFilter(){
  const sel=document.getElementById('lab-tipo-filter'); if(!sel) return;
  const tipos=_getLabTipos(_labTab);
  sel.innerHTML='<option value="">Todos los tipos</option>'+tipos.map(t=>`<option>${escHtml(t)}</option>`).join('');
}

function _updateLabConclusion(){
  const c=_labConclusions[_labTab]||{};
  const txt=document.getElementById('lab-conclusion-text');
  const from=document.getElementById('lab-conc-from');
  const to=document.getElementById('lab-conc-to');
  if(txt) txt.value=c.text||'';
  if(from) from.value=c.from||'';
  if(to) to.value=c.to||'';
}

function renderLab(){
  _loadLabConclusions();
  _updateLabTipoFilter();
  _updateLabConclusion();
  renderLabGrid();
}

function renderLabGrid(){
  const grid=document.getElementById('lab-grid'); if(!grid) return;
  const tipoFiltro=document.getElementById('lab-tipo-filter')?.value||'';
  let items=labCache.filter(x=>x.tipo===_labTab);
  if(tipoFiltro) items=items.filter(x=>(x.tipo_contenido||'')=== tipoFiltro);
  if(!items.length){
    grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--text3);padding:48px 0;font-size:13px">Sin registros. Agregá el primero.</div>';
    return;
  }
  grid.innerHTML = items.map(item=>{
    const code=_igCode(item.url||'');
    const tipoColor = _labTipoColor(item.tipo_contenido);
    let thumbHtml='';
    if(_labTab==='historia'){
      const frames=item.frames||[];
      thumbHtml=frames.length
        ? `<div style="display:flex;gap:3px;padding:8px;overflow:hidden;height:100%;align-items:center">${frames.slice(0,3).map(f=>`<img src="${f}" style="width:60px;height:100%;object-fit:cover;border-radius:4px;flex-shrink:0">`).join('')}</div>`
        : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);font-size:11px">Sin imágenes</div>`;
    } else if(code){
      thumbHtml=`<iframe src="https://www.instagram.com/p/${code}/embed/" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
    } else if(item.url&&_labTab==='youtube'){
      const ytCode=(item.url||'').match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
      thumbHtml=ytCode?`<iframe src="https://www.youtube.com/embed/${ytCode[1]}" frameborder="0" allowfullscreen></iframe>`
        :`<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);font-size:11px">YouTube</div>`;
    } else {
      thumbHtml=`<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);font-size:11px">Sin URL</div>`;
    }
    const statsRows=_labStatsRows(item);
    return `<div class="lab-card" onclick="openLabDetail('${item.id}')">
      <div class="lab-card-thumb">${thumbHtml}</div>
      <div class="lab-card-info">
        ${item.tipo_contenido?`<div class="lab-type-badge" style="background:${tipoColor}22;color:${tipoColor}">${escHtml(item.tipo_contenido)}</div>`:''}
        ${item.dolor?`<div style="font-size:11.5px;font-weight:600;color:var(--text);margin-bottom:4px">${escHtml(item.dolor)}</div>`:''}
        ${statsRows}
      </div>
    </div>`;
  }).join('');
}

function _labTipoColor(tipo){
  const map={'Educativo':'#6090d4','Autoridad':'#9b74d4','Caso de éxito':'#5cb87a','Nutrición':'#5bbbd4','Lifestyle':'#e0a848','CTA':'#d46060','Venta directa':'#d46060','Entretenimiento':'#e0b54a','Tutorial':'#9b74d4','Vlog':'#5bbbd4','Tips':'#6090d4'};
  return map[tipo]||'#5a607a';
}

function _labStatsRows(item){
  const row=(label,val)=>`<div class="lab-stat-row"><span>${label}</span><span class="lab-stat-val">${val}</span></div>`;
  const badge=(label,color)=>`<span style="font-size:9px;font-weight:700;padding:1px 7px;border-radius:10px;background:${color}22;color:${color}">${label}</span>`;
  if(_labTab==='reel'||_labTab==='carrusel'){
    const cu=item.com_unicos??(item.comentarios?Math.round(item.comentarios/2):null);
    return [
      row('Views',_fmt(item.views)),
      row('Likes',_fmt(item.likes)),
      cu!=null?row('Com. únicos',_fmt(cu)):'',
    ].join('');
  }
  if(_labTab==='youtube'){
    const rCTR=_calcRendCTR(item.ctr); const rRet=_calcRendRetencion(item.duracion,item.retencion);
    return [
      row('Views',_fmt(item.views)),
      `<div class="lab-stat-row"><span>CTR</span><span class="lab-stat-val">${item.ctr!=null?item.ctr+'%':'—'} ${rCTR?badge(rCTR.label,rCTR.color):''}</span></div>`,
      `<div class="lab-stat-row"><span>Retención</span><span class="lab-stat-val">${item.retencion!=null?item.retencion+'%':'—'} ${rRet?badge(rRet.label,rRet.color):''}</span></div>`,
    ].join('');
  }
  if(_labTab==='historia'){
    const vf=item.views_frames||[];
    const vu=vf[vf.length-1]||0;
    const dropTotal=vf.length>1&&vf[0]&&vu?Math.round((1-vu/vf[0])*100)+'%':'—';
    const rend=_calcRendCTA(item.respuestas_cta,vu);
    return [
      row('Views (1ra)',_fmt(item.views)),
      row('Drop-off',dropTotal),
      rend?`<div class="lab-stat-row"><span>CTA</span><span class="lab-stat-val">${(rend.pct*100).toFixed(1)}% ${badge(rend.label,rend.color)}</span></div>`:'',
    ].join('');
  }
  return row('Views',_fmt(item.views));
}

function _fmt(n){ if(!n&&n!==0) return '—'; const num=Number(n); if(isNaN(num)) return '—'; if(num>=1000000) return(num/1000000).toFixed(1)+'M'; if(num>=1000) return(num/1000).toFixed(1)+'k'; return num.toLocaleString('es-AR'); }

function openLabDetail(id){
  const item=labCache.find(x=>String(x.id)===String(id));
  if(!item) return;
  openLabModal(id);
}

function openLabModal(id){
  _editLabId=id;
  const item=id?labCache.find(x=>String(x.id)===String(id)):null;
  _histFrames=item?.frames||[];
  document.getElementById('lab-modal-title').textContent=item?'Editar registro':'Nuevo registro';
  document.getElementById('lab-delete-btn').style.display=item?'':'none';
  document.getElementById('lab-modal-body').innerHTML=_buildLabForm(item);
  openModal('modal-lab');
}

function _buildLabForm(item){
  const tab=_labTab;
  const tipos=_getLabTipos(tab);
  const tipoOpts=tipos.map(t=>`<option ${(item?.tipo_contenido||'')=== t?'selected':''}>${escHtml(t)}</option>`).join('');
  const rdOnly='background:var(--surface-2);color:var(--text3);cursor:default;';
  let statsHtml='';
  if(tab==='reel'||tab==='carrusel'){
    const cu=item?.com_unicos??(item?.comentarios?Math.round(item.comentarios/2):null);
    statsHtml=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div class="form-group"><label class="form-label">Views</label><input class="form-input" type="number" id="lab-views" value="${item?.views||''}"></div>
        <div class="form-group"><label class="form-label">Likes</label><input class="form-input" type="number" id="lab-likes" value="${item?.likes||''}"></div>
        <div class="form-group"><label class="form-label">Comentarios</label><input class="form-input" type="number" id="lab-comentarios" value="${item?.comentarios||''}" oninput="_refreshComUnicos()"></div>
        <div class="form-group"><label class="form-label">Comentarios únicos <span style="font-size:9px;color:var(--text3)">(auto)</span></label>
          <input class="form-input" type="text" id="lab-com-unicos-display" value="${cu??''}" style="${rdOnly}" readonly>
        </div>
        <div class="form-group"><label class="form-label">Guardados</label><input class="form-input" type="number" id="lab-guardados" value="${item?.guardados||''}"></div>
        <div class="form-group"><label class="form-label">Compartidos</label><input class="form-input" type="number" id="lab-compartidos" value="${item?.compartidos||''}"></div>
      </div>`;
  } else if(tab==='youtube'){
    const rCTR=_calcRendCTR(item?.ctr); const rRet=_calcRendRetencion(item?.duracion,item?.retencion);
    statsHtml=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div class="form-group"><label class="form-label">Views</label><input class="form-input" type="number" id="lab-views" value="${item?.views||''}"></div>
        <div class="form-group"><label class="form-label">Likes</label><input class="form-input" type="number" id="lab-likes" value="${item?.likes||''}"></div>
        <div class="form-group"><label class="form-label">CTR (%)</label><input class="form-input" type="number" step="0.1" id="lab-ctr" value="${item?.ctr||''}" oninput="_refreshYTCalc()"></div>
        <div class="form-group"><label class="form-label">Rendimiento CTR <span style="font-size:9px;color:var(--text3)">(auto)</span></label>
          <div class="form-input" style="${rdOnly}font-size:12px;display:flex;align-items:center;min-height:36px" id="lab-rend-ctr">${rCTR?`<span style="font-weight:700;color:${rCTR.color}">${rCTR.label}</span>`:'—'}</div>
        </div>
        <div class="form-group"><label class="form-label">Retención (%)</label><input class="form-input" type="number" step="0.1" id="lab-retencion" value="${item?.retencion||''}" oninput="_refreshYTCalc()"></div>
        <div class="form-group"><label class="form-label">Rendimiento retención <span style="font-size:9px;color:var(--text3)">(auto)</span></label>
          <div class="form-input" style="${rdOnly}font-size:12px;display:flex;align-items:center;min-height:36px" id="lab-rend-retencion">${rRet?`<span style="font-weight:700;color:${rRet.color}">${rRet.label}</span>`:'—'}</div>
        </div>
        <div class="form-group"><label class="form-label">Duración (min)</label><input class="form-input" type="number" id="lab-duracion" value="${item?.duracion||''}" oninput="_refreshYTCalc()"></div>
        <div class="form-group"><label class="form-label">Promedio views</label><input class="form-input" type="number" id="lab-avg-views" value="${item?.avg_views||''}"></div>
      </div>`;
  } else if(tab==='historia'){
    statsHtml=`
      <div class="form-group"><label class="form-label">Cantidad de historias</label>
        <input class="form-input" type="number" id="lab-hist-cant" min="1" max="20" value="${_histFrames.length||item?.cant_historias||1}" oninput="updateHistFrames(this.value)">
      </div>
      <div class="form-group"><label class="form-label">Secuencia de imágenes</label>
        <div class="hist-seq" id="hist-frames-container">${_renderHistFrames()}</div>
      </div>
      <div id="hist-views-rows"></div>
      <div class="form-group">
        <label class="form-label">Respuestas al CTA</label>
        <input class="form-input" type="number" id="lab-respuestas-cta" value="${item?.respuestas_cta||''}" oninput="_refreshHistCTACalc()">
      </div>
      <div class="form-group">
        <label class="form-label">Rendimiento CTA <span style="font-size:9px;color:var(--text3)">(auto: respuestas / views última historia)</span></label>
        <div class="form-input" style="${rdOnly}font-size:12px;display:flex;align-items:center;min-height:36px" id="lab-cta-calc-display">—</div>
      </div>`;
    setTimeout(()=>{updateHistFrames(document.getElementById('lab-hist-cant')?.value||1);_refreshHistCTACalc();},50);
  }

  const urlHtml=tab!=='historia'?`
    <div class="form-group"><label class="form-label">URL ${tab==='youtube'?'YouTube':'Instagram'}</label>
      <input class="form-input" type="url" id="lab-url" value="${escHtml(item?.url||'')}" placeholder="https://...">
    </div>`:'';

  return `${urlHtml}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Tipo de contenido</label>
        <select class="form-input" id="lab-tipo-contenido">
          <option value="">— Sin tipo —</option>${tipoOpts}
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0"><label class="form-label">Dolor / ángulo</label>
        <input class="form-input" id="lab-dolor" value="${escHtml(item?.dolor||'')}" placeholder="Tema principal">
      </div>
    </div>
    <div class="form-group" style="margin-bottom:12px">
      <label class="form-label" style="display:flex;justify-content:space-between">
        Gestión de tipos
        <button onclick="openGestionTipos()" style="font-size:9px;background:none;border:none;color:var(--gold);cursor:pointer;padding:0">+ Gestionar tipos</button>
      </label>
    </div>
    ${statsHtml}
    <div class="form-group"><label class="form-label">Conclusión / observaciones</label>
      <textarea class="form-input" id="lab-obs" style="min-height:70px">${escHtml(item?.obs||'')}</textarea>
    </div>`;
}

function onLabTipoChange(val){
  const respGroup=document.getElementById('lab-resp-group');
  if(respGroup) respGroup.style.display=['CTA','Venta directa'].includes(val)?'':'none';
}

function _renderHistFrames(){
  return _histFrames.map((f,i)=>
    `<div style="position:relative">
      <img src="${f}" class="hist-frame" onclick="removeHistFrame(${i})" title="Click para eliminar">
    </div>`
  ).join('')+`<div class="hist-frame-add" onclick="addHistFrame()">＋</div>`;
}

function updateHistFrames(cant){
  const n=Math.max(1,Math.min(20,parseInt(cant)||1));
  const container=document.getElementById('hist-frames-container');
  if(container) container.innerHTML=_renderHistFrames();
  // Views input rows
  const wrap=document.getElementById('hist-views-rows');
  if(!wrap) return;
  wrap.innerHTML=`<div class="form-group"><label class="form-label">Views por historia</label>
    <div style="display:flex;flex-direction:column;gap:6px">
    ${Array.from({length:n},(_,i)=>{
      const existing=document.getElementById(`lab-hist-v-${i}`);
      return `<div style="display:flex;align-items:center;gap:8px"><span style="font-size:11px;color:var(--text3);min-width:70px">Historia ${i+1}</span>
        <input class="form-input" type="number" id="lab-hist-v-${i}" value="${existing?.value||''}" style="flex:1">
        ${i>0?`<span id="lab-dropoff-${i}" style="font-size:10px;color:var(--text3);min-width:70px"></span>`:''}
      </div>`;
    }).join('')}
    </div>
    <div style="font-size:11px;color:var(--text3);margin-top:6px">Drop-off total: <span id="lab-dropoff-total" style="font-weight:700;color:var(--text)">—</span></div>
  </div>`;
  wrap.querySelectorAll('input').forEach(inp=>inp.addEventListener('input',()=>{calcHistDropoffs();_refreshHistCTACalc();}));
}

function calcHistDropoffs(){
  const wrap=document.getElementById('hist-views-rows'); if(!wrap) return;
  const inputs=[...wrap.querySelectorAll('input[id^="lab-hist-v-"]')];
  const vals=inputs.map(i=>parseFloat(i.value)||0);
  inputs.forEach((_,i)=>{
    if(i===0) return;
    const el=document.getElementById(`lab-dropoff-${i}`);
    if(el&&vals[i-1]>0) el.textContent=`↓ ${Math.round((1-vals[i]/vals[i-1])*100)}%`;
  });
  const tot=document.getElementById('lab-dropoff-total');
  if(tot&&vals[0]>0) tot.textContent=`${Math.round((1-vals[vals.length-1]/vals[0])*100)}%`;
  _refreshHistCTACalc();
}

function _compressImage(file, maxW, maxH, quality){
  return new Promise(resolve=>{
    const reader=new FileReader();
    reader.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width, h=img.height;
        if(w>maxW||h>maxH){
          const ratio=Math.min(maxW/w, maxH/h);
          w=Math.round(w*ratio); h=Math.round(h*ratio);
        }
        const canvas=document.createElement('canvas');
        canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function addHistFrame(){
  const input=document.createElement('input');
  input.type='file';input.accept='image/*';
  input.onchange=async e=>{
    const file=e.target.files[0]; if(!file) return;
    const compressed=await _compressImage(file, 400, 700, 0.7);
    _histFrames.push(compressed);
    const container=document.getElementById('hist-frames-container');
    if(container) container.innerHTML=_renderHistFrames();
  };
  input.click();
}

function removeHistFrame(i){
  _histFrames.splice(i,1);
  const container=document.getElementById('hist-frames-container');
  if(container) container.innerHTML=_renderHistFrames();
}

function openGestionTipos(){
  _renderGestionTiposModal();
  openModal('modal-lab-tipos');
}
function _renderGestionTiposModal(){
  const tab=_labTab;
  const tipos=_getLabTipos(tab);
  const LABEL={reel:'Reels',carrusel:'Carruseles',historia:'Historias',youtube:'YouTube'};
  const titleEl=document.getElementById('lab-tipos-title');
  const listEl=document.getElementById('lab-tipos-list');
  if(titleEl) titleEl.textContent=`Tipos — ${LABEL[tab]||tab}`;
  if(!listEl) return;
  listEl.innerHTML=tipos.length
    ? tipos.map((t,i)=>`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line)">
          <span style="font-size:13px;color:var(--text)">${escHtml(t)}</span>
          <button onclick="_deleteLabTipo(${i})" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:18px;line-height:1;padding:0 4px" title="Eliminar">×</button>
        </div>`).join('')
    : '<div style="color:var(--text3);font-size:12px;padding:8px 0">Sin tipos definidos</div>';
}
function _deleteLabTipo(idx){
  const tipos=_getLabTipos(_labTab);
  tipos.splice(idx,1);
  _saveLabTipos(_labTab,tipos);
  _renderGestionTiposModal();
  _updateLabTipoFilter();
}
function _addLabTipo(){
  const input=document.getElementById('lab-tipos-nuevo');
  const t=(input?.value||'').trim(); if(!t) return;
  const tipos=_getLabTipos(_labTab);
  if(!tipos.includes(t)) tipos.push(t);
  _saveLabTipos(_labTab,tipos);
  _renderGestionTiposModal();
  _updateLabTipoFilter();
  if(input) input.value='';
}

async function saveLabItem(){
  const tab=_labTab;
  const url=document.getElementById('lab-url')?.value.trim()||'';
  const tipo_contenido=document.getElementById('lab-tipo-contenido')?.value.trim()||'';
  const dolor=document.getElementById('lab-dolor')?.value.trim()||'';
  const obs=document.getElementById('lab-obs')?.value.trim()||'';

  let body={tipo:tab,url:tab!=='historia'?(document.getElementById('lab-url')?.value.trim()||''):'',tipo_contenido,dolor,obs};

  if(tab==='reel'||tab==='carrusel'){
    body.views=parseFloat(document.getElementById('lab-views')?.value)||null;
    body.likes=parseFloat(document.getElementById('lab-likes')?.value)||null;
    body.comentarios=parseFloat(document.getElementById('lab-comentarios')?.value)||null;
    body.com_unicos=Math.round((body.comentarios||0)/2)||null;
    body.guardados=parseFloat(document.getElementById('lab-guardados')?.value)||null;
    body.compartidos=parseFloat(document.getElementById('lab-compartidos')?.value)||null;
  } else if(tab==='youtube'){
    body.views=parseFloat(document.getElementById('lab-views')?.value)||null;
    body.ctr=parseFloat(document.getElementById('lab-ctr')?.value)||null;
    body.retencion=parseFloat(document.getElementById('lab-retencion')?.value)||null;
    body.avg_views=parseFloat(document.getElementById('lab-avg-views')?.value)||null;
    body.duracion=parseFloat(document.getElementById('lab-duracion')?.value)||null;
    body.likes=parseFloat(document.getElementById('lab-likes')?.value)||null;
    const rCTR=_calcRendCTR(body.ctr); if(rCTR) body.rend_ctr=rCTR.label;
    const rRet=_calcRendRetencion(body.duracion,body.retencion); if(rRet) body.rend_retencion=rRet.label;
  } else if(tab==='historia'){
    const cant=parseInt(document.getElementById('lab-hist-cant')?.value)||1;
    body.cant_historias=cant;
    body.frames=_histFrames;
    body.views_frames=Array.from({length:cant},(_,i)=>parseFloat(document.getElementById(`lab-hist-v-${i}`)?.value)||0);
    body.views=body.views_frames[0]||null;
    body.respuestas_cta=parseFloat(document.getElementById('lab-respuestas-cta')?.value)||null;
    const vu=body.views_frames[body.views_frames.length-1]||0;
    const rend=_calcRendCTA(body.respuestas_cta,vu);
    if(rend){ body.pct_cta=rend.pct; body.rend_cta=rend.label; }
  }

  try{
    if(_editLabId){
      const res=await apiFetch(`${API_URL}/laboratorio/${_editLabId}`,{method:'PATCH',body:JSON.stringify(body)});
      if(!res.ok){toast('Error al guardar');return;}
      const idx=labCache.findIndex(x=>String(x.id)===String(_editLabId));
      if(idx>=0) labCache[idx]={...labCache[idx],...body};
    } else {
      const res=await apiFetch(`${API_URL}/laboratorio`,{method:'POST',body:JSON.stringify(body)});
      if(!res.ok){toast('Error al guardar');return;}
      const created=await res.json();
      labCache.unshift(created);
    }
    closeModal('modal-lab');
    renderLabGrid();
    toast('Guardado ✓');
  }catch(e){toast('Error al guardar');}
}

async function deleteLabItem(){
  if(!_editLabId) return;
  if(!confirm('¿Eliminar este registro?')) return;
  await apiFetch(`${API_URL}/laboratorio/${_editLabId}`,{method:'DELETE'});
  labCache=labCache.filter(x=>String(x.id)!==String(_editLabId));
  closeModal('modal-lab');
  renderLabGrid();
  toast('Eliminado');
}

// ========================================
// 🔔 NOTIFICACIONES DE TAREAS HOLDING
// ========================================
let _notifItems = [];

function _notifKey(email){ return `crm_notif_seen_${email}`; }

async function checkHoldingNotifications(email){
  if(!email) return;
  try{
    const res = await fetch(`${API_URL}/holding/tareas`, {
      headers: { 'Content-Type':'application/json', 'x-user-email': email }
    });
    if(!res.ok) return;
    const tasks = await res.json();
    const lastSeen = localStorage.getItem(_notifKey(email)) || '1970-01-01T00:00:00Z';
    // Tasks assigned to me, created by someone else, after last login
    const _inResp=(val,em)=>{if(!val)return false;try{const p=JSON.parse(val);if(Array.isArray(p))return p.includes(em);}catch{}return val===em;};
    const nuevas = tasks.filter(t =>
      _inResp(t.responsable, email) &&
      t.created_by && t.created_by !== email &&
      (t.created_at||'') > lastSeen
    );
    if(!nuevas.length) return;
    _notifItems = nuevas;
    _renderNotifBell();
  }catch(e){ /* holding optional */ }
}

function _negocioLabel(negocio_id){
  try{
    const aliases=JSON.parse(localStorage.getItem('crm_client_aliases')||'{}');
    return aliases[negocio_id]||negocio_id;
  }catch{ return negocio_id; }
}

function _renderNotifBell(){
  const bell = document.getElementById('notif-bell');
  const badge = document.getElementById('notif-badge');
  const list  = document.getElementById('notif-list');
  if(!bell || !_notifItems.length) return;
  bell.style.display = 'block';
  badge.style.display = 'flex';
  badge.textContent = _notifItems.length;
  list.innerHTML = _notifItems.map(t=>`
    <div style="padding:12px 16px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:3px">
      <div style="font-size:11px;font-weight:700;color:var(--text)">📋 ${t.titulo||'Tarea'}</div>
      <div style="font-size:10.5px;color:var(--gold);font-weight:600">Tarea asignada en ${_negocioLabel(t.negocio_id)}</div>
      ${t.fecha_limite?`<div style="font-size:10px;color:var(--text3)">📅 Vence ${new Date(t.fecha_limite+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'short'})}</div>`:''}
    </div>
  `).join('');
}

function toggleNotifPanel(){
  const panel = document.getElementById('notif-panel');
  if(!panel) return;
  panel.style.display = panel.style.display==='none'?'block':'none';
}

function clearNotifications(event){
  if(event) event.stopPropagation();
  const email = currentUser?.email;
  if(email) localStorage.setItem(_notifKey(email), new Date().toISOString());
  _notifItems = [];
  const bell  = document.getElementById('notif-bell');
  const badge = document.getElementById('notif-badge');
  const panel = document.getElementById('notif-panel');
  if(bell)  bell.style.display  = 'none';
  if(badge) badge.style.display = 'none';
  if(panel) panel.style.display = 'none';
}

// Close notif panel when clicking outside
document.addEventListener('click', e=>{
  const bell = document.getElementById('notif-bell');
  if(bell && !bell.contains(e.target)){
    const panel=document.getElementById('notif-panel');
    if(panel) panel.style.display='none';
  }
});

// ========== FORMULARIOS ==========
let _formsTab = 'onboarding';
let _formsEditMode = false;
let _formsAddingQ = false;
let _formsQCache = {};
let _formsRespCache = {};
let _formsAlumnosCache = [];

function switchFormsTab(tipo){
  _formsTab = tipo;
  _formsEditMode = false;
  _formsAddingQ = false;
  document.querySelectorAll('[id^="forms-tab-"]').forEach(b=>{
    b.classList.toggle('active', b.id === 'forms-tab-'+tipo);
  });
  _renderFormsEditor();
  _renderFormsResponses();
}

async function renderForms(){
  const pg = document.getElementById('page-forms');
  if(!pg) return;
  _formsEditMode = false;
  const body = document.getElementById('forms-body');
  const rbody = document.getElementById('forms-responses-body');
  if(body) body.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:16px 0">Cargando…</div>';
  if(rbody) rbody.innerHTML = '';

  const cid = getCid();
  try {
    const [tOnb, tRep] = await Promise.all([
      fetch(`${API_URL}/form-template?cliente_id=${encodeURIComponent(cid)}&tipo=onboarding`).then(r=>r.json()),
      fetch(`${API_URL}/form-template?cliente_id=${encodeURIComponent(cid)}&tipo=reporte_semanal`).then(r=>r.json()),
    ]);
    _formsQCache.onboarding = (tOnb.questions||[]).map(q=>({...q,opciones:q.opciones?[...q.opciones]:undefined}));
    _formsQCache.reporte_semanal = (tRep.questions||[]).map(q=>({...q,opciones:q.opciones?[...q.opciones]:undefined}));

    let rAll = [], aAll = [];
    try { rAll = await apiFetch(`${API_URL}/form-responses`).then(r=>r.ok?r.json():[]); } catch{}
    try { aAll = await apiFetch(`${API_URL}/alumnos`).then(r=>r.ok?r.json():[]); } catch{}
    _formsAlumnosCache = aAll;
    _formsRespCache.onboarding = rAll.filter(r=>r.tipo==='onboarding');
    _formsRespCache.reporte_semanal = rAll.filter(r=>r.tipo==='reporte_semanal');
  } catch(e) {
    if(body) body.innerHTML = `<div style="color:var(--red);font-size:13px">Error al cargar: ${e.message}</div>`;
    return;
  }
  _renderFormsEditor();
  _renderFormsResponses();
}

function _formsEsc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function _renderFormsEditor(){
  const body = document.getElementById('forms-body');
  if(!body) return;
  const questions = (_formsQCache[_formsTab]||[]);
  const cid = getCid();
  const baseUrl = window.location.origin;
  const formUrl = _formsTab==='onboarding'
    ? `${baseUrl}/onboarding.html?cliente_id=${encodeURIComponent(cid)}&tipo=onboarding`
    : `${baseUrl}/formulario_semanal.html?cliente_id=${encodeURIComponent(cid)}`;
  const isEdit = _formsEditMode;
  const isAdmin = currentUserRole === 'admin';

  const tipoLabel = {radio:'Opción múltiple', checkbox:'Casillas', textarea:'Texto largo', text:'Texto corto', scale:'Escala'};

  const qRows = questions.map((q,i)=>{
    const hasOpts = (q.tipo==='radio'||q.tipo==='checkbox') && Array.isArray(q.opciones);

    const titlePart = isEdit
      ? `<input type="text" value="${_formsEsc(q.titulo)}"
           oninput="_formsQCache['${_formsTab}'][${i}].titulo=this.value"
           style="width:100%;background:var(--surface-3);border:1px solid var(--line-strong);border-radius:7px;padding:7px 10px;color:var(--text);font-size:13px;font-weight:600;font-family:inherit;outline:none"
           onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--line-strong)'">`
      : `<div style="font-size:13.5px;font-weight:600;color:var(--text);line-height:1.4">${_formsEsc(q.titulo)}</div>`;

    let optsPart = '';
    if(hasOpts){
      if(isEdit){
        const optInputs = q.opciones.map((o,j)=>`
          <div style="display:flex;gap:6px;align-items:center">
            <input type="text" value="${_formsEsc(o)}"
              oninput="_formsQCache['${_formsTab}'][${i}].opciones[${j}]=this.value"
              style="flex:1;background:var(--surface-3);border:1px solid var(--line-strong);border-radius:6px;padding:5px 9px;color:var(--text);font-size:12px;font-family:inherit;outline:none"
              onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--line-strong)'">
            <button onclick="_formsRemoveOpcion(${i},${j})"
              style="width:22px;height:22px;border-radius:50%;background:rgba(212,96,96,.15);border:1px solid rgba(212,96,96,.3);color:var(--red);font-size:14px;line-height:1;cursor:pointer;flex-shrink:0">×</button>
          </div>`).join('');
        optsPart = `<div style="display:flex;flex-direction:column;gap:5px;margin-top:8px">
          ${optInputs}
          <button onclick="_formsAddOpcion(${i})"
            style="align-self:flex-start;margin-top:2px;font-size:11px;padding:4px 10px;border-radius:6px;background:rgba(224,181,74,.08);border:1px dashed rgba(224,181,74,.4);color:var(--gold);cursor:pointer">+ Agregar opción</button>
        </div>`;
      } else {
        optsPart = `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:8px">
          ${q.opciones.map(o=>`<span style="font-size:11px;padding:3px 10px;border-radius:20px;background:var(--surface-3);border:1px solid var(--line);color:var(--text2)">${_formsEsc(o)}</span>`).join('')}
        </div>`;
      }
    } else if(q.tipo==='scale'){
      optsPart = `<div style="margin-top:6px;font-size:11.5px;color:var(--text3)">Escala del ${q.min||1} al ${q.max||10}</div>`;
    }

    const deleteBtn = isEdit
      ? `<button onclick="_formsRemoveQuestion(${i})"
           style="width:24px;height:24px;border-radius:50%;background:rgba(212,96,96,.15);border:1px solid rgba(212,96,96,.3);color:var(--red);font-size:15px;line-height:1;cursor:pointer;flex-shrink:0;margin-top:1px" title="Eliminar pregunta">×</button>`
      : '';

    return `<div style="background:var(--surface-2);border:1px solid var(--line);border-radius:11px;padding:14px 16px">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <span style="font-size:10px;font-weight:700;letter-spacing:.05em;color:var(--text3);background:var(--surface-3);border:1px solid var(--line);border-radius:5px;padding:2px 7px;margin-top:2px;white-space:nowrap">${q.id}</span>
        <div style="flex:1">
          ${titlePart}
          <div style="margin-top:4px;font-size:10.5px;color:var(--text3)">${tipoLabel[q.tipo]||q.tipo}${q.maxlength?' · máx '+q.maxlength+' chars':''}</div>
          ${optsPart}
        </div>
        ${deleteBtn}
      </div>
    </div>`;
  }).join('');

  const editBtn = isAdmin && !isEdit
    ? `<button onclick="_formsEditMode=true;_renderFormsEditor()"
        style="font-size:12px;padding:7px 16px;border-radius:8px;background:rgba(224,181,74,.1);border:1px solid var(--gold);color:var(--gold);cursor:pointer;font-weight:600">✏️ Editar preguntas</button>`
    : '';

  const addQPanel = isEdit ? `
    <div style="margin-top:10px">
      ${_formsAddingQ ? `
        <div style="background:var(--surface-2);border:1px solid var(--gold);border-radius:11px;padding:16px">
          <div style="font-size:12px;font-weight:700;color:var(--gold);margin-bottom:12px">Nueva pregunta</div>
          <div style="margin-bottom:10px">
            <div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:5px">Título</div>
            <input id="nq-titulo" type="text" placeholder="ej. ¿Cuál es tu objetivo principal?"
              style="width:100%;background:var(--surface-3);border:1px solid var(--line-strong);border-radius:7px;padding:8px 11px;color:var(--text);font-size:13px;font-family:inherit;outline:none"
              onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--line-strong)'" autofocus>
          </div>
          <div style="margin-bottom:12px">
            <div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:6px">Tipo de respuesta</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px" id="nq-tipos">
              ${[['text','Texto corto'],['textarea','Texto largo'],['radio','Opción múltiple'],['checkbox','Casillas'],['scale','Escala']].map(([v,l])=>`
                <label style="cursor:pointer">
                  <input type="radio" name="nq-tipo" value="${v}" ${v==='text'?'checked':''} style="display:none" onchange="_formsOnTipoChange('${v}')">
                  <span class="nq-tipo-btn" data-v="${v}" style="display:inline-block;font-size:11.5px;font-weight:600;padding:5px 12px;border-radius:7px;border:1px solid var(--line-strong);background:var(--surface-3);color:var(--text2);cursor:pointer;transition:all .15s;${v==='text'?'border-color:var(--gold);background:rgba(224,181,74,.1);color:var(--gold)':''}">${l}</span>
                </label>`).join('')}
            </div>
          </div>
          <div id="nq-extra"></div>
          <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px">
            <button onclick="_formsCancelAddQ()"
              style="font-size:12px;padding:6px 14px;border-radius:7px;background:transparent;border:1px solid var(--line-strong);color:var(--text3);cursor:pointer">Cancelar</button>
            <button onclick="_formsConfirmAddQ()"
              style="font-size:12px;padding:6px 16px;border-radius:7px;background:linear-gradient(135deg,var(--gold),#c89732);color:#000;font-weight:700;border:none;cursor:pointer">Agregar →</button>
          </div>
        </div>` : `
        <button onclick="_formsStartAddQ()"
          style="width:100%;padding:9px;border-radius:9px;border:1.5px dashed rgba(224,181,74,.4);background:rgba(224,181,74,.04);color:var(--gold);font-size:12.5px;font-weight:600;cursor:pointer">
          + Nueva pregunta
        </button>`}
    </div>` : '';

  const saveRow = isEdit ? `
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px">
      <button onclick="_formsEditMode=false;_formsAddingQ=false;renderForms()"
        style="font-size:12px;padding:7px 16px;border-radius:8px;background:transparent;border:1px solid var(--line-strong);color:var(--text3);cursor:pointer">Cancelar</button>
      <button id="forms-save-btn" onclick="saveFormTemplate()"
        style="font-size:12px;padding:7px 18px;border-radius:8px;background:linear-gradient(135deg,var(--gold),#c89732);color:#000;font-weight:700;border:none;cursor:pointer">Guardar cambios</button>
    </div>` : '';

  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;background:var(--surface-2);border:1px solid var(--line);border-radius:8px;padding:7px 12px">
        <span style="font-size:10.5px;color:var(--text3);white-space:nowrap">Link público:</span>
        <code style="font-size:11px;color:var(--gold);word-break:break-all;flex:1">${formUrl}</code>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button onclick="_copyFormsLink()"
          style="font-size:12px;padding:7px 14px;border-radius:8px;background:rgba(224,181,74,.1);border:1px solid var(--gold);color:var(--gold);cursor:pointer;white-space:nowrap">Copiar link</button>
        ${editBtn}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">${qRows||'<div style="color:var(--text3);font-size:13px">Sin preguntas.</div>'}</div>
    ${addQPanel}
    ${saveRow}`;
}

function _formsAddOpcion(qIdx){
  const q = _formsQCache[_formsTab][qIdx];
  if(!q.opciones) q.opciones = [];
  q.opciones.push('Nueva opción');
  _renderFormsEditor();
}

function _formsRemoveOpcion(qIdx, oIdx){
  const q = _formsQCache[_formsTab][qIdx];
  if(!q.opciones || q.opciones.length <= 1) return;
  q.opciones.splice(oIdx, 1);
  _renderFormsEditor();
}

function _formsRemoveQuestion(qIdx){
  const qs = _formsQCache[_formsTab];
  if(!qs) return;
  qs.splice(qIdx, 1);
  _renderFormsEditor();
}

function _formsStartAddQ(){
  _formsAddingQ = true;
  _renderFormsEditor();
  setTimeout(()=>document.getElementById('nq-titulo')?.focus(), 50);
}

function _formsCancelAddQ(){
  _formsAddingQ = false;
  _renderFormsEditor();
}

function _formsOnTipoChange(tipo){
  document.querySelectorAll('.nq-tipo-btn').forEach(b=>{
    const active = b.dataset.v === tipo;
    b.style.borderColor = active ? 'var(--gold)' : 'var(--line-strong)';
    b.style.background   = active ? 'rgba(224,181,74,.1)' : 'var(--surface-3)';
    b.style.color        = active ? 'var(--gold)' : 'var(--text2)';
  });
  const extra = document.getElementById('nq-extra');
  if(!extra) return;
  if(tipo==='radio'||tipo==='checkbox'){
    extra.innerHTML=`<div style="margin-bottom:10px">
      <div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:5px">Opciones <span style="font-weight:400">(una por línea)</span></div>
      <textarea id="nq-opciones" rows="3" placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
        style="width:100%;background:var(--surface-3);border:1px solid var(--line-strong);border-radius:7px;padding:8px 11px;color:var(--text);font-size:12px;font-family:inherit;outline:none;resize:vertical"
        onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--line-strong)'"></textarea>
    </div>`;
  } else if(tipo==='textarea'){
    extra.innerHTML=`<div style="margin-bottom:10px;display:flex;align-items:center;gap:10px">
      <div style="font-size:11px;font-weight:600;color:var(--text3)">Máx. caracteres</div>
      <input id="nq-maxlength" type="number" value="500" min="50" max="2000"
        style="width:80px;background:var(--surface-3);border:1px solid var(--line-strong);border-radius:6px;padding:5px 9px;color:var(--text);font-size:12px;font-family:inherit;outline:none;text-align:center"
        onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--line-strong)'">
    </div>`;
  } else if(tipo==='scale'){
    extra.innerHTML=`<div style="margin-bottom:10px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-size:11px;font-weight:600;color:var(--text3)">Mín</div>
        <input id="nq-min" type="number" value="1" min="0" max="5"
          style="width:54px;background:var(--surface-3);border:1px solid var(--line-strong);border-radius:6px;padding:5px 9px;color:var(--text);font-size:12px;font-family:inherit;outline:none;text-align:center"
          onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--line-strong)'">
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-size:11px;font-weight:600;color:var(--text3)">Máx</div>
        <input id="nq-max" type="number" value="10" min="3" max="10"
          style="width:54px;background:var(--surface-3);border:1px solid var(--line-strong);border-radius:6px;padding:5px 9px;color:var(--text);font-size:12px;font-family:inherit;outline:none;text-align:center"
          onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--line-strong)'">
      </div>
    </div>`;
  } else {
    extra.innerHTML='';
  }
}

function _formsConfirmAddQ(){
  const titulo = (document.getElementById('nq-titulo')?.value||'').trim();
  if(!titulo){ document.getElementById('nq-titulo')?.focus(); return; }
  const tipo = document.querySelector('input[name="nq-tipo"]:checked')?.value || 'text';

  const newQ = { id: 'q'+Date.now(), tipo, titulo };

  if(tipo==='radio'||tipo==='checkbox'){
    const raw = (document.getElementById('nq-opciones')?.value||'');
    const opts = raw.split('\n').map(s=>s.trim()).filter(Boolean);
    newQ.opciones = opts.length ? opts : ['Opción 1','Opción 2'];
  } else if(tipo==='textarea'){
    newQ.maxlength = parseInt(document.getElementById('nq-maxlength')?.value||'500') || 500;
  } else if(tipo==='scale'){
    newQ.min = parseInt(document.getElementById('nq-min')?.value||'1') || 1;
    newQ.max = parseInt(document.getElementById('nq-max')?.value||'10') || 10;
  }

  if(!_formsQCache[_formsTab]) _formsQCache[_formsTab] = [];
  _formsQCache[_formsTab].push(newQ);
  _formsAddingQ = false;
  _renderFormsEditor();
}

function _copyFormsLink(){
  const cid = getCid();
  const baseUrl = window.location.origin;
  const url = _formsTab==='onboarding'
    ? `${baseUrl}/onboarding.html?cliente_id=${encodeURIComponent(cid)}&tipo=onboarding`
    : `${baseUrl}/formulario_semanal.html?cliente_id=${encodeURIComponent(cid)}`;
  navigator.clipboard.writeText(url).then(()=>toast('Link copiado ✓')).catch(()=>toast('Error al copiar'));
}

async function saveFormTemplate(){
  const questions = _formsQCache[_formsTab];
  if(!questions) return;
  const btn = document.getElementById('forms-save-btn');
  if(btn){ btn.disabled=true; btn.textContent='Guardando…'; }
  try {
    const r = await apiFetch(`${API_URL}/form-template`, {
      method:'PUT',
      body: JSON.stringify({ tipo: _formsTab, questions }),
    });
    if(!r.ok){ const e=await r.json().catch(()=>({})); throw new Error(e.error||'Error'); }
    toast('Formulario guardado ✓');
    _formsEditMode = false;
    _renderFormsEditor();
  } catch(e) {
    toast('✗ Error al guardar: '+e.message);
    if(btn){ btn.disabled=false; btn.textContent='Guardar cambios'; }
  }
}

function _renderFormsResponses(){
  const body = document.getElementById('forms-responses-body');
  if(!body) return;
  const responses = (_formsRespCache[_formsTab]||[]);
  if(!responses.length){
    body.innerHTML='<div style="color:var(--text3);font-size:12.5px;padding:12px 0">Sin respuestas recibidas aún.</div>';
    return;
  }
  const questions = _formsQCache[_formsTab]||[];
  const qMap = {};
  questions.forEach(q=>{ qMap[q.id]=q.titulo||q.id; });

  body.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px">
      ${responses.map((r,i)=>{
        const resp = r.responses||{};
        const alumno = _formsAlumnosCache.find(a=>a.id===r.alumno_id);
        const linkedName = alumno ? (alumno.nombre+' '+(alumno.apellido||'')).trim() : null;
        const displayName = linkedName || r.alumno_nombre || r.alumno_instagram || '(sin nombre)';
        const date = r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'numeric'}) : '';
        const linkedBadge = alumno
          ? `<span style="font-size:9.5px;font-weight:700;padding:2px 8px;border-radius:20px;background:rgba(92,184,122,.12);border:1px solid rgba(92,184,122,.3);color:#5cb87a">✓ Alumno vinculado</span>`
          : `<span style="font-size:9.5px;font-weight:700;padding:2px 8px;border-radius:20px;background:rgba(90,96,122,.1);border:1px solid rgba(90,96,122,.2);color:var(--text3)">Sin vincular</span>`;
        const subInfo = alumno
          ? `${alumno.negocio||''}${alumno.instagram?' · @'+alumno.instagram:''}`.replace(/^·\s*/,'').trim()
          : r.alumno_instagram ? '@'+r.alumno_instagram : '';
        const preview = Object.entries(resp).filter(([k])=>!k.startsWith('_')).slice(0,2).map(([k,v])=>{
          const label = qMap[k]||k;
          const val = Array.isArray(v)?v.join(', '):String(v||'');
          return `<span style="color:var(--text3)">${_formsEsc(label)}:</span> ${_formsEsc(val.slice(0,60))}${val.length>60?'…':''}`;
        }).join(' &nbsp;·&nbsp; ');
        return `
          <div style="background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:12px 16px;cursor:pointer" onclick="_toggleFormResp('fresp-${i}')">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <div style="font-size:13px;font-weight:600">${_formsEsc(displayName)}</div>
                ${linkedBadge}
              </div>
              <div style="display:flex;align-items:center;gap:10px">
                <div style="font-size:11px;color:var(--text3)">${date}</div>
                <button onclick="event.stopPropagation();_printFormResp(${i})" style="font-size:10.5px;padding:3px 10px;border-radius:6px;background:rgba(224,181,74,.1);border:1px solid var(--gold);color:var(--gold);cursor:pointer">PDF</button>
              </div>
            </div>
            ${subInfo?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${_formsEsc(subInfo)}</div>`:''}
            ${preview?`<div style="font-size:11px;color:var(--text3);margin-top:5px">${preview}</div>`:''}
            <div id="fresp-${i}" style="display:none;margin-top:14px;border-top:1px solid var(--line);padding-top:12px">
              ${Object.entries(resp).filter(([k])=>!k.startsWith('_')).map(([k,v])=>{
                const label = qMap[k]||k;
                const val = Array.isArray(v)?v.join(', '):String(v||'—');
                return `<div style="margin-bottom:10px"><div style="font-size:10.5px;font-weight:700;color:var(--text3);margin-bottom:3px">${_formsEsc(label)}</div><div style="font-size:12.5px;color:var(--text)">${_formsEsc(val)}</div></div>`;
              }).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function _toggleFormResp(id){
  const el=document.getElementById(id);
  if(el) el.style.display=el.style.display==='none'?'block':'none';
}

function _printFormResp(idx){
  const responses = (_formsRespCache[_formsTab]||[]);
  const r = responses[idx];
  if(!r) return;
  const questions = _formsQCache[_formsTab]||[];
  const qMap = {};
  questions.forEach(q=>{ qMap[q.id]=q.titulo||q.id; });
  const resp = r.responses||{};
  const name = r.alumno_nombre||r.alumno_instagram||'Alumno';
  const date = r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}) : '';
  const tipoLabel = _formsTab==='onboarding'?'Onboarding':'Reporte Semanal';

  const rows = Object.entries(resp).map(([k,v])=>{
    const label = qMap[k]||k;
    const val = Array.isArray(v)?v.join(', '):String(v||'—');
    return `<div style="margin-bottom:14px;page-break-inside:avoid">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#666;margin-bottom:3px">${label}</div>
      <div style="font-size:13px;color:#111;border-bottom:1px solid #eee;padding-bottom:8px">${val}</div>
    </div>`;
  }).join('');

  const win = window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>${tipoLabel} — ${name}</title>
    <style>body{font-family:sans-serif;max-width:640px;margin:40px auto;padding:0 24px;color:#111}
    h1{font-size:20px;margin-bottom:4px}p.sub{font-size:12px;color:#666;margin-bottom:28px}
    @media print{button{display:none!important}}</style></head>
    <body>
      <h1>${tipoLabel} · ${name}</h1>
      <p class="sub">${date}</p>
      ${rows}
      <p style="margin-top:32px"><button onclick="window.print()">Imprimir / Guardar PDF</button></p>
    </body></html>`);
  win.document.close();
}

// ========== IA ANÁLISIS DE LLAMADAS ==========

let _aiView      = 'tabla';  // 'tabla' | 'ia'
let _aiSubView   = 'nuevo';  // 'nuevo' | 'historial'
let _aiAnalysisId = null;
let _aiMessages  = [];
let _aiLoading   = false;
let _aiAnalysesList = [];
let _aiScorecard = null;  // scorecard parsed from last analysis

const _AI_CALL_PHASES = [
  { id:'hits',          name:'Hits',          icon:'🎯' },
  { id:'rapport',       name:'Rapport',       icon:'🤝' },
  { id:'desarrollo',    name:'Desarrollo',    icon:'🔍' },
  { id:'descubrimiento',name:'Descubrimiento',icon:'💡' },
  { id:'prepitch',      name:'Pre pitch',     icon:'📍' },
  { id:'pitch',         name:'Pitch',         icon:'🎤' },
  { id:'solucion',      name:'Solución',      icon:'🔧' },
  { id:'presentacion',  name:'Presentación',  icon:'📊' },
  { id:'cierre',        name:'Cierre',        icon:'✅' },
  { id:'objeciones',    name:'Objeciones',    icon:'🛡' },
];

function setCallsView(v) {
  _aiView = v;
  const tabla = document.getElementById('calls-tabla-view');
  const ia    = document.getElementById('calls-ia-view');
  const btnT  = document.getElementById('calls-view-btn-tabla');
  const btnI  = document.getElementById('calls-view-btn-ia');
  if (!tabla || !ia) return;

  const activeStyle  = 'padding:7px 18px;font-size:12.5px;font-weight:700;border-radius:var(--rs);border:1px solid var(--gold);background:rgba(224,181,74,0.15);color:var(--gold);cursor:pointer;letter-spacing:.02em';
  const inactiveStyle = 'padding:7px 18px;font-size:12.5px;font-weight:700;border-radius:var(--rs);border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text3);cursor:pointer;letter-spacing:.02em';

  if (v === 'tabla') {
    tabla.style.display = '';
    ia.style.display = 'none';
    if (btnT) btnT.style.cssText = activeStyle;
    if (btnI) btnI.style.cssText = inactiveStyle;
  } else {
    tabla.style.display = 'none';
    ia.style.display = '';
    if (btnT) btnT.style.cssText = inactiveStyle;
    if (btnI) btnI.style.cssText = activeStyle;
    renderCallsIA();
    loadAIAnalysesList();
  }
}

// Simple markdown renderer for AI responses
function _mdToHtml(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^## (.+)$/gm, '<h4 style="font-size:13px;font-weight:800;color:var(--text);margin:16px 0 6px;text-transform:uppercase;letter-spacing:.04em">$1</h4>')
    .replace(/^### (.+)$/gm, '<h5 style="font-size:12px;font-weight:700;color:var(--text2);margin:12px 0 4px">$1</h5>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text);font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^[-•] (.+)$/gm, '<li style="color:var(--text2);font-size:13px;margin:4px 0;line-height:1.6;padding-left:4px">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul style="list-style:disc;padding-left:18px;margin:6px 0">${m}</ul>`)
    .replace(/\n\n/g, '</p><p style="margin:8px 0;color:var(--text2);font-size:13px;line-height:1.6">')
    .replace(/\n/g, '<br>');
  return `<p style="margin:8px 0;color:var(--text2);font-size:13px;line-height:1.6">${html}</p>`;
}

// ── PDF Export ───────────────────────────────────────────────────────────────

function exportAnalysisPDF() {
  let sc = _aiScorecard;
  // Try to re-parse scorecard from message content if not in memory (e.g. old analyses)
  if (!sc || !sc.phases) {
    const rawContent = (_aiMessages[1]?.content || '');
    const match = rawContent.match(/__SCORECARD__\s*([\s\S]*?)(?:\s*__\/SCORECARD__|$)/);
    if (match) {
      try {
        const raw = match[1].replace(/^```(?:json)?\s*/,'').replace(/\s*```\s*$/,'').trim();
        sc = JSON.parse(raw);
      } catch {}
    }
  }
  // If no scorecard, export just the narrative analysis as a printable page
  if (!sc || !sc.phases) {
    const narrative = (_aiMessages[1]?.content||'').replace(/\n*__SCORECARD__[\s\S]*/,'').trim();
    if(!narrative){ toast('No hay análisis para exportar'); return; }
    const w = window.open('','_blank');
    if(!w){ toast('Permitir popups para exportar PDF'); return; }
    w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
      <title>Análisis de Llamada</title>
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#1a1a18;color:#f0ede6;padding:32px 40px;font-size:13px;line-height:1.6}
      h1{font-size:22px;font-weight:800;margin-bottom:20px}
      h2,h3,h4{margin:14px 0 6px;color:#d4a832}strong{color:#fff}
      p{margin-bottom:8px;color:#c0bdb6}ul,ol{padding-left:18px;margin-bottom:10px}li{margin-bottom:4px;color:#c0bdb6}
      hr{border:none;border-top:1px solid rgba(255,255,255,0.08);margin:16px 0}
      .print-btn{background:#d4a832;color:#111;border:none;border-radius:8px;padding:10px 24px;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:24px;display:block}
      @media print{.print-btn{display:none!important}body{padding:20px}@page{size:A4;margin:12mm}}</style></head>
      <body><button class="print-btn" onclick="window.print()">Imprimir / Guardar PDF</button>
      ${narrative.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^- (.+)$/gm,'<li>$1</li>').replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')}
      </body></html>`);
    w.document.close();
    return;
  }

  // Draw bar chart on canvas and capture as image for PDF
  _drawScorecardRadar(sc);
  const canvas = document.getElementById('ai-scorecard-radar');
  const radarDataUrl = canvas ? canvas.toDataURL('image/png') : null;

  const scores = sc.phases.map(p => Number(p.score) || 0);
  const avg    = scores.reduce((a, b) => a + b, 0) / scores.length;
  const high   = scores.filter(s => s >= 7).length;
  const low    = scores.filter(s => s < 6).length;
  const weakIdx = scores.indexOf(Math.min(...scores));
  const weakPhase = _AI_CALL_PHASES[weakIdx];
  const pById = {};
  sc.phases.forEach(p => { pById[p.id] = p; });

  const scColor = s => s >= 7 ? '#5cb87a' : s >= 5 ? '#d4913a' : '#d46060';
  const scBg    = s => s >= 7 ? 'rgba(92,184,122,.18)' : s >= 5 ? 'rgba(212,145,58,.18)' : 'rgba(212,96,96,.18)';
  const esc = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const phaseRows = _AI_CALL_PHASES.map((ph, i) => {
    const p  = pById[ph.id] || { score: 0, good: [], improve: [] };
    const s  = Number(p.score) || 0;
    const goodItems = (p.good   || []).map(g => `<li>${esc(g)}</li>`).join('');
    const impItems  = (p.improve|| []).map(g => `<li>${esc(g)}</li>`).join('');
    return `<tr>
      <td class="ph-num">${i + 1}</td>
      <td class="ph-name">${ph.icon} ${ph.name}</td>
      <td class="ph-score"><span class="score-pill" style="background:${scBg(s)};color:${scColor(s)}">${s}/10</span>
        <div class="score-bar"><div class="score-fill" style="width:${s * 10}%;background:${scColor(s)}"></div></div>
      </td>
      <td class="ph-good"><ul>${goodItems || '<li class="dim">—</li>'}</ul></td>
      <td class="ph-improve"><ul>${impItems || '<li class="dim">—</li>'}</ul></td>
    </tr>`;
  }).join('');

  const actionsHtml = (sc.actions || []).map((a, i) => `
    <div class="action">
      <div class="action-num">${i + 1}</div>
      <div class="action-body">
        <div class="action-title">${esc(a.title || '')}</div>
        <div class="action-desc">${esc(a.desc || '')}</div>
      </div>
    </div>`).join('');

  // Narrative analysis (first assistant message, already stripped of scorecard)
  const narrativeRaw = _aiMessages[1]?.content || '';
  const narrativeHtml = narrativeRaw
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^\*\*(.+?)\*\*/gm, '<strong>$1</strong>')
    .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^([^<\n].+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`);

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });

  const sellerName = _analyzerMeta?.seller || 'Vendedor';
  const productName = _analyzerMeta?.product || '—';
  const durName = _analyzerMeta?.dur || '—';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reporte · ${esc(sellerName)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f4f0;color:#1a1a18;font-size:14px;line-height:1.6;padding:32px 40px;max-width:860px;margin:0 auto}
  @media print{body{padding:20px 28px;background:#fff} @page{size:A4;margin:12mm 14mm}}
  .no-print{text-align:center;margin-bottom:24px}
  .print-btn{background:#1a1a18;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
  @media print{.no-print{display:none!important}}
  .r-hdr{background:#fff;border:0.5px solid rgba(0,0,0,0.11);border-radius:12px;padding:22px;margin-bottom:14px}
  .r-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}
  .r-label{font-size:11px;font-weight:600;color:#888780;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .r-name{font-size:24px;font-weight:700;color:#1a1a18;margin-bottom:6px}
  .r-meta{font-size:13px;color:#5f5e5a;display:flex;gap:16px;flex-wrap:wrap}
  .score-label{font-size:11px;color:#888780;text-transform:uppercase;letter-spacing:.06em;text-align:right}
  .big-score{font-size:54px;font-weight:700;line-height:1}
  .big-sub{font-size:11px;color:#888780;text-align:right;margin-top:2px}
  .exec{background:#fff;border:0.5px solid rgba(0,0,0,0.11);border-left:3px solid #3266ad;border-radius:0 12px 12px 0;padding:16px 20px;margin-bottom:14px}
  .exec p{font-size:14px;line-height:1.75;color:#1a1a18}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
  .kpi{background:#f5f4f0;border-radius:8px;padding:12px;text-align:center}
  .kpi-label{font-size:11px;color:#888780;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px}
  .kpi-val{font-size:26px;font-weight:700}
  .kpi-sub{font-size:11px;color:#888780;margin-top:2px}
  .radar-wrap{background:#fff;border:0.5px solid rgba(0,0,0,0.11);border-radius:12px;padding:18px;margin-bottom:14px}
  .radar-wrap img{width:100%;height:auto}
  .ptable-c{background:#fff;border:0.5px solid rgba(0,0,0,0.11);border-radius:12px;overflow:hidden;margin-bottom:14px}
  .ptable{width:100%;border-collapse:collapse;font-size:13px}
  .ptable th{text-align:left;font-size:11px;font-weight:600;color:#888780;text-transform:uppercase;letter-spacing:.05em;padding:10px 14px;border-bottom:0.5px solid rgba(0,0,0,0.11);background:#f5f4f0}
  .ptable td{padding:11px 14px;border-bottom:0.5px solid rgba(0,0,0,0.08);vertical-align:top}
  .ptable tr:last-child td{border-bottom:none}
  .ph-num{color:#888780;font-size:12px;font-weight:600;text-align:center;width:30px}
  .ph-name{font-weight:600;font-size:13px}
  .ph-score{width:80px}
  .score-pill{font-size:12px;font-weight:700;padding:2px 10px;border-radius:20px;white-space:nowrap}
  .score-bar{height:4px;background:#e8e6df;border-radius:2px;margin-top:6px}
  .score-fill{height:100%;border-radius:2px}
  .ph-good ul,.ph-improve ul{list-style:none;padding:0}
  .ph-good li,.ph-improve li{font-size:12px;color:#5f5e5a;line-height:1.6;padding:1px 0}
  .ph-good li::before{content:'· ';color:#888780}
  .ph-improve li::before{content:'· ';color:#888780}
  .dim{color:#888780!important}
  .impact{background:#faeeda;border:0.5px solid rgba(133,79,11,0.25);border-radius:12px;padding:18px;display:flex;gap:14px;margin-bottom:14px}
  .impact-icon{font-size:20px;flex-shrink:0;margin-top:2px}
  .impact-title{font-size:14px;font-weight:600;color:#854f0b;display:block;margin-bottom:4px}
  .impact-desc{font-size:13px;line-height:1.65;color:#1a1a18}
  .actions-c{background:#fff;border:0.5px solid rgba(0,0,0,0.11);border-radius:12px;padding:20px;margin-bottom:14px}
  .act-title{font-size:13px;font-weight:700;color:#888780;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px}
  .action{display:flex;gap:12px;padding:13px;background:#f5f4f0;border-radius:8px;margin-bottom:10px}
  .action:last-child{margin-bottom:0}
  .action-num{width:26px;height:26px;border-radius:50%;background:#1a1a18;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .action-title{font-size:13px;font-weight:600;display:block;margin-bottom:3px}
  .action-desc{font-size:12px;color:#5f5e5a;line-height:1.65}
  .narrative{background:#fff;border:0.5px solid rgba(0,0,0,0.11);border-radius:12px;padding:20px;margin-bottom:14px}
  .narrative h3{font-size:11px;font-weight:700;color:#5f5e5a;text-transform:uppercase;letter-spacing:.07em;margin:16px 0 6px;padding-top:14px;border-top:0.5px solid rgba(0,0,0,0.08)}
  .narrative h3:first-child{margin-top:0;border-top:none;padding-top:0}
  .narrative p{font-size:13px;color:#1a1a18;margin-bottom:8px;line-height:1.7}
  .narrative ul{padding-left:18px;margin-bottom:8px}
  .narrative li{font-size:13px;color:#1a1a18;margin-bottom:3px;line-height:1.6}
  .narrative strong{font-weight:700}
  .footer{margin-top:24px;padding-top:12px;border-top:0.5px solid rgba(0,0,0,0.11);display:flex;justify-content:space-between;font-size:10px;color:#888780}
</style>
</head>
<body>

<div class="no-print">
  <button class="print-btn" onclick="window.print()">⬇ Guardar como PDF</button>
</div>

<div class="r-hdr">
  <div class="r-top">
    <div>
      <div class="r-label">Reporte · Análisis IA</div>
      <div class="r-name">${esc(sellerName)}</div>
      <div class="r-meta">
        <span>📅 ${dateStr}</span>
        ${productName !== '—' ? `<span>🎯 ${esc(productName)}</span>` : ''}
        ${durName !== '—' ? `<span>⏱ ${esc(durName)}</span>` : ''}
      </div>
    </div>
    <div>
      <div class="score-label">Calificación</div>
      <div class="big-score" style="color:${scColor(avg)}">${avg.toFixed(1)}</div>
      <div class="big-sub">/ 10</div>
    </div>
  </div>
</div>

<div class="kpis">
  <div class="kpi">
    <div class="kpi-label">Calificación</div>
    <div class="kpi-val" style="color:${scColor(avg)}">${avg.toFixed(1)}</div>
    <div class="kpi-sub">promedio</div>
  </div>
  <div class="kpi">
    <div class="kpi-label">Fases fuertes</div>
    <div class="kpi-val" style="color:#3b6d11">${high}</div>
    <div class="kpi-sub">score ≥ 7</div>
  </div>
  <div class="kpi">
    <div class="kpi-label">A mejorar</div>
    <div class="kpi-val" style="color:#a32d2d">${low}</div>
    <div class="kpi-sub">score &lt; 6</div>
  </div>
  <div class="kpi">
    <div class="kpi-label">Fase crítica</div>
    <div class="kpi-val" style="font-size:14px;padding-top:5px;font-weight:700">${weakPhase ? weakPhase.name : '—'}</div>
    <div class="kpi-sub">mayor oportunidad</div>
  </div>
</div>

${radarDataUrl ? `<div class="radar-wrap"><img src="${radarDataUrl}" alt="Radar de fases"></div>` : ''}

<div class="ptable-c">
<table class="ptable">
  <thead><tr>
    <th style="width:30px">#</th><th>Fase</th><th style="width:68px">Score</th>
    <th>✓ Fortalezas</th><th>△ Oportunidades</th>
  </tr></thead>
  <tbody>${phaseRows}</tbody>
</table>
</div>

${sc.impactTitle ? `
<div class="impact">
  <div class="impact-icon">▲</div>
  <div>
    <div><strong class="impact-title">${esc(sc.impactTitle)}</strong></div>
    <div class="impact-desc">${esc(sc.impactDesc || '')}</div>
  </div>
</div>` : ''}

${actionsHtml ? `
<div class="actions-c">
  <div class="act-title">✏️ Plan de mejora — próxima llamada</div>
  ${actionsHtml}
</div>` : ''}


<div class="footer">
  <span>Reporte · Análisis IA</span>
  <span>${dateStr}</span>
</div>

</body></html>`;

  const win = window.open('', '_blank');
  win.document.open();
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 900);
}

// ── Scorecard visual ─────────────────────────────────────────────────────────

function _scColor(s){ return s>=7?'#5cb87a':s>=5?'#d4a832':'#d46060'; }
function _scBgColor(s){ return s>=7?'rgba(92,184,122,.12)':s>=5?'rgba(212,168,50,.12)':'rgba(212,96,96,.12)'; }

function _renderScorecardSection(sc){
  if(!sc||!sc.phases||!sc.phases.length) return '';
  const scores = sc.phases.map(p=>Number(p.score)||0);
  const avg    = scores.reduce((a,b)=>a+b,0)/scores.length;
  const high   = scores.filter(s=>s>=7).length;
  const low    = scores.filter(s=>s<6).length;
  const weakI  = scores.indexOf(Math.min(...scores));
  const weakPhase = _AI_CALL_PHASES[weakI];

  const phasesById = {};
  sc.phases.forEach(p=>{ phasesById[p.id]=p; });

  const phaseRows = _AI_CALL_PHASES.map((ph,i)=>{
    const p   = phasesById[ph.id]||{score:0,good:[],improve:[]};
    const s   = Number(p.score)||0;
    const col = _scColor(s);
    const bg  = _scBgColor(s);
    const goodList = (p.good||[]).map(g=>`<li style="margin-bottom:3px">${g}</li>`).join('');
    const impList  = (p.improve||[]).map(g=>`<li style="margin-bottom:3px">${g}</li>`).join('');
    return `
      <tr style="border-bottom:1px solid var(--line)">
        <td style="padding:10px 12px;font-size:12px;font-weight:600;color:var(--text3);text-align:center;width:32px">${i+1}</td>
        <td style="padding:10px 12px">
          <div style="font-weight:600;font-size:13px;margin-bottom:4px">${ph.icon} ${ph.name}</div>
          <div style="height:4px;background:var(--line);border-radius:2px;width:100%;max-width:120px">
            <div style="height:100%;border-radius:2px;background:${col};width:${s*10}%"></div>
          </div>
        </td>
        <td style="padding:10px 12px;text-align:center">
          <span style="font-size:13px;font-weight:700;padding:2px 9px;border-radius:20px;background:${bg};color:${col}">${s}/10</span>
        </td>
        <td style="padding:10px 12px;font-size:12px;color:var(--text2)">
          <ul style="list-style:none;padding:0;margin:0">${goodList||'<li style="color:var(--text3)">—</li>'}</ul>
        </td>
        <td style="padding:10px 12px;font-size:12px;color:var(--text2)">
          <ul style="list-style:none;padding:0;margin:0">${impList||'<li style="color:var(--text3)">—</li>'}</ul>
        </td>
      </tr>`;
  }).join('');

  const actionsHtml = (sc.actions||[]).map((a,i)=>`
    <div style="display:flex;gap:12px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:8px">
      <div style="width:26px;height:26px;border-radius:50%;background:var(--gold);color:#000;font-size:12px;font-weight:700;
                  display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
      <div>
        <div style="font-size:13px;font-weight:600;margin-bottom:3px">${a.title||''}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6">${a.desc||''}</div>
      </div>
    </div>`).join('');

  const impactHtml = (sc.impactTitle||sc.impactDesc)?`
    <div style="background:rgba(212,168,50,0.07);border:1px solid rgba(212,168,50,0.25);border-radius:10px;padding:16px 18px;margin-bottom:16px;display:flex;gap:12px">
      <div style="font-size:18px;flex-shrink:0;margin-top:2px">▲</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#d4a832;margin-bottom:4px">${sc.impactTitle||''}</div>
        <div style="font-size:12px;line-height:1.65">${sc.impactDesc||''}</div>
      </div>
    </div>`:'' ;

  const kpiStyle = 'background:rgba(255,255,255,0.04);border:1px solid var(--line);border-radius:10px;padding:14px;text-align:center';
  const kpiLabel = 'font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px';
  const kpiVal   = 'font-size:30px;font-weight:700;line-height:1';
  const kpiSub   = 'font-size:10px;color:var(--text3);margin-top:3px';

  return `
    <div id="ai-scorecard-section" style="margin-bottom:20px">

      <!-- Header score row -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding:16px 20px;background:rgba(255,255,255,0.03);border:1px solid var(--line);border-radius:12px">
        <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em">Reporte · Análisis IA</div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px">Calificación</div>
          <div style="font-size:52px;font-weight:800;line-height:1;color:${_scColor(avg)}">${avg.toFixed(1)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">/ 10</div>
        </div>
      </div>

      <!-- KPI row -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
        <div style="${kpiStyle}"><div style="${kpiLabel}">Calificación</div><div style="${kpiVal};color:${_scColor(avg)}">${avg.toFixed(1)}</div><div style="${kpiSub}">promedio</div></div>
        <div style="${kpiStyle}"><div style="${kpiLabel}">Fases fuertes</div><div style="${kpiVal};color:#5cb87a">${high}</div><div style="${kpiSub}">score ≥ 7</div></div>
        <div style="${kpiStyle}"><div style="${kpiLabel}">A mejorar</div><div style="${kpiVal};color:#d46060">${low}</div><div style="${kpiSub}">score &lt; 6</div></div>
        <div style="${kpiStyle}"><div style="${kpiLabel}">Fase crítica</div><div style="font-size:13px;font-weight:700;padding-top:6px;color:var(--text)">${weakPhase?weakPhase.name:'—'}</div><div style="${kpiSub}">mayor oportunidad</div></div>
      </div>

      <!-- Bar chart -->
      <div style="margin-bottom:14px;background:rgba(255,255,255,0.02);border:1px solid var(--line);border-radius:12px;padding:16px 20px">
        <canvas id="ai-scorecard-radar" width="600" height="220"></canvas>
      </div>

      <!-- Phase table -->
      <div style="border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-bottom:14px">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:rgba(255,255,255,0.04);border-bottom:1px solid var(--line)">
              <th style="padding:9px 12px;font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;width:32px">#</th>
              <th style="padding:9px 12px;font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;text-align:left">Fase</th>
              <th style="padding:9px 12px;font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;width:70px">Score</th>
              <th style="padding:9px 12px;font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;text-align:left">✓ Fortalezas</th>
              <th style="padding:9px 12px;font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;text-align:left">△ Oportunidades</th>
            </tr>
          </thead>
          <tbody>${phaseRows}</tbody>
        </table>
      </div>

      ${impactHtml}

      ${actionsHtml?`
        <div style="border:1px solid var(--line);border-radius:12px;padding:18px;margin-bottom:14px">
          <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:14px">✏️ Plan de mejora — próxima llamada</div>
          ${actionsHtml}
        </div>`:''}

      <div style="height:1px;background:var(--line);margin-bottom:20px"></div>
    </div>`;
}

function _drawScorecardRadar(sc){
  const canvas = document.getElementById('ai-scorecard-radar');
  if(!canvas||!sc||!sc.phases) return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);

  const pById={};
  sc.phases.forEach(p=>{ pById[p.id]=p; });

  const padL=36, padR=12, padT=24, padB=52;
  const chartW=W-padL-padR, chartH=H-padT-padB;
  const n=_AI_CALL_PHASES.length;
  const barW=Math.floor(chartW/n*0.6);
  const gap=(chartW-barW*n)/(n+1);

  // Grid lines y labels eje Y
  const gridC='rgba(255,255,255,0.07)', tc='#6b6965';
  [0,2,4,6,8,10].forEach(v=>{
    const y=padT+chartH*(1-v/10);
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+chartW,y);
    ctx.strokeStyle=gridC; ctx.lineWidth=0.7; ctx.stroke();
    ctx.fillStyle=tc; ctx.font='9px sans-serif'; ctx.textAlign='right';
    ctx.fillText(v, padL-5, y+3);
  });

  // Barras
  _AI_CALL_PHASES.forEach((ph,i)=>{
    const s=Number(pById[ph.id]?.score)||0;
    const x=padL+gap+(barW+gap)*i;
    const barH=chartH*(s/10);
    const y=padT+chartH-barH;
    const col=_scColor(s);

    // Barra con gradiente
    const grad=ctx.createLinearGradient(0,y,0,y+barH);
    grad.addColorStop(0,col);
    grad.addColorStop(1,col+'55');
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.roundRect(x,y,barW,barH,3);
    ctx.fill();

    // Score encima de la barra
    ctx.fillStyle=col; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
    ctx.fillText(s, x+barW/2, y-5);

    // Nombre de la fase debajo
    const shortNames=['Hits','Rapport','Desarr.','Descub.','Pre P.','Pitch','Soluc.','Present.','Cierre','Objecc.'];
    ctx.fillStyle='#a8a69f'; ctx.font='9px sans-serif';
    ctx.fillText(shortNames[i]||ph.name, x+barW/2, padT+chartH+14);
    ctx.fillStyle='#6b6965'; ctx.font='9px sans-serif';
    ctx.fillText(ph.icon||'', x+barW/2, padT+chartH+26);
  });
}

function renderCallsIA() {
  const root = document.getElementById('calls-ia-root');
  if (!root) return;
  if (_aiSubView === 'historial') { _renderAIHistorialView(); return; }
  _renderAINewView();
}

// ── Analyzer metadata (seller / product / duration) ──────────────────────────
let _analyzerMeta = { seller: '', product: '', dur: '' };

function _renderAINewView() {
  const root = document.getElementById('calls-ia-root');
  if (!root) return;
  const isAdmin = currentUserRole === 'admin';
  const hasAnalysis = _aiMessages.length > 0;

  const callOptions = callsCache.map(c =>
    `<option value="${c.id}">${c.nombre||c.instagram||'Sin nombre'} — ${c.instagram||''}</option>`
  ).join('');

  const stepDone  = `<div class="ca-step done"><div class="ca-step-num">✓</div>`;
  const stepAct   = (n,l) => `<div class="ca-step active"><div class="ca-step-num">${n}</div><span>${l}</span></div>`;
  const stepIdle  = (n,l) => `<div class="ca-step"><div class="ca-step-num">${n}</div><span>${l}</span></div>`;

  const steps = hasAnalysis
    ? `${stepDone}<span>Datos</span></div>${stepDone}<span>Analizando</span></div>${stepAct(3,'Ver reporte')}`
    : `${stepAct(1,'Datos de la llamada')}${stepIdle(2,'Analizar')}${stepIdle(3,'Ver reporte')}`;

  const inputStyle = 'width:100%;background:rgba(255,255,255,0.03);border:.5px solid rgba(255,255,255,0.1);border-radius:var(--rs);padding:9px 12px;font-size:13px;color:var(--text);font-family:inherit';
  const selStyle   = 'width:100%;background:rgba(255,255,255,0.03);border:.5px solid rgba(255,255,255,0.1);border-radius:var(--rs);padding:9px 12px;font-size:13px;color:var(--text);font-family:inherit;appearance:none';

  root.innerHTML = `
    <div class="ca-wrap">
      <!-- Header bar -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px">
        <button onclick="setAISubView('historial')" style="padding:5px 12px;font-size:12px;font-weight:600;border-radius:var(--rs);
          border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:var(--text2);cursor:pointer">
          Historial${_aiAnalysesList.length > 0 ? ` (${_aiAnalysesList.length})` : ''}
        </button>
        <div style="display:flex;gap:8px">
          ${isAdmin ? `<button onclick="openAIConfig()" style="padding:5px 12px;font-size:12px;font-weight:600;border-radius:var(--rs);
            border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:var(--text2);cursor:pointer">⚙ Config</button>` : ''}
          ${hasAnalysis ? `<button onclick="startNewAIAnalysis()" style="padding:5px 14px;font-size:12px;font-weight:700;border-radius:var(--rs);
            border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);color:var(--text2);cursor:pointer">+ Nueva evaluación</button>` : ''}
        </div>
      </div>

      <!-- Steps -->
      <div class="ca-steps">${steps}</div>

      <!-- INPUT FORM -->
      <div id="ai-input-section" style="${hasAnalysis?'display:none':''}">
        <div class="card" style="padding:20px">
          <div style="font-size:14px;font-weight:700;margin-bottom:16px">Información de la llamada</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
            <div><label style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px">Vendedor</label>
              <input type="text" id="ai-seller" placeholder="Nombre del vendedor" style="${inputStyle}" value="${_analyzerMeta.seller||''}"></div>
            <div><label style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px">Fecha</label>
              <input type="date" id="ai-date" style="${inputStyle}" value="${new Date().toISOString().slice(0,10)}"></div>
            <div><label style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px">Producto / Servicio</label>
              <input type="text" id="ai-product" placeholder="Ej: Mentoría, curso, consultoría…" style="${inputStyle}" value="${_analyzerMeta.product||''}"></div>
            <div><label style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px">Duración</label>
              <select id="ai-dur" style="${selStyle}">
                <option value="">—</option>
                <option ${_analyzerMeta.dur==='Menos de 15 min'?'selected':''}>Menos de 15 min</option>
                <option ${_analyzerMeta.dur==='15–30 min'?'selected':''}>15–30 min</option>
                <option ${_analyzerMeta.dur==='30–45 min'?'selected':''}>30–45 min</option>
                <option ${_analyzerMeta.dur==='45–60 min'?'selected':''}>45–60 min</option>
                <option ${_analyzerMeta.dur==='Más de 60 min'?'selected':''}>Más de 60 min</option>
              </select></div>
          </div>
          <div style="margin-bottom:14px">
            <label style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px">Vincular a llamada (opcional)</label>
            <select id="ai-call-select" style="${selStyle};max-width:420px">
              <option value="">— Sin vincular —</option>
              ${callOptions}
            </select>
          </div>
          <div style="margin-bottom:16px">
            <label style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:5px">Transcripción o descripción de la llamada</label>
            <textarea id="ai-transcript-input" rows="10"
              placeholder="Pegá el transcript completo, o describí lo que pasó con el mayor detalle posible…"
              style="${inputStyle};resize:vertical;line-height:1.6;min-height:180px;display:block"></textarea>
            <p style="font-size:11px;color:var(--text3);margin-top:5px">Cuanto más detalle proveas, más preciso y útil será el análisis.</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button id="ai-analyze-btn" onclick="runAIAnalysis()"
              style="padding:10px 28px;font-size:13.5px;font-weight:700;border-radius:var(--rs);
                     border:none;background:var(--gold);color:#000;cursor:pointer;letter-spacing:.02em">
              Continuar →
            </button>
          </div>
        </div>
      </div>

      <!-- REPORT AREA -->
      <div id="ai-chat-area" style="${!hasAnalysis?'display:none':''}">
        <div id="ai-messages-container"></div>
        <!-- Follow-up chat -->
        <div style="margin-top:16px">
          <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px">Seguimiento — preguntá sobre esta llamada</div>
          <div style="display:flex;gap:10px;align-items:flex-end">
            <textarea id="ai-followup-input" rows="2"
              placeholder="Preguntá algo sobre esta llamada… (Enter para enviar)"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAIChatMessage();}"
              style="flex:1;background:rgba(255,255,255,0.03);border:.5px solid rgba(255,255,255,0.1);
                     border-radius:var(--rs);padding:10px 14px;font-size:13px;color:var(--text2);
                     line-height:1.5;resize:none;font-family:inherit"></textarea>
            <button id="ai-send-btn" onclick="sendAIChatMessage()"
              style="padding:10px 20px;font-size:12.5px;font-weight:700;border-radius:var(--rs);
                     border:1px solid var(--gold);background:rgba(224,181,74,0.15);color:var(--gold);cursor:pointer;white-space:nowrap">
              Enviar →
            </button>
            <button id="ai-export-wrap" onclick="exportAnalysisPDF()"
              style="padding:10px 16px;font-size:12px;font-weight:700;border-radius:var(--rs);
                     border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);
                     color:var(--text2);cursor:pointer;white-space:nowrap;font-family:inherit">
              📄 PDF
            </button>
          </div>
        </div>
      </div>
    </div>`;

  if (hasAnalysis) _renderAIMessages();
}

function _renderAIHistorialView() {
  const root = document.getElementById('calls-ia-root');
  if (!root) return;
  const isAdmin = currentUserRole === 'admin';

  const listHTML = _aiAnalysesList.length === 0
    ? `<div style="text-align:center;padding:48px 0;color:var(--text3);font-size:13px">No hay análisis guardados aún.</div>`
    : _aiAnalysesList.map(a => {
        const preview = (a.transcript||'').slice(0, 120).replace(/</g,'&lt;');
        const date = a.created_at
          ? new Date(a.created_at).toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})
          : '';
        const msgCount = Array.isArray(a.messages) ? Math.floor(a.messages.length / 2) : 0;
        const chars = (a.transcript||'').length;
        return `
          <div style="border:1px solid var(--line);border-radius:10px;padding:18px 20px;background:rgba(255,255,255,0.02);margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:10px">
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;color:var(--text2);line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">"${preview}…"</div>
              </div>
              <div style="font-size:11px;color:var(--text3);white-space:nowrap">${date}</div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
              <div style="display:flex;gap:10px">
                <span style="font-size:11px;color:var(--text3)">${chars.toLocaleString()} caracteres</span>
                <span style="font-size:11px;color:var(--text3)">·</span>
                <span style="font-size:11px;color:var(--text3)">${msgCount} intercambio${msgCount!==1?'s':''}</span>
              </div>
              <div style="display:flex;gap:8px">
                <button onclick="loadAIAnalysis('${a.id}')"
                  style="padding:5px 14px;font-size:12px;font-weight:600;border-radius:var(--rs);
                         border:1px solid var(--gold);background:rgba(224,181,74,0.1);color:var(--gold);cursor:pointer">
                  Ver análisis
                </button>
                ${isAdmin ? `<button onclick="deleteAIAnalysis('${a.id}')"
                  style="padding:5px 12px;font-size:12px;font-weight:600;border-radius:var(--rs);
                         border:1px solid rgba(184,72,72,0.3);background:rgba(184,72,72,0.08);color:#d47070;cursor:pointer">
                  Eliminar
                </button>` : ''}
              </div>
            </div>
          </div>`;
      }).join('');

  root.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <button onclick="setAISubView('nuevo')" style="padding:6px 14px;font-size:12px;font-weight:600;border-radius:var(--rs);
          border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:var(--text2);cursor:pointer">
          ← Volver
        </button>
        <div style="font-size:15px;font-weight:700;color:var(--text)">
          Historial de análisis
          <span style="font-size:12px;font-weight:500;color:var(--text3);margin-left:8px">${_aiAnalysesList.length} análisis guardados</span>
        </div>
      </div>
      <button onclick="loadAIAnalysesList()" style="padding:6px 14px;font-size:12px;font-weight:600;border-radius:var(--rs);
        border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:var(--text2);cursor:pointer">
        Actualizar
      </button>
    </div>
    <div>${listHTML}</div>`;
}

function _renderAIMessages() {
  const container = document.getElementById('ai-messages-container');
  if (!container) return;

  const pairs = [];
  for (let i = 0; i < _aiMessages.length; i += 2) {
    const user = _aiMessages[i];
    const assistant = _aiMessages[i + 1];
    if (user) pairs.push({ user, assistant });
  }

  container.innerHTML = pairs.map((p, idx) => {
    const isFirst = idx === 0;
    const userLabel = isFirst ? 'Transcript enviado' : 'Pregunta';
    const userContent = isFirst
      ? `<div style="font-size:11.5px;color:var(--text3);font-style:italic">Transcript analizado · ${(p.user.content||'').length} caracteres</div>`
      : `<div style="background:rgba(224,181,74,0.08);border:1px solid rgba(224,181,74,0.15);border-radius:var(--rs);padding:10px 14px;font-size:13px;color:var(--text2)">${(p.user.content||'').replace(/</g,'&lt;')}</div>`;

    const cleanContent = (p.assistant?.content || '').replace(/\n*__SCORECARD__[\s\S]*/,'').trim();
    const assistantHtml = _mdToHtml(cleanContent);
    const scorecardHtml = (isFirst && _aiScorecard) ? _renderScorecardSection(_aiScorecard) : '';

    return `
      <div>
        <div style="font-size:10.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">${userLabel}</div>
        ${userContent}
        ${p.assistant ? `
          <div style="margin-top:12px">
            <div style="font-size:10.5px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">✦ Análisis IA</div>
            <div style="background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.06);border-radius:var(--rs);padding:18px 20px">
              ${scorecardHtml}
              ${isFirst ? '' : assistantHtml}
            </div>
          </div>` : ''}
      </div>`;
  }).join('');

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;

  // Export button — always visible when there's an analysis
  const exportWrap = document.getElementById('ai-export-wrap');
  if (exportWrap) exportWrap.style.display = '';

  // Show chat area
  const chatArea = document.getElementById('ai-chat-area');
  if (chatArea) chatArea.style.display = '';
}

async function runAIAnalysis() {
  if (_aiLoading) return;
  const transcriptEl = document.getElementById('ai-transcript-input');
  const transcript = (transcriptEl?.value || '').trim();
  if (!transcript) { toast('Pegá un transcript primero'); transcriptEl?.focus(); return; }
  if (transcript.length < 30) { toast('El transcript es muy corto'); return; }

  const callId = document.getElementById('ai-call-select')?.value || '';
  const btn = document.getElementById('ai-analyze-btn');

  _aiLoading = true;
  if (btn) { btn.disabled = true; btn.textContent = 'Analizando…'; }

  try {
    const body = { transcript };
    if (callId) body.call_id = callId;

    const res = await apiFetch(`${API_URL}/ai/analyze`, { method: 'POST', body: JSON.stringify(body) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }
    const data = await res.json();

    _aiAnalysisId = data.id;
    _aiMessages   = data.messages || [];
    _aiScorecard  = data.scorecard || null;

    if (transcriptEl) transcriptEl.value = '';
    renderCallsIA();
    if (_aiScorecard) setTimeout(()=>_drawScorecardRadar(_aiScorecard), 50);
    loadAIAnalysesList();
    toast('Análisis completado ✓');
  } catch (err) {
    toast('Error: ' + err.message);
  } finally {
    _aiLoading = false;
    if (btn) { btn.disabled = false; btn.textContent = 'Analizar llamada →'; }
  }
}

async function sendAIChatMessage() {
  if (_aiLoading) return;
  const input = document.getElementById('ai-followup-input');
  const message = (input?.value || '').trim();
  if (!message) return;

  const btn = document.getElementById('ai-send-btn');
  _aiLoading = true;
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  if (input) input.value = '';

  // Optimistic: add user message to UI immediately
  _aiMessages = [..._aiMessages, { role: 'user', content: message }];
  _renderAIMessages();

  try {
    const res = await apiFetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      body: JSON.stringify({ analysis_id: _aiAnalysisId, message, messages: _aiMessages.slice(0, -1) })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }
    const data = await res.json();
    _aiMessages = data.messages || _aiMessages;
    _renderAIMessages();
  } catch (err) {
    // Remove optimistic message on error
    _aiMessages = _aiMessages.slice(0, -1);
    _renderAIMessages();
    toast('Error: ' + err.message);
  } finally {
    _aiLoading = false;
    if (btn) { btn.disabled = false; btn.textContent = 'Enviar →'; }
  }
}

function setAISubView(v) {
  _aiSubView = v;
  renderCallsIA();
  if (v === 'historial') loadAIAnalysesList();
}

async function loadAIAnalysesList() {
  try {
    const res = await apiFetch(`${API_URL}/ai/analyses`);
    if (!res.ok) return;
    _aiAnalysesList = await res.json();
    if (_aiSubView === 'historial') _renderAIHistorialView();
  } catch (err) {
    console.warn('[AI] loadAIAnalysesList:', err.message);
  }
}

async function loadAIAnalysis(id) {
  try {
    const res = await apiFetch(`${API_URL}/ai/analyses/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    _aiAnalysisId = data.id;
    _aiMessages   = data.messages || [];
    _aiScorecard  = data.scorecard || null;
    _aiSubView    = 'nuevo';
    renderCallsIA();
    if (_aiScorecard) setTimeout(()=>_drawScorecardRadar(_aiScorecard), 50);
  } catch (err) {
    toast('Error al cargar análisis');
  }
}

function startNewAIAnalysis() {
  _aiAnalysisId = null;
  _aiMessages   = [];
  _aiScorecard  = null;
  _aiSubView    = 'nuevo';
  renderCallsIA();
}

async function deleteAIAnalysis(id) {
  if (currentUserRole !== 'admin') return;
  if (!confirm('¿Eliminar este análisis? Esta acción no se puede deshacer.')) return;
  try {
    const res = await apiFetch(`${API_URL}/ai/analyses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar');
    _aiAnalysesList = _aiAnalysesList.filter(a => a.id !== id);
    if (_aiAnalysisId === id) { _aiAnalysisId = null; _aiMessages = []; }
    _renderAIHistorialView();
    toast('Análisis eliminado ✓');
  } catch (err) {
    toast('Error: ' + err.message);
  }
}

async function openAIConfig() {
  if (currentUserRole !== 'admin') { toast('Solo los admins pueden configurar la IA'); return; }
  openModal('modal-ia-config');
  try {
    const clienteId = localStorage.getItem('clienteSeleccionado') || '';
    const { data } = await _sb
      .from('ai_config')
      .select('*')
      .eq('cliente_id', clienteId)
      .limit(1)
      .maybeSingle();
    const ctxEl = document.getElementById('ia-config-context');
    const promptEl = document.getElementById('ia-config-prompt');
    if (ctxEl) ctxEl.value = (data && data.custom_context) || '';
    if (promptEl) promptEl.value = (data && data.system_prompt) || '';
  } catch (err) {
    console.warn('[AI CONFIG]', err.message);
  }
}

async function saveAIConfig() {
  if (currentUserRole !== 'admin') { toast('Solo los admins pueden configurar la IA'); return; }
  const system_prompt = (document.getElementById('ia-config-prompt')?.value || '').trim();
  const custom_context = (document.getElementById('ia-config-context')?.value || '').trim();
  try {
    const res = await apiFetch(`${API_URL}/ai/config`, {
      method: 'PATCH',
      body: JSON.stringify({ system_prompt, custom_context })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }
    closeModal('modal-ia-config');
    toast('Configuración de IA guardada ✓');
  } catch (err) {
    toast('Error al guardar: ' + err.message);
  }
}

// ========== IA ANÁLISIS DE CHATS (LEADS) ==========

let _leadsView       = 'tabla';  // 'tabla' | 'ia'
let _chatSubView     = 'nuevo';  // 'nuevo' | 'historial'
let _chatAnalysisId  = null;
let _chatMessages    = [];
let _chatLoading     = false;
let _chatImages         = [];    // [{name, base64, mediaType, previewUrl}]
let _chatFollowupImages = [];    // images staged for the next follow-up send
let _chatInputText      = '';    // persists textarea text across re-renders
let _chatFollowupInputText = ''; // persists followup textarea text across re-renders
let _chatAnalysesList = [];

function setLeadsView(v) {
  _leadsView = v;
  const tabla = document.getElementById('leads-tabla-view');
  const ia    = document.getElementById('leads-ia-view');
  const btnT  = document.getElementById('leads-view-btn-tabla');
  const btnI  = document.getElementById('leads-view-btn-ia');
  if (!tabla || !ia) return;

  const activeStyle   = 'padding:7px 18px;font-size:12.5px;font-weight:700;border-radius:var(--rs);border:1px solid var(--gold);background:rgba(224,181,74,0.15);color:var(--gold);cursor:pointer;letter-spacing:.02em';
  const inactiveStyle = 'padding:7px 18px;font-size:12.5px;font-weight:700;border-radius:var(--rs);border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text3);cursor:pointer;letter-spacing:.02em';

  if (v === 'tabla') {
    tabla.style.display = '';
    ia.style.display = 'none';
    if (btnT) btnT.style.cssText = activeStyle;
    if (btnI) btnI.style.cssText = inactiveStyle;
  } else {
    tabla.style.display = 'none';
    ia.style.display = '';
    if (btnT) btnT.style.cssText = inactiveStyle;
    if (btnI) btnI.style.cssText = activeStyle;
    renderLeadsIA();
    loadChatAnalysesList();
  }
}

function renderLeadsIA() {
  const root = document.getElementById('leads-ia-root');
  if (!root) return;
  if (_chatSubView === 'historial') { _renderChatHistorialView(); return; }
  _renderChatNewView();
}

function _renderChatNewView() {
  const root = document.getElementById('leads-ia-root');
  if (!root) return;
  const isAdmin    = currentUserRole === 'admin';
  const hasAnalysis = _chatMessages.length > 0;

  const thumbnailsHtml = _chatImages.length > 0 ? `
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;margin-bottom:4px">
      ${_chatImages.map((img, idx) => `
        <div style="position:relative;display:inline-block">
          <img src="${img.previewUrl}" alt="${escHtml(img.name)}"
            style="width:72px;height:72px;object-fit:cover;border-radius:6px;border:1px solid rgba(255,255,255,0.12);cursor:pointer"
            onclick="previewChatImage(${idx})">
          <button onclick="removeChatImage(${idx})"
            style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;
                   background:#d04848;border:none;color:#fff;font-size:11px;font-weight:900;cursor:pointer;
                   display:flex;align-items:center;justify-content:center;line-height:1">×</button>
        </div>
      `).join('')}
      <label for="chat-img-input"
        style="width:72px;height:72px;border:1px dashed rgba(255,255,255,0.2);border-radius:6px;
               display:flex;align-items:center;justify-content:center;cursor:pointer;
               color:var(--text3);font-size:22px;flex-shrink:0">+</label>
    </div>
  ` : '';

  const messagesHtml = hasAnalysis ? `
    <div id="chat-messages-wrap" style="margin-top:8px;display:flex;flex-direction:column;gap:12px">
      ${_chatMessages.map(m => m.role === 'user' ? `
        <div style="background:rgba(224,181,74,0.06);border:1px solid rgba(224,181,74,0.14);
                    border-radius:10px;padding:12px 16px">
          <span style="font-size:10px;font-weight:700;color:rgba(224,181,74,0.55);text-transform:uppercase;
                       letter-spacing:.07em;display:block;margin-bottom:6px">Vos</span>
          <div style="font-size:13px;color:var(--text3);white-space:pre-wrap;line-height:1.55">
            ${escHtml(typeof m.content === 'string' ? m.content : '[imagen + texto]')}
          </div>
        </div>
      ` : `
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);
                    border-radius:10px;padding:16px 20px">
          <span style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;
                       letter-spacing:.07em;display:block;margin-bottom:10px">✦ IA Análisis</span>
          ${_mdToHtml(m.content)}
        </div>
      `).join('')}
      ${_chatLoading ? `
        <div style="display:flex;align-items:center;gap:8px;padding:12px 16px;color:var(--text3);font-size:13px">
          <span>⏳</span> La IA está analizando…
        </div>
      ` : ''}
    </div>
    <div style="margin-top:16px">
      ${_chatFollowupImages.length > 0 ? `
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">
          ${_chatFollowupImages.map((img, idx) => `
            <div style="position:relative;display:inline-block">
              <img src="${img.previewUrl}" alt="${escHtml(img.name)}"
                style="width:52px;height:52px;object-fit:cover;border-radius:6px;border:1px solid rgba(255,255,255,0.12);cursor:pointer"
                onclick="previewFollowupImage(${idx})">
              <button onclick="removeFollowupImage(${idx})"
                style="position:absolute;top:-5px;right:-5px;width:16px;height:16px;border-radius:50%;
                       background:#d04848;border:none;color:#fff;font-size:10px;font-weight:900;cursor:pointer;
                       display:flex;align-items:center;justify-content:center;line-height:1">×</button>
            </div>
          `).join('')}
        </div>
      ` : ''}
      <div style="display:flex;gap:8px;align-items:flex-end">
        <textarea id="chat-followup-input" rows="2"
          placeholder="Preguntá algo sobre este chat… (Enter = enviar, Shift+Enter = nueva línea)"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChatFollowup();}"
          oninput="_chatFollowupInputText=this.value"
          style="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);
                 border-radius:var(--rs);padding:10px 14px;font-size:13px;color:var(--text2);
                 resize:none;font-family:inherit;line-height:1.5"></textarea>
        <label for="chat-followup-img-input"
          style="padding:9px 11px;font-size:17px;border:1px solid ${_chatFollowupImages.length > 0 ? 'rgba(224,181,74,0.4)' : 'rgba(255,255,255,0.1)'};
                 border-radius:var(--rs);background:rgba(255,255,255,0.04);cursor:pointer;
                 flex-shrink:0;display:flex;align-items:center;color:${_chatFollowupImages.length > 0 ? 'var(--gold)' : 'var(--text3)'};
                 position:relative" title="Adjuntar imagen">
          📎
          ${_chatFollowupImages.length > 0 ? `<span style="position:absolute;top:-5px;right:-5px;background:var(--gold);color:#000;
            font-size:9px;font-weight:800;width:14px;height:14px;border-radius:50%;
            display:flex;align-items:center;justify-content:center">${_chatFollowupImages.length}</span>` : ''}
        </label>
        <input type="file" id="chat-followup-img-input" accept="image/*" multiple
          style="display:none" onchange="addFollowupImages()">
        <button onclick="sendChatFollowup()"
          style="padding:10px 20px;font-size:13px;font-weight:700;border-radius:var(--rs);
                 border:1px solid var(--gold);background:rgba(224,181,74,0.15);color:var(--gold);
                 cursor:pointer;white-space:nowrap;flex-shrink:0;${_chatLoading ? 'opacity:0.5;' : ''}"
          ${_chatLoading ? 'disabled' : ''}>
          ${_chatLoading ? 'Analizando…' : 'Enviar →'}
        </button>
      </div>
    </div>
  ` : '';

  root.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div style="display:flex;gap:8px;align-items:center">
        <button onclick="setChatSubView('historial')"
          style="padding:6px 14px;font-size:12px;font-weight:600;border-radius:var(--rs);
                 border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:var(--text2);cursor:pointer">
          Historial${_chatAnalysesList.length > 0 ? ` (${_chatAnalysesList.length})` : ''}
        </button>
        ${isAdmin ? `<button onclick="openChatAIConfig()"
          style="padding:6px 14px;font-size:12px;font-weight:600;border-radius:var(--rs);
                 border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:var(--text2);cursor:pointer">
          ⚙ Configurar IA
        </button>` : ''}
      </div>
      <div style="display:flex;gap:8px">
        ${hasAnalysis
          ? `<button onclick="startNewChatAnalysis()"
              style="padding:7px 16px;font-size:12.5px;font-weight:700;border-radius:var(--rs);
                     border:1px solid rgba(184,72,72,0.4);background:rgba(184,72,72,0.1);color:#d47070;cursor:pointer">
              Terminar análisis
            </button>`
          : `<button onclick="startNewChatAnalysis()"
              style="padding:7px 18px;font-size:12.5px;font-weight:700;border-radius:var(--rs);
                     border:1px solid var(--gold);background:rgba(224,181,74,0.12);color:var(--gold);cursor:pointer">
              + Nuevo análisis
            </button>`
        }
      </div>
    </div>

    <div class="card" style="padding:24px">
      <div id="chat-input-section" style="${hasAnalysis ? 'display:none' : ''}">
        <div style="margin-bottom:8px">
          <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">Conversación con el lead</div>
          <div style="font-size:11.5px;color:var(--text3);margin-bottom:8px">Pegá el texto del chat y/o subí screenshots. Podés usar texto + imágenes juntos.</div>
          <textarea id="chat-text-input" rows="9"
            placeholder="Pegá la conversación aquí… (Instagram DM, WhatsApp, etc.)&#10;&#10;Ejemplo:&#10;Setter: Hola! Vi que te interesó el programa&#10;Lead: Sí, ¿cuánto cuesta?&#10;Setter: Son $5,000&#10;Lead: Es mucho..."
            oninput="_chatInputText=this.value"
            style="width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);
                   border-radius:var(--rs);padding:14px;font-size:13px;color:var(--text2);line-height:1.65;
                   resize:vertical;box-sizing:border-box;font-family:inherit;min-height:180px"></textarea>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
          <label for="chat-img-input"
            style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;font-size:12px;font-weight:600;
                   border:1px dashed rgba(255,255,255,0.2);border-radius:var(--rs);color:var(--text3);
                   cursor:pointer;background:rgba(255,255,255,0.02)">
            📎 ${_chatImages.length > 0 ? _chatImages.length + ' imagen(es) adjunta(s) — agregar más' : 'Adjuntar screenshots (opcional)'}
          </label>
          <input type="file" id="chat-img-input" accept="image/*" multiple
            style="display:none" onchange="addChatImages()">
        </div>
        ${thumbnailsHtml}
        <div style="display:flex;justify-content:flex-end;margin-top:16px">
          <button id="chat-analyze-btn" onclick="runChatAnalysis()"
            style="padding:9px 26px;font-size:13px;font-weight:700;border-radius:var(--rs);
                   border:1px solid var(--gold);background:rgba(224,181,74,0.15);color:var(--gold);cursor:pointer;
                   ${_chatLoading ? 'opacity:0.5;' : ''}"
            ${_chatLoading ? 'disabled' : ''}>
            ${_chatLoading ? '⏳ Analizando…' : '✦ Analizar chat'}
          </button>
        </div>
      </div>
      ${messagesHtml}
    </div>
  `;

  const ta = document.getElementById('chat-text-input');
  if (ta) ta.value = _chatInputText;
  const fta = document.getElementById('chat-followup-input');
  if (fta) fta.value = _chatFollowupInputText;
}

function _renderChatHistorialView() {
  const root = document.getElementById('leads-ia-root');
  if (!root) return;
  const isAdmin = currentUserRole === 'admin';

  const cardsHtml = _chatAnalysesList.length === 0
    ? `<div style="text-align:center;padding:48px 0;color:var(--text3);font-size:13px">No hay análisis de chats guardados aún.</div>`
    : _chatAnalysesList.map(a => {
        const date = new Date(a.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const preview = (a.chat_text || '').slice(0, 110).replace(/</g, '&lt;');
        const msgCount = Math.max(0, Math.floor(((a.messages || []).length) / 2) - 1);
        return `
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;
                      padding:16px 18px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
                <span style="font-size:11px;font-weight:600;color:var(--text3)">${date}</span>
                ${a.lead_name ? `<span style="font-size:11px;background:rgba(224,181,74,0.1);border:1px solid rgba(224,181,74,0.18);
                  color:var(--gold);padding:2px 8px;border-radius:20px;font-weight:600">${escHtml(a.lead_name)}</span>` : ''}
                ${a.has_images ? `<span style="font-size:10px;color:var(--text3);background:rgba(255,255,255,0.04);
                  padding:2px 7px;border-radius:20px;border:1px solid rgba(255,255,255,0.07)">📎 imágenes</span>` : ''}
                ${msgCount > 0 ? `<span style="font-size:10px;color:var(--text3)">${msgCount} pregunta${msgCount !== 1 ? 's' : ''} de seguimiento</span>` : ''}
              </div>
              <div style="font-size:12.5px;color:var(--text3);line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                ${preview ? '"' + preview + (a.chat_text?.length > 110 ? '…"' : '"') : '<em>Solo imágenes</em>'}
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0;align-items:center">
              <button onclick="loadChatAnalysis('${a.id}')"
                style="padding:5px 14px;font-size:12px;font-weight:600;border-radius:var(--rs);
                       border:1px solid var(--gold);background:rgba(224,181,74,0.1);color:var(--gold);cursor:pointer">
                Ver análisis
              </button>
              ${isAdmin ? `<button onclick="deleteChatAnalysis('${a.id}')"
                style="padding:5px 12px;font-size:12px;font-weight:600;border-radius:var(--rs);
                       border:1px solid rgba(184,72,72,0.3);background:transparent;color:#d47070;cursor:pointer">
                Eliminar
              </button>` : ''}
            </div>
          </div>`;
      }).join('');

  root.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <button onclick="setChatSubView('nuevo')"
          style="padding:6px 14px;font-size:12px;font-weight:600;border-radius:var(--rs);
                 border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:var(--text2);cursor:pointer">
          ← Nuevo análisis
        </button>
      </div>
      <div style="font-size:13px;font-weight:700;color:var(--text2)">
        Historial de análisis de chats
        <span style="font-size:11px;color:var(--text3);font-weight:400;margin-left:4px">${_chatAnalysesList.length} guardados</span>
      </div>
    </div>
    <div class="card" style="padding:20px">
      <div style="display:flex;flex-direction:column;gap:10px">${cardsHtml}</div>
    </div>
  `;
}

function setChatSubView(v) {
  _chatSubView = v;
  renderLeadsIA();
}

async function loadChatAnalysesList() {
  try {
    const res = await apiFetch(`${API_URL}/ai/chat-analyses`);
    if (!res.ok) return;
    _chatAnalysesList = await res.json();
    if (_chatSubView === 'historial') _renderChatHistorialView();
  } catch (_) {}
}

async function loadChatAnalysis(id) {
  try {
    const res = await apiFetch(`${API_URL}/ai/chat-analyses/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    _chatAnalysisId = data.id;
    _chatMessages   = data.messages || [];
    _chatSubView    = 'nuevo';
    _chatImages     = [];
    _chatInputText  = '';
    renderLeadsIA();
  } catch (err) {
    toast('Error al cargar: ' + err.message);
  }
}

function startNewChatAnalysis() {
  _chatImages.forEach(img => { if (img.previewUrl) URL.revokeObjectURL(img.previewUrl); });
  _chatFollowupImages.forEach(img => { if (img.previewUrl) URL.revokeObjectURL(img.previewUrl); });
  _chatAnalysisId       = null;
  _chatMessages         = [];
  _chatImages           = [];
  _chatFollowupImages   = [];
  _chatInputText        = '';
  _chatFollowupInputText = '';
  _chatSubView          = 'nuevo';
  renderLeadsIA();
}

async function runChatAnalysis() {
  const textEl   = document.getElementById('chat-text-input');
  const chatText = (textEl?.value || _chatInputText || '').trim();

  if (!chatText && _chatImages.length === 0) {
    toast('Pegá una conversación o adjuntá al menos un screenshot');
    return;
  }
  if (_chatLoading) return;

  _chatLoading   = true;
  _chatInputText = chatText;
  _renderChatNewView();

  try {
    const body = {
      chat_text: chatText,
      images: _chatImages.map(img => ({ base64: img.base64, mediaType: img.mediaType, name: img.name }))
    };

    const res = await apiFetch(`${API_URL}/ai/chat-analyze`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }

    const data      = await res.json();
    _chatAnalysisId = data.id;
    _chatMessages   = data.messages || [];
    _chatImages.forEach(img => { if (img.previewUrl) URL.revokeObjectURL(img.previewUrl); });
    _chatImages     = [];
    _chatInputText  = '';
    _chatLoading    = false;
    renderLeadsIA();
    loadChatAnalysesList();
    setTimeout(() => {
      const wrap = document.getElementById('chat-messages-wrap');
      if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 120);
  } catch (err) {
    _chatLoading = false;
    _renderChatNewView();
    toast('Error al analizar: ' + err.message);
  }
}

async function sendChatFollowup() {
  const input   = document.getElementById('chat-followup-input');
  const message = (input?.value || '').trim();
  if (!message && _chatFollowupImages.length === 0) return;
  if (_chatLoading) return;

  _chatLoading = true;
  const imgNote    = _chatFollowupImages.length > 0 ? `[${_chatFollowupImages.length} imagen(es)]\n` : '';
  const displayMsg = `${imgNote}${message}`.trim();
  _chatMessages    = [..._chatMessages, { role: 'user', content: displayMsg }];
  if (input) input.value = '';
  _chatFollowupInputText = '';

  const imagesToSend = [..._chatFollowupImages];
  _chatFollowupImages.forEach(img => { if (img.previewUrl) URL.revokeObjectURL(img.previewUrl); });
  _chatFollowupImages = [];
  _renderChatNewView();

  try {
    const res = await apiFetch(`${API_URL}/ai/chat-followup`, {
      method: 'POST',
      body: JSON.stringify({
        analysis_id: _chatAnalysisId,
        message,
        images: imagesToSend.map(img => ({ base64: img.base64, mediaType: img.mediaType, name: img.name })),
        messages: _chatMessages.slice(0, -1)
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }

    const data    = await res.json();
    _chatMessages = data.messages || _chatMessages;
    _chatLoading  = false;
    _renderChatNewView();
    setTimeout(() => {
      const wrap = document.getElementById('chat-messages-wrap');
      if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 120);
  } catch (err) {
    _chatMessages  = _chatMessages.slice(0, -1);
    _chatLoading   = false;
    _renderChatNewView();
    toast('Error: ' + err.message);
  }
}

async function addFollowupImages() {
  const input = document.getElementById('chat-followup-img-input');
  if (!input?.files?.length) return;

  const fta = document.getElementById('chat-followup-input');
  if (fta) _chatFollowupInputText = fta.value;

  for (const file of input.files) {
    if (!file.type.startsWith('image/')) continue;
    const base64 = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    _chatFollowupImages.push({ name: file.name, base64, mediaType: file.type, previewUrl: URL.createObjectURL(file) });
  }
  input.value = '';
  _renderChatNewView();
  const fta2 = document.getElementById('chat-followup-input');
  if (fta2) fta2.value = _chatFollowupInputText;
}

function removeFollowupImage(idx) {
  const fta = document.getElementById('chat-followup-input');
  if (fta) _chatFollowupInputText = fta.value;
  if (_chatFollowupImages[idx]?.previewUrl) URL.revokeObjectURL(_chatFollowupImages[idx].previewUrl);
  _chatFollowupImages.splice(idx, 1);
  _renderChatNewView();
  const fta2 = document.getElementById('chat-followup-input');
  if (fta2) fta2.value = _chatFollowupInputText;
}

function previewFollowupImage(idx) {
  const img = _chatFollowupImages[idx];
  if (img?.previewUrl) window.open(img.previewUrl, '_blank');
}

async function addChatImages() {
  const input = document.getElementById('chat-img-input');
  if (!input?.files?.length) return;

  const ta = document.getElementById('chat-text-input');
  if (ta) _chatInputText = ta.value;

  for (const file of input.files) {
    if (!file.type.startsWith('image/')) continue;
    const base64 = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    _chatImages.push({ name: file.name, base64, mediaType: file.type, previewUrl: URL.createObjectURL(file) });
  }
  input.value = '';
  _renderChatNewView();
  const ta2 = document.getElementById('chat-text-input');
  if (ta2) ta2.value = _chatInputText;
}

function removeChatImage(idx) {
  const ta = document.getElementById('chat-text-input');
  if (ta) _chatInputText = ta.value;
  if (_chatImages[idx]?.previewUrl) URL.revokeObjectURL(_chatImages[idx].previewUrl);
  _chatImages.splice(idx, 1);
  _renderChatNewView();
  const ta2 = document.getElementById('chat-text-input');
  if (ta2) ta2.value = _chatInputText;
}

function previewChatImage(idx) {
  const img = _chatImages[idx];
  if (img?.previewUrl) window.open(img.previewUrl, '_blank');
}

async function deleteChatAnalysis(id) {
  if (currentUserRole !== 'admin') return;
  if (!confirm('¿Eliminar este análisis? Esta acción no se puede deshacer.')) return;
  try {
    const res = await apiFetch(`${API_URL}/ai/chat-analyses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar');
    _chatAnalysesList = _chatAnalysesList.filter(a => a.id !== id);
    if (_chatAnalysisId === id) { _chatAnalysisId = null; _chatMessages = []; }
    _renderChatHistorialView();
    toast('Análisis eliminado ✓');
  } catch (err) {
    toast('Error: ' + err.message);
  }
}

async function openChatAIConfig() {
  if (currentUserRole !== 'admin') { toast('Solo los admins pueden configurar la IA'); return; }
  openModal('modal-chat-ia-config');
  try {
    const clienteId = localStorage.getItem('clienteSeleccionado') || '';
    const { data } = await _sb
      .from('ai_config')
      .select('chat_system_prompt, chat_custom_context')
      .eq('cliente_id', clienteId)
      .limit(1)
      .maybeSingle();
    const ctxEl    = document.getElementById('chat-ia-config-context');
    const promptEl = document.getElementById('chat-ia-config-prompt');
    if (ctxEl)    ctxEl.value    = (data && data.chat_custom_context) || '';
    if (promptEl) promptEl.value = (data && data.chat_system_prompt)  || '';
  } catch (err) {
    console.warn('[CHAT AI CONFIG]', err.message);
  }
}

async function saveChatAIConfig() {
  if (currentUserRole !== 'admin') { toast('Solo los admins pueden configurar la IA'); return; }
  const chat_system_prompt  = (document.getElementById('chat-ia-config-prompt')?.value  || '').trim();
  const chat_custom_context = (document.getElementById('chat-ia-config-context')?.value || '').trim();
  try {
    const res = await apiFetch(`${API_URL}/ai/chat-config`, {
      method: 'PATCH',
      body: JSON.stringify({ chat_system_prompt, chat_custom_context })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }
    closeModal('modal-chat-ia-config');
    toast('Configuración de IA guardada ✓');
  } catch (err) {
    toast('Error al guardar: ' + err.message);
  }
}

// ========== TAREAS ==========
const _TASKS_COLS = [
  {id:'por_hacer',   label:'Por hacer',   color:'#6090d4'},
  {id:'en_proceso',  label:'En proceso',  color:'#e0a848'},
  {id:'en_revision', label:'En revisión', color:'#9b74d4'},
  {id:'terminado',   label:'Terminado',   color:'#5cb87a'},
];
const _TASKS_PRIO_COLORS = {Alta:'#d46060', Media:'#e0a848', Baja:'#6090d4'};
const _TASKS_AREA_COLORS = {Marketing:'#9b74d4',Ventas:'#6090d4',Productos:'#5bbbd4',Sistemas:'#e0a848',Otro:'#5a607a'};
let _tasksList    = [];
let _tasksMembers = [];
let _taskDragId   = null;

function _tasksParseResp(val){
  if(!val) return [];
  try{ const p=JSON.parse(val); if(Array.isArray(p)) return p; }catch{}
  return [val];
}
function _tasksEmailLabel(email){
  const nick = _getNickname(email);
  if(nick) return nick;
  const local = email.split('@')[0];
  return local.split('.').map(p=>p.charAt(0).toUpperCase()+p.slice(1).toLowerCase().replace(/\d+$/,'')).join(' ').trim()||email;
}

async function renderTasks(){
  const email = (localStorage.getItem('userEmail')||'').toLowerCase();
  if(!TASKS_ALLOWED_EMAILS.includes(email)){
    toast('No tenés acceso a esta sección');
    nav('dash', document.getElementById('nav-dash'));
    return;
  }
  const root = document.getElementById('tasks-root');
  if(!root) return;
  root.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:16px 0">Cargando tareas…</div>';
  try {
    const [tasksRes, usersRes] = await Promise.all([
      apiFetch(`${API_URL}/tasks`),
      apiFetch(`${API_URL}/tasks/users`),
    ]);
    if(!tasksRes.ok) throw new Error('Error ' + tasksRes.status);
    _tasksList    = await tasksRes.json();
    _tasksMembers = usersRes.ok ? await usersRes.json() : [];
  } catch(e) {
    root.innerHTML = `<div style="color:#d46060;padding:16px 0">Error al cargar tareas: ${escHtml(e.message)}</div>`;
    return;
  }
  _renderTasksBoard();
}

function _renderTasksBoard(){
  const root = document.getElementById('tasks-root');
  if(!root) return;
  const colsHtml = _TASKS_COLS.map(col => {
    const colTasks = _tasksList.filter(t => t.columna === col.id);
    const overdue  = d => d && new Date(d) < new Date() && col.id !== 'terminado';
    const cardsHtml = colTasks.length === 0
      ? `<div style="color:var(--text3);font-size:12px;text-align:center;padding:24px 0;opacity:.4">Sin tareas</div>`
      : colTasks.map(t => {
          const prioColor  = _TASKS_PRIO_COLORS[t.prioridad] || 'var(--text3)';
          const areaColor  = _TASKS_AREA_COLORS[t.area]      || 'var(--text3)';
          const fechaStr   = t.fecha_limite ? new Date(t.fecha_limite+'T12:00:00').toLocaleDateString('es-AR',{day:'2-digit',month:'short'}) : '';
          const isOverdue  = overdue(t.fecha_limite);
          const resps      = _tasksParseResp(t.responsable);
          const respHtml   = resps.length ? `<div style="font-size:11px;color:var(--text3);margin-top:4px">👤 ${resps.map(e=>escHtml(_tasksEmailLabel(e))).join(' · ')}</div>` : '';
          return `<div class="task-card-item" data-id="${escHtml(t.id)}" draggable="true"
            ondragstart="_taskDragStart('${escHtml(t.id)}',event)"
            onclick="openTaskModal('${escHtml(t.id)}')"
            style="position:relative;background:var(--card2,#1e2130);border-radius:8px;padding:12px 14px;margin-bottom:10px;border:1px solid var(--line);cursor:grab;user-select:none">
            <button onclick="event.stopPropagation();deleteTaskCard('${escHtml(t.id)}')"
              style="position:absolute;top:7px;right:8px;background:none;border:none;color:var(--text3);font-size:14px;cursor:pointer;line-height:1;padding:2px 4px;border-radius:4px"
              onmouseover="this.style.color='#d46060'" onmouseout="this.style.color='var(--text3)'">×</button>
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px;padding-right:18px">
              <div style="flex:1;font-size:13px;font-weight:600;color:var(--text1);line-height:1.4">${escHtml(t.titulo||'Sin título')}</div>
              ${t.prioridad?`<span style="font-size:10px;font-weight:700;color:${prioColor};background:${prioColor}22;padding:2px 7px;border-radius:20px;white-space:nowrap;flex-shrink:0">${escHtml(t.prioridad)}</span>`:''}
            </div>
            ${t.descripcion?`<div style="font-size:12px;color:var(--text3);margin-bottom:6px;line-height:1.4">${escHtml(t.descripcion)}</div>`:''}
            ${respHtml}
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:7px">
              ${t.area?`<span style="font-size:11px;font-weight:600;color:${areaColor};background:${areaColor}22;padding:2px 8px;border-radius:20px">${escHtml(t.area)}</span>`:''}
              ${fechaStr?`<span style="font-size:11px;color:${isOverdue?'#d46060':'var(--text3)'}">${isOverdue?'⚠ ':'📅 '}${fechaStr}</span>`:''}
            </div>
          </div>`;
        }).join('');

    return `<div style="flex:1;min-width:230px;max-width:320px;border-radius:10px;padding:14px;background:var(--surface-2,#1a1d2b)"
      ondragover="_taskDragOver(event,this)"
      ondragleave="_taskDragLeave(event,this)"
      ondrop="_taskDrop('${col.id}',event,this)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <div style="width:10px;height:10px;border-radius:50%;background:${col.color};flex-shrink:0"></div>
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text2)">${escHtml(col.label)}</div>
        <div style="font-size:11px;color:var(--text3);margin-left:auto">${colTasks.length}</div>
      </div>
      <div>${cardsHtml}</div>
    </div>`;
  }).join('');
  root.innerHTML = `<div style="display:flex;gap:14px;align-items:flex-start;overflow-x:auto;padding-bottom:16px">${colsHtml}</div>`;
}

function _taskDragStart(id, event){
  _taskDragId = id;
  event.dataTransfer.setData('text/plain', id);
  event.dataTransfer.effectAllowed = 'move';
  setTimeout(()=>{
    const el = document.querySelector(`.task-card-item[data-id="${id}"]`);
    if(el) el.classList.add('task-card-dragging');
  }, 0);
}
function _taskDragOver(event, col){
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  col.classList.add('tasks-col-drop');
}
function _taskDragLeave(event, col){
  if(!col.contains(event.relatedTarget)) col.classList.remove('tasks-col-drop');
}
async function _taskDrop(columna, event, col){
  event.preventDefault();
  col.classList.remove('tasks-col-drop');
  const id = event.dataTransfer.getData('text/plain') || _taskDragId;
  _taskDragId = null;
  document.querySelectorAll('.task-card-item').forEach(el => el.classList.remove('task-card-dragging'));
  if(!id) return;
  const task = _tasksList.find(t => t.id === id);
  if(!task || task.columna === columna) return;
  task.columna = columna;
  _renderTasksBoard();
  try {
    const res = await apiFetch(`${API_URL}/tasks/${id}`, { method:'PATCH', body: JSON.stringify({ columna }) });
    if(!res.ok) throw new Error('Error ' + res.status);
    const saved = await res.json();
    _tasksList = _tasksList.map(t => t.id === id ? saved : t);
  } catch(e) {
    toast('Error al mover tarea: ' + e.message);
    renderTasks();
  }
}

function openTaskModal(id){
  const task = id ? _tasksList.find(t => t.id === id) : null;
  document.getElementById('task-modal-title').textContent  = task ? 'Editar tarea' : 'Nueva tarea';
  document.getElementById('task-modal-id').value           = task?.id || '';
  document.getElementById('task-f-titulo').value           = task?.titulo || '';
  document.getElementById('task-f-desc').value             = task?.descripcion || '';
  document.getElementById('task-f-columna').value          = task?.columna || 'por_hacer';
  document.getElementById('task-f-prioridad').value        = task?.prioridad || '';
  document.getElementById('task-f-area').value             = task?.area || '';
  document.getElementById('task-f-fecha').value            = task?.fecha_limite ? task.fecha_limite.slice(0,10) : '';
  document.getElementById('task-f-recursos').value         = task?.recursos || '';
  document.getElementById('task-delete-btn').style.display = task ? 'block' : 'none';

  const selected = new Set(_tasksParseResp(task?.responsable || ''));
  const list = document.getElementById('task-responsables-list');
  if(!_tasksMembers.length){
    list.innerHTML = '<span style="font-size:11px;color:var(--text3)">Sin usuarios cargados</span>';
  } else {
    list.innerHTML = _tasksMembers.map(u =>
      `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:3px 2px">
        <input type="checkbox" value="${escHtml(u.email)}" ${selected.has(u.email)?'checked':''}
          style="width:14px;height:14px;accent-color:var(--gold);cursor:pointer;flex-shrink:0">
        <span style="font-size:12px;color:var(--text1)">${escHtml(_tasksEmailLabel(u.email))}${u.role?` <span style="color:var(--text3);font-size:10px">· ${escHtml(u.role)}</span>`:''}</span>
      </label>`
    ).join('');
  }
  openModal('modal-task');
  setTimeout(()=>document.getElementById('task-f-titulo')?.focus(), 100);
}

async function saveTask(){
  const id          = document.getElementById('task-modal-id').value;
  const responsables = [...document.querySelectorAll('#task-responsables-list input:checked')].map(el => el.value);
  const body = {
    titulo:       document.getElementById('task-f-titulo').value.trim(),
    descripcion:  document.getElementById('task-f-desc').value.trim() || null,
    columna:      document.getElementById('task-f-columna').value,
    prioridad:    document.getElementById('task-f-prioridad').value || null,
    area:         document.getElementById('task-f-area').value || null,
    responsable:  responsables.length ? JSON.stringify(responsables) : '',
    fecha_limite: document.getElementById('task-f-fecha').value || null,
    recursos:     document.getElementById('task-f-recursos').value.trim() || null,
  };
  if(!body.titulo){ toast('El título es obligatorio'); return; }
  try {
    const res = await apiFetch(`${API_URL}/tasks${id ? '/'+id : ''}`, {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(body),
    });
    if(!res.ok){ const e=await res.json().catch(()=>({error:'Error'})); throw new Error(e.error); }
    const saved = await res.json();
    if(id){
      _tasksList = _tasksList.map(t => t.id === id ? saved : t);
    } else {
      _tasksList.push(saved);
    }
    closeModal('modal-task');
    _renderTasksBoard();
    toast(id ? 'Tarea actualizada ✓' : 'Tarea creada ✓');
  } catch(e){
    toast('Error: ' + e.message);
  }
}

async function deleteTaskCard(id){
  if(!id) return;
  if(!confirm('¿Eliminar esta tarea?')) return;
  try {
    const res = await apiFetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    if(!res.ok) throw new Error('Error ' + res.status);
    _tasksList = _tasksList.filter(t => t.id !== id);
    _renderTasksBoard();
    toast('Tarea eliminada');
  } catch(e){
    toast('Error: ' + e.message);
  }
}

async function deleteTask(){
  const id = document.getElementById('task-modal-id').value;
  if(!id) return;
  if(!confirm('¿Eliminar esta tarea?')) return;
  try {
    const res = await apiFetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    if(!res.ok) throw new Error('Error ' + res.status);
    _tasksList = _tasksList.filter(t => t.id !== id);
    closeModal('modal-task');
    _renderTasksBoard();
    toast('Tarea eliminada');
  } catch(e){
    toast('Error: ' + e.message);
  }
}

// ========== REPORTES SEMANALES ==========
let _repsHistory = [];
let _repsData    = null;   // full report object currently displayed
let _repsGenBusy     = false;  // generating report
let _repsAIBusy      = false;  // generating AI insights
let _repsChatHistory = [];     // chat message history [{role,content}]
let _repsChatBusy    = false;  // waiting for chat reply

function _repsLastWeek(){
  // Returns last complete Mon→Sun range
  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const daysSinceMon = (dow + 6) % 7;
  const thisMon = new Date(now); thisMon.setDate(now.getDate() - daysSinceMon);
  const lastMon = new Date(thisMon); lastMon.setDate(thisMon.getDate() - 7);
  const lastSun = new Date(thisMon); lastSun.setDate(thisMon.getDate() - 1);
  const fmt = d => d.toISOString().slice(0,10);
  return { from: fmt(lastMon), to: fmt(lastSun) };
}

function _repsWeekLabel(from, to){
  if(!from||!to) return '—';
  const [y1,m1,d1] = from.split('-').map(Number);
  const [,,d2] = to.split('-').map(Number);
  const [,m2] = to.split('-').map(Number);
  const MES = ['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  if(m1===m2) return `${d1}–${d2} ${MES[m1]} ${y1}`;
  return `${d1} ${MES[m1]} – ${d2} ${MES[m2]} ${y1}`;
}

async function renderReports(){
  const email = (localStorage.getItem('userEmail')||'').toLowerCase();
  if(!TASKS_ALLOWED_EMAILS.includes(email)){
    toast('No tenés acceso a esta sección');
    nav('dash', document.getElementById('nav-dash'));
    return;
  }
  const root = document.getElementById('reports-root');
  if(!root) return;
  root.innerHTML = `<div style="color:var(--text3);font-size:13px;padding:30px 0">Cargando historial…</div>`;
  try {
    const res = await apiFetch(`${API_URL}/reports/weekly`);
    _repsHistory = res.ok ? await res.json() : [];
  } catch(e){ _repsHistory = []; }
  _repsRenderPage();
}

function _repsRenderPage(){
  const root = document.getElementById('reports-root');
  if(!root) return;
  const def = _repsLastWeek();
  const fromVal = _repsData?.fecha_inicio || def.from;
  const toVal   = _repsData?.fecha_fin   || def.to;

  root.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px">
      <div>
        <div class="page-title" style="margin-bottom:4px">Reportes Semanales</div>
        <div class="page-sub">Análisis automático de métricas, contenido y ventas</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--surface-2,#1a1d2b);border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin-bottom:20px">
      <span style="font-size:10px;color:var(--text3);font-weight:700;letter-spacing:.05em;flex-shrink:0">SEMANA</span>
      <input type="date" id="reps-from" value="${escHtml(fromVal)}" class="form-input" style="width:140px;font-size:13px;padding:6px 10px">
      <span style="color:var(--text3);font-size:12px">→</span>
      <input type="date" id="reps-to" value="${escHtml(toVal)}" class="form-input" style="width:140px;font-size:13px;padding:6px 10px">
      <button onclick="repsGenerate()" ${_repsGenBusy?'disabled':''} style="background:var(--gold);color:#111;border:none;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap${_repsGenBusy?';opacity:.6':''}">
        ${_repsGenBusy ? '⏳ Generando…' : '📊 Generar reporte'}
      </button>
    </div>
    <div style="display:flex;gap:16px;align-items:flex-start">
      <div id="reps-sidebar" style="width:190px;flex-shrink:0">
        <div class="reps-section-label">Historial</div>
        ${_repsHistory.length===0
          ? `<div style="font-size:12px;color:var(--text3);padding:8px 0">Sin reportes aún</div>`
          : _repsHistory.map(r=>{
              const active = _repsData?.id===r.id;
              return `<div class="reps-history-item${active?' active':''}" style="position:relative" onclick="repsLoadReport('${escHtml(r.id)}')">
                <div style="font-size:12px;font-weight:${active?'700':'600'};color:${active?'var(--gold)':'var(--text1)'};padding-right:18px">${_repsWeekLabel(r.fecha_inicio,r.fecha_fin)}</div>
                <div style="font-size:10px;color:var(--text3);margin-top:2px">${r.insights_ia?'✦ con IA':'sin IA'}</div>
                <button onclick="event.stopPropagation();repsDeleteReport('${escHtml(r.id)}')" style="position:absolute;top:6px;right:6px;background:none;border:none;color:var(--text3);font-size:13px;cursor:pointer;line-height:1;padding:2px 3px;border-radius:3px" onmouseover="this.style.color='#d46060'" onmouseout="this.style.color='var(--text3)'">×</button>
              </div>`;
            }).join('')
        }
      </div>
      <div id="reps-main" style="flex:1;min-width:0">
        ${_repsData ? _repsRenderMain(_repsData) : `
          <div style="text-align:center;padding:60px 20px;color:var(--text3)">
            <div style="font-size:36px;margin-bottom:14px">📊</div>
            <div style="font-size:14px;font-weight:600;color:var(--text2);margin-bottom:6px">Generá tu primer reporte semanal</div>
            <div style="font-size:12px">Seleccioná el rango y hacé clic en "Generar reporte"</div>
          </div>`
        }
      </div>
    </div>`;
}

function _repsRenderMain(report){
  const m    = report.metricas || {};
  const v    = m.ventas    || {};
  const comp = m.comparativa || {};
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:8px">
      <div>
        <div style="font-size:15px;font-weight:700;color:var(--text1)">🗓 Semana ${_repsWeekLabel(report.fecha_inicio,report.fecha_fin)}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${report.fecha_inicio} → ${report.fecha_fin}</div>
      </div>
      <button onclick="repsExportPDF()" style="background:none;border:1px solid var(--line);color:var(--text2);border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer">↓ Exportar PDF</button>
    </div>
    ${_repsKPIs(v,comp)}
    ${_repsComparativa(v,comp)}
    ${_repsFunnel(m.funnel||{})}
    ${_repsTopContent(m.top_angulos||[],m.top_piezas||[])}
    ${_repsInsightsBlock(report)}
    ${_repsChatSection(report)}`;
}

function _repsKPIs(v,comp){
  const delta = (d) => {
    if(!d||d==='0%') return '';
    const up = d.startsWith('+');
    return `<div style="font-size:10px;margin-top:3px;font-weight:700;color:${up?'#5cb87a':'#d46060'}">${d} vs ant.</div>`;
  };
  const kpi = (label,val,accent,d) => `
    <div class="reps-kpi">
      <div style="font-size:10px;color:var(--text3);font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin-bottom:5px">${label}</div>
      <div style="font-size:20px;font-weight:800;color:${accent||'var(--text1)'};font-family:'Inter',sans-serif;line-height:1">${val}</div>
      ${delta(d)}
    </div>`;
  const leads      = v.leads??0;
  const agendas    = v.agendas??0;
  const cerrados   = v.cerrados??0;
  const calls      = v.calls??0;
  const shows      = v.shows??0;
  const pctAgend   = leads  > 0 ? Math.round(agendas  / leads  * 100) : 0;
  const showRate   = calls  > 0 ? Math.round(shows    / calls  * 100) : 0;
  const pctCShows  = shows  > 0 ? Math.round(cerrados / shows  * 100) : 0;
  const pctCTotal  = leads  > 0 ? Math.round(cerrados / leads  * 100) : 0;
  return `
    <div class="reps-section-label">Ventas</div>
    <div class="reps-kpi-grid">
      ${kpi('Leads Generados',   leads,                          'var(--text1)',  comp.delta_leads)}
      ${kpi('Agendas',           agendas,                        'var(--gold)',   '')}
      ${kpi('% Agendamiento',    pctAgend+'%',                   '#6090d4',      '')}
      ${kpi('Llamadas',          calls,                          'var(--text1)', comp.delta_calls)}
      ${kpi('% Show Up',         showRate+'%',                   showRate>=70?'#5cb87a':showRate>=50?'var(--gold)':'#d46060', '')}
      ${kpi('Cierres',           cerrados,                       '#5cb87a',      comp.delta_cerrados)}
      ${kpi('% Cierre/Shows',    pctCShows+'%',                  '#5cb87a',      '')}
      ${kpi('% Cierre Total',    pctCTotal+'%',                  '#5cb87a',      '')}
      ${kpi('Facturación',       fmtMoney(v.facturacion??0),     '#5cb87a',      comp.delta_facturacion)}
      ${kpi('Cash Collected',    fmtMoney(v.cash_collected??0),  '#5cb87a',      comp.delta_cash_collected)}
      ${kpi('AOV',               fmtMoney(v.aov??0),             'var(--text1)', '')}
    </div>`;
}

function _repsComparativa(v,comp){
  if(!comp?.semana_anterior) return '';
  const ant = comp.semana_anterior;
  const row = (label,curr,prev,d) => {
    const up = (d||'').startsWith('+');
    const neu = !d||d==='0%';
    return `<tr style="border-bottom:1px solid rgba(255,255,255,.03)">
      <td style="font-size:12px;color:var(--text2);padding:6px 0">${label}</td>
      <td style="font-size:13px;font-weight:700;color:var(--text1);text-align:right">${curr}</td>
      <td style="font-size:12px;color:var(--text3);text-align:right">${prev}</td>
      <td style="text-align:right;padding-left:8px"><span style="font-size:11px;font-weight:700;color:${neu?'var(--text3)':up?'#5cb87a':'#d46060'}">${d||'—'}</span></td>
    </tr>`;
  };
  return `
    <div class="reps-section-label" style="margin-top:4px">Comparativa semana anterior</div>
    <div class="reps-card" style="margin-bottom:20px">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr>
          <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:left;padding-bottom:8px">Métrica</th>
          <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:right;padding-bottom:8px">Esta semana</th>
          <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:right;padding-bottom:8px">Semana ant.</th>
          <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:right;padding-bottom:8px;padding-left:8px">Δ</th>
        </tr></thead>
        <tbody>
          ${row('Leads',             v.leads??'—',                     ant.leads??'—',              comp.delta_leads)}
          ${row('Cerrados',          v.cerrados??'—',                  ant.cerrados??'—',           comp.delta_cerrados)}
          ${row('Facturación',       fmtMoney(v.facturacion??0),       fmtMoney(ant.facturacion??0), comp.delta_facturacion)}
          ${row('Cash Collected',    fmtMoney(v.cash_collected??0),    fmtMoney(ant.cash_collected??0), comp.delta_cash_collected)}
          ${row('Calls',             v.calls??'—',                     ant.calls??'—',              comp.delta_calls)}
        </tbody>
      </table>
    </div>`;
}

function _repsFunnel(funnel){
  if(!funnel?.fases?.length) return '';
  const total = Math.max(funnel.total||1, 1);
  const FASE_COL = {'Primer Contacto':'#9a9690','Descubrimiento':'#6090d4','Nutrición':'#a070d8','Agendamiento':'#e0a848','Cierre':'#d4a832','Cerrados':'#5cb87a'};
  return `
    <div class="reps-section-label" style="margin-top:4px">Funnel
      <span style="font-weight:400;margin-left:6px">${funnel.total??0} activos · ${funnel.perdidos??0} perdidos</span>
    </div>
    <div class="reps-card" style="margin-bottom:20px">
      ${funnel.fases.map(f=>{
        const w = Math.min(100, Math.round(f.count/total*100));
        const col = FASE_COL[f.label]||'var(--gold)';
        return `<div style="display:flex;align-items:center;gap:10px;padding:5px 0">
          <div style="width:110px;font-size:11px;color:${col};font-weight:600;flex-shrink:0">${f.label}</div>
          <div style="flex:1;background:rgba(255,255,255,.05);border-radius:4px;height:7px;overflow:hidden">
            <div style="width:${w}%;height:100%;background:${col};border-radius:4px;opacity:.75"></div>
          </div>
          <div style="font-size:12px;font-weight:700;color:var(--text1);min-width:22px;text-align:right">${f.count}</div>
          <div style="font-size:10px;color:var(--text3);min-width:28px;text-align:right">${f.pct}%</div>
        </div>`;
      }).join('')}
    </div>`;
}

function _repsTopContent(topAng,topPiez){
  if(!topAng.length&&!topPiez.length) return `
    <div class="reps-section-label" style="margin-top:4px">Contenido y Atribución</div>
    <div class="reps-card" style="margin-bottom:20px;text-align:center;color:var(--text3);font-size:12px">
      Sin datos de atribución de contenido para esta semana.
    </div>`;

  const angRows = topAng.slice(0,5).map((a,i)=>`
    <tr style="border-bottom:1px solid rgba(255,255,255,.03)">
      <td style="padding:7px 0;font-size:12px;font-weight:${i===0?'700':'500'};color:${i===0?'var(--gold)':'var(--text1)'}">
        ${i===0?'<span style="color:var(--gold);margin-right:4px">★</span>':''}${escHtml(a.angulo)}
      </td>
      <td style="text-align:center;font-size:12px;color:var(--gold)">${a.agendas}</td>
      <td style="text-align:center;font-size:12px;font-weight:700;color:#5cb87a">${a.ventas}</td>
      <td style="text-align:center;font-size:12px;color:var(--text2)">${a.close_rate}%</td>
      <td style="text-align:right;font-size:12px;color:#5cb87a;font-weight:600">${a.facturacion>0?fmtMoney(a.facturacion):'—'}</td>
    </tr>`).join('');

  const TIPO_COL = {Reel:'#6090d4',Carrusel:'#e0a848',Historia:'#a070d8',YouTube:'#d46060'};
  const piezRows = topPiez.slice(0,8).map(p=>`
    <tr style="border-bottom:1px solid rgba(255,255,255,.03)">
      <td style="padding:6px 0">
        <span style="font-size:10px;font-weight:700;color:${TIPO_COL[p.tipo]||'var(--text3)'};background:${TIPO_COL[p.tipo]||'#555'}18;padding:2px 6px;border-radius:4px">${escHtml(p.tipo||'')}</span>
        <span style="font-size:12px;color:var(--text2);margin-left:6px">${escHtml(p.label)}</span>
      </td>
      <td style="font-size:11px;color:var(--text3);padding:6px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(p.angulo||'—')}</td>
      <td style="text-align:center;font-size:12px;color:var(--text3)">${p.leads_generados??0}</td>
      <td style="text-align:center;font-size:12px;color:var(--gold)">${p.agendas}</td>
      <td style="text-align:center;font-size:12px;font-weight:700;color:#5cb87a">${p.ventas}</td>
    </tr>`).join('');

  return `
    <div class="reps-section-label" style="margin-top:4px">Contenido y Atribución</div>
    <div class="reps-card" style="margin-bottom:20px">
      ${topAng.length?`
        <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:8px">Top Ángulos</div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:${topPiez.length?'16':'0'}px">
          <thead><tr style="border-bottom:1px solid rgba(255,255,255,.06)">
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:left;padding-bottom:6px">Ángulo</th>
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:center;padding:0 6px 6px">Agendas</th>
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:center;padding:0 6px 6px">Ventas</th>
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:center;padding:0 6px 6px">Cierre</th>
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:right;padding-bottom:6px">Facturación</th>
          </tr></thead>
          <tbody>${angRows}</tbody>
        </table>`:''}
      ${topPiez.length?`
        <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:8px">Top Piezas de Contenido</div>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="border-bottom:1px solid rgba(255,255,255,.06)">
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:left;padding-bottom:6px">Pieza</th>
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:left;padding:0 6px 6px">Ángulo</th>
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:center;padding:0 6px 6px">Leads</th>
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:center;padding:0 6px 6px">Agendas</th>
            <th style="font-size:10px;color:var(--text3);font-weight:600;text-align:center;padding-bottom:6px">Ventas</th>
          </tr></thead>
          <tbody>${piezRows}</tbody>
        </table>`:''}
    </div>`;
}

function _repsInsightsBlock(report){
  const aiRaw = report.insights_ia;
  if(!aiRaw){
    if(!report.id) return '';
    return `
      <div id="reps-ai-block">
        <div class="reps-section-label" style="margin-top:4px">Insights IA</div>
        <div class="reps-card" style="text-align:center;padding:24px">
          <div style="font-size:13px;color:var(--text2);margin-bottom:14px">Generá un análisis automático con IA de esta semana</div>
          <button onclick="repsGenInsights()" ${_repsAIBusy?'disabled':''} style="background:var(--gold);color:#111;border:none;border-radius:8px;padding:9px 22px;font-size:13px;font-weight:700;cursor:pointer${_repsAIBusy?';opacity:.6':''}">
            ${_repsAIBusy?'⏳ Generando…':'✦ Generar insights IA'}
          </button>
        </div>
      </div>`;
  }
  let ins = null;
  try {
    let raw = typeof aiRaw === 'string' ? aiRaw : JSON.stringify(aiRaw);
    raw = raw.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    ins = JSON.parse(raw);
  } catch(e) {}
  return `
    <div id="reps-ai-block">
      <div class="reps-section-label" style="margin-top:4px;display:flex;align-items:center;justify-content:space-between">
        <span>Insights IA</span>
        <button onclick="repsGenInsights()" ${_repsAIBusy?'disabled':''} style="background:none;border:1px solid rgba(224,181,74,.25);color:var(--gold);border-radius:6px;padding:3px 10px;font-size:11px;font-weight:600;cursor:pointer;text-transform:none;letter-spacing:0">
          ${_repsAIBusy?'⏳…':'↻ Regenerar'}
        </button>
      </div>
      ${ins ? _repsRenderInsightsJSON(ins) : `<div class="reps-card"><p style="font-size:12px;color:var(--text2);line-height:1.7;white-space:pre-wrap">${escHtml(aiRaw)}</p></div>`}
    </div>`;
}

function _repsRenderInsightsJSON(ins){
  const block = (icon,title,content,accent) => {
    if(!content||(Array.isArray(content)&&!content.length)) return '';
    const body = Array.isArray(content)
      ? `<ul style="margin:4px 0 0;padding-left:16px">${content.map(it=>`<li style="font-size:12px;color:var(--text2);margin-bottom:4px;line-height:1.5">${escHtml(it)}</li>`).join('')}</ul>`
      : `<p style="margin:4px 0 0;font-size:12px;color:var(--text2);line-height:1.6">${escHtml(content)}</p>`;
    return `<div style="margin-bottom:10px;padding:12px 14px;border-radius:8px;background:${accent}0d;border-left:3px solid ${accent}">
      <div style="font-size:11px;font-weight:700;color:${accent};letter-spacing:.02em">${icon} ${title}</div>
      ${body}
    </div>`;
  };
  return block('📋','Resumen ejecutivo',    ins.resumen_ejecutivo,      '#e0b54a')
       + block('✅','Qué funcionó',          ins.que_funciono,           '#5cb87a')
       + block('⚠️','Problemas detectados', ins.problemas_detectados,   '#d46060')
       + block('🎯','Recomendaciones',       ins.recomendaciones,        '#6090d4')
       + block('🚨','Riesgos',              ins.riesgos,                '#e07840');
}

async function repsGenerate(){
  if(_repsGenBusy) return;
  const fromEl = document.getElementById('reps-from');
  const toEl   = document.getElementById('reps-to');
  if(!fromEl||!toEl) return;
  const from = fromEl.value, to = toEl.value;
  if(!from||!to){ toast('Seleccioná un rango de fechas'); return; }
  if(from>to){ toast('La fecha inicio debe ser anterior a la fecha fin'); return; }
  _repsGenBusy = true;
  _repsRenderPage();
  try {
    const res = await apiFetch(`${API_URL}/reports/weekly/generate`, {
      method:'POST', body:JSON.stringify({fecha_inicio:from,fecha_fin:to}),
    });
    if(!res.ok){ const e=await res.json().catch(()=>({})); throw new Error(e.error||`HTTP ${res.status}`); }
    _repsData = await res.json();
    _repsChatHistory = [];
    const hRes = await apiFetch(`${API_URL}/reports/weekly`);
    if(hRes.ok) _repsHistory = await hRes.json();
    toast('Reporte generado ✓');
  } catch(e){ toast('Error al generar: '+e.message); }
  finally { _repsGenBusy=false; _repsRenderPage(); }
}

async function repsGenInsights(){
  if(_repsAIBusy||!_repsData) return;
  _repsAIBusy = true;
  const aiBlock = document.getElementById('reps-ai-block');
  if(aiBlock) aiBlock.innerHTML=`<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">⏳ Generando análisis IA…</div>`;
  try {
    const res = await apiFetch(`${API_URL}/reports/weekly/insights`, {
      method:'POST',
      body:JSON.stringify({
        report_id:    _repsData.id,
        metricas:     _repsData.metricas,
        fecha_inicio: _repsData.fecha_inicio,
        fecha_fin:    _repsData.fecha_fin,
      }),
    });
    if(!res.ok){ const e=await res.json().catch(()=>({})); throw new Error(e.error||`HTTP ${res.status}`); }
    const data = await res.json();
    _repsData.insights_ia = data.insights_ia;
    // Update history entry to show "con IA"
    const hi = _repsHistory.find(r=>r.id===_repsData.id);
    if(hi) hi.insights_ia = data.insights_ia;
    toast('Insights IA generados ✓');
  } catch(e){ toast('Error al generar insights: '+e.message); }
  finally {
    _repsAIBusy = false;
    const main = document.getElementById('reps-main');
    if(main&&_repsData) main.innerHTML = _repsRenderMain(_repsData);
    const sidebar = document.getElementById('reps-sidebar');
    if(sidebar) sidebar.innerHTML = _repsHistory.length===0
      ? `<div class="reps-section-label">Historial</div><div style="font-size:12px;color:var(--text3)">Sin reportes aún</div>`
      : `<div class="reps-section-label">Historial</div>`+_repsHistory.map(r=>{
          const active=_repsData?.id===r.id;
          return `<div class="reps-history-item${active?' active':''}" style="position:relative" onclick="repsLoadReport('${escHtml(r.id)}')">
            <div style="font-size:12px;font-weight:${active?'700':'600'};color:${active?'var(--gold)':'var(--text1)'};padding-right:18px">${_repsWeekLabel(r.fecha_inicio,r.fecha_fin)}</div>
            <div style="font-size:10px;color:var(--text3);margin-top:2px">${r.insights_ia?'✦ con IA':'sin IA'}</div>
            <button onclick="event.stopPropagation();repsDeleteReport('${escHtml(r.id)}')" style="position:absolute;top:6px;right:6px;background:none;border:none;color:var(--text3);font-size:13px;cursor:pointer;line-height:1;padding:2px 3px;border-radius:3px" onmouseover="this.style.color='#d46060'" onmouseout="this.style.color='var(--text3)'">×</button>
          </div>`;
        }).join('');
  }
}

async function repsDeleteReport(id){
  if(!confirm('¿Eliminar este reporte?')) return;
  try {
    const res = await apiFetch(`${API_URL}/reports/weekly/${id}`, { method:'DELETE' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    _repsHistory = _repsHistory.filter(r=>r.id!==id);
    if(_repsData?.id===id) _repsData = null;
    _repsRenderPage();
    toast('Reporte eliminado');
  } catch(e){ toast('Error al eliminar: '+e.message); }
}

async function repsLoadReport(id){
  try {
    const res = await apiFetch(`${API_URL}/reports/weekly/${id}`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    _repsData = await res.json();
    _repsChatHistory = [];
    _repsRenderPage();
  } catch(e){ toast('Error al cargar reporte: '+e.message); }
}

function repsExportPDF(){
  if(!_repsData) return;
  const _pName = prompt('Nombre del cliente para el reporte:');
  if(_pName===null) return; // cancelled
  const clientName = _pName.trim();
  const m     = _repsData.metricas||{};
  const v     = m.ventas||{};
  const comp  = m.comparativa||{};
  const topAng  = m.top_angulos||[];
  const topPiez = m.top_piezas||[];
  const weekLabel = _repsWeekLabel(_repsData.fecha_inicio,_repsData.fecha_fin);
  const MES=['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  let aiHtml='';
  if(_repsData.insights_ia){
    let ins=null;
    try{
      let raw=typeof _repsData.insights_ia==='string'?_repsData.insights_ia:JSON.stringify(_repsData.insights_ia);
      raw=raw.replace(/^```(?:json)?\s*\n?/,'').replace(/\n?```\s*$/,'');
      ins=JSON.parse(raw);
    }catch(e){}
    if(ins){
      const sec=(title,items)=>{
        if(!items||(Array.isArray(items)&&!items.length)) return '';
        return `<div style="margin-bottom:12px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#777;margin-bottom:5px">${title}</div>
          ${Array.isArray(items)
            ?`<ul style="margin:0;padding-left:16px">${items.map(i=>`<li style="font-size:11px;color:#222;margin-bottom:3px;line-height:1.5">${i}</li>`).join('')}</ul>`
            :`<p style="margin:0;font-size:11px;color:#333;line-height:1.6">${items}</p>`
          }
        </div>`;
      };
      aiHtml=`<div style="margin-top:20px;padding-top:16px;border-top:2px solid #e0b54a">
        <div style="font-size:13px;font-weight:800;color:#111;margin-bottom:12px">✦ Insights IA</div>
        ${sec('Resumen ejecutivo',ins.resumen_ejecutivo)}
        ${sec('Qué funcionó',ins.que_funciono)}
        ${sec('Problemas detectados',ins.problemas_detectados)}
        ${sec('Recomendaciones',ins.recomendaciones)}
        ${sec('Riesgos',ins.riesgos)}
      </div>`;
    }
  }

  let chatHtml='';
  if(_repsChatHistory.length){
    const bubbles=_repsChatHistory.map(m=>{
      const isUser=m.role==='user';
      return `<div style="display:flex;justify-content:${isUser?'flex-end':'flex-start'};margin-bottom:8px">
        <div style="max-width:78%;padding:8px 12px;border-radius:${isUser?'10px 10px 2px 10px':'10px 10px 10px 2px'};background:${isUser?'#fdf6e3':'#f5f5f5'};border:1px solid ${isUser?'#e0b54a55':'#e5e5e5'};font-size:11px;color:#222;line-height:1.55;white-space:pre-wrap">
          <div style="font-size:9px;font-weight:700;color:${isUser?'#b8922a':'#888'};margin-bottom:3px;text-transform:uppercase;letter-spacing:.04em">${isUser?'Vos':'Consultor IA'}</div>
          ${m.content}
        </div>
      </div>`;
    }).join('');
    chatHtml=`<div style="margin-top:20px;padding-top:16px;border-top:2px solid #e0b54a">
      <div style="font-size:13px;font-weight:800;color:#111;margin-bottom:14px">💬 Conversación con IA</div>
      ${bubbles}
    </div>`;
  }

  const kpiBox=(l,val)=>`<div style="flex:1;padding:10px 12px;border:1px solid #e5e5e5;border-radius:8px;min-width:80px">
    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#999;margin-bottom:4px">${l}</div>
    <div style="font-size:17px;font-weight:800;color:#111">${val}</div>
  </div>`;

  const angRows=topAng.slice(0,5).map(a=>`<tr>
    <td style="padding:5px 0;font-size:11px;color:#111;font-weight:600">${a.angulo}</td>
    <td style="text-align:center;font-size:11px">${a.agendas}</td>
    <td style="text-align:center;font-size:11px;font-weight:700;color:#2a7a4f">${a.ventas}</td>
    <td style="text-align:center;font-size:11px;color:#555">${a.close_rate}%</td>
    <td style="text-align:right;font-size:11px;color:#2a7a4f">${a.facturacion>0?fmtMoney(a.facturacion):'—'}</td>
  </tr>`).join('');

  const piezRows=topPiez.slice(0,10).map(p=>`<tr>
    <td style="padding:5px 0;font-size:11px;color:#111;font-weight:600">${p.label}</td>
    <td style="font-size:10px;color:#666">${p.tipo||''}</td>
    <td style="font-size:10px;color:#666;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.angulo||'—'}</td>
    <td style="text-align:center;font-size:11px;color:#555">${p.leads_generados??0}</td>
    <td style="text-align:center;font-size:11px;color:#555">${p.agendas}</td>
    <td style="text-align:center;font-size:11px;font-weight:700;color:#2a7a4f">${p.ventas}</td>
  </tr>`).join('');

  const ant = comp.semana_anterior||null;
  const compRow=(label,curr,prev,d)=>{
    const up=(d||'').startsWith('+'), neu=!d||d==='0%';
    return `<tr>
      <td style="font-size:11px;color:#444;padding:5px 0">${label}</td>
      <td style="font-size:12px;font-weight:700;color:#111;text-align:right">${curr}</td>
      <td style="font-size:11px;color:#888;text-align:right">${prev}</td>
      <td style="text-align:right;padding-left:8px;font-size:11px;font-weight:700;color:${neu?'#aaa':up?'#2a7a4f':'#c0392b'}">${d||'—'}</td>
    </tr>`;
  };

  const funnelRows=(m.funnel?.fases||[]).map(f=>`<tr>
    <td style="font-size:11px;padding:4px 0;color:#333">${f.label}</td>
    <td style="text-align:right;font-size:11px;font-weight:700">${f.count}</td>
    <td style="text-align:right;font-size:11px;color:#888">${f.pct}%</td>
  </tr>`).join('');

  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Reporte Semanal${clientName?' — '+clientName:''} — ${weekLabel}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;color:#111;padding:36px;max-width:820px;margin:0 auto}
  @media print{body{padding:18px}button{display:none!important}@page{margin:1.5cm}}
  table{width:100%;border-collapse:collapse}
  th{color:#888;font-size:10px;font-weight:600;text-align:left;border-bottom:1px solid #eee;padding-bottom:6px}
  td{border-bottom:1px solid #f5f5f5}
</style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #e0b54a">
    <div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#aaa;margin-bottom:6px">Reporte Semanal${clientName?' — '+clientName:''}</div>
      <div style="font-size:24px;font-weight:800;color:#111">${weekLabel}</div>
      <div style="font-size:11px;color:#bbb;margin-top:4px">${_repsData.fecha_inicio} → ${_repsData.fecha_fin}</div>
    </div>
    <div style="font-size:11px;color:#ccc;text-align:right">Generado: ${new Date().toLocaleDateString('es-AR')}</div>
  </div>

  <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#aaa;margin-bottom:8px">KPIs de la semana</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
    ${(()=>{
      const pL=v.leads??0, pA=v.agendas??0, pC=v.cerrados??0, pCalls=v.calls??0, pShows=v.shows??0;
      const pPctAgend  = pL     >0 ? Math.round(pA/pL*100)     : 0;
      const pShowRate  = pCalls >0 ? Math.round(pShows/pCalls*100) : 0;
      const pPctCShows = pShows >0 ? Math.round(pC/pShows*100) : 0;
      const pPctCTotal = pL     >0 ? Math.round(pC/pL*100)     : 0;
      return [
        ['Leads Generados',   pL],
        ['Agendas',           pA],
        ['% Agendamiento',    pPctAgend+'%'],
        ['Llamadas',          pCalls],
        ['% Show Up',         pShowRate+'%'],
        ['Cierres',           pC],
        ['% Cierre/Shows',    pPctCShows+'%'],
        ['% Cierre Total',    pPctCTotal+'%'],
        ['Facturación',       fmtMoney(v.facturacion??0)],
        ['Cash Collected',    fmtMoney(v.cash_collected??0)],
        ['AOV',               fmtMoney(v.aov??0)],
      ].map(([l,val])=>kpiBox(l,val)).join('');
    })()}
  </div>

  ${ant?`
  <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#aaa;margin-bottom:8px;margin-top:16px">Comparativa semana anterior</div>
  <table style="margin-bottom:16px">
    <thead><tr>
      <th>Métrica</th>
      <th style="text-align:right">Esta semana</th>
      <th style="text-align:right">Semana ant.</th>
      <th style="text-align:right;padding-left:8px">Δ</th>
    </tr></thead>
    <tbody>
      ${compRow('Leads',             v.leads??'—',                  ant.leads??'—',              comp.delta_leads)}
      ${compRow('Cerrados',          v.cerrados??'—',               ant.cerrados??'—',           comp.delta_cerrados)}
      ${compRow('Facturación',       fmtMoney(v.facturacion??0),    fmtMoney(ant.facturacion??0), comp.delta_facturacion)}
      ${compRow('Cash Collected',    fmtMoney(v.cash_collected??0), fmtMoney(ant.cash_collected??0), comp.delta_cash_collected)}
      ${compRow('Calls',             v.calls??'—',                  ant.calls??'—',              comp.delta_calls)}
    </tbody>
  </table>`:''}

  ${topAng.length?`
  <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#aaa;margin-bottom:8px;margin-top:16px">Top Ángulos</div>
  <table style="margin-bottom:16px">
    <thead><tr>
      <th>Ángulo</th><th style="text-align:center">Agendas</th>
      <th style="text-align:center">Ventas</th><th style="text-align:center">Cierre</th>
      <th style="text-align:right">Facturación</th>
    </tr></thead>
    <tbody>${angRows}</tbody>
  </table>`:''}

  ${piezRows?`
  <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#aaa;margin-bottom:8px;margin-top:16px">Top Piezas de Contenido</div>
  <table style="margin-bottom:16px">
    <thead><tr>
      <th>Pieza</th><th>Tipo</th><th>Ángulo</th>
      <th style="text-align:center">Leads</th>
      <th style="text-align:center">Agendas</th>
      <th style="text-align:center">Ventas</th>
    </tr></thead>
    <tbody>${piezRows}</tbody>
  </table>`:''}

  ${funnelRows?`
  <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#aaa;margin-bottom:8px;margin-top:16px">Funnel</div>
  <table style="margin-bottom:16px">
    <thead><tr><th>Fase</th><th style="text-align:right">Leads</th><th style="text-align:right">%</th></tr></thead>
    <tbody>${funnelRows}</tbody>
  </table>`:''}

  ${aiHtml}
  ${chatHtml}
  <p style="margin-top:32px;text-align:center">
    <button onclick="window.print()" style="background:#e0b54a;color:#111;border:none;border-radius:8px;padding:10px 26px;font-size:13px;font-weight:700;cursor:pointer">
      Imprimir / Guardar PDF
    </button>
  </p>
</body></html>`;

  const w = window.open('','_blank');
  if(!w){ toast('Permitir popups para exportar PDF'); return; }
  w.document.write(html);
  w.document.close();
}

// ── CHAT IA ──────────────────────────────────────────────────

function _repsChatSection(report){
  if(!report?.id) return '<div id="reps-chat-section"></div>';
  const msgs = _repsChatHistory.map(m=>{
    const isUser = m.role==='user';
    return `<div style="display:flex;justify-content:${isUser?'flex-end':'flex-start'};margin-bottom:8px">
      <div style="max-width:82%;padding:9px 13px;border-radius:${isUser?'10px 10px 2px 10px':'10px 10px 10px 2px'};background:${isUser?'rgba(224,181,74,.13)':'rgba(255,255,255,.04)'};border:1px solid ${isUser?'rgba(224,181,74,.28)':'rgba(255,255,255,.06)'};font-size:12px;color:var(--text1);line-height:1.55;white-space:pre-wrap">
        ${escHtml(m.content)}
      </div>
    </div>`;
  }).join('');
  const loadingBubble = _repsChatBusy ? `
    <div style="display:flex;justify-content:flex-start;margin-bottom:8px">
      <div style="padding:9px 14px;border-radius:10px 10px 10px 2px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);font-size:14px;color:var(--text3);letter-spacing:2px">···</div>
    </div>` : '';
  return `
    <div id="reps-chat-section">
      <div class="reps-section-label" style="margin-top:4px">Consultor IA</div>
      <div class="reps-card" style="padding:0;overflow:hidden">
        ${msgs||loadingBubble ? `<div id="reps-chat-msgs" style="padding:12px 14px;max-height:360px;overflow-y:auto;display:flex;flex-direction:column">${msgs}${loadingBubble}</div>` : ''}
        <div style="display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.05)">
          <input id="reps-chat-input" type="text"
            placeholder="Preguntale algo sobre esta semana…"
            style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:7px;padding:8px 12px;font-size:12px;color:var(--text1);outline:none"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();repsChat()}"
            ${_repsChatBusy?'disabled':''}>
          <button onclick="repsChat()" ${_repsChatBusy?'disabled':''} style="background:var(--gold);color:#111;border:none;border-radius:7px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer${_repsChatBusy?';opacity:.6;cursor:default':''}">
            ${_repsChatBusy?'…':'Enviar'}
          </button>
        </div>
      </div>
    </div>`;
}

function _repsRenderChatOnly(){
  const el = document.getElementById('reps-chat-section');
  if(el) el.outerHTML = _repsChatSection(_repsData);
  setTimeout(()=>{
    const msgsEl = document.getElementById('reps-chat-msgs');
    if(msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
  }, 0);
}

async function repsChat(){
  if(_repsChatBusy || !_repsData?.id) return;
  const input = document.getElementById('reps-chat-input');
  if(!input) return;
  const msg = input.value.trim();
  if(!msg) return;
  input.value = '';
  _repsChatBusy = true;
  _repsChatHistory.push({ role:'user', content: msg });
  _repsRenderChatOnly();
  try {
    const res = await apiFetch(`${API_URL}/reports/weekly/chat`, {
      method: 'POST',
      body: JSON.stringify({
        report_id: _repsData.id,
        message:   msg,
        history:   _repsChatHistory.slice(0, -1),
      }),
    });
    if(!res.ok){ const e=await res.json().catch(()=>({})); throw new Error(e.error||`HTTP ${res.status}`); }
    const data = await res.json();
    _repsChatHistory.push({ role:'assistant', content: data.reply });
  } catch(e) {
    _repsChatHistory.push({ role:'assistant', content:'Error al procesar la consulta. Intentá de nuevo.' });
  } finally {
    _repsChatBusy = false;
    _repsRenderChatOnly();
  }
}

// ── Baúl de Ideas (CRM / equipo de ventas) ───────────────────────────────────
let _crmIdeas = [];
let _crmIdeasFilter = 'todos';

async function fetchCrmIdeas() {
  const r = await apiFetch(`${API_URL}/ideas`);
  _crmIdeas = r.ok ? await r.json() : [];
}

function setCrmIdeasFilter(f, btn) {
  _crmIdeasFilter = f;
  document.querySelectorAll('#crm-idea-filters .lab-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCrmIdeas();
}

function renderCrmIdeas() {
  const tbody = document.getElementById('crm-ideas-tbody');
  const empty = document.getElementById('crm-ideas-empty');
  if (!tbody) return;
  const visible = _crmIdeasFilter === 'todos' ? _crmIdeas : _crmIdeas.filter(i => i.area === _crmIdeasFilter);
  if (!visible.length) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  tbody.innerHTML = visible.map(i => {
    const fecha = new Date(i.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
    return `<tr class="ideas-tr">
      <td style="text-align:center;padding-top:13px"><input type="checkbox" class="ideas-check" title="Marcar como usada (se elimina)" onchange="if(this.checked)markCrmIdeaUsed('${i.id}')" /></td>
      <td class="td-idea">${esc(i.idea)}</td>
      <td class="td-motivo">${i.motivo ? esc(i.motivo) : '<span style="color:var(--text3);font-style:italic">—</span>'}</td>
      <td><span class="area-badge ${i.area}">${i.area}</span></td>
      <td style="color:var(--text3);font-size:11px;white-space:nowrap">${fecha}</td>
    </tr>`;
  }).join('');
}

function openAddIdeaCRM() {
  document.getElementById('crm-idea-txt').value = '';
  document.getElementById('crm-idea-motivo').value = '';
  document.getElementById('crm-idea-area').value = '';
  document.getElementById('modal-idea-crm').style.display = 'flex';
  setTimeout(() => document.getElementById('crm-idea-txt').focus(), 100);
}

async function saveCrmIdea() {
  const idea = document.getElementById('crm-idea-txt').value.trim();
  const motivo = document.getElementById('crm-idea-motivo').value.trim();
  const area = document.getElementById('crm-idea-area').value;
  if (!idea) { toast('✗ Escribí la idea'); return; }
  if (!area) { toast('✗ Seleccioná un área'); return; }
  try {
    const r = await apiFetch(`${API_URL}/ideas`, { method: 'POST', body: JSON.stringify({ idea, motivo, area }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Error');
    _crmIdeas.unshift(d);
    document.getElementById('modal-idea-crm').style.display = 'none';
    renderCrmIdeas();
    toast('✓ Idea guardada');
  } catch (e) { toast('✗ ' + e.message); }
}

async function markCrmIdeaUsed(id) {
  try {
    const r = await apiFetch(`${API_URL}/ideas/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Error');
    _crmIdeas = _crmIdeas.filter(i => i.id !== id);
    renderCrmIdeas();
    toast('✓ Idea marcada como usada');
  } catch (e) { toast('✗ ' + e.message); }
}


