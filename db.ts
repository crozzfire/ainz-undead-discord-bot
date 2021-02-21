import loki from 'lokijs';

const db = new loki('ainz.db', {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000
});

export default db;