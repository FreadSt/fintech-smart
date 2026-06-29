import type { BankCard } from "@/hooks/useBankCards";
import { formatKopecks, getCurrencyCode } from "@/lib/monobank/money";
import type {
  MonobankAccount,
  MonobankJar,
  MonobankTransaction,
} from "@/lib/monobank/types";
import type { Period } from "@/lib/dashboard/mock-data";

type DashboardSummary = {
  totalBalance: string;
  balanceTrend: string;
  balanceDelta: string;
  income: string;
  incomeTrend: string;
  expense: string;
  expenseTrend: string;
  savings: string;
  savingsTrend: string;
};

type TransactionItem = {
  name: string;
  category: string;
  date: string;
  amount: string;
  positive: boolean;
  initial: string;
  account: string;
  status: string;
};

type SpendingCategory = {
  label: string;
  percentage: number;
  amount: string;
  colorClass: string;
  color: string;
};

type BudgetEntry = {
  income: number;
  spent: number;
  scheduled: number;
  savings: number;
};

type BudgetData = Record<Period, { labels: string[]; entries: BudgetEntry[] }>;

type GoalItem = {
  name: string;
  saved: string;
  target: string;
  progress: number;
};

const categoryColors = ["#00bdf9", "#e6ff4b", "#24d79f", "#e7e7e7"];
const categoryColorClasses = [
  "bg-secondary",
  "bg-primary",
  "bg-[#24d79f]",
  "bg-muted",
];

export function toBankCard(
  account: MonobankAccount,
  index: number,
  clientName?: string | null,
): BankCard {
  const maskedPan = account.masked_pan[0] ?? "";
  const lastFour = maskedPan.replace(/\D/g, "").slice(-4).padStart(4, "0");
  const type = account.credit_limit > 0 ? "Credit" : "Debit";
  const used =
    account.credit_limit > 0
      ? Math.min(
          100,
          Math.round(
            (Math.abs(Math.min(account.balance, 0)) / account.credit_limit) *
              100,
          ),
        )
      : 0;

  return {
    id: account.monobank_account_id,
    type,
    balance: formatKopecks(account.balance, account.currency_code),
    lastFour,
    expires: getCurrencyCode(account.currency_code),
    network: getCardNetwork(maskedPan),
    limit:
      account.credit_limit > 0
        ? formatKopecks(account.credit_limit, account.currency_code)
        : "No limit",
    used,
    variant: index === 0 ? "primary" : "surface",
    holder: clientName ?? "Monobank",
    activities: [],
  };
}

export function buildDashboardSummary(
  accounts: MonobankAccount[],
  jars: MonobankJar[],
  transactions: MonobankTransaction[],
): DashboardSummary | null {
  if (accounts.length === 0 && transactions.length === 0 && jars.length === 0) {
    return null;
  }

  const incomeByCurrency = sumTransactionsByCurrency(
    transactions.filter((transaction) => transaction.amount > 0),
  );
  const expenseByCurrency = sumTransactionsByCurrency(
    transactions.filter((transaction) => transaction.amount < 0),
    true,
  );
  const savingsByCurrency = sumJarsByCurrency(jars);

  return {
    totalBalance: formatCurrencyMap(sumAccountsByCurrency(accounts)),
    balanceTrend: "Live",
    balanceDelta: `${accounts.length} cards`,
    income: formatCurrencyMap(incomeByCurrency),
    incomeTrend: "31d",
    expense: formatCurrencyMap(expenseByCurrency),
    expenseTrend: "31d",
    savings: formatCurrencyMap(savingsByCurrency),
    savingsTrend: `${jars.length}`,
  };
}

export function toTransactionItems(
  transactions: MonobankTransaction[],
): TransactionItem[] {
  return transactions.slice(0, 8).map((transaction) => ({
    name: transaction.description,
    category: transaction.spending_category?.label ?? "Other",
    date: formatDate(transaction.transaction_time),
    amount: formatKopecks(transaction.amount, transaction.currency_code),
    positive: transaction.amount > 0,
    initial: getInitial(transaction.description),
    account: transaction.monobank_account_id,
    status: transaction.is_hold ? "Hold" : "Completed",
  }));
}

export function buildSpendingCategories(
  transactions: MonobankTransaction[],
): { categories: SpendingCategory[]; total: string } {
  const expenses = transactions.filter((transaction) => transaction.amount < 0);
  const currencyCode = getDominantCurrency(expenses);
  const scopedExpenses = expenses.filter(
    (transaction) => transaction.currency_code === currencyCode,
  );
  const total = scopedExpenses.reduce(
    (sum, transaction) => sum + Math.abs(transaction.amount),
    0,
  );

  if (total === 0) {
    return { categories: [], total: "No Data yet" };
  }

  const byCategory = new Map<string, number>();

  for (const transaction of scopedExpenses) {
    const label = transaction.spending_category?.label ?? "Other";
    byCategory.set(
      label,
      (byCategory.get(label) ?? 0) + Math.abs(transaction.amount),
    );
  }

  const categories = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, amount], index) => ({
      label,
      percentage: Math.round((amount / total) * 100),
      amount: formatKopecks(amount, currencyCode),
      colorClass: categoryColorClasses[index] ?? "bg-muted",
      color: categoryColors[index] ?? "#e7e7e7",
    }));

  return {
    categories,
    total: formatKopecks(total, currencyCode),
  };
}

export function buildBudgetData(
  transactions: MonobankTransaction[],
): BudgetData | null {
  const currencyCode = getDominantCurrency(transactions);
  const scoped = transactions.filter(
    (transaction) => transaction.currency_code === currencyCode,
  );

  if (scoped.length === 0) {
    return null;
  }

  const monthly = buildMonthlyBudget(scoped);

  return {
    daily: buildDailyBudget(scoped),
    weekly: buildWeeklyBudget(scoped),
    monthly,
  };
}

export function toGoalItems(jars: MonobankJar[]): GoalItem[] {
  return jars.map((jar) => ({
    name: jar.title,
    saved: formatKopecks(jar.balance, jar.currency_code),
    target: formatKopecks(jar.goal, jar.currency_code),
    progress: jar.goal > 0 ? Math.min(100, Math.round((jar.balance / jar.goal) * 100)) : 0,
  }));
}

export function toQuickTransfers(
  transactions: MonobankTransaction[],
): { initials: string }[] {
  const names = [...new Set(
    transactions
      .map((transaction) => transaction.counter_name)
      .filter((name): name is string => Boolean(name)),
  )];

  return names.slice(0, 4).map((name) => ({
    initials: name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
  }));
}

function buildMonthlyBudget(
  transactions: MonobankTransaction[],
): { labels: string[]; entries: BudgetEntry[] } {
  const months = getLastMonths(6);

  return {
    labels: months.map((date) =>
      date.toLocaleDateString("en-US", { month: "short" }),
    ),
    entries: months.map((month) => aggregateForMonth(transactions, month)),
  };
}

function buildWeeklyBudget(
  transactions: MonobankTransaction[],
): { labels: string[]; entries: BudgetEntry[] } {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const entries = labels.map((_, dayIndex) => {
    const dayTransactions = transactions.filter((transaction) => {
      const day = new Date(transaction.transaction_time).getDay();
      return (day + 6) % 7 === dayIndex;
    });

    return aggregateTransactions(dayTransactions);
  });

  return { labels, entries };
}

function buildDailyBudget(
  transactions: MonobankTransaction[],
): { labels: string[]; entries: BudgetEntry[] } {
  const labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
  const entries = labels.map((_, bucketIndex) => {
    const bucketTransactions = transactions.filter((transaction) => {
      const hour = new Date(transaction.transaction_time).getHours();
      return Math.floor(hour / 4) === bucketIndex;
    });

    return aggregateTransactions(bucketTransactions);
  });

  return { labels, entries };
}

function aggregateForMonth(
  transactions: MonobankTransaction[],
  month: Date,
): BudgetEntry {
  const monthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.transaction_time);
    return (
      date.getFullYear() === month.getFullYear() &&
      date.getMonth() === month.getMonth()
    );
  });

  return aggregateTransactions(monthTransactions);
}

function aggregateTransactions(
  transactions: MonobankTransaction[],
): BudgetEntry {
  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const spent = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  return {
    income,
    spent,
    scheduled: 0,
    savings: 0,
  };
}

function getLastMonths(count: number): Date[] {
  const now = new Date();

  return Array.from({ length: count }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - count + index + 1, 1);
    return date;
  });
}

function sumAccountsByCurrency(accounts: MonobankAccount[]): Map<number, number> {
  const byCurrency = new Map<number, number>();

  for (const account of accounts) {
    byCurrency.set(
      account.currency_code,
      (byCurrency.get(account.currency_code) ?? 0) + account.balance,
    );
  }

  return byCurrency;
}

function sumJarsByCurrency(jars: MonobankJar[]): Map<number, number> {
  const byCurrency = new Map<number, number>();

  for (const jar of jars) {
    byCurrency.set(
      jar.currency_code,
      (byCurrency.get(jar.currency_code) ?? 0) + jar.balance,
    );
  }

  return byCurrency;
}

function sumTransactionsByCurrency(
  transactions: MonobankTransaction[],
  absolute = false,
): Map<number, number> {
  const byCurrency = new Map<number, number>();

  for (const transaction of transactions) {
    byCurrency.set(
      transaction.currency_code,
      (byCurrency.get(transaction.currency_code) ?? 0) +
        (absolute ? Math.abs(transaction.amount) : transaction.amount),
    );
  }

  return byCurrency;
}

function formatCurrencyMap(values: Map<number, number>): string {
  if (values.size === 0) {
    return "No Data yet";
  }

  return [...values.entries()]
    .sort(([a], [b]) => a - b)
    .map(([currencyCode, value]) => formatKopecks(value, currencyCode))
    .join(" / ");
}

function getDominantCurrency(transactions: MonobankTransaction[]): number {
  const totals = sumTransactionsByCurrency(transactions, true);
  const [currencyCode] =
    [...totals.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];

  return currencyCode ?? 980;
}

function getInitial(value: string): string {
  return value.trim().slice(0, 2).toUpperCase() || "TX";
}

function getCardNetwork(maskedPan: string): string {
  if (maskedPan.startsWith("4")) {
    return "VISA";
  }

  if (maskedPan.startsWith("5")) {
    return "MC";
  }

  return "MONO";
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
  });
}
