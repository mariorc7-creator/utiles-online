#!/usr/bin/env node
// Produce a single 4-scene original Reel automatically, including narrated MP3 and illustrated PNGs.
// Requires OPENAI_API_KEY. Does not publish.
import fs from 'node:fs/promises';
import path from 'node:path';
const key=process.env.OPENAI_API_KEY;
if(!key)throw Error('Missing OPENAI_API_KEY');
const topics=[
{id:'guarderia',type:'humor',topic:'la sorpresa al descubrir cuánto cuesta la guardería; escena con un padre, un bebé y una educadora; remate visual original'},
{id:'tramites',type:'informativo',topic:'trámites habituales tras un nacimiento: comprobar plazos y requisitos en fuentes oficiales. No afirmar importes o derechos concretos'},
{id:'primerizos',type:'humor',topic:'padres primerizos y su caos diario: giro cómico visual concreto y gracioso'}
];
const chosen=topics[Number(process.env.REEL_INDEX||0)%topics.length];
const dir='reels-input';await fs.mkdir(dir,{recursive:true});
async function post(endpoint,body){
 const r=await fetch('https://api.openai.com/v1/'+endpoint,{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body)});
 if(!r.ok)throw Error(endpoint+' HTTP '+r.status+': '+(await r.text()).slice(0,400));
 return r;
}
const system=`Eres guionista de Reels originales y divertidos para la marca española @papelesdelbebe. Devuelve SOLAMENTE JSON válido: {"caption":"...","scenes":[{"title":"...","subtitle":"...","narration":"...","visual":"..."}]}. EXACTAMENTE cuatro escenas, cada una de 4 segundos, total ~16s. Títulos de 3-5 palabras, máximo 30 caracteres. Subtítulos máximo 48 caracteres y totalmente legibles en móvil. Narración de 6-10 palabras por escena, máximo 39 palabras en total. Gancho inmediato; humor irónico observacional no infantil, con giro y remate inesperado y visual. Última escena incluye @papelesdelbebe. Evita café, tópicos de superhéroes, números enormes, chistes blandos, preguntas sin remate, clichés e introducciones. Personajes consistentes: padre joven con pelo castaño corto, barba y jersey turquesa; bebé pequeño de pelo castaño, jersey amarillo, estilo animación 3D de calidad. Todos los campos visual describen la misma familia y un lugar/acción concreta. No escribir textos dentro de ilustraciones: se superpondrán después. En el tema informativo, no inventes leyes, fechas, cifras, ayudas o fuentes. No afirmes contenido no verificado. Caption original muy corto, sin enlaces ni afirmaciones dudosas.`;
const response=await post('responses',{model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions:system,input:'Tema: '+chosen.topic,max_output_tokens:900,store:false});
const data=await response.json();
let raw=(data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('').trim();
raw=raw.replace(/^\x60\x60\x60(?:json)?/,'').replace(/\x60\x60\x60$/,'').trim();
const manifest=JSON.parse(raw);
if(!Array.isArray(manifest.scenes)||manifest.scenes.length!==4)throw Error('Four scenes required');
for(const [i,s] of manifest.scenes.entries()){
 for(const field of ['title','subtitle','narration','visual'])if(typeof s[field]!=='string'||!s[field].trim())throw Error('Missing '+field+' in scene '+i);
 if(s.title.length>38||s.subtitle.length>65||s.narration.split(/\s+/).length>13)throw Error('Scene text too long '+i);
}
manifest.id=chosen.id;
await fs.writeFile(path.join(dir,chosen.id+'.json'),JSON.stringify(manifest,null,2));
const narration=manifest.scenes.map(s=>s.narration).join(' ');
const speech=await post('audio/speech',{model:process.env.OPENAI_TTS_MODEL||'tts-1',voice:'nova',input:narration,response_format:'mp3',speed:1.12});
await fs.writeFile(path.join(dir,chosen.id+'.mp3'),Buffer.from(await speech.arrayBuffer()));
const visualStyle='Premium cinematic 3D stylized family animation, genuinely expressive eyes and poses, elegant character design, textured fabrics, appealing bright color palette and daylight, consistent young father short brown hair trimmed beard turquoise sweater and toddler with chestnut hair yellow sweater, Spanish contemporary family setting, rich environment and dynamic framing. Vertical 9:16, subject in central area, leave top 20 percent and bottom 20 percent less busy for overlaid captions. NO typography, NO logos, NO lettering, NO watermark.';
for(let i=0;i<4;i++){
 const scene=manifest.scenes[i];
 const prompt=visualStyle+' Scene '+(i+1)+' of 4: '+scene.visual+'. Keep father and toddler recognizable throughout.';
 const result=await post('images/generations',{model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1-mini',size:'1024x1536',quality:process.env.OPENAI_IMAGE_QUALITY||'medium',n:1,prompt});
 const image=await result.json();
 const b64=image.data?.[0]?.b64_json;
 if(!b64)throw Error('No image returned for scene '+i);
 await fs.writeFile(path.join(dir,chosen.id+'-'+i+'.png'),Buffer.from(b64,'base64'));
 console.log('Image '+(i+1)+'/4 generated');
}
console.log('Video sources generated: '+chosen.id);
