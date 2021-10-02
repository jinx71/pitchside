import dayjs from 'dayjs';

export const formatKickoff = (iso) => {
  if (!iso) return '';
  const d = dayjs(iso);
  const today = dayjs();
  if (d.isSame(today, 'day')) return `Today ${d.format('HH:mm')}`;
  if (d.isSame(today.add(1, 'day'), 'day')) return `Tomorrow ${d.format('HH:mm')}`;
  if (d.isSame(today.subtract(1, 'day'), 'day')) return `Yesterday ${d.format('HH:mm')}`;
  return d.format('ddd D MMM, HH:mm');
};

export const statusLabel = (status, minute) => {
  switch (status) {
    case 'LIVE':
    case 'IN_PLAY':
      return minute ? `${minute}'` : 'LIVE';
    case 'PAUSED': return 'HT';
    case 'FINISHED': return 'FT';
    case 'POSTPONED': return 'PP';
    case 'SCHEDULED': return '';
    case 'TIMED': return '';
    default: return status;
  }
};

export const isLive = (status) => status === 'LIVE' || status === 'IN_PLAY' || status === 'PAUSED';
