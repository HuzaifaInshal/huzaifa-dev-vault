import type { ComponentType } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DocMeta {
  title: string;
  description?: string;
  order?: number;
  // `category` is kept for backwards compat but no longer drives navigation —
  // the file-system path is the single source of truth for tree position.
  category?: string;
}

export interface DocPage {
  path: string;
  Component: ComponentType;
  meta?: DocMeta;
}

/**
 * A node in the navigation tree. Every directory segment becomes a TreeNode.
 *
 * - Leaf page   → has `page`, no `children`
 * - Section     → has `children`; may also have `page` (from an index.mdx)
 * - Auto-section→ has `children`, no `page`  →  App generates a listing route
 */
export interface TreeNode {
  slug: string;
  label: string;
  path: string;
  page?: DocPage;
  children: TreeNode[];
  order: number;
}

export interface NavTree {
  /** The root "/" page, if one exists (docs/index.mdx) */
  root?: DocPage;
  /** All other top-level nodes */
  nodes: TreeNode[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function prettify(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function sortNodes(nodes: TreeNode[]): void {
  nodes.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.label.localeCompare(b.label);
  });
  for (const n of nodes) sortNodes(n.children);
}

/** Recursively insert a page into the tree by path segments. */
function insertPage(
  nodes: TreeNode[],
  segments: string[],
  page: DocPage,
  prefixPath: string
): void {
  const [head, ...rest] = segments;
  const nodePath = prefixPath ? `${prefixPath}/${head}` : `/${head}`;

  let node = nodes.find((n) => n.slug === head);
  if (!node) {
    node = {
      slug: head,
      label: prettify(head),
      path: nodePath,
      children: [],
      order: 999
    };
    nodes.push(node);
  }

  if (rest.length === 0) {
    // This page maps to this node (leaf or directory index)
    node.page = page;
    node.label = page.meta?.title ?? prettify(head);
    node.order = page.meta?.order ?? 999;
  } else {
    insertPage(node.children, rest, page, nodePath);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

const modules = import.meta.glob("../documentation/**/*.mdx", {
  eager: true
});

/** Flat list of all MDX-backed pages — used for routing. */
export function buildRegistry(): DocPage[] {
  return Object.entries(modules)
    .map(([filePath, rawMod]) => {
      const mod = rawMod as { default: ComponentType; meta?: DocMeta };

      // docs/utils/frontend/cn.mdx       → /utils/frontend/cn
      // docs/utils/frontend/index.mdx    → /utils/frontend
      // docs/index.mdx                   → /
      const normalizedPath = filePath
        .replace("../documentation", "")
        .replace(".mdx", "");

      const segments = normalizedPath.split("/").filter(Boolean);
      const last = segments[segments.length - 1];
      const prev = segments[segments.length - 2];

      if (last === "index") {
        segments.pop();
      } else if (last && prev === last) {
        segments.pop();
      }

      const routePath = segments.length > 0 ? `/${segments.join("/")}` : "/";

      return { path: routePath, Component: mod.default, meta: mod.meta };
    })
    .sort((a, b) => {
      const ao = a.meta?.order ?? 999;
      const bo = b.meta?.order ?? 999;
      if (ao !== bo) return ao - bo;
      return (a.meta?.title ?? "").localeCompare(b.meta?.title ?? "");
    });
}

/** Hierarchical tree derived from file paths — used for the sidebar. */
export function buildNavTree(pages: DocPage[]): NavTree {
  const nodes: TreeNode[] = [];
  let root: DocPage | undefined;

  for (const page of pages) {
    if (page.path === "/") {
      root = page;
      continue;
    }
    const segments = page.path.split("/").filter(Boolean);
    insertPage(nodes, segments, page, "");
  }

  sortNodes(nodes);
  return { root, nodes };
}

/**
 * Collect every tree node that has children but no backing MDX page.
 * These need an auto-generated SectionIndex route in the router.
 */
export function collectSectionNodes(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    if (node.children.length > 0 && !node.page) result.push(node);
    result.push(...collectSectionNodes(node.children));
  }
  return result;
}
