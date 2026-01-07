import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import api from '../../services/employeeApi';
import { FiPlus, FiEdit } from 'react-icons/fi';

export default function TaskManager() {
  const { user } = useEmployeeAuth();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateText, setUpdateText] = useState('');
  const [progress, setProgress] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium'
  });

  const role = user?.role;
  const isManagement = ['Admin', 'SuperAdmin', 'HR', 'Manager', 'TeamLead'].includes(role);
  const isHR = role === 'HR';

  useEffect(() => {
    fetchTasks();
    if (isManagement) fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const query = isManagement ? '' : `?employeeId=${user.employeeId}`;
      const res = await api.get(`/tasks${query}`);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium' });
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating task');
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tasks/${selectedTask._id}/progress`, {
        update: updateText,
        progress: parseInt(progress)
      });
      setSelectedTask(null);
      setUpdateText('');
      setProgress(0);
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating task');
    }
  };

  // Filter employees for HR (Exclude Admin/Manager if identifiable, or just ensure they assign to mostly employees)
  // Since we don't have 'role' on employee object reliably without a join, we'll check designation strings or just show all but allow HR to guide themselves.
  // HOWEVER, user explicitly asked to "accept [except] admin and manager". 
  // We'll try to filter by designation if it contains "Manager" or "Admin".
  const assignableEmployees = employees.filter(emp => {
      if (isHR) {
          const des = (emp.designation || '').toLowerCase();
          return !des.includes('manager') && !des.includes('admin') && !des.includes('ceo');
      }
      return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Task Manager</h2>
        {isManagement && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition flex items-center space-x-2"
          >
            <FiPlus />
            <span>Create Task</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-800 text-lg">{task.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                task.priority === 'High' ? 'bg-red-100 text-red-800' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {task.priority}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{task.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assigned To:</span>
                <span className="font-semibold">{task.assignedTo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assigned By:</span>
                <span className="font-semibold truncate max-w-[150px]">{task.assignedBy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-semibold">{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    task.progress === 100 ? 'bg-green-500' :
                    task.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.status}
              </span>
              
              {!isManagement && (
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setProgress(task.progress);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                >
                  <FiEdit />
                  <span>Update</span>
                </button>
              )}
            </div>

            {task.dailyUpdates && task.dailyUpdates.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Latest Update:</p>
                <p className="text-xs text-gray-600">{task.dailyUpdates[task.dailyUpdates.length - 1].update}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder={isHR ? "e.g., Upload Profile Picture" : "Task Title"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {assignableEmployees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Update Task Progress</h3>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task: {selectedTask.title}</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Notes</label>
                <textarea
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  placeholder="Describe what you've accomplished..."
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
