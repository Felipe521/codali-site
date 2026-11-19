type PropsIcone = { className?: string; tamanho?: number }

const base = (tamanho: number, className?: string) => ({
  width: tamanho,
  height: tamanho,
  viewBox: '0 0 24 24',
  className,
  'aria-hidden': true as const,
  focusable: 'false' as const,
})

export function IconeWhatsApp({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg {...base(tamanho, className)} fill="none">
      <path
        d="M12 2.6a9.4 9.4 0 0 0-8.1 14.2L2.7 21.3l4.6-1.2A9.4 9.4 0 1 0 12 2.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        fill="currentColor"
        d="M8.7 7.4c.2-.4.4-.4.7-.4h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.5.6c-.1.2-.2.3 0 .6.4.7 1 1.4 1.6 1.9.7.6 1.3.9 1.7 1.1.2.1.4.1.5-.1l.7-.9c.2-.2.4-.3.6-.2l1.8.9c.3.1.4.2.4.4 0 .5-.1 1.1-.5 1.5-.5.5-1.4.9-2.3.8-1.5-.1-3.4-1-5-2.6-1.4-1.4-2.4-3.1-2.6-4.4-.2-1.1.2-1.9.6-2.3Z"
      />
    </svg>
  )
}

export function IconeInstagram({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg {...base(tamanho, className)} fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconeFacebook({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg {...base(tamanho, className)} fill="currentColor">
      <path d="M13.6 21v-7.7h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3.1Z" />
    </svg>
  )
}

export function IconeLinkedIn({ className, tamanho = 18 }: PropsIcone) {
  return (
    <svg {...base(tamanho, className)} fill="currentColor">
      <path d="M6.9 8.6H3.8V20h3.1V8.6ZM5.3 3.6a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.1c0-3-1.6-4.7-4.1-4.7-1.4 0-2.4.7-2.9 1.5V8.6h-3V20h3.1v-5.9c0-1.5.6-2.6 2-2.6 1.3 0 1.8 1 1.8 2.6V20h3.1v-6.9Z" />
    </svg>
  )
}

export function IconeRede({ id, className, tamanho }: PropsIcone & { id: string }) {
  if (id === 'instagram') return <IconeInstagram className={className} tamanho={tamanho} />
  if (id === 'facebook') return <IconeFacebook className={className} tamanho={tamanho} />
  return <IconeLinkedIn className={className} tamanho={tamanho} />
}

/** Seta diagonal com traço técnico (padrão dos botões). */
export function IconeSeta({ className, tamanho = 16, direcao = 'diagonal' }: PropsIcone & { direcao?: 'diagonal' | 'direita' | 'baixo' | 'esquerda' | 'cima' }) {
  const rotacao = { diagonal: 0, direita: 45, baixo: 135, esquerda: 225, cima: -45 }[direcao]
  return (
    <svg {...base(tamanho, className)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <g transform={`rotate(${rotacao} 12 12)`}>
        <path d="M7 17 17 7M8.5 7H17v8.5" />
      </g>
    </svg>
  )
}
