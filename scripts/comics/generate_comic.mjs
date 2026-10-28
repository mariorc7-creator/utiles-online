#!/usr/bin/env node
// Create original four-panel family comic. Generates image and dialogue separately.
// This script NEVER publishes to social networks.
import fs from 'node:fs/promises';
const key=process.env.OPENAI_API_KEY;
if(!key)throw Error('Missing OPENAI_API_KEY');
const topics=[
 {id:'guarderia',topic:'price of daycare with parent asking if the adult is included'},
 {id:'tramites',topic:'paperwork after childbirth and an absurd pile of forms'},
 {id:'primerizos',topic:'parents searching for a pacifier that baby held the whole time'}
];
const specified=process.env.COMIC_INDEX;
const index=Number(specified!==undefined&&specified!==''?specified:new Date().getUTCDay())%3;
const item=topics[(index+3)%3];
async function call(endpoint,payload){
 const r=await fetch('https://api.openai.com/v1/'+endpoint,{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(payload)});
 if(!r.ok)throw Error(endpoint+' failed '+r.status+': '+(await r.text()).slice(0,450));
 return r.json();
}
const instructions='Write witty Spanish comic dialogue for @papelesdelbebe. Return ONLY strict JSON with keys title,caption,panels (array of 4 objects, each with text and action). Each text under 75 characters, readable as a standalone line, one speaker per panel, name optional. Each action under 170 characters and describes visible characters, scene, expression, body language. Four beats: hook, complication, escalation, unexpected punchline. Naturally funny, not corporate. Do not claim real financial figures, subsidies, legal rights or dates. Family friendly. Caption under 180 characters. Prefer observational humor about parenting and bureaucracy. The final panel must have a genuinely funny payoff.';
const data=await call('responses',{model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions,input:'Write a 4-panel comic about '+item.topic,max_output_tokens:760,store:false});
const raw=(data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('').replace(/^```(?:json)?|\x60\x60\x60$/g,'').trim();
const story=JSON.parse(raw);
if(!Array.isArray(story.panels)||story.panels.length!==4||story.panels.some(p=>typeof p.text!=='string'||typeof p.action!=='string'||p.text.length>85||p.text.length<5))throw Error('Invalid storyboard');
story.id=item.id;
await fs.mkdir('comics-input',{recursive:true});
await fs.writeFile('comics-input/'+item.id+'.json',JSON.stringify(story,null,2));
const style='Original 1990s television cartoon sitcom aesthetic, bold black ink outlines, completely flat saturated colors, warm golden yellow skin, round bulging expressive eyes, simple hand-drawn 2D cel animation feel, comedic exaggeration, clear staging. Original characters only, no existing TV characters: same short brown-haired dad with short beard in turquoise shirt, mother with dark hair in a bun and coral shirt, young toddler in yellow clothes. If necessary an educator in pink and a clerk in blue. Everyday Spanish home or nursery. Clean character acting with complete bodies or medium shots, no extreme close-ups, no cropping any faces. Absolutely no written letters, no words, no speech bubbles, no panels-within-panels, no logos, no watermark. Portrait 4:5 composition, center stage clear, keep top fifth visually calmer for later dialogue overlay.';
for(let i=0;i<4;i++){
 const panel=story.panels[i];
 const prompt=style+' Panel scene '+(i+1)+' of four in continuous story: '+panel.action+'. Illustrate ONLY this ONE scene in one image, full composition, no comic grid.';
 const image=await call('images/generations',{model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1-mini',size:'1024x1536',quality:process.env.OPENAI_IMAGE_QUALITY||'medium',n:1,prompt});
 if(!image.data?.[0]?.b64_json)throw Error('No image delivered for scene '+(i+1));
 await fs.writeFile('comics-input/'+item.id+'-'+(i+1)+'.png',Buffer.from(image.data[0].b64_json,'base64'));
 console.log('Generated comic scene '+(i+1)+'/4');
}
console.log('Generated storyboard and four separate original panels: '+item.id);
