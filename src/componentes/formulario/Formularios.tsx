import { useEffect } from 'react'
import { produtoPorSlug } from '../../conteudo/produtos'
import { documentoValido, emailValido, mascaraDocumento, mascaraTelefone, telefoneValido, UFS } from '../../lib/validacao'
import { CampoArea, CampoSelecao, CampoTexto } from './Campos'
import { Formulario, useFormulario, type DefCampo } from './Formulario'

const regraEmail = (v: string) => (emailValido(v) ? null : 'Informe um e-mail válido, como nome@empresa.com.br.')
const regraTelefone = (v: string) => (telefoneValido(v) ? null : 'Informe um número com DDD, como (41) 99999-9999.')
const regraDocumento = (v: string) => (documentoValido(v) ? null : 'CPF ou CNPJ inválido. Confira os números digitados.')
const regraNome = (v: string) => (v.trim().length >= 3 ? null : 'Informe o nome completo.')

/* ------------------------------------------------------------------ Contato */

const defsContato: DefCampo[] = [
  { nome: 'nome', rotulo: 'Nome completo', obrigatorio: true, validar: regraNome },
  { nome: 'telefone', rotulo: 'WhatsApp ou telefone', obrigatorio: true, validar: regraTelefone, mascara: mascaraTelefone },
  { nome: 'email', rotulo: 'E-mail', obrigatorio: true, validar: regraEmail },
  { nome: 'assunto', rotulo: 'Assunto' },
  { nome: 'mensagem', rotulo: 'Mensagem', obrigatorio: true, validar: (v) => (v.trim().length >= 10 ? null : 'Conte um pouco mais (mínimo de 10 caracteres).') },
]

const assuntosContato: Array<[string, string]> = [
  ['Informações sobre produtos', 'Informações sobre produtos'],
  ['Orçamento', 'Orçamento'],
  ['Revenda', 'Quero revender'],
  ['Representação', 'Quero representar'],
  ['Outro assunto', 'Outro assunto'],
]

export function FormularioContato({ tema = 'escuro' }: { tema?: 'escuro' | 'claro' }) {
  const f = useFormulario('contato', defsContato)
  return (
    <Formulario
      tipo="contato"
      controle={f}
      defs={defsContato}
      tema={tema}
      assunto={`Contato pelo site${f.valores.assunto ? ` — ${f.valores.assunto}` : ''}`}
      tituloMensagem="Olá, Codali! Vim pelo site e gostaria de falar com vocês."
      rotuloEnviar="Enviar mensagem"
    >
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <CampoTexto {...f.registrar('nome')} autoComplete="name" className="sm:col-span-2" />
        <CampoTexto {...f.registrar('telefone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="(41) 99999-9999" />
        <CampoTexto {...f.registrar('email')} type="email" inputMode="email" autoComplete="email" placeholder="nome@empresa.com.br" />
        <CampoSelecao {...f.registrar('assunto')} opcoes={assuntosContato} className="sm:col-span-2" />
        <CampoArea {...f.registrar('mensagem')} className="sm:col-span-2" placeholder="Como podemos ajudar?" />
      </div>
    </Formulario>
  )
}

/* -------------------------------------------------------------- Revendedor */

const defsRevendedor: DefCampo[] = [
  { nome: 'nome', rotulo: 'Nome completo', obrigatorio: true, validar: regraNome },
  { nome: 'empresa', rotulo: 'Empresa', obrigatorio: true },
  { nome: 'documento', rotulo: 'CNPJ ou CPF', obrigatorio: true, validar: regraDocumento, mascara: mascaraDocumento },
  { nome: 'tipoNegocio', rotulo: 'Tipo de negócio' },
  { nome: 'cidade', rotulo: 'Cidade', obrigatorio: true },
  { nome: 'uf', rotulo: 'Estado', obrigatorio: true },
  { nome: 'email', rotulo: 'E-mail', obrigatorio: true, validar: regraEmail },
  { nome: 'celular', rotulo: 'Celular / WhatsApp', obrigatorio: true, validar: regraTelefone, mascara: mascaraTelefone },
  { nome: 'telefone', rotulo: 'Telefone fixo', validar: regraTelefone, mascara: mascaraTelefone },
  { nome: 'interesse', rotulo: 'Produtos de interesse' },
  { nome: 'mensagem', rotulo: 'Observações' },
]

const tiposNegocio: Array<[string, string]> = [
  ['Loja de materiais de construção', 'Loja de materiais de construção'],
  ['Revenda de acabamentos e revestimentos', 'Revenda de acabamentos e revestimentos'],
  ['Home center', 'Home center'],
  ['Loja de ferragens', 'Loja de ferragens'],
  ['Distribuidor', 'Distribuidor'],
  ['Outro', 'Outro'],
]

export function FormularioRevendedor({ produtoInicial }: { produtoInicial?: string }) {
  const f = useFormulario('revenda', defsRevendedor)
  const { definir } = f

  useEffect(() => {
    if (!produtoInicial) return
    const p = produtoPorSlug(produtoInicial)
    if (p) definir('interesse', p.nome)
  }, [produtoInicial, definir])

  return (
    <Formulario
      tipo="revendedor"
      controle={f}
      defs={defsRevendedor}
      tema="claro"
      assunto={`Cadastro de revendedor — ${f.valores.empresa || 'novo contato'}`}
      tituloMensagem="Olá, Codali! Quero ser revendedor. Seguem meus dados:"
      rotuloEnviar="Enviar cadastro"
    >
      <fieldset className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <legend className="rotulo mb-7 text-violeta">01 — Sua empresa</legend>
        <CampoTexto {...f.registrar('nome')} autoComplete="name" />
        <CampoTexto {...f.registrar('empresa')} autoComplete="organization" placeholder="Razão social ou nome fantasia" />
        <CampoTexto {...f.registrar('documento')} inputMode="text" autoCapitalize="characters" placeholder="00.000.000/0000-00" />
        <CampoSelecao {...f.registrar('tipoNegocio')} opcoes={tiposNegocio} />
        <CampoTexto {...f.registrar('cidade')} autoComplete="address-level2" />
        <CampoSelecao {...f.registrar('uf')} opcoes={UFS.map(([sigla, nome]) => [sigla, `${nome} (${sigla})`])} />
      </fieldset>
      <fieldset className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <legend className="rotulo mb-7 text-violeta">02 — Contato</legend>
        <CampoTexto {...f.registrar('email')} type="email" inputMode="email" autoComplete="email" className="sm:col-span-2" />
        <CampoTexto {...f.registrar('celular')} type="tel" inputMode="tel" autoComplete="tel" placeholder="(41) 99999-9999" />
        <CampoTexto {...f.registrar('telefone')} type="tel" inputMode="tel" placeholder="Opcional" />
      </fieldset>
      <fieldset className="mt-12 grid gap-x-8 gap-y-7">
        <legend className="rotulo mb-7 text-violeta">03 — Interesse</legend>
        <CampoTexto {...f.registrar('interesse')} placeholder="Ex.: Espaçador 1,5 mm SLIM, cunha…" />
        <CampoArea {...f.registrar('mensagem')} placeholder="Conte um pouco sobre o seu negócio (opcional)" />
      </fieldset>
    </Formulario>
  )
}

/* ----------------------------------------------------------- Representante */

const defsRepresentante: DefCampo[] = [
  { nome: 'nome', rotulo: 'Nome do representante', obrigatorio: true, validar: regraNome },
  { nome: 'documento', rotulo: 'CNPJ ou CPF', obrigatorio: true, validar: regraDocumento, mascara: mascaraDocumento },
  { nome: 'email', rotulo: 'E-mail', obrigatorio: true, validar: regraEmail },
  { nome: 'celular', rotulo: 'Celular / WhatsApp', obrigatorio: true, validar: regraTelefone, mascara: mascaraTelefone },
  { nome: 'telefone', rotulo: 'Telefone fixo', validar: regraTelefone, mascara: mascaraTelefone },
  { nome: 'regiao', rotulo: 'Região de atuação', obrigatorio: true },
  { nome: 'outrasMarcas', rotulo: 'Já representa outras marcas?' },
  { nome: 'segmentos', rotulo: 'Segmentos que atende' },
  { nome: 'mensagem', rotulo: 'Observações' },
]

export function FormularioRepresentante() {
  const f = useFormulario('representacao', defsRepresentante)
  return (
    <Formulario
      tipo="representante"
      controle={f}
      defs={defsRepresentante}
      tema="claro"
      assunto={`Cadastro de representante — ${f.valores.nome || 'novo contato'}`}
      tituloMensagem="Olá, Codali! Quero ser representante. Seguem meus dados:"
      rotuloEnviar="Enviar cadastro"
    >
      <fieldset className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <legend className="rotulo mb-7 text-violeta">01 — Quem é você</legend>
        <CampoTexto {...f.registrar('nome')} autoComplete="name" />
        <CampoTexto {...f.registrar('documento')} inputMode="text" autoCapitalize="characters" placeholder="CPF ou CNPJ" />
        <CampoTexto {...f.registrar('email')} type="email" inputMode="email" autoComplete="email" className="sm:col-span-2" />
        <CampoTexto {...f.registrar('celular')} type="tel" inputMode="tel" autoComplete="tel" placeholder="(41) 99999-9999" />
        <CampoTexto {...f.registrar('telefone')} type="tel" inputMode="tel" placeholder="Opcional" />
      </fieldset>
      <fieldset className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <legend className="rotulo mb-7 text-violeta">02 — Sua atuação</legend>
        <CampoTexto {...f.registrar('regiao')} placeholder="Cidades ou estados que você atende" className="sm:col-span-2" />
        <CampoSelecao
          {...f.registrar('outrasMarcas')}
          opcoes={[
            ['Sim', 'Sim'],
            ['Não', 'Não'],
          ]}
        />
        <CampoTexto {...f.registrar('segmentos')} placeholder="Ex.: lojas de materiais, construtoras" />
        <CampoArea {...f.registrar('mensagem')} className="sm:col-span-2" placeholder="Conte um pouco sobre a sua experiência (opcional)" />
      </fieldset>
    </Formulario>
  )
}
