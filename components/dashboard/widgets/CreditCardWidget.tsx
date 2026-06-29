import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { cards } from "@/lib/dashboard/mock-data";
import { WidgetEmptyState, WidgetSkeleton } from "./WidgetState";

type CreditCardWidgetProps = {
  isLoading?: boolean;
  userCards?: typeof cards;
};

export function CreditCardWidget({
  isLoading = false,
  userCards = cards,
}: CreditCardWidgetProps) {
  const primaryCard = userCards[0];

  return (
    <Card
      variant="gradient-credit"
      className="flex min-h-full flex-col justify-between p-6"
      // headerAction={
      //   <IconButton label="Add card" variant="primary" size="lg">
      //     <Plus />
      //   </IconButton>
      // }
    >
      {isLoading ? (
        <CreditCardSkeleton />
      ) : !primaryCard ? (
        <WidgetEmptyState />
      ) : (
        <>
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
        </>
      )}
    </Card>
  );
}

function CreditCardSkeleton() {
  return (
    <>
      <div>
        <WidgetSkeleton className="h-4 w-20" />
        <WidgetSkeleton className="mt-4 h-14 w-48 max-w-full" />
      </div>
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <WidgetSkeleton className="h-4 w-16" />
          <WidgetSkeleton className="h-4 w-14" />
        </div>
        <WidgetSkeleton className="h-6 w-16" />
      </div>
    </>
  );
}
