"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/shared/button/Button";
import { Text } from "@/shared/text/Text";
import { cn } from "@/lib/utils/cn";

type ModalProps = {
  open: boolean;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClose?: () => void;
};

export function Modal({
  open,
  title,
  children,
  footer,
  className,
  onClose,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-card border border-border bg-surface p-5 shadow-xl",
          className,
        )}
      >
        {title || onClose ? (
          <div className="mb-4 flex items-center justify-between gap-4">
            {title ? (
              <Text as="h2" className="text-lg font-semibold">
                {title}
              </Text>
            ) : (
              <div />
            )}
            {onClose ? (
              <Button
                aria-label="Close modal"
                className="flex size-9 items-center justify-center rounded-full border border-border bg-surface-elevated text-foreground hover:bg-surface"
                onClick={onClose}
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
        ) : null}
        {children}
        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>
    </div>
  );
}
