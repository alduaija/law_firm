
import React from 'react';
import { Briefcase, Clock, FileText, Phone, Mail, User, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { MOCK_CASES, MOCK_EMPLOYEES } from '../constants';
import { STATUS_LABELS, STATUS_COLORS } from '../types';

const ClientDashboard = () => {
  // Simulate Client View (e.g., "شركة الأمل")
  const clientName = "شركة الأمل";
  const myCases = MOCK_CASES.filter(c => c.clientName === clientName);

  const activeCases = myCases.filter(c => c.status === 'new' || c.status === 'in_progress');
  const closedCases = myCases.filter(c => c.status === 'completed' || c.status === 'closed');
  
  const mainContactId = myCases[0]?.managerId || 'emp2';
  const mainContact = MOCK_EMPLOYEES.find(e => e.id === mainContactId);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مرحباً، {clientName}</h1>
          <p className="text-gray-500 mt-2">أهلاً بك في بوابة العميل الذكية. يمكنك متابعة الموقف القانوني لكافة ملفاتك من هنا.</p>
        </div>
        <div className="flex gap-4">
           <div className="text-center px-6 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
              <span className="block text-2xl font-bold text-indigo-600">{activeCases.length}</span>
              <span className="text-xs font-bold text-gray-500">قضايا نشطة</span>
           </div>
           <div className="text-center px-6 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="block text-2xl font-bold text-emerald-600">{closedCases.length}</span>
              <span className="text-xs font-bold text-gray-500">قضايا منتهية</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <Briefcase className="text-gray-400" size={20} />
             ملفاتي القانونية
           </h2>
           
           <div className="space-y-4">
             {myCases.length > 0 ? myCases.map(c => (
               <div key={c.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <span className="text-xs font-bold text-gray-400 font-mono mb-1 block">{c.internalCode}</span>
                       <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[c.status].replace('bg-', 'bg-opacity-5 bg-').replace('text-', 'border-opacity-20 border-')}`}>
                       <span className={`w-1.5 h-1.5 rounded-full inline-block ml-2 ${STATUS_COLORS[c.status].replace('bg-', 'bg-').replace('text-', '').split(' ')[0].replace('100', '500')}`}></span>
                       {STATUS_LABELS[c.status]}
                    </span>
                 </div>
                 
                 <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-2">
                       <AlertCircle size={14} className="text-gray-400" />
                       الطرف الخصم: {c.opponent}
                    </span>
                    <span className="flex items-center gap-2">
                       <FileText size={14} className="text-gray-400" />
                       الجهة القضائية: {c.court}
                    </span>
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                    <button className="text-indigo-600 text-sm font-bold flex items-center hover:underline">
                       عرض التفاصيل الكاملة <ArrowUpRight size={16} className="mr-1" />
                    </button>
                 </div>
               </div>
             )) : (
               <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-400">
                  لا توجد سجلات قانونية متاحة حالياً.
               </div>
             )}
           </div>
        </div>

        <div className="space-y-8">
           {mainContact && (
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">المستشار المسؤول</h3>
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg">
                      {mainContact.name.charAt(0)}
                   </div>
                   <div>
                      <p className="font-bold text-gray-900">{mainContact.name}</p>
                      <p className="text-xs text-gray-500">مدير متابعة الملف</p>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-sm font-medium text-gray-700">
                      <Mail size={16} className="text-gray-400" />
                      {mainContact.email}
                   </div>
                   <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-sm font-medium text-gray-700">
                      <Phone size={16} className="text-gray-400" />
                      050XXXXXXX
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
