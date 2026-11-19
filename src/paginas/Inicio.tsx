import { IndiceSecoes } from '../componentes/IndiceSecoes'
import { Catalogo } from '../secoes/Catalogo'
import { Contato } from '../secoes/Contato'
import { Hero } from '../secoes/Hero'
import { Manifesto } from '../secoes/Manifesto'
import { Parceiros } from '../secoes/Parceiros'
import { Processo } from '../secoes/Processo'
import { Produtos } from '../secoes/Produtos'
import { QuemSomos } from '../secoes/QuemSomos'
import { Valores } from '../secoes/Valores'

export function Inicio() {
  return (
    <>
      {/* O hero fica preso ao topo enquanto o manifesto desliza por cima dele */}
      <div className="relative">
        <Hero />
        <Manifesto />
      </div>
      <QuemSomos />
      <Produtos />
      <Processo />
      <Valores />
      <Catalogo />
      <Parceiros />
      <Contato />
      <IndiceSecoes />
    </>
  )
}
