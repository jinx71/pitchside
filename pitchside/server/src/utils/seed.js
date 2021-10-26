require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');
    await User.deleteMany({ email: { $in: ['fan@pitchside.dev'] } });
    await User.create({
      name: 'Demo Fan',
      email: 'fan@pitchside.dev',
      password: 'password123',
      favoriteCompetitions: ['PL', 'CL'],
      favoriteTeams: [{ teamId: '64', teamName: 'Liverpool', compCode: 'PL' }],
    });
    console.log('✅ Seeded demo user: fan@pitchside.dev / password123');
    process.exit(0);
  } catch (e) {
    console.error('Seed failed:', e.message);
    process.exit(1);
  }
};
run();
