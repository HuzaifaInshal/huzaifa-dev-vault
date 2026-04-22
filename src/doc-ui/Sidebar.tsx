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
    <aside className="hidden w-72 flex-shrink-0 border-r border-zinc-800/80 xl:block">
      <div className="sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto px-6 py-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Sections
        </p>

        <nav className="space-y-1">
          {/* Root index page (e.g. Introduction) */}
          {navTree.root && (
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                clsx(
                  'mb-2 block px-1 py-1 text-sm transition-colors',
                  isActive
                    ? 'font-semibold text-violet-300'
                    : 'text-zinc-400 hover:text-violet-300',
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
  const isNestedLevel = depth >= 2

  // Start expanded if this node or a descendant is active
  const [open, setOpen] = useState(isCurrentPath || isChildActive)

  useEffect(() => {
    if (isCurrentPath || isChildActive) {
      setOpen(true)
    }
  }, [isCurrentPath, isChildActive])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'min-w-0 flex-1 py-1 text-sm leading-6 transition-colors truncate',
      depth === 0 ? 'font-semibold' : 'font-normal',
      isActive
        ? depth === 0
          ? 'text-violet-300'
          : 'text-violet-200'
        : depth === 0
          ? 'text-zinc-200 hover:text-violet-300'
          : 'text-zinc-400 hover:text-violet-200',
    )

  return (
    <div
      className={clsx(
        isNestedLevel && 'ml-4 border-l border-violet-500/20 pl-4',
        depth === 0 && 'mb-1.5',
      )}
    >
      <div className="flex items-start gap-2">
        <NavLink to={node.path} className={linkClass} end={!hasChildren}>
          {node.label}
        </NavLink>

        {hasChildren && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-1 flex-shrink-0 text-zinc-600 transition-colors hover:text-violet-300"
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
