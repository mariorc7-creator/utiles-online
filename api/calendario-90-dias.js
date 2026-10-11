function parseDate(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value||'')) return null;
  var p=value.split('-').map(Number);
  var d=new Date(p[0],p[1]-1,p[2],12,0,0,0);
  if(d.getFullYear()!==p[0]||d.getMonth()!==p[1]-1||d.getDate()!==p[2]) return null;
  return d;
}
function addDays(d,n){var x=new Date(d.getTime());x.setDate(x.getDate()+n);return x;}
function fmt(d){return new Intl.DateTimeFormat('es-ES',{day:'2-digit',month:'long',year:'numeric'}).format(d);}
function item(t,d,txt){return '<div class="timeline-item"><strong>'+t+' · '+fmt(d)+'</strong><span>'+txt+'</span></div>';}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
module.exports=function handler(req,res){
  var fecha=parseDate((req.query||{}).fecha);
  var error='';
  if(!fecha) error='Introduce una fecha válida.';
  else {var hoy=new Date();hoy.setHours(23,59,59,999);if(fecha>hoy) error='La fecha no puede ser futura.';}
  var body='';
  if(error){body='<div class="tool-result show tool-result-error"><strong>'+esc(error)+'</strong></div>';}
  else {
    body='<div class="tool-result show"><div class="timeline">'+
      item('Primeros días',addDays(fecha,2),'Revisa inscripción/Registro Civil, alta del bebé en Seguridad Social y tarjeta sanitaria según tu situación.')+
      item('Primera semana',addDays(fecha,7),'Comprueba qué trámites siguen pendientes y guarda justificantes y resoluciones.')+
      item('Primer mes',addDays(fecha,30),'Revisa ayudas estatales, autonómicas y municipales y comprueba si alguna convocatoria tiene plazo propio.')+
      item('Dos meses',addDays(fecha,60),'Comprueba el estado de solicitudes, posibles requerimientos y deducciones fiscales aplicables.')+
      item('90 días',addDays(fecha,90),'Haz una revisión final de expedientes abiertos y actualiza tus ayudas y trámites pendientes.')+
      '</div></div>';
  }
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.status(200).send('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tu calendario de 90 días | Papeles del Bebé</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/herramientas/tools.css"></head><body class="tools-page"><header><div class="header-contenido"><a href="/" class="logo logo-enlace">Papeles del <span>Bebé</span></a></div></header><main class="tools-main"><section class="tools-hero"><span class="tool-kicker">HOJA DE RUTA</span><h1>Tu calendario de los primeros 90 días</h1></section><section class="tool-panel">'+body+'<div class="tool-actions"><a class="tool-cta" href="/herramientas/calendario-primeros-90-dias/">Cambiar fecha</a><a class="tool-cta" href="/checklist/">Ver mis ayudas y trámites</a></div><div class="tool-note">Este calendario organiza tareas; no fija plazos legales.</div></section></main></body></html>');
};