(()=>{
  const $=id=>document.getElementById(id);
  const STORE='pb_preparador_tarjeta_sanitaria_v1';
  const INSS='https://prestaciones.seg-social.es/';
  const INSS_CHECK='https://w6.seg-social.es/das/Inicio?ConsultarDerecho=Consultar+derecho+asistencia+sanitaria';
  const REGION={
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
    murcia:{label:'Región de Murcia',guide:'/tarjeta-sanitaria-bebe-murcia/',official:'https://www.murciasalud.es/web/atencion-usuarios-de-servicios-sanitario/tarjeta-sanitaria'},
    navarra:{label:'Navarra',guide:'/tarjeta-sanitaria-bebe-navarra/',official:'https://portalsalud.navarra.es/'},
    paisvasco:{label:'País Vasco',guide:'/tarjeta-sanitaria-bebe-pais-vasco/',official:'https://www.euskadi.eus/'},
    larioja:{label:'La Rioja',guide:'/tarjeta-sanitaria-bebe-la-rioja/',official:'https://www.riojasalud.es/'},
    ceuta:{label:'Ceuta',guide:'/tarjeta-sanitaria-bebe/',official:'https://ingesa.sanidad.gob.es/'},
    melilla:{label:'Melilla',guide:'/tarjeta-sanitaria-bebe/',official:'https://ingesa.sanidad.gob.es/'}
  };
  const ids=['comunidad','cobertura','registro','inss','padron','digital','canal','urgente'];
  const vals=()=>Object.fromEntries(ids.map(id=>[id,$(id)?.value||'']));
  function save(){try{localStorage.setItem(STORE,JSON.stringify(vals()));}catch(_){}}
  function restore(){try{const v=JSON.parse(localStorage.getItem(STORE)||'{}');ids.forEach(id=>{const el=$(id);if(el&&v[id]&&[...el.options].some(o=>o.value===v[id]))el.value=v[id];});}catch(_){}}
  function step(type,icon,title,text){return `<div class="ts-step ${type}"><div class="ts-step-icon">${icon}</div><div><strong>${title}</strong><p>${text}</p></div></div>`;}
  function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function render(){
    const v=vals(); save();
    const r=REGION[v.comunidad];
    if(!r){$('resultado').classList.add('ts-hidden');return;}
    const steps=[]; const docs=[]; let next='';
    $('resultado').classList.remove('ts-hidden');
    $('regionNombre').textContent=r.label;
    $('guiaRegion').href=r.guide; $('fuenteRegion').href=r.official;

    if(v.cobertura==='mutualidad'){
      steps.push(step('warn','↪','Tu vía no es la estándar del INSS','Si el progenitor que da cobertura pertenece a MUFACE, ISFAS o MUGEJU, la asistencia sanitaria del bebé se gestiona por la mutualidad correspondiente. No sigas el flujo ordinario como beneficiario del INSS sin comprobar antes tu mutualidad.'));
      next='Primero: tramita o confirma el alta sanitaria del bebé con tu mutualidad. Después revisa cómo se emite la tarjeta o identificación sanitaria en '+r.label+'.';
    } else {
      if(v.registro==='no'){
        steps.push(step('danger','1','Primero, Registro Civil','Antes de solicitar el reconocimiento sanitario del bebé, completa la inscripción del nacimiento en el Registro Civil.'));
        next='Tu siguiente paso es cerrar la inscripción del nacimiento. Después vuelve aquí para continuar con asistencia sanitaria y tarjeta.';
      } else if(v.registro==='nose'){
        steps.push(step('warn','1','Confirma que el nacimiento ya consta','Comprueba que la inscripción del nacimiento está completada antes de iniciar el alta sanitaria.'));
      } else {
        steps.push(step('ok','✓','Registro Civil','Indicas que el nacimiento ya está inscrito. Puedes continuar con el reconocimiento sanitario.'));
      }

      if(v.inss==='si'){
        steps.push(step('ok','✓','Derecho a asistencia sanitaria','Indicas que el bebé ya tiene reconocido el derecho a asistencia sanitaria. El siguiente bloque es la tarjeta sanitaria autonómica.'));
      } else if(v.inss==='no'){
        steps.push(step('danger','2','Da de alta al bebé en asistencia sanitaria','Solicita la inclusión del bebé como beneficiario del titular que corresponda. La Seguridad Social permite gestionar beneficiarios online y comprobar después el derecho reconocido.'));
        if(v.registro!=='no') next='Tu siguiente paso es el alta del bebé en asistencia sanitaria. Cuando conste reconocida, pasa a la tarjeta de '+r.label+'.';
      } else {
        steps.push(step('warn','2','Comprueba el derecho antes de repetir trámites','Si no sabes si el bebé ya figura como beneficiario, consulta primero el derecho a asistencia sanitaria. Evitarás iniciar un alta duplicada.'));
        if(v.registro!=='no') next='Comprueba ahora si el bebé ya tiene reconocido el derecho a asistencia sanitaria.';
      }
    }

    if(v.padron==='si'){
      steps.push(step('ok','✓','Empadronamiento','Indicas que el bebé ya consta empadronado. Ten el dato localizado porque algunas comunidades lo comprueban o lo solicitan para la primera tarjeta.'));
    } else if(v.padron==='no'){
      steps.push(step('warn','3','Empadronamiento pendiente','La exigencia concreta cambia por comunidad. Revisa la guía de '+esc(r.label)+' antes de ir al centro de salud, porque puede ser necesario acreditar residencia o padrón.'));
    } else {
      steps.push(step('warn','3','Comprueba el padrón si tu comunidad lo exige','No todas las comunidades piden exactamente lo mismo. La guía territorial te indica si debes llevar o acreditar empadronamiento.'));
    }

    if(v.inss==='si' || v.cobertura==='mutualidad'){
      let route='Consulta la guía de '+esc(r.label)+' para solicitar la primera tarjeta y confirmar centro de salud, pediatra y documentación.';
      if(v.comunidad==='madrid'&&v.canal==='online') route='En Madrid la solicitud telemática figura temporalmente suspendida; prioriza actualmente la vía presencial en el centro de salud y confirma el aviso oficial antes de desplazarte.';
      else if(v.canal==='online'&&v.digital==='no') route='Prefieres hacerlo online, pero indicas que no dispones de Cl@ve/certificado. Comprueba si tu comunidad ofrece una vía sin identificación electrónica; si no, utiliza el centro de salud.';
      else if(v.canal==='presencial') route='Has elegido presencial: localiza el centro de salud que corresponde al domicilio y lleva la documentación del bebé y del representante.';
      steps.push(step('ok','4','Tarjeta sanitaria de '+esc(r.label),route));
      if(!next) next='Ya puedes preparar la solicitud de la tarjeta sanitaria en '+r.label+' y la asignación de pediatría.';
    } else {
      steps.push(step('skip','4','Tarjeta sanitaria autonómica','Déjala para después de confirmar el derecho a asistencia sanitaria, salvo que tu servicio de salud te indique expresamente otro circuito.'));
    }

    if(v.urgente==='si'){
      steps.push(step('warn','!','Necesitas atención antes de tener la tarjeta física','No esperes a que llegue el plástico para resolver una necesidad médica. Contacta con tu centro de salud o servicio sanitario y explica que se trata de un recién nacido en proceso de alta; te indicarán cómo identificarlo provisionalmente.'));
    }

    docs.push(['Nacimiento','Certificado/inscripción del nacimiento o documentación equivalente que corresponda.']);
    docs.push(['Representante','DNI/NIE del progenitor o tutor y, si procede, documento que acredite la representación.']);
    if(v.cobertura!=='mutualidad') docs.push(['Asistencia sanitaria','Justificante o comprobación de que el bebé figura con derecho reconocido cuando tu servicio de salud lo requiera.']);
    if(v.padron!=='si') docs.push(['Residencia/padrón','Revisa si '+r.label+' exige padrón o acreditación de residencia para la primera tarjeta.']);
    docs.push(['Datos de contacto','Teléfono y correo electrónico que quieras facilitar al servicio de salud.']);

    $('pasos').innerHTML=steps.join('');
    $('siguiente').textContent=next||'Revisa la guía territorial y la fuente oficial antes de presentar.';
    $('documentos').innerHTML=docs.map(([a,b])=>`<div class="ts-doc"><strong>${a}</strong><span>${b}</span></div>`).join('');
    $('inssAlta').href=INSS; $('inssComprobar').href=INSS_CHECK;
    $('resultado').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function reset(){try{localStorage.removeItem(STORE);}catch(_){}; $('formTs').reset(); $('resultado').classList.add('ts-hidden');}
  function init(){restore(); $('resolver')?.addEventListener('click',render); $('reiniciar')?.addEventListener('click',reset); ids.forEach(id=>$(id)?.addEventListener('change',save));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();