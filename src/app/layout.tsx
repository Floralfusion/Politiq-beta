import type { Metadata, Viewport } from "next";
import "../index.css";
import { APP_URL } from "@/constants/config";

// Ports the <head> metadata that used to live in index.html (Vite's entry HTML has no
// equivalent in Next.js — this is the one required replacement for it).
export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "POLITIQ — Find the Right Person. Build Trusted Connections.",
  description:
    "POLITIQ is the professional network for politics and public life. Discover, verify, and connect with the right people.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "POLITIQ — Find the Right Person. Build Trusted Connections.",
    description: "The professional network for politics and public life.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#152A54",
};

// Root layout is a server component by default. All actual app logic (providers, routing) lives
// client-side under app/[[...slug]]/page.tsx — see docs there for why.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
