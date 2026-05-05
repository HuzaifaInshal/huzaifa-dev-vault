import { buildRegistry } from "@/lib/registry-server";
import { Topbar } from "@/doc-ui/Topbar";
import { Sidebar } from "@/doc-ui/Sidebar";
import { TableOfContents } from "@/doc-ui/TableOfContents";
import { PageHeader } from "@/doc-ui/PageHeader";
import { DocPager } from "@/doc-ui/DocPager";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pages = buildRegistry();

  return (
    <div className="min-h-screen bg-zinc-950">
      <Topbar pages={pages} />
      <div className="flex pt">
        <Sidebar pages={pages} />
        <main className="min-w-0 flex-1 min-h-dvh">
          <div className="flex">
            <div className="flex flex-1 justify-center gap-10 px-6 py-24 lg:px-8">
              <article id="doc-content" className="min-w-0 w-full max-w-[40rem]">
                <PageHeader pages={pages} />
                {children}
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
