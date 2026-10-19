(() => {
  const root=document.getElementById('planCard');if(!root)return;
  const KEY='papelesbebe_que_me_falta_v1';
  const steps=[
    {k:'registro',title:'Confirma el nacimiento en Registro Civil',why:'Comprueba que el bebé figura inscrito y localiza la documentación.',href:'/registro-civil-bebe/',related:'/documentos-tramites-bebe/',relatedLabel:'Documentos habituales'},
    {k:'seguridad-social',title:'Comprueba el alta en Seguridad Social',why:'Verifica que el bebé esté dado de alta como beneficiario cuando proceda.',href:'/alta-bebe-seguridad-social/',related:'/incluir-bebe-beneficiario-seguridad-social/',relatedLabel:'Cómo comprobar el alta'},
    {k:'tarjeta-sanitaria',title:'Prepara la tarjeta sanitaria',why:'Nuestro preparador te indicará qué comprobar según tu comunidad y situación.',href:'/preparador-tarjeta-sanitaria/',related:'/tarjeta-sanitaria-bebe/',relatedLabel:'Guía general'},
    {k:'padron',title:'Revisa el empadronamiento',why:'Comprueba si tu municipio requiere alguna gestión y qué documentación pide.',href:'/pack-empadronamiento/',related:'/empadronar-bebe/',relatedLabel:'Guía de empadronamiento'},
    {k:'prestacion',title:'Revisa el permiso y la prestación',why:'Consulta las semanas orientativas y comprueba requisitos de cotización y solicitud.',href:'/herramientas/calculadora-permiso-nacimiento/',related:'/permiso-nacimiento-cuidado-menor-2026/',relatedLabel:'Guía de permiso'},
    {k:'deduccion',title:'Comprueba la deducción por maternidad',why:'Revisa requisitos fiscales antes de dar este apartado por cerrado.',href:'/deduccion-maternidad/',related:'/ayudas-nacimiento/',relatedLabel:'Ver otras ayudas'},
    {k:'ayudas',title:'Descubre ayudas en tu comunidad',why:'El simulador te muestra vías que conviene revisar, no concesiones automáticas.',href:'/herramientas/buscador-ayudas/',related:'/observatorio/',relatedLabel:'Novedades y observatorio'}
  ];
  const nodes={title:document.getElementById('planTitle'),desc:document.getElementById('planDescription'),go:document.getElementById('planGo'),done:document.getElementById('planDone'),progress:document.getElementById('planProgress'),bar:document.getElementById('planBar'),related:document.getElementById('planRelated'),list:document.getElementById('planList')};
  function state(){try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');return s&&typeof s==='object'&&!Array.isArray(s)?s:{};}catch{return {};}}
  function save(data){try{localStorage.setItem(KEY,JSON.stringify(data));window.dispatchEvent(new CustomEvent('papelesbebe:progress',{detail:data}));}catch{}}
  function render(){
    const s=state(),pending=steps.filter(x=>!s[x.k]),done=steps.length-pending.length,first=pending[0];
    nodes.progress.textContent=done+' de 7 bloques revisados';
    nodes.bar.style.width=(done/7*100)+'%';
    if(first){
      nodes.title.textContent=first.title;
      nodes.desc.textContent=first.why;
      nodes.go.href=first.href;nodes.go.textContent='Ver cómo hacerlo →';
      nodes.done.hidden=false;
      nodes.related.innerHTML='<strong>Si necesitas ampliar:</strong><p>La explicación detallada está en su guía relacionada.</p><a href="'+first.related+'">'+first.relatedLabel+' →</a>';
    }else{
      nodes.title.textContent='¡Ya has revisado los siete bloques!';
      nodes.desc.textContent='El último paso es comprobar resoluciones, requerimientos y novedades locales.';
      nodes.go.href='/observatorio/';nodes.go.textContent='Revisar novedades →';nodes.done.hidden=true;
      nodes.related.innerHTML='<strong>Tu ruta está guardada en este dispositivo.</strong><p>Vuelve cuando necesites revisar convocatorias o actualizar una gestión.</p>';
    }
    nodes.list.replaceChildren();
    steps.forEach(x=>{
      const row=document.createElement('div');row.className='plan-extra-row';
      const check=document.createElement('input');check.type='checkbox';check.checked=!!s[x.k];check.id='plan-'+x.k;check.setAttribute('aria-label','Marcar revisado: '+x.title);
      check.addEventListener('change',()=>{const updated=state();updated[x.k]=check.checked;save(updated);render();});
      const label=document.createElement('label');label.htmlFor=check.id;label.textContent=x.title;
      const link=document.createElement('a');link.href=x.href;link.textContent='Abrir →';
      row.append(check,label,link);nodes.list.append(row);
    });
  }
  const reminderHost=document.createElement('div');
  reminderHost.style.marginTop='10px';
  nodes.related.insertAdjacentElement('afterend',reminderHost);
  function updateReminder(){
    reminderHost.replaceChildren();
    const pending=steps.find(x=>!state()[x.k]);
    if(!pending||!window.PBReminder)return;
    const hint=document.createElement('p');
    hint.textContent='¿Quieres acordarte? Guarda un recordatorio de revisión para dentro de 7 días (no es un plazo legal).';
    hint.style.cssText='color:#667083;font-size:.88rem;margin:7px 0';
    const day=new Date();day.setDate(day.getDate()+7);
    reminderHost.append(hint,window.PBReminder.button({key:pending.k,title:pending.title,href:pending.href},day));
  }
  const originalRender=render;
  nodes.done.addEventListener('click',()=>{
    const current=steps.find(x=>!state()[x.k]);if(!current)return;
    const updated=state();updated[current.k]=true;save(updated);render();
  });
  window.addEventListener('storage',e=>{if(e.key===KEY){render();updateReminder();}});
  nodes.done.addEventListener('click',()=>queueMicrotask(updateReminder));
  nodes.list.addEventListener('change',()=>queueMicrotask(updateReminder));
  render();updateReminder();
})();