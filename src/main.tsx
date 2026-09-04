import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";
import { CLERK_PUBLISHABLE_KEY, DEMO_MODE } from "@/constants/config";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

const root = createRoot(document.getElementById("root")!);

const Tree = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

// ClerkProvider requires a real publishable key to initialize. In demo mode (no key configured),
// we skip it entirely and rely on the local demo auth store (see src/hooks/useAuth.ts) so the app
// is fully explorable with zero setup.
if (!DEMO_MODE && CLERK_PUBLISHABLE_KEY) {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
    </StrictMode>
  );
} else {
  root.render(Tree);
}
