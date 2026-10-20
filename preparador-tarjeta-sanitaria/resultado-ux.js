/* Tarjeta sanitaria: recorrido claro y sin captación de datos personales. */
(() => {
  if(!location.pathname.startsWith('/api/preparar-tarjeta-sanitaria')) return;
  function init(){
    const main=document.querySelector('main.ts-main'); if(!main||document.getElementById('ts-ux-actions'))return;
    const sections=[...main.querySelectorAll(':scope > section.ts-panel')];
    const docs=sections.find(s=>s.querySelector('.ts-docs'));
    const route=sections.find(s=>s.id==='ts-ruta-real');
    const what=sections.find(s=>s.querySelector('.ts-result-head'));
    const after=sections.find(s=>s.querySelector('h2')?.textContent.includes('Cuando termines lo anterior'));
    const source=sections.find(s=>s.classList.contains('ts-source-box'));
    const completed=sections.find(s=>s.querySelector('h2')?.textContent.includes('Cuando lo completes'));
    if(!docs||!what||!source)return;
    const hero=main.querySelector('.ts-hero');
    const style=document.createElement('style');style.textContent=`
      .ts-ux-tools{padding:14px 17px;border:1px solid #d6dff1;background:#f8faff;border-radius:16px;margin:15px 0 20px}
      .ts-ux-tools>p{margin:0 0 11px;color:#48556f;line-height:1.55}
      .ts-ux-tools .ts-actions{display:flex;flex-wrap:wrap;gap:9px}
      .ts-ux-tools button{border:1px solid #abb4ed;background:white;color:#3c459d;border-radius:11px;padding:11px 15px;font-weight:800;cursor:pointer}
      .ts-ux-tools label{display:block;font-weight:700;margin:12px 0 4px}
      .ts-ux-tools input[type=date]{padding:9px;border-radius:8px;border:1px solid #bfc6da;max-width:100%}
      .ts-ux-check{display:flex;align-items:start;gap:10px;cursor:pointer;font-weight:700;color:#26354e;margin-bottom:6px}
      .ts-ux-check input{margin-top:3px;width:20px;height:20px;flex:0 0 20px;accent-color:#5258c3}
      .ts-ux-check span{display:block}.ts-doc.ts-ux-done{opacity:.68}
      .ts-ux-status{color:#4554a6;margin:9px 0;font-weight:750}
      .ts-ux-faq{margin:15px 0}.ts-ux-faq details{border:1px solid #dde2ed;border-radius:12px;padding:13px;margin:8px 0;background:#fff}
      .ts-ux-faq summary{font-weight:800;cursor:pointer}.ts-ux-faq p{line-height:1.6}
      .ts-ux-print-sheet{display:none}
      @media print {
        @page { size:A4; margin:15mm; }
        body > *{display:none!important}
        body > .ts-ux-print-sheet{display:block!important;font-family:Arial,sans-serif;color:#111;line-height:1.4;font-size:11pt}
        .ts-ux-print-sheet h1{font-size:20pt}.ts-ux-print-sheet li{margin-bottom:9pt}
      }`;
    document.head.appendChild(style);
    if(docs){docs.querySelector('h2').textContent='Paso 1 · Reúne lo necesario';docs.querySelector('.ts-badge')?.remove();hero.insertAdjacentElement('afterend',docs);}
    if(route){route.querySelector('h2').textContent='Paso 2 · Realiza los trámites en orden';docs.insertAdjacentElement('afterend',route);}
    else {source.querySelector('h2').textContent='Paso 2 · Abre el trámite oficial';docs.insertAdjacentElement('afterend',source);}
    if(route){
      const h=document.createElement('p');h.textContent='Cuando hayas reunido lo necesario, utiliza estos accesos directos. Elige el canal oficial según tu situación.';route.querySelector('h2')?.insertAdjacentElement('afterend',h);
      // El bloque de fuentes queda como alternativa secundaria para no ofrecer una doble ruta de prioridad.
      source.querySelector('h2').textContent='Enlaces de referencia y vías alternativas';
    }
    if(what){what.querySelector('h2').textContent='Tu situación: qué revisar ahora';if(route||!source) (route||docs).insertAdjacentElement('afterend',what);}
    if(after){what.insertAdjacentElement('afterend',after);}
    if(completed){completed.querySelector('h2').textContent='Paso 3 · Después de solicitarla';(after||what).insertAdjacentElement('afterend',completed);}
    const tools=document.createElement('section');tools.className='ts-ux-tools';tools.id='ts-ux-actions';tools.setAttribute('aria-label','Guardar e imprimir preparación');
    tools.innerHTML='<p><strong>Sin estrés:</strong> marca los documentos que ya tienes, imprime una hoja rápida o elige un recordatorio personal. No nos envías datos.</p><div class="ts-actions"><button type="button" id="ts-print">Imprimir / Guardar PDF</button><button type="button" id="ts-reset-docs">Desmarcar documentos</button></div><p class="ts-ux-status" id="ts-doc-progress" aria-live="polite"></p><details><summary style="cursor:pointer;font-weight:800">📅 Recordarme comprobar la solicitud</summary><label for="ts-remind-date">Elige el día que prefieras (no es un plazo legal)</label><input id="ts-remind-date" type="date"><div style="margin-top:9px"><button type="button" id="ts-remind-calendar">Abrir en Google Calendar ↗</button></div><p style="font-size:.83rem;color:#66718a">Se abrirá un evento sin datos del bebé. Tendrás que pulsar «Guardar» en Google Calendar. No enviamos SMS ni correos.</p></details>';
    docs.insertAdjacentElement('beforebegin',tools);
    const docCards=[...docs.querySelectorAll('.ts-doc')];
    const key='papelesbebe_tsi_docs_v2_'+(new URLSearchParams(location.search).get('comunidad')||'general');
    let saved={};try{saved=JSON.parse(sessionStorage.getItem(key)||'{}')||{}}catch(_){}
    function renderProgress(){
      let count=0;docCards.forEach((card,i)=>{const ch=card.querySelector('input.ts-ux-input');if(ch?.checked)count++;card.classList.toggle('ts-ux-done',!!ch?.checked);});
      document.getElementById('ts-doc-progress').textContent=count+' de '+docCards.length+' documentos comprobados';
    }
    docCards.forEach((card,i)=>{
      const title=card.querySelector('strong')?.textContent||'Documento';
      const label=document.createElement('label');label.className='ts-ux-check';
      const input=document.createElement('input');input.className='ts-ux-input';input.type='checkbox';input.checked=!!saved[i];
      const span=document.createElement('span');span.textContent='Ya tengo: '+title;label.append(input,span);card.prepend(label);
      input.addEventListener('change',()=>{saved[i]=input.checked;try{sessionStorage.setItem(key,JSON.stringify(saved));}catch(_){}renderProgress();});
    });
    renderProgress();
    document.getElementById('ts-reset-docs').addEventListener('click',()=>{saved={};try{sessionStorage.removeItem(key)}catch(_){}docCards.forEach(c=>c.querySelector('.ts-ux-input').checked=false);renderProgress();});
    const explanation=docCards.find(c=>/acreditaci[oó]n del derecho sanitario/i.test(c.textContent));
    if(explanation){const p=document.createElement('p');p.style.cssText='margin:6px 0 0;color:#4b5a73;line-height:1.5';p.textContent='¿Qué significa? Es la confirmación de que el bebé tiene reconocido su derecho a la asistencia sanitaria, habitualmente como beneficiario en el INSS. Comprueba primero si ya se gestionó en el hospital.';explanation.appendChild(p);}
    const faq=document.createElement('section');faq.className='ts-panel ts-ux-faq';
    faq.innerHTML='<h2>Preguntas habituales</h2><details><summary>¿Puede atender el pediatra al bebé antes de recibir la tarjeta física?</summary><p>En Cataluña, cuando la petición de TSI recibe una resolución favorable, CatSalut envía un resguardo provisional con CIP que permite acceder a centros y servicios sanitarios mientras llega la tarjeta. Si todavía no tienes resguardo o el bebé necesita atención, contacta con el CAP o el 061 Salut Respon; no retrases una atención urgente por falta de tarjeta.</p></details><details><summary>¿Y si no tengo certificado digital o Cl@ve?</summary><p>La Seguridad Social contempla la inclusión de beneficiarios presencialmente en un CAISS si no dispones de identificación electrónica. Para la TSI, CatSalut indica que puedes solicitarla presencialmente en tu CAP. Confirma documentación y disponibilidad de cita antes de acudir.</p></details><details><summary>¿Cuánto tarda en llegar la tarjeta?</summary><p>No podemos garantizar un número fijo de días. Si la solicitud requiere comprobaciones, puede quedar pendiente. Tras la resolución favorable, CatSalut comunica un resguardo provisional con CIP por correo electrónico y envía después la tarjeta física al domicilio.</p></details><p style="font-size:.85rem">Referencias: <a target="_blank" rel="noopener noreferrer" href="https://catsalut.gencat.cat/ca/coneix-catsalut/acces-sistema-salut/la-tsi/obtencio-tsi/">CatSalut: primera TSI ↗</a> · <a target="_blank" rel="noopener noreferrer" href="https://www.seg-social.es/wps/portal/wss/internet/FAQ?temaPregunta=Asistencia+sanitaria&amp;view=FAQs_detalle_tema">Seguridad Social: beneficiarios ↗</a>.</p>';
    (completed||source).insertAdjacentElement('afterend',faq);
    const sheet=document.createElement('article');sheet.className='ts-ux-print-sheet';sheet.setAttribute('aria-label','Resumen imprimible del trámite');
    sheet.innerHTML='<h1>Mi preparación: tarjeta sanitaria del bebé</h1><p>Resumen orientativo, sin datos personales. Comprueba requisitos y plazos en el organismo oficial.</p><h2>Paso 1 · Documentos</h2><ul id="ts-print-docs"></ul><h2>Paso 2 · Presentar la solicitud</h2><p>Verifica el alta en el INSS (si procede), el padrón y el canal oficial de tu comunidad. Cataluña: catsalut.gencat.cat</p><h2>Paso 3 · Seguimiento</h2><p>Comprueba el justificante, el centro sanitario y la asignación de pediatría.</p><p>Fuente oficial y guía: www.papelesdelbebe.es/preparador-tarjeta-sanitaria/</p>';
    document.body.appendChild(sheet);
    document.getElementById('ts-print').addEventListener('click',()=>{
      const list=sheet.querySelector('#ts-print-docs');list.replaceChildren();
      docCards.forEach(card=>{const li=document.createElement('li');const title=card.querySelector('strong')?.textContent||'Documento';li.textContent=(card.querySelector('.ts-ux-input')?.checked?'[Comprobado] ':'[Pendiente] ')+title;list.appendChild(li);});
      window.print();
    });
    document.getElementById('ts-remind-calendar').addEventListener('click',()=>{
      const date=document.getElementById('ts-remind-date').value;
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){document.getElementById('ts-remind-date').focus();return;}
      const compact=date.replace(/-/g,'');
      const url='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('Comprobar trámite tarjeta sanitaria')+'&dates='+compact+'/'+compact+'&details='+encodeURIComponent('Revisar resguardo y estado de solicitud. https://www.papelesdelbebe.es/preparador-tarjeta-sanitaria/');
      window.open(url,'_blank','noopener,noreferrer');
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();