import { Link, useLocation } from 'react-router-dom'
import type { DocPage } from '../lib/registry'

interface DocPagerProps {
  pages: DocPage[]
}

export function DocPager({ pages }: DocPagerProps) {
  const location = useLocation()
  const currentIndex = pages.findIndex((page) => page.path === location.pathname)

  if (currentIndex === -1) return null

  const previousPage = currentIndex > 0 ? pages[currentIndex - 1] : undefined
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined

  if (!previousPage && !nextPage) return null

  return (
    <div className="mt-12 grid gap-3 border-t border-zinc-800 pt-8 sm:grid-cols-2">
      {previousPage ? (
        <Link
          to={previousPage.path}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Previous
          </p>
          <p className="mt-2 text-sm font-medium text-zinc-100">
            {previousPage.meta?.title ?? previousPage.path}
          </p>
        </Link>
      ) : (
        <div />
      )}

      {nextPage ? (
        <Link
          to={nextPage.path}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-4 text-left transition-colors hover:border-zinc-700 hover:bg-zinc-900 sm:ml-auto"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Next
          </p>
          <p className="mt-2 text-sm font-medium text-zinc-100">
            {nextPage.meta?.title ?? nextPage.path}
          </p>
        </Link>
      ) : null}
    </div>
  )
}
