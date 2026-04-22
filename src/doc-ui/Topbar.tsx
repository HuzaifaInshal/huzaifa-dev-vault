import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { buildNavTree, type DocPage } from "../lib/registry";

interface TopbarProps {
  pages: DocPage[];
}

const REPO_URL = "https://github.com/HuzaifaInshal/huzaifa-dev-vault";

export function Topbar({ pages }: TopbarProps) {
  const navTree = buildNavTree(pages);
  const primaryLinks = [
    navTree.root
      ? { label: navTree.root.meta?.title ?? "Docs", path: "/" }
      : { label: "Docs", path: "/" },
    ...navTree.nodes
      .slice(0, 5)
      .map((node) => ({ label: node.label, path: node.path }))
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-zinc-950/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-6 px-6">
        <div className="flex min-w-0 items-center gap-6 overflow-hidden">
          <Link
            to="/"
            className="flex flex-shrink-0 items-center gap-2 text-sm font-semibold text-zinc-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600">
              <img
                src="/assets/code.png"
                alt="logo"
                className="h-7 w-7 object-contain"
              />
            </span>
            <span className="whitespace-nowrap">Huzaifa Dev Vault</span>
          </Link>

          <nav className="hidden min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap md:flex">
            {primaryLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
          <div className="flex h-9 w-64 items-center rounded-lg text-sm border border-zinc-800 bg-zinc-900 px-3 text-zinc-500">
            Search documentation...
          </div>
          {/* <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Repository
          </a> */}
          <a
            href={`${REPO_URL}/stargazers`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-sm font-medium text-violet-300 transition-colors hover:border-violet-400/40 hover:bg-violet-500/15"
          >
            Love the work? Star it
            <Star size={14} className="fill-violet-300" />
          </a>
        </div>
      </div>
    </header>
  );
}
