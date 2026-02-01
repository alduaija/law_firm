
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Save, UserPlus, Scale, Briefcase, Building2, Gavel, User, Trash2, Calendar, CheckSquare, FileSignature } from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_CONTRACTS } from '../constants';
import { DEPARTMENTS, ClientRole, CLIENT_ROLES } from '../types';

interface AssignedMember {
  id: string;
  name: string;
  role: string;
  weight: number;
  taskName: string;
  dueDate: string;
}

const AddCase = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    internalCode: '',
    clientName: '',
    clientRole: 'plaintiff' as ClientRole,
    contractId: '', // New field for contract linking
    department: 'financial',
    court: '',
    opponent: '',
    description: ''
  });

  const [assignments, setAssignments] = useState<AssignedMember[]>([]);
  
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [weightInput, setWeightInput] = useState<number>(5);
  const [taskNameInput, setTaskNameInput] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');

  const totalWeight = assignments.reduce((acc, curr) => acc + curr.weight, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = () => {
    if (!selectedEmpId) return;
    const employee = MOCK_EMPLOYEES.find(e => e.id === selectedEmpId);
    if (!employee) return;
    if (assignments.some(a => a.id === employee.id)) return;

    setAssignments([...assignments, {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      weight: weightInput,
      taskName: taskNameInput,
      dueDate: dueDateInput
    }]);

    setSelectedEmpId('');
    setWeightInput(5);
    setTaskNameInput('');
    setDueDateInput('');
  };

  const handleRemoveMember = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/cases');
  };

  const inputBaseClasses = "w-full px-5 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none placeholder:text-gray-400";
  const labelBaseClasses = "block text-sm font-bold text-gray-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <button onClick={() => navigate('/cases')} className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors text-sm font-bold mb-3 group">
            <ArrowRight size={16} className="ml-1 group-hover:-mr-1 transition-all" />
            رجوع للقائمة
          </button>
          <h2 className="text-2xl font-bold text-gray-900">إنشاء قضية جديدة</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-base font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">البيانات الأساسية</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className={labelBaseClasses}>عنوان القضية <span className="text-rose-500">*</span></label>
              <input type="text" name="title" required className={inputBaseClasses} value={formData.title} onChange={handleInputChange} placeholder="مثال: دعوى تجارية ضد شركة..." />
            </div>

            <div>
              <label className={labelBaseClasses}>رقم القضية (Reference)</label>
              <input type="text" name="internalCode" required className={`${inputBaseClasses} font-mono`} value={formData.internalCode} onChange={handleInputChange} placeholder="2024-XXX" />
            </div>

            <div>
              <label className={labelBaseClasses}>الربط مع عقد موجود</label>
              <div className="relative">
                 <select name="contractId" className={`${inputBaseClasses} pr-10`} value={formData.contractId} onChange={handleInputChange}>
                    <option value="">لا يوجد ارتباط (قضية مستقلة)</option>
                    {MOCK_CONTRACTS.map(cnt => <option key={cnt.id} value={cnt.id}>{cnt.contractNo} - {cnt.clientName}</option>)}
                 </select>
                 <FileSignature size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelBaseClasses}>الوصف وملخص القضية</label>
              <textarea name="description" rows={4} className={inputBaseClasses} value={formData.description} onChange={handleInputChange} placeholder="اكتب وصفاً مختصراً للقضية..." />
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-base font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">الأطراف المعنية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelBaseClasses}>اسم العميل</label>
              <input type="text" name="clientName" required className={inputBaseClasses} value={formData.clientName} onChange={handleInputChange} />
            </div>
            <div>
              <label className={labelBaseClasses}>صفة العميل</label>
              <select name="clientRole" className={inputBaseClasses} value={formData.clientRole} onChange={handleInputChange}>
                {Object.entries(CLIENT_ROLES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button type="button" onClick={() => navigate('/cases')} className="px-8 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 text-base font-semibold">إلغاء</button>
          <button type="submit" className="px-8 py-3 rounded-lg bg-indigo-600 text-white text-base font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Save size={20} />
            حفظ البيانات
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCase;
