(() => {
  if(window.__pbProgressiveForms)return;window.__pbProgressiveForms=true;
  const path=location.pathname.replace(/\/$/,'')+'/';
  if(path!=='/herramientas/buscador-ayudas/'&&path!=='/herramientas/calculadora-permiso-nacimiento/')return;
  const css=document.createElement('style');css.textContent=`
    .pb-progressive-step[hidden]{display:none!important}
    .pb-progressive-step{border:1px solid #e1e5f2;border-radius:15px;padding:14px;margin:10px 0;background:#fff;min-width:0}
    .pb-progressive-step label{display:block;font-weight:850;margin:0 0 7px}
    .pb-progressive-step select,.pb-progressive-step input[type=date]{width:100%;box-sizing:border-box;min-height:44px}
    .pb-progressive-step small{display:block;margin-top:6px;color:#697287}
    .pb-step-caption{font-size:.78rem;font-weight:850;color:#575fcc;display:block;margin:0 0 6px}
    .pb-progressive-done{padding:9px 11px;margin:8px 0;border:1px solid #dce8df;border-radius:12px;background:#f7fbf8;color:#385f4a;font-size:.9rem}
  `;document.head.append(css);
  function prepare(){
    // UX 3.1.2: ayudas y permisos tienen asistentes propios; evitar pasos duplicados.
    if(path.includes('buscador-ayudas') || path.includes('calculadora-permiso-nacimiento')) return;
    const form=path.includes('buscador-ayudas')?document.getElementById('simuladorForm'):document.querySelector('form[action="/api/calcular-permiso"]');
    if(!form)return;
    const ids=path.includes('buscador-ayudas')?['comunidad','laboral','familia']:['tipo','fecha','objetivo'];
    const steps=[];
    ids.forEach((id,i)=>{
      const field=document.getElementById(id),label=form.querySelector('label[for="'+id+'"]');
      if(!field||!label)return;
      const wrap=document.createElement('div');wrap.className='pb-progressive-step';wrap.dataset.step=id;
      const caption=document.createElement('span');caption.className='pb-step-caption';caption.textContent='PASO '+(i+1)+' DE '+ids.length;
      label.parentNode.insertBefore(wrap,label);wrap.append(caption,label,field);
      // Conservar avisos originales vinculados a la fecha.
      if(id==='fecha'&&field.nextElementSibling?.tagName==='SMALL')wrap.appendChild(field.nextElementSibling);
      steps.push({field,wrap});
    });
    if(steps.length!==ids.length)return;
    const special=form.querySelector('.pb-simple-details');
    function refresh(){
      let first=steps.findIndex(s=>!s.field.value);
      if(first===-1)first=steps.length-1;
      steps.forEach((s,i)=>{
        s.wrap.hidden=i>first&&(!s.field.value);
        // En el planificador el tipo tiene selección por defecto: permitir edición siempre.
        if(path.includes('calculadora-permiso'))s.wrap.hidden=false;
      });
      if(special)special.hidden=!steps.every(s=>s.field.value);
      const submit=form.querySelector('button[type=submit]');
      if(submit && path.includes('buscador-ayudas')){
        const complete=steps.every(s=>!!s.field.value);
        submit.disabled=!complete;
        submit.title=complete?'':'Completa las tres preguntas para continuar';
      }
    }
    steps.forEach(({field})=>field.addEventListener('change',refresh));
    refresh();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(prepare,150),{once:true});
  else setTimeout(prepare,150);
})();