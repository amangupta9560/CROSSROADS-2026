import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const res = await axios.post(`${backendUrl}/api/admin/login`, {
        email: email.trim(),
        username: email.trim(),
        password
      });
      localStorage.setItem('adminToken', res.data.token);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-white/5 border-2 border-orange-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 backdrop-blur-sm hover:border-orange-500/40";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-linear-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">Admin Login</h1>
          <p className="text-gray-400 mt-2">Access CROSSROADS 2027 Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-linear-to-br from-slate-900/40 to-slate-900/40 backdrop-blur-2xl border border-orange-500/20 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Admin Email</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-500" size={20} />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className={`${inputClasses} pl-10`}
                />
              </div>
            </div>
            <Motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-linear-to-r from-orange-500 to-purple-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : null}
              {loading ? 'Logging in...' : 'Login'}
            </Motion.button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

export default AdminLogin;