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
    <div className="min-h-screen bg-zinc-950">
      <Topbar pages={pages} />
      <div className="mx-auto flex max-w-[1680px] pt-14">
        <Sidebar pages={pages} />
        <main className="min-w-0 flex-1">
          <div className="flex">
            <div className="flex flex-1 justify-center gap-10 px-6 py-10 lg:px-8">
              <article
                id="doc-content"
                className="min-w-0 w-full max-w-[40rem]"
              >
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
