import React, { useState } from 'react';

const TeamCrest = ({ team, size = 28 }) => {
  const [errored, setErrored] = useState(false);
  const initials = (team?.shortName || team?.name || '?')
    .split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase();

  if (!team?.crest || errored) {
    return (
      <div
        className="inline-flex items-center justify-center rounded-full bg-pitch-100 text-pitch-700 font-semibold"
        style={{ width: size, height: size, fontSize: Math.max(10, size / 2.6) }}
        aria-label={team?.name || 'Team'}
      >
        {initials}
      </div>
    );
  }
  return (
    <img
      src={team.crest}
      onError={() => setErrored(true)}
      width={size} height={size}
      alt={team.name}
      className="inline-block rounded-full bg-chalk-100 object-contain"
    />
  );
};

export default TeamCrest;
