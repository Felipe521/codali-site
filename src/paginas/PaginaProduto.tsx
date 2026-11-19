import { Check, Link2, Share2, ZoomIn } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { Botao } from '../componentes/Botao'
import { IconeSeta, IconeWhatsApp } from '../componentes/Icones'
import { ImagemProduto } from '../componentes/ImagemProduto'
import { Modal } from '../componentes/Modal'
import { Octogono } from '../componentes/Octogono'
import { Revelar } from '../componentes/Revelar'
import { etapasProcesso } from '../conteudo/processo'
import { AFIRMACAO_EMBALAGEM, FONTE_AFIRMACAO, formatarEan, produtoPorSlug, produtos } from '../conteudo/produtos'
import { Link } from '../lib/roteador'
import { cx } from '../lib/util'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'
import { CartaoProduto } from './CatalogoDigital'

export function PaginaProduto({ slug }: { slug: string }) {
  const produto = produtoPorSlug(slug)!
  const [zoom, setZoom] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [podeCompartilhar, setPodeCompartilhar] = useState(false)
  const relacionados = produtos.filter((p) => p.slug !== slug)

  useEffect(() => {
    setPodeCompartilhar(typeof navigator.share === 'function')
  }, [])

  const compartilhar = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${produto.nome} | Codali`, text: produto.resumo, url })
        return
      } catch {
        /* cancelado pelo usuário */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2500)
    } catch {
      window.prompt('Copie o link do produto:', url)
    }
  }

  const especificacoes: Array<[string, string]> = [
    ['Produto', produto.tipo],
    ['Linha', produto.linha],
    ...(produto.junta ? ([['Largura da junta', produto.junta]] as Array<[string, string]>) : []),
    ['Embalagem', produto.embalagem],
    ['Cor das peças', produto.cor.nome],
    ['Código de barras (EAN-13)', formatarEan(produto.ean)],
  ]

  return (
    <>
      <section
        className="pagina-produto relative overflow-hidden bg-gesso pb-20 pt-28 text-tinta lg:pb-28 lg:pt-36"
        data-tema="claro"
        style={{ '--cor-produto': produto.cor.hex, '--brilho-produto': produto.cor.brilho } as CSSProperties}
        aria-labelledby="titulo-produto"
      >
        <div className="malha-clara pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container-site relative">
          <nav aria-label="Trilha de navegação">
            <ol className="rotulo flex flex-wrap items-center gap-2 text-chumbo">
              <li>
                <Link para="/" className="hover:text-tinta">
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link para="/produtos" className="hover:text-tinta">
                  Produtos
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-tinta">
                {produto.nome}
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <div className="lg:sticky lg:top-28">
                <button
                  type="button"
                  onClick={() => setZoom(true)}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-papel to-cimento ring-1 ring-tinta/10 lg:aspect-auto lg:h-[min(76svh,780px)]"
                  aria-label={`Ampliar foto: ${produto.imagem.alt}`}
                  data-cursor="Ampliar"
                >
                  <div className="cartao-produto__brilho absolute inset-[10%] rounded-full" aria-hidden="true" />
                  <span className={cx('vitrine__numeral pointer-events-none', !produto.junta && 'vitrine__numeral--palavra')} aria-hidden="true">
                    {produto.destaque}
                  </span>
                  <div className="absolute inset-[9%] flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.03]">
                    <ImagemProduto produto={produto} prioridade tamanhos="(min-width: 1024px) 45vw, 90vw" className="h-full w-auto object-contain drop-shadow-[0_34px_40px_rgba(11,12,13,0.3)]" />
                  </div>
                  <span className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-white/90 text-tinta shadow-sm transition-transform duration-500 group-hover:scale-110">
                    <ZoomIn size={18} />
                  </span>
                </button>
                <p className="rotulo mt-3 text-chumbo">Foto original da embalagem</p>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pl-6">
              <p className="rotulo flex items-center gap-3 text-chumbo">
                <span className="size-2.5 rounded-full" style={{ background: produto.cor.hex }} />
                {produto.tipo}
              </p>
              <h1 id="titulo-produto" className="display-l mt-6 max-w-[12ch]">
                {produto.nome}
              </h1>
              <p className="texto-corpo mt-8 max-w-xl text-chumbo texto-bonito">{produto.descricao}</p>

              <p className="mt-8 flex items-start gap-3 rounded-2xl bg-white p-5 ring-1 ring-tinta/10">
                <Octogono className="mt-1 size-3 shrink-0 text-violeta" />
                <span>
                  <strong className="font-semibold">{AFIRMACAO_EMBALAGEM}.</strong>
                  <span className="mt-1 block text-sm text-chumbo">{FONTE_AFIRMACAO}</span>
                </span>
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Botao href={linkWhatsApp(mensagensWhatsApp.produto(produto.nome))} variante="escuro" icone={<IconeWhatsApp tamanho={16} />} magnetico>
                  Consultar no WhatsApp
                </Botao>
                <Botao para={`/revendedor?produto=${produto.slug}`} variante="contorno-claro">
                  Quero revender
                </Botao>
                <button
                  type="button"
                  onClick={compartilhar}
                  className="inline-flex h-14 items-center gap-2 rounded-full px-5 text-sm font-semibold text-chumbo transition-colors hover:text-tinta"
                >
                  {copiado ? <Check size={16} /> : podeCompartilhar ? <Share2 size={16} /> : <Link2 size={16} />}
                  {copiado ? 'Link copiado' : 'Compartilhar'}
                </button>
              </div>

              <div className="mt-14">
                <h2 className="rotulo text-chumbo">Especificações</h2>
                <dl className="mt-4 border-t border-tinta/12">
                  {especificacoes.map(([termo, valor]) => (
                    <div key={termo} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 border-b border-tinta/12 py-4">
                      <dt className="text-chumbo">{termo}</dt>
                      <dd className={cx('font-semibold', termo.startsWith('Código') && 'font-mono tracking-wider')}>{valor}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-sm text-chumbo">
                  Informações conforme a embalagem do produto. Para outras especificações técnicas, consulte a equipe Codali.
                </p>
              </div>

              <div className="mt-14">
                <h2 className="rotulo text-chumbo">No sistema de nivelamento</h2>
                <p className="mt-4 max-w-xl leading-relaxed">{produto.funcaoNoSistema}</p>
                <ol className="mt-8 grid gap-3 sm:grid-cols-2">
                  {etapasProcesso.map((e) => (
                    <li key={e.numero} className="rounded-2xl bg-white p-5 ring-1 ring-tinta/10">
                      <p className="rotulo text-violeta">{e.numero}</p>
                      <p className="mt-2 font-semibold">{e.titulo}</p>
                      <p className="mt-1 text-sm leading-relaxed text-chumbo">{e.texto}</p>
                    </li>
                  ))}
                </ol>
                <Link para="/#processo" className="link-linha mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                  Ver o processo animado <IconeSeta tamanho={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-papel text-tinta" data-tema="claro" aria-labelledby="titulo-relacionados">
        <div className="container-site py-20 lg:py-28">
          <div className="flex items-end justify-between gap-6">
            <h2 id="titulo-relacionados" className="display-m">
              Também na linha SLIM
            </h2>
            <Link para="/produtos" className="link-linha hidden items-center gap-2 font-semibold sm:inline-flex">
              Todos os produtos <IconeSeta tamanho={14} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((p) => (
              <Revelar key={p.slug}>
                <CartaoProduto produto={p} indice={produtos.indexOf(p)} />
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      <Modal aberto={zoom} aoFechar={() => setZoom(false)} titulo={produto.nome} className="modal--imagem">
        <div className="flex max-h-[80vh] items-center justify-center bg-gradient-to-b from-papel to-cimento p-6">
          <ImagemProduto produto={produto} prioridade tamanhos="90vw" className="max-h-[74vh] w-auto object-contain" />
        </div>
      </Modal>
    </>
  )
}
