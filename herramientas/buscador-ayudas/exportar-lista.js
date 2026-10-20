/* Exporta un resumen local de la simulación sin transmitir información. */
(() => {
  if (!/^\/herramientas\/buscador-ayudas\/?$/.test(location.pathname)) return;
  function init(){
    const section=document.getElementById('resultados');
    const actions=section?.querySelector('.tool-actions');
    if(!actions || document.getElementById('pb-export-aid'))return;
    const btn=document.createElement('button');
    btn.type='button';btn.id='pb-export-aid';btn.textContent='Descargar mi lista de comprobación ↓';
    btn.style.cssText='padding:12px 15px;border-radius:12px;border:1px solid #aeb4e8;background:#f5f6ff;color:#373f9d;font:inherit;font-weight:800;cursor:pointer';
    btn.hidden=true;actions.appendChild(btn);
    let ready=false;
    document.addEventListener('papelesbebe:simulacion-ayudas',()=>{
      ready=true;btn.hidden=false;
    });
    btn.addEventListener('click',()=>{
      if(!ready)return;
      const territory=document.getElementById('comunidad')?.value || 'No indicado';
      const cards=[...section.querySelectorAll('.sim-result-card')];
      const entries=cards.map((card,i)=>{
        const title=card.querySelector('h3')?.textContent.trim()||'Ayuda';
        const desc=card.querySelector('p')?.textContent.trim()||'';
        const link=card.querySelector('a[href]')?.getAttribute('href')||'';
        const url=link.startsWith('/')?'https://www.papelesdelbebe.es'+link:link;
        return (i+1)+'. '+title+'\n   '+desc+'\n   Guía: '+url+'\n   [ ] Revisar condiciones, plazo y convocatoria en la web oficial\n   [ ] Preparar documentación\n   [ ] Presentar la solicitud si corresponde';
      });
      const content=[
       'PAPELES DEL BEBÉ — LISTA PERSONAL DE COMPROBACIÓN',
       'Generada: '+new Intl.DateTimeFormat('es-ES',{dateStyle:'long'}).format(new Date()),
       'Comunidad indicada: '+territory,
       '',
       'RESULTADOS ORIENTATIVOS (NO CONFIRMAN ELEGIBILIDAD NI CONCESIÓN)',
       ...entries,'',
       'IMPORTANTE: esta lista no contiene importes ni plazos no verificados. Comprueba cada convocatoria y enlace oficial antes de solicitar.',
       'Tu progreso de Mi panel se gestiona por separado en este navegador.',
       'https://www.papelesdelbebe.es/mi-panel/'
      ].join('\n\n');
      const blob=new Blob([content],{type:'text/plain;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download='papeles-del-bebe-ayudas-para-revisar.txt';document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();