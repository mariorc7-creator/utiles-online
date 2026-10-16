(() => {
  const $ = id => document.getElementById(id);
  const DIR = 'https://administracion.gob.es/informacion/sedes-electronicas-y-portales-de-internet-publicos/portales/entidades-locales';
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const SEVILLA_PDF = 'https://www.sevilla.org/servicios/empadronamiento/hoja-padronal-v6-formulario-web.pdf';
  const SEVILLA_INFO = 'https://www.sevilla.org/servicios/empadronamiento/informacion-cambio-en-el-padron-de-habitantes-de-sevilla';

  const COMUNIDADES = [
    'Andalucía','Aragón','Asturias','Islas Baleares','Canarias','Cantabria','Castilla-La Mancha','Castilla y León','Cataluña','Comunidad Valenciana','Extremadura','Galicia','Comunidad de Madrid','Región de Murcia','Navarra','País Vasco','La Rioja','Ceuta','Melilla'
  ];

  const CAPITALES = {
    'Andalucía':['Almería','Cádiz','Córdoba','Granada','Huelva','Jaén','Málaga','Sevilla'],
    'Aragón':['Huesca','Teruel','Zaragoza'],
    'Asturias':['Oviedo'],
    'Islas Baleares':['Palma'],
    'Canarias':['Las Palmas de Gran Canaria','Santa Cruz de Tenerife'],
    'Cantabria':['Santander'],
    'Castilla-La Mancha':['Albacete','Ciudad Real','Cuenca','Guadalajara','Toledo'],
    'Castilla y León':['Ávila','Burgos','León','Palencia','Salamanca','Segovia','Soria','Valladolid','Zamora'],
    'Cataluña':['Barcelona','Girona','Lleida','Tarragona'],
    'Comunidad Valenciana':['Alicante','Castellón de la Plana','Valencia'],
    'Extremadura':['Badajoz','Cáceres','Mérida'],
    'Galicia':['A Coruña','Lugo','Ourense','Pontevedra','Santiago de Compostela'],
    'Comunidad de Madrid':['Madrid'],
    'Región de Murcia':['Murcia'],
    'Navarra':['Pamplona'],
    'País Vasco':['Bilbao','Donostia-San Sebastián','Vitoria-Gasteiz'],
    'La Rioja':['Logroño'],
    'Ceuta':['Ceuta'],
    'Melilla':['Melilla']
  };

  const SPECIAL = {
    'Madrid': 'madrid',
    'Sevilla': 'sevilla',
    'Zaragoza': 'zaragoza',
    'Lleida': 'lleida'
  };

  function slug(v){
    return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  }

  function norm(v){ return String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase(); }
  function meaningful(v){ const n=norm(v); return !!n && !['off','false','0','none','null','undefined'].includes(n); }
  function fieldValue(o){ return o?.fieldValue ?? o?.value; }
  function exportValue(o){ return o?.buttonValue ?? o?.exportValue; }
  function isButton(o){ return o?.fieldType === 'Btn' || o?.checkBox === true || o?.radioButton === true || exportValue(o) !== undefined; }
  function selected(o){
    if(!isButton(o)) return false;
    if(o?.checked === true) return true;
    const cur=norm(fieldValue(o)); if(!meaningful(cur)) return false;
    const exp=norm(exportValue(o));
    if(exp) return cur===exp;
    return ['yes','on','1','true','x','si'].includes(cur);
  }
  function semantic(o){ return norm([o?.name,o?.fieldName,o?.alternativeText,o?.contents,o?.exportValue,o?.buttonValue].filter(Boolean).join(' ')); }

  function reviewSection(){ return $('pb-review-v6'); }
  function setReviewVisibility(show){
    const sec = reviewSection();
    if (!sec) return;
    sec.style.display = show ? '' : 'none';
  }

  function municipalityLabel(){
    const sel = $('municipio');
    if (!sel) return 'tu municipio';
    if (sel.value === 'otro') return $('municipioLibre')?.value?.trim() || 'tu municipio';
    const opt = sel.options?.[sel.selectedIndex];
    return opt?.textContent?.trim() || 'tu municipio';
  }

  function selectedCommunity(){ return $('comunidadMunicipal')?.value || ''; }

  function addCommunitySelector(){
    const municipio = $('municipio');
    if (!municipio || $('comunidadMunicipal')) return;
    const field = municipio.closest('.field');
    if (!field) return;
    const communityField = document.createElement('div');
    communityField.className = 'field';
    communityField.innerHTML = '<label for="comunidadMunicipal">Comunidad autónoma</label><select id="comunidadMunicipal" aria-label="Comunidad autónoma"><option value="">Selecciona tu comunidad</option>' + COMUNIDADES.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('') + '</select>';
    field.parentElement.insertBefore(communityField, field);
  }

  function ensureMunicipioLibre(){
    const sel = $('municipio');
    if (!sel || $('municipioLibre')) return;
    const wrap = sel.closest('.field') || sel.parentElement;
    const input = document.createElement('input');
    input.id = 'municipioLibre'; input.type = 'text'; input.autocomplete = 'address-level2'; input.placeholder = 'Escribe tu municipio'; input.setAttribute('aria-label','Escribe tu municipio');
    input.style.cssText = 'display:none;width:100%;box-sizing:border-box;margin-top:8px;padding:11px 12px;border:1px solid #d8ddea;border-radius:11px;background:#fff;font:inherit';
    wrap.appendChild(input);
    const toggle = () => { input.style.display = sel.value === 'otro' ? 'block' : 'none'; };
    sel.addEventListener('change', toggle); toggle();
  }

  function fillMunicipalities(){
    const sel = $('municipio'); if (!sel) return;
    const community = selectedCommunity(); const previousLabel = municipalityLabel();
    const cities = community ? (CAPITALES[community] || []) : Object.values(CAPITALES).flat();
    const unique = [...new Set(cities)].sort((a,b)=>a.localeCompare(b,'es'));
    sel.innerHTML = '<option value="">Selecciona municipio</option>' + unique.map(city=>{
      const value = SPECIAL[city] || slug(city); return `<option value="${escapeHtml(value)}">${escapeHtml(city)}</option>`;
    }).join('') + '<option value="otro">Otro municipio (escríbelo)</option>';
    const candidate = [...sel.options].find(o=>o.textContent.trim() === previousLabel);
    if (candidate) sel.value = candidate.value;
    else if (community === 'Comunidad de Madrid') sel.value = 'madrid';
    else sel.value = '';
    if ($('municipioLibre')) $('municipioLibre').style.display = sel.value === 'otro' ? 'block' : 'none';
  }

  function inferCommunityFromMunicipality(){
    const name = municipalityLabel();
    for (const [community,cities] of Object.entries(CAPITALES)) if (cities.includes(name)) return community;
    return '';
  }

  function restoreCoverageContext(){
    try {
      const raw = JSON.parse(localStorage.getItem('pb_empadronamiento_coverage_v1') || '{}');
      if (raw.comunidad && COMUNIDADES.includes(raw.comunidad)) $('comunidadMunicipal').value = raw.comunidad;
      fillMunicipalities();
      if (raw.municipioLabel) {
        const opt = [...$('municipio').options].find(o=>o.textContent.trim()===raw.municipioLabel);
        if (opt) $('municipio').value = opt.value;
        else if (raw.municipioLibre) { $('municipio').value = 'otro'; $('municipioLibre').value = raw.municipioLibre; $('municipioLibre').style.display = 'block'; }
      }
    } catch (_) {}
  }

  function saveCoverageContext(){
    try { localStorage.setItem('pb_empadronamiento_coverage_v1', JSON.stringify({ comunidad:selectedCommunity(), municipioLabel:municipalityLabel(), municipioLibre:$('municipioLibre')?.value?.trim() || '' })); } catch (_) {}
  }

  function optionsHtml(kind){
    if(kind==='lleida') return '<div class="pb-muni-options" style="display:grid;gap:10px;margin-top:12px"><div class="soft"><strong>1. Comprueba primero si el alta ya consta</strong><br>Si el nacimiento ya se ha incorporado al padrón, no necesitas repetir el alta.</div><div class="soft"><strong>2. Consulta o tramita el padrón en la Paeria</strong><br>Usa el servicio municipal de Padró para ver qué gestión corresponde a tu caso.</div><div class="soft"><strong>3. Si necesitas justificante</strong><br>Solicita el volante o certificado padronal por la vía disponible en la sede/trámites de la Paeria.</div><div class="soft"><strong>4. Si tu caso es especial</strong><br>Un solo progenitor, autorizaciones, custodia o domicilio distinto requieren revisar la documentación indicada por el Ayuntamiento.</div></div>';
    if(kind==='zaragoza') return '<div class="pb-muni-options" style="display:grid;gap:10px;margin-top:12px"><div class="soft"><strong>1. Comprueba si el alta por nacimiento ya se ha hecho de oficio</strong><br>Antes de iniciar nada, verifica si el bebé ya consta empadronado.</div><div class="soft"><strong>2. Si no consta</strong><br>Accede al trámite municipal de alta por nacimiento y sigue la vía indicada por Zaragoza.</div><div class="soft"><strong>3. Si necesitas acreditarlo</strong><br>Solicita volante o certificado de empadronamiento desde el trámite oficial correspondiente.</div></div>';
    return '';
  }

  function configureReviewForMunicipality(value){
    const sec=reviewSection(); if(!sec) return;
    const title=sec.querySelector('h2'); const lead=sec.querySelector('.pb-review-lead');
    if(value==='sevilla'){
      if(title) title.textContent='3. Revisa la Hoja Padronal de Sevilla antes de presentarla';
      if(lead) lead.textContent='Sube la Hoja Padronal oficial de Sevilla que has rellenado. Comprobaremos localmente datos básicos y la causa del alta. El archivo no se envía a nuestros servidores.';
    } else {
      if(title) title.textContent='3. Revisa tu PDF antes de presentarlo';
      if(lead) lead.textContent='Sube la Hoja Padronal que has rellenado y comprobaremos localmente algunos campos básicos. El archivo no se envía a nuestros servidores.';
    }
  }

  function enhanceResult(){
    const sel = $('municipio'), panel = $('nonMadrid'), text = $('nonMadridText'), acts = $('nonMadridActions');
    if (!sel || !panel || !text || !acts) return;
    saveCoverageContext();
    const value = sel.value, m = municipalityLabel(), community = selectedCommunity() || inferCommunityFromMunicipality();
    panel.querySelectorAll('.pb-muni-options,.pb-universal-note,.pb-pdf-choice').forEach(n=>n.remove());

    if (!value) { setReviewVisibility(false); text.innerHTML='<strong>Selecciona tu municipio</strong> para preparar la vía adecuada.'; acts.innerHTML=''; return; }
    configureReviewForMunicipality(value);

    if (value === 'madrid') { setReviewVisibility(true); panel.classList.add('hidden'); return; }

    if (value === 'sevilla') {
      setReviewVisibility(true); panel.classList.remove('hidden');
      const heading=panel.querySelector('h2'); if(heading) heading.textContent='Resultado para Sevilla';
      text.innerHTML='<strong>Sevilla publica una Hoja Padronal oficial en PDF</strong> y exige presentarla debidamente cumplimentada y firmada. Por eso aquí sí activamos el revisor PDF del Preparador Inteligente.';
      acts.innerHTML=`<a class="action" target="_blank" rel="noopener" href="${SEVILLA_PDF}">Abrir Hoja Padronal oficial ↗</a><a class="action secondary" target="_blank" rel="noopener" href="${SEVILLA_INFO}">Ver requisitos oficiales ↗</a>`;
      const note=document.createElement('div'); note.className='notice pb-universal-note'; note.innerHTML='<strong>Revisor adaptado a Sevilla.</strong><br>Comprueba de forma orientativa la causa “Nacimiento”, datos del bebé y domicilio. Las firmas, autorizaciones y documentación acreditativa deben revisarse también en la información oficial.'; panel.appendChild(note);
      return;
    }

    setReviewVisibility(false); panel.classList.remove('hidden');
    const heading = panel.querySelector('h2'); if (heading) heading.textContent = `Resultado para ${m}`;
    if (value === 'lleida') {
      text.innerHTML='<strong>En Lleida no mostramos revisión de PDF</strong> porque este flujo no depende de una Hoja Padronal PDF rellenable verificada como la de Madrid o Sevilla. Te llevamos directamente a la vía oficial.';
      acts.innerHTML='<a class="action" target="_blank" rel="noopener" href="https://www.paeria.cat/ca/serveis/padro">Servicio de Padró ↗</a><a class="action secondary" target="_blank" rel="noopener" href="https://tramits.paeria.cat/Ciutadania/">Trámites online ↗</a>';
      panel.insertAdjacentHTML('beforeend',optionsHtml('lleida')); return;
    }
    if (value === 'zaragoza') {
      text.innerHTML='<strong>En Zaragoza no mostramos revisión de PDF</strong> porque no tenemos verificado un formulario PDF rellenable que deba revisarse en este flujo. Priorizamos las vías oficiales disponibles.';
      acts.innerHTML='<a class="action" target="_blank" rel="noopener" href="https://www.zaragoza.es/sede/servicio/tramite/22940">Alta por nacimiento ↗</a><a class="action secondary" target="_blank" rel="noopener" href="https://www.zaragoza.es/sede/servicio/tramite/23720">Volante/certificado ↗</a>';
      panel.insertAdjacentHTML('beforeend',optionsHtml('zaragoza')); return;
    }
    text.innerHTML=`Para <strong>${escapeHtml(m)}</strong>${community ? ` (${escapeHtml(community)})` : ''} no mostramos revisor PDF mientras no tengamos verificado un formulario oficial rellenable. Así evitamos ofrecer una revisión que no corresponde al trámite real de tu ayuntamiento.`;
    acts.innerHTML=`<a class="action" target="_blank" rel="noopener" href="${DIR}">Buscar sede oficial de ${escapeHtml(m)} ↗</a>`;
    const note=document.createElement('div'); note.className='notice pb-universal-note'; note.innerHTML='<strong>Cobertura nacional activa.</strong><br>Puedes indicar cualquier municipio de España. Si no aparece en la lista rápida, elige “Otro municipio” y escríbelo. La revisión PDF solo aparece cuando hemos verificado que existe un PDF oficial rellenable compatible.'; panel.appendChild(note);
  }

  async function loadPdf(){
    if(window.pdfjsLib) return window.pdfjsLib;
    await new Promise((res,rej)=>{const s=document.createElement('script');s.src=PDFJS;s.onload=res;s.onerror=rej;document.head.appendChild(s);});
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=WORKER; return window.pdfjsLib;
  }

  async function inspect(file){
    const pdfjs=await loadPdf(); const data=new Uint8Array(await file.arrayBuffer()); const pdf=await pdfjs.getDocument({data}).promise;
    let text=''; let annotations=[]; let fields={};
    for(let i=1;i<=pdf.numPages;i++){ const p=await pdf.getPage(i); const tc=await p.getTextContent(); text+=' '+tc.items.map(x=>x.str||'').join(' '); const anns=await p.getAnnotations().catch(()=>[]); annotations=annotations.concat(anns); }
    try{fields=await pdf.getFieldObjects()||{};}catch(_){ }
    const flat=Object.entries(fields).flatMap(([name,list])=>(Array.isArray(list)?list:[list]).map(x=>({name,...x})));
    return {text:norm(text),objects:flat.concat(annotations)};
  }

  function genericChecks(doc){
    const objs=doc.objects||[], picked=objs.filter(selected), pickedSem=picked.map(semantic);
    let causa={state:'unknown',title:'Causa del alta',detail:'No podemos confirmar automáticamente qué causa está marcada en este PDF.'};
    if(pickedSem.some(s=>s.includes('nacimiento'))) causa={state:'ok',title:'Causa del alta',detail:'La selección “Nacimiento” aparece identificada en el PDF.'};
    else { const wrong=pickedSem.find(s=>/residencia|domicilio|omision|mod.*datos/.test(s)); if(wrong) causa={state:'bad',title:'Causa del alta',detail:'Parece marcada una causa distinta de “Nacimiento”. Revísala antes de presentar.'}; else if(doc.text.includes('nacimiento')) causa={state:'unknown',title:'Causa del alta',detail:'El formulario contiene “Nacimiento”, pero no podemos confirmar la casilla con suficiente seguridad. Revísala visualmente.'}; }
    const filled=objs.filter(o=>!isButton(o)&&meaningful(fieldValue(o))), semFilled=filled.map(semantic);
    const hasName=semFilled.some(s=>/(nombre|name)/.test(s)), hasBirth=semFilled.some(s=>/(fecha.*nac|nacimiento|birth)/.test(s));
    const menor=(hasName&&hasBirth)?{state:'ok',title:'Datos del bebé',detail:'Detectamos datos cumplimentados compatibles con nombre y fecha de nacimiento.'}:{state:'unknown',title:'Datos del bebé',detail:'No podemos confirmar todos los datos del menor. Revisa nombre, apellidos y fecha de nacimiento.'};
    const hasAddress=semFilled.some(s=>/(domicilio|direccion|via|calle|address)/.test(s));
    const domicilio=hasAddress?{state:'ok',title:'Domicilio',detail:'Detectamos información cumplimentada en campos relacionados con el domicilio.'}:{state:'unknown',title:'Domicilio',detail:'No podemos confirmar el domicilio automáticamente. Revísalo visualmente.'};
    return [causa,domicilio,menor];
  }

  function draw(rows,out){
    const icons={ok:'✓',bad:'✕',unknown:'?'}; out.innerHTML='';
    for(const r of rows){ const d=document.createElement('div'); d.className=`pb-check ${r.state}`; d.innerHTML=`<div>${icons[r.state]||'?'}</div><div><strong>${r.title}</strong><small>${r.detail}</small></div>`; out.appendChild(d); }
    const bad=rows.some(r=>r.state==='bad'), unknown=rows.some(r=>r.state==='unknown'); const s=document.createElement('div'); s.className='pb-review-summary'; s.textContent=bad?'Hay un punto que conviene corregir antes de presentar.':unknown?'No detectamos un error claro, pero quedan puntos que requieren revisión visual.':'Las comprobaciones automáticas principales no detectan problemas.'; out.appendChild(s);
  }

  function bindSevillaReview(){
    const run=$('pb-review-run'); if(!run || run.dataset.sevillaBound) return; run.dataset.sevillaBound='1';
    run.addEventListener('click',async e=>{
      if($('municipio')?.value!=='sevilla') return;
      e.preventDefault(); e.stopImmediatePropagation();
      const file=$('pb-review-file')?.files?.[0], out=$('pb-review-results');
      if(!file){draw([{state:'unknown',title:'Selecciona un PDF',detail:'Elige primero la Hoja Padronal de Sevilla que quieres revisar.'}],out);return;}
      run.disabled=true; run.textContent='Revisando…'; out.innerHTML='';
      try{draw(genericChecks(await inspect(file)),out);}catch(_){draw([{state:'bad',title:'No se pudo revisar el PDF',detail:'Prueba a guardar de nuevo el formulario y vuelve a subirlo.'}],out);}finally{run.disabled=false;run.textContent='Revisar PDF';}
    },true);
  }

  function updateCopy(){
    const hero=document.querySelector('.pack .hero p'); if(hero) hero.innerHTML='No te pedimos nombre, DNI ni dirección. Solo las respuestas que cambian el trámite. El resultado se centra en lo útil: <strong>qué revisar, qué puedes ignorar y cuál es la vía oficial de tu municipio</strong>. Si existe un PDF oficial rellenable verificado, también podrás revisarlo antes de presentar.';
    document.querySelectorAll('.pack .panel .soft').forEach(card=>{ if(/Revisa tu PDF antes de enviar/i.test(card.textContent)) card.innerHTML='<strong>Revisión PDF solo cuando corresponde</strong><br>El revisor aparece únicamente si hemos verificado un formulario PDF oficial rellenable para ese municipio.'; });
  }

  function syncUi(){ const value=$('municipio')?.value; setReviewVisibility(value==='madrid'||value==='sevilla'); configureReviewForMunicipality(value); enhanceResult(); }

  function init(){
    addCommunitySelector(); ensureMunicipioLibre(); restoreCoverageContext(); updateCopy();
    $('comunidadMunicipal')?.addEventListener('change',()=>{fillMunicipalities();setTimeout(syncUi,0);});
    $('municipio')?.addEventListener('change',()=>setTimeout(syncUi,0));
    $('municipioLibre')?.addEventListener('input',()=>setTimeout(syncUi,0));
    $('resolver')?.addEventListener('click',()=>setTimeout(syncUi,0));
    const wait=()=>{ if($('pb-review-v6')){bindSevillaReview();syncUi();} else setTimeout(wait,80); }; wait();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();