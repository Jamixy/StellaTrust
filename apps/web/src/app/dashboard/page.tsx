import { AppShell, MetricCard, SectionHeading, StatusPill } from "@/components/app-shell";
import { demoProjects } from "@/lib/demo-data";

export default function DashboardPage() {
  const activeProjects = demoProjects.length;
  const pendingMilestones = demoProjects.flatMap((project) => project.milestones).filter((item) => item.status === "PENDING").length;
  const fundedAmount = demoProjects.flatMap((project) => project.milestones).filter((item) => item.status === "FUNDED").reduce((sum, milestone) => sum + Number(milestone.amount), 0);
  const completedProjects = demoProjects.filter((project) => project.status === "ACTIVE").length;

  return (
    <AppShell>
      <SectionHeading title="Dashboard" subtitle="Operations" />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Active projects" value={String(activeProjects)} tone="sky" />
        <MetricCard label="Pending milestones" value={String(pendingMilestones)} tone="amber" />
        <MetricCard label="Funded amount" value={`$${fundedAmount}`} tone="emerald" />
        <MetricCard label="Completed projects" value={String(completedProjects)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <h2 className="text-xl font-semibold">Current portfolio</h2>
          <div className="mt-5 space-y-4">
            {demoProjects.map((project) => (
              <div key={project.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">{project.title}</div>
                    <div className="text-sm text-slate-500">{project.freelancer}</div>
                  </div>
                  <StatusPill status={project.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Budget: {project.budget} {project.asset}</span>
                  <span>{project.milestones.length} milestones</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold">Milestone queue</h2>
          <div className="mt-4 space-y-3">
            {demoProjects.flatMap((project) => project.milestones).slice(0, 5).map((milestone) => (
              <div key={milestone.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{milestone.title}</span>
                  <StatusPill status={milestone.status} />
                </div>
                <div className="mt-2 text-sm text-slate-600">{milestone.amount} {demoProjects[0].asset} • Due {milestone.dueDate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
