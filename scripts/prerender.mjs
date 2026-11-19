// Gera o HTML estático de cada página (SEO, Open Graph e primeira pintura sem esperar o JavaScript).
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const raiz = resolve(import.meta.dirname, '..')
const dist = join(raiz, 'dist')
const ssr = join(raiz, 'dist-ssr')
const SITE = 'https://www.codali.com.br'

const modelo = await readFile(join(dist, 'index.html'), 'utf8')
const { render, rotas } = await import(pathToFileURL(join(ssr, 'entry-server.js')).href)

const assets = await readdir(join(dist, 'assets'))
const fonte = assets.find((f) => /^archivo-codali.*\.woff2$/.test(f))
const preload = fonte ? `<link rel="preload" href="/assets/${fonte}" as="font" type="font/woff2" crossorigin />` : ''
if (!fonte) console.warn('! Fonte principal não encontrada para preload')

// Manifesto do Vite: descobre o arquivo JS de cada página e suas dependências.
const manifesto = JSON.parse(await readFile(join(dist, '.vite', 'manifest.json'), 'utf8'))
function arquivosDoModulo(chave, vistos = new Set()) {
  const item = manifesto[chave]
  if (!item || vistos.has(chave) || item.isEntry) return []
  vistos.add(chave)
  return [item.file, ...(item.imports ?? []).flatMap((i) => arquivosDoModulo(i, vistos))]
}

/**
 * Ordem do <head> pensada para a primeira pintura: a CSS (única que bloqueia a renderização)
 * vem logo no início; fonte e JavaScript (que não bloqueiam) ficam no fim, sem disputar banda com ela.
 */
// A CSS (~17 KB comprimida) vai embutida no HTML: elimina uma ida e volta na rede antes da
// primeira pintura. Como a navegação entre páginas não recarrega o documento, ela é baixada uma vez por visita.
const arquivoCss = assets.find((f) => /^style-.*\.css$/.test(f))
const cssEmbutida = arquivoCss ? (await readFile(join(dist, 'assets', arquivoCss), 'utf8')).replace(/<\/style/gi, '<\\/style') : ''

function ordenarHead(pagina) {
  const css = (pagina.match(/<link rel="stylesheet"[^>]*>/g) ?? []).map((tag) => (cssEmbutida ? `<style>${cssEmbutida}</style>` : tag))
  for (const tag of pagina.match(/<link rel="stylesheet"[^>]*>/g) ?? []) pagina = pagina.replace(tag, '')
  const fontes = pagina.match(/<link rel="preload"[^>]*as="font"[^>]*>/g) ?? []
  const scripts = pagina.match(/<script type="module"[^>]*><\/script>/g) ?? []
  const modulos = [...new Set((pagina.match(/<link rel="modulepreload"[^>]*>/g) ?? []).map((t) => t.replace(/\s*\/?>$/, ' />')))]
  let resultado = pagina
  for (const tag of [...fontes, ...scripts, ...(pagina.match(/<link rel="modulepreload"[^>]*>/g) ?? [])]) resultado = resultado.replace(tag, '')
  resultado = resultado.replace(/(<meta name="viewport"[^>]*>)/, `$1\n    ${css.join('\n    ')}\n    ${fontes.join('\n    ')}`)
  resultado = resultado.replace('</head>', `    ${scripts.join('\n    ')}\n    ${modulos.join('\n    ')}\n  </head>`)
  return resultado.replace(/\n(\s*\n)+/g, '\n')
}

for (const rota of rotas) {
  const { html, head, modulo } = render(rota)
  const modulos = [...new Set(arquivosDoModulo(modulo))]
  const precarga = modulos.map((f) => `<link rel="modulepreload" crossorigin href="/${f}" />`).join('\n    ')
  const pagina = ordenarHead(
    modelo.replace('<!--app-head-->', `${head}\n    ${preload}\n    ${precarga}`).replace('<!--app-html-->', html),
  )
  const arquivo = rota === '/' ? 'index.html' : rota === '/404' ? '404.html' : join(rota.slice(1), 'index.html')
  await mkdir(dirname(join(dist, arquivo)), { recursive: true })
  await writeFile(join(dist, arquivo), pagina)
  console.log(`✓ ${rota.padEnd(36)} → dist/${arquivo}  (${(pagina.length / 1024).toFixed(1)} KB)`)
}

const hoje = new Date().toISOString().slice(0, 10)
const urls = rotas
  .filter((r) => r !== '/404')
  .map((r) => `  <url><loc>${SITE}${r}</loc><lastmod>${hoje}</lastmod></url>`)
  .join('\n')
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
await rm(ssr, { recursive: true, force: true })
await rm(join(dist, '.vite'), { recursive: true, force: true })
if (arquivoCss && cssEmbutida) await rm(join(dist, 'assets', arquivoCss))
console.log('✓ sitemap.xml e robots.txt gerados')
