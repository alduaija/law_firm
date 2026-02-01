
import React from 'react';
import { 
  Briefcase, CheckCircle, Clock, Calendar, AlertCircle, TrendingUp, MoreHorizontal 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { MOCK_CASES, MOCK_EMPLOYEES } from '../constants';
import { STATUS_LABELS, STATUS_COLORS } from '../types';

// Professional Palette
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const StatCard = ({ title, count, icon: Icon, colorClass, subtitle, progress }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
        <Icon size={24} className={colorClass} />
      </div>
      {progress && (
         <span className="text-xs font-bold bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">
            {progress}% إنجاز
         </span>
      )}
    </div>
    <div className="mt-2 relative z-10">
      <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{count}</h3>
      <p className="text-sm text-gray-500 font-medium mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
    <Icon className={`absolute -left-4 -bottom-4 opacity-5 transform rotate-12 ${colorClass}`} size={80} />
  </div>
);

const EmployeeDashboard = () => {
  // Simulate Logged In User (Ahmed Ali - ID emp2)
  const currentUserId = 'emp2';
  const currentUser = MOCK_EMPLOYEES.find(e => e.id === currentUserId);
  
  const myCases = MOCK_CASES.filter(c => c.assignees.some(a => a.id === currentUserId));
  
  const myTasks = myCases.map(c => {
    const assignment = c.assignees.find(a => a.id === currentUserId);
    return {
      caseId: c.id,
      caseTitle: c.title,
      internalCode: c.internalCode,
      taskName: assignment?.taskName || 'لم تحدد مهمة',
      dueDate: assignment?.dueDate,
      weight: assignment?.weight || 0,
      status: c.status
    };
  });

  const activeCasesCount = myCases.filter(c => c.status === 'new' || c.status === 'in_progress').length;
  const completedCount = myCases.filter(c => c.status === 'completed').length;
  const totalWeight = currentUser?.totalWeight || 0;
  
  const completionRate = myTasks.length > 0 
    ? Math.round((completedCount / myTasks.length) * 100) 
    : 0;

  const statusData = [
    { name: 'مكتملة', value: myTasks.filter(t => t.status === 'completed').length },
    { name: 'جارية', value: myTasks.filter(t => t.status === 'in_progress').length },
    { name: 'جديدة', value: myTasks.filter(t => t.status === 'new').length },
  ].filter(d => d.value > 0);

  const effortData = myTasks.slice(0, 5).map(t => ({
    name: t.internalCode,
    weight: t.weight,
    fullTitle: t.caseTitle
  }));

  const mySessions = myCases
    .filter(c => c.nextSessionDate)
    .sort((a, b) => new Date(a.nextSessionDate).getTime() - new Date(b.nextSessionDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-gray-900">مرحباً، أستاذ {currentUser?.name.split(' ')[0]} 👋</h2>
            <p className="text-gray-500 mt-1">إليك نظرة تحليلية على أدائك ومهامك المسندة إليك حالياً.</p>
         </div>
         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-semibold text-gray-600">
            <Calendar size={16} className="text-indigo-600" />
            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="القضايا النشطة" 
          count={activeCasesCount} 
          icon={Briefcase} 
          colorClass="text-indigo-600" 
          subtitle="ملفات قيد العمل والمتابعة"
        />
        <StatCard 
          title="نقاط المجهود (الوزن)" 
          count={totalWeight} 
          icon={TrendingUp} 
          colorClass="text-amber-500" 
          subtitle="إجمالي أوزان المهام الحالية"
        />
        <StatCard 
          title="نسبة الإنجاز الفني" 
          count={`%${completionRate}`} 
          icon={CheckCircle} 
          colorClass="text-emerald-500" 
          progress={completionRate}
          subtitle="بناءً على المهام المغلقة والمكتملة"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">تحليل حالة المهام</h3>
              <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
           </div>
           <div className="flex-1 min-h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={statusData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                 <span className="text-3xl font-bold text-gray-800">{myTasks.length}</span>
                 <span className="text-xs text-gray-400 font-bold">إجمالي</span>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">توزيع الجهد الفني</h3>
           </div>
           <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={effortData} barSize={30} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip 
                       cursor={{fill: '#f9fafb'}}
                       content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                             const data = payload[0].payload;
                             return (
                                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-right">
                                   <p className="font-bold text-gray-900 text-sm mb-1">{data.fullTitle}</p>
                                   <p className="text-indigo-600 text-xs font-bold">وزن المهمة: {data.weight}</p>
                                </div>
                             );
                          }
                          return null;
                       }}
                    />
                    <Bar dataKey="weight" fill="#6366f1" radius={[0, 4, 4, 0]} background={{ fill: '#f9fafb' }} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
               <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <CheckCircle size={20} className="text-indigo-600" />
                  المهام العاجلة والقادمة
               </h3>
               <span className="text-xs font-bold bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-600">
                  {myTasks.length} مهام
               </span>
            </div>
            <div className="divide-y divide-gray-100">
               {myTasks.slice(0, 5).map((task, idx) => (
                  <div key={idx} className="p-5 hover:bg-gray-50 transition-colors group">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start gap-3">
                           <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                           <div>
                              <h4 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition-colors">{task.taskName}</h4>
                              <p className="text-xs text-gray-400 mt-1">{task.internalCode} - {task.caseTitle}</p>
                           </div>
                        </div>
                        {task.dueDate && (
                           <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
                              {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                           </span>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-indigo-50/30">
               <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Calendar size={20} className="text-indigo-600" />
                  جلسات ومواعيد قريبة
               </h3>
            </div>
            <div className="p-4 space-y-4">
               {mySessions.map((session, idx) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-lg border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all bg-white">
                     <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg w-14 h-14 shrink-0 border border-gray-200">
                        <span className="text-xs font-bold text-gray-500">{new Date(session.nextSessionDate).toLocaleDateString('ar-SA', { month: 'short' })}</span>
                        <span className="text-xl font-bold text-indigo-600">{new Date(session.nextSessionDate).toLocaleDateString('ar-SA', { day: 'numeric' })}</span>
                     </div>
                     <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-gray-900 text-sm truncate" title={session.title}>{session.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                           <Clock size={12} />
                           <span>{new Date(session.nextSessionDate).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 truncate">{session.court}</div>
                     </div>
                  </div>
               ))}
               {mySessions.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">لا توجد مواعيد مجدولة حالياً.</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
