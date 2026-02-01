
// DO NOT add any new files, classes, or namespaces.
import React, { useState, useMemo } from 'react';
import { 
  FileSignature, ClipboardList, Briefcase, Plus, Search, Filter, Download, 
  Printer, Archive, Edit, CheckCircle, FileText, UserPlus, CreditCard, 
  AlertCircle, X, Save, Send, Trash2, ShieldCheck, Clock, ChevronLeft, Info,
  Building2, Hash, Gavel, FileCheck, Landmark, DollarSign, MessageSquare, Paperclip, PlusCircle, Users, MapPin, Calendar, FileDown, Trash
} from 'lucide-react';
import { MOCK_CONTRACTS, MOCK_CLIENTS, MOCK_EMPLOYEES, MOCK_DOC_OPS, MOCK_LEGAL_SERVICES } from '../constants';
import { 
  Contract, DocumentationOperation, LegalServiceRequest, 
  OpStatus, ActivityLog, Client, Department, Note, FileEntry, DEPARTMENTS, PaymentMilestone
} from '../types';

const OperationsPage = () => {
  const [activeTab, setActiveTab] = useState<'contracts' | 'doc-ops' | 'legal-services'>('contracts');
  const [showAddModal, setShowAddModal] = useState<string | null>(null);
  const [viewDetail, setViewDetail] = useState<any | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'notes' | 'documents'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState('');

  // --- CONTRACT FORM STATE ---
  const [opponents, setOpponents] = useState<string[]>(['']);
  const [selectedDepts, setSelectedDepts] = useState<Department[]>([]);
  const [milestones, setMilestones] = useState<PaymentMilestone[]>([]);

  // --- DOC FORM STATE ---
  const [docMainType, setDocMainType] = useState<'real_estate' | 'agency'>('real_estate');
  const [selectedNotary, setSelectedNotary] = useState<string>('');

  // --- LEGAL SERVICE FORM STATE ---
  const [billingConfirm, setBillingConfirm] = useState(false);

  // Simulation of Internal State
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [docOps, setDocOps] = useState<DocumentationOperation[]>(MOCK_DOC_OPS);
  const [legalServices, setLegalServices] = useState<LegalServiceRequest[]>(MOCK_LEGAL_SERVICES);

  const currentUser = MOCK_EMPLOYEES[0];

  // --- Handlers ---
  const addOpponent = () => setOpponents([...opponents, '']);
  const updateOpponent = (idx: number, val: string) => {
    const newOps = [...opponents];
    newOps[idx] = val;
    setOpponents(newOps);
  };
  const removeOpponent = (idx: number) => setOpponents(opponents.filter((_, i) => i !== idx));

  const toggleDept = (dept: Department) => {
    setSelectedDepts(prev => prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]);
  };

  const addMilestone = () => {
    setMilestones([...milestones, {
      id: Math.random().toString(36).substr(2, 9),
      type: 'date',
      description: '',
      amountType: 'fixed',
      value: 0
    }]);
  };

  const handleRegister = (id: string, type: string) => {
    if (type === 'contracts') setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'registered' } : c));
    else if (type === 'doc-ops') setDocOps(prev => prev.map(d => d.id === id ? { ...d, status: 'registered' } : d));
    else setLegalServices(prev => prev.map(l => l.id === id ? { ...l, status: 'registered' } : l));
    if (viewDetail) setViewDetail(prev => ({ ...prev, status: 'registered' }));
  };

  const handleRequestBilling = (entity: any, type: string) => {
    if (confirm('تأكيد: هل أنت متأكد من إرسال طلب الفوترة للمالية؟')) {
      if (type === 'contract') setContracts(prev => prev.map(c => c.id === entity.id ? {...c, billingRequested: true} : c));
      if (type === 'documentation') setDocOps(prev => prev.map(d => d.id === entity.id ? {...d, billingRequested: true} : d));
      if (type === 'legal_service') setLegalServices(prev => prev.map(l => l.id === entity.id ? {...l, billingRequested: true} : l));
      if (viewDetail) setViewDetail(prev => ({ ...prev, billingRequested: true }));
    }
  };

  const filteredContracts = contracts.filter(c => c.clientName.includes(searchTerm) || c.contractNo.includes(searchTerm));
  const filteredDocOps = docOps.filter(d => d.newDocNo.includes(searchTerm) || d.notaryName.includes(searchTerm));
  const filteredLegal = legalServices.filter(l => l.clientName.includes(searchTerm) || l.serviceType.includes(searchTerm));

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

  const DetailTabBtn = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setDetailTab(id)}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all border-b-2 ${
        detailTab === id ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <TabButton id="contracts" label="العقود" icon={FileSignature} />
          <TabButton id="doc-ops" label="عمليات التوثيق" icon={ClipboardList} />
          <TabButton id="legal-services" label="الخدمات القانونية" icon={Briefcase} />
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
              onClick={() => {
                setShowAddModal(activeTab);
                setOpponents(['']);
                setMilestones([]);
                setSelectedDepts([]);
              }}
            >
              <Plus size={18} />
              إضافة جديد
           </button>
        </div>
      </div>

      {/* Tables Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {activeTab === 'contracts' && (
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">رقم العقد</th>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">الموضوع</th>
                <th className="px-6 py-4 text-center">الحالة</th>
                <th className="px-6 py-4 text-center">الفوترة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredContracts.map(cnt => (
                <tr key={cnt.id} onClick={() => { setViewDetail({ ...cnt, type: 'contracts' }); setDetailTab('overview'); }} className="hover:bg-indigo-50/20 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600">{cnt.contractNo}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{cnt.clientName}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm truncate max-w-[200px]">{cnt.subject}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${cnt.status === 'registered' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cnt.status === 'registered' ? 'نشط' : 'مسودة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {cnt.billingRequested ? <ShieldCheck size={16} className="text-emerald-500 mx-auto" /> : <Clock size={16} className="text-gray-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Similar tables for doc-ops and legal-services */}
        {activeTab === 'doc-ops' && (
           <table className="w-full text-right">
             <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase">
                <tr>
                   <th className="px-6 py-4">رقم المستند</th>
                   <th className="px-6 py-4">النوع</th>
                   <th className="px-6 py-4">العميل</th>
                   <th className="px-6 py-4 text-center">المبلغ</th>
                   <th className="px-6 py-4 text-center">الحالة</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {filteredDocOps.map(op => (
                   <tr key={op.id} onClick={() => { setViewDetail({ ...op, type: 'doc-ops' }); setDetailTab('overview'); }} className="hover:bg-indigo-50/20 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-mono font-bold text-indigo-600">{op.newDocNo}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-500">{op.subType}</td>
                      {/* FIX: DocumentationOperation uses ownerName, not clientName */}
                      <td className="px-6 py-4 font-bold text-gray-800">{op.ownerName || 'غير محدد'}</td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600">{op.amount} ر.س</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${op.status === 'registered' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {op.status === 'registered' ? 'مسجل' : 'مسودة'}
                        </span>
                      </td>
                   </tr>
                ))}
             </tbody>
           </table>
        )}
        {activeTab === 'legal-services' && (
           <table className="w-full text-right text-sm">
             <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                <tr>
                   <th className="px-6 py-4">الخدمة</th>
                   <th className="px-6 py-4">العميل</th>
                   <th className="px-6 py-4 text-center">الإجمالي</th>
                   <th className="px-6 py-4 text-center">الفوترة</th>
                   <th className="px-6 py-4 text-center">الحالة</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {filteredLegal.map(ls => (
                   <tr key={ls.id} onClick={() => { setViewDetail({ ...ls, type: 'legal-services' }); setDetailTab('overview'); }} className="hover:bg-indigo-50/20 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-bold text-gray-800">{ls.serviceType}</td>
                      <td className="px-6 py-4">{ls.clientName}</td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600">{ls.total} ر.س</td>
                      <td className="px-6 py-4 text-center">
                         {ls.billingRequested ? <ShieldCheck size={16} className="text-emerald-500 mx-auto" /> : <Clock size={16} className="text-gray-300 mx-auto" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${ls.status === 'registered' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {ls.status === 'registered' ? 'نشطة' : 'مسودة'}
                        </span>
                      </td>
                   </tr>
                ))}
             </tbody>
           </table>
        )}
      </div>

      {/* --- ADD CONTRACT MODAL --- */}
      {showAddModal === 'contracts' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                 <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FileSignature className="text-indigo-600" /> تسجيل عقد جديد
                 </h2>
                 <button onClick={() => setShowAddModal(null)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-8 text-right" dir="rtl">
                 
                 {/* 1. Basic Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">رقم العقد *</label>
                       <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" placeholder="2024/000" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">اسم العميل *</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                          <option>اختر العميل...</option>
                          {MOCK_CLIENTS.map(c => <option key={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">رقم التواصل</label>
                       <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" placeholder="05xxxxxxxx" />
                    </div>
                 </div>

                 {/* 2. Opponents */}
                 <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase">الخصوم (اختياري)</label>
                    <div className="space-y-2">
                       {opponents.map((op, idx) => (
                          <div key={idx} className="flex gap-2">
                             <input 
                                type="text" 
                                value={op}
                                onChange={(e) => updateOpponent(idx, e.target.value)}
                                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" 
                                placeholder="اسم الخصم..." 
                             />
                             <button onClick={() => removeOpponent(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash size={18} /></button>
                          </div>
                       ))}
                       <button onClick={addOpponent} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                          <PlusCircle size={14} /> إضافة خصم آخر
                       </button>
                    </div>
                 </div>

                 {/* 3. Departments */}
                 <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase">الإدارات المعنية بالعمل</label>
                    <div className="flex flex-wrap gap-2">
                       {Object.entries(DEPARTMENTS).map(([key, label]) => (
                          <button 
                             key={key}
                             onClick={() => toggleDept(key as Department)}
                             className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                selectedDepts.includes(key as Department) 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300'
                             }`}
                          >
                             {label}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* 4. Subject */}
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">موضوع التعاقد باختصار *</label>
                    <textarea rows={2} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="وصف موجز لنطاق العمل..."></textarea>
                 </div>

                 {/* 5. Fees Section */}
                 <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-6">
                    <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2 border-b border-indigo-100 pb-3"><DollarSign size={18} /> الأتعاب والبيانات المالية</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-xs font-bold text-indigo-400 mb-2">دفعة مقدمة</label>
                          <div className="flex gap-2 h-10">
                             <label className="flex items-center gap-2 text-sm text-gray-700"><input type="radio" name="dp" defaultChecked /> يوجد</label>
                             <label className="flex items-center gap-2 text-sm text-gray-700"><input type="radio" name="dp" /> لا يوجد</label>
                             <input type="number" className="ml-2 flex-1 p-2 bg-white border border-indigo-200 rounded-lg text-sm font-bold" placeholder="المبلغ..." />
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-indigo-400 mb-2">إجمالي الأتعاب</label>
                          <div className="flex gap-2">
                             <input type="number" className="flex-1 p-2 bg-white border border-indigo-200 rounded-lg text-sm font-bold" placeholder="المبلغ..." />
                             <select className="p-2 bg-white border border-indigo-200 rounded-lg text-xs font-bold">
                                <option>مبلغ مقطوع</option>
                                <option>نسبة %</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="block text-xs font-bold text-indigo-400 uppercase">جدولة الدفعات (المستقبلية)</label>
                       <div className="space-y-3">
                          {milestones.map((ms, idx) => (
                             <div key={ms.id} className="p-4 bg-white rounded-xl border border-indigo-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="col-span-1 md:col-span-1">
                                   <label className="text-[10px] text-gray-400 font-bold block mb-1">نوع الدفعة</label>
                                   <select className="w-full p-2 border border-gray-100 rounded text-xs bg-gray-50">
                                      <option>بتاريخ معين</option>
                                      <option>مرتبطة بإنجاز</option>
                                   </select>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                   <label className="text-[10px] text-gray-400 font-bold block mb-1">الوصف / الإنجاز</label>
                                   <input type="text" className="w-full p-2 border border-gray-100 rounded text-xs" placeholder="مثال: صدور الحكم القطعي" />
                                </div>
                                <div className="col-span-1">
                                   <label className="text-[10px] text-gray-400 font-bold block mb-1">المبلغ / النسبة</label>
                                   <input type="number" className="w-full p-2 border border-gray-100 rounded text-xs" placeholder="0" />
                                </div>
                             </div>
                          ))}
                          <button onClick={addMilestone} className="w-full py-2 border-2 border-dashed border-indigo-200 rounded-xl text-xs font-bold text-indigo-400 hover:bg-indigo-100/50 transition-all flex items-center justify-center gap-2">
                             <PlusCircle size={14} /> إضافة دفعة استحقاق جديدة
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
                 <button onClick={() => setShowAddModal(null)} className="px-6 py-2 text-sm font-bold text-gray-500">إلغاء</button>
                 <button className="px-8 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100">حفظ كمسودة</button>
              </div>
           </div>
        </div>
      )}

      {/* --- ADD DOCUMENTATION MODAL --- */}
      {showAddModal === 'doc-ops' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                 <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <ClipboardList className="text-amber-500" /> تسجيل عملية توثيق
                 </h2>
                 <button onClick={() => setShowAddModal(null)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-8 text-right" dir="rtl">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Notary Info */}
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">اسم الموثق *</label>
                       <select 
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold"
                          onChange={(e) => setSelectedNotary(e.target.value)}
                       >
                          <option value="">اختر الموثق...</option>
                          {MOCK_EMPLOYEES.filter(e => e.department === 'documentation').map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                          <option value="new">+ إضافة موثق جديد</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">رقم الترخيص</label>
                       <input 
                          type="text" 
                          readOnly
                          value={MOCK_EMPLOYEES.find(e => e.id === selectedNotary)?.licenseNo || ''}
                          className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-400" 
                          placeholder="تلقائي..." 
                       />
                    </div>

                    {/* Operation Logic */}
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">نوع العملية الأساسي *</label>
                       <select 
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold"
                          onChange={(e) => setDocMainType(e.target.value as any)}
                       >
                          <option value="real_estate">عقار</option>
                          <option value="agency">وكالة</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">النوع الفرعي *</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                          {docMainType === 'real_estate' ? (
                             <>
                                <option>إفراغ</option>
                                <option>رهن</option>
                                <option>إفراغ ورهن</option>
                                <option>تصحيح رهن</option>
                                <option>فك رهن</option>
                             </>
                          ) : (
                             <>
                                <option>وكالة فرد</option>
                                <option>وكالة شركة</option>
                             </>
                          )}
                       </select>
                    </div>
                 </div>

                 {/* Real Estate Specifics */}
                 {docMainType === 'real_estate' && (
                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                       <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-amber-600 mb-2">مدينة العقار *</label>
                          <input type="text" className="w-full p-2 border border-amber-200 rounded-lg text-sm" placeholder="الرياض، جدة..." />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-amber-600 mb-2">اسم المالك *</label>
                          <input type="text" className="w-full p-2 border border-amber-200 rounded-lg text-sm" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-amber-600 mb-2">هوية المالك *</label>
                          <input type="text" className="w-full p-2 border border-amber-200 rounded-lg text-sm" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2">رقم الصك القديم</label>
                          <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm font-mono" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2">رقم الصك الجديد</label>
                          <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold font-mono" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2">تاريخ الصك</label>
                          <input type="date" className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                       </div>
                    </div>
                 )}

                 {/* Agency Specifics */}
                 {docMainType === 'agency' && (
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2">رقم الوكالة *</label>
                          <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold font-mono" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2">تاريخ الوكالة</label>
                          <input type="date" className="w-full p-2 border border-gray-200 rounded-lg text-sm" />
                       </div>
                    </div>
                 )}

                 {/* Shared documentation fields */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">اسم العميل</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                          {MOCK_CLIENTS.map(c => <option key={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">مبلغ العملية *</label>
                       <input type="number" className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm font-bold text-emerald-700" placeholder="0.00 ر.س" />
                    </div>
                 </div>

                 {/* Document Upload */}
                 <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-amber-300 transition-colors cursor-pointer group">
                    <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-amber-500 group-hover:bg-amber-50 transition-all">
                       <FileDown size={24} />
                    </div>
                    <p className="mt-4 text-sm font-bold text-gray-500">إرفاق صورة الصك / الوكالة</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
                 </div>

              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
                 <button onClick={() => setShowAddModal(null)} className="px-6 py-2 text-sm font-bold text-gray-500">إلغاء</button>
                 <button className="px-8 py-2 bg-amber-500 text-white rounded-lg font-bold">تسجيل العملية</button>
              </div>
           </div>
        </div>
      )}

      {/* --- ADD LEGAL-SERVICE MODAL --- */}
      {showAddModal === 'legal-services' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Briefcase className="text-indigo-600" /> إضافة خدمة قانونية
                 </h2>
                 <button onClick={() => setShowAddModal(null)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-8 text-right" dir="rtl">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">نوع الخدمة *</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                          <option>تقديم طلب تنفيذ</option>
                          <option>تقديم دعوى</option>
                          <option>تقديم استئناف</option>
                          <option>استشارة هاتفية</option>
                          <option>استشارة مكتوبة</option>
                          <option>خدمات قانونية أخرى</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">العميل *</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                          {MOCK_CLIENTS.map(c => <option key={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">طريقة الدفع *</label>
                       <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                          <option>تحويل بنكي</option>
                          <option>نقداً</option>
                          <option>شيك</option>
                          <option>مدى / فيزا</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-2">المبلغ (غير شامل الضريبة) *</label>
                       <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" placeholder="0.00 ر.س" />
                    </div>
                 </div>

                 {/* PDF Upload */}
                 <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase">مستند تقديم الخدمة (اختياري)</label>
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl p-6 bg-gray-50/50 hover:bg-indigo-50 transition-colors group cursor-pointer">
                       <Paperclip className="text-gray-400 group-hover:text-indigo-600 ml-2" />
                       <span className="text-xs font-bold text-gray-400 group-hover:text-indigo-600">ارفق ملف الخدمة (PDF)</span>
                    </div>
                 </div>

                 {/* Billing Request Toggle */}
                 <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-lg ${billingConfirm ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                          <Send size={18} />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-gray-800">طلب فوترة للمالية</h4>
                          <p className="text-[10px] text-gray-400">إرسال إشعار مباشر للمحاسبة لإصدار فاتورة</p>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                       <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={billingConfirm}
                          onChange={(e) => {
                             if (e.target.checked) {
                                if (confirm('متأكد من طلب الفوترة؟ سيتم إشعار المالية فور الحفظ.')) {
                                   setBillingConfirm(true);
                                }
                             } else {
                                setBillingConfirm(false);
                             }
                          }}
                        />
                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                 </div>

              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                 <button onClick={() => setShowAddModal(null)} className="px-6 py-2 text-sm font-bold text-gray-500">إلغاء</button>
                 <button className="px-10 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-100">تسجيل الخدمة</button>
              </div>
           </div>
        </div>
      )}

      {/* --- DETAIL VIEW MODAL (DRAWER) --- */}
      {viewDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slide-in-right">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                       {viewDetail.type === 'contracts' ? <FileSignature size={20} /> : viewDetail.type === 'doc-ops' ? <ClipboardList size={20} /> : <Briefcase size={20} />}
                    </div>
                    <div>
                       <h2 className="text-lg font-bold text-gray-800">تفاصيل السجل</h2>
                       <p className="text-xs text-gray-500">تم الإنشاء في {new Date(viewDetail.createdAt).toLocaleDateString('ar-SA')}</p>
                    </div>
                 </div>
                 <button onClick={() => setViewDetail(null)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
              </div>

              {/* Internal Detail Tabs */}
              <div className="flex border-b border-gray-100 bg-white sticky top-0">
                 <DetailTabBtn id="overview" label="نظرة عامة" icon={Info} />
                 <DetailTabBtn id="notes" label="الملاحظات" icon={MessageSquare} />
                 <DetailTabBtn id="documents" label="المستندات" icon={Paperclip} />
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 text-right" dir="rtl">
                 
                 {detailTab === 'overview' && (
                   <>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-gray-400 uppercase">المعرف الرئيسي</label>
                           <p className="font-mono font-bold text-indigo-600">{viewDetail.contractNo || viewDetail.newDocNo || viewDetail.id}</p>
                        </div>
                        <div className="space-y-1 text-left">
                           <label className="text-[10px] font-bold text-gray-400 uppercase">الحالة التشغيلية</label>
                           <div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${viewDetail.status === 'registered' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                 {viewDetail.status === 'registered' ? 'نشط / مسجل' : 'مسودة غير مفعلة'}
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">بيانات العميل والأطراف</h4>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                              <Building2 size={18} className="text-gray-400" />
                              <div>
                                 <p className="text-[10px] text-gray-400 font-bold">اسم العميل</p>
                                 {/* FIX: DocumentationOperation uses ownerName, others use clientName */}
                                 <p className="text-sm font-bold">{viewDetail.clientName || (viewDetail as any).ownerName || 'غير محدد'}</p>
                              </div>
                           </div>
                           <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                              <Landmark size={18} className="text-gray-400" />
                              <div>
                                 <p className="text-[10px] text-gray-400 font-bold">الموضوع / الخدمة</p>
                                 <p className="text-sm font-bold truncate">{viewDetail.subject || viewDetail.serviceType || viewDetail.subType}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {viewDetail.opponents && viewDetail.opponents.length > 0 && (
                        <div className="space-y-4">
                           <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">الخصوم</h4>
                           <div className="flex flex-wrap gap-2">
                              {viewDetail.opponents.map((op: string, idx: number) => (
                                 <span key={idx} className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-bold border border-rose-100 flex items-center gap-1">
                                    <Users size={12} /> {op}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}

                     <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">البيانات المالية</h4>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                              <p className="text-[10px] text-emerald-600 font-bold mb-1">المبلغ الأساسي</p>
                              <p className="text-lg font-bold text-emerald-700">{viewDetail.paymentValue || viewDetail.amount} ر.س</p>
                           </div>
                           {viewDetail.vat !== undefined && (
                             <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                               <p className="text-[10px] text-blue-600 font-bold mb-1">الضريبة (15%)</p>
                               <p className="text-lg font-bold text-blue-700">{viewDetail.vat} ر.س</p>
                             </div>
                           )}
                           {viewDetail.total && (
                             <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-center">
                               <p className="text-[10px] text-indigo-600 font-bold mb-1">الإجمالي الكلي</p>
                               <p className="text-lg font-bold text-indigo-700">{viewDetail.total} ر.س</p>
                             </div>
                           )}
                        </div>
                     </div>
                   </>
                 )}

                 {detailTab === 'notes' && (
                   <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                         <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase">إضافة ملاحظة جديدة</h4>
                         <div className="flex gap-2">
                            <textarea 
                              className="flex-1 p-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="اكتب ملاحظة..."
                              rows={2}
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                            ></textarea>
                            <button className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors self-end h-10"><Send size={18} /></button>
                         </div>
                      </div>
                      <div className="space-y-4">
                         {viewDetail.notes && viewDetail.notes.map((note: Note) => (
                           <div key={note.id} className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                 <span className="text-xs font-bold text-indigo-600">{note.user}</span>
                                 <span className="text-[10px] text-gray-400">{new Date(note.date).toLocaleString('ar-SA')}</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {detailTab === 'documents' && (
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <h4 className="text-sm font-bold text-gray-900">المستندات المرفوعة</h4>
                         <button className="flex items-center gap-1 text-xs font-bold text-indigo-600"><PlusCircle size={16} /> رفع جديد</button>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                         {viewDetail.files && viewDetail.files.map((file: FileEntry, idx: number) => (
                           <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-white rounded-lg border border-gray-100 text-indigo-600"><FileText size={20} /></div>
                                 <div>
                                    <p className="text-sm font-bold text-gray-800">{file.name}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{file.date} • {file.type}</p>
                                 </div>
                              </div>
                              <button className="p-2 text-gray-400 hover:text-indigo-600"><Download size={18} /></button>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                 {viewDetail.status === 'draft' && (
                   <button 
                     onClick={() => handleRegister(viewDetail.id, viewDetail.type)}
                     className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                   >
                     <CheckCircle size={18} /> تسجيل وتفعيل
                   </button>
                 )}
                 {viewDetail.status === 'registered' && !viewDetail.billingRequested && (
                    <button 
                      onClick={() => handleRequestBilling(viewDetail, viewDetail.type.slice(0, -1) === 'doc-op' ? 'documentation' : viewDetail.type.slice(0, -1))}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> طلب فوترة للمالية
                    </button>
                 )}
                 <button className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-100">تعديل</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OperationsPage;
