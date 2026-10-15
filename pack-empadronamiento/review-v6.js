(() => {
  const $ = id => document.getElementById(id);
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const norm = v => String(v ?? '').trim().toLowerCase();
  const meaningful = v => {
    const n = norm(v);
    return !!n && !['off','false','0','none','null','undefined'].includes(n);
  };
  const currentValue = o => o?.fieldValue ?? o?.value;
  const exportValue = o => o?.buttonValue ?? o?.exportValue;
  const isButton = o => o?.fieldType === 'Btn' || o?.checkBox === true || o?.radioButton === true || exportValue(o) !== undefined;
  const isText = o => o?.fieldType === 'Tx' || (!isButton(o) && Array.isArray(o?.rect));
  const isSelected = o => {
    if (!isButton(o)) return false;
    if (o?.checked === true) return true;
    const cur = norm(currentValue(o));
    if (!meaningful(cur)) return false;
    const exp = norm(exportValue(o));
    if (exp) return cur === exp;
    return ['yes','on','1','true','x','si','sí'].includes(cur);
  };
  const textValue = o => meaningful(currentValue(o)) ? String(currentValue(o)).trim() : '';
  const semantic = o => [o?.name,o?.fieldName,o?.alternativeText,o?.contents,o?.exportValue,o?.buttonValue,currentValue(o)].filter(Boolean).join(' ').toUpperCase();

  function styles(){
    if ($('pb-review-v6-style')) return;
    const s=document.createElement('style'); s.id='pb-review-v6-style'; s.textContent=`
      .pb-review{border:1px solid #dfe3ff;border-radius:20px;background:linear-gradient(135deg,#fff,#f8f9ff);padding:22px;margin:18px 0}
      .pb-review h2{margin:.1rem 0 .45rem}.pb-review-lead{color:#687287;line-height:1.55;max-width:820px}
      .pb-drop{display:grid;gap:10px;border:2px dashed #c9cefb;border-radius:16px;padding:18px;background:#fff;margin-top:14px}
      .pb-privacy{font-size:.84rem;color:#5f687a;background:#edf9f2;border-radius:11px;padding:10px}.pb-review-actions{display:flex;gap:9px;flex-wrap:wrap}
      .pb-review button{border:0;border-radius:11px;padding:11px 14px;font-weight:850;cursor:pointer}.pb-review-primary{background:#6067e8;color:#fff}.pb-review-secondary{background:#eef0ff;color:#4e56c6}
      .pb-review button:disabled{opacity:.55}.pb-review-results{display:grid;gap:10px;margin-top:16px}.pb-check{display:grid;grid-template-columns:34px 1fr;gap:10px;border:1px solid #e1e5ef;border-radius:13px;padding:12px;background:#fff}
      .pb-check.ok{border-color:#cde8d8;background:#f5fbf7}.pb-check.warn{border-color:#eadca8;background:#fffaf0}.pb-check.bad{border-color:#efc9c9;background:#fff5f5}.pb-check.unknown{background:#f7f8fb}
      .pb-check strong{display:block}.pb-check small{display:block;color:#687287;line-height:1.45;margin-top:3px}.pb-review-summary{margin-top:14px;border-radius:14px;padding:14px;background:#182035;color:#f2f4fb}
      .pb-review-meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}.pb-review-meta span{font-size:.78rem;font-weight:800;background:#eef0ff;color:#4e56c6;padding:5px 8px;border-radius:999px}
    `; document.head.appendChild(s);
  }

  async function loadPdf(){
    if(window.pdfjsLib) return window.pdfjsLib;
    await new Promise((res,rej)=>{const s=document.createElement('script');s.src=PDFJS;s.onload=res;s.onerror=rej;document.head.appendChild(s);});
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=WORKER; return window.pdfjsLib;
  }

  async function inspect(file){
    const pdfjs=await loadPdf(); const data=new Uint8Array(await file.arrayBuffer()); const pdf=await pdfjs.getDocument({data}).promise;
    let text=''; const pages=[]; let annotations=[];
    for(let i=1;i<=pdf.numPages;i++){
      const p=await pdf.getPage(i); const tc=await p.getTextContent(); const anns=await p.getAnnotations().catch(()=>[]);
      const textItems=tc.items.map(x=>({str:String(x.str||''),x:x.transform?.[4]??0,y:x.transform?.[5]??0}));
      text+='\n'+textItems.map(x=>x.str).join(' '); pages.push({pageNumber:i,textItems,annotations:anns}); annotations=annotations.concat(anns.map(a=>({...a,pageNumber:i})));
    }
    let fields={}; try{fields=await pdf.getFieldObjects()||{};}catch(_){ }
    return {pdf,text,pages,annotations,fields};
  }

  function flattenFields(doc){return Object.entries(doc.fields||{}).flatMap(([name,list])=>(Array.isArray(list)?list:[list]).map(x=>({name,...x})));}

  function cause(doc){
    const buttons=flattenFields(doc).concat(doc.annotations||[]).filter(isButton);
    const selected=buttons.filter(isSelected);
    const semanticSelected=selected.map(o=>semantic(o));
    if(semanticSelected.some(s=>/NACIM/.test(s))) return {status:'ok'};
    const namedWrong=semanticSelected.find(s=>/TRASLADO|CAMBIO\s+DOMICILIO|OMISI[ÓO]N/.test(s));
    if(namedWrong){
      const label=/TRASLADO/.test(namedWrong)?'Traslado de residencia':/CAMBIO\s+DOMICILIO/.test(namedWrong)?'Cambio de domicilio':'Omisión';
      return {status:'bad',detail:`Detectamos seleccionada “${label}”, no “Nacimiento”.`};
    }
    // Fallback geométrico MUY estricto: solo puede confirmar Nacimiento; nunca identifica otra causa.
    const p=(doc.pages||[])[0]; if(!p) return {status:'unknown'};
    const labels=p.textItems.filter(t=>/^\s*Nacimiento\s*$/i.test(t.str));
    for(const t of labels){
      for(const a of p.annotations||[]){
        if(!isSelected(a)||!Array.isArray(a.rect)) continue;
        const cx=(a.rect[0]+a.rect[2])/2, cy=(a.rect[1]+a.rect[3])/2;
        const dx=cx-t.x, dy=cy-t.y;
        if(Math.abs(dy)<=7 && dx>=-32 && dx<=8) return {status:'ok'};
      }
    }
    return {status:'missing'};
  }

  function nearestTextWidget(page,re,{yt=28,min=-30,max=360}={}){
    const labels=page.textItems.filter(t=>re.test(t.str)); const widgets=page.annotations.filter(a=>Array.isArray(a.rect)&&isText(a)); let best=null;
    for(const t of labels) for(const a of widgets){const cx=(a.rect[0]+a.rect[2])/2,cy=(a.rect[1]+a.rect[3])/2,dx=cx-t.x,dy=cy-t.y;if(Math.abs(dy)>yt||dx<min||dx>max)continue;const sc=Math.abs(dy)*4+Math.abs(dx);if(!best||sc<best.sc)best={a,sc};}
    return best?.a||null;
  }
  function address(doc){const p=doc.pages?.[0];if(!p)return{status:'unknown'};const street=nearestTextWidget(p,/Nombre de la vía/i,{yt:34,min:-35,max:420});const num=nearestTextWidget(p,/^\s*Número\s*$/i,{yt:34,min:-30,max:160});if(!street&&!num)return{status:'unknown'};const m=[];if(!street||!textValue(street))m.push('nombre de la vía');if(!num||!textValue(num))m.push('número');return m.length?{status:'missing',missing:m}:{status:'ok'};}
  function minor(doc){
    const p=doc.pages?.[0]; if(!p)return{status:'unknown'}; const widgets=p.annotations.filter(a=>isText(a)&&Array.isArray(a.rect));
    const pick=re=>nearestTextWidget(p,re,{yt:40,min:-40,max:380}); const name=pick(/^\s*Nombre\s*$/i), sur=pick(/1er Apellido/i), date=pick(/Fecha de nacimiento/i);
    if(!name&&!sur&&!date)return{status:'unknown'};const m=[];if(!name||!textValue(name))m.push('nombre');if(!sur||!textValue(sur))m.push('primer apellido');if(!date||!textValue(date))m.push('fecha de nacimiento');return m.length?{status:'missing',missing:m}:{status:'ok'};
  }
  function getCase(){const v=id=>$(id)?.value||'';return{convivencia:v('convivencia'),autorizacion:v('autorizacion'),edad:v('edad'),estado:v('estado'),urgencia:v('urgencia')};}
  function row(c,state,title,detail){const icons={ok:'✓',warn:'⚠️',bad:'✕',unknown:'?'};const d=document.createElement('div');d.className=`pb-check ${state}`;d.innerHTML=`<div>${icons[state]}</div><div><strong>${title}</strong><small>${detail}</small></div>`;c.appendChild(d);}
  function analyze(doc,c){
    const out=[];const text=(doc.text||'').toUpperCase();const signals=['PADRÓN MUNICIPAL DE HABITANTES','CAUSA DEL ALTA','INSTRUCCIONES PARA CUMPLIMENTAR LA HOJA'];const n=signals.filter(s=>text.includes(s)).length;out.push(n>=2?['ok','Documento reconocido','La estructura coincide con la Hoja Padronal de Madrid.']:['bad','Documento no reconocido','No reconocemos con suficiente seguridad la Hoja Padronal de Madrid.']);
    const ver=(text.match(/HP\d{8}/)||[])[0];if(ver)out.push(['ok','Código del formulario detectado',`El PDF indica ${ver}.`]);
    const a=address(doc);out.push(a.status==='ok'?['ok','Domicilio básico completo','Detectamos nombre de la vía y número.']:a.status==='missing'?['warn','Domicilio incompleto',`Falta o no podemos leer: ${a.missing.join(', ')}.`]:['unknown','Domicilio: revisión visual','No podemos mapear con suficiente seguridad el domicilio.']);
    const m=minor(doc);out.push(m.status==='ok'?['ok','Datos básicos del menor completos','Detectamos nombre, primer apellido y fecha de nacimiento.']:m.status==='missing'?['warn','Datos del menor incompletos',`Falta o no podemos leer: ${m.missing.join(', ')}.`]:['unknown','Datos del menor: revisión visual','No podemos mapear con suficiente seguridad todos los datos básicos del menor.']);
    const ca=cause(doc);out.push(ca.status==='ok'?['ok','Causa del alta: Nacimiento','Detectamos “Nacimiento” seleccionado.']:ca.status==='bad'?['bad','Causa del alta incorrecta',ca.detail]:['warn','Causa del alta: comprueba Nacimiento','No podemos confirmar que “Nacimiento” esté seleccionado. Revísalo antes de presentar.']);
    if(c.convivencia==='uno')out.push(c.autorizacion==='no'?['bad','Autorización/custodia pendiente','Has indicado que no tienes autorización/custodia clara.']:['warn','Revisa autorización/custodia','Confirma que adjuntas la documentación que corresponda.']);
    if(c.edad==='mas1')out.push(['warn','Caso de más de un año','Revisa la vía específica de Madrid antes de presentar.']);
    return out;
  }

  function mount(){
    const old=$('pb-review'); if(old) old.remove(); const container=$('resultadoWrap'); if(!container)return; styles();
    const s=document.createElement('section');s.id='pb-review';s.className='pb-review';s.innerHTML=`<span class="badge">🔍 REVISIÓN ANTES DE ENVIAR</span><h2>3. Sube tu PDF y comprobamos posibles olvidos</h2><p class="pb-review-lead">Revisamos el PDF con criterios conservadores: solo damos ✓ cuando podemos identificar el dato con suficiente seguridad.</p><div class="pb-drop"><label><strong>Adjunta el PDF que vas a presentar</strong></label><input id="pb-review-file" type="file" accept="application/pdf,.pdf"><div class="pb-privacy">🔒 El PDF se procesa en tu navegador y no se guarda.</div><div class="pb-review-actions"><button id="pb-review-run" class="pb-review-primary" disabled>Revisar mi PDF →</button><button id="pb-review-clear" class="pb-review-secondary">Quitar PDF</button></div><div id="pb-review-status">Selecciona un PDF para empezar.</div></div><div id="pb-review-meta" class="pb-review-meta hidden"></div><div id="pb-review-results" class="pb-review-results"></div><div id="pb-review-summary" class="pb-review-summary hidden"></div>`;
    container.appendChild(s);const inp=$('pb-review-file'),run=$('pb-review-run');inp.onchange=()=>{run.disabled=!inp.files?.[0];$('pb-review-status').textContent=inp.files?.[0]?`${inp.files[0].name} · listo para revisar`:'Selecciona un PDF para empezar.'};$('pb-review-clear').onclick=()=>{inp.value='';run.disabled=true;$('pb-review-results').innerHTML='';$('pb-review-summary').classList.add('hidden');$('pb-review-meta').classList.add('hidden');};
    run.onclick=async()=>{if(!inp.files?.[0])return;run.disabled=true;$('pb-review-status').textContent='Analizando localmente…';$('pb-review-results').innerHTML='';try{const doc=await inspect(inp.files[0]);const checks=analyze(doc,getCase());checks.forEach(x=>row($('pb-review-results'),...x));const bad=checks.filter(x=>x[0]==='bad').length,warn=checks.filter(x=>x[0]==='warn').length,unk=checks.filter(x=>x[0]==='unknown').length;$('pb-review-meta').innerHTML=`<span>${doc.pdf.numPages} páginas</span><span>${Object.keys(doc.fields||{}).length} grupos de campos</span>`;$('pb-review-meta').classList.remove('hidden');$('pb-review-summary').textContent=bad?`Resultado: hay ${bad} punto(s) que resolver antes de presentar.`:warn?`Resultado: hay ${warn} punto(s) que revisar antes de presentar${unk?` y ${unk} comprobación(es) visuales`:''}.`:unk?`Resultado: hay ${unk} punto(s) que requieren revisión visual.`:'Resultado: no vemos incidencias automáticas claras.';$('pb-review-summary').classList.remove('hidden');$('pb-review-status').textContent='Revisión terminada.';}catch(e){console.error(e);row($('pb-review-results'),'bad','No hemos podido leer este PDF','Prueba a guardar una copia nueva del documento.');}finally{run.disabled=!inp.files?.[0];}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();