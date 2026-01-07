import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import logo from '../../assets/logo.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
            <img src={logo} alt="Wipronix" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-500 text-sm">Enter your email to receive a reset link.</p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#ab1428] px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ab1428] focus:border-transparent transition outline-none"
                placeholder="you@example.com"
                required
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ab1428] text-white py-3 rounded-lg font-semibold hover:bg-[#8b0f1f] transform hover:scale-[1.02] transition duration-200 shadow-md disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
            <button onClick={() => navigate('/employee-portal/login')} className="text-sm text-gray-600 hover:text-[#ab1428] flex items-center justify-center mx-auto space-x-2 font-medium">
                <FiArrowLeft /> <span>Back to Login</span>
            </button>
        </div>
      </div>
    </div>
  );
}
