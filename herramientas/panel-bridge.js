/* Integración no intrusiva: Mi panel + 3 herramientas existentes. Sin datos sensibles ni envíos. */
(() => {
  if (window.__pbJourneyBridge) return;
  window.__pbJourneyBridge = true;
  const WORKSPACE = 'papelesbebe_workspace_v1';
  const PROGRESS = 'papelesbebe_que_me_falta_v1';
  const TOOLS = [
    {url:'/herramientas/buscador-ayudas/', title:'Radar de ayudas', desc:'Descubre ayudas que conviene comprobar según tu territorio.', fields:['comunidad','laboral','familia'], next:'Consultar ayudas'},
    {url:'/herramientas/calculadora-permiso-nacimiento/', title:'Planificador de permisos', desc:'Calcula semanas y fechas orientativas antes de tramitar.', fields:['tipo','fecha'], next:'Planificar permiso'},
    {url:'/herramientas/calendario-primeros-90-dias/', title:'Calendario de trámites', desc:'Ordena las primeras gestiones sin confundir recordatorios con plazos legales.', fields:['fecha'], next:'Abrir calendario'}
  ];
  const normalize = path => path.endsWith('/') ? path : path+'/';
  const current = normalize(location.pathname);
  const safeRead = key => { try { const result=JSON.parse(localStorage.getItem(key)||'{}');return result && typeof result==='object' ? result : {}; } catch(_) {return {};} };
  const escapeText = s => String(s||'').replace(/[&<>"']/g, x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  function meaningful(tool,workspace) {
    const saved = (workspace.tools||{})[tool.url] || {};
    const fields = saved.fields || {};
    return {hasResult:!!saved.hasResult, filled:tool.fields.filter(k=>typeof fields[k]==='string' && fields[k]!=='').length, updatedAt:saved.updatedAt||''};
  }
  function buildCard(tool,workspace) {
    const status=meaningful(tool,workspace);
    const label=status.hasResult?'Resultado consultado':status.filled?'Datos guardados':'Sin empezar';
    const button=status.filled||status.hasResult?'Continuar →':tool.next+' →';
    const div=document.createElement('article');
    div.className='pb-bridge-card';
    div.innerHTML='<div><strong>'+escapeText(tool.title)+'</strong><span class="pb-bridge-status">'+label+'</span></div><p>'+escapeText(tool.desc)+'</p><a href="'+tool.url+'">'+button+'</a>';
    return div;
  }
  function css(){
    if(document.getElementById('pb-bridge-style'))return;
    const style=document.createElement('style');style.id='pb-bridge-style';
    style.textContent='.pb-bridge{margin:22px 0;padding:18px;border:1px solid #dfe3f6;border-radius:19px;background:#fafaff;color:#263249}.pb-bridge h2{font-size:1.32rem;margin:0 0 7px}.pb-bridge>p{font-size:.93rem;line-height:1.55;margin:0 0 14px;color:#616b7e}.pb-bridge-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.pb-bridge-card{padding:14px;border:1px solid #e0e4f2;border-radius:14px;background:white;min-width:0}.pb-bridge-card>div{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:7px}.pb-bridge-card strong{font-size:.95rem}.pb-bridge-card p{font-size:.84rem;line-height:1.48;margin:9px 0;color:#657085}.pb-bridge-card a{font-size:.9rem;font-weight:800;color:#464dc0}.pb-bridge-status{font-size:.7rem;padding:4px 7px;background:#eff0ff;color:#474eaf;border-radius:999px}.pb-bridge-foot{font-size:.78rem;color:#747d8e;margin-top:12px}.pb-bridge-return{display:inline-flex;margin:15px 0;padding:11px 15px;border-radius:12px;border:1px solid #dfe3f6;background:#f8f8ff;color:#414ab2;font-weight:800;text-decoration:none}@media(max-width:700px){.pb-bridge-grid{grid-template-columns:1fr}.pb-bridge{padding:15px}}';
    document.head.appendChild(style);
  }
  function linkBack(){
    if(!TOOLS.some(t=>t.url===current) || document.getElementById('pb-tool-panel-link'))return;
    css();
    const main=document.querySelector('main');if(!main)return;
    const link=document.createElement('a');link.id='pb-tool-panel-link';link.className='pb-bridge-return';link.href='/mi-panel/';
    link.textContent='← Volver a Mi panel y seguir mis trámites';
    const footer=document.querySelector('main .revision-sitio');
    if(footer)footer.insertAdjacentElement('beforebegin',link);
    else main.appendChild(link);
  }
  function init(){linkBack();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();