import { cn } from "@/lib/utils/cn";

interface DropdownProps {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}

export function DropdownMenu({
  open,
  className = "",
  children,
}: DropdownProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 rounded-3xl border border-border bg-surface p-3 shadow-2xl shadow-black/40 animate-menu-in",
        className
      )}
    >
      {children}
    </div>
  );
}