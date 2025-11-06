"use client";

import { useState } from "react";

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
            retry: 1, // Retry failed mutations once
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default TanstackProvider;
