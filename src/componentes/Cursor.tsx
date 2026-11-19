import { m, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePonteiroFino, useReduzirMovimento } from '../lib/movimento'
import { CAMINHO_OCTOGONO } from './Octogono'

type Estado = 'normal' | 'interativo' | 'rotulo'

/**
 * Cursor-assinatura: o octógono do logotipo acompanha o mouse.
 * Cresce sobre elementos clicáveis e mostra rótulos em áreas com data-cursor.
 * O cursor nativo continua visível (usabilidade).
 */
export function Cursor() {
  const fino = usePonteiroFino()
  const reduzir = useReduzirMovimento()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 600, damping: 42, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 600, damping: 42, mass: 0.4 })
  const [estado, setEstado] = useState<Estado>('normal')
  const [rotulo, setRotulo] = useState('')
  const [oculto, setOculto] = useState(true)
  const ativo = fino && !reduzir

  useEffect(() => {
    if (!ativo) return
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setOculto(false)
    }
    const sobre = (e: PointerEvent) => {
      const alvo = e.target as Element | null
      if (!alvo || !alvo.closest) return
      if (alvo.closest('input, textarea, select')) {
        setOculto(true)
        return
      }
      const comRotulo = alvo.closest<HTMLElement>('[data-cursor]')
      if (comRotulo) {
        setRotulo(comRotulo.dataset.cursor ?? '')
        setEstado('rotulo')
        return
      }
      setEstado(alvo.closest('a, button, [role="button"], label, summary') ? 'interativo' : 'normal')
    }
    const sair = () => setOculto(true)
    window.addEventListener('pointermove', mover, { passive: true })
    document.addEventListener('pointerover', sobre, { passive: true })
    document.documentElement.addEventListener('pointerleave', sair)
    return () => {
      window.removeEventListener('pointermove', mover)
      document.removeEventListener('pointerover', sobre)
      document.documentElement.removeEventListener('pointerleave', sair)
    }
  }, [ativo, x, y])

  if (!ativo) return null

  return (
    <m.div className="cursor" aria-hidden="true" data-estado={estado} data-oculto={oculto ? 'true' : 'false'} style={{ x: sx, y: sy }}>
      <div className="cursor__forma">
        <svg viewBox="0 0 100 100" className="cursor__octogono absolute inset-0 size-full" overflow="visible">
          <path d={CAMINHO_OCTOGONO} vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="cursor__rotulo">{rotulo}</span>
      </div>
    </m.div>
  )
}
