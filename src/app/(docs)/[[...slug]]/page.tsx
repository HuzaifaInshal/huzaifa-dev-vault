import { notFound } from "next/navigation";
import { buildRegistry } from "@/lib/registry-server";
import {
  buildNavTree,
  collectSectionNodes,
  findPage,
  findTreeNode,
} from "@/lib/registry";
import { SectionIndex } from "@/doc-ui/SectionIndex";
import { MDXPage } from "@/doc-ui/MDXPage";
import { getImportKey } from "@/lib/registry-server";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function buildRoutePath(slug?: string[]): string {
  if (!slug || slug.length === 0) return "/";
  return `/${slug.join("/")}`;
}

export async function generateStaticParams() {
  const pages = buildRegistry();
  const navTree = buildNavTree(pages);
  const sectionNodes = collectSectionNodes(navTree.nodes);

  return [
    { slug: undefined },
    ...pages
      .filter((p) => p.path !== "/")
      .map((p) => ({ slug: p.path.replace(/^\//, "").split("/") })),
    ...sectionNodes.map((n) => ({
      slug: n.path.replace(/^\//, "").split("/"),
    })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const routePath = buildRoutePath(slug);
  const pages = buildRegistry();
  const page = findPage(pages, routePath);

  return {
    title: page?.meta?.title
      ? `${page.meta.title} — Huzaifa Dev Vault`
      : "Huzaifa Dev Vault",
    description:
      page?.meta?.description ??
      "A focused knowledge base for reusable frontend code, prompts, and project guidance.",
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const routePath = buildRoutePath(slug);

  const pages = buildRegistry();
  const navTree = buildNavTree(pages);

  const sectionNode = findTreeNode(navTree.nodes, routePath);
  if (sectionNode && sectionNode.children.length > 0 && !sectionNode.page) {
    return <SectionIndex node={sectionNode} />;
  }

  const page = findPage(pages, routePath);
  if (!page) notFound();

  const importKey = getImportKey(page.filePath);

  return <MDXPage importKey={importKey} />;
}
