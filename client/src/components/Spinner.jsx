import React from 'react';

const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' };

const Spinner = ({ size = 'md', className = '' }) => (
  <div className={`inline-block ${sizes[size]} border-pitch-200 border-t-pitch-600 rounded-full animate-spin ${className}`}
       role="status" aria-label="Loading" />
);

export default Spinner;
