const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/bg-surface-card/g, 'bg-neutral-900');
      content = content.replace(/bg-surface-dark\b/g, 'bg-neutral-900');
      content = content.replace(/bg-surface-dark\//g, 'bg-neutral-900/');
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir('src');
console.log('done');
