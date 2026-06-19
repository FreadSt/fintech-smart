import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type TextProps<TElement extends ElementType> = {
  as?: TElement;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<TElement>, "as" | "className" | "children">;

export function Text<TElement extends ElementType = "p">({
  as,
  className,
  children,
  ...props
}: TextProps<TElement>) {
  const Component = as ?? "p";

  return (
    <Component className={cn(className)} {...props}>
      {children}
    </Component>
  );
}
