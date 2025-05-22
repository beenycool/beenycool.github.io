require('dotenv').config();
const User = require('../models/User');
const { sequelize } = require('../db/config');

async function createAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully.');

    // Create admin user
    const adminUser = await User.create({
      username: 'beeny',
      email: 'admin@example.com', // Replace with actual email
      password: 'Beeny1234!?',
      role: 'admin'
    });

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      username: adminUser.username,
      role: adminUser.role
    });

    await sequelize.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 