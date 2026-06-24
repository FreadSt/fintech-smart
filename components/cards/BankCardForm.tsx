"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/shared/button/Button";
import { Input } from "@/shared/input/Input";
import { Text } from "@/shared/text/Text";
import type { AddBankCardInput, BankCardType } from "@/hooks/useBankCards";
import { cn } from "@/lib/utils/cn";

type BankCardFormProps = {
  onSubmit: (card: AddBankCardInput) => void;
};

const cardTypes: BankCardType[] = ["Debit", "Credit"];

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
}

function formatExpires(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function BankCardForm({ onSubmit }: BankCardFormProps) {
  const [type, setType] = useState<BankCardType>("Debit");
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expires, setExpires] = useState("");
  const [network, setNetwork] = useState("Visa");
  const [limit, setLimit] = useState("$5,000");
  const [balance, setBalance] = useState("$0.00");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      type,
      holder: holder.trim() || "Card holder",
      number,
      expires: expires.trim() || "12/29",
      network: network.trim() || "Visa",
      limit: limit.trim() || "$5,000",
      balance: balance.trim() || "$0.00",
    });

    setHolder("");
    setNumber("");
    setExpires("");
    setNetwork("Visa");
    setLimit("$5,000");
    setBalance("$0.00");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-2 rounded-full bg-surface-elevated p-1">
        {cardTypes.map((cardType) => (
          <Button
            key={cardType}
            aria-pressed={type === cardType}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors",
              type === cardType
                ? "bg-primary text-black"
                : "hover:text-foreground",
            )}
            onClick={() => setType(cardType)}
          >
            {cardType}
          </Button>
        ))}
      </div>

      <label className="block space-y-2">
        <Text as="span" className="text-sm text-muted">
          Card holder
        </Text>
        <Input
          required
          value={holder}
          onChange={(event) => setHolder(event.target.value)}
          className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          placeholder="Alex Morgan"
        />
      </label>

      <label className="block space-y-2">
        <Text as="span" className="text-sm text-muted">
          Card number
        </Text>
        <div className="relative">
          <CreditCard className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            required
            inputMode="numeric"
            pattern="\d{4} \d{4} \d{4} \d{4}"
            maxLength={19}
            value={number}
            onChange={(event) =>
              setNumber(formatCardNumber(event.target.value))
            }
            className="w-full rounded-2xl border border-border bg-surface-elevated py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
            placeholder="4242 4242 4242 4242"
            title="Enter a 16-digit card number grouped by 4 digits"
            autoComplete="cc-number"
          />
        </div>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2">
          <Text as="span" className="text-sm text-muted">
            Expires
          </Text>
          <Input
            required
            inputMode="numeric"
            pattern="^(0[1-9]|1[0-2])\/\d{2}$"
            maxLength={5}
            value={expires}
            onChange={(event) => setExpires(formatExpires(event.target.value))}
            className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            placeholder="05/29"
            title="Enter the expiry date in MM/YY format"
            autoComplete="cc-exp"
          />
        </label>
        <label className="block space-y-2">
          <Text as="span" className="text-sm text-muted">
            Network
          </Text>
          <Input
            required
            value={network}
            onChange={(event) => setNetwork(event.target.value)}
            className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            placeholder="Visa"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-2">
          <Text as="span" className="text-sm text-muted">
            Balance
          </Text>
          <Input
            required
            value={balance}
            onChange={(event) => setBalance(event.target.value)}
            className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            placeholder="$0.00"
          />
        </label>
        <label className="block space-y-2">
          <Text as="span" className="text-sm text-muted">
            Limit
          </Text>
          <Input
            required
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
            className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            placeholder="$5,000"
          />
        </label>
      </div>

      <Button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-black"
      >
        Add {type.toLowerCase()} card
      </Button>
    </form>
  );
}
