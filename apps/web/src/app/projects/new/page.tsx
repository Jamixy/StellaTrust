"use client";

import { FormEvent, useState } from "react";
import { AppShell, SectionHeading } from "@/components/app-shell";
import { isValidStellarAddress } from "@stellar-trust/validation";

const emptyForm = {
  title: "",
  description: "",
  freelancer: "",
  budget: "",
  asset: "XLM",
  startDate: "",
  endDate: "",
};

export default function NewProjectPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.title.trim()) nextErrors.title = "Project title is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";
    if (!isValidStellarAddress(form.freelancer)) nextErrors.freelancer = "Enter a valid Stellar public address";
    if (!form.budget || Number(form.budget) <= 0) nextErrors.budget = "Budget must be positive";
    if (!form.startDate) nextErrors.startDate = "Start date is required";
    if (!form.endDate) nextErrors.endDate = "End date is required";
    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
      nextErrors.endDate = "End date must be after the start date";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <AppShell>
      <SectionHeading title="Create project" subtitle="New work order" />
      <div className="mx-auto max-w-3xl card p-6">
        <form className="grid gap-5" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Project title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            {errors.title && <p className="mt-1 text-sm text-rose-600">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
            {errors.description && <p className="mt-1 text-sm text-rose-600">{errors.description}</p>}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Freelancer Stellar address</label>
              <input value={form.freelancer} onChange={(e) => setForm({ ...form, freelancer: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
              {errors.freelancer && <p className="mt-1 text-sm text-rose-600">{errors.freelancer}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Total budget</label>
              <input type="number" min="1" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
              {errors.budget && <p className="mt-1 text-sm text-rose-600">{errors.budget}</p>}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Asset</label>
              <select value={form.asset} onChange={(e) => setForm({ ...form, asset: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2">
                <option value="XLM">XLM</option>
                <option value="USD">USD</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Start date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
              {errors.startDate && <p className="mt-1 text-sm text-rose-600">{errors.startDate}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">End date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
              {errors.endDate && <p className="mt-1 text-sm text-rose-600">{errors.endDate}</p>}
            </div>
          </div>

          {submitted && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Project draft validated successfully. This MVP stores it in demo state for the UI flow.
            </div>
          )}

          <button type="submit" className="mt-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white">
            Save project
          </button>
        </form>
      </div>
    </AppShell>
  );
}
