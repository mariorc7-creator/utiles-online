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

  function normalizeValue(v) {
    return String(v ?? '').trim().toLowerCase();
  }

  function fieldHasValue(obj) {
    const vals = [obj?.value, obj?.fieldValue, obj?.buttonValue]
      .filter(v => v !== undefined && v !== null)
      .map(normalizeValue);
    return vals.some(v => v && !['off','false','0','none','null'].includes(v));
  }

  function widgetLabel(obj) {
    return [obj?.name,obj?.fieldName,obj?.alternativeText,obj?.exportValue,obj?.buttonValue,obj?.contents,obj?.fieldValue]
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

  function selectedBirthByPosition(doc) {
    for (const page of doc.pages || []) {
      const birthTexts = page.textItems.filter(t => /NACIM/i.test(t.str));
      if (!birthTexts.length) continue;
      for (const a of page.annotations || []) {
        if (!fieldHasValue(a) || !Array.isArray(a.rect)) continue;
        const cx = (a.rect[0] + a.rect[2]) / 2;
        const cy = (a.rect[1] + a.rect[3]) / 2;
        const nearBirth = birthTexts.some(t => Math.abs(t.y - cy) < 24 && Math.abs(t.x - cx) < 240);
        if (nearBirth) return true;
      }
    }
    return false;
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
    if (version) checks.push(['ok','Código del formulario detectado',`El PDF indica ${version}. No lo comparamos contra una versión fija para evitar falsos avisos cuando el Ayuntamiento actualiza el documento.`]);

    const fieldEntries = Object.entries(doc.fields || {});
    const flatFields = fieldEntries.flatMap(([name, list]) => (Array.isArray(list) ? list : [list]).map(x => ({name, ...x})));
    const filled = flatFields.filter(fieldHasValue);
    if (flatFields.length) checks.push(filled.length
      ? ['ok','Campos digitales detectados',`El PDF conserva ${filled.length} campo(s) con valor de ${flatFields.length} detectados.`]
      : ['unknown','Campos no verificables','El PDF contiene campos, pero el navegador no expone valores guardados suficientes para comprobarlos con fiabilidad.']);
    else checks.push(['unknown','Relleno automático limitado','Este PDF no expone campos editables al navegador. Podemos revisar estructura y algunas marcas, pero no todos los datos.']);

    const candidates = flatFields.concat(doc.annotations || []);
    const birthByMetadata = candidates.some(f => /NACIM/i.test(widgetLabel(f)) && fieldHasValue(f));
    const birthByPosition = selectedBirthByPosition(doc);
    const birthSelected = birthByMetadata || birthByPosition;
    checks.push(birthSelected
      ? ['ok','Causa del alta: Nacimiento','Detectamos una marca asociada a “Nacimiento” en el PDF.']
      : ['unknown','Causa del alta: no verificable automáticamente','No podemos confirmar esa marca con suficiente seguridad en este PDF. Revísala visualmente; no significa que esté mal.']);

    const sigAnnotations = doc.annotations.filter(a => /sig/i.test(String(a.fieldType || '')) && fieldHasValue(a));
    if (currentCase.convivencia === 'ambos') {
      checks.push(sigAnnotations.length >= 2
        ? ['ok','Firmas digitales detectadas','Detectamos al menos dos firmas digitales.']
        : ['unknown','Firmas: revisión visual','Las firmas manuscritas o aplanadas no siempre son detectables. Comprueba visualmente que estén las que correspondan.']);
    } else if (currentCase.convivencia === 'uno') {
      if (currentCase.autorizacion === 'no') checks.push(['bad','Posible bloqueo por autorización/custodia','Indicastes que se empadrona con un solo progenitor y no tienes autorización/custodia clara. Resuelve este punto antes de presentar.']);
      else checks.push(['warn','Revisa autorización/custodia','Al ir con un solo progenitor, confirma que adjuntas la autorización, resolución o declaración responsable que corresponda.']);
    }

    if (currentCase.edad === 'mas1') checks.push(['warn','Caso de más de un año','Madrid diferencia este supuesto. Revisa la vía indicada en el trámite oficial antes de presentar.']);
    if (currentCase.estado === 'si') checks.push(['warn','Quizá no necesitas presentar otra alta','Antes de enviar nada, confirma que no estás duplicando un alta que ya consta en padrón.']);
    if (currentCase.urgencia === 'si') checks.push(['warn','Necesitas justificante rápido','Confirma cómo obtener el volante/certificado que necesitas y conserva el resguardo.']);

    return checks;
  }

  function mount() {
    if ($('pb-review')) return;
    const anchor = document.querySelector('main .panel:last-of-type');
    if (!anchor || !anchor.parentNode) return;
    injectStyles();
    const section = document.createElement('section');
    section.id = 'pb-review';
    section.className = 'pb-review';
    section.innerHTML = `
      <span class="badge">🔍 REVISIÓN ANTES DE ENVIAR</span>
      <h2>3. Sube tu PDF y comprobamos posibles olvidos</h2>
      <p class="pb-review-lead">Comparamos el documento con la Hoja Padronal de Madrid y con el caso que acabas de preparar. Solo marcamos como error lo que podemos detectar con suficiente seguridad; cuando el PDF no expone una marca o firma, te diremos que requiere revisión visual.</p>
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
    anchor.parentNode.insertBefore(section, anchor);

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
        const currentCase = getCase();
        const checks = analyze(doc, currentCase);
        checks.forEach(c => addResult($('pb-review-results'), ...c));
        const strongIssues = checks.filter(c => c[0] === 'bad').length;
        const warnings = checks.filter(c => c[0] === 'warn').length;
        const unknowns = checks.filter(c => c[0] === 'unknown').length;
        const meta = $('pb-review-meta');
        meta.innerHTML = `<span>${doc.pdf.numPages} páginas</span><span>${Object.keys(doc.fields || {}).length} grupos de campos</span><span>${doc.annotations.length} anotaciones</span>`;
        meta.classList.remove('hidden');
        const summary = $('pb-review-summary');
        summary.textContent = strongIssues
          ? `Resultado: hay ${strongIssues} punto(s) que resolver antes de presentar.`
          : warnings
            ? `Resultado: no vemos un bloqueo automático claro; hay ${warnings} revisión(es) recomendadas${unknowns ? ` y ${unknowns} punto(s) que requieren comprobación visual` : ''}.`
            : unknowns
              ? `Resultado: no vemos incidencias automáticas claras. Hay ${unknowns} punto(s) que el PDF no permite verificar con seguridad y conviene revisar visualmente.`
              : 'Resultado: no vemos incidencias automáticas claras.';
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
