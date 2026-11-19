import type { Produto } from '../conteudo/produtos'

type Props = {
  produto: Produto
  tamanhos?: string
  prioridade?: boolean
  className?: string
  alt?: string
}

/** Foto original da embalagem em AVIF/WebP responsivos. */
export function ImagemProduto({ produto, tamanhos = '(min-width: 1024px) 34vw, 80vw', prioridade = false, className, alt }: Props) {
  const { base, largura, altura, larguraPequena } = produto.imagem
  const srcset = (ext: string) => `${base}-480.${ext} ${larguraPequena}w, ${base}-full.${ext} ${largura}w`
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcset('avif')} sizes={tamanhos} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={tamanhos} />
      <img
        src={`${base}-full.webp`}
        width={largura}
        height={altura}
        alt={alt ?? produto.imagem.alt}
        loading={prioridade ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={prioridade ? 'high' : 'auto'}
        draggable={false}
        className={className}
      />
    </picture>
  )
}
