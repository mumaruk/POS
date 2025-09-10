
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-bolt-dark-2/50 backdrop-blur-sm border border-bolt-dark-3 rounded-2xl p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;
