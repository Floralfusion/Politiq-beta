"use client";

// Ports the provider-wrapping logic that used to live in src/main.tsx. Next.js has no equivalent
// entry file to call ReactDOM.createRoot() ourselves, so this client component takes over that
// job: it wraps the existing <App/> (unchanged) with the same conditional ClerkProvider /
// QueryClientProvider logic main.tsx used to apply.
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { CLERK_PUBLISHABLE_KEY, DEMO_MODE } from "@/constants/config";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState (not a module-level singleton) so each client gets its own QueryClient instance,
  // consistent with Next.js App Router guidance for client-side providers.
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } })
  );

  // ClerkProvider requires a real publishable key to initialize. In demo mode (no key configured),
  // we skip it entirely and rely on the local demo auth store (see src/hooks/useAuth.ts) so the
  // app is fully explorable with zero setup — same behavior as the old main.tsx.
  if (!DEMO_MODE && CLERK_PUBLISHABLE_KEY) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ClerkProvider>
    );
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
