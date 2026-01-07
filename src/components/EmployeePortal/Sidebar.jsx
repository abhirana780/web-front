import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import { initSocket } from '../../services/employeeSocketService';
import { FiHome, FiCheckSquare, FiMessageSquare, FiLogOut, FiUsers, FiCalendar, FiDollarSign, FiClock, FiAlertCircle, FiActivity, FiRadio, FiShield } from 'react-icons/fi';
import logo from '../../assets/logo.png';

export default function Sidebar() {
  const { user, logout, hasPermission } = useEmployeeAuth();
  const location = useLocation();
  const [alertMsg, setAlertMsg] = useState(null);

  const role = user?.role;
  const isAdmin = role === 'Admin' || role === 'SuperAdmin';

  useEffect(() => {
    if (user) {
        const socket = initSocket(user.employeeId || user._id);
        
        const handleMessage = (data) => {
            if (location.pathname !== '/employee-portal/chat') {
                setAlertMsg(`New message: ${data.content.substring(0, 30)}...`);
                setTimeout(() => setAlertMsg(null), 5000);
            }
        };

        const handleAdminAlert = (data) => {
             setAlertMsg(data.message);
             setTimeout(() => setAlertMsg(null), 10000);
        };

        const handleBroadcast = (data) => {
            if (data.recipients.includes(user.employeeId || user._id)) {
                setAlertMsg(`📢 BROADCAST: ${data.title}`);
                // Stay for 20 seconds
                setTimeout(() => setAlertMsg(null), 20000);
            }
        };

        socket.on('receive_message', handleMessage);
        socket.on('admin_alert', handleAdminAlert);
        socket.on('broadcast_alert', handleBroadcast);

        return () => {
            socket.off('receive_message', handleMessage);
            socket.off('admin_alert', handleAdminAlert);
            socket.off('broadcast_alert', handleBroadcast);
        };
    }
  }, [user, location.pathname]);

  const menuItems = [
    { path: '/employee-portal', icon: FiHome, label: 'Dashboard' },
    { path: '/employee-portal/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { path: '/employee-portal/broadcasts', icon: FiRadio, label: 'Broadcasts' },
    { path: '/employee-portal/chat', icon: FiMessageSquare, label: 'Chat' },
    { path: '/employee-portal/calendar', icon: FiCalendar, label: 'Calendar' },
  ];

  // Granular Access Control
  if (hasPermission('manage_employees')) {
      menuItems.push({ path: '/employee-portal/employees', icon: FiUsers, label: 'Employees' });
  }

  if (hasPermission('manage_attendance')) {
      menuItems.push({ path: '/employee-portal/attendance', icon: FiClock, label: 'Attendance' });
  }

  if (hasPermission('view_payroll')) {
      menuItems.push({ path: '/employee-portal/payroll', icon: FiDollarSign, label: 'Payroll' });
  }

  if (hasPermission('view_analytics')) {
      menuItems.push({ path: '/employee-portal/analytics', icon: FiActivity, label: 'Analytics' });
  }

  if (hasPermission('view_audit_logs')) {
      menuItems.push({ path: '/employee-portal/activity-logs', icon: FiShield, label: 'Activity Logs' });
  }

  if (isAdmin) {
      menuItems.push({ path: '/employee-portal/permissions', icon: FiShield, label: 'Permissions' });
  }

  // Personal sections for regular employees
  if (role === 'Employee' || role === 'TeamLead') {
      menuItems.push({ path: '/employee-portal/salary', icon: FiDollarSign, label: 'My Salary' });
  }

  return (
    <>
    {alertMsg && (
        <div className="fixed top-5 right-5 z-50 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce">
            <FiAlertCircle className="text-3xl" />
            <div>
                <h4 className="font-bold text-lg">Admin Alert!</h4>
                <p>{alertMsg}</p>
            </div>
            <button onClick={() => setAlertMsg(null)} className="ml-4 text-white/80 hover:text-white">✕</button>
        </div>
    )}
    <div className="w-64 bg-white border-r border-gray-200 text-gray-800 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-100 flex flex-col items-center">
        <img src={logo} alt="Wipronix" className="h-24 w-auto mb-2 object-contain hover:scale-105 transition-transform duration-300" />
        <p className="text-sm text-gray-500 mt-1 uppercase font-semibold tracking-wider">{user?.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#ab1428] text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-red-50 hover:text-[#ab1428]'
              }`}
            >
              <Icon className="text-xl" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <FiLogOut className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
    </>
  );
}
