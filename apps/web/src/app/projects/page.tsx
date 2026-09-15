import Link from "next/link";
import { AppShell, SectionHeading, StatusPill } from "@/components/app-shell";
import { demoProjects } from "@/lib/demo-data";

export default function ProjectsPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <SectionHeading title="Projects" subtitle="Portfolio" />
        <Link href="/projects/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          New project
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {demoProjects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="card block p-6 transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xl font-semibold">{project.title}</div>
                <div className="mt-1 text-sm text-slate-500">Client: {project.client.slice(0, 12)}...</div>
              </div>
              <StatusPill status={project.status} />
            </div>
            <p className="mt-4 text-slate-600">{project.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-slate-600">
              <div>
                <div className="text-slate-400">Budget</div>
                <div className="font-medium">{project.budget} {project.asset}</div>
              </div>
              <div>
                <div className="text-slate-400">Freelancer</div>
                <div className="font-medium">{project.freelancer.slice(0, 8)}...</div>
              </div>
              <div>
                <div className="text-slate-400">Milestones</div>
                <div className="font-medium">{project.milestones.length}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
