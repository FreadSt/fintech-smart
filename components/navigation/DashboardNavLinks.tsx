"use client";

import Link from "next/link";
import { isNavItemActive, NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";

type DashboardNavLinksProps = {
  pathname: string;
};

export function DashboardNavLinks({ pathname }: DashboardNavLinksProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden max-w-[52vw] items-center overflow-x-auto rounded-full border border-border/60 bg-surface px-2 py-1.5 md:flex"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = isNavItemActive(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-black"
                : "text-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" strokeWidth={2} />
            <span className="hidden min-[1260px]:inline max-[1260px]:hidden">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
