import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type DropdownProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Dropdown({ className, children, ...props }: DropdownProps) {
  return (
    <select className={cn(className)} {...props}>
      {children}
    </select>
  );
}
