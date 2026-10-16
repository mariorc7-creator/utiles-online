(()=>{
  const $=id=>document.getElementById(id);
  const STORE='pb_preparador_tarjeta_sanitaria_v2';
  const INSS='https://prestaciones.seg-social.es/';
  const INSS_CHECK='https://w6.seg-social.es/das/Inicio?ConsultarDerecho=Consultar+derecho+asistencia+sanitaria';
  const REGION={
    andalucia:{label:'Andalucía',guide:'/tarjeta-sanitaria-bebe-andalucia/',official:'https://www.juntadeandalucia.es/temas/salud/servicios/tarjeta.html'},aragon:{label:'Aragón',guide:'/tarjeta-sanitaria-bebe-aragon/',official:'https://www.saludinforma.es/'},asturias:{label:'Asturias',guide:'/tarjeta-sanitaria-bebe-asturias/',official:'https://www.astursalud.es/'},baleares:{label:'Illes Balears',guide:'/tarjeta-sanitaria-bebe-baleares/',official:'https://www.ibsalut.es/'},canarias:{label:'Canarias',guide:'/tarjeta-sanitaria-bebe-canarias/',official:'https://www3.gobiernodecanarias.org/sanidad/scs/'},cantabria:{label:'Cantabria',guide:'/tarjeta-sanitaria-bebe-cantabria/',official:'https://www.scsalud.es/'},castillalamancha:{label:'Castilla-La Mancha',guide:'/tarjeta-sanitaria-bebe-castilla-la-mancha/',official:'https://sanidad.castillalamancha.es/'},castillayleon:{label:'Castilla y León',guide:'/tarjeta-sanitaria-bebe-castilla-y-leon/',official:'https://www.saludcastillayleon.es/'},cataluna:{label:'Cataluña',guide:'/tarjeta-sanitaria-bebe-cataluna/',official:'https://catsalut.gencat.cat/ca/coneix-catsalut/acces-sistema-salut/la-tsi/obtencio-tsi/index.html'},valencia:{label:'Comunitat Valenciana',guide:'/tarjeta-sanitaria-bebe-comunitat-valenciana/',official:'https://www.san.gva.es/es/web/tarjeta-sanitaria'},extremadura:{label:'Extremadura',guide:'/tarjeta-sanitaria-bebe-extremadura/',official:'https://saludextremadura.ses.es/'},galicia:{label:'Galicia',guide:'/tarjeta-sanitaria-bebe-galicia/',official:'https://www.sergas.es/'},madrid:{label:'Comunidad de Madrid',guide:'/tarjeta-sanitaria-bebe-madrid/',official:'https://sede.comunidad.madrid/prestacion-social/tarjeta-sanitaria'},murcia:{label:'Región de Murcia',guide:'/tarjeta-sanitaria-bebe-murcia/',official:'https://www.murciasalud.es/web/atencion-usuarios-de-servicios-sanitario/tarjeta-sanitaria'},navarra:{label:'Navarra',guide:'/tarjeta-sanitaria-bebe-navarra/',official:'https://portalsalud.navarra.es/'},paisvasco:{label:'País Vasco',guide:'/tarjeta-sanitaria-bebe-pais-vasco/',official:'https://www.euskadi.eus/'},larioja:{label:'La Rioja',guide:'/tarjeta-sanitaria-bebe-la-rioja/',official:'https://www.riojasalud.es/'},ceuta:{label:'Ceuta',guide:'/tarjeta-sanitaria-bebe/',official:'https://ingesa.sanidad.gob.es/'},melilla:{label:'Melilla',guide:'/tarjeta-sanitaria-bebe/',official:'https://ingesa.sanidad.gob.es/'}
  };
  const ids=['comunidad','cobertura','registro','inss','padron','digital','canal','urgente'];
  const vals=()=>Object.fromEntries(ids.map(id=>[id,$(id)?.value||'']));
  function save(){try{localStorage.setItem(STORE,JSON.stringify(vals()));}catch(_){}}
  function restore(){try{const v=JSON.parse(localStorage.getItem(STORE)||'{}');ids.forEach(id=>{const el=$(id);if(el&&v[id]&&[...el.options].some(o=>o.value===v[id]))el.value=v[id];});}catch(_){}}
  const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const step=(type,icon,title,text)=>`<div class="ts-step ${type}"><div class="ts-step-icon">${icon}</div><div><strong>${title}</strong><p>${text}</p></div></div>`;
  function render(){
    const v=vals(),r=REGION[v.comunidad];save();
    if(!r){alert('Selecciona primero tu comunidad autónoma.');return;}
    const steps=[],docs=[];let next='';
    $('resultado').classList.remove('ts-hidden');$('regionNombre').textContent=r.label;$('guiaRegion').href=r.guide;$('fuenteRegion').href=r.official;
    if(v.cobertura==='mutualidad'){
      steps.push(step('warn','↪','Primero revisa tu mutualidad','Si la cobertura familiar depende de MUFACE, ISFAS o MUGEJU, confirma allí el alta sanitaria del bebé antes de seguir el circuito ordinario del INSS.'));
      next='Confirma el alta del bebé con tu mutualidad y después revisa la tarjeta sanitaria de '+r.label+'.';
    }else{
      if(v.registro==='no'){steps.push(step('danger','1','Primero, Registro Civil','Completa la inscripción del nacimiento antes de continuar.'));next='Completa la inscripción del nacimiento.';}
      else if(v.registro==='nose')steps.push(step('warn','1','Confirma el Registro Civil','Comprueba que el nacimiento ya está inscrito.'));
      else steps.push(step('ok','✓','Registro Civil','Nacimiento inscrito: puedes continuar.'));
      if(v.inss==='si')steps.push(step('ok','✓','Asistencia sanitaria reconocida','El bebé ya tiene reconocido el derecho a asistencia sanitaria.'));
      else if(v.inss==='no'){steps.push(step('danger','2','Alta sanitaria pendiente','Solicita la inclusión del bebé como beneficiario.'));if(v.registro!=='no')next='Da de alta al bebé en asistencia sanitaria.';}
      else{steps.push(step('warn','2','Comprueba primero el derecho','Consulta si el bebé ya figura con derecho a asistencia sanitaria para evitar duplicar trámites.'));if(v.registro!=='no')next='Comprueba el derecho a asistencia sanitaria.';}
    }
    if(v.padron==='si')steps.push(step('ok','✓','Empadronamiento','El bebé ya consta empadronado.'));
    else if(v.padron==='no')steps.push(step('warn','3','Empadronamiento pendiente','Revisa si '+esc(r.label)+' exige padrón o residencia para la primera tarjeta.'));
    else steps.push(step('warn','3','Revisa si necesitas padrón','La guía territorial indica si debes acreditarlo.'));
    if(v.inss==='si'||v.cobertura==='mutualidad'){
      let route='Revisa la guía de '+esc(r.label)+' para solicitar la primera tarjeta, confirmar centro de salud y asignación de pediatra.';
      if(v.comunidad==='madrid'&&v.canal==='online')route='En Madrid la solicitud telemática figura temporalmente suspendida; confirma el aviso oficial y prioriza actualmente la vía presencial.';
      else if(v.canal==='online'&&v.digital==='no')route='Has elegido online pero no dispones de identificación digital. Comprueba si existe una vía alternativa; si no, utiliza el centro de salud.';
      else if(v.canal==='presencial')route='Localiza el centro de salud correspondiente y lleva la documentación del bebé y del representante.';
      steps.push(step('ok','4','Tarjeta sanitaria de '+esc(r.label),route));if(!next)next='Prepara ya la solicitud de la tarjeta sanitaria en '+r.label+'.';
    }else steps.push(step('skip','4','Tarjeta sanitaria autonómica','Es mejor dejar este paso para después de confirmar el derecho a asistencia sanitaria.'));
    if(v.urgente==='si')steps.push(step('warn','!','Necesitas atención antes de recibir la tarjeta','No esperes a la tarjeta física. Contacta con tu centro de salud para que te indiquen la identificación provisional del recién nacido.'));
    docs.push(['Nacimiento','Certificado o inscripción del nacimiento.'],['Representante','DNI/NIE del progenitor o tutor y, si procede, acreditación de representación.']);
    if(v.cobertura!=='mutualidad')docs.push(['Asistencia sanitaria','Justificante o comprobación del derecho reconocido cuando se requiera.']);
    if(v.padron!=='si')docs.push(['Residencia/padrón','Comprueba si '+r.label+' exige padrón o residencia.']);
    docs.push(['Datos de contacto','Teléfono y correo que quieras facilitar al servicio de salud.']);
    $('pasos').innerHTML=steps.join('');$('siguiente').textContent=next||'Revisa la guía territorial y la fuente oficial antes de presentar.';$('documentos').innerHTML=docs.map(([a,b])=>`<div class="ts-doc"><strong>${a}</strong><span>${b}</span></div>`).join('');$('inssAlta').href=INSS;$('inssComprobar').href=INSS_CHECK;$('resultado').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function reset(){try{localStorage.removeItem(STORE);}catch(_){}$('formTs')?.reset();$('resultado')?.classList.add('ts-hidden');}
  function init(){restore();const btn=$('resolver');if(btn){btn.onclick=render;}const resetBtn=$('reiniciar');if(resetBtn){resetBtn.onclick=reset;}ids.forEach(id=>$(id)?.addEventListener('change',save));window.__PB_TS_READY=true;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();