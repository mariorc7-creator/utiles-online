#!/usr/bin/env node
// Generate 3 editorial scripts and Spanish narration audio for draft Reels.
// Never publishes to Instagram.
import fs from 'node:fs/promises';
import path from 'node:path';
const key=process.env.OPENAI_API_KEY;
if(!key) throw Error('Missing OPENAI_API_KEY secret');
const output='reels-input';
await fs.mkdir(output,{recursive:true});
const editorial=[
 {id:'guarderia',topic:'Humor sobre el precio de guardería, un chiste concreto que no suene a frase corporativa',type:'humor'},
 {id:'tramites',topic:'Consejo atemporal y verificable sobre trámites tras nacimiento: revisar requisitos y plazos de cada organismo, sin datos específicos',type:'informacion'},
 {id:'primerizos',topic:'Situación cómica muy reconocible de padres primerizos con remate inesperado',type:'humor'}
];
async function chat(prompt){
 const res=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions:'Eres guionista español de vídeos cortos para Instagram de la marca Papeles del Bebé. Devuelve EXCLUSIVAMENTE JSON válido, sin markdown, formato {"scenes":[{"title":"...","subtitle":"...","narration":"..."}]}. Son exactamente 4 escenas. Cada título 2-6 palabras y máximo 35 caracteres, en MAYÚSCULAS. Cada subtítulo máximo 80 caracteres. Cada narración una frase hablada de 6-15 palabras. La historia debe tener un gancho fuerte desde el primer segundo y un remate divertido. No inventes noticias, cifras, prestaciones ni derechos. La última escena debe decir visualmente @papelesdelbebe y animar a seguir la cuenta. Lenguaje natural, concreto, irónico, nada de clichés ni frases motivacionales. Español de España.',input:prompt,max_output_tokens:650,store:false})});
 if(!res.ok)throw Error('OpenAI script: '+res.status+' '+(await res.text()).slice(0,200));
 const j=await res.json();return (j.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('').trim();
}
async function voice(text,file){
 const res=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_TTS_MODEL||'tts-1',voice:'nova',input:text,response_format:'mp3',speed:1.12})});
 if(!res.ok)throw Error('OpenAI TTS: '+res.status+' '+(await res.text()).slice(0,200));
 await fs.writeFile(file,Buffer.from(await res.arrayBuffer()));
}
for(const item of editorial){
 const raw=await chat('Reel de 4 escenas sobre: '+item.topic+'. Tipo: '+item.type+'. Duración aproximada 16 segundos.');
 let parsed;
 try{parsed=JSON.parse(raw.replace(/^\x60\x60\x60(?:json)?/,'').replace(/\x60\x60\x60$/,'').trim());}
 catch{throw Error('Invalid JSON for '+item.id+': '+raw.slice(0,160));}
 if(!Array.isArray(parsed.scenes)||parsed.scenes.length!==4||parsed.scenes.some(s=>typeof s.title!=='string'||typeof s.subtitle!=='string'||typeof s.narration!=='string'||s.title.length>42||s.subtitle.length>100))throw Error('Invalid scenes for '+item.id);
 const manifest={id:item.id,scenes:parsed.scenes};
 await fs.writeFile(path.join(output,item.id+'.json'),JSON.stringify(manifest,null,2));
 const narration=parsed.scenes.map(s=>s.narration).join(' ');
 await voice(narration,path.join(output,item.id+'.mp3'));
 console.log('Created '+item.id+': '+narration);
}
