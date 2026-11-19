import { produtoPorSlug, type Produto } from '../conteudo/produtos'
import type { Rota } from '../lib/roteador'
import { escaparHtml } from '../lib/util'
import { empresa } from './empresa'

export type Meta = {
  titulo: string
  descricao: string
  caminho: string
  imagem: string
  imagemAlt: string
  indexar: boolean
  jsonLd: object[]
}

const organizacao = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${empresa.site}/#organizacao`,
  name: empresa.nome,
  url: `${empresa.site}/`,
  logo: `${empresa.site}/icon-512.png`,
  slogan: empresa.slogan,
  email: empresa.email,
  telephone: empresa.telefone.schema,
  sameAs: empresa.redes.map((r) => r.url),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: empresa.telefone.schema,
      contactType: 'customer service',
    },
  ],
}

const siteWeb = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${empresa.site}/#site`,
  url: `${empresa.site}/`,
  name: empresa.nome,
  inLanguage: 'pt-BR',
  publisher: { '@id': `${empresa.site}/#organizacao` },
}

function trilha(itens: Array<[string, string]>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map(([nome, caminho], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: nome,
      item: `${empresa.site}${caminho}`,
    })),
  }
}

function schemaProduto(p: Produto) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nome,
    description: p.descricao,
    image: `${empresa.site}${p.imagem.base}-full.webp`,
    brand: { '@type': 'Brand', name: empresa.nome },
    gtin13: p.ean,
    category: p.tipo,
    color: p.cor.nome,
  }
}

export function metaDaRota(rota: Rota): Meta {
  switch (rota.nome) {
    case 'inicio':
      return {
        titulo: 'Codali — Soluções inteligentes para um mundo em construção',
        descricao:
          'Linha SLIM de espaçadores niveladores e cunhas para revestimento. Conheça a Codali, seja revendedor ou representante e fale com a nossa equipe.',
        caminho: '/',
        imagem: '/img/og/codali.jpg',
        imagemAlt: 'Codali — Soluções inteligentes para um mundo em construção',
        indexar: true,
        jsonLd: [organizacao, siteWeb],
      }
    case 'produtos':
      return {
        titulo: 'Produtos e catálogo digital | Codali',
        descricao:
          'Catálogo digital Codali: linha SLIM de espaçadores niveladores (1,0, 1,5 e 2,0 mm) e cunha para revestimento.',
        caminho: '/produtos',
        imagem: '/img/og/produtos.jpg',
        imagemAlt: 'Linha SLIM da Codali — espaçadores niveladores e cunha para revestimento',
        indexar: true,
        jsonLd: [trilha([['Início', '/'], ['Produtos', '/produtos']])],
      }
    case 'produto': {
      const p = produtoPorSlug(rota.slug)!
      return {
        titulo: `${p.nome} — ${p.tipo} | Codali`,
        descricao: `${p.descricao} Embalagem com ${p.embalagem}.`,
        caminho: `/produtos/${p.slug}`,
        imagem: `/img/og/${p.slug}.jpg`,
        imagemAlt: p.imagem.alt,
        indexar: true,
        jsonLd: [schemaProduto(p), trilha([['Início', '/'], ['Produtos', '/produtos'], [p.nome, `/produtos/${p.slug}`]])],
      }
    }
    case 'revendedor':
      return {
        titulo: 'Seja um revendedor Codali',
        descricao:
          'Venda os produtos Codali no seu negócio. Preencha o cadastro de revendedor e a nossa equipe entra em contato.',
        caminho: '/revendedor',
        imagem: '/img/og/revendedor.jpg',
        imagemAlt: 'Seja um revendedor Codali',
        indexar: true,
        jsonLd: [trilha([['Início', '/'], ['Seja um revendedor', '/revendedor']])],
      }
    case 'representante':
      return {
        titulo: 'Seja um representante Codali',
        descricao:
          'Represente a Codali e leve soluções para a construção aos seus clientes. Preencha o cadastro de representante e a nossa equipe entra em contato.',
        caminho: '/representante',
        imagem: '/img/og/representante.jpg',
        imagemAlt: 'Seja um representante Codali',
        indexar: true,
        jsonLd: [trilha([['Início', '/'], ['Seja um representante', '/representante']])],
      }
    default:
      return {
        titulo: 'Página não encontrada | Codali',
        descricao: 'A página que você procura não existe ou mudou de endereço.',
        caminho: '/404',
        imagem: '/img/og/codali.jpg',
        imagemAlt: 'Codali',
        indexar: false,
        jsonLd: [],
      }
  }
}

/** Tags do <head> para o HTML pré-renderizado. */
export function headHtml(m: Meta): string {
  const url = `${empresa.site}${m.caminho === '/' ? '/' : m.caminho}`
  const imagem = `${empresa.site}${m.imagem}`
  const t = escaparHtml(m.titulo)
  const d = escaparHtml(m.descricao)
  const linhas = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    m.indexar ? `<link rel="canonical" href="${url}" />` : `<meta name="robots" content="noindex" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Codali" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${imagem}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escaparHtml(m.imagemAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${imagem}" />`,
    ...m.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ]
  return linhas.join('\n    ')
}

/** Atualiza título e metatags ao navegar entre páginas no navegador. */
export function aplicarMeta(m: Meta): void {
  document.title = m.titulo
  const definir = (seletor: string, atributo: string, valor: string) => {
    const el = document.head.querySelector(seletor)
    if (el) el.setAttribute(atributo, valor)
  }
  const url = `${empresa.site}${m.caminho === '/' ? '/' : m.caminho}`
  definir('meta[name="description"]', 'content', m.descricao)
  definir('link[rel="canonical"]', 'href', url)
  definir('meta[property="og:title"]', 'content', m.titulo)
  definir('meta[property="og:description"]', 'content', m.descricao)
  definir('meta[property="og:url"]', 'content', url)
  definir('meta[property="og:image"]', 'content', `${empresa.site}${m.imagem}`)
}
