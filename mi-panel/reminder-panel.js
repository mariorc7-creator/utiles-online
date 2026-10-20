(() => {
  const btn=document.getElementById('pbReminderSave');
  const dateInput=document.getElementById('pbReminderDate');
  const status=document.getElementById('pbReminderStatus');
  if(!btn||!dateInput||!status)return;
  const KEY='papelesbebe_que_me_falta_v1';
  const steps=[
    ['registro','Inscripción del nacimiento','/registro-civil-bebe/'],
    ['seguridad-social','Alta del bebé en Seguridad Social','/incluir-bebe-beneficiario-seguridad-social/'],
    ['tarjeta-sanitaria','Tarjeta sanitaria','/preparador-tarjeta-sanitaria/'],
    ['padron','Empadronamiento','/pack-empadronamiento/'],
    ['prestacion','Permiso y prestación por nacimiento','/permiso-nacimiento-cuidado-menor-2026/'],
    ['deduccion','Deducciones familiares','/deduccion-maternidad/'],
    ['ayudas','Ayudas por nacimiento','/herramientas/buscador-ayudas/']
  ];
  const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+7);
  const fmt=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  dateInput.min=fmt(new Date());dateInput.value=fmt(tomorrow);
  btn.addEventListener('click',()=>{
    try{
      const raw=localStorage.getItem(KEY);const state=raw?JSON.parse(raw):{};
      const current=steps.find(([key])=>!state?.[key]);
      if(!current){status.textContent='Ya has revisado todos los pasos. No necesitas un recordatorio de un trámite pendiente.';return;}
      if(!dateInput.value){status.textContent='Elige una fecha primero.';return;}
      const [year,month,day]=dateInput.value.split('-').map(Number);
      const date=new Date(year,month-1,day,10,0,0);
      if(!Number.isFinite(date.getTime())||date<new Date(new Date().setHours(0,0,0,0))){status.textContent='Selecciona una fecha de hoy en adelante.';return;}
      if(!window.PBReminder?.create){status.textContent='No se ha podido preparar el archivo de calendario. Inténtalo de nuevo.';return;}
      window.PBReminder.create({key:current[0],title:current[1],href:current[2]},date);
      status.textContent='Se ha preparado el recordatorio para tu calendario. Ábrelo para guardarlo.';
    }catch(_){status.textContent='No hemos podido preparar el recordatorio. Inténtalo de nuevo.';}
  });
})();