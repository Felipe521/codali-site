/// <reference types="vite/client" />

declare const __ANO__: number

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT?: string
  readonly VITE_FORM_ACCESS_KEY?: string
  readonly VITE_CATALOGO_URL?: string
  readonly VITE_POLITICA_PRIVACIDADE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
