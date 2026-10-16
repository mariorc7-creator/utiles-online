(() => {
  if (window.__pbUxHotfixLoaded) return;
  window.__pbUxHotfixLoaded = true;
  const style = document.createElement('style');
  style.textContent = `
    #pb-start-over{
      appearance:none!important;
      display:inline-flex!important;
      align-items:center!important;
      justify-content:center!important;
      min-height:40px!important;
      padding:8px 13px!important;
      margin-left:6px!important;
      border:1px solid #cfd3f5!important;
      border-radius:11px!important;
      background:#fff!important;
      color:#4e54c8!important;
      -webkit-text-fill-color:#4e54c8!important;
      font-weight:850!important;
      text-decoration:none!important;
      cursor:pointer!important;
      box-shadow:0 3px 10px rgba(48,52,100,.05)!important;
    }
    #pb-start-over:hover{
      background:#f4f5ff!important;
      border-color:#aeb4ef!important;
      color:#3f46b8!important;
      -webkit-text-fill-color:#3f46b8!important;
    }
    #pb-start-over:focus-visible{
      outline:3px solid rgba(96,103,232,.25)!important;
      outline-offset:2px!important;
    }
    @media(max-width:760px){
      .pb-restart-note{display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;flex-wrap:wrap!important}
      #pb-start-over{margin-left:0!important;min-height:38px!important}
    }
  `;
  document.head.appendChild(style);
})();