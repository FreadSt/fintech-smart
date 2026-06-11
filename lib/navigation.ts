import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Home,
  Landmark,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/transactions", label: "Transactions", icon: Landmark },
  { href: "/payment", label: "Payment", icon: Wallet },
  { href: "/plan", label: "Plan", icon: CalendarDays },
  { href: "/cards", label: "Cards", icon: CreditCard },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}
