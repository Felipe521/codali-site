import type { CSSProperties } from 'react'
import { cx } from '../lib/util'
import { LOGO_LETRAS, LOGO_OCTOGONO, LOGO_VIEWBOX } from './logo-caminhos'

type Props = {
  className?: string
  corPonto?: string
  titulo?: string
  decorativo?: boolean
}

/** Logotipo Codali vetorizado. As letras usam a cor do texto (currentColor). */
export function Logo({ className, corPonto = 'var(--color-violeta)', titulo = 'Codali', decorativo = false }: Props) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={cx('logo', className)}
      fill="currentColor"
      role={decorativo ? undefined : 'img'}
      aria-label={decorativo ? undefined : titulo}
      aria-hidden={decorativo ? true : undefined}
      focusable="false"
    >
      <g fillRule="evenodd">
        {LOGO_LETRAS.map((letra, i) => (
          <path key={letra.letra} d={letra.d} style={{ '--i': i } as CSSProperties} />
        ))}
      </g>
      <path d={LOGO_OCTOGONO} fill={corPonto} className="logo__ponto" />
    </svg>
  )
}
