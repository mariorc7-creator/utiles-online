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
if (!['morning','evening'].includes(slot)) throw new Error('SLOT inválido');
const key=process.env.OPENAI_API_KEY;
if(!key) throw new Error('Falta OPENAI_API_KEY. No publicaremos textos repetidos.');
const recent=(process.env.RECENT_TWEETS||'').slice(0,4000);
const role=slot==='morning'
 ? 'Humor de actualidad atemporal, vida adulta, trabajo, tecnología, fútbol o burocracia; no obligues el tema bebés.'
 : 'Humor de crianza y familia, trámites y ayudas en España; puedes aportar un consejo general seguro sin dar cifras ni fechas inventadas.';
const instructions=`Escribes para la cuenta de X @PapelesDelBebe, de España.
Genera UN SOLO TWEET ORIGINAL en español, breve, natural, ingenioso, troll con una pullita inteligente y un remate sorprendente. Ideal 70-145 caracteres; máximo 230.
Tema: ${role}
No repitas chistes anteriores (sinónimos cuentan), no uses clichés tipo “más papeles que”, “hipotecar el salón”, “Hacienda”, ni fórmulas repetidas sobre dormir bebés.
Nunca inventes noticias de última hora, ayudas, importes, permisos, políticos, ni hashtags en tendencia. No difames ni hagas humor sobre víctimas o tragedias. No hashtags salvo justificación factual proporcionada. Evita enlaces salvo valor claro.
Devuelve solamente el texto del tweet, sin comillas, prefacios ni markdown.
Últimas publicaciones que debes evitar: ${recent||'ninguna proporcionada'}`;
async function generate(){
 const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions,input:'Crea el tweet para el turno '+slot+'.',max_output_tokens:190,store:false})});
 if(!r.ok)throw Error('OpenAI HTTP '+r.status+': '+(await r.text()).slice(0,350));
 const j=await r.json();
 return (j.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('').trim();
}
let message='';
for(let n=0;n<3;n++){
 const c=(await generate()).replace(/^["“]|["”]$/g,'').trim();
 if(c && [...c].length<=230 && [...c].length>=35 && !/https?:\/\//i.test(c) && !/^#/m.test(c) && !/[\n]{3}/.test(c)){message=c;break;}
}
if(!message)throw Error('La IA no generó un tweet válido. Se omite publicación.');
// Solo generar texto nuevo: nunca sustituir por contenido fijo.
console.log('Tweet generado ('+[...message].length+' caracteres): '+message);
const mutation='mutation ($input: CreatePostInput!) { createPost(input:$input) { ... on PostActionSuccess { post { id text dueAt } } ... on MutationError { message } } }';
const out=await query(mutation,{input:{text:message,channelId:matches[0].id,schedulingType:'automatic',mode:'addToQueue'}});
if(!out.createPost?.post?.id)throw new Error('Buffer no aceptó la publicación: '+JSON.stringify(out.createPost));
console.log('Publicación añadida a Buffer: '+out.createPost.post.id+'; horario: '+out.createPost.post.dueAt);
