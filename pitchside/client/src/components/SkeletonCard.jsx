import React from 'react';

const SkeletonCard = () => (
  <div className="card p-4 animate-pulse">
    <div className="flex justify-between mb-3">
      <div className="h-3 w-24 bg-chalk-100 rounded" />
      <div className="h-3 w-16 bg-chalk-100 rounded" />
    </div>
    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-chalk-100" />
        <div className="h-4 w-24 bg-chalk-100 rounded" />
      </div>
      <div className="h-8 w-16 rounded-lg bg-chalk-100" />
      <div className="flex items-center gap-2.5 justify-end">
        <div className="h-4 w-24 bg-chalk-100 rounded" />
        <div className="w-7 h-7 rounded-full bg-chalk-100" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
