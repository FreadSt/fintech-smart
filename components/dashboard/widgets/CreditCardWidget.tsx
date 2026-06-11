import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";

export function CreditCardWidget() {
  return (
    <Card
      variant="gradient-credit"
      className="flex min-h-55 flex-col justify-between p-6 " 
      headerAction={
        <IconButton label="Add card" variant="primary" size="lg">
          <Plus />
        </IconButton>
      }
    >
      <div>
        <p className="text-sm text-muted">Credit</p>
        <p className="mt-2 text-3xl font-thin tracking-tight">$4,568.00</p>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-1 text-sm">
          <p className="text-muted">*8967</p>
          <p className="text-muted">05/27</p>
        </div>
        <p className="text-xl font-bold italic tracking-widest">VISA</p>
      </div>
    </Card>
  );
}
