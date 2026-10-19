(() => {
  if (window.__pbToolsP0) return;
  window.__pbToolsP0 = true;
  const path = location.pathname.replace(/\/$/, '') + '/';
  const styles = document.createElement('style');
  styles.textContent = `
    .pb-p0-info{margin:12px 0;padding:13px 15px;border:1px solid #dce1f2;border-radius:14px;background:#f8f9ff;color:#4b5472;line-height:1.5}
    .pb-p0-info strong{color:#25314a}
    .pb-p0-actions{display:flex;gap:9px;flex-wrap:wrap;margin:14px 0}
    .pb-p0-btn{border:1px solid #d3d7ed;border-radius:11px;background:#fff;color:#454cbb;font:inherit;font-weight:800;padding:10px 13px;min-height:44px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
    .pb-p0-btn:hover{background:#f1f2ff}
    .pb-p0-btn:focus-visible{outline:3px solid #b5b9f6;outline-offset:2px}
    .pb-p0-error{padding:11px 13px;border:1px solid #e7a6a6;background:#fff5f5;color:#8f2525;border-radius:12px;margin:9px 0}
    .pb-p0-error[hidden]{display:none!important}
    .pb-p0-print-only{display:none}
    @media(max-width:700px){.pb-p0-actions>*{width:100%;box-sizing:border-box}}
    @media print{
      header,footer,#pb-mobile-nav,.pb-mobile-next,#papelesia-launcher,#papelesia-panel,#pb-consent-banner,.pb-p0-actions,.sim-ai,.sim-grid,.sim-value-actions{display:none!important}
      .sim-results,.sim-value{display:block!important}
      .sim-result-card,.qmf-item{break-inside:avoid}
      main{padding:0!important;max-width:none!important}
    }
  `;
  document.head.appendChild(styles);

  function addActions(target, label, includePrint) {
    if (!target || target.querySelector('.pb-p0-actions')) return;
    const div = document.createElement('div');
    div.className = 'pb-p0-actions';
    const print = includePrint ? '<button type="button" class="pb-p0-btn" data-pb-print>Imprimir o guardar como PDF</button>' : '';
    div.innerHTML = print + '<a class="pb-p0-btn" href="/mi-panel/">Abrir Mi panel →</a>';
    target.appendChild(div);
    div.querySelector('[data-pb-print]')?.addEventListener('click', () => window.print());
  }

  function setupAid() {
    const form = document.getElementById('simuladorForm');
    const results = document.getElementById('resultados');
    if (!form || !results) return;
    const select = form.querySelector('#comunidad');
    const work = form.querySelector('#laboral');
    const family = form.querySelector('#familia');
    const error = form.querySelector('#formError');
    [select, work, family].forEach(el => {
      el?.setAttribute('aria-required','true');
      el?.addEventListener('change', () => {
        el.removeAttribute('aria-invalid');
        if ([select,work,family].every(x => x?.value)) error?.classList.remove('show');
      });
    });
    const message = document.createElement('p');
    message.className = 'pb-p0-info';
    message.innerHTML = '<strong>Cómo usar el resultado:</strong> abre primero las ayudas marcadas como relevantes. Después comprueba renta, residencia, plazos y organismo oficial: aparecer en el simulador no equivale a cumplir los requisitos.';
    results.querySelector('.tool-panel')?.appendChild(message);
    addActions(results.querySelector('.tool-panel'), 'Resultado', true);
    form.addEventListener('submit', e => {
      const missing=[select,work,family].filter(el => !el?.value);
      if (missing.length) {
        missing.forEach(el => el.setAttribute('aria-invalid','true'));
        requestAnimationFrame(() => { missing[0].focus(); error?.setAttribute('role','alert'); });
      } else {
        [select,work,family].forEach(el => el.removeAttribute('aria-invalid'));
      }
    });
  }

  function setupPermit() {
    const form = document.querySelector('form[action="/api/calcular-permiso"]');
    const date = document.getElementById('fecha');
    if (!form || !date) return;
    const today = new Date();
    const localToday = [today.getFullYear(), String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
    date.max = localToday;
    const error = document.createElement('p');
    error.className = 'pb-p0-error';
    error.hidden = true;
    error.setAttribute('role','alert');
    date.insertAdjacentElement('afterend',error);
    date.addEventListener('input', () => {error.hidden=true; date.removeAttribute('aria-invalid');});
    form.addEventListener('submit',e => {
      if (!date.value || date.value > localToday) {
        e.preventDefault();
        error.hidden = false;
        error.textContent = 'Selecciona una fecha de nacimiento válida que no sea futura.';
        date.setAttribute('aria-invalid','true');
        date.focus();
      }
    });
    const caution = document.createElement('div');
    caution.className='pb-p0-info';
    caution.innerHTML='<strong>Antes de empezar:</strong> el resultado es un mapa orientativo, no una resolución. Las ampliaciones y la distribución concreta requieren comprobar la normativa aplicable a tu fecha y situación.';
    form.parentElement?.insertBefore(caution,form);
  }

  function setupRoute() {
    const section=document.getElementById('taskList');
    if (!section) return;
    const heading=document.querySelector('.qmf-results h2');
    if (heading) heading.textContent='Tu siguiente acción';
    const note=document.createElement('p');
    note.className='pb-p0-info';
    note.innerHTML='<strong>Qué significa «revisado»:</strong> solo indica que tú lo has marcado. No certifica que el trámite esté presentado, aprobado o resuelto.';
    section.insertAdjacentElement('beforebegin',note);
    const reset=document.getElementById('resetBtn');
    if (reset) {
      reset.addEventListener('click', e => {
        // Listener en captura: impide borrados accidentales.
        if (!window.confirm('¿Quieres desmarcar los 7 bloques de esta ruta?')) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      },true);
    }
    addActions(document.querySelector('.qmf-results'), 'Ruta',true);
  }

  function boot() {
    if (path === '/herramientas/buscador-ayudas/') setupAid();
    if (path === '/herramientas/calculadora-permiso-nacimiento/') setupPermit();
    if (path === '/herramientas/que-me-falta/') setupRoute();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
