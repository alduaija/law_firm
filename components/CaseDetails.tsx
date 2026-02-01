
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, FileText, Calendar, HardDrive, Edit, Plus, Clock, Paperclip, MoreVertical, 
  UserPlus, Scale, AlertTriangle, MessageSquare, Briefcase, Building2, Download, Send, CheckCircle, Info, File
} from 'lucide-react';
import { MOCK_CASES } from '../constants';
import { STATUS_LABELS, STATUS_COLORS, DEPARTMENTS, CLIENT_ROLES } from '../types';

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const activeTabDefault = 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'files' | 'notes'>(activeTabDefault);
  const [newNote, setNewNote] = useState('');
  
  const caseItem = MOCK_CASES.find(c => c.id === id) || MOCK_CASES[0];

  if (!caseItem) return <div className="p-10 text-center text-gray-400 text-lg">القضية غير موجودة</div>;

  const TabButton = ({ id, label }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`relative px-5 py-4 text-base font-semibold transition-all border-b-[3px] ${
        activeTab === id 
          ? 'border-indigo-600 text-indigo-600' 
          : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-2">
         <span className="hover:text-gray-800 cursor-pointer" onClick={() => navigate('/cases')}>القضايا</span>
         <span className="mx-2">/</span>
         <span className="text-gray-800 font-medium">{caseItem.internalCode}</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
         <div className="p-8 md:p-10">
             <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div>
                   <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">{caseItem.title}</h1>
                   <div className="flex items-center gap-5 text-base flex-wrap">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold border ${STATUS_COLORS[caseItem.status].replace('bg-', 'bg-opacity-5 bg-').replace('text-', 'border-opacity-20 border-')}`}>
                         <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[caseItem.status].replace('bg-', 'bg-').replace('text-', '').split(' ')[0].replace('100', '500')}`}></span>
                         {STATUS_LABELS[caseItem.status]}
                      </span>
                      <span className="text-gray-500 flex items-center gap-2 text-sm font-medium">
                         <Building2 size={16} /> 
                         {caseItem.clientName} 
                         <span className={`text-xs px-2 py-0.5 rounded ${caseItem.clientRole === 'plaintiff' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                           ({CLIENT_ROLES[caseItem.clientRole]})
                         </span>
                      </span>
                   </div>
                </div>

                <div className="flex gap-3">
                   <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-bold transition-colors">
                     تعديل
                   </button>
                   <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold transition-colors">
                     ملفات Drive
                   </button>
                </div>
             </div>
         </div>
         
         {/* Tabs Line */}
         <div className="px-8 border-t border-gray-100 flex gap-6 overflow-x-auto">
            <TabButton id="overview" label="نظرة عامة وتحديثات" />
            <TabButton id="sessions" label="الجلسات والمواعيد" />
            <TabButton id="files" label="المستندات" />
            <TabButton id="notes" label="الملاحظات" />
         </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[450px]">
         
         {/* --- OVERVIEW TAB --- */}
         {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  
                  {/* Executive Summary */}
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                     <h3 className="font-bold text-gray-900 mb-5 text-lg border-b border-gray-100 pb-3">ملخص تنفيذي</h3>
                     <p className="text-gray-700 leading-8 text-base bg-gray-50/50 p-4 rounded-lg border border-gray-50">
                        {caseItem.description || 'لا يوجد وصف تفصيلي مضاف لهذه القضية.'}
                     </p>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6">
                        <div>
                           <p className="text-xs text-gray-400 uppercase font-bold mb-2">الخصم</p>
                           <p className="text-base font-semibold text-gray-800">{caseItem.opponent}</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 uppercase font-bold mb-2">المحكمة</p>
                           <p className="text-base font-semibold text-gray-800">{caseItem.court}</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 uppercase font-bold mb-2">القسم</p>
                           <p className="text-base font-semibold text-gray-800">{DEPARTMENTS[caseItem.department]}</p>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 uppercase font-bold mb-2">الوزن</p>
                           <p className="text-base font-semibold text-gray-800">{caseItem.weight}</p>
                        </div>
                     </div>
                  </div>

                  {/* Updates Timeline */}
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">آخر المستجدات والتحديثات</h3>
                     </div>
                     
                     <div className="relative border-r border-gray-200 mr-3 space-y-8">
                        {caseItem.updates && caseItem.updates.length > 0 ? (
                           caseItem.updates.map((update) => (
                              <div key={update.id} className="relative pr-8">
                                 <div className={`absolute -right-3 top-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                                    update.type === 'success' ? 'bg-emerald-500 text-white' : 
                                    update.type === 'alert' ? 'bg-rose-500 text-white' : 
                                    update.type === 'document' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'
                                 }`}>
                                    {update.type === 'success' ? <CheckCircle size={12} /> : 
                                     update.type === 'document' ? <File size={12} /> : <Info size={12} />}
                                 </div>
                                 <div>
                                    <span className="text-xs font-bold text-gray-400 block mb-1">{new Date(update.date).toLocaleDateString('ar-SA')}</span>
                                    <h4 className="font-bold text-gray-800 text-base">{update.title}</h4>
                                    <p className="text-gray-600 text-sm mt-1">{update.description}</p>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <p className="text-gray-500 pr-8 text-sm">لا توجد تحديثات مسجلة لهذه القضية حتى الآن.</p>
                        )}
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  {/* Team Card */}
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                     <div className="flex justify-between items-center mb-5">
                        <h3 className="font-bold text-gray-900 text-base">فريق العمل والمهام</h3>
                     </div>
                     <div className="space-y-4">
                        {caseItem.assignees.map((emp) => (
                           <div key={emp.id} className="p-4 rounded-lg bg-gray-50 border border-gray-100 transition-all hover:border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 text-xs font-bold shadow-sm">
                                       {emp.name.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="font-bold text-sm text-gray-900">{emp.name}</p>
                                       <p className="text-xs text-gray-500">{emp.role === 'manager' ? 'مدير' : 'محامي'}</p>
                                    </div>
                                 </div>
                                 <span className="text-xs font-bold text-gray-600 bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">وزن: {emp.weight}</span>
                              </div>
                              
                              {/* Task Details */}
                              <div className="border-t border-gray-200 pt-3 mt-3">
                                 <div className="flex items-start gap-2 mb-2">
                                    <CheckCircle size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                                    <p className="text-sm font-medium text-gray-800">{emp.taskName || 'لم تحدد مهمة'}</p>
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-gray-500 mr-6">
                                    <Clock size={12} />
                                    <span>تاريخ الاكتمال: {emp.dueDate ? new Date(emp.dueDate).toLocaleDateString('ar-SA') : '-'}</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* --- SESSIONS TAB --- */}
         {activeTab === 'sessions' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
               <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 text-base">سجل الجلسات</h3>
                  <button className="text-sm bg-gray-900 text-white font-bold px-5 py-2.5 rounded hover:bg-gray-800 transition-colors">
                     إضافة جلسة
                  </button>
               </div>
               <table className="w-full text-right">
                  <thead className="bg-gray-50 border-b border-gray-200">
                     <tr>
                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">التاريخ</th>
                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">النوع</th>
                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">الحالة</th>
                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase w-1/3">ملاحظات</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-base">
                     {caseItem.sessions.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                           <td className="px-8 py-5 font-medium text-gray-800">
                              {new Date(s.date).toLocaleDateString('ar-SA')}
                              <span className="block text-sm text-gray-400 mt-1">{s.time}</span>
                           </td>
                           <td className="px-8 py-5 text-gray-600 text-sm">{s.type === 'session' ? 'جلسة' : 'موعد'}</td>
                           <td className="px-8 py-5">
                              <span className={`text-xs font-bold px-3 py-1.5 rounded ${s.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                 {s.status === 'completed' ? 'مكتملة' : 'قادمة'}
                              </span>
                           </td>
                           <td className="px-8 py-5 text-gray-500 text-sm">{s.notes}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}

         {/* --- FILES TAB --- */}
         {activeTab === 'files' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {caseItem.files.map((file, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4 hover:border-indigo-300 transition-colors">
                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FileText size={24} />
                     </div>
                     <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-gray-800 text-base truncate">{file.name}</h4>
                        <p className="text-xs text-gray-400 mt-1.5 uppercase">{new Date(file.date).toLocaleDateString('ar-SA')} • {file.type}</p>
                     </div>
                     <button className="text-gray-400 hover:text-indigo-600"><Download size={20} /></button>
                  </div>
               ))}
               <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center p-8 text-gray-400 text-base font-medium cursor-pointer hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <Plus size={20} className="ml-2" /> رفع ملف
               </div>
            </div>
         )}

         {/* --- NOTES TAB --- */}
         {activeTab === 'notes' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
               <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {caseItem.notes.map((note) => (
                     <div key={note.id} className="flex gap-5">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                           {note.user.charAt(0)}
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <span className="text-base font-bold text-gray-900">{note.user}</span>
                              <span className="text-xs text-gray-400">{new Date(note.date).toLocaleDateString('ar-SA')}</span>
                           </div>
                           <p className="text-base text-gray-600 bg-gray-50 p-4 rounded-lg rounded-tr-none border border-gray-100 leading-7">
                              {note.text}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                  <div className="flex gap-3">
                     <input 
                        className="flex-1 px-5 py-3 rounded-lg border border-gray-300 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="أضف ملاحظة..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                     />
                     <button className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">
                        <Send size={20} />
                     </button>
                  </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default CaseDetails;
