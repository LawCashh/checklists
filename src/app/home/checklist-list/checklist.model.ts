export interface Checklist {
  id: string;
  name: string;
  description: string | null;
  completeByTime: string | null;
  companyId: string | null;
  rank: number;
  show: boolean;
  deleted: boolean;
  deletedTime: string | null;
  subTasks: Subtask[];
  validDays: string;
  lastDayOfMonth: boolean | null;
  includeInReport: boolean | null;
}

export interface Subtask {
  id: string;
  name: string;
  description: string | null;
  validDays: string;
  completeByTime: string | null;
  taskId: string;
  rank: number;
  result: string | null;
  wsApprovalRecord: string | null;
  wizard: string | null;
  wizardId: string | null;
  wizardArguments: string | null;
  wizardMarksComplete: boolean;
  urgent: boolean;
  important: boolean;
  show: boolean;
  deleted: boolean;
  deletedTime: string | null,
  includeInReport: boolean | null;
}
