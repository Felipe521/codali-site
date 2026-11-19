import { useEffect, useRef, useState } from 'react'

type Opcoes = {
  margem?: string
  limiar?: number
  umaVez?: boolean
}

/**
 * Observa uma faixa horizontal da tela e informa qual elemento está nela.
 * Quando vários se sobrepõem (seções empilhadas), vale o último no documento — o que está por cima.
 */
export function observarFaixa(
  elementos: Element[],
  faixa: (alturaJanela: number) => string,
  aoMudar: (elemento: HTMLElement) => void,
): () => void {
  let observador: IntersectionObserver | null = null
  const presentes = new Set<Element>()
  const criar = () => {
    observador?.disconnect()
    presentes.clear()
    observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) presentes.add(e.target)
          else presentes.delete(e.target)
        }
        let escolhido: Element | null = null
        for (const el of presentes) {
          if (!escolhido || escolhido.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) escolhido = el
        }
        if (escolhido) aoMudar(escolhido as HTMLElement)
      },
      { rootMargin: faixa(window.innerHeight), threshold: 0 },
    )
    for (const el of elementos) observador.observe(el)
  }
  criar()
  window.addEventListener('resize', criar)
  return () => {
    observador?.disconnect()
    window.removeEventListener('resize', criar)
  }
}

/** Pausa as animações CSS decorativas de um bloco enquanto ele está fora da tela. */
export function usePausarForaDaTela<T extends Element>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const elemento = ref.current
    if (!elemento || !('IntersectionObserver' in window)) return
    const observador = new IntersectionObserver(([entrada]) => elemento.classList.toggle('animacoes-pausadas', !entrada.isIntersecting), {
      rootMargin: '120px 0px',
    })
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])
  return ref
}

/** Observa quando um elemento entra na área visível. */
export function useNaVista<T extends Element>({ margem = '0px 0px -12% 0px', limiar = 0.1, umaVez = true }: Opcoes = {}) {
  const ref = useRef<T | null>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return
    if (!('IntersectionObserver' in window)) {
      setVisivel(true)
      return
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            setVisivel(true)
            if (umaVez) observador.disconnect()
          } else if (!umaVez) {
            setVisivel(false)
          }
        }
      },
      { rootMargin: margem, threshold: limiar },
    )
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [margem, limiar, umaVez])

  return [ref, visivel] as const
}
