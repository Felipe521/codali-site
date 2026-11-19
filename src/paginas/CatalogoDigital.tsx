import type { CSSProperties } from 'react'
import { Botao } from '../componentes/Botao'
import { IconeSeta, IconeWhatsApp } from '../componentes/Icones'
import { ImagemProduto } from '../componentes/ImagemProduto'
import { Octogono } from '../componentes/Octogono'
import { Revelar } from '../componentes/Revelar'
import { Rotulo } from '../componentes/Rotulo'
import { integracoes } from '../config/empresa'
import { produtos, type Produto } from '../conteudo/produtos'
import { Link } from '../lib/roteador'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'

export function CartaoProduto({ produto, indice }: { produto: Produto; indice: number }) {
  return (
    <Link
      para={`/produtos/${produto.slug}`}
      className="cartao-produto group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-tinta/10 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(11,12,13,0.35)]"
      style={{ '--cor-produto': produto.cor.hex, '--brilho-produto': produto.cor.brilho } as CSSProperties}
      data-cursor="Ver"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-papel to-cimento">
        <div className="cartao-produto__brilho absolute inset-[12%] rounded-full" aria-hidden="true" />
        <span className="rotulo absolute left-5 top-5 text-chumbo">0{indice + 1}</span>
        <span className="absolute right-5 top-5 font-mono text-xs text-chumbo">{produto.linha}</span>
        <div className="absolute inset-[10%] flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.04]">
          <ImagemProduto produto={produto} tamanhos="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw" className="h-full w-auto object-contain drop-shadow-[0_24px_26px_rgba(11,12,13,0.25)]" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-4 p-6">
        <div>
          <p className="rotulo flex items-center gap-2 text-[0.62rem] text-chumbo">
            <span className="size-2 rounded-full" style={{ background: produto.cor.hex }} />
            {produto.junta ? `Junta ${produto.junta}` : 'Nivelamento'} · {produto.embalagem}
          </p>
          <h3 className="mt-2 text-xl font-semibold leading-tight [font-stretch:108%]">{produto.nome}</h3>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-tinta text-white transition-colors duration-500 group-hover:bg-violeta">
          <IconeSeta tamanho={15} />
        </span>
      </div>
    </Link>
  )
}

/** Catálogo digital: os produtos que a Codali apresenta no site oficial (linha SLIM). */
export function CatalogoDigital() {
  return (
    <>
      <section className="grao relative overflow-hidden bg-tinta pb-16 pt-36 text-papel lg:pb-24 lg:pt-48" data-tema="escuro" aria-labelledby="titulo-catalogo-digital">
        <div className="malha-escura pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute right-[-10%] top-[-30%] size-[60vw] rounded-full bg-[radial-gradient(circle,rgb(125_17_240/0.28),transparent_65%)]" aria-hidden="true" />
        <div className="container-site relative">
          <Rotulo texto="Catálogo digital" />
          <h1 id="titulo-catalogo-digital" className="display-xl mt-8 max-w-[12ch]">
            Produtos <span className="text-violeta-claro">Codali.</span>
          </h1>
          <p className="texto-corpo mt-8 max-w-xl text-nevoa texto-bonito">
            Conheça a linha SLIM: espaçadores niveladores de 1,0, 1,5 e 2,0 mm e a cunha para revestimento. Para preços, condições e
            disponibilidade, fale com a nossa equipe.
          </p>
        </div>
      </section>

      <section className="relative bg-gesso text-tinta" data-tema="claro" aria-label="Lista de produtos">
        <div className="malha-clara pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container-site relative py-16 lg:py-24">
          <div className="flex flex-col justify-between gap-4 border-b border-tinta/12 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="rotulo text-violeta">Nivelamento de revestimentos</p>
              <h2 className="display-m mt-3">Linha SLIM</h2>
            </div>
            <p className="max-w-md text-chumbo">Espaçadores niveladores e cunhas para assentamento de revestimentos com juntas uniformes.</p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {produtos.map((p, i) => (
              <Revelar key={p.slug} atraso={i * 0.06}>
                <CartaoProduto produto={p} indice={i} />
              </Revelar>
            ))}
          </div>

          <Revelar className="mt-20 grid gap-5 lg:mt-28 lg:grid-cols-3">
            <div className="flex flex-col justify-between gap-8 rounded-[1.5rem] bg-violeta p-8 text-white lg:col-span-2 lg:p-12">
              <div className="flex items-center gap-3">
                <Octogono className="size-2.5" />
                <p className="rotulo">Catálogo em PDF</p>
              </div>
              <p className="display-m max-w-[18ch]">Solicite o catálogo de produtos.</p>
              <div className="flex flex-wrap gap-3">
                {integracoes.catalogoPdf ? (
                  <Botao href={integracoes.catalogoPdf} download variante="claro" direcao="baixo">
                    Baixar catálogo
                  </Botao>
                ) : (
                  <Botao href={linkWhatsApp(mensagensWhatsApp.catalogo)} variante="claro" icone={<IconeWhatsApp tamanho={16} />}>
                    Receber no WhatsApp
                  </Botao>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-8 rounded-[1.5rem] bg-tinta p-8 text-papel lg:p-10">
              <p className="rotulo text-nevoa">Parcerias</p>
              <p className="display-s">Quer vender ou representar a Codali?</p>
              <div className="flex flex-col gap-3">
                <Link para="/revendedor" className="link-linha inline-flex items-center justify-between font-semibold">
                  Seja um revendedor <IconeSeta tamanho={15} />
                </Link>
                <Link para="/representante" className="link-linha inline-flex items-center justify-between font-semibold">
                  Seja um representante <IconeSeta tamanho={15} />
                </Link>
              </div>
            </div>
          </Revelar>
        </div>
      </section>
    </>
  )
}
