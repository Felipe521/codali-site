import { useEffect, useState } from 'react'
import { observarFaixa } from '../lib/naVista'
import { useRolagem } from '../lib/rolagem'
import { cx } from '../lib/util'

export const secoesInicio = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'manifesto', rotulo: 'Manifesto' },
  { id: 'quem-somos', rotulo: 'Quem somos' },
  { id: 'produtos', rotulo: 'Produtos' },
  { id: 'processo', rotulo: 'Como funciona' },
  { id: 'valores', rotulo: 'Valores' },
  { id: 'catalogo', rotulo: 'Catálogo' },
  { id: 'parceiros', rotulo: 'Parceiros' },
  { id: 'contato', rotulo: 'Contato' },
]

/** Índice lateral da página inicial (telas largas): mostra e navega entre as seções. */
export function IndiceSecoes() {
  const [ativa, setAtiva] = useState('inicio')
  const [claro, setClaro] = useState(false)
  const { rolarPara } = useRolagem()

  // Seção ativa = a que cruza o meio da tela (IntersectionObserver, sem trabalho por quadro)
  useEffect(() => {
    const secoes = secoesInicio.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null)
    return observarFaixa(
      secoes,
      () => '-49.5% 0px -49.5% 0px',
      (el) => {
        setAtiva(el.id)
        setClaro(el.dataset.tema === 'claro')
      },
    )
  }, [])

  const indice = secoesInicio.findIndex((s) => s.id === ativa)

  return (
    <nav
      aria-label="Seções da página"
      className={cx(
        'indice-secoes fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 transition-colors duration-500 xl:block',
        claro ? 'text-tinta' : 'text-papel',
      )}
    >
      <ol className="flex flex-col items-end gap-2.5">
        {secoesInicio.map((s, i) => {
          const atual = s.id === ativa
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => rolarPara(`#${s.id}`)}
                className="group flex items-center gap-3 py-0.5"
                aria-current={atual ? 'true' : undefined}
                aria-label={`Ir para ${s.rotulo}`}
              >
                <span
                  className={cx(
                    'rotulo text-[0.62rem] transition-all duration-500',
                    'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-90 group-focus-visible:translate-x-0 group-focus-visible:opacity-90',
                  )}
                >
                  {String(i).padStart(2, '0')} {s.rotulo}
                </span>
                <span
                  className={cx(
                    'block h-px transition-all duration-500',
                    atual
                      ? cx('w-7', claro ? 'bg-violeta' : 'bg-violeta-claro')
                      : 'w-3.5 bg-current opacity-45 group-hover:w-5 group-hover:opacity-90',
                  )}
                />
              </button>
            </li>
          )
        })}
      </ol>
      <p className="rotulo mt-4 text-right text-[0.6rem] opacity-60" aria-hidden="true">
        {String(indice).padStart(2, '0')} / {String(secoesInicio.length - 1).padStart(2, '0')}
      </p>
    </nav>
  )
}
