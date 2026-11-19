/** O octógono do "o" da Codali — elemento gráfico recorrente do site. */
export const CAMINHO_OCTOGONO = 'M29.29 0h41.42L100 29.29v41.42L70.71 100H29.29L0 70.71V29.29z'

export function Octogono({ className, contorno = false }: { className?: string; contorno?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false" overflow="visible">
      {contorno ? (
        <path d={CAMINHO_OCTOGONO} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      ) : (
        <path d={CAMINHO_OCTOGONO} fill="currentColor" />
      )}
    </svg>
  )
}
