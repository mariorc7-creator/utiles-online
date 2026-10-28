#!/usr/bin/env node
// PapelesDelBebe / Buffer: verificación sin publicar por defecto.
const API = 'https://api.buffer.com';
const token = process.env.BUFFER_API_KEY;
if (!token) throw new Error('Falta BUFFER_API_KEY en Actions secrets');
async function query(gql, variables) {
 const r = await fetch(API,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({query:gql,variables})});
 if(!r.ok) throw new Error('Buffer HTTP '+r.status);
 const j=await r.json();
 if(j.errors?.length) throw new Error(j.errors.map(x=>x.message).join('; '));
 return j.data;
}
const organizations = (await query('query { account { organizations { id name } } }')).account?.organizations || [];
const matches=[];
for(const org of organizations) {
 const channels=(await query('query { channels(input:{organizationId:'+JSON.stringify(org.id)+'}) { id name displayName service } }')).channels || [];
 for(const c of channels) if(/twitter|^x$/i.test(c.service||'') && /papelesdelbebe/i.test([c.name,c.displayName].join(' ')))matches.push(c);
}
if(matches.length!==1) throw new Error('Se esperaba exactamente un canal X PapelesDelBebe; encontrados: '+matches.length+'. No se publicará nada.');
console.log('Conexión Buffer correcta; canal X verificado: '+matches[0].name+'.');
if(process.env.PUBLISH!=='true') {console.log('MODO PRUEBA: no se creó ninguna publicación.');process.exit(0);}
if(process.env.AUTO_PUBLISH_ENABLED!=='true') throw new Error('Publicación desactivada: configurar variable AUTO_PUBLISH_ENABLED=true para activarla.');
const slot=process.env.SLOT;
if(!['morning','evening','launch'].includes(slot))throw new Error('SLOT inválido');
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const bank = {
 morning:[
 'Ser adulto era decidir qué querías hacer. Ser padre es negociar con alguien que aún no sabe pronunciar «negociar». 😂',
 'El verdadero lujo en 2026 no es un coche deportivo. Es encontrar un trámite público que funcione a la primera. 🏆',
 'La vida te da dos opciones: madrugar o tener hijos. Con hijos te llevas las dos. 😂',
 'Nos dijeron que internet nos ahorraría papeleo. Ahora imprimimos un PDF para escanearlo y volverlo a subir. 👏',
 'Un bebé aprende a decir «no» antes que muchos adultos a poner límites. Menudo máster exprés. 😂',
 'En España ya no preguntamos «¿cuántos hijos quieres?». Preguntamos «¿has mirado cuánto cuesta la guardería?».',
 'Hay gente que busca adrenalina saltando en paracaídas. Otros intentamos conseguir una cita administrativa en plazo. 😂'
 ],
 evening:[
 'Si vais a tener un bebé, comprobad las ayudas autonómicas y municipales: no todas se conceden automáticamente. 👶 papelesdelbebe.es',
 'El bebé llega sin manual. Los trámites, con 14 ventanas abiertas y tres contraseñas distintas. 😂',
 'La primera palabra del bebé suele emocionar. La primera notificación electrónica, bastante menos. 👶',
 'Cuidado con los titulares «hasta 1.000 €»: ese «hasta» suele tener más trabajo detrás que la propia solicitud. 👀',
 'El carrito se monta en una tarde. Entender qué ayuda corresponde a cada administración ya requiere otra ingeniería. 😂',
 'Hoy recordatorio útil: una ayuda autonómica y otra municipal pueden tener requisitos diferentes. Mirad bien quién la concede.',
 'Una de las grandes aventuras de la paternidad: descubrir que el calendario de vacunas es más claro que el de algunos trámites. 😂'
 ]};
const d=Math.floor(Date.parse(today+'T00:00:00Z')/86400000);
const posts=bank[slot];const message=slot==='launch' ? 'Antes, para tener un hijo necesitabas amor y paciencia.\n\nAhora necesitas dos nóminas, un Excel y que la guardería te conceda una entrevista. 😂👶' : posts[d%posts.length];
if([...message].length>250)throw new Error('Texto demasiado largo');
const mutation='mutation ($input: CreatePostInput!) { createPost(input:$input) { ... on PostActionSuccess { post { id text dueAt } } ... on MutationError { message } } }';
const out=await query(mutation,{input:{text:message,channelId:matches[0].id,schedulingType:'automatic',mode:'addToQueue'}});
if(!out.createPost?.post?.id)throw new Error('Buffer no aceptó la publicación: '+JSON.stringify(out.createPost));
console.log('Publicación añadida a la cola de Buffer: '+out.createPost.post.id+'; horario: '+out.createPost.post.dueAt);
