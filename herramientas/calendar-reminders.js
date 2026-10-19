(() => {
  if(window.PBReminder)return;
  const pad=n=>String(n).padStart(2,'0');
  const stamp=d=>d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+'00Z';
  const escapeIcs=s=>String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const fmtLocal=d=>d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'T'+pad(d.getHours())+pad(d.getMinutes())+'00';
  const base='https://www.papelesdelbebe.es';
  function create(task,date){
    if(!(date instanceof Date)||Number.isNaN(date.getTime()))return;
    const start=new Date(date);start.setHours(10,0,0,0);
    const end=new Date(start.getTime()+30*60*1000);
    const title='Revisar: '+task.title+' (recordatorio orientativo)';
    const url=base+task.href;
    const description='Recordatorio personal orientativo, NO es un vencimiento legal. Comprueba requisitos y plazos oficiales en '+url;
    const all=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Papeles del Bebe//Recordatorios//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT','UID:pb-'+encodeURIComponent(task.key)+'-'+stamp(start)+'@papelesdelbebe.es','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+escapeIcs(title),'DESCRIPTION:'+escapeIcs(description),'URL:'+url,'BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:-P1D','DESCRIPTION:Revisa tu tramite (fecha orientativa)','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n')+'\r\n';
    const blob=new Blob([all],{type:'text/calendar;charset=utf-8'});
    const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download='papeles-del-bebe-'+task.key+'.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),5000);
  }
  function google(task,date){
    const start=new Date(date);start.setHours(10,0,0,0);
    const end=new Date(start.getTime()+30*60*1000);
    const description='Fecha de revisión orientativa; no es un plazo legal. Comprueba fuentes oficiales: '+base+task.href;
    const p=new URLSearchParams({action:'TEMPLATE',text:'Revisar: '+task.title,dates:stamp(start)+'/'+stamp(end),details:description});
    window.open('https://calendar.google.com/calendar/render?'+p.toString(),'_blank','noopener,noreferrer');
  }
  function button(task,date){
    const div=document.createElement('div');div.className='pb-reminder-actions';
    div.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin:10px 0';
    const g=document.createElement('button');g.type='button';g.textContent='Google Calendar';g.className='plan-secondary pb-reminder-button';g.addEventListener('click',()=>google(task,date));
    const ics=document.createElement('button');ics.type='button';ics.textContent='Apple / Outlook / .ics';ics.className='plan-secondary pb-reminder-button';ics.addEventListener('click',()=>create(task,date));
    [g,ics].forEach(x=>{x.style.cssText='cursor:pointer;border:1px solid #cfd3ea;border-radius:11px;background:white;color:#4f56b8;padding:9px 12px;min-height:44px;font-weight:750';div.append(x)});
    return div;
  }
  window.PBReminder={button,create};
})();