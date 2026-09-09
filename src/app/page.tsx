"use client";

// Loaded with ssr:false because App.tsx's <BrowserRouter> touches `document`, which doesn't
// exist during Next's server-side prerendering pass — see src/app/client-root.tsx for details.
import dynamic from "next/dynamic";

const ClientRoot = dynamic(() => import("./client-root"), { ssr: false });

export default function RootPage() {
  return <ClientRoot />;
}
