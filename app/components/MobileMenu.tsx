"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

export function MobileMenu({ userEmail }: { userEmail: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center rounded-md border border-neutral-300 p-2 text-neutral-700 hover:bg-neutral-100"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <nav className="mt-3 flex flex-col gap-1 border-t border-neutral-200 pt-3 text-sm font-medium text-neutral-600">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-2 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Dashboard
          </Link>
          <Link
            href="/assets"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-2 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Assets
          </Link>
          <Link
            href="/liabilities"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-2 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Liabilities
          </Link>
          {userEmail ? (
            <>
              <span className="px-2 py-1 text-xs text-neutral-400">{userEmail}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full rounded-md border border-neutral-300 px-2 py-2 text-left hover:bg-neutral-100"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 hover:bg-neutral-100 hover:text-neutral-900"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="rounded-md bg-neutral-900 px-2 py-2 text-center text-white hover:bg-neutral-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      )}
    </div>
  );
}
