const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'dist');
const GLOBAL_UI = '<script src="/global-ui.js?v=20261015-1" defer></script>';
const FOOTER = `<footer class="pb-global-footer" data-pb-global-footer="1"><div class="footer-contenido"><div class="logo">Papeles del <span>Bebé</span></div><p>Menos papeleo. Más tiempo para tu bebé.</p><p class="metodologia-footer"><a href="/metodologia/">Metodología</a> · <a href="/privacidad/">Privacidad</a></p><p class="footer-copy">© 2026 Papeles del Bebé</p></div></footer>`;

function applyPageFixes(html, relPath) {
  const rel = relPath.replace(/\\/g, '/');
  if (rel === 'pack-empadronamiento/index.html') {
    html = html.replace(/<script src="\/pack-empadronamiento\/(?:fix|review-v6|municipal-universal|capitales-only)\.js[^>]*><\/script>\s*/gi, '');
    html = html.replace(/<\/body>/i, '<script src="/pack-empadronamiento/review-v6.js?v=20261015-11" defer></script>\n<script src="/pack-empadronamiento/municipal-universal.js?v=20261016-2" defer></script>\n<script src="/pack-empadronamiento/capitales-only.js?v=20261016-1" defer></script>\n</body>');
  }
  return html;
}

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function rmDir(dir) { if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true }); }
function walk(dir, cb) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, cb); else cb(full);
  }
}
function shouldSkip(rel) {
  return rel.startsWith('.git/') || rel.startsWith('node_modules/') || rel.startsWith('dist/') || rel.startsWith('.vercel/');
}
function copyAll() {
  rmDir(OUT); ensureDir(OUT);
  walk(ROOT, full => {
    const rel = path.relative(ROOT, full).replace(/\\/g, '/');
    if (shouldSkip(rel)) return;
    const dest = path.join(OUT, rel); ensureDir(path.dirname(dest));
    if (/\.html$/i.test(rel)) {
      let html = fs.readFileSync(full, 'utf8');
      if (!html.includes('/global-ui.js')) html = html.replace(/<\/body>/i, `${GLOBAL_UI}\n</body>`);
      html = applyPageFixes(html, rel);
      fs.writeFileSync(dest, html);
    } else fs.copyFileSync(full, dest);
  });
}
function audit(dir) {
  const failures = []; const warnings = [];
  walk(dir, full => {
    const rel = path.relative(dir, full).replace(/\\/g, '/');
    if (/\.html$/i.test(rel)) {
      const html = fs.readFileSync(full, 'utf8');
      if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${rel}: sin <title>`);
      if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i.test(html)) warnings.push(`${rel}: sin meta description`);
      if (!/rel=["']canonical["']/i.test(html)) warnings.push(`${rel}: sin canonical`);
      if (!html.includes('/global-ui.js')) warnings.push(`${rel}: sin global-ui.js`);
      const suspicious=(html.match(/href=["']#['"]/gi)||[]).length;
      if (suspicious) warnings.push(`${rel}: ${suspicious} enlace(s) placeholder`);
      if (rel === 'pack-empadronamiento/index.html') {
        if (!html.includes('https://sede.madrid.es/UnidadesDescentralizadas/UDCEstadistica/TramitesMunicipales/Ficheros/Hoja_padronal.pdf')) failures.push(`${rel}: falta enlace al PDF oficial`);
        if (!html.includes('/pack-empadronamiento/review-v6.js?v=20261015-11')) failures.push(`${rel}: sin verificador PDF v11`);
        if (!html.includes('/pack-empadronamiento/municipal-universal.js?v=20261016-2')) failures.push(`${rel}: sin motor municipal universal v20261016-2`);
        if (!html.includes('/pack-empadronamiento/capitales-only.js?v=20261016-1')) failures.push(`${rel}: sin limitador a capitales`);
        if (html.includes('/pack-empadronamiento/fix.js')) failures.push(`${rel}: sigue cargando verificador antiguo`);
      }
    }
  });
  if (warnings.length) console.warn('WARNINGS:\n' + warnings.join('\n'));
  if (failures.length) { console.error('FAILURES:\n' + failures.join('\n')); process.exit(1); }
  console.log(`Build OK: ${dir}`);
}

copyAll();
audit(OUT);
