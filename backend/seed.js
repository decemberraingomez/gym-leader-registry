// Optional helper: fills an EMPTY database with starter Gym Leaders.
// Run once on a new Atlas cluster:  npm run seed
// It never touches a collection that already has data, so it is safe to re-run.
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const GymLeader = require('./models/GymLeader');

const starters = [
  { name: 'Brock', region: 'Kanto', town: 'Pewter City', badge: 'Boulder Badge', specialty: 'Rock', aceLevel: 14, motto: 'My rock-hard willpower is evident even in my Pokémon.' },
  { name: 'Misty', region: 'Kanto', town: 'Cerulean City', badge: 'Cascade Badge', specialty: 'Water', aceLevel: 21, motto: 'My policy is an all-out offensive with Water-type Pokémon!' },
  { name: 'Falkner', region: 'Johto', town: 'Violet City', badge: 'Zephyr Badge', specialty: 'Flying', aceLevel: 9, motto: 'I will show you the elegant beauty of bird Pokémon.' },
  { name: 'Bugsy', region: 'Johto', town: 'Azalea Town', badge: 'Hive Badge', specialty: 'Bug', aceLevel: 17, motto: 'I never lose when it comes to knowledge about Bug Pokémon.' },
  { name: 'Roxanne', region: 'Hoenn', town: 'Rustboro City', badge: 'Stone Badge', specialty: 'Rock', aceLevel: 15, motto: 'I became a Gym Leader so that I may apply what I learned.' },
  { name: 'Brawly', region: 'Hoenn', town: 'Dewford Town', badge: 'Knuckle Badge', specialty: 'Fighting', aceLevel: 19, motto: 'I make the waves, then ride them to victory!' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const existing = await GymLeader.countDocuments();
    if (existing > 0) {
      console.log(`Database already has ${existing} leader(s). Nothing to seed.`);
    } else {
      await GymLeader.insertMany(starters);
      console.log(`Seeded ${starters.length} Gym Leaders.`);
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
