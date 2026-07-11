import type { CurrencyTotal } from "@/lib/data/dashboard";
import { Card, formatMoney } from "@/app/components/ui";

function TotalsRow({ t }: { t: CurrencyTotal }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <p className="text-xs text-neutral-500">Total Assets</p>
        <p className="mt-1 text-xl font-semibold">{formatMoney(t.assets, t.currency)}</p>
      </Card>
      <Card>
        <p className="text-xs text-neutral-500">Total Liabilities</p>
        <p className="mt-1 text-xl font-semibold">
          {formatMoney(t.liabilities, t.currency)}
        </p>
      </Card>
      <Card>
        <p className="text-xs text-neutral-500">Net Worth</p>
        <p className={`mt-1 text-xl font-semibold ${t.netWorth < 0 ? "text-red-600" : ""}`}>
          {formatMoney(t.netWorth, t.currency)}
        </p>
      </Card>
    </div>
  );
}

export function DashboardSummary({ totals }: { totals: CurrencyTotal[] }) {
  if (totals.length === 0) return null;

  if (totals.length === 1) {
    return <TotalsRow t={totals[0]} />;
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-neutral-500">
        Shown per currency — no FX conversion is applied.
      </p>
      {totals.map((t) => (
        <div key={t.currency} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {t.currency}
          </p>
          <TotalsRow t={t} />
        </div>
      ))}
    </div>
  );
}
