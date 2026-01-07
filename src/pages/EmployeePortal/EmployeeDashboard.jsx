import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import api from '../../services/employeeApi';
import { FiCheckCircle, FiClock, FiCalendar, FiFileText, FiPlus, FiX, FiDollarSign, FiUsers, FiActivity, FiTrendingUp, FiShield } from 'react-icons/fi';
import VirtualIDCard from '../../components/EmployeePortal/VirtualIDCard';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user, hasPermission, profile: contextProfile } = useEmployeeAuth();
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [meetings, setMeetings] = useState([]);
  
  // Modal State
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: 'Casual', startDate: '', endDate: '', reason: '' });

  // Broadcast State
  const [broadcasts, setBroadcasts] = useState([]);
  const [replyText, setReplyText] = useState({}); // { broadcastId: text }
  
  // Mobile ID Card State
  const [showMobileID, setShowMobileID] = useState(false);

  useEffect(() => {
    if (user?.employeeId) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user?.employeeId) return;
    
    try {
      const [taskRes, attendanceRes, leaveRes, broadcastRes, meetingRes] = await Promise.all([
        api.get(`/tasks?employeeId=${user.employeeId}`),
        api.get(`/attendance?employeeId=${user.employeeId}`),
        api.get(`/leaves?employeeId=${user.employeeId}`),
        api.get('/broadcasts'),
        api.get('/meetings')
      ]);
      setTasks(taskRes.data);
      setAttendance(attendanceRes.data);
      setLeaves(leaveRes.data);
      setBroadcasts(broadcastRes.data);
      setMeetings(meetingRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRevert = async (broadcastId) => {
    if (!replyText[broadcastId]?.trim()) return;
    try {
        await api.post(`/broadcasts/${broadcastId}/reply`, { message: replyText[broadcastId] });
        setReplyText({ ...replyText, [broadcastId]: '' });
        alert('Reverted successfully!');
        fetchData(); // Refresh to show we replied if needed
    } catch (err) {
        alert('Failed to revert');
    }
  };

  const handlePunchIn = async () => {
    try {
      await api.post('/attendance/punch-in', { employeeId: user.employeeId });
      fetchData();
    } catch (error) {
      console.error('Punch In Error:', error);
      if (error.response?.status === 400) {
          // Likely already punched in, refresh to show correct status
          await fetchData();
      } else {
          alert(error.response?.data?.message || 'Error punching in');
      }
    }
  };

  const handlePunchOut = async () => {
    try {
      await api.post('/attendance/punch-out', { employeeId: user.employeeId });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error punching out');
    }
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', { employeeId: user.employeeId, ...leaveForm });
      setShowLeaveModal(false);
      setLeaveForm({ type: 'Casual', startDate: '', endDate: '', reason: '' });
      fetchData(); // Refresh leaves
    } catch (error) {
      alert(error.response?.data?.message || 'Error applying for leave');
    }
  };

  // Use local date for matching visually, but ensure consistency
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance?.find(a => a.date === todayStr);

  const stats = [
    { label: 'Pending Tasks', value: tasks.filter(t => t.status !== 'Completed').length, icon: FiClock, color: 'bg-blue-500' },
    { label: 'Completed Tasks', value: tasks.filter(t => t.status === 'Completed').length, icon: FiCheckCircle, color: 'bg-green-500' },
    { label: 'Leave Balance (Casual)', value: profile?.leaveBalance?.casual || 0, icon: FiCalendar, color: 'bg-orange-500' },
    { label: 'Leave Balance (Medical)', value: profile?.leaveBalance?.medical || 0, icon: FiPlus, color: 'bg-red-500' }
  ];

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pb-10 xl:mr-[340px]">
      {/* Main Content Area */}
      <div className="xl:col-span-3 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back, {contextProfile?.firstName}!</h2>
            <p className="text-indigo-100 text-lg opacity-90">{contextProfile?.designation}</p>
            <p className="text-sm mt-4 text-white/70">Check your tasks and attendance for today.</p>
          </div>
          <div className="flex justify-between items-end mt-8">
             <div>
                <p className="text-4xl font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-indigo-100">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
             </div>
          </div>
        </div>

      {/* Announcements Section */}
      {broadcasts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">📢</span> Company Announcements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {broadcasts.slice(0, 3).map(b => (
                      <div key={b._id} className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 relative group">
                           <h4 className="font-bold text-gray-800 mb-1 pr-6">{b.title}</h4>
                           <p className="text-xs text-gray-500 mb-2">{new Date(b.createdAt).toLocaleDateString()} • {b.sentBy}</p>
                           <p className="text-sm text-gray-600 mb-3">{b.message}</p>
                           
                           <div className="flex gap-2">
                               <input 
                                   type="text" 
                                   placeholder="Revert here..."
                                   value={replyText[b._id] || ''}
                                   onChange={(e) => setReplyText({ ...replyText, [b._id]: e.target.value })}
                                   className="flex-1 text-xs border border-indigo-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 outline-none"
                               />
                               <button 
                                   onClick={() => handleRevert(b._id)}
                                   className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition"
                               >
                                   Revert
                               </button>
                           </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Meetings Section */}
      {meetings.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">📅</span> Upcoming Meetings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {meetings.slice(0, 3).map(m => (
                      <div key={m._id} className="bg-purple-50 rounded-lg p-4 border border-purple-100 flex flex-col justify-between">
                           <div>
                                <h4 className="font-bold text-gray-800 mb-1">{m.title}</h4>
                                <p className="text-xs text-purple-600 font-semibold mb-2">
                                    {new Date(m.startTime).toLocaleDateString()} @ {new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{m.description || 'No description provided.'}</p>
                           </div>
                           <a 
                                href={m.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block text-center text-xs bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700 transition"
                           >
                               Join Meeting
                           </a>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Dynamic Power Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-full shadow-md`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Dynamic Gated Stats */}
        {hasPermission('view_payroll') && (
            <div className="bg-indigo-900 rounded-xl shadow-lg p-6 text-white border border-indigo-700">
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Base Payout</p>
                    <p className="text-3xl font-black mt-1">${contextProfile?.salary?.base?.toLocaleString() || '---'}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-full">
                     <FiDollarSign className="text-white text-2xl" />
                  </div>
               </div>
               <p className="text-[10px] text-indigo-400 mt-3 italic">Verified by Bank of Wipronix</p>
            </div>
        )}
      </div>

      {/* Org Level Controls (Dynamic) */}
      {(hasPermission('manage_employees') || hasPermission('manage_attendance') || hasPermission('broadcast_messages')) && (
          <div className="bg-[#0f172a] rounded-2xl shadow-xl overflow-hidden p-8 border border-slate-800">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-xl font-bold text-white mb-1">Administrative Control Center</h3>
                   <p className="text-slate-400 text-sm">Elevated access granted based on your current mission profile.</p>
                </div>
                <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                   Active Intelligence
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {hasPermission('manage_employees') && (
                     <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors group">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                              <FiUsers />
                           </div>
                           <p className="text-sm font-bold text-slate-100 italic">Workforce Directory</p>
                        </div>
                        <button 
                            onClick={() => navigate('/employee-portal/employees')}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2.5 rounded-xl transition"
                        >
                            Review Staff Records
                        </button>
                     </div>
                 )}

                 {hasPermission('manage_attendance') && (
                     <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors group">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30">
                              <FiActivity />
                           </div>
                           <p className="text-sm font-bold text-slate-100 italic">Attendance Audit</p>
                        </div>
                        <button 
                            onClick={() => navigate('/employee-portal/attendance')}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2.5 rounded-xl transition"
                        >
                            Sync Timesheets
                        </button>
                     </div>
                 )}

                 {hasPermission('broadcast_messages') && (
                     <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors group">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                              <FiTrendingUp />
                           </div>
                           <p className="text-sm font-bold text-slate-100 italic">Broadcast Terminal</p>
                        </div>
                        <button 
                            onClick={() => navigate('/employee-portal/broadcasts')}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2.5 rounded-xl transition"
                        >
                            Transmit Alert
                        </button>
                     </div>
                 )}
             </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FiClock className="mr-2"/> Attendance</h3>
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="text-center mb-6">
                 <p className="text-gray-500 mb-1">Current Status</p> 
                 <span className={`px-4 py-2 rounded-full text-sm font-bold ${todayAttendance?.punchIn && !todayAttendance?.punchOut ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {todayAttendance?.punchIn && !todayAttendance?.punchOut ? '🟢 On Duty' : '🔴 Off Duty'}
                 </span>
            </div>
            
            <div className="flex space-x-4 w-full justify-center">
              {!todayAttendance?.punchIn ? (
                <button
                  onClick={handlePunchIn}
                  className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition"
                >
                  Punch In
                </button>
              ) : !todayAttendance?.punchOut ? (
                <button
                  onClick={handlePunchOut}
                  className="bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition"
                >
                  Punch Out
                </button>
              ) : (
                <div className="text-center w-full">
                   <div className="grid grid-cols-2 gap-4 text-sm">
                       <div className="bg-white p-3 rounded border">In: {new Date(todayAttendance.punchIn).toLocaleTimeString()}</div>
                       <div className="bg-white p-3 rounded border">Out: {new Date(todayAttendance.punchOut).toLocaleTimeString()}</div>
                   </div>
                   <p className="mt-3 text-indigo-600 font-bold">Total: {todayAttendance.workHours.toFixed(2)} hrs</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leave Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center"><FiCalendar className="mr-2"/> Leaves</h3>
            <button 
                onClick={() => setShowLeaveModal(true)}
                className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-indigo-100"
            >
                + Apply Leave
            </button>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {leaves.length === 0 ? (
                <p className="text-gray-400 text-center py-8 italic">No leave history found.</p>
            ) : (
                leaves.map((leave, i) => (
                    <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition">
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">{leave.type}</p>
                            <p className="text-xs text-gray-500">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {leave.status}
                        </span>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FiFileText className="mr-2"/> My Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.slice(0, 6).map((task) => (
             <div key={task._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-gradient-to-br from-white to-gray-50">
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                        task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                        task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                        'bg-blue-100 text-blue-600'
                    }`}>{task.priority}</span>
                    <span className="text-xs text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1 truncate">{task.title}</h4>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                
                <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${task.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{width: `${task.progress}%`}}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{task.progress}%</span>
                </div>
             </div>
            ))}
        </div>
      </div>

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Apply for Leave</h3>
                    <button onClick={() => setShowLeaveModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24}/></button>
                </div>
                <form onSubmit={submitLeave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                        <select 
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                            value={leaveForm.type}
                            onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})}
                        >
                            <option>Casual</option>
                            <option>Medical</option>
                            <option>Paid</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input 
                                type="date" 
                                required
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                                value={leaveForm.startDate}
                                onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input 
                                type="date" 
                                required
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                                value={leaveForm.endDate}
                                onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea 
                            rows="3"
                            required
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                            placeholder="Reason for leave request..."
                            value={leaveForm.reason}
                            onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg"
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
      )}
      </div>

      {/* Right Sidebar - Virtual ID Card */}
      <div className="xl:col-span-1 hidden xl:block">
        <div className="sticky top-6">
          {contextProfile && (
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Official ID</h3>
                <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <VirtualIDCard employee={contextProfile} />
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Floating ID Card - Right Side */}
      {contextProfile && (
        <div className="fixed top-20 right-4 w-[340px] hidden xl:block z-30">
          <div className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                <FiShield className="text-green-600" size={12} />
                Employee ID
              </h3>
              <span className="bg-green-50 text-green-600 text-[9px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                ACTIVE
              </span>
            </div>
            <VirtualIDCard employee={contextProfile} />
          </div>
        </div>
      )}

      {/* Mobile ID Card Toggle Button (below XL screens) */}
      {contextProfile && (
        <button
          onClick={() => setShowMobileID(!showMobileID)}
          className="fixed bottom-6 right-6 xl:hidden bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 transition-all z-50 flex items-center gap-2"
        >
          <FiShield size={20} />
          <span className="text-xs font-bold">ID</span>
        </button>
      )}

      {/* Mobile ID Card Modal (below XL screens) */}
      {contextProfile && showMobileID && (
        <div className="fixed inset-0 bg-black/50 z-50 xl:hidden flex items-center justify-center p-4" onClick={() => setShowMobileID(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
                <FiShield className="text-green-600" size={16} />
                Employee ID
              </h3>
              <button onClick={() => setShowMobileID(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>
            <VirtualIDCard employee={contextProfile} />
          </div>
        </div>
      )}
    </>
  );
}
