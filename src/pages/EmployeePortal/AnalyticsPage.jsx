import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../../services/employeeApi';
import { FiActivity, FiShield, FiDownload, FiBarChart2, FiPieChart, FiUsers } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [deptStats, setDeptStats] = useState([]);
  const [logs, setLogs] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, deptRes, logsRes, reportsRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/analytics/departments'),
        api.get('/analytics/audits'),
        api.get('/analytics/reports')
      ]);
      setStats(statsRes.data);
      setDeptStats(deptRes.data);
      setLogs(logsRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      console.error('Error fetching analytics', error);
    }
  };

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp,User,Action,Resource,Details\n";
    logs.forEach(log => {
        csvContent += `${log.timestamp},${log.userId?.email || 'System'},${log.action},${log.resource},${JSON.stringify(log.details).replace(/,/g, ';')}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const chartData = {
    labels: deptStats.map(d => d._id || 'Unknown'),
    datasets: [
        {
            label: 'Employee Count',
            data: deptStats.map(d => d.count),
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
        }
    ]
  };
  
  const salaryData = {
    labels: deptStats.map(d => d._id || 'Unknown'),
    datasets: [
        {
            label: 'Avg Base Salary',
            data: deptStats.map(d => d.avgSalary),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
            ],
        }
    ]
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-xl shadow-lg p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Reports & Analytics</h2>
          <p className="text-blue-100 text-sm">System Governance and Performance Metrics</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
            <FiActivity size={32} />
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 pb-2">
           <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center space-x-2 px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
           >
               <FiBarChart2 /> <span>Overview</span>
           </button>
           <button 
                onClick={() => setActiveTab('reports')}
                className={`flex items-center space-x-2 px-4 py-2 font-medium ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
           >
               <FiUsers /> <span>Employee Reports</span>
           </button>
           <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center space-x-2 px-4 py-2 font-medium ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
           >
               <FiShield /> <span>Security & Audits</span>
           </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-gray-700 mb-2">Total Employees</h3>
                    <p className="text-4xl font-bold text-blue-600">{stats?.totalEmployees || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-gray-700 mb-2">Attendance Today</h3>
                    <p className="text-4xl font-bold text-green-600">{stats?.presentToday || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-gray-700 mb-2">Pending Actions</h3>
                    <p className="text-4xl font-bold text-orange-600">{stats?.pendingLeaves || 0} <span className="text-sm text-gray-400 font-normal">Leaves</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-lg">
                     <h3 className="font-bold text-gray-700 mb-4 flex items-center"><FiBarChart2 className="mr-2"/> Department Distribution</h3>
                     <Bar data={chartData} />
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg">
                     <h3 className="font-bold text-gray-700 mb-4 flex items-center"><FiPieChart className="mr-2"/> Salary Insights (Avg)</h3>
                     <Pie data={salaryData} />
                 </div>
            </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center"><FiUsers className="mr-2"/> Employee Performance Report</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Employee</th>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3 text-center">Tasks (Total)</th>
                            <th className="px-6 py-3 text-center">Tasks (Completed)</th>
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {reports.map((emp) => (
                            <tr key={emp._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {emp.firstName} {emp.lastName}
                                    <div className="text-xs text-gray-400 font-normal">{emp.designation}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{emp.employeeId}</td>
                                <td className="px-6 py-4 text-gray-500">{emp.department}</td>
                                <td className="px-6 py-4 text-center font-bold">{emp.totalTasks}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${emp.totalTasks > 0 && emp.completedTasks === emp.totalTasks ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {emp.completedTasks}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Link to={`/employees/edit/${emp.employeeId}`} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase">View Profile</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center"><FiShield className="mr-2"/> Audit Logs</h3>
                <button onClick={downloadCSV} className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition">
                    <FiDownload /> <span>Export CSV</span>
                </button>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Resource</th>
                            <th className="px-6 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {logs.map((log) => (
                            <tr key={log._id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-3 font-medium text-gray-900">{log.userId?.email || 'System'}</td>
                                <td className="px-6 py-3 text-xs"><span className="bg-gray-100 px-2 py-1 rounded">{log.userId?.role || 'N/A'}</span></td>
                                <td className="px-6 py-3 font-semibold text-blue-600">{log.action}</td>
                                <td className="px-6 py-3 text-gray-700">{log.resource}</td>
                                <td className="px-6 py-3 text-xs text-mono text-gray-500 truncate max-w-xs" title={JSON.stringify(log.details)}>{JSON.stringify(log.details)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
}
