import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
// @ts-expect-error Vite runs this config in Node, but this project omits Node types.
import { readFileSync } from 'node:fs'

const markdownRawPlugin: Plugin = {
  name: 'markdown-raw',
  enforce: 'pre',
  async resolveId(source: string, importer?: string) {
    if (!source.endsWith('.md?raw')) {
      return null
    }

    const resolved = await this.resolve(source.slice(0, -4), importer, {
      skipSelf: true,
    })

    return resolved ? `\0markdown-raw:${resolved.id}` : null
  },
  load(id: string) {
    if (!id.startsWith('\0markdown-raw:')) {
      return null
    }

    const filePath = id.replace('\0markdown-raw:', '')
    const source = readFileSync(filePath, 'utf8')

    return `export default ${JSON.stringify(source)}`
  },
}

export default defineConfig({
  plugins: [
    markdownRawPlugin,
    {
      enforce: 'pre',
      ...mdx({
        include: /\.mdx?($|\?)/,
        exclude: /\?raw($|&)/,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ include: /\.(tsx|ts|jsx|js|mdx?)($|\?)/ }),
  ],
})
