/*
  Serveur local de l'appli (sans dépendance) - sert le dossier dist/ sur http://localhost:5180
  localhost est considéré comme "sécurisé" : caméra et géolocalisation fonctionnent.
*/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 5180;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8'
};

if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error('dist/ introuvable : lancez d’abord « npm run build ».');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end();
    return;
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html'); // appli monopage
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
});

server.on('error', (e) => {
  // déjà lancé (une fenêtre de l'appli est ouverte) : rien à faire
  if (e.code === 'EADDRINUSE') process.exit(0);
  throw e;
});
server.listen(PORT, '127.0.0.1', () => console.log(`Seconde Maille : http://localhost:${PORT}`));
