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
  "/nextjs-and-reactjs/components/button/button.mdx": () =>
    import("../documentation/nextjs-and-reactjs/components/button/button.mdx"),
  "/nextjs-and-reactjs/components/date-and-time/date-and-time.mdx": () =>
    import("../documentation/nextjs-and-reactjs/components/date-and-time/date-and-time.mdx"),
  "/nextjs-and-reactjs/components/dropdowns-and-selects/dropdowns-and-selects.mdx": () =>
    import("../documentation/nextjs-and-reactjs/components/dropdowns-and-selects/dropdowns-and-selects.mdx"),
  "/nextjs-and-reactjs/components/inputs/inputs.mdx": () =>
    import("../documentation/nextjs-and-reactjs/components/inputs/inputs.mdx"),
  "/nextjs-and-reactjs/components/modal-and-sheet/modal-and-sheet.mdx": () =>
    import("../documentation/nextjs-and-reactjs/components/modal-and-sheet/modal-and-sheet.mdx"),
  "/nextjs-and-reactjs/components/tables/tables.mdx": () =>
    import("../documentation/nextjs-and-reactjs/components/tables/tables.mdx"),
  "/nextjs-and-reactjs/hooks/upload-hooks/upload-hooks.mdx": () =>
    import("../documentation/nextjs-and-reactjs/hooks/upload-hooks/upload-hooks.mdx"),
  "/nextjs-and-reactjs/hooks/use-boolean-state/use-boolean-state.mdx": () =>
    import("../documentation/nextjs-and-reactjs/hooks/use-boolean-state/use-boolean-state.mdx"),
  "/nextjs-and-reactjs/hooks/use-infinite/use-infinite.mdx": () =>
    import("../documentation/nextjs-and-reactjs/hooks/use-infinite/use-infinite.mdx"),
  "/nextjs-and-reactjs/hooks/use-read-more/use-read-more.mdx": () =>
    import("../documentation/nextjs-and-reactjs/hooks/use-read-more/use-read-more.mdx"),
  "/nextjs-and-reactjs/hooks/use-time-ago/use-time-ago.mdx": () =>
    import("../documentation/nextjs-and-reactjs/hooks/use-time-ago/use-time-ago.mdx"),
  "/nextjs-and-reactjs/hooks/use-window-size/use-window-size.mdx": () =>
    import("../documentation/nextjs-and-reactjs/hooks/use-window-size/use-window-size.mdx"),
  "/nextjs-and-reactjs/utils/add-query-params/add-query-params.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/add-query-params/add-query-params.mdx"),
  "/nextjs-and-reactjs/utils/browser-notification/browser-notification.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/browser-notification/browser-notification.mdx"),
  "/nextjs-and-reactjs/utils/check-url/check-url.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/check-url/check-url.mdx"),
  "/nextjs-and-reactjs/utils/clear-search-params/clear-search-params.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/clear-search-params/clear-search-params.mdx"),
  "/nextjs-and-reactjs/utils/formik-utils/formik-utils.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/formik-utils/formik-utils.mdx"),
  "/nextjs-and-reactjs/utils/get-environment-mode/get-environment-mode.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/get-environment-mode/get-environment-mode.mdx"),
  "/nextjs-and-reactjs/utils/get-file-extension-from-url/get-file-extension-from-url.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/get-file-extension-from-url/get-file-extension-from-url.mdx"),
  "/nextjs-and-reactjs/utils/get-filename-from-url/get-filename-from-url.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/get-filename-from-url/get-filename-from-url.mdx"),
  "/nextjs-and-reactjs/utils/handle-mutation-error/handle-mutation-error.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/handle-mutation-error/handle-mutation-error.mdx"),
  "/nextjs-and-reactjs/utils/infinite-query-utils/infinite-query-utils.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/infinite-query-utils/infinite-query-utils.mdx"),
  "/nextjs-and-reactjs/utils/input-utils/input-utils.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/input-utils/input-utils.mdx"),
  "/nextjs-and-reactjs/utils/normalize-url/normalize-url.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/normalize-url/normalize-url.mdx"),
  "/nextjs-and-reactjs/utils/tanstack-query-client/tanstack-query-client.mdx": () =>
    import("../documentation/nextjs-and-reactjs/utils/tanstack-query-client/tanstack-query-client.mdx"),
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
