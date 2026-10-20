(() => {
 'use strict';
 if (!/^\/pack-empadronamiento\/?$/.test(location.pathname)) return;
 const $=id=>document.getElementById(id);
 const DIRECTORY='https://administracion.gob.es/informacion/sedes-electronicas-y-portales-de-internet-publicos/portales/entidades-locales/ayuntamientos';
 const caps=new Set(['Almería','Cádiz','Córdoba','Granada','Huelva','Jaén','Málaga','Sevilla','Huesca','Teruel','Zaragoza','Oviedo','Palma','Las Palmas de Gran Canaria','Santa Cruz de Tenerife','Santander','Albacete','Ciudad Real','Cuenca','Guadalajara','Toledo','Ávila','Burgos','León','Palencia','Salamanca','Segovia','Soria','Valladolid','Zamora','Barcelona','Girona','Lleida','Tarragona','Alicante','Castellón de la Plana','Valencia','Badajoz','Cáceres','A Coruña','Lugo','Ourense','Pontevedra','Madrid','Murcia','Pamplona','Bilbao','Donostia-San Sebastián','Vitoria-Gasteiz','Logroño','Ceuta','Melilla','Mérida','Santiago de Compostela']);
 const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function init(){
  const municipio=$('municipio'),comunidad=$('comunidadMunicipal'),resolver=$('resolver'),panel=$('nonMadrid'),txt=$('nonMadridText');
  if(!municipio||!resolver||!panel||!txt)return;
  const style=document.createElement('style');style.textContent='.pb-emp-mini{font-size:.85rem;color:#5e6a7d;line-height:1.55}.pb-emp-steps{padding:0;margin:13px 0;list-style:none;display:grid;gap:9px}.pb-emp-steps li{padding:13px;border:1px solid #e1e5ef;border-radius:12px;background:#f8faff;line-height:1.5}.pb-emp-steps strong{display:block;margin-bottom:4px}.pb-emp-help{margin-top:6px;font-size:.85rem;color:#5a637b}.pb-emp-help summary{cursor:pointer;font-weight:750}.pb-emp-error{padding:13px;border:1px solid #e2c78f;background:#fff8e7;border-radius:11px;margin:10px 0}.pb-emp-sticky{scroll-margin-top:100px}.pb-emp-checks{display:grid;gap:7px}.pb-emp-checks label{display:flex;align-items:flex-start;gap:10px;padding:8px;border:1px solid #e6e9f2;border-radius:8px;background:white}.pb-emp-checks input{margin-top:4px;width:18px;height:18px;flex:none}';document.head.appendChild(style);
  const auth=$('autorizacion');
  if(auth){const field=auth.closest('.field');const sync=()=>{const one=$('convivencia')?.value==='uno';field.hidden=!one;if(!one)auth.value='na';};$('convivencia')?.addEventListener('change',sync);sync();}
  for(const id of ['edad','canal']){const field=$(id)?.closest('.field');if(field){field.hidden=true;}}
  const formPanel=resolver.closest('.panel');
  const hint=document.createElement('div');hint.className='pb-emp-help';
  hint.innerHTML='<details><summary>¿Y si el bebé ya aparece empadronado?</summary><p>Algunos ayuntamientos incorporan de oficio los nacimientos tras recibir la información del Registro Civil, pero no sucede de igual manera en todos. Si no tienes constancia, elige «No lo sé» y comprueba primero el padrón en tu ayuntamiento. Evita presentar un alta duplicada.</p></details>';
  const estado=$('estado')?.closest('.field');if(estado)estado.appendChild(hint);
  // Ocultar el texto «3. PDF» cuando no existe formulario PDF municipal verificado.
  const title=$('pb-review-v6')?.querySelector('h2');
  const frmText=document.createElement('p');frmText.className='pb-emp-mini';frmText.id='pb-emp-context-note';frmText.textContent='Para cada capital mostramos una ruta orientativa. Solo habilitamos el revisor PDF para formularios oficiales que hemos comprobado.';
  formPanel?.insertAdjacentElement('afterend',frmText);
  const err=document.createElement('div');err.className='pb-emp-error';err.setAttribute('role','alert');err.hidden=true;
  resolver.parentElement?.insertAdjacentElement('beforebegin',err);
  function city(){return municipio.options[municipio.selectedIndex]?.textContent.trim()||'';}
  function showResult(){
    const name=city();
    if(!comunidad?.value||!municipio.value||!caps.has(name)){
      err.hidden=false;err.textContent='Elige una comunidad y una capital de provincia o ciudad autónoma para continuar.';
      panel.classList.add('hidden');return;
    }
    err.hidden=true;
    const states={estado:$('estado')?.value,convivencia:$('convivencia')?.value,padres:$('padresAlta')?.value,urgencia:$('urgencia')?.value,autorizacion:$('autorizacion')?.value};
    const specific=municipio.value==='madrid'||municipio.value==='sevilla'||municipio.value==='zaragoza'||municipio.value==='lleida';
    const notes=[];
    if(states.estado==='si')notes.push('Tu bebé ya consta en el padrón según tus respuestas: normalmente no necesitas solicitar otra alta; comprueba si únicamente te hace falta un volante o certificado.');
    else if(states.estado==='nose')notes.push('Antes de solicitar un alta, consulta si el ayuntamiento ya ha inscrito al bebé de oficio tras el Registro Civil. No se debe asumir que ocurra en todas las ciudades.');
    else notes.push('No consta el alta del bebé: consulta el trámite de alta por nacimiento en la sede del ayuntamiento.');
    if(states.convivencia==='uno')notes.push(states.autorizacion==='si'?'Al ir con un solo progenitor, ten a mano la autorización o documentación que corresponda y revisa la exigencia exacta municipal.':'Al ir con un solo progenitor, comprueba el régimen de custodia, autorizaciones o declaraciones responsables antes de presentar; no todas las situaciones requieren lo mismo.');
    if(states.convivencia==='otros')notes.push('La inscripción con personas distintas de los progenitores necesita revisar la acreditación de representación, guarda o autorización.');
    if(states.padres==='no')notes.push('Si los progenitores no figuran en el domicilio, el ayuntamiento puede exigir documentación adicional sobre residencia u ocupación.');
    if(states.urgencia==='si')notes.push('Si te urge un justificante, pregunta por volante/certificado y sus vías disponibles; no confundas solicitud de alta con expedición de justificante.');
    const bullets='<ol class="pb-emp-steps">'+notes.map(n=>'<li>'+escape(n)+'</li>').join('')+'</ol>';
    if(!specific){
      panel.classList.remove('hidden');
      panel.querySelector('h2').textContent='2. Tu ruta para '+name;
      txt.innerHTML='<strong>Qué tienes que comprobar en '+escape(name)+'</strong>'+bullets+'<p class="pb-emp-mini">No hemos verificado todavía un PDF de alta rellenable ni un enlace directo para esta capital. La fuente oficial del Gobierno de España te permite localizar el ayuntamiento. No uses el formulario de Madrid para '+escape(name)+'.</p>';
      $('nonMadridActions').innerHTML='<a class="action" target="_blank" rel="noopener noreferrer" href="'+DIRECTORY+'">Buscar el portal oficial de '+escape(name)+' ↗</a>';
      const pdf=$('pb-review-v6');if(pdf)pdf.style.display='none';
    }else if(municipio.value!=='madrid'){
      panel.classList.remove('hidden');
      panel.querySelector('h2').textContent='2. Tu ruta para '+name;
      const current=txt.innerHTML;
      if(!panel.querySelector('.pb-emp-custom-checks')){
        const extra=document.createElement('div');extra.className='pb-emp-custom-checks';panel.appendChild(extra);
      }
      panel.querySelector('.pb-emp-custom-checks').innerHTML='<h3>Qué debes comprobar según tu caso</h3>'+bullets;
      if(current.includes('Estamos ampliando'))txt.textContent='Consulta los enlaces municipales oficiales y la documentación de tu caso.';
    }else{
      panel.classList.add('hidden');
    }
    if(municipio.value!=='madrid' && municipio.value!=='sevilla'){
      const result=$('resultadoWrap');if(result)result.classList.add('hidden');
    }
    if(states.estado!=='si'){
      const checks=panel.querySelector('.pb-emp-checks');
      if(checks)checks.remove();
      if(municipio.value!=='madrid'){
        const section=document.createElement('div');section.className='pb-emp-checks';
        section.innerHTML=['Consultar si el bebé ya figura en el padrón','Confirmar documentos de identidad y nacimiento','Comprobar autorizaciones según la convivencia','Abrir el canal oficial y presentar, si procede'].map(x=>'<label><input type="checkbox"> '+escape(x)+'</label>').join('');
        panel.appendChild(section);
      }
    }
    (municipio.value==='madrid'?$('resultadoWrap'):panel)?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  resolver.addEventListener('click',()=>setTimeout(showResult,60));
  // No mostramos resultados automáticos incompletos mientras se cambia de comunidad.
  comunidad?.addEventListener('change',()=>{panel.classList.add('hidden');err.hidden=true;});
  municipio.addEventListener('change',()=>{panel.classList.add('hidden');err.hidden=true;});
  panel.classList.add('hidden');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();