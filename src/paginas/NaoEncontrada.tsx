import { Botao } from '../componentes/Botao'
import { Rotulo } from '../componentes/Rotulo'

/** 404 — um piso com uma peça fora do nível. */
export function NaoEncontrada() {
  const pecas = Array.from({ length: 16 }, (_, i) => i)
  return (
    <section className="grao relative flex min-h-[100svh] items-center overflow-hidden bg-tinta pb-20 pt-32 text-papel" data-tema="escuro" aria-labelledby="titulo-404">
      <div className="malha-escura pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-site relative grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Rotulo indice="404" texto="Página não encontrada" />
          <h1 id="titulo-404" className="display-xl mt-8 max-w-[11ch]">
            Esta página saiu do <span className="text-violeta-claro">nível.</span>
          </h1>
          <p className="texto-corpo mt-8 max-w-md text-nevoa">O endereço que você acessou não existe ou mudou de lugar. Vamos colocar tudo no prumo de novo.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Botao para="/" magnetico>
              Voltar ao início
            </Botao>
            <Botao para="/produtos" variante="contorno-escuro">
              Ver produtos
            </Botao>
          </div>
        </div>
        <div className="lg:col-span-5" aria-hidden="true">
          <div className="mx-auto grid w-[min(80vw,420px)] grid-cols-4 gap-1.5 [perspective:900px]">
            {pecas.map((i) => (
              <div
                key={i}
                className="aspect-square rounded-[3px] bg-gradient-to-br from-[#2a2d31] to-[#1b1d20] ring-1 ring-white/5"
                style={i === 9 ? { transform: 'translateZ(40px) rotateX(14deg) rotateZ(-6deg)', background: 'linear-gradient(135deg,#a66cff,#7d11f0)', boxShadow: '0 30px 40px -10px rgba(125,17,240,0.5)' } : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
