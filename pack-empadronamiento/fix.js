(() => {
  const $ = (id) => document.getElementById(id);
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  function injectStyles() {
    if (document.getElementById('pb-review-styles')) return;
    const style = document.createElement('style');
    style.id = 'pb-review-styles';
    style.textContent = `
      .pb-review{border:1px solid #dfe3ff;border-radius:20px;background:linear-gradient(135deg,#fff,#f8f9ff);padding:22px;margin:18px 0}
      .pb-review h2{margin:.1rem 0 .45rem}.pb-review-lead{color:#687287;line-height:1.55;max-width:820px}
      .pb-drop{display:grid;gap:10px;border:2px dashed #c9cefb;border-radius:16px;padding:18px;background:#fff;margin-top:14px}
      .pb-drop input{max-width:100%}.pb-privacy{font-size:.84rem;color:#5f687a;background:#edf9f2;border-radius:11px;padding:10px}
      .pb-review-actions{display:flex;gap:9px;flex-wrap:wrap}.pb-review button{border:0;border-radius:11px;padding:11px 14px;font-weight:850;cursor:pointer}
      .pb-review-primary{background:#6067e8;color:#fff}.pb-review-secondary{background:#eef0ff;color:#4e56c6}
      .pb-review button:disabled{opacity:.55;cursor:not-allowed}.pb-review-status{margin-top:12px;color:#687287}
      .pb-review-results{display:grid;gap:10px;margin-top:16px}.pb-check{display:grid;grid-template-columns:34px 1fr;gap:10px;border:1px solid #e1e5ef;border-radius:13px;padding:12px;background:#fff}
      .pb-check-icon{font-size:1.15rem}.pb-check strong{display:block}.pb-check small{display:block;color:#687287;line-height:1.45;margin-top:3px}
      .pb-check.ok{border-color:#cde8d8;background:#f5fbf7}.pb-check.warn{border-color:#eadca8;background:#fffaf0}.pb-check.bad{border-color:#efc9c9;background:#fff5f5}.pb-check.unknown{background:#f7f8fb}
      .pb-review-summary{margin-top:14px;border-radius:14px;padding:14px;background:#182035;color:#f2f4fb;line-height:1.5}
      .pb-review-meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}.pb-review-meta span{font-size:.78rem;font-weight:800;background:#eef0ff;color:#4e56c6;padding:5px 8px;border-radius:999px}
      @media(max-width:700px){.pb-review{padding:17px}.pb-check{grid-template-columns:28px 1fr}}
      @media print{.pb-review{display:none!important}}
    `;
    document.head.appendChild(style);
  }

  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-pb-pdfjs]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.pdfjsLib), { once:true });
        existing.addEventListener('error', reject, { once:true });
        return;
      }
      const script = document.createElement('script');
      script.src = PDFJS;
      script.async = true;
      script.dataset.pbPdfjs = '1';
      script.onload = () => {
        if (!window.pdfjsLib) return reject(new Error('PDF.js no disponible'));
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER;
        resolve(window.pdfjsLib);
      };
      script.onerror = () => reject(new Error('No se pudo cargar el lector local de PDF'));
      document.head.appendChild(script);
    });
  }

  function getCase() {
    const v = (id) => $(id)?.value || '';
    return {
      municipio:v('municipio'), estado:v('estado'), edad:v('edad'), convivencia:v('convivencia'),
      padresAlta:v('padresAlta'), urgencia:v('urgencia'), canal:v('canal'), autorizacion:v('autorizacion')
    };
  }

  function norm(v) { return String(v ?? '').trim().toLowerCase(); }
  function meaningful(v) {
    const n = norm(v);
    return !!n && !['off','false','0','none','null','undefined'].includes(n);
  }
  function currentValue(obj) { return obj?.fieldValue ?? obj?.value; }
  function buttonExport(obj) { return obj?.buttonValue ?? obj?.exportValue; }
  function isButton(obj) {
    return obj?.fieldType === 'Btn' || obj?.checkBox === true || obj?.radioButton === true || buttonExport(obj) !== undefined;
  }
  function isTextWidget(obj) {
    return obj?.fieldType === 'Tx' || (!isButton(obj) && Array.isArray(obj?.rect));
  }
  function isSelectedButton(obj) {
    if (!isButton(obj)) return false;
    if (obj?.checked === true) return true;
    const cur = norm(currentValue(obj));
    if (!meaningful(cur)) return false;
    const exp = norm(buttonExport(obj));
    if (exp) return cur === exp;
    return ['yes','on','1','true','x','si','sí'].includes(cur);
  }
  function textValue(obj) {
    const v = currentValue(obj);
    return meaningful(v) ? String(v).trim() : '';
  }
  function labelText(obj) {
    return [obj?.name,obj?.fieldName,obj?.alternativeText,obj?.contents,obj?.exportValue,obj?.buttonValue]
      .filter(Boolean).join(' ').toUpperCase();
  }

  function addResult(container, state, title, detail) {
    const icons = {ok:'✓',warn:'⚠️',bad:'✕',unknown:'?'};
    const row = document.createElement('div');
    row.className = `pb-check ${state}`;
    row.innerHTML = `<div class="pb-check-icon">${icons[state]}</div><div><strong>${title}</strong><small>${detail}</small></div>`;
    container.appendChild(row);
  }

  async function inspectPdf(file) {
    const pdfjs = await loadPdfJs();
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data }).promise;
    let fullText = '';
    let annotations = [];
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      const pageAnnotations = await page.getAnnotations().catch(() => []);
      fullText += '\n' + text.items.map(x => x.str || '').join(' ');
      annotations = annotations.concat(pageAnnotations.map(a => ({...a, pageNumber:i})));
      pages.push({
        pageNumber:i,
        textItems:text.items.map(x => ({str:String(x.str || ''), x:x.transform?.[4] ?? 0, y:x.transform?.[5] ?? 0})),
        annotations:pageAnnotations
      });
    }
    let fields = {};
    try { fields = await pdf.getFieldObjects() || {}; } catch (_) {}
    return { pdf, text: fullText, annotations, fields, pages };
  }

  function nearestWidget(page, labelRegex, opts={}) {
    const labels = page.textItems.filter(t => labelRegex.test(t.str));
    const widgets = page.annotations.filter(a => Array.isArray(a.rect) && (opts.buttons ? isButton(a) : isTextWidget(a)));
    let best = null;
    for (const t of labels) {
      for (const a of widgets) {
        const cx = (a.rect[0] + a.rect[2]) / 2;
        const cy = (a.rect[1] + a.rect[3]) / 2;
        const dx = cx - t.x;
        const dy = cy - t.y;
        if (Math.abs(dy) > (opts.yTolerance ?? 32)) continue;
        if (dx < (opts.minDx ?? -35) || dx > (opts.maxDx ?? 360)) continue;
        const score = Math.abs(dy) * 4 + Math.abs(dx);
        if (!best || score < best.score) best = {annotation:a, score, label:t};
      }
    }
    return best?.annotation || null;
  }

  function causeSelection(doc) {
    const page = (doc.pages || [])[0];
    if (!page) return {status:'unknown'};
    const labels = {
      nacimiento:/^\s*Nacimiento\s*$/i,
      omision:/^\s*Omisión\s*$/i,
      cambio:/Cambio domicilio/i,
      traslado:/Traslado residencia/i
    };
    const found = {};
    for (const [key, re] of Object.entries(labels)) {
      const a = nearestWidget(page, re, {buttons:true, yTolerance:20, minDx:-55, maxDx:95});
      if (a) found[key] = isSelectedButton(a);
    }
    const selected = Object.entries(found).filter(([,v]) => v).map(([k]) => k);
    if (selected.includes('nacimiento') && selected.length === 1) return {status:'ok'};
    if (selected.includes('nacimiento') && selected.length > 1) return {status:'bad', detail:'Nacimiento está marcado, pero también detectamos otra causa del alta seleccionada.'};
    if (selected.length) return {status:'bad', detail:`Detectamos otra causa del alta marcada (${selected.join(', ')}), no “Nacimiento”.`};

    // Segundo intento: algunos PDF exponen el valor actual en el grupo de botones.
    const buttonFields = Object.entries(doc.fields || {}).flatMap(([name,list]) => (Array.isArray(list)?list:[list]).map(x=>({name,...x}))).filter(isButton);
    const actualBirth = buttonFields.some(f => /NACIM/i.test(String(currentValue(f) || '')) && meaningful(currentValue(f)));
    if (actualBirth) return {status:'ok'};
    return {status:'missing'};
  }

  function checkAddress(doc) {
    const page = (doc.pages || [])[0];
    if (!page) return {status:'unknown'};
    const street = nearestWidget(page, /Nombre de la vía/i, {yTolerance:34, minDx:-35, maxDx:420});
    const number = nearestWidget(page, /^\s*Número\s*$/i, {yTolerance:34, minDx:-30, maxDx:160});
    if (!street && !number) return {status:'unknown'};
    const missing = [];
    if (!street || !textValue(street)) missing.push('nombre de la vía');
    if (!number || !textValue(number)) missing.push('número');
    return missing.length ? {status:'missing', missing} : {status:'ok'};
  }

  function checkMinorCore(doc) {
    const page = (doc.pages || [])[0];
    if (!page) return {status:'unknown'};
    // Usamos los primeros campos personales del bloque Nº Orden 1; no damos OK si no podemos mapearlos con seguridad.
    const candidates = page.annotations.filter(a => isTextWidget(a) && Array.isArray(a.rect));
    const labels = page.textItems;
    const order1 = labels.find(t => /^\s*1\s*$/.test(t.str));
    if (!order1) return {status:'unknown'};
    const band = candidates.filter(a => {
      const cy = (a.rect[1] + a.rect[3]) / 2;
      return cy < order1.y + 85 && cy > order1.y - 230;
    });
    const valueNear = (re) => {
      const ls = labels.filter(t => re.test(t.str) && t.y < order1.y + 85 && t.y > order1.y - 230);
      let best = null;
      for (const t of ls) for (const a of band) {
        const cx=(a.rect[0]+a.rect[2])/2, cy=(a.rect[1]+a.rect[3])/2;
        const dx=cx-t.x, dy=cy-t.y;
        if (Math.abs(dy)>35 || dx < -35 || dx > 380) continue;
        const score=Math.abs(dy)*4+Math.abs(dx);
        if(!best||score<best.score) best={a,score};
      }
      return best?.a || null;
    };
    const firstName = valueNear(/^\s*Nombre\s*$/i);
    const surname = valueNear(/1er Apellido/i);
    const birthDate = valueNear(/Fecha de nacimiento/i);
    if (!firstName && !surname && !birthDate) return {status:'unknown'};
    const missing=[];
    if(!firstName || !textValue(firstName)) missing.push('nombre');
    if(!surname || !textValue(surname)) missing.push('primer apellido');
    if(!birthDate || !textValue(birthDate)) missing.push('fecha de nacimiento');
    return missing.length ? {status:'missing', missing} : {status:'ok'};
  }

  function analyze(doc, currentCase) {
    const text = (doc.text || '').toUpperCase().replace(/\s+/g,' ');
    const checks = [];
    const officialSignals = ['PADRÓN MUNICIPAL DE HABITANTES','CAUSA DEL ALTA','AUTORIZACIÓN DE EMPADRONAMIENTO','INSTRUCCIONES PARA CUMPLIMENTAR LA HOJA'];
    const signalCount = officialSignals.filter(s => text.includes(s)).length;
    checks.push(signalCount >= 2
      ? ['ok','Documento reconocido','La estructura coincide con la Hoja Padronal de Madrid.']
      : ['bad','Documento no reconocido','No encuentro suficientes elementos de la Hoja Padronal de Madrid. Comprueba que has subido el documento correcto.']);

    const version = (text.match(/HP\d{8}/) || [])[0];
    if (version) checks.push(['ok','Código del formulario detectado',`El PDF indica ${version}.`]);

    const address = checkAddress(doc);
    if (address.status === 'ok') checks.push(['ok','Domicilio básico completo','Detectamos informados el nombre de la vía y el número. Revisa también portal, escalera, planta y puerta cuando correspondan.']);
    else if (address.status === 'missing') checks.push(['warn','Domicilio incompleto',`Falta o no podemos leer: ${address.missing.join(', ')}.`]);
    else checks.push(['unknown','Domicilio: revisión visual','No podemos mapear con suficiente seguridad los campos de domicilio en este PDF.']);

    const minor = checkMinorCore(doc);
    if (minor.status === 'ok') checks.push(['ok','Datos básicos del menor completos','Detectamos nombre, primer apellido y fecha de nacimiento en el primer bloque de persona.']);
    else if (minor.status === 'missing') checks.push(['warn','Datos del menor incompletos',`Falta o no podemos leer: ${minor.missing.join(', ')}.`]);
    else checks.push(['unknown','Datos del menor: revisión visual','No podemos mapear con suficiente seguridad todos los campos básicos del menor.']);

    const cause = causeSelection(doc);
    if (cause.status === 'ok') checks.push(['ok','Causa del alta: Nacimiento','Detectamos “Nacimiento” como causa seleccionada.']);
    else if (cause.status === 'bad') checks.push(['bad','Causa del alta incorrecta',cause.detail]);
    else checks.push(['warn','Falta marcar la causa del alta: Nacimiento','No detectamos “Nacimiento” seleccionado. Para un recién nacido, marca esa casilla antes de presentar.']);

    const sigAnnotations = doc.annotations.filter(a => a?.fieldType === 'Sig' && meaningful(currentValue(a)));
    if (currentCase.convivencia === 'ambos') {
      checks.push(sigAnnotations.length >= 2
        ? ['ok','Firmas digitales detectadas','Detectamos al menos dos firmas digitales.']
        : ['unknown','Firmas: revisión visual','Las firmas manuscritas o aplanadas no siempre son detectables. Comprueba visualmente las firmas que correspondan.']);
    } else if (currentCase.convivencia === 'uno') {
      if (currentCase.autorizacion === 'no') checks.push(['bad','Posible bloqueo por autorización/custodia','Indicaste que se empadrona con un solo progenitor y no tienes autorización/custodia clara. Resuelve este punto antes de presentar.']);
      else checks.push(['warn','Revisa autorización/custodia','Al ir con un solo progenitor, confirma que adjuntas la autorización, resolución o declaración responsable que corresponda.']);
    }

    if (currentCase.edad === 'mas1') checks.push(['warn','Caso de más de un año','Madrid diferencia este supuesto. Revisa la vía indicada en el trámite oficial antes de presentar.']);
    if (currentCase.estado === 'si') checks.push(['warn','Quizá no necesitas presentar otra alta','Antes de enviar nada, confirma que no estás duplicando un alta que ya consta en padrón.']);
    if (currentCase.urgencia === 'si') checks.push(['warn','Necesitas justificante rápido','Confirma cómo obtener el volante/certificado que necesitas y conserva el resguardo.']);
    return checks;
  }

  function mount() {
    if ($('pb-review')) return;
    const container = $('resultadoWrap');
    if (!container) return;
    injectStyles();
    const section = document.createElement('section');
    section.id = 'pb-review';
    section.className = 'pb-review';
    section.innerHTML = `
      <span class="badge">🔍 REVISIÓN ANTES DE ENVIAR</span>
      <h2>3. Sube tu PDF y comprobamos posibles olvidos</h2>
      <p class="pb-review-lead">Revisamos la causa del alta, datos básicos del domicilio y del menor, además de los avisos de tu caso. Solo damos un ✓ cuando podemos detectar el dato con suficiente seguridad.</p>
      <div class="pb-drop">
        <label for="pb-review-file"><strong>Adjunta el PDF que vas a presentar</strong></label>
        <input id="pb-review-file" type="file" accept="application/pdf,.pdf">
        <div class="pb-privacy">🔒 <strong>Privacidad:</strong> el PDF se procesa en tu navegador. No lo subimos a Papeles del Bebé ni guardamos su contenido.</div>
        <div class="pb-review-actions"><button id="pb-review-run" class="pb-review-primary" type="button" disabled>Revisar mi PDF →</button><button id="pb-review-clear" class="pb-review-secondary" type="button">Quitar PDF</button></div>
        <div id="pb-review-status" class="pb-review-status">Selecciona un PDF para empezar.</div>
      </div>
      <div id="pb-review-meta" class="pb-review-meta hidden"></div>
      <div id="pb-review-results" class="pb-review-results"></div>
      <div id="pb-review-summary" class="pb-review-summary hidden"></div>
    `;
    container.appendChild(section);

    const input = $('pb-review-file');
    const run = $('pb-review-run');
    const clear = $('pb-review-clear');
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      run.disabled = !file;
      $('pb-review-status').textContent = file ? `${file.name} · ${(file.size/1024).toFixed(0)} KB · listo para revisar` : 'Selecciona un PDF para empezar.';
    });
    clear.addEventListener('click', () => {
      input.value = '';
      run.disabled = true;
      $('pb-review-status').textContent = 'PDF retirado del navegador.';
      $('pb-review-results').innerHTML = '';
      $('pb-review-meta').innerHTML = '';
      $('pb-review-meta').classList.add('hidden');
      $('pb-review-summary').classList.add('hidden');
    });
    run.addEventListener('click', async () => {
      const file = input.files?.[0];
      if (!file) return;
      run.disabled = true;
      $('pb-review-status').textContent = 'Analizando localmente…';
      $('pb-review-results').innerHTML = '';
      try {
        const doc = await inspectPdf(file);
        const checks = analyze(doc, getCase());
        checks.forEach(c => addResult($('pb-review-results'), ...c));
        const bad = checks.filter(c => c[0] === 'bad').length;
        const warn = checks.filter(c => c[0] === 'warn').length;
        const unknown = checks.filter(c => c[0] === 'unknown').length;
        const meta = $('pb-review-meta');
        meta.innerHTML = `<span>${doc.pdf.numPages} páginas</span><span>${Object.keys(doc.fields || {}).length} grupos de campos</span><span>${doc.annotations.length} anotaciones</span>`;
        meta.classList.remove('hidden');
        const summary = $('pb-review-summary');
        summary.textContent = bad
          ? `Resultado: hay ${bad} problema(s) claro(s) y ${warn} punto(s) que revisar antes de presentar.`
          : warn
            ? `Resultado: hay ${warn} punto(s) que revisar antes de presentar${unknown ? ` y ${unknown} comprobación(es) visuales` : ''}.`
            : unknown
              ? `Resultado: no detectamos incidencias claras, pero quedan ${unknown} comprobación(es) visuales.`
              : 'Resultado: no detectamos incidencias automáticas claras.';
        summary.classList.remove('hidden');
        $('pb-review-status').textContent = 'Revisión terminada. El archivo sigue únicamente en tu navegador.';
      } catch (err) {
        console.error('PDF review error', err);
        addResult($('pb-review-results'),'bad','No hemos podido leer este PDF','Prueba a guardar una copia nueva del documento en PDF. Si es una foto/escaneo, la revisión automática será limitada.');
        $('pb-review-status').textContent = 'No se ha podido completar la revisión.';
      } finally {
        run.disabled = !input.files?.[0];
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once:true });
  else mount();
})();
