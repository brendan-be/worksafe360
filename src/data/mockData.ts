// ============================================
// Better Eggs People Platform — Mock Data
// ============================================

// ─── Core Types ───
export interface Employee {
  id: string; name: string; role: string; department: string; site: string;
  status: 'active' | 'onboarding' | 'offboarding'; avatar: string; startDate: string;
  email: string; phone: string; contractType: string; managerId?: string;
  rbacRole: 'admin' | 'hr' | 'manager' | 'employee';
}

export interface Site {
  id: string; name: string; address: string; currentOccupancy: number; maxCapacity: number;
  lat?: number; lng?: number;
}

export interface Certification {
  id: string; employeeId: string; employeeName: string; type: string;
  expiryDate: string; status: 'valid' | 'expiring' | 'expired'; daysRemaining: number;
}

// ─── Module 1: Onboarding ───
export interface OnboardingCandidate {
  id: string; name: string; email: string; role: string; site: string; department: string;
  managerId: string; managerName: string; contractType: string; salary: string;
  startDate: string; trialPeriod: boolean; probationPeriod: boolean;
  workingHours: { days: string; start: string; finish: string; minHours?: number };
  additionalObligations: string[];
  status: 'draft' | 'sent' | 'viewed' | 'partially-signed' | 'signed' | 'complete';
  documents: OnboardingDocument[];
  rightToWork?: RightToWork;
  hardGates: HardGates;
  createdAt: string; offerExpiresAt: string;
  lastReminder?: string;
}

export interface OnboardingDocument {
  id: string; name: string; category: string;
  interactionMode: 'view-only' | 'acknowledge' | 'sign';
  status: 'not-sent' | 'sent' | 'viewed' | 'acknowledged' | 'signed';
  signedAt?: string; viewedAt?: string;
  mandatory: boolean;
}

export interface RightToWork {
  isNZAU: boolean | null;
  passportUploaded: boolean; birthCertUploaded: boolean;
  visaUploaded: boolean; visaType?: string; visaStart?: string; visaExpiry?: string;
  visaConditions?: string;
}

export interface HardGates {
  regulatoryDocsSigned: boolean; mandatoryPoliciesSigned: boolean;
  rightToWorkUploaded: boolean; firstDayInduction: boolean; firstWeekInduction: boolean;
  overrideApplied: boolean; overrideBy?: string; overrideAt?: string;
}

// ─── Module 2: Document Library ───
export interface DocumentTemplate {
  id: string; name: string; category: 'contract' | 'policy' | 'sop' | 'compliance' | 'job-description';
  requirementType: 'mandatory-sign' | 'mandatory-acknowledge' | 'non-mandatory';
  roleAssignments: string[]; version: string; lastUpdated: string; description: string;
}

// ─── Module 3: Learning ───
export interface LearningContent {
  id: string; title: string; type: 'sop' | 'video' | 'document' | 'interactive';
  category: string; mandatory: boolean; roles: string[];
  timeSequence: string; isDevelopmentSignal: boolean;
  duration: string; description: string;
  progress?: number; quizId?: string;
}

export interface Quiz {
  id: string; title: string; contentId: string; passMarkPercent: number;
  maxAttempts: number; attemptsUsed: number; passed: boolean; locked: boolean;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string; question: string; options: string[]; correctIndex: number;
  linkedContentSection?: string;
}

export interface CompetencyCheck {
  id: string; title: string; employeeId: string; employeeName: string;
  role: string; items: CompetencyItem[];
  signedByManager: boolean; managerName?: string; signedAt?: string;
  expiresAt?: string; status: 'pending' | 'in-progress' | 'complete' | 'expired';
}

export interface CompetencyItem {
  id: string; title: string; guidance: string;
  status: 'not-started' | 'complete' | 'partial' | 'not-complete';
}

// ─── Module 4: Checklist ───
export interface Checklist {
  id: string; name: string; type: 'induction' | 'safety-walk' | 'audit' | 'competency' | 'operational';
  assignedTo: string; owner: string; date: string;
  items: ChecklistItem[]; passMark?: number; score?: number;
  employeeSignature?: boolean; managerSignature?: boolean;
  employeeSignedAt?: string; managerSignedAt?: string;
}

export interface ChecklistItem {
  id: string; title: string; guidance: string;
  status: 'complete' | 'partial' | 'not-complete'; notes?: string;
}

// ─── Module 5: Safety ───
export interface Incident {
  id: string; title: string; site: string; severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved'; reportedBy: string;
  reportedDate: string; type: 'incident' | 'near-miss'; description?: string;
}

export interface ImprovementNote {
  id: string; submittedBy: string; date: string;
  category: 'safety' | 'health' | 'infrastructure' | 'process' | 'environment' | 'quality' | 'other';
  description: string; site: string;
  routedTo: string[]; status: 'submitted' | 'acknowledged' | 'actioned' | 'closed';
}

// ─── Module 6: Communications ───
export interface Announcement {
  id: string; title: string; content: string; author: string;
  publishedAt: string; target: string; type: 'memo' | 'announcement';
  attachments?: string[];
}

export interface CalendarEvent {
  id: string; title: string; date: string; time: string; endTime?: string;
  target: string; category: 'company' | 'site' | 'training' | 'social' | 'operational' | 'one-on-one';
  site?: string; description?: string;
}

export interface Recognition {
  id: string; from: string; to: string; type: 'values' | 'behavioural' | 'shout-out' | 'high-performance' | 'birthday' | 'work-anniversary';
  value?: string; message: string; date: string; visibility: 'company' | 'site' | 'team' | 'private' | 'managers';
}

// ─── Module 7: Time & Attendance ───
export interface TimeEntry {
  id: string; employeeId: string; employeeName: string; date: string;
  clockIn: string; clockOut?: string; site: string; method: 'tablet' | 'phone' | 'geo';
  contracted: number; rostered: number; actual: number;
  exception?: string;
}

export interface SiteSignIn {
  id: string; name: string; type: 'employee' | 'visitor' | 'contractor';
  site: string; signInTime: string; signOutTime: string | null; method: 'QR' | 'Kiosk' | 'RFID' | 'Mobile';
}

// ─── Module 8: Budgets ───
export interface BudgetEntry {
  id: string; department: string; quarter: string; budgetedHours: number;
  budgetedCost: number; actualHours: number; actualCost: number;
  headcount: number; expectedHeadcount: number;
}

// ─── Module 9: Audit ───
export interface AuditLogEntry {
  id: string; timestamp: string; userId: string; userName: string;
  action: string; entity: string; entityId: string;
  previousValue?: string; newValue?: string; details?: string;
}

export interface PendingAction {
  id: string; type: 'contract' | 'certification' | 'incident' | 'onboarding' | 'leave';
  title: string; description: string; priority: 'urgent' | 'high' | 'normal'; dueDate: string;
}

export interface DashboardStats {
  totalEmployees: number; activeOnSite: number; openIncidents: number;
  expiringCerts: number; pendingContracts: number; onboardingInProgress: number;
  sitesActive: number; complianceRate: number; learningCompletion: number;
  pendingSignatures: number; improvementNotes: number; recognitionsThisMonth: number;
}

// ════════════════════════════════════════════
// MOCK DATA
// ════════════════════════════════════════════

export const employees: Employee[] = [
  { id: '1', name: 'Luke Benefield', role: 'People & Culture Manager', department: 'Human Resources', site: 'Main Office (Lichfield)', status: 'active', avatar: 'LB', startDate: '2021-03-15', email: 'luke.b@bettereggs.co.nz', phone: '027 555 0101', contractType: 'Permanent Full-Time', rbacRole: 'hr' },
  { id: '2', name: 'James Wiremu', role: 'Flock Supervisor', department: 'Operations', site: 'Forest Farm', status: 'active', avatar: 'JW', startDate: '2022-07-01', email: 'james.w@bettereggs.co.nz', phone: '027 555 0102', contractType: 'Permanent Full-Time', managerId: '1', rbacRole: 'manager' },
  { id: '3', name: 'Aroha Ngata', role: 'HR Administrator', department: 'Human Resources', site: 'Main Office (Lichfield)', status: 'active', avatar: 'AN', startDate: '2020-01-10', email: 'aroha.n@bettereggs.co.nz', phone: '027 555 0103', contractType: 'Permanent Full-Time', managerId: '1', rbacRole: 'hr' },
  { id: '4', name: 'Liam Chen', role: 'Packhouse Team Lead', department: 'Production', site: 'Lichfield Farm', status: 'active', avatar: 'LC', startDate: '2023-02-20', email: 'liam.c@bettereggs.co.nz', phone: '027 555 0104', contractType: 'Permanent Full-Time', managerId: '2', rbacRole: 'manager' },
  { id: '5', name: 'Mere Tūhoe', role: 'Quality Assurance', department: 'Production', site: 'Lichfield Farm', status: 'active', avatar: 'MT', startDate: '2022-11-05', email: 'mere.t@bettereggs.co.nz', phone: '027 555 0105', contractType: 'Permanent Part-Time', managerId: '4', rbacRole: 'employee' },
  { id: '6', name: 'Tom Henderson', role: 'Farm Hand', department: 'Operations', site: 'Forest Farm', status: 'active', avatar: 'TH', startDate: '2024-06-01', email: 'tom.h@bettereggs.co.nz', phone: '027 555 0106', contractType: 'Permanent Full-Time', managerId: '2', rbacRole: 'employee' },
  { id: '7', name: 'Priya Sharma', role: 'Health & Safety Officer', department: 'H&S', site: 'Main Office (Lichfield)', status: 'active', avatar: 'PS', startDate: '2023-08-14', email: 'priya.s@bettereggs.co.nz', phone: '027 555 0107', contractType: 'Permanent Full-Time', managerId: '1', rbacRole: 'manager' },
  { id: '8', name: 'Rawiri Manu', role: 'Farm Hand', department: 'Operations', site: 'Masterton Farm', status: 'onboarding', avatar: 'RM', startDate: '2026-02-24', email: 'rawiri.m@bettereggs.co.nz', phone: '027 555 0108', contractType: 'Permanent Full-Time', managerId: '2', rbacRole: 'employee' },
  { id: '9', name: 'Emma Wilson', role: 'Seasonal Worker', department: 'Operations', site: 'Forest Farm', status: 'active', avatar: 'EW', startDate: '2025-11-01', email: 'emma.w@bettereggs.co.nz', phone: '027 555 0109', contractType: 'Seasonal', managerId: '2', rbacRole: 'employee' },
  { id: '10', name: 'Karl Braun', role: 'Maintenance Technician', department: 'Maintenance', site: 'Lichfield Farm', status: 'active', avatar: 'KB', startDate: '2024-01-15', email: 'karl.b@bettereggs.co.nz', phone: '027 555 0110', contractType: 'Permanent Full-Time', managerId: '4', rbacRole: 'employee' },
  { id: '11', name: 'Tane Rewi', role: 'Driver', department: 'Logistics', site: 'Masterton Farm', status: 'active', avatar: 'TR', startDate: '2024-03-01', email: 'tane.r@bettereggs.co.nz', phone: '027 555 0111', contractType: 'Permanent Full-Time', managerId: '2', rbacRole: 'employee' },
  { id: '12', name: 'Sarah Mitchell', role: 'Finance Manager', department: 'Finance', site: 'Main Office (Lichfield)', status: 'active', avatar: 'SM', startDate: '2021-06-15', email: 'sarah.m@bettereggs.co.nz', phone: '027 555 0112', contractType: 'Permanent Full-Time', managerId: '1', rbacRole: 'manager' },
]

export const sites: Site[] = [
  { id: 's1', name: 'Forest Farm', address: '142 Forest Rd, Forest 2120', currentOccupancy: 12, maxCapacity: 30, lat: -38.14, lng: 176.26 },
  { id: 's2', name: 'Lichfield Farm', address: '58 Lichfield Ave, Lichfield 3204', currentOccupancy: 8, maxCapacity: 25, lat: -38.22, lng: 175.95 },
  { id: 's3', name: 'Masterton Farm', address: '23 Rural Lane, Masterton 3400', currentOccupancy: 5, maxCapacity: 20, lat: -41.06, lng: 175.66 },
  { id: 's4', name: 'Main Office (Lichfield)', address: '100 Main St, Lichfield 3204', currentOccupancy: 4, maxCapacity: 15, lat: -38.22, lng: 175.96 },
  { id: 's5', name: 'Sunny Bay Farm', address: '87 Coastal Rd, Sunny Bay 3800', currentOccupancy: 3, maxCapacity: 18, lat: -41.29, lng: 174.78 },
]

export const certifications: Certification[] = [
  { id: 'c1', employeeId: '1', employeeName: 'Luke Benefield', type: 'First Aid Certificate', expiryDate: '2026-03-10', status: 'expiring', daysRemaining: 20 },
  { id: 'c2', employeeId: '2', employeeName: 'James Wiremu', type: 'Forklift License', expiryDate: '2026-08-15', status: 'valid', daysRemaining: 178 },
  { id: 'c3', employeeId: '4', employeeName: 'Liam Chen', type: 'Forklift License', expiryDate: '2026-02-25', status: 'expiring', daysRemaining: 7 },
  { id: 'c4', employeeId: '6', employeeName: 'Tom Henderson', type: 'Hazardous Substances', expiryDate: '2025-12-01', status: 'expired', daysRemaining: -79 },
  { id: 'c5', employeeId: '7', employeeName: 'Priya Sharma', type: 'Health & Safety Rep', expiryDate: '2027-01-20', status: 'valid', daysRemaining: 336 },
  { id: 'c6', employeeId: '10', employeeName: 'Karl Braun', type: 'Electrical Safety', expiryDate: '2026-04-01', status: 'expiring', daysRemaining: 42 },
  { id: 'c7', employeeId: '3', employeeName: 'Aroha Ngata', type: 'First Aid Certificate', expiryDate: '2026-09-30', status: 'valid', daysRemaining: 224 },
]

export const incidents: Incident[] = [
  { id: 'i1', title: 'Slip on wet floor in packhouse', site: 'Lichfield Farm', severity: 'medium', status: 'investigating', reportedBy: 'Liam Chen', reportedDate: '2026-02-16', type: 'incident', description: 'Employee slipped near wash station. Non-slip mats were displaced during cleaning.' },
  { id: 'i2', title: 'Near-miss: unsecured pallet stack', site: 'Lichfield Farm', severity: 'high', status: 'open', reportedBy: 'Mere Tūhoe', reportedDate: '2026-02-17', type: 'near-miss', description: 'Pallets stacked 5-high without strapping, noticed during morning inspection.' },
  { id: 'i3', title: 'Chemical spill in storage shed', site: 'Forest Farm', severity: 'high', status: 'resolved', reportedBy: 'Tom Henderson', reportedDate: '2026-02-10', type: 'incident', description: 'Small ammonia leak from damaged container. Area ventilated, container replaced.' },
  { id: 'i4', title: 'Ergonomic strain complaint', site: 'Main Office (Lichfield)', severity: 'low', status: 'open', reportedBy: 'Aroha Ngata', reportedDate: '2026-02-15', type: 'incident', description: 'Repetitive strain from workstation setup. Ergonomic assessment requested.' },
]

export const onboardingCandidates: OnboardingCandidate[] = [
  {
    id: 'oc1', name: 'Rawiri Manu', email: 'rawiri.m@bettereggs.co.nz', role: 'Farm Hand',
    site: 'Masterton Farm', department: 'Operations', managerId: '2', managerName: 'James Wiremu',
    contractType: 'Permanent Full-Time', salary: '$55,000', startDate: '2026-02-24',
    trialPeriod: true, probationPeriod: false,
    workingHours: { days: 'Mon-Fri', start: '06:00', finish: '14:30', minHours: 40 },
    additionalObligations: ['Company vehicle access'],
    status: 'partially-signed',
    documents: [
      { id: 'd1', name: 'Letter of Offer', category: 'Contract', interactionMode: 'sign', status: 'signed', mandatory: true, signedAt: '2026-02-16T10:30:00' },
      { id: 'd2', name: 'Employment Agreement', category: 'Contract', interactionMode: 'sign', status: 'signed', mandatory: true, signedAt: '2026-02-16T10:35:00' },
      { id: 'd3', name: 'Biosecurity Policy', category: 'Policy', interactionMode: 'acknowledge', status: 'acknowledged', mandatory: true },
      { id: 'd4', name: 'H&S Policy', category: 'Policy', interactionMode: 'acknowledge', status: 'sent', mandatory: true },
      { id: 'd5', name: 'IR330 Tax Declaration', category: 'Compliance', interactionMode: 'sign', status: 'sent', mandatory: true },
      { id: 'd6', name: 'KS2 KiwiSaver', category: 'Compliance', interactionMode: 'sign', status: 'not-sent', mandatory: true },
      { id: 'd7', name: 'Job Description', category: 'Job Description', interactionMode: 'view-only', status: 'viewed', mandatory: false },
      { id: 'd8', name: 'Drug & Alcohol Policy', category: 'Policy', interactionMode: 'acknowledge', status: 'not-sent', mandatory: true },
    ],
    rightToWork: { isNZAU: true, passportUploaded: true, birthCertUploaded: false, visaUploaded: false },
    hardGates: { regulatoryDocsSigned: false, mandatoryPoliciesSigned: false, rightToWorkUploaded: true, firstDayInduction: false, firstWeekInduction: false, overrideApplied: false },
    createdAt: '2026-02-15', offerExpiresAt: '2026-02-22',
  },
  {
    id: 'oc2', name: 'Hana Tamati', email: 'hana.t@email.com', role: 'Packhouse Operator',
    site: 'Lichfield Farm', department: 'Production', managerId: '4', managerName: 'Liam Chen',
    contractType: 'Casual', salary: '$27.50/hr', startDate: '2026-03-03',
    trialPeriod: false, probationPeriod: false,
    workingHours: { days: 'As required', start: '07:00', finish: '15:30' },
    additionalObligations: [],
    status: 'sent',
    documents: [
      { id: 'd9', name: 'Letter of Offer', category: 'Contract', interactionMode: 'sign', status: 'sent', mandatory: true },
      { id: 'd10', name: 'Casual Employment Agreement', category: 'Contract', interactionMode: 'sign', status: 'sent', mandatory: true },
      { id: 'd11', name: 'Biosecurity Policy', category: 'Policy', interactionMode: 'acknowledge', status: 'sent', mandatory: true },
      { id: 'd12', name: 'H&S Policy', category: 'Policy', interactionMode: 'acknowledge', status: 'sent', mandatory: true },
      { id: 'd13', name: 'IR330 Tax Declaration', category: 'Compliance', interactionMode: 'sign', status: 'not-sent', mandatory: true },
    ],
    rightToWork: { isNZAU: null, passportUploaded: false, birthCertUploaded: false, visaUploaded: false },
    hardGates: { regulatoryDocsSigned: false, mandatoryPoliciesSigned: false, rightToWorkUploaded: false, firstDayInduction: false, firstWeekInduction: false, overrideApplied: false },
    createdAt: '2026-02-20', offerExpiresAt: '2026-02-27',
  },
]

export const documentTemplates: DocumentTemplate[] = [
  { id: 'dt1', name: 'Letter of Offer', category: 'contract', requirementType: 'mandatory-sign', roleAssignments: ['all'], version: '3.1', lastUpdated: '2026-01-15', description: 'Standard offer letter for all employment types' },
  { id: 'dt2', name: 'Employment Agreement — Permanent', category: 'contract', requirementType: 'mandatory-sign', roleAssignments: ['all'], version: '4.2', lastUpdated: '2026-01-10', description: 'Full-time and part-time permanent employment agreement' },
  { id: 'dt3', name: 'Casual Employment Agreement', category: 'contract', requirementType: 'mandatory-sign', roleAssignments: ['all'], version: '2.1', lastUpdated: '2025-11-20', description: 'Casual employment agreement with no guaranteed hours' },
  { id: 'dt4', name: 'Seasonal Agreement', category: 'contract', requirementType: 'mandatory-sign', roleAssignments: ['Seasonal Worker'], version: '1.5', lastUpdated: '2025-10-01', description: 'Fixed-term seasonal employment agreement' },
  { id: 'dt5', name: 'Biosecurity Policy', category: 'policy', requirementType: 'mandatory-acknowledge', roleAssignments: ['all'], version: '2.0', lastUpdated: '2026-02-01', description: 'Universal biosecurity requirements for all staff' },
  { id: 'dt6', name: 'Health & Safety Policy', category: 'policy', requirementType: 'mandatory-acknowledge', roleAssignments: ['all'], version: '5.3', lastUpdated: '2026-01-20', description: 'Comprehensive H&S policy and procedures' },
  { id: 'dt7', name: 'Drug & Alcohol Policy', category: 'policy', requirementType: 'mandatory-acknowledge', roleAssignments: ['all'], version: '3.0', lastUpdated: '2025-09-15', description: 'Zero-tolerance drug and alcohol policy' },
  { id: 'dt8', name: 'Social Media Policy', category: 'policy', requirementType: 'mandatory-acknowledge', roleAssignments: ['all'], version: '1.2', lastUpdated: '2025-08-01', description: 'Social media usage guidelines' },
  { id: 'dt9', name: 'IR330 Tax Declaration', category: 'compliance', requirementType: 'mandatory-sign', roleAssignments: ['all'], version: 'IRD 2025', lastUpdated: '2025-04-01', description: 'IRD tax code declaration form' },
  { id: 'dt10', name: 'KS2 KiwiSaver', category: 'compliance', requirementType: 'mandatory-sign', roleAssignments: ['all'], version: 'IRD 2025', lastUpdated: '2025-04-01', description: 'KiwiSaver enrollment/opt-out form' },
  { id: 'dt11', name: 'Hazardous Substances SOP', category: 'sop', requirementType: 'mandatory-sign', roleAssignments: ['Farm Hand', 'Maintenance Technician'], version: '2.4', lastUpdated: '2026-01-05', description: 'Standard operating procedures for hazardous substances' },
  { id: 'dt12', name: 'Forklift Operation SOP', category: 'sop', requirementType: 'mandatory-sign', roleAssignments: ['Packhouse Team Lead', 'Packhouse Operator'], version: '3.1', lastUpdated: '2025-12-10', description: 'Forklift safety and operation procedures' },
  { id: 'dt13', name: 'Farm Hand Job Description', category: 'job-description', requirementType: 'non-mandatory', roleAssignments: ['Farm Hand'], version: '2.0', lastUpdated: '2025-11-01', description: 'Role description, responsibilities, and KPIs' },
  { id: 'dt14', name: 'Confidentiality Agreement', category: 'compliance', requirementType: 'mandatory-sign', roleAssignments: ['all'], version: '1.1', lastUpdated: '2025-06-01', description: 'Confidentiality and non-disclosure agreement' },
  { id: 'dt15', name: 'Vehicle Use Agreement', category: 'policy', requirementType: 'mandatory-sign', roleAssignments: ['Driver', 'Farm Manager'], version: '1.3', lastUpdated: '2025-07-15', description: 'Company vehicle use policy and agreement' },
  { id: 'dt16', name: 'Accommodation Agreement', category: 'contract', requirementType: 'mandatory-sign', roleAssignments: ['Seasonal Worker'], version: '1.0', lastUpdated: '2025-09-01', description: 'On-site accommodation terms for seasonal staff' },
]

export const learningContent: LearningContent[] = [
  { id: 'lc1', title: 'H&S Induction', type: 'video', category: 'Safety', mandatory: true, roles: ['all'], timeSequence: 'Week 1', isDevelopmentSignal: false, duration: '45 min', description: 'Comprehensive health and safety induction for all new staff', progress: 100 },
  { id: 'lc2', title: 'Biosecurity Protocols', type: 'document', category: 'Compliance', mandatory: true, roles: ['all'], timeSequence: 'Week 1', isDevelopmentSignal: false, duration: '20 min', description: 'Farm biosecurity requirements and procedures', progress: 100 },
  { id: 'lc3', title: 'Egg Handling & Grading', type: 'video', category: 'Operations', mandatory: true, roles: ['Packhouse Operator', 'Packhouse Team Lead', 'Quality Assurance'], timeSequence: 'Week 1', isDevelopmentSignal: false, duration: '30 min', description: 'Proper egg handling, grading standards, and quality checks', progress: 60 },
  { id: 'lc4', title: 'Forklift Safety Refresher', type: 'interactive', category: 'Safety', mandatory: true, roles: ['Packhouse Team Lead', 'Packhouse Operator'], timeSequence: 'Week 2', isDevelopmentSignal: false, duration: '1 hr', description: 'Annual forklift safety competency refresher', progress: 0, quizId: 'q1' },
  { id: 'lc5', title: 'Chemical Safety — HSNO', type: 'document', category: 'Safety', mandatory: true, roles: ['Farm Hand', 'Maintenance Technician'], timeSequence: 'Week 1', isDevelopmentSignal: false, duration: '25 min', description: 'Hazardous substances and new organisms regulations', progress: 0, quizId: 'q2' },
  { id: 'lc6', title: 'Leadership Foundations', type: 'video', category: 'Development', mandatory: false, roles: ['all'], timeSequence: 'Optional', isDevelopmentSignal: true, duration: '2 hrs', description: 'Introduction to people leadership at Better Eggs', progress: 30 },
  { id: 'lc7', title: 'Animal Welfare Standards', type: 'document', category: 'Compliance', mandatory: true, roles: ['Farm Hand', 'Flock Supervisor', 'Farm Manager'], timeSequence: 'Week 2', isDevelopmentSignal: false, duration: '35 min', description: 'NZ animal welfare code of practice for layer hens', progress: 80 },
  { id: 'lc8', title: 'First Aid Basics', type: 'video', category: 'Safety', mandatory: false, roles: ['all'], timeSequence: 'Week 3', isDevelopmentSignal: false, duration: '1.5 hrs', description: 'Basic first aid procedures and emergency response', progress: 0 },
]

export const quizzes: Quiz[] = [
  {
    id: 'q1', title: 'Forklift Safety Assessment', contentId: 'lc4', passMarkPercent: 80, maxAttempts: 3, attemptsUsed: 0, passed: false, locked: false, questions: [
      { id: 'qq1', question: 'What is the maximum safe stacking height for pallets?', options: ['3 high', '4 high', '5 high', '6 high'], correctIndex: 1 },
      { id: 'qq2', question: 'When should you sound the horn?', options: ['At all intersections', 'Only outdoors', 'Never', 'Only when reversing'], correctIndex: 0 },
      { id: 'qq3', question: 'What should you check before operating a forklift?', options: ['Fuel only', 'Tyres only', 'Pre-start checklist', 'Nothing'], correctIndex: 2 },
      { id: 'qq4', question: 'What is the correct travelling position for forks?', options: ['Raised high', 'Tilted back, 15cm off ground', 'Flat on ground', 'At chest height'], correctIndex: 1 },
      { id: 'qq5', question: 'Can passengers ride on the forklift?', options: ['Yes, if seated', 'Yes, if holding on', 'Never', 'Only supervisors'], correctIndex: 2 },
    ]
  },
  {
    id: 'q2', title: 'Chemical Safety Quiz', contentId: 'lc5', passMarkPercent: 100, maxAttempts: 2, attemptsUsed: 1, passed: false, locked: false, questions: [
      { id: 'qq6', question: 'What does SDS stand for?', options: ['Safety Data Sheet', 'Standard Data System', 'Safe Delivery Standard', 'Security Data Summary'], correctIndex: 0 },
      { id: 'qq7', question: 'What should you do first if chemicals contact skin?', options: ['Report to manager', 'Flush with water for 15 min', 'Apply cream', 'Continue working'], correctIndex: 1 },
      { id: 'qq8', question: 'Where must chemicals be stored?', options: ['Anywhere dry', 'In locked, ventilated storage', 'In the office', 'On pallets outside'], correctIndex: 1 },
    ]
  },
]

export const checklists: Checklist[] = [
  {
    id: 'cl1', name: 'Day 1 Induction — Masterton Farm', type: 'induction', assignedTo: 'Rawiri Manu', owner: 'James Wiremu', date: '2026-02-24', passMark: 100, score: 0,
    items: [
      { id: 'cli1', title: 'Welcome & introductions', guidance: 'Introduce to team, show break room, toilets, parking', status: 'not-complete' },
      { id: 'cli2', title: 'Emergency procedures', guidance: 'Show exits, muster points, first aid kits, fire extinguishers', status: 'not-complete' },
      { id: 'cli3', title: 'PPE issued and fitted', guidance: 'Boots, hi-vis, gloves, ear protection. Record sizes.', status: 'not-complete' },
      { id: 'cli4', title: 'Site hazards walkthrough', guidance: 'Walk entire site pointing out hazard boards and controls', status: 'not-complete' },
      { id: 'cli5', title: 'Equipment orientation', guidance: 'Show key equipment, explain do-not-touch items', status: 'not-complete' },
      { id: 'cli6', title: 'Sign-in system training', guidance: 'Show QR/kiosk/RFID sign-in process', status: 'not-complete' },
    ]
  },
  {
    id: 'cl2', name: 'Weekly Safety Walk — Lichfield Farm', type: 'safety-walk', assignedTo: 'Priya Sharma', owner: 'Priya Sharma', date: '2026-02-21',
    items: [
      { id: 'cli7', title: 'Walkways clear and unobstructed', guidance: 'Check all pedestrian routes are free of pallets, equipment, debris', status: 'complete', notes: 'All clear' },
      { id: 'cli8', title: 'Emergency exits accessible', guidance: 'All fire exits unblocked, signage visible and illuminated', status: 'complete', notes: 'Exit B light replaced' },
      { id: 'cli9', title: 'Chemical storage compliant', guidance: 'All containers sealed, SDS posted, ventilation working', status: 'partial', notes: 'One SDS needs updating — ammonia' },
      { id: 'cli10', title: 'PPE available and in condition', guidance: 'Check PPE stations stocked, items not damaged', status: 'complete' },
      { id: 'cli11', title: 'First aid kits stocked', guidance: 'Check all kits, note any items below minimum stock', status: 'complete' },
    ]
  },
]

export const improvementNotes: ImprovementNote[] = [
  { id: 'in1', submittedBy: 'Tom Henderson', date: '2026-02-18', category: 'infrastructure', description: 'The hand wash station near Shed 3 has low water pressure — takes a long time to wash properly. Could we get the plumbing checked?', site: 'Forest Farm', routedTo: ['James Wiremu', 'Karl Braun'], status: 'acknowledged' },
  { id: 'in2', submittedBy: 'Mere Tūhoe', date: '2026-02-20', category: 'process', description: 'We could save 15 minutes per shift if the grading trays were pre-sorted before the morning run starts. Happy to help set up a roster.', site: 'Lichfield Farm', routedTo: ['Liam Chen'], status: 'submitted' },
  { id: 'in3', submittedBy: 'Tane Rewi', date: '2026-02-22', category: 'safety', description: 'The road between the loading bay and Farm 2 gate has deep potholes. Trucks are swerving to avoid them, which is a hazard near the pedestrian crossing.', site: 'Masterton Farm', routedTo: ['James Wiremu', 'Priya Sharma'], status: 'actioned' },
]

export const announcements: Announcement[] = [
  { id: 'a1', title: 'Welcome Rawiri Manu!', content: 'Please join us in welcoming Rawiri to the Masterton Farm team. He starts on 24 Feb as a Farm Hand. Show him the Better Eggs way! 🥚', author: 'Luke Benefield', publishedAt: '2026-02-20', target: 'Company-wide', type: 'announcement' },
  { id: 'a2', title: 'Updated Biosecurity Protocol', content: 'Following the MPI audit, we\'ve updated our biosecurity entry procedures. All staff must review the new protocol by end of February. Link sent to your learning portal.', author: 'Priya Sharma', publishedAt: '2026-02-18', target: 'Company-wide', type: 'memo' },
  { id: 'a3', title: 'Lichfield Farm — Shed 4 Maintenance', content: 'Shed 4 will be offline for scheduled maintenance from 3-5 March. Affected team members have been notified of temporary reassignments.', author: 'James Wiremu', publishedAt: '2026-02-22', target: 'Lichfield Farm', type: 'announcement' },
]

export const calendarEvents: CalendarEvent[] = [
  { id: 'ce1', title: 'H&S Committee Meeting', date: '2026-02-28', time: '10:00', endTime: '11:30', target: 'H&S', category: 'company', site: 'Main Office (Lichfield)', description: 'Monthly H&S committee meeting' },
  { id: 'ce2', title: 'Rawiri — Day 1 Induction', date: '2026-02-24', time: '06:00', endTime: '14:30', target: 'Masterton Farm', category: 'training', description: 'Full day induction for new starter' },
  { id: 'ce3', title: 'Shed 4 Depopulation', date: '2026-03-03', time: '05:00', endTime: '18:00', target: 'Lichfield Farm', category: 'operational', site: 'Lichfield Farm', description: 'Scheduled depopulation and clean-out' },
  { id: 'ce4', title: 'Team BBQ 🍔', date: '2026-03-07', time: '12:00', endTime: '14:00', target: 'Company-wide', category: 'social', description: 'End of harvest celebration BBQ at Forest Farm' },
  { id: 'ce5', title: 'First Aid Refresher Training', date: '2026-03-10', time: '09:00', endTime: '16:00', target: 'All sites', category: 'training', site: 'Main Office (Lichfield)', description: 'Annual first aid refresher — mandatory for certificate holders' },
  { id: 'ce6', title: 'Luke ↔ Aroha 1:1', date: '2026-02-27', time: '14:00', endTime: '14:30', target: 'Private', category: 'one-on-one', description: 'Weekly catch-up' },
]

export const recognitions: Recognition[] = [
  { id: 'r1', from: 'James Wiremu', to: 'Tom Henderson', type: 'values', value: 'Kaitiakitanga', message: 'Tom spotted and reported the chemical issue immediately — great stewardship of our environment and team safety.', date: '2026-02-11', visibility: 'company' },
  { id: 'r2', from: 'Liam Chen', to: 'Mere Tūhoe', type: 'shout-out', message: 'Mere stayed back to help re-sort 20 trays after a grading error. Team player through and through! 💪', date: '2026-02-19', visibility: 'site' },
  { id: 'r3', from: 'Luke Benefield', to: 'Priya Sharma', type: 'high-performance', message: 'Priya led our MPI audit prep flawlessly — zero non-conformances for the second year running. Outstanding work.', date: '2026-02-15', visibility: 'company' },
  { id: 'r4', from: 'Aroha Ngata', to: 'Tane Rewi', type: 'behavioural', message: 'Tane proactively identified the road hazard and submitted a detailed improvement note. This is exactly the safety culture we want.', date: '2026-02-23', visibility: 'company' },
  { id: 'r5', from: 'System', to: 'Tom Henderson', type: 'birthday', message: 'Happy Birthday Tom! 🎂 Wishing you a great day.', date: '2026-03-14', visibility: 'managers' },
  { id: 'r6', from: 'System', to: 'James Wiremu', type: 'work-anniversary', message: 'Happy 3-year work anniversary James! 🎉 Thank you for your dedication to Better Eggs.', date: '2026-03-01', visibility: 'managers' },
]

export const timeEntries: TimeEntry[] = [
  { id: 'te1', employeeId: '2', employeeName: 'James Wiremu', date: '2026-02-27', clockIn: '06:00', clockOut: '14:30', site: 'Forest Farm', method: 'tablet', contracted: 8, rostered: 8.5, actual: 8.5 },
  { id: 'te2', employeeId: '6', employeeName: 'Tom Henderson', date: '2026-02-27', clockIn: '06:15', clockOut: '14:45', site: 'Forest Farm', method: 'phone', contracted: 8, rostered: 8.5, actual: 8.5 },
  { id: 'te3', employeeId: '4', employeeName: 'Liam Chen', date: '2026-02-27', clockIn: '07:00', clockOut: '15:30', site: 'Lichfield Farm', method: 'tablet', contracted: 8, rostered: 8.5, actual: 8.5 },
  { id: 'te4', employeeId: '5', employeeName: 'Mere Tūhoe', date: '2026-02-27', clockIn: '07:00', clockOut: '12:00', site: 'Lichfield Farm', method: 'phone', contracted: 5, rostered: 5, actual: 5 },
  { id: 'te5', employeeId: '10', employeeName: 'Karl Braun', date: '2026-02-27', clockIn: '07:30', site: 'Lichfield Farm', method: 'tablet', contracted: 8, rostered: 8, actual: 0, exception: 'Still on site' },
  { id: 'te6', employeeId: '11', employeeName: 'Tane Rewi', date: '2026-02-27', clockIn: '05:30', clockOut: '16:00', site: 'Masterton Farm', method: 'geo', contracted: 8, rostered: 8, actual: 10.5, exception: 'Overtime — delivery delays' },
]

export const budgetEntries: BudgetEntry[] = [
  { id: 'b1', department: 'Operations', quarter: 'Q1 2026', budgetedHours: 2400, budgetedCost: 72000, actualHours: 2280, actualCost: 68400, headcount: 5, expectedHeadcount: 6 },
  { id: 'b2', department: 'Production', quarter: 'Q1 2026', budgetedHours: 1600, budgetedCost: 48000, actualHours: 1720, actualCost: 51600, headcount: 3, expectedHeadcount: 3 },
  { id: 'b3', department: 'Maintenance', quarter: 'Q1 2026', budgetedHours: 800, budgetedCost: 28000, actualHours: 760, actualCost: 26600, headcount: 1, expectedHeadcount: 1 },
  { id: 'b4', department: 'Human Resources', quarter: 'Q1 2026', budgetedHours: 640, budgetedCost: 32000, actualHours: 680, actualCost: 34000, headcount: 2, expectedHeadcount: 2 },
  { id: 'b5', department: 'Logistics', quarter: 'Q1 2026', budgetedHours: 800, budgetedCost: 24000, actualHours: 880, actualCost: 26400, headcount: 1, expectedHeadcount: 1 },
]

export const auditLog: AuditLogEntry[] = [
  { id: 'al1', timestamp: '2026-02-27T10:30:00', userId: '1', userName: 'Luke Benefield', action: 'Sent offer', entity: 'OnboardingCandidate', entityId: 'oc2', details: 'Sent offer package to Hana Tamati via secure link' },
  { id: 'al2', timestamp: '2026-02-27T09:15:00', userId: '3', userName: 'Aroha Ngata', action: 'Updated document', entity: 'DocumentTemplate', entityId: 'dt5', details: 'Updated Biosecurity Policy to v2.0', previousValue: 'v1.9', newValue: 'v2.0' },
  { id: 'al3', timestamp: '2026-02-26T14:20:00', userId: '8', userName: 'Rawiri Manu', action: 'Signed document', entity: 'OnboardingDocument', entityId: 'd1', details: 'Signed Letter of Offer' },
  { id: 'al4', timestamp: '2026-02-26T14:25:00', userId: '8', userName: 'Rawiri Manu', action: 'Signed document', entity: 'OnboardingDocument', entityId: 'd2', details: 'Signed Employment Agreement' },
  { id: 'al5', timestamp: '2026-02-25T11:00:00', userId: '7', userName: 'Priya Sharma', action: 'Completed safety walk', entity: 'Checklist', entityId: 'cl2', details: 'Weekly Safety Walk — Lichfield Farm' },
  { id: 'al6', timestamp: '2026-02-24T08:00:00', userId: '6', userName: 'Tom Henderson', action: 'Submitted improvement note', entity: 'ImprovementNote', entityId: 'in1', details: 'Hand wash station water pressure issue' },
  { id: 'al7', timestamp: '2026-02-23T16:45:00', userId: '1', userName: 'Luke Benefield', action: 'Created employee record', entity: 'OnboardingCandidate', entityId: 'oc1', details: 'Created onboarding record for Rawiri Manu' },
  { id: 'al8', timestamp: '2026-02-22T13:30:00', userId: '11', userName: 'Tane Rewi', action: 'Submitted improvement note', entity: 'ImprovementNote', entityId: 'in3', details: 'Road hazard report — Masterton Farm' },
  { id: 'al9', timestamp: '2026-02-20T09:00:00', userId: '4', userName: 'Liam Chen', action: 'Reported incident', entity: 'Incident', entityId: 'i1', details: 'Slip on wet floor in packhouse' },
  { id: 'al10', timestamp: '2026-02-18T11:15:00', userId: '0', userName: 'System', action: 'Auto-reminder sent', entity: 'OnboardingCandidate', entityId: 'oc1', details: 'Automated reminder sent to Rawiri Manu for unsigned documents' },
]

export const signInLog: SiteSignIn[] = [
  { id: 'si1', name: 'Luke Benefield', type: 'employee', site: 'Main Office (Lichfield)', signInTime: '07:45', signOutTime: null, method: 'RFID' },
  { id: 'si2', name: 'James Wiremu', type: 'employee', site: 'Forest Farm', signInTime: '06:00', signOutTime: null, method: 'QR' },
  { id: 'si3', name: 'Tom Henderson', type: 'employee', site: 'Forest Farm', signInTime: '06:15', signOutTime: null, method: 'Mobile' },
  { id: 'si4', name: 'Dave Smith (Pest Control)', type: 'contractor', site: 'Forest Farm', signInTime: '08:15', signOutTime: '11:30', method: 'Kiosk' },
  { id: 'si5', name: 'Liam Chen', type: 'employee', site: 'Lichfield Farm', signInTime: '07:00', signOutTime: null, method: 'RFID' },
  { id: 'si6', name: 'Mere Tūhoe', type: 'employee', site: 'Lichfield Farm', signInTime: '07:00', signOutTime: null, method: 'QR' },
  { id: 'si7', name: 'Karl Braun', type: 'employee', site: 'Lichfield Farm', signInTime: '07:30', signOutTime: null, method: 'RFID' },
  { id: 'si8', name: 'MPI Inspector', type: 'visitor', site: 'Lichfield Farm', signInTime: '09:00', signOutTime: null, method: 'Kiosk' },
  { id: 'si9', name: 'Tane Rewi', type: 'employee', site: 'Masterton Farm', signInTime: '05:30', signOutTime: '16:00', method: 'Mobile' },
  { id: 'si10', name: 'Aroha Ngata', type: 'employee', site: 'Main Office (Lichfield)', signInTime: '08:00', signOutTime: null, method: 'RFID' },
]

export const pendingActions: PendingAction[] = [
  { id: 'pa1', type: 'certification', title: "Liam Chen's Forklift License expires in 7 days", description: 'Renew before 25 Feb 2026', priority: 'urgent', dueDate: '2026-02-25' },
  { id: 'pa2', type: 'certification', title: "Tom Henderson's Hazardous Substances cert expired", description: 'Expired 1 Dec 2025 — 79 days overdue', priority: 'urgent', dueDate: '2025-12-01' },
  { id: 'pa3', type: 'contract', title: 'Rawiri Manu — documents partially signed', description: '4 of 8 documents still pending', priority: 'high', dueDate: '2026-02-22' },
  { id: 'pa4', type: 'incident', title: 'Unsecured pallet stack — investigation needed', description: 'Near-miss reported at Lichfield Farm', priority: 'high', dueDate: '2026-02-19' },
  { id: 'pa5', type: 'onboarding', title: 'Hana Tamati — offer sent, awaiting response', description: 'Casual Packhouse Operator, Lichfield Farm', priority: 'normal', dueDate: '2026-02-27' },
]

export const dashboardStats: DashboardStats = {
  totalEmployees: 12, activeOnSite: 29, openIncidents: 3, expiringCerts: 3,
  pendingContracts: 2, onboardingInProgress: 2, sitesActive: 5, complianceRate: 87,
  learningCompletion: 64, pendingSignatures: 4, improvementNotes: 3, recognitionsThisMonth: 4,
}

// Legacy compat
export const onboardingTasks = [
  { id: 'o1', employeeId: '8', employeeName: 'Rawiri Manu', task: 'Sign Employment Agreement', completed: true, dueDate: '2026-02-20', category: 'Documents' },
  { id: 'o2', employeeId: '8', employeeName: 'Rawiri Manu', task: 'Complete IR330 Tax Declaration', completed: true, dueDate: '2026-02-20', category: 'Documents' },
  { id: 'o3', employeeId: '8', employeeName: 'Rawiri Manu', task: 'Select KiwiSaver Rate', completed: false, dueDate: '2026-02-20', category: 'Documents' },
  { id: 'o4', employeeId: '8', employeeName: 'Rawiri Manu', task: 'Issue PPE (boots, hi-vis, gloves)', completed: false, dueDate: '2026-02-24', category: 'Equipment' },
  { id: 'o5', employeeId: '8', employeeName: 'Rawiri Manu', task: 'Assign locker', completed: false, dueDate: '2026-02-24', category: 'Equipment' },
  { id: 'o6', employeeId: '8', employeeName: 'Rawiri Manu', task: 'Watch H&S Induction Video', completed: false, dueDate: '2026-02-24', category: 'Safety' },
  { id: 'o7', employeeId: '8', employeeName: 'Rawiri Manu', task: 'Site Orientation Tour', completed: false, dueDate: '2026-02-24', category: 'Safety' },
  { id: 'o8', employeeId: '8', employeeName: 'Rawiri Manu', task: 'Acknowledge H&S Policy', completed: false, dueDate: '2026-02-24', category: 'Safety' },
  { id: 'o9', employeeId: '8', employeeName: 'Rawiri Manu', task: 'Assign buddy (Tom Henderson)', completed: false, dueDate: '2026-02-24', category: 'People' },
]
