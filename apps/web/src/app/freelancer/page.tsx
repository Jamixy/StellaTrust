import { AppShell, SectionHeading, StatusPill } from "@/components/app-shell";
import { freelancerProject } from "@/lib/demo-data";

export default function FreelancerPage() {
  return (
    <AppShell>
      <SectionHeading title="Freelancer view" subtitle="Assigned work" />
      <div className="card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold">{freelancerProject.title}</div>
            <div className="mt-1 text-slate-500">Client: {freelancerProject.client.slice(0, 18)}...</div>
          </div>
          <StatusPill status={freelancerProject.status} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Budget</div>
            <div className="mt-1 text-xl font-semibold">{freelancerProject.budget} {freelancerProject.asset}</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Project status</div>
            <div className="mt-1 text-xl font-semibold">{freelancerProject.status}</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Milestones</div>
            <div className="mt-1 text-xl font-semibold">{freelancerProject.milestones.length}</div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {freelancerProject.milestones.map((milestone) => (
            <div key={milestone.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-lg font-semibold">{milestone.title}</div>
                <StatusPill status={milestone.status} />
              </div>
              <p className="mt-2 text-slate-600">{milestone.description}</p>
              <div className="mt-3 text-sm text-slate-500">Amount: {milestone.amount} {freelancerProject.asset} • Due {milestone.dueDate}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
