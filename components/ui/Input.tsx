
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full bg-bolt-dark-3 border border-bolt-gray/30 rounded-lg px-4 py-2 text-bolt-light placeholder-bolt-gray focus:outline-none focus:ring-2 focus:ring-bolt-accent transition-all duration-300 ${className}`}
      {...props}
    />
  );
};

export default Input;
