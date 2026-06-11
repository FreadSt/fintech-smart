import { ArrowUpRight, RefreshCw, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";

const transferAvatars = ["JD", "AM", "SK"];

export function BottomRowCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card
        className="overflow-hidden p-0"
        headerAction={
          <IconButton
            label="View goal details"
            variant="surface"
            size="sm"
            className="right-4 top-4"
          >
            <ArrowUpRight />
          </IconButton>
        }
      >
        <div className="relative p-5">
          <div className="absolute inset-0 bg-primary/30" style={{ width: "50%" }} />
          <div className="relative">
            <p className="text-sm text-muted">My Goal</p>
            <p className="mt-2 text-lg font-semibold">50% Completed</p>
            <p className="mt-1 text-sm text-muted">$1500 / $3k</p>
          </div>
        </div>
      </Card>

      <Card
        className="p-5"
        headerAction={
          <IconButton label="View savings details" variant="surface" size="sm">
            <ArrowUpRight />
          </IconButton>
        }
      >
        <p className="text-sm text-muted">Savings</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="text-2xl font-semibold">$1,678.00</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
            <TrendingUp className="size-3" />
            8.5%
          </span>
        </div>
      </Card>

      <Card
        className="p-5"
        headerAction={
          <IconButton label="Refresh transfers" variant="surface" size="sm">
            <RefreshCw />
          </IconButton>
        }
      >
        <p className="mb-4 text-sm text-muted">Quick Transfer</p>
        <div className="flex items-center gap-3">
          {transferAvatars.map((avatar, index) => (
            <div
              key={avatar}
              className="flex size-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-xs font-semibold"
              style={{ marginLeft: index === 0 ? 0 : -8 }}
            >
              {avatar}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
