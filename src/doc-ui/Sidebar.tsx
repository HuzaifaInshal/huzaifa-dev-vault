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
    <aside className="w-64 flex-shrink-0 h-screen border-r border-zinc-800 bg-zinc-900 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-zinc-800 flex-shrink-0">
        <span className="font-bold text-zinc-100 text-base tracking-tight">
          Huzaifa Dev Vault
        </span>
        <span className="text-violet-400 font-bold text-lg">.</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {/* Root index page (e.g. Introduction) */}
        {navTree.root && (
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              clsx(
                'flex items-center px-3 py-1.5 text-sm rounded-md transition-colors mb-1',
                isActive
                  ? 'bg-violet-500/10 text-violet-400 font-medium'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
              )
            }
          >
            {navTree.root.meta?.title ?? 'Home'}
          </NavLink>
        )}

        {/* Tree */}
        <div className="mt-1 space-y-0.5">
          {navTree.nodes.map((node) => (
            <SidebarNode key={node.path} node={node} depth={0} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-zinc-800 flex-shrink-0">
        <p className="text-[11px] text-zinc-600">
          {pages.length} page{pages.length !== 1 ? 's' : ''}
        </p>
      </div>
    </aside>
  )
}

// ─── Recursive node ───────────────────────────────────────────────────────────

function SidebarNode({ node, depth }: { node: TreeNode; depth: number }) {
  const location = useLocation()
  const isCurrentPath = location.pathname === node.path
  const isChildActive = location.pathname.startsWith(node.path + '/')
  const hasChildren = node.children.length > 0

  // Start expanded if this node or a descendant is active
  const [open, setOpen] = useState(isCurrentPath || isChildActive)

  useEffect(() => {
    if (isCurrentPath || isChildActive) {
      setOpen(true)
    }
  }, [isCurrentPath, isChildActive])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex-1 min-w-0 flex items-center py-1.5 text-sm rounded-md transition-colors truncate',
      depth === 0 ? 'font-medium' : 'font-normal',
      isActive
        ? 'text-violet-400'
        : 'text-zinc-400 hover:text-zinc-100',
    )

  return (
    <div style={{ paddingLeft: depth > 0 ? `${depth * 12}px` : undefined }}>
      <div
        className={clsx(
          'flex items-center gap-1 rounded-md px-2',
          (isCurrentPath || isChildActive) && !hasChildren
            ? 'bg-violet-500/10'
            : 'hover:bg-zinc-800',
        )}
      >
        <NavLink to={node.path} className={linkClass} end={!hasChildren}>
          {node.label}
        </NavLink>

        {hasChildren && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex-shrink-0 p-1 text-zinc-600 hover:text-zinc-300 transition-colors rounded"
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
      className={clsx(
        'transition-transform duration-150',
        open ? 'rotate-90' : 'rotate-0',
      )}
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
