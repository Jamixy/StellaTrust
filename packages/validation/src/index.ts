import { StrKey } from "@stellar/stellar-sdk";

export function isValidStellarAddress(value: string): boolean {
  return Boolean(value && StrKey.isValidEd25519PublicKey(value));
}

export function isPositiveAmount(value: string | number): boolean {
  const numeric = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(numeric) && numeric > 0;
}

export function validateProjectInput(input: {
  title: string;
  description: string;
  freelancer: string;
  budget: string;
  startDate: string;
  endDate: string;
}) {
  const errors: Record<string, string> = {};

  if (!input.title?.trim()) errors.title = "Project title is required.";
  if (!input.description?.trim()) errors.description = "Project description is required.";
  if (!isValidStellarAddress(input.freelancer)) {
    errors.freelancer = "A valid Stellar public address is required.";
  }
  if (!isPositiveAmount(input.budget)) errors.budget = "Budget must be a positive number.";
  if (!input.startDate) errors.startDate = "Start date is required.";
  if (!input.endDate) errors.endDate = "End date is required.";
  if (input.startDate && input.endDate) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      errors.startDate = "Dates must be valid.";
      errors.endDate = "Dates must be valid.";
    } else if (start >= end) {
      errors.endDate = "End date must be after the start date.";
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

export function validateMilestoneInput(input: {
  title: string;
  description: string;
  amount: string;
  dueDate: string;
}) {
  const errors: Record<string, string> = {};

  if (!input.title?.trim()) errors.title = "Milestone title is required.";
  if (!input.description?.trim()) errors.description = "Milestone description is required.";
  if (!isPositiveAmount(input.amount)) errors.amount = "Milestone amount must be positive.";
  if (!input.dueDate) errors.dueDate = "Due date is required.";

  return { ok: Object.keys(errors).length === 0, errors };
}
