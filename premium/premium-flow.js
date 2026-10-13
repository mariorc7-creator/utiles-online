(function(){
  var ANSWERS_KEY='tramitesFacilesRespuestas';
  var RETURN_KEY='papelesbebe_premium_return';

  function readAnswers(){
    try {
      var raw=localStorage.getItem(ANSWERS_KEY);
      var data=raw?JSON.parse(raw):null;
      return data&&typeof data==='object'?data:null;
    } catch(e){ return null; }
  }

  function complete(d){
    return !!(d&&d.comunidad&&d.fechaNacimiento&&d.situacionLaboral&&d.monoparental!==null&&d.nacimientoMultiple!==null&&d.discapacidadProgenitor!==null);
  }

  function initPremiumPage(){
    var cta=document.getElementById('premiumPrimary');
    var status=document.getElementById('premiumStatus');
    if(!cta||!status)return;

    var data=readAnswers();
    var ready=complete(data);
    var cfg=window.PAPELES_BEBE_CONFIG||{};

    if(!ready){
      cta.textContent='Preparar mis datos →';
      cta.href='/checklist/?empezar=1&origen=premium';
      status.textContent='Primero necesitamos 6 respuestas para personalizar el plan. Al terminar volverás aquí automáticamente.';
      return;
    }

    status.innerHTML='<strong>✓ Tus datos ya están preparados.</strong> El siguiente paso es el pago seguro para desbloquear el Plan Premium.';

    if(cfg.premiumLive&&cfg.premiumCheckoutUrl){
      cta.textContent='Continuar al pago · '+(cfg.premiumPrice||'9,90 €')+' →';
      cta.href=cfg.premiumCheckoutUrl;
      cta.removeAttribute('aria-disabled');
      cta.classList.remove('is-disabled');
    } else {
      cta.textContent='Datos preparados ✓';
      cta.href='#premiumStatus';
      cta.setAttribute('aria-disabled','true');
      cta.classList.add('is-disabled');
      cta.addEventListener('click',function(ev){ev.preventDefault();status.scrollIntoView({behavior:'smooth',block:'center'});});
    }
  }

  function markReturnFromPremium(){
    var params=new URLSearchParams(location.search);
    if(params.get('origen')==='premium'){
      try{sessionStorage.setItem(RETURN_KEY,'1');}catch(e){}
    }
  }

  function redirectCompletedToPremium(){
    try{
      if(sessionStorage.getItem(RETURN_KEY)==='1'){
        sessionStorage.removeItem(RETURN_KEY);
        location.replace('/premium/?datos=listos=1');
        return true;
      }
    }catch(e){}
    return false;
  }

  window.PapelesPremiumFlow={
    initPremiumPage:initPremiumPage,
    markReturnFromPremium:markReturnFromPremium,
    redirectCompletedToPremium:redirectCompletedToPremium
  };
})();
