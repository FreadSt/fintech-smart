"use client";

import { CreditCard, Link2, RefreshCw, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import {
  WidgetEmptyState,
  WidgetSkeleton,
} from "@/components/dashboard/widgets/WidgetState";
import { Button } from "@/shared/button/Button";
import { Input } from "@/shared/input/Input";
import { Modal } from "@/shared/modal/Modal";
import { Text } from "@/shared/text/Text";
import type { BankCard } from "@/hooks/useBankCards";
import { cn } from "@/lib/utils/cn";
import { MonobankApiError } from "@/lib/monobank/client";
import { toBankCard } from "@/lib/monobank/view/dashboard";
import {
  useConnectMonobank,
  useMonobankOverview,
} from "./mono/useMonobankConnection";

export function CardsPageClient() {
  const overviewQuery = useMonobankOverview();
  const connectMutation = useConnectMonobank();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [token, setToken] = useState("");
  const [selectedCardId, setSelectedCardId] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem("finflex:selected-monobank-card") ?? "";
  });
  const bankCards = (overviewQuery.data?.accounts ?? []).map((account, index) =>
    toBankCard(account, index, overviewQuery.data?.connection?.client_name),
  );
  const activeCardId = selectedCardId || bankCards[0]?.id || "";
  const selectedCard =
    bankCards.find((card) => card.id === activeCardId) ?? bankCards[0];

  function handleConnect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    connectMutation.mutate(token, {
      onSuccess: () => {
        setToken("");
        setConnectModalOpen(false);
        window.localStorage.removeItem("finflex:selected-monobank-card");
        setSelectedCardId("");
      },
    });
  }

  function handleCardSelected(cardId: string) {
    window.localStorage.setItem("finflex:selected-monobank-card", cardId);
    setSelectedCardId(cardId);
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
          onClick={() => setConnectModalOpen(true)}
        >
          <Link2 className="size-4" />
          {overviewQuery.data?.connection ? "Replace token" : "Connect Monobank"}
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
          {overviewQuery.isLoading ? (
            <CardStackSkeleton />
          ) : overviewQuery.error ? (
            <ErrorPanel error={overviewQuery.error} />
          ) : selectedCard ? (
            <CardStack
              cards={bankCards}
              selectedCardId={activeCardId}
              onClick={() => setPickerOpen(true)}
            />
          ) : (
            <EmptyCards onConnect={() => setConnectModalOpen(true)} />
          )}
        </Card>

        {overviewQuery.isLoading ? (
          <SelectedCardSkeleton />
        ) : selectedCard ? (
          <SelectedCardPanel card={selectedCard} />
        ) : null}
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
              <Text as="span">{selectedCard?.limit ?? "No Data yet"}</Text>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Text as="h2" className="mb-5 text-lg font-semibold">Recent card activity</Text>
          <WidgetEmptyState className="min-h-36" />
        </Card>
      </div>

      <Modal
        open={connectModalOpen}
        title="Connect Monobank"
        onClose={() => setConnectModalOpen(false)}
      >
        <form className="space-y-4" onSubmit={handleConnect}>
          <div>
            <Text className="mb-2 text-sm text-muted">Personal X-Token</Text>
            <Input
              autoFocus
              className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary"
              placeholder="Paste X-Token"
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
            />
          </div>

          {connectMutation.error ? (
            <ErrorPanel error={connectMutation.error} />
          ) : null}

          <Button
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!token.trim() || connectMutation.isPending}
            type="submit"
          >
            {connectMutation.isPending ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Link2 className="size-4" />
            )}
            Validate and sync
          </Button>
        </form>
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
              selected={card.id === activeCardId}
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
  selectedCardId: string;
  onClick: () => void;
};

function CardStack({ cards, selectedCardId, onClick }: CardStackProps) {
  const selectedCard = cards.find((card) => card.id === selectedCardId);
  const stackedCards = [
    ...(selectedCard ? [selectedCard] : []),
    ...cards.filter((card) => card.id !== selectedCardId),
  ].slice(0, 3);

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
            "duration-300 ease-out hover:-translate-y-1",
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
        "rounded-card border p-5 text-left transition-all duration-200 hover:-translate-y-1",
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
  onConnect: () => void;
};

function EmptyCards({ onConnect }: EmptyCardsProps) {
  return (
    <div className="flex min-h-[210px] flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface-elevated p-6 text-center">
      <Text className="text-sm text-muted">No Data yet</Text>
      <Button
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black"
        onClick={onConnect}
      >
        <Link2 className="size-4" />
        Connect Monobank
      </Button>
    </div>
  );
}

function ErrorPanel({ error }: { error: Error }) {
  const retryAfterSeconds =
    error instanceof MonobankApiError ? error.retryAfterSeconds : undefined;

  return (
    <div className="rounded-card border border-border bg-surface-elevated/50 p-5">
      <Text className="text-sm font-medium text-red-400">{error.message}</Text>
      {retryAfterSeconds ? (
        <Text className="mt-1 text-xs text-muted">
          Retry after {retryAfterSeconds} seconds.
        </Text>
      ) : null}
    </div>
  );
}

function CardStackSkeleton() {
  return (
    <div className="relative h-[250px] w-full max-w-[430px]">
      {Array.from({ length: 3 }).map((_, index) => (
        <WidgetSkeleton
          key={index}
          className="absolute inset-x-0 top-0 h-[210px] rounded-card"
          style={{
            transform: `translate(${index * 18}px, ${index * 18}px)`,
            zIndex: 3 - index,
          }}
        />
      ))}
    </div>
  );
}

function SelectedCardSkeleton() {
  return (
    <Card className="flex min-h-[320px] flex-col justify-between p-6">
      <div>
        <WidgetSkeleton className="h-4 w-20" />
        <WidgetSkeleton className="mt-4 h-12 w-48" />
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <WidgetSkeleton className="h-4 w-20" />
          <WidgetSkeleton className="h-4 w-10" />
        </div>
        <WidgetSkeleton className="h-2 rounded-full" />
        <div className="mt-6 flex items-end justify-between">
          <div className="space-y-2">
            <WidgetSkeleton className="h-4 w-24" />
            <WidgetSkeleton className="h-4 w-20" />
          </div>
          <WidgetSkeleton className="h-6 w-16" />
        </div>
      </div>
    </Card>
  );
}
