
import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import { FiRadio, FiSend, FiAlertCircle, FiCheck, FiInfo, FiUsers, FiTag } from 'react-icons/fi';
import api from '../../services/employeeApi';

export default function BroadcastPage() {
    const { user } = useEmployeeAuth();
    const [broadcasts, setBroadcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        recipients: 'All Employees',
        department: '',
        targetRole: '',
        priority: 'Medium'
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';

    useEffect(() => {
        fetchBroadcasts();
    }, []);

    const fetchBroadcasts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/broadcasts');
            setBroadcasts(res.data);
        } catch (err) {
            console.error("Failed to fetch broadcasts", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            await api.post('/broadcasts', formData);
            setSuccess('Broadcast sent successfully!');
            setFormData({
                title: '',
                message: '',
                recipients: 'All Employees',
                department: '',
                targetRole: '',
                priority: 'Medium'
            });
            fetchBroadcasts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send broadcast');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRevert = async (broadcastId) => {
        if (!replyText[broadcastId]?.trim()) return;
        try {
            await api.post(`/broadcasts/${broadcastId}/reply`, { message: replyText[broadcastId] });
            setReplyText({ ...replyText, [broadcastId]: '' });
            alert('Reverted successfully!');
            fetchBroadcasts();
        } catch (err) {
            alert('Failed to revert');
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'Urgent': return 'bg-red-500 text-white';
            case 'High': return 'bg-orange-500 text-white';
            case 'Medium': return 'bg-blue-500 text-white';
            case 'Low': return 'bg-gray-500 text-white';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                    <FiRadio className="text-indigo-600" /> Broadcast Center
                </h1>
            </div>

            {isAdmin && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <FiSend /> Create New Broadcast
                    </h2>
                    
                    {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2"><FiAlertCircle />{error}</div>}
                    {success && <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg flex items-center gap-2"><FiCheck />{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    required
                                    placeholder="Important Announcement..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select 
                                    name="priority" 
                                    value={formData.priority} 
                                    onChange={handleChange} 
                                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea 
                                name="message" 
                                value={formData.message} 
                                onChange={handleChange} 
                                rows="3"
                                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500"
                                required
                                placeholder="Type your message here..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
                                <select 
                                    name="recipients" 
                                    value={formData.recipients} 
                                    onChange={handleChange} 
                                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="All Employees">All Employees</option>
                                    <option value="Department">Department</option>
                                    <option value="Role">Role</option>
                                    {/* Specific Employees not implemented in UI for simplicity, can be added if needed */}
                                </select>
                            </div>

                            {formData.recipients === 'Department' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Department</label>
                                    <select 
                                        name="department" 
                                        value={formData.department} 
                                        onChange={handleChange} 
                                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="IT">IT</option>
                                        <option value="HR">HR</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Finance">Finance</option>
                                    </select>
                                </div>
                            )}

                            {formData.recipients === 'Role' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                                    <select 
                                        name="targetRole" 
                                        value={formData.targetRole} 
                                        onChange={handleChange} 
                                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="HR">HR</option>
                                        <option value="Manager">Manager</option>
                                        <option value="TeamLead">Team Lead</option>
                                        <option value="Employee">Employee</option>
                                        <option value="Admin">Admin</option>
                                        <option value="SuperAdmin">SuperAdmin</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className={`px-6 py-2 rounded-lg text-white font-medium shadow-md transition-all transform hover:scale-105 ${
                                    submitting ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                }`}
                            >
                                {submitting ? 'Broadcasting...' : 'Send Broadcast'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 min-h-[400px]">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                    <FiRadio className="text-gray-500" /> Recent Broadcasts
                </h2>
                
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading broadcasts...</div>
                ) : broadcasts.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                        <FiInfo className="text-4xl mb-2" />
                        <p>No broadcasts to display</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {broadcasts.map((b) => (
                            <div key={b._id} className="group relative bg-gray-50 hover:bg-white border hover:border-indigo-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        {isAdmin && (
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${getPriorityColor(b.priority)}`}>
                                                {b.priority}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FiUsers /> 
                                            {b.recipients === 'All Employees' ? 'All' : 
                                             b.recipients === 'Department' ? `Dept: ${b.department}` : 
                                             b.recipients === 'Role' ? `Role: ${b.targetRole}` : 'Specific'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(b.createdAt).toLocaleDateString()} {new Date(b.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {b.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">
                                    {b.message}
                                </p>

                                {/* Reverts Section */}
                                <div className="mt-4 space-y-3">
                                    {isAdmin && b.replies?.length > 0 && (
                                        <div className="bg-white/50 p-3 rounded-lg border border-indigo-100">
                                            <h4 className="text-xs font-bold text-indigo-700 uppercase mb-2">Reverts / Replies</h4>
                                            <div className="space-y-2">
                                                {b.replies.map((r, idx) => (
                                                    <div key={idx} className="flex flex-col bg-white p-2 rounded shadow-sm border border-gray-100">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs font-bold text-gray-800">{r.employeeId}</span>
                                                            <span className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 italic">"{r.message}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {!isAdmin && (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Revert here..."
                                                value={replyText[b._id] || ''}
                                                onChange={(e) => setReplyText({ ...replyText, [b._id]: e.target.value })}
                                                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                                            />
                                            <button 
                                                onClick={() => handleRevert(b._id)}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                            >
                                                Revert
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

