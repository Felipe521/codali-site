import { m, useMotionValue, useSpring } from 'framer-motion'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { usePonteiroFino, useReduzirMovimento } from '../lib/movimento'

/** Aproxima suavemente o elemento do cursor (só em mouse/trackpad). */
export function Magnetico({ children, forca = 0.3, className }: { children: ReactNode; forca?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const fino = usePonteiroFino()
  const reduzir = useReduzirMovimento()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 15, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 180, damping: 15, mass: 0.5 })

  const mover = (evento: PointerEvent<HTMLSpanElement>) => {
    if (!fino || reduzir || evento.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((evento.clientX - (r.left + r.width / 2)) * forca)
    y.set((evento.clientY - (r.top + r.height / 2)) * forca)
  }
  const soltar = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.span
      ref={ref}
      className={className ?? 'inline-flex'}
      style={{ x: sx, y: sy }}
      onPointerMove={mover}
      onPointerLeave={soltar}
    >
      {children}
    </m.span>
  )
}
