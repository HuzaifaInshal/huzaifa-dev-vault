import { useState } from "react";

interface PromptProps {
  /** Raw string from a `?raw` import — the prompt text to display and copy */
  source: string;
  title?: string;
}

export function Prompt({ source, title }: PromptProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(source?.trim());
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
            Prompt
          </span>
          {title && (
            <span className="text-xs text-zinc-500 font-mono">— {title}</span>
          )}
        </div>
        <button
          onClick={copy}
          className="text-xs text-zinc-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 px-2.5 py-1 rounded-md transition-colors font-mono"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Body */}
      <div className="bg-[#0a0a12] p-5 overflow-x-auto">
        <pre className="text-sm text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap break-words m-0">
          {source?.trim?.()}
        </pre>
      </div>
    </div>
  );
}
