(() => {
  'use strict';
  const canvas=document.getElementById('gift-canvas');
  if(!canvas || !canvas.getContext) return;
  const ctx=canvas.getContext('2d');
  const W=1200,H=1600;
  const fields={name:document.getElementById('baby-name'),date:document.getElementById('baby-date'),time:document.getElementById('baby-time'),weight:document.getElementById('baby-weight'),height:document.getElementById('baby-height'),place:document.getElementById('baby-place')};
  const status=document.getElementById('gift-status');
  let theme='minimal';
  const themes={
    minimal:{background:'#faf8f3',ink:'#544b47',soft:'#99867a',accent:'#d5bda8',line:'#e7ddd3',font:'Georgia, serif'},
    stars:{background:'#f0f5fc',ink:'#344d72',soft:'#687eaa',accent:'#b5c8ed',line:'#d1dff2',font:'Georgia, serif'},
    play:{background:'#fff7f0',ink:'#805b54',soft:'#b37d78',accent:'#f6c7aa',line:'#f4ddcb',font:'Georgia, serif'}
  };
  function line(text,y,size,color,font,maxWidth=1010){
    ctx.fillStyle=color;ctx.font=font.replace('{size}',String(size));
    let width=ctx.measureText(text).width;
    if(width>maxWidth && width>0) size=Math.max(32,Math.floor(size*maxWidth/width));
    ctx.font=font.replace('{size}',String(size));
    ctx.textAlign='center';ctx.fillText(text,W/2,y);
  }
  function circle(x,y,r,fill){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
  function star(x,y,r,fill,points=5){ctx.beginPath();for(let i=0;i<points*2;i++){const rr=i%2===0?r:r*.43;const a=i*Math.PI/points-Math.PI/2;const px=x+Math.cos(a)*rr,py=y+Math.sin(a)*rr;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
  function heart(x,y,s,color){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.beginPath();ctx.moveTo(0,24);ctx.bezierCurveTo(-40,-12,-45,-36,-16,-39);ctx.bezierCurveTo(0,-42,0,-31,0,-27);ctx.bezierCurveTo(0,-31,0,-42,16,-39);ctx.bezierCurveTo(45,-36,40,-12,0,24);ctx.fillStyle=color;ctx.fill();ctx.restore();}
  function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function decorations(p){
    if(theme==='minimal'){
      ctx.strokeStyle=p.accent;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(W/2,380,190,180,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(W/2,380,173,164,0,0,Math.PI*2);ctx.stroke();
      line('✦',417,85,p.soft,'{size}px Georgia, serif');
    } else if(theme==='stars'){
      const stars=[[240,255,18],[370,342,10],[810,298,15],[943,438,12],[282,548,10],[920,585,19],[520,246,9],[715,226,12]];
      stars.forEach(([x,y,r])=>star(x,y,r,p.soft));
      circle(608,403,110,'#f5da98');circle(658,367,107,p.background);
      star(460,430,16,'#e1b96b');star(745,480,22,'#e1b96b');
    }else{
      const balloons=[[430,380,90,'#e6baab'],[605,350,104,'#f2d29c'],[760,395,86,'#d6dfc5']];
      balloons.forEach(([x,y,r,c])=>{ctx.beginPath();ctx.ellipse(x,y,r*.78,r,0,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();ctx.beginPath();ctx.moveTo(x,y+r);ctx.quadraticCurveTo(x+30,650,x,720);ctx.strokeStyle='#c9b4a1';ctx.lineWidth=3;ctx.stroke();});
      heart(598,552,.8,'#d78b82');
    }
  }
  function formatDate(value){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return '';
    const [y,m,d]=value.split('-').map(Number);
    const date=new Date(y,m-1,d);
    if(date.getFullYear()!==y||date.getMonth()!==m-1||date.getDate()!==d)return '';
    return new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'long',year:'numeric'}).format(date);
  }
  function safeNum(raw,min,max){if(raw.trim()==='')return '';const n=Number(raw);return Number.isFinite(n)&&n>=min&&n<=max?n:'';}
  function draw(){
    const p=themes[theme];ctx.clearRect(0,0,W,H);
    ctx.fillStyle=p.background;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=p.line;ctx.lineWidth=4;ctx.strokeRect(64,64,W-128,H-128);
    decorations(p);
    line('BIENVENIDO AL MUNDO',800,32,p.soft,'700 {size}px Arial, sans-serif');
    const name=fields.name.value.trim()||'Tu bebé';
    line(name,950,Math.min(112,name.length>15?74:112),p.ink,'{size}px Georgia, serif',1000);
    ctx.strokeStyle=p.accent;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(420,1004);ctx.lineTo(780,1004);ctx.stroke();
    const date=formatDate(fields.date.value);
    const place=fields.place.value.trim();
    const primary=[date,place].filter(Boolean).join(' · ');
    if(primary)line(primary,1083,36,p.ink,'{size}px Arial, sans-serif',1040);
    const time= /^([01]\d|2[0-3]):[0-5]\d$/.test(fields.time.value)?fields.time.value+' h':'';
    const weight=safeNum(fields.weight.value,300,9000);
    const height=safeNum(fields.height.value,20,75);
    const facts=[time,weight!==''?new Intl.NumberFormat('es-ES').format(weight)+' g':'',height!==''?new Intl.NumberFormat('es-ES',{maximumFractionDigits:1}).format(height)+' cm':''].filter(Boolean);
    if(facts.length)line(facts.join('  ·  '),1180,36,p.soft,'{size}px Arial, sans-serif',980);
    line('Un recuerdo para siempre',1336,39,p.ink,'italic {size}px Georgia, serif');
    line('Papeles del Bebé · regalo gratuito',1475,22,p.soft,'{size}px Arial, sans-serif');
  }
  const form=document.getElementById('gift-form');
  form.addEventListener('input',()=>{draw();status.textContent='Vista previa actualizada.'});
  form.addEventListener('change',()=>{draw()});
  document.querySelectorAll('.style-picker').forEach(b=>b.addEventListener('click',()=>{
    theme=b.dataset.style;
    document.querySelectorAll('.style-picker').forEach(item=>item.setAttribute('aria-pressed',String(item===b)));
    draw();status.textContent='Estilo cambiado.';
  }));
  document.getElementById('gift-download').addEventListener('click',()=>{
    draw();const button=document.getElementById('gift-download');
    const makeFile=blob=>{
      if(!blob){status.textContent='No se pudo crear el PNG. Prueba con un navegador actualizado.';return;}
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      const slug=(fields.name.value||'bebe').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').slice(0,35)||'bebe';
      a.href=url;a.download='lamina-nacimiento-'+slug+'.png';document.body.appendChild(a);a.click();a.remove();
      window.setTimeout(()=>URL.revokeObjectURL(url),15000);
      status.textContent='Lámina descargada. ¡Disfruta de tu obsequio!';
    };
    button.disabled=true;
    canvas.toBlob(blob=>{button.disabled=false;makeFile(blob)},'image/png');
  });
  document.getElementById('gift-reset').addEventListener('click',()=>{
    form.reset();fields.name.value='';theme='minimal';
    document.querySelectorAll('.style-picker').forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.style==='minimal')));
    draw();fields.name.focus();status.textContent='Lista para crear otra lámina.';
  });
  draw();
})();