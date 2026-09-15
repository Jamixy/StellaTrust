export type MilestoneStatus =
  | "PENDING"
  | "FUNDED"
  | "SUBMITTED"
  | "APPROVED"
  | "RELEASED"
  | "DISPUTED";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  status: MilestoneStatus;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  freelancer: string;
  budget: string;
  asset: string;
  status: string;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

export interface TransactionRecord {
  id: string;
  hash: string;
  amount: string;
  asset: string;
  sender: string;
  recipient: string;
  status: string;
  timestamp: string;
  network: string;
  explorerUrl: string;
}
