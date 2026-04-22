import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { clsx } from 'clsx'

interface HeadingLink {
  id: string
  text: string
  level: 2 | 3
}

function getHeadings(): HeadingLink[] {
  const content = document.getElementById('doc-content')
  if (!content) return []

  return Array.from(content.querySelectorAll('h2[id], h3[id]'))
    .map((heading) => {
      const text = heading.textContent?.trim()
      const id = heading.getAttribute('id')
      if (!text || !id) return null
      return { id, text, level: heading.tagName === 'H2' ? 2 : 3 } satisfies HeadingLink
    })
    .filter((h): h is HeadingLink => h !== null)
}

export function TableOfContents() {
  const location = useLocation()
  const [headings, setHeadings] = useState<HeadingLink[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHeadings(getHeadings()))
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname])

  useEffect(() => {
    if (headings.length === 0) { setActiveId(''); return }

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    const fallback = elements.find((el) => el.getBoundingClientRect().top >= 0)
    setActiveId(fallback?.id ?? elements[0].id)

    return () => observer.disconnect()
  }, [headings, location.pathname])

  if (headings.length === 0) return null

  return (
    <aside className="hidden w-[240px] flex-shrink-0 xl:block">
      <div className="sticky top-14 py-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          On this page
        </p>
        <nav className="space-y-1">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={clsx(
                'block py-1 text-[13px] leading-5 transition-colors',
                heading.level === 3 && 'pl-3',
                activeId === heading.id
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
