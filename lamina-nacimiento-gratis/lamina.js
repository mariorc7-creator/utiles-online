(() => {
  'use strict';
  const canvas=document.getElementById('gift-canvas');
  const ctx=canvas && canvas.getContext && canvas.getContext('2d');
  if(!ctx)return;
  const W=1200,H=1600,TAU=Math.PI*2;
  const $=id=>document.getElementById(id);
  const fields={name:$('baby-name'),date:$('baby-date'),time:$('baby-time'),weight:$('baby-weight'),height:$('baby-height'),place:$('baby-place')};
  const photoInput=$('gift-photo'),photoArea=$('gift-photo-area'),photoControls=$('gift-photo-controls'),zoomInput=$('gift-photo-zoom'),status=$('gift-status');
  let theme='minimal',photo=null,photoUrl=null,scale=1,offsetX=0,offsetY=0,drag=null;
  const themes={
    minimal:{bg:'#fbf7f0',text:'#5d5149',muted:'#a18a76',line:'#dfcbb6'},
    watercolor:{bg:'#f9faf5',text:'#4b635e',muted:'#839c88',line:'#d4dfcb'},
    editorial:{bg:'#fff7f3',text:'#54414b',muted:'#ad7c85',line:'#ead0cb'},
    photo:{bg:'#fbfaf8',text:'#35465c',muted:'#8b9bac',line:'#dce2e7'}
  };
  const line=(a,b,c,d)=>{ctx.strokeStyle=d;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,b);ctx.stroke()};
  function text(str,y,size,color,weight='400',family='Georgia, serif',maxWidth=1000){
    const msg=String(str||'');if(!msg)return;
    ctx.font=weight+' '+size+'px '+family;
    const w=ctx.measureText(msg).width;
    if(w>maxWidth)size=Math.max(26,Math.floor(size*maxWidth/w));
    ctx.font=weight+' '+size+'px '+family;ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(msg,W/2,y);
  }
  function ellipse(x,y,rx,ry,color,rot=0){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,0,TAU);ctx.fill()}
  function star(x,y,r,color,points=6){
    ctx.fillStyle=color;ctx.beginPath();
    for(let i=0;i<points*2;i++){const a=i*Math.PI/points-Math.PI/2,k=i%2?r*.38:r;const xx=x+Math.cos(a)*k,yy=y+Math.sin(a)*k;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.closePath();ctx.fill();
  }
  function petal(x,y,size,color,rot=0){ellipse(x,y,size*.47,size,color,rot)}
  function flower(x,y,size,color){
    for(let i=0;i<5;i++){const a=i*TAU/5;petal(x+Math.cos(a)*size*.52,y+Math.sin(a)*size*.52,size*.65,color,a)}
    ellipse(x,y,size*.35,size*.35,'#e8c58d');
  }
  function botanical(){
    ctx.save();ctx.globalAlpha=.65;
    [[185,440,-1],[1020,500,1],[180,1230,-1],[1010,1245,1]].forEach(([x,y,dir],idx)=>{
      ctx.strokeStyle='#91af9c';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y+115);ctx.quadraticCurveTo(x+dir*115,y-20,x+dir*23,y-180);ctx.stroke();
      for(let i=0;i<6;i++){const a=i*.6;const xx=x+dir*(26+Math.sin(a)*44),yy=y+70-i*45;ellipse(xx,yy,22,47,i%2?'#d4e2d4':'#bfd4c5',dir*(.2+i*.25))}
      flower(x+dir*23,y-162,30,idx%2?'#e7c6c1':'#e5d7a6');
    });ctx.restore();
  }
  function minimalArt(){
    ctx.strokeStyle='#d7c1ab';ctx.lineWidth=3;ctx.beginPath();ctx.arc(600,405,171,0,TAU);ctx.stroke();
    ctx.strokeStyle='#eadfd0';ctx.beginPath();ctx.arc(600,405,187,0,TAU);ctx.stroke();
    for(let i=0;i<16;i++){const a=i*TAU/16;ellipse(600+Math.cos(a)*180,405+Math.sin(a)*180,4,4,'#c9b7a4')}
    flower(600,418,48,'#e9d6ca');ellipse(600,418,15,15,'#f8e9be');
  }
  function editorialArt(){
    ctx.fillStyle='#e8d5cc';ctx.fillRect(124,118,952,455);
    ctx.fillStyle='#f5e3d9';ctx.beginPath();ctx.ellipse(795,350,310,295,-.2,0,TAU);ctx.fill();
    ctx.fillStyle='#d3b1aa';ctx.beginPath();ctx.moveTo(270,566);ctx.bezierCurveTo(290,250,530,225,635,360);ctx.bezierCurveTo(470,388,455,510,445,566);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#aa7c82';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(660,540);ctx.bezierCurveTo(695,430,755,330,820,270);ctx.stroke();
    for(let i=0;i<5;i++){const x=685+i*33,y=490-i*42;ellipse(x,y-22,19,41,'#b9a9a4',-.65);ellipse(x+30,y+5,16,35,'#c3b19e',.6)}
  }
  function cover(img,x,y,w,h,zoom=1,dx=0,dy=0){
    if(!img)return;
    const natural=Math.max(w/img.width,h/img.height)*zoom;
    const iw=img.width*natural,ih=img.height*natural;
    const ox=Math.min(0,Math.max(w-iw,(w-iw)/2+dx));
    const oy=Math.min(0,Math.max(h-ih,(h-ih)/2+dy));
    ctx.drawImage(img,x+ox,y+oy,iw,ih);
  }
  function photoArt(){
    ctx.save();ctx.beginPath();ctx.roundRect(168,156,864,690,32);ctx.clip();
    if(photo){cover(photo,168,156,864,690,scale,offsetX,offsetY)}
    else{const grad=ctx.createLinearGradient(170,160,1030,850);grad.addColorStop(0,'#e2e9ee');grad.addColorStop(1,'#f6e5da');ctx.fillStyle=grad;ctx.fillRect(168,156,864,690);ellipse(595,480,135,150,'#ffffff8a');text('TU FOTO AQUÍ',700,35,'#65758b','600','Arial, sans-serif')}
    ctx.restore();ctx.strokeStyle='#e6dfd7';ctx.lineWidth=7;ctx.strokeRect(168,156,864,690);
  }
  function dateFormatted(raw){
    if(!/^\d{4}-\d\d-\d\d$/.test(raw))return '';
    const parts=raw.split('-').map(Number),d=new Date(parts[0],parts[1]-1,parts[2]);
    if(d.getFullYear()!==parts[0]||d.getMonth()!==parts[1]-1||d.getDate()!==parts[2])return '';
    return new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'long',year:'numeric'}).format(d);
  }
  function numeric(raw,min,max){if(!raw.trim())return '';const n=Number(raw);return Number.isFinite(n)&&n>=min&&n<=max?n:''}
  function draw(){
    const p=themes[theme];ctx.clearRect(0,0,W,H);ctx.fillStyle=p.bg;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=p.line;ctx.lineWidth=3;ctx.strokeRect(58,58,W-116,H-116);
    if(theme==='minimal')minimalArt();
    if(theme==='watercolor')botanical();
    if(theme==='editorial')editorialArt();
    if(theme==='photo')photoArt();
    const photoMode=theme==='photo';
    const firstY=photoMode?962:theme==='editorial'?750:725;
    text(photoMode?'NUESTRO PEQUEÑO GRAN MILAGRO':'UN NUEVO COMIENZO',firstY,29,p.muted,'700','Arial, sans-serif');
    const name=fields.name.value.trim()||'Tu bebé';
    text(name,firstY+142,theme==='editorial'?128:112,p.text,'400','Georgia, serif',1000);
    line(420,firstY+195,780,firstY+195,p.line);
    const dt=dateFormatted(fields.date.value),place=fields.place.value.trim();
    const detail=[dt,place].filter(Boolean).join('  ·  ');
    if(detail)text(detail,firstY+265,36,p.text,'400','Arial, sans-serif',1000);
    const tm=/^([01]\d|2[0-3]):[0-5]\d$/.test(fields.time.value)?fields.time.value+' h':'';
    const weight=numeric(fields.weight.value,300,9000),height=numeric(fields.height.value,20,75);
    const stats=[tm,weight!==''?new Intl.NumberFormat('es-ES').format(weight)+' g':'',height!==''?new Intl.NumberFormat('es-ES',{maximumFractionDigits:1}).format(height)+' cm':''].filter(Boolean);
    if(stats.length)text(stats.join('   ·   '),firstY+350,33,p.muted,'400','Arial, sans-serif',1020);
    const footerY=photoMode?1450:1375;
    if(theme==='minimal')text('Y de pronto, todo cobró sentido',footerY,38,p.text,'italic','Georgia, serif');
    else if(theme==='watercolor'){flower(585,footerY-7,19,'#e8d5d0');flower(630,footerY+10,13,'#e9dca9')}
    else if(theme==='editorial')text('Bienvenido a nuestro mundo',footerY,33,p.muted,'italic','Georgia, serif');
    else text('Para siempre en nuestro corazón',footerY,33,p.text,'italic','Georgia, serif');
    // Diseño sin marca de agua, sin pie publicitario y sin datos enviados.
  }
  function setTheme(v){
    theme=v;document.querySelectorAll('.style-picker').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.style===v)));
    photoArea.hidden=v!=='photo';draw();status.textContent='Diseño actualizado.';
  }
  document.querySelectorAll('.style-picker').forEach(btn=>btn.addEventListener('click',()=>setTheme(btn.dataset.style)));
  $('gift-form').addEventListener('input',e=>{if(e.target===photoInput)return;draw();status.textContent='Vista previa actualizada.'});
  function cleanup(){if(photoUrl){URL.revokeObjectURL(photoUrl);photoUrl=null}photo=null;offsetX=0;offsetY=0;scale=1;zoomInput.value='1';photoControls.hidden=true}
  photoInput.addEventListener('change',()=>{
    const file=photoInput.files&&photoInput.files[0];
    if(!file){cleanup();draw();return}
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12*1024*1024){photoInput.value='';status.textContent='Usa JPG, PNG o WebP de hasta 12 MB.';return}
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{cleanup();photoUrl=url;photo=img;photoControls.hidden=false;draw();status.textContent='Foto cargada. Puedes arrastrarla en la lámina.'};
    img.onerror=()=>{URL.revokeObjectURL(url);status.textContent='No se pudo abrir la foto.'};
    img.src=url;
  });
  zoomInput.addEventListener('input',()=>{scale=Number(zoomInput.value);draw()});
  $('gift-photo-remove').addEventListener('click',()=>{photoInput.value='';cleanup();draw();status.textContent='Foto eliminada.'});
  canvas.addEventListener('pointerdown',e=>{
    if(theme!=='photo'||!photo)return;
    const rect=canvas.getBoundingClientRect();
    const px=(e.clientX-rect.left)*W/rect.width,py=(e.clientY-rect.top)*H/rect.height;
    if(px<168||px>1032||py<156||py>846)return;
    drag={x:e.clientX,y:e.clientY,ox:offsetX,oy:offsetY};
    canvas.setPointerCapture(e.pointerId);canvas.style.touchAction='none';
  });
  canvas.addEventListener('pointermove',e=>{
    if(!drag)return;
    const rect=canvas.getBoundingClientRect();offsetX=drag.ox+(e.clientX-drag.x)*W/rect.width;offsetY=drag.oy+(e.clientY-drag.y)*H/rect.height;draw();
  });
  function endDrag(){drag=null;canvas.style.touchAction=''}
  canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
  $('gift-download').addEventListener('click',()=>{
    draw();const b=$('gift-download');b.disabled=true;
    canvas.toBlob(blob=>{
      b.disabled=false;if(!blob){status.textContent='No se pudo generar la imagen.';return}
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      const slug=(fields.name.value||'bebe').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').slice(0,34)||'bebe';
      a.href=url;a.download='lamina-nacimiento-'+slug+'.png';document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),15000);status.textContent='¡Lámina descargada!';
    },'image/png');
  });
  $('gift-reset').addEventListener('click',()=>{const form=$('gift-form');form.reset();fields.name.value='';photoInput.value='';cleanup();setTheme('minimal');fields.name.focus();status.textContent='Lista para crear otra lámina.'});
  window.addEventListener('pagehide',()=>{if(photoUrl)URL.revokeObjectURL(photoUrl)});
  draw();
})();