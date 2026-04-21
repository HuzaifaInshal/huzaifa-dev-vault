import type { ComponentType } from 'react'

declare module '*.mdx' {
  const Component: ComponentType
  export default Component
  export const meta: {
    title: string
    category?: string
    description?: string
    order?: number
  }
}

declare module '*?raw' {
  const content: string
  export default content
}
