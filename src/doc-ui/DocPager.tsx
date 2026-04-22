import { Link, useLocation } from 'react-router-dom'
import type { DocPage } from '../lib/registry'

interface DocPagerProps {
  pages: DocPage[]
}

export function DocPager({ pages }: DocPagerProps) {
  const location = useLocation()
  const currentIndex = pages.findIndex((page) => page.path === location.pathname)

  if (currentIndex === -1) return null

  const prev = currentIndex > 0 ? pages[currentIndex - 1] : undefined
  const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined

  if (!prev && !next) return null

  return (
    <div className="mt-12 grid gap-3 border-t border-zinc-800 pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          to={prev.path}
          className="group rounded-[10px] border border-zinc-800 p-4 transition-colors hover:bg-zinc-900"
        >
          <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            <span>←</span> Previous
          </p>
          <p className="text-sm font-medium text-zinc-100 group-hover:text-white">
            {prev.meta?.title ?? prev.path}
          </p>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to={next.path}
          className="group rounded-[10px] border border-zinc-800 p-4 text-right transition-colors hover:bg-zinc-900 sm:ml-auto sm:w-full"
        >
          <p className="mb-1 flex items-center justify-end gap-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Next <span>→</span>
          </p>
          <p className="text-sm font-medium text-zinc-100 group-hover:text-white">
            {next.meta?.title ?? next.path}
          </p>
        </Link>
      ) : null}
    </div>
  )
}
