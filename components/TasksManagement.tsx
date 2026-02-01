
import React, { useState, useMemo } from 'react';
import { 
  ListTodo, Plus, Search, Filter, Clock, CheckCircle, 
  AlertCircle, XCircle, ChevronLeft, User, Briefcase, 
  Gavel, FolderKanban, Landmark, FileSignature, ArrowRightLeft,
  MoreVertical, Send, CheckSquare, ShieldCheck, Calendar,
  MessageSquare, Trash2, Edit, Activity
} from 'lucide-react';
import { MOCK_EMPLOYEES } from '../constants';
import { Task, TaskStatus, TaskOrigin, DEPARTMENTS } from '../types';

const STATUS_MAP: Record<TaskStatus, { label: string, color: string, icon: any }> = {
  'new': { label: 'جديدة', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Plus },
  'in_progress': { label: 'قيد التنفيذ', color: 'bg-[#9C824A]/10 text-[#9C824A] border-[#9C824A]/20', icon: Clock },
  'waiting_info': { label: 'بانتظار نواقص', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: AlertCircle },
  'waiting_approval': { label: 'بانتظار اعتماد', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: ShieldCheck },
  'closed': { label: 'مغلقة', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle }
};

const ORIGIN_MAP: Record<TaskOrigin, { label: string, icon: any, color: string }> = {
  'assignments': { label: 'الإسناد', icon: ArrowRightLeft, color: 'text-gray-600' },
  'cases': { label: 'القضايا', icon: Briefcase, color: 'text-[#9C824A]' },
  'execution': { label: 'التنفيذ', icon: Gavel, color: 'text-[#1a1a1a]' },
  'projects': { label: 'المشاريع', icon: FolderKanban, color: 'text-[#9C824A]' },
  'liquidation': { label: 'الحراسة', icon: Landmark, color: 'text-gray-500' },
  'contracts': { label: 'العقود', icon: FileSignature, color: 'text-[#1a1a1a]' }
};

const TasksManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'TASK-101',
      name: 'دراسة ملف العميل الاستراتيجي',
      origin: 'assignments',
      referenceId: 'A-505',
      referenceLabel: 'إسناد رقم A-505',
      referenceType: 'assignment',
      executorId: 'emp2',
      load: 15,
      status: 'in_progress',
      requiresApproval: true,
      createdAt: '2024-03-20T10:00:00Z',
      updates: [{ id: '1', date: '2024-03-20T11:00:00Z', text: 'بدأت الدراسة الأولية للملف تحت إشراف المستشار القانوني', user: 'أحمد علي' }],
      createdBy: 'ليلى محمد'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewDetail, setViewDetail] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');

  const [taskName, setTaskName] = useState('');
  const [taskOrigin, setTaskOrigin] = useState<TaskOrigin>('cases');
  const [refLabel, setRefLabel] = useState('');
  const [executor, setExecutor] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [taskLoad, setTaskLoad] = useState<number>(0);
  const [reqApproval, setReqApproval] = useState(false);

  const [updateText, setUpdateText] = useState('');
  const [taskResult, setTaskResult] = useState('');

  const handleAddTask = () => {
    if (!taskName || taskLoad <= 0 || !executor) {
      alert('الرجاء إدخال اسم المهمة، العبء، وتعيين منفذ.');
      return;
    }

    const newTask: Task = {
      id: `TASK-${Date.now()}`,
      name: taskName,
      origin: taskOrigin,
      referenceId: 'REF-ID',
      referenceLabel: refLabel || 'مرجع داخلي',
      referenceType: 'case',
      executorId: executor,
      reviewerId: reviewer || undefined,
      load: taskLoad,
      status: 'new',
      requiresApproval: reqApproval,
      updates: [],
      createdAt: new Date().toISOString(),
      createdBy: 'المدير العام'
    };

    setTasks([newTask, ...tasks]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTaskName(''); setTaskOrigin('cases'); setRefLabel(''); setExecutor(''); 
    setReviewer(''); setTaskLoad(0); setReqApproval(false);
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    if (viewDetail?.id === taskId) setViewDetail(prev => prev ? ({ ...prev, status: newStatus }) : null);
  };

  const handleAddUpdate = (taskId: string) => {
    if (!updateText) return;
    const update = { id: Date.now().toString(), date: new Date().toISOString(), text: updateText, user: 'المستشار المختص' };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, updates: [update, ...t.updates] } : t));
    if (viewDetail?.id === taskId) setViewDetail(prev => prev ? ({ ...prev, updates: [update, ...prev.updates] }) : null);
    setUpdateText('');
  };

  const handleCloseTask = (taskId: string) => {
    if (!taskResult) {
      alert('يجب كتابة نتيجة الإجراء القانونية قبل إغلاق المهمة.');
      return;
    }

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (t.requiresApproval) {
          return { ...t, status: 'waiting_approval', result: taskResult };
        }
        return { ...t, status: 'closed', result: taskResult, closedAt: new Date().toISOString() };
      }
      return t;
    }));
    
    if (viewDetail?.id === taskId) {
      setViewDetail(prev => prev ? ({ 
        ...prev, 
        status: prev.requiresApproval ? 'waiting_approval' : 'closed', 
        result: taskResult,
        closedAt: prev.requiresApproval ? undefined : new Date().toISOString()
      }) : null);
    }
  };

  const handleApprove = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'closed', closedAt: new Date().toISOString() } : t));
    if (viewDetail?.id === taskId) setViewDetail(prev => prev ? ({ ...prev, status: 'closed', closedAt: new Date().toISOString() }) : null);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.name.includes(searchTerm) || t.referenceLabel.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesOrigin = originFilter === 'all' || t.origin === originFilter;
    return matchesSearch && matchesStatus && matchesOrigin;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ListTodo className="text-[#9C824A]" /> إدارة المهام والعمليات التشغيلية
          </h2>
          <p className="text-[#9C824A] text-[10px] font-bold uppercase tracking-widest mt-1">Alkhorayef Operational Center</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#9C824A] hover:bg-[#8A6D3B] text-white px-6 py-3 rounded-lg flex items-center transition-all text-sm font-bold shadow-lg shadow-[#9C824A]/20"
        >
          <Plus size={20} className="ml-2" /> إسناد مهمة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(STATUS_MAP).map(([key, value]) => {
          const StatusIcon = value.icon;
          return (
            <div key={key} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
               <div className="flex justify-between items-center mb-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{value.label}</p>
                  <StatusIcon size={14} className={value.color.split(' ')[1]} />
               </div>
               <p className="text-2xl font-bold text-gray-800">{tasks.filter(t => t.status === key).length}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
           <Search size={18} className="absolute right-3.5 top-2.5 text-gray-400" />
           <input 
             type="text" 
             placeholder="البحث السريع في قاعدة بيانات المهام..." 
             className="w-full pl-4 pr-11 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm transition-all focus:ring-1 focus:ring-[#9C824A]"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2">
           <select 
             value={statusFilter} 
             onChange={(e) => setStatusFilter(e.target.value)}
             className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-xs font-bold text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#9C824A]"
           >
              <option value="all">كافة الحالات</option>
              {Object.entries(STATUS_MAP).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
           </select>
           <select 
             value={originFilter} 
             onChange={(e) => setOriginFilter(e.target.value)}
             className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-xs font-bold text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#9C824A]"
           >
              <option value="all">كافة الإدارات</option>
              {Object.entries(ORIGIN_MAP).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-[2px]">
            <tr>
              <th className="px-6 py-4">تفاصيل المهمة</th>
              <th className="px-6 py-4">المرجع الرسمي</th>
              <th className="px-6 py-4 text-center">المسؤول</th>
              <th className="px-6 py-4 text-center">العبء</th>
              <th className="px-6 py-4 text-center">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTasks.map(task => {
              const OriginIcon = ORIGIN_MAP[task.origin].icon;
              return (
                <tr 
                  key={task.id} 
                  onClick={() => setViewDetail(task)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-5">
                     <p className="font-bold text-gray-800 text-sm group-hover:text-[#9C824A] transition-colors">{task.name}</p>
                     <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono tracking-wider">{task.id}</p>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${ORIGIN_MAP[task.origin].color} bg-gray-50`}><OriginIcon size={14} /></span>
                        <span className="text-xs font-semibold text-gray-600 uppercase">{task.referenceLabel}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                     <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded bg-[#9C824A]/10 flex items-center justify-center text-[10px] font-bold text-[#9C824A] border border-[#9C824A]/20">
                           {MOCK_EMPLOYEES.find(e => e.id === task.executorId)?.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{MOCK_EMPLOYEES.find(e => e.id === task.executorId)?.name}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                     <span className="bg-[#1a1a1a] text-[#9C824A] px-3 py-1 rounded text-xs font-black">{task.load}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                     <span className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all ${STATUS_MAP[task.status].color}`}>
                        {STATUS_MAP[task.status].label}
                     </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredTasks.length === 0 && (
          <div className="py-24 text-center text-gray-300">
             <ListTodo size={64} className="mx-auto mb-4 opacity-5" />
             <p className="text-sm font-bold uppercase tracking-widest">No Operational Records Found</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fcfcfc]">
                 <div className="flex flex-col">
                   <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider"><Plus size={20} className="text-[#9C824A]" /> إسناد مهمة استشارية</h2>
                   <span className="text-[9px] text-[#9C824A] font-bold tracking-[3px] mt-1 uppercase">Alkhorayef Assignment</span>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><XCircle size={20} className="text-gray-400" /></button>
              </div>
              <div className="p-8 space-y-6 text-right" dir="rtl">
                 <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">مسمى الإجراء (إلزامي) *</label>
                    <input 
                      value={taskName} onChange={e => setTaskName(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold focus:ring-1 focus:ring-[#9C824A] outline-none" 
                      placeholder="مثلاً: صياغة المذكرة الجوابية الاستراتيجية..." 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">القسم المختص *</label>
                       <select value={taskOrigin} onChange={e => setTaskOrigin(e.target.value as any)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold focus:ring-1 focus:ring-[#9C824A] outline-none">
                          {Object.entries(ORIGIN_MAP).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">المرجع المرتبط</label>
                       <input value={refLabel} onChange={e => setRefLabel(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:ring-1 focus:ring-[#9C824A] outline-none" placeholder="رقم الملف / القضية..." />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">المستشار المنفذ *</label>
                       <select value={executor} onChange={e => setExecutor(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold focus:ring-1 focus:ring-[#9C824A] outline-none">
                          <option value="">اختيار المستشار...</option>
                          {MOCK_EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">المراجع المعتمد</label>
                       <select value={reviewer} onChange={e => setReviewer(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:ring-1 focus:ring-[#9C824A] outline-none">
                          <option value="">لا يوجد مراجع</option>
                          {MOCK_EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                       </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[11px] font-bold text-[#9C824A] mb-2 uppercase tracking-wider">عبء المهمة (الوزن التشغيلي) *</label>
                       <input 
                         type="number" 
                         value={taskLoad} onChange={e => setTaskLoad(Number(e.target.value))}
                         className="w-full p-3 bg-white border-2 border-[#9C824A]/20 rounded-lg text-sm font-black text-[#9C824A] focus:border-[#9C824A] outline-none transition-all" 
                         placeholder="الوزن من 1 - 100..." 
                       />
                    </div>
                    <div className="flex items-center gap-4 pt-8 pr-4">
                       <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer group">
                          <input type="checkbox" checked={reqApproval} onChange={e => setReqApproval(e.target.checked)} className="w-4 h-4 text-[#9C824A] accent-[#9C824A]" />
                          <span className="group-hover:text-[#9C824A] transition-colors">تتطلب اعتماد إداري نهائي</span>
                       </label>
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-[#fcfcfc] flex justify-end gap-3">
                 <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-800">إلغاء الأمر</button>
                 <button onClick={handleAddTask} className="px-10 py-2.5 bg-[#9C824A] text-white rounded-lg font-bold shadow-xl shadow-[#9C824A]/30 transition-all hover:bg-[#8A6D3B] uppercase text-xs tracking-widest">اعتماد الإسناد</button>
              </div>
           </div>
        </div>
      )}

      {viewDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#1a1a1a]/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden border-r border-gray-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fcfcfc]">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#9C824A]/10 text-[#9C824A] rounded-lg border border-[#9C824A]/20 shadow-inner"><ListTodo size={24} /></div>
                    <div>
                       <h2 className="text-lg font-bold text-gray-900 leading-tight">{viewDetail.name}</h2>
                       <p className="text-[10px] text-[#9C824A] font-bold uppercase tracking-[2px] mt-1">{viewDetail.id} • {viewDetail.referenceLabel}</p>
                    </div>
                 </div>
                 <button onClick={() => setViewDetail(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><XCircle size={20} className="text-gray-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 text-right space-y-8" dir="rtl">
                 <div className="flex justify-between items-center p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                    <div className="space-y-1 text-right">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">مستوى الإنجاز</p>
                       <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold border ${STATUS_MAP[viewDetail.status].color}`}>
                          {STATUS_MAP[viewDetail.status].label}
                       </span>
                    </div>
                    <div className="space-y-1 text-left">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">الوزن التشغيلي</p>
                       <p className="text-3xl font-black text-[#9C824A]">{viewDetail.load}</p>
                    </div>
                 </div>

                 {viewDetail.status !== 'closed' && (
                    <div className="space-y-6">
                       <div className="bg-[#9C824A]/5 p-6 rounded-xl border border-[#9C824A]/10 space-y-4 shadow-inner">
                          <h4 className="text-xs font-bold text-[#9C824A] flex items-center gap-2 uppercase tracking-widest"><Send size={16} /> تدوين المستجدات الاستراتيجية</h4>
                          <textarea 
                             value={updateText} onChange={e => setUpdateText(e.target.value)}
                             rows={3} className="w-full p-4 bg-white border border-[#9C824A]/20 rounded-lg text-sm transition-all focus:ring-1 focus:ring-[#9C824A] outline-none shadow-sm" 
                             placeholder="دوّن هنا تفاصيل العمل المنجز بدقة..."
                          />
                          <button onClick={() => handleAddUpdate(viewDetail.id)} className="px-8 py-2 bg-[#9C824A] text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-[#8A6D3B] transition-all">تحديث السجل</button>
                       </div>

                       <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-2 uppercase tracking-widest"><CheckSquare size={16} /> الإغلاق النهائي للمهمة</h4>
                          <textarea 
                             value={taskResult} onChange={e => setTaskResult(e.target.value)}
                             rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-gray-300 outline-none shadow-sm" 
                             placeholder="اكتب الخلاصة القانونية / النتيجة النهائية للإغلاق..."
                          />
                          <div className="flex gap-2">
                             <button onClick={() => handleCloseTask(viewDetail.id)} className="flex-1 py-3 bg-[#1a1a1a] text-white rounded text-[10px] font-bold uppercase tracking-[2px] shadow-lg hover:bg-black transition-all">
                                {viewDetail.requiresApproval ? 'رفع للاعتماد الإداري' : 'إغلاق الملف نهائياً'}
                             </button>
                             <button onClick={() => handleUpdateStatus(viewDetail.id, 'waiting_info')} className="px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-rose-50 transition-all">طلب نواقص</button>
                          </div>
                       </div>
                    </div>
                 )}

                 {viewDetail.result && (
                    <div className="p-6 bg-emerald-50/50 rounded-xl border border-emerald-100 shadow-sm">
                       <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">النتيجة القانونية المعتمدة</h4>
                       <p className="text-sm text-gray-800 leading-relaxed font-semibold">{viewDetail.result}</p>
                       {viewDetail.closedAt && <p className="text-[9px] text-emerald-500 mt-4 italic font-medium uppercase">Closed On: {new Date(viewDetail.closedAt).toLocaleString('ar-SA')}</p>}
                    </div>
                 )}

                 <div className="space-y-4 pt-4">
                    <h4 className="text-xs font-bold text-gray-400 border-b border-gray-100 pb-3 flex items-center gap-2 uppercase tracking-widest"><Activity size={18} className="text-[#9C824A]" /> أرشيف التحديثات</h4>
                    <div className="space-y-4 relative border-r border-gray-100 pr-6 mr-1">
                       {viewDetail.updates.map(u => (
                          <div key={u.id} className="relative">
                             <div className="absolute -right-[27px] top-1 w-2 h-2 rounded-full bg-[#9C824A] border-2 border-white shadow-sm"></div>
                             <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition-all hover:border-[#9C824A]/30">
                                <p className="text-xs text-gray-700 leading-relaxed">{u.text}</p>
                                <div className="flex justify-between mt-3 pt-3 border-t border-gray-50">
                                   <span className="text-[10px] font-bold text-[#9C824A] uppercase">{u.user}</span>
                                   <span className="text-[9px] text-gray-400 font-medium">{new Date(u.date).toLocaleString('ar-SA')}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                       {viewDetail.updates.length === 0 && <p className="text-xs text-gray-300 italic tracking-wider uppercase">No historical logs available</p>}
                    </div>
                 </div>
              </div>

              {viewDetail.status === 'waiting_approval' && (
                 <div className="p-6 border-t border-gray-100 bg-amber-50 flex gap-3">
                    <button onClick={() => handleApprove(viewDetail.id)} className="flex-1 py-4 bg-[#9C824A] text-white rounded font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#9C824A]/20 transition-all hover:bg-[#8A6D3B] uppercase text-[11px] tracking-[2px]">
                       <ShieldCheck size={20} /> اعتماد الإجراء وإغلاق الملف
                    </button>
                    <button onClick={() => handleUpdateStatus(viewDetail.id, 'in_progress')} className="px-6 py-4 bg-white border border-amber-200 text-amber-700 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-amber-100 transition-all">رفض الاعتماد</button>
                 </div>
              )}
           </div>
        </div>
      )}

    </div>
  );
};

export default TasksManagement;