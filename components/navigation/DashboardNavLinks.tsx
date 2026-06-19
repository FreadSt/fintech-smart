"use client";

import Link from "next/link";
import { Text } from "@/shared/text/Text";
import { isNavItemActive, NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";

type DashboardNavLinksProps = {
  pathname: string;
  orientation?: "horizontal" | "vertical";
  onLinkClick?: () => void; 
};

export function DashboardNavLinks({
  pathname,
  orientation = "horizontal",
  onLinkClick,
}: DashboardNavLinksProps) {

  const isHorizontal = orientation === "horizontal";

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "flex items-center gap-1",
        isHorizontal
          ? " overflow-x-auto rounded-full border border-border/60 bg-surface px-2 py-1.5"
          : "flex-col gap-1"
      )}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isNavItemActive(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isHorizontal
                ? undefined
                : "w-1/2 justify-center",
              active
                ? "bg-primary text-black"
                : "text-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" strokeWidth={2} />
           <Text as="span" className="md:hidden min-[1030px]:inline lg:block">
              {label}
           </Text>
          </Link>
        );
      })}
    </nav>
  );
}
