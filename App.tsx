
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Settings, Bell, Search, Menu, X, LogOut, UserCircle, RefreshCw, ChevronDown, CalendarDays, FileSignature, ArrowRightLeft, Landmark, FolderKanban, Gavel, ListTodo, ShieldCheck } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CasesList from './components/CasesList';
import CaseDetails from './components/CaseDetails';
import AddCase from './components/AddCase';
import EmployeesList from './components/EmployeesList';
import EmployeeProfile from './components/EmployeeProfile';
import SettingsPage from './components/SettingsPage';
import EmployeeDashboard from './components/EmployeeDashboard';
import ClientsList from './components/ClientsList';
import ClientProfile from './components/ClientProfile';
import ClientDashboard from './components/ClientDashboard';
import SchedulePage from './components/SchedulePage';
import NotificationsPanel from './components/NotificationsPanel';
import OperationsPage from './components/OperationsPage';
import AssignmentsPage from './components/AssignmentsPage';
import LiquidationManagement from './components/LiquidationManagement';
import ProjectManagement from './components/ProjectManagement';
import ExecutionManagement from './components/ExecutionManagement';
import TasksManagement from './components/TasksManagement';

const SidebarItem = ({ icon: Icon, text, path, active }: { icon: any, text: string, path: string, active: boolean }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 mb-1.5 rounded-lg transition-all duration-300 group relative ${
        active 
          ? 'bg-[#9C824A] text-white shadow-lg shadow-[#9C824A]/20' 
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-[#9C824A]'
      }`}
    >
      <Icon size={20} className={`relative z-10 ${active ? 'text-white' : 'text-gray-400 group-hover:text-[#9C824A]'}`} />
      <span className="text-sm font-semibold relative z-10 mr-3">{text}</span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-30"></div>}
    </button>
  );
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'lawyer' | 'client'>('admin'); 
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getPageTitle = () => {
    if (location.pathname === '/') return 'لوحة التحكم الاستراتيجية';
    if (location.pathname.startsWith('/tasks')) return 'إدارة العمليات والمهام';
    if (location.pathname.startsWith('/execution')) return 'إدارة التنفيذ القضائي';
    if (location.pathname.startsWith('/projects')) return 'إدارة المشاريع الاستشارية';
    if (location.pathname.startsWith('/assignments')) return 'إدارة الإسناد المركزي';
    if (location.pathname.startsWith('/liquidation')) return 'الحراسة والتصفية القضائية';
    if (location.pathname.startsWith('/operations')) return 'العقود والعمليات التوثيقية';
    if (location.pathname.startsWith('/cases')) return 'ملفات القضايا';
    if (location.pathname.startsWith('/schedule')) return 'جدول المواعيد الرسمية';
    if (location.pathname.startsWith('/employees')) return 'فريق المستشارين';
    if (location.pathname.startsWith('/clients')) return 'قاعدة الشركاء والعملاء';
    if (location.pathname.startsWith('/settings')) return 'إعدادات النظام السيادية';
    return '';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fcfcfc] font-sans">
      <aside className="hidden lg:flex lg:flex-col w-72 bg-[#121212] border-l border-gray-800 z-30 flex-shrink-0 text-white">
        <div className="h-24 flex items-center px-6 border-b border-gray-800/30">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#9C824A] rounded flex items-center justify-center text-white font-bold text-xl shadow-lg">
                <ShieldCheck size={24} />
             </div>
             <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">الخريف</span>
                <span className="text-[10px] font-medium text-[#9C824A] uppercase tracking-[2px]">محامون ومستشارون</span>
             </div>
           </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
          <div className="mb-10">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-4 px-3 text-right">الخدمات الرئيسية</p>
            <SidebarItem icon={LayoutDashboard} text="لوحة التحكم" path="/" active={isActive('/')} />
            <SidebarItem icon={ListTodo} text="إدارة المهام" path="/tasks" active={isActive('/tasks')} />
            <SidebarItem icon={Gavel} text="إدارة التنفيذ" path="/execution" active={isActive('/execution')} />
            <SidebarItem icon={FolderKanban} text="إدارة المشاريع" path="/projects" active={isActive('/projects')} />
            <SidebarItem icon={ArrowRightLeft} text="إدارة الإسناد" path="/assignments" active={isActive('/assignments')} />
            <SidebarItem icon={Landmark} text="الحراسة والتصفية" path="/liquidation" active={isActive('/liquidation')} />
            <SidebarItem icon={CalendarDays} text="جدول الأعمال" path="/schedule" active={isActive('/schedule')} />
            <SidebarItem icon={FileSignature} text="العقود والعمليات" path="/operations" active={isActive('/operations')} />
            <SidebarItem icon={Briefcase} text="القضايا" path="/cases" active={isActive('/cases')} />
            <SidebarItem icon={UserCircle} text="العملاء" path="/clients" active={isActive('/clients')} />
            <SidebarItem icon={Users} text="الموظفين" path="/employees" active={isActive('/employees')} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-4 px-3 text-right">الإدارة والنظام</p>
            <SidebarItem icon={Settings} text="إعدادات النظام" path="/settings" active={isActive('/settings')} />
          </div>
        </nav>
Alkhorayef
        <div className="p-5 border-t border-gray-800/30 bg-[#0d0d0d]">
          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-all">
            <div className="w-10 h-10 rounded bg-[#9C824A]/10 border border-[#9C824A]/20 flex items-center justify-center text-[#9C824A] font-bold text-sm">أ</div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-sm font-bold text-gray-200 truncate">{userRole === 'admin' ? 'المدير العام' : 'المحامي'}</p>
              <p className="text-[10px] text-gray-500 truncate uppercase">Alkhorayef Legal</p>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-200 z-20 flex-shrink-0">
          <div className="flex items-center">
            <button className="lg:hidden p-2 ml-3 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-900">{getPageTitle()}</h2>
              <p className="text-[10px] text-[#9C824A] font-semibold uppercase tracking-widest">Alkhorayef Lawyers & Consultants</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden md:block">
              <input type="text" placeholder="بحث ذكي في السجلات..." className="pl-4 pr-11 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-1 focus:ring-[#9C824A] focus:border-[#9C824A] w-72 transition-all outline-none text-sm" />
              <Search size={16} className="absolute right-4 top-2.5 text-gray-400" />
            </div>
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg text-gray-500 hover:text-[#9C824A] hover:bg-gray-50 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#9C824A] rounded-full border-2 border-white"></span>
            </button>
            {showNotifications && <div className="absolute left-10 top-20 w-96 z-50 shadow-2xl rounded-xl"><NotificationsPanel /></div>}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#fcfcfc]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TasksManagement />} />
            <Route path="/execution" element={<ExecutionManagement />} />
            <Route path="/projects" element={<ProjectManagement />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/liquidation/*" element={<LiquidationManagement />} />
            <Route path="/operations/*" element={<OperationsPage />} />
            <Route path="/schedule" element={<SchedulePage userRole={userRole} />} />
            <Route path="/cases" element={<CasesList />} />
            <Route path="/cases/:id" element={<CaseDetails />} />
            <Route path="/cases/new" element={<AddCase />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/clients/:clientName" element={<ClientProfile />} />
            <Route path="/employees" element={<EmployeesList />} />
            <Route path="/employees/:id" element={<EmployeeProfile />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
