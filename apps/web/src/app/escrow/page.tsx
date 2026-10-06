"use client";

import { useState } from "react";
import { requestAccess, signTransaction } from "@stellar/freighter-api";
import { Networks } from "@stellar/stellar-sdk";
import { EscrowAction, EscrowClient, EscrowMilestone } from "@stellar-trust/escrow";
import { AppShell, SectionHeading, StatusPill } from "@/components/app-shell";

const CONTRACT_ID =
  process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID ?? "CBCI6QFRQHUVZDMLF5NLY4U56PEXHZ7KYCEWTXXJ6XZMGHCY5PG4WZM4";
const EXPLORER = "https://stellar.expert/explorer/testnet";
const STROOPS = 10_000_000n;

const formatAmount = (stroops: bigint) => {
  const whole = stroops / STROOPS;
  const frac = (stroops % STROOPS).toString().padStart(7, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
};

const actions: { action: EscrowAction; label: string; hint: string }[] = [
  { action: "submit", label: "Submit work", hint: "Freelancer marks delivered" },
  { action: "release", label: "Release", hint: "Client pays the freelancer" },
  { action: "claim", label: "Claim", hint: "Freelancer, after deadline" },
  { action: "refund", label: "Refund", hint: "Client, undelivered, after deadline" },
];

export default function EscrowPage() {
  const [client] = useState(() => new EscrowClient({ contractId: CONTRACT_ID }));
  const [address, setAddress] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<EscrowMilestone[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setMessage(null);
    try {
      await fn();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const loadMilestones = (source: string) =>
    client.getMilestones(source).then(setMilestones, () => {
      setMilestones(null);
      throw new Error(
        "No escrow found on this contract yet. It has not been initialized with a client, freelancer and milestones.",
      );
    });

  const connect = () =>
    run(async () => {
      const res = await requestAccess();
      if (res.error) throw new Error(res.error.message ?? "Freighter connection was rejected.");
      setAddress(res.address);
      await loadMilestones(res.address);
    });

  const act = (action: EscrowAction, index: number) =>
    run(async () => {
      if (!address) throw new Error("Connect Freighter first.");
      const xdr = await client.prepareAction(action, address, index);
      const signed = await signTransaction(xdr, { networkPassphrase: Networks.TESTNET, address });
      if (signed.error) throw new Error(signed.error.message ?? "Signing was rejected.");
      const { hash } = await client.submitSigned(signed.signedTxXdr);
      setTxHash(hash);
      setMessage(`Submitted ${action} for milestone ${index + 1}. It may take a few seconds to confirm; refresh to see the new status.`);
    });

  return (
    <AppShell>
      <SectionHeading title="Escrow" subtitle="Soroban contract on Stellar Testnet" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Milestones on-chain</div>
          {milestones === null ? (
            <p className="mt-4 text-sm text-slate-600">
              Connect Freighter (set to Testnet) to read this escrow from the contract.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">Milestone {i + 1}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {formatAmount(m.amount)} XLM · deadline {new Date(Number(m.deadline) * 1000).toLocaleString()}
                      </div>
                    </div>
                    <StatusPill status={m.status.toUpperCase()} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {actions.map((a) => (
                      <button
                        key={a.action}
                        type="button"
                        title={a.hint}
                        disabled={busy || m.status === "Released" || m.status === "Refunded"}
                        onClick={() => act(a.action, i)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="text-xl font-semibold">Wallet</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div>
              Contract:{" "}
              <a className="font-medium text-blue-600 underline" href={`${EXPLORER}/contract/${CONTRACT_ID}`} target="_blank" rel="noreferrer">
                {CONTRACT_ID.slice(0, 8)}...{CONTRACT_ID.slice(-6)}
              </a>
            </div>
            <div>Network: <span className="font-medium text-slate-900">Stellar Testnet</span></div>
            <div>
              Account:{" "}
              <span className="font-medium text-slate-900">
                {address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "Not connected"}
              </span>
            </div>
          </div>

          <button
            onClick={connect}
            disabled={busy}
            className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            {address ? "Refresh milestones" : "Connect Freighter"}
          </button>

          {message && <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{message}</p>}
          {txHash && (
            <a className="mt-3 block text-sm text-blue-600 underline" href={`${EXPLORER}/tx/${txHash}`} target="_blank" rel="noreferrer">
              View transaction {txHash.slice(0, 10)}...
            </a>
          )}
        </div>
      </div>
    </AppShell>
  );
}
