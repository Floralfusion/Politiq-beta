"use client";

// Catch-all for every path React Router owns (e.g. /login, /profile/arjun-sharma, /admin/users).
// Next.js's file-based router only matches "/" via app/page.tsx by default; without this file,
// a hard refresh (or shared link) on any other route would 404 before React Router — which still
// owns all client-side navigation, unchanged — ever got a chance to render it. Loaded with
// ssr:false for the same reason as app/page.tsx — see src/app/client-root.tsx.
import dynamic from "next/dynamic";

const ClientRoot = dynamic(() => import("../client-root"), { ssr: false });

export default function CatchAllPage() {
  return <ClientRoot />;
}
