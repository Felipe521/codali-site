import { Phone } from 'lucide-react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { FormularioRepresentante, FormularioRevendedor } from '../componentes/formulario/Formularios'
import { IconeSeta, IconeWhatsApp } from '../componentes/Icones'
import { ImagemProduto } from '../componentes/ImagemProduto'
import { Octogono } from '../componentes/Octogono'
import { Revelar } from '../componentes/Revelar'
import { Rotulo } from '../componentes/Rotulo'
import { empresa } from '../config/empresa'
import { produtos } from '../conteudo/produtos'
import { Link, useRoteador } from '../lib/roteador'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'

type Passo = { titulo: string; texto: string }

function ModeloParceria({
  rotulo,
  titulo,
  destaque,
  texto,
  passos,
  visual,
  formulario,
  mensagemWhatsApp,
  outro,
}: {
  rotulo: string
  titulo: string
  destaque: string
  texto: string
  passos: Passo[]
  visual: ReactNode
  formulario: ReactNode
  mensagemWhatsApp: string
  outro: { rotulo: string; para: string }
}) {
  return (
    <>
      <section className="grao relative overflow-hidden bg-tinta pb-20 pt-36 text-papel lg:pb-28 lg:pt-48" data-tema="escuro" aria-labelledby="titulo-parceria">
        <div className="malha-escura pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[-15%] top-[-20%] size-[55vw] rounded-full bg-[radial-gradient(circle,rgb(125_17_240/0.25),transparent_65%)]" aria-hidden="true" />
        <div className="container-site relative grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <Rotulo texto={rotulo} />
            <h1 id="titulo-parceria" className="display-l mt-8 max-w-[11ch]">
              {titulo} <span className="text-violeta-claro">{destaque}</span>
            </h1>
            <p className="texto-corpo mt-8 max-w-lg text-nevoa texto-bonito">{texto}</p>
            <Link para="#cadastro" className="link-linha mt-10 inline-flex items-center gap-2 font-semibold">
              Ir para o cadastro <IconeSeta direcao="baixo" tamanho={15} />
            </Link>
          </div>
          <div className="lg:col-span-6">{visual}</div>
        </div>
      </section>

      <section className="relative bg-gesso text-tinta" data-tema="claro" aria-label="Como funciona">
        <div className="container-site py-16 lg:py-20">
          <ol className="grid gap-5 md:grid-cols-3">
            {passos.map((p, i) => (
              <Revelar key={p.titulo} como="li" atraso={i * 0.08} className="rounded-[1.5rem] bg-white p-7 ring-1 ring-tinta/10">
                <p className="rotulo flex items-center gap-3 text-violeta">
                  <Octogono className="size-2" /> Passo 0{i + 1}
                </p>
                <p className="display-s mt-5">{p.titulo}</p>
                <p className="mt-3 leading-relaxed text-chumbo">{p.texto}</p>
              </Revelar>
            ))}
          </ol>
        </div>
      </section>

      <section id="cadastro" className="relative scroll-mt-24 bg-papel text-tinta" data-tema="claro" aria-labelledby="titulo-cadastro">
        <div className="container-site grid gap-14 py-20 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="rotulo text-violeta">Cadastro</p>
              <h2 id="titulo-cadastro" className="display-m mt-5">
                Preencha e a nossa equipe entra em contato.
              </h2>
              <p className="mt-6 leading-relaxed text-chumbo">Campos com * são obrigatórios.</p>
              <div className="mt-10 rounded-[1.5rem] bg-gesso p-6">
                <p className="font-semibold">Prefere conversar?</p>
                <div className="mt-4 flex flex-col gap-3 text-sm">
                  <a href={linkWhatsApp(mensagemWhatsApp)} target="_blank" rel="noopener noreferrer" className="link-linha inline-flex items-center gap-2">
                    <IconeWhatsApp tamanho={16} /> WhatsApp {empresa.whatsapp.exibicao}
                  </a>
                  <a href={empresa.telefone.link} className="link-linha inline-flex items-center gap-2">
                    <Phone size={15} /> Telefone {empresa.telefone.exibicao}
                  </a>
                </div>
              </div>
              <Link para={outro.para} className="link-linha mt-8 inline-flex items-center gap-2 text-sm font-semibold text-chumbo hover:text-tinta">
                {outro.rotulo} <IconeSeta tamanho={14} />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-tinta/10 sm:p-10 lg:p-12">{formulario}</div>
          </div>
        </div>
      </section>
    </>
  )
}

function VitrineRevenda() {
  return (
    <div className="relative mx-auto aspect-[16/11] w-full max-w-[640px]">
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/[0.06] to-transparent ring-1 ring-white/10" />
      <div className="absolute inset-x-[7%] top-[17%] h-[5px] rounded-full bg-gradient-to-b from-[#c9c7c1] to-[#5d6268]" aria-hidden="true" />
      <div className="absolute inset-x-[9%] top-[17%] flex h-[66%] justify-between">
        {produtos.map((p, i) => (
          <div key={p.slug} className="gancheira__item flex w-[23%] flex-col items-center" style={{ '--i': i } as CSSProperties}>
            <span className="h-[8%] w-[3px] bg-[#8d9298]" aria-hidden="true" />
            <div className="gancheira__pacote -mt-[5%] h-[88%] origin-top">
              <ImagemProduto produto={p} prioridade={i < 2} tamanhos="(min-width: 1024px) 12vw, 22vw" className="h-full w-auto object-contain drop-shadow-[0_20px_22px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
        ))}
      </div>
      <p className="rotulo absolute bottom-4 left-6 text-nevoa">Linha SLIM · exposição em gancheira</p>
    </div>
  )
}

function MapaRepresentacao() {
  const nos = [
    [18, 22],
    [62, 12],
    [86, 36],
    [80, 72],
    [48, 86],
    [14, 66],
    [32, 44],
    [66, 52],
  ]
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[640px] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
      <div className="malha-escura absolute inset-0" />
      <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {nos.map(([x, y], i) => (
          <g key={i}>
            <path d={`M50 40L${x} ${y * 0.8}`} stroke="#fff" strokeOpacity="0.15" strokeWidth="0.25" />
            <path d={`M50 40L${x} ${y * 0.8}`} stroke="#c9a8ff" strokeWidth="0.55" strokeLinecap="round" pathLength={100} strokeDasharray="10 90" className="pulso" style={{ animationDelay: `${i * -0.4}s`, animationDuration: '2.6s' }} />
            <rect x={x - 1.4} y={y * 0.8 - 1.4} width="2.8" height="2.8" rx="0.6" fill="#121315" stroke="#a66cff" strokeWidth="0.4" />
          </g>
        ))}
        <circle cx="50" cy="40" r="7" fill="#7d11f0" opacity="0.2" className="respirar" style={{ transformOrigin: '50px 40px' }} />
        <path d="M47.1 36h5.8l4.1 4.1v5.8L52.9 50h-5.8L43 45.9v-5.8z" transform="translate(0 -3)" fill="#a66cff" />
      </svg>
      <p className="rotulo absolute bottom-4 left-6 text-nevoa">Representação comercial</p>
    </div>
  )
}

export function PaginaRevendedor() {
  const { local } = useRoteador()
  const [produto, setProduto] = useState<string | undefined>(undefined)
  useEffect(() => {
    setProduto(new URLSearchParams(local.busca).get('produto') ?? undefined)
  }, [local.busca])

  return (
    <ModeloParceria
      rotulo="Parcerias · Revenda"
      titulo="Leve a Codali para a sua"
      destaque="loja."
      texto="Seja um revendedor e venda os produtos Codali no seu negócio."
      passos={[
        { titulo: 'Cadastro', texto: 'Preencha os dados da sua empresa no formulário abaixo.' },
        { titulo: 'Envio', texto: 'Seus dados chegam à equipe Codali.' },
        { titulo: 'Contato', texto: 'A equipe Codali entra em contato com você em breve.' },
      ]}
      visual={<VitrineRevenda />}
      formulario={<FormularioRevendedor produtoInicial={produto} />}
      mensagemWhatsApp={mensagensWhatsApp.revenda}
      outro={{ rotulo: 'É representante comercial? Cadastre-se aqui', para: '/representante' }}
    />
  )
}

export function PaginaRepresentante() {
  return (
    <ModeloParceria
      rotulo="Parcerias · Representação"
      titulo="Represente uma marca que"
      destaque="constrói."
      texto="Venha ser um de nossos representantes, levando as soluções Codali aos seus clientes e entregando a melhor experiência para eles."
      passos={[
        { titulo: 'Cadastro', texto: 'Conte quem você é, onde atua e quais segmentos atende.' },
        { titulo: 'Envio', texto: 'Seus dados chegam à equipe Codali.' },
        { titulo: 'Contato', texto: 'A equipe Codali entra em contato com você em breve.' },
      ]}
      visual={<MapaRepresentacao />}
      formulario={<FormularioRepresentante />}
      mensagemWhatsApp={mensagensWhatsApp.representacao}
      outro={{ rotulo: 'Tem uma loja? Seja um revendedor', para: '/revendedor' }}
    />
  )
}
