import Link from "next/link";
import { AppShell, SectionHeading } from "@/components/app-shell";
import { demoTransactions } from "@/lib/demo-data";

export default function TransactionsPage() {
  return (
    <AppShell>
      <SectionHeading title="Transactions" subtitle="Payment history" />
      <div className="card overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Hash</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {demoTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-mono text-xs"><Link href={`/transactions/${transaction.hash}`}>{transaction.hash.slice(0, 12)}...</Link></td>
                <td className="px-4 py-3">{transaction.amount}</td>
                <td className="px-4 py-3">{transaction.asset}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{transaction.status}</span></td>
                <td className="px-4 py-3 text-slate-500">{transaction.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
