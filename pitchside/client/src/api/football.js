import api from './client';

export const fetchCompetitions = async () => {
  const { data } = await api.get('/football/competitions');
  return data.data;
};

export const fetchLive = async () => {
  const { data } = await api.get('/football/matches/live');
  return data.data.matches;
};

export const fetchToday = async () => {
  const { data } = await api.get('/football/matches/today');
  return data.data.matches;
};

export const fetchCompetitionMatches = async (code, status = 'SCHEDULED') => {
  const { data } = await api.get(`/football/competitions/${code}/matches`, {
    params: { status },
  });
  return data.data.matches;
};

export const fetchStandings = async (code) => {
  const { data } = await api.get(`/football/competitions/${code}/standings`);
  return data.data;
};

export const fetchTeam = async (compCode, teamId) => {
  const { data } = await api.get(`/football/teams/${compCode}/${teamId}`);
  return data.data.team;
};
