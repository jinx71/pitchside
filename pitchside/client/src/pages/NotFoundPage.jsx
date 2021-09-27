import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="text-center py-20">
    <div className="text-6xl mb-3" aria-hidden>🥅</div>
    <h1 className="font-display text-3xl font-bold text-chalk-900">Off the pitch</h1>
    <p className="text-chalk-500 mt-1 mb-5">That page doesn't exist.</p>
    <Link to="/" className="btn-primary">Back to today's fixtures</Link>
  </div>
);

export default NotFoundPage;
