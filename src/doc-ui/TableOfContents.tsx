"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface HeadingLink {
  id: string;
  text: string;
  level: 2 | 3;
}

function getHeadings(): HeadingLink[] {
  const content = document.getElementById("doc-content");
  if (!content) return [];

  return Array.from(content.querySelectorAll("h2[id], h3[id]"))
    .map((heading) => {
      const text = heading.textContent?.trim();
      const id = heading.getAttribute("id");
      if (!text || !id) return null;
      return {
        id,
        text,
        level: heading.tagName === "H2" ? 2 : 3
      } satisfies HeadingLink;
    })
    .filter((h): h is HeadingLink => h !== null);
}

export function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<HeadingLink[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const scan = () => setHeadings(getHeadings());

    // Initial scan after a frame
    const frame = window.requestAnimationFrame(scan);

    // Also watch for MDX content being injected dynamically (ssr:false)
    const container = document.getElementById("doc-content");
    if (!container) return () => window.cancelAnimationFrame(frame);

    const observer = new MutationObserver(scan);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (headings.length === 0) {
      setActiveId("");
      return;
    }

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const updateActive = () => {
      let active = elements[0];
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= window.innerHeight)
          // if (el.getBoundingClientRect().top <= window.innerHeight / 2)
          active = el;
        else break;
      }
      setActiveId(active.id);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [headings, pathname]);

  if (headings.length === 0)
    return <aside className="hidden w-[240px] flex-shrink-0 xl:block" />;

  return (
    <aside className="hidden w-[240px] flex-shrink-0 xl:block">
      <div className="sticky top-20 py-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          On this page
        </p>
        <nav>
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={clsx(
                "block py-1 text-[13px] leading-5 transition-colors",
                heading.level === 3 && "pl-3",
                activeId === heading.id
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
