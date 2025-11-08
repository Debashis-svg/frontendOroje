import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Spinner from '../components/common/Spinner';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();

  useEffect(() => {
    loadRazorpayScript().then(setScriptLoaded);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegister = async (teamData) => {
    if (!scriptLoaded) {
      setError('Payment gateway is not loaded. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { order } } = await api.post('/payment/create-order', {
        amount: 2000,
        teamName: teamData.teamName,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Hackathon 2026 Registration',
        description: `Team: ${teamData.teamName}`,
        order_id: order.id,

        handler: async (response) => {
          try {
            const { data } = await api.post('/auth/register', {
              ...teamData,
              paymentDetails: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            login(data.user, data.token);
          } catch (err) {
            setError('Payment verified, but registration failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: teamData.members[0].name,
          email: teamData.members[0].email,
        },
        theme: {
          color: '#2563EB',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  if (!scriptLoaded && !authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Spinner />
        <p className="mt-4 text-gray-600">Loading Payment Gateway...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 via-white to-teal-100 text-gray-900 overflow-hidden">

      {/* Soft glowing background circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/40 blur-3xl rounded-full"></div>

      {/* Register Section */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-blue-200 
                        rounded-2xl shadow-2xl p-10 md:p-14 max-w-4xl w-full text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-6">
            Register Your Team
          </h2>
          <p className="text-gray-700 text-lg mb-2">
            Register your team of 1–3 members. The team leader should fill this form.
          </p>
          <p className="text-2xl font-semibold text-yellow-600 mb-8">
            Registration Fee: ₹2000 per team
          </p>

          <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />
        </div>
      </motion.div>

      {/* Footer */}
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
