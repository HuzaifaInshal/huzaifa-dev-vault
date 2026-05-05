"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Webpack requires a static string prefix in dynamic import() to know which
// files to bundle. The glob `../documentation/**/*.mdx` tells webpack to
// include every .mdx file under that directory as a lazy chunk.
// At runtime we pass the relative path suffix (importKey) to select the right one.
function loadDoc(importKey: string): Promise<{ default: React.ComponentType }> {
  // importKey looks like "/nextjs-and-reactjs/utils/add-query-params/add-query-params.mdx"
  // strip the leading slash so it becomes a valid relative path segment
  const key = importKey.startsWith("/") ? importKey.slice(1) : importKey;
  return import(`../documentation/${key}`);
}

const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-6 w-2/5 rounded-md bg-zinc-800" />
    <div className="space-y-2">
      <div className="h-4 w-full rounded bg-zinc-800/80" />
      <div className="h-4 w-[92%] rounded bg-zinc-800/80" />
      <div className="h-4 w-4/5 rounded bg-zinc-800/80" />
    </div>
    <div className="h-5 w-1/3 rounded-md bg-zinc-800" />
    <div className="space-y-2">
      <div className="h-4 w-full rounded bg-zinc-800/80" />
      <div className="h-4 w-[88%] rounded bg-zinc-800/80" />
      <div className="h-4 w-3/4 rounded bg-zinc-800/80" />
      <div className="h-4 w-[95%] rounded bg-zinc-800/80" />
    </div>
    <div className="h-48 w-full rounded-xl bg-zinc-800/60" />
    <div className="h-5 w-2/5 rounded-md bg-zinc-800" />
    <div className="space-y-2">
      <div className="h-4 w-full rounded bg-zinc-800/80" />
      <div className="h-4 w-[85%] rounded bg-zinc-800/80" />
      <div className="h-4 w-[90%] rounded bg-zinc-800/80" />
    </div>
  </div>
);

export function MDXPage({ importKey }: { importKey: string }) {
  const Component = useMemo(
    () =>
      dynamic(() => loadDoc(importKey).then((m) => ({ default: m.default })), {
        ssr: false,
        loading: () => <Skeleton />,
      }),
    [importKey]
  );

  return <Component />;
}
