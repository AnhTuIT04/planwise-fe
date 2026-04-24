"use client";

import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const TanstackProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1, // Retry failed queries once
            refetchOnWindowFocus: false, // Do not refetch on window focus
            staleTime: Infinity, // Data is considered fresh indefinitely
          },
          mutations: {
            retry: false, // Do not retry failed mutations
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default TanstackProvider;
