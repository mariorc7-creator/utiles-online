(() => {
  'use strict';
  const checks=Array.from(document.querySelectorAll('[data-prep-item]'));
  const counter=document.getElementById('prep-check-count');
  if(!counter||!checks.length)return;
  const KEY='papelesbebe_preparativos_lista_v1';
  let saved={};
  try {saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}} catch(_){}
  if(typeof saved!=='object'||Array.isArray(saved))saved={};
  checks.forEach(c=>{c.checked=saved[c.dataset.prepItem]===true});
  const refresh=()=>{
    const total=checks.filter(x=>x.checked).length;
    counter.textContent=total+' de '+checks.length+' preparados'+(total===checks.length?' ✓':'');
  };
  checks.forEach(c=>c.addEventListener('change',()=>{
    saved[c.dataset.prepItem]=c.checked;
    try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(_){}
    refresh();
  }));
  document.getElementById('prep-check-clear')?.addEventListener('click',()=>{
    checks.forEach(c=>{c.checked=false});
    saved={};
    try{localStorage.removeItem(KEY)}catch(_){}
    refresh();
  });
  refresh();
})();