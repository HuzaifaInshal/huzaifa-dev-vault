import { Link, useLocation } from 'react-router-dom'
import { buildBreadcrumbs, buildNavTree, type DocPage } from '../lib/registry'

interface TopbarProps {
  pages: DocPage[]
}

const REPO_URL = 'https://github.com/HuzaifaInshal/huzaifa-dev-vault'

export function Topbar({ pages }: TopbarProps) {
  const location = useLocation()
  const currentPage = pages.find((page) => page.path === location.pathname)
  const navTree = buildNavTree(pages)
  const breadcrumbs = buildBreadcrumbs(navTree, location.pathname)

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur">
      <div className="flex flex-col gap-4 px-6 py-4 lg:px-8">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            {breadcrumbs.length > 0 ? (
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-1 text-xs text-zinc-500"
              >
                {breadcrumbs.map((item, index) => (
                  <span key={item.path} className="flex items-center gap-1">
                    {index > 0 && <span className="text-zinc-700">/</span>}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-zinc-300">{item.label}</span>
                    ) : (
                      <Link
                        to={item.path}
                        className="transition-colors hover:text-zinc-200"
                      >
                        {item.label}
                      </Link>
                    )}
                  </span>
                ))}
              </nav>
            ) : (
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Huzaifa Dev Vault
              </p>
            )}

            <div className="mt-1">
              <h1 className="truncate text-lg font-semibold text-zinc-100">
                {currentPage?.meta?.title ?? 'Documentation'}
              </h1>
              {currentPage?.meta?.description && (
                <p className="mt-1 text-sm text-zinc-400">
                  {currentPage.meta.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
            >
              Docs Home
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-sm font-medium text-violet-300 transition-colors hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-violet-200"
            >
              View Repository
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/65 px-4 py-3 text-sm text-zinc-300">
          Enjoying the repo or finding it useful? Star it at{' '}
          <a
            href={`${REPO_URL}/stargazers`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-violet-300 underline decoration-violet-500/40 underline-offset-4 transition-colors hover:text-violet-200"
          >
            {REPO_URL}
          </a>
          .
        </div>
      </div>
    </header>
  )
}
