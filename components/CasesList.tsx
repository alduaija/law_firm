
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Calendar, Scale, Building2, Briefcase, ArrowUpRight } from 'lucide-react';
import { MOCK_CASES } from '../constants';
import { STATUS_LABELS, STATUS_COLORS, DEPARTMENTS, CLIENT_ROLES } from '../types';

const CasesList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filteredCases = MOCK_CASES.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(term) || 
                          c.internalCode.toLowerCase().includes(term) || 
                          c.court.toLowerCase().includes(term) ||
                          c.clientName.toLowerCase().includes(term);
    const matchesDept = deptFilter === 'all' || c.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">ملفات القضايا</h2>
          <p className="text-gray-500 text-sm mt-1">إدارة شاملة لجميع القضايا المسجلة في النظام.</p>
        </div>
        <button 
          onClick={() => navigate('/cases/new')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center transition-all text-base font-semibold shadow-sm"
        >
          <Plus size={20} className="ml-2" />
          قضية جديدة
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={20} className="absolute right-3.5 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="بحث (رقم القضية، العميل، العنوان)..." 
            className="w-full pl-4 pr-11 py-2.5 rounded-md bg-white border-none text-gray-700 text-base focus:ring-0 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="h-8 w-[1px] bg-gray-200 my-auto hidden md:block"></div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative">
             <select 
               className="appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent rounded-md px-5 py-2.5 pr-10 text-sm font-semibold text-gray-600 focus:outline-none cursor-pointer min-w-[160px]"
               value={deptFilter}
               onChange={(e) => setDeptFilter(e.target.value)}
             >
               <option value="all">جميع الأقسام</option>
               {Object.entries(DEPARTMENTS).map(([key, label]) => (
                   <option key={key} value={key}>{label}</option>
               ))}
             </select>
             <Filter size={16} className="absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-semibold rounded-md transition-colors border border-transparent">
            <SlidersHorizontal size={16} />
            تصفية
          </button>
        </div>
      </div>

      {/* Table - Surface Design */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider w-24">الكود</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]">العنوان</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">العميل وصفته</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">الخصم</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">الفريق</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-4 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.map((c) => (
                <tr 
                  key={c.id} 
                  onClick={() => navigate(`/cases/${c.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5 align-top">
                     <span className="font-mono text-gray-500 text-sm font-semibold block">
                       {c.internalCode}
                     </span>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="font-bold text-gray-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                      {c.title}
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                          {c.court}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                     <div className="font-semibold text-gray-800 text-sm">{c.clientName}</div>
                     <span className={`inline-block text-[10px] px-2 py-0.5 rounded mt-1 font-bold ${c.clientRole === 'plaintiff' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                       {CLIENT_ROLES[c.clientRole]}
                     </span>
                  </td>
                  <td className="px-6 py-5 align-top">
                     <div className="text-sm text-gray-600">{c.opponent}</div>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <div className="flex -space-x-3 space-x-reverse">
                       {c.assignees.slice(0, 3).map((a, i) => (
                         <div key={i} className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600" title={a.name}>
                            {a.name.charAt(0)}
                         </div>
                       ))}
                       {c.assignees.length > 3 && (
                          <div className="w-9 h-9 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                             +{c.assignees.length - 3}
                          </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_COLORS[c.status].replace('bg-', 'bg-opacity-5 bg-').replace('text-', 'border-opacity-20 border-')}`}>
                      <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[c.status].replace('bg-', 'bg-').replace('text-', '').split(' ')[0].replace('100', '500')}`}></span>
                      <span className={STATUS_COLORS[c.status].split(' ')[1]}>{STATUS_LABELS[c.status]}</span>
                    </span>
                  </td>
                  <td className="px-4 py-5 align-middle text-left">
                    <ArrowUpRight size={18} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination */}
        <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
           <span className="text-xs font-semibold text-gray-500">عرض {filteredCases.length} من أصل 50</span>
           <div className="flex items-center gap-2">
             <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-white disabled:opacity-50" disabled><ChevronRight size={18} /></button>
             <span className="text-sm font-bold text-gray-700">1</span>
             <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-white"><ChevronLeft size={18} /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CasesList;
