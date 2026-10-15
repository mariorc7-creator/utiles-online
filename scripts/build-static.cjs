const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, '_site');
const SKIP = new Set(['.git', '.vercel', '_site', 'node_modules']);
const BOOTSTRAP = '<script src="/analytics.js?v=20261015-7" defer></script>';
const HEADER = `<header class="pb-global-header" data-pb-global-header="1"><div class="header-contenido"><a href="/" class="logo logo-enlace" aria-label="Ir al inicio">Papeles del <span>Bebé</span></a><nav class="nav-principal" aria-label="Navegación principal"><a href="/mi-panel/" data-pb-nav="panel">Mi panel</a><a href="/herramientas/">Herramientas</a><a href="/guias-familias/">Guías</a><a href="/ayudas-nacimiento/">Ayudas</a><a href="/tramites-bebe/">Trámites</a><a href="/observatorio/">Observatorio</a><a href="/premium/" class="nav-premium">Premium</a></nav></div></header>`;
const FOOTER = `<footer class="pb-global-footer" data-pb-global-footer="1"><div class="pb-footer-inner"><div><a class="pb-footer-brand" href="/">Papeles del <span>Bebé</span></a><p>Menos papeleo. Más tiempo para tu bebé.</p></div><nav aria-label="Navegación del pie"><a href="/mi-panel/">Mi panel</a><a href="/herramientas/">Herramientas</a><a href="/guias-familias/">Guías</a><a href="/ayudas-nacimiento/">Ayudas</a><a href="/tramites-bebe/">Trámites</a><a href="/observatorio/">Observatorio</a><a href="/metodologia/">Metodología</a><a href="/privacidad/">Privacidad</a></nav><p class="pb-footer-copy">© 2026 Papeles del Bebé</p></div></footer>`;

function applyPageFixes(html, relPath) {
  const rel = relPath.replace(/\\/g, '/');
  if (rel === 'pack-empadronamiento/index.html') {
    html = html.replace(
      /src="https:\/\/sede\.madrid\.es\/UnidadesDescentralizadas\/UDCEstadistica\/TramitesMunicipales\/Ficheros\/Hoja_padronal\.pdf#view=FitH"/g,
      'src="/api/official-document?doc=madrid-hoja-padronal#view=FitH"'
    );
    if (!html.includes('/pack-empadronamiento/fix.js')) {
      html = html.replace(/<\/body>/i, '<script src="/pack-empadronamiento/fix.js?v=20261015-1" defer></script>\n</body>');
    }
  }
  return html;
}

function normalizeHtml(html, relPath) {
  html = applyPageFixes(html, relPath);
  if (!/\/analytics\.js(?:\?|["'])/.test(html)) {
    html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, `${BOOTSTRAP}\n</body>`) : `${html}\n${BOOTSTRAP}\n`;
  }
  if (/<header\b[^>]*>[\s\S]*?<\/header>/i.test(html)) html = html.replace(/<header\b[^>]*>[\s\S]*?<\/header>/i, HEADER);
  else if (/<body\b[^>]*>/i.test(html)) html = html.replace(/<body\b[^>]*>/i, (m) => `${m}\n${HEADER}`);
  else html = `${HEADER}\n${html}`;

  if (/<footer\b[^>]*>[\s\S]*?<\/footer>/i.test(html)) html = html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/i, FOOTER);
  else if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${FOOTER}\n</body>`);
  else html += `\n${FOOTER}`;
  return html;
}

function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) { copyTree(from, to); continue; }
    if (!entry.isFile()) continue;
    let data = fs.readFileSync(from);
    if (entry.name.endsWith('.html')) {
      const rel = path.relative(ROOT, from);
      data = Buffer.from(normalizeHtml(data.toString('utf8'), rel), 'utf8');
    }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, data);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
copyTree(ROOT, OUT);

let htmlCount = 0;
const failures = [];
const warnings = [];
const requiredNav = ['/mi-panel/','/herramientas/','/guias-familias/','/ayudas-nacimiento/','/tramites-bebe/','/observatorio/','/premium/'];
function audit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) audit(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlCount++;
      const rel = path.relative(OUT, full).replace(/\\/g, '/');
      const html = fs.readFileSync(full, 'utf8');
      if (!html.includes('/analytics.js')) failures.push(`${rel}: sin bootstrap global`);
      if (!html.includes('data-pb-global-header="1"')) failures.push(`${rel}: sin cabecera global`);
      if (!html.includes('data-pb-global-footer="1"')) failures.push(`${rel}: sin footer global`);
      const header = (html.match(/<header\b[^>]*>[\s\S]*?<\/header>/i) || [''])[0];
      for (const href of requiredNav) if (!header.includes(`href="${href}"`)) failures.push(`${rel}: cabecera incompleta (${href})`);
      if (/Gestor[ií]a|Guía independiente|←\s*Inicio/i.test(header)) failures.push(`${rel}: navegación legacy residual`);
      const suspicious = [...html.matchAll(/href=["'](?:#|javascript:|\s*)["']/gi)].length;
      if (suspicious) warnings.push(`${rel}: ${suspicious} enlace(s) placeholder`);
      if (rel === 'pack-empadronamiento/index.html') {
        if (!html.includes('/api/official-document?doc=madrid-hoja-padronal')) failures.push(`${rel}: PDF oficial no pasa por proxy same-origin`);
        if (!html.includes('/pack-empadronamiento/fix.js')) failures.push(`${rel}: sin fix externo del copiloto`);
      }
    }
  }
}
audit(OUT);
if (warnings.length) console.warn('Avisos UX no bloqueantes:\n' + warnings.slice(0, 25).join('\n'));
if (failures.length) {
  console.error('Auditoría UX fallida:\n' + failures.join('\n'));
  process.exit(1);
}
console.log(`Build estático listo: ${htmlCount} HTML con cabecera, footer y bootstrap globales.`);
