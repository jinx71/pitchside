import React from 'react';
import { Link } from 'react-router-dom';
import TeamCrest from './TeamCrest';
import { formatKickoff, statusLabel, isLive } from '../utils/format';

const Score = ({ value }) => (
  <span className="inline-block min-w-[1.5rem] text-center font-display font-bold text-lg tabular-nums">
    {value ?? '–'}
  </span>
);

const StatusPill = ({ status, minute }) => {
  const live = isLive(status);
  const label = statusLabel(status, minute);
  if (status === 'SCHEDULED' || status === 'TIMED' || !label) return null;
  return (
    <span
      className={`pill ${live ? 'bg-red-50 text-red-600' : 'bg-chalk-100 text-chalk-700'}`}
      aria-live={live ? 'polite' : 'off'}
    >
      {live && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5 live-dot" />}
      {label}
    </span>
  );
};

const Side = ({ team, compCode, align = 'left' }) => {
  const className = align === 'left'
    ? 'flex items-center gap-2.5 min-w-0'
    : 'flex items-center gap-2.5 min-w-0 justify-end';
  const inner = (
    <>
      {align === 'right' && <span className="truncate text-chalk-800">{team?.name || 'TBD'}</span>}
      <TeamCrest team={team} />
      {align === 'left' && <span className="truncate text-chalk-800">{team?.name || 'TBD'}</span>}
    </>
  );
  if (compCode && team?.id) {
    return (
      <Link to={`/teams/${compCode}/${team.id}`} className={`${className} hover:underline`}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
};

const MatchCard = ({ match }) => {
  const { homeTeam, awayTeam, score, status, minute, utcDate, competition } = match;
  const compCode = competition?.code;
  return (
    <article className="card p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between gap-2 mb-3">
        <Link
          to={compCode ? `/competitions/${compCode}` : '#'}
          className="text-xs font-semibold text-pitch-700 uppercase tracking-wide hover:underline"
        >
          {competition?.name || compCode || 'Match'}
        </Link>
        <div className="flex items-center gap-2">
          {(status === 'SCHEDULED' || status === 'TIMED') && (
            <span className="text-xs text-chalk-500">{formatKickoff(utcDate)}</span>
          )}
          <StatusPill status={status} minute={minute} />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <Side team={homeTeam} compCode={compCode} align="left" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-chalk-50">
          <Score value={score?.home} />
          <span className="text-chalk-400 font-medium">:</span>
          <Score value={score?.away} />
        </div>
        <Side team={awayTeam} compCode={compCode} align="right" />
      </div>
    </article>
  );
};

export default MatchCard;
