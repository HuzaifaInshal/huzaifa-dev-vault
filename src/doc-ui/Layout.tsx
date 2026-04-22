import { Outlet } from 'react-router-dom'
import { DocPager } from './DocPager'
import { Sidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'
import { Topbar } from './Topbar'
import type { DocPage } from '../lib/registry'

interface LayoutProps {
  pages: DocPage[]
}

export function Layout({ pages }: LayoutProps) {
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar pages={pages} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar pages={pages} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-7xl gap-8 px-6 py-8 lg:px-8">
            <article id="doc-content" className="min-w-0 flex-1 max-w-3xl">
              <Outlet />
              <DocPager pages={pages} />
            </article>
            <TableOfContents />
          </div>
        </main>
      </div>
    </div>
  )
}
