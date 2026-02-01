
/**
 * Global types for the Legal Management System
 */

export type Department = 'financial' | 'commercial' | 'labor' | 'administrative' | 'documentation';
export type CaseStatus = 'new' | 'in_progress' | 'completed' | 'closed';
export type OpStatus = 'draft' | 'registered' | 'archived';
export type ClientRole = 'plaintiff' | 'defendant';

// --- Task Management Types ---
export type TaskStatus = 'new' | 'in_progress' | 'waiting_info' | 'waiting_approval' | 'closed';
export type TaskOrigin = 'assignments' | 'cases' | 'execution' | 'projects' | 'liquidation' | 'contracts';

export interface TaskUpdate {
  id: string;
  date: string;
  text: string;
  user: string;
}

export interface Task {
  id: string;
  name: string;
  origin: TaskOrigin;
  referenceId: string; // ID of the linked entity
  referenceLabel: string; // e.g., "عقد رقم 2024/01"
  referenceType: 'contract' | 'case' | 'project' | 'execution' | 'estate' | 'assignment';
  executorId: string;
  reviewerId?: string;
  load: number; // Task Load (Manual entry by manager)
  nextStep?: string;
  nextStepDate?: string;
  updates: TaskUpdate[];
  result?: string;
  status: TaskStatus;
  requiresApproval: boolean;
  createdAt: string;
  closedAt?: string;
  createdBy: string;
}

// --- Execution Types ---
export type ExecutionStatus = 'draft' | 'registered' | 'urgent_review' | 'in_progress' | 'suspended' | 'closed' | 'pending_closure';
export type ExecutionType = 'financial' | 'direct' | 'personal';
export type ExecutionDecisionType = '34' | '46' | 'other';
export type ExecutionActionType = 'seizure' | 'inquiry' | 'notification' | 'other';

export interface ExecutionDecision {
  id: string;
  type: ExecutionDecisionType;
  customType?: string;
  date: string;
  file?: string;
}

export interface ExecutionAction {
  id: string;
  type: string;
  requestDate: string;
  reviewPeriodDays: number;
  followUpDate: string;
  status: 'open' | 'closed';
}

export interface ExecutionCollection {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
}

export interface ExecutionRequest {
  id: string;
  contractId?: string;
  clientId: string;
  clientName: string;
  contactNumber: string;
  opponentName: string;
  hasAgency: boolean;
  agencyId?: string;
  executionDocUrl: string;
  ibanDocUrl?: string;
  type: ExecutionType;
  claimAmount?: number;
  collections: ExecutionCollection[];
  pendingAmounts: { amount: number; reason: string }[];
  courtName: string;
  circuitName: string;
  submissionDate: string;
  auditStatus: 'complete' | 'incomplete';
  incompleteReason?: string;
  status: ExecutionStatus;
  decisions: ExecutionDecision[];
  actions: ExecutionAction[];
  suspensionReason?: string;
  suspensionDocUrl?: string;
  activityLog: ActivityLog[];
  createdAt: string;
  closedAt?: string;
  closingReason?: string;
}

// --- Shared Types ---
export interface Note {
  id: string;
  user: string;
  date: string;
  text: string;
}

export interface FileEntry {
  name: string;
  date: string;
  type: string;
  url?: string;
}

export interface ActivityLog {
  id: string;
  date: string;
  user: string;
  action: string;
  details: string;
}

export interface PaymentMilestone {
  id: string;
  type: 'date' | 'task';
  description: string;
  amountType: 'fixed' | 'percentage';
  value: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  type: 'company' | 'individual';
}

// --- Project Management Types ---
export type ProjectStatus = 'in_progress' | 'closed';
export type ProjectContractStatus = 'signed' | 'not_signed';
export type ProjectFeeMechanism = 'stages' | 'time_based' | 'purchase_orders';
export type ProjectReportFrequency = 'none' | 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'custom';
export type PipelineStage = 'review_decision' | 'assignee_decision' | 'draft_proposal' | 'review_proposal' | 'final_output' | 'approval' | 'submission' | 'follow_up';

export interface ProjectStage {
  id: string;
  name: string;
  type: 'time' | 'task';
  expectedDate?: string;
  fees?: number;
  status: 'pending' | 'completed' | 'postponed';
}

export interface ProjectContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isMain: boolean;
}

export interface Project {
  id: string;
  name: string;
  managerId: string;
  contractStatus: ProjectContractStatus;
  contractNo?: string;
  contractFollowUpStatus?: 'none' | 'following_up' | 'done';
  clientName: string;
  value: number | 'as_per_po';
  contacts: ProjectContact[];
  nature: string;
  reportFrequency: ProjectReportFrequency;
  customReportDates?: string[];
  feeMechanism: ProjectFeeMechanism;
  hasStages: boolean;
  stageType?: 'time' | 'task';
  stages: ProjectStage[];
  files: FileEntry[];
  activityLog: ActivityLog[];
  status: ProjectStatus;
  createdAt: string;
}

export interface PotentialProject {
  id: string;
  name: string;
  entity: string;
  proposalDate: string;
  documents: FileEntry[];
  firstReviewerId: string;
  reviewerOpinion?: 'accept' | 'reject';
  assigneeType?: 'dept' | 'emp';
  assigneeId?: string;
  assigneeOpinion?: 'accept' | 'reject';
  rejectionReason?: string;
  isEscalated?: boolean;
  currentStage: PipelineStage;
  status: 'in_progress' | 'accepted' | 'rejected' | 'archived';
  activityLog: ActivityLog[];
}

// --- Assignments Types ---
export type PotentialClientStage = 1 | 2 | 3 | 4 | 5 | 6;
export type AssignmentStatus = 'pending' | 'in_progress' | 'waiting_info' | 'completed_signed' | 'completed_rejected' | 'completed_expired' | 'completed_done' | 'completed_incomplete';

export interface PotentialClientAssignment {
  id: string;
  assignedDept: Department;
  clientName: string;
  clientPhone: string;
  subject: string;
  nextStep: string;
  deadlineDate: string;
  currentStage: PotentialClientStage;
  status: AssignmentStatus;
  files: FileEntry[];
  notes: Note[];
  createdAt: string;
  assignedEmployeeId?: string;
  rejectionReason?: string;
  contractId?: string;
}

export interface OpenDeptAssignment {
  id: string;
  contractRef: string;
  clientRef: string;
  assignedDept: Department;
  taskType: 'review' | 'study' | 'other';
  weight: number;
  subject: string;
  startDate: string;
  nextStep: string;
  deadlineDate?: string;
  nextStepDate: string;
  status: AssignmentStatus;
  files: FileEntry[];
  notes: Note[];
  createdAt: string;
  assignedEmployeeId?: string;
  incompleteReason?: string;
  missingInfoDesc?: string;
}

// Guardianship & Liquidation Types
export type EstateStatus = 'in_progress' | 'closed';
export type AssetType = 'real_estate' | 'investment' | 'bank_funds' | 'other';
export type AssetStatus = 'in_progress' | 'completed';
export type LiquidationMethod = 'entrustment_center' | 'court_assignment' | 'direct_client';

export interface Heir {
  id: string;
  name: string;
  identityNo: string;
  birthDate: string;
  phone: string;
  iban: string;
}

export interface LiquidationTask {
  id: string;
  title: string;
  type: 'legal' | 'administrative';
  nextStep: string;
  nextStepDate: string;
  status: 'open' | 'closed';
  hasFees: boolean;
  updates: any[];
}

export interface EstateAsset {
  id: string;
  type: AssetType;
  status: AssetStatus;
  name: string;
  ownershipPercent: number;
  details: {
    reType?: 'villa' | 'land' | 'farm' | 'commercial_building' | 'other';
    deedStatus?: 'none' | 'paper' | 'digital';
    deedNo?: string;
    deedDate?: string;
    location?: { country: string; region: string; city: string; neighborhood: string; };
    area?: number;
    updateStages?: { type: 'survey' | 'exchange' | 'ehkam'; fileName: string; }[];
    evaluations?: { amount: number; date: string; entity: string; }[];
    requirements?: string[];
    contributionName?: string;
    financialEntity?: string;
    bankName?: string;
    amount?: number;
    otherAssetType?: string;
    summary?: string;
  };
  linkedTasks: LiquidationTask[];
}

export interface Estate {
  id: string;
  deceasedName: string;
  method: LiquidationMethod;
  status: EstateStatus;
  heirs: Heir[];
  assets: EstateAsset[];
  tasks: LiquidationTask[]; 
  activityLog: ActivityLog[];
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'lawyer' | 'consultant' | 'client' | 'notary_manager' | 'notary';
  department: Department;
  email: string;
  active: boolean;
  totalWeight: number;
  activeCasesCount: number;
  licenseNo?: string;
}

export interface Contract {
  id: string;
  contractNo: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  opponents: string[];
  departments: Department[];
  subject: string;
  hasDownPayment: boolean;
  downPaymentValue: number;
  payments: PaymentMilestone[];
  contractRefDept: Department;
  createdBy: string;
  status: OpStatus;
  billingRequested: boolean;
  createdAt: string;
  paymentValue?: number;
  notes: Note[];
  files: FileEntry[];
}

export interface Case {
  id: string;
  internalCode: string;
  title: string;
  clientName: string;
  clientRole: ClientRole;
  contractId?: string;
  department: Department;
  status: CaseStatus;
  opponent: string;
  court: string;
  weight: number;
  description?: string;
  assignees: { id: string; name: string; role: string; weight: number; taskName?: string; dueDate?: string }[];
  sessions: any[];
  updates: any[];
  files: FileEntry[];
  notes: Note[];
  nextSessionDate?: string;
  agencyNumber?: string;
  agencyDate?: string;
  managerId?: string;
}

// Operations Types
export interface DocumentationOperation {
  id: string;
  notaryName: string;
  licenseNo: string;
  mainType: 'real_estate' | 'agency';
  subType: string;
  city: string;
  ownerName: string;
  newDocNo: string;
  docDate: string;
  clientId: string;
  clientPhone: string;
  paymentMethod: string;
  clientType: 'instant' | 'contract';
  amount: number;
  billingRequested: boolean;
  status: OpStatus;
  createdBy: string;
  createdAt: string;
  notes: Note[];
  files: FileEntry[];
}

export interface LegalServiceRequest {
  id: string;
  serviceType: string;
  clientId: string;
  clientName: string;
  amount: number;
  vat: number;
  total: number;
  paymentMethod: string;
  billingRequested: boolean;
  deptRef: Department;
  createdBy: string;
  status: OpStatus;
  createdAt: string;
  notes: Note[];
  files: FileEntry[];
}

export const DEPARTMENTS: Record<Department, string> = {
  financial: 'المالي',
  commercial: 'التجاري',
  labor: 'العمالي',
  administrative: 'الإداري',
  documentation: 'التوثيق'
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  new: 'جديدة',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتملة',
  closed: 'مغلقة'
};

export const STATUS_COLORS: Record<CaseStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-500'
};

export const CLIENT_ROLES: Record<ClientRole, string> = {
  plaintiff: 'مدعي',
  defendant: 'مدعى عليه'
};
