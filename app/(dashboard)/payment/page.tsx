import { CalendarClock, CreditCard, SendHorizontal, Wallet } from "lucide-react";
import { Text } from "@/shared/text/Text";
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
        <Text className="text-sm text-muted">Move money</Text>
        <Text as="h1" className="text-2xl font-semibold tracking-tight">Payment</Text>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Quick transfer</Text>
            <SendHorizontal className="size-5 text-primary" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickTransfers.map((transfer) => (
              <div key={transfer.initials} className="rounded-2xl bg-surface-elevated p-4">
                <div className="flex size-11 items-center justify-center rounded-full border border-border text-xs font-semibold">
                  {transfer.initials}
                </div>
                <Text className="mt-3 text-sm font-medium">{transfer.name}</Text>
                <Text className="mt-1 text-sm text-muted">Last sent {transfer.amount}</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Text as="h2" className="text-lg font-semibold">Payment methods</Text>
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
                    <Text className="text-sm font-medium">{method.name}</Text>
                    <Text className="text-xs text-muted">{method.type}</Text>
                  </div>
                </div>
                <div className="text-right">
                  <Text className="text-sm">{method.status}</Text>
                  <Text className="text-xs text-muted">{method.due}</Text>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Text as="h2" className="text-lg font-semibold">Scheduled payments</Text>
          <CalendarClock className="size-5 text-primary" />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {scheduledPayments.map((payment) => (
            <div key={payment.name} className="rounded-2xl bg-surface-elevated p-4">
              <div className="flex items-center justify-between gap-3">
                <Text className="font-medium">{payment.name}</Text>
                <Text as="span" className="rounded-full bg-background px-3 py-1 text-xs text-muted">
                  {payment.status}
                </Text>
              </div>
              <Text className="mt-4 text-2xl font-semibold">{payment.amount}</Text>
              <Text className="mt-1 text-sm text-muted">Due {payment.due}</Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
