import { m, useScroll, useSpring } from 'framer-motion'

/** Linha fina no topo indicando o quanto da página já foi percorrido. */
export function ProgressoRolagem() {
  const { scrollYProgress } = useScroll()
  const escala = useSpring(scrollYProgress, { stiffness: 160, damping: 32, restDelta: 0.001 })
  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-violeta to-violeta-claro"
      style={{ scaleX: escala }}
    />
  )
}
