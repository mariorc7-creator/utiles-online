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
const panelInfo=story.panels.map((p,i)=>'Panel '+(i+1)+': '+p.action).join('\n');
const prompt='Draw ONE cohesive 2x2 comic CONTACT SHEET of four equal panels with clean gutters, absolutely no lettering anywhere. Bold SATIRICAL AMERICAN TV SITCOM CARTOON aesthetic reminiscent of classic prime-time yellow-skinned family animation: saturated golden-yellow skin tones, crisp dark ink outlines, flat vibrant colors, simple stylized faces, bulging expressive eyes, exaggerated comedic expressions, clean 2D cel-shaded forms, detailed but uncluttered suburban Spanish family settings. Keep original independent characters (NOT characters from an existing TV show): cheerful young brown-haired short-bearded father in teal shirt; brown-haired mother with bun in coral shirt; brown-haired toddler in yellow shirt; as needed a pink-clad teacher and blue-clad clerk. SAME faces and outfits in each frame. Character-driven acting and surprising visual punchline. Frame each scene naturally like a real animated sitcom still, colorful backgrounds. NO TEXT, NO CAPTION, NO LOGO, NO WORDS, NO SPEECH BUBBLES, NO LETTERS, NO NUMBERS, NO WATERMARKS. Each of the four panels must depict the corresponding actions below.\\n'+panelInfo;\nconst image=await call('images/generations',{model:process.env.OPENAI_IMAGE_MODEL||'gpt-image-1-mini',size:'1024x1536',quality:process.env.OPENAI_IMAGE_QUALITY||'medium',n:1,prompt});
if(!image.data?.[0]?.b64_json)throw Error('No image delivered');
await fs.writeFile('comics-input/'+item.id+'-sheet.png',Buffer.from(image.data[0].b64_json,'base64'));
console.log('Generated storyboard and contact sheet: '+item.id);
