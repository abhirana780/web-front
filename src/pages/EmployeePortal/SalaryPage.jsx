import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import api from '../../services/employeeApi';
import { FiDownload, FiDollarSign, FiPieChart, FiTrendingDown } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SalaryPage() {
  const { user } = useEmployeeAuth();
  const [profile, setProfile] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, payslipRes] = await Promise.all([
        api.get(`/employees/${user.employeeId}`),
        api.get(`/payslips?employeeId=${user.employeeId}`)
      ]);
      setProfile(profileRes.data);
      setPayslips(payslipRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleDownload = async (id, month) => {
    try {
        const response = await api.get(`/payslips/${id}/download`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `payslip_${month}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        alert('Failed to download payslip');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading salary information...</div>;

  const salary = profile?.salary || {};
  
  const chartData = {
    labels: ['Base Salary', 'HRA', 'Transport', 'Other Allowances'],
    datasets: [
      {
        data: [salary.base || 0, salary.hra || 0, salary.transportAllowance || 0, salary.otherAllowances || 0],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
            'white', 'white', 'white', 'white'
        ],
        borderWidth: 2,
      },
    ],
  };

  const totalEarnings = (salary.base||0) + (salary.hra||0) + (salary.transportAllowance||0) + (salary.otherAllowances||0);
  const totalDeductions = (salary.tax||0) + (salary.providentFund||0) + (salary.otherDeductions||0);
  const netSalary = totalEarnings - totalDeductions;

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Salary & Compensation</h2>
          <p className="text-emerald-100 text-sm">Review your salary structure and payslips</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
            <FiDollarSign size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary Structure Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center"><FiPieChart className="mr-2"/> Salary Breakdown</h3>
            <div className="flex flex-col md:flex-row items-center justify-around">
                <div className="w-48 h-48 mb-6 md:mb-0">
                    <Doughnut data={chartData} options={{ plugins: { legend: { display: false } } }} />
                </div>
                <div className="space-y-3 w-full md:w-1/2">
                    <div className="flex justify-between items-center text-sm border-b pb-1">
                        <span className="text-gray-600">Base Salary</span>
                        <span className="font-semibold text-gray-800">₹{salary.base}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-1">
                        <span className="text-gray-600">HRA</span>
                        <span className="font-semibold text-gray-800">₹{salary.hra}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-1">
                        <span className="text-gray-600">Transport</span>
                        <span className="font-semibold text-gray-800">₹{salary.transportAllowance}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-1">
                        <span className="text-gray-600">Allowances</span>
                        <span className="font-semibold text-gray-800">₹{salary.otherAllowances}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-indigo-700 bg-indigo-50 p-2 rounded">
                        <span>Gross Salary</span>
                        <span>₹{totalEarnings}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Deductions & Net Salary */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><FiTrendingDown className="mr-2"/> Deductions</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b pb-1">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold text-red-600">- ₹{salary.tax}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-1">
                        <span className="text-gray-600">Provident Fund</span>
                        <span className="font-semibold text-red-600">- ₹{salary.providentFund}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-1">
                        <span className="text-gray-600">Other Deductions</span>
                        <span className="font-semibold text-red-600">- ₹{salary.otherDeductions}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-red-700 bg-red-50 p-2 rounded">
                        <span>Total Deductions</span>
                        <span>- ₹{totalDeductions}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium text-gray-300">Total Net Salary</h3>
                    <p className="text-3xl font-bold text-emerald-400">₹{netSalary.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">Estimates based on current structure</p>
                </div>
                <div className="bg-emerald-500/20 p-4 rounded-full">
                    <FiDollarSign className="text-emerald-400 text-2xl" />
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center"><FiDownload className="mr-2"/> Payslip History</h3>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month/Year</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gross Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deductions</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Pay</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {payslips.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-6 text-gray-500 italic">No payslips generated yet.</td></tr>
                    ) : (
                        payslips.map(ps => (
                            <tr key={ps._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ps.month}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{ps.grossSalary}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">- ₹{ps.totalDeductions}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">₹{ps.netSalary}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">{ps.status}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button 
                                        onClick={() => handleDownload(ps._id, ps.month)}
                                        className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center space-x-1"
                                    >
                                        <FiDownload /> <span>Download</span>
                                    </button>
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
