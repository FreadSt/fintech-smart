import { BottomRowCards } from "@/components/dashboard/widgets/BottomRowCards";
import { BudgetCard } from "@/components/dashboard/widgets/BudgetCard";
import { CreditCardWidget } from "@/components/dashboard/widgets/CreditCardWidget";
import { IncomeExpenseCards } from "@/components/dashboard/widgets/IncomeExpenseCards";
import { TopSpendingCard } from "@/components/dashboard/widgets/TopSpendingCard";
import { TotalBalanceCard } from "@/components/dashboard/widgets/TotalBalanceCard";
import { TransactionHistoryCard } from "@/components/dashboard/widgets/TransactionHistoryCard";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:grid-rows-[auto_auto_auto] xl:gap-5">
      <div className="xl:col-span-5 xl:row-start-1">
        <TotalBalanceCard />
      </div>
      <div className="xl:col-span-3 xl:row-start-1">
        <IncomeExpenseCards />
      </div>
      <div className="xl:col-span-4 xl:row-start-1">
        <CreditCardWidget />
      </div>

      <div className="xl:col-span-5 xl:row-start-2">
        <BudgetCard />
      </div>
      <div className="xl:col-span-3 xl:row-start-2">
        <TopSpendingCard />
      </div>
      <div className="xl:col-span-4 xl:row-span-2 xl:row-start-2">
        <TransactionHistoryCard />
      </div>

      <div className="xl:col-span-8 xl:row-start-3">
        <BottomRowCards />
      </div>
    </div>
  );
}
