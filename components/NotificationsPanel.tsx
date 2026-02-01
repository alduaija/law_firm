
import React from 'react';
import { Bell, Briefcase, Calendar, CheckCircle, CreditCard, Info } from 'lucide-react';

const NotificationsPanel = () => {
  const notifications = [
    {
       id: 1,
       type: 'billing',
       title: 'طلب فوترة مالي جديد',
       message: 'تم استلام طلب إصدار فاتورة لشركة الأمل بمبلغ 100,000 ر.س',
       time: 'منذ دقيقة',
       read: false
    },
    {
       id: 2,
       type: 'alert',
       title: 'تذكير: موعد جلسة عاجلة',
       message: 'جلسة مرافعة لشركة الأمل غداً الساعة 9:00 صباحاً',
       time: 'منذ ساعة',
       read: false
    },
    {
       id: 3,
       type: 'success',
       title: 'اعتماد عقد رسمي',
       message: 'تم تسجيل وتفعيل العقد رقم 2024/005 من قبل سارة حسن.',
       time: 'منذ يوم',
       read: true
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-full max-h-[400px] flex flex-col">
       <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 text-sm">مركز التنبيهات</h3>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">2 تنبيهات جديدة</span>
       </div>
       <div className="overflow-y-auto flex-1 p-2">
          {notifications.map(notif => (
             <div key={notif.id} className={`flex gap-3 p-3 rounded-lg mb-1 transition-colors hover:bg-gray-50 ${!notif.read ? 'bg-indigo-50/40' : ''}`}>
                <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                   notif.type === 'billing' ? 'bg-amber-100 text-amber-600' :
                   notif.type === 'alert' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                   {notif.type === 'billing' ? <CreditCard size={14} /> :
                    notif.type === 'alert' ? <Calendar size={14} /> : <CheckCircle size={14} />}
                </div>
                <div>
                   <h4 className={`text-sm font-bold text-gray-900 ${!notif.read ? 'text-indigo-900' : ''}`}>{notif.title}</h4>
                   <p className="text-xs text-gray-600 mt-0.5 leading-snug">{notif.message}</p>
                   <span className="text-[10px] text-gray-400 mt-2 block">{notif.time}</span>
                </div>
             </div>
          ))}
       </div>
       <button className="p-3 text-center text-xs font-bold text-indigo-600 hover:bg-gray-50 border-t border-gray-100">
          عرض الأرشيف الكامل
       </button>
    </div>
  );
};

export default NotificationsPanel;
