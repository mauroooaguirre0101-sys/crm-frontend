// ========== SUPABASE ==========
alert("FRONT NUEVO CARGADO");

const API_URL = "https://noble-determination-production.up.railway.app";

const _sb = supabase.createClient(
  "https://zyoqgyjshjvttwypiqhp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5b3FneWpzaGp2dHR3eXBpcWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTU4MzcsImV4cCI6MjA5MjczMTgzN30.NZHO9QGpb0ANRU8qPNEc6Y_Ow5qMVtcAGN-IvxDfSDA"
);

// ========== UTILS ==========
function ld(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
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
    clients:renderClients,fin:renderFin,exp:renderExp,ig:renderIG};
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
    ${metCard('Neto',fmtMoney(neto),neto>=0?'green':'red',_delta(neto,netoP))}
    ${metCard('Clientes activos',activeClients,'',_delta(newClientsThis,newClientsPrev))}
  `;
  document.getElementById('dash-metrics2').innerHTML=`
    ${metCard('Leads período',leadsF.length,'',_delta(leadsF.length,leadsP.length))}
    ${metCard('Cerrados',cerradosF,'green',_delta(cerradosF,cerradosP))}
    ${metCard('Calls período',callsF.length,'',_delta(callsF.length,callsP.length))}
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
      <div class="savings-count">${vnCount} transaccion${vnCount!==1?'es':''} en el período</div>
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
      <div class="savings-count">${cuotasItems.length} transaccion${cuotasItems.length!==1?'es':''} en el período</div>
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
  const sops=_loadSOPS();
  const el=document.getElementById('sops-table-body');
  if(!el) return;
  el.innerHTML=sops.map((s,i)=>`
    <tr>
      <td>${s.link?`<a href="${s.link}" target="_blank" style="color:var(--blue);font-size:12px">Ver SOP ↗</a>`:'<span style="color:var(--text3)">—</span>'}</td>
      <td>${sopAreaBadge(s.area)}</td>
      <td style="color:var(--text2);font-size:13px">${s.detalles||'—'}</td>
      <td><button class="btn-icon" onclick="delSOP(${i})">×</button></td>
    </tr>`).join('')||'<tr><td colspan="4" style="color:var(--text3);text-align:center;padding:28px">Sin SOPs cargados. Usá "+ Nuevo SOP" para agregar uno.</td></tr>';
}
function saveSOP(){
  const link=(document.getElementById('sop-link')?.value||'').trim();
  const area=document.getElementById('sop-area')?.value||'Otro';
  const detalles=(document.getElementById('sop-detalles')?.value||'').trim();
  if(!detalles&&!link){toast('✗ Completá al menos el link o los detalles');return;}
  const sops=_loadSOPS();
  sops.push({id:uid(),link,area,detalles});
  _saveSOPS(sops);
  closeModal('modal-sop');
  renderSOPS();
  toast('✓ SOP guardado');
}
function delSOP(i){
  if(!confirm('¿Eliminar este SOP?'))return;
  const sops=_loadSOPS();
  sops.splice(i,1);
  _saveSOPS(sops);
  renderSOPS();
  toast('✓ SOP eliminado');
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
function saveFound(){
  [...foundAvatarFields,...foundOfertaFields].forEach(f=>{
    const el=document.getElementById('ff-'+f.k);
    if(el)S.found[f.k]=el.value;
  });
  save('found');toast('Fundaciones guardadas ✓');
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
      <td><button class="btn-icon" onclick="delCont(${S.content.indexOf(x)})">×</button></td>
    </tr>`).join('')||'<tr><td colspan="8" style="color:var(--text3);text-align:center;padding:20px">Sin piezas</td></tr>';
  document.getElementById('hist-table').innerHTML=hists.map((x,i)=>`
    <tr>
      <td>${x.fecha||'—'}</td>
      <td>${x.angulo||'—'}</td>
      <td>${x.tipo||'—'}</td>
      <td><span class="trunc">${x.hook||'—'}</span></td>
      <td>${x.cta||'—'}</td>
      <td>${contBadge(x.estado)}</td>
      <td><button class="btn-icon" onclick="delHist(${S.hists.indexOf(x)})">×</button></td>
    </tr>`).join('')||'<tr><td colspan="7" style="color:var(--text3);text-align:center;padding:20px">Sin historias</td></tr>';
  renderContCharts();
}
function saveCont(){
  S.content.push({id:uid(),fecha:v('c-fecha'),tipo:v('c-tipo'),angulo:v('c-angulo'),formato:v('c-formato'),cta:v('c-cta'),estado:v('c-estado'),hook:v('c-hook'),guion:v('c-guion')});
  save('content');closeModal('modal-cont');renderCont();toast('Pieza guardada ✓');
}
function saveHist(){
  S.hists.push({id:uid(),fecha:v('h-fecha'),tipo:v('h-tipo'),angulo:v('h-angulo'),formato:v('h-formato'),cta:v('h-cta'),estado:v('h-estado'),hook:v('h-hook'),guion:v('h-guion')});
  save('hists');closeModal('modal-hist');renderCont();toast('Historia guardada ✓');
}
function delCont(i){if(!confirm('¿Eliminar?'))return;S.content.splice(i,1);save('content');renderCont()}
function delHist(i){if(!confirm('¿Eliminar?'))return;S.hists.splice(i,1);save('hists');renderCont()}

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
      <td><button class="btn-icon" onclick="delAng(${i})">×</button></td>
    </tr>`).join('')||'<tr><td colspan="7" style="color:var(--text3);text-align:center;padding:20px">Sin ángulos</td></tr>';
}
function saveAng(){
  S.angulos.push({id:uid(),angulo:v('a-angulo'),tipo:v('a-tipo'),pc:[...(currentChips['a-pc']||[])],uc:[...(currentChips['a-uc']||[])],ad:v('a-ad')});
  save('angulos');closeModal('modal-ang');renderAng();toast('Ángulo guardado ✓');
}
function delAng(i){if(!confirm('¿Eliminar?'))return;S.angulos.splice(i,1);save('angulos');renderAng()}

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
        <button class="btn-icon" onclick="delRef(${i})" style="margin-left:4px">×</button>
      </td>
    </tr>`).join('')||'<tr><td colspan="5" style="color:var(--text3);text-align:center;padding:20px">Sin referentes</td></tr>';
}
function saveRef(){
  S.refs.push({id:uid(),nombre:v('r-nombre'),link:v('r-link'),seg:v('r-seg'),nicho:v('r-nicho'),rec:v('r-rec')});
  save('refs');closeModal('modal-ref');renderRef();toast('Referente guardado ✓');
}
function delRef(i){if(!confirm('¿Eliminar?'))return;S.refs.splice(i,1);save('refs');renderRef()}

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
      <td><button class="btn-icon" onclick="delMet(${i})">×</button></td>
    </tr>`).join('')||'<tr><td colspan="8" style="color:var(--text3);text-align:center;padding:20px">Sin métricas</td></tr>';
}
function saveMet(){
  S.mets.push({id:uid(),fecha:v('m-fecha'),tipo:v('m-tipo'),angulo:v('m-angulo'),cta:v('m-cta'),com:v('m-com'),seg:v('m-seg'),leads:v('m-leads'),ventas:v('m-ventas'),pc:v('m-pc'),uc:v('m-uc')});
  save('mets');closeModal('modal-met');renderMet();toast('Métrica guardada ✓');
}
function delMet(i){if(!confirm('¿Eliminar?'))return;S.mets.splice(i,1);save('mets');renderMet()}

// ========== LEADS — SUPABASE ==========
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
  if(nuevoEstado === 'Cerrado') _mostrarPopupCierre(id, lead);
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
    const cerrados  = filtrados.filter(l=>l.estado==='Cerrado'||l.estado==='Seña').length;
    const perdidos  = filtrados.filter(l=>ESTADO_PERDIDO.has(l.estado)).length;
    const prev      = leadsCache.filter(l=>_gfPrevInRange(l.created_at));
    const prevTot   = prev.length;
    const prevAg    = prev.filter(l=>l.estado==='Agendado').length;
    const prevCer   = prev.filter(l=>l.estado==='Cerrado'||l.estado==='Seña').length;
    const prevPerd  = prev.filter(l=>ESTADO_PERDIDO.has(l.estado)).length;
    metricsEl.innerHTML =
      metCard('Total período', total,      '', _delta(total,prevTot))+
      metCard('Agendados',     agendados,  '', _delta(agendados,prevAg))+
      metCard('Cerrados/Seña', cerrados,   'green', _delta(cerrados,prevCer))+
      metCard('Perdidos',      perdidos,   'red', _delta(perdidos,prevPerd));
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
      </div>` : '<span style="color:var(--text3);font-size:11px">—</span>';

    return `
    <tr style="${rowStyle}">
      <td style="color:var(--text3);font-size:10px;text-align:center;width:32px">${idx+1}</td>
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
      <td><button class="btn-icon" onclick="delLead('${x.id}')"
                  style="font-size:12px;padding:2px 8px;color:var(--text3)">× eliminar</button></td>
    </tr>`;
  }).join('')||'<tr><td colspan="13" style="color:var(--text3);text-align:center;padding:24px">Sin leads para este filtro</td></tr>';
}

function _renderFunnel(leads){
  const grid = document.getElementById('leads-funnel-grid');
  if(!grid) return;

  const total      = leads.length;
  const agendados  = leads.filter(l=>l.estado==='Agendado').length;
  const shows      = leads.filter(l=>l.show===true).length;
  const cerrados   = leads.filter(l=>l.estado==='Cerrado'||l.estado==='Seña').length;
  const calificados= leads.filter(l=>l.calificado===true).length;

  const pct = (num, den) => den > 0 ? ((num/den)*100).toFixed(1)+'%' : '—';
  const agendamiento   = pct(agendados,   total);
  const showRate       = pct(shows,       agendados);
  const closeRate      = pct(cerrados,    total);
  const closeOnCalls   = pct(cerrados,    shows);
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
    { label:'% Show Rate',      val:showRate,        verde:70, amarillo:50,
      sub:`${shows} asistieron de ${agendados} agendados` },
    { label:'% Close Rate',     val:closeRate,       verde:20, amarillo:10,
      sub:`${cerrados} cerrados de ${total} leads` },
    { label:'% Close / Calls',  val:closeOnCalls,    verde:40, amarillo:20,
      sub:`${cerrados} cerrados de ${shows} llamadas` },
    { label:'% Calificadas',    val:calificadasPct,  verde:60, amarillo:40,
      sub:`${calificados} calificados de ${agendados} agendados` },
  ];

  grid.innerHTML = metrics.map(m => {
    const color = semaforo(m.val, m.verde, m.amarillo);
    return `
      <div style="
        background:linear-gradient(135deg,rgba(20,19,18,0.97),rgba(12,11,11,0.99));
        border:1px solid rgba(60,58,55,0.2);
        border-radius:var(--r);padding:14px 16px;position:relative;overflow:hidden;
        box-shadow:0 0 0 1px rgba(0,0,0,0.3),0 2px 8px rgba(0,0,0,0.45)">
        <div style="position:absolute;bottom:0;left:0;right:0;height:2px;
                    background:linear-gradient(90deg,transparent,${color},transparent);opacity:.6"></div>
        <div style="position:absolute;top:0;left:0;right:0;height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)"></div>
        <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;
                    letter-spacing:.08em;margin-bottom:8px">${m.label}</div>
        <div style="font-family:'Inter',sans-serif;font-weight:700;font-size:26px;letter-spacing:-0.025em;color:${color};line-height:1;margin-bottom:6px">${m.val}</div>
        <div style="font-size:10px;color:var(--text3);line-height:1.4">${m.sub}</div>
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
    leadsCache = window.leadsCache = raw.map(l=>({
      ...l,
      estado:     l.estado     || 'Primer Contacto',
      show:       l.show       === true,
      calificado: l.calificado === true,
    }));
    _applyLeadsFilter();
  }catch(e){
    console.error('[fetchLeads]',e);
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

async function delLead(id){
  if(!confirm('¿Eliminar lead?')) return;
  const res=await apiFetch(`${API_URL}/leads/${id}`,{method:'DELETE'});
  if(!res.ok){const e=await res.json().catch(()=>({}));console.error('[delete lead]',e);toast('✗ Error al eliminar');return;}
  await fetchLeads();
}

// ========== CLIENTES ==========
function _clientsRow(x,i){
  return `<tr>
    <td>${x.inicio||'—'}</td>
    <td style="color:var(--text);font-weight:500">${x.nombre}</td>
    <td>${x.inicio||'—'}</td>
    <td>${x.fin||'—'}</td>
    <td><span class="badge bg">${x.pp||'—'}</span></td>
    <td style="font-size:12px;color:var(--text2)">${x.proxpaso||'—'}</td>
    <td>${clientBadge(x.estado)}</td>
    <td>
      ${x.road?`<a href="${x.road}" target="_blank" class="roadmap-link">🗺️</a>`:''}
      <button class="btn-icon" onclick="delClient(${i})">×</button>
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

  const clientsRowsFor=(arr)=>arr.map(x=>_clientsRow(x,S.clients.indexOf(x))).join('')||
    '<tr><td colspan="8" style="color:var(--text3);text-align:center;padding:16px">Sin clientes en esta categoría</td></tr>';

  const thead=`<thead><tr><th>Fecha</th><th>Cliente</th><th>Inicio</th><th>Final</th><th>PP</th><th>Próximo paso</th><th>Estado</th><th></th></tr></thead>`;

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
}
function toggleClientSection(id){
  const body=document.getElementById(id);
  const arrow=document.getElementById(id+'-arrow');
  if(!body) return;
  const open=body.style.display!=='none';
  body.style.display=open?'none':'block';
  if(arrow) arrow.textContent=open?'▶':'▼';
}
function saveClient(){
  S.clients.push({id:uid(),nombre:v('cl-nombre'),inicio:v('cl-inicio'),fin:v('cl-fin'),pp:v('cl-pp'),mod:v('cl-mod'),proxpago:v('cl-proxpago'),estado:v('cl-estado'),proxpaso:v('cl-proxpaso'),road:v('cl-road')});
  save('clients');closeModal('modal-client');renderClients();toast('Cliente guardado ✓');
}
function delClient(i){if(!confirm('¿Eliminar?'))return;S.clients.splice(i,1);save('clients');renderClients()}

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
  const ganancia =totalIng-totalGas;
  const gananciaP=totalIngP-totalGasP;
  const margen   =totalIng>0?((ganancia/totalIng)*100).toFixed(1):0;

  document.getElementById('fin-metrics').innerHTML=
    metCard('Ingresos',fmtMoney(totalIng),'green',_delta(totalIng,totalIngP))+
    metCard('Egresos',fmtMoney(totalGas),'red',_delta(totalGas,totalGasP))+
    metCard('Ganancia',fmtMoney(ganancia),ganancia>=0?'green':'red',_delta(ganancia,gananciaP))+
    metCard('Margen',margen+'%',+margen>=30?'green':+margen>=15?'':'red');

  document.getElementById('ing-table').innerHTML=ing.map(x=>`
    <tr>
      <td style="color:var(--text)">${x.concepto||'—'}</td>
      <td>${x.fecha||'—'}</td>
      <td style="color:var(--gold-light)">${fmtMoney(+x.usd||0)}</td>
      <td><span class="badge bgr">${x.tipo||'—'}</span></td>
      <td><button class="btn-icon" onclick="delIng(${S.ing.indexOf(x)})">×</button></td>
    </tr>`).join('')||'<tr><td colspan="5" style="color:var(--text3);text-align:center;padding:20px">Sin ingresos en este período</td></tr>';

  document.getElementById('gas-table').innerHTML=gas.map(x=>`
    <tr>
      <td style="color:var(--text)">${x.concepto||'—'}</td>
      <td>${x.fecha||'—'}</td>
      <td style="color:#d46060">${fmtMoney(+x.usd||0)}</td>
      <td><span class="badge br">${x.tipo||'—'}</span></td>
      <td><button class="btn-icon" onclick="delGas(${S.gas.indexOf(x)})">×</button></td>
    </tr>`).join('')||'<tr><td colspan="5" style="color:var(--text3);text-align:center;padding:20px">Sin egresos en este período</td></tr>';

  renderRenovaciones();
  renderActivityLog();
}
function saveIng(){
  S.ing.push({id:uid(),concepto:v('i-concepto'),fecha:v('i-fecha'),tipo:v('i-tipo'),usd:v('i-usd'),ars:v('i-ars'),eur:v('i-eur')});
  save('ing');closeModal('modal-ing');renderFin();toast('Ingreso guardado ✓');
}
function saveGas(){
  S.gas.push({id:uid(),concepto:v('g-concepto'),fecha:v('g-fecha'),tipo:v('g-tipo'),cat:v('g-cat'),usd:v('g-usd'),ars:v('g-ars'),eur:v('g-eur')});
  save('gas');closeModal('modal-gas');renderFin();toast('Egreso guardado ✓');
}
function delIng(i){if(!confirm('¿Eliminar?'))return;S.ing.splice(i,1);save('ing');renderFin()}
function delGas(i){if(!confirm('¿Eliminar?'))return;S.gas.splice(i,1);save('gas');renderFin()}

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
  admin:  ['dash','acc','found','cont','ang','ref','met','leads','calls','clients','fin','ig','exp'],
  closer: ['leads','calls','clients','acc','found','cont','ang','ref','met','fin','ig','exp'],
  setter: ['leads','acc','found','cont','ang','ref','met','clients','fin','ig','exp'],
};
const ROLE_ALLOWED = {
  admin:  ['dash','acc','found','cont','ang','ref','met','leads','calls','clients','fin','ig','exp'],
  closer: ['leads','calls'],
  setter: ['leads'],
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

function renderClienteSelector(){
  const clientes=_getClientes();
  const selected=_getClienteSeleccionado();
  const wrap=document.getElementById('cliente-selector-wrap');
  const sel=document.getElementById('cliente-selector');
  if(!wrap||!sel) return;
  if(clientes.length===0){ wrap.style.display='none'; return; }
  sel.innerHTML=clientes.map(c=>`
    <option value="${c.cliente_id}" ${c.cliente_id===selected?'selected':''}>
      ${c.cliente_id}${c.role?' ('+c.role+')':''}
    </option>`).join('');
  wrap.style.display='flex';
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
  document.getElementById('user-header').style.display='none';
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
  const allPages= ['dash','acc','found','cont','ang','ref','met','leads','calls','clients','fin','ig','exp'];

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

async function initApp(user){
  currentUser=user;
  setupAutoLogout();

  await loginRailway(user.email).catch(()=>{});
  currentUserRole=getUserRole();
  applyRolePermissions();
  _initTeam();

  renderClienteSelector();

  document.getElementById('auth-overlay').classList.add('hidden');
  document.getElementById('auth-loader').classList.add('hidden');

  initCurrencyUI();
  renderDash();
  fetchLeads();
  fetchCalls();
}

(async()=>{
  const user=await getUser();
  if(user){
    await initApp(user);
  } else {
    document.getElementById('auth-loader').classList.add('hidden');
    document.getElementById('auth-overlay').classList.remove('hidden');
  }
})();

// ========== LLAMADAS ==========
const CALL_ESTADOS = ['Cierre','Cierre PIF','Seguimiento Post Call','Re agenda','No Cierre','No asistió'];

const CALL_ESTADO_COLOR = {
  'Cierre':                {bg:'rgba(61,138,90,0.12)', border:'rgba(61,138,90,0.25)',  text:'#5cb87a'},
  'Cierre PIF':            {bg:'rgba(61,138,90,0.22)', border:'rgba(61,138,90,0.45)',  text:'#7de0a0'},
  'Seguimiento Post Call': {bg:'rgba(61,106,170,0.12)',border:'rgba(61,106,170,0.25)', text:'#6090d4'},
  'Re agenda':             {bg:'rgba(196,136,42,0.12)',border:'rgba(196,136,42,0.25)', text:'#e0a848'},
  'No Cierre':             {bg:'rgba(184,72,72,0.12)', border:'rgba(184,72,72,0.25)',  text:'#d46060'},
  'No asistió':            {bg:'rgba(120,40,40,0.15)', border:'rgba(150,50,50,0.3)',   text:'#b04040'},
};
const CALL_ESTADOS_MOTIVO = new Set(['No Cierre']);

const CALL_TO_LEAD_ESTADO = {
  'Cierre':                'Cerrado',
  'Cierre PIF':            'Cerrado',
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

function _applyCallsFilter(){
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
  const prev      =callsCache.filter(c=>_gfPrevInRange(c.created_at));
  const hechas    =filtradas.filter(c=>c.estado!=='No asistió'&&c.estado!=='Re agenda').length;
  const hechasP   =prev.filter(c=>c.estado!=='No asistió'&&c.estado!=='Re agenda').length;
  const reagendas =filtradas.filter(c=>(c.estado||'').toLowerCase()==='re agenda').length;
  const cierres   =filtradas.filter(c=>['Cierre','Cierre PIF'].includes(c.estado||'')).length;
  const cierresP  =prev.filter(c=>['Cierre','Cierre PIF'].includes(c.estado||'')).length;
  const metricsEl=document.getElementById('calls-metrics');
  if(metricsEl){
    metricsEl.innerHTML=
      metCard('Total llamadas',total,'',_delta(total,prev.length))+
      metCard('Llamadas hechas',hechas,'',_delta(hechas,hechasP))+
      metCard('Cierres',cierres,'green',_delta(cierres,cierresP))+
      `<div class="metric-card" onclick="abrirAgendados()" style="cursor:pointer" title="Ver lista">
        <div class="metric-label">Re agendas</div>
        <div class="metric-value">${reagendas}</div>
       </div>`;
  }
  _renderCallsTable(filtradas);
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
    _applyCallsFilter();
  }catch(e){console.error('Error fetchCalls:',e);}
  finally{if(loader) loader.style.display='none';}
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
    const estadoBadge=`<span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;
      padding:3px 8px;border-radius:20px;background:${col.bg};border:1px solid ${col.border};color:${col.text};white-space:nowrap">${estado||'—'}</span>`;

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
      <td onclick="event.stopPropagation()">
        <button class="btn-icon" onclick="deleteCall('${r.id}')" style="color:var(--red)" title="Eliminar">×</button>
      </td>
    </tr>`;
  }).join('')||'<tr><td colspan="12" style="color:var(--text3);text-align:center;padding:24px">Sin llamadas en este período</td></tr>';
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

    if(['Cierre','Cierre PIF'].includes(estado)){
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
  try{
    const res=await apiFetch(`${API_URL}/call/${id}`,{method:'DELETE'});
    if(!res.ok){toast('✗ Error al eliminar');return;}
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
  const entry={ts:new Date().toISOString(),leadId:lead?.id||'',nombre:lead?.nombre||'—',instagram:lead?.instagram||'',accion,detalle,usuario:localStorage.getItem('userEmail')||'—'};
  _activityLog.unshift(entry);
  if(_activityLog.length>100) _activityLog=_activityLog.slice(0,100);
  sv('crm_activity_log',_activityLog);
}
function renderActivityLog(){
  const el=document.getElementById('activity-log-container');
  if(!el) return;
  if(!_activityLog.length){el.innerHTML='<div style="color:var(--text3);text-align:center;padding:24px;font-size:13px">Sin actividad registrada</div>';return;}
  el.innerHTML=_activityLog.slice(0,40).map(e=>{
    const ts=new Date(e.ts);
    const time=ts.toLocaleDateString('es-AR',{day:'2-digit',month:'short'})+' '+ts.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    return `<div class="activity-item">
      <div class="activity-dot"></div>
      <div class="activity-content">
        <div class="activity-title">${e.accion} · <span style="color:var(--text2)">${e.nombre}</span>${e.instagram?` · <span style="color:var(--blue);font-size:11px">@${e.instagram}</span>`:''}</div>
        ${e.detalle?`<div class="activity-detail">${e.detalle}</div>`:''}
        <div style="font-size:10px;color:var(--text3);margin-top:2px">${e.usuario}</div>
      </div>
      <div class="activity-time">${time}</div>
    </div>`;
  }).join('');
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
    return `<div class="reno-card ${c.tipo}">
      <div style="flex:1">
        <div style="font-weight:600;color:var(--text);font-size:13px">${c.nombre||'—'}</div>
        ${c.instagram?`<div style="font-size:11px;color:var(--blue)">@${c.instagram}</div>`:''}
        <div style="font-size:11px;color:var(--text3);margin-top:2px">Vence: ${c.finDate.toLocaleDateString('es-AR')}</div>
      </div>
      ${c.cash_collected?`<div style="font-size:13px;font-weight:700;color:var(--gold-light)">${fmtMoney(+c.cash_collected)}</div>`:''}
      <span class="reno-badge ${c.tipo}">${label}</span>
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
  if(el('cierre-tipo-pago')) el('cierre-tipo-pago').selectedIndex=0;
  if(el('cierre-comprobante')) el('cierre-comprobante').value='';
  const hoy=new Date();
  const seg=new Date(hoy); seg.setDate(hoy.getDate()+30);
  const sal=new Date(hoy); sal.setMonth(hoy.getMonth()+3);
  const meses=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  if(el('cierre-fecha-inicio')) el('cierre-fecha-inicio').textContent=hoy.toLocaleDateString('es-AR');
  if(el('cierre-segunda-cuota')) el('cierre-segunda-cuota').textContent=seg.toLocaleDateString('es-AR');
  if(el('cierre-dia-salida')) el('cierre-dia-salida').textContent=sal.toLocaleDateString('es-AR');
  if(el('cierre-mes')) el('cierre-mes').textContent=meses[hoy.getMonth()]+' '+hoy.getFullYear();
  window._pendingCierre={leadId,lead};
  document.getElementById('modal-cierre').classList.add('open');
}
async function saveCierre(){
  const nombre=(document.getElementById('cierre-nombre')?.value||'').trim();
  const instagram=(document.getElementById('cierre-instagram')?.value||'').trim().replace(/^@/,'').toLowerCase();
  const tipoPago=document.getElementById('cierre-tipo-pago')?.value||'Contado';
  const cash=parseFloat(document.getElementById('cierre-cash')?.value)||0;
  const comprobante=(document.getElementById('cierre-comprobante')?.value||'').trim();
  if(!nombre){toast('✗ Nombre es obligatorio');return;}

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
  const seg=new Date(hoy); seg.setDate(hoy.getDate()+30);
  const sal=new Date(hoy); sal.setMonth(hoy.getMonth()+3);
  const clienteData={
    id:uid(),
    nombre,
    instagram,
    inicio:hoy.toISOString().slice(0,10),
    fin:sal.toISOString().slice(0,10),
    pp:tipoPago,
    mod:'—',
    proxpago:seg.toISOString().slice(0,10),
    estado:'Al día',
    proxpaso:'Onboarding',
    road:'',
    cash_collected:cash,
    comprobante
  };

  // Intentar crear en Railway; si no existe endpoint, guardamos local
  try{
    const res=await apiFetch(`${API_URL}/clientes`,{method:'POST',body:JSON.stringify({nombre,instagram,inicio:clienteData.inicio,fin:clienteData.fin,tipo_pago:tipoPago,cash_collected:cash,comprobante,estado:'Al día'})});
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
    S.ing.push({id:uid(),concepto:'Venta Nueva',fecha:hoy.toISOString().slice(0,10),tipo:'Venta Nueva',usd:cash,nombre,instagram});
    save('ing');
  }
  S.clients.push(clienteData);
  save('clients');
  _logActivity('Cliente creado',{nombre,instagram},'Desde cierre de lead');
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
      if(Array.isArray(d)&&d.length) _teamSessions.splice(0,_teamSessions.length,...d);
    }
  }catch{}
  const badge=document.getElementById('team-count');
  if(badge) badge.textContent=_teamSessions.length;
}
setInterval(_pollTeam,60000);

// ========== INSTAGRAM MODULE ==========
const _IG_KEY='crm_ig_'+(_cid||'default');
const _igDefaults={
  account:'@tucuenta',followers:0,followersGrowth:0,engagement:0,reach:0,ctr:0,watchTime:0,reels:[]
};
let _igData=ld(_IG_KEY,_igDefaults);
// Asegurar que reels sea array
if(!Array.isArray(_igData.reels)) _igData.reels=[];
function _saveIG(){sv(_IG_KEY,_igData);}

let _igSelectedReel=null;

function renderIG(){
  const ig=_igData;
  const metricsEl=document.getElementById('ig-metrics');
  if(!metricsEl) return;
  metricsEl.innerHTML=`
    <div class="ig-stat-card" style="cursor:pointer" onclick="openModal('modal-ig-cuenta')" title="Editar métricas de cuenta">
      <div class="ig-stat-label">Seguidores <span style="font-size:8px;opacity:.4">✎</span></div>
      <div class="ig-stat-value">${ig.followers?fmt(ig.followers):'—'}</div>
      <div class="ig-stat-sub" style="color:#5cb87a">${ig.followersGrowth?'+'+ig.followersGrowth+'% este mes':'Ingresar datos →'}</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Engagement</div>
      <div class="ig-stat-value">${ig.engagement?ig.engagement+'%':'—'}</div>
      <div class="ig-stat-sub">promedio últimos reels</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Reach</div>
      <div class="ig-stat-value">${ig.reach?fmt(ig.reach):'—'}</div>
      <div class="ig-stat-sub">cuentas alcanzadas</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">CTR</div>
      <div class="ig-stat-value">${ig.ctr?ig.ctr+'%':'—'}</div>
      <div class="ig-stat-sub">link en bio</div>
    </div>
    <div class="ig-stat-card">
      <div class="ig-stat-label">Watch Time</div>
      <div class="ig-stat-value">${ig.watchTime?ig.watchTime+'s':'—'}</div>
      <div class="ig-stat-sub">promedio por reel</div>
    </div>`;

  _igSelectedReel=null;
  _renderIGReels();
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
  grid.innerHTML=_igData.reels.map(r=>`
    <div class="ig-reel-card" onclick="_abrirIGReel('${r.id}')">
      <div class="ig-reel-thumb">
        <div class="ig-reel-play">▶</div>
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
      </div>
    </div>`).join('');
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
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.saves}</div><div class="ig-detail-lbl">Guardados</div></div>
    <div class="ig-detail-stat"><div class="ig-detail-val">${r.shares}</div><div class="ig-detail-lbl">Compartidos</div></div>`;
  detail.querySelector('.ig-retention-fill').style.cssText=`width:${r.retention||0}%;background:${retColor}`;
  detail.querySelector('.ig-retention-pct').textContent=(r.retention||0)+'%';
}

function openIGReelModal(){
  // Limpiar campos antes de abrir
  ['igr-titulo','igr-url','igr-fecha','igr-views','igr-likes','igr-comments','igr-saves','igr-shares','igr-retention'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.value=el.type==='number'?'0':'';}
  });
  const fecha=document.getElementById('igr-fecha');
  if(fecha) fecha.value=new Date().toISOString().slice(0,10);
  openModal('modal-ig-reel');
}

function saveIGReel(){
  const titulo=(document.getElementById('igr-titulo')?.value||'').trim();
  if(!titulo){toast('✗ Ingresá el título del reel');return;}
  const reel={
    id:'ig'+uid().slice(0,8),
    title:titulo,
    url:(document.getElementById('igr-url')?.value||'').trim(),
    date:document.getElementById('igr-fecha')?.value||new Date().toISOString().slice(0,10),
    views:parseInt(document.getElementById('igr-views')?.value)||0,
    likes:parseInt(document.getElementById('igr-likes')?.value)||0,
    comments:parseInt(document.getElementById('igr-comments')?.value)||0,
    saves:parseInt(document.getElementById('igr-saves')?.value)||0,
    shares:parseInt(document.getElementById('igr-shares')?.value)||0,
    retention:Math.min(100,Math.max(0,parseInt(document.getElementById('igr-retention')?.value)||0)),
  };
  _igData.reels.unshift(reel);
  _saveIG();
  closeModal('modal-ig-reel');
  renderIG();
  toast('✓ Reel agregado');
}

function deleteIGReel(id,e){
  e.stopPropagation();
  if(!confirm('¿Eliminar este reel?')) return;
  _igData.reels=_igData.reels.filter(r=>r.id!==id);
  _saveIG();
  const detail=document.getElementById('ig-reel-detail');
  if(detail) detail.style.display='none';
  _renderIGReels();
  toast('✓ Reel eliminado');
}

function openIGCuentaModal(){
  const ig=_igData;
  ['ig-c-account','ig-c-followers','ig-c-growth','ig-c-engagement','ig-c-reach','ig-c-ctr','ig-c-watchtime'].forEach((fid,i)=>{
    const keys=['account','followers','followersGrowth','engagement','reach','ctr','watchTime'];
    const el=document.getElementById(fid);
    if(el) el.value=ig[keys[i]]||'';
  });
  openModal('modal-ig-cuenta');
}

function saveIGCuenta(){
  _igData.account=(document.getElementById('ig-c-account')?.value||'').trim()||'@tucuenta';
  _igData.followers=parseInt(document.getElementById('ig-c-followers')?.value)||0;
  _igData.followersGrowth=parseFloat(document.getElementById('ig-c-growth')?.value)||0;
  _igData.engagement=parseFloat(document.getElementById('ig-c-engagement')?.value)||0;
  _igData.reach=parseInt(document.getElementById('ig-c-reach')?.value)||0;
  _igData.ctr=parseFloat(document.getElementById('ig-c-ctr')?.value)||0;
  _igData.watchTime=parseFloat(document.getElementById('ig-c-watchtime')?.value)||0;
  _saveIG();
  closeModal('modal-ig-cuenta');
  renderIG();
  toast('✓ Métricas de cuenta actualizadas');
}
