import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(className, 'cursor-pointer')} {...props}>
      {children}
    </button>
  );
}
