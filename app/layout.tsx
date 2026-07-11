import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/app/components/NavBar";

export const metadata: Metadata = {
  title: "My Asset Planning App",
  description:
    "Track assets, liabilities, nominees, and beneficiary access guides in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
