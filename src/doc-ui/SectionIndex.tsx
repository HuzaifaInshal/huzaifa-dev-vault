import { Link } from "react-router-dom";
import type { TreeNode } from "../lib/registry";

interface SectionIndexProps {
  node: TreeNode;
}

export function SectionIndex({ node }: SectionIndexProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">{node.label}</h1>
      {node.page?.meta?.description && (
        <p className="text-zinc-400 leading-7 mb-8">
          {node.page.meta.description}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {node.children.map((child) => (
          <Link
            key={child.path}
            to={child.path}
            className="group block p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-violet-500/40 hover:bg-zinc-900 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-zinc-100 group-hover:text-violet-400 transition-colors">
                {child.label}
              </span>
              <span className="text-zinc-600 group-hover:text-violet-400 transition-colors mt-0.5 text-sm">
                ›
              </span>
            </div>

            {child.page?.meta?.description ? (
              <p className="text-sm text-zinc-500 leading-relaxed">
                {child.page.meta.description}
              </p>
            ) : child.children.length > 0 ? (
              <p className="text-sm text-zinc-600">
                {child.children.length} item
                {child.children.length !== 1 ? "s" : ""}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
