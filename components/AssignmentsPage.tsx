
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Info, ChevronLeft, ChevronRight, CheckCircle, 
  XCircle, Clock, Users, Building2, UserPlus, FileText, Send, 
  ArrowRightLeft, Briefcase, FileSignature, MessageSquare, Paperclip, PlusCircle, AlertCircle, Trash
} from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_CLIENTS, MOCK_CONTRACTS, MOCK_POTENTIAL_ASSIGNMENTS, MOCK_OPEN_ASSIGNMENTS, MOCK_CASES } from '../constants';
import { 
  PotentialClientAssignment, OpenDeptAssignment, Department, 
  AssignmentStatus, PotentialClientStage, DEPARTMENTS, Employee
} from '../types';

const STAGE_LABELS: Record<PotentialClientStage, string> = {
  1: 'فهم الموضوع',
  2: 'الدراسة الأولية',
  3: 'تجهيز العرض',
  4: 'إرسال العرض',
  5: 'المتابعة',
  6: 'توقيع'
};

const STATUS_MAP: Record<AssignmentStatus, { label: string, color: string }> = {
  'pending': { label: 'قيد الإسناد', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'in_progress': { label: 'قيد التنفيذ', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  'waiting_info': { label: 'بانتظار نواقص', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  'completed_signed': { label: 'منتهي - تم التوقيع', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'completed_rejected': { label: 'منتهي - مرفوض', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  'completed_expired': { label: 'منتهي بمضي المدة', color: 'bg-gray-100 text-gray-500 border-gray-200' },
  'completed_done': { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'completed_incomplete': { label: 'غير مكتمل', color: 'bg-rose-50 text-rose-600 border-rose-100' }
};

const AssignmentsPage = () => {
  const [activeTab, setActiveTab] = useState<'potential' | 'open'>('potential');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState<'potential' | 'open' | null>(null);
  const [viewDetail, setViewDetail] = useState<any | null>(null);
  const [newNote, setNewNote] = useState('');

  // Simulation State
  const [potentialList, setPotentialList] = useState<PotentialClientAssignment[]>(MOCK_POTENTIAL_ASSIGNMENTS);
  const [openList, setOpenList] = useState<OpenDeptAssignment[]>(MOCK_OPEN_ASSIGNMENTS);

  // --- Handlers ---
  const handleNextStage = (id: string) => {
    setPotentialList(prev => prev.map(p => {
      if (p.id === id && p.currentStage < 6) {
        return { ...p, currentStage: (p.currentStage + 1) as PotentialClientStage };
      }
      return p;
    }));
    if (viewDetail && viewDetail.id === id) {
      setViewDetail(prev => ({ ...prev, currentStage: prev.currentStage + 1 }));
    }
  };

  const handleClosePotential = (id: string, result: 'signed' | 'rejected' | 'expired', reason?: string, contractId?: string) => {
    const statusMap = {
      signed: 'completed_signed',
      rejected: 'completed_rejected',
      expired: 'completed_expired'
    } as const;

    setPotentialList(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: statusMap[result], rejectionReason: reason, contractId };
      }
      return p;
    }));
    setViewDetail(null);
  };

  const handleCloseOpen = (id: string, result: 'done' | 'incomplete', reason?: string) => {
    const statusMap = {
      done: 'completed_done',
      incomplete: 'completed_incomplete'
    } as const;

    setOpenList(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, status: statusMap[result], incompleteReason: reason };
      }
      return o;
    }));
    setViewDetail(null);
  };

  const handleAssignEmployee = (id: string, type: 'potential' | 'open', empId: string) => {
    if (type === 'potential') {
      setPotentialList(prev => prev.map(p => p.id === id ? { ...p, assignedEmployeeId: empId, status: 'in_progress' } : p));
    } else {
      setOpenList(prev => prev.map(o => o.id === id ? { ...o, assignedEmployeeId: empId, status: 'in_progress' } : o));
    }
    if (viewDetail && viewDetail.id === id) {
      setViewDetail(prev => ({ ...prev, assignedEmployeeId: empId, status: 'in_progress' }));
    }
  };

  const handleRequestMissingInfo = (id: string, desc: string) => {
    setOpenList(prev => prev.map(o => o.id === id ? { ...o, status: 'waiting_info', missingInfoDesc: desc } : o));
    if (viewDetail && viewDetail.id === id) {
      setViewDetail(prev => ({ ...prev, status: 'waiting_info', missingInfoDesc: desc }));
    }
  };

  const filteredPotential = potentialList.filter(p => p.clientName.includes(searchTerm) || p.subject.includes(searchTerm));
  const filteredOpen = openList.filter(o => o.subject.includes(searchTerm));

  // --- Components ---
  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 font-bold border-b-2 transition-all ${
        activeTab === id ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <TabButton id="potential" label="إسناد عميل محتمل" icon={UserPlus} />
          <TabButton id="open" label="إسناد مفتوح إلى إدارة" icon={ArrowRightLeft} />
        </div>
        
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={`بحث سريع...`} 
                className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <button 
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold transition-all text-sm shadow-md shadow-indigo-100" 
              onClick={() => setShowAddModal(activeTab)}
            >
              <Plus size={18} />
              إنشاء إسناد جديد
           </button>
        </div>
      </div>

      {/* Tables Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {activeTab === 'potential' ? (
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">الإدارة</th>
                <th className="px-6 py-4">الموضوع</th>
                <th className="px-6 py-4">المرحلة الحالية</th>
                <th className="px-6 py-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPotential.map(p => (
                <tr key={p.id} onClick={() => setViewDetail({ ...p, type: 'potential' })} className="hover:bg-indigo-50/20 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                     <div className="font-bold text-gray-800">{p.clientName}</div>
                     <div className="text-[10px] text-gray-400 font-mono">{p.clientPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">{DEPARTMENTS[p.assignedDept]}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{p.subject}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">مرحلة {p.currentStage}: {STAGE_LABELS[p.currentStage]}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${STATUS_MAP[p.status].color}`}>
                      {STATUS_MAP[p.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">الإدارة</th>
                <th className="px-6 py-4">الموضوع</th>
                <th className="px-6 py-4">نوع المهمة</th>
                <th className="px-6 py-4">الإجراء القادم</th>
                <th className="px-6 py-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOpen.map(o => (
                <tr key={o.id} onClick={() => setViewDetail({ ...o, type: 'open' })} className="hover:bg-indigo-50/20 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                     <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">{DEPARTMENTS[o.assignedDept]}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-bold max-w-[200px] truncate">{o.subject}</td>
                  <td className="px-6 py-4">
                     <span className="text-xs text-gray-500">{o.taskType === 'review' ? 'مراجعة' : o.taskType === 'study' ? 'دراسة' : 'أخرى'}</span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-xs font-bold text-gray-700">{o.nextStep}</div>
                     <div className="text-[10px] text-gray-400">{o.nextStepDate}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${STATUS_MAP[o.status].color}`}>
                      {STATUS_MAP[o.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- ADD POTENTIAL MODAL --- */}
      {showAddModal === 'potential' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <UserPlus className="text-indigo-600" /> إسناد عميل محتمل جديد
                 </h2>
                 <button onClick={() => setShowAddModal(null)} className="p-2 hover:bg-white rounded-full"><XCircle size={20} className="text-gray-400" /></button>
              </div>
              <div className="p-8 space-y-6 text-right" dir="rtl">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">الإدارة المسند لها *</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          <option value="">اختر الإدارة...</option>
                          {Object.entries(DEPARTMENTS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">الموظف المقترح (اختياري)</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          <option value="">اختر الموظف...</option>
                          {MOCK_EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                       </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">اسم العميل *</label>
                       <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="اسم العميل الرباعي..." />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">رقم التواصل *</label>
                       <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="05xxxxxxxx" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">موضوع الطلب باختصار *</label>
                    <textarea rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="وصف موجز..."></textarea>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">الإجراء القادم</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                       <option value="initial_study">تواصل أولي ودراسة</option>
                       <option value="prepare_proposal">إعداد عرض</option>
                       <option value="follow_up">متابعة بعد العرض</option>
                    </select>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                 <button onClick={() => setShowAddModal(null)} className="px-6 py-2 text-sm font-bold text-gray-500">إلغاء</button>
                 <button className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100" onClick={() => setShowAddModal(null)}>إنشاء الإسناد</button>
              </div>
           </div>
        </div>
      )}

      {/* --- ADD OPEN MODAL --- */}
      {showAddModal === 'open' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ArrowRightLeft className="text-indigo-600" /> إسناد مفتوح جديد إلى إدارة
                 </h2>
                 <button onClick={() => setShowAddModal(null)} className="p-2 hover:bg-white rounded-full"><XCircle size={20} className="text-gray-400" /></button>
              </div>
              <div className="p-8 space-y-6 text-right overflow-y-auto" dir="rtl">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">المرجع (العقد)</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          <option value="none">لا يوجد عقد</option>
                          <option value="company">خاص بالشركة</option>
                          {MOCK_CONTRACTS.map(c => <option key={c.id} value={c.id}>{c.contractNo}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">العميل</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          <option value="company">خاص بالشركة</option>
                          {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">الإدارة المسند لها *</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          {Object.entries(DEPARTMENTS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">نوع المهمة</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                          <option value="review">مراجعة</option>
                          <option value="study">دراسة</option>
                          <option value="other">أخرى</option>
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">موضوع المهمة باختصار *</label>
                    <textarea rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"></textarea>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">الإجراء القادم</label>
                       <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" placeholder="مثلاً: دراسة الملف..." />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">تاريخ الإجراء القادم</label>
                       <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                 <button onClick={() => setShowAddModal(null)} className="px-6 py-2 text-sm font-bold text-gray-500">إلغاء</button>
                 <button className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100" onClick={() => setShowAddModal(null)}>إنشاء الإسناد</button>
              </div>
           </div>
        </div>
      )}

      {/* --- DETAIL VIEW DRAWER --- */}
      {viewDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slide-in-right">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                       {viewDetail.type === 'potential' ? <UserPlus size={20} /> : <ArrowRightLeft size={20} />}
                    </div>
                    <div>
                       <h2 className="text-lg font-bold text-gray-800">تفاصيل الإسناد</h2>
                       <p className="text-xs text-gray-500">تم الإنشاء في {new Date(viewDetail.createdAt).toLocaleDateString('ar-SA')}</p>
                    </div>
                 </div>
                 <button onClick={() => setViewDetail(null)} className="p-2 hover:bg-white rounded-full"><XCircle size={20} className="text-gray-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 text-right" dir="rtl">
                 {/* Status & Stages Bar for Potential */}
                 {viewDetail.type === 'potential' && (
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">التقدم في المراحل</label>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${STATUS_MAP[viewDetail.status as AssignmentStatus].color}`}>
                             {STATUS_MAP[viewDetail.status as AssignmentStatus].label}
                          </span>
                       </div>
                       <div className="flex gap-1">
                          {[1,2,3,4,5,6].map((st) => (
                             <div key={st} className={`h-1.5 flex-1 rounded-full ${st <= viewDetail.currentStage ? 'bg-indigo-600' : 'bg-gray-200'}`} title={STAGE_LABELS[st as PotentialClientStage]}></div>
                          ))}
                       </div>
                       <p className="text-xs font-bold text-center text-indigo-600">المرحلة الحالية: {STAGE_LABELS[viewDetail.currentStage as PotentialClientStage]}</p>
                    </div>
                 )}

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase">اسم العميل</label>
                       <p className="font-bold text-gray-800">{viewDetail.clientName || 'خاص بالشركة'}</p>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-gray-400 uppercase">الإدارة المعنية</label>
                       <p className="font-bold text-gray-800">{DEPARTMENTS[viewDetail.assignedDept as Department]}</p>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">الموضوع</label>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">{viewDetail.subject}</p>
                 </div>

                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase flex items-center gap-2">
                       <Users size={14} /> التكليف والموظف المسؤول
                    </h4>
                    {viewDetail.assignedEmployeeId ? (
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                             {MOCK_EMPLOYEES.find(e => e.id === viewDetail.assignedEmployeeId)?.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-800">{MOCK_EMPLOYEES.find(e => e.id === viewDetail.assignedEmployeeId)?.name}</p>
                             <p className="text-[10px] text-gray-400">بدأ العمل في {new Date().toLocaleDateString('ar-SA')}</p>
                          </div>
                       </div>
                    ) : (
                       <div className="space-y-3">
                          <p className="text-xs text-rose-500 font-bold flex items-center gap-1">
                             <AlertCircle size={14} /> لم يتم تعيين موظف بعد
                          </p>
                          <div className="flex gap-2">
                             <select className="flex-1 p-2 bg-white border border-gray-200 rounded text-xs" onChange={(e) => handleAssignEmployee(viewDetail.id, viewDetail.type, e.target.value)}>
                                <option value="">تعيين موظف...</option>
                                {MOCK_EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                             </select>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Activity log summary */}
                 <div className="space-y-4 pt-4">
                    <h4 className="text-xs font-bold text-gray-400 border-b border-gray-100 pb-2">سجل النشاط</h4>
                    <div className="space-y-4">
                       <div className="flex gap-3 text-xs border-r border-gray-200 pr-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0"></div>
                          <div>
                             <p className="text-gray-700">تم إنشاء الإسناد بنجاح</p>
                             <span className="text-gray-400 mt-1 block">{new Date(viewDetail.createdAt).toLocaleString('ar-SA')}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Action Buttons Footer */}
              {!viewDetail.status.startsWith('completed') && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                   {viewDetail.type === 'potential' && (
                      <div className="flex gap-2">
                         {viewDetail.currentStage < 6 ? (
                            <button 
                              onClick={() => handleNextStage(viewDetail.id)}
                              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                            >
                               انتقال للمرحلة القادمة <ChevronLeft size={18} />
                            </button>
                         ) : (
                            <button 
                               onClick={() => handleClosePotential(viewDetail.id, 'signed', undefined, 'CNT-2024-XXX')}
                               className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                            >
                               إتمام (تم التوقيع) <CheckCircle size={18} />
                            </button>
                         )}
                         <button 
                            onClick={() => handleClosePotential(viewDetail.id, 'rejected', 'عدم الاتفاق على السعر')}
                            className="px-4 py-3 bg-white border border-rose-200 text-rose-500 rounded-xl font-bold hover:bg-rose-50 transition-all"
                         >
                            رفض
                         </button>
                      </div>
                   )}

                   {viewDetail.type === 'open' && (
                      <div className="space-y-3">
                         <div className="flex gap-2">
                            <button 
                               onClick={() => handleCloseOpen(viewDetail.id, 'done')}
                               className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                            >
                               إغلاق (مكتمل) <CheckCircle size={18} />
                            </button>
                            <button 
                               onClick={() => handleRequestMissingInfo(viewDetail.id, 'بانتظار صورة الهوية')}
                               className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all"
                            >
                               طلب نواقص
                            </button>
                         </div>
                         <button 
                            onClick={() => handleCloseOpen(viewDetail.id, 'incomplete', 'ضيق الوقت')}
                            className="w-full py-3 bg-white border border-rose-200 text-rose-500 rounded-xl font-bold hover:bg-rose-50 transition-all"
                         >
                            إغلاق (غير مكتمل)
                         </button>
                      </div>
                   )}
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
