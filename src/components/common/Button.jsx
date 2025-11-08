// src/components/common/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false, 
  ...rest 
}) => {
  
  const baseStyle = 'font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white focus:ring-blue-500'
  };

  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${disabledStyle} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;