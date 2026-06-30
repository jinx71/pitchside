import React from 'react';

const CompetitionTabs = ({ competitions, value, onChange }) => {
  if (!competitions?.length) return null;
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
      <button
        onClick={() => onChange('')}
        className={`pill border whitespace-nowrap ${
          value === '' ? 'bg-pitch-600 text-white border-pitch-600' : 'bg-white border-chalk-200 text-chalk-700 hover:border-pitch-400'
        }`}
      >
        All
      </button>
      {competitions.map((c) => (
        <button
          key={c.code}
          onClick={() => onChange(c.code)}
          className={`pill border whitespace-nowrap ${
            value === c.code ? 'bg-pitch-600 text-white border-pitch-600' : 'bg-white border-chalk-200 text-chalk-700 hover:border-pitch-400'
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
};

export default CompetitionTabs;
