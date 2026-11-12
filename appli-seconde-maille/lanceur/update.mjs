/*
  Vérifie si l'appli doit être mise à jour avant de l'ouvrir (sans dépendance).
  Code de sortie : 0 = à jour · 10 = recompiler · 11 = installer les modules puis recompiler
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const at = (...p) => path.join(ROOT, ...p);
const mtime = (p) => {
  try {
    return fs.statSync(p).mtimeMs;
  } catch {
    return 0;
  }
};
// date de la dernière modification dans un dossier (récursif)
function newest(dir) {
  let max = 0;
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    max = Math.max(max, e.isDirectory() ? newest(p) : mtime(p));
  }
  return max;
}

// 1. modules : absents, ou package.json modifié depuis la dernière installation
const installedAt = mtime(at('node_modules', '.package-lock.json')) || mtime(at('node_modules'));
const needInstall = !installedAt || mtime(at('package.json')) > installedAt;

// 2. compilation : dist absent, ou un fichier de l'appli plus récent que dist
const builtAt = mtime(at('dist', 'index.html'));
const sources = Math.max(
  newest(at('src')),
  newest(at('public')),
  ...['index.html', 'package.json', 'vite.config.js', 'tailwind.config.js', 'postcss.config.js', '.env', '.env.local', '.env.production', '.env.production.local'].map((f) => mtime(at(f)))
);
const needBuild = needInstall || !builtAt || sources > builtAt;

if (process.argv.includes('--verbose')) console.log({ needInstall, needBuild, builtAt: new Date(builtAt), sources: new Date(sources) });
process.exit(needInstall ? 11 : needBuild ? 10 : 0);
