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

    if(!ready){
      cta.textContent='Crear mi Plan Premium gratis →';
      cta.href='/checklist/?empezar=1&origen=premium';
      status.innerHTML='<strong>Acceso gratuito temporal.</strong> No se realizará ningún cobro ni se solicitará tarjeta. Completa 6 respuestas y volverás aquí automáticamente.';
      return;
    }

    status.innerHTML='<strong>✓ Tus datos ya están preparados.</strong> Puedes abrir ahora el Plan Premium gratis durante esta fase.';
    cta.textContent='Abrir mi Plan Premium gratis →';
    cta.href='/premium/plan/?acceso=temporal';
    cta.removeAttribute('aria-disabled');
    cta.classList.remove('is-disabled');
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
