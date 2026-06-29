"use client";

import { Link2, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { WidgetEmptyState, WidgetSkeleton } from "@/components/dashboard/widgets/WidgetState";
import { Button } from "@/shared/button/Button";
import { Input } from "@/shared/input/Input";
import { Modal } from "@/shared/modal/Modal";
import { Text } from "@/shared/text/Text";
import { formatKopecks } from "@/lib/monobank/money";
import { MonobankApiError } from "@/lib/monobank/client";
import { TransactionsList } from "./TransactionsList";
import {
  getDefaultStatementRange,
  useConnectMonobank,
  useDisconnectMonobank,
  useMonobankOverview,
} from "./useMonobankConnection";

export function MonobankConnectionWidget() {
  const [modalOpen, setModalOpen] = useState(false);
  const [statementRange] = useState(getDefaultStatementRange);
  const [token, setToken] = useState("");
  const overviewQuery = useMonobankOverview();
  const connectMutation = useConnectMonobank();
  const disconnectMutation = useDisconnectMonobank();
  const overview = overviewQuery.data;
  const isConnected = Boolean(overview?.connection);
  const totalBalance = overview?.accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  ) ?? 0;

  function handleConnect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    connectMutation.mutate(token, {
      onSuccess: () => {
        setToken("");
        setModalOpen(false);
      },
    });
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <Text className="text-sm text-muted">Personal Monobank</Text>
            <Text as="h2" className="text-lg font-semibold">Connection</Text>
          </div>

          <div className="flex gap-2">
            {isConnected ? (
              <Button
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
                disabled={disconnectMutation.isPending}
                onClick={() => disconnectMutation.mutate()}
              >
                <Trash2 className="size-4" />
                Disconnect
              </Button>
            ) : null}
            <Button
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-black"
              onClick={() => setModalOpen(true)}
            >
              <Link2 className="size-4" />
              {isConnected ? "Replace token" : "Connect"}
            </Button>
          </div>
        </div>

        {overviewQuery.isLoading ? (
          <ConnectionSkeleton />
        ) : overviewQuery.error ? (
          <ErrorPanel error={overviewQuery.error} />
        ) : !isConnected ? (
          <WidgetEmptyState className="min-h-48" />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <ConnectionStat
                label="Client"
                value={overview?.connection?.client_name ?? "Monobank"}
              />
              <ConnectionStat
                label="Total balance"
                value={formatKopecks(totalBalance)}
              />
              <ConnectionStat
                label="Cards"
                value={String(overview?.accounts.length ?? 0)}
              />
              <ConnectionStat
                label="Jars"
                value={String(overview?.jars.length ?? 0)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface-elevated p-4 text-sm text-muted">
              <ShieldCheck className="size-4 text-primary" />
              <Text as="span">
                Last client sync: {formatSyncTime(overview?.connection?.last_client_info_sync_at ?? null)}
              </Text>
              <Text as="span">
                Last statement sync: {formatSyncTime(overview?.connection?.last_statement_sync_at ?? null)}
              </Text>
            </div>

            <div>
              <Text as="h3" className="mb-3 text-sm font-semibold">
                Recent transactions
              </Text>
              <TransactionsList
                from={statementRange.from}
                to={statementRange.to}
              />
            </div>
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        title="Connect Monobank"
        onClose={() => setModalOpen(false)}
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
    </>
  );
}

type ConnectionStatProps = {
  label: string;
  value: string;
};

function ConnectionStat({ label, value }: ConnectionStatProps) {
  return (
    <div className="rounded-2xl bg-surface-elevated p-4">
      <Text className="text-xs text-muted">{label}</Text>
      <Text className="mt-2 truncate text-xl font-semibold">{value}</Text>
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

function ConnectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <WidgetSkeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>
      <WidgetSkeleton className="h-14 rounded-2xl" />
      <WidgetSkeleton className="h-48 rounded-card" />
    </div>
  );
}

function formatSyncTime(value: string | null): string {
  if (!value) {
    return "No sync yet";
  }

  return new Date(value).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
