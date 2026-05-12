// ========== SUPABASE ==========

const API_URL = "https://noble-determination-production.up.railway.app";

const _sb = supabase.createClient(
  "https://zyoqgyjshjvttwypiqhp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5b3FneWpzaGp2dHR3eXBpcWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTU4MzcsImV4cCI6MjA5MjczMTgzN30.NZHO9QGpb0ANRU8qPNEc6Y_Ow5qMVtcAGN-IvxDfSDA"
);

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
function setSplashName(email){
  const el = document.getElementById('sp-name-val');
  if(!el) return;
  if(!email){ el.textContent = 'Bienvenido'; return; }
  const key = email.trim().toLowerCase();
  if(SPLASH_NAME_MAP[key]){
    el.textContent = `Bienvenido, ${SPLASH_NAME_MAP[key]}`;
    return;
  }
  const local  = email.split('@')[0];
  const first  = local.split('.')[0];
  const noNums = first.replace(/\d+$/, '');
  const clean  = noNums.replace(/(.)\1+/g, '$1');
  const name   = clean ? clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase() : '';
  el.textContent = name ? `Bienvenido, ${name}` : 'Bienvenido';
}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2)}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
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
const _cid = localStorage.getItem('clienteSeleccionado')||'default';
const KEYS={
  tasks:   `exp2_tasks_${_cid}`,
  found:   `exp2_found_${_cid}`,
  content: `exp2_content_${_cid}`,
  hists:   `exp2_hists_${_cid}`,
  comps:   `exp2_comps_${_cid}`,
  mets:    `exp2_mets_${_cid}`,
  clients: `exp2_clients_${_cid}`,
  ing:     `exp2_ing_${_cid}`,
  gas:     `exp2_gas_${_cid}`,
  angulos: `exp2_angulos_${_cid}`,
  refs:    `exp2_refs_${_cid}`,
  cuotas:  `exp2_cuotas_${_cid}`,
};

let S={
  tasks:   ld(KEYS.tasks,   initTasks()),
  found:   ld(KEYS.found,   {}),
  content: ld(KEYS.content, []),
  hists:   ld(KEYS.hists,   []),
  comps:   ld(KEYS.comps,   []),
  mets:    ld(KEYS.mets,    []),
  clients: ld(KEYS.clients, []),
  ing:     ld(KEYS.ing,     []),
  gas:     ld(KEYS.gas,     []),
  angulos: ld(KEYS.angulos, []),
  refs:    ld(KEYS.refs,    []),
  cuotas:  ld(KEYS.cuotas,  []),
  sops:    ld(`crm_sops_${_cid}`,[]),
};

let leadsCache = [];
window.leadsCache = leadsCache;

function save(key){sv(KEYS[key],S[key])}

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
let contFilterTipo='Todos',contFilterTime='todo';
let dashChart=null;
let _contCharts=[null,null,null];

function nav(id,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  if(el)el.classList.add('active');
  if(id!=='leads'&&_leadsInterval){clearInterval(_leadsInterval);_leadsInterval=null;}
  const renders={dash:renderDash,acc:renderSOPS,found:renderFound,cont:renderCont,
    ang:renderAng,ref:renderRef,met:renderMet,leads:renderLeads,calls:renderCallsPage,
    clients:renderClients,fin:renderFin,equipo:renderEquipo,ig:renderIG};
  if(renders[id])renders[id]();
  setTimeout(_gfSyncTabs, 0);
}

// ========== MODAL HELPERS ==========
function openModal(id){
  document.getElementById(id).classList.add('open');
  document.querySelectorAll('#'+id+' input, #'+id+' select, #'+id+' textarea').forEach(el=>{
    if(el.type==='number')el.value='0';
    else if(el.type==='date')el.value='';
    else if(el.tagName==='SELECT')el.selectedIndex=0;
    else if(!el.disabled)el.value='';
  });
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
  const m={Idea:'bgy','Guión listo':'bb',Grabando:'ba',Editando:'bp',Subido:'bgr'};
  return `<span class="badge ${m[s]||'bgy'}">${s}</span>`;
}
function tipoContBadge(s){
  const m={Reel:'bg',Carrusel:'bb',Historia:'bp'};
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

  // Chart
  const labels=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const monthIng=Array(12).fill(0),monthGas=Array(12).fill(0);
  S.ing.forEach(x=>{if(x.fecha){const m=new Date(x.fecha).getMonth();monthIng[m]+=(+x.usd||0)*currState.rate;}});
  S.gas.forEach(x=>{if(x.fecha){const m=new Date(x.fecha).getMonth();monthGas[m]+=(+x.usd||0)*currState.rate;}});

  const ctx=document.getElementById('dashChart');
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
const SOPS_KEY=`crm_sops_${_cid}`;
function _loadSOPS(){return ld(SOPS_KEY,[]);}
function _saveSOPS(arr){sv(SOPS_KEY,arr);}

const SOP_AREAS=['Marketing','Ventas','Productos','Operaciones','Otro'];
function sopAreaBadge(a){
  const m={Marketing:'bb',Ventas:'bgr',Productos:'bg',Operaciones:'ba',Otro:'bgy'};
  return `<span class="badge ${m[a]||'bgy'}">${a||'—'}</span>`;
}

function renderSOPS(){
  const el=document.getElementById('sops-table-body');
  if(!el) return;
  el.innerHTML=(S.sops||[]).map(s=>`
    <tr>
      <td>${s.link?`<a href="${s.link}" target="_blank" style="color:var(--blue);font-size:12px">Ver SOP ↗</a>`:'<span style="color:var(--text3)">—</span>'}</td>
      <td>${sopAreaBadge(s.area)}</td>
      <td style="color:var(--text2);font-size:13px">${s.detalles||'—'}</td>
      <td><button class="btn-icon" onclick="delSOP('${s.id}')">×</button></td>
    </tr>`).join('')||'<tr><td colspan="4" style="color:var(--text3);text-align:center;padding:28px">Sin SOPs cargados. Usá "+ Nuevo SOP" para agregar uno.</td></tr>';
}
async function saveSOP(){
  const link=(document.getElementById('sop-link')?.value||'').trim();
  const area=document.getElementById('sop-area')?.value||'Otro';
  const detalles=(document.getElementById('sop-detalles')?.value||'').trim();
  if(!detalles&&!link){toast('✗ Completá al menos el link o los detalles');return;}
  try{
    const res=await apiFetch(`${API_URL}/sops`,{method:'POST',body:JSON.stringify({link,area,detalles})});
    if(!res.ok) throw new Error();
    const saved=await res.json();
    S.sops.unshift(saved);
    closeModal('modal-sop');renderSOPS();toast('✓ SOP guardado');
  }catch(e){toast('✗ Error al guardar SOP');}
}
async function delSOP(id){
  if(!confirm('¿Eliminar este SOP?'))return;
  try{
    await apiFetch(`${API_URL}/sops/${id}`,{method:'DELETE'});
    S.sops=S.sops.filter(s=>s.id!==id);
    renderSOPS();toast('✓ SOP eliminado');
  }catch(e){toast('✗ Error al eliminar');}
}

// ========== FUNDACIONES ==========
const foundAvatarFields=[
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
  {k:'promesa',label:'Promesa de la oferta / Bio de IG'},
  {k:'mecanismo',label:'Mecanismo único'},
  {k:'precio',label:'Precio (pago único)'},
  {k:'estructura_cobro',label:'Estructura de cobro (% o fijo)'},
];
function renderFound(){
  document.getElementById('found-avatar-form').innerHTML=foundAvatarFields.map(f=>`
    <div class="form-group">
      <label class="form-label">${f.label}</label>
      <textarea id="ff-${f.k}">${S.found[f.k]||''}</textarea>
    </div>
  `).join('');
  document.getElementById('found-oferta-form').innerHTML=foundOfertaFields.map(f=>`
    <div class="form-group">
      <label class="form-label">${f.label}</label>
      <textarea id="ff-${f.k}">${S.found[f.k]||''}</textarea>
    </div>
  `).join('');
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
function contFilter(type,val,el){
  if(type==='tipo'){contFilterTipo=val;document.querySelectorAll('#cont-type-tabs .tab').forEach(t=>t.classList.remove('active'));}
  else{contFilterTime=val;document.querySelectorAll('#cont-time-tabs .tab').forEach(t=>t.classList.remove('active'));}
  el.classList.add('active');
  renderCont();
}
function renderCont(){
  let posts=S.content.filter(x=>x.tipo!=='Historia');
  let hists=S.hists;
  if(contFilterTipo!=='Todos'){
    if(contFilterTipo==='Historia')hists=hists;
    else posts=posts.filter(x=>x.tipo===contFilterTipo);
    if(contFilterTipo!=='Historia')hists=[];
  }
  if(contFilterTime!=='todo'){
    posts=posts.filter(x=>inDateRange(x.fecha,contFilterTime));
    hists=hists.filter(x=>inDateRange(x.fecha,contFilterTime));
  }
  document.getElementById('cont-table').innerHTML=posts.map((x,i)=>`
    <tr>
      <td>${x.fecha||'—'}</td>
      <td><span class="trunc" title="${x.angulo}">${x.angulo||'—'}</span></td>
      <td>${x.formato||'—'}</td>
      <td>${tipoContBadge(x.tipo)}</td>
      <td><span class="trunc" title="${x.hook}">${x.hook||'—'}</span></td>
      <td>${x.cta||'—'}</td>
      <td>${contBadge(x.estado)}</td>
      <td><button class="btn-icon" onclick="delCont('${x.id}')">×</button></td>
    </tr>`).join('')||'<tr><td colspan="8" style="color:var(--text3);text-align:center;padding:20px">Sin piezas</td></tr>';
  document.getElementById('hist-table').innerHTML=hists.map((x,i)=>`
    <tr>
      <td>${x.fecha||'—'}</td>
      <td>${x.angulo||'—'}</td>
      <td>${x.tipo||'—'}</td>
      <td><span class="trunc">${x.hook||'—'}</span></td>
      <td>${x.cta||'—'}</td>
      <td>${contBadge(x.estado)}</td>
      <td><button class="btn-icon" onclick="delHist('${x.id}')">×</button></td>
    </tr>`).join('')||'<tr><td colspan="7" style="color:var(--text3);text-align:center;padding:20px">Sin historias</td></tr>';
  renderContCharts();
}
async function saveCont(){
  const item={id:uid(),fecha:v('c-fecha'),tipo:v('c-tipo'),angulo:v('c-angulo'),formato:v('c-formato'),cta:v('c-cta'),estado:v('c-estado'),hook:v('c-hook'),guion:v('c-guion'),esHistoria:false};
  try{
    const res=await apiFetch(`${API_URL}/contenido`,{method:'POST',body:JSON.stringify(item)});
    if(!res.ok) throw new Error();
    const saved=await res.json();
    S.content.unshift(saved);
    closeModal('modal-cont');renderCont();toast('Pieza guardada ✓');
  }catch(e){S.content.unshift(item);save('content');closeModal('modal-cont');renderCont();toast('Pieza guardada ✓');}
}
async function saveHist(){
  const item={id:uid(),fecha:v('h-fecha'),tipo:v('h-tipo'),angulo:v('h-angulo'),formato:v('h-formato'),cta:v('h-cta'),estado:v('h-estado'),hook:v('h-hook'),guion:v('h-guion'),esHistoria:true};
  try{
    const res=await apiFetch(`${API_URL}/contenido`,{method:'POST',body:JSON.stringify(item)});
    if(!res.ok) throw new Error();
    const saved=await res.json();
    S.hists.unshift(saved);
    closeModal('modal-hist');renderCont();toast('Historia guardada ✓');
  }catch(e){S.hists.unshift(item);save('hists');closeModal('modal-hist');renderCont();toast('Historia guardada ✓');}
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

function renderContCharts(){
  const labels=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const yr=new Date().getFullYear();
  const tipos=['Reel','Carrusel','Historia'];
  const colors=['rgba(212,168,50,0.6)','rgba(61,106,170,0.6)','rgba(122,74,184,0.6)'];
  const borders=['rgba(212,168,50,0.9)','rgba(61,106,170,0.9)','rgba(122,74,184,0.9)'];
  const ids=['contChartReel','contChartCarrusel','contChartHistoria'];

  tipos.forEach((tipo,idx)=>{
    const monthly=Array(12).fill(0);
    S.mets.filter(m=>m.tipo===tipo&&m.fecha).forEach(m=>{
      const d=_parseDate(m.fecha);
      if(d&&d.getFullYear()===yr){
        monthly[d.getMonth()]+=(m.ventas?m.ventas.split(',').filter(Boolean).length:0);
      }
    });
    const ctx=document.getElementById(ids[idx]);
    if(!ctx) return;
    if(_contCharts[idx]) _contCharts[idx].destroy();
    _contCharts[idx]=new Chart(ctx,{
      type:'bar',
      data:{
        labels,
        datasets:[{
          label:`Ventas — ${tipo}`,
          data:monthly,
          backgroundColor:colors[idx],
          borderColor:borders[idx],
          borderWidth:1,
          borderRadius:4,
        }]
      },
      options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{legend:{labels:{color:'rgba(232,230,222,0.5)',font:{family:'Inter',size:11}}}},
        scales:{
          x:{grid:{color:'rgba(255,255,255,0.03)'},ticks:{color:'rgba(122,120,112,0.8)',font:{size:10}}},
          y:{
            beginAtZero:true,
            grid:{color:'rgba(255,255,255,0.03)'},
            ticks:{color:'rgba(122,120,112,0.8)',font:{size:10},stepSize:1,precision:0}
          }
        }
      }
    });
  });
}

// ========== ÁNGULOS ==========
function renderAng(){
  let bestAng='—',bestCount=0;
  const angCount={};
  S.mets.forEach(m=>{if(m.angulo&&m.ventas){const c=(m.ventas.split(',').filter(Boolean).length);angCount[m.angulo]=(angCount[m.angulo]||0)+c;}});
  Object.entries(angCount).forEach(([a,c])=>{if(c>bestCount){bestAng=a;bestCount=c;}});

  const pcCount={},ucCount={};
  S.mets.forEach(m=>{if(m.pc)pcCount[m.pc]=(pcCount[m.pc]||0)+1;if(m.uc)ucCount[m.uc]=(ucCount[m.uc]||0)+1;});
  const topPc=Object.entries(pcCount).sort((a,b)=>b[1]-a[1])[0];
  const topUc=Object.entries(ucCount).sort((a,b)=>b[1]-a[1])[0];
  const impacto=topPc?`PC1: ${topPc[0]} (${topPc[1]})`:topUc?`UC: ${topUc[0]}`:'—';

  document.getElementById('ang-metrics').innerHTML=`
    ${metCard('Ángulo con más ventas',bestAng,'')}
    ${metCard('Mayor impacto PC1/PC2',impacto,'')}
  `;

  document.getElementById('ang-table').innerHTML=S.angulos.map((x,i)=>`
    <tr>
      <td><b style="color:var(--text)">${x.angulo}</b></td>
      <td><span class="badge bgy">${x.tipo}</span></td>
      <td>${(x.pc||[]).map(p=>`<span class="chip">${p}</span>`).join('')||'—'}</td>
      <td>${(x.uc||[]).map(p=>`<span class="chip">${p}</span>`).join('')||'—'}</td>
      <td><span class="badge ${x.ad==='Sí'?'bgr':'bgy'}">${x.ad}</span></td>
      <td>${angCount[x.angulo]||0}</td>
      <td><button class="btn-icon" onclick="delAng('${x.id}')">×</button></td>
    </tr>`).join('')||'<tr><td colspan="7" style="color:var(--text3);text-align:center;padding:20px">Sin ángulos</td></tr>';
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
    if(data.length===0 && S.clients.length>0){
      // API vacía pero hay datos locales → migrar a la API
      for(const c of [...S.clients]){
        try{
          await apiFetch(`${API_URL}/clientes`,{method:'POST',body:JSON.stringify({
            nombre:c.nombre,instagram:c.instagram||'',inicio:c.inicio||null,fin:c.fin||null,
            tipo_pago:c.tipo_pago||c.pp||'Contado',cash_collected:+c.cash_collected||0,
            comprobante:c.comprobante||'',estado:c.estado||'Al día',
            pp:c.pp||null,proxpaso:c.proxpaso||null,road:c.road||null,
            mod:c.mod||null,proxpago:c.proxpago||null,programa:c.programa||null
          })});
        }catch(e){}
      }
      // Re-fetch después de migrar
      const r2=await apiFetch(`${API_URL}/clientes`);
      if(r2.ok){const d2=await r2.json().catch(()=>[]);if(Array.isArray(d2)&&d2.length>0){S.clients=d2;save('clients');}}
      // Si la migración falló (tabla sin columnas), NO pisar S.clients — preservar local
    } else {
      S.clients=data;
      save('clients');
    }
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
let _leadsInterval = null;
let leadsFilter    = 'mes';
let leadsMes       = '';
let leadsBusqueda  = '';

const LEAD_ESTADOS = [
  'Primer Contacto',
  'Micro VSL Enviado',
  'VSL Pre Call Enviado',
  'Calendly Enviado',
  'En seguimiento',
  'Agendado',
  'Cerrado',
  'Seña',
  'Seguimiento Post Call',
  'Re agendado',
  'Perdido Post Call',
  'No Show',
  'Perdido',
];
const ESTADO_PERDIDO = new Set(['Perdido', 'Perdido Post Call', 'No Show']);
const ESTADO_CERRADO = new Set(['Cerrado', 'Seña']);

const ESTADO_COLOR = {
  'Primer Contacto':       { bg:'rgba(60,58,55,0.5)',  border:'rgba(80,78,74,0.3)',  text:'#7a7870' },
  'Micro VSL Enviado':     { bg:'rgba(61,106,170,0.1)',border:'rgba(61,106,170,0.2)',text:'#6090d4' },
  'VSL Pre Call Enviado':  { bg:'rgba(61,106,170,0.1)',border:'rgba(61,106,170,0.2)',text:'#6090d4' },
  'Calendly Enviado':      { bg:'rgba(196,136,42,0.1)',border:'rgba(196,136,42,0.2)',text:'#e0a848' },
  'En seguimiento':        { bg:'rgba(196,136,42,0.1)',border:'rgba(196,136,42,0.2)',text:'#e0a848' },
  'Agendado':              { bg:'rgba(212,168,50,0.07)',border:'rgba(212,168,50,0.15)',text:'#d4a832' },
  'Cerrado':               { bg:'rgba(61,138,90,0.1)', border:'rgba(61,138,90,0.2)', text:'#5cb87a' },
  'Seña':                  { bg:'rgba(61,138,90,0.07)',border:'rgba(61,138,90,0.15)',text:'#5cb87a' },
  'Seguimiento Post Call': { bg:'rgba(122,74,184,0.1)',border:'rgba(122,74,184,0.2)',text:'#a070d8' },
  'Re agendado':           { bg:'rgba(196,136,42,0.1)',border:'rgba(196,136,42,0.2)',text:'#e0a848' },
  'Perdido Post Call':     { bg:'rgba(184,72,72,0.1)', border:'rgba(184,72,72,0.2)', text:'#d46060' },
  'No Show':               { bg:'rgba(120,40,40,0.12)',border:'rgba(150,50,50,0.25)',text:'#b04040' },
  'Perdido':               { bg:'rgba(184,72,72,0.1)', border:'rgba(184,72,72,0.2)', text:'#d46060' },
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
  const options = LEAD_ESTADOS.map(e =>
    `<option value="${e}" ${e === estado ? 'selected' : ''}>${e}</option>`
  ).join('');
  return `
    <select
      onchange="actualizarEstado('${lead.id}', this.value, this)"
      style="
        font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
        padding:3px 6px;border-radius:20px;cursor:pointer;
        background:${col.bg};border:1px solid ${col.border};color:${col.text};
        max-width:160px;outline:none;
        box-shadow:none;
      "
    >${options}</select>`;
}

function formatearFecha(fechaISO){
  if(!fechaISO) return '—';
  const d = new Date(fechaISO);
  if(isNaN(d)) return '—';
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
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
    const key=(l.etiqueta&&l.etiqueta.trim())?l.etiqueta.trim():'(sin etiqueta)';
    grupos[key]=(grupos[key]||0)+1;
  });
  return Object.entries(grupos).sort((a,b)=>b[1]-a[1]).reduce((acc,[k,v])=>{acc[k]=v;return acc;},{});
}

function filtrarPorBusqueda(leads, q){
  if(!q||!q.trim()) return leads;
  const t=q.trim().toLowerCase();
  return leads.filter(l=>(l.nombre||'').toLowerCase().includes(t)||(l.instagram||'').toLowerCase().includes(t));
}

function _filtrarLeads(){
  let r=leadsCache.filter(l=>_gfInRange(l.created_at));
  r=filtrarPorBusqueda(r,leadsBusqueda);
  return r;
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
  const estadoAnterior = lead?.estado;
  if(lead) lead.estado = nuevoEstado;

  if(selectEl){
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

  if(nuevoEstado === 'Agendado') _mostrarPopupReporteAgenda(id, lead);
  _logActivity(`Estado → ${nuevoEstado}`, lead, estadoAnterior?`Antes: ${estadoAnterior}`:'');

  _renderEstadoCounters(leadsCache);

  // Pausar el polling durante el update para que no re-renderice la tabla y cierre el dropdown
  const hadInterval = !!_leadsInterval;
  if(hadInterval){ clearInterval(_leadsInterval); _leadsInterval=null; }

  try{
    const res = await apiFetch(`${API_URL}/leads/${id}`,{method:'PATCH',body:JSON.stringify({estado:nuevoEstado})});
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
    if(hadInterval) _leadsInterval=setInterval(fetchLeads,3000);
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
    const agendados = filtrados.filter(l=>l.estado==='Agendado').length;
    const perdidos  = filtrados.filter(l=>ESTADO_PERDIDO.has(l.estado)).length;
    const prev      = leadsCache.filter(l=>_gfPrevInRange(l.created_at));
    const prevTot   = prev.length;
    const prevAg    = prev.filter(l=>l.estado==='Agendado').length;
    const prevPerd  = prev.filter(l=>ESTADO_PERDIDO.has(l.estado)).length;
    metricsEl.style.justifyContent='center';
    metricsEl.innerHTML =
      metCard('Total',     total,     '', _delta(total,prevTot))+
      metCard('Agendados', agendados, '', _delta(agendados,prevAg))+
      metCard('Perdidos',  perdidos,  'red', _delta(perdidos,prevPerd));
  }

  const segEl = document.getElementById('leads-seguidores-badge');
  if(segEl) segEl.textContent = filtrados.filter(l=>(l.tipo||'').toLowerCase()==='seguidor').length;

  _renderFunnel(leadsCache);
  _renderEstadoCounters(leadsCache);
  _renderEtiquetas(filtrados);
  _renderLeadsTable(filtrados);
}

function _renderEtiquetas(leads){
  const wrap=document.getElementById('leads-etiquetas-wrap');
  const grid=document.getElementById('leads-etiquetas-grid');
  if(!wrap||!grid) return;
  const grupos=agruparPorEtiqueta(leads);
  const entries=Object.entries(grupos);
  if(!entries.length){ wrap.style.display='none'; return; }
  wrap.style.display='block';
  const max=entries[0][1];
  grid.innerHTML=entries.map(([etiqueta,count])=>{
    const pct=Math.round((count/max)*100);
    const color=etiqueta==='(sin etiqueta)'?'var(--text3)':'var(--gold)';
    return `<div style="background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.05);
                border-radius:var(--rs);padding:10px 14px;min-width:160px;flex:1;max-width:240px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px" title="${etiqueta}">${etiqueta}</span>
        <span style="font-family:'Inter',sans-serif;font-weight:700;font-size:18px;letter-spacing:-0.02em;color:${color};margin-left:8px">${count}</span>
      </div>
      <div style="height:3px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${color};border-radius:2px;transition:width .4s ease;${color==='var(--gold)'?'box-shadow:0 0 6px rgba(212,168,50,0.4)':''}"></div>
      </div>
      <div style="font-size:10px;color:var(--text3);margin-top:4px">${count} lead${count!==1?'s':''}</div>
    </div>`;
  }).join('');
}

function _renderLeadsTable(rows){
  const tbody=document.getElementById('leads-table');
  if(!tbody) return;
  tbody.innerHTML=rows.map((x,idx)=>{
    const estado    = x.estado||'Primer Contacto';
    const esPerdido = ESTADO_PERDIDO.has(estado);
    const esCerrado = ESTADO_CERRADO.has(estado);
    const esAgendado= estado==='Agendado';
    const rowStyle  = esPerdido
      ? 'background:rgba(184,72,72,0.06);border-left:2px solid rgba(184,72,72,0.3);'
      : esCerrado
      ? 'background:rgba(61,138,90,0.05);border-left:2px solid rgba(61,138,90,0.25);'
      : '';

    const llamadaCell = esAgendado ? `
      <div style="display:flex;flex-direction:column;gap:6px;min-width:130px">
        <label style="display:flex;align-items:center;gap:7px;cursor:pointer;user-select:none">
          <input type="checkbox"
            ${x.show ? 'checked' : ''}
            onchange="actualizarCampo('${x.id}','show',this.checked)"
            style="width:15px;height:15px;accent-color:var(--gold);cursor:pointer;flex-shrink:0">
          <span style="font-size:11px;font-weight:600;color:${x.show?'var(--gold-light)':'var(--text2)'}">
            Asistió a la llamada
          </span>
        </label>
        <label style="display:flex;align-items:center;gap:7px;cursor:pointer;user-select:none">
          <input type="checkbox"
            ${x.calificado ? 'checked' : ''}
            onchange="actualizarCampo('${x.id}','calificado',this.checked)"
            style="width:15px;height:15px;accent-color:#5cb87a;cursor:pointer;flex-shrink:0">
          <span style="font-size:11px;font-weight:600;color:${x.calificado?'#5cb87a':'var(--text2)'}">
            Calificado
          </span>
        </label>
      </div>` : x.calificado
      ? `<span style="font-size:11px;font-weight:700;color:#5cb87a;background:rgba(92,184,122,0.12);border:1px solid rgba(92,184,122,0.3);padding:2px 8px;border-radius:20px">Calificado</span>`
      : '<span style="color:var(--text3);font-size:11px">—</span>';

    return `
    <tr style="${rowStyle}">
      <td style="text-align:center;width:40px;padding:4px 2px">
        <div style="font-size:10px;color:var(--text3);line-height:1.2">${idx+1}</div>
        <button class="btn-icon" onclick="delLead('${x.id}')" style="color:var(--red);font-size:14px;line-height:1;padding:0;margin-top:2px;display:block;width:100%" title="Eliminar lead">×</button>
      </td>
      <td style="color:var(--text3);font-size:12px;white-space:nowrap">${formatearFecha(x.created_at)}</td>
      <td style="color:var(--text);font-weight:600">${x.nombre||'—'}</td>
      <td><a href="https://instagram.com/${(x.instagram||'').replace('@','')}" target="_blank"
             style="color:var(--blue);text-decoration:none;font-size:12px">@${x.instagram||'—'}</a></td>
      <td>${origenBadge(x.origen)}</td>
      <td>${tipoBadge(x.tipo)}</td>
      <td>${x.etiqueta?`<span class="badge bgy">${x.etiqueta}</span>`:'<span style="color:var(--text3)">—</span>'}</td>
      <td>${estadoSelect(x)}</td>
      <td>${llamadaCell}</td>
      <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
          title="${x.ultima_accion||''}">${x.ultima_accion||'—'}</td>
      <td><span class="trunc" title="${x.notas||''}">${x.notas||'—'}</span></td>
      <td>${x.source==='manychat'?'<span class="api-badge">MC</span>':'<span style="color:var(--text3);font-size:11px">manual</span>'}</td>
    </tr>`;
  }).join('')||'<tr><td colspan="13" style="color:var(--text3);text-align:center;padding:24px">Sin leads para este filtro</td></tr>';
}

function _renderFunnel(leads){
  const grid = document.getElementById('leads-funnel-grid');
  if(!grid) return;

  const total      = leads.length;
  const agendados  = leads.filter(l=>l.estado==='Agendado').length;
  const calificados= leads.filter(l=>l.calificado===true).length;

  const pct = (num, den) => den > 0 ? ((num/den)*100).toFixed(1)+'%' : '—';
  const agendamiento   = pct(agendados,   total);
  const calificadasPct = pct(calificados, agendados);

  function semaforo(numStr, verde, amarillo){
    if(numStr==='—') return 'var(--text3)';
    const n = parseFloat(numStr);
    if(n >= verde)   return '#5cb87a';
    if(n >= amarillo) return '#e0a848';
    return '#d46060';
  }

  const metrics = [
    { label:'% Agendamiento',   val:agendamiento,   verde:30, amarillo:15,
      sub:`${agendados} de ${total} leads` },
    { label:'% Calificadas',    val:calificadasPct,  verde:60, amarillo:40,
      sub:`${calificados} calificados de ${agendados} agendados` },
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

async function actualizarCampo(id, campo, valor){
  if(!id){ console.error('[actualizarCampo] ID inválido:', id); return; }
  if(!['show','calificado'].includes(campo)){ console.error('[actualizarCampo] Campo inválido:', campo); return; }

  const lead = leadsCache.find(l=>l.id===id);
  if(lead) lead[campo] = valor;

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

async function fetchLeads(){
  try{
    const res = await apiFetch(`${API_URL}/leads`);
    if(!res.ok){
      console.error('[fetchLeads] HTTP', res.status);
      if(res.status===401||res.status===403) toast('✗ Sin acceso — verificá el cliente seleccionado');
      return;
    }
    const data = await res.json();
    const raw = Array.isArray(data) ? data : (data?.leads || data?.data || []);
    leadsCache = window.leadsCache = raw
      .filter(l => !_pendingDeletes.has(String(l.id)))   // nunca reinsertar eliminados
      .map(l=>({
        ...l,
        estado:     l.estado     || 'Primer Contacto',
        show:       l.show       === true,
        calificado: l.calificado === true,
      }));
  }catch(e){
    console.error('[fetchLeads]',e);
  }finally{
    _applyLeadsFilter();
  }
}

function renderLeads(){
  _applyLeadsFilter();
  fetchLeads();
  if(_leadsInterval) clearInterval(_leadsInterval);
  _leadsInterval=setInterval(fetchLeads,3000);
}

function setLeadsFilter(filtro,el){ _gfSet(filtro); }
function onLeadsMesChange(){ const s=document.getElementById('leads-mes-select'); _gfSetMes(s?s.value:''); }
function onLeadsSearch(){
  leadsBusqueda=document.getElementById('leads-search')?.value||'';
  _applyLeadsFilter();
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
  if(!instagram){toast('✗ Instagram obligatorio');return;}
  if(!origen)   {toast('✗ Origen obligatorio');return;}
  if(!tipo)     {toast('✗ Tipo obligatorio');return;}

  const now=new Date().toISOString();
  const payload={
    nombre,instagram,origen,tipo,
    cliente_id:    localStorage.getItem('clienteSeleccionado')||'',
    etiqueta:      v('l-etiqueta').trim()||'',
    estado:        v('l-estado')||'Primer Contacto',
    ultima_accion: v('l-accion').trim()||'',
    notas:         v('l-notas').trim()||'',
    source:        'manual',
    updated_at:    now,
  };

  const RANK={};
  LEAD_ESTADOS.forEach((e,i)=>RANK[e]=i);
  const existing=leadsCache.find(l=>(l.instagram||'').toLowerCase()===instagram);
  if(existing){
    if((RANK[existing.estado]??0)>(RANK[payload.estado]??0)) payload.estado=existing.estado;
    if(!payload.notas) payload.notas=existing.notas||'';
    const ur=await apiFetch(`${API_URL}/leads/${existing.id}`,{method:'PATCH',body:JSON.stringify(payload)});
    if(!ur.ok){const e=await ur.json().catch(()=>({}));console.error('[update lead]',e);toast('✗ Error al actualizar');return;}
    toast('Lead actualizado ✓');
  } else {
    payload.created_at=now;
    const ir=await apiFetch(`${API_URL}/leads`,{method:'POST',body:JSON.stringify(payload)});
    if(!ir.ok){const e=await ir.json().catch(()=>({}));console.error('[insert lead]',e);toast('✗ Error al guardar');return;}
    toast('Lead guardado ✓');
  }
  closeModal('modal-lead');
  await fetchLeads();
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

  // 1. Marcar como eliminado → el polling NO lo va a reinsertar aunque el server falle
  _pendingDeletes.add(sid);

  // 2. Quitar del cache local inmediatamente → UI reactivo sin esperar API
  leadsCache=window.leadsCache=leadsCache.filter(l=>String(l.id)!==sid);
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
function _clientsRow(x,i){
  const ig=(x.instagram||'').replace(/^@/,'');
  const _xid=String(x.id);
  const proxCuota=(S.cuotas||[]).filter(c=>String(c.clienteId)===_xid&&!c.pagado).sort((a,b)=>new Date(a.fecha)-new Date(b.fecha))[0];
  const proxCuotaTd=proxCuota
    ?`<td style="font-size:11px;color:#d46060;white-space:nowrap">${proxCuota.fecha}</td>`
    :`<td style="font-size:11px;color:var(--text3)">—</td>`;
  const isPIF=(x.pp||'').toUpperCase()==='PIF';
  const cuota2=(S.cuotas||[]).find(c=>String(c.clienteId)===_xid&&c.numero===2);
  const cuota3=(S.cuotas||[]).find(c=>String(c.clienteId)===_xid&&c.numero===3);
  const selectStyle='background:var(--bg2);border:1px solid var(--border);border-radius:var(--rs);color:var(--gold-light);font-size:11px;padding:2px 4px;cursor:pointer';
  const cuota2Td=isPIF
    ?`<td style="text-align:center;font-size:11px;color:var(--text3)">—</td>`
    :`<td onclick="event.stopPropagation()" style="text-align:center">
        <select onchange="_toggleOrCreateCuota('${x.id}',2,this.value)" style="${selectStyle}">
          <option value="pendiente" ${!cuota2?.pagado?'selected':''}>Pendiente</option>
          <option value="pago" ${cuota2?.pagado?'selected':''}>Pagó</option>
        </select>
        <div style="font-size:9px;color:var(--text3);margin-top:2px">${cuota2?.monto?fmtMoney(+cuota2.monto):''}</div>
      </td>`;
  const cuota3Td=isPIF
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
  const inputStyle='width:72px;padding:2px 5px;font-size:11px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--rs);color:var(--gold-light);text-align:center';
  const c2ccTd=isPIF
    ?`<td style="text-align:center;color:var(--text3);font-size:11px">—</td>`
    :cuota2
      ?`<td onclick="event.stopPropagation()" style="text-align:center">
          <div style="font-size:9px;color:var(--text3);margin-bottom:2px">CC C2</div>
          <input type="number" value="${+cuota2.cash_collected||''}" min="0" step="any" placeholder="0"
            onchange="updateCuotaCC('${cuota2.id}',this.value)" style="${inputStyle}">
        </td>`
      :`<td style="text-align:center;color:var(--text3);font-size:11px">—</td>`;
  const c3ccTd=isPIF
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
    <td onclick="event.stopPropagation()"><input type="number" value="${+x.cash_collected||0}" min="0" step="any" onchange="updateClientCC('${x.id}',this.value)" style="width:80px;padding:2px 5px;font-size:12px;text-align:center;background:var(--bg2);border:1px solid var(--border);border-radius:var(--rs);color:var(--gold-light)" title="Cash Collected inicial"></td>
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
  const thisMonth=now.getMonth(), thisYear=now.getFullYear();
  const prevMonth=thisMonth===0?11:thisMonth-1;
  const prevYear=thisMonth===0?thisYear-1:thisYear;

  const activos=S.clients.filter(c=>c.estado==='Al día');
  const inactivos=S.clients.filter(c=>c.estado==='Inactivo');
  const pendientes=S.clients.filter(c=>c.estado==='Pendiente');
  const vencidos=S.clients.filter(c=>c.estado==='Vencido');

  // Nuevos este mes vs mes anterior (por fecha de inicio)
  const newThisMonth=S.clients.filter(c=>{
    if(!c.inicio) return false;
    const d=_parseDate(c.inicio);
    return d&&d.getMonth()===thisMonth&&d.getFullYear()===thisYear;
  }).length;
  const newLastMonth=S.clients.filter(c=>{
    if(!c.inicio) return false;
    const d=_parseDate(c.inicio);
    return d&&d.getMonth()===prevMonth&&d.getFullYear()===prevYear;
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
  if(subEl) subEl.textContent=`${S.clients.length} cliente${S.clients.length!==1?'s':''} en programa · ${deltaNewStr}`;

  _renderMoneyCounters();

  const clientsRowsFor=(arr)=>arr.map(x=>_clientsRow(x,S.clients.indexOf(x))).join('')||
    '<tr><td colspan="14" style="color:var(--text3);text-align:center;padding:16px">Sin clientes en esta categoría</td></tr>';

  const thead=`<thead><tr><th>Fecha</th><th>Cliente</th><th>Inicio</th><th>Final</th><th>PP</th><th>Próximo paso</th><th>Estado</th><th>Instagram</th><th>Cobrado</th><th>Próx. cuota</th><th style="text-align:center">Cuota 2</th><th style="text-align:center">Cuota 3</th><th style="text-align:center">CC C2</th><th style="text-align:center">CC C3</th><th></th></tr></thead>`;

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
  closeModal('modal-client');renderClients();renderDash();toast('Cliente guardado ✓');
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

function generarCuotasCliente(nc, n){
  if((S.cuotas||[]).some(c=>String(c.clienteId)===String(nc.id))){return;}
  const base=nc.inicio?new Date(nc.inicio+'T00:00:00'):new Date();
  for(let i=0;i<n;i++){
    const f=new Date(base);
    f.setMonth(f.getMonth()+i);
    S.cuotas.push({
      id:uid(),
      clienteId:String(nc.id),
      clienteNombre:nc.nombre,
      clienteIg:nc.instagram||'',
      numero:i+2,
      fecha:f.toISOString().slice(0,10),
      monto:0,
      pagado:false
    });
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
        style="width:80px;background:var(--bg2);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:2px 6px"
        onchange="S.cuotas.find(x=>x.id==='${c.id}').monto=+this.value;save('cuotas');_syncCuotasCounter()">
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
  _renderMoneyCounters();
  renderCuotas();
}

function toggleCuotaPagada(id){
  const c=S.cuotas.find(x=>x.id===id);
  if(!c)return;
  c.pagado=!c.pagado;
  save('cuotas');
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
  _renderMoneyCounters();renderDash();renderFin();renderClients();
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
    cc('% Cobranza',m.pctCobranza+'%',m.pctCobranza>=80?'green':m.pctCobranza>=50?'':'red');
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
  const pShows=prevCalls.filter(c=>c.estado!=='No asistió'&&c.estado!=='Re agenda').length;
  const pCloses=prevCalls.filter(c=>['Cierre','Cierre PIF','Cierre Cuotas'].includes(c.estado||'')).length;
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
    metCard('Ganancia Total',fmtMoney(ganancia),ganancia>=0?'green':'red',_delta(ganancia,gananciaP))+
    metCard('Margen',margen+'%',+margen>=30?'green':+margen>=15?'':'red');

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
  admin:  ['dash','acc','found','cont','ang','ref','met','leads','calls','clients','fin','ig','equipo'],
  closer: ['leads','calls','clients','acc','found','cont','ang','ref','met','fin','ig','equipo'],
  setter: ['leads','acc','found','cont','ang','ref','met','clients','fin','ig','equipo'],
};
const ROLE_ALLOWED = {
  admin:  ['dash','acc','found','cont','ang','ref','met','leads','calls','clients','fin','ig','equipo'],
  closer: ['leads','calls','equipo'],
  setter: ['leads','equipo'],
};

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
  console.log('[cliente] Cambiado a:', clienteId, '— recargando…');
  location.reload();
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

async function login(){
  const email = document.getElementById('auth-email').value.trim();
  const pass  = document.getElementById('auth-pass').value;
  const errEl = document.getElementById('auth-error');
  const btn   = document.getElementById('auth-btn');

  errEl.style.display='none';
  btn.disabled=true;
  btn.textContent='Iniciando…';

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
  if(_leadsInterval){ clearInterval(_leadsInterval); _leadsInterval=null; }
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
  document.getElementById('auth-pass').value='';
}

function toggleUserMenu(){
  document.getElementById('user-menu').classList.toggle('open');
}
document.addEventListener('click',e=>{
  const menu=document.getElementById('user-menu');
  if(menu&&!e.target.closest('.user-badge')) menu.classList.remove('open');
});

function applyRolePermissions(){
  const allowed = ROLE_ALLOWED[currentUserRole]||[];
  const allPages= ['dash','acc','found','cont','ang','ref','met','leads','calls','clients','fin','ig','equipo'];

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

  const roleColors={admin:'var(--gold)',closer:'#6090d4',setter:'#5cb87a'};
  document.getElementById('user-email-label').textContent=currentUser?.email||'—';
  document.getElementById('user-role-label').textContent=currentUserRole;
  document.getElementById('user-role-label').style.color=roleColors[currentUserRole]||'var(--text2)';
  document.getElementById('user-header').style.display='flex';

  const thLink=document.getElementById('calls-th-link');
  if(thLink) thLink.style.display=['admin','closer'].includes(currentUserRole)?'':'none';
  const btnNewCall=document.getElementById('btn-new-call');
  if(btnNewCall) btnNewCall.style.display=['admin','closer'].includes(currentUserRole)?'':'none';
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

async function fetchSOPS(){
  try{
    const res=await apiFetch(`${API_URL}/sops`);
    if(!res.ok) return;
    const data=await res.json();
    if(!Array.isArray(data)) return;
    if(data.length===0 && (S.sops||[]).length>0){
      for(const s of S.sops) await apiFetch(`${API_URL}/sops`,{method:'POST',body:JSON.stringify({link:s.link,area:s.area,detalles:s.detalles})}).catch(()=>{});
      _saveSOPS([]);
      return fetchSOPS();
    }
    S.sops=data;
  }catch(e){console.warn('[fetchSOPS]',e);}
}
async function fetchFundaciones(){
  try{
    const res=await apiFetch(`${API_URL}/fundaciones`);
    if(!res.ok) return;
    const data=await res.json();
    const hasData=Object.keys(data||{}).some(k=>data[k]);
    if(!hasData && Object.keys(S.found||{}).some(k=>S.found[k])){
      await apiFetch(`${API_URL}/fundaciones`,{method:'PUT',body:JSON.stringify(S.found)}).catch(()=>{});
      return;
    }
    if(hasData) S.found=data;
  }catch(e){console.warn('[fetchFundaciones]',e);}
}
async function fetchContenido(){
  try{
    const res=await apiFetch(`${API_URL}/contenido`);
    if(!res.ok) return;
    const data=await res.json();
    if(!Array.isArray(data)) return;
    if(data.length===0 && (S.content.length>0||S.hists.length>0)){
      const all=[...S.content.map(x=>({...x,esHistoria:false})),...S.hists.map(x=>({...x,esHistoria:true}))];
      for(const item of all) await apiFetch(`${API_URL}/contenido`,{method:'POST',body:JSON.stringify(item)}).catch(()=>{});
      S.content=[];S.hists=[];save('content');save('hists');
      return fetchContenido();
    }
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
    if(data.length===0 && S.angulos.length>0){
      for(const item of S.angulos) await apiFetch(`${API_URL}/angulos`,{method:'POST',body:JSON.stringify(item)}).catch(()=>{});
      S.angulos=[];save('angulos');
      return fetchAngulos();
    }
    S.angulos=data;
  }catch(e){console.warn('[fetchAngulos]',e);}
}
async function fetchReferentes(){
  try{
    const res=await apiFetch(`${API_URL}/referentes`);
    if(!res.ok) return;
    const data=await res.json();
    if(!Array.isArray(data)) return;
    if(data.length===0 && S.refs.length>0){
      for(const item of S.refs) await apiFetch(`${API_URL}/referentes`,{method:'POST',body:JSON.stringify(item)}).catch(()=>{});
      S.refs=[];save('refs');
      return fetchReferentes();
    }
    S.refs=data;
  }catch(e){console.warn('[fetchReferentes]',e);}
}
async function fetchMetricasCloud(){
  try{
    const res=await apiFetch(`${API_URL}/metricas`);
    if(!res.ok) return;
    const data=await res.json();
    if(!Array.isArray(data)) return;
    if(data.length===0 && S.mets.length>0){
      for(const item of S.mets) await apiFetch(`${API_URL}/metricas`,{method:'POST',body:JSON.stringify(item)}).catch(()=>{});
      S.mets=[];save('mets');
      return fetchMetricasCloud();
    }
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
  initCurrencyUI();
  renderDash();
  fetchLeads();
  fetchCalls();
  fetchClients();
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
  document.getElementById('alumnos-screen').style.display='flex';
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
  document.getElementById('holding-screen').style.display='flex';
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
    return;
  }

  _startCRM();
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
const CALL_ESTADOS = ['Cierre PIF','Cierre Cuotas','Seguimiento Post Call','Re agenda','No Cierre','No asistió'];

const CALL_ESTADO_COLOR = {
  'Cierre':                {bg:'rgba(61,138,90,0.12)', border:'rgba(61,138,90,0.25)',  text:'#5cb87a'},
  'Cierre PIF':            {bg:'rgba(61,138,90,0.22)', border:'rgba(61,138,90,0.45)',  text:'#7de0a0'},
  'Cierre Cuotas':         {bg:'rgba(61,138,90,0.12)', border:'rgba(61,138,90,0.25)',  text:'#5cb87a'},
  'Seguimiento Post Call': {bg:'rgba(61,106,170,0.12)',border:'rgba(61,106,170,0.25)', text:'#6090d4'},
  'Re agenda':             {bg:'rgba(196,136,42,0.12)',border:'rgba(196,136,42,0.25)', text:'#e0a848'},
  'No Cierre':             {bg:'rgba(184,72,72,0.12)', border:'rgba(184,72,72,0.25)',  text:'#d46060'},
  'No asistió':            {bg:'rgba(120,40,40,0.15)', border:'rgba(150,50,50,0.3)',   text:'#b04040'},
};
const CALL_ESTADOS_MOTIVO = new Set(['No Cierre']);

const CALL_TO_LEAD_ESTADO = {
  'Cierre':                'Cerrado',
  'Cierre PIF':            'Cerrado',
  'Cierre Cuotas':         'Cerrado',
  'Seguimiento Post Call': 'Seguimiento Post Call',
  'Re agenda':             'Re agendado',
  'No Cierre':             'Perdido Post Call',
  'No asistió':            'No Show',
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
function _filtrarCalls(){
  return callsCache.filter(c=>_gfInRange(c.created_at));
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
    const cierres =filtradas.filter(x=>['Cierre','Cierre PIF','Cierre Cuotas'].includes(x.estado||'')).length;
    const cierresP=callsCache.filter(x=>_gfPrevInRange(x.created_at)&&['Cierre','Cierre PIF','Cierre Cuotas'].includes(x.estado||'')).length;
    const noCerradas=Math.max(0,(c.shows||0)-cierres);
    metricsEl.style.cssText='display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px';
    metricsEl.innerHTML=
      metCardSm('Total llamadas',c.calls||0,'',_delta(c.calls||0,p.calls||0))+
      metCardSm('Shows (asistió)',c.shows||0,'',_delta(c.shows||0,p.shows||0))+
      metCardSm('Cierres',cierres,'green',_delta(cierres,cierresP))+
      metCardSm('No cerradas',noCerradas,noCerradas>0?'red':'')+
      `<div class="metric-card" style="padding:8px 12px;cursor:pointer" onclick="abrirAgendados()" title="Ver lista">
        <div class="metric-label" style="font-size:10px;margin-bottom:2px">Re agendas</div>
        <div class="metric-value" style="font-size:15px">${reagendas}</div>
       </div>`;
    _renderCallsMetrics2(c.shows||0, cierres, c.calls||0);
  } else {
    // Fallback local si la API no responde
    const prev   =callsCache.filter(c=>_gfPrevInRange(c.created_at));
    const hechas =filtradas.filter(c=>c.estado!=='No asistió'&&c.estado!=='Re agenda').length;
    const hechasP=prev.filter(c=>c.estado!=='No asistió'&&c.estado!=='Re agenda').length;
    const cierres =filtradas.filter(c=>['Cierre','Cierre PIF','Cierre Cuotas'].includes(c.estado||'')).length;
    const cierresP=prev.filter(c=>['Cierre','Cierre PIF','Cierre Cuotas'].includes(c.estado||'')).length;
    const noCerradas=Math.max(0,hechas-cierres);
    metricsEl.style.cssText='display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px';
    metricsEl.innerHTML=
      metCardSm('Total llamadas',total,'',_delta(total,prev.length))+
      metCardSm('Llamadas hechas',hechas,'',_delta(hechas,hechasP))+
      metCardSm('Cierres',cierres,'green',_delta(cierres,cierresP))+
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
function renderCallsPage(){_applyCallsFilter();fetchCalls();}

function _renderCallsTable(rows){
  const tbody=document.getElementById('calls-table');
  if(!tbody) return;
  const canLink=['admin','closer'].includes(currentUserRole);

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
    const isCierre=['Cierre','Cierre PIF','Cierre Cuotas'].includes(estado);
    let pagoHtml='';
    if(isCierre){
      const pagoTotal=(S.ing||[]).filter(x=>x.concepto==='Venta Nueva'&&(x.instagram||'').toLowerCase()===ig).reduce((a,x)=>a+(+x.usd||0),0);
      if(pagoTotal>0) pagoHtml=`<div style="font-size:10px;color:#5cb85c;font-weight:700;margin-top:3px">${fmtMoney(pagoTotal)}</div>`;
    }
    const estadoBadge=`<span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
      padding:3px 8px;border-radius:20px;background:${col.bg};border:1px solid ${col.border};color:${col.text};white-space:nowrap">${estado||'—'}</span>${pagoHtml}`;

    const infoPrevia=r.info_previa
      ?`<span class="trunc" style="max-width:110px;display:inline-block;cursor:pointer;color:var(--text2)"
          onclick="verInfoPreviaModal('${r.info_previa?.replace(/'/g,"\\'")||''}','${r.nombre||''}');event.stopPropagation()"
          title="Click para ver completo">${r.info_previa}</span>`
      :'<span style="color:var(--text3)">—</span>';

    let rJSON={};
    try{ if(r.reporte) rJSON=typeof r.reporte==='string'?JSON.parse(r.reporte):r.reporte; }catch{}
    const tieneReporte=Object.values(rJSON).some(v=>v&&v.toString().trim());
    const avatarIdeal=(rJSON.avatar_ideal||'').toLowerCase()==='si';

    const motivoText=CALL_ESTADOS_MOTIVO.has(estado)&&r.motivo_no_cierre
      ?`<span class="trunc" style="max-width:110px;display:inline-block;color:#d46060" title="${r.motivo_no_cierre}">${r.motivo_no_cierre}</span>`
      :'<span style="color:var(--text3)">—</span>';
    const linkCell=canLink&&r.link_llamada&&r.link_llamada.startsWith('http')
      ?`<a href="${r.link_llamada}" target="_blank" class="link-btn">▶ Ver</a>`
      :'<span style="color:var(--text3)">—</span>';

    const reporteCell=tieneReporte
      ?`<button class="btn btn-outline" style="font-size:10px;padding:3px 8px" onclick="verReporteCall('${r.id}');event.stopPropagation()">Ver${avatarIdeal?' ⭐':''}</button>`
      :'<span style="color:var(--text3)">—</span>';

    return `<tr onclick="abrirEditCall('${r.id}')" style="cursor:pointer" title="Click para editar" class="${avatarIdeal?'avatar-ideal-si':''}">
      <td style="color:var(--text3);font-size:10px;text-align:center">${idx+1}</td>
      <td style="color:var(--text);font-weight:600">${r.nombre||'—'}${callNum}</td>
      <td><a href="https://instagram.com/${ig}" target="_blank" style="color:var(--blue);text-decoration:none;font-size:12px" onclick="event.stopPropagation()">@${r.instagram||'—'}</a></td>
      <td style="font-size:12px;color:var(--text2)">${r.whatsapp||'—'}</td>
      <td>${infoPrevia}</td>
      <td>${estadoBadge}</td>
      <td>${motivoText}</td>
      <td style="text-align:center;font-size:13px;font-weight:700;color:var(--text)">${r.seguimientos||0}</td>
      <td><span class="badge ${r.responde?'bgr':'bgy'}">${r.responde?'Sí':'No'}</span></td>
      <td onclick="event.stopPropagation()">${linkCell}</td>
      <td onclick="event.stopPropagation()">${reporteCell}</td>
      <td style="font-size:11px;color:var(--text3);white-space:nowrap">${formatearFecha(r.created_at)}</td>
      <td onclick="event.stopPropagation()">
        <button class="btn-icon" onclick="deleteCall('${r.id}')" style="color:var(--red)" title="Eliminar">×</button>
      </td>
    </tr>`;
  }).join('')||'<tr><td colspan="13" style="color:var(--text3);text-align:center;padding:24px">Sin llamadas</td></tr>';
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
async function savePreCall(){
  const nombre   =(document.getElementById('pc-nombre')?.value||'').trim();
  const instagram=(document.getElementById('pc-instagram')?.value||'').trim().replace(/^@/,'').toLowerCase();
  const whatsapp =_getPCFullWhatsApp();
  const info_previa=(document.getElementById('pc-info')?.value||'').trim();

  if(!instagram){toast('✗ Instagram es obligatorio');return;}

  const data={nombre,instagram,whatsapp,info_previa};
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
  document.getElementById('ec-motivo').value=r.motivo_no_cierre||'';
  document.getElementById('ec-seguimientos').value=r.seguimientos||0;
  if(r.responde){document.getElementById('ec-resp-si').checked=true;}
  else{document.getElementById('ec-resp-no').checked=true;}
  document.getElementById('ec-link').value=r.link_llamada||'';

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
  const wrap=document.getElementById('ec-motivo-wrap');
  if(wrap) wrap.style.display=CALL_ESTADOS_MOTIVO.has(estado)?'block':'none';
}

// ========== CLOSER: saveEditCall ==========
async function saveEditCall(){
  const id=document.getElementById('ec-id').value;
  if(!id){toast('✗ ID inválido');return;}
  const estado=document.getElementById('ec-estado').value;
  const motivo=(document.getElementById('ec-motivo')?.value||'').trim();
  if(CALL_ESTADOS_MOTIVO.has(estado)&&!motivo){toast('✗ Motivo de no cierre obligatorio');return;}
  const link=(document.getElementById('ec-link')?.value||'').trim();
  if(link&&!link.startsWith('http')){toast('✗ El link debe empezar con http');return;}

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

  const payload={
    estado,
    motivo_no_cierre:CALL_ESTADOS_MOTIVO.has(estado)?motivo:'',
    seguimientos:parseInt(document.getElementById('ec-seguimientos')?.value||'0',10),
    responde:document.getElementById('ec-resp-si')?.checked===true,
    link_llamada:link,
    reporte,
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
      if(leadEstado&&LEAD_ESTADOS.includes(leadEstado)&&call.instagram){
        const ig=(call.instagram||'').toLowerCase();
        const lead=leadsCache.find(l=>(l.instagram||'').toLowerCase()===ig);
        if(lead){
          lead.estado=leadEstado;
          await apiFetch(`${API_URL}/leads/${lead.id}`,{method:'PATCH',body:JSON.stringify({estado:leadEstado})});
          console.log(`[sync] @${ig} → lead.estado = "${leadEstado}"`);
          if(document.getElementById('page-leads')?.classList.contains('active')) _applyLeadsFilter();
        }
      }
    }

    if(['Cierre','Cierre PIF','Cierre Cuotas'].includes(estado)){
      const ig2=(call?.instagram||'').toLowerCase();
      const leadForCierre=leadsCache.find(l=>(l.instagram||'').toLowerCase()===ig2);
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
    if(call&&['Cierre','Cierre PIF','Cierre Cuotas'].includes(call.estado||'')){
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

function verInfoPreviaModal(texto, nombre){
  document.getElementById('modal-info-meta').textContent=nombre||'';
  document.getElementById('modal-info-body').textContent=texto||'(Sin info previa)';
  document.getElementById('modal-info-previa').classList.add('open');
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

function openAddCallModal(){openModal('modal-call');}
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
  if(el('cierre-tipo-pago')){ el('cierre-tipo-pago').value='PIF'; }
  if(el('cierre-comprobante')) el('cierre-comprobante').value='';
  if(el('cierre-comprobante-img')) el('cierre-comprobante-img').value='';
  if(el('cierre-comprobante-preview')){el('cierre-comprobante-preview').src='';el('cierre-comprobante-preview').style.display='none';}
  if(el('cierre-nro-cuotas')) el('cierre-nro-cuotas').value='1';
  if(el('cierre-cuota-section')) el('cierre-cuota-section').style.display='none';
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
  if(sec) sec.style.display=val==='Cuotas'?'block':'none';
  if(val==='Cuotas') updateCuotaFechas();
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
        style="width:110px;padding:4px 8px;font-size:12px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--rs);color:var(--text)">
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
  const programaMeses=parseInt(document.getElementById('cierre-programa')?.value)||0;
  if(!nombre){toast('✗ Nombre es obligatorio');return;}
  if(!programaMeses){toast('✗ Seleccioná el programa');return;}
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
  const sal=new Date(hoy); sal.setMonth(hoy.getMonth()+programaMeses);
  const origenLead=window._pendingCierre?.lead?.origen||null;
  const clienteData={
    id:uid(),
    nombre,
    instagram,
    inicio:hoy.toISOString().slice(0,10),
    fin:sal.toISOString().slice(0,10),
    pp:esCuotas?'CUOTA':tipoPago,
    mod:'—',
    proxpago:c1.toISOString().slice(0,10),
    estado:'Al día',
    proxpaso:'Onboarding',
    road:'',
    cash_collected:cash,
    programa:programaMeses+' meses',
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
      S.cuotas.push({id:uid(),clienteId:String(clienteData.id),clienteNombre:nombre,clienteIg:instagram,numero:i+2,fecha:f.toISOString().slice(0,10),monto:montosCuota[i]||0,pagado:false});
    }
    save('cuotas');
  }
  _logActivity('Cliente creado',{nombre,instagram},'Desde cierre de lead');
  if(typeof renderClients==='function') renderClients();
  closeModal('modal-cierre');
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
const _IG_KEY='crm_ig_'+(_cid||'default');
const _igDefaults={
  account:'@tucuenta',followers:0,followersGrowth:0,watchTime:0,reels:[],carruseles:[]
};
let _igData=ld(_IG_KEY,_igDefaults);
if(!Array.isArray(_igData.reels)) _igData.reels=[];
if(!Array.isArray(_igData.carruseles)) _igData.carruseles=[];
function _saveIG(){sv(_IG_KEY,_igData);}

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

function equipoGetRules(){
  const cid = localStorage.getItem('clienteSeleccionado')||'default';
  return ld(`crm_comm_${cid}`, {setter:[],closer:[]});
}
function equipoSaveRules(rules){
  const cid = localStorage.getItem('clienteSeleccionado')||'default';
  sv(`crm_comm_${cid}`, rules);
}
function calcCommission(revenue, rules){
  const gteRules = rules.filter(r=>r.cond==='gte').sort((a,b)=>b.val-a.val);
  const ltRules  = rules.filter(r=>r.cond==='lt').sort((a,b)=>a.val-b.val);
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
function equipoAddRule(role){
  const rules=equipoGetRules();
  rules[role].push({id:uid(),cond:'gte',val:0,pct:0});
  equipoSaveRules(rules); renderEquipo();
}
function equipoDeleteRule(role,id){
  const rules=equipoGetRules();
  rules[role]=rules[role].filter(r=>r.id!==id);
  equipoSaveRules(rules); renderEquipo();
}
function equipoUpdateRule(role,id,field,val){
  const rules=equipoGetRules();
  const rule=rules[role].find(r=>r.id===id);
  if(!rule) return;
  if(field==='val'||field==='pct') rule[field]=parseFloat(val)||0;
  else rule[field]=val;
  equipoSaveRules(rules);
}

function renderEquipo(){
  const container=document.getElementById('equipo-content');
  if(!container) return;
  const rules=equipoGetRules();
  const revenue=S.ing.filter(x=>_eqInRange(x.fecha)).reduce((a,x)=>a+(+x.usd||0),0);
  const periodCalls=callsCache.filter(c=>_eqInRange(c.created_at));
  const agendasCount=periodCalls.length;
  const pifCount   =periodCalls.filter(c=>(c.estado||'')==='Cierre PIF').length;
  const cuotasCount=periodCalls.filter(c=>(c.estado||'')==='Cierre Cuotas').length;
  const setterComm=calcCommission(revenue,rules.setter);
  const closerComm=calcCommission(revenue,rules.closer);
  const setterAmt=revenue*(setterComm.pct/100);
  const closerAmt=revenue*(closerComm.pct/100);
  const totalTeam=setterAmt+closerAmt;
  const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const periodLabel=_equipo.mes!==''?MESES[parseInt(_equipo.mes,10)]:'Esta semana';

  function ruleRow(role,r){
    return `<div class="eq-rule-row">
      <span class="eq-rule-if">Si facturación</span>
      <select class="eq-rule-sel" onchange="equipoUpdateRule('${role}','${r.id}','cond',this.value)">
        <option value="gte" ${r.cond==='gte'?'selected':''}>≥</option>
        <option value="lt"  ${r.cond==='lt' ?'selected':''}>＜</option>
      </select>
      <input class="eq-rule-inp" type="number" value="${r.val}" min="0"
        onblur="equipoUpdateRule('${role}','${r.id}','val',this.value);renderEquipo();" onclick="this.select()">
      <span class="eq-rule-arrow">→</span>
      <input class="eq-rule-inp eq-rule-pct" type="number" value="${r.pct}" min="0" max="100" step="0.1"
        onblur="equipoUpdateRule('${role}','${r.id}','pct',this.value);renderEquipo();" onclick="this.select()">
      <span class="eq-rule-pct-sym">%</span>
      <button class="eq-rule-del" onclick="equipoDeleteRule('${role}','${r.id}')">×</button>
    </div>`;
  }

  function commDetail(comm,rev,rulesArr){
    if(!rulesArr.length) return 'Sin reglas configuradas';
    if(!comm.rule) return 'Sin regla que aplique al monto actual';
    return `${comm.pct}% sobre ${fmtUSD(rev)} &nbsp;·&nbsp; regla: ${comm.rule.cond==='gte'?'≥':'<'} $${fmt(comm.rule.val)}`;
  }

  container.innerHTML=`
<style>
.eq-wrap{max-width:960px;margin:0 auto;}
.eq-filter-row{display:flex;align-items:center;gap:8px;margin-bottom:24px;flex-wrap:wrap;}
.eq-mes-sel{background:var(--surface-2);border:1px solid var(--line);color:var(--text2);border-radius:var(--rs);padding:7px 12px;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;letter-spacing:.04em;text-transform:uppercase;}
.eq-mes-sel:focus{outline:none;border-color:var(--gold-border);}
.eq-top-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:22px;}
@media(max-width:700px){.eq-top-grid{grid-template-columns:1fr;}}
.eq-kpi{background:var(--metric);border:1px solid var(--line);border-radius:var(--r);padding:18px 20px 16px;box-shadow:var(--shadow-md);position:relative;overflow:hidden;transition:transform .15s,border-color .15s;}
.eq-kpi:hover{border-color:var(--line-strong);transform:translateY(-1px)}
.eq-kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);}
.eq-kpi-label{font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;}
.eq-kpi-val{font-family:'Inter',sans-serif;font-weight:700;font-size:26px;color:var(--text);line-height:1.1;letter-spacing:-0.025em;}
.eq-kpi-val.gold{color:var(--gold);}
.eq-kpi-val.red{color:var(--red);}
.eq-kpi-sub{font-size:12px;color:var(--text3);margin-top:6px;}
.eq-kpi-sub.matched{color:var(--gold);opacity:.85;}
.eq-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:22px;}
@media(max-width:600px){.eq-cards{grid-template-columns:1fr;}}
.eq-card{background:var(--metric);border:1px solid var(--line);border-radius:var(--r);padding:20px;box-shadow:var(--shadow-md);position:relative;overflow:hidden;}
.eq-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);}
.eq-card-title{font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px;display:flex;align-items:center;gap:6px;}
.eq-card-title::before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 6px var(--gold);}
.eq-card-comm-val{font-family:'Inter',sans-serif;font-weight:700;font-size:28px;color:var(--text);line-height:1.1;letter-spacing:-0.025em;margin-bottom:4px;}
.eq-card-comm-detail{font-size:12px;color:var(--text3);margin-bottom:16px;}
.eq-card-comm-detail.matched{color:var(--gold);opacity:.85;}
.eq-counters{display:flex;gap:10px;margin-top:4px;}
.eq-counter{flex:1;background:var(--surface-3);border:1px solid var(--line);border-radius:var(--rs);padding:10px 12px;text-align:center;}
.eq-counter-val{font-size:22px;font-weight:700;margin-bottom:2px;font-family:'Inter',sans-serif;letter-spacing:-0.02em;}
.eq-counter-label{color:var(--text3);font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;}
.eq-counter.pif .eq-counter-val{color:var(--green);}
.eq-counter.cuotas .eq-counter-val{color:var(--blue);}
.eq-rules-wrap{background:var(--metric);border:1px solid var(--line);border-radius:var(--r);padding:22px;box-shadow:var(--shadow-md);}
.eq-rules-header{display:flex;align-items:center;gap:8px;color:var(--text);font-size:14px;font-weight:600;margin-bottom:22px;letter-spacing:-0.01em;}
.eq-rules-role{margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid var(--line);}
.eq-rules-role:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none;}
.eq-rules-role-title{font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
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
      <div class="eq-kpi-label">Margen Neto (post-comisiones)</div>
      <div class="eq-kpi-val gold">${fmtUSD(revenue-totalTeam)}</div>
      ${revenue>0?`<div class="eq-kpi-sub">${(((revenue-totalTeam)/revenue)*100).toFixed(1)}% del total facturado</div>`:''}
    </div>
  </div>

  <div class="eq-cards">
    <div class="eq-card">
      <div class="eq-card-title">Setter</div>
      <div class="metric-label">Comisión Generada</div>
      <div class="eq-card-comm-val">${fmtUSD(setterAmt)}</div>
      <div class="eq-card-comm-detail ${setterComm.rule?'matched':''}">${commDetail(setterComm,revenue,rules.setter)}</div>
      <div class="eq-counters">
        <div class="eq-counter" style="border-color:rgba(224,181,74,.15)">
          <div class="eq-counter-val" style="color:var(--gold)">${agendasCount}</div>
          <div class="eq-counter-label">Agendas</div>
        </div>
      </div>
    </div>
    <div class="eq-card">
      <div class="eq-card-title">Closer</div>
      <div class="metric-label">Comisión Generada</div>
      <div class="eq-card-comm-val">${fmtUSD(closerAmt)}</div>
      <div class="eq-card-comm-detail ${closerComm.rule?'matched':''}">${commDetail(closerComm,revenue,rules.closer)}</div>
      <div class="eq-counters">
        <div class="eq-counter pif">
          <div class="eq-counter-val">${pifCount}</div>
          <div class="eq-counter-label">Cierre PIF</div>
        </div>
        <div class="eq-counter cuotas">
          <div class="eq-counter-val">${cuotasCount}</div>
          <div class="eq-counter-label">Cierre Cuotas</div>
        </div>
      </div>
    </div>
  </div>

  <div class="eq-rules-wrap">
    <div class="eq-rules-header">⚙ Configurar Comisiones</div>
    <div class="eq-rules-role">
      <div class="eq-rules-role-title">
        Setter
        <button class="eq-add-btn" onclick="equipoAddRule('setter')">+ Agregar regla</button>
      </div>
      ${rules.setter.length===0
        ?'<div class="eq-empty-rules">Sin reglas. Agrega una para calcular comisiones automáticamente.</div>'
        :rules.setter.map(r=>ruleRow('setter',r)).join('')}
    </div>
    <div class="eq-rules-role">
      <div class="eq-rules-role-title">
        Closer
        <button class="eq-add-btn" onclick="equipoAddRule('closer')">+ Agregar regla</button>
      </div>
      ${rules.closer.length===0
        ?'<div class="eq-empty-rules">Sin reglas. Agrega una para calcular comisiones automáticamente.</div>'
        :rules.closer.map(r=>ruleRow('closer',r)).join('')}
    </div>
  </div>
</div>`;
}
