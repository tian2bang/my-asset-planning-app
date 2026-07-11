import Link from "next/link";

export function NavBar() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          My Asset Planning
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-neutral-600">
          <Link href="/" className="hover:text-neutral-900">
            Dashboard
          </Link>
          <Link href="/assets" className="hover:text-neutral-900">
            Assets
          </Link>
          <Link href="/liabilities" className="hover:text-neutral-900">
            Liabilities
          </Link>
        </nav>
      </div>
    </header>
  );
}
