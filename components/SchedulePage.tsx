
import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Filter, Download, Printer, Search, User, Lock } from 'lucide-react';
import { MOCK_CASES, MOCK_EMPLOYEES } from '../constants';

interface SchedulePageProps {
  userRole: 'admin' | 'lawyer' | 'client';
}

const SchedulePage = ({ userRole }: SchedulePageProps) => {
  // تحديد المستخدم الحالي بناءً على الدور المرر من App.tsx بأسماء خيالية
  const currentUser = useMemo(() => {
     if (userRole === 'lawyer') {
        return { id: 'emp2', name: 'أحمد علي', role: 'lawyer' }; 
     }
     return { id: 'emp1', name: 'ليلى محمد', role: 'manager' }; 
  }, [userRole]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(currentUser.id);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSelectedEmployeeId(currentUser.id);
  }, [currentUser.id]);

  const employeesList = MOCK_EMPLOYEES.filter(e => e.active);

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', { weekday: 'long' });
  };

  const scheduleRows = useMemo(() => {
    let rows: any[] = [];
    const targetId = currentUser.role === 'manager' ? selectedEmployeeId : currentUser.id;

    MOCK_CASES.forEach(c => {
      const assignee = c.assignees.find(a => a.id === targetId);
      if (!assignee) return;

      if (c.sessions && c.sessions.length > 0) {
        c.sessions.forEach(s => {
          if (s.status === 'pending') {
            rows.push({
              id: `session-${s.id}`,
              client: c.clientName,
              opponent: c.opponent,
              caseNo: c.internalCode,
              agencyNumber: c.agencyNumber || '-',
              agencyDate: c.agencyDate || null,
              court: c.court,
              date: s.date,
              day: getDayName(s.date),
              time: s.time,
              reference: s.type === 'session' ? 'جلسة قضائية' : 'موعد إجرائي',
              notes: s.notes || '-',
              type: 'session'
            });
          }
        });
      } else if (c.nextSessionDate) {
         rows.push({
            id: `session-next-${c.id}`,
            client: c.clientName,
            opponent: c.opponent,
            caseNo: c.internalCode,
            agencyNumber: c.agencyNumber || '-',
            agencyDate: c.agencyDate || null,
            court: c.court,
            date: c.nextSessionDate.split('T')[0],
            day: getDayName(c.nextSessionDate),
            time: new Date(c.nextSessionDate).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'}),
            reference: 'جلسة قادمة',
            notes: '-',
            type: 'session'
         });
      }

      if (assignee.dueDate) {
        rows.push({
          id: `task-${c.id}-${assignee.id}`,
          client: c.clientName,
          opponent: c.opponent,
          caseNo: c.internalCode,
          agencyNumber: c.agencyNumber || '-',
          agencyDate: c.agencyDate || null,
          court: c.court,
          date: assignee.dueDate,
          day: getDayName(assignee.dueDate),
          time: '12:00 م',
          reference: assignee.taskName || 'مهمة إدارية',
          notes: `الوزن: ${assignee.weight}`,
          type: 'task'
        });
      }
    });

    return rows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedEmployeeId, currentUser.id, currentUser.role]);

  const filteredRows = scheduleRows.filter(row => 
    row.caseNo.includes(searchTerm) || 
    row.client.includes(searchTerm) ||
    row.opponent.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-indigo-600" />
            جدول الأعمال الفني
          </h2>
          <p className="text-gray-500 text-sm mt-1">عرض تفصيلي للجلسات والمواعيد والالتزامات المهنية.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           {currentUser.role === 'manager' ? (
             <div className="relative min-w-[200px]">
                <label className="block text-xs font-bold text-gray-500 mb-1">عرض جدول الموظف:</label>
                <div className="relative">
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-gray-700"
                  >
                    {employeesList.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
             </div>
           ) : (
             <div className="flex flex-col justify-end h-full pb-1">
                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg border border-indigo-100">
                   <Lock size={14} />
                   <span className="text-sm font-bold">جدولي الشخصي: {currentUser.name}</span>
                </div>
             </div>
           )}

           <div className="relative min-w-[250px] self-end">
              <input 
                type="text"
                placeholder="بحث في المواعيد..."
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <span className="text-sm font-bold text-gray-600">
             إجمالي السجلات المجدولة: {filteredRows.length}
           </span>
           <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-indigo-600 transition-all" title="طباعة">
                 <Printer size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-indigo-600 transition-all" title="تصدير">
                 <Download size={18} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs font-bold uppercase border-b border-gray-200">
                <th className="px-4 py-4 border-l border-gray-200/50">الموكل</th>
                <th className="px-4 py-4 border-l border-gray-200/50">الخصم</th>
                <th className="px-4 py-4 border-l border-gray-200/50">رقم الملف</th>
                <th className="px-4 py-4 border-l border-gray-200/50">رقم الوكالة</th>
                <th className="px-4 py-4 border-l border-gray-200/50">المحكمة</th>
                <th className="px-4 py-4 border-l border-gray-200/50">التاريخ</th>
                <th className="px-4 py-4 border-l border-gray-200/50">اليوم</th>
                <th className="px-4 py-4 border-l border-gray-200/50">الساعة</th>
                <th className="px-4 py-4 border-l border-gray-200/50">المرجع</th>
                <th className="px-4 py-4">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredRows.length > 0 ? (
                filteredRows.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-indigo-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3 border-l border-gray-100 font-bold text-gray-800">{row.client}</td>
                    <td className="px-4 py-3 border-l border-gray-100 text-gray-600">{row.opponent}</td>
                    <td className="px-4 py-3 border-l border-gray-100 font-mono text-xs font-bold text-indigo-600">{row.caseNo}</td>
                    <td className="px-4 py-3 border-l border-gray-100 font-mono text-xs text-gray-600">{row.agencyNumber}</td>
                    <td className="px-4 py-3 border-l border-gray-100 text-gray-600">{row.court}</td>
                    <td className="px-4 py-3 border-l border-gray-100 font-medium dir-ltr text-right">{new Date(row.date).toLocaleDateString('ar-SA')}</td>
                    <td className="px-4 py-3 border-l border-gray-100 text-gray-600">{row.day}</td>
                    <td className="px-4 py-3 border-l border-gray-100 font-bold text-gray-700 dir-ltr text-right">{row.time}</td>
                    <td className="px-4 py-3 border-l border-gray-100">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${row.type === 'session' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {row.reference}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-[200px]" title={row.notes}>{row.notes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={10} className="px-6 py-12 text-center text-gray-400 bg-white italic">لا توجد سجلات مجدولة حالياً.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
