import './index.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { resolverRota } from './lib/roteador'
import { carregarPagina } from './paginas/registro'

const raiz = document.getElementById('root')!
// Baixa só o código da página atual antes de hidratar (o HTML já está na tela).
await carregarPagina(resolverRota(window.location.pathname).nome)
const aplicacao = (
  <StrictMode>
    <App url={window.location.pathname} />
  </StrictMode>
)

// Em produção o HTML já vem pré-renderizado: hidrata. Em desenvolvimento, renderiza do zero.
if (raiz.firstElementChild) hydrateRoot(raiz, aplicacao)
else createRoot(raiz).render(aplicacao)
