import React from 'react';

const Footer = () => (
  <footer className="mt-16 border-t border-chalk-100 bg-white">
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-chalk-500">
      <p>
        <span className="font-display font-bold text-pitch-700">PitchSide</span> · Data: Football-Data.org · Cached server-side
      </p>
      <p>Built with the MERN stack · 2021–2022 conventions</p>
    </div>
  </footer>
);

export default Footer;
