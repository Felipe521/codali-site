// Servidor local que imita a produção (.htaccess): /pasta → pasta/index.html, /pasta/ → 301, ausente → 404.html.
// Uso: npm run servir  (depois de npm run build) → http://localhost:4173
import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const raiz = process.argv[2];
const porta = Number(process.argv[3] || 4174);
const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.avif': 'image/avif', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.pdf': 'application/pdf' };
const existe = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let caminho = decodeURIComponent(url.pathname);
  if (caminho.length > 1 && caminho.endsWith('/')) { res.writeHead(301, { Location: caminho.slice(0, -1) + url.search }); return res.end(); }
  const seguro = normalize(caminho).replace(/^(\.\.[/\\])+/, '');
  let arquivo = join(raiz, seguro);
  if (!(await existe(arquivo))) arquivo = join(raiz, seguro, 'index.html');
  if (await existe(arquivo)) {
    const corpo = await readFile(arquivo);
    const comprimir = /\.(html|js|css|svg|json|xml|txt|webmanifest)$/.test(arquivo) && /gzip/.test(req.headers['accept-encoding'] || '');
    res.writeHead(200, { 'Content-Type': tipos[extname(arquivo)] || 'application/octet-stream', ...(comprimir ? { 'Content-Encoding': 'gzip' } : {}) });
    return res.end(comprimir ? gzipSync(corpo) : corpo);
  }
  res.writeHead(404, { 'Content-Type': tipos['.html'] });
  res.end(await readFile(join(raiz, '404.html')));
}).listen(porta, () => console.log(`servindo ${raiz} em http://localhost:${porta}`));
