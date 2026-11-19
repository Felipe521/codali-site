import { m, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { IconeSeta } from '../componentes/Icones'
import { Rotulo } from '../componentes/Rotulo'
import { etapasProcesso } from '../conteudo/processo'
import { AFIRMACAO_EMBALAGEM, espacadores } from '../conteudo/produtos'
import { useReduzirMovimento } from '../lib/movimento'
import { Link } from '../lib/roteador'
import { cx } from '../lib/util'

/* Geometria do corte (unidades do viewBox 1000 × 560; juntas exageradas para leitura) */
const TOPO = 372
const BASE_PECA = 398
const ESQ = 64
const DIR = 936
const MEIO = 500
const DESNIVEL = 14
const JUNTA_DESENHO: Record<string, number> = { '1,0 mm': 10, '1,5 mm': 15, '2,0 mm': 20 }

const mono = { fontFamily: 'Plex Mono Codali, monospace', fontSize: 12, letterSpacing: 1.4 }

function useFaixa(p: MotionValue<number>, entrada: number[], saida: number[]) {
  return useTransform(p, entrada, saida, { clamp: true })
}

function Corte({ p, junta, cor }: { p: MotionValue<number>; junta: number; cor: string }) {
  const j = useSpring(junta, { stiffness: 140, damping: 22 })
  useEffect(() => {
    j.set(junta)
  }, [junta, j])

  // larguras/posições dependentes da junta
  const larguraEsq = useTransform(j, (v) => MEIO - v / 2 - ESQ)
  const inicioDir = useTransform(j, (v) => MEIO + v / 2)
  const larguraDir = useTransform(j, (v) => DIR - (MEIO + v / 2))
  const xJunta = useTransform(j, (v) => MEIO - v / 2)
  const cotaEsq = useTransform(j, (v) => `M${MEIO - v / 2} 300V${TOPO - 4}`)
  const cotaDir = useTransform(j, (v) => `M${MEIO + v / 2} 300V${TOPO - 4}`)
  const cotaLinha = useTransform(j, (v) => `M${MEIO - v / 2 - 26} 300H${MEIO + v / 2 + 26}`)
  const setaEsq = useTransform(j, (v) => `M${MEIO - v / 2} 300l-7 -4v8z`)
  const setaDir = useTransform(j, (v) => `M${MEIO + v / 2} 300l7 -4v8z`)

  // Etapa 1 — preparação
  const desempX = useFaixa(p, [0.02, 0.2], [0, 860])
  const desempOpac = useFaixa(p, [0.01, 0.04, 0.19, 0.23], [0, 1, 1, 0])
  const argamassaLargura = useFaixa(p, [0.02, 0.2], [0, DIR - ESQ + 40])
  const rotulosBase = useFaixa(p, [0.06, 0.12], [0, 1])
  const dentes = useFaixa(p, [0.36, 0.42], [1, 0])
  const argamassaLisa = useFaixa(p, [0.36, 0.42], [0, 1])

  // Etapa 2 — precisão
  const clipeOpac = useFaixa(p, [0.25, 0.29], [0, 1])
  const clipeY = useFaixa(p, [0.25, 0.3], [-60, 0])
  const pecaEsqY = useFaixa(p, [0.29, 0.37], [-130, 0])
  const pecaDirY = useFaixa(p, [0.31, 0.4, 0.6, 0.7], [-130, -DESNIVEL, -DESNIVEL, 0])
  const pecasOpac = useFaixa(p, [0.29, 0.33], [0, 1])
  const cotaJunta = useFaixa(p, [0.41, 0.45], [0, 1])
  const rotuloEspacador = useFaixa(p, [0.33, 0.37], [0, 1])
  const desnivelOpac = useFaixa(p, [0.43, 0.47, 0.6, 0.64], [0, 1, 1, 0])

  // Etapa 3 — aplicação
  const cunhaX = useFaixa(p, [0.5, 0.62], [320, 0])
  const cunhaOpac = useFaixa(p, [0.5, 0.53], [0, 1])
  const rotuloCunha = useFaixa(p, [0.58, 0.62], [0, 1])
  const nivelOk = useFaixa(p, [0.68, 0.72], [0, 1])

  // Etapa 4 — resultado
  const removerY = useFaixa(p, [0.76, 0.84], [0, -120])
  const removerRot = useFaixa(p, [0.76, 0.84], [0, -9])
  const removerOpac = useFaixa(p, [0.78, 0.86], [1, 0])
  const rotulosEtapa3 = useFaixa(p, [0.74, 0.78], [1, 0])
  const rejunte = useFaixa(p, [0.84, 0.9], [0, BASE_PECA - TOPO])
  const rejunteY = useTransform(rejunte, (v) => BASE_PECA - v)
  const laser = useFaixa(p, [0.88, 0.97], [0, DIR - ESQ])
  const resultado = useFaixa(p, [0.92, 0.96], [0, 1])

  return (
    <svg viewBox="20 196 960 350" className="h-auto w-full" role="img" aria-label="Corte esquemático do assentamento de revestimento com o sistema de nivelamento SLIM">
      <defs>
        <pattern id="hachura" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V12" stroke="#4a4f55" strokeWidth="1.2" />
        </pattern>
        <linearGradient id="peca-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f2ee" />
          <stop offset="100%" stopColor="#d9d5ce" />
        </linearGradient>
        <filter id="laser-brilho" x="-10%" y="-400%" width="120%" height="900%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <clipPath id="clip-argamassa">
          <m.rect x={ESQ - 20} y={380} height={50} width={argamassaLargura} />
        </clipPath>
      </defs>

      {/* contrapiso */}
      <rect x={ESQ - 24} y={420} width={DIR - ESQ + 48} height={92} fill="url(#hachura)" />
      <path d={`M${ESQ - 24} 420H${DIR + 24}`} stroke="#6b7076" strokeWidth="1.5" />
      <m.text x={ESQ - 20} y={538} fill="#8d9298" style={{ ...mono, opacity: rotulosBase }}>
        CONTRAPISO
      </m.text>

      {/* argamassa: primeiro com os sulcos da desempenadeira, depois comprimida */}
      <g clipPath="url(#clip-argamassa)">
        <m.path
          style={{ opacity: dentes }}
          fill="#7a7f86"
          d={`M${ESQ - 20} 420V404${Array.from({ length: 58 }, (_, i) => `H${ESQ - 20 + i * 16 + 6}L${ESQ - 20 + i * 16 + 8} 392H${ESQ - 20 + i * 16 + 14}L${ESQ - 20 + i * 16 + 16} 404`).join('')}V420Z`}
        />
        <m.rect style={{ opacity: argamassaLisa }} x={ESQ - 20} y={BASE_PECA} width={DIR - ESQ + 40} height={420 - BASE_PECA} fill="#7a7f86" />
      </g>
      <m.g style={{ opacity: rotulosBase }}>
        <path d="M770 412L812 452H900" stroke="#8d9298" fill="none" />
        <text x={812} y={470} fill="#c9c7c1" style={mono}>
          ARGAMASSA COLANTE
        </text>
      </m.g>

      {/* desempenadeira dentada */}
      <m.g style={{ x: desempX, opacity: desempOpac }}>
        <path d={`M${ESQ - 10} 388h120v-8h-120z`} fill="#c9c7c1" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M${ESQ - 6 + i * 15} 388h8l-4 7z`} fill="#c9c7c1" />
        ))}
        <path d={`M${ESQ + 30} 380v-26h40v26`} fill="none" stroke="#c9c7c1" strokeWidth="6" strokeLinejoin="round" />
      </m.g>

      {/* espaçador: base sob as peças + haste na junta */}
      <m.g style={{ opacity: clipeOpac, y: clipeY }}>
        <rect x={MEIO - 58} y={BASE_PECA} width={116} height={6} rx={2} style={{ fill: cor, transition: 'fill .6s' }} />
        <m.rect x={xJunta} y={TOPO} width={j} height={BASE_PECA - TOPO} style={{ fill: cor, transition: 'fill .6s' }} />
      </m.g>

      {/* peças de revestimento */}
      <m.g style={{ opacity: pecasOpac }}>
        <m.rect x={ESQ} y={TOPO} width={larguraEsq} height={BASE_PECA - TOPO} fill="url(#peca-grad)" style={{ y: pecaEsqY }} />
        <m.rect x={inicioDir} y={TOPO} width={larguraDir} height={BASE_PECA - TOPO} fill="url(#peca-grad)" style={{ y: pecaDirY }} />
      </m.g>

      {/* rejunte */}
      <m.rect x={xJunta} y={rejunteY} width={j} height={rejunte} fill="#9a958c" />

      {/* parte removível: cabeça do espaçador + cunha */}
      <m.g style={{ y: removerY, rotate: removerRot, opacity: removerOpac }}>
        <m.g style={{ opacity: clipeOpac, y: clipeY }}>
          <m.rect x={xJunta} y={334} width={j} height={TOPO - 334} style={{ fill: cor, transition: 'fill .6s' }} />
          <path
            d="M474 372V332q0-6 6-6h40q6 0 6 6v40h-10v-28h-32v28z"
            style={{ fill: cor, transition: 'fill .6s' }}
          />
        </m.g>
        <m.g style={{ x: cunhaX, opacity: cunhaOpac }}>
          <path d="M420 372L660 372L660 320L420 366Z" fill="#a0a6a2" stroke="#d7dbd8" strokeWidth="1" />
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${436 + i * 16} ${365 - (i * 16 + 16) * 0.19}l6 -3`} stroke="#6b7076" strokeWidth="1.2" />
          ))}
        </m.g>
      </m.g>

      {/* cota da junta */}
      <m.g style={{ opacity: cotaJunta }}>
        <m.path d={cotaEsq} stroke="#a66cff" strokeDasharray="3 3" />
        <m.path d={cotaDir} stroke="#a66cff" strokeDasharray="3 3" />
        <m.path d={cotaLinha} stroke="#a66cff" />
        <m.path d={setaEsq} fill="#a66cff" />
        <m.path d={setaDir} fill="#a66cff" />
      </m.g>

      {/* desnível entre as peças */}
      <m.g style={{ opacity: desnivelOpac }}>
        <path d={`M${MEIO + 30} ${TOPO}H700`} stroke="#ff8a6b" strokeDasharray="4 4" />
        <path d={`M690 ${TOPO - DESNIVEL}V${TOPO}`} stroke="#ff8a6b" strokeWidth="2" />
        <text x={706} y={TOPO - 4} fill="#ff8a6b" style={mono}>
          DESNÍVEL
        </text>
      </m.g>

      {/* rótulos de peças */}
      <m.g style={{ opacity: rotuloEspacador }}>
        <m.g style={{ opacity: rotulosEtapa3 }}>
          <path d="M470 344L380 270H260" stroke="#8d9298" fill="none" />
          <text x={128} y={266} fill="#c9c7c1" style={mono}>
            ESPAÇADOR SLIM
          </text>
        </m.g>
      </m.g>
      <m.g style={{ opacity: rotuloCunha }}>
        <m.g style={{ opacity: rotulosEtapa3 }}>
          <path d="M640 330L700 250H790" stroke="#8d9298" fill="none" />
          <text x={796} y={254} fill="#c9c7c1" style={mono}>
            CUNHA SLIM
          </text>
        </m.g>
      </m.g>
      <m.g style={{ opacity: nivelOk }}>
        <m.g style={{ opacity: rotulosEtapa3 }}>
          <text x={706} y={TOPO - 26} fill="#a66cff" style={mono}>
            DESNÍVEL 0,0
          </text>
          <path d={`M690 ${TOPO - 30}l6 6 12 -12`} stroke="#a66cff" strokeWidth="2" fill="none" />
        </m.g>
      </m.g>

      {/* resultado */}
      <m.rect x={ESQ} y={TOPO - 2} width={laser} height={3} fill="#c9a8ff" />
      <m.rect x={ESQ} y={TOPO - 4} width={laser} height={7} fill="#7d11f0" filter="url(#laser-brilho)" opacity="0.9" />
      <m.g style={{ opacity: resultado }}>
        <text x={ESQ} y={TOPO - 46} fill="#ffffff" style={{ ...mono, fontSize: 13 }}>
          SUPERFÍCIE NIVELADA · JUNTAS UNIFORMES
        </text>
        <path d={`M${MEIO} ${BASE_PECA + 2}V470H580`} stroke="#8d9298" fill="none" />
        <text x={588} y={474} fill="#c9c7c1" style={mono}>
          REJUNTE
        </text>
      </m.g>
    </svg>
  )
}

export function Processo() {
  const ref = useRef<HTMLElement>(null)
  const reduzir = useReduzirMovimento()
  const [escolha, setEscolha] = useState(1)
  const [etapa, setEtapa] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const reduzirRef = useRef(reduzir)
  useEffect(() => {
    reduzirRef.current = reduzir
  }, [reduzir])
  // Com "reduzir movimento", o desenho salta direto para o estado final de cada etapa.
  const progresso = useTransform(scrollYProgress, (v) =>
    reduzirRef.current ? Math.min(0.999, (Math.floor(v * 4) + 1) / 4 - 0.001) : v,
  )

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const nova = Math.min(3, Math.max(0, Math.floor(v * 4)))
    setEtapa((atual) => (atual === nova ? atual : nova))
  })

  const espacador = espacadores[escolha]
  const juntaDesenho = JUNTA_DESENHO[espacador.junta ?? '1,5 mm']

  return (
    <section
      id="processo"
      ref={ref}
      className="empilhada z-10 bg-noite text-papel"
      style={{ height: '420vh' }}
      data-tema="escuro"
      aria-labelledby="titulo-processo"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden rounded-t-[inherit]">
        <div className="malha-escura pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-site relative grid h-full grid-rows-[auto_1fr] content-center gap-6 py-20 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-10 lg:py-0">
          <div className="lg:col-span-4">
            <Rotulo indice="04" texto="Como funciona" />
            <h2 id="titulo-processo" className="display-m mt-6 max-w-[13ch] lg:mt-8">
              Cada detalhe constrói o resultado.
            </h2>

            <ol className="mt-8 hidden flex-col lg:flex" aria-label="Etapas do assentamento">
              {etapasProcesso.map((e, i) => {
                const ativa = i === etapa
                return (
                  <li key={e.numero} className="relative border-t border-white/10 py-4" aria-current={ativa ? 'step' : undefined}>
                    <span className="absolute left-0 top-[-1px] h-px bg-violeta-claro transition-all duration-700" style={{ width: ativa ? '100%' : i < etapa ? '100%' : '0%', opacity: i < etapa ? 0.35 : 1 }} />
                    <div className={cx('flex items-baseline gap-4 transition-opacity duration-500', ativa ? 'opacity-100' : 'opacity-40')}>
                      <span className="rotulo text-violeta-claro">{e.numero}</span>
                      <div>
                        <p className="text-lg font-semibold">{e.titulo}</p>
                        <div className={cx('grid transition-[grid-template-rows] duration-700', ativa ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                          <p className="overflow-hidden text-[0.95rem] leading-relaxed text-nevoa">
                            <span className="block pt-2">{e.texto}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="flex flex-col justify-center lg:col-span-8">
            <div className="relative rounded-[1.5rem] bg-tinta/70 p-3 ring-1 ring-white/10 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="rotulo text-[0.62rem] text-nevoa">Fig. 02 — Corte esquemático · fora de escala</p>
                <p className="rotulo text-[0.62rem] text-violeta-claro">Etapa {etapasProcesso[etapa].numero}/04</p>
              </div>
              <Corte p={progresso} junta={juntaDesenho} cor={espacador.cor.hex} />
              <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3" role="radiogroup" aria-label="Escolha a junta">
                  <span className="rotulo text-[0.62rem] text-nevoa">Junta</span>
                  {espacadores.map((e, i) => (
                    <button
                      key={e.slug}
                      type="button"
                      role="radio"
                      aria-checked={i === escolha}
                      onClick={() => setEscolha(i)}
                      className={cx(
                        'flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-xs transition-colors duration-300',
                        i === escolha ? 'border-white bg-white text-tinta' : 'border-white/15 text-nevoa hover:border-white/40 hover:text-papel',
                      )}
                    >
                      <span className="size-2 rounded-full" style={{ background: e.cor.hex }} />
                      {e.junta}
                    </button>
                  ))}
                </div>
                <Link para={`/produtos/${espacador.slug}`} className="link-linha inline-flex items-center gap-2 text-sm font-semibold text-papel/85 hover:text-papel">
                  Ver {espacador.nome} <IconeSeta tamanho={14} />
                </Link>
              </div>
            </div>

            {/* texto da etapa no celular */}
            <div className="mt-5 lg:hidden" aria-live="polite">
              <p className="flex items-baseline gap-3">
                <span className="rotulo text-violeta-claro">{etapasProcesso[etapa].numero}</span>
                <span className="text-lg font-semibold">{etapasProcesso[etapa].titulo}</span>
              </p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-nevoa">{etapasProcesso[etapa].texto}</p>
              <div className="mt-4 flex gap-1.5" aria-hidden="true">
                {etapasProcesso.map((e, i) => (
                  <span key={e.numero} className={cx('h-1 flex-1 rounded-full transition-colors duration-500', i <= etapa ? 'bg-violeta-claro' : 'bg-white/15')} />
                ))}
              </div>
            </div>

            <p className="mt-5 hidden text-sm text-nevoa lg:block">
              <span className="text-papel">{AFIRMACAO_EMBALAGEM}</span> — informação impressa nas embalagens da linha SLIM.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
