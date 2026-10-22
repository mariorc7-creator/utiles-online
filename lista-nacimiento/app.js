(()=>{'use strict';
const KEY='pb_gift_list_v1',nameEl=document.getElementById('listName'),list=document.getElementById('giftItems'),note=document.getElementById('notice'),form=document.getElementById('giftForm');
const starter=[['Cuna o minicuna','Descanso'],['Silla de coche','Paseo'],['Cochecito','Paseo'],['Bañera infantil','Higiene'],['Bodies de algodón','Ropa'],['Muselinas','Ropa'],['Pañales','Higiene'],['Termómetro digital','Higiene']];
const recommended=[["Cuna o minicuna","Descanso","Elige una superficie de descanso firme y despejada."],["Colchón compatible con la cuna","Descanso","Que ajuste bien al tamaño de la cuna."],["Sábanas bajeras ajustables","Descanso","Un par de recambio suelen venir bien."],["Silla de coche para recién nacido","Paseo","Solo si vais a desplazaros en coche; comprueba homologación y compatibilidad."],["Cochecito o sistema de paseo","Paseo","Según el tipo de paseos y espacio disponible."],["Portabebés ergonómico","Paseo","Opcional; que sea adecuado a la edad y usado correctamente."],["Bodies de algodón","Ropa","Pocas prendas de talla inicial."],["Pijamas o peleles","Ropa","Adaptados a la temporada."],["Muselinas o paños","Ropa","Para cambios y cuidados cotidianos."],["Pañales de talla inicial","Higiene","Evita acumular demasiados de una sola talla."],["Toallitas o material de limpieza","Higiene","Según vuestras preferencias."],["Bañera infantil","Higiene","Opcional si ya tenéis una alternativa segura."],["Termómetro digital","Higiene","Útil para los primeros meses."],["Cambiador o superficie estable","Higiene","Una superficie segura y material a mano."],["Biberones","Alimentación","Solo si los necesitáis según vuestra forma de alimentación."],["Baberos o paños de lactancia","Alimentación","Pueden resultar prácticos."],["Mochila o bolso para pañales","Otros","También sirve un bolso que ya tengáis."],["Luz nocturna suave","Otros","Opcional para las tomas nocturnas."]];
const newId=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
let guest=false,data={title:'Mi lista de nacimiento',items:[]};
const safeText=s=>String(s||'').slice(0,1200);
const sanitize=x=>({title:safeText(x.title).slice(0,70)||'Mi lista de nacimiento',items:(Array.isArray(x.items)?x.items:[]).slice(0,65).map(i=>({id:safeText(i.id||newId()),name:safeText(i.name).slice(0,90),category:safeText(i.category).slice(0,40),price:safeText(i.price).slice(0,20),url:/^https:\/\//i.test(i.url||'')?safeText(i.url):'',note:safeText(i.note).slice(0,350),status:['Disponible','Reservado','Recibido'].includes(i.status)?i.status:'Disponible'})).filter(i=>i.name)});
function load(){try{let v=JSON.parse(localStorage.getItem(KEY)||'null');if(v)data=sanitize(v)}catch(_){}}
function store(){try{localStorage.setItem(KEY,JSON.stringify(data));note.textContent='Cambios guardados en este navegador.'}catch(_){note.textContent='No se ha podido guardar en este navegador.'}}
function el(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n}
function btn(label,fn){const b=el('button','',label);b.type='button';b.addEventListener('click',fn);return b}
function render(){nameEl.value=data.title;document.getElementById('listHeading').textContent=data.title;document.getElementById('counter').textContent=data.items.length+' regalos · '+data.items.filter(x=>x.status==='Reservado').length+' reservados · '+data.items.filter(x=>x.status==='Recibido').length+' recibidos';list.replaceChildren();
if(!data.items.length)list.appendChild(el('p','empty','Aún no hay regalos. Añade el primero para empezar.'));
data.items.forEach(item=>{const a=el('article','gift-item'),content=el('div'),act=el('div','item-actions');const tag=el('span','tag',item.category);content.append(tag,el('h3','',item.name));if(item.price)content.appendChild(el('p','','Precio orientativo: '+item.price+' €'));if(item.note)content.appendChild(el('p','',item.note));content.appendChild(el('span','status',item.status));if(item.url){const link=el('a','action','Ver producto ↗');link.href=item.url;link.target='_blank';link.rel='nofollow noopener noreferrer';content.appendChild(document.createElement('br'));content.appendChild(link)}
if(guest){act.appendChild(btn('Quiero regalarlo ↗',()=>{const msg='Hola, me gustaría regalar «'+item.name+'» de vuestra lista de nacimiento. ¿Sigue disponible?';window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank','noopener') }));}
else {const select=el('select');select.setAttribute('aria-label','Estado de '+item.name);['Disponible','Reservado','Recibido'].forEach(st=>{const o=el('option','',st);o.value=st;o.selected=item.status===st;select.appendChild(o)});select.addEventListener('change',()=>{item.status=select.value;store();render()});act.appendChild(select);act.appendChild(btn('Editar',()=>edit(item)));act.appendChild(btn('Quitar',()=>{if(!confirm('¿Quitar «'+item.name+'» de la lista?'))return;data.items=data.items.filter(x=>x!==item);store();render()}))}
a.append(content,act);list.appendChild(a)});
}
function edit(item){const n=prompt('Nombre del producto:',item.name);if(n===null)return;if(!n.trim())return;item.name=n.trim().slice(0,90);const txt=prompt('Notas:',item.note);if(txt!==null)item.note=txt.slice(0,350);store();render()}
function utf8b64(x){let arr=new TextEncoder().encode(JSON.stringify(x)),s='';arr.forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function decode(s){const b=atob(s.replace(/-/g,'+').replace(/_/g,'/'));return JSON.parse(new TextDecoder().decode(Uint8Array.from(b,c=>c.charCodeAt(0))))}
function shareLink(){const clean=sanitize(data);clean.items.forEach(i=>delete i.id);return location.origin+'/lista-nacimiento/#lista='+utf8b64(clean)}
function share(){const url=shareLink();if(url.length>7800){note.textContent='La lista es demasiado larga para compartirla como enlace. Reduce artículos o notas.';return null}return url}
function init(){const fragment=location.hash.startsWith('#lista=')?location.hash.slice(7):null;if(fragment){try{data=sanitize(decode(fragment));guest=true}catch(_){load();note.textContent='El enlace compartido no es válido.'}}else load();
if(guest){document.getElementById('giftStart')?.remove();document.getElementById('editor').remove();document.getElementById('shareActions').classList.add('is-hidden');document.getElementById('subtitle').textContent='Una lista compartida para ayudarte a elegir un regalo. Consulta disponibilidad con la familia antes de comprar.';document.getElementById('guestInfo').querySelector('h2').textContent='¿Quieres elegir un regalo?'}
else{
 const start=document.getElementById('giftStart');
 const recommendedBtn=document.getElementById('recommendedBtn');
 const customBtn=document.getElementById('customBtn');
 function fillRecommended(){
   if(data.items.length && !confirm('Ya tienes una lista guardada. ¿Quieres añadir las ideas recomendadas sin borrar tus regalos actuales?'))return;
   const names=new Set(data.items.map(i=>i.name.toLocaleLowerCase('es')));
   recommended.forEach(([name,category,note])=>{
     if(!names.has(name.toLocaleLowerCase('es')))data.items.push({id:newId(),name,category,price:'',url:'',note,status:'Disponible'});
   });
   store();render();start.classList.add('is-hidden');
   document.getElementById('listHeading').scrollIntoView({behavior:'smooth',block:'start'});
 }
 recommendedBtn?.addEventListener('click',fillRecommended);
 customBtn?.addEventListener('click',()=>{
   if(data.items.length && !confirm('¿Quieres empezar una lista vacía? Se eliminarán los regalos actuales de este navegador.'))return;
   data.items=[];store();render();start.classList.add('is-hidden');
   document.getElementById('editor').scrollIntoView({behavior:'smooth',block:'start'});
 });
 if(data.items.length)start.querySelector('#giftStartHint').textContent='Ya tienes '+data.items.length+' regalos guardados. Puedes añadir los recomendados o empezar una lista nueva.';
 nameEl.addEventListener('change',()=>{data.title=nameEl.value.trim().slice(0,70)||'Mi lista de nacimiento';store();render()});form.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(form);const name=safeText(f.get('name')).trim();if(!name)return;data.items.push({id:newId(),name,category:safeText(f.get('category')),price:safeText(f.get('price')),url:safeText(f.get('url')),note:safeText(f.get('note')),status:'Disponible'});store();form.reset();render()});document.getElementById('starterBtn').addEventListener('click',()=>{const names=new Set(data.items.map(x=>x.name.toLowerCase()));starter.forEach(([name,category])=>{if(!names.has(name.toLowerCase()))data.items.push({id:newId(),name,category,price:'',url:'',note:'',status:'Disponible'})});store();render()});
document.getElementById('copyBtn').addEventListener('click',async()=>{const url=share();if(!url)return;try{await navigator.clipboard.writeText(url);note.textContent='Enlace copiado. La copia no se sincroniza con cambios futuros.'}catch(_){prompt('Copia este enlace:',url)}});
document.getElementById('shareBtn').addEventListener('click',()=>{const url=share();if(url)window.open('https://wa.me/?text='+encodeURIComponent('Esta es nuestra lista de nacimiento 🎁 '+url),'_blank','noopener')});document.getElementById('printBtn').addEventListener('click',()=>window.print());}
render()}
init();
})();