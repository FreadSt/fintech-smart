"use client";

import { CreditCard, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { BankCardForm } from "@/components/cards/BankCardForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/shared/button/Button";
import { Modal } from "@/shared/modal/Modal";
import { Text } from "@/shared/text/Text";
import {
  useBankCards,
  type BankCard,
  type DashboardCard,
} from "@/hooks/useBankCards";
import { cn } from "@/lib/utils/cn";

type CardsPageClientProps = {
  initialCards: DashboardCard[];
};

export function CardsPageClient({ initialCards }: CardsPageClientProps) {
  const { bankCards, selectedCard, selectedCardId, addCard, selectCard } =
    useBankCards(initialCards);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleCardAdded(card: Parameters<typeof addCard>[0]) {
    addCard(card);
    setAddModalOpen(false);
  }

  function handleCardSelected(cardId: string) {
    selectCard(cardId);
    setPickerOpen(false);
  }

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
          onClick={() => setAddModalOpen(true)}
        >
          <Plus className="size-4" />
          Add card
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="min-h-[320px] p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <Text as="h2" className="text-lg font-semibold">Card stack</Text>
              <Text className="text-sm text-muted">Tap the stack to choose a card</Text>
            </div>
            <CreditCard className="size-5 text-primary" />
          </div>
          {selectedCard ? (
            <CardStack cards={bankCards} onClick={() => setPickerOpen(true)} />
          ) : (
            <EmptyCards onAdd={() => setAddModalOpen(true)} />
          )}
        </Card>

        {selectedCard ? <SelectedCardPanel card={selectedCard} /> : null}
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
              <Text as="span">{selectedCard?.type === "Credit" ? "$2,500" : "$1,200"}</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Text as="h2" className="mb-5 text-lg font-semibold">Recent card activity</Text>
          <div className="space-y-4">
            {selectedCard?.activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between gap-3">
                <div>
                  <Text className="text-sm font-medium">{activity.name}</Text>
                  <Text className="text-xs text-muted">
                    {activity.category} - {selectedCard.type} *{selectedCard.lastFour}
                  </Text>
                </div>
                <Text
                  className={cn(
                    "text-sm font-semibold",
                    activity.positive ? "text-accent-emerald" : "text-foreground",
                  )}
                >
                  {activity.amount}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        open={addModalOpen}
        title="Add bank card"
        className="max-w-xl"
        onClose={() => setAddModalOpen(false)}
      >
        <BankCardForm onSubmit={handleCardAdded} />
      </Modal>

      <Modal
        open={pickerOpen}
        title="Choose card"
        className="max-w-3xl"
        onClose={() => setPickerOpen(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {bankCards.map((card) => (
            <CardPreview
              key={card.id}
              card={card}
              selected={card.id === selectedCardId}
              onClick={() => handleCardSelected(card.id)}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

type CardStackProps = {
  cards: BankCard[];
  onClick: () => void;
};

function CardStack({ cards, onClick }: CardStackProps) {
  const stackedCards = cards.slice(0, 3);

  return (
    <Button
      aria-label="Choose card from stack"
      className="relative block h-[250px] w-full max-w-[430px] text-left"
      onClick={onClick}
    >
      {stackedCards.map((card, index) => (
        <div
          key={card.id}
          className={cn(
            "absolute inset-x-0 top-0 flex h-[210px] flex-col justify-between rounded-card border p-6 shadow-xl transition-transform",
            index === 0 ? "gradient-credit border-border/20" : "border-border bg-surface-elevated",
          )}
          style={{
            transform: `translate(${index * 18}px, ${index * 18}px)`,
            zIndex: stackedCards.length - index,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Text className="text-sm text-muted">{card.type}</Text>
              <Text className="mt-2 text-4xl font-thin tracking-tight">{card.balance}</Text>
            </div>
            <CreditCard className="size-5 text-primary" />
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-1 text-sm text-muted">
              <Text>{card.holder}</Text>
              <Text>*{card.lastFour} - {card.expires}</Text>
            </div>
            <Text className="text-lg font-bold italic tracking-widest">{card.network}</Text>
          </div>
        </div>
      ))}
    </Button>
  );
}

type SelectedCardPanelProps = {
  card: BankCard;
};

function SelectedCardPanel({ card }: SelectedCardPanelProps) {
  return (
    <Card
      variant={card.variant === "primary" ? "gradient-credit" : "surface"}
      className="flex min-h-[320px] flex-col justify-between p-6"
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
            <Text>{card.holder}</Text>
            <Text>*{card.lastFour} - {card.expires}</Text>
          </div>
          <Text className="text-xl font-bold italic tracking-widest">{card.network}</Text>
        </div>
      </div>
    </Card>
  );
}

type CardPreviewProps = {
  card: BankCard;
  selected: boolean;
  onClick: () => void;
};

function CardPreview({ card, selected, onClick }: CardPreviewProps) {
  return (
    <Button
      className={cn(
        "rounded-card border p-5 text-left transition-colors",
        selected ? "border-primary bg-primary/10" : "border-border bg-surface-elevated hover:border-primary/70",
      )}
      onClick={onClick}
    >
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <Text className="text-sm text-muted">{card.type}</Text>
          <Text className="mt-2 text-3xl font-thin tracking-tight">{card.balance}</Text>
        </div>
        <CreditCard className="size-5 text-primary" />
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1 text-sm text-muted">
          <Text>{card.holder}</Text>
          <Text>*{card.lastFour} - {card.expires}</Text>
        </div>
        <Text className="text-lg font-bold italic tracking-widest">{card.network}</Text>
      </div>
    </Button>
  );
}

type EmptyCardsProps = {
  onAdd: () => void;
};

function EmptyCards({ onAdd }: EmptyCardsProps) {
  return (
    <div className="flex min-h-[210px] flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-elevated p-6 text-center">
      <Text className="text-sm text-muted">No cards yet</Text>
      <Button
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black"
        onClick={onAdd}
      >
        <Plus className="size-4" />
        Add card
      </Button>
    </div>
  );
}
