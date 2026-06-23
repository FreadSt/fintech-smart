import { cn } from "@/lib/utils/cn";

interface DropdownMenuProps {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}

export function DropdownMenu({ open, className = "", children }: DropdownMenuProps) {
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

interface DropdownMenuItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function DropdownMenuItem({ children, active, onClick }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl px-4 py-2 text-left text-sm transition-colors",
        active
          ? "bg-primary/15 font-medium text-primary"
          : "text-muted hover:bg-surface-elevated hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}