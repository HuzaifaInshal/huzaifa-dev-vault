import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import type { DocPage } from '../lib/registry'

interface LayoutProps {
  pages: DocPage[]
}

export function Layout({ pages }: LayoutProps) {
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar pages={pages} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-12">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
