import { AnimatePresence, m } from 'framer-motion'
import { useState } from 'react'
import { CAMINHO_OCTOGONO } from '../componentes/Octogono'
import { Revelar } from '../componentes/Revelar'
import { Rotulo } from '../componentes/Rotulo'
import { valores, valoresIntro, type IdValor } from '../conteudo/institucional'
import { cx } from '../lib/util'

type Retangulo = { x: number; y: number; width: number; height: number; opacity: number }
type Linha = { x1: number; y1: number; x2: number; y2: number; opacity: number }
type Composicao = { r: [Retangulo, Retangulo, Retangulo, Retangulo]; o: { x: number; y: number; scale: number }; l: [Linha, Linha] }

const R = (x: number, y: number, width: number, height: number, opacity = 1): Retangulo => ({ x, y, width, height, opacity })
const L = (x1: number, y1: number, x2: number, y2: number, opacity = 1): Linha => ({ x1, y1, x2, y2, opacity })

/** Cada valor vira um princípio construtivo — as mesmas peças se reorganizam. */
const composicoes: Record<IdValor, Composicao> = {
  comprometimento: {
    r: [R(52, 252, 144, 58), R(204, 252, 144, 58), R(128, 186, 144, 58), R(52, 186, 68, 58)],
    o: { x: 200, y: 130, scale: 0.3 },
    l: [L(30, 318, 370, 318), L(200, 186, 200, 310, 0)],
  },
  qualidade: {
    r: [R(196, 34, 8, 44), R(196, 322, 8, 44), R(34, 196, 44, 8), R(322, 196, 44, 8)],
    o: { x: 200, y: 200, scale: 1.25 },
    l: [L(70, 200, 330, 200), L(200, 70, 200, 330)],
  },
  integridade: {
    r: [R(98, 74, 34, 286), R(48, 360, 304, 8), R(98, 62, 196, 12), R(294, 62, 0, 12, 0)],
    o: { x: 262, y: 286, scale: 0.36 },
    l: [L(262, 74, 262, 266), L(30, 368, 370, 368, 0)],
  },
  respeito: {
    r: [R(56, 66, 134, 134), R(210, 66, 134, 134), R(56, 220, 134, 134), R(210, 220, 134, 134)],
    o: { x: 200, y: 210, scale: 0.24 },
    l: [L(190, 40, 210, 40), L(200, 30, 200, 50, 0)],
  },
  humildade: {
    r: [R(40, 290, 320, 46), R(104, 156, 34, 134), R(262, 156, 34, 134), R(92, 136, 216, 20)],
    o: { x: 200, y: 92, scale: 0.32 },
    l: [L(20, 336, 380, 336), L(40, 350, 360, 350, 0.4)],
  },
}

const mola = { type: 'spring' as const, stiffness: 90, damping: 17, mass: 0.9 }

function Composicao({ id }: { id: IdValor }) {
  const c = composicoes[id]
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      {c.r.map((r, i) => (
        <m.rect
          key={i}
          initial={false}
          animate={{ attrX: r.x, attrY: r.y, width: r.width, height: r.height, opacity: r.opacity }}
          transition={{ ...mola, delay: i * 0.035 }}
          fill={i === 2 && id === 'comprometimento' ? '#7d11f0' : '#0b0c0d'}
          rx={2}
        />
      ))}
      {c.l.map((l, i) => (
        <m.line
          key={`l${i}`}
          initial={false}
          animate={{ x1: l.x1, y1: l.y1, x2: l.x2, y2: l.y2, opacity: l.opacity }}
          transition={mola}
          stroke={id === 'integridade' && i === 0 ? '#7d11f0' : '#0b0c0d'}
          strokeWidth={id === 'qualidade' ? 1 : 1.5}
          strokeDasharray={id === 'qualidade' ? '4 6' : undefined}
        />
      ))}
      <m.g initial={false} animate={{ x: c.o.x, y: c.o.y, scale: c.o.scale }} transition={mola}>
        <path d={CAMINHO_OCTOGONO} transform="translate(-50 -50)" fill="#7d11f0" />
      </m.g>
    </svg>
  )
}

export function Valores() {
  const [ativo, setAtivo] = useState(0)
  const valor = valores[ativo]

  return (
    <section id="valores" className="empilhada z-10 bg-papel text-tinta" data-tema="claro" aria-labelledby="titulo-valores">
      <div className="container-site secao relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Rotulo indice="05" texto="Valores" claro />
          </div>
          <Revelar className="lg:col-span-7">
            <h2 id="titulo-valores" className="display-s max-w-2xl texto-equilibrado">
              {valoresIntro}
            </h2>
          </Revelar>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* Composição — no celular aparece antes da lista */}
          <div className="lg:order-2 lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="malha-clara relative aspect-square overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-tinta/10">
                <div className="absolute inset-[10%]">
                  <Composicao id={valor.id} />
                </div>
                <p className="rotulo absolute left-5 top-5 text-chumbo">Princípio {String(ativo + 1).padStart(2, '0')}</p>
                <AnimatePresence mode="wait" initial={false}>
                  <m.p
                    key={valor.principio}
                    className="rotulo absolute bottom-5 left-5 text-violeta"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                  >
                    {valor.principio}
                  </m.p>
                </AnimatePresence>
              </div>
              <div className="mt-6 hidden min-h-[7.5rem] lg:block" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <m.p
                    key={valor.id}
                    className="texto-corpo max-w-md text-chumbo texto-bonito"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                  >
                    {valor.descricao}
                  </m.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <ol className="lg:order-1 lg:col-span-7" aria-label="Nossos cinco valores">
            {valores.map((v, i) => {
              const selecionado = i === ativo
              return (
                <li key={v.id} className="valor-item border-b border-tinta/10 first:border-t" data-ativo={selecionado ? 'true' : 'false'}>
                  <button
                    type="button"
                    className="flex w-full items-baseline gap-4 py-4 text-left lg:gap-6 lg:py-5"
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setAtivo(i)}
                    onFocus={() => setAtivo(i)}
                    onClick={() => setAtivo(i)}
                    aria-expanded={selecionado}
                    aria-controls={`valor-${v.id}`}
                  >
                    <span className={cx('rotulo w-8 shrink-0 transition-colors', selecionado ? 'text-violeta' : 'text-chumbo')}>0{i + 1}</span>
                    <span className="valor-palavra display-valor block">{v.nome}</span>
                  </button>
                  <div id={`valor-${v.id}`} className={cx('grid transition-[grid-template-rows] duration-700 lg:hidden', selecionado ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                    <p className="overflow-hidden pl-12 text-chumbo">
                      <span className="block pb-6 leading-relaxed">{v.descricao}</span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
