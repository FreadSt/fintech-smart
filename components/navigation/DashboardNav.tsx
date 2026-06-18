"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, SlidersHorizontal, X } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { IconButton } from "@/components/ui/IconButton";
import { DashboardNavLinks } from "./DashboardNavLinks";

export function DashboardNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="flex items-center justify-between gap-4 px-5 py-5 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-black">
            FF
          </div>
          <span className="text-lg font-semibold tracking-tight">FinFlex</span>
        </Link>

        <div className="hidden md:flex">
          <DashboardNavLinks pathname={pathname} />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Notifications" variant="surface" size="sm">
            <Bell />
          </IconButton>
          <IconButton label="Settings" variant="surface" size="sm">
            <SlidersHorizontal />
          </IconButton>

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full border border-border bg-surface-elevated text-foreground transition-colors hover:bg-surface md:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>

          <form action={logoutAction} className="sm:block">
            <button
              type="submit"
              aria-label="Sign out"
              className="size-9 overflow-hidden rounded-full border border-border bg-surface-elevated transition-opacity hover:opacity-80"
            >
              <span className="flex size-full items-center justify-center bg-linear-to-br from-primary/80 to-secondary text-xs font-semibold text-black">
                FF
              </span>
            </button>
          </form>
        </div>
      </header>

      {mobileOpen && (
        <div className="z-40 flex flex-col gap-3 border-t border-border/60 bg-background px-5 pb-4 pt-2 md:hidden">
          <DashboardNavLinks
            pathname={pathname}
            orientation="vertical"
            onLinkClick={closeMobile}
          />
          <form action={logoutAction} className="mt-2">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </>
  );
}