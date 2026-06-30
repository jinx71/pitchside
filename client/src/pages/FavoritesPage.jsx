import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { fetchCompetitions, fetchToday } from '../api/football';
import { useAuth } from '../context/AuthContext';
import MatchCard from '../components/MatchCard';
import TeamCrest from '../components/TeamCrest';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';

const FavoritesPage = () => {
  const { user, updateFavorites } = useAuth();
  const compQuery = useQuery('competitions', fetchCompetitions);
  const todayQuery = useQuery('today', fetchToday);

  const favComps = user?.favoriteCompetitions || [];
  const favTeams = user?.favoriteTeams || [];

  const toggleComp = async (code) => {
    const next = favComps.includes(code)
      ? favComps.filter((c) => c !== code)
      : [...favComps, code];
    try {
      await updateFavorites({ favoriteCompetitions: next });
    } catch (e) {
      toast.error(e.userMessage || 'Could not update');
    }
  };

  const removeTeam = async (teamId) => {
    const next = favTeams.filter((t) => String(t.teamId) !== String(teamId));
    try {
      await updateFavorites({ favoriteTeams: next });
      toast.success('Removed from favorites');
    } catch (e) {
      toast.error(e.userMessage || 'Could not update');
    }
  };

  const favoriteFixturesToday = useMemo(() => {
    if (!todayQuery.data) return [];
    const teamIds = new Set(favTeams.map((t) => String(t.teamId)));
    const compCodes = new Set(favComps);
    return todayQuery.data.filter((m) =>
      teamIds.has(String(m.homeTeam?.id)) ||
      teamIds.has(String(m.awayTeam?.id)) ||
      compCodes.has(m.competition?.code)
    );
  }, [todayQuery.data, favTeams, favComps]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-chalk-900">Your favorites</h1>
        <p className="text-chalk-500 mt-1">
          Hi {user?.name?.split(' ')[0]} — pinned competitions and teams.
        </p>
      </header>

      <section>
        <h2 className="font-display text-xl font-bold text-chalk-900 mb-3">Today's relevant fixtures</h2>
        {todayQuery.isLoading ? (
          <div className="text-center py-6"><Spinner /></div>
        ) : favoriteFixturesToday.length ? (
          <div className="grid gap-3">
            {favoriteFixturesToday.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div className="card p-6 text-center text-chalk-500">
            No relevant fixtures today.{' '}
            <Link to="/" className="text-pitch-700 hover:underline">See all today's matches →</Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-chalk-900 mb-3">Competitions</h2>
        {compQuery.isLoading ? (
          <div className="text-center py-6"><Spinner /></div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(compQuery.data?.competitions || []).map((c) => {
              const on = favComps.includes(c.code);
              return (
                <button
                  key={c.code}
                  onClick={() => toggleComp(c.code)}
                  className={`pill border transition ${
                    on
                      ? 'bg-pitch-600 text-white border-pitch-600'
                      : 'bg-white border-chalk-200 text-chalk-700 hover:border-pitch-400'
                  }`}
                  aria-pressed={on}
                >
                  {on ? '★' : '☆'} {c.name}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-chalk-900 mb-3">Teams</h2>
        {favTeams.length === 0 ? (
          <EmptyState
            icon="⭐"
            title="No favorite teams yet"
            message="Visit a team page and tap “Add to favorites”."
            action={<Link to="/competitions" className="btn-primary">Browse competitions</Link>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favTeams.map((t) => (
              <div key={t.teamId} className="card p-4 flex items-center justify-between">
                <Link to={`/teams/${t.compCode}/${t.teamId}`} className="flex items-center gap-3 min-w-0 hover:underline">
                  <TeamCrest team={{ name: t.teamName }} size={36} />
                  <div className="min-w-0">
                    <p className="font-medium text-chalk-800 truncate">{t.teamName}</p>
                    <p className="text-xs text-chalk-500">{t.compCode}</p>
                  </div>
                </Link>
                <button
                  onClick={() => removeTeam(t.teamId)}
                  className="text-chalk-400 hover:text-red-600 text-sm"
                  aria-label={`Remove ${t.teamName}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FavoritesPage;
