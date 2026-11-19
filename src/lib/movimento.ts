import { useEffect, useLayoutEffect, useState } from 'react'

/**
 * Todos os hooks de mídia começam com "false" (igual ao HTML pré-renderizado)
 * e só leem o navegador depois da hidratação — evita divergências.
 */
export function useMidia(consulta: string): boolean {
  const [corresponde, setCorresponde] = useState(false)
  useEffect(() => {
    const midia = window.matchMedia(consulta)
    const atualizar = () => setCorresponde(midia.matches)
    atualizar()
    midia.addEventListener('change', atualizar)
    return () => midia.removeEventListener('change', atualizar)
  }, [consulta])
  return corresponde
}

export const useReduzirMovimento = () => useMidia('(prefers-reduced-motion: reduce)')
export const usePonteiroFino = () => useMidia('(hover: hover) and (pointer: fine)')
export const useTelaLarga = () => useMidia('(min-width: 1024px)')

export function useMontado(): boolean {
  const [montado, setMontado] = useState(false)
  useEffect(() => setMontado(true), [])
  return montado
}

export const useEfeitoIsomorfico = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Altura da janela (atualiza no redimensionamento). */
export function useAlturaJanela(): number {
  const [altura, setAltura] = useState(900)
  useEffect(() => {
    const atualizar = () => setAltura(window.innerHeight)
    atualizar()
    window.addEventListener('resize', atualizar)
    return () => window.removeEventListener('resize', atualizar)
  }, [])
  return altura
}
