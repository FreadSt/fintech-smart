import { cn } from "@/lib/utils/cn";

type CardVariant = "surface" | "gradient-balance" | "gradient-credit";

type CardProps = {
  variant?: CardVariant;
  className?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
};

const variantClasses: Record<CardVariant, string> = {
  surface: "border-border bg-surface",
  "gradient-balance": "gradient-balance border-transparent text-black",
  "gradient-credit": "gradient-credit border-border/20 text-foreground",
};

export function Card({
  variant = "surface",
  className,
  headerAction,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-card border p-5",
        variantClasses[variant],
        className,
      )}
    >
      {headerAction ? (
        <div className="absolute right-4 top-4">{headerAction}</div>
      ) : null}
      {children}
    </div>
  );
}
