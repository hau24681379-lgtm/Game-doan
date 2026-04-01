import db from './src/db/db.js';

async function fixAdmin() {
  try {
    const user = await db('users').where({ username: 'admin' }).first();
    if (!user) {
      console.log('User admin not found. Creation might be needed.');
    } else {
      await db('users').where({ id: user.id }).update({ role: 'admin' });
      console.log('User admin role forced to admin successfully.');
    }
  } catch (error) {
    console.error('Error fixing admin:', error);
  } finally {
    process.exit(0);
  }
}

fixAdmin();
