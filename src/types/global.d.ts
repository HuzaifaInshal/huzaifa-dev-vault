import type { ComponentType } from 'react'

declare module '*.mdx' {
  const Component: ComponentType
  export default Component
  export const meta: {
    title: string
    category?: string
    description?: string
    hideFromNav?: boolean
    order?: number
  }
}

declare module '*.md' {
  const Component: ComponentType
  export default Component
}

declare module '*?raw' {
  const content: string
  export default content
}
