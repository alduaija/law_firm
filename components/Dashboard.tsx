
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  Briefcase, AlertCircle, Clock, CheckCircle, Scale, Calendar, 
  FileSignature, ClipboardList, Users, Building2, TrendingUp, 
  ArrowUpRight, MoreHorizontal, Activity, Zap, Download
} from 'lucide-react';
import { MOCK_CASES, MOCK_EMPLOYEES, MOCK_CONTRACTS, MOCK_DOC_OPS, MOCK_CLIENTS, MOCK_LEGAL_SERVICES } from '../constants';

// Al-Khorayef Identity Palette
const COLORS = {
  cases: '#9C824A', // Bronze Gold
  contracts: '#1a1a1a', // Black
  documentation: '#6b7280', // Gray
  clients: '#d4c5a5' // Light Sand/Gold
};

const PIE_COLORS = [COLORS.cases, COLORS.contracts, COLORS.documentation, COLORS.clients];

const StatCard = ({ title, count, icon: Icon, trend, trendUp, colorClass, bgClass }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${bgClass} ${colorClass} transition-colors group-hover:bg-[#9C824A] group-hover:text-white`}>
        <Icon size={24} />
      </div>
      {trend && (
         <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-md ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trendUp ? <TrendingUp size={12} className="ml-1" /> : <TrendingUp size={12} className="ml-1 rotate-180" />}
            {trend}
         </div>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{count}</h3>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const operationalMix = [
    { name: 'قضايا جارية', value: MOCK_CASES.length },
    { name: 'عقود نشطة', value: MOCK_CONTRACTS.length },
    { name: 'عمليات توثيق', value: MOCK_DOC_OPS.length },
    { name: 'خدمات قانونية', value: MOCK_LEGAL_SERVICES.length },
  ];

  const workloadData = MOCK_EMPLOYEES.map(e => ({
    name: e.name.split(' ')[0], 
    weight: e.totalWeight
  })).sort((a, b) => b.weight - a.weight);

  const topClients = MOCK_CLIENTS.slice(0, 5).map(c => {
    const caseCount = MOCK_CASES.filter(cs => cs.clientName === c.name).length;
    return { ...c, caseCount };
  });

  const recentActivities = [
    ...MOCK_CONTRACTS.slice(0, 2).map(c => ({ id: c.id, type: 'عقد', title: c.contractNo, sub: c.clientName, status: c.status, date: c.createdAt })),
    ...MOCK_DOC_OPS.slice(0, 2).map(d => ({ id: d.id, type: 'توثيق', title: d.newDocNo, sub: d.subType, status: d.status, date: d.createdAt })),
    ...MOCK_CASES.slice(0, 1).map(cs => ({ id: cs.id, type: 'قضية', title: cs.internalCode, sub: cs.title, status: cs.status, date: '2024-03-20' })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">تحليلات الأداء الرفيع</h2>
          <p className="text-[#9C824A] text-xs font-semibold uppercase tracking-widest mt-1">Alkhorayef Business Intelligence</p>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all">
              <Download size={16} /> استخراج تقرير تنفيذي
           </button>
           <button className="px-5 py-2.5 bg-[#9C824A] text-white rounded-lg text-xs font-bold hover:bg-[#8A6D3B] flex items-center gap-2 shadow-lg shadow-[#9C824A]/20 transition-all">
              <Zap size={16} /> إجراء سريع
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="القضايا النشطة" 
          count={MOCK_CASES.filter(c => c.status !== 'closed').length} 
          icon={Briefcase} 
          colorClass="text-[#9C824A]" 
          bgClass="bg-[#9C824A]/10"
          trend="8%+" 
          trendUp={true} 
        />
        <StatCard 
          title="العقود المسجلة" 
          count={MOCK_CONTRACTS.length} 
          icon={FileSignature} 
          colorClass="text-[#1a1a1a]" 
          bgClass="bg-gray-100"
          trend="12%+" 
          trendUp={true} 
        />
        <StatCard 
          title="عمليات التوثيق" 
          count={MOCK_DOC_OPS.length} 
          icon={ClipboardList} 
          colorClass="text-[#9C824A]" 
          bgClass="bg-[#9C824A]/5"
        />
        <StatCard 
          title="إجمالي العملاء" 
          count={MOCK_CLIENTS.length} 
          icon={Users} 
          colorClass="text-gray-600" 
          bgClass="bg-gray-50"
          trend="2%+" 
          trendUp={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 uppercase tracking-wider">
                <Activity size={18} className="text-[#9C824A]" />
                التوازن التشغيلي
             </h3>
          </div>
          <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operationalMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={105}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={4}
                  stroke="none"
                >
                  {operationalMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontSize: '12px'}} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-black text-gray-900">{operationalMix.reduce((a, b) => a + b.value, 0)}</span>
               <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[2px] mt-1 text-center">إجمالي<br/>السجلات</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-8">
            {operationalMix.map((entry, index) => (
              <div key={index} className="flex flex-col p-3 rounded bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: PIE_COLORS[index % PIE_COLORS.length]}}></div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase">{entry.name}</span>
                </div>
                <span className="text-md font-bold text-gray-800">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 uppercase tracking-wider">
              <Scale size={20} className="text-[#9C824A]"/>
              توزيع الموارد البشرية
            </h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)'}}
                />
                <Bar dataKey="weight" fill="#9C824A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;