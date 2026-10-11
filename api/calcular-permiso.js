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
module.exports=function handler(req,res){
  var q=req.query||{};
  var fecha=parseDate(q.fecha);
  var tipo=q.tipo==='mono'?'mono':'general';
  var error='';
  if(!fecha) error='Introduce una fecha válida.';
  else {var hoy=new Date();hoy.setHours(23,59,59,999);if(fecha>hoy) error='La fecha no puede ser futura.';}
  var body='';
  if(error){body='<div class="tool-result show tool-result-error"><strong>'+esc(error)+'</strong></div>';}
  else {
    var mono=tipo==='mono',total=mono?32:19,ob=6,h12=mono?22:11,h8=mono?4:2;
    body='<div class="tool-result show"><strong class="big">'+total+' semanas</strong><p><b>'+ob+' semanas obligatorias</b> e ininterrumpidas desde el hecho causante. Fin orientativo: '+fmt(addDays(fecha,42))+'.</p><p><b>'+h12+' semanas</b> pueden distribuirse por semanas hasta que el menor cumpla 12 meses: '+fmt(addYears(fecha,1))+'.</p><p><b>'+h8+' semanas</b> adicionales pueden disfrutarse por semanas hasta los 8 años: '+fmt(addYears(fecha,8))+'.</p></div>';
  }
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.status(200).send('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resultado calculadora | Papeles del Bebé</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/herramientas/tools.css"></head><body class="tools-page"><header><div class="header-contenido"><a href="/" class="logo logo-enlace">Papeles del <span>Bebé</span></a></div></header><main class="tools-main"><section class="tools-hero"><span class="tool-kicker">RESULTADO</span><h1>Tu cálculo orientativo</h1></section><section class="tool-panel">'+body+'<div class="tool-actions"><a class="tool-cta" href="/herramientas/calculadora-permiso-nacimiento/">Cambiar datos</a><a class="tool-cta" href="/checklist/">Ver mis ayudas y trámites</a></div><div class="tool-note">Resultado orientativo. Confirma siempre tu caso en la Seguridad Social.</div></section></main></body></html>');
};