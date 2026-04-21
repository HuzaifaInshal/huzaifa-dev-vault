import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { clsx } from 'clsx'

interface CodeBlockProps {
  /** Raw source string — import with `?raw` or pass a literal snippet */
  source: string
  language?: string
  title?: string
}

export function CodeBlock({ source, language = 'tsx', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(source)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden my-6 shadow-sm">
      {title && (
        <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
          <span className="text-xs text-zinc-500 font-mono">{title}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={copy}
          className="absolute top-3 right-3 z-10 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-md transition-colors font-mono"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <Highlight
          theme={themes.nightOwl}
          code={source.trim()}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={clsx(
                className,
                'p-5 overflow-x-auto text-sm leading-relaxed m-0',
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
    </div>
  )
}
