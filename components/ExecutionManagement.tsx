
// DO NOT add any new files, classes, or namespaces.
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Gavel, ChevronLeft, CheckCircle, X, UserPlus, 
  FileText, PlusCircle, AlertCircle, Trash2, DollarSign, History, 
  User, Activity, MoreVertical, CheckSquare, ShieldCheck, MapPin, 
  Archive, Info, FileDown, Eye, FileUp, Calendar, Trash, Globe, 
  Clock, AlertTriangle, Send, CreditCard, Landmark, ArrowRight
} from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_CLIENTS, MOCK_CONTRACTS } from '../constants';
import { 
  ExecutionRequest, ExecutionStatus, ExecutionType, 
  ExecutionDecision, ExecutionAction, ExecutionCollection,
  ActivityLog
} from '../types';

const STATUS_MAP: Record<ExecutionStatus, { label: string, color: string }> = {
  'draft': { label: 'مسودة', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  'registered': { label: 'مسجل', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'urgent_review': { label: 'مراجعة عاجلة', color: 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse' },
  'in_progress': { label: 'قيد التنفيذ', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  'suspended': { label: 'معلّق', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'pending_closure': { label: 'بانتظار الإغلاق', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'closed': { label: 'مغلق نهائياً', color: 'bg-gray-100 text-gray-400 border-gray-100' }
};

const ExecutionManagement = () => {
  const [executions, setExecutions] = useState<ExecutionRequest[]>([]);
  const [viewDetail, setViewDetail] = useState<ExecutionRequest | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'financial' | 'decisions' | 'actions' | 'log'>('info');
  const [searchTerm, setSearchTerm] = useState('');

  // --- ADD FORM STATE ---
  const [contractId, setContractId] = useState('');
  const [clientId, setClientId] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [hasAgency, setHasAgency] = useState(true);
  const [execType, setExecType] = useState<ExecutionType>('financial');
  const [claimAmount, setClaimAmount] = useState<number>(0);
  const [courtName, setCourtName] = useState('');
  const [circuitName, setCircuitName] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');

  // --- LOGIC: Automatic Urgent Review Check ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setExecutions(prev => prev.map(ex => {
        // FIX: ex.status is narrowed to 'registered' | 'in_progress' after this check
        if (ex.status !== 'registered' && ex.status !== 'in_progress') return ex;

        // Rule 1: Decision 34 within 3 days of submission
        const subDate = new Date(ex.submissionDate);
        const diffDays = (now.getTime() - subDate.getTime()) / (1000 * 3600 * 24);
        const hasDec34 = ex.decisions.some(d => d.type === '34');

        // FIX: ex.status cannot be 'urgent_review' here because of the narrowing above
        if (!hasDec34 && diffDays > 3) {
          return { ...ex, status: 'urgent_review' as ExecutionStatus };
        }

        // Rule 2: Decision 46 within 6 days of Decision 34 (financial only)
        if (ex.type === 'financial' && hasDec34) {
          const dec34 = ex.decisions.find(d => d.type === '34')!;
          const dec34Date = new Date(dec34.date);
          const diffDays46 = (now.getTime() - dec34Date.getTime()) / (1000 * 3600 * 24);
          const hasDec46 = ex.decisions.some(d => d.type === '46');
          // FIX: ex.status cannot be 'urgent_review' here because of the narrowing above
          if (!hasDec46 && diffDays46 > 6) {
            return { ...ex, status: 'urgent_review' as ExecutionStatus };
          }
        }
        return ex;
      }));
    }, 5000); // Check every 5s for demo
    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const handleAddDraft = () => {
    const client = MOCK_CLIENTS.find(c => c.id === clientId);
    if (!client) return alert('الرجاء اختيار العميل');

    const newEx: ExecutionRequest = {
      id: `EXEC-${Date.now()}`,
      contractId,
      clientId,
      clientName: client.name,
      contactNumber: client.phone,
      opponentName,
      hasAgency,
      executionDocUrl: 'placeholder.pdf',
      type: execType,
      claimAmount,
      collections: [],
      pendingAmounts: [],
      courtName,
      circuitName,
      submissionDate,
      auditStatus: 'complete',
      status: 'draft',
      decisions: [],
      actions: [],
      activityLog: [{ id: '1', date: new Date().toISOString(), user: 'المدير العام', action: 'إنشاء مسودة', details: 'تم بدء طلب تنفيذ جديد' }],
      createdAt: new Date().toISOString()
    };

    setExecutions([newEx, ...executions]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setContractId(''); setClientId(''); setOpponentName(''); setClaimAmount(0);
    setCourtName(''); setCircuitName(''); setSubmissionDate('');
  };

  const handleRegister = (id: string) => {
    setExecutions(prev => prev.map(ex => {
      if (ex.id === id) {
        return { 
          ...ex, 
          status: 'registered', 
          activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'الموظف', action: 'تسجيل رسمي', details: 'تم تسجيل الطلب وبدء المتابعة' }, ...ex.activityLog] 
        };
      }
      return ex;
    }));
    if (viewDetail?.id === id) setViewDetail(prev => prev ? ({ ...prev, status: 'registered' }) : null);
  };

  const handleAddDecision = (id: string, type: any, date: string) => {
    const dec: ExecutionDecision = { id: Date.now().toString(), type, date };
    setExecutions(prev => prev.map(ex => {
      if (ex.id === id) {
        let newStatus = ex.status;
        if (newStatus === 'urgent_review') newStatus = 'in_progress';
        return { 
          ...ex, 
          status: newStatus,
          decisions: [...ex.decisions, dec], 
          activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'الموظف', action: 'إضافة قرار', details: `تم تسجيل القرار رقم ${type}` }, ...ex.activityLog] 
        };
      }
      return ex;
    }));
    if (viewDetail?.id === id) {
      setViewDetail(prev => prev ? ({ 
        ...prev, 
        decisions: [...prev.decisions, dec],
        status: prev.status === 'urgent_review' ? 'in_progress' : prev.status 
      }) : null);
    }
  };

  const handleAddCollection = (id: string, amount: number, method: string) => {
    const coll: ExecutionCollection = { id: Date.now().toString(), amount, method, date: new Date().toISOString(), reference: 'RE-100' };
    setExecutions(prev => prev.map(ex => {
      if (ex.id === id) {
        const totalCollected = [...ex.collections, coll].reduce((sum, c) => sum + c.amount, 0);
        const isComplete = ex.claimAmount && totalCollected >= ex.claimAmount;
        return { 
          ...ex, 
          collections: [...ex.collections, coll],
          status: isComplete ? 'pending_closure' : ex.status,
          activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'المحاسب', action: 'تحصيل مالي', details: `تم تحصيل مبلغ ${amount} ر.س` }, ...ex.activityLog] 
        };
      }
      return ex;
    }));
    if (viewDetail?.id === id) {
       setViewDetail(prev => prev ? ({ ...prev, collections: [...prev.collections, coll] }) : null);
    }
  };

  const handleSuspend = (id: string, reason: string) => {
    setExecutions(prev => prev.map(ex => {
      if (ex.id === id) {
        return { 
          ...ex, 
          status: 'suspended', 
          suspensionReason: reason,
          activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'المدير العام', action: 'تعليق التنفيذ', details: `السبب: ${reason}` }, ...ex.activityLog] 
        };
      }
      return ex;
    }));
    if (viewDetail?.id === id) setViewDetail(prev => prev ? ({ ...prev, status: 'suspended', suspensionReason: reason }) : null);
  };

  const handleReactivate = (id: string) => {
    setExecutions(prev => prev.map(ex => {
      if (ex.id === id) {
        return { 
          ...ex, 
          status: 'in_progress', 
          activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'المدير العام', action: 'إعادة تفعيل', details: 'تم زوال سبب التعليق' }, ...ex.activityLog] 
        };
      }
      return ex;
    }));
    if (viewDetail?.id === id) setViewDetail(prev => prev ? ({ ...prev, status: 'in_progress' }) : null);
  };

  const handleFinalClose = (id: string) => {
    setExecutions(prev => prev.map(ex => {
      if (ex.id === id) {
        return { 
          ...ex, 
          status: 'closed', 
          activityLog: [{ id: Date.now().toString(), date: new Date().toISOString(), user: 'مدير التنفيذ', action: 'إغلاق نهائي', details: 'تم إكمال التنفيذ واعتماد الإغلاق' }, ...ex.activityLog] 
        };
      }
      return ex;
    }));
    if (viewDetail?.id === id) setViewDetail(prev => prev ? ({ ...prev, status: 'closed' }) : null);
  };

  const filteredExecutions = executions.filter(ex => 
    ex.clientName.includes(searchTerm) || ex.opponentName.includes(searchTerm) || ex.id.includes(searchTerm)
  );

  const calculateRemaining = (ex: ExecutionRequest) => {
    const collected = ex.collections.reduce((sum, c) => sum + c.amount, 0);
    return (ex.claimAmount || 0) - collected;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Gavel className="text-indigo-600" /> إدارة طلبات التنفيذ
          </h2>
          <p className="text-gray-500 text-sm mt-1">تتبع القرارات التنفيذية، المدد الزمنية، والتحصيل المالي.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center transition-all text-sm font-bold shadow-lg shadow-indigo-100"
        >
          <PlusCircle size={20} className="ml-2" /> إضافة طلب تنفيذ
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">بانتظار قرار (34)</p>
            <p className="text-2xl font-black text-blue-600">{executions.filter(e => !e.decisions.some(d => d.type === '34')).length}</p>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">مراجعة عاجلة</p>
            <p className="text-2xl font-black text-rose-600 animate-pulse">{executions.filter(e => e.status === 'urgent_review').length}</p>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">تحصيل مكتمل</p>
            <p className="text-2xl font-black text-emerald-600">{executions.filter(e => e.status === 'pending_closure').length}</p>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">إجمالي الطلبات</p>
            <p className="text-2xl font-black text-gray-800">{executions.length}</p>
         </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={20} className="absolute right-3.5 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="بحث (اسم العميل، الخصم، رقم الطلب)..." 
            className="w-full pl-4 pr-11 py-2.5 rounded-lg bg-white border-none text-gray-700 text-base focus:ring-0 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Executions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExecutions.map(ex => (
          <div 
            key={ex.id} 
            onClick={() => { setViewDetail(ex); setActiveTab('info'); }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
          >
             <div className={`absolute top-0 right-0 w-1.5 h-full ${STATUS_MAP[ex.status].color.split(' ')[1]}`}></div>
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 text-gray-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                   <Gavel size={24} />
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${STATUS_MAP[ex.status].color}`}>
                   {STATUS_MAP[ex.status].label}
                </span>
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-1">{ex.clientName}</h3>
             <p className="text-xs text-gray-400 font-medium mb-3">ضد: {ex.opponentName}</p>
             
             <div className="space-y-2 pt-3 border-t border-gray-50">
                <div className="flex justify-between items-center text-[11px] font-bold">
                   <span className="text-gray-400">نوع التنفيذ</span>
                   <span className="text-indigo-600">{ex.type === 'financial' ? 'تنفيذ مالي' : 'تنفيذ مباشر'}</span>
                </div>
                {ex.type === 'financial' && (
                  <div className="flex justify-between items-center text-[11px] font-bold">
                     <span className="text-gray-400">المبلغ المتبقي</span>
                     <span className="text-rose-500">{calculateRemaining(ex).toLocaleString()} ر.س</span>
                  </div>
                )}
             </div>

             {ex.status === 'urgent_review' && (
                <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-3">
                   <AlertTriangle className="text-rose-600" size={18} />
                   <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">تجاوز المهلة النظامية للقرار</p>
                </div>
             )}
          </div>
        ))}
        {executions.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400">
             <Landmark size={48} className="mx-auto mb-4 opacity-20" />
             <p className="font-bold">لا توجد طلبات تنفيذ مسجلة حالياً.</p>
             <button onClick={() => setShowAddModal(true)} className="mt-4 text-indigo-600 hover:underline">ابدأ بإضافة أول طلب</button>
          </div>
        )}
      </div>

      {/* --- ADD MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Gavel className="text-indigo-600" /> إضافة طلب تنفيذ جديد</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-8 text-right overflow-y-auto max-h-[75vh]" dir="rtl">
               
               {/* 1. References */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">رقم العقد (اختياري)</label>
                    <select value={contractId} onChange={e => setContractId(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                       <option value="">لا يوجد عقد</option>
                       <option value="company">خاص بالشركة</option>
                       {MOCK_CONTRACTS.map(c => <option key={c.id} value={c.id}>{c.contractNo} - {c.clientName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">العميل *</label>
                    <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                       <option value="">اختر العميل...</option>
                       {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">الخصم *</label>
                    <input value={opponentName} onChange={e => setOpponentName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                  </div>
               </div>

               {/* 2. Agency & Docs */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                    <label className="block text-xs font-bold text-gray-500 mb-3">هل توجد وكالة؟</label>
                    <div className="flex gap-4">
                       <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer"><input type="radio" checked={hasAgency} onChange={() => setHasAgency(true)} /> نعم</label>
                       <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer"><input type="radio" checked={!hasAgency} onChange={() => setHasAgency(false)} /> لا</label>
                    </div>
                  </div>
                  <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                    <div>
                       <h4 className="text-xs font-bold text-indigo-900">السند التنفيذي (PDF) *</h4>
                       <p className="text-[10px] text-indigo-400 mt-1">يجب رفع السند للمتابعة</p>
                    </div>
                    <button className="p-3 bg-indigo-600 text-white rounded-xl"><FileUp size={20} /></button>
                  </div>
               </div>

               {/* 3. Execution Details */}
               <div className="space-y-6 pt-4">
                  <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">بيانات التنفيذ التفصيلية</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">نوع التنفيذ</label>
                       <select value={execType} onChange={e => setExecType(e.target.value as any)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                          <option value="financial">تنفيذ مالي</option>
                          <option value="direct">تنفيذ مباشر</option>
                          <option value="personal">تنفيذ شخصي</option>
                       </select>
                    </div>
                    {execType === 'financial' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">مبلغ المطالبة (ر.س) *</label>
                        <input type="number" value={claimAmount} onChange={e => setClaimAmount(Number(e.target.value))} className="w-full p-3 bg-white border border-indigo-200 rounded-lg text-sm font-bold text-emerald-600" />
                      </div>
                    )}
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">تاريخ تقديم الطلب *</label>
                       <input type="date" value={submissionDate} onChange={e => setSubmissionDate(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">اسم المحكمة</label>
                       <input value={courtName} onChange={e => setCourtName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">الدائرة</label>
                       <input value={circuitName} onChange={e => setCircuitName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                    </div>
                  </div>
               </div>

            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
               <button onClick={() => setShowAddModal(false)} className="px-6 py-2 text-sm font-bold text-gray-500">إلغاء</button>
               <button onClick={handleAddDraft} className="px-10 py-3 bg-gray-900 text-white rounded-xl font-bold">حفظ كمسودة</button>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAIL DRAWER --- */}
      {viewDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-5xl h-full shadow-2xl flex flex-col animate-slide-in-right">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <div className="flex items-center gap-4 text-right">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Gavel size={24} /></div>
                    <div>
                       <h2 className="text-lg font-bold text-gray-800">{viewDetail.clientName}</h2>
                       <p className="text-xs text-gray-500">ضد: {viewDetail.opponentName}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    {viewDetail.status === 'draft' && (
                       <button onClick={() => handleRegister(viewDetail.id)} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100">
                          <CheckSquare size={18} /> تسجيل الطلب رسمياً
                       </button>
                    )}
                    {viewDetail.status === 'pending_closure' && (
                       <button onClick={() => handleFinalClose(viewDetail.id)} className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-100">
                          <ShieldCheck size={18} /> اعتماد الإغلاق النهائي
                       </button>
                    )}
                    <button onClick={() => setViewDetail(null)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
                 </div>
              </div>

              {/* Detail Tabs */}
              <div className="flex border-b border-gray-100 bg-white sticky top-0 z-10">
                 <button onClick={() => setActiveTab('info')} className={`flex-1 py-4 text-xs font-bold border-b-2 transition-all ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>بيانات الطلب</button>
                 <button onClick={() => setActiveTab('financial')} className={`flex-1 py-4 text-xs font-bold border-b-2 transition-all ${activeTab === 'financial' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>التحصيل المالي</button>
                 <button onClick={() => setActiveTab('decisions')} className={`flex-1 py-4 text-xs font-bold border-b-2 transition-all ${activeTab === 'decisions' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>القرارات (34/46)</button>
                 <button onClick={() => setActiveTab('actions')} className={`flex-1 py-4 text-xs font-bold border-b-2 transition-all ${activeTab === 'actions' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>طلبات الإجراء</button>
                 <button onClick={() => setActiveTab('log')} className={`flex-1 py-4 text-xs font-bold border-b-2 transition-all ${activeTab === 'log' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>سجل النشاط</button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 text-right space-y-8" dir="rtl">
                 
                 {/* 1. INFO TAB */}
                 {activeTab === 'info' && (
                    <div className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">الحالة الحالية</p>
                             <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${STATUS_MAP[viewDetail.status].color}`}>
                                {STATUS_MAP[viewDetail.status].label}
                             </span>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">المحكمة / الدائرة</p>
                             <p className="text-xs font-bold text-gray-800">{viewDetail.courtName} - {viewDetail.circuitName}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">تاريخ التقديم</p>
                             <p className="text-xs font-bold text-gray-800">{viewDetail.submissionDate}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">رقم التواصل</p>
                             <p className="text-xs font-bold text-indigo-600">{viewDetail.contactNumber}</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">المستندات الملحقة</h4>
                             <div className="grid grid-cols-1 gap-2">
                                <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <FileText className="text-indigo-600" />
                                      <span className="text-xs font-bold">السند التنفيذي الأساسي</span>
                                   </div>
                                   <button className="text-gray-400 hover:text-indigo-600"><FileDown size={18} /></button>
                                </div>
                                <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <Send className="text-emerald-600" />
                                      <span className="text-xs font-bold">شهادة الآيبان</span>
                                   </div>
                                   <button className="text-gray-400 hover:text-indigo-600"><FileDown size={18} /></button>
                                </div>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">خيارات التحكم</h4>
                             <div className="grid grid-cols-2 gap-3">
                                {viewDetail.status === 'suspended' ? (
                                   <button onClick={() => handleReactivate(viewDetail.id)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100">إلغاء التعليق وتفعيل</button>
                                ) : (
                                   <button onClick={() => handleSuspend(viewDetail.id, 'بناءً على طلب العميل')} className="p-3 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold border border-amber-100">تعليق التنفيذ مؤقتاً</button>
                                )}
                                <button className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">حذف المسودة</button>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* 2. FINANCIAL TAB */}
                 {activeTab === 'financial' && (
                    <div className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
                             <p className="text-[10px] font-bold opacity-80 uppercase mb-2">إجمالي مبلغ المطالبة</p>
                             <p className="text-3xl font-black">{viewDetail.claimAmount?.toLocaleString()} ر.س</p>
                          </div>
                          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                             <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">إجمالي المحصّل</p>
                             <p className="text-3xl font-black text-emerald-700">{viewDetail.collections.reduce((s,c) => s+c.amount, 0).toLocaleString()} ر.س</p>
                          </div>
                          <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                             <p className="text-[10px] font-bold text-rose-600 uppercase mb-2">المتبقي للتنفيذ</p>
                             <p className="text-3xl font-black text-rose-700">{calculateRemaining(viewDetail).toLocaleString()} ر.س</p>
                          </div>
                       </div>

                       <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                             <h4 className="text-sm font-bold text-gray-800">سجل التحصيل المالي</h4>
                             <button 
                               onClick={() => handleAddCollection(viewDetail.id, 5000, 'تحويل بنكي')}
                               className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-2"
                             >
                                <Plus size={16} /> إضافة تحصيل جديد
                             </button>
                          </div>
                          <table className="w-full text-right border-collapse">
                             <thead className="bg-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                                <tr>
                                   <th className="px-6 py-3">التاريخ</th>
                                   <th className="px-6 py-3">المبلغ</th>
                                   <th className="px-6 py-3">الطريقة</th>
                                   <th className="px-6 py-3">المرجع</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-50">
                                {viewDetail.collections.map(c => (
                                   <tr key={c.id} className="text-xs">
                                      <td className="px-6 py-4">{new Date(c.date).toLocaleDateString('ar-SA')}</td>
                                      <td className="px-6 py-4 font-bold text-emerald-600">{c.amount.toLocaleString()} ر.س</td>
                                      <td className="px-6 py-4">{c.method}</td>
                                      <td className="px-6 py-4 font-mono">{c.reference}</td>
                                   </tr>
                                ))}
                                {viewDetail.collections.length === 0 && (
                                   <tr>
                                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">لا توجد تحصيلات مسجلة بعد.</td>
                                   </tr>
                                )}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 )}

                 {/* 3. DECISIONS TAB */}
                 {activeTab === 'decisions' && (
                    <div className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Rule Tracker for 34/46 */}
                          <div className="p-6 bg-white border border-gray-200 rounded-3xl space-y-6">
                             <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                                <Clock className="text-indigo-600" size={18} /> تتبع المواعيد النظامية
                             </h4>
                             <div className="space-y-4">
                                <div className={`p-4 rounded-2xl border flex items-center justify-between ${viewDetail.decisions.some(d => d.type === '34') ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                                   <div>
                                      <p className="text-xs font-bold text-gray-800">قرار (34) - التبليغ</p>
                                      <p className="text-[10px] text-gray-400 mt-1">المهلة: 3 أيام من تاريخ التقديم</p>
                                   </div>
                                   {viewDetail.decisions.some(d => d.type === '34') ? <CheckCircle className="text-emerald-500" /> : <Clock className="text-gray-300" />}
                                </div>
                                <div className={`p-4 rounded-2xl border flex items-center justify-between ${viewDetail.decisions.some(d => d.type === '46') ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                                   <div>
                                      <p className="text-xs font-bold text-gray-800">قرار (46) - الإجراءات الزجرية</p>
                                      <p className="text-[10px] text-gray-400 mt-1">المهلة: 6 أيام بعد صدور قرار (34)</p>
                                   </div>
                                   {viewDetail.decisions.some(d => d.type === '46') ? <CheckCircle className="text-emerald-500" /> : <Clock className="text-gray-300" />}
                                </div>
                             </div>
                          </div>

                          {/* Record Decision Form */}
                          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-6">
                             <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2"><Send size={18} /> تسجيل قرار قضائي جديد</h4>
                             <div className="space-y-4">
                                <div>
                                   <label className="block text-[10px] font-bold text-indigo-400 mb-2 uppercase">نوع القرار</label>
                                   <select id="decType" className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-xs font-bold">
                                      <option value="34">قرار (34)</option>
                                      <option value="46">قرار (46)</option>
                                      <option value="other">قرار إجرائي آخر</option>
                                   </select>
                                </div>
                                <div>
                                   <label className="block text-[10px] font-bold text-indigo-400 mb-2 uppercase">تاريخ صدور القرار</label>
                                   <input type="date" id="decDate" className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-xs font-bold" />
                                </div>
                                <button 
                                  onClick={() => {
                                     const t = (document.getElementById('decType') as HTMLSelectElement).value;
                                     const d = (document.getElementById('decDate') as HTMLInputElement).value;
                                     if (d) handleAddDecision(viewDetail.id, t, d);
                                  }}
                                  className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100"
                                >تثبيت القرار في النظام</button>
                             </div>
                          </div>
                       </div>

                       {/* Decisions Timeline/List */}
                       <div className="space-y-4">
                          <h4 className="text-sm font-bold text-gray-900">سجل القرارات المودعة</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {viewDetail.decisions.map(d => (
                                <div key={d.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-all">
                                   <div className="flex items-center gap-4">
                                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Gavel size={18} /></div>
                                      <div>
                                         <p className="text-xs font-bold text-gray-800">قرار رقم {d.type}</p>
                                         <p className="text-[10px] text-gray-400 mt-1">تاريخ القرار: {d.date}</p>
                                      </div>
                                   </div>
                                   <button className="p-2 bg-gray-50 rounded text-gray-400 opacity-0 group-hover:opacity-100"><Eye size={16} /></button>
                                </div>
                             ))}
                             {viewDetail.decisions.length === 0 && <p className="col-span-full text-center py-8 text-gray-400 italic text-xs">لا توجد قرارات قضائية مسجلة.</p>}
                          </div>
                       </div>
                    </div>
                 )}

                 {/* 4. ACTIONS TAB */}
                 {activeTab === 'actions' && (
                    <div className="space-y-8">
                       <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2"><ArrowRight className="text-indigo-600" /> طلبات الإجراءات والطلبات الإلكترونية</h4>
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-2"><Plus size={16} /> إضافة طلب إجراء</button>
                       </div>
                       <div className="grid grid-cols-1 gap-4">
                          <div className="p-6 bg-gray-50 border border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center py-16">
                             <Activity className="text-gray-300 mb-4" size={48} />
                             <p className="text-sm font-bold text-gray-500">لا توجد إجراءات نشطة حالياً</p>
                             <p className="text-xs text-gray-400 mt-2">يمكنك إضافة حجز، مخاطبة، أو استعلام من الزر أعلاه.</p>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* 5. LOG TAB */}
                 {activeTab === 'log' && (
                    <div className="space-y-6 relative border-r-2 border-gray-100 mr-2 pr-6">
                       {viewDetail.activityLog.map(log => (
                          <div key={log.id} className="relative">
                             <div className="absolute -right-[31px] top-0 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white shadow-sm"></div>
                             <div>
                                <p className="text-xs font-bold text-gray-800">{log.action}</p>
                                <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                                <p className="text-[10px] text-gray-400 mt-2">{new Date(log.date).toLocaleString('ar-SA')} • بواسطة {log.user}</p>
                             </div>
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

export default ExecutionManagement;
