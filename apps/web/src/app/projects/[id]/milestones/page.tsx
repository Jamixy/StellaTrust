import { AppShell, SectionHeading, StatusPill } from "@/components/app-shell";
import { demoProjects } from "@/lib/demo-data";

export default async function MilestonesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = demoProjects.find((item) => item.id === id) ?? demoProjects[0];

  return (
    <AppShell>
      <SectionHeading title={`${project.title} milestones`} subtitle="Milestone tracking" />
      <div className="space-y-4">
        {project.milestones.map((milestone) => (
          <div key={milestone.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{milestone.title}</div>
                <p className="mt-2 text-slate-600">{milestone.description}</p>
              </div>
              <StatusPill status={milestone.status} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-600">
              <div><span className="text-slate-400">Amount:</span> {milestone.amount} {project.asset}</div>
              <div><span className="text-slate-400">Due:</span> {milestone.dueDate}</div>
              <div><span className="text-slate-400">Status:</span> {milestone.status}</div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
