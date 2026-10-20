/* Entrada rápida del preparador sanitario: sin datos personales ni tracking nuevo. */
(() => {
 if(!/^\/preparador-tarjeta-sanitaria\/?$/.test(location.pathname))return;
 function init(){
   const form=document.getElementById('formTs'), inss=document.getElementById('inss'), cover=document.getElementById('cobertura');
   if(!form||!inss||!cover)return;
   const style=document.createElement('style');style.id='pb-ts-fast-css';
   style.textContent='.ts-main .ts-hero{padding:18px 22px;margin-bottom:10px}.ts-main .ts-hero h1{font-size:clamp(1.55rem,4vw,2.3rem);line-height:1.15;margin:.4rem 0}.ts-main .ts-hero p{font-size:.92rem;line-height:1.5;margin:6px 0}.ts-main .ts-value-row{margin-top:8px}.ts-main #formTs{margin-top:10px}.ts-fast-notice{border:1px solid #e9cd87;background:#fff8e7;border-radius:12px;padding:13px;margin:11px 0;color:#5f4b19}.ts-fast-notice strong{display:block;margin-bottom:4px}.ts-fast-notice a{display:inline-block;margin-top:8px;font-weight:800;color:#4149b5}.ts-fast-preview{font-size:.87rem;color:#4f5d77;line-height:1.5;margin:8px 0 0}.ts-main .ts-feature-grid{grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:720px){.ts-main .ts-hero{padding:14px 15px}.ts-main .ts-value-row{display:none}.ts-main .ts-feature-grid{grid-template-columns:1fr}}';document.head.appendChild(style);
   const label=document.querySelector('label[for="inss"]');
   if(label)label.textContent='4. ¿El bebé ya tiene reconocida la asistencia sanitaria (INSS)?';
   const notice=document.createElement('div');notice.className='ts-fast-notice';notice.id='ts-inss-alert';notice.hidden=true;
   notice.innerHTML='<strong>Antes de pedir la tarjeta, comprueba el alta sanitaria del bebé</strong><span>Si todavía no consta reconocido el derecho a asistencia sanitaria, revisa la inclusión como beneficiario en la Seguridad Social. Si tienes MUFACE, ISFAS o MUGEJU, sigue primero las instrucciones de tu mutualidad.</span><div><a target="_blank" rel="noopener noreferrer" href="https://prestaciones.seg-social.es/">Abrir Seguridad Social ↗</a> · <a href="/incluir-bebe-beneficiario-seguridad-social/">Cómo comprobar el alta →</a></div>';
   const holder=inss.closest('.ts-field');if(holder)holder.insertAdjacentElement('afterend',notice);
   function refresh(){
     const mutual=cover.value==='mutualidad',missing=inss.value==='no';
     notice.hidden=!(missing&&!mutual);
     if(mutual){notice.hidden=false;notice.querySelector('strong').textContent='Tu mutualidad tiene un procedimiento sanitario propio';notice.querySelector('span').textContent='Comprueba el alta del bebé con MUFACE, ISFAS o MUGEJU y después consulta el servicio autonómico. El alta ordinaria del INSS puede no ser la vía aplicable.';notice.querySelector('div').hidden=true;}
     else {notice.querySelector('strong').textContent='Antes de pedir la tarjeta, comprueba el alta sanitaria del bebé';notice.querySelector('div').hidden=false;}
   }
   inss.addEventListener('change',refresh);cover.addEventListener('change',refresh);refresh();
   const head=form.querySelector('.ts-form-head');if(head){const p=document.createElement('p');p.className='ts-fast-preview';p.textContent='Son 6 preguntas sencillas. Recibirás tu siguiente paso, documentos y acceso a la fuente oficial. Sin registro.';head.appendChild(p);}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();