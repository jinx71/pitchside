import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import TodayPage from './pages/TodayPage';
import LivePage from './pages/LivePage';
import CompetitionsListPage from './pages/CompetitionsListPage';
import CompetitionPage from './pages/CompetitionPage';
import TeamPage from './pages/TeamPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => (
  <div className="min-h-full flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
      <Routes>
        <Route path="/" element={<TodayPage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/competitions" element={<CompetitionsListPage />} />
        <Route path="/competitions/:code" element={<CompetitionPage />} />
        <Route path="/teams/:compCode/:teamId" element={<TeamPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
