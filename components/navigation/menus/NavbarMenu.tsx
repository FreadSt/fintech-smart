import { DropdownMenu } from "@/shared/menu-dropdown/DropdownMenu";
import { IconButton } from "../../ui/IconButton";

type NavMenu = "notifications" | "settings" | "profile";


interface NavbarMenuProps {
  menu: NavMenu;
  currentMenu: NavMenu | null;
  onToggle: (menu: NavMenu) => void;
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  dropdownClassName?: string;
}

export function NavbarMenu({
  menu,
  currentMenu,
  onToggle,
  icon,
  label,
  children,
  dropdownClassName,
}: NavbarMenuProps) {
  const isOpen = currentMenu === menu;

  return (
    <>
      <IconButton
        label={label}
        variant="surface"
        size="sm"
        aria-expanded={isOpen}
        onClick={() => onToggle(menu)}
      >
        {icon}
      </IconButton>

      <DropdownMenu
        open={isOpen}
        className={dropdownClassName}
      >
        {children}
      </DropdownMenu>
    </>
  );
}