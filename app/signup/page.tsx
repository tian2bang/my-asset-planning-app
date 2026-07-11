import Link from "next/link";
import { AuthForm } from "@/app/components/AuthForm";
import { signUp } from "@/lib/actions/auth";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
        <p className="text-sm text-neutral-500">
          Your own private set of assets and liabilities, separate from the demo data.
        </p>
      </div>
      <AuthForm action={signUp} submitLabel="Sign Up" />
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-neutral-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
