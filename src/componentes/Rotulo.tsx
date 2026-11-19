import { cx } from '../lib/util'
import { Octogono } from './Octogono'

/** Rótulo técnico de seção: "◆ 02 —— Quem somos" */
export function Rotulo({ indice, texto, className, claro = false }: { indice?: string; texto: string; className?: string; claro?: boolean }) {
  return (
    <p className={cx('rotulo flex items-center gap-3', claro ? 'text-chumbo' : 'text-nevoa', className)}>
      <Octogono className={cx('size-2 shrink-0', claro ? 'text-violeta' : 'text-violeta-claro')} />
      {indice && <span className={claro ? 'text-tinta' : 'text-papel'}>{indice}</span>}
      <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
      <span>{texto}</span>
    </p>
  )
}
