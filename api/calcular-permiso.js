function parseDate(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value||'')) return null;
  var parts=value.split('-').map(Number);
  var d=new Date(parts[0],parts[1]-1,parts[2],12,0,0,0);
  if(d.getFullYear()!==parts[0]||d.getMonth()!==parts[1]-1||d.getDate()!==parts[2]) return null;
  return d;
}
function addDays(d,n){var x=new Date(d.getTime());x.setDate(x.getDate()+n);return x;}
function addYears(d,n){var x=new Date(d.getTime());x.setFullYear(x.getFullYear()+n);return x;}
function fmt(d){return new Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'long',year:'numeric'}).format(d);}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
function yes(v){return v==='1'||v==='true'||v==='on';}
module.exports=function handler(req,res){
  var q=req.query||{};
  var fecha=parseDate(q.fecha);
  var tipo=q.tipo==='mono'?'mono':'general';
  var objetivo=['entender','volver','guardar'].indexOf(q.objetivo)>=0?q.objetivo:'entender';
  var special={multiple:yes(q.multiple),discapacidad:yes(q.discapacidad),hospitalizacion:yes(q.hospitalizacion)};
  var error='';
  if(!fecha) error='Introduce una fecha válida.';
  else {var hoy=new Date();hoy.setHours(23,59,59,999);var max=addYears(hoy,2);if(fecha>max) error='Elige una fecha prevista dentro de los próximos dos años.';}

  var body='';
  if(error){body='<div class="tool-result show tool-result-error"><strong>'+esc(error)+'</strong></div>';}
  else {
    var provisional=fecha>new Date();
    var mono=tipo==='mono',total=mono?32:19,ob=6,h12=mono?22:11,h8=mono?4:2;
    var finInicial=addDays(fecha,42), limite12=addYears(fecha,1), limite8=addYears(fecha,8);
    var focus={
      entender:'Aquí tienes la estructura completa para entender qué parte es fija y qué parte puedes organizar.',
      volver:'Tu primera fecha útil de planificación es el final orientativo de las 6 semanas iniciales obligatorias.',
      guardar:'Lo importante en tu caso es distinguir las semanas iniciales de las que puedes reservar para más adelante.'
    }[objetivo];
    var alerts=[];
    if(special.multiple) alerts.push('Nacimiento múltiple');
    if(special.discapacidad) alerts.push('Discapacidad del menor');
    if(special.hospitalizacion) alerts.push('Hospitalización del recién nacido');
    if(provisional) alerts.push('Nacimiento aún no ocurrido: fechas provisionales');
    var alertHtml=alerts.length?'<div class="perm-alert"><strong>⚠ Revisión prioritaria antes de cerrar fechas</strong><p>Has marcado: '+alerts.map(esc).join(', ')+'. Estas circunstancias pueden modificar la duración o la forma de disfrute. No hemos añadido semanas automáticamente: compruébalo en Seguridad Social antes de tomar este plan como definitivo.</p></div>':'';
    var share='Permiso por nacimiento: '+total+' semanas en el escenario general de esta herramienta. 6 semanas iniciales obligatorias hasta aprox. '+fmt(finInicial)+'. '+h12+' semanas distribuibles hasta '+fmt(limite12)+' y '+h8+' semanas hasta '+fmt(limite8)+'. Papeles del Bebé.';
    body='<div class="perm-hero-result"><span>'+(provisional?'PREVISIÓN ANTES DEL PARTO':'MAPA DE TU PERMISO')+'</span><strong>'+total+' semanas</strong><p>'+esc(focus)+'</p></div>'+alertHtml+
    '<div class="perm-map">'+
      '<div class="perm-stage now"><span>1 · AL NACER</span><strong>'+ob+' semanas obligatorias</strong><p>Seis primeras semanas ininterrumpidas después del nacimiento, si se cumplen los requisitos de la prestación.</p><b>Fin orientativo: '+fmt(finInicial)+'</b></div>'+
      '<div class="perm-stage plan"><span>2 · PUEDES ORGANIZAR</span><strong>'+h12+' semanas</strong><p>Parte distribuible por semanas dentro del marco general aplicable.</p><b>Límite orientativo: '+fmt(limite12)+'</b></div>'+
      '<div class="perm-stage later"><span>3 · RESERVA A LARGO PLAZO</span><strong>'+h8+' semanas</strong><p>Parte adicional que puede disfrutarse por semanas más adelante.</p><b>Límite orientativo: '+fmt(limite8)+'</b></div>'+
    '</div>'+
    '<div class="perm-decisions"><h2>Tus 3 decisiones ahora</h2><ol><li><strong>Confirma tu duración definitiva</strong> si tienes alguna circunstancia especial.</li><li><strong>Decide qué semanas quieres concentrar</strong> durante el primer año y cuáles prefieres reservar.</li><li><strong>Coordínalo con empresa/Seguridad Social</strong> antes de convertir este mapa en un calendario cerrado.</li></ol></div>'+
    '<div class="perm-actions"><a class="tool-cta" href="https://prestaciones.seg-social.es/servicio/prestacion-nacimiento-adopcion-cuidado-menor" target="_blank" rel="noopener noreferrer">Comprobar en Seguridad Social ↗</a><a class="tool-cta secondary" href="/permiso-nacimiento-cuidado-menor/">Ver guía completa</a><button type="button" id="sharePermiso" data-share="'+esc(share)+'">Compartir mi mapa</button></div>';
  }
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.status(200).send('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tu plan de permiso | Papeles del Bebé</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/herramientas/tools.css"><style>.perm-hero-result{padding:20px;border-radius:20px;background:linear-gradient(135deg,#f1f2ff,#fff);border:1px solid #dfe1fb;margin-bottom:16px}.perm-hero-result span{display:block;font-size:.75rem;font-weight:900;color:#5960cf;letter-spacing:.06em}.perm-hero-result strong{display:block;font-size:2.4rem;color:#4147b6;margin:4px 0}.perm-hero-result p{margin:0;color:#606577}.perm-map{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:16px 0}.perm-stage{padding:16px;border-radius:16px;border:1px solid #e2e4ef;background:#fff}.perm-stage span{display:block;font-size:.7rem;font-weight:900;letter-spacing:.05em;color:#777}.perm-stage strong{display:block;font-size:1.25rem;margin:5px 0}.perm-stage p{color:#686d7c}.perm-stage b{font-size:.9rem}.perm-stage.now{border-color:#9ea5ff;background:#f8f8ff}.perm-stage.plan{border-color:#b9dfca;background:#f7fcf9}.perm-stage.later{border-color:#f1d59e;background:#fffaf1}.perm-alert{padding:15px 16px;border-radius:15px;background:#fff7e7;border:1px solid #f0d7a5;margin:14px 0}.perm-alert p{margin:5px 0 0}.perm-decisions{margin:20px 0}.perm-decisions li{margin:9px 0}.perm-actions{display:flex;gap:10px;flex-wrap:wrap}.perm-actions button,.tool-cta.secondary{border:1px solid #ccd0f2;background:#fff;color:#4f56c9;border-radius:12px;padding:11px 15px;font-weight:800;text-decoration:none;cursor:pointer}@media(max-width:760px){.perm-map{grid-template-columns:1fr}.perm-actions>*{width:100%;box-sizing:border-box;text-align:center}}</style></head><body class="tools-page"><header><div class="header-contenido"><a href="/" class="logo logo-enlace">Papeles del <span>Bebé</span></a></div></header><main class="tools-main"><section class="tools-hero"><span class="tool-kicker">TU PLAN</span><h1>Tu permiso explicado como una línea temporal</h1><p>Esto es un mapa de planificación, no una resolución administrativa.</p></section><section class="tool-panel">'+body+'<div class="tool-actions"><a class="tool-cta" href="/herramientas/calculadora-permiso-nacimiento/">Cambiar escenario</a><a class="tool-cta" href="/mi-panel/">Guardar el siguiente paso en mi panel</a></div><div class="tool-note">Resultado orientativo. Las fechas y ampliaciones definitivas dependen de tu supuesto y de la resolución de la Seguridad Social.</div></section></main><script>(function(){var b=document.getElementById("sharePermiso");if(!b)return;b.addEventListener("click",async function(){var t=b.dataset.share||"";try{if(navigator.share){await navigator.share({title:"Mi mapa de permiso",text:t,url:"https://www.papelesdelbebe.es/herramientas/calculadora-permiso-nacimiento/"});}else{await navigator.clipboard.writeText(t+" https://www.papelesdelbebe.es/herramientas/calculadora-permiso-nacimiento/");b.textContent="Copiado ✓";}}catch(e){}});})();</script><script src="/analytics.js" defer></script></body></html>');
};