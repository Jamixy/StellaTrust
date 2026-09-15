import { AppShell, SectionHeading } from "@/components/app-shell";
import { demoTransactions } from "@/lib/demo-data";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = demoTransactions.find((item) => item.hash === id || item.id === id) ?? demoTransactions[0];

  return (
    <AppShell>
      <SectionHeading title="Transaction details" subtitle="Stellar receipt" />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card p-6">
          <div className="space-y-4 text-sm">
            <div><span className="text-slate-500">Hash:</span> <span className="font-mono break-all">{transaction.hash}</span></div>
            <div><span className="text-slate-500">Amount:</span> {transaction.amount} {transaction.asset}</div>
            <div><span className="text-slate-500">Sender:</span> {transaction.sender.slice(0, 18)}...</div>
            <div><span className="text-slate-500">Recipient:</span> {transaction.recipient.slice(0, 18)}...</div>
            <div><span className="text-slate-500">Status:</span> {transaction.status}</div>
            <div><span className="text-slate-500">Timestamp:</span> {transaction.timestamp}</div>
            <div><span className="text-slate-500">Network:</span> Stellar Testnet</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Explorer</div>
          <a href={transaction.explorerUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">
            View on Stellar Explorer
          </a>
        </div>
      </div>
    </AppShell>
  );
}
