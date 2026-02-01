
import React, { useState } from 'react';
import { 
  Plus, Search, FolderKanban, ChevronLeft, CheckCircle, 
  X, UserPlus, FileText, Briefcase, FileSignature, 
  PlusCircle, AlertCircle, Trash2, DollarSign, 
  History, User, Activity, MoreVertical, CheckSquare, 
  MapPin, Info, FileUp, Calendar, ListTodo, Clock,
  ClipboardList, UserCheck, AlertTriangle, ShieldAlert, Send
} from 'lucide-react';
import { MOCK_EMPLOYEES } from '../constants';
import { 
  Project, PotentialProject, ProjectContractStatus, 
  ProjectFeeMechanism, ProjectReportFrequency, PipelineStage, 
  ProjectStage, ProjectContact
} from '../types';

const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  review_decision: 'قرار المراجع الأول',
  assignee_decision: 'رأي الموظف المسند إليه',
  draft_proposal: 'إعداد مسودة العرض',
  review_proposal: 'مراجعة العرض الفني والمالي',
  final_output: 'تجهيز المخرج النهائي',
  approval: 'اعتماد المخرج النهائي',
  submission: 'التقديم',
  follow_up: 'متابعة ما بعد التقديم'
};

const FEE_MECHANISM_LABELS: Record<ProjectFeeMechanism, string> = {
  stages: 'مرتبط بالمراحل (أتعاب لكل مرحلة)',
  time_based: 'مرتبط بـ مدد زمنية',
  purchase_orders: 'مرتبط بأوامر الشراء'
};

const FREQUENCY_LABELS: Record<ProjectReportFrequency, string> = {
  none: 'لا يوجد',
  monthly: 'شهري',
  quarterly: 'ربع سنوي',
  semi_annually: 'نصف سنوي',
  annually: 'سنوي',
  custom: 'تواريخ مخصصة'
};

const ProjectManagement = () => {
  // --- محاكاة بيانات المشاريع الفعلية بأرقام وأسماء خيالية ---
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'PRJ-101',
      name: 'تطوير سياسات الكوادر البشرية',
      managerId: 'emp1',
      contractStatus: 'not_signed',
      clientName: 'شركة الحلول المبدعة',
      value: 150000,
      contacts: [{ id: '1', name: 'سالم أحمد', phone: '0501112223', isMain: true }],
      nature: 'دراسة وتحليل الهياكل التنظيمية وتحديث السياسات الداخلية للمؤسسة.',
      reportFrequency: 'monthly',
      feeMechanism: 'stages',
      hasStages: true,
      stageType: 'task',
      stages: [
        { id: 'st1', name: 'تحليل الوضع الراهن', type: 'task', status: 'completed', fees: 30000 },
        { id: 'st2', name: 'تصميم مسودة السياسات', type: 'task', status: 'pending', fees: 70000 }
      ],
      files: [],
      activityLog: [{ id: 'l1', date: new Date().toISOString(), user: 'ليلى محمد', action: 'إنشاء', details: 'فتح ملف المشروع الإداري' }],
      status: 'in_progress',
      createdAt: '2024-01-10T08:00:00Z'
    },
    {
      id: 'PRJ-102',
      name: 'مشروع الحوكمة المؤسسية - مجموعة الصفا',
      managerId: 'emp2',
      contractStatus: 'signed',
      contractNo: 'CNT-2024-088',
      clientName: 'شركة الصفا القابضة',
      value: 450000,
      contacts: [{ id: '2', name: 'راشد علي', phone: '0555554443', isMain: true }],
      nature: 'إعداد ميثاق العائلة ودستور الحوكمة وتوزيع الصلاحيات الإدارية.',
      reportFrequency: 'quarterly',
      feeMechanism: 'time_based',
      hasStages: true,
      stageType: 'time',
      stages: [
        { id: 'st1', name: 'الربع الأول: المسح الميداني', type: 'time', status: 'completed', fees: 100000 },
        { id: 'st2', name: 'الربع الثاني: إعداد الصياغات', type: 'time', status: 'pending', fees: 150000 }
      ],
      files: [],
      activityLog: [{ id: 'l2', date: new Date().toISOString(), user: 'أحمد علي', action: 'تحديث', details: 'تم الانتهاء من مرحلة المسح' }],
      status: 'in_progress',
      createdAt: '2023-11-05T10:30:00Z'
    },
    {
      id: 'PRJ-103',
      name: 'استشارات العقود الكبرى - منطقة الواحة',
      managerId: 'emp1',
      contractStatus: 'signed',
      contractNo: 'PO-99221-EXP',
      clientName: 'شركة تنمية الواحة',
      value: 'as_per_po',
      contacts: [{ id: '3', name: 'سارة حسن', phone: '+9665000000', isMain: true }],
      nature: 'مراجعة عقود المقاولات وضمان الامتثال للأنظمة المحلية والدولية.',
      reportFrequency: 'monthly',
      feeMechanism: 'purchase_orders',
      hasStages: false,
      stages: [],
      files: [],
      activityLog: [{ id: 'l3', date: new Date().toISOString(), user: 'المدير العام', action: 'تفعيل', details: 'ربط المشروع بأوامر الشراء الرسمية' }],
      status: 'in_progress',
      createdAt: '2024-02-01T09:00:00Z'
    }
  ]);
  
  // --- محاكاة بيانات المشاريع المحتملة (Pipeline) بأسماء خيالية ---
  const [pipeline, setPipeline] = useState<PotentialProject[]>([
    {
      id: 'POT-501',
      name: 'تطوير الأنظمة التقنية - قطاع العدل',
      entity: 'وزارة الخدمات العامة',
      proposalDate: '2024-05-15',
      documents: [],
      firstReviewerId: 'emp1',
      currentStage: 'review_decision',
      status: 'in_progress',
      activityLog: [{ id: '1', date: '2024-03-20T11:00:00Z', user: 'محمد علي', action: 'تقديم الطلب', details: 'تم استلام دعوة لتقديم عرض استشاري' }]
    },
    {
      id: 'POT-502',
      name: 'اندماج شركة السلام المالية',
      entity: 'شركة السلام للتأمين الشامل',
      proposalDate: '2024-04-01',
      documents: [],
      firstReviewerId: 'emp1',
      reviewerOpinion: 'accept',
      assigneeId: 'emp2',
      currentStage: 'assignee_decision',
      status: 'in_progress',
      activityLog: [
        { id: '1', date: '2024-03-15T08:00:00Z', user: 'أحمد علي', action: 'دراسة أولية', details: 'جارِ تحليل مخاطر الاندماج المحتمل' },
        { id: '2', date: '2024-03-18T10:00:00Z', user: 'ليلى محمد', action: 'قبول مراجعة', details: 'تم تحويل الملف للمختص قانونياً' }
      ]
    },
    {
      id: 'POT-503',
      name: 'مشروع الحوكمة والامتثال الداخلي',
      entity: 'شركة الطاقة المبدعة',
      proposalDate: '2024-03-30',
      documents: [],
      firstReviewerId: 'emp1',
      reviewerOpinion: 'accept',
      assigneeId: 'emp2',
      assigneeOpinion: 'accept',
      currentStage: 'draft_proposal',
      status: 'in_progress',
      activityLog: [
        { id: '1', date: '2024-03-10T09:00:00Z', user: 'ليلى محمد', action: 'توجيه', details: 'الموافقة على البدء في صياغة عرض فني متكامل' }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState<'active' | 'pipeline'>('active');
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [viewPipeline, setViewPipeline] = useState<PotentialProject | null>(null);
  const [showAddModal, setShowAddModal] = useState<'project' | 'pipeline' | null>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'stages' | 'files' | 'log'>('info');

  // --- حالات النموذج و logic المتابعة تبقى كما هي مع تغيير المسميات في العرض ---
  const [projName, setProjName] = useState('');
  const [projManager, setProjManager] = useState('');
  const [contractStatus, setContractStatus] = useState<ProjectContractStatus>('signed');
  const [contractNoInput, setContractNoInput] = useState('');
  const [clientName, setClientName] = useState('');
  const [valType, setValType] = useState<'fixed' | 'po'>('fixed');
  const [fixedVal, setFixedVal] = useState<number>(0);
  const [feeMech, setFeeMech] = useState<ProjectFeeMechanism>('stages');
  const [reportFreq, setReportFreq] = useState<ProjectReportFrequency>('none');
  const [hasStages, setHasStages] = useState(true);
  const [stageType, setStageType] = useState<'time' | 'task'>('task');
  const [contacts, setContacts] = useState<ProjectContact[]>([{ id: '1', name: '', phone: '', email: '', isMain: true }]);
  const [projNature, setProjNature] = useState('');

  const [potName, setPotName] = useState('');
  const [potEntity, setPotEntity] = useState('');
  const [potProposalDate, setPotProposalDate] = useState('');
  const [potReviewer, setPotReviewer] = useState('');

  const handleAddProject = () => {
    if (!projName || !projManager || !clientName) {
      alert('الرجاء تعبئة الحقول الإلزامية');
      return;
    }

    const newProj: Project = {
      id: `PRJ-${Date.now()}`,
      name: projName,
      managerId: projManager,
      contractStatus,
      contractNo: contractStatus === 'signed' ? contractNoInput : undefined,
      contractFollowUpStatus: contractStatus === 'not_signed' ? 'following_up' : 'none',
      clientName,
      value: valType === 'fixed' ? fixedVal : 'as_per_po',
      contacts,
      nature: projNature,
      reportFrequency: reportFreq,
      feeMechanism: feeMech,
      hasStages,
      stageType: hasStages ? stageType : undefined,
      stages: [],
      files: [],
      activityLog: [{ id: '1', date: new Date().toISOString(), user: 'المدير العام', action: 'إنشاء مشروع', details: 'تم فتح سجل مشروع جديد فعلي' }],
      status: 'in_progress',
      createdAt: new Date().toISOString()
    };

    setProjects([newProj, ...projects]);
    setShowAddModal(null);
    resetForm();
  };

  const handleAddPotential = () => {
    if (!potName || !potEntity || !potReviewer) {
      alert('الرجاء إكمال البيانات واختيار المراجع الأول');
      return;
    }

    const newPot: PotentialProject = {
      id: `POT-${Date.now()}`,
      name: potName,
      entity: potEntity,
      proposalDate: potProposalDate,
      documents: [],
      firstReviewerId: potReviewer,
      currentStage: 'review_decision',
      status: 'in_progress',
      activityLog: [{ id: '1', date: new Date().toISOString(), user: 'المدير العام', action: 'تقديم مشروع محتمل', details: `تم الإسناد للمراجع: ${MOCK_EMPLOYEES.find(e => e.id === potReviewer)?.name}` }]
    };

    setPipeline([newPot, ...pipeline]);
    setShowAddModal(null);
    resetPotForm();
  };

  const resetForm = () => {
    setProjName(''); setProjManager(''); setContractStatus('signed'); setContractNoInput('');
    setClientName(''); setValType('fixed'); setFixedVal(0); setHasStages(true);
    setContacts([{ id: '1', name: '', phone: '', email: '', isMain: true }]); setProjNature('');
  };

  const resetPotForm = () => {
    setPotName(''); setPotEntity(''); setPotProposalDate(''); setPotReviewer('');
  };

  const handleFollowUpUpdate = (projId: string, result: 'still' | 'done') => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        if (result === 'done') {
          const cNo = prompt('أدخل رقم العقد الجديد:');
          if (!cNo) return p;
          return { 
            ...p, 
            contractStatus: 'signed', 
            contractNo: cNo, 
            contractFollowUpStatus: 'done',
            activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'مدير المشروع', action: 'تحديث العقد', details: `تم توقيع العقد وإدخال الرقم: ${cNo}` }, ...p.activityLog]
          };
        } else {
          return { 
            ...p, 
            activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'مدير المشروع', action: 'متابعة دورية', details: 'تمت المتابعة - لا يزال قيد المراجعة لدى العميل' }, ...p.activityLog] 
          };
        }
      }
      return p;
    }));
  };

  const handleReviewerDecision = (potId: string, decision: 'accept' | 'reject') => {
    setPipeline(prev => prev.map(p => {
      if (p.id === potId) {
        if (decision === 'reject') {
          return { ...p, status: 'archived', reviewerOpinion: 'reject', currentStage: 'review_decision', activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'المراجع الأول', action: 'رفض المشروع', details: 'تم رفض الفرصة وأرشفة الملف.' }, ...p.activityLog] };
        }
        return { ...p, reviewerOpinion: 'accept', currentStage: 'assignee_decision', activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'المراجع الأول', action: 'قبول مبدئي', details: 'تم قبول المشروع وتحويله للمسؤول المختص.' }, ...p.activityLog] };
      }
      return p;
    }));
  };

  const handleAssigneeDecision = (potId: string, decision: 'accept' | 'reject', reason?: string) => {
    setPipeline(prev => prev.map(p => {
      if (p.id === potId) {
        if (decision === 'reject') {
          return { ...p, assigneeOpinion: 'reject', rejectionReason: reason, currentStage: 'review_decision', activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'المسؤول المختص', action: 'اعتذار عن التنفيذ', details: `اعتذار بسبب: ${reason}` }, ...p.activityLog] };
        }
        return { ...p, assigneeOpinion: 'accept', currentStage: 'draft_proposal', activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'المسؤول المختص', action: 'موافقة على التكليف', details: 'تم البدء في إعداد نطاق العمل والعرض.' }, ...p.activityLog] };
      }
      return p;
    }));
  };

  const handleEscalation = (potId: string) => {
    setPipeline(prev => prev.map(p => {
      if (p.id === potId) {
        return { 
          ...p, 
          isEscalated: true, 
          currentStage: 'draft_proposal', 
          activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'المراجع الأول', action: 'تصعيد إداري', details: 'تم تصعيد الفرصة لاتخاذ قرار استراتيجي بالمباشرة.' }, ...p.activityLog] 
        };
      }
      return p;
    }));
    alert('تم تصعيد الموضوع بنجاح.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FolderKanban className="text-indigo-600" /> إدارة المشاريع
          </h2>
          <p className="text-gray-500 text-sm mt-1">تتبع المشاريع الجارية وفرص التعاقد المستقبلية.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { resetPotForm(); setShowAddModal('pipeline'); }}
            className="bg-white border border-indigo-200 text-indigo-600 px-6 py-3 rounded-xl flex items-center transition-all text-sm font-bold shadow-sm hover:bg-indigo-50"
          >
            <UserPlus size={18} className="ml-2" /> فرصة محتملة
          </button>
          <button 
            onClick={() => { resetForm(); setShowAddModal('project'); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center transition-all text-sm font-bold shadow-lg shadow-indigo-100"
          >
            <Plus size={18} className="ml-2" /> مشروع قائم
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex">
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'active' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}
        >
          المشاريع الحالية ({projects.length})
        </button>
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'pipeline' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}
        >
          الفرص المحتملة ({pipeline.length})
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'active' ? (
          projects.map(p => (
            <div key={p.id} onClick={() => { setViewProject(p); setDetailTab('info'); }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all relative overflow-hidden group">
               <div className={`absolute top-0 right-0 w-1.5 h-full ${p.contractStatus === 'not_signed' ? 'bg-amber-400' : 'bg-indigo-500'}`}></div>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-50 text-gray-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                     <FolderKanban size={24} />
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.contractStatus === 'not_signed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                     {p.contractStatus === 'not_signed' ? 'بانتظار التوقيع' : `عقد رقم: ${p.contractNo}`}
                  </span>
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-1">{p.name}</h3>
               <p className="text-xs text-gray-400 font-medium mb-4">{p.clientName}</p>
               
               {p.contractStatus === 'not_signed' && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center gap-3">
                     <AlertTriangle size={18} className="text-amber-600" />
                     <div>
                        <p className="text-[10px] font-bold text-amber-800">تذكير أسبوعي نشط</p>
                        <p className="text-[9px] text-amber-600">يرجى استكمال توقيع العقد</p>
                     </div>
                  </div>
               )}
            </div>
          ))
        ) : (
          pipeline.map(p => (
            <div key={p.id} onClick={() => setViewPipeline(p)} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all group">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                     <Clock size={24} />
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.status === 'archived' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>
                     {p.status === 'archived' ? 'مرفوض/مؤرشف' : PIPELINE_STAGE_LABELS[p.currentStage]}
                  </span>
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-1">{p.name}</h3>
               <p className="text-xs text-gray-400 font-medium mb-4">{p.entity}</p>
               <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-1"><User size={12} /> {MOCK_EMPLOYEES.find(e => e.id === p.firstReviewerId)?.name}</div>
                  <div className="flex items-center gap-1"><Calendar size={12} /> {p.proposalDate}</div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* --- ADD ACTUAL PROJECT MODAL --- */}
      {showAddModal === 'project' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><PlusCircle className="text-indigo-600" /> تسجيل مشروع قائم</h2>
              <button onClick={() => setShowAddModal(null)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-8 text-right overflow-y-auto max-h-[75vh]" dir="rtl">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">اسم المشروع *</label>
                    <input value={projName} onChange={e => setProjName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">المسؤول عن المشروع *</label>
                    <select value={projManager} onChange={e => setProjManager(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold">
                       <option value="">اختر موظفاً...</option>
                       {MOCK_EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">حالة التعاقد *</label>
                    <div className="flex gap-2">
                       <select value={contractStatus} onChange={e => setContractStatus(e.target.value as any)} className="w-1/3 p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-bold">
                          <option value="signed">عقد موقّع</option>
                          <option value="not_signed">تحت التوقيع</option>
                       </select>
                       <input 
                         disabled={contractStatus === 'not_signed'} 
                         value={contractNoInput} 
                         onChange={e => setContractNoInput(e.target.value)}
                         className="w-2/3 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold font-mono" 
                         placeholder={contractStatus === 'not_signed' ? 'سيتم التذكير لاحقاً' : 'أدخل رقم العقد...'} 
                       />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">العميل *</label>
                    <input value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold" />
                  </div>
               </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
               <button onClick={() => setShowAddModal(null)} className="px-6 py-2 text-sm font-bold text-gray-500">إلغاء</button>
               <button onClick={handleAddProject} className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold">تأكيد الإضافة</button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer for Project Details and Active Activities */}
      {viewPipeline && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slide-in-right">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <div className="flex items-center gap-4 text-right">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Clock size={24} /></div>
                    <div>
                       <h2 className="text-lg font-bold text-gray-800">{viewPipeline.name}</h2>
                       <p className="text-xs text-gray-500">{viewPipeline.entity}</p>
                    </div>
                 </div>
                 <button onClick={() => setViewPipeline(null)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 text-right space-y-8" dir="rtl">
                 
                 {/* رأي المراجع الأول */}
                 {viewPipeline.currentStage === 'review_decision' && !viewPipeline.reviewerOpinion && (
                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-6">
                       <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2"><ShieldAlert size={18} /> رأي المراجع الإداري</h3>
                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => handleReviewerDecision(viewPipeline.id, 'reject')} className="py-3 bg-white text-rose-500 border border-rose-100 rounded-xl font-bold hover:bg-rose-50">صرف النظر</button>
                          <button onClick={() => handleReviewerDecision(viewPipeline.id, 'accept')} className="py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">الموافقة (تحويل للمختص)</button>
                       </div>
                    </div>
                 )}

                 {/* بقية الشجرة الإجرائية تظهر ديناميكياً بناءً على الحالات المعرفة أعلاه */}
                 {['draft_proposal', 'review_proposal', 'final_output', 'approval', 'submission', 'follow_up'].includes(viewPipeline.currentStage) && (
                    <div className="space-y-6">
                       <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">مسار تنفيذ العرض</h3>
                       <div className="space-y-4">
                          {Object.entries(PIPELINE_STAGE_LABELS).slice(2).map(([key, label], idx) => {
                             const stages = Object.keys(PIPELINE_STAGE_LABELS).slice(2);
                             const curIdx = stages.indexOf(viewPipeline.currentStage);
                             const isDone = idx < curIdx;
                             const isCur = key === viewPipeline.currentStage;
                             return (
                                <div key={key} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isCur ? 'border-indigo-600 bg-indigo-50/30' : isDone ? 'border-emerald-100 bg-emerald-50/50' : 'border-transparent bg-gray-50 opacity-40'}`}>
                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isCur ? 'bg-indigo-600 text-white' : isDone ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                      {isDone ? <CheckCircle size={16} /> : idx + 1}
                                   </div>
                                   <div className="flex-1">
                                      <p className="text-xs font-bold text-gray-800">{label}</p>
                                      {isCur && (
                                         <button 
                                           onClick={() => {
                                             const next = stages[idx + 1] as PipelineStage;
                                             if (next) setPipeline(pipeline.map(pi => pi.id === viewPipeline.id ? { ...pi, currentStage: next } : pi));
                                             else alert('تم إكمال جميع مراحل العرض بنجاح.');
                                           }}
                                           className="mt-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold"
                                         >اعتماد الإنجاز</button>
                                      )}
                                   </div>
                                </div>
                             );
                          })}
                       </div>
                    </div>
                 )}

                 <div className="space-y-4 pt-4 border-t border-gray-50">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2"><History size={18} /> سجل الإجراءات</h3>
                    <div className="relative border-r-2 border-gray-100 mr-2 pr-6 space-y-6">
                       {viewPipeline.activityLog.map((log: any) => (
                          <div key={log.id} className="relative">
                             <div className="absolute -right-[31px] top-0 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></div>
                             <p className="text-xs font-bold text-gray-800">{log.action}</p>
                             <p className="text-[10px] text-gray-500 mt-1">{log.details}</p>
                             <p className="text-[9px] text-gray-400 mt-1">{new Date(log.date).toLocaleString('ar-SA')}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Drawer for Actual Project Details */}
      {viewProject && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-4xl h-full shadow-2xl flex flex-col animate-slide-in-right">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <div className="flex items-center gap-4 text-right">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><FolderKanban size={24} /></div>
                    <div>
                       <h2 className="text-lg font-bold text-gray-800">{viewProject.name}</h2>
                       <p className="text-xs text-gray-500">{viewProject.clientName}</p>
                    </div>
                 </div>
                 <button onClick={() => setViewProject(null)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
              </div>

              <div className="flex border-b border-gray-100">
                 <button onClick={() => setDetailTab('info')} className={`flex-1 py-4 text-xs font-bold border-b-2 ${detailTab === 'info' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>البيانات والاتصال</button>
                 <button onClick={() => setDetailTab('stages')} className={`flex-1 py-4 text-xs font-bold border-b-2 ${detailTab === 'stages' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>المراحل والأتعاب</button>
                 <button onClick={() => setDetailTab('log')} className={`flex-1 py-4 text-xs font-bold border-b-2 ${detailTab === 'log' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>سجل النشاط</button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 text-right space-y-8" dir="rtl">
                 
                 {viewProject.contractStatus === 'not_signed' && (
                    <div className="p-6 bg-amber-50 rounded-3xl border-2 border-amber-200 space-y-4">
                       <div className="flex items-center gap-3">
                          <AlertTriangle className="text-amber-600" />
                          <h4 className="text-sm font-bold text-amber-900">تذكير بالمتابعة (عقد لم يوقع)</h4>
                       </div>
                       <p className="text-xs text-amber-700">يرجى التواصل مع العميل لاستكمال التوقيع وتحديث رقم العقد في النظام.</p>
                       <div className="flex gap-2">
                          <button onClick={() => handleFollowUpUpdate(viewProject.id, 'still')} className="flex-1 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg text-[10px] font-bold hover:bg-amber-100">تكرار المتابعة (لا يزال تحت المراجعة)</button>
                          <button onClick={() => handleFollowUpUpdate(viewProject.id, 'done')} className="flex-1 py-2 bg-amber-600 text-white rounded-lg text-[10px] font-bold hover:bg-amber-700">تم التوقيع (إدخال رقم العقد)</button>
                       </div>
                    </div>
                 )}

                 {detailTab === 'info' && (
                    <>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                             <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">آلية الأتعاب</p>
                             <p className="text-sm font-bold text-gray-800">{FEE_MECHANISM_LABELS[viewProject.feeMechanism]}</p>
                          </div>
                          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                             <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">القيمة</p>
                             <p className="text-sm font-bold text-emerald-600">{viewProject.value === 'as_per_po' ? 'أوامر شراء' : `${viewProject.value} ر.س`}</p>
                          </div>
                       </div>
                       <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">طبيعة المشروع</label>
                          <p className="mt-2 text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-2xl">{viewProject.nature}</p>
                       </div>
                    </>
                 )}

                 {detailTab === 'log' && (
                    <div className="space-y-4 relative border-r-2 border-gray-100 mr-2 pr-6">
                       {viewProject.activityLog.map((log: any) => (
                          <div key={log.id} className="relative">
                             <div className="absolute -right-[31px] top-0 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></div>
                             <p className="text-xs font-bold text-gray-800">{log.action}</p>
                             <p className="text-[10px] text-gray-500 mt-1">{log.details}</p>
                             <p className="text-[9px] text-gray-400 mt-1">{new Date(log.date).toLocaleString('ar-SA')}</p>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
