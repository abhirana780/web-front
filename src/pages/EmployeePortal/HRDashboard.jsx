import { useState, useEffect } from 'react';
import api from '../../services/employeeApi';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { FiUsers, FiClock, FiCalendar, FiUserCheck, FiUserX, FiBriefcase, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import VirtualIDCard from '../../components/EmployeePortal/VirtualIDCard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function HRDashboard() {
  const navigate = useNavigate();
  const { user, profile: contextProfile } = useEmployeeAuth();
  const [employees, setEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [issuedLeaves, setIssuedLeaves] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0, onLeave: 0 });
  const [loading, setLoading] = useState(true);
  
  // Personal Attendance State
  const [userAttendance, setUserAttendance] = useState(null);
  const [punchLoading, setPunchLoading] = useState(false);

  // Broadcast State
  const [broadcasts, setBroadcasts] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [empRes, leaveRes, attendanceRes, myAttendanceRes, broadcastRes, meetingRes, profileRes] = await Promise.all([
        api.get('/employees'),
        api.get('/leaves'),
        api.get(`/attendance?date=${today}`),
        api.get(`/attendance?employeeId=${user.employeeId}&date=${today}`), // Get personal attendance
        api.get('/broadcasts'),
        api.get('/meetings'),
        api.get(`/employees/${user.employeeId}`)
      ]);

      const allEmployees = empRes.data;
      const allLeaves = leaveRes.data;
      const attendance = attendanceRes.data;

      setEmployees(allEmployees);
      setBroadcasts(broadcastRes.data);
      setMeetings(meetingRes.data);
      setProfile(profileRes.data);
      
      const pending = allLeaves.filter(l => l.status === 'Pending');
      setPendingLeaves(pending);

      const issued = allLeaves.filter(l => l.status === 'Approved').sort((a, b) => new Date(b.approvedAt || b.createdAt) - new Date(a.approvedAt || a.createdAt)).slice(0, 5);
      setIssuedLeaves(issued);

      // Simple Calculation for Today's Stats
      const presentCount = attendance.length;
      const onLeaveCount = allLeaves.filter(l => {
          const start = new Date(l.startDate).toISOString().split('T')[0];
          const end = new Date(l.endDate).toISOString().split('T')[0];
          return l.status === 'Approved' && start <= today && end >= today;
      }).length;
      
      const absentCount = Math.max(0, allEmployees.length - presentCount - onLeaveCount);

      setAttendanceStats({ present: presentCount, absent: absentCount, onLeave: onLeaveCount });
      
      // Personal Attendance
      if (myAttendanceRes.data && myAttendanceRes.data.length > 0) {
          setUserAttendance(myAttendanceRes.data[0]);
      } else {
          setUserAttendance(null);
      }

      setLoading(false);

    } catch (error) {
      console.error('Error fetching HR data:', error);
      setLoading(false);
    }
  };

  const handleRevert = async (broadcastId) => {
    if (!replyText[broadcastId]?.trim()) return;
    try {
        await api.post(`/broadcasts/${broadcastId}/reply`, { message: replyText[broadcastId] });
        setReplyText({ ...replyText, [broadcastId]: '' });
        alert('Reverted successfully!');
        fetchData();
    } catch (err) {
        alert('Failed to revert');
    }
  };

  const handlePunch = async (type) => { // 'in' or 'out'
      setPunchLoading(true);
      const today = new Date().toISOString().split('T')[0];
      try {
          if (type === 'in') {
              await api.post('/attendance/punch-in', { employeeId: user.employeeId });
          } else {
              await api.post('/attendance/punch-out', { employeeId: user.employeeId });
          }
          
          const res = await api.get(`/attendance?employeeId=${user.employeeId}&date=${today}`);
          if (res.data && res.data.length > 0) {
              setUserAttendance(res.data[0]);
          }
          // Update global stats
          const globalRes = await api.get(`/attendance?date=${today}`);
          setAttendanceStats(prev => ({ ...prev, present: globalRes.data.length }));

      } catch (error) {
          console.error("Punch failed", error);
          alert(error.response?.data?.message || 'Punch failed');
      } finally {
          setPunchLoading(false);
      }
  };

  const handleLeaveAction = async (id, status) => {
    try {
        await api.put(`/leaves/${id}/approve`, { status });
        fetchData(); 
    } catch (error) {
        alert('Action failed');
    }
  };

  const pieData = {
    labels: ['Present', 'Absent', 'On Leave'],
    datasets: [
      {
        data: [attendanceStats.present, attendanceStats.absent, attendanceStats.onLeave],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Green
          'rgba(239, 68, 68, 0.8)',  // Red
          'rgba(245, 158, 11, 0.8)', // Orange
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: FiUsers, color: 'bg-blue-600' },
    { label: 'Pending Leaves', value: pendingLeaves.length, icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Present Today', value: attendanceStats.present, icon: FiUserCheck, color: 'bg-green-600' },
    { label: 'On Leave Today', value: attendanceStats.onLeave, icon: FiBriefcase, color: 'bg-orange-500' }
  ];

  return (
    <>
      <div className="space-y-6 xl:mr-[340px]">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div>
                  <h2 className="text-3xl font-bold mb-2">HR Dashboard</h2>
                  <p className="text-blue-100 text-sm">Manage workforce, leaves, and attendance.</p>
                  

                </div>
               <div className="flex items-center space-x-3">
                   <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center space-x-3 backdrop-blur-sm border border-white/20">
                      <div className={`w-3 h-3 rounded-full ${userAttendance ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-white">
                          {userAttendance ? `In: ${new Date(userAttendance.checkIn || userAttendance.punchIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Not Checked In'}
                      </span>
                      {!userAttendance ? (
                          <button onClick={() => handlePunch('in')} disabled={punchLoading} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded transition shadow-md font-bold">Punch In</button>
                      ) : !userAttendance.checkOut && !userAttendance.punchOut && (
                          <button onClick={() => handlePunch('out')} disabled={punchLoading} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded transition shadow-md font-bold">Punch Out</button>
                      )}
                   </div>
                   <button onClick={() => navigate('/employee-portal/tasks')} className="bg-white text-indigo-600 px-4 py-2 rounded-lg flex items-center space-x-2 font-bold shadow-md hover:bg-gray-50 transition">
                       <span>Assign Tasks</span>
                   </button>
               </div>
            </div>
            <div className="mt-8 flex items-end justify-between">
                <div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-mono text-white/90 border border-white/30">
                        Today: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>
        </div>

        <div className="lg:col-span-1 xl:hidden flex justify-center lg:block">
            {contextProfile && <VirtualIDCard employee={contextProfile} />}
        </div>
      </div>

      {/* Virtual ID Card Section */}
      {contextProfile && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <FiUserCheck className="text-blue-600" />
              HR Personnel Badge
            </h3>
            <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Authorized
            </span>
          </div>
          <div className="flex justify-center">
            <VirtualIDCard employee={contextProfile} />
          </div>
        </div>
      )}

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
                                   className="flex-1 text-xs border border-indigo-200 rounded px-2 py-1 outline-none"
                               />
                               <button 
                                   onClick={() => handleRevert(b._id)}
                                   className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
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

      {/* Stats Cards */}
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
                <div className={`${stat.color} p-4 rounded-full text-white shadow-lg`}>
                  <Icon className="text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Analysis - Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1 border border-indigo-50">
           <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
               <FiUserCheck className="mr-2 text-indigo-600"/> Attendance Analysis
           </h3>
           <div className="h-64 flex justify-center items-center">
               {loading ? <p>Loading...</p> : <Pie data={pieData} />}
           </div>
           <div className="mt-4 text-center text-sm text-gray-500">
               Today's workforce distribution
           </div>
        </div>

        {/* Pending Leaves & Recent Issued Leaves */}
        <div className="lg:col-span-2 space-y-6">
            {/* Pending Leaves */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-50">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FiClock className="mr-2 text-yellow-500"/> Pending Leave Requests
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {pendingLeaves.length === 0 ? (
                  <p className="text-gray-400 italic text-center py-4">No pending requests.</p>
                ) : (
                  pendingLeaves.map((leave) => (
                    <div key={leave._id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 transition">
                       <div>
                         <p className="font-bold text-gray-800">{leave.employeeId}</p>
                         <p className="text-sm text-gray-600 font-medium">{leave.type}</p>
                         <p className="text-xs text-gray-500">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                         <p className="text-xs text-gray-500 mt-1 italic">"{leave.reason}"</p>
                       </div>
                       <div className="flex flex-col space-y-2">
                           <button onClick={() => handleLeaveAction(leave._id, 'Approved')} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded shadow">Approve</button>
                           <button onClick={() => handleLeaveAction(leave._id, 'Rejected')} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded shadow">Reject</button>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Issued Leaves */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-50">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FiBriefcase className="mr-2 text-green-600"/> Recently Issued Leaves
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Employee</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Duration</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issuedLeaves.map(leave => (
                                <tr key={leave._id} className="border-b border-gray-100">
                                    <td className="px-4 py-3 font-medium text-gray-900">{leave.employeeId}</td>
                                    <td className="px-4 py-3">{leave.type}</td>
                                    <td className="px-4 py-3 uppercase text-xs">
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">Approved</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
      </div>

    {/* Floating ID Card - Right Side */}
    {contextProfile && (
      <div className="fixed top-20 right-4 w-[340px] hidden xl:block z-30">
        <div className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
              <FiShield className="text-blue-600" size={12} />
              HR Badge
            </h3>
            <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded-full font-black flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span>
              AUTHORIZED
            </span>
          </div>
          <VirtualIDCard employee={contextProfile} />
        </div>
      </div>
    )}
    </>
  );
}
