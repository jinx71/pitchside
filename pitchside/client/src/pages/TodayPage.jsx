import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchToday, fetchCompetitions } from '../api/football';
import MatchCard from '../components/MatchCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import CompetitionTabs from '../components/CompetitionTabs';

const TodayPage = () => {
  const [comp, setComp] = useState('');

  const compQuery = useQuery('competitions', fetchCompetitions);
  const todayQuery = useQuery('today', fetchToday, {
    refetchInterval: 2 * 60 * 1000, // 2min — matches server cache TTL
  });

  const matches = useMemo(() => {
    const all = todayQuery.data || [];
    return comp ? all.filter((m) => m.competition?.code === comp) : all;
  }, [todayQuery.data, comp]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold text-chalk-900">Today's fixtures</h1>
        <p className="text-chalk-500 mt-1">
          Live updates served from cache — gentle on the rate limit.
        </p>
      </header>

      <div className="mb-5">
        <CompetitionTabs
          competitions={compQuery.data?.competitions || []}
          value={comp}
          onChange={setComp}
        />
      </div>

      {todayQuery.isLoading && (
        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {todayQuery.isError && (
        <ErrorState error={todayQuery.error} onRetry={() => todayQuery.refetch()} />
      )}

      {todayQuery.isSuccess && matches.length === 0 && (
        <EmptyState
          icon="📭"
          title="No matches scheduled"
          message={comp ? 'Nothing in this competition today.' : 'Check back later — football never sleeps for long.'}
        />
      )}

      {todayQuery.isSuccess && matches.length > 0 && (
        <div className="grid gap-3">
          {matches.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  );
};

export default TodayPage;
