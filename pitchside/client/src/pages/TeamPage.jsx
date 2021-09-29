import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { fetchTeam } from '../api/football';
import TeamCrest from '../components/TeamCrest';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import { useAuth } from '../context/AuthContext';

const groupByPosition = (squad) => {
  const groups = { Goalkeeper: [], Defender: [], Midfielder: [], Forward: [] };
  for (const p of squad || []) {
    (groups[p.position] || (groups[p.position] = [])).push(p);
  }
  return groups;
};

const TeamPage = () => {
  const { compCode, teamId } = useParams();
  const { user, updateFavorites } = useAuth();
  const { data: team, isLoading, isError, error, refetch } = useQuery(
    ['team', compCode, teamId], () => fetchTeam(compCode, teamId)
  );

  const isFav = user?.favoriteTeams?.some((t) => String(t.teamId) === String(teamId));

  const toggleFav = async () => {
    if (!user) { toast.info('Log in to save favorites'); return; }
    const next = isFav
      ? user.favoriteTeams.filter((t) => String(t.teamId) !== String(teamId))
      : [...(user.favoriteTeams || []), { teamId: String(teamId), teamName: team.name, compCode }];
    try {
      await updateFavorites({ favoriteTeams: next });
      toast.success(isFav ? 'Removed from favorites' : 'Added to favorites');
    } catch (e) {
      toast.error(e.userMessage || 'Could not update favorites');
    }
  };

  if (isLoading) return <div className="text-center py-20"><Spinner size="lg" /></div>;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  if (!team) return null;

  const groups = groupByPosition(team.squad);

  return (
    <div>
      <Link to={`/competitions/${compCode}`} className="text-sm text-pitch-700 hover:underline">← Back to competition</Link>

      <header className="card p-6 mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <TeamCrest team={team} size={72} />
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-chalk-900">{team.name}</h1>
          <div className="text-sm text-chalk-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {team.venue && <span>🏟️ {team.venue}</span>}
            {team.founded && <span>📅 Founded {team.founded}</span>}
            {team.competition?.name && <span>🏆 {team.competition.name}</span>}
          </div>
        </div>
        <button
          onClick={toggleFav}
          className={isFav ? 'btn-ghost' : 'btn-primary'}
          aria-pressed={isFav}
        >
          {isFav ? '★ Favorited' : '☆ Add to favorites'}
        </button>
      </header>

      <section className="mt-6">
        <h2 className="font-display text-xl font-bold text-chalk-900 mb-3">Squad</h2>
        {team.squad?.length ? (
          <div className="grid gap-4">
            {Object.entries(groups).map(([pos, players]) => (
              players.length ? (
                <div key={pos}>
                  <h3 className="text-xs uppercase tracking-wider text-chalk-500 font-semibold mb-2">{pos}s</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {players.map((p) => (
                      <div key={p.id} className="card p-3 flex items-center gap-3">
                        <span className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-pitch-50 text-pitch-700 font-bold tabular-nums">
                          {p.shirtNumber || '–'}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-chalk-800 truncate">{p.name}</p>
                          <p className="text-xs text-chalk-500">{p.nationality}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            ))}
          </div>
        ) : (
          <p className="text-chalk-500">Squad information not available.</p>
        )}
      </section>
    </div>
  );
};

export default TeamPage;
