"use client";
import DevDashboardProvder from "@/features/dev-dashboard/DevDashboardProvider";
import NoInternetOverlay from "@/features/no-internet/NoInternetOverlay";
import YupSchemaExtensions from "@/features/schema-extensions/SchemaExtensions";
import { ProgressProvider } from "@bprogress/next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";

const RootLayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
            // refetchOnMount: false,
            // refetchOnReconnect: false,
          }
        }
        // queryCache: new QueryCache({
        //   onError: handleMutationError,
        // }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <NoInternetOverlay>
          <ProgressProvider
            height="4px"
            color={`var(--primary)`}
            options={{ showSpinner: false }}
            shallowRouting
          >
            <Toaster
              toastOptions={{
                success: {
                  iconTheme: {
                    primary: `var(--primary)`,
                    secondary: ""
                  },
                  style: {
                    overflowWrap: "break-word",
                    borderLeft: `5px solid var(--primary)`
                  }
                },
                error: {
                  style: {
                    overflowWrap: "break-word"
                  }
                }
              }}
            />
            <YupSchemaExtensions />
            <DevDashboardProvder />
            {children}
          </ProgressProvider>
        </NoInternetOverlay>
      </NuqsAdapter>
    </QueryClientProvider>
  );
};

export default RootLayoutProvider;
