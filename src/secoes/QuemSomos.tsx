import type { CSSProperties } from 'react'
import { Botao } from '../componentes/Botao'
import { IconeSeta } from '../componentes/Icones'
import { Octogono } from '../componentes/Octogono'
import { Revelar, TextoRevelado } from '../componentes/Revelar'
import { Rotulo } from '../componentes/Rotulo'
import { missao, sobre, visao } from '../conteudo/institucional'
import { useNaVista, usePausarForaDaTela } from '../lib/naVista'
import { Link } from '../lib/roteador'

/* ------------------------------------------------------------------------
   Maquete isométrica: lajes que se encaixam uma sobre a outra,
   coroadas pelo octógono do logotipo — "um mundo em construção".
   ------------------------------------------------------------------------ */
const COS = Math.cos(Math.PI / 6)
const SEN = Math.sin(Math.PI / 6)
const OX = 268
const OY = 418
const LARGURA = 250
const PROFUNDIDADE = 190
const ESPESSURA = 18
const PE_DIREITO = 78
const ANDARES = 4

const ponto = (x: number, y: number, z: number) => `${(OX + (x - y) * COS).toFixed(1)},${(OY + (x + y) * SEN - z).toFixed(1)}`
const poligono = (...pts: Array<[number, number, number]>) => pts.map(([x, y, z]) => ponto(x, y, z)).join(' ')

function caixa(x: number, y: number, z: number, w: number, d: number, h: number) {
  return {
    topo: poligono([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]),
    frente: poligono([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]),
    lado: poligono([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]),
  }
}

const andares = Array.from({ length: ANDARES }, (_, k) => {
  const z = k * PE_DIREITO
  // ordem de trás para a frente (pintura correta na projeção isométrica)
  const pilares = [
    [8, 8],
    [8, PROFUNDIDADE - 22],
    [LARGURA - 22, 8],
    [LARGURA - 22, PROFUNDIDADE - 22],
  ].map(([px, py]) => caixa(px, py, z + ESPESSURA, 14, 14, PE_DIREITO - ESPESSURA))
  return { laje: caixa(0, 0, z, LARGURA, PROFUNDIDADE, ESPESSURA), pilares }
})
const [TOPO_X, TOPO_Y] = ponto(LARGURA / 2, PROFUNDIDADE / 2, ANDARES * PE_DIREITO).split(',').map(Number)

function Maquete({ visivel }: { visivel: boolean }) {
  return (
    <svg viewBox="0 0 600 640" className="h-auto w-full overflow-visible" aria-hidden="true">
      {/* malha do terreno */}
      <g stroke="#25282a" strokeOpacity="0.12" strokeWidth="1">
        {Array.from({ length: 9 }, (_, i) => {
          const t = -80 + i * 50
          const [a1, b1] = ponto(t, -80, 0).split(',')
          const [a2, b2] = ponto(t, 320, 0).split(',')
          const [c1, d1] = ponto(-80, t, 0).split(',')
          const [c2, d2] = ponto(370, t, 0).split(',')
          return (
            <g key={i}>
              <line x1={a1} y1={b1} x2={a2} y2={b2} />
              <line x1={c1} y1={d1} x2={c2} y2={d2} />
            </g>
          )
        })}
      </g>
      {/* sombra no chão */}
      <defs>
        <radialGradient id="maquete-sombra" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(11 12 13 / 0.16)" />
          <stop offset="100%" stopColor="rgb(11 12 13 / 0)" />
        </radialGradient>
      </defs>
      <polygon points={poligono([-30, -30, 0], [LARGURA + 40, -30, 0], [LARGURA + 40, PROFUNDIDADE + 40, 0], [-30, PROFUNDIDADE + 40, 0])} fill="url(#maquete-sombra)" />
      {andares.map((andar, k) => (
        <g
          key={k}
          className="maquete-andar"
          style={
            {
              '--atraso': `${0.15 + k * 0.16}s`,
              opacity: visivel ? 1 : 0,
              transform: visivel ? 'none' : 'translateY(-90px)',
            } as CSSProperties
          }
        >
          <polygon points={andar.laje.topo} fill="#ffffff" stroke="#25282a" strokeOpacity="0.35" strokeWidth="1" />
          <polygon points={andar.laje.frente} fill="#e4e2dc" stroke="#25282a" strokeOpacity="0.35" strokeWidth="1" />
          <polygon points={andar.laje.lado} fill="#cfccc5" stroke="#25282a" strokeOpacity="0.35" strokeWidth="1" />
          {k < ANDARES - 1 &&
            andar.pilares.map((p, i) => (
              <g key={i}>
                <polygon points={p.frente} fill="#d6d3cc" stroke="#25282a" strokeOpacity="0.18" />
                <polygon points={p.lado} fill="#bdb9b1" stroke="#25282a" strokeOpacity="0.18" />
              </g>
            ))}
        </g>
      ))}
      {/* octógono-farol no topo */}
      <g
        className="maquete-andar"
        style={
          {
            '--atraso': `${0.15 + ANDARES * 0.16 + 0.1}s`,
            opacity: visivel ? 1 : 0,
            transform: visivel ? 'none' : 'translateY(-60px)',
          } as CSSProperties
        }
      >
        <path d={`M${TOPO_X} ${TOPO_Y - 6}V${TOPO_Y - 70}`} stroke="#7d11f0" strokeWidth="1.2" strokeDasharray="3 4" />
        <g transform={`translate(${TOPO_X - 17} ${TOPO_Y - 112})`}>
          <circle cx="17" cy="17" r="40" fill="#7d11f0" opacity="0.1" className="respirar" style={{ transformOrigin: '17px 17px' }} />
          <circle cx="17" cy="17" r="26" fill="#7d11f0" opacity="0.14" />
          <path d="M9.9 0h14.2L34 9.9v14.2L24.1 34H9.9L0 24.1V9.9z" fill="#7d11f0" />
        </g>
      </g>
    </svg>
  )
}

export function QuemSomos() {
  const [refMaquete, maqueteVisivel] = useNaVista<HTMLDivElement>({ limiar: 0.25 })
  const refSecao = usePausarForaDaTela<HTMLElement>()

  return (
    <section id="quem-somos" ref={refSecao} className="empilhada z-10 bg-gesso text-tinta" data-tema="claro" aria-labelledby="titulo-quem-somos">
      <div className="malha-clara pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-site secao relative">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-6">
            <Rotulo indice="02" texto="Quem somos" claro />
            <TextoRevelado
              id="titulo-quem-somos"
              texto={sobre.titulo}
              className="display-l mt-10 max-w-[13ch]"
              destaques={['construção.']}
            />
            <Revelar atraso={0.15}>
              <p className="texto-corpo mt-10 max-w-[34rem] text-chumbo texto-bonito">{sobre.texto}</p>
            </Revelar>
            <Revelar atraso={0.25} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Botao para="/#produtos" variante="escuro" direcao="baixo" magnetico>
                Conheça a linha SLIM
              </Botao>
              <Link para="/#parceiros" className="link-linha inline-flex items-center gap-2 font-semibold text-chumbo hover:text-tinta">
                Seja um parceiro <IconeSeta tamanho={14} />
              </Link>
            </Revelar>
          </div>

          <div ref={refMaquete} className="relative lg:col-span-6 lg:pl-6 xl:pl-14">
            <Maquete visivel={maqueteVisivel} />
            <p className="rotulo mt-2 flex items-center justify-between text-chumbo">
              <span>Fig. 01 — Estrutura Codali</span>
              <span>Esc. 1:∞</span>
            </p>
          </div>
        </div>

        {/* Missão e visão */}
        <div className="mt-28 grid gap-5 lg:mt-40 lg:grid-cols-12 lg:gap-6">
          <Revelar className="relative overflow-hidden rounded-[1.75rem] bg-violeta p-8 text-white sm:p-12 lg:col-span-7 lg:p-16">
            <Octogono contorno className="pointer-events-none absolute -right-24 -top-24 size-[26rem] text-white/15" />
            <Octogono contorno className="pointer-events-none absolute -right-8 -top-8 size-[14rem] text-white/10" />
            <p className="rotulo relative flex items-center gap-3 text-violeta-suave">
              <span>A</span>
              <span className="h-px w-8 bg-current opacity-50" />
              {missao.rotulo}
            </p>
            <p className="display-m relative mt-10 max-w-[18ch] texto-equilibrado">{missao.titulo}</p>
            <p className="texto-corpo relative mt-8 max-w-xl text-white/80">{missao.texto}</p>
          </Revelar>
          <Revelar atraso={0.12} className="relative overflow-hidden rounded-[1.75rem] bg-tinta p-8 text-papel sm:p-12 lg:col-span-5 lg:mt-24 lg:p-14">
            <div className="malha-escura pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            <p className="rotulo relative flex items-center gap-3 text-nevoa">
              <span className="text-violeta-claro">B</span>
              <span className="h-px w-8 bg-current opacity-50" />
              {visao.rotulo}
            </p>
            <p className="display-s relative mt-10 max-w-[20ch] texto-equilibrado">{visao.titulo}</p>
            <p className="relative mt-6 leading-relaxed text-nevoa texto-bonito">{visao.texto}</p>
          </Revelar>
        </div>
      </div>
    </section>
  )
}
