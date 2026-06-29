import { CardsPageClient } from "@/components/cards/CardsPageClient";
import { MonobankConnectionWidget } from "@/components/cards/mono/MonobankConnectionWidget";
import { cards } from "@/lib/dashboard/mock-data";

export default function CardsPage() {
  return (
    <div className="space-y-5">
      <MonobankConnectionWidget />
      <CardsPageClient initialCards={cards} />
    </div>
  );
}
