import { integracoes } from '../config/empresa'

export type TipoFormulario = 'contato' | 'revendedor' | 'representante'

export type ResultadoEnvio = { ok: true } | { ok: false; erro: string }

/** Há um serviço configurado para receber os formulários? (VITE_FORM_ENDPOINT) */
export const envioDiretoDisponivel = () => integracoes.formEndpoint.length > 0

/**
 * Envia os dados para o serviço configurado (Formspree, Web3Forms ou backend próprio).
 * Só considera sucesso quando o servidor responde 2xx — nunca simula envio.
 */
export async function enviarFormulario(
  tipo: TipoFormulario,
  assunto: string,
  campos: Record<string, string>,
): Promise<ResultadoEnvio> {
  if (!envioDiretoDisponivel()) return { ok: false, erro: 'Envio direto não configurado.' }

  const corpo: Record<string, string> = {
    ...campos,
    formulario: tipo,
    subject: assunto,
    _subject: assunto,
    pagina: window.location.href,
  }
  if (integracoes.formChave) corpo.access_key = integracoes.formChave

  const controle = new AbortController()
  const limite = window.setTimeout(() => controle.abort(), 15000)
  try {
    const resposta = await fetch(integracoes.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(corpo),
      signal: controle.signal,
    })
    if (!resposta.ok) {
      return { ok: false, erro: `O servidor recusou o envio (código ${resposta.status}). Tente novamente ou fale pelo WhatsApp.` }
    }
    const dados = (await resposta.json().catch(() => null)) as { success?: boolean; message?: string } | null
    if (dados && dados.success === false) {
      return { ok: false, erro: dados.message || 'O serviço de formulários recusou o envio.' }
    }
    return { ok: true }
  } catch {
    return { ok: false, erro: 'Não foi possível conectar. Verifique sua internet e tente novamente, ou fale pelo WhatsApp.' }
  } finally {
    window.clearTimeout(limite)
  }
}

/** Monta uma mensagem legível (WhatsApp/e-mail) com os campos preenchidos. */
export function montarMensagem(titulo: string, linhas: Array<[string, string]>): string {
  const corpo = linhas
    .filter(([, valor]) => valor.trim().length > 0)
    .map(([rotulo, valor]) => `*${rotulo}:* ${valor.trim()}`)
    .join('\n')
  return `${titulo}\n\n${corpo}`
}
