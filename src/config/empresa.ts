/**
 * Dados institucionais da Codali — fonte única de verdade do site.
 *
 * Conferidos no site oficial (https://www.codali.com.br) em 17/11/2026.
 * Itens marcados com "A CONFIRMAR" precisam de validação da empresa.
 * Campos vazios simplesmente não aparecem no site.
 */
export const empresa = {
  nome: 'Codali',
  slogan: 'Soluções inteligentes para um mundo em construção.',
  site: 'https://www.codali.com.br',

  telefone: {
    exibicao: '(41) 3797-5124',
    link: 'tel:+554137975124',
    schema: '+55-41-3797-5124',
  },

  whatsapp: {
    exibicao: '(41) 3797-5124',
    numero: '554137975124',
  },

  /**
   * A CONFIRMAR — o site atual publica "contato@codali.com", porém o domínio
   * codali.com está à venda e não tem servidor de e-mail (sem registro MX).
   * O domínio da empresa, codali.com.br, possui e-mail ativo (Hostinger).
   */
  email: 'contato@codali.com.br',

  /** Perfis listados nos metadados oficiais do site (schema.org "sameAs"). */
  redes: [
    { id: 'instagram', nome: 'Instagram', rotulo: '@codali_oficial', url: 'https://www.instagram.com/codali_oficial' },
    { id: 'facebook', nome: 'Facebook', rotulo: 'Codali', url: 'https://www.facebook.com/profile.php?id=61560890865068' },
    // A CONFIRMAR — página "jc-schmidt" listada pelo site oficial como perfil da Codali.
    { id: 'linkedin', nome: 'LinkedIn', rotulo: 'Codali', url: 'https://www.linkedin.com/company/jc-schmidt/' },
  ],

  /** Opcionais — preencher quando a empresa fornecer. */
  razaoSocial: '',
  cnpj: '',
  endereco: '',
  horarioAtendimento: '',
} as const

export type RedeSocial = (typeof empresa.redes)[number]

const limpar = (valor: string | undefined) => (valor ?? '').trim()

/** Integrações configuráveis por variáveis de ambiente (ver .env.example). */
export const integracoes = {
  formEndpoint: limpar(import.meta.env.VITE_FORM_ENDPOINT),
  formChave: limpar(import.meta.env.VITE_FORM_ACCESS_KEY),
  catalogoPdf: limpar(import.meta.env.VITE_CATALOGO_URL),
  politicaPrivacidade: limpar(import.meta.env.VITE_POLITICA_PRIVACIDADE_URL),
}
