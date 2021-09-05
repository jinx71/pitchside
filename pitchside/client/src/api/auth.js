import api from './client';

export const apiRegister = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data.data;
};

export const apiLogin = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
};

export const apiMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};

export const apiUpdateFavorites = async (payload) => {
  const { data } = await api.put('/auth/favorites', payload);
  return data.data.user;
};
