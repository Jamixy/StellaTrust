import { AppShell, SectionHeading } from "@/components/app-shell";

export default function SettingsPage() {
  return (
    <AppShell>
      <SectionHeading title="Settings" subtitle="Workspace preferences" />
      <div className="card p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Network</div>
            <div className="mt-2 text-lg font-semibold">Stellar Testnet</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Escrow mode</div>
            <div className="mt-2 text-lg font-semibold">Application-reviewed</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Notifications</div>
            <div className="mt-2 text-lg font-semibold">Disabled (future roadmap)</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Persistence</div>
            <div className="mt-2 text-lg font-semibold">Demo state only</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
