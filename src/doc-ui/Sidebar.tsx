import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { buildSidebarTree, type DocPage } from '../lib/registry'

interface SidebarProps {
  pages: DocPage[]
}

export function Sidebar({ pages }: SidebarProps) {
  const tree = buildSidebarTree(pages)

  return (
    <aside className="w-64 flex-shrink-0 h-screen overflow-y-auto border-r border-zinc-800 bg-zinc-900 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-800 flex-shrink-0">
        <span className="font-bold text-zinc-100 text-lg tracking-tight">
          DevDocs
        </span>
        <span className="text-violet-400 text-xl font-bold">.</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {tree.map((section) => (
          <div key={section.name}>
            <div className="px-3 mb-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
              {section.name}
            </div>
            <ul className="space-y-0.5">
              {section.pages.map((page) => (
                <li key={page.path}>
                  <NavLink
                    to={page.path}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center px-3 py-1.5 text-sm rounded-md transition-colors',
                        isActive
                          ? 'bg-violet-500/10 text-violet-400 font-medium'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
                      )
                    }
                  >
                    {page.meta?.title ?? page.path.split('/').pop()}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-zinc-800 flex-shrink-0">
        <p className="text-xs text-zinc-600">
          {pages.length} page{pages.length !== 1 ? 's' : ''}
        </p>
      </div>
    </aside>
  )
}
