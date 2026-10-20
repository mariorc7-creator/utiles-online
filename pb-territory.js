(() => {
  'use strict';
  // Únicamente comunidad autónoma: no se guardan fechas ni información familiar.
  const KEY='papelesbebe_comunidad_v1';
  const panel=document.getElementById('pb-territory-panel');
  const simulator=document.getElementById('comunidad');
  const input=panel||simulator;
  if(!input)return;
  const options=Array.from(input.options).map(x=>x.value).filter(Boolean);
  const valid=x=>options.includes(x);
  function read(){
    try{const x=localStorage.getItem(KEY);return valid(x)?x:''}catch(_){return ''}
  }
  function save(value){
    try{if(valid(value))localStorage.setItem(KEY,value);else localStorage.removeItem(KEY)}catch(_){}
  }
  const stored=read();
  if(stored && !input.value)input.value=stored;
  input.addEventListener('change',()=>{
    // Guardar solo una elección explícita del usuario.
    save(input.value);
  });
  // Un envío de simulación siempre refleja lo realmente seleccionado.
  if(simulator){
    const form=document.getElementById('simuladorForm');
    if(form)form.addEventListener('submit',()=>{
      if(valid(simulator.value))save(simulator.value);
    });
  }
  window.addEventListener('storage',event=>{
    if(event.key===KEY){const selected=read();input.value=selected;}
  });
})();