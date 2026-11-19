import type Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'

type Alvo = string | number | HTMLElement

type OpcoesRolagem = {
  imediato?: boolean
  deslocamento?: number
}

type ContextoRolagem = {
  rolarPara: (alvo: Alvo, opcoes?: OpcoesRolagem) => void
  travar: () => void
  destravar: () => void
}

const Contexto = createContext<ContextoRolagem>({
  rolarPara: () => {},
  travar: () => {},
  destravar: () => {},
})

const suavizar = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function resolverAlvo(alvo: Alvo): number | HTMLElement | null {
  if (typeof alvo === 'number') return alvo
  if (typeof alvo !== 'string') return alvo
  if (alvo === '#' || alvo === '#inicio' || alvo === '#topo') return 0
  try {
    return document.querySelector<HTMLElement>(alvo)
  } catch {
    return null
  }
}

/** Rolagem suave com Lenis (desativada para quem prefere menos movimento). */
export function ProvedorRolagem({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const travas = useRef(0)
  const liberarRef = useRef(0)

  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzir) return
    let ativo = true
    import('lenis').then(({ default: LenisClasse }) => {
      if (!ativo) return
      lenisRef.current = new LenisClasse({
        autoRaf: true,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
      })
      if (travas.current > 0) lenisRef.current.stop()
    })
    return () => {
      ativo = false
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
  }, [])

  const rolarPara = useCallback((alvo: Alvo, { imediato = false, deslocamento = 0 }: OpcoesRolagem = {}) => {
    const destino = resolverAlvo(alvo)
    if (destino === null) return
    // Seções fora da tela não são desenhadas (content-visibility); antes de um salto,
    // desenha tudo para que as posições sejam exatas — e libera ao terminar.
    const raiz = document.documentElement
    window.clearTimeout(liberarRef.current)
    raiz.classList.add('render-completo')
    void raiz.offsetHeight
    const liberar = () => {
      window.clearTimeout(liberarRef.current)
      liberarRef.current = window.setTimeout(() => raiz.classList.remove('render-completo'), 250)
    }
    const lenis = lenisRef.current
    if (lenis) {
      lenis.resize()
      lenis.scrollTo(destino, {
        offset: deslocamento,
        immediate: imediato,
        duration: 1.5,
        easing: suavizar,
        force: true,
        onComplete: liberar,
      })
      if (imediato) liberar()
      return
    }
    const topo =
      typeof destino === 'number' ? destino : destino.getBoundingClientRect().top + window.scrollY + deslocamento
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: topo, behavior: imediato || reduzir ? 'auto' : 'smooth' })
    if (imediato || reduzir) liberar()
    else liberarRef.current = window.setTimeout(() => raiz.classList.remove('render-completo'), 1800)
  }, [])

  const travar = useCallback(() => {
    travas.current += 1
    lenisRef.current?.stop()
    document.documentElement.style.overflow = 'hidden'
  }, [])

  const destravar = useCallback(() => {
    travas.current = Math.max(0, travas.current - 1)
    if (travas.current > 0) return
    lenisRef.current?.start()
    document.documentElement.style.overflow = ''
  }, [])

  const valor = useMemo(() => ({ rolarPara, travar, destravar }), [rolarPara, travar, destravar])
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export const useRolagem = () => useContext(Contexto)
