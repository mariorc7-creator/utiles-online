(() => {
  const root=document.getElementById('pbCalendarApp');
  if(!root)return;
  const day=Number(root.dataset.birth||0);
  if(!Number.isFinite(day))return;
  const birth=new Date(day);
  const current=new Date();
  const ms=24*60*60*1000;
  const age=Math.max(0,Math.floor((new Date(current.getFullYear(),current.getMonth(),current.getDate(),12)-birth)/ms));
  const progressKey='papelesbebe_que_me_falta_v1';
  const tasks=[
    {key:'registro',title:'Inscripción del nacimiento',short:'Confirma que el nacimiento está inscrito',href:'/registro-civil-bebe/',day:0,category:'Identidad'},
    {key:'seguridad-social',title:'Alta del bebé en Seguridad Social',short:'Comprueba que figura correctamente como beneficiario',href:'/alta-bebe-seguridad-social/',day:2,category:'Asistencia'},
    {key:'tarjeta-sanitaria',title:'Tarjeta sanitaria',short:'Consulta los pasos de tu comunidad y centro de salud',href:'/preparador-tarjeta-sanitaria/',day:3,category:'Salud'},
    {key:'padron',title:'Empadronamiento',short:'Revisa si el alta municipal se ha tramitado',href:'/pack-empadronamiento/',day:7,category:'Municipio'},
    {key:'prestacion',title:'Prestación y permiso',short:'Consulta requisitos y presenta lo que corresponda',href:'/herramientas/calculadora-permiso-nacimiento/',day:7,category:'Prestaciones'},
    {key:'deduccion',title:'Deducción por maternidad',short:'Comprueba si puedes solicitarla y cómo',href:'/deduccion-maternidad/',day:20,category:'Fiscalidad'},
    {key:'ayudas',title:'Ayudas territoriales',short:'Busca apoyos estatales, autonómicos y municipales',href:'/herramientas/buscador-ayudas/',day:20,category:'Ayudas'}
  ];
  const css=document.createElement('style');css.textContent=`
    .pb-cal-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0 20px}.pb-cal-stat{padding:13px;background:#f7f8ff;border:1px solid #e2e5fa;border-radius:14px}.pb-cal-stat strong{display:block;font-size:1.3rem;color:#3e479c}.pb-cal-stat span{font-size:.8rem;color:#666d80}
    .pb-cal-group-title{font-size:1rem;color:#313b79;margin:22px 0 11px;padding-left:12px;border-left:4px solid #6067e8}.pb-cal-card{display:grid;grid-template-columns:auto 1fr;gap:12px;padding:15px;margin:9px 0;border:1px solid #e4e7ef;border-radius:16px;background:#fff}.pb-cal-card.is-done{background:#f4fbf7;border-color:#cde5d5}.pb-cal-card input{width:20px;height:20px;accent-color:#4f57c4;margin-top:3px}.pb-cal-card h3{margin:0 0 5px;font-size:1rem}.pb-cal-card p{margin:0 0 9px;color:#667083;line-height:1.45}.pb-cal-card a{font-weight:800;color:#5059c1;text-decoration:none}.pb-cal-kicker{font-size:.72rem;font-weight:850;color:#5961b2;letter-spacing:.04em}.pb-cal-actions{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0}.pb-cal-actions button,.pb-cal-actions a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:11px;padding:10px 14px;border:1px solid #d4d8f4;background:#fff;color:#4c54af;font-weight:800;cursor:pointer;text-decoration:none}.pb-cal-actions a.primary{background:#6067e8;color:#fff}.pb-cal-hint{padding:12px 14px;background:#f8f9ff;border:1px solid #e5e7f3;border-radius:13px;color:#596073;font-size:.87rem;line-height:1.5}.pb-cal-next{padding:16px;border-radius:18px;background:linear-gradient(135deg,#f2f4ff,#fff);border:1px solid #d9ddf5}.pb-cal-next strong{display:block;margin:5px 0}.pb-cal-next a{font-weight:850;color:#4c55b9}.pb-cal-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.pb-cal-tabs button{padding:8px 11px;border-radius:999px;border:1px solid #d9ddeb;background:#fff;color:#5c6377;cursor:pointer;font-weight:750}.pb-cal-tabs button[aria-pressed=true]{background:#555ed1;color:#fff;border-color:#555ed1}
    @media(max-width:650px){.pb-cal-summary{grid-template-columns:1fr 1fr}.pb-cal-actions>*{width:100%;box-sizing:border-box}}
    @media print{header,footer,#pb-mobile-nav,.pb-cal-actions,.pb-cal-tabs,.pb-cal-next{display:none!important}.pb-cal-card{break-inside:avoid}}
  `;document.head.append(css);
  function read(){try{const o=JSON.parse(localStorage.getItem(progressKey)||'{}');return o&&typeof o==='object'?o:{};}catch{return {};}}
  function save(value){try{localStorage.setItem(progressKey,JSON.stringify(value));window.dispatchEvent(new CustomEvent('papelesbebe:progress',{detail:value}));}catch{}}
  function format(d){return new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',year:'numeric'}).format(d);}
  function when(offset){const d=new Date(birth);d.setDate(d.getDate()+offset);return format(d)}
  function labelAge(){return age===0?'Hoy':age===1?'1 día':age+' días'}
  root.innerHTML='<div class="pb-cal-summary"><div class="pb-cal-stat"><strong id="pbAge"></strong><span>desde el nacimiento</span></div><div class="pb-cal-stat"><strong id="pbCount">0/7</strong><span>bloques revisados</span></div><div class="pb-cal-stat"><strong>90 días</strong><span>horizonte orientativo</span></div></div><div class="pb-cal-next" id="pbNext"></div><div class="pb-cal-tabs" role="group" aria-label="Filtrar pasos"><button type="button" data-filter="pending" aria-pressed="true">Por revisar</button><button type="button" data-filter="all" aria-pressed="false">Ver todos</button><button type="button" data-filter="done" aria-pressed="false">Revisados</button></div><div id="pbTasks"></div><section class="pb-cal-hint" aria-label="Seguimiento de días 31 a 90"><h3 class="pb-cal-group-title">Días 31–90 · Haz seguimiento</h3><p>Comprueba si tienes requerimientos, ayudas todavía pendientes y próximas citas sanitarias. El momento concreto depende de tus solicitudes y de las indicaciones de tu centro de salud.</p><a href="/mi-panel/">Revisar pendientes en Mi panel →</a></section><div class="pb-cal-actions"><a class="primary" href="/mi-panel/">Seguir en Mi panel →</a><button type="button" id="pbCalendarPrint">Imprimir o guardar PDF</button><button type="button" id="pbCalendarReset">Desmarcar estos pasos</button></div><p class="pb-cal-hint">Las fechas sugeridas son recordatorios para organizarte, no vencimientos legales. Los requisitos, plazos y organismos se comprueban en los enlaces de cada paso. Si el bebé tiene más de 90 días, revisa igualmente las gestiones pendientes y sus plazos oficiales.</p>';
  root.querySelector('#pbAge').textContent=labelAge();
  let filter='pending';
  function render(){
    const state=read();const pending=tasks.filter(t=>!state[t.key]);const next=pending[0];
    root.querySelector('#pbCount').textContent=(tasks.length-pending.length)+'/7';
    root.querySelector('#pbNext').innerHTML=next?'<span class="pb-cal-kicker">TU SIGUIENTE ACCIÓN</span><strong>'+next.title+'</strong><p>'+next.short+'</p><a href="'+next.href+'">Ver cómo hacerlo →</a>':'<span class="pb-cal-kicker">RUTA REVISADA</span><strong>Los 7 bloques están marcados</strong><p>Comprueba resoluciones, posibles requerimientos y novedades de ayudas territoriales.</p><a href="/observatorio/">Revisar oportunidades →</a>';
    const visible=tasks.filter(t=>filter==='all'||(filter==='done'?!!state[t.key]:!state[t.key]));
    const card=t=>'<label class="pb-cal-card '+(state[t.key]?'is-done':'')+'"><input type="checkbox" data-key="'+t.key+'" '+(state[t.key]?'checked':'')+' aria-label="Marcar como revisado: '+t.title+'"><div><span class="pb-cal-kicker">'+t.category+' · Revisión sugerida desde '+when(t.day)+'</span><h3>'+t.title+'</h3><p>'+t.short+'</p><a href="'+t.href+'">Ver guía y requisitos →</a></div></label>';
    const first=visible.filter(t=>t.day<=10),mid=visible.filter(t=>t.day>10&&t.day<=30),late=visible.filter(t=>t.day>30);
    const bucket=(items,heading)=>items.length?'<h3 class="pb-cal-group-title">'+heading+'</h3>'+items.map(card).join(''):'';
    const timeline=bucket(first,'Días 1–10 · Primero lo esencial')+bucket(mid,'Días 11–30 · Prestaciones y ayudas')+bucket(late,'Días 31–90 · Seguimiento');
    root.querySelector('#pbTasks').innerHTML=visible.length?timeline:'<p class="pb-cal-hint">No hay pasos en esta vista. Cambia el filtro para ver el resto.</p>';

    // Recordatorios para cada revisión sugerida; no representan plazos legales.
    if(window.PBReminder){
      root.querySelectorAll('.pb-cal-card').forEach(card=>{
        const check=card.querySelector('input[data-key]');
        const task=tasks.find(t=>t.key===check?.dataset.key);
        if(!task)return;
        const date=new Date(birth);date.setDate(date.getDate()+task.day);
        // Evitar recordatorios en el pasado: sugerir revisión dentro de siete días.
        const today=new Date();today.setHours(12,0,0,0);
        if(date<today){date.setTime(today.getTime());date.setDate(date.getDate()+7);}
        card.querySelector('div')?.append(window.PBReminder.button({key:task.key,title:task.title,href:task.href},date));
      });
    }
    root.querySelectorAll('button[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
  }
  root.addEventListener('change',e=>{if(!e.target.matches('input[data-key]'))return;const state=read();state[e.target.dataset.key]=e.target.checked;save(state);render();});
  root.querySelector('.pb-cal-tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-filter]');if(b){filter=b.dataset.filter;render();}});
  root.querySelector('#pbCalendarPrint').addEventListener('click',()=>{filter='all';render();window.print();});
  root.querySelector('#pbCalendarReset').addEventListener('click',()=>{if(!confirm('¿Desmarcar los siete bloques de la ruta?'))return;const state=read();tasks.forEach(t=>state[t.key]=false);save(state);filter='pending';render();});
  window.addEventListener('storage',e=>{if(e.key===progressKey)render()});
  render();
})();