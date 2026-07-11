import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          My Asset Planning
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-neutral-600">
          <Link href="/" className="hover:text-neutral-900">
            Dashboard
          </Link>
          <Link href="/assets" className="hover:text-neutral-900">
            Assets
          </Link>
          <Link href="/liabilities" className="hover:text-neutral-900">
            Liabilities
          </Link>
          {user ? (
            <>
              <span className="hidden text-neutral-400 sm:inline">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-neutral-700 hover:bg-neutral-100"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-neutral-900">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-neutral-900 px-3 py-1.5 text-white hover:bg-neutral-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
