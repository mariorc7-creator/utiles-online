(() => {
  if (window.__pbSimpleToolsLoaded) return;
  window.__pbSimpleToolsLoaded = true;
  const path = location.pathname.replace(/\/$/,'')+'/';
  const css=document.createElement('style');
  css.textContent=`
    .pb-simple-details{margin:14px 0;border:1px solid #e3e6f1;border-radius:15px;background:#fff;overflow:hidden}
    .pb-simple-details summary{cursor:pointer;padding:13px 15px;font-weight:750;color:#4852ae;list-style-position:inside}
    .pb-simple-details > .pb-simple-content{padding:0 15px 15px}
    .pb-simple-details:focus-within{outline:2px solid #b7bdf7;outline-offset:2px}
    .pb-simple-summary{font-size:1rem!important;line-height:1.55!important;max-width:660px}
    .pb-simple-hero h1{font-size:clamp(1.85rem,3.6vw,2.8rem)!important;line-height:1.13!important}
    .pb-simple-hidden{display:none!important}
    .pb-simple-tools .pb-p0-info{font-size:.89rem;padding:11px 13px}
    .pb-simple-tools .tool-panel{min-width:0}
    .pb-simple-tools .tool-panel h2{line-height:1.3}
    @media(max-width:760px){.pb-simple-tools .tools-hero{padding-top:12px!important;padding-bottom:12px!important}.pb-simple-tools .tool-panel{padding:16px!important}.pb-simple-tools .tool-form button[type=submit]{width:100%;min-height:48px}}
  `;document.head.appendChild(css);
  function details(title, nodes, after){
    const valid=nodes.filter(Boolean);if(!valid.length)return;
    const box=document.createElement('details');box.className='pb-simple-details';
    const summary=document.createElement('summary');summary.textContent=title;box.append(summary);
    const content=document.createElement('div');content.className='pb-simple-content';
    valid.forEach(el=>content.appendChild(el));box.appendChild(content);
    if(after?.parentNode)after.insertAdjacentElement('afterend',box);else document.querySelector('main')?.append(box);
  }
  function hero(title,summary){
    document.body.classList.add('pb-simple-tools');
    const h=document.querySelector('.tools-hero,.qmf-intro');
    if(!h)return;
    h.classList.add('pb-simple-hero');const heading=h.querySelector('h1'),p=h.querySelector('p');
    if(heading)heading.textContent=title;
    if(p){p.textContent=summary;p.classList.add('pb-simple-summary');}
  }
  function aids(){
    hero('Descubre qué ayudas revisar','Responde 3 preguntas y te indicamos por dónde empezar.');
    const form=document.getElementById('simuladorForm');
    if(!form)return;
    const side=document.querySelector('.sim-grid > aside');
    if(side)details('¿Cómo funciona el simulador?', [side],document.querySelector('.sim-grid'));
    const special=form.querySelector('.sim-fieldset');
    if(special)details('¿Hay alguna circunstancia especial? (opcional)',[special],form.querySelector('#familia'));
    const privacy=form.querySelector('.sim-privacy');
    if(privacy)privacy.textContent='El cálculo es orientativo y se realiza en este navegador.';
    const secondary=document.querySelector('main > section.tool-panel');
    if(secondary)details('Cómo interpretar los resultados',[secondary],document.getElementById('resultados'));
    const p0=document.querySelector('#resultados .pb-p0-info');
    if(p0)p0.textContent='Comprueba los requisitos y plazos en cada guía antes de solicitar.';
    const value=document.getElementById('simValueV2');
    if(value){
      const actions=value.querySelector('.sim-value-actions');
      if(actions)actions.classList.add('pb-simple-hidden');
      const subtitle=value.querySelector('#simValueText');
      if(subtitle)subtitle.textContent='Empieza por las ayudas señaladas como relevantes.';
    }
  }
  function permit(){
    hero('Planifica tu permiso por nacimiento','Indica la fecha y tu situación. Obtendrás un resumen de semanas y próximos pasos.');
    const aside=document.querySelector('.perm-grid > aside');
    if(aside)details('Qué incluye el resultado',[aside],document.querySelector('.perm-grid'));
    const options=document.querySelector('.perm-options');
    if(options)details('Situaciones especiales (opcional)',[options],document.querySelector('#objetivo')?.closest('form'));
    const form=document.querySelector('form[action="/api/calcular-permiso"]');
    const p0=form?.parentElement?.querySelector('.pb-p0-info');
    if(p0)p0.textContent='Resultado orientativo. Confirma el calendario definitivo con Seguridad Social.';
    const explanatory=[...document.querySelectorAll('main > .tool-panel')].filter(el=>el.querySelector('h2')?.textContent.includes('Por qué'));
    if(explanatory.length)details('Más información y fuentes oficiales',explanatory,document.querySelector('.perm-grid'));
  }
  function route(){
    hero('¿Qué trámite me falta?','Marca lo que ya has revisado. Te mostramos el siguiente paso.');
    const extra=[...document.querySelectorAll('main > .tool-panel')].filter(el=>el.querySelector('h2')?.textContent.includes('Cómo usar'));
    if(extra.length)details('Cómo funciona esta ruta',extra,document.querySelector('.qmf-results'));
    const summary=document.querySelector('.qmf-smart-summary');
    if(summary){const p=summary.querySelector('p');if(p)p.style.maxWidth='48ch';}
    const plan=document.querySelector('.qmf-today');
    if(plan)details('Ver otras acciones recomendadas',[plan],summary||document.querySelector('.qmf-progress'));
    const disclaimer=document.querySelector('.qmf-list ~ .pb-p0-info');
    if(disclaimer)disclaimer.textContent='«Revisado» no significa aprobado o concedido.';
  }
  function run(){
    if(path==='/herramientas/buscador-ayudas/')aids();
    else if(path==='/herramientas/calculadora-permiso-nacimiento/')permit();
    else if(path==='/herramientas/que-me-falta/')route();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0),{once:true});
  else setTimeout(run,30);
})();