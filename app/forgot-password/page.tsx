import Link from "next/link";
import { ForgotPasswordForm } from "@/app/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-neutral-500">
          Enter the email on your account and we&apos;ll send you a link to set a
          new password.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-center text-sm text-neutral-500">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-neutral-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
