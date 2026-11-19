import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  define: {
    // Ano fixado no build: evita divergência entre o HTML pré-renderizado e o navegador.
    __ANO__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    manifest: true,
    rolldownOptions: isSsrBuild
      ? undefined
      : {
          output: {
            // Poucos arquivos, estáveis entre versões: bibliotecas separadas do código do site,
            // e cada página com o próprio arquivo (a home não baixa o código das outras).
            codeSplitting: {
              groups: [
                { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 30 },
                { name: 'animacao', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/, priority: 30 },
                { name: 'base', test: /src[\\/](componentes|lib|config|conteudo)[\\/]|node_modules[\\/]lucide-react[\\/]/, priority: 20 },
              ],
            },
          },
        },
  },
}))
