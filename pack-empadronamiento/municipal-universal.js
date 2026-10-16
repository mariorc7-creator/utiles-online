(() => {
  const $ = id => document.getElementById(id);
  const DIR = 'https://administracion.gob.es/informacion/sedes-electronicas-y-portales-de-internet-publicos/portales/entidades-locales';

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
    'Zaragoza': 'zaragoza',
    'Lleida': 'lleida'
  };

  function slug(v){
    return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  }

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

  function selectedCommunity(){
    return $('comunidadMunicipal')?.value || '';
  }

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
    input.id = 'municipioLibre';
    input.type = 'text';
    input.autocomplete = 'address-level2';
    input.placeholder = 'Escribe tu municipio';
    input.setAttribute('aria-label','Escribe tu municipio');
    input.style.cssText = 'display:none;width:100%;box-sizing:border-box;margin-top:8px;padding:11px 12px;border:1px solid #d8ddea;border-radius:11px;background:#fff;font:inherit';
    wrap.appendChild(input);
    const toggle = () => { input.style.display = sel.value === 'otro' ? 'block' : 'none'; };
    sel.addEventListener('change', toggle);
    toggle();
  }

  function fillMunicipalities(){
    const sel = $('municipio');
    if (!sel) return;
    const community = selectedCommunity();
    const previousLabel = municipalityLabel();
    const cities = community ? (CAPITALES[community] || []) : Object.values(CAPITALES).flat();
    const unique = [...new Set(cities)].sort((a,b)=>a.localeCompare(b,'es'));

    sel.innerHTML = '<option value="">Selecciona municipio</option>' + unique.map(city=>{
      const value = SPECIAL[city] || slug(city);
      return `<option value="${escapeHtml(value)}">${escapeHtml(city)}</option>`;
    }).join('') + '<option value="otro">Otro municipio (escríbelo)</option>';

    const candidate = [...sel.options].find(o=>o.textContent.trim() === previousLabel);
    if (candidate) sel.value = candidate.value;
    else if (community === 'Comunidad de Madrid') sel.value = 'madrid';
    else sel.value = '';

    if ($('municipioLibre')) $('municipioLibre').style.display = sel.value === 'otro' ? 'block' : 'none';
  }

  function inferCommunityFromMunicipality(){
    const name = municipalityLabel();
    for (const [community,cities] of Object.entries(CAPITALES)) {
      if (cities.includes(name)) return community;
    }
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
        else if (raw.municipioLibre) {
          $('municipio').value = 'otro';
          $('municipioLibre').value = raw.municipioLibre;
          $('municipioLibre').style.display = 'block';
        }
      }
    } catch (_) {}
  }

  function saveCoverageContext(){
    try {
      localStorage.setItem('pb_empadronamiento_coverage_v1', JSON.stringify({
        comunidad: selectedCommunity(),
        municipioLabel: municipalityLabel(),
        municipioLibre: $('municipioLibre')?.value?.trim() || ''
      }));
    } catch (_) {}
  }

  function optionsHtml(kind){
    if(kind==='lleida') return `
      <div class="pb-muni-options" style="display:grid;gap:10px;margin-top:12px">
        <div class="soft"><strong>1. Comprueba primero si el alta ya consta</strong><br>Si el nacimiento ya se ha incorporado al padrón, no necesitas repetir el alta.</div>
        <div class="soft"><strong>2. Consulta o tramita el padrón en la Paeria</strong><br>Usa el servicio municipal de Padró para ver qué gestión corresponde a tu caso.</div>
        <div class="soft"><strong>3. Si necesitas justificante</strong><br>Solicita el volante o certificado padronal por la vía disponible en la sede/trámites de la Paeria.</div>
        <div class="soft"><strong>4. Si tu caso es especial</strong><br>Un solo progenitor, autorizaciones, custodia o domicilio distinto requieren revisar la documentación indicada por el Ayuntamiento.</div>
      </div>`;
    if(kind==='zaragoza') return `
      <div class="pb-muni-options" style="display:grid;gap:10px;margin-top:12px">
        <div class="soft"><strong>1. Comprueba si el alta por nacimiento ya se ha hecho de oficio</strong><br>Antes de iniciar nada, verifica si el bebé ya consta empadronado.</div>
        <div class="soft"><strong>2. Si no consta</strong><br>Accede al trámite municipal de alta por nacimiento y sigue la vía indicada por Zaragoza.</div>
        <div class="soft"><strong>3. Si necesitas acreditarlo</strong><br>Solicita volante o certificado de empadronamiento desde el trámite oficial correspondiente.</div>
      </div>`;
    return '';
  }

  function enhanceResult(){
    const sel = $('municipio');
    const panel = $('nonMadrid');
    const text = $('nonMadridText');
    const acts = $('nonMadridActions');
    if (!sel || !panel || !text || !acts) return;

    saveCoverageContext();
    const value = sel.value;
    const m = municipalityLabel();
    const community = selectedCommunity() || inferCommunityFromMunicipality();

    panel.querySelectorAll('.pb-muni-options,.pb-universal-note,.pb-pdf-choice').forEach(n=>n.remove());

    if (!value) {
      setReviewVisibility(false);
      text.innerHTML = '<strong>Selecciona tu municipio</strong> para preparar la vía adecuada.';
      acts.innerHTML = '';
      return;
    }

    if (value === 'madrid') {
      setReviewVisibility(true);
      panel.classList.add('hidden');
      return;
    }

    setReviewVisibility(false);
    panel.classList.remove('hidden');
    const heading = panel.querySelector('h2');
    if (heading) heading.textContent = `Resultado para ${m}`;

    if (value === 'lleida') {
      text.innerHTML = '<strong>En Lleida no mostramos revisión de PDF</strong> porque este flujo no depende de una Hoja Padronal PDF rellenable verificada como la de Madrid. Te llevamos directamente a la vía oficial.';
      acts.innerHTML = '<a class="action" target="_blank" rel="noopener" href="https://www.paeria.cat/ca/serveis/padro">Servicio de Padró ↗</a><a class="action secondary" target="_blank" rel="noopener" href="https://tramits.paeria.cat/Ciutadania/">Trámites online ↗</a>';
      panel.insertAdjacentHTML('beforeend',optionsHtml('lleida'));
      return;
    }

    if (value === 'zaragoza') {
      text.innerHTML = '<strong>En Zaragoza no mostramos revisión de PDF</strong> porque no tenemos verificado un formulario PDF rellenable que deba revisarse en este flujo. Priorizamos las vías oficiales disponibles.';
      acts.innerHTML = '<a class="action" target="_blank" rel="noopener" href="https://www.zaragoza.es/sede/servicio/tramite/22940">Alta por nacimiento ↗</a><a class="action secondary" target="_blank" rel="noopener" href="https://www.zaragoza.es/sede/servicio/tramite/23720">Volante/certificado ↗</a>';
      panel.insertAdjacentHTML('beforeend',optionsHtml('zaragoza'));
      return;
    }

    text.innerHTML = `Para <strong>${escapeHtml(m)}</strong>${community ? ` (${escapeHtml(community)})` : ''} no mostramos revisor PDF mientras no tengamos verificado un formulario oficial rellenable. Así evitamos ofrecer una revisión que no corresponde al trámite real de tu ayuntamiento.`;
    acts.innerHTML = `<a class="action" target="_blank" rel="noopener" href="${DIR}">Buscar sede oficial de ${escapeHtml(m)} ↗</a>`;
    const note = document.createElement('div');
    note.className = 'notice pb-universal-note';
    note.innerHTML = '<strong>Cobertura nacional activa.</strong><br>Puedes indicar cualquier municipio de España. Si no aparece en la lista rápida, elige “Otro municipio” y escríbelo. La revisión PDF solo aparece cuando hemos verificado que existe un PDF oficial rellenable compatible.';
    panel.appendChild(note);
  }

  function updateCopy(){
    const hero = document.querySelector('.pack .hero p');
    if (hero) hero.innerHTML = 'No te pedimos nombre, DNI ni dirección. Solo las respuestas que cambian el trámite. El resultado se centra en lo útil: <strong>qué revisar, qué puedes ignorar y cuál es la vía oficial de tu municipio</strong>. Si existe un PDF oficial rellenable verificado, también podrás revisarlo antes de presentar.';

    const cards = document.querySelectorAll('.pack .panel .soft');
    cards.forEach(card=>{
      if (/Revisa tu PDF antes de enviar/i.test(card.textContent)) {
        card.innerHTML = '<strong>Revisión PDF solo cuando corresponde</strong><br>El revisor aparece únicamente si hemos verificado un formulario PDF oficial rellenable para ese municipio.';
      }
    });
  }

  function syncUi(){
    const value = $('municipio')?.value;
    setReviewVisibility(value === 'madrid');
    enhanceResult();
  }

  function init(){
    addCommunitySelector();
    ensureMunicipioLibre();
    restoreCoverageContext();
    updateCopy();

    $('comunidadMunicipal')?.addEventListener('change',()=>{
      fillMunicipalities();
      setTimeout(syncUi,0);
    });
    $('municipio')?.addEventListener('change',()=>setTimeout(syncUi,0));
    $('municipioLibre')?.addEventListener('input',()=>setTimeout(syncUi,0));
    $('resolver')?.addEventListener('click',()=>setTimeout(syncUi,0));

    const wait = () => {
      if ($('pb-review-v6')) syncUi();
      else setTimeout(wait,80);
    };
    wait();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();