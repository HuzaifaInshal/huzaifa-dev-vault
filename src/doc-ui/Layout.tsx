import { Outlet } from "react-router-dom";
import { DocPager } from "./DocPager";
import { PageHeader } from "./PageHeader";
import { Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";
import { Topbar } from "./Topbar";
import type { DocPage } from "../lib/registry";

interface LayoutProps {
  pages: DocPage[];
}

export function Layout({ pages }: LayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-zinc-950">
      <Topbar pages={pages} />
      <div className="flex h-full pt-16">
        <Sidebar pages={pages} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="flex">
            <div className="mx-auto flex w-full max-w-[40rem] gap-10 px-6 py-10 lg:px-8">
              <article id="doc-content" className="min-w-0 flex-1 max-w-4xl">
                <PageHeader pages={pages} />
                <Outlet />
                <DocPager pages={pages} />
              </article>
            </div>
            <TableOfContents />
          </div>
        </main>
      </div>
    </div>
  );
}
