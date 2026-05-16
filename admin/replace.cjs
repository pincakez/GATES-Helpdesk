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
      content = content.replace(/zinc-/g, 'neutral-');
      content = content.replace(/bg-surface-darker/g, 'bg-[#0a0a0a]');
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir('src');
console.log('done');
