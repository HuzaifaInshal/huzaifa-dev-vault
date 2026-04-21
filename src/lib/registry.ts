import type { ComponentType } from 'react'

interface DocMeta {
  title: string
  category?: string
  description?: string
  order?: number
}

interface DocModule {
  default: ComponentType
  meta?: DocMeta
}

export interface DocPage {
  path: string
  Component: ComponentType
  meta?: DocMeta
}

const modules = import.meta.glob('../docs/**/*.mdx', { eager: true })

export function buildRegistry(): DocPage[] {
  return Object.entries(modules)
    .map(([filePath, rawMod]) => {
      const mod = rawMod as DocModule
      const routePath = filePath
        .replace('../docs', '')
        .replace('.mdx', '')
        .replace(/\/index$/, '/')

      return {
        path: routePath || '/',
        Component: mod.default,
        meta: mod.meta,
      }
    })
    .sort((a, b) => {
      const ao = a.meta?.order ?? 999
      const bo = b.meta?.order ?? 999
      if (ao !== bo) return ao - bo
      return (a.meta?.title ?? '').localeCompare(b.meta?.title ?? '')
    })
}

export interface SidebarSection {
  name: string
  order: number
  pages: DocPage[]
}

const CATEGORY_ORDER: Record<string, number> = {
  'Getting Started': 0,
  Components: 1,
  Utils: 2,
  Prompts: 3,
  Instructions: 4,
}

export function buildSidebarTree(pages: DocPage[]): SidebarSection[] {
  const categoryMap = new Map<string, DocPage[]>()

  for (const page of pages) {
    let category: string

    if (page.meta?.category) {
      category = page.meta.category
    } else {
      const parts = page.path.split('/').filter(Boolean)
      if (parts.length > 1) {
        category = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
      } else {
        category = 'General'
      }
    }

    if (!categoryMap.has(category)) categoryMap.set(category, [])
    categoryMap.get(category)!.push(page)
  }

  return Array.from(categoryMap.entries())
    .map(([name, sectionPages]) => ({
      name,
      order: CATEGORY_ORDER[name] ?? 99,
      pages: sectionPages,
    }))
    .sort((a, b) => a.order - b.order)
}
