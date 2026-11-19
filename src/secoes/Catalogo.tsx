import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Download, ExternalLink, FileText } from 'lucide-react'
import { useState, type PointerEvent } from 'react'
import { Botao } from '../componentes/Botao'
import { IconeWhatsApp } from '../componentes/Icones'
import { ImagemProduto } from '../componentes/ImagemProduto'
import { Logo } from '../componentes/Logo'
import { Modal } from '../componentes/Modal'
import { Octogono } from '../componentes/Octogono'
import { Revelar, TextoRevelado } from '../componentes/Revelar'
import { integracoes } from '../config/empresa'
import { produtos } from '../conteudo/produtos'
import { usePonteiroFino, useReduzirMovimento } from '../lib/movimento'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'

function Livro() {
  const fino = usePonteiroFino()
  const reduzir = useReduzirMovimento()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 70, damping: 14 })
  const smy = useSpring(my, { stiffness: 70, damping: 14 })
  const rotY = useTransform(smx, (v) => 22 + v * 14)
  const rotX = useTransform(smy, (v) => 7 - v * 9)

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (!fino || reduzir || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div className="livro relative mx-auto w-[min(72vw,380px)]" onPointerMove={mover} onPointerLeave={() => (mx.set(0), my.set(0))}>
      <m.div className="livro__corpo" style={{ rotateY: rotY, rotateX: rotX }}>
        <div className="livro__paginas" />
        <div className="livro__lombada" />
        <div className="livro__miolo flex flex-col justify-between bg-papel p-[9%] text-tinta">
          <div>
            <p className="rotulo text-[0.55rem] text-chumbo">Índice</p>
            <ul className="mt-4 space-y-2 text-[0.72rem] font-semibold">
              {['Espaçador 1,0 mm', 'Espaçador 1,5 mm', 'Espaçador 2,0 mm', 'Cunha SLIM'].map((l, i) => (
                <li key={l} className="flex justify-between border-b border-tinta/10 pb-1.5">
                  <span>{l}</span>
                  <span className="font-mono text-chumbo">0{i + 1}</span>
                </li>
              ))}
            </ul>
          </div>
          <Octogono className="size-4 text-violeta" />
        </div>
        <div className="livro__capa grao bg-tinta text-papel">
          <div className="malha-escura absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative flex h-full flex-col justify-between p-[9%]">
            <div className="flex items-start justify-between">
              <Logo decorativo className="h-[7%] min-h-[18px] w-auto" corPonto="var(--color-violeta-claro)" />
              <span className="rotulo text-[0.5rem] text-nevoa">Produtos</span>
            </div>
            <div className="relative -mx-[4%] flex h-[46%] items-end justify-center">
              {[produtos[0], produtos[1], produtos[2]].map((p, i) => (
                <div
                  key={p.slug}
                  className="absolute bottom-0 h-full"
                  style={{ transform: `translateX(${(i - 1) * 34}%) rotate(${(i - 1) * 8}deg)`, zIndex: i === 1 ? 2 : 1 }}
                >
                  <ImagemProduto produto={p} tamanhos="140px" className="h-full w-auto drop-shadow-[0_16px_18px_rgba(0,0,0,0.45)]" alt="" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-[clamp(1.4rem,4.2vw,2.15rem)] font-bold leading-[0.95] tracking-[-0.035em] [font-stretch:115%]">
                Catálogo de
                <br />
                produtos
              </p>
              <p className="mt-3 text-[0.6rem] leading-snug text-nevoa">Soluções inteligentes para um mundo em construção.</p>
            </div>
          </div>
        </div>
      </m.div>
      <div className="livro__sombra" aria-hidden="true" />
    </div>
  )
}

export function Catalogo() {
  const [aberto, setAberto] = useState(false)
  const pdf = integracoes.catalogoPdf

  return (
    <section id="catalogo" className="grao empilhada adiar-render z-10 overflow-hidden bg-violeta text-white" data-tema="escuro" aria-labelledby="titulo-catalogo">
      <Octogono contorno className="pointer-events-none absolute -left-[12vw] -top-[18vw] size-[46vw] text-white/10" />
      <Octogono contorno className="pointer-events-none absolute -bottom-[22vw] right-[-8vw] size-[52vw] text-white/10" />
      <div className="container-site secao relative grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <Revelar className="lg:col-span-5">
          <Livro />
        </Revelar>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="rotulo flex items-center gap-3 text-white/70">
            <Octogono className="size-2 text-white" />
            <span className="text-white">06</span>
            <span className="h-px w-8 bg-current opacity-50" />
            Catálogo
          </p>
          <TextoRevelado id="titulo-catalogo" texto="Todos os nossos produtos em um só lugar." className="display-l mt-8 max-w-[12ch]" classeDestaque="" />
          <Revelar atraso={0.1}>
            <p className="texto-corpo mt-8 max-w-lg text-white/80 texto-bonito">
              Conheça os produtos Codali. Navegue pelo catálogo digital do site ou solicite o catálogo em PDF à nossa equipe.
            </p>
          </Revelar>
          <Revelar atraso={0.2} className="mt-10 flex flex-wrap gap-3">
            {pdf ? (
              <>
                <Botao variante="claro" onClick={() => setAberto(true)} icone={<FileText size={16} />} magnetico>
                  Visualizar catálogo
                </Botao>
                <Botao href={pdf} download variante="contorno-escuro" icone={<Download size={16} />} direcao="baixo">
                  Baixar PDF
                </Botao>
              </>
            ) : (
              <Botao href={linkWhatsApp(mensagensWhatsApp.catalogo)} variante="claro" icone={<IconeWhatsApp tamanho={16} />} magnetico>
                Receber catálogo no WhatsApp
              </Botao>
            )}
            <Botao para="/produtos" variante="contorno-escuro">
              Catálogo digital
            </Botao>
          </Revelar>
        </div>
      </div>

      {pdf && (
        <Modal aberto={aberto} aoFechar={() => setAberto(false)} titulo="Catálogo de produtos Codali">
          <div className="flex flex-wrap gap-3 px-5 pb-4 sm:px-7">
            <a href={pdf} target="_blank" rel="noopener noreferrer" className="link-linha inline-flex items-center gap-2 text-sm text-papel">
              <ExternalLink size={15} /> Abrir em nova aba
            </a>
            <a href={pdf} download className="link-linha inline-flex items-center gap-2 text-sm text-papel">
              <Download size={15} /> Baixar PDF
            </a>
          </div>
          <iframe src={`${pdf}#view=FitH`} title="Catálogo de produtos Codali (PDF)" className="h-[72vh] w-full bg-white" />
        </Modal>
      )}
    </section>
  )
}
