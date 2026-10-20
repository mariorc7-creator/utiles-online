/* Exporta fechas orientativas completas; no envía datos ni crea alarmas automáticas. */
(() => {
 if (!location.pathname.startsWith('/api/calendario-90-dias')) return;
 const pad=n=>String(n).padStart(2,'0');
 const stamp=d=>d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate());
 const escape=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const entries=[
  ['registro','Inscripción del nacimiento',0,'/registro-civil-bebe/'],
  ['seguridad-social','Alta del bebé en Seguridad Social',2,'/alta-bebe-seguridad-social/'],
  ['tarjeta-sanitaria','Tarjeta sanitaria',3,'/preparador-tarjeta-sanitaria/'],
  ['padron','Empadronamiento',7,'/pack-empadronamiento/'],
  ['prestacion','Prestación y permiso',7,'/herramientas/calculadora-permiso-nacimiento/'],
  ['deduccion','Deducción por maternidad',20,'/deduccion-maternidad/'],
  ['ayudas','Ayudas territoriales',20,'/herramientas/buscador-ayudas/'],
  ['seguimiento','Revisar expedientes y pediatría',60,'/mi-panel/']
 ];
 function init(){
  const root=document.getElementById('pbCalendarApp');
  if(!root)return;
  let birth=new Date(Number(root.dataset.birth));
  if(Number.isNaN(birth.getTime()))return;
  const action=root.querySelector('.pb-cal-actions');
  if(!action)return;
  const btn=document.createElement('button');
  btn.type='button';btn.textContent='Descargar los 8 hitos (.ics) · Apple / Outlook';
  const copy=document.createElement('button');copy.type='button';copy.textContent='Copiar resumen';
  action.append(btn,copy);
  const hint=document.createElement('p');hint.className='pb-cal-hint';
  hint.textContent='Las fechas de estos ocho hitos son recordatorios personales sugeridos, no fechas límite legales. Al importar el archivo tendrás que aceptarlos en tu calendario. No enviamos datos a terceros.';
  action.insertAdjacentElement('afterend',hint);
  btn.addEventListener('click',()=>{
   const items=entries.map(([key,title,days,href])=>{
     const start=new Date(birth.getTime());start.setDate(start.getDate()+days);start.setHours(12,0,0,0);
     const end=new Date(start);end.setDate(end.getDate()+1);
     const uid='pb90-'+key+'-'+stamp(start)+'@papelesdelbebe.es';
     return ['BEGIN:VEVENT','UID:'+uid,'DTSTAMP:'+stamp(new Date())+'T120000Z','DTSTART;VALUE=DATE:'+stamp(start),'DTEND;VALUE=DATE:'+stamp(end),'SUMMARY:'+escape('Revisar: '+title+' (orientativo)'),'DESCRIPTION:'+escape('Fecha personal orientativa, NO es un plazo legal. Comprueba condiciones en https://www.papelesdelbebe.es'+href),'END:VEVENT'].join('\r\n');
   });
   const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Papeles del Bebe//90 dias//ES','CALSCALE:GREGORIAN',...items,'END:VCALENDAR'].join('\r\n')+'\r\n';
   const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
   const a=document.createElement('a');a.href=url;a.download='papeles-del-bebe-90-dias.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
  });
  copy.addEventListener('click',async()=>{
   const message='Mi calendario de trámites del bebé (recordatorios orientativos; no son plazos legales).\n'+entries.map(([key,title,d])=>'Día '+d+': '+title).join('\n')+'\nhttps://www.papelesdelbebe.es/herramientas/calendario-primeros-90-dias/';
   try{await navigator.clipboard.writeText(message);copy.textContent='Copiado ✓'}catch(_){copy.textContent='No se pudo copiar'}
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();