import React from 'react';

const EmptyState = ({ icon = '⚽', title = 'Nothing to show', message, action }) => (
  <div className="text-center py-16 px-6">
    <div className="text-5xl mb-3" aria-hidden>{icon}</div>
    <h3 className="font-display text-xl text-chalk-800 mb-1">{title}</h3>
    {message && <p className="text-chalk-500 max-w-md mx-auto">{message}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
