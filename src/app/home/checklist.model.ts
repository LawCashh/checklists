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
  [key: string]: any;
}


export interface Subtask {
  id: string;
  name: string;
  description: string | null;
  validDays: string;
  completeByTime: string | null;
  taskId: string;
  rank: number;
  result: {
    id: string;
    na: boolean;
    completed: boolean;
    note: string | null;
    "person": {
      "id": string,
      "companyId": string,
      "lastName": string,
      "firstName": string,
      "knownAs": string,
      "email": string,
      "userName": string
    },
    completedTime: string;
    completedDateTime: string;

  } | null;
  wsApprovalRecord: string | null;
  wizard: string | null;
  wizardId: string | null;
  wizardArguments: string | null;
  wizardMarksComplete: boolean;
  urgent: boolean;
  important: boolean;
  show: boolean;
  deleted: boolean;
  deletedTime: string | null;
  includeInReport: boolean | null;
  [key: string]: any;
}

export interface ChecklistFull {
  "id": string;
  "workflowId": string;
  "corporateId": string;
  "companyId": string;
  "personId": string;
  "name": string;
  "description": string | null;
  "completeByTime": string | null;
  "dueTimeRelative": string | null;
  "dueTimeAbsolute": string | null;
  "unlockTime": string | null;
  "lockTime": string | null;
  "rank": number;
  "alertRecipients": string | null;
  "validDays": string | null;
  "validDates": string | null;
  "lastDayOfMonth": boolean;
  "deleted": boolean;
  "paused": boolean;
  "deletedTime": string | null;
  "createdByUser": string;
  "createdDateTime": string;
  "modifiedByUser": string | null;
  "modifiedDateTime": string | null;
  "mustBeCompletedToSignOff": boolean;
  "dueDate": string | null;
  "subtasks": null;
  "enabled": string[];
  "dueTime": string | null;
  [key: string]: any;
}

