import DefaultPage from "@/components/documentation/DefaultPage";
import { navConfig } from "@/features/navigation/navigationConfig";
import { NavNode } from "@/features/navigation/navigationType";
import { notFound } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

function findNode(nodes: NavNode[], path: string): NavNode | null {
  for (const node of nodes) {
    if (node.route === path) return node;
    if (node.subroutes?.length) {
      const found = findNode(node.subroutes, path);
      if (found) return found;
    }
  }
  return null;
}

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const path = "/" + params.slug.join("/");
  const node = findNode(navConfig, path);
  const returnPage = node?.returnPage;

  if (!node) return notFound();
  if (!returnPage)
    return <DefaultPage description={node.description} title={node.title} />;

  return returnPage({ title: node.title, description: node.description });
}

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = [];

  function collect(nodes: NavNode[]) {
    for (const node of nodes) {
      paths.push({ slug: node.route.replace(/^\//, "").split("/") });
      if (node.subroutes?.length) collect(node.subroutes);
    }
  }

  collect(navConfig);
  return paths;
}
