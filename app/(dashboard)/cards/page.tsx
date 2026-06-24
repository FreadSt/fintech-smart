import { CardsPageClient } from "@/components/cards/CardsPageClient";
import { cards } from "@/lib/dashboard/mock-data";

export default function CardsPage() {
  return <CardsPageClient initialCards={cards} />;
}
