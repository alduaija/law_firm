
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, ArrowRight, Briefcase, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_EMPLOYEES } from '../constants';
import { DEPARTMENTS } from '../types';

const EmployeesList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_EMPLOYEES.filter(e => e.name.includes(searchTerm) || e.email.includes(searchTerm));

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">فريق العمل</h2>
          <p className="text-gray-500 text-sm mt-1">إدارة المستخدمين والصلاحيات.</p>
        </div>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center transition-all text-base font-semibold shadow-sm">
          <Plus size={20} className="ml-2" />
          إضافة موظف
        </button>
      </div>

      <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3">
         <div className="relative flex-1">
            <Search size={20} className="absolute right-3.5 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="بحث عن موظف..." 
              className="w-full pl-4 pr-11 py-2.5 rounded-md bg-white border-none text-gray-700 text-base focus:ring-0 placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">الموظف</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">الدور</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">القضايا</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">العبء</th>
                <th className="px-4 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((employee) => (
                <tr 
                  key={employee.id} 
                  onClick={() => navigate(`/employees/${employee.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5 align-middle">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                           {employee.name.charAt(0)}
                        </div>
                        <div>
                           <div className="font-semibold text-gray-900 text-base">{employee.name}</div>
                           <div className="text-xs text-gray-500 dir-ltr text-right mt-0.5">{employee.email}</div>
                        </div>
                     </div>
                  </td>
                  
                  <td className="px-6 py-5 align-middle">
                     <span className="text-sm text-gray-600 font-medium bg-gray-50 px-2.5 py-1 rounded border border-gray-100 inline-block">
                        {employee.role === 'manager' ? 'مدير قسم' : employee.role === 'lawyer' ? 'محامي' : 'مستشار'}
                     </span>
                     <div className="text-xs text-gray-400 mt-1.5">{DEPARTMENTS[employee.department]}</div>
                  </td>

                  <td className="px-6 py-5 align-middle">
                     <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-bold ${employee.active ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-gray-500 bg-gray-100 border border-gray-200'}`}>
                        <span className={`w-2 h-2 rounded-full ${employee.active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        {employee.active ? 'نشط' : 'غير نشط'}
                     </div>
                  </td>

                  <td className="px-6 py-5 align-middle text-center">
                     <span className="font-bold text-gray-700 text-sm">
                        {employee.activeCasesCount}
                     </span>
                  </td>

                  <td className="px-6 py-5 align-middle text-center">
                     <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-sm text-gray-600">{employee.totalWeight}</span>
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div 
                              className={`h-full rounded-full ${employee.totalWeight > 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                              style={{ width: `${Math.min(employee.totalWeight, 100)}%` }}
                           ></div>
                        </div>
                     </div>
                  </td>

                  <td className="px-4 py-5 align-middle text-left">
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-indigo-600 rotate-180 transition-colors" />
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

export default EmployeesList;
