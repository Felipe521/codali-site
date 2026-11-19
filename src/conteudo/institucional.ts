/**
 * Conteúdo institucional.
 *
 * Missão, visão, nomes dos valores e texto-base dos valores: transcritos do
 * site oficial (apenas "será definida" virou "é definida", no presente).
 * As descrições individuais de cada valor e os "princípios construtivos"
 * são PROPOSTAS de redação para aprovação da Codali.
 */

export const manifesto = {
  frase: ['Não', 'construímos', 'apenas', 'soluções.', 'Ajudamos', 'a', 'construir', 'o', 'futuro.'],
  destaques: ['soluções.', 'futuro.'],
  complemento:
    'Acreditamos que o trabalho com inteligência e a busca incessante do aprimoramento das técnicas muda tudo. É com esse olhar que oferecemos soluções que apoiam projetos e elevam a qualidade do trabalho de quem constrói.',
}

export const sobre = {
  titulo: 'Soluções inteligentes para um mundo em construção.',
  texto:
    'A Codali oferece soluções para quem constrói, como a linha SLIM de espaçadores niveladores e cunhas para revestimento — sempre com o compromisso de gerar maior qualidade no trabalho dos nossos clientes.',
}

export const missao = {
  rotulo: 'Missão',
  titulo: 'Ajudar nossos clientes a construir sonhos e desenvolver o futuro.',
  texto: 'Acreditamos que o trabalho com inteligência e a busca incessante do aprimoramento das técnicas muda tudo.',
}

export const visao = {
  rotulo: 'Visão',
  titulo: 'Ser uma empresa referência em qualidade e inovação,',
  texto:
    'entregando soluções que apoiam os projetos e geram maior qualidade no trabalho dos nossos clientes, ao mesmo tempo que promovemos um ambiente de trabalho seguro, saudável e motivador para os nossos colaboradores.',
}

export const valoresIntro =
  'Nossa cultura empresarial é definida por cinco pilares essenciais. Eles orientam todas as nossas ações e decisões e reforçam nosso compromisso com clientes, colaboradores e comunidade.'

export type IdValor = 'comprometimento' | 'qualidade' | 'integridade' | 'respeito' | 'humildade'

export type Valor = {
  id: IdValor
  nome: string
  principio: string
  descricao: string
}

export const valores: Valor[] = [
  {
    id: 'comprometimento',
    nome: 'Comprometimento',
    principio: 'A amarração',
    descricao:
      'Como os blocos de uma parede bem amarrada, cada compromisso sustenta o próximo. Honramos o que combinamos, do primeiro contato ao acabamento.',
  },
  {
    id: 'qualidade',
    nome: 'Qualidade',
    principio: 'A precisão',
    descricao: 'É nos milímetros que se define o resultado de uma obra. Buscamos precisão em cada detalhe do que entregamos.',
  },
  {
    id: 'integridade',
    nome: 'Integridade',
    principio: 'O prumo',
    descricao: 'Agimos no prumo: com transparência, coerência e verdade em todas as relações.',
  },
  {
    id: 'respeito',
    nome: 'Respeito',
    principio: 'A junta',
    descricao:
      'Como a junta entre duas peças, respeito é dar a cada pessoa o espaço certo — clientes, colaboradores e comunidade.',
  },
  {
    id: 'humildade',
    nome: 'Humildade',
    principio: 'O alicerce',
    descricao:
      'Toda grande obra começa pela base. Seguimos aprendendo todos os dias, porque o aprimoramento das técnicas nunca termina.',
  },
]
