import { useEffect, useRef, type CSSProperties } from 'react'
import { empresa } from '../config/empresa'
import { Link } from '../lib/roteador'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'
import { IconeRede, IconeSeta, IconeWhatsApp } from './Icones'
import { Octogono } from './Octogono'

type Item = { rotulo: string; para: string }

export function MenuMovel({ aberto, aoFechar, itens }: { aberto: boolean; aoFechar: (devolverFoco?: boolean) => void; itens: readonly Item[] }) {
  const primeiro = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (aberto) window.setTimeout(() => primeiro.current?.focus(), 350)
  }, [aberto])

  return (
    <div
      id="menu-movel"
      className="menu-movel lg:hidden"
      data-aberto={aberto ? 'true' : 'false'}
      aria-hidden={!aberto}
      inert={!aberto}
    >
      <div className="malha-escura absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-site relative flex h-full flex-col justify-between pb-8 pt-28">
        <nav aria-label="Menu">
          <ul className="flex flex-col gap-1">
            {itens.map((item, i) => (
              <li key={item.para} className="menu-movel__item" style={{ '--i': i } as CSSProperties}>
                <Link
                  ref={i === 0 ? primeiro : undefined}
                  para={item.para}
                  onClick={() => aoFechar()}
                  className="group flex items-baseline justify-between border-b border-white/10 py-4"
                >
                  <span className="display-m">{item.rotulo}</span>
                  <span className="rotulo text-nevoa">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-movel__item flex flex-col gap-6" style={{ '--i': itens.length } as CSSProperties}>
          <a
            href={linkWhatsApp(mensagensWhatsApp.geral)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-full bg-violeta px-6 py-4 font-semibold"
          >
            <span className="flex items-center gap-3">
              <IconeWhatsApp /> WhatsApp {empresa.whatsapp.exibicao}
            </span>
            <IconeSeta />
          </a>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-nevoa">
              <Octogono className="size-2 text-violeta-claro" />
              <a href={`mailto:${empresa.email}`} className="text-sm">
                {empresa.email}
              </a>
            </div>
            <ul className="flex gap-2">
              {empresa.redes.map((rede) => (
                <li key={rede.id}>
                  <a
                    href={rede.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${rede.nome} da Codali (abre em nova aba)`}
                    className="grid size-10 place-items-center rounded-full border border-white/15"
                  >
                    <IconeRede id={rede.id} tamanho={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
