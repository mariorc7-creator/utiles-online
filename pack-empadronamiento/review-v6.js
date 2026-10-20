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

  // El PDF oficial de Madrid coloca, para cada persona, las cuatro causas en una cuadrícula 2x2:
  // fila superior: Omisión | Cambio domicilio
  // fila inferior: Nacimiento | Traslado residencia.
  // Para evitar falsos positivos, NO usamos el texto semántico del campo para decidir otra causa:
  // algunos lectores PDF exponen nombres/export values ambiguos. Identificamos exclusivamente la casilla
  // seleccionada más próxima a cada etiqueta visible del formulario y elegimos por distancia.
  function cause(doc){
    const p=(doc.pages||[])[0];
    if(!p) return {status:'unknown'};

    const labels = [
      {key:'nacimiento', re:/^\s*Nacimiento\s*$/i, label:'Nacimiento'},
      {key:'traslado', re:/^\s*Traslado\s+residencia\s*$/i, label:'Traslado de residencia'},
      {key:'cambio', re:/^\s*Cambio\s+domicilio\s*$/i, label:'Cambio de domicilio'},
      {key:'omision', re:/^\s*Omisi[oó]n\s*$/i, label:'Omisión'}
    ];

    const selected = (p.annotations||[]).filter(a=>isButton(a)&&isSelected(a)&&Array.isArray(a.rect));
    if(!selected.length) return {status:'missing'};

    const candidates=[];
    for(const lab of labels){
      for(const t of (p.textItems||[]).filter(x=>lab.re.test(x.str))){
        for(const a of selected){
          const cx=(a.rect[0]+a.rect[2])/2, cy=(a.rect[1]+a.rect[3])/2;
          const dx=cx-t.x, dy=cy-t.y;
          // En este formulario la casilla está a la derecha del texto. Ventana deliberadamente estrecha.
          if(Math.abs(dy)>9 || dx<0 || dx>95) continue;
          const score=Math.abs(dy)*5+Math.abs(dx);
          candidates.push({key:lab.key,label:lab.label,score});
        }
      }
    }

    if(!candidates.length) return {status:'unknown'};
    candidates.sort((a,b)=>a.score-b.score);
    const best=candidates[0];
    // Si las dos mejores interpretaciones están demasiado cerca, no inventamos una causa.
    if(candidates[1] && candidates[1].score-best.score < 3 && candidates[1].key!==best.key){
      return {status:'unknown',detail:'La casilla marcada no se puede distinguir con seguridad. Revisa visualmente la causa del alta.'};
    }
    if(best.key==='nacimiento') return {status:'ok'};
    return {status:'bad',detail:`Detectamos seleccionada “${best.label}”, no “Nacimiento”.`};
  }

  function nearestTextWidget(page,re,{yt=28,min=-30,max=360}={}){
    const labels=page.textItems.filter(t=>re.test(t.str)); const widgets=page.annotations.filter(a=>Array.isArray(a.rect)&&isText(a)); let best=null;
    for(const t of labels) for(const a of widgets){const cx=(a.rect[0]+a.rect[2])/2,cy=(a.rect[1]+a.rect[3])/2,dx=cx-t.x,dy=cy-t.y;if(Math.abs(dy)>yt||dx<min||dx>max)continue;const sc=Math.abs(dy)*4+Math.abs(dx);if(!best||sc<best.sc)best={a,sc};}
    return best?.a||null;
  }
  function address(doc){const p=doc.pages?.[0];if(!p)return{status:'unknown'};const street=nearestTextWidget(p,/Nombre de la vía/i,{yt:34,min:-35,max:420});const num=nearestTextWidget(p,/^\s*Número\s*$/i,{yt:34,min:-30,max:160});if(!street&&!num)return{status:'unknown'};const m=[];if(!street||!textValue(street))m.push('nombre de la vía');if(!num||!textValue(num))m.push('número');return m.length?{status:'missing',missing:m}:{status:'ok'};}
  function minor(doc){
    const p=doc.pages?.[0]; if(!p)return{status:'unknown'}; const pick=re=>nearestTextWidget(p,re,{yt:40,min:-40,max:380}); const name=pick(/^\s*Nombre\s*$/i), sur=pick(/1er Apellido/i), date=pick(/Fecha de nacimiento/i);
    if(!name&&!sur&&!date)return{status:'unknown'};const m=[];if(!name||!textValue(name))m.push('nombre');if(!sur||!textValue(sur))m.push('primer apellido');if(!date||!textValue(date))m.push('fecha de nacimiento');return m.length?{status:'missing',missing:m}:{status:'ok'};
  }
  function getCase(){const v=id=>$(id)?.value||'';return{convivencia:v('convivencia'),autorizacion:v('autorizacion'),edad:v('edad'),estado:v('estado'),urgencia:v('urgencia')};}
  function row(state,title,detail){const icons={ok:'✓',warn:'⚠️',bad:'✕',unknown:'?'};const d=document.createElement('div');d.className=`pb-check ${state}`;d.innerHTML=`<div>${icons[state]||'?'}</div><div><strong>${title}</strong><small>${detail}</small></div>`;return d;}
  function renderResult(target,doc){
    target.innerHTML=''; const c=getCase(); const ca=cause(doc), ad=address(doc), mi=minor(doc);
    target.appendChild(row(ca.status==='missing'?'warn':ca.status,'Causa del alta',ca.status==='ok'?'Nacimiento detectado correctamente.':ca.detail||'No hemos podido confirmar que esté marcada “Nacimiento”.'));
    target.appendChild(row(ad.status==='ok'?'ok':ad.status==='missing'?'warn':'unknown','Domicilio',ad.status==='ok'?'Vía y número parecen cumplimentados.':ad.status==='missing'?`Falta o no se detecta: ${ad.missing.join(', ')}.`:'No hemos podido comprobarlo automáticamente.'));
    target.appendChild(row(mi.status==='ok'?'ok':mi.status==='missing'?'warn':'unknown','Datos del bebé',mi.status==='ok'?'Nombre, primer apellido y fecha de nacimiento parecen cumplimentados.':mi.status==='missing'?`Falta o no se detecta: ${mi.missing.join(', ')}.`:'No hemos podido comprobarlos automáticamente.'));
    if(c.convivencia==='uno'&&c.autorizacion!=='si') target.appendChild(row('warn','Autorización/custodia','Tu caso requiere revisar la autorización, custodia o declaración responsable aplicable.'));
    if(c.edad==='mas1') target.appendChild(row('warn','Edad del menor','Para mayores de 1 año conviene revisar la vía específica antes de presentar.'));
    const statuses=[...target.children].map(x=>x.className);
    const bad=statuses.some(x=>x.includes(' bad')), warn=statuses.some(x=>x.includes(' warn')||x.includes(' unknown'));
    const s=document.createElement('div');s.className='pb-review-summary';s.textContent=bad?'Hay al menos un punto que conviene corregir antes de presentar.':warn?'El PDF parece encaminado, pero quedan puntos que requieren revisión visual.':'Las comprobaciones automáticas principales no detectan problemas.';target.appendChild(s);
  }

  function init(){
    styles();
    const anchor=$('nonMadrid')||$('resultadoWrap')||document.querySelector('main'); if(!anchor||$('pb-review-v6'))return;
    const sec=document.createElement('section');sec.id='pb-review-v6';sec.className='pb-review';sec.innerHTML=`<h2>3. Revisa tu PDF antes de presentarlo</h2><p class="pb-review-lead">Sube la Hoja Padronal que has rellenado y comprobaremos localmente algunos campos básicos. El archivo no se envía a nuestros servidores.</p><div class="pb-drop"><input id="pb-review-file" type="file" accept="application/pdf,.pdf"><div class="pb-review-actions"><button id="pb-review-run" class="pb-review-primary" type="button">Revisar PDF</button><button id="pb-review-clear" class="pb-review-secondary" type="button">Limpiar</button></div><div class="pb-privacy">🔒 La revisión se ejecuta en tu navegador.</div></div><div id="pb-review-results" class="pb-review-results"></div>`;
    anchor.insertAdjacentElement('afterend',sec);
    const file=$('pb-review-file'), run=$('pb-review-run'), clear=$('pb-review-clear'), out=$('pb-review-results');
    run.addEventListener('click',async()=>{if(!file.files?.[0]){out.innerHTML='';out.appendChild(row('warn','Selecciona un PDF','Elige primero la Hoja Padronal que quieres revisar.'));return;}run.disabled=true;run.textContent='Revisando…';out.innerHTML='';try{const doc=await inspect(file.files[0]);renderResult(out,doc);}catch(e){out.appendChild(row('bad','No se pudo revisar el PDF','Prueba a guardar de nuevo el formulario y vuelve a subirlo.'));}finally{run.disabled=false;run.textContent='Revisar PDF';}});
    clear.addEventListener('click',()=>{file.value='';out.innerHTML='';});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
