import { Plus } from "lucide-react";
import { Text } from "@/shared/text/Text";
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
        <Text className="text-sm text-muted">{primaryCard.type}</Text>
        <Text className="mt-2 text-6xl font-light tracking-tight">{primaryCard.balance}</Text>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-1 text-sm">
          <Text className="text-muted">*{primaryCard.lastFour}</Text>
          <Text className="text-muted">{primaryCard.expires}</Text>
        </div>
        <Text className="text-xl font-bold italic tracking-widest">{primaryCard.network}</Text>
      </div>
    </Card>
  );
}
