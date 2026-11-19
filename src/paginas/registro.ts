import type { ComponentType } from 'react'
import type { Rota } from '../lib/roteador'

type NomePagina = Rota['nome']
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentePagina = ComponentType<any>

/**
 * Cada página vira um arquivo JavaScript separado: a página inicial não baixa o código
 * do catálogo, das fichas de produto e dos cadastros — e vice-versa.
 * No servidor (pré-renderização) as páginas são registradas de forma síncrona.
 */
const carregadores: Record<NomePagina, () => Promise<ComponentePagina>> = {
  inicio: () => import('./Inicio').then((m) => m.Inicio),
  produtos: () => import('./CatalogoDigital').then((m) => m.CatalogoDigital),
  produto: () => import('./PaginaProduto').then((m) => m.PaginaProduto),
  revendedor: () => import('./Parcerias').then((m) => m.PaginaRevendedor),
  representante: () => import('./Parcerias').then((m) => m.PaginaRepresentante),
  'nao-encontrada': () => import('./NaoEncontrada').then((m) => m.NaoEncontrada),
}

const carregadas = new Map<NomePagina, ComponentePagina>()
const pendentes = new Map<NomePagina, Promise<ComponentePagina>>()

export function registrarPagina(nome: NomePagina, componente: ComponentePagina) {
  carregadas.set(nome, componente)
}

export function paginaCarregada(nome: NomePagina): ComponentePagina | undefined {
  return carregadas.get(nome)
}

export function carregarPagina(nome: NomePagina): Promise<ComponentePagina> {
  const pronta = carregadas.get(nome)
  if (pronta) return Promise.resolve(pronta)
  let promessa = pendentes.get(nome)
  if (!promessa) {
    promessa = carregadores[nome]().then((componente) => {
      carregadas.set(nome, componente)
      pendentes.delete(nome)
      return componente
    })
    promessa.catch(() => pendentes.delete(nome))
    pendentes.set(nome, promessa)
  }
  return promessa
}
