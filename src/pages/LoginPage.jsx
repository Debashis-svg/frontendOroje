import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import Spinner from '../components/common/Spinner';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

// Login type selection cards
const LoginTypeCard = ({ title, description, icon, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-gradient-to-br from-blue-50 via-white to-blue-100 backdrop-blur-xl border border-blue-200 
               p-8 rounded-2xl shadow-xl w-80 h-60 text-center flex flex-col justify-center items-center
               hover:shadow-[0_0_15px_#60a5fa] hover:border-blue-400 transition-all duration-300"
  >
    {React.cloneElement(icon, { className: "h-16 w-16 text-blue-600 mx-auto mb-4" })}
    <h3 className="text-2xl font-bold text-gray-800 mb-1">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.button>
);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginType, setLoginType] = useState(null);
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'team') setLoginType('team');
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;

      if (loginType === 'admin' && user.role !== 'admin') {
        setError('This is not an admin account.');
        setLoading(false);
        return;
      }
      if (loginType === 'team' && user.role === 'admin') {
        setError('This is an admin account. Please use the admin login.');
        setLoading(false);
        return;
      }
      login(user, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const renderSelection = () => (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="text-center"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-12">
        Who are you?
      </h2>

      <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
        <LoginTypeCard
          title="Team"
          description="Log in as a participant or team leader."
          icon={<UsersIcon />}
          onClick={() => setLoginType('team')}
        />
        <LoginTypeCard
          title="Admin"
          description="Log in as an organizer or faculty."
          icon={<ShieldCheckIcon />}
          onClick={() => setLoginType('admin')}
        />
      </div>
    </motion.div>
  );

  const renderLoginForm = () => {
    const onBack = searchParams.get('type') === 'team'
      ? () => navigate('/login')
      : () => setLoginType(null);

    return (
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="w-[95%] sm:w-[420px] md:w-[460px] lg:w-[480px]"
      >
        <LoginForm
          title={`${loginType === 'admin' ? 'Admin' : 'Team'} Login`}
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          showRegisterLink={loginType === 'team'}
          onBack={onBack}
        />
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 via-white to-teal-100 text-gray-900">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/50 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/50 blur-3xl rounded-full"></div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        {loginType === null ? renderSelection() : renderLoginForm()}
      </div>

      <footer className="relative z-10 w-full bg-gradient-to-r from-blue-100 to-white py-8 text-center border-t border-blue-200">
        <p className="text-gray-700 text-sm md:text-base">
          Faculty & 3rd Year B.Tech Students of CSE Department, NIT Silchar
        </p>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          For any queries or clarifications, contact the coordinators: CR, Sec A & B, B.Tech (CSE), 3rd Year, NIT Silchar
        </p>

        <div className="flex justify-center mt-4 space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition">
            <Facebook size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:scale-110 transition">
            <Instagram size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:scale-110 transition">
            <Twitter size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:scale-110 transition">
            <Linkedin size={24} />
          </a>
        </div>

        <p className="text-gray-500 text-xs mt-6">
          © {new Date().getFullYear()} Hackathon 2026 | NIT Silchar
        </p>
      </footer>
    </div>
  );
}
