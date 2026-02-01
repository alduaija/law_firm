
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Building2, Briefcase, Calendar, CheckCircle, Scale, Clock, ExternalLink } from 'lucide-react';
import { MOCK_CASES } from '../constants';
import { DEPARTMENTS, STATUS_LABELS, STATUS_COLORS } from '../types';

const ClientProfile = () => {
  const { clientName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(clientName || '');
  
  // Get all cases for this client
  const clientCases = MOCK_CASES.filter(c => c.clientName === decodedName);

  if (clientCases.length === 0) return <div className="p-10 text-center text-gray-400 text-lg">العميل غير موجود أو ليس لديه قضايا.</div>;

  const activeCasesCount = clientCases.filter(c => c.status === 'new' || c.status === 'in_progress').length;
  const completedCasesCount = clientCases.filter(c => c.status === 'completed' || c.status === 'closed').length;

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <button 
        onClick={() => navigate('/clients')} 
        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors text-sm font-bold group"
      >
        <ArrowRight size={16} className="ml-1 group-hover:-mr-1 transition-all" />
        العودة لقائمة العملاء
      </button>

      {/* Client Header Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            
            {/* Avatar / Icon */}
            <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-indigo-600 shrink-0">
               <Building2 size={40} />
            </div>
            
            {/* Info */}
            <div className="flex-1 pt-1">
               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{decodedName}</h1>
                    <div className="flex flex-col gap-2 mt-2">
                       <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} className="text-gray-400" />
                          <span>الرياض، المملكة العربية السعودية</span>
                       </div>
                       <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={16} className="text-gray-400" />
                          <span className="dir-ltr">050XXXXXXX</span>
                       </div>
                       <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={16} className="text-gray-400" />
                          <span className="dir-ltr">contact@{decodedName.replace(/\s+/g, '').toLowerCase()}.com</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-bold flex items-center transition-colors">
                        <Mail size={16} className="ml-2" />
                        إرسال بريد
                    </button>
                    <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold flex items-center transition-colors shadow-sm shadow-indigo-200">
                        <Briefcase size={16} className="ml-2" />
                        إضافة قضية جديدة
                    </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-gray-100">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                   <Briefcase size={24} />
                </div>
                <div>
                   <p className="text-3xl font-bold text-gray-900">{clientCases.length}</p>
                   <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">إجمالي القضايا</p>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                   <Clock size={24} />
                </div>
                <div>
                   <p className="text-3xl font-bold text-gray-900">{activeCasesCount}</p>
                   <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">قضايا جارية</p>
                </div>
             </div>

             <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                   <CheckCircle size={24} />
                </div>
                <div>
                   <p className="text-3xl font-bold text-gray-900">{completedCasesCount}</p>
                   <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">قضايا منتهية</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-lg">سجل القضايا</h3>
            <span className="bg-white border border-gray-200 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-md">
               الكل ({clientCases.length})
            </span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-base text-right">
               <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                  <tr>
                     <th className="px-8 py-5 w-32">الكود</th>
                     <th className="px-8 py-5 w-1/3">العنوان</th>
                     <th className="px-8 py-5">القسم</th>
                     <th className="px-8 py-5">الخصم</th>
                     <th className="px-8 py-5">الحالة</th>
                     <th className="px-8 py-5"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {clientCases.map(c => (
                     <tr key={c.id} className="hover:bg-gray-50 cursor-pointer group" onClick={() => navigate(`/cases/${c.id}`)}>
                        <td className="px-8 py-5">
                           <span className="font-mono text-sm font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                              {c.internalCode}
                           </span>
                        </td>
                        <td className="px-8 py-5">
                           <div className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-1">{c.title}</div>
                           <div className="text-xs text-gray-400 flex items-center gap-1">
                              <Scale size={12} /> {c.court}
                           </div>
                        </td>
                        <td className="px-8 py-5 text-gray-600 text-sm">
                           {DEPARTMENTS[c.department]}
                        </td>
                        <td className="px-8 py-5 text-gray-600 text-sm font-medium">
                           {c.opponent}
                        </td>
                        <td className="px-8 py-5">
                           <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_COLORS[c.status].replace('bg-', 'bg-opacity-5 bg-').replace('text-', 'border-opacity-20 border-')}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[c.status].replace('bg-', 'bg-').replace('text-', '').split(' ')[0].replace('100', '500')}`}></span>
                              {STATUS_LABELS[c.status]}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-left">
                           <ExternalLink size={16} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default ClientProfile;
