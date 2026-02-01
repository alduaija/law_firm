
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Briefcase, Calendar, CheckCircle, Scale, Clock, CheckSquare } from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_CASES } from '../constants';
import { DEPARTMENTS, STATUS_LABELS, STATUS_COLORS } from '../types';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = MOCK_EMPLOYEES.find(e => e.id === id);

  if (!employee) return <div className="p-10 text-center text-gray-400 text-lg">الموظف غير موجود</div>;
  const employeeCases = MOCK_CASES.filter(c => c.assignees.some(a => a.id === employee.id));

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <button 
        onClick={() => navigate('/employees')} 
        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors text-sm font-bold group"
      >
        <ArrowRight size={16} className="ml-1 group-hover:-mr-1 transition-all" />
        العودة للقائمة
      </button>

      {/* Profile Header - Clean Design */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            
            {/* Avatar / Initial */}
            <div className="w-24 h-24 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 text-4xl font-bold shrink-0">
               {employee.name.charAt(0)}
            </div>
            
            {/* Info */}
            <div className="flex-1 pt-1">
               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h1>
                    <div className="flex items-center flex-wrap gap-3 text-sm font-medium">
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded border border-indigo-100">
                          {employee.role === 'manager' ? 'مدير قسم' : 'محامي / مستشار'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{DEPARTMENTS[employee.department]}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 dir-ltr font-sans">{employee.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-bold flex items-center transition-colors">
                        <Mail size={16} className="ml-2" />
                        مراسلة
                    </button>
                    <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-bold flex items-center transition-colors shadow-sm shadow-indigo-200">
                        <Briefcase size={16} className="ml-2" />
                        تعديل الصلاحيات
                    </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-gray-100">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                   <Briefcase size={24} />
                </div>
                <div>
                   <p className="text-3xl font-bold text-gray-900">{employee.activeCasesCount}</p>
                   <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">القضايا النشطة</p>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                   <Scale size={24} />
                </div>
                <div>
                   <p className="text-3xl font-bold text-gray-900">{employee.totalWeight}</p>
                   <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">عبء العمل (الوزن)</p>
                </div>
             </div>

             <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                   <CheckCircle size={24} />
                </div>
                <div>
                   <p className="text-3xl font-bold text-gray-900">98%</p>
                   <p className="text-xs font-bold text-gray-400 uppercase mt-0.5">نسبة الإنجاز</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Cases Table with Detailed Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-lg">القضايا والمهام المسندة</h3>
            <span className="bg-white border border-gray-200 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-md">
               {employeeCases.length} قضية
            </span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-base text-right">
               <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                  <tr>
                     <th className="px-6 py-5 w-24">الكود</th>
                     <th className="px-6 py-5 w-1/4">القضية</th>
                     <th className="px-6 py-5 w-1/4">المهمة المطلوبة</th>
                     <th className="px-6 py-5">تاريخ التسليم</th>
                     <th className="px-6 py-5 text-center">الوزن</th>
                     <th className="px-6 py-5">الحالة</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {employeeCases.length > 0 ? (
                    employeeCases.map(c => {
                       const specificAssignment = c.assignees.find(a => a.id === employee.id);
                       const assignedWeight = specificAssignment ? specificAssignment.weight : 0;
                       const taskName = specificAssignment?.taskName || '-';
                       const dueDate = specificAssignment?.dueDate || null;

                       return (
                          <tr key={c.id} className="hover:bg-gray-50 cursor-pointer group" onClick={() => navigate(`/cases/${c.id}`)}>
                             <td className="px-6 py-5 align-top">
                                <span className="font-mono text-xs font-bold text-gray-500">
                                   {c.internalCode}
                                </span>
                             </td>
                             <td className="px-6 py-5 align-top">
                                <div className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors text-sm mb-1">{c.title}</div>
                                <div className="text-xs text-gray-400">{c.clientName}</div>
                             </td>
                             <td className="px-6 py-5 align-top">
                                <div className="flex items-start gap-2">
                                   <CheckSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                   <span className="text-sm font-medium text-gray-700">{taskName}</span>
                                </div>
                             </td>
                             <td className="px-6 py-5 align-top">
                                {dueDate ? (
                                   <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                                      <Calendar size={14} className="text-gray-400" />
                                      <span className="dir-ltr">{new Date(dueDate).toLocaleDateString('ar-SA')}</span>
                                   </div>
                                ) : <span className="text-gray-300">-</span>}
                             </td>
                             <td className="px-6 py-5 text-center align-top">
                                <span className="inline-block px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700">
                                   {assignedWeight}
                                </span>
                             </td>
                             <td className="px-6 py-5 align-top">
                                <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[c.status].replace('bg-', 'bg-opacity-5 bg-').replace('text-', 'border-opacity-20 border-')}`}>
                                   <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[c.status].replace('bg-', 'bg-').replace('text-', '').split(' ')[0].replace('100', '500')}`}></span>
                                   {STATUS_LABELS[c.status]}
                                </span>
                             </td>
                          </tr>
                       );
                    })
                  ) : (
                    <tr>
                       <td colSpan={6} className="px-8 py-10 text-center text-gray-400">لا توجد قضايا مسندة لهذا الموظف حالياً.</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
