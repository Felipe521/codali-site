import type { CSSProperties } from 'react'
import { Botao } from '../componentes/Botao'
import { IconeWhatsApp } from '../componentes/Icones'
import { ImagemProduto } from '../componentes/ImagemProduto'
import { CAMINHO_OCTOGONO, Octogono } from '../componentes/Octogono'
import { Revelar, TextoRevelado } from '../componentes/Revelar'
import { Rotulo } from '../componentes/Rotulo'
import { produtos } from '../conteudo/produtos'
import { usePausarForaDaTela } from '../lib/naVista'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'

/** Gancheira com as embalagens reais da linha SLIM — como ficam expostas na loja. */
function Gancheira() {
  return (
    <div className="gancheira relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgb(11_12_13/0.16)_1.6px,transparent_2px)] [background-size:22px_22px]" aria-hidden="true" />
      <div className="absolute inset-x-[6%] top-[16%] h-[5px] rounded-full bg-gradient-to-b from-[#c9c7c1] to-[#8d9298] shadow-[0_3px_6px_rgba(0,0,0,0.15)]" aria-hidden="true" />
      <div className="absolute inset-x-[8%] top-[16%] flex h-[78%] justify-between">
        {produtos.map((p, i) => (
          <div key={p.slug} className="gancheira__item relative flex w-[23%] flex-col items-center" style={{ '--i': i } as CSSProperties}>
            <span className="h-[9%] w-[3px] rounded-full bg-[#8d9298]" aria-hidden="true" />
            <div className="gancheira__pacote -mt-[6%] h-[88%] origin-top">
              <ImagemProduto produto={p} tamanhos="(min-width: 1024px) 10vw, 22vw" className="h-full w-auto object-contain drop-shadow-[0_14px_14px_rgba(11,12,13,0.25)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Ilustração de representação comercial: pulsos saem da Codali em direção a novos clientes. */
function Rede() {
  const nos = [
    [70, 70],
    [250, 40],
    [340, 130],
    [320, 250],
    [190, 290],
    [60, 230],
    [120, 150],
    [270, 175],
  ]
  const centro = [200, 160]
  return (
    <svg viewBox="0 0 400 320" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {nos.map(([x, y], i) => (
        <g key={i}>
          <path d={`M${centro[0]} ${centro[1]}L${x} ${y}`} stroke="#ffffff" strokeOpacity="0.14" />
          <path
            d={`M${centro[0]} ${centro[1]}L${x} ${y}`}
            stroke="#c9a8ff"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="10 90"
            className="pulso"
            style={{ animationDelay: `${i * -0.45}s`, animationDuration: '2.8s' }}
          />
          <path d={CAMINHO_OCTOGONO} transform={`translate(${x - 7} ${y - 7}) scale(0.14)`} fill="#121315" stroke="#a66cff" strokeWidth="12" />
        </g>
      ))}
      <circle cx={centro[0]} cy={centro[1]} r="34" fill="#7d11f0" opacity="0.18" className="respirar" style={{ transformOrigin: '200px 160px' }} />
      <path d={CAMINHO_OCTOGONO} transform={`translate(${centro[0] - 14} ${centro[1] - 14}) scale(0.28)`} fill="#a66cff" />
    </svg>
  )
}

export function Parceiros() {
  const refSecao = usePausarForaDaTela<HTMLElement>()
  return (
    <section id="parceiros" ref={refSecao} className="empilhada adiar-render z-10 bg-gesso text-tinta" data-tema="claro" aria-labelledby="titulo-parceiros">
      <div className="container-site secao">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Rotulo indice="07" texto="Parcerias" claro />
            <TextoRevelado id="titulo-parceiros" texto="Seja um parceiro Codali." className="display-l mt-8 max-w-[12ch]" destaques={['Codali.']} />
          </div>
          <Revelar atraso={0.1} className="lg:col-span-5">
            <p className="texto-corpo text-chumbo texto-bonito">
              Seja um revendedor e venda nossos produtos no seu negócio. Ou venha ser um de nossos representantes, entregando a melhor experiência para seus clientes.
            </p>
          </Revelar>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-2">
          <Revelar className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-tinta/10">
            <div className="relative aspect-[16/11] bg-cimento/60">
              <Gancheira />
              <span className="rotulo absolute left-5 top-5 rounded-full bg-white/80 px-3 py-1.5 text-chumbo backdrop-blur">Para lojas e revendas</span>
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-10">
              <h3 className="display-m">Quero ser revendedor</h3>
              <p className="mt-5 max-w-md leading-relaxed text-chumbo">
                Comercialize os produtos Codali no seu estabelecimento, como a linha SLIM de espaçadores niveladores e cunhas para revestimento.
              </p>
              <ul className="mt-7 space-y-3 text-[0.95rem]">
                {['Linha SLIM em embalagens de 100 unidades', 'Código de barras EAN em todos os itens da linha', 'Embalagem com furo para exposição em gancheira'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Octogono className="mt-1.5 size-2.5 shrink-0 text-violeta" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-10">
                <Botao para="/revendedor" variante="escuro" magnetico>
                  Quero ser revendedor
                </Botao>
                <a href={linkWhatsApp(mensagensWhatsApp.revenda)} target="_blank" rel="noopener noreferrer" className="link-linha inline-flex items-center gap-2 text-sm font-semibold text-chumbo hover:text-tinta">
                  <IconeWhatsApp tamanho={15} /> Falar pelo WhatsApp
                </a>
              </div>
            </div>
          </Revelar>

          <Revelar atraso={0.12} className="flex flex-col overflow-hidden rounded-[1.75rem] bg-tinta text-papel">
            <div className="relative aspect-[16/11] overflow-hidden">
              <div className="malha-escura absolute inset-0" aria-hidden="true" />
              <Rede />
              <span className="rotulo absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1.5 text-papel/80 backdrop-blur">Para representantes comerciais</span>
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-10">
              <h3 className="display-m">Quero ser representante</h3>
              <p className="mt-5 max-w-md leading-relaxed text-nevoa">
                Represente a Codali na sua região e leve aos seus clientes soluções para quem constrói.
              </p>
              <ul className="mt-7 space-y-3 text-[0.95rem] text-papel/90">
                {['Linha SLIM de nivelamento de revestimentos', 'Cadastro simples, em poucos minutos', 'Contato da equipe Codali após o cadastro'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Octogono className="mt-1.5 size-2.5 shrink-0 text-violeta-claro" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-10">
                <Botao para="/representante" magnetico>
                  Quero ser representante
                </Botao>
                <a href={linkWhatsApp(mensagensWhatsApp.representacao)} target="_blank" rel="noopener noreferrer" className="link-linha inline-flex items-center gap-2 text-sm font-semibold text-nevoa hover:text-papel">
                  <IconeWhatsApp tamanho={15} /> Falar pelo WhatsApp
                </a>
              </div>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  )
}
