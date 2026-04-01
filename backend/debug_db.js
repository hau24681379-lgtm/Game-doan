import db from './src/db/db.js';
import bcrypt from 'bcrypt';

async function check() {
  try {
    console.log('--- DB Health Check ---');
    const result = await db.raw('SELECT 1+1 AS result');
    console.log('Connection OK:', result.rows[0].result === 2);

    const users = await db('users').select('id', 'username', 'password', 'role');
    console.log('\n--- Current Users in DB ---');
    for (const user of users) {
      const isMatch = await bcrypt.compare('123', user.password);
      console.log(`User: ${user.username}, Role: ${user.role}, Password Match "123": ${isMatch}`);
    }
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

check();
