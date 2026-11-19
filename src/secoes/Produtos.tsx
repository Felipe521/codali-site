import { AnimatePresence, m, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { Botao } from '../componentes/Botao'
import { IconeSeta, IconeWhatsApp } from '../componentes/Icones'
import { ImagemProduto } from '../componentes/ImagemProduto'
import { Octogono } from '../componentes/Octogono'
import { Revelar, TextoRevelado } from '../componentes/Revelar'
import { Rotulo } from '../componentes/Rotulo'
import { AFIRMACAO_EMBALAGEM, FONTE_AFIRMACAO, formatarEan, produtos } from '../conteudo/produtos'
import { usePonteiroFino, useReduzirMovimento } from '../lib/movimento'
import { usePausarForaDaTela } from '../lib/naVista'
import { Link } from '../lib/roteador'
import { cx } from '../lib/util'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'

const ease = [0.16, 1, 0.3, 1] as const

export function Produtos() {
  const [indice, setIndice] = useState(0)
  const [direcao, setDirecao] = useState(1)
  const reduzir = useReduzirMovimento()
  const fino = usePonteiroFino()
  const produto = produtos[indice]
  const abas = useRef<Array<HTMLButtonElement | null>>([])
  const inicioArraste = useRef<number | null>(null)
  const refSecao = usePausarForaDaTela<HTMLElement>()

  const ir = (novo: number, focar = false) => {
    const total = produtos.length
    const alvo = (novo + total) % total
    if (alvo === indice) return
    setDirecao(novo > indice || (indice === total - 1 && alvo === 0) ? 1 : -1)
    setIndice(alvo)
    if (focar) abas.current[alvo]?.focus()
  }

  const aoTeclar = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      ir(indice + 1, true)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      ir(indice - 1, true)
    } else if (e.key === 'Home') {
      e.preventDefault()
      ir(0, true)
    } else if (e.key === 'End') {
      e.preventDefault()
      ir(produtos.length - 1, true)
    }
  }

  // Inclinação 3D da embalagem acompanhando o mouse
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 120, damping: 14 })
  const sry = useSpring(ry, { stiffness: 120, damping: 14 })
  const inclinar = (e: PointerEvent<HTMLDivElement>) => {
    if (!fino || reduzir || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 16)
    rx.set(py * -12)
  }
  const soltar = () => {
    rx.set(0)
    ry.set(0)
  }

  const comecarArraste = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    inicioArraste.current = e.clientX
  }
  const terminarArraste = (e: PointerEvent<HTMLDivElement>) => {
    if (inicioArraste.current === null) return
    const dx = e.clientX - inicioArraste.current
    inicioArraste.current = null
    if (Math.abs(dx) > 45) ir(indice + (dx < 0 ? 1 : -1))
  }

  const deslocamento = reduzir ? 0 : 140

  return (
    <section
      id="produtos"
      ref={refSecao}
      className="vitrine empilhada adiar-render z-10 overflow-hidden text-tinta"
      data-tema="claro"
      style={{ '--cor-produto': produto.cor.hex, '--brilho-produto': produto.cor.brilho } as CSSProperties}
      aria-labelledby="titulo-produtos"
    >
      <div className="malha-clara pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-site secao relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Rotulo indice="03" texto="Produtos em destaque" claro />
            <TextoRevelado id="titulo-produtos" texto="Linha SLIM." className="display-xl mt-8" destaques={['SLIM.']} />
          </div>
          <Revelar atraso={0.1} className="max-w-md">
            <p className="texto-corpo text-chumbo texto-bonito">
              Espaçadores niveladores e cunhas para assentamento de revestimentos: juntas uniformes e peças no mesmo plano, do início ao acabamento.
            </p>
            <Link para="/produtos" className="link-linha mt-5 inline-flex items-center gap-2 font-semibold">
              Ver catálogo completo <IconeSeta tamanho={14} />
            </Link>
          </Revelar>
        </div>

        <div className="mt-14 grid items-center gap-y-10 lg:mt-20 lg:grid-cols-12 lg:gap-x-8">
          {/* Palco */}
          <div
            className="vitrine__palco relative order-1 select-none lg:order-2 lg:col-span-5"
            onPointerMove={inclinar}
            onPointerLeave={soltar}
            onPointerDown={comecarArraste}
            onPointerUp={terminarArraste}
            onPointerCancel={() => (inicioArraste.current = null)}
            data-cursor="Arraste"
            style={{ touchAction: 'pan-y' }}
          >
            <div className="vitrine__luz" aria-hidden="true" />
            <AnimatePresence initial={false} custom={direcao}>
              <m.span
                key={`n-${produto.slug}`}
                className={cx('vitrine__numeral', !produto.junta && 'vitrine__numeral--palavra')}
                aria-hidden="true"
                initial={{ y: '18%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1, transition: { duration: 0.9, ease } }}
                exit={{ y: '-14%', opacity: 0, transition: { duration: 0.45 } }}
              >
                {produto.destaque}
              </m.span>
            </AnimatePresence>
            <div className="vitrine__sombra" aria-hidden="true" />
            <m.div className="absolute inset-0" style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}>
              <AnimatePresence initial={false} custom={direcao}>
                <m.div
                  key={produto.slug}
                  className="absolute inset-0 flex items-center justify-center"
                  custom={direcao}
                  initial={{ x: direcao * deslocamento, opacity: 0, rotate: reduzir ? 0 : direcao * 6, scale: 0.94 }}
                  animate={{ x: 0, opacity: 1, rotate: 0, scale: 1, transition: { duration: 1, ease } }}
                  exit={{ x: -direcao * deslocamento, opacity: 0, rotate: reduzir ? 0 : -direcao * 5, scale: 0.94, transition: { duration: 0.55, ease: [0.4, 0, 1, 1] } }}
                >
                  <div className="vitrine__flutuar h-[86%] w-auto">
                    <ImagemProduto
                      produto={produto}
                      tamanhos="(min-width: 1024px) 30vw, 70vw"
                      className="h-full w-auto object-contain drop-shadow-[0_40px_45px_rgba(11,12,13,0.28)]"
                    />
                  </div>
                </m.div>
              </AnimatePresence>
            </m.div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-1 lg:hidden" aria-hidden="true">
              <span className="rotulo text-chumbo">← arraste →</span>
            </div>
          </div>

          {/* Informações */}
          <div
            id="painel-produto"
            role="tabpanel"
            aria-labelledby={`aba-${produto.slug}`}
            className="order-3 lg:order-1 lg:col-span-4"
            aria-live="polite"
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={produto.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              >
                <p className="rotulo flex items-center gap-3 text-chumbo">
                  <span className="inline-block size-2.5 rounded-full" style={{ background: produto.cor.hex }} />
                  {produto.tipo}
                </p>
                <h3 className="display-m mt-5 max-w-[12ch]">{produto.nome}</h3>
                <p className="mt-6 max-w-md leading-relaxed text-chumbo texto-bonito">{produto.descricao}</p>

                <dl className="mt-8 grid grid-cols-2 border-t border-tinta/12 text-sm">
                  {[
                    ['Linha', produto.linha],
                    ['Junta', produto.junta ?? 'Para espaçadores SLIM'],
                    ['Embalagem', produto.embalagem],
                    ['Cor das peças', produto.cor.nome],
                  ].map(([termo, valor]) => (
                    <div key={termo} className="border-b border-tinta/12 py-3.5 pr-3">
                      <dt className="rotulo text-[0.65rem] text-chumbo">{termo}</dt>
                      <dd className="mt-1 font-semibold">{valor}</dd>
                    </div>
                  ))}
                  <div className="col-span-2 border-b border-tinta/12 py-3.5">
                    <dt className="rotulo text-[0.65rem] text-chumbo">Código de barras (EAN-13)</dt>
                    <dd className="mt-1 font-mono text-[0.95rem] tracking-wider">{formatarEan(produto.ean)}</dd>
                  </div>
                </dl>

                <p className="mt-6 flex items-start gap-3 text-sm">
                  <Octogono className="mt-1 size-2.5 shrink-0" />
                  <span>
                    <strong className="font-semibold">{AFIRMACAO_EMBALAGEM}.</strong>{' '}
                    <span className="text-chumbo">{FONTE_AFIRMACAO}</span>
                  </span>
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Botao href={linkWhatsApp(mensagensWhatsApp.produto(produto.nome))} icone={<IconeWhatsApp tamanho={16} />} variante="escuro" magnetico>
                    Consultar no WhatsApp
                  </Botao>
                  <Botao para={`/produtos/${produto.slug}`} variante="contorno-claro">
                    Ficha do produto
                  </Botao>
                </div>
              </m.div>
            </AnimatePresence>
          </div>

          {/* Seletor */}
          <div className="order-2 lg:order-3 lg:col-span-3">
            <div role="tablist" aria-label="Produtos da linha SLIM" aria-orientation="vertical" className="sem-barra -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
              {produtos.map((p, i) => {
                const selecionado = i === indice
                return (
                  <button
                    key={p.slug}
                    ref={(el) => {
                      abas.current[i] = el
                    }}
                    id={`aba-${p.slug}`}
                    type="button"
                    role="tab"
                    aria-selected={selecionado}
                    aria-controls="painel-produto"
                    tabIndex={selecionado ? 0 : -1}
                    onClick={() => ir(i)}
                    onKeyDown={aoTeclar}
                    className={cx(
                      'group relative flex shrink-0 items-center gap-4 rounded-full border px-4 py-2.5 text-left transition-colors duration-500 lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-5',
                      selecionado ? 'border-tinta bg-tinta text-white lg:bg-transparent lg:text-tinta' : 'border-tinta/15 text-chumbo hover:text-tinta lg:border-tinta/12',
                    )}
                  >
                    <span className="hidden font-mono text-xs lg:inline">0{i + 1}</span>
                    <span className="size-3 shrink-0 rounded-full ring-2 ring-white/60 lg:ring-0" style={{ background: p.cor.hex }} />
                    <span className="whitespace-nowrap font-semibold lg:text-lg">{p.nomeCurto}</span>
                    <span className="hidden flex-1 text-sm text-chumbo lg:block">{p.junta ? 'Espaçador' : 'Nivelamento'}</span>
                    <span
                      className={cx('absolute bottom-[-1px] left-0 hidden h-[2px] origin-left bg-violeta transition-transform duration-700 lg:block', selecionado ? 'scale-x-100' : 'scale-x-0')}
                      aria-hidden="true"
                    />
                  </button>
                )
              })}
            </div>
            <div className="mt-6 hidden items-center justify-between lg:flex">
              <span className="font-mono text-sm text-chumbo">
                <span className="text-tinta">{String(indice + 1).padStart(2, '0')}</span> / {String(produtos.length).padStart(2, '0')}
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={() => ir(indice - 1)} className="grid size-12 place-items-center rounded-full border border-tinta/15 transition-colors hover:bg-tinta hover:text-white" aria-label="Produto anterior">
                  <IconeSeta direcao="esquerda" tamanho={16} />
                </button>
                <button type="button" onClick={() => ir(indice + 1)} className="grid size-12 place-items-center rounded-full border border-tinta/15 transition-colors hover:bg-tinta hover:text-white" aria-label="Próximo produto">
                  <IconeSeta direcao="direita" tamanho={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
