import { Fragment, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useNaVista } from '../lib/naVista'
import { cx } from '../lib/util'

type Tag = 'div' | 'section' | 'p' | 'li' | 'ul' | 'span' | 'figure' | 'article' | 'header' | 'dl'

type PropsRevelar = {
  children: ReactNode
  como?: Tag
  className?: string
  atraso?: number
  sutil?: boolean
  style?: CSSProperties
  id?: string
}

/** Entrada suave (opacidade + deslocamento) quando o elemento aparece na tela. */
export function Revelar({ children, como = 'div', className, atraso = 0, sutil = false, style, id }: PropsRevelar) {
  const [ref, visivel] = useNaVista<HTMLElement>()
  const Elemento = como as ElementType
  return (
    <Elemento
      ref={ref}
      id={id}
      data-revelar={sutil ? 'sutil' : ''}
      className={cx(className, visivel && 'visivel')}
      style={{ ...style, '--atraso': `${atraso}s` } as CSSProperties}
    >
      {children}
    </Elemento>
  )
}

type PropsTexto = {
  texto: string
  como?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  atraso?: number
  destaques?: string[]
  classeDestaque?: string
  id?: string
}

/** Título que sobe palavra por palavra, cada uma saindo de uma máscara. */
export function TextoRevelado({ texto, como = 'h2', className, atraso = 0, destaques = [], classeDestaque = 'text-violeta', id }: PropsTexto) {
  const [ref, visivel] = useNaVista<HTMLHeadingElement>({ limiar: 0.15 })
  const Elemento = como as ElementType
  const palavras = texto.split(' ')
  return (
    <Elemento
      ref={ref}
      id={id}
      className={cx('revelar-palavras', visivel && 'visivel', className)}
      style={{ '--atraso': `${atraso}s` } as CSSProperties}
    >
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true">
        {palavras.map((palavra, i) => (
          <Fragment key={`${palavra}-${i}`}>
            <span className="mascara">
              <span data-palavra="" className={destaques.includes(palavra) ? classeDestaque : undefined} style={{ '--i': i } as CSSProperties}>
                {palavra}
              </span>
            </span>
            {i < palavras.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Elemento>
  )
}
