import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { transactions } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils/cn";

export default function TransactionsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <Text className="text-sm text-muted">Activity</Text>
          <Text as="h1" className="text-2xl font-semibold tracking-tight">Transactions</Text>
        </div>
        <div className="flex w-full items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted md:w-72">
          <Search className="size-4" />
          <Text as="span">Search transactions</Text>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] gap-4 border-b border-border px-5 py-4 text-xs uppercase text-muted max-md:hidden">
          <Text as="span">Merchant</Text>
          <Text as="span">Account</Text>
          <Text as="span">Status</Text>
          <Text as="span" className="text-right">Amount</Text>
        </div>
        <div className="divide-y divide-border">
          {transactions.map((transaction) => (
            <div
              key={`${transaction.name}-${transaction.date}`}
              className="grid gap-4 px-5 py-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr] md:items-center"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-surface-elevated text-xs font-semibold">
                  {transaction.positive ? (
                    <ArrowDownLeft className="size-4 text-primary" />
                  ) : (
                    <ArrowUpRight className="size-4 text-secondary" />
                  )}
                </div>
                <div>
                  <Text className="font-medium">{transaction.name}</Text>
                  <Text className="text-sm text-muted">
                    {transaction.category} / {transaction.date}
                  </Text>
                </div>
              </div>
              <Text className="text-sm text-muted">{transaction.account}</Text>
              <Text as="span" className="w-fit rounded-full bg-surface-elevated px-3 py-1 text-xs text-muted">
                {transaction.status}
              </Text>
              <Text
                className={cn(
                  "text-right font-semibold max-md:text-left",
                  transaction.positive ? "text-primary" : "text-foreground",
                )}
              >
                {transaction.amount}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
