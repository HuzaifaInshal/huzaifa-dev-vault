import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { buildNavTree, type DocPage, type TreeNode } from '../lib/registry'

interface SidebarProps {
  pages: DocPage[]
}

export function Sidebar({ pages }: SidebarProps) {
  const navTree = buildNavTree(pages)

  return (
    <aside className="hidden w-[260px] flex-shrink-0 border-r border-zinc-800/60 xl:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-8">
        <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          Sections
        </p>

        <nav className="space-y-0.5">
          {navTree.root && (
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                clsx(
                  'block rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-zinc-800 font-medium text-white'
                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100',
                )
              }
            >
              {navTree.root.meta?.title ?? 'Home'}
            </NavLink>
          )}

          <div className="space-y-0.5">
            {navTree.nodes.map((node) => (
              <SidebarNode key={node.path} node={node} depth={0} />
            ))}
          </div>
        </nav>
      </div>
    </aside>
  )
}

function SidebarNode({ node, depth }: { node: TreeNode; depth: number }) {
  const location = useLocation()
  const isCurrentPath = location.pathname === node.path
  const isChildActive = location.pathname.startsWith(node.path + '/')
  const hasChildren = node.children.length > 0

  const [open, setOpen] = useState(isCurrentPath || isChildActive)

  useEffect(() => {
    if (isCurrentPath || isChildActive) setOpen(true)
  }, [isCurrentPath, isChildActive])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'min-w-0 flex-1 rounded-md py-1.5 text-sm leading-5 transition-colors truncate',
      depth === 0 ? 'font-medium' : 'font-normal',
      isActive
        ? 'text-white'
        : depth === 0
          ? 'text-zinc-300 hover:text-white'
          : 'text-zinc-400 hover:text-zinc-200',
    )

  return (
    <div className={clsx(depth >= 2 && 'ml-3 border-l border-zinc-800 pl-3')}>
      <div
        className={clsx(
          'flex items-center gap-1 rounded-md px-3 transition-colors',
          (isCurrentPath || isChildActive) && depth === 0
            ? 'bg-zinc-800/80'
            : 'hover:bg-zinc-800/50',
        )}
      >
        <NavLink to={node.path} className={linkClass} end={!hasChildren}>
          {node.label}
        </NavLink>

        {hasChildren && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex-shrink-0 p-1 text-zinc-600 transition-colors hover:text-zinc-300"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            <Chevron open={open} />
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <SidebarNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      className={clsx('transition-transform duration-150', open ? 'rotate-90' : 'rotate-0')}
    >
      <path
        d="M4.5 2.5L8 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
