"use client";

// The actual client-only render tree, isolated into its own module so it can be loaded via
// next/dynamic with { ssr: false } from both app/page.tsx and app/[...slug]/page.tsx. This is
// required because App.tsx's <BrowserRouter> (react-router-dom) touches `document` during render,
// which doesn't exist when Next.js attempts to statically pre-render a page on the server —
// exactly as it would if you tried to server-render any other browser-only SPA router.
import { Providers } from "./providers";
import App from "@/App";

export default function ClientRoot() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}
