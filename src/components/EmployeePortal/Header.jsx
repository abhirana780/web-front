import { useState, useEffect, useRef } from 'react';
import { useEmployeeAuth } from '../../contexts/EmployeeAuthContext';
import { FiBell, FiUser, FiX, FiInfo, FiAlertTriangle, FiMail } from 'react-icons/fi';
import api from '../../services/employeeApi';
import { useNavigate } from 'react-router';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useEmployeeAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [res, profileRes] = await Promise.all([
          api.get('/notifications'),
          api.get(`/employees/${user.employeeId}`)
      ]);
      
      let fetchedNotifications = res.data;
      const profile = profileRes.data;

      // Inject System Notification if Photo Missing
      if (!profile.profileImage) {
          const sysNotification = {
              _id: 'sys_photo_missing',
              title: 'Action Required',
              message: 'Please upload your profile photo to complete your ID Card.',
              type: 'Alert',
              read: false, // Always unread until fixed
              createdAt: new Date().toISOString(),
              isSystem: true 
          };
          fetchedNotifications = [sysNotification, ...fetchedNotifications];
      }

      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
       console.error('Failed to mark read', error);
    }
  };

  const markAllRead = async () => {
      try {
          await api.put('/notifications/read-all');
          setNotifications(notifications.map(n => ({...n, read: true})));
      } catch (error) {
          console.error('Failed to mark all read', error);
      }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 z-50 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {user?.department ? `${user.department} Dashboard` : (user?.role === 'Admin' || user?.role === 'SuperAdmin' ? 'Admin Dashboard' : 'Employee Dashboard')}
          </h2>
          <p className="text-sm text-gray-600">Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition focus:outline-none"
            >
                <FiBell className="text-xl text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-[#ab1428] text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60] transition-all">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-700 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-[#ab1428] font-medium hover:underline">
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">No notifications yet</div>
                        ) : (
                            notifications.map(notification => {
                                const isAlert = notification.type === 'Alert' || notification.isSystem;
                                const isMessage = notification.type === 'Message';
                                
                                return (
                                    <div 
                                        key={notification._id} 
                                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex gap-3 relative ${!notification.read ? 'bg-indigo-50/20' : ''}`}
                                        onClick={() => {
                                            if (notification.isSystem) {
                                                navigate('/employee-portal/profile');
                                                setShowNotifications(false);
                                            } else {
                                                markAsRead(notification._id);
                                            }
                                        }}
                                    >
                                        <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                            isAlert ? 'bg-red-50 text-red-500' :
                                            isMessage ? 'bg-blue-50 text-blue-500' :
                                            'bg-gray-50 text-gray-500'
                                        }`}>
                                            {isAlert ? <FiAlertTriangle size={16} /> : isMessage ? <FiMail size={16} /> : <FiInfo size={16} />}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className={`text-sm font-bold text-gray-800 leading-tight ${notification.isSystem ? 'text-red-700' : ''}`}>
                                                    {notification.title}
                                                </h4>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                    {new Date(notification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>
                                        </div>
                                        {!notification.read && <span className="absolute right-0 top-0 w-1.5 h-full bg-[#ab1428]/80"></span>}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
          </div>
          
          <div 
            onClick={() => navigate('/employee-portal/profile')}
            className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200 transition"
          >
            <FiUser className="text-gray-600" />
            <span className="text-sm font-medium text-gray-800">{user?.employeeId || 'Admin'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
