(() => {
  // UX 3.1 tiene una vista única de resultados. No reinsertar la duplicación antigua.
  if (document.getElementById('pbAidEdit')) return;
  const form=document.getElementById('simuladorForm');
  const resultados=document.getElementById('resultados');
  if(!form||!resultados||window.__pbAidValueV2)return;
  window.__pbAidValueV2=true;

  const style=document.createElement('style');
  style.textContent=`
    .sim-value{display:none;margin-top:16px;padding:18px;border:1px solid #dfe2fb;border-radius:18px;background:linear-gradient(135deg,#fff,#f7f7ff)}.sim-value.show{display:block}.sim-value-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}.sim-value h3{margin:4px 0}.sim-value p{margin:0;color:#676c7d}.sim-value-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}.sim-value-stat{padding:13px;border:1px solid #e7e8f2;border-radius:14px;background:#fff}.sim-value-stat strong{display:block;font-size:1.4rem;color:#4d52c8}.sim-value-stat span{font-size:.82rem;color:#727789}.sim-value-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.sim-value-btn{border:0;border-radius:11px;padding:10px 13px;background:#6067e8;color:#fff!important;font-weight:850;text-decoration:none;cursor:pointer}.sim-value-btn.secondary{background:#fff;color:#4f56c9!important;border:1px solid #d5d8f7}.sim-next-list{display:grid;gap:8px;margin-top:12px}.sim-next-item{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:11px;border-radius:13px;background:#fff;border:1px solid #e9eaf2}.sim-next-item span:first-child{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:#eef0ff;color:#5058c5;font-weight:900}.sim-next-item a{font-size:.82rem;font-weight:850;text-decoration:none}.sim-share-feedback{font-size:.8rem;color:#287248;font-weight:800}@media(max-width:700px){.sim-value-grid{grid-template-columns:1fr}.sim-next-item{grid-template-columns:auto 1fr}.sim-next-item a{grid-column:2}.sim-value-btn{width:100%;box-sizing:border-box;text-align:center}}
  `;
  document.head.appendChild(style);

  const value=document.createElement('section');
  value.className='sim-value';value.id='simValueV2';value.setAttribute('aria-live','polite');
  value.innerHTML='<div class="sim-value-head"><div><span class="tool-kicker">TU MAPA DE OPORTUNIDADES</span><h3 id="simValueTitle">Resultado listo</h3><p id="simValueText">Te ayudamos a convertir el resultado en acciones concretas.</p></div><div><button id="simShare" class="sim-value-btn secondary" type="button">Compartir resultado</button><div id="simShareFeedback" class="sim-share-feedback"></div></div></div><div class="sim-value-grid"><div class="sim-value-stat"><strong id="simCount">0</strong><span>vías para revisar</span></div><div class="sim-value-stat"><strong id="simHigh">0</strong><span>prioridad alta</span></div><div class="sim-value-stat"><strong id="simTerritory">—</strong><span>territorio</span></div></div><div id="simNextList" class="sim-next-list"></div><div class="sim-value-actions"><a class="sim-value-btn" href="/mi-panel/">Guardar el seguimiento en Mi panel →</a><a class="sim-value-btn secondary" href="/herramientas/que-me-falta/">Ver qué me falta →</a></div>';
  resultados.querySelector('.tool-panel')?.prepend(value);

  function getCards(){return [...document.querySelectorAll('#listaResultados .sim-result-card')];}
  function territory(){return document.getElementById('comunidad')?.value||'Tu comunidad';}
  function refresh(){
    const cards=getCards();if(!cards.length){value.classList.remove('show');return;}
    value.classList.add('show');
    const high=cards.filter(c=>c.querySelector('.sim-tag.alta')||/alta/i.test(c.querySelector('.sim-tag')?.textContent||'')).length;
    document.getElementById('simCount').textContent=cards.length;
    document.getElementById('simHigh').textContent=high;
    document.getElementById('simTerritory').textContent=territory().replace('Comunidad de ','').replace('Región de ','');
    document.getElementById('simValueTitle').textContent=cards.length===1?'Tienes 1 vía clara para revisar':`Tienes ${cards.length} vías que merece la pena revisar`;
    document.getElementById('simValueText').textContent=high?`${high} aparecen como prioridad alta. Empieza por ahí y deja el resto para después.`:'No hace falta abrir todo a la vez: empieza por las tres primeras y valida requisitos oficiales.';
    const next=cards.slice(0,3).map((c,i)=>{
      const title=c.querySelector('h3')?.textContent?.trim()||'Ayuda o prestación';
      const href=c.querySelector('a')?.getAttribute('href')||'/ayudas-nacimiento/';
      return `<div class="sim-next-item"><span>${i+1}</span><div><strong>${title}</strong><small style="display:block;color:#74798a;margin-top:2px">${i===0?'Empieza por esta':'Revísala después'}</small></div><a href="${href}">Abrir →</a></div>`;
    }).join('');
    document.getElementById('simNextList').innerHTML=next;
  }

  const observer=new MutationObserver(()=>setTimeout(refresh,0));
  observer.observe(document.getElementById('listaResultados'),{childList:true,subtree:true});
  form.addEventListener('submit',()=>setTimeout(refresh,80));

  document.getElementById('simShare')?.addEventListener('click',async()=>{
    const cards=getCards();if(!cards.length)return;
    const names=cards.slice(0,3).map(c=>c.querySelector('h3')?.textContent?.trim()).filter(Boolean);
    const text=`He hecho el simulador de ayudas del bebé para ${territory()}: ${cards.length} vías para revisar.${names.length?' Primeras: '+names.join(', ')+'.':''}\nhttps://www.papelesdelbebe.es/herramientas/buscador-ayudas/`;
    const feedback=document.getElementById('simShareFeedback');
    try{if(navigator.share)await navigator.share({title:'Ayudas del bebé para revisar',text});else{await navigator.clipboard.writeText(text);feedback.textContent='Resumen copiado ✓';setTimeout(()=>feedback.textContent='',2500);}}catch(e){}
  });
})();