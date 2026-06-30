import React from 'react';

const ErrorState = ({ error, onRetry }) => (
  <div className="text-center py-16 px-6">
    <div className="text-5xl mb-3" aria-hidden>⚠️</div>
    <h3 className="font-display text-xl text-chalk-800 mb-1">Something went wrong</h3>
    <p className="text-chalk-500 max-w-md mx-auto">{error?.userMessage || error?.message || 'Please try again.'}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary mt-5">Try again</button>
    )}
  </div>
);

export default ErrorState;
