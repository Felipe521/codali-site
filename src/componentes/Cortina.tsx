import { Octogono } from './Octogono'

export type FaseCortina = 'parada' | 'cobrindo' | 'revelando'

/** Transição entre páginas: duas camadas (violeta e grafite) que cobrem e revelam. */
export function Cortina({ fase, rotulo }: { fase: FaseCortina; rotulo: string }) {
  return (
    <div className="cortina" data-fase={fase} aria-hidden="true">
      <div className="cortina__painel cortina__painel--violeta" />
      <div className="cortina__painel cortina__painel--tinta">
        <div className="cortina__marca flex flex-col items-center gap-6 px-6 text-center">
          <Octogono className="size-3.5 text-violeta-claro" />
          <span className="display-m text-papel">{rotulo}</span>
        </div>
      </div>
    </div>
  )
}
