import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useRolagem } from '../lib/rolagem'
import { cx } from '../lib/util'

type Props = {
  aberto: boolean
  aoFechar: () => void
  titulo: string
  children: ReactNode
  className?: string
}

/** Diálogo acessível com <dialog> nativo: foco preso, Esc fecha, clique fora fecha. */
export function Modal({ aberto, aoFechar, titulo, children, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const idTitulo = useId()
  const { travar, destravar } = useRolagem()

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (aberto && !dialogo.open) {
      dialogo.showModal()
      travar()
      return () => destravar()
    }
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto, travar, destravar])

  // Clique no fundo escurecido fecha (no teclado: Esc ou o botão Fechar)
  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    const aoClicar = (e: MouseEvent) => {
      if (e.target === dialogo) aoFechar()
    }
    dialogo.addEventListener('click', aoClicar)
    return () => dialogo.removeEventListener('click', aoClicar)
  }, [aoFechar])

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      className={cx('modal', className)}
      onCancel={(e) => {
        e.preventDefault()
        aoFechar()
      }}
    >
      <div className="modal__caixa" data-lenis-prevent="">
        <div className="flex items-center justify-between gap-6 border-b border-white/10 px-5 py-4 sm:px-7">
          <h2 id={idTitulo} className="rotulo text-papel">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={aoFechar}
            className="grid size-11 place-items-center rounded-full border border-white/15 text-papel transition-colors hover:bg-white hover:text-tinta"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal__conteudo">{aberto ? children : null}</div>
      </div>
    </dialog>
  )
}
