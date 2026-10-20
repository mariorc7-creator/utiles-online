/* Planificación opcional y orientativa; no altera el cálculo oficial ni persiste datos. */
(() => {
 if (!/^\/herramientas\/calculadora-permiso-nacimiento\/?$/.test(location.pathname)) return;
 const DAY=86400000;
 function parse(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))return null;let [y,m,d]=s.split('-').map(Number);let a=new Date(Date.UTC(y,m-1,d,12));return a.getUTCFullYear()===y&&a.getUTCMonth()===m-1&&a.getUTCDate()===d?a:null;}
 function add(d,n){return new Date(d.getTime()+n*DAY);}
 function workdays(d,n){let cur=new Date(d),days=0;while(days<n){let w=cur.getUTCDay();if(w!==0&&w!==6)days++;if(days<n)cur=add(cur,1);}return cur;}
 function format(d){return new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(d);}
 function init(){
  const input=document.getElementById('fecha'),tipo=document.getElementById('tipo'),main=document.querySelector('.perm-grid');
  if(!input||!tipo||!main||document.getElementById('pb-familia-plan'))return;
  const s=document.createElement('section');s.id='pb-familia-plan';s.className='tool-panel';s.setAttribute('aria-labelledby','pb-family-title');
  s.style.cssText='margin-top:18px;max-width:100%';
  s.innerHTML='<span class="perm-badge">NUEVO · OPCIONAL</span><h2 id="pb-family-title">Planifica la vuelta al trabajo en familia</h2><p>Explora escenarios después de las seis primeras semanas. No estamos asignando automáticamente tus semanas: tú eliges cuántas disfrutar seguidas. Los dos progenitores pueden planificar por separado.</p><div class="pb-family-grid"><div><label for="pb-parent-a">Semanas voluntarias seguidas · progenitor 1</label><input type="number" id="pb-parent-a" min="0" max="11" value="11" step="1"><small>De 0 a 11 semanas dentro del primer año, en el escenario general.</small></div><div id="pb-second-parent"><label for="pb-parent-b">Semanas voluntarias seguidas · progenitor 2</label><input type="number" id="pb-parent-b" min="0" max="11" value="11" step="1"><small>Derecho individual: no se ceden semanas entre progenitores.</small></div></div><div class="pb-family-grid"><div><label for="pb-vac">Vacaciones pendientes (días laborables)</label><input type="number" id="pb-vac" min="0" max="90" value="0" step="1"><small>Solo progenitor 1; excluye sábados y domingos, no festivos ni jornadas especiales.</small></div><div><label for="pb-lac">Lactancia acumulada acordada (días laborables)</label><input type="number" id="pb-lac" min="0" max="90" value="0" step="1"><small>Introduce días confirmados. No existe un número fijo universal.</small></div></div><button type="button" id="pb-calc-family" class="tool-cta">Ver escenario familiar →</button><div id="pb-family-result" role="status" aria-live="polite" style="margin-top:14px"></div><p style="font-size:.83rem;line-height:1.55;color:#656b7d;margin:14px 0 0">Simulación ilustrativa, no calendario definitivo. Las vacaciones pueden requerir acuerdo; la lactancia depende de calendario laboral y circunstancias individuales. La parte voluntaria puede disfrutarse por periodos semanales, no necesariamente justo después de las seis semanas. Las 2 semanas adicionales hasta los 8 años (4 en monoparentales) quedan fuera de esta simulación. Los cálculos no incluyen festivos autonómicos, locales, vacaciones del segundo progenitor, ampliaciones especiales ni modalidades a tiempo parcial. No guardamos estos escenarios.</p><div class="tool-links"><a href="https://prestaciones.seg-social.es/servicio/prestacion-nacimiento-adopcion-cuidado-menor" target="_blank" rel="noopener noreferrer">Seguridad Social: duración y reparto ↗</a><a href="https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430" target="_blank" rel="noopener noreferrer">BOE: vacaciones y lactancia ↗</a></div>';
  const style=document.createElement('style');style.textContent='.pb-family-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:13px 0}.pb-family-grid>div{min-width:0}.pb-family-grid label{display:block;font-weight:800;margin-bottom:6px}.pb-family-grid input{display:block;width:100%;max-width:220px;padding:10px;border:1px solid #cdd2e7;border-radius:10px;font:inherit}.pb-family-grid small{display:block;color:#677084;line-height:1.45;margin-top:5px}.pb-family-output{padding:15px;border-radius:15px;background:#f1f3ff;border:1px solid #d9dcfb}.pb-family-output h3{margin:0 0 10px}.pb-family-output p{margin:8px 0}@media(max-width:640px){.pb-family-grid{grid-template-columns:1fr}}';document.head.appendChild(style);
  main.insertAdjacentElement('beforebegin',s);
  const second=document.getElementById('pb-second-parent');
  const update=()=>{let mono=tipo.value==='mono';second.hidden=mono;const max=mono?22:11;document.getElementById('pb-parent-a').max=max;document.getElementById('pb-parent-a').nextElementSibling.textContent='De 0 a '+max+' semanas voluntarias durante el primer año.';document.getElementById('pb-parent-a').value=Math.min(+document.getElementById('pb-parent-a').value,max);};
  tipo.addEventListener('change',update);update();
  document.getElementById('pb-calc-family').addEventListener('click',()=>{
    const out=document.getElementById('pb-family-result'),birth=parse(input.value),mono=tipo.value==='mono',limit=mono?22:11;
    const raw=['pb-parent-a','pb-parent-b','pb-vac','pb-lac'].map(id=>document.getElementById(id).value);
    const v=raw.map(Number),max=[limit,11,90,90];if(!birth){out.textContent='Introduce primero una fecha válida de nacimiento o prevista en la calculadora superior.';input.focus();return;}
    if(v.some((x,i)=>!Number.isInteger(x)||x<0||x>max[i]||raw[i]==='')){out.textContent='Revisa los números: las semanas y días deben ser enteros dentro de los límites indicados.';return;}
    const start=add(birth,42),oneEnd=add(start,v[0]*7),twoEnd=add(start,v[1]*7);
    const afterVac=v[2]?add(workdays(oneEnd,v[2]),1):oneEnd;
    const afterLac=v[3]?add(workdays(afterVac,v[3]),1):afterVac;
    const chunks=['<h3>Tu escenario orientativo</h3>','<p><strong>Tras seis semanas obligatorias:</strong> '+format(start)+'</p>',
     '<p><strong>Progenitor 1:</strong> '+v[0]+' semanas voluntarias seguidas · vuelta estimada antes de vacaciones y lactancia: '+format(oneEnd)+'</p>'];
    if(!mono)chunks.push('<p><strong>Progenitor 2:</strong> '+v[1]+' semanas voluntarias seguidas · vuelta estimada: '+format(twoEnd)+'</p>');
    if(v[2]||v[3])chunks.push('<p><strong>Progenitor 1 tras '+v[2]+' días de vacaciones y '+v[3]+' de lactancia acumulada:</strong> '+format(afterLac)+' (solo lunes a viernes; sin festivos)</p>');
    chunks.push('<p><strong>Semanas voluntarias del primer año sin colocar:</strong> '+(limit-v[0])+(mono?'': ' para progenitor 1; '+(11-v[1])+' para progenitor 2')+'. No se han planificado las semanas reservadas hasta los 8 años.</p>');
    if(add(oneEnd,0)>new Date(Date.UTC(birth.getUTCFullYear()+1,birth.getUTCMonth(),birth.getUTCDate(),12)))chunks.push('<p><strong>Atención:</strong> este reparto superaría el primer cumpleaños; revisa periodos y límites.</p>');
    out.innerHTML='<div class="pb-family-output">'+chunks.join('')+'</div>';
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();