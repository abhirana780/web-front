import React from 'react';

const Cover = ({ children, className }) => {
  return (
    <span className={`bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
};

export { Cover };
