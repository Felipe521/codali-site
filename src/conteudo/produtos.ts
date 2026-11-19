/**
 * Produtos Codali — Linha SLIM.
 *
 * Fontes: site oficial (nomes e fotos) e as próprias embalagens fotografadas
 * (tipo do produto, medida, quantidade, código de barras e a frase
 * "Reduz em até 50% do tempo de colocação"). Os códigos EAN foram lidos das
 * embalagens e conferidos pelo dígito verificador.
 *
 * Nenhuma especificação técnica além dessas foi adicionada. Para incluir
 * material, dimensões das peças ou indicações de uso, use dados da empresa.
 */

export type CorProduto = {
  nome: string
  hex: string
  /** versão clara para fundos e brilhos */
  brilho: string
}

export type Produto = {
  slug: string
  nome: string
  nomeCurto: string
  tipo: string
  linha: 'SLIM'
  junta?: string
  destaque: string
  cor: CorProduto
  embalagem: string
  ean: string
  resumo: string
  descricao: string
  funcaoNoSistema: string
  imagem: {
    base: string
    largura: number
    altura: number
    larguraPequena: number
    alturaPequena: number
    alt: string
  }
}

export const AFIRMACAO_EMBALAGEM = 'Reduz em até 50% do tempo de colocação'
export const FONTE_AFIRMACAO = 'Informação impressa nas embalagens da linha SLIM.'

export const produtos: Produto[] = [
  {
    slug: 'espacador-slim-1-0-mm',
    nome: 'Espaçador 1,0\u00a0mm SLIM',
    nomeCurto: '1,0 mm',
    tipo: 'Espaçador nivelador de revestimentos',
    linha: 'SLIM',
    junta: '1,0 mm',
    destaque: '1,0',
    cor: { nome: 'Verde', hex: '#4fbf45', brilho: '#9be38f' },
    embalagem: '100 unidades',
    ean: '0736532324870',
    resumo: 'Juntas de 1,0 mm, com peças alinhadas do início ao fim do assentamento.',
    descricao:
      'O espaçador nivelador de 1,0 mm define juntas finas e uniformes e mantém as peças alinhadas durante o assentamento. É a menor medida de junta da linha SLIM.',
    funcaoNoSistema: 'Posicionado sob as peças, define a largura da junta e recebe a cunha que faz o nivelamento.',
    imagem: {
      base: '/img/produtos/slim-1-0',
      largura: 800,
      altura: 1036,
      larguraPequena: 480,
      alturaPequena: 622,
      alt: 'Embalagem do Espaçador nivelador de revestimentos 1,0 mm SLIM da Codali, com 100 peças verdes',
    },
  },
  {
    slug: 'espacador-slim-1-5-mm',
    nome: 'Espaçador 1,5\u00a0mm SLIM',
    nomeCurto: '1,5 mm',
    tipo: 'Espaçador nivelador de revestimentos',
    linha: 'SLIM',
    junta: '1,5 mm',
    destaque: '1,5',
    cor: { nome: 'Vermelho', hex: '#dd2c36', brilho: '#ff8a8f' },
    embalagem: '100 unidades',
    ean: '0736532324887',
    resumo: 'Juntas de 1,5 mm, a medida intermediária da linha SLIM.',
    descricao:
      'O espaçador nivelador de 1,5 mm define juntas uniformes de medida intermediária e mantém as peças alinhadas durante o assentamento.',
    funcaoNoSistema: 'Posicionado sob as peças, define a largura da junta e recebe a cunha que faz o nivelamento.',
    imagem: {
      base: '/img/produtos/slim-1-5',
      largura: 1200,
      altura: 1593,
      larguraPequena: 480,
      alturaPequena: 637,
      alt: 'Embalagem do Espaçador nivelador de revestimentos 1,5 mm SLIM da Codali, com 100 peças vermelhas',
    },
  },
  {
    slug: 'espacador-slim-2-0-mm',
    nome: 'Espaçador 2,0\u00a0mm SLIM',
    nomeCurto: '2,0 mm',
    tipo: 'Espaçador nivelador de revestimentos',
    linha: 'SLIM',
    junta: '2,0 mm',
    destaque: '2,0',
    cor: { nome: 'Lilás', hex: '#a866c4', brilho: '#d9b3ec' },
    embalagem: '100 unidades',
    ean: '0736532324894',
    resumo: 'Juntas de 2,0 mm, a maior medida de junta da linha SLIM.',
    descricao:
      'O espaçador nivelador de 2,0 mm define juntas uniformes e mantém as peças alinhadas durante o assentamento. É a maior medida de junta da linha SLIM.',
    funcaoNoSistema: 'Posicionado sob as peças, define a largura da junta e recebe a cunha que faz o nivelamento.',
    imagem: {
      base: '/img/produtos/slim-2-0',
      largura: 744,
      altura: 932,
      larguraPequena: 480,
      alturaPequena: 601,
      alt: 'Embalagem do Espaçador nivelador de revestimentos 2,0 mm SLIM da Codali, com 100 peças lilás',
    },
  },
  {
    slug: 'cunha-slim',
    nome: 'Cunha para revestimento SLIM',
    nomeCurto: 'Cunha',
    tipo: 'Cunha para nivelamento de revestimentos',
    linha: 'SLIM',
    destaque: 'Cunha',
    cor: { nome: 'Cinza', hex: '#a0a6a2', brilho: '#dfe3e0' },
    embalagem: '100 unidades',
    ean: '0736532324917',
    resumo: 'Encaixada no espaçador, pressiona as peças até o mesmo plano.',
    descricao:
      'A cunha para nivelamento trabalha em conjunto com os espaçadores niveladores: encaixada no espaçador, pressiona as peças até o mesmo plano e elimina o desnível entre elas.',
    funcaoNoSistema: 'Entra no espaçador e pressiona as bordas das peças até que fiquem no mesmo nível.',
    imagem: {
      base: '/img/produtos/cunha-slim',
      largura: 799,
      altura: 990,
      larguraPequena: 480,
      alturaPequena: 595,
      alt: 'Embalagem da Cunha para nivelamento de revestimentos SLIM da Codali, com 100 peças cinza',
    },
  },
]

export const espacadores = produtos.filter((p) => p.junta)

export function produtoPorSlug(slug: string): Produto | undefined {
  return produtos.find((p) => p.slug === slug)
}

/** "0736532324870" → "0 736532 324870" (formato impresso na embalagem) */
export function formatarEan(ean: string): string {
  return `${ean.slice(0, 1)} ${ean.slice(1, 7)} ${ean.slice(7)}`
}
