import { AlertCircle } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cx } from '../../lib/util'

type Comum = {
  id: string
  rotulo: string
  erro?: string | null
  ajuda?: string
  obrigatorio?: boolean
  className?: string
}

function Moldura({ id, rotulo, erro, ajuda, obrigatorio, className, children }: Comum & { children: ReactNode }) {
  return (
    <div className={cx('campo', className)} data-invalido={erro ? 'true' : undefined}>
      <label htmlFor={id} className="campo__rotulo">
        {rotulo}
        {obrigatorio && <abbr title="obrigatório">*</abbr>}
      </label>
      <div className="campo__caixa">
        {children}
        <span className="campo__linha" aria-hidden="true" />
      </div>
      {ajuda && !erro ? (
        <p id={`${id}-ajuda`} className="campo__ajuda">
          {ajuda}
        </p>
      ) : (
        <p id={`${id}-erro`} className="campo__erro">
          {erro ? (
            <>
              <AlertCircle size={14} aria-hidden="true" />
              {erro}
            </>
          ) : null}
        </p>
      )}
    </div>
  )
}

function descritoPor(id: string, erro?: string | null, ajuda?: string) {
  if (erro) return `${id}-erro`
  if (ajuda) return `${id}-ajuda`
  return undefined
}

export function CampoTexto({ id, rotulo, erro, ajuda, obrigatorio, className, ...props }: Comum & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} ajuda={ajuda} obrigatorio={obrigatorio} className={className}>
      <input
        id={id}
        className="campo__controle"
        aria-invalid={erro ? true : undefined}
        aria-describedby={descritoPor(id, erro, ajuda)}
        required={obrigatorio}
        {...props}
      />
    </Moldura>
  )
}

export function CampoSelecao({
  id,
  rotulo,
  erro,
  ajuda,
  obrigatorio,
  className,
  opcoes,
  vazio = 'Selecione',
  ...props
}: Comum & SelectHTMLAttributes<HTMLSelectElement> & { opcoes: Array<[string, string]>; vazio?: string }) {
  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} ajuda={ajuda} obrigatorio={obrigatorio} className={className}>
      <select
        id={id}
        className="campo__controle"
        aria-invalid={erro ? true : undefined}
        aria-describedby={descritoPor(id, erro, ajuda)}
        required={obrigatorio}
        {...props}
      >
        <option value="">{vazio}</option>
        {opcoes.map(([valor, texto]) => (
          <option key={valor} value={valor}>
            {texto}
          </option>
        ))}
      </select>
    </Moldura>
  )
}

export function CampoArea({ id, rotulo, erro, ajuda, obrigatorio, className, ...props }: Comum & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} ajuda={ajuda} obrigatorio={obrigatorio} className={className}>
      <textarea
        id={id}
        className="campo__controle"
        aria-invalid={erro ? true : undefined}
        aria-describedby={descritoPor(id, erro, ajuda)}
        required={obrigatorio}
        rows={4}
        {...props}
      />
    </Moldura>
  )
}

/** Campo-isca invisível: robôs preenchem, pessoas não. */
export function CampoIsca({ id, valor, aoMudar }: { id: string; valor: string; aoMudar: (v: string) => void }) {
  return (
    <div className="campo-isca" aria-hidden="true">
      <label htmlFor={id}>Site</label>
      <input id={id} name="site" tabIndex={-1} autoComplete="off" value={valor} onChange={(e) => aoMudar(e.target.value)} />
    </div>
  )
}
