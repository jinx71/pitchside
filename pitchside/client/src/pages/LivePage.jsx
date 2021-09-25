import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchLive } from '../api/football';
import MatchCard from '../components/MatchCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Spinner from '../components/Spinner';
import useAutoRefresh from '../hooks/useAutoRefresh';

const LivePage = () => {
  const [auto, setAuto] = useState(true);

  const liveQuery = useQuery('live', fetchLive, {
    // React Query handles the polling; useAutoRefresh shown as an example of
    // the same lesson — only the server is allowed to talk to Football-Data.
    refetchInterval: auto ? 30 * 1000 : false,
    refetchIntervalInBackground: false,
  });

  useAutoRefresh(() => liveQuery.refetch(), 30000, false); // disabled — RQ is driving

  const matches = liveQuery.data || [];

  return (
    <div>
      <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-chalk-900 flex items-center gap-3">
            Live now
            {matches.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-base font-medium text-red-600">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 live-dot" />
                {matches.length}
              </span>
            )}
          </h1>
          <p className="text-chalk-500 mt-1">
            Polls every 30s — but the upstream API is only hit when our cache misses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {liveQuery.isFetching && !liveQuery.isLoading && <Spinner size="sm" />}
          <label className="inline-flex items-center gap-2 text-sm text-chalk-700">
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) => setAuto(e.target.checked)}
              className="rounded border-chalk-300 text-pitch-600 focus:ring-pitch-500"
            />
            Auto-refresh
          </label>
        </div>
      </header>

      {liveQuery.isLoading && (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {liveQuery.isError && (
        <ErrorState error={liveQuery.error} onRetry={() => liveQuery.refetch()} />
      )}

      {liveQuery.isSuccess && matches.length === 0 && (
        <EmptyState
          icon="🌙"
          title="Nothing live right now"
          message="When kick-off whistles blow somewhere, scores will appear here automatically."
        />
      )}

      {liveQuery.isSuccess && matches.length > 0 && (
        <div className="grid gap-3">
          {matches.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      )}
    </div>
  );
};

export default LivePage;
