import { AlertCircle, Check, Loader2, Mail } from 'lucide-react'
import { useCallback, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { empresa } from '../../config/empresa'
import { enviarFormulario, envioDiretoDisponivel, montarMensagem, type TipoFormulario } from '../../lib/envio'
import { cx } from '../../lib/util'
import { linkWhatsApp } from '../../lib/whatsapp'
import { Botao } from '../Botao'
import { IconeWhatsApp } from '../Icones'
import { CampoIsca } from './Campos'

export type DefCampo = {
  nome: string
  rotulo: string
  obrigatorio?: boolean
  validar?: (valor: string) => string | null
  mascara?: (valor: string) => string
}

type Alteracao = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export function useFormulario(prefixo: string, defs: DefCampo[]) {
  const inicial = useMemo(() => Object.fromEntries(defs.map((d) => [d.nome, ''])) as Record<string, string>, [defs])
  const [valores, setValores] = useState<Record<string, string>>(inicial)
  const [erros, setErros] = useState<Record<string, string | null>>({})
  const tocados = useRef<Record<string, boolean>>({})

  const def = (nome: string) => {
    const d = defs.find((x) => x.nome === nome)
    if (!d) throw new Error(`Campo desconhecido: ${nome}`)
    return d
  }

  const checar = (nome: string, valor: string): string | null => {
    const d = def(nome)
    const v = valor.trim()
    if (!v) return d.obrigatorio ? 'Preencha este campo.' : null
    return d.validar ? d.validar(v) : null
  }

  const registrar = (nome: string) => {
    const d = def(nome)
    return {
      id: `${prefixo}-${nome}`,
      name: nome,
      rotulo: d.rotulo,
      obrigatorio: d.obrigatorio,
      value: valores[nome] ?? '',
      erro: erros[nome] ?? null,
      onChange: (e: Alteracao) => {
        const v = d.mascara ? d.mascara(e.target.value) : e.target.value
        setValores((p) => ({ ...p, [nome]: v }))
        if (tocados.current[nome]) setErros((p) => ({ ...p, [nome]: checar(nome, v) }))
      },
      onBlur: () => {
        tocados.current[nome] = true
        setErros((p) => ({ ...p, [nome]: checar(nome, valores[nome] ?? '') }))
      },
    }
  }

  /** Valida tudo e devolve os ids dos campos inválidos (na ordem do formulário). */
  const validarTudo = (): string[] => {
    const novos: Record<string, string | null> = {}
    const invalidos: string[] = []
    for (const d of defs) {
      tocados.current[d.nome] = true
      const e = checar(d.nome, valores[d.nome] ?? '')
      novos[d.nome] = e
      if (e) invalidos.push(`${prefixo}-${d.nome}`)
    }
    setErros(novos)
    return invalidos
  }

  const definir = useCallback((nome: string, valor: string) => setValores((p) => ({ ...p, [nome]: valor })), [])
  const limpar = () => {
    setValores(inicial)
    setErros({})
    tocados.current = {}
  }

  return { valores, registrar, validarTudo, definir, limpar }
}

export type ControleFormulario = ReturnType<typeof useFormulario>

type Estado =
  | { fase: 'ocioso' }
  | { fase: 'enviando' }
  | { fase: 'sucesso' }
  | { fase: 'erro'; mensagem: string }
  | { fase: 'whatsapp'; url: string }

type Props = {
  tipo: TipoFormulario
  controle: ControleFormulario
  defs: DefCampo[]
  tema?: 'escuro' | 'claro'
  assunto: string
  tituloMensagem: string
  rotuloEnviar: string
  children: ReactNode
  className?: string
}

/**
 * Envolve os campos e cuida do envio:
 * - com VITE_FORM_ENDPOINT configurado, envia de verdade e só mostra sucesso com resposta 2xx;
 * - sem ele, o botão vira "Enviar pelo WhatsApp" e abre a conversa com os dados preenchidos.
 */
export function Formulario({ tipo, controle, defs, tema = 'escuro', assunto, tituloMensagem, rotuloEnviar, children, className }: Props) {
  const [estado, setEstado] = useState<Estado>({ fase: 'ocioso' })
  const [aviso, setAviso] = useState('')
  const [isca, setIsca] = useState('')
  const direto = envioDiretoDisponivel()
  const escuro = tema === 'escuro'

  const linhas = (): Array<[string, string]> => defs.map((d) => [d.rotulo, controle.valores[d.nome] ?? ''])

  const mailto = () => {
    const corpo = montarMensagem(tituloMensagem, linhas()).replace(/\*/g, '')
    return `mailto:${empresa.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`
  }

  const aoEnviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (estado.fase === 'enviando') return
    const invalidos = controle.validarTudo()
    if (invalidos.length > 0) {
      setAviso(invalidos.length === 1 ? 'Revise o campo destacado.' : `Revise os ${invalidos.length} campos destacados.`)
      document.getElementById(invalidos[0])?.focus()
      return
    }
    setAviso('')
    if (isca) return

    if (direto) {
      setEstado({ fase: 'enviando' })
      const resultado = await enviarFormulario(tipo, assunto, controle.valores)
      if (resultado.ok) {
        setEstado({ fase: 'sucesso' })
        controle.limpar()
      } else {
        setEstado({ fase: 'erro', mensagem: resultado.erro })
      }
      return
    }

    const url = linkWhatsApp(montarMensagem(tituloMensagem, linhas()))
    window.open(url, '_blank', 'noopener,noreferrer')
    setEstado({ fase: 'whatsapp', url })
  }

  const recomecar = () => setEstado({ fase: 'ocioso' })

  if (estado.fase === 'sucesso' || estado.fase === 'whatsapp') {
    const sucesso = estado.fase === 'sucesso'
    return (
      <div
        className={cx('flex flex-col items-start gap-6 rounded-[1.75rem] p-8 sm:p-10', escuro ? 'bg-white/[0.04] ring-1 ring-white/10' : 'bg-white ring-1 ring-tinta/10', className)}
        role="status"
        aria-live="polite"
      >
        <span className={cx('grid size-14 place-items-center rounded-full', sucesso ? 'bg-violeta text-white' : 'bg-violeta/15 text-violeta-claro')}>
          {sucesso ? <Check size={26} /> : <IconeWhatsApp tamanho={24} />}
        </span>
        <div>
          <p className="display-s">{sucesso ? 'Mensagem enviada.' : 'Sua mensagem está pronta no WhatsApp.'}</p>
          <p className={cx('mt-3 max-w-md texto-bonito', escuro ? 'text-nevoa' : 'text-chumbo')}>
            {sucesso
              ? 'Recebemos seus dados. A equipe Codali vai entrar em contato em breve.'
              : 'Abrimos a conversa com a Codali em uma nova aba, com todos os dados preenchidos. Para concluir, é só enviar a mensagem por lá.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {!sucesso && (
            <Botao href={estado.url} icone={<IconeWhatsApp tamanho={16} />}>
              Abrir conversa no WhatsApp
            </Botao>
          )}
          <Botao variante={escuro ? 'contorno-escuro' : 'contorno-claro'} icone={false} onClick={recomecar}>
            {sucesso ? 'Enviar outra mensagem' : 'Voltar ao formulário'}
          </Botao>
        </div>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={aoEnviar} className={cx('formulario', !escuro && 'formulario--claro', className)} aria-busy={estado.fase === 'enviando'}>
      {children}
      <CampoIsca id={`${tipo}-site`} valor={isca} aoMudar={setIsca} />

      <div className="mt-10 flex flex-col gap-5">
        <p role="alert" className={cx('flex items-center gap-2 text-sm', aviso ? 'opacity-100' : 'sr-only', escuro ? 'text-alerta' : 'text-alerta-escuro')}>
          {aviso && <AlertCircle size={16} aria-hidden="true" />}
          {aviso}
        </p>

        {estado.fase === 'erro' && (
          <div role="alert" className={cx('rounded-2xl p-5 text-sm', escuro ? 'bg-alerta/10 text-papel' : 'bg-alerta-escuro/10 text-tinta')}>
            <p className="font-semibold">Não foi possível enviar agora.</p>
            <p className="mt-1 opacity-80">{estado.mensagem}</p>
            <a href={linkWhatsApp(montarMensagem(tituloMensagem, linhas()))} target="_blank" rel="noopener noreferrer" className="link-linha mt-3 inline-flex items-center gap-2 font-semibold">
              <IconeWhatsApp tamanho={15} /> Enviar pelo WhatsApp
            </a>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Botao
            type="submit"
            magnetico
            variante={escuro ? 'primario' : 'escuro'}
            icone={
              estado.fase === 'enviando' ? <Loader2 size={16} className="animate-spin" /> : direto ? undefined : <IconeWhatsApp tamanho={16} />
            }
            aria-disabled={estado.fase === 'enviando'}
          >
            {estado.fase === 'enviando' ? 'Enviando…' : direto ? rotuloEnviar : `${rotuloEnviar} pelo WhatsApp`}
          </Botao>
          {!direto && (
            <a href={mailto()} className={cx('link-linha inline-flex items-center gap-2 text-sm', escuro ? 'text-nevoa hover:text-papel' : 'text-chumbo hover:text-tinta')}>
              <Mail size={15} aria-hidden="true" /> Prefere e-mail? Envie por e-mail
            </a>
          )}
        </div>
        <p className={cx('text-xs leading-relaxed', escuro ? 'text-nevoa/80' : 'text-chumbo')}>
          {direto
            ? 'Ao enviar, você concorda que a Codali entre em contato sobre esta solicitação.'
            : 'Ao enviar, abriremos o WhatsApp com a sua mensagem pronta. Você concorda que a Codali entre em contato sobre esta solicitação.'}
        </p>
      </div>
    </form>
  )
}
