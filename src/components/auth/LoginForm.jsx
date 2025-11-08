import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const LoginForm = ({ 
  onSubmit, 
  loading, 
  error, 
  title, 
  showRegisterLink = false, 
  onBack 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      onSubmit({ email, password });
    }
  };
  
  const inputClass = "w-full px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500 transition";

  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-lg w-full relative border border-blue-100">
      {onBack && (
        <button 
          onClick={onBack} 
          className="absolute top-4 left-4 p-2 text-blue-500 hover:text-blue-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      )}

      <h2 className="text-4xl font-bold text-center text-blue-600 mb-8 pt-8 md:pt-0">
        {title}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass} 
            placeholder="your.email@example.com"
            required 
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass} 
            placeholder="••••••••"
            required 
          />
        </div>

        {error && (
          <p className="text-red-500 text-center font-medium">
            {error}
          </p>
        )}

        <div className="pt-2">
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full text-lg py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-blue-300 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>

        {showRegisterLink && (
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
              Register here
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
