import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { balanceSparkline, dashboardSummary } from "@/lib/dashboard/mock-data";
import Link from "next/link";

export function TotalBalanceCard() {
  return (
    <Card
      variant="gradient-balance"
      className="flex min-h-full flex-col justify-between p-6"
      headerAction={
        <Link href="/cards">
          <IconButton
            label="View balance details"
            variant="surface"
            size="sm"
            className="border-black/10 bg-black/10 text-black hover:bg-black/20"
          >
            <ArrowUpRight />
          </IconButton>
        </Link>
        
      }
    >
      <div>
        <Text className="text-sm font-medium text-black/70">Total Balance</Text>
        <Text className="mt-2 text-4xl font-light tracking-tight md:text-[5.5rem]">
          {dashboardSummary.totalBalance}
        </Text>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Text as="span" className="inline-flex items-center gap-1 rounded-full bg-black px-3 py-1 text-xs font-semibold text-primary">
            <TrendingUp className="size-3" />
            {dashboardSummary.balanceTrend}
          </Text>
          <Text as="span" className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold text-primary">
            {dashboardSummary.balanceDelta}
          </Text>
        </div>

        <div className="flex h-16 items-end gap-1">
          {balanceSparkline.map((height, index) => (
            <div
              key={index}
              className="w-1.5 rounded-full bg-black/25"
              style={{ height }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
