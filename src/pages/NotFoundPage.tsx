import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
      <Compass size={36} className="text-navy-300" />
      <h1 className="mt-4 text-2xl font-semibold text-navy-800">Page not found</h1>
      <p className="mt-2 text-sm text-ink-500">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/home" className="mt-6"><Button>Go to Home</Button></Link>
    </div>
  );
}
