import { CreditCard, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/button/Button";
import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { cards, transactions } from "@/lib/dashboard/mock-data";

export default function CardsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <Text className="text-sm text-muted">Wallet</Text>
          <Text as="h1" className="text-2xl font-semibold tracking-tight">Cards</Text>
        </div>
        <Button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black"
        >
          <Plus className="size-4" />
          Add card
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <Card
            key={card.lastFour}
            variant={card.variant === "primary" ? "gradient-credit" : "surface"}
            className="flex min-h-[260px] flex-col justify-between p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Text className="text-sm text-muted">{card.type}</Text>
                <Text className="mt-2 text-5xl font-thin tracking-tight">{card.balance}</Text>
              </div>
              <CreditCard className="size-6 text-primary" />
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between text-sm">
                <Text as="span" className="text-muted">Limit used</Text>
                <Text as="span">{card.used}%</Text>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/30">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${card.used}%` }}
                />
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div className="space-y-1 text-sm text-muted">
                  <Text>*{card.lastFour}</Text>
                  <Text>{card.expires}</Text>
                </div>
                <Text className="text-xl font-bold italic tracking-widest">{card.network}</Text>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Protection</Text>
            <ShieldCheck className="size-5 text-primary" />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-surface-elevated p-4">
              <Text as="span" className="text-muted">Online payments</Text>
              <Text as="span">Enabled</Text>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-surface-elevated p-4">
              <Text as="span" className="text-muted">Daily limit</Text>
              <Text as="span">$2,500</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Text as="h2" className="mb-5 text-lg font-semibold">Recent card activity</Text>
          <div className="space-y-4">
            {transactions.slice(0, 4).map((transaction) => (
              <div key={`${transaction.name}-${transaction.date}`} className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-sm font-medium">{transaction.name}</Text>
                  <Text className="text-xs text-muted">{transaction.account}</Text>
                </div>
                <Text className="text-sm font-semibold">{transaction.amount}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
