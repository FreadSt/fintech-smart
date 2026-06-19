import { Text } from "@/shared/text/Text";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { signupAction } from "../login/actions";

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-black">
            F
          </div>
          <Text as="span" className="text-2xl font-semibold tracking-tight">
            FinFlex
          </Text>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <Text as="h1" className="text-xl font-semibold">
              Create account
            </Text>
            <Text className="mt-1 text-sm text-muted">
              Start with your email and a secure password.
            </Text>
          </div>
          <LoginForm action={signupAction} mode="signup" />
        </Card>
      </div>
    </div>
  );
}
