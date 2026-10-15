(() => {
  const $ = id => document.getElementById(id);
  const DIR = 'https://administracion.gob.es/informacion/sedes-electronicas-y-portales-de-internet-publicos/portales/entidades-locales';
  const norm = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
  const meaningful = v => { const n=norm(v); return !!n && !['off','false','0','none','null','undefined'].includes(n); };
  const fieldValue = o => o?.fieldValue ?? o?.value;
  const exportValue = o => o?.buttonValue ?? o?.exportValue;
  const isButton = o => o?.fieldType === 'Btn' || o?.checkBox === true || o?.radioButton === true || exportValue(o) !== undefined;
  const selected = o => {
    if(!isButton(o)) return false;
    if(o?.checked === true) return true;
    const cur=norm(fieldValue(o)); if(!meaningful(cur)) return false;
    const exp=norm(exportValue(o));
    if(exp) return cur===exp;
    return ['yes','on','1','true','x','si'].includes(cur);
  };
  const semantic = o => norm([o?.name,o?.fieldName,o?.alternativeText,o?.contents,o?.exportValue,o?.buttonValue].filter(Boolean).join(' '));

  const CAPS = {
    madrid:{pdf:true,review:'specific'},
    zaragoza:{pdf:false,review:'none'},
    lleida:{pdf:false,review:'none'},
    otro:{pdf:null,review:'optional'}
  };

  function escapeHtml(s){return String(s).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));}

  function ensureMunicipioLibre(){
    const sel=$('municipio'); if(!sel || $('municipioLibre')) return;
    const otro=[...sel.options].find(o=>o.value==='otro');
    if(otro) otro.textContent='Otro municipio (escríbelo)';
    const wrap=sel.closest('.field')||sel.parentElement;
    const input=document.createElement('input');
    input.id='municipioLibre'; input.type='text'; input.autocomplete='address-level2'; input.placeholder='Ej.: Badalona, Gijón, Sevilla…';
    input.style.cssText='display:none;width:100%;box-sizing:border-box;margin-top:8px;padding:11px 12px;border:1px solid #d8ddea;border-radius:11px;background:#fff;font:inherit';
    wrap.appendChild(input);
    const toggle=()=>{input.style.display=sel.value==='otro'?'block':'none';};
    sel.addEventListener('change',toggle); toggle();
  }

  function municipalName(){
    const v=$('municipio')?.value;
    if(v==='madrid') return 'Madrid';
    if(v==='zaragoza') return 'Zaragoza';
    if(v==='lleida') return 'Lleida';
    return $('municipioLibre')?.value?.trim() || 'tu municipio';
  }

  function reviewSection(){ return $('pb-review-v6'); }
  function setReviewVisibility(mode){
    const sec=reviewSection(); if(!sec) return;
    if(mode==='show'){sec.style.display='';return;}
    sec.style.display='none';
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

  function enhanceGenericResult(){
    const sel=$('municipio'); if(!sel) return;
    const panel=$('nonMadrid'); const text=$('nonMadridText'); const acts=$('nonMadridActions');
    if(!panel||!text||!acts) return;

    const value=sel.value;
    const cap=CAPS[value]||CAPS.otro;
    const m=municipalName();

    panel.querySelectorAll('.pb-muni-options,.pb-universal-note,.pb-pdf-choice').forEach(n=>n.remove());

    if(value==='madrid'){
      setReviewVisibility('show');
      return;
    }

    if(value==='lleida'){
      text.innerHTML='<strong>En Lleida no te mostramos una revisión de PDF porque este flujo no depende de una Hoja Padronal PDF como la de Madrid.</strong> Lo importante es elegir la vía correcta según tu situación.';
      acts.innerHTML='<a class="action" target="_blank" rel="noopener" href="https://www.paeria.cat/ca/serveis/padro">Servicio de Padró ↗</a><a class="action secondary" target="_blank" rel="noopener" href="https://tramits.paeria.cat/Ciutadania/">Trámites online ↗</a>';
      panel.insertAdjacentHTML('beforeend',optionsHtml('lleida'));
      setReviewVisibility('hide');
      return;
    }

    if(value==='zaragoza'){
      text.innerHTML='<strong>En Zaragoza priorizamos las vías oficiales disponibles y no mostramos un revisor PDF cuando no hay un formulario PDF que tenga sentido validar.</strong>';
      acts.innerHTML='<a class="action" target="_blank" rel="noopener" href="https://www.zaragoza.es/sede/servicio/tramite/22940">Alta por nacimiento ↗</a><a class="action secondary" target="_blank" rel="noopener" href="https://www.zaragoza.es/sede/servicio/tramite/23720">Volante/certificado ↗</a>';
      panel.insertAdjacentHTML('beforeend',optionsHtml('zaragoza'));
      setReviewVisibility('hide');
      return;
    }

    text.innerHTML=`Para <strong>${escapeHtml(m)}</strong> te llevamos primero a la fuente oficial. Como cada ayuntamiento funciona distinto, no damos por hecho que exista un formulario PDF.`;
    acts.innerHTML=`<a class="action" target="_blank" rel="noopener" href="${DIR}">Buscar portal oficial del ayuntamiento ↗</a>`;
    setReviewVisibility('hide');

    const choice=document.createElement('div');
    choice.className='notice pb-pdf-choice';
    choice.innerHTML='<strong>¿Tu ayuntamiento sí te ha dado un formulario PDF?</strong><br>Solo en ese caso puedes activar el revisor universal. Si no tienes PDF, ignora esta opción y sigue el trámite oficial.<div class="actions"><button class="action secondary" id="pb-enable-generic-pdf" type="button">Sí, tengo un PDF para revisar</button></div>';
    panel.appendChild(choice);
    $('pb-enable-generic-pdf')?.addEventListener('click',()=>{
      setReviewVisibility('show');
      reviewSection()?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  async function inspect(file){
    if(!window.pdfjsLib) throw new Error('pdfjs');
    const data=new Uint8Array(await file.arrayBuffer());
    const pdf=await window.pdfjsLib.getDocument({data}).promise;
    let text=''; let annotations=[]; let fields={};
    for(let i=1;i<=pdf.numPages;i++){
      const p=await pdf.getPage(i); const tc=await p.getTextContent();
      text+=' '+tc.items.map(x=>x.str||'').join(' ');
      const anns=await p.getAnnotations().catch(()=>[]); annotations=annotations.concat(anns);
    }
    try{fields=await pdf.getFieldObjects()||{};}catch(_){ }
    const flat=Object.entries(fields).flatMap(([name,list])=>(Array.isArray(list)?list:[list]).map(x=>({name,...x})));
    return {text:norm(text), objects:flat.concat(annotations)};
  }

  function genericChecks(doc){
    const objs=doc.objects||[];
    const picked=objs.filter(selected);
    const pickedSem=picked.map(o=>semantic(o));
    let causa={state:'unknown',title:'Causa del alta',detail:'No podemos confirmar automáticamente qué causa está marcada en este modelo municipal.'};
    if(pickedSem.some(s=>s.includes('nacimiento'))) causa={state:'ok',title:'Causa del alta',detail:'La selección “Nacimiento” aparece identificada en el PDF.'};
    else {
      const wrong=pickedSem.find(s=>/traslado|cambio.*domicilio|omision/.test(s));
      if(wrong){
        const label=wrong.includes('traslado')?'Traslado':wrong.includes('cambio')?'Cambio de domicilio':'Omisión';
        causa={state:'bad',title:'Causa del alta',detail:`El PDF parece tener seleccionada “${label}”. Revisa si para tu caso debe figurar “Nacimiento”.`};
      } else if(doc.text.includes('nacimiento')) causa={state:'unknown',title:'Causa del alta',detail:'El formulario contiene la opción “Nacimiento”, pero este modelo no expone la casilla con suficiente seguridad. Compruébala visualmente.'};
    }

    const filled=objs.filter(o=>!isButton(o)&&meaningful(fieldValue(o)));
    const semFilled=filled.map(o=>semantic(o));
    const hasName=semFilled.some(s=>/(nombre|name)/.test(s));
    const hasBirth=semFilled.some(s=>/(fecha.*nac|nacimiento|birth)/.test(s));
    const menor=(hasName&&hasBirth)?{state:'ok',title:'Datos del bebé',detail:'Detectamos datos cumplimentados compatibles con nombre y fecha de nacimiento.'}:{state:'unknown',title:'Datos del bebé',detail:'No podemos confirmar todos los datos del menor en este formulario. Revisa nombre, apellidos y fecha de nacimiento.'};
    const hasAddress=semFilled.some(s=>/(domicilio|direccion|via|calle|address)/.test(s));
    const domicilio=hasAddress?{state:'ok',title:'Domicilio',detail:'Detectamos información cumplimentada en campos relacionados con el domicilio.'}:{state:'unknown',title:'Domicilio',detail:'No podemos confirmar el domicilio automáticamente en este modelo. Revísalo visualmente.'};
    return [causa,domicilio,menor];
  }

  function draw(rows,out){
    const icons={ok:'✓',bad:'✕',unknown:'?'};
    out.innerHTML='';
    for(const r of rows){
      const d=document.createElement('div'); d.className=`pb-check ${r.state}`;
      d.innerHTML=`<div>${icons[r.state]||'?'}</div><div><strong>${r.title}</strong><small>${r.detail}</small></div>`; out.appendChild(d);
    }
    const bad=rows.some(r=>r.state==='bad'), unknown=rows.some(r=>r.state==='unknown');
    const s=document.createElement('div'); s.className='pb-review-summary';
    s.textContent=bad?'Hay un punto que conviene corregir antes de presentar.':unknown?'No detectamos un error claro, pero este formulario municipal requiere alguna revisión visual.':'Las comprobaciones automáticas principales no detectan problemas.';
    out.appendChild(s);
  }

  function bindUniversalReview(){
    const run=$('pb-review-run'); if(!run || run.dataset.universalBound) return;
    run.dataset.universalBound='1';
    run.addEventListener('click',async e=>{
      if($('municipio')?.value==='madrid') return;
      e.preventDefault(); e.stopImmediatePropagation();
      const file=$('pb-review-file')?.files?.[0], out=$('pb-review-results');
      if(!file){draw([{state:'unknown',title:'Selecciona un PDF',detail:'Elige primero el formulario de empadronamiento que quieres revisar.'}],out);return;}
      run.disabled=true; run.textContent='Revisando…'; out.innerHTML='';
      try{draw(genericChecks(await inspect(file)),out);}catch(_){draw([{state:'bad',title:'No se pudo revisar el PDF',detail:'Prueba a guardar de nuevo el formulario y vuelve a subirlo.'}],out);}finally{run.disabled=false;run.textContent='Revisar PDF';}
    },true);
  }

  function syncUi(){
    const v=$('municipio')?.value;
    if(v==='madrid') setReviewVisibility('show');
    else setReviewVisibility('hide');
    enhanceGenericResult();
  }

  function init(){
    ensureMunicipioLibre();
    $('resolver')?.addEventListener('click',()=>setTimeout(syncUi,0));
    $('municipio')?.addEventListener('change',()=>setTimeout(syncUi,0));
    $('municipioLibre')?.addEventListener('input',()=>setTimeout(enhanceGenericResult,0));
    const wait=()=>{
      bindUniversalReview();
      if($('pb-review-run')) syncUi(); else setTimeout(wait,80);
    };
    wait();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();