import { useEffect, useRef, useState } from 'react'
import { observarFaixa } from '../lib/naVista'
import { useRolagem } from '../lib/rolagem'
import { Link, type Rota } from '../lib/roteador'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'
import { Botao } from './Botao'
import { IconeWhatsApp } from './Icones'
import { Logo } from './Logo'
import { MenuMovel } from './MenuMovel'

export const itensNavegacao = [
  { rotulo: 'Quem somos', para: '/#quem-somos', rota: null },
  { rotulo: 'Produtos', para: '/produtos', rota: 'produtos' },
  { rotulo: 'Revendedor', para: '/revendedor', rota: 'revendedor' },
  { rotulo: 'Representante', para: '/representante', rota: 'representante' },
  { rotulo: 'Contato', para: '/#contato', rota: null },
] as const

export function Cabecalho({ rota }: { rota: Rota }) {
  const [tema, setTema] = useState<'escuro' | 'claro'>('escuro')
  const [solido, setSolido] = useState(false)
  const [escondido, setEscondido] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const botaoMenu = useRef<HTMLButtonElement>(null)
  const { travar, destravar } = useRolagem()

  // Cor do cabeçalho: segue a seção que passa sob ele (sem medições a cada quadro)
  useEffect(() => {
    const secoes = [...document.querySelectorAll('main [data-tema], footer[data-tema]')]
    return observarFaixa(
      secoes,
      (h) => `-37px 0px -${Math.max(0, h - 39)}px 0px`,
      (el) => setTema(el.dataset.tema === 'claro' ? 'claro' : 'escuro'),
    )
  }, [rota])

  // Fundo sólido e esconder ao descer: só lê a posição da rolagem
  useEffect(() => {
    let ultimoY = window.scrollY
    let quadro = 0
    const atualizar = () => {
      quadro = 0
      const y = window.scrollY
      setSolido(y > 24)
      const delta = y - ultimoY
      if (Math.abs(delta) > 8) {
        setEscondido(delta > 0 && y > window.innerHeight * 0.6)
        ultimoY = y
      }
    }
    const aoRolar = () => {
      if (!quadro) quadro = requestAnimationFrame(atualizar)
    }
    atualizar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', aoRolar)
    }
  }, [rota])

  useEffect(() => {
    if (!menuAberto) return
    travar()
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAberto(false)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => {
      destravar()
      window.removeEventListener('keydown', aoTeclar)
    }
  }, [menuAberto, travar, destravar])

  const fecharMenu = (devolverFoco = false) => {
    setMenuAberto(false)
    if (devolverFoco) botaoMenu.current?.focus()
  }

  const temaAtual = menuAberto ? 'escuro' : tema
  const atual = (item: (typeof itensNavegacao)[number]) =>
    item.rota !== null && (item.rota === rota.nome || (item.rota === 'produtos' && rota.nome === 'produto'))

  return (
    <>
      <header
        className="cabecalho"
        data-tema={temaAtual}
        data-solido={solido && !menuAberto ? 'true' : 'false'}
        data-escondido={escondido && !menuAberto ? 'true' : 'false'}
      >
        <div className="cabecalho__fundo" aria-hidden="true" />
        <div className="container-site relative flex h-[4.25rem] items-center justify-between gap-6 lg:h-20">
          <Link para="/" aria-label="Codali — página inicial" className="relative -m-2 block p-2" onClick={() => fecharMenu()}>
            <Logo
              decorativo
              className="h-[21px] w-auto lg:h-[25px]"
              corPonto={temaAtual === 'claro' ? 'var(--color-violeta)' : 'var(--color-violeta-claro)'}
            />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {itensNavegacao.map((item) => (
                <li key={item.para}>
                  <Link para={item.para} className="nav-link" aria-current={atual(item) ? 'page' : undefined}>
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <Botao
              href={linkWhatsApp(mensagensWhatsApp.geral)}
              pequeno
              magnetico
              icone={<IconeWhatsApp tamanho={15} />}
              variante={temaAtual === 'claro' ? 'escuro' : 'primario'}
              className="hidden sm:inline-flex"
            >
              Fale conosco
            </Botao>
            <button
              ref={botaoMenu}
              type="button"
              className="relative grid size-11 place-items-center rounded-full border border-current/20 lg:hidden"
              aria-expanded={menuAberto}
              aria-controls="menu-movel"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuAberto((v) => !v)}
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <span
                  className="absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500"
                  style={{ top: menuAberto ? 5 : 0, transform: menuAberto ? 'rotate(45deg)' : 'none' }}
                />
                <span
                  className="absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500"
                  style={{ top: menuAberto ? 5 : 10, transform: menuAberto ? 'rotate(-45deg)' : 'none' }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MenuMovel aberto={menuAberto} aoFechar={fecharMenu} itens={itensNavegacao} />
    </>
  )
}
