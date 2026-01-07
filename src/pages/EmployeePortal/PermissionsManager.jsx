import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import api from '../../services/employeeApi';
import { FiShield, FiCheck, FiX, FiSearch, FiUser, FiSliders, FiAlertCircle } from 'react-icons/fi';

const PERMISSIONS_LIST = [
    // Staff & Org
    { id: 'manage_employees', label: 'Employee Lifecycle', description: 'Hire, fire, and edit all staff records', category: 'Core' },
    { id: 'manage_tasks', label: 'Global Tasking', description: 'Assign and oversee work across all departments', category: 'Core' },
    { id: 'manage_attendance', label: 'Attendance Audit', description: 'Full control over clock-in/out logs', category: 'Core' },
    { id: 'manage_leaves', label: 'Leave Authority', description: 'Final approval/rejection on all time-off', category: 'Core' },
    
    // Communication
    { id: 'broadcast_messages', label: 'System Broadcast', description: 'Send high-priority global announcements', category: 'Advanced' },
    { id: 'manage_chat', label: 'Chat Oversight', description: 'Monitor and moderate internal communications', category: 'Advanced' },
    { id: 'manage_notifications', label: 'Notice Board', description: 'Manage official company notices', category: 'Advanced' },

    // Financial & Operations
    { id: 'view_payroll', label: 'Payroll Intelligence', description: 'Access granular financial and salary metrics', category: 'Finance' },
    { id: 'process_payments', label: 'Payment Execution', description: 'Ability to trigger salary processing', category: 'Finance' },
    { id: 'view_analytics', label: 'Performance Analytics', description: 'View CEO-level organizational reporting', category: 'Finance' },

    // Security & Data
    { id: 'view_audit_logs', label: 'Security Auditor', description: 'Access to system-wide forensic activity logs', category: 'Security' },
    { id: 'manage_documents', label: 'Document Custodian', description: 'Manage sensitive company files and contracts', category: 'Security' },
    { id: 'system_settings', label: 'Core Configuration', description: 'Adjust system-wide logic and integrations', category: 'Security' },
    { id: 'manage_calendar', label: 'Event Master', description: 'Control company-wide events and holidays', category: 'Security' }
];

const ROLES = ['Admin', 'HR', 'Manager', 'TeamLead', 'Employee'];

export default function PermissionsManager() {
    const { user } = useEmployeeAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (error) {
            console.error('Failed to fetch employees', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePermission = (permissionId) => {
        if (!selectedEmployee) return;
        const currentPerms = selectedEmployee.permissions || [];
        const newPerms = currentPerms.includes(permissionId)
            ? currentPerms.filter(p => p !== permissionId)
            : [...currentPerms, permissionId];
        
        setSelectedEmployee({ ...selectedEmployee, permissions: newPerms });
    };

    const savePermissions = async () => {
        setSaving(true);
        try {
            await api.put(`/employees/${selectedEmployee.employeeId}/permissions`, {
                permissions: selectedEmployee.permissions,
                role: selectedEmployee.role,
                active: selectedEmployee.active
            });
            setMessage({ type: 'success', text: 'Permissions updated successfully!' });
            fetchEmployees();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update permissions.' });
        } finally {
            setSaving(false);
        }
    };

    const filteredEmployees = employees.filter(emp => 
        (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (user.role !== 'Admin' && user.role !== 'SuperAdmin') {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <FiAlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
                <p className="text-gray-500 mt-2">Only system administrators can manage global permissions.</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Access Authority</h2>
                    <p className="text-slate-500 font-medium mt-1 italic">Define the digital boundaries of your organization.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Find staff ID or name..."
                            className="w-full md:w-80 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Employee Navigation */}
                <div className="xl:col-span-1 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-[700px] overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Personnel List</span>
                        <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600">
                            {filteredEmployees.length} Units
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
                        {loading ? (
                            <div className="p-12 text-center flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Fetching Assets...</p>
                            </div>
                        ) : filteredEmployees.map(emp => (
                            <div 
                                key={emp.employeeId}
                                onClick={() => setSelectedEmployee({ ...emp })}
                                className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                                    selectedEmployee?.employeeId === emp.employeeId 
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg translate-x-1' 
                                    : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50 text-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-colors ${
                                        selectedEmployee?.employeeId === emp.employeeId ? 'border-indigo-400/50 bg-indigo-500' : 'border-slate-100 bg-slate-50 group-hover:bg-white'
                                    } overflow-hidden shrink-0`}>
                                        {emp.profileImage ? (
                                            <img src={emp.profileImage} className="w-full h-full object-cover" />
                                        ) : (
                                            <FiUser size={20} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black truncate leading-tight uppercase tracking-tight">{emp.firstName} {emp.lastName}</p>
                                        <p className={`text-[10px] font-bold mt-0.5 ${selectedEmployee?.employeeId === emp.employeeId ? 'text-indigo-200' : 'text-slate-400'}`}>
                                            {emp.employeeId} • {emp.role}
                                        </p>
                                    </div>
                                    {emp.active === false && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuration Panel */}
                <div className="xl:col-span-3 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col h-[700px] overflow-hidden">
                    {selectedEmployee ? (
                        <>
                            <div className="p-8 border-b border-slate-50 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-indigo-600 shadow-2xl shadow-indigo-200 flex items-center justify-center text-white shrink-0 transform -rotate-3">
                                        <FiShield size={36} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                           Authority Profile: {selectedEmployee.firstName}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                                {selectedEmployee.role}
                                            </div>
                                            <span className="text-xs text-slate-400 font-bold">Internal ID: {selectedEmployee.employeeId}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-100/50 p-4 rounded-3xl border border-slate-200/50 flex flex-col gap-4 w-full md:w-auto">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Global Designation</label>
                                        <select 
                                            className="bg-white text-xs font-bold border-slate-200 rounded-xl px-4 py-2 focus:ring-indigo-500 outline-none w-full"
                                            value={selectedEmployee.role}
                                            onChange={(e) => setSelectedEmployee({ ...selectedEmployee, role: e.target.value })}
                                        >
                                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[10px] font-black text-slate-500 uppercase">System Clearance</span>
                                        <label className="relative inline-flex items-center cursor-pointer scale-90">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedEmployee.active !== false}
                                                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, active: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8 bg-slate-50/20">
                                {['Core', 'Finance', 'Security', 'Advanced'].map(cat => (
                                    <div key={cat} className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">{cat} Permissions</h4>
                                            <div className="h-px bg-slate-100 flex-1"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {PERMISSIONS_LIST.filter(p => p.category === cat).map(perm => {
                                                const isGranted = (selectedEmployee.permissions || []).includes(perm.id) || 
                                                                 ['Admin', 'SuperAdmin'].includes(selectedEmployee.role);
                                                const isHardcoded = ['Admin', 'SuperAdmin'].includes(selectedEmployee.role);

                                                return (
                                                    <div 
                                                        key={perm.id}
                                                        onClick={() => !isHardcoded && handleTogglePermission(perm.id)}
                                                        className={`p-4 rounded-2xl border-2 transition-all duration-300 group flex items-start gap-3 relative ${
                                                            isGranted 
                                                            ? 'border-indigo-100 bg-white shadow-md shadow-indigo-100/20' 
                                                            : 'border-slate-100/50 bg-white/50 hover:bg-white hover:border-slate-200 grayscale'
                                                        } ${isHardcoded ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                                    >
                                                        <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ${
                                                            isGranted ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-300'
                                                        }`}>
                                                            {isGranted ? <FiCheck size={16} strokeWidth={3} /> : <FiX size={16} />}
                                                        </div>
                                                        <div className="min-w-0 pr-6">
                                                            <p className={`text-xs font-black ${isGranted ? 'text-slate-900' : 'text-slate-500'}`}>
                                                                {perm.label}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 mt-1 leading-tight font-medium">
                                                                {perm.description}
                                                            </p>
                                                        </div>
                                                        {isHardcoded && (
                                                            <div className="absolute top-2 right-2 flex gap-1">
                                                                <div className="bg-indigo-100 text-indigo-600 p-1 rounded-lg">
                                                                   <FiShield size={10} />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-white relative z-10">
                                <div className="flex gap-4">
                                     <button 
                                        onClick={() => setSelectedEmployee(null)}
                                        className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs rounded-2xl transition-all uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        disabled={saving}
                                        onClick={savePermissions}
                                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-10 py-3 rounded-2xl font-black text-xs shadow-2xl shadow-indigo-200 transition transform active:scale-95 flex items-center gap-3 uppercase tracking-widest"
                                    >
                                        {saving ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : <><FiSliders /> Sync Authority</>}
                                    </button>
                                </div>
                                {message && (
                                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600 animate-bounce'}`}>
                                        {message.type === 'success' ? <FiCheck size={18} /> : <FiAlertCircle size={18} />}
                                        {message.text}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-slate-50/30">
                            <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl shadow-indigo-100 flex items-center justify-center mb-8 transform rotate-6 hover:rotate-0 transition-transform duration-700 border border-slate-100">
                                <FiShield size={64} className="text-indigo-100" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 leading-tight">Authority Vault</h3>
                            <p className="text-slate-400 mt-4 max-w-sm font-medium leading-relaxed">
                                Personnel selection required for clearance modification. <br/>
                                <span className="text-indigo-600/50 font-black text-[10px] uppercase tracking-widest mt-4 block">Awaiting Target Selection</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
