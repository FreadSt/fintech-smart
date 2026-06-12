import { DashboardNav } from "../navigation/DashboardNav";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background px-5 py-5 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1440px] flex-col rounded-[32px] border border-border/40">
        <DashboardNav />
        <main className="flex-1 px-5 pb-6 pt-2 md:px-6">{children}</main>
      </div>
    </div>
  );
}
