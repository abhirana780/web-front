import { useState, useEffect } from 'react';
import api from '../../services/employeeApi';
import { FiUsers, FiSearch, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';

export default function EmployeeList() {
  const { hasPermission } = useEmployeeAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const results = employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(results);
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
        try {
            await api.delete(`/employees/${id}`);
            setEmployees(employees.filter(e => e.employeeId !== id)); // Optimistic update
            fetchEmployees(); // Refresh to be safe
        } catch (error) {
            alert('Failed to delete employee: ' + (error.response?.data?.message || error.message));
        }
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>
            <p className="text-gray-500 text-sm">Manage all employee records</p>
        </div>
        {hasPermission('manage_employees') && (
        <button 
           onClick={() => navigate('/employee-portal/employees/add')}
           className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 font-semibold shadow-lg transition"
        >
            <FiPlus />
            <span>Add Employee</span>
        </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Search by name, ID, or department..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-semibold text-gray-600">Employee</th>
                <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Department</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading directory...</td></tr>
              ) : filteredEmployees.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No employees found.</td></tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                {emp.firstName[0]}{emp.lastName[0]}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{emp.firstName} {emp.lastName}</p>
                                <p className="text-xs text-gray-500">{emp.email}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{emp.employeeId}</td>
                    <td className="px-6 py-4 text-gray-800">{emp.designation}</td>
                    <td className="px-6 py-4 text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">{emp.department}</span>
                    </td>
                    <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                             emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                         }`}>
                             {emp.status}
                         </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      {hasPermission('manage_employees') && (
                        <>
                          <button 
                            onClick={() => navigate(`/employee-portal/employees/edit/${emp.employeeId}`)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteEmployee(emp.employeeId)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </>
                      )}
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
