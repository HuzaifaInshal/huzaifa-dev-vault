import { Link } from 'react-router-dom'
import { buildNavTree, type DocPage } from '../lib/registry'

interface TopbarProps {
  pages: DocPage[]
}

const REPO_URL = 'https://github.com/HuzaifaInshal/huzaifa-dev-vault'

export function Topbar({ pages }: TopbarProps) {
  const navTree = buildNavTree(pages)
  const primaryLinks = [
    navTree.root
      ? { label: navTree.root.meta?.title ?? 'Docs', path: '/' }
      : { label: 'Docs', path: '/' },
    ...navTree.nodes.slice(0, 5).map((node) => ({
      label: node.label,
      path: node.path,
    })),
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between gap-6 px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6 overflow-hidden">
          <Link
            to="/"
            className="flex flex-shrink-0 items-center gap-2 text-sm font-semibold text-zinc-100"
          >
            <span className="text-lg leading-none text-violet-300">/</span>
            <span className="whitespace-nowrap">Huzaifa Dev Vault</span>
          </Link>

          <nav className="hidden min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap md:flex">
            {primaryLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-violet-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
          <div className="flex h-10 w-72 items-center rounded-xl border border-zinc-800 bg-zinc-900/75 px-4 text-sm text-zinc-500">
            Search documentation...
          </div>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-violet-300"
          >
            Repository
          </a>
          <a
            href={`${REPO_URL}/stargazers`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-300 transition-colors hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-violet-200"
          >
            Star the repo
          </a>
        </div>
      </div>
    </header>
  )
}
