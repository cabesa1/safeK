// Empacotamento opcional: incorpora as imagens no HTML sem bibliotecas externas.
// A página final abre diretamente, sem servidor ou processo de build.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const names = [...new Set(html.match(/assets\/[a-z-]+\.(png|jpg)/g) || [])];
for (const name of names) {
  const mime = name.endsWith('.png') ? 'image/png' : 'image/jpeg';
  html = html.split(name).join(`data:${mime};base64,${fs.readFileSync(path.join(root,name)).toString('base64')}`);
}
fs.writeFileSync(file, html);
console.log(`${names.length} imagens incorporadas; ${Math.round(Buffer.byteLength(html)/1024)} KB.`);
