import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import logo from '../../assets/logo.png';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        return setError('Passwords do not match');
    }
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:5001/api/auth/reset-password/${resetToken}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/employee-portal/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100 text-center">
                <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h1>
                <p className="text-gray-500 mb-6">Redirecting you to login...</p>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
            <img src={logo} alt="Wipronix" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-500 text-sm">Enter your new password below.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#ab1428] px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab1428] focus:border-transparent transition outline-none"
                placeholder="••••••••"
                required
                minLength={6}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab1428] focus:border-transparent transition outline-none"
                placeholder="••••••••"
                required
                minLength={6}
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ab1428] text-white py-3 rounded-lg font-semibold hover:bg-[#8b0f1f] transform hover:scale-[1.02] transition duration-200 shadow-md disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
