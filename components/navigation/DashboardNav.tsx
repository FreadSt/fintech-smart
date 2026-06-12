"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, SlidersHorizontal } from "lucide-react";
import { logoutAction } from "@/app/login/actions";
import { IconButton } from "@/components/ui/IconButton";
import { DashboardNavLinks } from "./DashboardNavLinks";

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-5 md:px-6">
      <Link href="/" className="flex shrink-0 items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-black">
          FF
        </div>
        <span className="text-lg font-semibold tracking-tight">FinFlex</span>
      </Link>

      <DashboardNavLinks pathname={pathname} />

      <div className="flex shrink-0 items-center gap-2">
        <IconButton label="Notifications" variant="surface" size="sm">
          <Bell />
        </IconButton>
        <IconButton label="Settings" variant="surface" size="sm">
          <SlidersHorizontal />
        </IconButton>
        <form action={logoutAction}>
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
  );
}
