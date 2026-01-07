import { useState, useEffect } from 'react';
import api from '../../services/employeeApi';
import { FiClock, FiCheckCircle, FiUserX, FiCalendar } from 'react-icons/fi';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, empRes, leaveRes] = await Promise.all([
        api.get(`/attendance?date=${selectedDate}`),
        api.get('/employees'),
        api.get(`/leaves?date=${selectedDate}`) // Fetches approved/all leaves for this date
      ]);
      setAttendance(attRes.data);
      // Filter out Admin accounts from the list
      const nonAdminEmployees = empRes.data.filter(emp => 
        !emp.employeeId.startsWith('ADMIN') && 
        emp.designation !== 'Super Administrator'
      );
      setEmployees(nonAdminEmployees);
      setLeaves(leaveRes.data.filter(l => l.status === 'Approved')); // Only approved leaves count
    } catch (error) {
      console.error('Error fetching attendance data', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to merge employee data with attendance
  const getAttendanceStatus = () => {
    const today = new Date().toISOString().split('T')[0];
    const isFuture = selectedDate > today;
    const isToday = selectedDate === today;

    return employees.map(emp => {
      const record = attendance.find(a => a.employeeId === emp.employeeId);
      
      // Check for leave
      const leave = leaves.find(l => l.employeeId === emp.employeeId); // Assumes backend filtered by date range

      let status = 'Absent';
      let statusColor = 'bg-red-100 text-red-700';

      if (record) {
          status = 'Present';
          statusColor = 'bg-green-100 text-green-700';
      } else if (leave) {
          status = `${leave.type} Leave`;
          statusColor = 'bg-yellow-100 text-yellow-700';
      } else if (isFuture) {
          status = 'Not Marked';
          statusColor = 'bg-gray-100 text-gray-500';
      } else if (isToday) {
          status = 'Pending';
          statusColor = 'bg-orange-100 text-orange-700';
      }

      return {
        ...emp,
        record: record || null,
        status,
        statusColor
      };
    });
  };

  const attendanceData = getAttendanceStatus();
  const presentCount = attendanceData.filter(a => a.status === 'Present').length;
  // Absent only counts real absences (not leaves, not future)
  const absentCount = attendanceData.filter(a => a.status === 'Absent').length;
  const onLeaveCount = attendanceData.filter(a => a.status.includes('Leave')).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Attendance Monitoring</h2>
          <p className="text-green-100 text-sm">Daily logs and absentee reports</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
            <FiClock size={32} />
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
        <label className="font-bold text-gray-700 flex items-center">
            <span className="mr-2">Select Date:</span>
            <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-gray-300 border rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
            />
        </label>
        <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-2 rounded-full text-green-600"><FiCheckCircle /></div>
                <div>
                   <p className="text-xs text-gray-500">Present</p>
                   <p className="font-bold text-lg">{presentCount}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <div className="bg-red-100 p-2 rounded-full text-red-600"><FiUserX /></div>
                <div>
                   <p className="text-xs text-gray-500">Absent</p>
                   <p className="font-bold text-lg">{absentCount}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <div className="bg-yellow-100 p-2 rounded-full text-yellow-600"><FiCalendar /></div>
                <div>
                   <p className="text-xs text-gray-500">On Leave</p>
                   <p className="font-bold text-lg">{onLeaveCount}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Punch In</th>
                        <th className="px-6 py-4 text-center">Punch Out</th>
                        <th className="px-6 py-4 text-center">Work Hours</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? (
                        <tr><td colSpan="6" className="text-center py-6 text-gray-500">Loading data...</td></tr>
                    ) : (
                        attendanceData.map((data) => (
                            <tr key={data._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {data.firstName} {data.lastName}
                                    <div className="text-xs text-gray-400 font-normal">{data.designation}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{data.employeeId}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.statusColor}`}>
                                        {data.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-gray-600">
                                    {data.record?.punchIn ? new Date(data.record.punchIn).toLocaleTimeString() : '-'}
                                </td>
                                <td className="px-6 py-4 text-center font-mono text-gray-600">
                                    {data.record?.punchOut ? new Date(data.record.punchOut).toLocaleTimeString() : '-'}
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-gray-700">
                                    {data.record?.workHours ? `${data.record.workHours.toFixed(2)} hrs` : '-'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
