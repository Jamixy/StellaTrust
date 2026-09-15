import Link from "next/link";
import { ShieldCheck, Wallet, Workflow, ArrowRight, CheckCircle2 } from "lucide-react";

const stats = [
  { label: "Projects funded", value: "18" },
  { label: "Testnet txs", value: "42" },
  { label: "Milestones cleared", value: "96%" },
];

const features = [
  {
    title: "Milestone-based escrow",
    description: "Clients and freelancers define milestone scopes and payment milestones up front.",
    icon: Workflow,
  },
  {
    title: "Stellar Testnet payment layer",
    description: "Real Stellar payment validation and transaction metadata are handled in a dedicated service layer.",
    icon: Wallet,
  },
  {
    title: "Trust without overclaiming",
    description: "The MVP demonstrates the architecture without suggesting a production-grade decentralized court system.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-900 px-3 py-2 text-lg font-bold text-white">ST</div>
          <div>
            <div className="text-xl font-semibold">StellarTrust</div>
          </div>
        </div>
        <nav className="hidden gap-8 text-sm text-slate-600 md:flex">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/wallet">Wallet</Link>
          <Link href="/transactions">Transactions</Link>
        </nav>
        <Link href="/projects/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Create project
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Stellar Testnet MVP
          </div>
          <h1 className="max-w-xl text-5xl font-bold tracking-tight text-slate-900">
            Trusted milestone funding for global freelance work.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            StellarTrust helps clients and freelancers coordinate milestone payments with clear review points, transparent status tracking, and a real Stellar Testnet payment foundation.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white">
              Explore dashboard <ArrowRight size={18} />
            </Link>
            <Link href="/projects/new" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700">
              New project
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="card p-4">
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="text-sm text-slate-500">Escrow flow</div>
              <div className="text-xl font-semibold">Client → review → fund</div>
            </div>
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Testnet</div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              "Project setup and milestone planning",
              "Freelancer reviews scope and schedule",
              "Client funds milestone on Stellar Testnet",
              "Status updates and transaction tracking",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            ⚠️ This MVP is for Stellar Testnet only and does not process real-world funds.
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4">
        <div className="mb-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Why it matters</div>
          <h2 className="mt-3 text-3xl font-bold">A practical path to trust</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-6">
              <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
                <Icon size={22} />
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="card p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Built for the MVP</div>
              <h3 className="mt-3 text-3xl font-bold">Clear milestones. Visible transactions. Honest boundaries.</h3>
            </div>
            <div className="space-y-4 text-slate-600">
              {[
                "Application-controlled milestone flow with explicit status updates",
                "Stellar payment validation isolated from React UI code",
                "Project management and funding UI designed for contributor expansion",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-emerald-600" size={18} />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
