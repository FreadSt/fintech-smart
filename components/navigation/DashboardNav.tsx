"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, SlidersHorizontal, X } from "lucide-react";

import { logoutAction } from "@/app/login/actions";
import { Button } from "@/shared/button/Button";
import { Text } from "@/shared/text/Text";

import { DashboardNavLinks } from "./DashboardNavLinks";
import { NavbarMenu } from "./menus/NavbarMenu";

import { NotificationsMenu } from "./menus/NotificationMenu";
import { SettingsMenu } from "./menus/SettingsMenu";
import { ProfileMenu } from "./menus/ProfileMenu";

import { DropdownMenu } from "@/shared/menu-dropdown/DropdownMenu";
import { useClickOutside } from "@/hooks/useClickOutside";

type NavMenu = "notifications" | "settings" | "profile";

export function DashboardNav() {
  const pathname = usePathname();

  const navRef = useRef<HTMLDivElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<NavMenu | null>(null);

  useClickOutside(navRef, () => {
    setOpenMenu(null);
  });

  const closeMobile = () => setMobileOpen(false);

  const toggleMenu = (menu: NavMenu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  return (
    <>
      <header className="flex items-center justify-between gap-4 px-5 pb-5 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-base font-bold text-black">
            FF
          </div>

          <Text as="span" className="text-lg font-semibold tracking-tight">
            FinFlex
          </Text>
        </Link>

        <div className="hidden md:flex">
          <DashboardNavLinks pathname={pathname} />
        </div>

        <div className="relative flex shrink-0 items-center gap-2" ref={navRef}>
          <NavbarMenu
            menu="notifications"
            currentMenu={openMenu}
            onToggle={toggleMenu}
            icon={<Bell />}
            label="Notifications"
            dropdownClassName="right-0 top-11 w-80 max-w-[calc(100vw-2rem)]"
          >
            <NotificationsMenu />
          </NavbarMenu>

          <NavbarMenu
            menu="settings"
            currentMenu={openMenu}
            onToggle={toggleMenu}
            icon={<SlidersHorizontal />}
            label="Settings"
            dropdownClassName="right-0 top-11 w-72 max-w-[calc(100vw-2rem)]"
          >
            <SettingsMenu />
          </NavbarMenu>

          <Button
            type="button"
            aria-label="Open profile menu"
            aria-expanded={openMenu === "profile"}
            onClick={() => toggleMenu("profile")}
            className="size-9 overflow-hidden rounded-full border border-border bg-surface-elevated transition-opacity hover:opacity-80"
          >
            <Text
              as="span"
              className="flex size-full items-center justify-center bg-linear-to-br from-primary/80 to-secondary text-xs font-semibold text-black"
            >
              FF
            </Text>
          </Button>

          <DropdownMenu
            open={openMenu === "profile"}
            className="right-0 top-11 w-64 max-w-[calc(100vw-2rem)]"
          >
            <ProfileMenu onClose={() => setOpenMenu(null)} />
          </DropdownMenu>

          <Button
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
          </Button>
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
            <Button
              type="submit"
              className="flex w-full items-center justify-center rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
            >
              Sign out
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
