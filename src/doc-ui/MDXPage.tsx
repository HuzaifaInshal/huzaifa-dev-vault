"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const importMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "/index.mdx": () => import("../documentation/index.mdx"),
  "/ai-tools-assistant-and-prompts/ai-tools-for-frontend/guidelines-for-agent/guidelines-for-agent.mdx": () =>
    import("../documentation/ai-tools-assistant-and-prompts/ai-tools-for-frontend/guidelines-for-agent/guidelines-for-agent.mdx"),
  "/ai-tools-assistant-and-prompts/ai-tools-for-frontend/integration/integration.mdx": () =>
    import("../documentation/ai-tools-assistant-and-prompts/ai-tools-for-frontend/integration/integration.mdx"),
  "/ai-tools-assistant-and-prompts/ai-tools-for-frontend/ui-from-html/ui-from-html.mdx": () =>
    import("../documentation/ai-tools-assistant-and-prompts/ai-tools-for-frontend/ui-from-html/ui-from-html.mdx"),
  "/dev-vault-code-guide/dev-vault-code-guide.mdx": () =>
    import("../documentation/dev-vault-code-guide/dev-vault-code-guide.mdx"),
  "/nextjs-and-reactjs/integration-utils/axios-instance/axios-instance.mdx": () =>
    import("../documentation/nextjs-and-reactjs/integration-utils/axios-instance/axios-instance.mdx"),
  "/nextjs-and-reactjs/integration-utils/common-types/common-types.mdx": () =>
    import("../documentation/nextjs-and-reactjs/integration-utils/common-types/common-types.mdx"),
  "/nextjs-and-reactjs/integration-utils/infinite-query-utils/infinite-query-utils.mdx": () =>
    import("../documentation/nextjs-and-reactjs/integration-utils/infinite-query-utils/infinite-query-utils.mdx"),
  "/nextjs-and-reactjs/integration-utils/mutation-error-handler/mutation-error-handler.mdx": () =>
    import("../documentation/nextjs-and-reactjs/integration-utils/mutation-error-handler/mutation-error-handler.mdx"),
  "/nextjs-and-reactjs/others/bootstrap-containers/bootstrap-containers.mdx": () =>
    import("../documentation/nextjs-and-reactjs/others/bootstrap-containers/bootstrap-containers.mdx"),
  "/nextjs-and-reactjs/others/custom-fonts/custom-fonts.mdx": () =>
    import("../documentation/nextjs-and-reactjs/others/custom-fonts/custom-fonts.mdx"),
  "/nextjs-and-reactjs/others/favicons/favicons.mdx": () =>
    import("../documentation/nextjs-and-reactjs/others/favicons/favicons.mdx"),
  "/nextjs-and-reactjs/others/lenis/lenis.mdx": () =>
    import("../documentation/nextjs-and-reactjs/others/lenis/lenis.mdx"),
  "/nextjs-and-reactjs/others/socket-architecture/socket-architecture.mdx": () =>
    import("../documentation/nextjs-and-reactjs/others/socket-architecture/socket-architecture.mdx"),
  "/nextjs-and-reactjs/others/themes/themes.mdx": () =>
    import("../documentation/nextjs-and-reactjs/others/themes/themes.mdx"),
  "/nextjs-and-reactjs/utils/css-utils/css-utils.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/css-utils/css-utils.mdx"),
};

export function MDXPage({ importKey }: { importKey: string }) {
  const Component = useMemo(
    () =>
      dynamic(() => importMap[importKey]().then((m) => ({ default: m.default })), {
        ssr: false,
        loading: () => (
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
        ),
      }),
    [importKey]
  );

  return <Component />;
}
