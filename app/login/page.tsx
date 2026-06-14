import { loginAction } from "@/app/login/actions";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-black">
            F
          </div>
          <span className="text-2xl font-semibold tracking-tight">FinFlex</span>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold">Sign in</h1>
            <p className="mt-1 text-sm text-muted">
              Use your Supabase account to access the dashboard.
            </p>
          </div>
          <LoginForm action={loginAction} />
        </Card>
      </div>
    </div>
  );
}
