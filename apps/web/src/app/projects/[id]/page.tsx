import Link from "next/link";
import { AppShell, SectionHeading, StatusPill } from "@/components/app-shell";
import { demoProjects } from "@/lib/demo-data";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = demoProjects.find((item) => item.id === id) ?? demoProjects[0];

  return (
    <AppShell>
      <SectionHeading title={project.title} subtitle="Project details" />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="card p-6">
          <p className="text-slate-600">{project.description}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-500">Client</div>
              <div className="mt-1 font-medium">{project.client.slice(0, 18)}...</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-500">Freelancer</div>
              <div className="mt-1 font-medium">{project.freelancer.slice(0, 18)}...</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-500">Budget</div>
              <div className="mt-1 font-medium">{project.budget} {project.asset}</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm text-slate-500">Status</div>
              <div className="mt-2"><StatusPill status={project.status} /></div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold">Milestones</h3>
          <div className="mt-4 space-y-3">
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{milestone.title}</span>
                  <StatusPill status={milestone.status} />
                </div>
                <div className="mt-2 text-sm text-slate-600">{milestone.amount} {project.asset}</div>
                <div className="mt-1 text-xs text-slate-500">Due {milestone.dueDate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="#" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">Edit project</Link>
        <Link href="/projects" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Back to projects</Link>
      </div>
    </AppShell>
  );
}
