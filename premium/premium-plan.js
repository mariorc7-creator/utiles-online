(function(){
  var KEY='tramitesFacilesRespuestas';
  var SAMPLE={comunidad:'Cataluña',fechaNacimiento:'2026-10-01',situacionLaboral:'asalariado',monoparental:false,nacimientoMultiple:false,discapacidadProgenitor:false};
  var COMUNIDADES={
    'Andalucía':'/comunidades/andalucia/','Aragón':'/comunidades/aragon/','Asturias':'/comunidades/asturias/','Islas Baleares':'/comunidades/islas-baleares/','Canarias':'/comunidades/canarias/','Cantabria':'/comunidades/cantabria/','Castilla-La Mancha':'/comunidades/castilla-la-mancha/','Castilla y León':'/comunidades/castilla-y-leon/','Cataluña':'/comunidades/cataluna/','Comunidad Valenciana':'/comunidades/comunidad-valenciana/','Extremadura':'/comunidades/extremadura/','Galicia':'/comunidades/galicia/','Comunidad de Madrid':'/comunidades/comunidad-de-madrid/','Región de Murcia':'/comunidades/region-de-murcia/','Navarra':'/comunidades/navarra/','País Vasco':'/comunidades/pais-vasco/','La Rioja':'/comunidades/la-rioja/','Ceuta':'/comunidades/ceuta/','Melilla':'/comunidades/melilla/'
  };
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function read(){try{var d=JSON.parse(localStorage.getItem(KEY));return d&&typeof d==='object'?d:null;}catch(e){return null;}}
  function complete(d){return !!(d&&d.comunidad&&d.fechaNacimiento&&d.situacionLaboral&&d.monoparental!==null&&d.nacimientoMultiple!==null&&d.discapacidadProgenitor!==null);}
  function fmtDate(v){if(!v)return 'Sin fecha';var p=v.split('-');if(p.length!==3)return v;return p[2]+'/'+p[1]+'/'+p[0];}
  function addDays(v,n){var d=new Date(v+'T12:00:00');if(isNaN(d.getTime()))return '';d.setDate(d.getDate()+n);return d.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'numeric'});}
  function labor(v){return {asalariado:'Por cuenta ajena',autonomo:'Autónomo/a',desempleado:'Desempleo',no_trabajo:'Actualmente no trabaja'}[v]||v||'Sin indicar';}
  function bool(v){return v===true?'Sí':'No';}
  function task(title,desc,href,prio){return {title:title,desc:desc,href:href||'',prio:prio||'Revisar'};}
  function tasks(d){
    var a=[];
    a.push(task('Registro del nacimiento','Comprueba que la inscripción del nacimiento esté realizada y conserva el justificante o los datos registrales.','/registro-civil-bebe/','Alta'));
    a.push(task('Alta del bebé en Seguridad Social','Revisa el alta como beneficiario y los datos necesarios para acceder a asistencia sanitaria.','/alta-bebe-seguridad-social/','Alta'));
    a.push(task('Empadronamiento del bebé','Comprueba el alta en el padrón municipal y conserva el volante o certificado cuando lo necesites.','/empadronar-bebe/','Alta'));
    a.push(task('Tarjeta sanitaria del bebé','Comprueba la asignación sanitaria y la tarjeta del bebé según tu servicio autonómico de salud.','/tarjeta-sanitaria-bebe/','Alta'));
    if(d.situacionLaboral==='asalariado'||d.situacionLaboral==='autonomo'||d.situacionLaboral==='desempleado') a.push(task('Prestación por nacimiento y cuidado','Revisa tu situación de cotización, documentación y solicitud ante la Seguridad Social.','/permiso-nacimiento-cuidado-menor-2026/','Alta'));
    a.push(task('Deducción por maternidad y fiscalidad familiar','Comprueba si encajas en la deducción por maternidad y otras deducciones aplicables a tu caso.','/deduccion-maternidad/','Revisar'));
    if(COMUNIDADES[d.comunidad]) a.push(task('Ayudas de '+d.comunidad,'Consulta la guía territorial y valida renta, residencia, convocatoria y plazo en la fuente oficial.',COMUNIDADES[d.comunidad],'Revisar'));
    if(d.monoparental===true) a.push(task('Beneficios por familia monoparental','Revisa título/acreditación, deducciones y ayudas específicas de tu comunidad.','/familias-monoparentales-ayudas-2026/','Revisar'));
    if(d.nacimientoMultiple===true) a.push(task('Ayudas por nacimiento múltiple','Comprueba prestaciones y apoyos específicos por parto o adopción múltiple.','/parto-multiple-prestacion-seguridad-social/','Revisar'));
    if(d.discapacidadProgenitor===true) a.push(task('Ayudas vinculadas a discapacidad','Comprueba beneficios específicos cuando existe discapacidad reconocida en progenitores o unidad familiar.','/ayudas-nacimiento/','Revisar'));
    return a;
  }
  function docs(d){
    var a=['DNI/NIE de los progenitores o tutores','Datos de nacimiento e inscripción registral','Número de Seguridad Social y datos de afiliación cuando correspondan','Cuenta bancaria para prestaciones o devoluciones','Datos de domicilio y empadronamiento'];
    if(d.situacionLaboral==='asalariado')a.push('Datos laborales y, cuando proceda, certificado de empresa');
    if(d.situacionLaboral==='autonomo')a.push('Datos de alta y cotización como autónomo/a');
    if(d.monoparental===true)a.push('Acreditación de familia monoparental cuando la administración la exija');
    if(d.discapacidadProgenitor===true)a.push('Resolución o certificado de discapacidad reconocido');
    return a;
  }
  function timeline(d){return [
    {when:'Ahora',title:'Cerrar los trámites básicos',text:'Registro, Seguridad Social, padrón y tarjeta sanitaria.'},
    {when:'Primeros 7 días de tu plan',title:'Revisar prestaciones prioritarias',text:'Comprueba la prestación por nacimiento y las ayudas que puedan tener plazo corto.'},
    {when:addDays(d.fechaNacimiento,30)||'Primer mes',title:'Revisar ayudas y fiscalidad',text:'Valida deducciones y ayudas autonómicas con sus requisitos oficiales.'},
    {when:addDays(d.fechaNacimiento,90)||'Primeros 90 días',title:'Repaso final',text:'Confirma que no queda ninguna solicitud pendiente y guarda justificantes.'}
  ];}
  function profileHTML(d){return '<div class="premium-profile"><span class="premium-chip">'+esc(d.comunidad)+'</span><span class="premium-chip">Nacimiento: '+esc(fmtDate(d.fechaNacimiento))+'</span><span class="premium-chip">'+esc(labor(d.situacionLaboral))+'</span><span class="premium-chip">Monoparental: '+bool(d.monoparental)+'</span><span class="premium-chip">Múltiple: '+bool(d.nacimientoMultiple)+'</span><span class="premium-chip">Discapacidad: '+bool(d.discapacidadProgenitor)+'</span></div>';}
  function render(d,isDemo,isTemporal){
    var root=document.getElementById('premiumPlan'); if(!root)return;
    var ts=tasks(d), ds=docs(d), tl=timeline(d);
    var taskHtml=ts.map(function(t){return '<article class="premium-task"><div class="premium-task-top"><div><h3>'+esc(t.title)+'</h3><p>'+esc(t.desc)+'</p></div><span class="premium-priority '+(t.prio==='Alta'?'alta':'')+'">'+esc(t.prio)+'</span></div>'+(t.href?'<div class="premium-toolbar"><a class="premium-btn ghost" href="'+esc(t.href)+'">Abrir guía →</a></div>':'')+'</article>';}).join('');
    var docHtml=ds.map(function(x){return '<li>'+esc(x)+'</li>';}).join('');
    var timeHtml=tl.map(function(x){return '<article class="premium-task"><div class="premium-task-top"><div><h3>'+esc(x.title)+'</h3><p>'+esc(x.text)+'</p></div><span class="premium-priority">'+esc(x.when)+'</span></div></article>';}).join('');
    var badge='PLAN PREMIUM';
    if(isDemo) badge+=' · QA'; else if(isTemporal) badge+=' · GRATIS TEMPORALMENTE';
    root.innerHTML='<section class="premium-hero"><div class="premium-plan-header"><div><span class="premium-badge">'+badge+'</span><h1>Tu plan personalizado</h1><p class="premium-subtitle">Ordenado con tus respuestas para que sepas qué revisar primero y qué documentación preparar.</p></div></div>'+profileHTML(d)+'<div class="premium-toolbar no-print"><button class="premium-btn" type="button" id="printPlan">Guardar / imprimir PDF</button><button class="premium-btn secondary" type="button" id="askIA">Explicarlo con PapelesIA</button><a class="premium-btn ghost" href="/checklist/">Actualizar mis respuestas</a></div><div class="premium-plan-grid"><section><div class="premium-section"><h2>Prioridades</h2><div class="premium-list">'+taskHtml+'</div></div><div class="premium-section"><h2>Calendario orientativo</h2><div class="premium-list">'+timeHtml+'</div></div></section><aside><div class="premium-card"><strong>📄 Documentos a preparar</strong><ul class="premium-docs">'+docHtml+'</ul></div><div class="premium-card premium-section"><strong>🏛️ Regla de seguridad</strong><p>Este plan organiza tu caso, pero no sustituye la resolución oficial. Comprueba requisitos, importes y plazos en la fuente enlazada antes de solicitar.</p></div></aside></div><div class="premium-note">'+(isTemporal?'Acceso gratuito temporal. No se ha realizado ningún cobro. ':'')+'Las fechas de este plan son hitos de organización, no plazos legales universales. Algunas ayudas tienen convocatorias y fechas propias.</div></section>';
    var p=document.getElementById('printPlan'); if(p)p.onclick=function(){window.print();};
    var ia=document.getElementById('askIA'); if(ia)ia.onclick=function(){var text='Explícame y prioriza este plan sin inventar elegibilidad. Comunidad: '+d.comunidad+'. Situación laboral: '+labor(d.situacionLaboral)+'. Monoparental: '+bool(d.monoparental)+'. Nacimiento múltiple: '+bool(d.nacimientoMultiple)+'. Discapacidad progenitor: '+bool(d.discapacidadProgenitor)+'.'; if(window.PapelesIA&&window.PapelesIA.prefill)window.PapelesIA.prefill(text,true);};
  }
  function showQaEmpty(){var root=document.getElementById('premiumPlan');if(!root)return;root.innerHTML='<section class="premium-hero"><span class="premium-badge">PLAN PREMIUM · QA</span><h1>Necesito tus respuestas para personalizarlo</h1><p class="premium-subtitle">Completa tus ayudas y trámites o carga un ejemplo interno para probar el generador.</p><div class="premium-actions"><a class="premium-btn" href="/checklist/?empezar=1">Completar mis respuestas</a><button class="premium-btn secondary" type="button" id="demoPlan">Cargar ejemplo QA</button></div></section>';var b=document.getElementById('demoPlan');if(b)b.onclick=function(){render(SAMPLE,true,false);};}
  function showTemporalEmpty(){var root=document.getElementById('premiumPlan');if(!root)return;root.innerHTML='<section class="premium-hero"><span class="premium-badge">PLAN PREMIUM · GRATIS TEMPORALMENTE</span><h1>Completa 6 respuestas para crear tu plan</h1><p class="premium-subtitle">Durante esta fase puedes usar Premium gratis y sin tarjeta.</p><div class="premium-actions"><a class="premium-btn" href="/checklist/?empezar=1&origen=premium">Completar mis respuestas →</a></div></section>';}
  function showLocked(){var root=document.getElementById('premiumPlan');if(!root)return;root.innerHTML='<section class="premium-hero"><span class="premium-badge">PLAN PREMIUM</span><h1>Accede desde la página Premium</h1><p class="premium-subtitle">El acceso gratuito temporal está disponible desde la página Premium para usuarios con sus respuestas preparadas.</p><div class="premium-actions"><a class="premium-btn" href="/premium/">Ir a Premium →</a></div></section>';}
  function init(){
    var params=new URLSearchParams(location.search);
    var qa=params.get('modo')==='qa';
    var temporal=params.get('acceso')==='temporal';
    var d=read();
    if(qa){if(complete(d))render(d,false,false);else showQaEmpty();return;}
    if(temporal){if(complete(d))render(d,false,true);else showTemporalEmpty();return;}
    showLocked();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
