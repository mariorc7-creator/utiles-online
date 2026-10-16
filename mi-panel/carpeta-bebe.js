(() => {
  if (window.__pbCarpetaBebe) return;
  window.__pbCarpetaBebe = true;

  const panel = document.querySelector('.panel-grid .panel-card');
  if (!panel) return;
  const KEY='papelesbebe_documentos_v1';
  const docs=[
    {k:'identidad',icon:'🪪',name:'DNI/NIE de progenitores',uses:['Registro Civil','Empadronamiento','Ayudas']},
    {k:'nacimiento',icon:'📄',name:'Certificado / inscripción de nacimiento',uses:['Seguridad Social','Tarjeta sanitaria','Empadronamiento']},
    {k:'inss',icon:'🏛️',name:'Documento o reconocimiento de Seguridad Social',uses:['Tarjeta sanitaria']},
    {k:'padron',icon:'🏠',name:'Volante o certificado de padrón',uses:['Tarjeta sanitaria','Ayudas territoriales']},
    {k:'banco',icon:'🏦',name:'IBAN / titularidad bancaria',uses:['Prestaciones','Ayudas']},
    {k:'familia',icon:'👨‍👩‍👧',name:'Acreditación de situación familiar, si aplica',uses:['Ayudas','Deducciones']}
  ];
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(_){return {};}}
  function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(_){}}

  const style=document.createElement('style');
  style.textContent=`
    .pb-docs{margin:18px 0;padding:20px;border:1px solid #e2e5f2;border-radius:22px;background:#fff}.pb-docs-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}.pb-docs-head h2{margin:4px 0 4px}.pb-docs-progress{font-size:.86rem;font-weight:850;color:#5057c9;background:#f0f1ff;border-radius:999px;padding:7px 10px}.pb-docs-list{display:grid;gap:9px;margin-top:14px}.pb-doc{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:start;padding:12px 13px;border:1px solid #e8e9f1;border-radius:14px;background:#fff}.pb-doc input{width:20px;height:20px;margin-top:2px;accent-color:#6067e8}.pb-doc strong{display:block}.pb-doc small{display:block;color:#6f7382;margin-top:3px;line-height:1.35}.pb-doc.is-ready{background:#f6fbf8;border-color:#cfe6d8}.pb-doc-status{font-size:.7rem;font-weight:900;padding:4px 7px;border-radius:999px;background:#fff4dc;color:#775b18}.pb-doc.is-ready .pb-doc-status{background:#eaf7ef;color:#17633f}.pb-doc-insight{margin-top:13px;padding:12px 13px;border-radius:14px;background:#f8f8ff;border:1px solid #dfe1fb;color:#555b72}.pb-doc-insight strong{color:#252a4c}.pb-docs-foot{display:flex;gap:9px;flex-wrap:wrap;margin-top:12px}.pb-docs-foot a{display:inline-flex;padding:9px 12px;border-radius:11px;text-decoration:none;font-weight:850;background:#6067e8;color:#fff}.pb-docs-foot a.secondary{background:#fff;color:#4e54c8;border:1px solid #d4d7f3}@media(max-width:760px){.pb-doc{grid-template-columns:auto 1fr}.pb-doc-status{grid-column:2;width:max-content}.pb-docs-foot a{width:100%;box-sizing:border-box;justify-content:center}}
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.className='pb-docs'; section.id='mi-carpeta-bebe';
  section.innerHTML=`<div class="pb-docs-head"><div><span class="tool-kicker">MI CARPETA DEL BEBÉ</span><h2>Documentos preparados</h2><p style="margin:0;color:#6c7080">Marca lo que ya tienes localizado. Se guarda solo en este navegador.</p></div><span class="pb-docs-progress" id="pbDocsProgress">0/${docs.length} preparados</span></div><div class="pb-docs-list" id="pbDocsList"></div><div class="pb-doc-insight" id="pbDocsInsight"></div><div class="pb-docs-foot"><a href="/documentos-tramites-bebe/">Ver guía de documentos →</a><a class="secondary" href="/preparador-tarjeta-sanitaria/">Usar en Tarjeta Sanitaria</a></div>`;
  const today=document.getElementById('panelToday');
  if(today) today.insertAdjacentElement('afterend',section); else panel.insertBefore(section,panel.firstChild);

  const list=section.querySelector('#pbDocsList');
  list.innerHTML=docs.map(d=>`<label class="pb-doc" data-doc="${d.k}"><input type="checkbox" data-key="${d.k}"><div><strong>${d.icon} ${d.name}</strong><small>Te puede servir para: ${d.uses.join(', ')}.</small></div><span class="pb-doc-status">PENDIENTE</span></label>`).join('');
  const state=read();
  section.querySelectorAll('input[type=checkbox]').forEach(i=>{i.checked=!!state[i.dataset.key];i.addEventListener('change',render)});

  function render(){
    const s={}; let done=0;
    section.querySelectorAll('input[type=checkbox]').forEach(i=>{s[i.dataset.key]=i.checked;if(i.checked)done++;const row=i.closest('.pb-doc');row.classList.toggle('is-ready',i.checked);row.querySelector('.pb-doc-status').textContent=i.checked?'PREPARADO':'PENDIENTE';});
    save(s); section.querySelector('#pbDocsProgress').textContent=`${done}/${docs.length} preparados`;
    const missing=docs.filter(d=>!s[d.k]);
    const insight=section.querySelector('#pbDocsInsight');
    if(!missing.length) insight.innerHTML='<strong>Carpeta base preparada.</strong> Ya tienes localizados los documentos habituales. Cada trámite puede pedir algo adicional, así que confirma siempre la fuente oficial.';
    else if(!s.nacimiento) insight.innerHTML='<strong>Siguiente documento útil:</strong> localiza la inscripción/certificado de nacimiento. Es uno de los documentos que más desbloquea los siguientes pasos.';
    else if(!s.inss) insight.innerHTML='<strong>Para avanzar con salud:</strong> te conviene tener localizado el reconocimiento o documento de Seguridad Social del bebé.';
    else if(!s.padron) insight.innerHTML='<strong>Para varios trámites territoriales:</strong> revisa si ya dispones de volante o certificado de padrón.';
    else insight.innerHTML=`<strong>Te faltan ${missing.length} documentos base por localizar.</strong> Empieza por ${missing[0].name.toLowerCase()}.`;
  }
  render();
})();