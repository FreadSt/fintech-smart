import { CreditCard, Plus, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cards, transactions } from "@/lib/dashboard/mock-data";

export default function CardsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-muted">Wallet</p>
          <h1 className="text-2xl font-semibold tracking-tight">Cards</h1>
        </div>
        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black"
        >
          <Plus className="size-4" />
          Add card
        </button>
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
                <p className="text-sm text-muted">{card.type}</p>
                <p className="mt-2 text-5xl font-thin tracking-tight">{card.balance}</p>
              </div>
              <CreditCard className="size-6 text-primary" />
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted">Limit used</span>
                <span>{card.used}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/30">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${card.used}%` }}
                />
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div className="space-y-1 text-sm text-muted">
                  <p>*{card.lastFour}</p>
                  <p>{card.expires}</p>
                </div>
                <p className="text-xl font-bold italic tracking-widest">{card.network}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Protection</h2>
            <ShieldCheck className="size-5 text-primary" />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-surface-elevated p-4">
              <span className="text-muted">Online payments</span>
              <span>Enabled</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-surface-elevated p-4">
              <span className="text-muted">Daily limit</span>
              <span>$2,500</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-5 text-lg font-semibold">Recent card activity</h2>
          <div className="space-y-4">
            {transactions.slice(0, 4).map((transaction) => (
              <div key={`${transaction.name}-${transaction.date}`} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{transaction.name}</p>
                  <p className="text-xs text-muted">{transaction.account}</p>
                </div>
                <p className="text-sm font-semibold">{transaction.amount}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
