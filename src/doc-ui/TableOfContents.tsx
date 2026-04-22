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

      return {
        id,
        text,
        level: heading.tagName === 'H2' ? 2 : 3,
      } satisfies HeadingLink
    })
    .filter((heading): heading is HeadingLink => heading !== null)
}

export function TableOfContents() {
  const location = useLocation()
  const [headings, setHeadings] = useState<HeadingLink[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    let frame = 0
    const updateHeadings = () => setHeadings(getHeadings())

    frame = window.requestAnimationFrame(updateHeadings)

    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname])

  useEffect(() => {
    if (headings.length === 0) {
      setActiveId('')
      return
    }

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop,
          )

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: [0, 1],
      },
    )

    elements.forEach((element) => observer.observe(element))

    const fallbackActive = elements.find((element) => element.getBoundingClientRect().top >= 0)
    setActiveId(fallbackActive?.id ?? elements[0].id)

    return () => observer.disconnect()
  }, [headings, location.pathname])

  if (headings.length === 0) {
    return null
  }

  return (
    <aside className="hidden w-72 flex-shrink-0 xl:block">
      <div className="sticky top-28 px-4 py-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            On This Page
          </p>

          <nav className="mt-4 space-y-1">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={clsx(
                  'block rounded-lg px-3 py-2 text-sm transition-colors',
                  heading.level === 3 && 'ml-3 text-[13px]',
                  activeId === heading.id
                    ? 'bg-violet-500/10 text-violet-300'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
                )}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}
