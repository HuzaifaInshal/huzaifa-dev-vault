import { useState, type ReactNode } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { clsx } from 'clsx'

interface DemoProps {
  /** Raw source of the component file — import with `?raw` */
  source: string
  /** Optional shorter code snippet to show instead of the full source */
  code?: string
  /** Live rendered component */
  children: ReactNode
  title?: string
  /** Language for syntax highlighting when using `code` prop */
  language?: string
  /** Start preview on "code" tab */
  defaultTab?: 'preview' | 'code'
}

export function Demo({
  source,
  code,
  children,
  title,
  language = 'tsx',
  defaultTab = 'preview',
}: DemoProps) {
  const [tab, setTab] = useState<'preview' | 'code'>(defaultTab)
  const [copied, setCopied] = useState(false)

  const displayCode = code ?? source

  const copy = async () => {
    await navigator.clipboard.writeText(displayCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden my-6 shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        {title && (
          <span className="text-xs text-zinc-500 font-mono mr-auto">{title}</span>
        )}
        <div className={clsx('flex items-center gap-1', !title && 'ml-auto')}>
          <TabBtn active={tab === 'preview'} onClick={() => setTab('preview')}>
            Preview
          </TabBtn>
          <TabBtn active={tab === 'code'} onClick={() => setTab('code')}>
            Code
          </TabBtn>
        </div>
      </div>

      {/* Preview pane */}
      {tab === 'preview' && (
        <div className="p-8 bg-zinc-950 min-h-28 flex items-center justify-center">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {children}
          </div>
        </div>
      )}

      {/* Code pane */}
      {tab === 'code' && (
        <div className="relative">
          <button
            onClick={copy}
            className="absolute top-3 right-3 z-10 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-md transition-colors font-mono"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <Highlight
            theme={themes.nightOwl}
            code={displayCode.trim()}
            language={language}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={clsx(
                  className,
                  'p-5 overflow-x-auto text-sm leading-relaxed m-0 rounded-none',
                )}
                style={{ ...style, background: '#0d1117' }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      )}
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-3 py-1 text-xs rounded-md transition-colors font-medium',
        active
          ? 'bg-zinc-800 text-zinc-100'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50',
      )}
    >
      {children}
    </button>
  )
}
