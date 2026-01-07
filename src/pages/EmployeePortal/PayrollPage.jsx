import { useState, useEffect } from 'react';
import api from '../../services/employeeApi';
import { FiDollarSign, FiPlay, FiDownload } from 'react-icons/fi';

export default function PayrollPage() {
  const [employees, setEmployees] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, payslipRes] = await Promise.all([
        api.get('/employees'),
        api.get('/payslips') // This needs to be admin route returning ALL payslips
      ]);
      setEmployees(empRes.data);
      setPayslips(payslipRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
        setLoading(false);
    }
  };

  const processPayroll = async () => {
    if (!window.confirm(`Process payroll for ${selectedMonth}/${selectedYear} for ALL employees?`)) return;
    
    setProcessing(true);
    try {
        // Sequentially process for each employee (could be batched in backend but simple loop here)
        let count = 0;
        for (const emp of employees) {
            try {
                await api.post('/payslips/generate', {
                    employeeId: emp.employeeId,
                    month: String(selectedMonth),
                    year: String(selectedYear)
                });
                count++;
            } catch (e) {
                console.error(`Failed for ${emp.employeeId}`, e);
            }
        }
        alert(`Payroll processed for ${count} employees.`);
        fetchData();
    } catch (error) {
        alert('Error processing payroll');
    } finally {
        setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-1">Payroll Management</h2>
          <p className="text-gray-400 text-sm">Process monthly salaries and manage payslips</p>
        </div>
        <div className="bg-white/10 p-3 rounded-full">
            <FiDollarSign size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center"><FiPlay className="mr-2"/> Run Payroll</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                        <select 
                            className="w-full border-gray-300 rounded-lg p-2 border"
                            value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
                        >
                            {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>{new Date(0, m-1).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <select 
                            className="w-full border-gray-300 rounded-lg p-2 border"
                            value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
                        >
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <p className="font-bold">Summary:</p>
                    <p>Total Employees: {employees.length}</p>
                    <p>Period: {selectedMonth}/{selectedYear}</p>
                </div>

                <button 
                    onClick={processPayroll} 
                    disabled={processing}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                >
                    {processing ? 'Processing...' : 'Generate Payslips'}
                </button>
            </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">Recent Payslips</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-4 py-2 text-left">Emp ID</th>
                            <th className="px-4 py-2 text-left">Period</th>
                            <th className="px-4 py-2 text-left">Net Salary</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {payslips.slice(0, 10).map(ps => (
                            <tr key={ps._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{ps.employeeId}</td>
                                <td className="px-4 py-3">{ps.month}</td>
                                <td className="px-4 py-3 font-bold text-green-600">₹{ps.netSalary}</td>
                                <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Processed</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
