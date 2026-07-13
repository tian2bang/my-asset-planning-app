"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ErrorNotice, InfoNotice } from "@/app/components/ui";

type SessionState = "checking" | "ready" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setSessionState(data.session ? "ready" : "invalid");
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/"), 1500);
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
        <p className="text-sm text-neutral-500">Choose a new password for your account.</p>
      </div>

      {sessionState === "checking" && (
        <p className="text-sm text-neutral-500">Checking your reset link…</p>
      )}

      {sessionState === "invalid" && (
        <div className="space-y-3">
          <ErrorNotice message="This reset link is invalid or has expired." />
          <p className="text-sm text-neutral-500">
            <Link href="/forgot-password" className="font-medium text-neutral-900 hover:underline">
              Request a new link
            </Link>
          </p>
        </div>
      )}

      {sessionState === "ready" && success && (
        <InfoNotice message="Password updated. Redirecting you to the dashboard…" />
      )}

      {sessionState === "ready" && !success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorNotice message={error} />}
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              New Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">
              Confirm Password
            </label>
            <input
              name="confirm"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Set New Password"}
          </button>
        </form>
      )}
    </div>
  );
}
