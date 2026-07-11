import Link from "next/link";
import { AuthForm } from "@/app/components/AuthForm";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
        <p className="text-sm text-neutral-500">
          Sign in to manage your own assets, liabilities, and beneficiary guides.
        </p>
      </div>
      <AuthForm action={signIn} submitLabel="Sign In" />
      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-neutral-900 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
