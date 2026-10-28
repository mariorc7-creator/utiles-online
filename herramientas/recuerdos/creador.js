(()=>{
'use strict';
const root=document.getElementById('recuerdoApp');if(!root)return;
const mode=root.dataset.mode;
const definitions={
 invitacion:{title:'Crea tu invitación de cumpleaños',subtitle:'Personaliza y comparte tu invitación en menos de un minuto.',fields:[['nombre','Nombre','text'],['edad','Años que cumple','number'],['fecha','Fecha del cumpleaños','date'],['hora','Hora','time'],['lugar','Lugar','text'],['mensaje','Mensaje (opcional)','text']],photo:true},
 hitos:{title:'Tarjetas de hitos del bebé',subtitle:'Celebra cada pequeño gran momento.',fields:[['nombre','Nombre del bebé','text'],['hito','Hito que quieres recordar','select'],['fecha','Fecha (opcional)','date']],photo:true},
 primerano:{title:'Mi primer año en fotos',subtitle:'Reúne doce momentos en un recuerdo para siempre.',fields:[['nombre','Nombre del bebé','text'],['fecha','Fecha de nacimiento (opcional)','date']],photo:false}
};
const d=definitions[mode];if(!d)return;
const palette={crema:['#fff8ef','#d98568','#412d38'],lavanda:['#f5f2ff','#8a7bd2','#352e54'],menta:['#edfaf5','#479c84','#234b45']};
const photos={};
root.innerHTML='<div class="rec-layout"><section class="rec-form"><h2>Personaliza tu recuerdo</h2><p class="rec-sub">Los datos y las fotos se procesan en tu navegador; no se suben al servidor.</p><form id="recForm"></form><div class="rec-actions"><button type="button" id="recPng">Descargar imagen PNG</button><button type="button" id="recPrint">Imprimir / guardar PDF</button></div><p role="status" id="recStatus" aria-live="polite"></p></section><section class="rec-preview"><h2>Vista previa</h2><canvas id="recCanvas" width="900" height="1200" aria-label="Vista previa del recuerdo personalizado"></canvas></section></div>';
const form=document.getElementById('recForm'),canvas=document.getElementById('recCanvas'),ctx=canvas.getContext('2d');
const createField=(name,label,type)=>{
const box=document.createElement('label');box.className='rec-field';box.textContent=label;let input;
if(type==='select'){input=document.createElement('select');['1 mes','2 meses','3 meses','6 meses','9 meses','12 meses','Primera sonrisa','Primer diente','Primeros pasos','Primer cumpleaños'].forEach(v=>{let opt=document.createElement('option');opt.value=v;opt.textContent=v;input.append(opt);});}
else{input=document.createElement('input');input.type=type;if(type==='number'){input.min='1';input.max='99';}input.placeholder=name==='nombre'?'Nombre':name==='lugar'?'Dónde será':name==='mensaje'?'¡Te esperamos!':'';}
input.name=name;input.id='rec-'+name;input.autocomplete='off';box.append(input);form.append(box);return input;};
d.fields.forEach(f=>createField(...f));
const themes=createField('tema','Estilo','select');themes.replaceChildren();Object.keys(palette).forEach(v=>{let o=document.createElement('option');o.value=v;o.textContent={crema:'Cálido',lavanda:'Lavanda',menta:'Menta'}[v];themes.append(o);});
const pictureLabel=(id,label)=>{let l=document.createElement('label');l.className='rec-field';l.textContent=label;let input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp';input.dataset.photo=id;l.append(input);form.append(l);return input;};
if(mode==='primerano'){const heading=document.createElement('p');heading.className='rec-sub';heading.textContent='Añade hasta 12 fotos, una por cada mes. Puedes completar solo algunos meses.';form.append(heading);const grid=document.createElement('div');grid.className='rec-photo-grid';form.append(grid);for(let i=1;i<=12;i++){let l=document.createElement('label');l.textContent='Mes '+i;let el=document.createElement('input');el.type='file';el.accept='image/png,image/jpeg,image/webp';el.dataset.photo='m'+i;l.append(el);grid.append(l);}}
else if(d.photo)pictureLabel('main','Foto (opcional)');

const invitationTemplates=[
 ['osito','Osito dulce','Infantil','#f9e7d3','#bd7953','🧸'],
 ['globos','Fiesta de globos','Infantil','#fff0c7','#e95e70','🎈'],
 ['arcoiris','Arcoíris pastel','Infantil','#f8e4ed','#b67da8','🌈'],
 ['nubes','Nubes y estrellas','Infantil','#dff0ff','#6c94c2','☁️'],
 ['safari','Safari','Temática','#e7f0d9','#6f9956','🦁'],
 ['dinos','Dinosaurios','Temática','#e5f5d7','#4a9972','🦕'],
 ['unicornio','Unicornio mágico','Temática','#efe2ff','#ad82db','🦄'],
 ['bosque','Bosque encantado','Temática','#e5e9d5','#728563','🦊'],
 ['minimal','Minimal moderna','Elegante','#f7f7f5','#24282d','✦'],
 ['floral','Floral delicada','Elegante','#fce9ed','#b57a87','🌸'],
 ['boho','Boho natural','Elegante','#f3e7d7','#b57b54','☀️'],
 ['editorial','Editorial elegante','Elegante','#faf8f2','#a68b61','✧']
];
let activeTemplate='osito';
if(mode==='invitacion'){
 const section=document.createElement('section');section.className='rec-template-picker';
 section.innerHTML='<h2>1. Elige una plantilla</h2><p class="rec-sub">12 diseños diferentes. Después personaliza los datos y descarga tu invitación.</p><div class="rec-template-filters" role="group" aria-label="Filtrar plantillas"></div><div class="rec-template-gallery"></div>';
 root.prepend(section);const filters=section.querySelector('.rec-template-filters'),gallery=section.querySelector('.rec-template-gallery');
 function showTemplates(filter='Todas'){
   gallery.replaceChildren();
   invitationTemplates.filter(t=>filter==='Todas'||t[2]===filter).forEach(t=>{
     const button=document.createElement('button');button.type='button';button.className='rec-template-option';
     button.dataset.selected=String(t[0]===activeTemplate);
     button.setAttribute('aria-pressed',String(t[0]===activeTemplate));
     button.innerHTML='<span class="rec-template-art" aria-hidden="true" style="background:'+t[3]+';color:'+t[4]+'"><span class="rec-template-symbol">'+t[5]+'</span><span class="rec-template-lines">Feliz cumple</span></span><span class="rec-template-title">'+t[1]+'</span>';
     button.addEventListener('click',()=>{activeTemplate=t[0];gallery.querySelectorAll('button').forEach(b=>{const selected=b===button;b.dataset.selected=String(selected);b.setAttribute('aria-pressed',String(selected));});paint();document.getElementById('recStatus').textContent='Plantilla seleccionada: '+t[1];});
     gallery.append(button);
   });
 }
 ['Todas','Infantil','Temática','Elegante'].forEach(f=>{let b=document.createElement('button');b.type='button';b.textContent=f;b.setAttribute('aria-pressed',String(f==='Todas'));b.addEventListener('click',()=>{filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));showTemplates(f);});filters.append(b);});
 showTemplates();
 const style=document.createElement('style');style.textContent='.rec-template-picker{margin:0 0 22px;padding:19px;border:1px solid #dfe3f2;border-radius:20px;background:#fff}.rec-template-picker h2{margin:0 0 5px}.rec-template-filters{display:flex;flex-wrap:wrap;gap:7px;margin:15px 0}.rec-template-filters button{border:1px solid #d5daea;border-radius:999px;padding:8px 13px;background:#fff;color:#404e75;cursor:pointer}.rec-template-filters button[aria-pressed="true"]{background:#4d55bd;color:#fff}.rec-template-gallery{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:11px}.rec-template-option{border:2px solid #e0e3ed;background:#fff;border-radius:13px;padding:5px;cursor:pointer;min-width:0;text-align:left}.rec-template-option[data-selected="true"]{border-color:#4b55c9;box-shadow:0 0 0 2px #e3e5ff}.rec-template-art{aspect-ratio:3/4;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}.rec-template-symbol{font-size:clamp(25px,3vw,38px)}.rec-template-lines{font-family:Georgia,serif;font-size:clamp(10px,1.5vw,15px)}.rec-template-title{display:block;font-size:.76rem;font-weight:700;padding:7px 2px}.rec-template-option:focus-visible{outline:3px solid #646bd8;outline-offset:2px}@media(max-width:850px){.rec-template-gallery{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:520px){.rec-template-gallery{grid-template-columns:repeat(3,minmax(0,1fr))}.rec-template-picker{padding:12px}}';document.head.append(style);
}

const read=(key)=>form.elements.namedItem(key)?.value||'';
function text(t,x,y,size=44,color='#412d38',max=740){ctx.fillStyle=color;ctx.font='700 '+size+'px system-ui, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(t||''),x,y,max);}
function cover(img,x,y,w,h){const ratio=Math.max(w/img.width,h/img.height),rw=img.width*ratio,rh=img.height*ratio;ctx.drawImage(img,x+(w-rw)/2,y+(h-rh)/2,rw,rh);}
function frame(img,x,y,w,h,r=16){ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.clip();ctx.fillStyle='#fff';ctx.fillRect(x,y,w,h);if(img)cover(img,x,y,w,h);else{ctx.fillStyle='#bec5d7';ctx.font='22px system-ui';ctx.textAlign='center';ctx.fillText('Añade una foto',x+w/2,y+h/2);}ctx.restore();}

function drawInvitation(){
 const t=invitationTemplates.find(x=>x[0]===activeTemplate)||invitationTemplates[0];
 const [id,label,group,bg,accent,icon]=t;
 const name=read('nombre')||'Tu peque',years=read('edad')||'1',when=read('fecha')||'Fecha por confirmar',hour=read('hora')||'Hora por confirmar',where=read('lugar')||'Lugar por confirmar',msg=read('mensaje')||'¡Te esperamos!';
 ctx.fillStyle=bg;ctx.fillRect(0,0,900,1200);
 function blob(x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function line(x,y,X,Y,w=3){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.lineWidth=w;ctx.strokeStyle=accent;ctx.stroke();}
 function glyph(symbol,x,y,size=83){ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=size+'px system-ui';ctx.fillText(symbol,x,y);}
 function title(t,y,size=75,font='serif'){ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=id==='minimal'?'#20212a':id==='editorial'?'#564831':'#3d3441';ctx.font='700 '+size+'px '+font;ctx.fillText(t,450,y,785);}
 function info(y){text(when,450,y,38,accent);text(hour+' · '+where,450,y+60,31,'#454351');text(msg,450,y+132,31,accent);}
 const photo=photos.main;
 if(id==='globos'){for(let i=0;i<13;i++){let x=70+i*63, y=80+(i%4)*42;blob(x,y,27+i%3*7,['#e95e70','#65c8c7','#f9c75f','#a58bd8'][i%4]);line(x,y+28,x+9,y+112,2);}title('¡ESTÁS INVITADO!',290,59,'system-ui');title(name,408,100,'system-ui');title(years+' AÑOS',515,70,'system-ui');if(photo)frame(photo,275,560,350,305,35);info(photo?940:720);}
 else if(id==='minimal'){ctx.fillStyle='#24282d';ctx.fillRect(0,0,900,175);text('UNA CELEBRACIÓN ESPECIAL',450,90,31,'#fff');title(years,395,275,'system-ui');title(name,580,83,'system-ui');line(120,675,780,675,2);if(photo)frame(photo,318,708,264,195,0);info(photo?970:800);}
 else if(id==='editorial'){ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(72,72,756,1056);title('YOU ARE INVITED',165,36,'serif');title(name,355,112,'serif');title(years+'º CUMPLEAÑOS',470,45,'serif');line(245,550,655,550,2);if(photo)frame(photo,260,580,380,260,0);info(photo?930:700);}
 else if(id==='boho'){for(let i=0;i<5;i++){ctx.fillStyle=['#c78f67','#d9b89b','#91a68e','#e7c9a7','#b9836d'][i];ctx.beginPath();ctx.arc(450,405,250-i*36,Math.PI,0);ctx.lineTo(450+250-i*36,630);ctx.lineTo(450-250+i*36,630);ctx.fill();}title(name,190,92);title('CUMPLE '+years,735,63);if(photo)frame(photo,295,777,310,220,70);info(photo?1040:890);}
 else if(id==='floral'){for(let i=0;i<24;i++){let angle=i*Math.PI/12, r=345,x=450+Math.cos(angle)*r,y=500+Math.sin(angle)*r;blob(x,y,17,i%2?'#d9abb8':'#e9cbcf');blob(x+13,y+5,10,'#f8e0b7');}title('UN DÍA PARA CELEBRAR',172,43);title(name,340,91);title(years+' AÑITOS',455,58);if(photo)frame(photo,245,535,410,330,130);info(photo?950:730);}
 else if(id==='nubes'){for(let i=0;i<11;i++){let x=95+(i*127)%720,y=100+(i%3)*140;blob(x,y,34,'#fff');blob(x+30,y-10,42,'#fff');blob(x+68,y,30,'#fff');}glyph('🌙',450,265,108);title(name,480,96);title(years+' añito(s)',590,58);if(photo)frame(photo,255,655,390,240,55);info(photo?970:770);}
 else if(id==='arcoiris'){for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(450,440,285-i*32,Math.PI,2*Math.PI);ctx.lineWidth=24;ctx.strokeStyle=['#e7a4b1','#eac394','#e8dcb6','#b0d5c4','#b6c3e6','#cfb4e9'][i];ctx.stroke();}title(name,565,100);title('¡YA SON '+years+'!',680,56);if(photo)frame(photo,290,733,320,220,70);info(photo?1010:815);}
 else if(id==='safari'||id==='dinos'||id==='bosque'||id==='unicornio'||id==='osito'){for(let i=0;i<10;i++){let x=80+(i*151)%750,y=85+(i%4)*220;blob(x,y,24,id==='dinos'?'#b4d8a0':id==='unicornio'?'#e1c6f0':id==='safari'?'#c2d4a7':'#ead4bf');}glyph(icon,450,260,145);title(name,455,108);title('CUMPLE '+years,565,64);if(photo)frame(photo,265,645,370,255,30);info(photo?977:745);}
 else {for(let i=0;i<12;i++)glyph(['🌟','✨','🎉'][i%3],90+(i*139)%740,125+(i%4)*205,50);title(name,375,108);title(years+' añito(s)',510,66);if(photo)frame(photo,275,600,350,275,36);info(photo?965:740);}
}

function paint(){const [bg,accent,ink]=palette[read('tema')||'crema'];ctx.fillStyle=bg;ctx.fillRect(0,0,900,1200);ctx.strokeStyle=accent;ctx.lineWidth=8;ctx.strokeRect(35,35,830,1130);const nombre=read('nombre')||'Tu bebé';if(mode==='invitacion')drawInvitation();
if(mode==='hitos'){text('MI GRAN MOMENTO',450,122,41,accent);text(read('hito')||'1 mes',450,250,82,ink);frame(photos.main,150,335,600,620,26);text(nombre,450,1010,52,ink);text(read('fecha'),450,1080,30,accent);}
if(mode==='primerano'){text('MI PRIMER AÑO',450,125,60,accent);text(nombre,450,220,67,ink);for(let i=0;i<12;i++){const col=i%3,row=Math.floor(i/3),x=87+col*248,y=300+row*202;frame(photos['m'+(i+1)],x,y,228,163,12);text('Mes '+(i+1),x+114,y+181,20,ink,220);}text(read('fecha')||'Doce meses de recuerdos',450,1140,29,accent);}}
async function loadImage(file){return new Promise((resolve,reject)=>{const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Imagen no válida'))};img.src=url;});}
form.addEventListener('input',paint);form.addEventListener('change',async e=>{if(e.target.dataset.photo){try{const file=e.target.files?.[0];if(file&&file.size>12*1024*1024)throw Error('Máximo 12 MB por imagen');photos[e.target.dataset.photo]=file?await loadImage(file):null;document.getElementById('recStatus').textContent='Foto actualizada';}catch(err){document.getElementById('recStatus').textContent=err.message;}paint();}});
document.getElementById('recPng').addEventListener('click',()=>{paint();canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='papelesdelbebe-'+mode+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);},'image/png');});
document.getElementById('recPrint').addEventListener('click',()=>{paint();const data=canvas.toDataURL('image/png');const w=window.open('','_blank');if(!w){document.getElementById('recStatus').textContent='Permite las ventanas emergentes para imprimir.';return;}w.document.write('<!doctype html><html lang="es"><title>Imprimir recuerdo</title><style>body{margin:0;text-align:center}img{display:block;max-height:100vh;max-width:100%;margin:auto}@page{size:A4 portrait;margin:5mm}@media print{img{width:100%;height:auto}}</style><img src="'+data+'" onload="window.print()"></html>');w.document.close();});
paint();
})();