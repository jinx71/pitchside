// Using JS Date wrapped to mirror dayjs's tiny API surface we need.
// Avoids forcing a server-side dayjs install when only basic math is needed.
const pad = (n) => String(n).padStart(2, '0');

const wrap = (d) => ({
  _d: d,
  toDate: () => new Date(d),
  toISOString: () => d.toISOString(),
  add: (n, unit) => {
    const next = new Date(d);
    if (unit === 'day') next.setDate(next.getDate() + n);
    else if (unit === 'hour') next.setHours(next.getHours() + n);
    else if (unit === 'minute') next.setMinutes(next.getMinutes() + n);
    return wrap(next);
  },
  hour: (h) => { const n = new Date(d); n.setHours(h); return wrap(n); },
  minute: (m) => { const n = new Date(d); n.setMinutes(m); return wrap(n); },
  second: (s) => { const n = new Date(d); n.setSeconds(s); return wrap(n); },
  format: (fmt) => {
    if (fmt === 'YYYY-MM-DD') return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (fmt === 'YYYY-MM') return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    return d.toISOString();
  },
});

module.exports = () => wrap(new Date());
