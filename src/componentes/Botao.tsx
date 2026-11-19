import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from '../lib/roteador'
import { cx } from '../lib/util'
import { IconeSeta } from './Icones'
import { Magnetico } from './Magnetico'

type Variante = 'primario' | 'claro' | 'escuro' | 'violeta-claro' | 'contorno-escuro' | 'contorno-claro'

type Base = {
  children: ReactNode
  variante?: Variante
  pequeno?: boolean
  largo?: boolean
  /** ícone à direita; false remove */
  icone?: ReactNode | false
  direcao?: 'diagonal' | 'baixo'
  magnetico?: boolean
  className?: string
}

type PropsLinkInterno = Base & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & { para: string; href?: never }
type PropsLinkExterno = Base & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & { href: string; para?: never; externo?: boolean }
type PropsBotao = Base & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & { para?: never; href?: never }

export type PropsBotaoCodali = PropsLinkInterno | PropsLinkExterno | PropsBotao

function classes(variante: Variante, pequeno?: boolean, largo?: boolean, semIcone?: boolean, extra?: string) {
  return cx(
    'botao',
    variante !== 'primario' && `botao--${variante}`,
    pequeno && 'botao--pequeno',
    largo && 'botao--largo',
    semIcone && 'botao--sem-icone',
    extra,
  )
}

export function Botao(props: PropsBotaoCodali) {
  const { children, variante = 'primario', pequeno, largo, icone, direcao = 'diagonal', magnetico, className, ...resto } = props
  const simbolo = icone === false ? null : (icone ?? <IconeSeta tamanho={pequeno ? 14 : 16} direcao={direcao === 'baixo' ? 'baixo' : 'diagonal'} />)
  const classe = classes(variante, pequeno, largo, simbolo === null, className)

  const miolo = (
    <>
      <span className="botao__rolo">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {simbolo && (
        <span className="botao__icone" aria-hidden="true">
          <span className="botao__icone-a">{simbolo}</span>
          <span className="botao__icone-b">{simbolo}</span>
        </span>
      )}
    </>
  )

  let elemento: ReactNode
  if ('para' in resto && resto.para !== undefined) {
    const { para, ...a } = resto as PropsLinkInterno
    elemento = (
      <Link para={para} className={classe} data-direcao={direcao} {...a}>
        {miolo}
      </Link>
    )
  } else if ('href' in resto && resto.href !== undefined) {
    const { href, externo, ...a } = resto as PropsLinkExterno
    const fora = externo ?? /^https?:/.test(href)
    elemento = (
      <a
        href={href}
        className={classe}
        data-direcao={direcao}
        {...(fora ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...a}
      >
        {miolo}
        {fora && <span className="sr-only"> (abre em nova aba)</span>}
      </a>
    )
  } else {
    const b = resto as Omit<PropsBotao, keyof Base>
    elemento = (
      <button type="button" className={classe} data-direcao={direcao} {...b}>
        {miolo}
      </button>
    )
  }

  return magnetico ? <Magnetico className={largo ? 'flex w-full' : 'inline-flex'}>{elemento}</Magnetico> : elemento
}
