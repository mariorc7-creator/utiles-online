(function(){
  var data=Array.isArray(window.PAPELES_BEBE_OPORTUNIDADES)?window.PAPELES_BEBE_OPORTUNIDADES:[];
  var comunidades=['Andalucía','Aragón','Asturias','Islas Baleares','Canarias','Cantabria','Castilla-La Mancha','Castilla y León','Cataluña','Comunidad Valenciana','Extremadura','Galicia','Comunidad de Madrid','Región de Murcia','Navarra','País Vasco','La Rioja','Ceuta','Melilla'];
  var comunidadUrl={
    'Andalucía':'/comunidades/andalucia/','Aragón':'/comunidades/aragon/','Asturias':'/comunidades/asturias/','Islas Baleares':'/comunidades/islas-baleares/','Canarias':'/comunidades/canarias/','Cantabria':'/comunidades/cantabria/','Castilla-La Mancha':'/comunidades/castilla-la-mancha/','Castilla y León':'/comunidades/castilla-y-leon/','Cataluña':'/comunidades/cataluna/','Comunidad Valenciana':'/comunidades/comunidad-valenciana/','Extremadura':'/comunidades/extremadura/','Galicia':'/comunidades/galicia/','Comunidad de Madrid':'/comunidades/comunidad-de-madrid/','Región de Murcia':'/comunidades/region-de-murcia/','Navarra':'/comunidades/navarra/','País Vasco':'/comunidades/pais-vasco/','La Rioja':'/comunidades/la-rioja/','Ceuta':'/comunidades/ceuta/','Melilla':'/comunidades/melilla/'
  };
  var provinciaComunidad={
    'ES-A':'Comunidad Valenciana','ES-AB':'Castilla-La Mancha','ES-AL':'Andalucía','ES-AV':'Castilla y León','ES-B':'Cataluña','ES-BA':'Extremadura','ES-BI':'País Vasco','ES-BU':'Castilla y León','ES-C':'Galicia','ES-CA':'Andalucía','ES-CC':'Extremadura','ES-CE':'Ceuta','ES-CO':'Andalucía','ES-CR':'Castilla-La Mancha','ES-CS':'Comunidad Valenciana','ES-CU':'Castilla-La Mancha','ES-GC':'Canarias','ES-GI':'Cataluña','ES-GR':'Andalucía','ES-GU':'Castilla-La Mancha','ES-H':'Andalucía','ES-HU':'Aragón','ES-J':'Andalucía','ES-L':'Cataluña','ES-LE':'Castilla y León','ES-LO':'La Rioja','ES-LU':'Galicia','ES-M':'Comunidad de Madrid','ES-MA':'Andalucía','ES-ML':'Melilla','ES-MU':'Región de Murcia','ES-NA':'Navarra','ES-O':'Asturias','ES-OR':'Galicia','ES-P':'Castilla y León','ES-PM':'Islas Baleares','ES-PO':'Galicia','ES-S':'Cantabria','ES-SA':'Castilla y León','ES-SE':'Andalucía','ES-SG':'Castilla y León','ES-SO':'Castilla y León','ES-SS':'País Vasco','ES-T':'Cataluña','ES-TE':'Aragón','ES-TF':'Canarias','ES-TO':'Castilla-La Mancha','ES-V':'Comunidad Valenciana','ES-VA':'Castilla y León','ES-VI':'País Vasco','ES-Z':'Aragón','ES-ZA':'Castilla y León'
  };
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];});}
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
  function countFor(c){return data.filter(function(o){return o.territorio===c||o.comunidad===c;}).length;}
  function territories(){var seen={};comunidades.forEach(function(c){seen[c]=1;});data.forEach(function(o){seen[o.territorio]=1;if(o.comunidad)seen[o.comunidad]=1;});return Object.keys(seen).sort();}
  function renderFilter(){var sel=document.getElementById('filtroTerritorio');if(!sel)return;territories().forEach(function(t){var op=document.createElement('option');op.value=t;op.textContent=t;sel.appendChild(op);});sel.addEventListener('change',function(){renderAlerts(sel.value);syncMapSelection(sel.value);});}
  function renderAlerts(filter){var root=document.getElementById('alertasOportunidad');if(!root)return;var items=data.filter(function(o){return !filter||o.territorio===filter||o.comunidad===filter;});if(!items.length){root.innerHTML='<div class="obs-empty">No hay alertas verificadas para este territorio en el piloto actual. Preferimos no mostrar una alerta antes que inventar un plazo.</div>';return;}root.innerHTML=items.map(function(o){var p=plazo(o);return '<article class="obs-alert '+esc(p.cls)+'"><div class="obs-alert-top"><div><h3>'+esc(o.titulo)+'</h3><span class="obs-pill '+esc(p.cls)+'">'+esc(p.label)+'</span></div></div><p>'+esc(o.detalle)+'</p><div class="obs-meta"><span><strong>Importe:</strong> '+esc(o.importe)+'</span><span><strong>Plazo:</strong> '+esc(p.text)+'</span><span><strong>Revisada:</strong> '+esc(fmt(o.revisada))+'</span></div><div class="obs-actions"><a class="obs-btn" href="'+esc(o.url)+'">Ver ayuda →</a><a class="obs-btn ghost" href="'+esc(o.fuente)+'" target="_blank" rel="noopener noreferrer">Fuente oficial ↗</a></div></article>';}).join('');}
  function renderTable(){var root=document.getElementById('tablaComparativa');if(!root)return;root.innerHTML=data.map(function(o){var p=plazo(o);return '<tr><td><a href="'+esc(o.url)+'">'+esc(o.titulo)+'</a></td><td>'+esc(o.territorio)+'</td><td>'+esc(o.ambito)+'</td><td>'+esc(o.importe)+'</td><td>'+esc(p.text)+'</td><td>'+esc(fmt(o.revisada))+'</td></tr>';}).join('');}
  function setDetail(c){var root=document.getElementById('mapaDetalle');if(!root)return;var count=countFor(c);root.innerHTML='<span class="obs-kicker">'+(count?'OPORTUNIDADES VERIFICADAS':'COBERTURA TERRITORIAL')+'</span><h3>'+esc(c)+'</h3><p>'+(count?'<strong>'+count+' oportunidad'+(count>1?'es':'')+' verificada'+(count>1?'s':'')+'</strong> disponible'+(count>1?'s':'')+' ahora mismo en el Observatorio. Al seleccionar este territorio también filtramos las alertas superiores.':'La guía territorial ya está disponible. Estamos ampliando el Observatorio con ayudas que tengan estado y plazo verificados.')+'</p><div class="obs-map-detail-actions"><button type="button" class="obs-btn" id="verAlertasMapa">Ver alertas</button><a class="obs-btn ghost" href="'+esc(comunidadUrl[c]||'/comunidades/')+'">Abrir guía territorial →</a></div>';
    var b=document.getElementById('verAlertasMapa');if(b)b.addEventListener('click',function(){var alerts=document.getElementById('alertas-titulo');if(alerts)alerts.scrollIntoView({behavior:'smooth',block:'start'});});
  }
  function syncMapSelection(c){document.querySelectorAll('#mapaEspana g[data-comunidad]').forEach(function(g){g.classList.toggle('selected',!!c&&g.getAttribute('data-comunidad')===c);});if(c)setDetail(c);}
  function selectTerritory(c){var sel=document.getElementById('filtroTerritorio');if(sel){sel.value=c;renderAlerts(c);}syncMapSelection(c);setDetail(c);}
  function fallbackMap(msg){var root=document.getElementById('mapaEspana');if(!root)return;root.innerHTML='<div class="obs-map-fallback"><strong>No hemos podido cargar el mapa ahora mismo.</strong><span>'+esc(msg||'Puedes seguir usando el selector de territorio de arriba.')+'</span></div>';}
  function fitSvgToMap(svg){
    try{
      var nodes=svg.querySelectorAll('g[data-comunidad]');
      var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,found=false;
      nodes.forEach(function(g){
        var b=g.getBBox();
        if(!b||(!b.width&&!b.height))return;
        minX=Math.min(minX,b.x);minY=Math.min(minY,b.y);maxX=Math.max(maxX,b.x+b.width);maxY=Math.max(maxY,b.y+b.height);found=true;
      });
      if(!found)return;
      var w=maxX-minX,h=maxY-minY;
      var padX=Math.max(12,w*.035),padY=Math.max(12,h*.055);
      svg.setAttribute('viewBox',(minX-padX)+' '+(minY-padY)+' '+(w+padX*2)+' '+(h+padY*2));
    }catch(e){}
  }
  function decorateSvg(svg){
    svg.removeAttribute('width');svg.removeAttribute('height');svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.classList.add('obs-map-svg');
    svg.querySelectorAll('text').forEach(function(t){t.remove();});
    Object.keys(provinciaComunidad).forEach(function(id){var g=svg.querySelector('#'+CSS.escape(id));if(!g)return;var c=provinciaComunidad[id];g.setAttribute('data-comunidad',c);g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',c);if(countFor(c))g.classList.add('has-opportunity');
      g.addEventListener('mouseenter',function(){svg.querySelectorAll('g[data-comunidad="'+c.replace(/"/g,'&quot;')+'"]').forEach(function(x){x.classList.add('hovered');});setDetail(c);});
      g.addEventListener('mouseleave',function(){svg.querySelectorAll('g[data-comunidad]').forEach(function(x){x.classList.remove('hovered');});var selected=svg.querySelector('g.selected');if(selected)setDetail(selected.getAttribute('data-comunidad'));});
      g.addEventListener('click',function(){selectTerritory(c);});
      g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectTerritory(c);}});
    });
    requestAnimationFrame(function(){fitSvgToMap(svg);});
  }
  function renderMap(){var root=document.getElementById('mapaEspana');if(!root)return;fetch('https://raw.githubusercontent.com/jboekesteijn/provinces-of-spain/master/Provinces_of_Spain.svg').then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(function(txt){var doc=new DOMParser().parseFromString(txt,'image/svg+xml');var svg=doc.documentElement;if(!svg||svg.nodeName.toLowerCase()!=='svg')throw new Error('SVG no válido');root.innerHTML='';root.appendChild(document.importNode(svg,true));decorateSvg(root.querySelector('svg'));}).catch(function(){fallbackMap('El resto del Observatorio sigue funcionando con normalidad.');});}
  function init(){renderFilter();renderAlerts('');renderTable();renderMap();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
