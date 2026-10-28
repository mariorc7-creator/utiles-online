#!/usr/bin/env node
// Create original four-panel family comic. Generates image and dialogue separately.
// This script NEVER publishes to social networks.
import fs from 'node:fs/promises';
const key=process.env.OPENAI_API_KEY;
if(!key)throw Error('Missing OPENAI_API_KEY');
const topics=[
 {id:'guarderia',themes:['guardería y conciliación con remate inesperado','primer día de guardería con giro absurdo','mensajes de la guardería que ponen nerviosos a los padres','logística imposible de recoger al bebé']},
 {id:'tramites',themes:['sede electrónica que desespera a padres recientes','certificado de nacimiento y burocracia surrealista','citas previas, contraseñas y formularios absurdos','ayudas familiares explicadas con sátira, sin afirmar importes ni requisitos']},
 {id:'primerizos',themes:['bebé que manda más que sus padres','preparativos para el bebé y compras absurdas','falsa confianza de padres primerizos','planificar una escapada con un bebé y que salga todo al revés']}
];
const specified=process.env.COMIC_INDEX;
const index=Number(specified!==undefined&&specified!==''?specified:new Date().getUTCDay())%3;
const item=topics[(index+3)%3];
const madridDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const dailyNumber=Math.floor(Date.parse(madridDate+'T00:00:00Z')/86400000);
const selectedTheme=item.themes[dailyNumber%item.themes.length];
const websiteContext='papelesdelbebe.es ofrece guías de trámites al nacer, ayudas por comunidad autónoma, checklists y herramientas para preparar la llegada del bebé; invitaciones, tarjetas de hitos y recursos familiares.';
async function call(endpoint,payload){
 const r=await fetch('https://api.openai.com/v1/'+endpoint,{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(payload)});
 if(!r.ok)throw Error(endpoint+' failed '+r.status+': '+(await r.text()).slice(0,450));
 return r.json();
}
const instructions=`Eres un guionista experto en historietas de humor para el proyecto español Papeles del Bebé. Escribe en español de España, con chispa, descaro y tono macarra/troll ligero: ironía mordaz sobre la vida real de los padres, burocracia, guarderías, dinero y conciliación. Que sea MUY GRACIOSO, novedoso, reconocible y sorprendente: busca un giro visual absurdo en el último cuadro; no chistes planos ni moralejas sensibleras. Los 4 paneles forman una historia coherente: 1) gancho que pare el scroll 2) escalada 3) complicación absurda 4) remate contundente que haga compartirlo. No copies argumentos de personajes de series conocidas. Los personajes son originales; alterna protagonistas y situaciones y no repitas constantemente el chiste del precio de la guardería, del café, del chupete o del papeleo infinito. La temática debe conectar con el público de papelesdelbebe.es, de forma natural: padres, bebés, guarderías, ayudas, citas, checklist, preparativos, trámites. No hagas publicidad directa dentro del cómic ni incluyas la URL en bocadillos; en el caption puedes mencionar puntualmente que tenemos guías o herramientas gratis en la web cuando encaje y aporte utilidad. Nunca inventes importes, condiciones de ayudas, leyes, plazos, prestaciones ni hechos actuales. Satiriza situaciones y sistemas, no ataques a personas por características protegidas. Nada de insultos gratuitos, groserías o humor con tragedias. Diálogos cortos y naturales para leer en móvil: ideal 15-50 caracteres cada cuadro, máximo 65. Cada acción explica gestos y situación en menos de 170 caracteres. Caption breve, original, con un gancho; sin @papelesdelbebe, sin hashtags (los añadirá el sistema). Devuelve SOLO JSON estricto con claves title,caption,panels (array EXACTAMENTE de 4 objetos text,action). No markdown.`;
const data=await call('responses',{model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions,input:'Tema de hoy: '+selectedTheme+'. Sitio: '+websiteContext+'. Fecha para evitar chistes repetidos: '+madridDate+'.',max_output_tokens:850,store:false});
const raw=(data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('').replace(/^```(?:json)?|\x60\x60\x60$/g,'').trim();
const story=JSON.parse(raw);
if(!Array.isArray(story.panels)||story.panels.length!==4||story.panels.some(p=>typeof p.text!=='string'||typeof p.action!=='string'||p.text.length>65||p.text.length<5))throw Error('Invalid storyboard');
story.id=item.id;
await fs.mkdir('comics-input',{recursive:true});
await fs.writeFile('comics-input/'+item.id+'.json',JSON.stringify(story,null,2));
// High-quality single composition keeps consistent characters, art direction and dialogue.
const dialogue=story.panels.map((p,i)=>'PANEL '+(i+1)+' SCENE: '+p.action+'\\nEXACT SPANISH BALLOON TEXT: '+p.text).join('\\n\\n');
const prompt=`Draw ONE COMPLETE FOUR-PANEL COMIC (2 columns x 2 rows) as a finished editorial artwork in a landscape-friendly or square-ish comic layout with clearly separated thick black gutters. This image will be posted unchanged on Instagram and X. The art quality MUST be that of a beautifully finished professional 1990s prime-time animated family television sitcom comic, not generic minimal vector art. Use the visual direction of a detailed, expressive 1990s yellow-skinned sitcom cartoon: gorgeous vibrant backgrounds, clean but rich cel shading, thick fluid ink outlines, highly appealing lively cartoon faces, natural varied body language, expressive eyes and mouths, warm domestic lighting, witty visual storytelling, energetic compositions, and consistent original family designs throughout all four panels. Original characters, NOT identifiable characters from existing TV series: young bearded dark-haired dad in turquoise shirt, mother dark brunette bun with coral top, brown-haired toddler in yellow or pink outfit; optional purple/pink daycare teacher. Include furnishings, daycare entrance, colorful kitchen, living room, nursery, plants, small props as appropriate to the scene. Vary medium and wide shots, NOT extreme closeups, NEVER crop faces. Four beautiful scenes with complete environmental storytelling. Integrate big clean WHITE SPEECH BALLOONS with BLACK bold Spanish lettering INSIDE each of the four panels. Accurately write the provided dialogue, do not invent new wording or any visible numbers/prices. No header, no footer, no branding, no watermark, no page numbers, no @handle. Black gutters, exact four panels, visual continuity and consistent costumes. Read panels left-right top-bottom. Favor dynamic professional illustration quality over oversimplified flat geometry.\n\n${dialogue}`;
const image=await call('images/generations',{model:process.env.OPENAI_COMIC_IMAGE_MODEL||'gpt-image-1.5',size:'1024x1536',quality:process.env.OPENAI_COMIC_IMAGE_QUALITY||'high',n:1,prompt});
if(!image.data?.[0]?.b64_json)throw Error('No comic returned');
await fs.writeFile('comics-input/'+item.id+'-complete.png',Buffer.from(image.data[0].b64_json,'base64'));
console.log('Generated premium complete comic with four scenes: '+item.id);
