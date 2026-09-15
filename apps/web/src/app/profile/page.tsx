import { AppShell, SectionHeading } from "@/components/app-shell";

export default function ProfilePage() {
  return (
    <AppShell>
      <SectionHeading title="Profile" subtitle="Account" />
      <div className="card p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm text-slate-500">Name</div>
            <div className="mt-1 text-2xl font-semibold">Avery Morgan</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Role</div>
            <div className="mt-1 text-2xl font-semibold">Client & project lead</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Primary wallet</div>
            <div className="mt-1 font-mono text-sm">GDRS5FGWZ7EJ2B6Q4QNMRT5Z5U6W5F6C7VZ2Z5RMQ4J2R7F2Z7M6FYV</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Status</div>
            <div className="mt-1 text-xl font-semibold text-emerald-600">Verified on Testnet</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
