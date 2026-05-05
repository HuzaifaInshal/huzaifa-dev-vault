// ─── Types ────────────────────────────────────────────────────────────────────
// Pure functions and types — safe for both server and client components.

export interface DocMeta {
  title: string;
  description?: string;
  order?: number;
  hideFromNav?: boolean;
  category?: string;
}

export interface DocPage {
  path: string;
  filePath: string;
  meta?: DocMeta;
}

export interface TreeNode {
  slug: string;
  label: string;
  path: string;
  page?: DocPage;
  children: TreeNode[];
  order: number;
}

export interface NavTree {
  root?: DocPage;
  nodes: TreeNode[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
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
    node = { slug: head, label: prettify(head), path: nodePath, children: [], order: 999 };
    nodes.push(node);
  }

  if (rest.length === 0) {
    node.page = page;
    node.label = page.meta?.title ?? prettify(head);
    node.order = page.meta?.order ?? 999;
  } else {
    insertPage(node.children, rest, page, nodePath);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function buildNavTree(pages: DocPage[]): NavTree {
  const nodes: TreeNode[] = [];
  let root: DocPage | undefined;

  for (const page of pages) {
    if (page.path === "/") { root = page; continue; }
    const segments = page.path.split("/").filter(Boolean);
    insertPage(nodes, segments, page, "");
  }

  sortNodes(nodes);
  return { root, nodes };
}

export function collectSectionNodes(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    if (node.children.length > 0 && !node.page) result.push(node);
    result.push(...collectSectionNodes(node.children));
  }
  return result;
}

function findNodeTrail(nodes: TreeNode[], targetPath: string): TreeNode[] | null {
  for (const node of nodes) {
    if (node.path === targetPath) return [node];
    const childTrail = findNodeTrail(node.children, targetPath);
    if (childTrail) return [node, ...childTrail];
  }
  return null;
}

export function buildBreadcrumbs(navTree: NavTree, currentPath: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  if (navTree.root) breadcrumbs.push({ label: navTree.root.meta?.title ?? "Home", path: "/" });
  if (currentPath === "/") return breadcrumbs;
  const trail = findNodeTrail(navTree.nodes, currentPath);
  if (!trail) return breadcrumbs;
  breadcrumbs.push(...trail.map((node) => ({ label: node.label, path: node.path })));
  return breadcrumbs;
}

export function findPage(pages: DocPage[], routePath: string): DocPage | undefined {
  return pages.find((p) => p.path === routePath);
}

export function findTreeNode(nodes: TreeNode[], targetPath: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.path === targetPath) return node;
    const found = findTreeNode(node.children, targetPath);
    if (found) return found;
  }
  return undefined;
}
