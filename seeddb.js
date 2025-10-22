const db = require('./models');
const bcrypt = require('bcrypt');

(async () => {
  await db.sequelize.sync({ force: true }); // create tables

  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await db.Auth.create({ login: 'admin', password: hashedPassword });

  console.log('Admin user created');
  process.exit(0);
})();
