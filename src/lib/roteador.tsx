import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { produtoPorSlug } from '../conteudo/produtos'
import { carregarPagina } from '../paginas/registro'
import { useRolagem } from './rolagem'

export type Rota =
  | { nome: 'inicio' }
  | { nome: 'produtos' }
  | { nome: 'produto'; slug: string }
  | { nome: 'revendedor' }
  | { nome: 'representante' }
  | { nome: 'nao-encontrada' }

export type Local = {
  caminho: string
  busca: string
  hash: string
  chave: number
  origem: 'inicial' | 'push' | 'pop'
  rolagem?: number
}

export function normalizarCaminho(caminho: string): string {
  const limpo = caminho.replace(/\/{2,}/g, '/').replace(/\/+$/, '')
  return limpo === '' ? '/' : limpo
}

export function resolverRota(caminho: string): Rota {
  const c = normalizarCaminho(caminho)
  if (c === '/') return { nome: 'inicio' }
  if (c === '/produtos') return { nome: 'produtos' }
  const produto = c.match(/^\/produtos\/([a-z0-9-]+)$/)
  if (produto && produtoPorSlug(produto[1])) return { nome: 'produto', slug: produto[1] }
  if (c === '/revendedor') return { nome: 'revendedor' }
  if (c === '/representante') return { nome: 'representante' }
  return { nome: 'nao-encontrada' }
}

function interpretar(url: string, origem: Local['origem'], chave: number): Local {
  const u = new URL(url, 'https://www.codali.com.br')
  return { caminho: normalizarCaminho(u.pathname), busca: u.search, hash: u.hash, chave, origem }
}

type ContextoRoteador = {
  local: Local
  navegar: (destino: string, opcoes?: { substituir?: boolean }) => void
}

const Contexto = createContext<ContextoRoteador | null>(null)

/**
 * Roteador mínimo baseado na History API.
 * Na hidratação usa só o caminho (igual ao HTML pré-renderizado);
 * busca e hash são lidos depois, sem alterar a marcação inicial.
 */
export function Roteador({ url, children }: { url: string; children: ReactNode }) {
  const [local, setLocal] = useState<Local>(() => interpretar(url, 'inicial', 0))

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    setLocal((atual) => ({ ...atual, busca: window.location.search, hash: window.location.hash }))
    const aoVoltar = (evento: PopStateEvent) => {
      const estado = evento.state as { rolagem?: number } | null
      setLocal((atual) => ({
        ...interpretar(window.location.href, 'pop', atual.chave + 1),
        rolagem: estado?.rolagem ?? 0,
      }))
    }
    window.addEventListener('popstate', aoVoltar)
    return () => window.removeEventListener('popstate', aoVoltar)
  }, [])

  const navegar = useCallback((destino: string, { substituir = false }: { substituir?: boolean } = {}) => {
    const url = new URL(destino, window.location.href)
    if (url.origin !== window.location.origin) {
      window.location.assign(url.href)
      return
    }
    history.replaceState({ ...(history.state ?? {}), rolagem: window.scrollY }, '')
    const novo = url.pathname + url.search + url.hash
    if (substituir) history.replaceState({ rolagem: 0 }, '', novo)
    else history.pushState({ rolagem: 0 }, '', novo)
    setLocal((atual) => interpretar(novo, 'push', atual.chave + 1))
  }, [])

  const valor = useMemo(() => ({ local, navegar }), [local, navegar])
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useRoteador(): ContextoRoteador {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useRoteador precisa estar dentro de <Roteador>')
  return ctx
}

type PropsLink = ComponentProps<'a'> & { para: string }

/** Link interno: navega sem recarregar e rola suavemente para âncoras da mesma página. */
export function Link({ para, onClick, target, children, onPointerEnter, onFocus, ...resto }: PropsLink) {
  const { navegar } = useRoteador()
  const { rolarPara } = useRolagem()

  // Pré-carrega o código da página de destino quando o link recebe o ponteiro ou o foco.
  const preparar = () => {
    if (!para.startsWith('/')) return
    const caminho = new URL(para, window.location.href).pathname
    carregarPagina(resolverRota(caminho).nome).catch(() => {})
  }

  const aoClicar = (evento: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(evento)
    if (evento.defaultPrevented) return
    if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return
    if (target && target !== '_self') return
    const url = new URL(para, window.location.href)
    if (url.origin !== window.location.origin) return
    evento.preventDefault()
    if (normalizarCaminho(url.pathname) === normalizarCaminho(window.location.pathname)) {
      if (url.hash) {
        rolarPara(url.hash)
        history.replaceState(history.state, '', url.pathname + url.search + url.hash)
      } else {
        rolarPara(0)
      }
      return
    }
    navegar(para)
  }

  return (
    <a
      href={para}
      target={target}
      onClick={aoClicar}
      onPointerEnter={(e) => {
        preparar()
        onPointerEnter?.(e)
      }}
      onFocus={(e) => {
        preparar()
        onFocus?.(e)
      }}
      {...resto}
    >
      {children}
    </a>
  )
}
