import { useState, useEffect } from 'react';
import api from '../../services/employeeApi';
import { FiActivity, FiFilter } from 'react-icons/fi';

export default function AuditLogPage() {
    const [logs, setLogs] = useState([]);
    const [filterRole, setFilterRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [filterRole]);

    const fetchLogs = async () => {
        try {
            const query = filterRole ? `?role=${filterRole}` : '';
            const res = await api.get(`/audit${query}`);
            setLogs(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch audit logs');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FiActivity className="mr-2" /> System Activity Log
                    </h2>
                    <p className="text-gray-500 text-sm">Monitor actions performed by Admins, HR, Managers, and Employees</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FiFilter className="text-gray-500" />
                    <select 
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="TeamLead">Team Lead</option>
                        <option value="Employee">Employee</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">User</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Resource</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Details</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 text-gray-500">No activity recorded.</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">{log.user?.email || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{log.user?.employeeId}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            log.user?.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                            log.user?.role === 'HR' ? 'bg-pink-100 text-pink-700' :
                                            log.user?.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {log.user?.role || 'System'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-indigo-600">{log.action}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{log.resource}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {log.details ? (
                                            <div className="space-y-1">
                                                {Object.entries(log.details).map(([key, value]) => (
                                                    <div key={key} className="flex gap-1">
                                                        <span className="font-semibold text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                        <span className="text-gray-600 truncate max-w-[200px]" title={String(value)}>
                                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
