"use client";

import { useState } from "react";
import { AppShell, SectionHeading, StatusPill } from "@/components/app-shell";
import { demoProjects } from "@/lib/demo-data";

const fundedMilestone = demoProjects[0].milestones[1];

export default function EscrowPage() {
  const [selectedMilestone, setSelectedMilestone] = useState(fundedMilestone.title);
  const [transactionHash, setTransactionHash] = useState("G7DD2A...8F2F");
  const [status, setStatus] = useState("SUCCESS");

  const onFund = () => {
    setStatus("SUCCESS");
    setTransactionHash("3d2a8b44a2c3ef4d15b7d8461cb4ccfd2b7f58af7ccd0b1253b84be52cc8ea1e");
  };

  return (
    <AppShell>
      <SectionHeading title="Escrow" subtitle="Funding flow" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Review milestone</div>
          <div className="mt-4 space-y-3">
            {demoProjects[0].milestones.map((milestone) => (
              <button
                key={milestone.id}
                type="button"
                onClick={() => setSelectedMilestone(milestone.title)}
                className={`w-full rounded-xl border p-4 text-left ${selectedMilestone === milestone.title ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{milestone.title}</div>
                    <div className="mt-1 text-sm text-slate-500">{milestone.amount} XLM</div>
                  </div>
                  <StatusPill status={milestone.status} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="text-xl font-semibold">Funding review</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div>Milestone: <span className="font-medium text-slate-900">{selectedMilestone}</span></div>
            <div>Amount: <span className="font-medium text-slate-900">1200 XLM</span></div>
            <div>Asset: <span className="font-medium text-slate-900">XLM</span></div>
            <div>Network: <span className="font-medium text-slate-900">Stellar Testnet</span></div>
          </div>

          <button onClick={onFund} className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white">
            Confirm payment
          </button>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Transaction status</div>
            <div className="mt-2 flex items-center justify-between">
              <StatusPill status={status} />
              <span className="text-xs text-slate-500">Hash {transactionHash.slice(0, 10)}...</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
