(() => {
  const STORAGE_KEY = 'papelesbebe_shared_context_v1';
  const path = window.location.pathname;
  const eligible = path.startsWith('/herramientas/') || path.startsWith('/checklist/');
  if (!eligible) return;

  function readContext() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') || {};
    } catch (_) {
      return {};
    }
  }

  function writeContext(next) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) {}
  }

  function setValue(key, value) {
    if (value === '' || value == null) return;
    const current = readContext();
    current[key] = value;
    writeContext(current);
  }

  function normalizeFamilyForStorage(el) {
    if (el.id === 'tipo') {
      if (el.value === 'mono') return 'monoparental';
      if (el.value === 'general') return 'general';
    }
    return el.value;
  }

  function familyForField(stored, el) {
    if (!stored) return '';
    if (el.id === 'tipo') {
      if (stored === 'monoparental') return 'mono';
      if (stored === 'general') return 'general';
      return '';
    }
    if (el.id === 'familia') {
      return ['general', 'monoparental', 'numerosa'].includes(stored) ? stored : '';
    }
    return stored;
  }

  function bindSelect(id, key, transformRead, transformWrite) {
    const el = document.getElementById(id);
    if (!el) return false;
    const context = readContext();
    const candidate = transformRead ? transformRead(context[key], el) : context[key];
    let restored = false;
    if (candidate && (!el.value || el.value === 'general')) {
      const optionExists = Array.from(el.options || []).some(option => option.value === candidate || option.text === candidate);
      if (optionExists) {
        el.value = candidate;
        restored = true;
      }
    }
    el.addEventListener('change', () => {
      const value = transformWrite ? transformWrite(el) : el.value;
      setValue(key, value);
    });
    return restored;
  }

  function bindInput(id, key) {
    const el = document.getElementById(id);
    if (!el) return false;
    const context = readContext();
    let restored = false;
    if (context[key] && !el.value) {
      el.value = context[key];
      restored = true;
    }
    el.addEventListener('change', () => setValue(key, el.value));
    return restored;
  }

  function bindCheckbox(id, key) {
    const el = document.getElementById(id);
    if (!el) return false;
    const context = readContext();
    let restored = false;
    if (typeof context[key] === 'boolean' && !el.checked) {
      el.checked = context[key];
      restored = context[key];
    }
    el.addEventListener('change', () => {
      const current = readContext();
      current[key] = Boolean(el.checked);
      writeContext(current);
    });
    return restored;
  }

  function addNotice(restored) {
    if (!restored || document.getElementById('pb-shared-context-note')) return;
    const form = document.querySelector('.tool-form, #simuladorForm');
    if (!form) return;
    const note = document.createElement('div');
    note.id = 'pb-shared-context-note';
    note.style.cssText = 'margin:2px 0 8px;padding:10px 12px;border-radius:12px;background:#f5f5ff;border:1px solid #e0e1ff;color:#4b4f77;font-size:.86rem;line-height:1.45';
    note.innerHTML = '✨ Hemos reutilizado datos que ya introdujiste en otra herramienta durante esta sesión. Se guardan solo en este navegador y se borran al cerrar la sesión. <button type="button" id="pb-clear-shared-context" style="border:0;background:none;color:#4f55c7;font:inherit;font-weight:800;padding:0;cursor:pointer;text-decoration:underline">Borrar datos</button>';
    const firstButton = form.querySelector('button[type="submit"]');
    if (firstButton) form.insertBefore(note, firstButton);
    else form.appendChild(note);
    document.getElementById('pb-clear-shared-context')?.addEventListener('click', () => {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
      note.remove();
    });
  }

  function init() {
    let restored = false;
    restored = bindSelect('comunidad', 'territory') || restored;
    restored = bindSelect('laboral', 'employment') || restored;
    restored = bindSelect('familia', 'family', familyForField, normalizeFamilyForStorage) || restored;
    restored = bindSelect('tipo', 'family', familyForField, normalizeFamilyForStorage) || restored;
    restored = bindInput('fecha', 'birthDate') || restored;
    restored = bindCheckbox('multiple', 'multipleBirth') || restored;
    addNotice(restored);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
