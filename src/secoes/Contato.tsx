import { Mail, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { FormularioContato } from '../componentes/formulario/Formularios'
import { IconeRede, IconeSeta, IconeWhatsApp } from '../componentes/Icones'
import { Revelar, TextoRevelado } from '../componentes/Revelar'
import { Rotulo } from '../componentes/Rotulo'
import { empresa } from '../config/empresa'
import { linkWhatsApp, mensagensWhatsApp } from '../lib/whatsapp'

function Canal({ href, icone, rotulo, valor, externo = false }: { href: string; icone: ReactNode; rotulo: string; valor: string; externo?: boolean }) {
  return (
    <li>
      <a
        href={href}
        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group flex items-center gap-5 border-b border-white/10 py-5 transition-colors duration-500 hover:border-violeta-claro/60"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/15 text-papel transition-colors duration-500 group-hover:border-violeta group-hover:bg-violeta">
          {icone}
        </span>
        <span className="min-w-0 flex-1">
          <span className="rotulo block text-nevoa">{rotulo}</span>
          <span className="mt-1 block truncate text-lg font-semibold transition-transform duration-500 group-hover:translate-x-1 sm:text-xl">{valor}</span>
        </span>
        <IconeSeta className="shrink-0 text-nevoa transition-all duration-500 group-hover:rotate-45 group-hover:text-papel" />
        {externo && <span className="sr-only">(abre em nova aba)</span>}
      </a>
    </li>
  )
}

export function Contato() {
  return (
    <section id="contato" className="grao empilhada adiar-render z-10 bg-tinta text-papel" data-tema="escuro" aria-labelledby="titulo-contato">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_70%_60%_at_80%_0%,rgb(125_17_240/0.22),transparent_70%)]" aria-hidden="true" />
      <div className="container-site secao relative">
        <Rotulo indice="08" texto="Contato" />
        <TextoRevelado id="titulo-contato" texto="Vamos construir algo juntos?" className="display-xl mt-8 max-w-[11ch]" destaques={['juntos?']} classeDestaque="text-violeta-claro" />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          <Revelar className="lg:col-span-5">
            <p className="texto-corpo max-w-md text-nevoa texto-bonito">
              Fale com a equipe Codali para conhecer os produtos, pedir um orçamento ou tirar dúvidas. Escolha o canal que preferir.
            </p>
            <ul className="mt-10 border-t border-white/10">
              <Canal href={linkWhatsApp(mensagensWhatsApp.geral)} externo icone={<IconeWhatsApp tamanho={19} />} rotulo="WhatsApp" valor={empresa.whatsapp.exibicao} />
              <Canal href={empresa.telefone.link} icone={<Phone size={18} />} rotulo="Telefone" valor={empresa.telefone.exibicao} />
              <Canal href={`mailto:${empresa.email}`} icone={<Mail size={18} />} rotulo="E-mail" valor={empresa.email} />
            </ul>
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Redes sociais">
              {empresa.redes.map((rede) => (
                <li key={rede.id}>
                  <a
                    href={rede.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/15 py-2.5 pl-3 pr-4 text-sm transition-colors duration-300 hover:border-violeta hover:bg-violeta"
                  >
                    <IconeRede id={rede.id} tamanho={16} />
                    {rede.nome}
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
            {empresa.horarioAtendimento && <p className="mt-8 text-sm text-nevoa">{empresa.horarioAtendimento}</p>}
          </Revelar>

          <Revelar atraso={0.12} className="lg:col-span-7">
            <div className="rounded-[1.75rem] bg-white/[0.035] p-6 ring-1 ring-white/10 sm:p-10 lg:p-12">
              <p className="rotulo text-nevoa">Envie uma mensagem</p>
              <div className="mt-8">
                <FormularioContato />
              </div>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  )
}
