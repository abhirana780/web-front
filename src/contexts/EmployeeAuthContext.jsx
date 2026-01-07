import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import api from '../services/employeeApi';
import { initSocket } from '../services/employeeSocketService';

const EmployeeAuthContext = createContext();

export const EmployeeAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('employeeUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        try {
          const res = await api.get(`/employees/${userData.employeeId}`);
          setProfile(res.data);
        } catch (err) {
          console.error('Failed to fetch profile during init', err);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const socket = initSocket(user.employeeId || user._id);
      
      const handlePermChange = (data) => {
        if (data.employeeId === user.employeeId) {
          const updatedUser = { ...user, permissions: data.permissions, role: data.role, active: data.active };
          setUser(updatedUser);
          localStorage.setItem('employeeUser', JSON.stringify(updatedUser));
          
          if (data.active === false) {
             alert('Your account has been suspended. Logging out...');
             logout();
          }
        }
      };

      socket.on('permissions_updated', handlePermChange);
      return () => socket.off('permissions_updated', handlePermChange);
    }
  }, [user]);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/employees/${user.employeeId}`);
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  const login = async (email, password) => {
    try {
        const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
        const userData = res.data;
        setUser(userData);
        localStorage.setItem('employeeUser', JSON.stringify(userData));
        
        // Fetch full profile immediately
        try {
          const profRes = await api.get(`/employees/${userData.employeeId}`);
          setProfile(profRes.data);
        } catch (e) {
          console.error('Failed to fetch profile after login', e);
        }

        navigate('/employee-portal');
    } catch (error) {
        throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('employeeUser');
    navigate('/employee-portal/login');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'SuperAdmin' || user.role === 'Admin') return true;
    return user.permissions?.includes(permission);
  };

  return (
    <EmployeeAuthContext.Provider value={{ user, profile, refreshProfile, login, logout, loading, hasPermission }}>
      {children}
    </EmployeeAuthContext.Provider>
  );
};

export const useEmployeeAuth = () => useContext(EmployeeAuthContext);
