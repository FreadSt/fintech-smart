import Link from "next/link";
import { LogOut, User } from "lucide-react";

import { logoutAction } from "@/app/login/actions";
import { Text } from "@/shared/text/Text";
import { Button } from "@/shared/button/Button";

interface ProfileMenuProps {
  onClose: () => void;
}

export function ProfileMenu({ onClose }: ProfileMenuProps) {
  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-primary/80 to-secondary text-sm font-semibold text-black">
          FF
        </span>

        <div>
          <Text as="h2" className="text-sm font-semibold">
            FinFlex user
          </Text>

          <Text className="text-xs text-muted">Dashboard account</Text>
        </div>
      </div>

      <Link
        href="/"
        onClick={onClose}
        className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
      >
        <User className="size-4" />
        Profile
      </Link>
      {/*action={logoutAction} here */}
      <form className="mt-1">
        <Button
          type="submit"
          className="flex disabled w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-red-300 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </form>
    </>
  );
}
