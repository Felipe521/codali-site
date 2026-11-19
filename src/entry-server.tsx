import { renderToString } from 'react-dom/server'
import { App } from './App'
import { headHtml, metaDaRota } from './config/seo'
import { produtos } from './conteudo/produtos'
import { resolverRota } from './lib/roteador'
import { CatalogoDigital } from './paginas/CatalogoDigital'
import { Inicio } from './paginas/Inicio'
import { NaoEncontrada } from './paginas/NaoEncontrada'
import { PaginaProduto } from './paginas/PaginaProduto'
import { PaginaRepresentante, PaginaRevendedor } from './paginas/Parcerias'
import { registrarPagina } from './paginas/registro'

registrarPagina('inicio', Inicio)
registrarPagina('produtos', CatalogoDigital)
registrarPagina('produto', PaginaProduto)
registrarPagina('revendedor', PaginaRevendedor)
registrarPagina('representante', PaginaRepresentante)
registrarPagina('nao-encontrada', NaoEncontrada)

/** Arquivo-fonte de cada página (usado para pré-carregar o JavaScript certo em cada HTML). */
export const modulosDasRotas: Record<string, string> = {
  inicio: 'src/paginas/Inicio.tsx',
  produtos: 'src/paginas/CatalogoDigital.tsx',
  produto: 'src/paginas/PaginaProduto.tsx',
  revendedor: 'src/paginas/Parcerias.tsx',
  representante: 'src/paginas/Parcerias.tsx',
  'nao-encontrada': 'src/paginas/NaoEncontrada.tsx',
}

/** Páginas geradas como HTML estático no build. */
export const rotas = ['/', '/produtos', ...produtos.map((p) => `/produtos/${p.slug}`), '/revendedor', '/representante', '/404']

export function render(url: string) {
  const rota = resolverRota(url)
  return {
    html: renderToString(<App url={url} />),
    head: headHtml(metaDaRota(rota)),
    modulo: modulosDasRotas[rota.nome],
  }
}
