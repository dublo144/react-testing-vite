import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export default function AllProviders({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
