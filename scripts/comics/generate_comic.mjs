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
// High-quality single composition keeps consistent characters, art direction and dialogue.
const dialogue=story.panels.map((p,i)=>'PANEL '+(i+1)+' SCENE: '+p.action+'\\nEXACT SPANISH BALLOON TEXT: '+p.text).join('\\n\\n');
const prompt=`Draw ONE COMPLETE FOUR-PANEL COMIC (2 columns x 2 rows) as a finished editorial artwork in a landscape-friendly or square-ish comic layout with clearly separated thick black gutters. This image will be posted unchanged on Instagram and X. The art quality MUST be that of a beautifully finished professional 1990s prime-time animated family television sitcom comic, not generic minimal vector art. Use the visual direction of a detailed, expressive 1990s yellow-skinned sitcom cartoon: gorgeous vibrant backgrounds, clean but rich cel shading, thick fluid ink outlines, highly appealing lively cartoon faces, natural varied body language, expressive eyes and mouths, warm domestic lighting, witty visual storytelling, energetic compositions, and consistent original family designs throughout all four panels. Original characters, NOT identifiable characters from existing TV series: young bearded dark-haired dad in turquoise shirt, mother dark brunette bun with coral top, brown-haired toddler in yellow or pink outfit; optional purple/pink daycare teacher. Include furnishings, daycare entrance, colorful kitchen, living room, nursery, plants, small props as appropriate to the scene. Vary medium and wide shots, NOT extreme closeups, NEVER crop faces. Four beautiful scenes with complete environmental storytelling. Integrate big clean WHITE SPEECH BALLOONS with BLACK bold Spanish lettering INSIDE each of the four panels. Accurately write the provided dialogue, do not invent new wording or any visible numbers/prices. No header, no footer, no branding, no watermark, no page numbers, no @handle. Black gutters, exact four panels, visual continuity and consistent costumes. Read panels left-right top-bottom. Favor dynamic professional illustration quality over oversimplified flat geometry.\n\n${dialogue}`;
const image=await call('images/generations',{model:process.env.OPENAI_COMIC_IMAGE_MODEL||'gpt-image-1.5',size:'1536x1024',quality:process.env.OPENAI_COMIC_IMAGE_QUALITY||'high',n:1,prompt});
if(!image.data?.[0]?.b64_json)throw Error('No comic returned');
await fs.writeFile('comics-input/'+item.id+'-complete.png',Buffer.from(image.data[0].b64_json,'base64'));
console.log('Generated premium complete comic with four scenes: '+item.id);
