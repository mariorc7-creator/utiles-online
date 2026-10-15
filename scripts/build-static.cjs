const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, '_site');
const SKIP = new Set(['.git', '.vercel', '_site', 'node_modules']);
const BOOTSTRAP = '<script src="/analytics.js?v=20261015-6" defer></script>';

function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyTree(from, to);
      continue;
    }
    if (!entry.isFile()) continue;
    let data = fs.readFileSync(from);
    if (entry.name.endsWith('.html')) {
      let html = data.toString('utf8');
      if (!/\/analytics\.js(?:\?|["'])/.test(html)) {
        if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${BOOTSTRAP}\n</body>`);
        else html += `\n${BOOTSTRAP}\n`;
      }
      data = Buffer.from(html, 'utf8');
    }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, data);
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
copyTree(ROOT, OUT);

let htmlCount = 0;
let missing = [];
function audit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) audit(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlCount++;
      const html = fs.readFileSync(full, 'utf8');
      if (!html.includes('/analytics.js')) missing.push(path.relative(OUT, full));
    }
  }
}
audit(OUT);
if (missing.length) {
  console.error('HTML sin bootstrap global:', missing);
  process.exit(1);
}
console.log(`Build estático listo: ${htmlCount} HTML con bootstrap global.`);
