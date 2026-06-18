import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { cards } from "@/lib/dashboard/mock-data";

export function CreditCardWidget() {
  const primaryCard = cards[0];

  return (
    <Card
      variant="gradient-credit"
      className="flex min-h-full flex-col justify-between p-6"
      headerAction={
        <IconButton label="Add card" variant="primary" size="lg">
          <Plus />
        </IconButton>
      }
    >
      <div>
        <p className="text-sm text-muted">{primaryCard.type}</p>
        <p className="mt-2 text-6xl font-light tracking-tight">{primaryCard.balance}</p>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-1 text-sm">
          <p className="text-muted">*{primaryCard.lastFour}</p>
          <p className="text-muted">{primaryCard.expires}</p>
        </div>
        <p className="text-xl font-bold italic tracking-widest">{primaryCard.network}</p>
      </div>
    </Card>
  );
}
