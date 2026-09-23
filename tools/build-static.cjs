const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  const source = path.join(root, entry.name);
  if (entry.isFile() && (entry.name.endsWith('.html') || ['styles.css', 'app.js'].includes(entry.name))) {
    fs.copyFileSync(source, path.join(out, entry.name));
  } else if (entry.isDirectory() && (entry.name === 'assets' || fs.existsSync(path.join(source, 'index.html')))) {
    fs.cpSync(source, path.join(out, entry.name), { recursive: true });
  }
}
console.log('Static website ready in dist/');
