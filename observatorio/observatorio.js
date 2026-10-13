(function(){
  var data=Array.isArray(window.PAPELES_BEBE_OPORTUNIDADES)?window.PAPELES_BEBE_OPORTUNIDADES:[];
  var comunidades=['Andalucía','Aragón','Asturias','Islas Baleares','Canarias','Cantabria','Castilla-La Mancha','Castilla y León','Cataluña','Comunidad Valenciana','Extremadura','Galicia','Comunidad de Madrid','Región de Murcia','Navarra','País Vasco','La Rioja','Ceuta','Melilla'];
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function fmt(v){if(!v)return '—';var p=v.split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:v;}
  function daysLeft(v){if(!v)return null;var end=new Date(v+'T23:59:59');var now=new Date();return Math.ceil((end-now)/86400000);}
  function plazo(o){
    if(o.tipoPlazo==='fijo'){
      var d=daysLeft(o.fechaFin);
      if(d===null)return {label:'Fecha oficial',text:'Hasta '+fmt(o.fechaFin),cls:''};
      if(d<0)return {label:'Cerrada',text:'Finalizó el '+fmt(o.fechaFin),cls:'urgente'};
      if(d===0)return {label:'Último día',text:'Cierra hoy',cls:'urgente'};
      return {label:d<=14?'Cierra pronto':'Plazo abierto',text:'Cierra en '+d+' días · '+fmt(o.fechaFin),cls:d<=14?'urgente':(d<=45?'pronto':'')};
    }
    if(o.tipoPlazo==='personal')return {label:'Plazo individual',text:o.plazoTexto,cls:'pronto'};
    return {label:'Abierta',text:'Sin fecha general fija publicada en nuestra ficha',cls:''};
  }
  function territories(){var seen={};data.forEach(function(o){seen[o.territorio]=1;if(o.comunidad)seen[o.comunidad]=1;});return Object.keys(seen).sort();}
  function renderFilter(){var sel=document.getElementById('filtroTerritorio');if(!sel)return;territories().forEach(function(t){var op=document.createElement('option');op.value=t;op.textContent=t;sel.appendChild(op);});sel.addEventListener('change',function(){renderAlerts(sel.value);});}
  function renderAlerts(filter){var root=document.getElementById('alertasOportunidad');if(!root)return;var items=data.filter(function(o){return !filter||o.territorio===filter||o.comunidad===filter;});if(!items.length){root.innerHTML='<div class="obs-empty">No hay alertas verificadas para este territorio en el piloto actual. Preferimos no mostrar una alerta antes que inventar un plazo.</div>';return;}root.innerHTML=items.map(function(o){var p=plazo(o);return '<article class="obs-alert '+esc(p.cls)+'"><div class="obs-alert-top"><div><h3>'+esc(o.titulo)+'</h3><span class="obs-pill '+esc(p.cls)+'">'+esc(p.label)+'</span></div></div><p>'+esc(o.detalle)+'</p><div class="obs-meta"><span><strong>Importe:</strong> '+esc(o.importe)+'</span><span><strong>Plazo:</strong> '+esc(p.text)+'</span><span><strong>Revisada:</strong> '+esc(fmt(o.revisada))+'</span></div><div class="obs-actions"><a class="obs-btn" href="'+esc(o.url)+'">Ver ayuda →</a><a class="obs-btn ghost" href="'+esc(o.fuente)+'" target="_blank" rel="noopener noreferrer">Fuente oficial ↗</a></div></article>';}).join('');}
  function renderTable(){var root=document.getElementById('tablaComparativa');if(!root)return;root.innerHTML=data.map(function(o){var p=plazo(o);return '<tr><td><a href="'+esc(o.url)+'">'+esc(o.titulo)+'</a></td><td>'+esc(o.territorio)+'</td><td>'+esc(o.ambito)+'</td><td>'+esc(o.importe)+'</td><td>'+esc(p.text)+'</td><td>'+esc(fmt(o.revisada))+'</td></tr>';}).join('');}
  function renderMap(){var root=document.getElementById('mapaCobertura');if(!root)return;root.innerHTML=comunidades.map(function(c){var count=data.filter(function(o){return o.territorio===c||o.comunidad===c;}).length;return '<div class="obs-map-item"><strong>'+esc(c)+'</strong><small>'+(count?count+' oportunidad'+(count>1?'es':'')+' verificada'+(count>1?'s':'')+' en el piloto':'Guía territorial disponible · alertas en ampliación')+'</small></div>';}).join('');}
  function init(){renderFilter();renderAlerts('');renderTable();renderMap();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
