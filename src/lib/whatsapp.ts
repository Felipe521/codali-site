import { empresa } from '../config/empresa'

/** Link oficial do WhatsApp (wa.me) com mensagem opcional já preenchida. */
export function linkWhatsApp(mensagem?: string): string {
  const base = `https://wa.me/${empresa.whatsapp.numero}`
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base
}

export const mensagensWhatsApp = {
  geral: 'Olá, Codali! Vim pelo site e gostaria de mais informações.',
  catalogo: 'Olá, Codali! Vim pelo site e gostaria de receber o catálogo atualizado de produtos.',
  revenda: 'Olá, Codali! Vim pelo site e tenho interesse em revender os produtos Codali.',
  representacao: 'Olá, Codali! Vim pelo site e tenho interesse em ser representante Codali.',
  produto: (nome: string) => `Olá, Codali! Vim pelo site e tenho interesse no produto ${nome}. Pode me passar mais informações?`,
}
