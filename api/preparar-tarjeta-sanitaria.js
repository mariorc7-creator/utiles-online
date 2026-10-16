function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}

var REGION={
  andalucia:{label:'Andalucía',guide:'/tarjeta-sanitaria-bebe-andalucia/',official:'https://www.juntadeandalucia.es/temas/salud/servicios/tarjeta.html'},
  aragon:{label:'Aragón',guide:'/tarjeta-sanitaria-bebe-aragon/',official:'https://www.saludinforma.es/'},
  asturias:{label:'Asturias',guide:'/tarjeta-sanitaria-bebe-asturias/',official:'https://www.astursalud.es/'},
  baleares:{label:'Illes Balears',guide:'/tarjeta-sanitaria-bebe-baleares/',official:'https://www.ibsalut.es/'},
  canarias:{label:'Canarias',guide:'/tarjeta-sanitaria-bebe-canarias/',official:'https://www3.gobiernodecanarias.org/sanidad/scs/'},
  cantabria:{label:'Cantabria',guide:'/tarjeta-sanitaria-bebe-cantabria/',official:'https://www.scsalud.es/'},
  castillalamancha:{label:'Castilla-La Mancha',guide:'/tarjeta-sanitaria-bebe-castilla-la-mancha/',official:'https://sanidad.castillalamancha.es/'},
  castillayleon:{label:'Castilla y León',guide:'/tarjeta-sanitaria-bebe-castilla-y-leon/',official:'https://www.saludcastillayleon.es/'},
  cataluna:{label:'Cataluña',guide:'/tarjeta-sanitaria-bebe-cataluna/',official:'https://catsalut.gencat.cat/ca/coneix-catsalut/acces-sistema-salut/la-tsi/obtencio-tsi/index.html'},
  valencia:{label:'Comunitat Valenciana',guide:'/tarjeta-sanitaria-bebe-comunitat-valenciana/',official:'https://www.san.gva.es/es/web/tarjeta-sanitaria'},
  extremadura:{label:'Extremadura',guide:'/tarjeta-sanitaria-bebe-extremadura/',official:'https://saludextremadura.ses.es/'},
  galicia:{label:'Galicia',guide:'/tarjeta-sanitaria-bebe-galicia/',official:'https://www.sergas.es/'},
  madrid:{label:'Comunidad de Madrid',guide:'/tarjeta-sanitaria-bebe-madrid/',official:'https://sede.comunidad.madrid/prestacion-social/tarjeta-sanitaria'},
  murcia:{label:'Región de Murcia',guide:'/tarjeta-sanitaria-bebe-murcia/',official:'https://www.murciasalud.es/'},
  navarra:{label:'Navarra',guide:'/tarjeta-sanitaria-bebe-navarra/',official:'https://portalsalud.navarra.es/'},
  paisvasco:{label:'País Vasco',guide:'/tarjeta-sanitaria-bebe-pais-vasco/',official:'https://www.euskadi.eus/'},
  larioja:{label:'La Rioja',guide:'/tarjeta-sanitaria-bebe-la-rioja/',official:'https://www.riojasalud.es/'},
  ceuta:{label:'Ceuta',guide:'/tarjeta-sanitaria-bebe/',official:'https://ingesa.sanidad.gob.es/'},
  melilla:{label:'Melilla',guide:'/tarjeta-sanitaria-bebe/',official:'https://ingesa.sanidad.gob.es/'}
};

function row(cls,title,text){return '<div class="ts-step '+cls+'"><div class="ts-step-icon">•</div><div><strong>'+esc(title)+'</strong><p>'+text+'</p></div></div>';}
function doc(title,text){return '<div class="ts-doc"><strong>'+esc(title)+'</strong><span>'+text+'</span></div>';}

module.exports=function handler(req,res){
  var q=req.query||{};
  var r=REGION[q.comunidad];
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  if(!r){
    res.status(200).send('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preparador tarjeta sanitaria | Papeles del Bebé</title><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/preparador-tarjeta-sanitaria/preparador.css?v=20261016-4"></head><body><main class="ts-main"><section class="ts-panel"><h1>Falta seleccionar la comunidad</h1><p>Vuelve al preparador y selecciona una comunidad autónoma.</p><div class="ts-actions"><a class="ts-btn" href="/preparador-tarjeta-sanitaria/">Volver al preparador</a></div></section></main></body></html>');
    return;
  }

  var cobertura=q.cobertura||'sns', registro=q.registro||'nose', inss=q.inss||'nose', padron=q.padron||'nose', canal=q.canal||'indiferente', digital=q.digital||'si', urgente=q.urgente||'no';
  var pasos=[], documentos=[], siguiente='';

  if(cobertura==='mutualidad'){
    pasos.push(row('warn','Cobertura por mutualidad','Confirma primero el alta del bebé en MUFACE, ISFAS o MUGEJU.'));
    siguiente='Confirma el alta sanitaria con tu mutualidad y después revisa la tarjeta sanitaria de '+r.label+'.';
  }else{
    if(registro==='no'){
      pasos.push(row('danger','Registro Civil pendiente','Completa primero la inscripción del nacimiento.'));
      siguiente='Completa primero la inscripción del nacimiento.';
    }else if(registro==='nose'){
      pasos.push(row('warn','Comprueba el Registro Civil','Asegúrate de que el nacimiento ya está inscrito.'));
    }else{
      pasos.push(row('ok','Registro Civil','Nacimiento inscrito: puedes continuar.'));
    }

    if(inss==='si'){
      pasos.push(row('ok','Derecho sanitario reconocido','El bebé ya tiene reconocido el derecho a asistencia sanitaria.'));
    }else if(inss==='no'){
      pasos.push(row('danger','Alta sanitaria pendiente','Da de alta al bebé como beneficiario antes de pedir la tarjeta autonómica.'));
      if(!siguiente) siguiente='Da de alta al bebé en asistencia sanitaria.';
    }else{
      pasos.push(row('warn','Comprueba el derecho sanitario','Confirma si el bebé ya figura con derecho a asistencia sanitaria para evitar duplicar trámites.'));
      if(!siguiente) siguiente='Comprueba el derecho a asistencia sanitaria.';
    }
  }

  if(padron==='si') pasos.push(row('ok','Empadronamiento','El bebé ya consta empadronado.'));
  else pasos.push(row('warn','Padrón o residencia','Revisa si '+esc(r.label)+' exige acreditación de residencia o padrón para la primera tarjeta.'));

  if(inss==='si'||cobertura==='mutualidad'){
    var txt='Revisa la guía territorial y la fuente sanitaria oficial para solicitar la primera tarjeta y confirmar centro de salud y pediatra.';
    if(q.comunidad==='madrid'&&canal==='online') txt='En Madrid revisa el aviso oficial sobre disponibilidad de la vía telemática y, si no está operativa, utiliza el centro de salud.';
    else if(canal==='online'&&digital==='no') txt='Prefieres hacerlo online, pero no tienes identificación digital. Comprueba si tu comunidad admite otra vía o utiliza el centro de salud.';
    else if(canal==='presencial') txt='Localiza el centro de salud correspondiente y lleva la documentación del bebé y del representante.';
    pasos.push(row('ok','Tarjeta sanitaria de '+r.label,txt));
    if(!siguiente) siguiente='Prepara ya la solicitud de la tarjeta sanitaria en '+r.label+'.';
  }else{
    pasos.push(row('skip','Tarjeta sanitaria autonómica','Déjala para después de confirmar el derecho a asistencia sanitaria, salvo indicación distinta de tu servicio de salud.'));
  }

  if(urgente==='si') pasos.push(row('warn','Atención antes de recibir la tarjeta','No esperes a la tarjeta física: contacta con el centro de salud para que te indiquen cómo identificar provisionalmente al recién nacido.'));

  documentos.push(doc('Nacimiento','Certificado o inscripción del nacimiento.'));
  documentos.push(doc('Representante','DNI/NIE del progenitor o tutor y, si procede, acreditación de representación.'));
  if(cobertura!=='mutualidad') documentos.push(doc('Asistencia sanitaria','Justificante o comprobación del derecho reconocido cuando se requiera.'));
  if(padron!=='si') documentos.push(doc('Residencia/padrón','Comprueba si '+esc(r.label)+' exige acreditación.'));

  var html='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Tu ruta de tarjeta sanitaria | Papeles del Bebé</title><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/preparador-tarjeta-sanitaria/preparador.css?v=20261016-4"></head><body><header><div class="header-contenido"><a href="/" class="logo logo-enlace">Papeles del <span>Bebé</span></a></div></header><main class="ts-main"><section class="ts-hero"><span class="ts-kicker">TU RESULTADO</span><h1>Qué hacer en '+esc(r.label)+'</h1><p>Ruta orientativa según las respuestas que acabas de dar.</p></section><section class="ts-panel"><div class="ts-steps">'+pasos.join('')+'</div><div class="ts-next"><strong>Siguiente paso recomendado</strong><br>'+esc(siguiente||'Revisa la guía territorial y la fuente oficial antes de presentar.')+'</div><h2 style="margin-top:24px">Documentos que conviene preparar</h2><div class="ts-docs">'+documentos.join('')+'</div><div class="ts-source-box"><strong>Fuentes para comprobar antes de presentar</strong><div class="ts-actions"><a class="ts-btn" href="https://prestaciones.seg-social.es/" target="_blank" rel="noopener">Seguridad Social / INSS ↗</a><a class="ts-btn secondary" href="'+esc(r.official)+'" target="_blank" rel="noopener">Fuente sanitaria autonómica ↗</a><a class="ts-btn secondary" href="'+esc(r.guide)+'">Guía de '+esc(r.label)+' →</a></div></div><div class="ts-actions"><a class="ts-btn secondary" href="/preparador-tarjeta-sanitaria/">← Cambiar respuestas</a></div><div class="ts-note warn"><strong>Importante:</strong> esta herramienta ordena el proceso, pero no sustituye la información del organismo competente. Confirma siempre la fuente oficial antes de presentar.</div></section></main><script src="/analytics.js" defer></script></body></html>';
  res.status(200).send(html);
};