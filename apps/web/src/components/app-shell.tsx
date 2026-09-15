import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Landing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/escrow", label: "Escrow" },
  { href: "/wallet", label: "Wallet" },
  { href: "/transactions", label: "Transactions" },
  { href: "/freelancer", label: "Freelancer" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-900 px-3 py-2 text-lg font-bold text-white">ST</div>
            <div>
              <div className="text-xl font-semibold">StellarTrust</div>
              <div className="text-xs text-slate-500">Testnet MVP</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/projects/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            New project
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{subtitle ?? "Overview"}</div>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
    </div>
  );
}

export function MetricCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "sky" | "emerald" | "amber" }) {
  const toneClass =
    tone === "sky"
      ? "border-sky-200 bg-sky-50"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50"
        : tone === "amber"
          ? "border-amber-200 bg-amber-50"
          : "border-slate-200 bg-white";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const key = status.toLowerCase();
  const className = `badge status-${key.includes("pending") ? "pending" : key.includes("funded") ? "funded" : key.includes("submitted") ? "submitted" : key.includes("approved") ? "approved" : key.includes("released") ? "released" : key.includes("disputed") ? "disputed" : "pending"}`;
  return <span className={className}>{status}</span>;
}

export function formatCurrency(value: string | number) {
  const amount = typeof value === "number" ? value : Number(value || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}
