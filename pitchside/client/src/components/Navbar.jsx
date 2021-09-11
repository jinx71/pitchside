import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Today' },
  { to: '/live', label: 'Live' },
  { to: '/competitions', label: 'Competitions' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const onLogout = () => { logout(); nav('/'); };
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-pitch-600 text-white' : 'text-chalk-700 hover:bg-chalk-100'
    }`;

  return (
    <header className="bg-white border-b border-chalk-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-pitch-600 text-white text-lg">⚽</span>
          <span className="font-display font-bold text-xl text-chalk-900">PitchSide</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/favorites" className={linkClass}>Favorites</NavLink>
              <span className="text-sm text-chalk-500">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={onLogout} className="btn-ghost text-sm">Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost text-sm">Log in</NavLink>
              <NavLink to="/register" className="btn-primary text-sm">Sign up</NavLink>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-chalk-100"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block w-5 h-0.5 bg-chalk-800 mb-1.5" />
          <span className="block w-5 h-0.5 bg-chalk-800 mb-1.5" />
          <span className="block w-5 h-0.5 bg-chalk-800" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-chalk-100 bg-white">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/favorites" className={linkClass} onClick={() => setOpen(false)}>Favorites</NavLink>
                <button onClick={() => { onLogout(); setOpen(false); }} className="btn-ghost text-sm justify-start">Log out</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>Log in</NavLink>
                <NavLink to="/register" className={linkClass} onClick={() => setOpen(false)}>Sign up</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
