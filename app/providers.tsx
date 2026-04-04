"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import AuthInitializer from "@/components/providers/AuthInitializer";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>{children}</AuthInitializer>
      </QueryClientProvider>
    </Provider>
  );
}
