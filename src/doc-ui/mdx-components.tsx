import { Highlight, themes } from 'prism-react-renderer'
import { clsx } from 'clsx'

function FencedCode({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const lang = className?.replace('language-', '') || 'text'

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden my-6 shadow-sm">
      <Highlight theme={themes.nightOwl} code={children.trim()} language={lang}>
        {({ className: cls, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={clsx(cls, 'p-5 overflow-x-auto text-sm leading-relaxed m-0')}
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
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mdxComponents: Record<string, any> = {
  h1: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h1
      id={id}
      className="text-3xl font-bold text-zinc-100 mb-4 mt-10 first:mt-0 scroll-mt-20"
    >
      {children}
    </h1>
  ),
  h2: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h2
      id={id}
      className="text-xl font-semibold text-zinc-100 mb-3 mt-10 scroll-mt-20 border-b border-zinc-800 pb-2"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h3
      id={id}
      className="text-lg font-semibold text-zinc-200 mb-2 mt-7 scroll-mt-20"
    >
      {children}
    </h3>
  ),
  h4: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h4
      id={id}
      className="text-base font-semibold text-zinc-300 mb-2 mt-6 scroll-mt-20"
    >
      {children}
    </h4>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="text-zinc-400 leading-7 mb-4">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-outside ml-5 mb-4 space-y-1.5 text-zinc-400">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-outside ml-5 mb-4 space-y-1.5 text-zinc-400">
      {children}
    </ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="leading-7">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-2 border-violet-500 pl-4 my-4 text-zinc-400 italic bg-violet-500/5 py-2 pr-4 rounded-r-lg">
      {children}
    </blockquote>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-zinc-800">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-zinc-900">{children}</thead>
  ),
  tbody: ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }: { children: React.ReactNode }) => (
    <tr className="border-b border-zinc-800 last:border-0">{children}</tr>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="text-left py-3 px-4 text-zinc-300 font-semibold">{children}</th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="py-3 px-4 text-zinc-400">{children}</td>
  ),
  // `pre` is a passthrough — the `code` override handles rendering
  pre: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  code: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => {
    if (className?.startsWith('language-')) {
      return (
        <FencedCode className={className}>{children as string}</FencedCode>
      )
    }
    return (
      <code className="bg-zinc-800 text-violet-300 px-1.5 py-0.5 rounded text-[0.875em] font-mono">
        {children}
      </code>
    )
  },
  hr: () => <hr className="border-zinc-800 my-10" />,
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="text-zinc-200 font-semibold">{children}</strong>
  ),
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="text-zinc-300 italic">{children}</em>
  ),
}
