import { m, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { Rotulo } from '../componentes/Rotulo'
import { manifesto } from '../conteudo/institucional'
import { useReduzirMovimento } from '../lib/movimento'

function Palavra({ progresso, faixa, destaque, reduzir, children }: { progresso: MotionValue<number>; faixa: [number, number]; destaque: boolean; reduzir: boolean; children: ReactNode }) {
  const opacidade = useTransform(progresso, faixa, [0.13, 1])
  return (
    <m.span className={destaque ? 'text-violeta-claro' : undefined} style={reduzir ? undefined : { opacity: opacidade }}>
      {children}
    </m.span>
  )
}

const ANDARES = 8
const BASE = 742
const ALTURA_ANDAR = 72

function Andar({ progresso, k, reduzir }: { progresso: MotionValue<number>; k: number; reduzir: boolean }) {
  const inicio = 0.04 + (k - 1) * 0.085
  const tracado = useTransform(progresso, [inicio, inicio + 0.1], [0, 1])
  const opacidade = useTransform(progresso, [inicio, inicio + 0.06], [0, 1])
  const y = BASE - k * ALTURA_ANDAR
  const ultimo = k === ANDARES
  return (
    <g>
      <m.path
        d={`M108 ${y}H552`}
        stroke={ultimo ? '#a66cff' : '#4a4f55'}
        strokeWidth={ultimo ? 2 : 1.4}
        fill="none"
        style={reduzir ? undefined : { pathLength: tracado }}
      />
      <m.g style={reduzir ? undefined : { opacity: opacidade }}>
        <path d={`M108 ${y + 9}H552`} stroke="#33373b" strokeWidth="1" />
        <path d={`M22 ${y}h44`} stroke="#5d6268" strokeWidth="1" />
        <path d={`M66 ${y}l-7 -9h14z`} fill={ultimo ? '#a66cff' : '#5d6268'} />
        <text x="22" y={y - 8} fill={ultimo ? '#a66cff' : '#7d8288'} fontSize="11" fontFamily="Plex Mono Codali, monospace" letterSpacing="1">
          +{(k * 3).toFixed(2).replace('.', ',')}
        </text>
      </m.g>
    </g>
  )
}

function DesenhoEdificio({ progresso, reduzir }: { progresso: MotionValue<number>; reduzir: boolean }) {
  const pilares = useTransform(progresso, [0.02, 0.72], [0, 1])
  const gancho = useTransform(progresso, [0, 0.8], [690, 150])
  const cabo = useTransform(gancho, (v) => `M262 92V${v - 18}`)
  const cotaTopo = useTransform(progresso, [0.02, 0.72], [BASE, BASE - ANDARES * ALTURA_ANDAR])
  const cota = useTransform(cotaTopo, (v) => `M578 ${BASE}V${v}`)
  return (
    <svg viewBox="0 0 600 800" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* terreno */}
      <path d="M8 742H592" stroke="#5d6268" strokeWidth="1.4" />
      {Array.from({ length: 30 }, (_, i) => (
        <path key={i} d={`M${14 + i * 19.5} 750l-10 12`} stroke="#33373b" strokeWidth="1" />
      ))}
      {/* fundação */}
      <rect x="100" y="742" width="460" height="22" fill="none" stroke="#33373b" strokeDasharray="4 4" />
      {/* pilares */}
      {[120, 240, 360, 480, 540].map((x) => (
        <m.path
          key={x}
          d={`M${x} ${BASE}V${BASE - ANDARES * ALTURA_ANDAR}`}
          stroke="#3f4448"
          strokeWidth="1.2"
          fill="none"
          style={reduzir ? undefined : { pathLength: pilares }}
        />
      ))}
      {/* contraventamento */}
      <m.path
        d={`M480 ${BASE}L540 ${BASE - 72}M540 ${BASE - 72}L480 ${BASE - 144}M480 ${BASE - 144}L540 ${BASE - 216}M480 ${BASE - 216}L540 ${BASE - 288}`}
        stroke="#33373b"
        strokeWidth="1"
        fill="none"
        style={reduzir ? undefined : { pathLength: pilares }}
      />
      {Array.from({ length: ANDARES }, (_, i) => (
        <Andar key={i} k={i + 1} progresso={progresso} reduzir={reduzir} />
      ))}
      {/* grua */}
      <g stroke="#3a3e42" strokeWidth="1.1" fill="none">
        <path d="M430 742V60M446 742V60" />
        {Array.from({ length: 17 }, (_, i) => (
          <path key={i} d={`M430 ${742 - i * 40}L446 ${702 - i * 40}`} />
        ))}
        <path d="M200 76H590M200 92H590M446 60L520 76M430 60L360 76" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`j${i}`} d={`M${208 + i * 32} 76l16 16`} />
        ))}
        <rect x="560" y="92" width="26" height="24" fill="#16181a" />
      </g>
      <m.path d={cabo} stroke="#5d6268" strokeWidth="1" fill="none" />
      <m.g style={reduzir ? undefined : { y: gancho }}>
        <rect x="222" y="-16" width="80" height="10" fill="none" stroke="#a66cff" strokeWidth="1.5" />
        <path d="M262 -18l-30 -12M262 -18l30 -12" stroke="#5d6268" strokeWidth="1" />
      </m.g>
      {/* cota vertical */}
      <m.path d={cota} stroke="#a66cff" strokeWidth="1" fill="none" />
      <path d={`M572 ${BASE}h12`} stroke="#a66cff" strokeWidth="1" />
    </svg>
  )
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const reduzir = useReduzirMovimento()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const total = manifesto.frase.length
  const inicio = 0.04
  const fim = 0.66
  const passo = (fim - inicio) / total
  const complementoOpacidade = useTransform(scrollYProgress, [0.68, 0.82], [0, 1])
  const complementoY = useTransform(scrollYProgress, [0.68, 0.82], [24, 0])

  return (
    <section
      id="manifesto"
      ref={ref}
      className="grao relative z-10 -mt-px rounded-t-[1.75rem] bg-tinta text-papel shadow-[0_-40px_80px_rgba(0,0,0,0.55)] lg:rounded-t-[2.5rem]"
      style={{ height: reduzir ? 'auto' : '270vh' }}
      data-tema="escuro"
      aria-labelledby="titulo-manifesto"
    >
      <div className={reduzir ? 'relative py-32' : 'sticky top-0 flex h-[100svh] items-center overflow-hidden'}>
        <div className="malha-escura pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-[6%] right-[-18%] w-[110%] opacity-20 sm:right-[-6%] sm:w-[70%] lg:right-[2%] lg:w-[44%] lg:opacity-100">
          <DesenhoEdificio progresso={scrollYProgress} reduzir={reduzir} />
        </div>
        <div className="container-site relative">
          <Rotulo indice="01" texto="Manifesto" />
          <h2 id="titulo-manifesto" className="display-manifesto mt-8 max-w-[15ch] sm:mt-10 lg:max-w-[54%]">
            {manifesto.frase.map((palavra, i) => (
              <span key={`${palavra}-${i}`}>
                <Palavra
                  progresso={scrollYProgress}
                  faixa={[inicio + i * passo, inicio + (i + 1) * passo]}
                  destaque={manifesto.destaques.includes(palavra)}
                  reduzir={reduzir}
                >
                  {palavra}
                </Palavra>{' '}
              </span>
            ))}
          </h2>
          <m.p
            className="texto-corpo mt-10 max-w-xl text-nevoa texto-bonito lg:mt-12 lg:max-w-[46%]"
            style={reduzir ? undefined : { opacity: complementoOpacidade, y: complementoY }}
          >
            {manifesto.complemento}
          </m.p>
        </div>
      </div>
    </section>
  )
}
