
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Landmark, ChevronLeft, ChevronRight, CheckCircle, 
  X, Scale, Building2, UserPlus, FileText, Send, 
  ArrowRightLeft, Briefcase, FileSignature, MessageSquare, Paperclip, 
  PlusCircle, AlertCircle, Trash2, Home, Gavel, DollarSign, PieChart, 
  History, User, Activity, MoreVertical, Layers, CheckSquare, ShieldCheck,
  MapPin, Archive, Info, FileDown, Eye, FileUp, Calendar, Trash, Globe, Map
} from 'lucide-react';
import { MOCK_ESTATES } from '../constants';
import { 
  Estate, Heir, EstateAsset, LiquidationTask, EstateStatus, AssetType,
  LiquidationMethod, AssetStatus, Heir as HeirType, Note, FileEntry,
  DEPARTMENTS
} from '../types';

const METHOD_LABELS: Record<LiquidationMethod, string> = {
  entrustment_center: 'مركز إنفاذ',
  court_assignment: 'إسناد من المحكمة',
  direct_client: 'توقيع مباشر مع العميل'
};

const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  real_estate: 'عقار',
  investment: 'مساهمة',
  bank_funds: 'أموال بنكية',
  other: 'موجودات أخرى'
};

const EstateCard: React.FC<{ estate: Estate; onClick: () => void }> = ({ estate, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-1.5 h-full ${estate.status === 'in_progress' ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        <Landmark size={24} />
      </div>
      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${estate.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
        {estate.status === 'in_progress' ? 'قيد الإجراء' : 'مغلقة نهائياً'}
      </span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-1">{estate.deceasedName}</h3>
    <p className="text-xs text-gray-400 font-medium mb-4">{METHOD_LABELS[estate.method]}</p>
    
    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
       <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase">الورثة</p>
          <p className="text-sm font-bold text-gray-700">{estate.heirs.length}</p>
       </div>
       <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase">الموجودات</p>
          <p className="text-sm font-bold text-gray-700">{estate.assets.length}</p>
       </div>
    </div>
  </div>
);

const LiquidationManagement = () => {
  const [estates, setEstates] = useState<Estate[]>(MOCK_ESTATES);
  const [viewEstate, setViewEstate] = useState<Estate | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'assets' | 'tasks' | 'log'>('info');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [newDeceased, setNewDeceased] = useState('');
  const [newMethod, setNewMethod] = useState<LiquidationMethod>('entrustment_center');
  const [newHeirs, setNewHeirs] = useState<HeirType[]>([]);
  const [assetType, setAssetType] = useState<AssetType>('real_estate');

  // Advanced Form States for Real Estate
  const [reType, setReType] = useState('villa');
  const [reOwnership, setReOwnership] = useState(100);
  const [reDeedStatus, setReDeedStatus] = useState('digital');
  const [reDeedNo, setReDeedNo] = useState('');
  const [reDeedDate, setReDeedDate] = useState('');
  const [reLocation, setReLocation] = useState({ country: 'السعودية', region: '', city: '', neighborhood: '' });
  const [reArea, setReArea] = useState<number | string>('');
  const [reUpdateStages, setReUpdateStages] = useState<string[]>([]);
  const [reEvaluation, setReEvaluation] = useState({ amount: '', date: '', entity: '' });
  const [reRequirements, setReRequirements] = useState<string[]>([]);

  // Other Asset States
  const [contributionName, setContributionName] = useState('');
  const [financialEntity, setFinancialEntity] = useState('');
  const [bankName, setBankName] = useState('');
  const [assetAmount, setAssetAmount] = useState('');
  const [otherAssetType, setOtherAssetType] = useState('');
  const [assetSummary, setAssetSummary] = useState('');

  const handleCreateEstate = () => {
    if (!newDeceased || newHeirs.length === 0) {
      alert('الرجاء إكمال البيانات الأساسية وإضافة وريث واحد على الأقل.');
      return;
    }

    const newEstate: Estate = {
      id: `EST-${Date.now()}`,
      deceasedName: newDeceased,
      method: newMethod,
      status: 'in_progress',
      heirs: newHeirs,
      assets: [],
      tasks: [],
      activityLog: [{ 
        id: '1', 
        date: new Date().toISOString(), 
        user: 'المدير العام', 
        action: 'إنشاء ملف', 
        details: 'تم إنشاء ملف التركة الجديد' 
      }],
      createdAt: new Date().toISOString()
    };

    setEstates([newEstate, ...estates]);
    setShowAddModal(false);
    setNewDeceased('');
    setNewHeirs([]);
  };

  const handleAddAsset = () => {
    if (!viewEstate) return;

    // Logic to open separate tasks for each requirement
    const tasks: LiquidationTask[] = reRequirements.map((req, idx) => ({
      id: `TSK-${Date.now()}-${idx}`,
      title: req,
      type: 'administrative',
      nextStep: 'مراجعة الجهات المختصة',
      nextStepDate: new Date().toISOString().split('T')[0],
      status: 'open',
      hasFees: false,
      updates: []
    }));

    // If bank/contribution, add standard task
    if (assetType !== 'real_estate') {
       tasks.push({
          id: `TSK-${Date.now()}`,
          title: `معالجة ${ASSET_TYPE_LABELS[assetType]}`,
          type: 'legal',
          nextStep: 'مخاطبة الجهة المالية',
          nextStepDate: new Date().toISOString().split('T')[0],
          status: 'open',
          hasFees: false,
          updates: []
       });
    }

    const newAsset: EstateAsset = {
      id: `AST-${Date.now()}`,
      type: assetType,
      status: 'in_progress',
      name: assetType === 'real_estate' ? `${ASSET_TYPE_LABELS[assetType]} - ${reDeedNo || 'بدون صك'}` : (contributionName || bankName || otherAssetType),
      ownershipPercent: reOwnership,
      details: {
        reType: reType as any,
        deedStatus: reDeedStatus as any,
        deedNo: reDeedNo,
        deedDate: reDeedDate,
        location: reLocation,
        area: Number(reArea),
        contributionName,
        financialEntity,
        bankName,
        amount: Number(assetAmount),
        otherAssetType,
        summary: assetSummary,
        requirements: reRequirements
      },
      linkedTasks: tasks
    };

    const updatedEstate = {
      ...viewEstate,
      assets: [...viewEstate.assets, newAsset],
      activityLog: [
        {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          user: 'المدير العام',
          action: 'إضافة موجود',
          details: `تم إضافة ${ASSET_TYPE_LABELS[assetType]}: ${newAsset.name}`
        },
        ...viewEstate.activityLog
      ]
    };

    setEstates(estates.map(e => e.id === viewEstate.id ? updatedEstate : e));
    setViewEstate(updatedEstate);
    setShowAssetModal(false);
    
    // Reset forms
    setReRequirements([]);
    setReUpdateStages([]);
    setAssetAmount('');
  };

  const handleCloseEstate = () => {
    if (!viewEstate) return;
    const allAssetsCompleted = viewEstate.assets.every(a => a.status === 'completed');
    if (!allAssetsCompleted) {
      alert('تنبيه: لا يمكن إغلاق التركة نهائياً بوجود موجودات قيد الإجراء.');
      return;
    }

    if (confirm('هل أنت متأكد من إغلاق التركة نهائياً؟ لن تتمكن من التعديل لاحقاً.')) {
      const updatedEstate = {
        ...viewEstate,
        status: 'closed' as EstateStatus,
        activityLog: [
          { id: Date.now().toString(), date: new Date().toISOString(), user: 'المدير العام', action: 'إغلاق نهائي', details: 'تم إغلاق التركة وتصفيتها بالكامل.' },
          ...viewEstate.activityLog
        ]
      };
      setEstates(estates.map(e => e.id === viewEstate.id ? updatedEstate : e));
      setViewEstate(updatedEstate);
    }
  };

  const filteredEstates = estates.filter(e => e.deceasedName.includes(searchTerm));

  const toggleRequirement = (req: string) => {
    setReRequirements(prev => prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">إدارة الحراسة والتصفية القضائية</h2>
          <p className="text-gray-500 text-sm mt-1">نظام تتبع الأصول، الورثة، والمهام التنفيذية للتركات.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center transition-all text-base font-bold shadow-lg shadow-indigo-100"
        >
          <Plus size={20} className="ml-2" />
          إضافة ملف تركة جديد
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={20} className="absolute right-3.5 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="بحث باسم المورث..." 
            className="w-full pl-4 pr-11 py-2.5 rounded-lg bg-white border-none text-gray-700 text-base focus:ring-0 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEstates.map(estate => (
          <EstateCard key={estate.id} estate={estate} onClick={() => { setViewEstate(estate); setActiveTab('info'); }} />
        ))}
      </div>

      {/* Add Estate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Landmark className="text-indigo-600" /> فتح ملف تركة جديد</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-8 text-right overflow-y-auto max-h-[70vh]" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">اسم المورّث (إلزامي) *</label>
                  <input value={newDeceased} onChange={e => setNewDeceased(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" placeholder="الاسم الرباعي للمتوفي..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">طريقة الإسناد *</label>
                  <select value={newMethod} onChange={e => setNewMethod(e.target.value as any)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                    {Object.entries(METHOD_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                   <h3 className="text-sm font-bold text-gray-800">بيانات الورثة</h3>
                   <button onClick={() => setNewHeirs([...newHeirs, { id: Date.now().toString(), name: '', identityNo: '', birthDate: '', phone: '', iban: '' }])} className="text-xs font-bold text-indigo-600 flex items-center gap-1"><PlusCircle size={14} /> إضافة وريث</button>
                </div>
                {newHeirs.map((h, i) => (
                  <div key={h.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3 flex justify-between border-b border-gray-100 pb-2">
                       <span className="text-xs font-bold text-gray-400">وريث #{i+1}</span>
                       <button onClick={() => setNewHeirs(newHeirs.filter(x => x.id !== h.id))} className="text-rose-500"><Trash2 size={16} /></button>
                    </div>
                    <input placeholder="الاسم" value={h.name} onChange={e => setNewHeirs(newHeirs.map(x => x.id === h.id ? {...x, name: e.target.value} : x))} className="p-2 bg-white border border-gray-200 rounded text-xs" />
                    <input placeholder="الهوية" value={h.identityNo} onChange={e => setNewHeirs(newHeirs.map(x => x.id === h.id ? {...x, identityNo: e.target.value} : x))} className="p-2 bg-white border border-gray-200 rounded text-xs" />
                    <input placeholder="الآيبان" value={h.iban} onChange={e => setNewHeirs(newHeirs.map(x => x.id === h.id ? {...x, iban: e.target.value} : x))} className="p-2 bg-white border border-gray-200 rounded text-xs" />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
               <button onClick={() => setShowAddModal(false)} className="px-6 py-2 text-sm font-bold text-gray-500">إلغاء</button>
               <button onClick={handleCreateEstate} className="px-10 py-2 bg-indigo-600 text-white rounded-lg font-bold">إنشاء الملف</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {viewEstate && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white w-full max-w-5xl h-full shadow-2xl flex flex-col animate-slide-in-right">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Landmark size={24} /></div>
                    <div>
                       <h2 className="text-lg font-bold text-gray-800">{viewEstate.deceasedName}</h2>
                       <p className="text-xs text-gray-500">{METHOD_LABELS[viewEstate.method]}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    {viewEstate.status === 'in_progress' && (
                       <button onClick={handleCloseEstate} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-2"><CheckCircle size={16} /> إغلاق التركة</button>
                    )}
                    <button onClick={() => setViewEstate(null)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
                 </div>
              </div>

              <div className="flex border-b border-gray-100 bg-white sticky top-0 z-10">
                 <button onClick={() => setActiveTab('info')} className={`flex-1 py-4 text-xs font-bold border-b-2 transition-all ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>بيانات الورثة</button>
                 <button onClick={() => setActiveTab('assets')} className={`flex-1 py-4 text-xs font-bold border-b-2 transition-all ${activeTab === 'assets' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>الموجودات ({viewEstate.assets.length})</button>
                 <button onClick={() => setActiveTab('tasks')} className={`flex-1 py-4 text-xs font-bold border-b-2 transition-all ${activeTab === 'tasks' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>المهام التنفيذية</button>
                 <button onClick={() => setActiveTab('log')} className={`flex-1 py-4 text-xs font-bold border-b-2 transition-all ${activeTab === 'log' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400'}`}>سجل النشاط</button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 text-right" dir="rtl">
                 {activeTab === 'info' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">رقم الملف</p>
                             <p className="font-mono font-bold text-gray-800">{viewEstate.id}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">تاريخ الفتح</p>
                             <p className="font-bold text-gray-800">{new Date(viewEstate.createdAt).toLocaleDateString('ar-SA')}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">حالة الملف</p>
                             <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${viewEstate.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {viewEstate.status === 'in_progress' ? 'قيد الإجراء' : 'مغلق'}
                             </span>
                          </div>
                       </div>
                       <table className="w-full text-right border-collapse">
                          <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase border-b border-gray-200">
                             <tr>
                                <th className="px-4 py-3">اسم الوريث</th>
                                <th className="px-4 py-3">الهوية الوطنية</th>
                                <th className="px-4 py-3">الآيبان البنكي</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                             {viewEstate.heirs.map(h => (
                                <tr key={h.id} className="text-xs">
                                   <td className="px-4 py-3 font-bold">{h.name}</td>
                                   <td className="px-4 py-3 text-gray-500 font-mono">{h.identityNo}</td>
                                   <td className="px-4 py-3 text-gray-400 font-mono">{h.iban}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 )}

                 {activeTab === 'assets' && (
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-gray-900">حصر الموجودات والأصول</h3>
                          {viewEstate.status === 'in_progress' && (
                             <button onClick={() => setShowAssetModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-2"><Plus size={16} /> إضافة موجود</button>
                          )}
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {viewEstate.assets.map(asset => (
                             <div key={asset.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                   <div className={`p-2 rounded-lg ${asset.type === 'real_estate' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                      {asset.type === 'real_estate' ? <Home size={20} /> : asset.type === 'bank_funds' ? <DollarSign size={20} /> : <PieChart size={20} />}
                                   </div>
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${asset.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                      {asset.status === 'completed' ? 'منتهي' : 'قيد الإجراء'}
                                   </span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-base mb-1">{asset.name}</h4>
                                <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-50 pt-3 mt-3">
                                   <span>المهام المفتوحة</span>
                                   <span className="font-bold text-rose-500">{asset.linkedTasks.filter(t => t.status !== 'closed').length}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {activeTab === 'tasks' && (
                    <div className="space-y-6">
                       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                          <table className="w-full text-right border-collapse">
                             <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">
                                <tr>
                                   <th className="px-6 py-4">المهمة</th>
                                   <th className="px-6 py-4">الإجراء القادم</th>
                                   <th className="px-6 py-4 text-center">الحالة</th>
                                   <th className="px-6 py-4"></th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100">
                                {viewEstate.assets.flatMap(a => a.linkedTasks).map(t => (
                                   <tr key={t.id} className="text-xs hover:bg-gray-50">
                                      <td className="px-6 py-4 font-bold">{t.title}</td>
                                      <td className="px-6 py-4 text-gray-500">
                                         <div>{t.nextStep}</div>
                                         <div className="text-[10px] opacity-60">{t.nextStepDate}</div>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'closed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                            {t.status === 'closed' ? 'مغلقة' : 'مفتوحة'}
                                         </span>
                                      </td>
                                      <td className="px-6 py-4 text-left"><button className="p-1 hover:bg-white rounded"><MoreVertical size={16} className="text-gray-400" /></button></td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 )}

                 {activeTab === 'log' && (
                    <div className="space-y-6 relative border-r-2 border-gray-100 mr-2 pr-6">
                       {viewEstate.activityLog.map(log => (
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

      {/* Asset Modal - UPDATED FOR FULL REQUIREMENTS */}
      {showAssetModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h2 className="text-xl font-bold text-gray-800">إضافة موجود جديد للتركة</h2>
                 <button onClick={() => setShowAssetModal(false)} className="p-2 hover:bg-white rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-8 text-right overflow-y-auto" dir="rtl">
                 
                 {/* 1. Asset Type Selector */}
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">نوع الموجود المالي *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       {Object.entries(ASSET_TYPE_LABELS).map(([k,v]) => (
                          <button 
                            key={k} 
                            onClick={() => setAssetType(k as AssetType)}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${assetType === k ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md scale-105' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                          >
                             {k === 'real_estate' ? <Home size={28} /> : k === 'investment' ? <PieChart size={28} /> : k === 'bank_funds' ? <DollarSign size={28} /> : <Layers size={28} />}
                             <span className="text-xs font-bold">{v}</span>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* 2. Real Estate Logic */}
                 {assetType === 'real_estate' && (
                    <div className="space-y-8 animate-fade-in">
                       {/* Basic RE Data */}
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div>
                             <label className="block text-xs font-bold text-gray-400 mb-2">نوع العقار *</label>
                             <select value={reType} onChange={e => setReType(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                                <option value="villa">فيلا</option>
                                <option value="land">أرض</option>
                                <option value="farm">مزرعة</option>
                                <option value="commercial_building">عمارة تجارية</option>
                                <option value="other">أخرى</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-400 mb-2">الملكية للمورث % *</label>
                             <input type="number" value={reOwnership} onChange={e => setReOwnership(Number(e.target.value))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-400 mb-2">حالة الصك *</label>
                             <select value={reDeedStatus} onChange={e => setReDeedStatus(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold">
                                <option value="none">غير موجود</option>
                                <option value="paper">ورقي</option>
                                <option value="digital">إلكتروني</option>
                             </select>
                          </div>
                          <div className="flex flex-col justify-end">
                             <button className="flex items-center justify-center gap-2 p-3 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition-all">
                                <FileUp size={16} /> إرفاق الصك PDF
                             </button>
                          </div>
                       </div>

                       {/* Deed Details */}
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                             <label className="block text-xs font-bold text-gray-400 mb-2">رقم الصك</label>
                             <input value={reDeedNo} onChange={e => setReDeedNo(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono font-bold" />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-400 mb-2">تاريخ الصك</label>
                             <input type="date" value={reDeedDate} onChange={e => setReDeedDate(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-400 mb-2">المساحة الإجمالية (م²)</label>
                             <input type="number" value={reArea} onChange={e => setReArea(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                          </div>
                       </div>

                       {/* Location Details */}
                       <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
                          <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 border-b border-gray-100 pb-3"><MapPin size={16} /> بيانات الموقع</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <input placeholder="الدولة" value={reLocation.country} onChange={e => setReLocation({...reLocation, country: e.target.value})} className="p-3 bg-white border border-gray-200 rounded-lg text-sm" />
                             <input placeholder="المنطقة" value={reLocation.region} onChange={e => setReLocation({...reLocation, region: e.target.value})} className="p-3 bg-white border border-gray-200 rounded-lg text-sm" />
                             <input placeholder="المدينة" value={reLocation.city} onChange={e => setReLocation({...reLocation, city: e.target.value})} className="p-3 bg-white border border-gray-200 rounded-lg text-sm" />
                             <input placeholder="الحي" value={reLocation.neighborhood} onChange={e => setReLocation({...reLocation, neighborhood: e.target.value})} className="p-3 bg-white border border-gray-200 rounded-lg text-sm" />
                          </div>
                       </div>

                       {/* Update Stages */}
                       <div className="space-y-4">
                          <label className="block text-xs font-bold text-gray-500 uppercase">مراحل تحديث الصك</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                             {['survey', 'exchange', 'ehkam'].map((st) => (
                                <button 
                                  key={st}
                                  onClick={() => setReUpdateStages(prev => prev.includes(st) ? prev.filter(s => s !== st) : [...prev, st])}
                                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${reUpdateStages.includes(st) ? 'border-amber-500 bg-amber-50 text-amber-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                >
                                   <div className="flex items-center gap-3">
                                      {st === 'survey' ? <Scale size={18} /> : st === 'exchange' ? <Globe size={18} /> : <ShieldCheck size={18} />}
                                      <span className="text-xs font-bold">{st === 'survey' ? 'الرفع المساحي' : st === 'exchange' ? 'البورصة العقارية' : 'منصة إحكام'}</span>
                                   </div>
                                   {reUpdateStages.includes(st) && <FileUp size={16} className="text-amber-500" />}
                                </button>
                             ))}
                          </div>
                          {reUpdateStages.length > 0 && <p className="text-[10px] text-amber-600 font-bold">* يرجى رفع "صورة المرحلة" عند الحفظ لكل مرحلة مختارة.</p>}
                       </div>

                       {/* Evaluation */}
                       <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4">
                          <h4 className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-2"><Gavel size={16} /> إضافة تقييم للعقار</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <input placeholder="المبلغ (ر.س)" value={reEvaluation.amount} onChange={e => setReEvaluation({...reEvaluation, amount: e.target.value})} className="p-3 bg-white border border-emerald-100 rounded-lg text-sm font-bold" />
                             <input type="date" value={reEvaluation.date} onChange={e => setReEvaluation({...reEvaluation, date: e.target.value})} className="p-3 bg-white border border-emerald-100 rounded-lg text-sm" />
                             <input placeholder="جهة التقييم" value={reEvaluation.entity} onChange={e => setReEvaluation({...reEvaluation, entity: e.target.value})} className="p-3 bg-white border border-emerald-100 rounded-lg text-sm" />
                          </div>
                       </div>

                       {/* Requirements - Tasks */}
                       <div className="space-y-4">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">المطلوب في العقار (سيتم فتح مهمة لكل طلب) *</label>
                          <div className="flex flex-wrap gap-2">
                             {['تحديث الصك', 'إخلاء العقار', 'تأجير العقار', 'تحصيل الأجرة'].map((req) => (
                                <button 
                                  key={req}
                                  onClick={() => toggleRequirement(req)}
                                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${reRequirements.includes(req) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300'}`}
                                >
                                   {req}
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {/* 3. Investment Logic */}
                 {assetType === 'investment' && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <label className="block text-xs font-bold text-gray-500 mb-2">اسم المساهمة *</label>
                             <input value={contributionName} onChange={e => setContributionName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-500 mb-2">الجهة المالية</label>
                             <input value={financialEntity} onChange={e => setFinancialEntity(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-400 mb-2">ملخص حالة المساهمة والمطلوب</label>
                          <textarea value={assetSummary} onChange={e => setAssetSummary(e.target.value)} rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                       </div>
                    </div>
                 )}

                 {/* 4. Bank Funds Logic */}
                 {assetType === 'bank_funds' && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <label className="block text-xs font-bold text-gray-500 mb-2">اسم البنك *</label>
                             <input value={bankName} onChange={e => setBankName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-gray-500 mb-2">المبلغ المتاح *</label>
                             <input type="number" value={assetAmount} onChange={e => setAssetAmount(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                          </div>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-400 mb-2">ملخص المطلوب (مثلاً: حصر رصيد، مخاطبة بنك...)</label>
                          <textarea value={assetSummary} onChange={e => setAssetSummary(e.target.value)} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                       </div>
                    </div>
                 )}

                 {/* 5. Other Logic */}
                 {assetType === 'other' && (
                    <div className="space-y-6 animate-fade-in">
                       <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2">نوع المال / الموجود *</label>
                          <input value={otherAssetType} onChange={e => setOtherAssetType(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-400 mb-2">ملخص المطلوب</label>
                          <textarea value={assetSummary} onChange={e => setAssetSummary(e.target.value)} rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                       </div>
                    </div>
                 )}

                 <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3 sticky bottom-0">
                    <Info size={18} className="text-indigo-500 mt-0.5" />
                    <p className="text-xs text-indigo-700 leading-relaxed">عند حفظ الموجود، سيقوم النظام تلقائياً بفتح المهام المحددة وربطها بملف التركة الرئيسي. لا يمكن إغلاق التركة حتى يتم إنهاء كافة مهام الموجودات.</p>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                 <button onClick={() => setShowAssetModal(false)} className="px-6 py-2 text-sm font-bold text-gray-500">إلغاء</button>
                 <button onClick={handleAddAsset} className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">حفظ الموجود وتفعيل المهام</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LiquidationManagement;
