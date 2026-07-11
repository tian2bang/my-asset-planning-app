import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center">
      <p className="text-sm font-medium text-neutral-700">
        We couldn't find what you're looking for.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
