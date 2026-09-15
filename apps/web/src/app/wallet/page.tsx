"use client";

import { useState } from "react";
import { AppShell, SectionHeading } from "@/components/app-shell";
import { walletBalances } from "@/lib/demo-data";

export default function WalletPage() {
  const publicAddress = "GDRS5FGWZ7EJ2B6Q4QNMRT5Z5U6W5F6C7VZ2Z5RMQ4J2R7F2Z7M6FYV";
  const [copyState, setCopyState] = useState("Copy address");

  const onCopy = async () => {
    await navigator.clipboard.writeText(publicAddress);
    setCopyState("Copied");
    setTimeout(() => setCopyState("Copy address"), 1200);
  };

  return (
    <AppShell>
      <SectionHeading title="Wallet" subtitle="Stellar Testnet" />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Public address</div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm break-all">{publicAddress}</div>
          <div className="mt-5 flex gap-3">
            <button onClick={onCopy} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">{copyState}</button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Refresh balance</button>
          </div>
        </div>

        <div className="card p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Network status</div>
          <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Connected to Testnet</div>
          <div className="mt-5 text-sm text-slate-600">No secret key is exposed in the frontend. This page only displays the public address and balance metadata.</div>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <div className="text-xl font-semibold">Balances</div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {walletBalances.map((balance) => (
            <div key={balance.asset} className="rounded-2xl border border-slate-200 p-4">
              <div className="text-sm text-slate-500">{balance.asset}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{balance.balance}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
