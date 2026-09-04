import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

const sizes = { xs: "h-6 w-6 text-[10px]", sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base", xl: "h-28 w-28 text-2xl" };
const dotSizes = { xs: "h-1.5 w-1.5", sm: "h-2 w-2", md: "h-2.5 w-2.5", lg: "h-3 w-3", xl: "h-4 w-4" };

export function Avatar({ src, name, size = "md", online, className }: AvatarProps) {
  return (
    <div className={cn("relative shrink-0", sizes[size], className)}>
      {src ? (
        <img src={src} alt={name} className={cn("h-full w-full rounded-full object-cover ring-1 ring-black/5")} />
      ) : (
        <div className="h-full w-full rounded-full bg-navy-100 text-navy-700 font-semibold flex items-center justify-center ring-1 ring-black/5">
          {initials(name)}
        </div>
      )}
      {online && (
        <span className={cn("absolute bottom-0 right-0 rounded-full bg-success-500 ring-2 ring-white", dotSizes[size])} />
      )}
    </div>
  );
}
