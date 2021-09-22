import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { fetchCompetitions } from '../api/football';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';

const accentByCode = {
  PL: 'from-purple-100 to-purple-50 text-purple-800',
  PD: 'from-rose-100 to-rose-50 text-rose-800',
  SA: 'from-blue-100 to-blue-50 text-blue-800',
  BL1: 'from-amber-100 to-amber-50 text-amber-800',
  FL1: 'from-sky-100 to-sky-50 text-sky-800',
  CL: 'from-pitch-100 to-pitch-50 text-pitch-800',
};

const CompetitionsListPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery('competitions', fetchCompetitions);

  if (isLoading) return <div className="text-center py-20"><Spinner size="lg" /></div>;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold text-chalk-900">Competitions</h1>
        <p className="text-chalk-500 mt-1">Fixtures, results and standings.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(data?.competitions || []).map((c) => (
          <Link
            key={c.code}
            to={`/competitions/${c.code}`}
            className={`card p-5 hover:shadow-md transition bg-gradient-to-br ${accentByCode[c.code] || 'from-chalk-100 to-chalk-50 text-chalk-800'}`}
          >
            <div className="text-3xl mb-2" aria-hidden>{c.emblem || '🏆'}</div>
            <h3 className="font-display font-bold text-lg">{c.name}</h3>
            <p className="text-sm opacity-80">{c.area}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CompetitionsListPage;
