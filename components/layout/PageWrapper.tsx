
import React from 'react';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="p-8">
      {children}
    </div>
  );
};

export default PageWrapper;
