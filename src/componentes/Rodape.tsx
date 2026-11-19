import { empresa, integracoes } from '../config/empresa'
import { produtos } from '../conteudo/produtos'
import { useNaVista } from '../lib/naVista'
import { useRolagem } from '../lib/rolagem'
import { Link } from '../lib/roteador'
import { cx } from '../lib/util'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'
import { Botao } from './Botao'
import { IconeRede, IconeSeta, IconeWhatsApp } from './Icones'
import { Logo } from './Logo'
import { Octogono } from './Octogono'

const colunas = [
  {
    titulo: 'Navegação',
    links: [
      { rotulo: 'Início', para: '/' },
      { rotulo: 'Quem somos', para: '/#quem-somos' },
      { rotulo: 'Como funciona', para: '/#processo' },
      { rotulo: 'Valores', para: '/#valores' },
      { rotulo: 'Contato', para: '/#contato' },
    ],
  },
  {
    titulo: 'Produtos',
    links: [
      ...produtos.map((p) => ({ rotulo: p.nome, para: `/produtos/${p.slug}` })),
      { rotulo: 'Catálogo digital', para: '/produtos' },
    ],
  },
  {
    titulo: 'Parcerias',
    links: [
      { rotulo: 'Seja um revendedor', para: '/revendedor' },
      { rotulo: 'Seja um representante', para: '/representante' },
    ],
  },
]

export function Rodape() {
  const { rolarPara } = useRolagem()
  const [ref, visivel] = useNaVista<HTMLDivElement>({ limiar: 0.2 })

  return (
    <footer className="grao adiar-render relative overflow-hidden bg-tinta text-papel" data-tema="escuro">
      <div className="malha-escura pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-site relative z-[1] pt-24 lg:pt-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo className="h-8 w-auto" corPonto="var(--color-violeta-claro)" />
            <p className="display-s mt-8 max-w-sm text-papel/90 texto-equilibrado">{empresa.slogan}</p>
            <div className="mt-9">
              <Botao href={linkWhatsApp(mensagensWhatsApp.geral)} icone={<IconeWhatsApp tamanho={16} />}>
                Conversar no WhatsApp
              </Botao>
            </div>
          </div>

          {colunas.map((coluna) => (
            <nav key={coluna.titulo} aria-label={coluna.titulo} className="lg:col-span-2">
              <h2 className="rotulo text-nevoa">{coluna.titulo}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {coluna.links.map((link) => (
                  <li key={link.para}>
                    <Link para={link.para} className="link-linha text-[0.98rem] text-papel/85 hover:text-papel">
                      {link.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-2">
            <h2 className="rotulo text-nevoa">Contato</h2>
            <ul className="mt-6 flex flex-col gap-3 text-[0.98rem]">
              <li>
                <a href={linkWhatsApp(mensagensWhatsApp.geral)} target="_blank" rel="noopener noreferrer" className="link-linha text-papel/85 hover:text-papel">
                  WhatsApp {empresa.whatsapp.exibicao}
                </a>
              </li>
              <li>
                <a href={empresa.telefone.link} className="link-linha text-papel/85 hover:text-papel">
                  Telefone {empresa.telefone.exibicao}
                </a>
              </li>
              <li>
                <a href={`mailto:${empresa.email}`} className="link-linha break-all text-papel/85 hover:text-papel">
                  {empresa.email}
                </a>
              </li>
              {empresa.endereco && <li className="text-papel/70">{empresa.endereco}</li>}
            </ul>
            <ul className="mt-7 flex gap-2.5" aria-label="Redes sociais">
              {empresa.redes.map((rede) => (
                <li key={rede.id}>
                  <a
                    href={rede.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${rede.nome} da Codali (abre em nova aba)`}
                    className="grid size-11 place-items-center rounded-full border border-white/15 transition-colors duration-300 hover:border-violeta hover:bg-violeta"
                  >
                    <IconeRede id={rede.id} tamanho={17} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Assinatura tipográfica */}
        <div ref={ref} className="relative mt-24 overflow-hidden lg:mt-32" aria-hidden="true">
          <div
            className={cx(
              'transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
              visivel ? 'translate-y-0' : 'translate-y-[45%]',
            )}
          >
            <Logo decorativo className="h-auto w-full text-grafite" corPonto="var(--color-violeta)" />
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 py-7 text-sm text-nevoa md:flex-row md:items-center md:justify-between">
          <p>
            © {__ANO__} {empresa.razaoSocial || empresa.nome}. Todos os direitos reservados.
            {empresa.cnpj && <span className="ml-2">CNPJ {empresa.cnpj}</span>}
          </p>
          <div className="flex items-center gap-6">
            {integracoes.politicaPrivacidade && (
              <a href={integracoes.politicaPrivacidade} className="link-linha hover:text-papel">
                Política de privacidade
              </a>
            )}
            <button type="button" onClick={() => rolarPara(0)} className="group flex items-center gap-2 hover:text-papel">
              <Octogono className="size-1.5 text-violeta-claro" />
              Voltar ao topo
              <IconeSeta direcao="cima" tamanho={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
