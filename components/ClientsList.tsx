
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowRight, UserCircle, Phone, Mail, Building2, MapPin, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { MOCK_CASES } from '../constants';

const ClientsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Derive clients from cases for demo purposes
  // In a real app, this would be a separate API call
  const uniqueClients = Array.from(new Set(MOCK_CASES.map(c => c.clientName))).map(clientName => {
    const clientCases = MOCK_CASES.filter(c => c.clientName === clientName);
    const lastCase = clientCases[0];
    return {
      name: clientName,
      type: clientCases[0].clientRole === 'plaintiff' ? 'عميل (مدعي)' : 'عميل (مدعى عليه)',
      casesCount: clientCases.length,
      activeCases: clientCases.filter(c => c.status === 'new' || c.status === 'in_progress').length,
      email: `contact@${clientName.replace(/\s+/g, '').toLowerCase()}.com`, // Fake data generator
      phone: '05xxxxxxxx',
      lastInteraction: lastCase.updates?.[0]?.date || lastCase.nextSessionDate || '2023-01-01'
    };
  });

  const filteredClients = uniqueClients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">قاعدة العملاء</h2>
          <p className="text-gray-500 text-sm mt-1">سجل بجميع العملاء الحاليين والسابقين.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center transition-all text-base font-semibold shadow-sm">
          <Plus size={20} className="ml-2" />
          إضافة عميل
        </button>
      </div>

      <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3">
         <div className="relative flex-1">
            <Search size={20} className="absolute right-3.5 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="بحث باسم العميل، رقم الهاتف..." 
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
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">العميل</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">بيانات التواصل</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">إجمالي القضايا</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">قضايا نشطة</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">آخر نشاط</th>
                <th className="px-4 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.map((client, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => navigate(`/clients/${encodeURIComponent(client.name)}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5 align-middle">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                           <Building2 size={20} />
                        </div>
                        <div>
                           <div className="font-bold text-gray-900 text-base">{client.name}</div>
                           <div className="text-xs text-gray-500 mt-0.5">{client.type}</div>
                        </div>
                     </div>
                  </td>
                  
                  <td className="px-6 py-5 align-middle">
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-gray-500 gap-2">
                           <Phone size={14} className="text-gray-400" />
                           <span className="dir-ltr">{client.phone}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 gap-2">
                           <Mail size={14} className="text-gray-400" />
                           <span className="dir-ltr">{client.email}</span>
                        </div>
                     </div>
                  </td>

                  <td className="px-6 py-5 align-middle text-center">
                     <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-gray-700">
                        {client.casesCount}
                     </span>
                  </td>

                  <td className="px-6 py-5 align-middle text-center">
                      {client.activeCases > 0 ? (
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm font-bold">
                           {client.activeCases}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm font-medium">-</span>
                      )}
                  </td>

                  <td className="px-6 py-5 align-middle">
                     <span className="text-sm text-gray-600 font-medium dir-ltr">
                        {new Date(client.lastInteraction).toLocaleDateString('ar-SA')}
                     </span>
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

export default ClientsList;
