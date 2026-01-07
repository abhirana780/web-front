import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import api from '../../services/employeeApi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiUsers, FiCheckCircle, FiClock, FiTrendingUp, FiActivity, FiShield, FiCpu, FiSpeaker, FiSettings, FiFileText, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import VirtualIDCard from '../../components/EmployeePortal/VirtualIDCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const { user, hasPermission, profile: contextProfile } = useEmployeeAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [showMobileID, setShowMobileID] = useState(false);

  const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';
  const [leaves, setLeaves] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Power Controls State
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [financials, setFinancials] = useState({ totalPayroll: 0, avgSalary: 0 });
  const [deptStats, setDeptStats] = useState({});
  const [meetings, setMeetings] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  
  // Meeting State
  const [newMeeting, setNewMeeting] = useState({ title: '', startTime: '',link: '', targetAudience: 'All' });
  const [meetingLoading, setMeetingLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (employees.length === 0) return alert('No data to export');
    
    const headers = ['Employee ID', 'Name', 'Email', 'Role', 'Department', 'Designation', 'Joining Date', 'Status'];
    const rows = employees.map(e => [
        e.employeeId,
        `${e.firstName} ${e.lastName}`,
        e.email,
        e.role || 'Employee',
        e.department,
        e.designation,
        new Date(e.joinedDate).toLocaleDateString(),
        e.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLeaveAction = async (id, status) => {
    try {
        await api.put(`/leaves/${id}/approve`, { status });
        fetchData();
    } catch (error) {
        alert('Action failed');
    }
  };

  const handleBroadcast = async (e) => {
      e.preventDefault();
      if (!broadcastMsg.trim()) return;
      setBroadcastLoading(true);
      try {
          // Fix: Provide all required fields for Broadcast model
          await api.post('/broadcasts', { 
              title: 'Admin Announcement',
              message: broadcastMsg, 
              type: 'Info',
              recipients: 'All Employees', 
              priority: 'High'
          });
          setBroadcastMsg('');
          alert('Broadcast sent successfully!');
      } catch (error) {
          console.error(error);
          alert(error.response?.data?.message || 'Failed to send broadcast');
      } finally {
          setBroadcastLoading(false);
      }
  };

  const handleScheduleMeeting = async (e) => {
      e.preventDefault();
      setMeetingLoading(true);
      try {
          await api.post('/meetings', newMeeting);
          alert('Meeting Scheduled!');
          setNewMeeting({ title: '', startTime: '', link: '', targetAudience: 'All', department: '' });
          fetchData();
      } catch (error) {
          console.error(error);
          alert(error.response?.data?.message || 'Failed to schedule meeting');
      } finally {
          setMeetingLoading(false);
      }
  };

  const fetchData = async () => {
    try {
      const [empRes, taskRes, analyticsRes, leaveRes, auditRes, meetingRes, broadcastRes] = await Promise.all([
        api.get('/employees'),
        api.get('/tasks'),
        api.get('/tasks/analytics'),
        api.get('/leaves'),
        api.get('/audit?limit=5'),
        api.get('/meetings'),
        api.get('/broadcasts')
      ]);
      setEmployees(empRes.data);
      setTasks(taskRes.data);
      setAnalytics(analyticsRes.data);
      setLeaves(leaveRes.data);
      setRecentActivities(auditRes.data);
      setMeetings(meetingRes.data);
      setBroadcasts(broadcastRes.data);

      // Calculate Financials & Dept Stats
      const totalSalary = empRes.data.reduce((acc, curr) => acc + (curr.salary?.base || 0), 0);
      setFinancials({
          totalPayroll: totalSalary,
          avgSalary: empRes.data.length ? Math.round(totalSalary / empRes.data.length) : 0
      });

      const depts = empRes.data.reduce((acc, curr) => {
          const d = curr.department || 'Unassigned';
          acc[d] = (acc[d] || 0) + 1;
          return acc;
      }, {});
      setDeptStats(depts);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const chartData = {
    labels: ['Total Tasks', 'Completed', 'In Progress', 'To Do'],
    datasets: [
      {
        label: 'Task Statistics',
        data: [
          analytics?.totalTasks || 0,
          analytics?.completedTasks || 0,
          analytics?.inProgressTasks || 0,
          analytics?.todoTasks || 0
        ],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(79, 70, 229)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Task Analytics',
        font: {
          size: 18,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Completed Tasks', value: analytics?.completedTasks || 0, icon: FiCheckCircle, color: 'bg-green-500' },
    { label: 'Pending Leaves', value: leaves.length, icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Upcoming Meetings', value: meetings.length, icon: FiActivity, color: 'bg-indigo-500' }
  ];

  return (
    <>
      <div className="space-y-6 xl:mr-[340px]">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">Admin Command Center</h2>
         <div className="flex space-x-3">
             <button 
                onClick={() => navigate('/employee-portal/activity-logs')}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition"
             >
                 <FiActivity /> <span>Audit Logs</span>
             </button>
             <button 
               onClick={() => navigate('/employee-portal/employees/add')}
               className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-indigo-500/30 transition transform hover:-translate-y-0.5"
             >
                <FiUsers />
                <span>Add Employee</span>
             </button>
         </div>
      </div>

      {/* Announcements Section (Shared) */}
      {broadcasts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">📢</span> Recent Broadcasts & Reverts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {broadcasts.slice(0, 3).map(b => (
                      <div key={b._id} className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 flex flex-col h-full shadow-sm">
                           <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold text-gray-800 text-lg leading-tight">{b.title}</h4>
                               {isAdmin && <span className="text-xs font-bold text-indigo-500 uppercase">{b.priority}</span>}
                           </div>
                           <p className="text-xs text-gray-500 mb-3">{new Date(b.createdAt).toLocaleDateString()} • {b.sentBy}</p>
                           <p className="text-sm text-gray-700 mb-4 bg-white/50 p-2 rounded border border-indigo-50 line-clamp-3">{b.message}</p>
                           
                           <div className="mt-auto pt-3 border-t border-indigo-100">
                               {isAdmin ? (
                                   <>
                                       <p className="text-xs font-bold text-indigo-700 uppercase mb-2">Recent Reverts ({b.replies?.length || 0})</p>
                                       <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                           {b.replies?.length > 0 ? (
                                               b.replies.slice(-3).map((r, idx) => (
                                                   <div key={idx} className="bg-white p-2 rounded text-xs shadow-sm border border-gray-100">
                                                       <div className="flex justify-between mb-1">
                                                           <span className="font-bold text-indigo-600 truncate">{r.employeeId}</span>
                                                           <span className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                       </div>
                                                       <p className="text-gray-600 italic">"{r.message}"</p>
                                                   </div>
                                               ))
                                           ) : (
                                               <p className="text-[10px] text-gray-400 italic">No reverts yet.</p>
                                           )}
                                       </div>
                                   </>
                               ) : (
                                   <div className="flex gap-2">
                                       <input 
                                           type="text" 
                                           placeholder="Revert here..."
                                           value={replyText[b._id] || ''}
                                           onChange={(e) => setReplyText({ ...replyText, [b._id]: e.target.value })}
                                           className="flex-1 text-xs border border-indigo-200 rounded px-2 py-1 outline-none shadow-inner"
                                       />
                                       <button 
                                           onClick={() => handleRevert(b._id)}
                                           className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                                       >
                                           Revert
                                       </button>
                                   </div>
                               )}
                           </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Power Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Financial & Workforce Overview */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-800 text-white rounded-xl shadow-xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <FiFileText size={100} />
             </div>
             <h3 className="text-lg font-bold flex items-center mb-4 text-indigo-200">
                 Financial & Org Overview
             </h3>
             <div className="space-y-4">
                 <div className="flex justify-between items-end border-b border-indigo-700/50 pb-2">
                     <span className="text-indigo-200 text-sm">Est. Monthly Payroll</span>
                     <span className="text-2xl font-bold">${financials.totalPayroll.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-indigo-700/50 pb-2">
                     <span className="text-indigo-200 text-sm">Avg. Base Salary</span>
                     <span className="text-xl font-semibold">${financials.avgSalary.toLocaleString()}</span>
                 </div>
                 <div className="pt-2">
                     <p className="text-indigo-200 text-xs uppercase font-bold mb-2">Top Departments</p>
                     <div className="flex flex-wrap gap-2">
                         {Object.entries(deptStats).slice(0, 4).map(([dept, count]) => (
                             <span key={dept} className="bg-indigo-800/50 px-2 py-1 rounded text-xs border border-indigo-600/50">
                                 {dept}: {count}
                             </span>
                         ))}
                     </div>
                 </div>
             </div>
          </div>

          {/* Admin Toolkit & Broadcast */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3">
                    <FiSettings className="mr-2 text-indigo-600" /> Admin Toolkit
                </h3>
                 <div className="grid grid-cols-2 gap-3 mb-4">
                      <button 
                        onClick={handleExportCSV}
                        className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-lg border border-gray-200 transition text-sm font-medium"
                      >
                          <FiFileText className="mb-1 text-lg" /> Export Data
                      </button>
                      <button 
                        onClick={() => navigate('/employee-portal/payroll')} 
                        className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-lg border border-gray-200 transition text-sm font-medium"
                      >
                          <FiTrendingUp className="mb-1 text-lg" /> Payroll Review
                      </button>
                 </div>
              </div>
              
              <div className="mt-2 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Quick Broadcast</h4>
                   <form onSubmit={handleBroadcast} className="flex space-x-2">
                      <input 
                        value={broadcastMsg}
                        onChange={(e) => setBroadcastMsg(e.target.value)}
                        placeholder="Announce something..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                      <button 
                        type="submit" 
                        disabled={broadcastLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm shadow-md"
                      >
                          <FiSpeaker />
                      </button>
                  </form>
              </div>
          </div>

          {/* Targeted Meeting Scheduler */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                  <FiClock className="mr-2 text-purple-600" /> Schedule Meeting
              </h3>
              <form onSubmit={handleScheduleMeeting} className="space-y-3">
                  <input 
                      type="text"
                      placeholder="Meeting Title"
                      className="w-full text-sm border border-gray-300 rounded px-3 py-1.5"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                      required
                  />
                  <div className="flex space-x-2">
                      <input 
                          type="datetime-local"
                          className="w-1/2 text-sm border border-gray-300 rounded px-2 py-1.5"
                          value={newMeeting.startTime}
                          onChange={(e) => setNewMeeting({...newMeeting, startTime: e.target.value})}
                          required
                      />
                      <select 
                          className="w-1/2 text-sm border border-gray-300 rounded px-2 py-1.5"
                          value={newMeeting.targetAudience}
                          onChange={(e) => setNewMeeting({...newMeeting, targetAudience: e.target.value})}
                      >
                          <option value="All">All Staff</option>
                          <option value="Department">Department</option>
                      </select>
                  </div>
                  {newMeeting.targetAudience === 'Department' && (
                      <input 
                          type="text" 
                          placeholder="Department Name (e.g. IT)" 
                          className="w-full text-sm border border-gray-300 rounded px-3 py-1.5"
                          value={newMeeting.department || ''}
                          onChange={(e) => setNewMeeting({...newMeeting, department: e.target.value})}
                          required
                      />
                  )}
                  <input 
                      type="url"
                      placeholder="Google Meet Link"
                      className="w-full text-sm border border-gray-300 rounded px-3 py-1.5"
                      value={newMeeting.link}
                      onChange={(e) => setNewMeeting({...newMeeting, link: e.target.value})}
                      required
                  />
                  <button 
                      type="submit"
                      disabled={meetingLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded shadow transition"
                  >
                      {meetingLoading ? 'Scheduling...' : 'Send Invitations'}
                  </button>
              </form>
              
              {/* Upcoming List */}
              <div className="mt-3 border-t pt-3">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Upcoming Meetings</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {meetings.length === 0 ? (
                          <p className="text-[10px] text-gray-400 italic text-center py-2">No meetings scheduled</p>
                      ) : (
                          meetings.slice(0, 5).map(m => (
                              <div key={m._id} className="bg-gray-50 p-2 rounded border border-gray-100 flex flex-col">
                                  <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-bold text-gray-800 truncate">{m.title}</span>
                                      <span className="text-[10px] text-purple-600 font-bold">{new Date(m.startTime).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                      <span className="text-[10px] text-gray-500">{new Date(m.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                      <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded hover:bg-purple-200 font-bold">Join</a>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      </div>

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
                <div className={`${stat.color} p-4 rounded-full text-white shadow-lg transform transition hover:scale-110`}>
                  <Icon className="text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Employees Quick View */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Employees</h3>
          <button onClick={() => navigate('/employee-portal/employees')} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.slice(0, 5).map(emp => (
                <tr key={emp.employeeId} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono">{emp.employeeId}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{emp.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{emp.designation}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      emp.employeeType === 'Permanent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>{emp.employeeType || 'Permanent'}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button 
                       onClick={() => navigate(`/employee-portal/employees/edit/${emp.employeeId}`)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Pending Leave Requests</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {leaves.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending leave requests</p>
            ) : (
              leaves.map((leave) => (
                <div key={leave._id} className="border border-gray-100 bg-gray-50 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">{leave.employeeId}</p>
                      <p className="text-sm text-gray-600 font-medium">{leave.type}</p>
                      <p className="text-xs text-gray-500 italic mt-1">"{leave.reason}"</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <button 
                            onClick={() => handleLeaveAction(leave._id, 'Approved')}
                            className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-600 transition shadow-sm"
                        >
                            Approve
                        </button>
                        <button 
                            onClick={() => handleLeaveAction(leave._id, 'Rejected')}
                            className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600 transition shadow-sm"
                        >
                            Reject
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Tasks</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Title</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Assigned To</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Progress</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map((task) => (
                <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-800">{task.title}</td>
                  <td className="py-3 px-4 text-gray-600">{task.assignedTo}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            task.progress === 100 ? 'bg-green-500' :
                            task.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Floating ID Card - Right Side (XL+ screens) */}
    {contextProfile && (
      <div className="fixed top-20 right-4 w-[340px] hidden xl:block z-30">
        <div className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
              <FiShield className="text-indigo-600" size={12} />
              Admin ID
            </h3>
            <span className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
              VERIFIED
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
        className="fixed bottom-6 right-6 xl:hidden bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-all z-50 flex items-center gap-2"
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
              <FiShield className="text-indigo-600" size={16} />
              Admin ID
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
