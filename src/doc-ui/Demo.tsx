import { useState, type ReactNode } from "react";
import { Highlight, themes } from "prism-react-renderer";

interface DemoProps {
  code: string;
  children: ReactNode;
  title?: string;
  language?: string;
  defaultTab?: "preview" | "code";
}

export function Demo({
  code,
  children,
  title,
  language = "tsx",
  defaultTab = "preview"
}: DemoProps) {
  const [tab, setTab] = useState<"preview" | "code">(defaultTab);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const displayCode = code;

  const copy = async () => {
    await navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-violet-500/30 overflow-hidden my-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-violet-500/5 border-b border-violet-500/20">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-violet-300/30" />
          </div>
          <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-widest font-mono">
            Demo
          </span>
          {title && (
            <span className="text-xs text-zinc-500 font-mono">— {title}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <TabBtn
              active={tab === "preview"}
              onClick={() => setTab("preview")}
            >
              Preview
            </TabBtn>
            <TabBtn active={tab === "code"} onClick={() => setTab("code")}>
              Code
            </TabBtn>
          </div>
          {tab === "code" && (
            <button
              onClick={copy}
              className="text-xs text-zinc-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-2.5 py-1 rounded-md transition-colors font-mono"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Preview pane */}
      {tab === "preview" && (
        <div className="p-8 bg-[#0a0a12] min-h-28 flex items-center justify-center">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {children}
          </div>
        </div>
      )}

      {/* Code pane */}
      {tab === "code" && (
        <div className="relative bg-[#0a0a12]">
          <div className={expanded ? "" : "max-h-96 overflow-hidden"}>
            <Highlight
              theme={themes.nightOwl}
              code={displayCode.trim()}
              language={language}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} p-5 overflow-x-auto text-sm leading-relaxed m-0`}
                  style={{ ...style, background: "#0d1117" }}
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

          {!expanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-[60px] h-24 bg-gradient-to-t from-[#0d1117] to-transparent" />
          )}

          <div className="flex justify-center border-t border-violet-500/10 pt-3 pb-3 bg-[#0d1117]">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-zinc-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1.5 rounded-md transition-colors font-mono"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-md transition-colors font-mono ${
        active
          ? "bg-violet-500/20 text-violet-300"
          : "text-zinc-500 hover:text-zinc-300 hover:bg-violet-500/10"
      }`}
    >
      {children}
    </button>
  );
}
