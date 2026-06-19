import { Button } from "@/shared/button/Button";
import { cn } from "@/lib/utils/cn";

type IconButtonVariant = "ghost" | "surface" | "primary";
type IconButtonSize = "sm" | "md" | "lg";

type IconButtonProps = {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: "border-border/60 bg-transparent text-foreground hover:bg-surface-elevated",
  surface: "border-border bg-surface-elevated text-foreground hover:bg-surface",
  primary: "border-transparent bg-primary text-black hover:bg-primary/90",
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "size-8 [&_svg]:size-3.5",
  md: "size-10 [&_svg]:size-4",
  lg: "size-12 [&_svg]:size-5",
};

export function IconButton({
  variant = "ghost",
  size = "md",
  label,
  className,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <Button
      type={type}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border transition-colors",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
