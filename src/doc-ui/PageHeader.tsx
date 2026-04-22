import { Link, useLocation } from 'react-router-dom'
import {
  buildBreadcrumbs,
  buildNavTree,
  type DocPage,
} from '../lib/registry'

interface PageHeaderProps {
  pages: DocPage[]
}

export function PageHeader({ pages }: PageHeaderProps) {
  const location = useLocation()
  const currentPage = pages.find((page) => page.path === location.pathname)
  const navTree = buildNavTree(pages)
  const breadcrumbs = buildBreadcrumbs(navTree, location.pathname)

  if (!currentPage && breadcrumbs.length === 0) {
    return null
  }

  return (
    <header className="mb-10 border-b border-zinc-800/80 pb-8">
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-1 text-xs text-zinc-500"
        >
          {breadcrumbs.map((item, index) => (
            <span key={item.path} className="flex items-center gap-1">
              {index > 0 && <span className="text-zinc-700">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-zinc-300">{item.label}</span>
              ) : (
                <Link to={item.path} className="transition-colors hover:text-violet-300">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      )}

      <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">
        {currentPage?.meta?.title ?? 'Documentation'}
      </h1>

      {currentPage?.meta?.description && (
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          {currentPage.meta.description}
        </p>
      )}
    </header>
  )
}
