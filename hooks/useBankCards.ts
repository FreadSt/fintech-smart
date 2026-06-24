"use client";

import { useState } from "react";

export type BankCardType = "Debit" | "Credit";

export type BankCard = {
  id: string;
  type: BankCardType;
  balance: string;
  lastFour: string;
  expires: string;
  network: string;
  limit: string;
  used: number;
  variant: "primary" | "surface";
  holder: string;
  activities: CardActivity[];
};

export type CardActivity = {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: string;
  positive: boolean;
};

export type AddBankCardInput = {
  type: BankCardType;
  holder: string;
  number: string;
  expires: string;
  network: string;
  limit: string;
  balance: string;
};

export type DashboardCard = {
  type: string;
  balance: string;
  lastFour: string;
  expires: string;
  network: string;
  limit: string;
  used: number;
  variant: string;
};

const cardActivityTemplates: Record<BankCardType, Omit<CardActivity, "id">[]> =
  {
    Credit: [
      {
        name: "Airbnb",
        category: "Travel",
        date: "Today, 10:24 AM",
        amount: "-$188.40",
        positive: false,
      },
      {
        name: "Spotify",
        category: "Subscription",
        date: "Yesterday, 08:12 PM",
        amount: "-$10.99",
        positive: false,
      },
      {
        name: "Cashback reward",
        category: "Rewards",
        date: "Jun 22, 09:00 AM",
        amount: "+$24.18",
        positive: true,
      },
    ],
    Debit: [
      {
        name: "Whole Foods",
        category: "Groceries",
        date: "Today, 01:18 PM",
        amount: "-$62.75",
        positive: false,
      },
      {
        name: "Salary deposit",
        category: "Income",
        date: "Yesterday, 09:00 AM",
        amount: "+$2,450.00",
        positive: true,
      },
      {
        name: "City Parking",
        category: "Transport",
        date: "Jun 21, 06:40 PM",
        amount: "-$12.00",
        positive: false,
      },
    ],
  };

function normalizeCardType(type: string): BankCardType {
  return type === "Debit" ? "Debit" : "Credit";
}

function createActivities(
  type: BankCardType,
  lastFour: string,
): CardActivity[] {
  return cardActivityTemplates[type].map((activity, index) => ({
    ...activity,
    id: `${type.toLowerCase()}-${lastFour}-${index}`,
  }));
}

function createCardId(lastFour: string): string {
  return `card-${lastFour}-${Date.now()}`;
}

function toBankCard(card: DashboardCard, index: number): BankCard {
  const type = normalizeCardType(card.type);

  return {
    ...card,
    id: `card-${card.lastFour}-${index}`,
    type,
    holder: index === 0 ? "Alex Morgan" : "Taylor Brooks",
    variant: card.variant === "primary" ? "primary" : "surface",
    activities: createActivities(type, card.lastFour),
  };
}

export function useBankCards(initialCards: DashboardCard[]) {
  const [bankCards, setBankCards] = useState<BankCard[]>(
    initialCards.map(toBankCard),
  );
  const [selectedCardId, setSelectedCardId] = useState(
    initialCards[0] ? `card-${initialCards[0].lastFour}-0` : "",
  );

  const selectedCard =
    bankCards.find((card) => card.id === selectedCardId) ?? bankCards[0];

  function addCard(input: AddBankCardInput) {
    const lastFour = input.number.replace(/\D/g, "").slice(-4).padStart(4, "0");
    const card: BankCard = {
      id: createCardId(lastFour),
      type: input.type,
      balance: input.balance,
      lastFour,
      expires: input.expires,
      network: input.network.toUpperCase(),
      limit: input.limit,
      used: input.type === "Credit" ? 12 : 4,
      variant: bankCards.length === 0 ? "primary" : "surface",
      holder: input.holder,
      activities: createActivities(input.type, lastFour),
    };

    setBankCards((currentCards) => [card, ...currentCards]);
    setSelectedCardId(card.id);
  }

  function selectCard(cardId: string) {
    setBankCards((currentCards) => {
      const index = currentCards.findIndex((card) => card.id === cardId);
      if (index === -1) return currentCards;
      const selected = currentCards[index];
      return [
        selected,
        ...currentCards.slice(0, index),
        ...currentCards.slice(index + 1),
      ];
    });
    setSelectedCardId(cardId);
  }

  return {
    bankCards,
    selectedCard,
    selectedCardId,
    addCard,
    selectCard,
  };
}
