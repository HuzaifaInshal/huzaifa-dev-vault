import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import { buildNavTree, type DocPage, type TreeNode } from "../lib/registry";
import { SIDEBAR_SCOPED_TO_SECTION } from "../site.config";

interface SidebarProps {
  pages: DocPage[];
}

export function Sidebar({ pages }: SidebarProps) {
  const location = useLocation();
  const navTree = buildNavTree(pages);

  const sections = SIDEBAR_SCOPED_TO_SECTION
    ? (() => {
        const activeTopNode = navTree.nodes.find(
          (node) =>
            location.pathname === node.path ||
            location.pathname.startsWith(node.path + "/")
        );
        return activeTopNode ? visibleChildren(activeTopNode) : [];
      })()
    : navTree.nodes.filter((node) => !node.page?.meta?.hideFromNav);

  return (
    <aside className="hidden w-[260px] flex-shrink-0 xl:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-8">
        <nav className="space-y-4">
          {sections.map((node) => (
            <SidebarSection key={node.path} node={node} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

function SidebarSection({ node }: { node: TreeNode }) {
  const children = visibleChildren(node);

  return (
    <div>
      <NavLink
        to={node.path}
        className="px-3 text-[13px] font-medium text-pretty text-zinc-100"
      >
        {node.label}
      </NavLink>

      {children.length > 0 && (
        <div className="mt-1">
          {children.map((child) => (
            <SidebarItem key={child.path} node={child} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarItem({ node, depth }: { node: TreeNode; depth: number }) {
  const children = visibleChildren(node);
  const hasChildren = children.length > 0;
  const location = useLocation();
  const isCurrentPath = location.pathname === node.path;
  const isChildActive = location.pathname.startsWith(node.path + "/");
  const [open, setOpen] = useState(isCurrentPath || isChildActive);

  useEffect(() => {
    if (isCurrentPath || isChildActive) setOpen(true);
  }, [isCurrentPath, isChildActive]);

  // depth 0 = lvl 2, depth 1+ = lvl 3+
  if (depth >= 1) {
    return (
      <div className="ml-3 border-l-2 border-violet-500/30 pl-3">
        <div className="flex items-center">
          <NavLink
            to={node.path}
            end={!hasChildren}
            className={({ isActive }) =>
              clsx(
                "flex-1 py-1 text-[13px] leading-5 transition-colors truncate",
                isActive
                  ? "text-violet-500"
                  : "text-zinc-400 hover:text-zinc-100"
              )
            }
          >
            {node.label}
          </NavLink>
          {hasChildren && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex-shrink-0 text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <Chevron open={open} />
            </button>
          )}
        </div>
        {hasChildren && open && (
          <div className="mt-0.5">
            {children.map((child) => (
              <SidebarItem key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ps-0">
      <div className="flex items-center">
        <NavLink
          to={node.path}
          end={!hasChildren}
          className={({ isActive }) =>
            clsx(
              "flex-1 px-3 py-1 text-[13px] leading-5 text-pretty transition-colors truncate",
              isActive ? "text-violet-500" : "text-zinc-400 hover:text-zinc-100"
            )
          }
        >
          {node.label}
        </NavLink>
        {hasChildren && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex-shrink-0 pr-3 text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <Chevron open={open} />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div className="mt-0.5">
          {children.map((child) => (
            <SidebarItem key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function visibleChildren(node: TreeNode) {
  return node.children.filter((child) => !child.page?.meta?.hideFromNav);
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      className={clsx(
        "transition-transform duration-150",
        open ? "rotate-90" : "rotate-0"
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
  );
}
