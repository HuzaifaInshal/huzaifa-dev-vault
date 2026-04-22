import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import { buildNavTree, type DocPage, type TreeNode } from "../lib/registry";

interface SidebarProps {
  pages: DocPage[];
}

export function Sidebar({ pages }: SidebarProps) {
  const navTree = buildNavTree(pages);

  return (
    <aside className="hidden w-[260px] flex-shrink-0 xl:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-8">
        <nav className="space-y-4">
          {navTree.root && (
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                clsx(
                  "block px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "font-medium text-white"
                    : "text-zinc-400 hover:text-zinc-100"
                )
              }
            >
              {navTree.root.meta?.title ?? "Home"}
            </NavLink>
          )}

          {navTree.nodes.map((node) => (
            <SidebarSection key={node.path} node={node} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

function SidebarSection({ node }: { node: TreeNode }) {
  return (
    <div>
      <p className="px-3 text-sm font-medium text-pretty text-[#ededed]">
        {node.label}
      </p>

      {node.children.length > 0 && (
        <div className="mt-1 space-y-0.5">
          {node.children.map((child) => (
            <SidebarItem key={child.path} node={child} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarItem({ node, depth }: { node: TreeNode; depth: number }) {
  const hasChildren = node.children.length > 0;

  return (
    <div className={clsx(depth >= 1 && "ps-1")}>
      <NavLink
        to={node.path}
        end={!hasChildren}
        className={({ isActive }) =>
          clsx(
            "block px-3 py-1.5 text-sm leading-5 text-pretty transition-colors truncate",
            isActive
              ? "font-medium text-white"
              : "text-[#a1a1a1] hover:text-[#ededed]"
          )
        }
      >
        {node.label}
      </NavLink>

      {hasChildren && (
        <div className="mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <SidebarItem key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
