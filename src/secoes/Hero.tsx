import { m, useMotionTemplate, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Botao } from '../componentes/Botao'
import { CAMINHO_OCTOGONO, Octogono } from '../componentes/Octogono'
import { usePonteiroFino, useReduzirMovimento } from '../lib/movimento'
import { useRolagem } from '../lib/rolagem'
import { aleatorioComSemente } from '../lib/util'

const N = 8

/** Momento (s) em que o feixe de laser passa por uma posição vertical do piso (0–1). */
function tempoDoLaser(y: number) {
  const inicio = 0.45
  const duracao = 1.5
  const p = Math.min(1, Math.max(0, (y - 0.22) / (0.84 - 0.22)))
  return inicio + duracao * p
}

const sorteio = aleatorioComSemente(20231)
const pecas = Array.from({ length: N * N }, (_, i) => {
  const c = i % N
  const r = Math.floor(i / N)
  const z = Math.round(14 + sorteio() * 64)
  return {
    c,
    r,
    estilo: {
      '--c': c,
      '--r': r,
      '--z': `${z}px`,
      '--rx': `${((sorteio() - 0.5) * 8).toFixed(2)}deg`,
      '--ry': `${((sorteio() - 0.5) * 8).toFixed(2)}deg`,
      '--l': (sorteio() * 2.6).toFixed(2),
      '--d1': `${(0.1 + r * 0.04 + sorteio() * 0.18).toFixed(3)}s`,
      '--d2': `${(tempoDoLaser((r + 0.5) / N) - 0.12 + sorteio() * 0.06).toFixed(3)}s`,
    } as CSSProperties,
  }
})

const linhasClipes = Array.from({ length: N - 1 }, (_, j) => ({
  y: j + 1,
  atraso: `${(tempoDoLaser((j + 1) / N) + 0.05).toFixed(3)}s`,
}))

const linhasTitulo = ['Grandes construções', 'começam com', 'grandes escolhas.']

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [altura, setAltura] = useState(900)
  const [oculto, setOculto] = useState(false)
  const [assentado, setAssentado] = useState(false)
  const reduzir = useReduzirMovimento()
  const fino = usePonteiroFino()
  const { rolarPara } = useRolagem()

  // Fim da abertura: o piso deixa de ser 3D peça a peça e vira uma camada só (bem mais leve).
  useEffect(() => {
    const t = window.setTimeout(() => setAssentado(true), 2700)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const medir = () => setAltura(ref.current?.offsetHeight || window.innerHeight)
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  // Rolagem: a câmera avança, o título sobe e some, o manifesto cobre a cena.
  const { scrollY } = useScroll()
  const progresso = useTransform(scrollY, [0, altura], [0, 1], { clamp: true })
  const conteudoY = useTransform(progresso, [0, 1], ['0vh', '-18vh'])
  const conteudoOpacidade = useTransform(progresso, [0, 0.5], [1, 0])
  const cameraEscala = useTransform(progresso, [0, 1], [1, 1.24])
  const cameraY = useTransform(progresso, [0, 1], ['0vh', '-7vh'])
  const escurecer = useTransform(progresso, [0.1, 1], [0, 0.88])
  const luzY = useTransform(progresso, [0, 1], ['0vh', '-26vh'])
  const indicadorOpacidade = useTransform(progresso, [0, 0.12], [1, 0])

  useMotionValueEvent(progresso, 'change', (v) => {
    const deveOcultar = v >= 0.999
    setOculto((atual) => (atual === deveOcultar ? atual : deveOcultar))
  })

  // Mouse: a origem da perspectiva acompanha o cursor — paralaxe real em 3D.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 35, damping: 16 })
  const smy = useSpring(my, { stiffness: 35, damping: 16 })
  const origemX = useTransform(smx, (v) => 50 + v * 7)
  const origemY = useTransform(smy, (v) => 62 + v * 5)
  const origem = useMotionTemplate`${origemX}% ${origemY}%`
  const luzX = useTransform(smx, (v) => v * -22)
  const luzMouseY = useTransform(smy, (v) => v * -14)

  const mover = (e: PointerEvent<HTMLElement>) => {
    if (!fino || reduzir || e.pointerType !== 'mouse') return
    mx.set((e.clientX / window.innerWidth) * 2 - 1)
    my.set((e.clientY / window.innerHeight) * 2 - 1)
  }

  const animar = !reduzir

  return (
    <section
      id="inicio"
      ref={ref}
      className="hero"
      data-tema="escuro"
      data-oculto={oculto ? 'true' : 'false'}
      data-assentado={assentado ? 'true' : 'false'}
      aria-labelledby="titulo-hero"
      onPointerMove={mover}
    >
      <div className="hero__ceu" aria-hidden="true" />

      <m.div className="hero__camera" aria-hidden="true" style={animar ? { scale: cameraEscala, y: cameraY } : undefined}>
        <m.div className="hero__perspectiva" style={animar ? { perspectiveOrigin: origem } : undefined}>
          <div className="hero__piso" style={{ '--n': N } as CSSProperties}>
            <div className="hero__pecas">
              {pecas.map((p) => (
                <div key={`${p.c}-${p.r}`} className="hero__peca" style={p.estilo} />
              ))}
            </div>
            <svg className="hero__clipes" viewBox={`0 0 ${N} ${N}`} preserveAspectRatio="none">
              <defs>
                <path id="hero-oct" d="M-.021-.05h.042l.029.029v.042l-.029.029h-.042L-.05.021v-.042z" />
                <g id="hero-clipe">
                  <use href="#hero-oct" transform="scale(1.25)" fill="#7d11f0" opacity="0.4" />
                  <use href="#hero-oct" transform="scale(0.42)" fill="#e6d8ff" />
                </g>
              </defs>
              {linhasClipes.map((linha) => (
                <g key={linha.y} className="hero__clipes-linha" style={{ '--d': linha.atraso } as CSSProperties}>
                  {Array.from({ length: N - 1 }, (_, i) => (
                    <use key={i} href="#hero-clipe" x={i + 1} y={linha.y} />
                  ))}
                </g>
              ))}
            </svg>
            <div className="hero__laser" />
            <div className="hero__brilho" />
          </div>
        </m.div>
      </m.div>

      <div className="hero__nevoa" aria-hidden="true" />

      <m.div className="hero__luz" aria-hidden="true" style={animar ? { y: luzY } : undefined}>
        <m.div className="absolute inset-0" style={animar ? { x: luzX, y: luzMouseY } : undefined}>
        <div className="hero__luz-feixe" />
        <div className="hero__luz-halo" />
        <svg viewBox="0 0 100 100" className="hero__luz-nucleo">
          <defs>
            <radialGradient id="hero-luz-grad" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor="#f3ecff" />
              <stop offset="35%" stopColor="#c4a0ff" />
              <stop offset="100%" stopColor="#7d11f0" />
            </radialGradient>
          </defs>
          <path d={CAMINHO_OCTOGONO} fill="url(#hero-luz-grad)" />
        </svg>
        </m.div>
      </m.div>

      <m.div className="hero__conteudo container-site" style={animar ? { y: conteudoY, opacity: conteudoOpacidade } : undefined}>
        <p className="hero__entrada rotulo flex flex-wrap items-center gap-x-3 gap-y-1 text-nevoa" style={{ '--atraso': '0.1s' } as CSSProperties}>
          <Octogono className="size-2 text-violeta-claro" />
          <span className="text-papel">Codali</span>
          <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
          <span>Soluções inteligentes para um mundo em construção</span>
        </p>
        <h1 id="titulo-hero" className="display-hero mt-6 max-w-[15ch] text-papel sm:max-w-[19ch] lg:mt-8">
          {linhasTitulo.map((linha, i) => (
            <span key={linha} className="hero__linha">
              <span style={{ '--i': i } as CSSProperties} className={i === 2 ? 'text-violeta-claro' : undefined}>
                {linha}
              </span>
            </span>
          ))}
        </h1>
        <p className="hero__entrada texto-corpo mt-7 max-w-[33rem] text-papel/75 texto-bonito lg:mt-9" style={{ '--atraso': '0.6s' } as CSSProperties}>
          Soluções inteligentes, produtos de qualidade e inovação para transformar cada etapa da construção.
        </p>
        <div className="hero__entrada mt-9 flex flex-wrap gap-3 lg:mt-11" style={{ '--atraso': '0.75s' } as CSSProperties}>
          <Botao para="/#quem-somos" magnetico>
            Conheça a Codali
          </Botao>
          <Botao para="/produtos" variante="contorno-escuro">
            Explore nossos produtos
          </Botao>
        </div>
      </m.div>

      <m.a
        href="#manifesto"
        className="hero__rolar group text-papel/70 hover:text-papel"
        style={animar ? { opacity: indicadorOpacidade } : undefined}
        onClick={(e) => {
          e.preventDefault()
          rolarPara('#manifesto')
        }}
      >
        <span className="rotulo hidden sm:inline">Role para explorar</span>
        <span className="hero__trilho" aria-hidden="true">
          <span className="hero__trilho-ponto">
            <Octogono className="size-full" />
          </span>
        </span>
        <span className="sr-only sm:hidden">Role para explorar</span>
      </m.a>

      <m.div className="hero__escurecer" aria-hidden="true" style={animar ? { opacity: escurecer } : undefined} />
    </section>
  )
}
