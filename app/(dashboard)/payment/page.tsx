import { CalendarClock, CreditCard, SendHorizontal, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  paymentMethods,
  quickTransfers,
  scheduledPayments,
} from "@/lib/dashboard/mock-data";

export default function PaymentPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted">Move money</p>
        <h1 className="text-2xl font-semibold tracking-tight">Payment</h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick transfer</h2>
            <SendHorizontal className="size-5 text-primary" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickTransfers.map((transfer) => (
              <div key={transfer.initials} className="rounded-2xl bg-surface-elevated p-4">
                <div className="flex size-11 items-center justify-center rounded-full border border-border text-xs font-semibold">
                  {transfer.initials}
                </div>
                <p className="mt-3 text-sm font-medium">{transfer.name}</p>
                <p className="mt-1 text-sm text-muted">Last sent {transfer.amount}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Payment methods</h2>
            <Wallet className="size-5 text-secondary" />
          </div>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="flex items-center justify-between gap-4 rounded-2xl bg-surface-elevated p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-background">
                    <CreditCard className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{method.name}</p>
                    <p className="text-xs text-muted">{method.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{method.status}</p>
                  <p className="text-xs text-muted">{method.due}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Scheduled payments</h2>
          <CalendarClock className="size-5 text-primary" />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {scheduledPayments.map((payment) => (
            <div key={payment.name} className="rounded-2xl bg-surface-elevated p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{payment.name}</p>
                <span className="rounded-full bg-background px-3 py-1 text-xs text-muted">
                  {payment.status}
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold">{payment.amount}</p>
              <p className="mt-1 text-sm text-muted">Due {payment.due}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
