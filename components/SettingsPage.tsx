
import React, { useState } from 'react';
import { Save, Bell, HardDrive, Shield, ToggleRight, ToggleLeft } from 'lucide-react';

const SettingsPage = () => {
  const [emailTemplate, setEmailTemplate] = useState(
`مرحباً {{المسؤول_1}}،

نود تذكيرك بموعد الجلسة القادمة للقضية رقم {{رقم_القضية}}
بتاريخ: {{تاريخ_الجلسة}}

يرجى الاستعداد.
نظام إدارة القضايا`
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900">الإعدادات</h2>
        <p className="text-base text-gray-500">تهيئة النظام والتفضيلات.</p>
      </div>

      {/* Google Integration */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
           <HardDrive size={20} className="text-gray-500" />
           <h3 className="font-bold text-gray-800 text-base">Google Drive</h3>
        </div>
        <div className="p-8 space-y-6">
           <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-blue-100 text-blue-600 font-bold text-sm">G</div>
                 <div>
                    <p className="font-semibold text-gray-800 text-base">law-firm@gmail.com</p>
                    <p className="text-xs text-green-600 font-medium mt-1">● متصل</p>
                 </div>
              </div>
              <button className="text-sm text-red-600 hover:text-red-700 font-semibold border border-red-100 bg-white px-4 py-1.5 rounded">إلغاء</button>
           </div>

           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">المجلد الرئيسي</label>
              <select className="w-full p-3 bg-white border border-gray-300 rounded-lg text-base text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                 <option>/My Drive/Legal Cases 2024</option>
                 <option>/My Drive/Archived</option>
              </select>
           </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
           <Bell size={20} className="text-gray-500" />
           <h3 className="font-bold text-gray-800 text-base">الإشعارات</h3>
        </div>
        <div className="p-8 space-y-6">
           <div className="space-y-4">
              <p className="text-sm font-bold text-gray-700">توقيت التذكير</p>
              <div className="flex gap-6">
                 <label className="flex items-center gap-3 text-base text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded w-5 h-5 text-indigo-600 focus:ring-0 border-gray-300" />
                    <span>قبل 7 أيام</span>
                 </label>
                 <label className="flex items-center gap-3 text-base text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded w-5 h-5 text-indigo-600 focus:ring-0 border-gray-300" />
                    <span>قبل يوم واحد</span>
                 </label>
              </div>
           </div>
           
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">قالب البريد الإلكتروني</label>
              <textarea 
                 rows={6}
                 className="w-full p-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-base font-mono text-gray-900 placeholder:text-gray-400"
                 value={emailTemplate}
                 onChange={(e) => setEmailTemplate(e.target.value)}
              />
           </div>
        </div>
      </section>

      {/* Permissions */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
           <Shield size={20} className="text-gray-500" />
           <h3 className="font-bold text-gray-800 text-base">الصلاحيات</h3>
        </div>
        <div className="p-8">
           <div className="space-y-5">
              <div className="flex items-center justify-between">
                 <span className="text-base text-gray-700">حذف القضايا (مدراء فقط)</span>
                 <button className="text-indigo-600"><ToggleRight size={32} /></button>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                 <span className="text-base text-gray-700">حصر المشاهدة حسب القسم</span>
                 <button className="text-gray-300"><ToggleLeft size={32} /></button>
              </div>
           </div>
        </div>
      </section>

      <div className="flex justify-end">
         <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 flex items-center text-base font-bold shadow-sm transition-colors">
            <Save size={18} className="ml-2" />
            حفظ الكل
         </button>
      </div>

    </div>
  );
};

export default SettingsPage;
