import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { createElement, useEffect, useRef, useState } from 'react'
import { Cabecalho } from './componentes/Cabecalho'
import { Cortina, type FaseCortina } from './componentes/Cortina'
import { Cursor } from './componentes/Cursor'
import { ProgressoRolagem } from './componentes/ProgressoRolagem'
import { Rodape } from './componentes/Rodape'
import { aplicarMeta, metaDaRota } from './config/seo'
import { produtoPorSlug } from './conteudo/produtos'
import { useEfeitoIsomorfico } from './lib/movimento'
import { ProvedorRolagem, useRolagem } from './lib/rolagem'
import { resolverRota, Roteador, useRoteador, type Local, type Rota } from './lib/roteador'
import { carregarPagina, paginaCarregada } from './paginas/registro'

/** A página vem do registro (já carregada antes de ser exibida); a identidade do componente é estável. */
function Pagina({ rota }: { rota: Rota }) {
  const componente = paginaCarregada(rota.nome)
  if (!componente) return null
  return createElement(componente, rota.nome === 'produto' ? { slug: rota.slug } : null)
}

function nomeDaRota(rota: Rota): string {
  switch (rota.nome) {
    case 'inicio':
      return 'Codali'
    case 'produtos':
      return 'Produtos'
    case 'produto':
      return produtoPorSlug(rota.slug)?.nome ?? 'Produto'
    case 'revendedor':
      return 'Revendedor'
    case 'representante':
      return 'Representante'
    default:
      return 'Codali'
  }
}

const COBRIR_MS = 680
const REVELAR_MS = 950

function Estrutura() {
  const { local } = useRoteador()
  const { rolarPara } = useRolagem()
  const [exibido, setExibido] = useState<Local>(local)
  const [fase, setFase] = useState<FaseCortina>('parada')
  const [rotuloCortina, setRotuloCortina] = useState('')
  const [anuncio, setAnuncio] = useState('')
  const exibidoRef = useRef(exibido)
  const principal = useRef<HTMLElement>(null)

  useEffect(() => {
    exibidoRef.current = exibido
  }, [exibido])

  // Troca de página com a cortina cobrindo a tela
  useEffect(() => {
    const atual = exibidoRef.current
    if (local.chave === atual.chave) return
    if (local.caminho === atual.caminho) {
      setExibido(local)
      return
    }
    const destino = resolverRota(local.caminho)
    setRotuloCortina(nomeDaRota(destino))
    let cancelado = false
    let t2 = 0
    // O código da página de destino é baixado enquanto a cortina cobre a tela.
    const carregamento = carregarPagina(destino.nome)
    const recarregar = () => window.location.assign(local.caminho + local.busca + local.hash)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      carregamento.then(() => !cancelado && setExibido(local), recarregar)
      return () => {
        cancelado = true
      }
    }
    setFase('cobrindo')
    const cobertura = new Promise((ok) => window.setTimeout(ok, COBRIR_MS))
    Promise.all([carregamento, cobertura]).then(() => {
      if (cancelado) return
      setExibido(local)
      setFase('revelando')
      t2 = window.setTimeout(() => setFase('parada'), REVELAR_MS)
    }, recarregar)
    return () => {
      cancelado = true
      window.clearTimeout(t2)
    }
  }, [local])

  // Depois que a nova página está no DOM: rolagem, foco, metatags e anúncio
  useEfeitoIsomorfico(() => {
    const meta = metaDaRota(resolverRota(exibido.caminho))
    aplicarMeta(meta)
    if (exibido.origem === 'inicial') {
      const hash = window.location.hash
      if (hash) requestAnimationFrame(() => rolarPara(hash, { imediato: true }))
      return
    }
    if (exibido.hash) rolarPara(exibido.hash, { imediato: true })
    else rolarPara(exibido.origem === 'pop' ? (exibido.rolagem ?? 0) : 0, { imediato: true })
    if (!exibido.hash) principal.current?.focus({ preventScroll: true })
    setAnuncio(`Página carregada: ${meta.titulo}`)
  }, [exibido.chave])

  const rota = resolverRota(exibido.caminho)

  return (
    <>
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <ProgressoRolagem />
      <Cabecalho rota={rota} />
      <main id="conteudo" ref={principal} tabIndex={-1} className="outline-none">
        <Pagina key={exibido.caminho} rota={rota} />
      </main>
      <Rodape />
      <Cursor />
      <Cortina fase={fase} rotulo={rotuloCortina} />
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>
    </>
  )
}

export function App({ url }: { url: string }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ProvedorRolagem>
          <Roteador url={url}>
            <Estrutura />
          </Roteador>
        </ProvedorRolagem>
      </MotionConfig>
    </LazyMotion>
  )
}
