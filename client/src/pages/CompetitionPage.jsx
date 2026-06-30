import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchCompetitionMatches, fetchStandings, fetchCompetitions } from '../api/football';
import MatchCard from '../components/MatchCard';
import TeamCrest from '../components/TeamCrest';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

const TABS = [
  { key: 'fixtures', label: 'Fixtures', status: 'SCHEDULED' },
  { key: 'results', label: 'Results', status: 'FINISHED' },
  { key: 'standings', label: 'Standings' },
];

const StandingsTable = ({ code }) => {
  const { data, isLoading, isError, error, refetch } = useQuery(
    ['standings', code], () => fetchStandings(code)
  );

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-10 bg-chalk-100 rounded animate-pulse" />)}</div>;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  if (!data?.table?.length) return <EmptyState icon="📊" title="No standings available" />;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-chalk-50 text-chalk-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3 w-12">#</th>
              <th className="text-left px-4 py-3">Team</th>
              <th className="text-center px-2 py-3">P</th>
              <th className="text-center px-2 py-3 hidden sm:table-cell">W</th>
              <th className="text-center px-2 py-3 hidden sm:table-cell">D</th>
              <th className="text-center px-2 py-3 hidden sm:table-cell">L</th>
              <th className="text-center px-2 py-3 hidden md:table-cell">GF</th>
              <th className="text-center px-2 py-3 hidden md:table-cell">GA</th>
              <th className="text-center px-2 py-3">GD</th>
              <th className="text-center px-3 py-3 font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {data.table.map((row) => (
              <tr key={row.team.id} className="border-t border-chalk-100 hover:bg-chalk-50">
                <td className="px-4 py-3 text-chalk-500 font-medium">{row.position}</td>
                <td className="px-4 py-3">
                  <Link to={`/teams/${code}/${row.team.id}`} className="inline-flex items-center gap-2 hover:underline">
                    <TeamCrest team={row.team} size={22} />
                    <span className="font-medium text-chalk-800">{row.team.name}</span>
                  </Link>
                </td>
                <td className="px-2 py-3 text-center tabular-nums">{row.playedGames}</td>
                <td className="px-2 py-3 text-center tabular-nums hidden sm:table-cell">{row.won}</td>
                <td className="px-2 py-3 text-center tabular-nums hidden sm:table-cell">{row.drawn}</td>
                <td className="px-2 py-3 text-center tabular-nums hidden sm:table-cell">{row.lost}</td>
                <td className="px-2 py-3 text-center tabular-nums hidden md:table-cell">{row.goalsFor}</td>
                <td className="px-2 py-3 text-center tabular-nums hidden md:table-cell">{row.goalsAgainst}</td>
                <td className="px-2 py-3 text-center tabular-nums">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                <td className="px-3 py-3 text-center font-bold tabular-nums text-pitch-700">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MatchesList = ({ code, status }) => {
  const { data, isLoading, isError, error, refetch } = useQuery(
    ['compMatches', code, status], () => fetchCompetitionMatches(code, status)
  );
  if (isLoading) return <div className="grid gap-3">{Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}</div>;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  if (!data?.length) return <EmptyState icon={status === 'FINISHED' ? '📜' : '📅'} title={status === 'FINISHED' ? 'No recent results' : 'No upcoming fixtures'} />;
  return <div className="grid gap-3">{data.map((m) => <MatchCard key={m.id} match={m} />)}</div>;
};

const CompetitionPage = () => {
  const { code } = useParams();
  const [tab, setTab] = useState('fixtures');
  const compQuery = useQuery('competitions', fetchCompetitions);
  const comp = compQuery.data?.competitions?.find((c) => c.code === code);

  return (
    <div>
      <header className="mb-6">
        <Link to="/competitions" className="text-sm text-pitch-700 hover:underline">← All competitions</Link>
        <h1 className="font-display text-3xl font-bold text-chalk-900 mt-1 flex items-center gap-3">
          <span aria-hidden>{comp?.emblem || '🏆'}</span>
          {comp?.name || code}
        </h1>
        {comp?.area && <p className="text-chalk-500 mt-1">{comp.area}</p>}
      </header>

      <div className="flex gap-2 mb-5 border-b border-chalk-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
              tab === t.key ? 'border-pitch-600 text-pitch-700' : 'border-transparent text-chalk-500 hover:text-chalk-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'fixtures' && <MatchesList code={code} status="SCHEDULED" />}
      {tab === 'results' && <MatchesList code={code} status="FINISHED" />}
      {tab === 'standings' && <StandingsTable code={code} />}
    </div>
  );
};

export default CompetitionPage;
