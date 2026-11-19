# Codali — novo site institucional

Site institucional da Codali (*Soluções inteligentes para um mundo em construção.*), recriado do zero com foco em
apresentação de marca, vitrine de produtos e geração de contatos comerciais (revenda, representação, WhatsApp).

- **Stack:** Vite 8 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lenis (rolagem suave)
- **Saída:** HTML estático pré-renderizado por página (SEO, Open Graph e primeira pintura sem depender de JavaScript),
  com a CSS embutida, hidratado no navegador para as animações e interações. Cada página baixa só o próprio código.
- **Hospedagem:** qualquer servidor estático. Há um `.htaccess` pronto para Apache (Hostinger, onde o site atual está).

---

## Como executar

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run build      # gera dist/ com todas as páginas pré-renderizadas + sitemap.xml + robots.txt
npm run servir     # serve dist/ como em produção em http://localhost:4173 (use para apresentar)
npm run lint       # oxlint
```

Para apresentar o site numa reunião: `npm run build && npm run servir` e abra http://localhost:4173 em tela cheia.
Evite `npm run preview` (Vite): ele devolve a página inicial para rotas como `/produtos`, o que não representa a
produção.

### Publicação (Apache / Hostinger)
1. `npm run build`
2. Envie **o conteúdo** de `dist/` para a pasta pública (`public_html`), incluindo o `.htaccess`.
3. O `.htaccess` força HTTPS + `www`, serve URLs limpas (`/produtos`), define cache e compressão e usa `404.html`.

---

## Integrações que dependem da empresa

Copie `.env.example` para `.env`, preencha e rode `npm run build` de novo.

| Variável | Para quê | Sem ela, o site… |
|---|---|---|
| `VITE_FORM_ENDPOINT` | Receber os formulários (contato, revendedor, representante) via POST JSON. Funciona com Formspree, Web3Forms ou backend próprio que responda 2xx. | Troca o botão por **"Enviar … pelo WhatsApp"** e abre a conversa com todos os dados preenchidos. Nunca simula envio. |
| `VITE_FORM_ACCESS_KEY` | Chave exigida por alguns serviços (ex.: Web3Forms). | — |
| `VITE_CATALOGO_URL` | PDF do catálogo (ex.: `/catalogo/catalogo-codali.pdf`, com o arquivo em `public/catalogo/`). | Oferece **"Receber catálogo no WhatsApp"** + o catálogo digital do site. Com a variável, aparecem **Visualizar** (leitor integrado) e **Baixar PDF**. |
| `VITE_POLITICA_PRIVACIDADE_URL` | Link da política de privacidade no rodapé. | O link não aparece. |

Os envios com serviço configurado e o leitor de PDF foram testados com um serviço simulado (sucesso, erro 500 e
recusa do serviço).

### Dados opcionais
Em `src/config/empresa.ts` há campos vazios que só aparecem quando preenchidos: `razaoSocial`, `cnpj`, `endereco`,
`horarioAtendimento`.

---

## Itens a confirmar com a Codali

1. **E-mail de contato.** O site atual publica `contato@codali.com`, mas o domínio **codali.com está à venda** e não
   tem servidor de e-mail (sem registro MX). Mensagens enviadas para ele não chegam à empresa. O domínio da empresa,
   `codali.com.br`, tem e-mail ativo (Hostinger), então o novo site usa **`contato@codali.com.br`**. Confirmar se
   essa caixa existe (ou informar o endereço correto em `src/config/empresa.ts`).
2. **LinkedIn.** O site oficial lista `linkedin.com/company/jc-schmidt` como perfil da Codali. Confirmar.
3. **Textos-proposta** (marcados nos arquivos de conteúdo): descrições individuais dos cinco valores, texto
   "Quem somos", descrições dos produtos e etapas do processo de assentamento. Missão, visão, nomes dos valores e
   slogan foram mantidos do site oficial.
4. **Somente os produtos visíveis no site atual.** O site atual tem, ocultas no código, as linhas Ferramentas,
   Elétricos e Sustentáveis (e imagens com "Materiais para Automação" e "Materiais de Construção Civil"). Por
   decisão do cliente, o novo site mostra apenas os produtos que aparecem para o visitante: os 4 da linha SLIM.
   Para incluir novos produtos no futuro, cadastre-os em `src/conteudo/produtos.ts`.
5. **Especificações técnicas.** Das peças SLIM, usamos apenas o que está nas embalagens: tipo, medida da junta,
   100 unidades, cor das peças, EAN-13 (conferido pelo dígito verificador) e a frase "Reduz em até 50% do tempo de
   colocação" (sempre atribuída à embalagem). Material, dimensões e indicações de uso dependem de dados da empresa.
6. **Catálogo em PDF.** O botão "Catálogo 2023" do site atual aponta para `#`, e nenhum PDF está publicado.
7. **Política de privacidade (LGPD).** Os formulários coletam dados pessoais; recomenda-se publicar uma política.
8. **Catálogo.** O botão "Catálogo 2023" do site atual também está oculto; o novo site mantém a seção de catálogo
   (catálogo digital + pedido do PDF pelo WhatsApp), apenas com a linha SLIM.
9. **Redes sociais** aparecem no site atual só nos metadados (não visíveis); o novo site as exibe.
10. **Formulários:** além dos campos do site atual, foram incluídos Cidade, Tipo de negócio, Produtos de interesse e
    Observações (revenda); Já representa outras marcas? e Segmentos (representação); Assunto (contato, com a opção
    "Orçamento"). Podem ser removidos se a empresa preferir os formulários originais.

---

## Estrutura

```
src/
  config/        empresa.ts (dados oficiais + integrações) · seo.ts (títulos, metatags, JSON-LD)
  conteudo/      produtos.ts · institucional.ts · processo.ts  ← textos e dados editáveis
  lib/           roteador · rolagem (Lenis) · validação (CPF/CNPJ alfanumérico/telefone) · envio · WhatsApp
  componentes/   Cabeçalho, Rodapé, Botão, Logo (vetorizado), Cursor, Cortina, Modal, formulários…
  secoes/        Hero, Manifesto, Quem somos, Produtos, Processo, Valores, Catálogo, Parceiros, Contato
  paginas/       Início · Catálogo digital · Produto · Revendedor/Representante · 404
  estilos/       base · hero · componentes (Tailwind 4 em camadas)
scripts/prerender.mjs   gera o HTML de cada rota, sitemap.xml e robots.txt
public/img/             produtos (AVIF/WebP), og (imagens de compartilhamento), textura
originais/              arquivos originais da Codali (fotos das embalagens, logo PNG e logo vetorizado)
```

**Adicionar um produto:** inclua um item em `src/conteudo/produtos.ts`, coloque as imagens em
`public/img/produtos/` (`nome-480.avif|webp` e `nome-full.avif|webp`) e uma imagem 1200×630 em `public/img/og/`.
A página `/produtos/<slug>` é gerada automaticamente.

---

## Decisões criativas

- **Conceito "o plano perfeito":** a abertura mostra um piso de porcelanato em perspectiva cujas peças surgem
  desniveladas. Um feixe de nível a laser percorre o plano, cada peça assenta e os espaçadores acendem nas
  junções. É a função do produto principal da Codali (nivelamento) transformada em cena de abertura.
- **O octógono do logotipo** (o ponto violeta do "o") virou o sistema gráfico: fonte de luz do hero, cursor,
  marcadores, transição entre páginas e farol da maquete.
- **Paleta:** grafite `#25282A` e violeta `#7D11F0` (as cores oficiais, extraídas do CSS do site), mais neutros
  minerais (cimento, gesso, papel). As cores das peças SLIM (verde, vermelho, lilás, cinza) iluminam a vitrine.
- **Tipografia:** Archivo variável (peso e largura). Títulos expandidos dão um tom industrial e arquitetônico, e
  IBM Plex Mono faz as anotações técnicas, como cotas, figuras e rótulos.
- **Direção de arte sem banco de imagens:** as fotos institucionais do site atual são de banco, com duotone, texto
  embutido e baixa resolução. O novo site usa as **fotos reais das embalagens** como protagonistas e ilustrações
  técnicas animadas: maquete isométrica, corte do assentamento e edifício em desenho técnico.
- **Narrativa de rolagem:** o manifesto acende palavra por palavra enquanto um edifício é desenhado. Na sequência
  "Cada detalhe constrói o resultado", um corte técnico mostra preparação, precisão, aplicação e resultado, com
  seletor de junta de 1,0, 1,5 e 2,0 mm. As seções deslizam umas sobre as outras como folhas sobrepostas.
- **Valores como princípios construtivos:** amarração, precisão, prumo, junta e alicerce, numa composição
  geométrica que se transforma.

## Melhorias em relação ao site atual

| Site atual | Novo site |
|---|---|
| Página única, sem H1, 14 de 16 imagens sem texto alternativo | 9 páginas pré-renderizadas, H1 único por página, todas as imagens com alt |
| "Catálogo 2023" oculto e apontando para `#`; sem página de produto | Catálogo digital, ficha por produto e leitor de PDF pronto |
| Telefone/WhatsApp como texto; e-mail em domínio à venda | WhatsApp com mensagem pronta por contexto, `tel:` e `mailto:` clicáveis |
| Redes sociais só nos metadados | Redes visíveis no contato, menu e rodapé |
| Formulários com placeholders em inglês e validação mínima | Validação de CPF, CNPJ (inclusive alfanumérico), telefone e e-mail, com mensagens acessíveis |
| Sem rodapé, sem página de produto | Rodapé completo, páginas de produto com EAN, compartilhamento e JSON-LD de Produto |
| Imagens PNG pesadas, de baixa resolução | AVIF/WebP responsivos e imagens de compartilhamento (Open Graph) por página |

## Desempenho

Medições da página inicial, versão original × otimizada:

| Medição | Original | Otimizada |
|---|---|---|
| Lighthouse celular (limitação aplicada) | 93–95 | **100** |
| Primeira pintura (FCP), celular 4G lento | 1,9 s | **1,0 s** |
| Maior pintura (LCP), celular 4G lento | 2,4–2,7 s | **1,0 s** |
| Fontes baixadas | 121 KB | **63 KB** |
| Thread principal com a página parada no hero (CPU 4× mais lenta, 4 s) | 2.560 ms | **121 ms** |
| JavaScript durante a rolagem completa (CPU 4×) | 2.279 ms | **605 ms** |
| Quadros lentos na rolagem | 0,8% | **0%** |

O que foi feito e **deve ser preservado** em manutenções:
- **Fontes recortadas** (`src/fontes/`): só os caracteres do português (Latin-1 + pontuação) e as faixas de peso
  (400–800) e largura (100–125%) usadas. Os originais estão em `originais/fontes/`. Archivo e IBM Plex Mono são
  distribuídas sob a SIL Open Font License 1.1 (textos em `src/fontes/OFL-*.txt`, válidos também para os originais). Para regerar (requer
  `pip install fonttools brotli`):
  ```bash
  fonttools varLib.instancer originais/fontes/archivo-latin-wdth-normal.woff2 wght=400:800 wdth=100:125 -o /tmp/a.ttf
  pyftsubset /tmp/a.ttf --unicodes="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-2019,U+201C-201D,U+2022,U+2026,U+2190-2193,U+2212,U+221E" --flavor=woff2 --output-file=src/fontes/archivo-codali.woff2
  ```
- **Código por página** (`src/paginas/registro.ts`): a home não baixa o código das outras páginas e vice-versa; o
  código da página de destino é baixado durante a cortina de transição (e pré-carregado ao passar o mouse no link).
  Uma página nova precisa ser registrada em `registro.ts` e em `src/entry-server.tsx`.
- **CSS embutida no HTML e `<head>` ordenado** (`scripts/prerender.mjs`): a CSS vem primeiro; fonte e JavaScript, depois.
- **Hero leve**: depois da abertura (2,7 s) o piso de porcelanato deixa de ser ~100 planos 3D e vira uma camada só;
  o brilho que atravessa o piso anima só `transform`; os textos do hero esperam a fonte da marca (no máximo 2,5 s)
  para não trocar de fonte no meio da animação.
- **Nada de trabalho por quadro**: cabeçalho e índice lateral usam `IntersectionObserver`; animações decorativas
  pausam fora da tela (`usePausarForaDaTela`).
- **Render adiado** (`.adiar-render`, `content-visibility: auto`) nas seções abaixo da dobra sem elementos fixos
  (`sticky`). Saltos de rolagem devem passar por `rolarPara()` (de `src/lib/rolagem.tsx`), que desenha tudo antes
  de medir; não aplique a classe em seções com `position: sticky`.

## Testes realizados

- **175 verificações automatizadas:** rotas, links internos e externos, âncoras, imagens, textos alternativos,
  nomes acessíveis, formulários (validação, máscaras, CPF/CNPJ, envio pelo WhatsApp), navegação com transição,
  voltar e avançar com posição de rolagem, teclado na vitrine, menu do celular, ausência de rolagem horizontal
  em 390 px, movimento reduzido e 404.
- **21 verificações de integração:** serviço de formulários (sucesso, erro 500, recusa) e leitor de PDF.
- **Lighthouse:** desktop 100/100/100/100 (desempenho, acessibilidade, boas práticas, SEO), com CLS 0. Celular:
  desempenho 100 com limitação aplicada (93 no modo simulado padrão), acessibilidade, boas práticas e SEO 100.
- Console sem erros em todas as páginas.

## Direção fotográfica sugerida (para substituir as ilustrações quando houver produção própria)

1. Embalagens SLIM em estúdio: fundo neutro, luz lateral suave, uma foto por medida e a cunha.
2. Macro das peças fora da embalagem (espaçador e cunha), com a junta medida em escala.
3. Instalação real: peças de porcelanato grande formato com os espaçadores aplicados, em luz de fim de tarde.
4. Ambientes concluídos: piso nivelado em arquitetura contemporânea (o "resultado").
5. Exposição em loja: as embalagens em gancheira (para a página de revenda).
