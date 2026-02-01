
import { 
  Employee, Client, Contract, DocumentationOperation, Case, LegalServiceRequest,
  PotentialClientAssignment, OpenDeptAssignment, Estate
} from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp1', name: 'ليلى محمد', role: 'admin', department: 'administrative', email: 'laila@example.com', active: true, totalWeight: 45, activeCasesCount: 5 },
  { id: 'emp2', name: 'أحمد علي', role: 'lawyer', department: 'commercial', email: 'ahmed@example.com', active: true, totalWeight: 60, activeCasesCount: 8 },
  { id: 'emp3', name: 'خالد إبراهيم', role: 'notary', department: 'documentation', email: 'khaled@example.com', active: true, totalWeight: 20, activeCasesCount: 3, licenseNo: '77/1234' },
  { id: 'emp4', name: 'ياسر حسن', role: 'notary', department: 'documentation', email: 'yasser@example.com', active: true, totalWeight: 15, activeCasesCount: 2, licenseNo: '88/9900' },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'شركة الأمل', phone: '0501112223', type: 'company' },
  { id: 'c2', name: 'مؤسسة النور', phone: '0555554443', type: 'company' },
  { id: 'c3', name: 'محمد علي', phone: '0559998887', type: 'individual' },
  { id: 'c4', name: 'شركة المستقبل', phone: '0501234567', type: 'company' },
  { id: 'c5', name: 'حسن إبراهيم', phone: '0543210987', type: 'individual' },
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'cnt1',
    contractNo: '2024/001',
    clientId: 'c1',
    clientName: 'شركة الأمل',
    clientPhone: '0501112223',
    opponents: ['مصرف الخير'],
    departments: ['commercial'],
    subject: 'تمثيل قانوني عام - قضايا عقارية واستشارية',
    hasDownPayment: true,
    downPaymentValue: 15000,
    payments: [],
    paymentValue: 100000,
    contractRefDept: 'commercial',
    createdBy: 'ليلى محمد',
    status: 'registered',
    billingRequested: true,
    createdAt: '2024-01-01T10:00:00',
    notes: [{ id: 'n1', user: 'أحمد علي', date: '2024-01-05T10:00:00', text: 'تم استلام الدفعة الأولى من العقد وبدء العمل.' }],
    files: [{ name: 'عقد_شركة_الأمل_الموقع.pdf', date: '2024-01-02', type: 'PDF' }]
  }
];

export const MOCK_DOC_OPS: DocumentationOperation[] = [
  {
    id: 'doc1',
    notaryName: 'خالد إبراهيم',
    licenseNo: '77/1234',
    mainType: 'real_estate',
    subType: 'إفراغ عقاري',
    city: 'الرياض',
    ownerName: 'عبدالله حسن',
    newDocNo: '4400112233',
    docDate: '2024-03-01',
    clientId: 'c3',
    clientPhone: '0559998887',
    paymentMethod: 'تحويل بنكي',
    clientType: 'instant',
    amount: 2500,
    billingRequested: true,
    status: 'registered',
    createdBy: 'خالد إبراهيم',
    createdAt: '2024-03-01T11:00:00',
    notes: [],
    files: []
  }
];

export const MOCK_LEGAL_SERVICES: LegalServiceRequest[] = [
  {
    id: 'ls1',
    serviceType: 'تقديم طلب تنفيذ',
    clientId: 'c4',
    clientName: 'شركة المستقبل',
    amount: 5000,
    vat: 750,
    total: 5750,
    paymentMethod: 'تحويل بنكي',
    billingRequested: true,
    deptRef: 'commercial',
    createdBy: 'أحمد علي',
    status: 'registered',
    createdAt: '2024-03-10T08:00:00',
    notes: [],
    files: []
  }
];

export const MOCK_CASES: Case[] = [
  {
    id: '101',
    internalCode: 'COM-2024-01',
    title: 'نزاع تجاري - شركة الأمل ضد مصرف الخير',
    clientName: 'شركة الأمل',
    clientRole: 'plaintiff',
    contractId: 'cnt1',
    department: 'commercial',
    status: 'in_progress',
    opponent: 'مصرف الخير',
    court: 'المحكمة التجارية بالرياض',
    weight: 20,
    assignees: [],
    sessions: [],
    updates: [],
    files: [],
    notes: []
  }
];

export const MOCK_POTENTIAL_ASSIGNMENTS: PotentialClientAssignment[] = [
  {
    id: 'pa1',
    assignedDept: 'commercial',
    clientName: 'مؤسسة الواحة',
    clientPhone: '0501231234',
    subject: 'مراجعة عقود تشغيل وصيانة لمشروع عمراني كبيير',
    nextStep: 'initial_study',
    deadlineDate: '2024-06-15',
    currentStage: 1,
    status: 'pending',
    files: [],
    notes: [],
    createdAt: '2024-05-20T10:00:00'
  }
];

export const MOCK_OPEN_ASSIGNMENTS: OpenDeptAssignment[] = [
  {
    id: 'oa1',
    contractRef: 'cnt1',
    clientRef: 'c1',
    assignedDept: 'commercial',
    taskType: 'review',
    weight: 2,
    subject: 'مراجعة المذكرة الجوابية المقدمة من الخصم',
    startDate: '2024-05-25',
    nextStep: 'دراسة المذكرة',
    nextStepDate: '2024-05-30',
    status: 'pending',
    files: [],
    notes: [],
    createdAt: '2024-05-24T09:00:00'
  }
];

export const MOCK_ESTATES: Estate[] = [
  {
    id: 'est1',
    deceasedName: 'فهد محمد علي',
    method: 'court_assignment',
    status: 'in_progress',
    heirs: [
      { id: 'h1', name: 'سعد محمد', identityNo: '1022334455', birthDate: '1985-05-10', phone: '0500112233', iban: 'SA1234567890123456789012' },
      { id: 'h2', name: 'هند محمد', identityNo: '1099887766', birthDate: '1990-12-01', phone: '0555443322', iban: 'SA0987654321098765432109' }
    ],
    assets: [
      {
        id: 'ast1',
        type: 'real_estate',
        status: 'in_progress',
        name: 'عقار تجاري - حي الياسمين',
        ownershipPercent: 100,
        details: { 
          reType: 'villa', 
          area: 500, 
          location: { 
            country: 'السعودية', 
            region: 'الرياض', 
            city: 'الرياض', 
            neighborhood: 'الياسمين' 
          }, 
          deedNo: '11223344' 
        },
        linkedTasks: [
          { id: 'tsk1', title: 'تحديث صك العقار', type: 'legal', nextStep: 'مراجعة كتابة العدل الثانية', nextStepDate: '2024-07-20', status: 'open', hasFees: false, updates: [] }
        ]
      }
    ],
    tasks: [],
    activityLog: [],
    createdAt: '2024-06-01T12:00:00'
  }
];
