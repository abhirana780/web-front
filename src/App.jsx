import { StrictMode, useState, useEffect } from 'react'
import './index.css'
import { Routes, Route, Navigate, useLocation } from "react-router";
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import ClickSpark from './components/reactBits/ClickSpark';
import Contact from './pages/Contact';
import Services from './pages/Services';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Internship from './pages/Internship';
import TestUpload from './pages/TestUpload';
import Courses from './pages/Courses';
import Loading from './components/Loading';
import OnBored from './pages/OnBored';
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';
import UniversalLoading from './components/UniversalLoading';
import { LoadingProvider } from './contexts/LoadingContext';
import { EmployeeAuthProvider, useEmployeeAuth } from './contexts/EmployeeAuthContext';

// Employee Portal Pages
import Login from './pages/EmployeePortal/Login';
import AdminDashboard from './pages/EmployeePortal/AdminDashboard';
import EmployeeDashboard from './pages/EmployeePortal/EmployeeDashboard';
import TaskManager from './pages/EmployeePortal/TaskManager';
import Chat from './pages/EmployeePortal/Chat';
import EmployeeForm from './pages/EmployeePortal/EmployeeForm';
import SalaryPage from './pages/EmployeePortal/SalaryPage';
import CalendarPage from './pages/EmployeePortal/CalendarPage';
import PayrollPage from './pages/EmployeePortal/PayrollPage';
import AnalyticsPage from './pages/EmployeePortal/AnalyticsPage';
import AttendancePage from './pages/EmployeePortal/AttendancePage';
import EmployeeList from './pages/EmployeePortal/EmployeeList';
import HRDashboard from './pages/EmployeePortal/HRDashboard';
import AuditLogPage from './pages/EmployeePortal/AuditLogPage';
import BroadcastPage from './pages/EmployeePortal/BroadcastPage';
import Sidebar from './components/EmployeePortal/Sidebar';
import EmployeeHeader from './components/EmployeePortal/Header';
import VirtualIDCard from './components/EmployeePortal/VirtualIDCard';
import MyProfile from './pages/EmployeePortal/MyProfile';
import ForgotPassword from './pages/EmployeePortal/ForgotPassword';
import ResetPassword from './pages/EmployeePortal/ResetPassword';
import PermissionsManager from './pages/EmployeePortal/PermissionsManager';

const EmployeePortalLayout = ({ children }) => {
  const { user, profile, loading } = useEmployeeAuth();
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen bg-white text-indigo-600 font-bold">Loading Portal...</div>;

  if (!user && !location.pathname.includes('/login')) {
    return <Navigate to="/employee-portal/login" />;
  }

  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden font-sans">
      {user && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {user && <EmployeeHeader />}
        <div className="flex-1 flex overflow-hidden relative">
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="max-w-[1600px] mx-auto animate-fade-in">
                {children}
              </div>
            </main>
        </div>
      </div>
    </div>
  );
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isEmployeePortal = location.pathname.startsWith('/employee-portal');

  return (
    <>
      {!isEmployeePortal && <Header />}
      {children}
      {!isEmployeePortal && <Footer />}
    </>
  );
};

const AppRoutes = () => {
  const { user } = useEmployeeAuth();
  
  return (
    <Routes>
      {/* Website Routes */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/onBoard" element={<MainLayout><OnBored /></MainLayout>} />
      <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
      <Route path="/update-profile" element={<MainLayout><UpdateProfile /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
      <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
      <Route path="/internship" element={<MainLayout><Internship /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/test-upload" element={<MainLayout><TestUpload /></MainLayout>} />
      <Route path="/courses" element={<MainLayout><Courses /></MainLayout>} />

      {/* Employee Portal Routes */}
      <Route path="/employee-portal/forgot-password" element={<ForgotPassword />} />
      <Route path="/employee-portal/reset-password/:resetToken" element={<ResetPassword />} />
      <Route path="/employee-portal/login" element={!user ? <Login /> : <Navigate to="/employee-portal" />} />
      
      <Route path="/employee-portal" element={
        <EmployeePortalLayout>
          {user ? (
            user.role === 'HR' ? <HRDashboard /> :
            ['Admin', 'SuperAdmin', 'HR', 'Manager'].includes(user.role) ? <AdminDashboard /> : 
            <EmployeeDashboard />
          ) : <Navigate to="/employee-portal/login" />}
        </EmployeePortalLayout>
      } />
      
      <Route path="/employee-portal/profile" element={<EmployeePortalLayout><MyProfile /></EmployeePortalLayout>} />
      <Route path="/employee-portal/employees" element={<EmployeePortalLayout><EmployeeList /></EmployeePortalLayout>} />
      <Route path="/employee-portal/employees/add" element={<EmployeePortalLayout><EmployeeForm /></EmployeePortalLayout>} />
      <Route path="/employee-portal/employees/edit/:id" element={<EmployeePortalLayout><EmployeeForm /></EmployeePortalLayout>} />
      <Route path="/employee-portal/payroll" element={<EmployeePortalLayout><PayrollPage /></EmployeePortalLayout>} />
      <Route path="/employee-portal/analytics" element={<EmployeePortalLayout><AnalyticsPage /></EmployeePortalLayout>} />
      <Route path="/employee-portal/activity-logs" element={<EmployeePortalLayout><AuditLogPage /></EmployeePortalLayout>} />
      <Route path="/employee-portal/attendance" element={<EmployeePortalLayout><AttendancePage /></EmployeePortalLayout>} />
      <Route path="/employee-portal/tasks" element={<EmployeePortalLayout><TaskManager /></EmployeePortalLayout>} />
      <Route path="/employee-portal/salary" element={<EmployeePortalLayout><SalaryPage /></EmployeePortalLayout>} />
      <Route path="/employee-portal/calendar" element={<EmployeePortalLayout><CalendarPage /></EmployeePortalLayout>} />
      <Route path="/employee-portal/broadcasts" element={<EmployeePortalLayout><BroadcastPage /></EmployeePortalLayout>} />
      <Route path="/employee-portal/permissions" element={<EmployeePortalLayout><PermissionsManager /></EmployeePortalLayout>} />
      <Route path="/employee-portal/chat" element={<EmployeePortalLayout><Chat /></EmployeePortalLayout>} />
    </Routes>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(() => {
    return !localStorage.getItem('hasLoaded');
  });

  const handleLoadingComplete = () => {
    localStorage.setItem('hasLoaded', 'true');
    setIsLoading(false);
  };

  return (
    <LoadingProvider>
      <ClickSpark
        sparkColor='#fff'
        sparkSize={10}
        sparkRadius={35}
        sparkCount={8}
        duration={400}
      >
        <UniversalLoading isLoading={false} />
        
        {isLoading ? (
          <Loading onComplete={handleLoadingComplete} setIsLoading={setIsLoading} />
        ) : (
          <EmployeeAuthProvider>
            <AppRoutes />
          </EmployeeAuthProvider>
        )}
      </ClickSpark>
    </LoadingProvider>
  );
};

export default App;
