import bcrypt from 'bcrypt';

export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  const saltRounds = 10;
  const commonHash = await bcrypt.hash('123', saltRounds);

  await knex('users').insert([
    { username: 'admin', password: commonHash, role: 'admin' },
    { username: 'admin2', password: commonHash, role: 'admin' },
    { username: 'player1', password: commonHash, role: 'client' },
    { username: 'player2', password: commonHash, role: 'client' },
    { username: 'player3', password: commonHash, role: 'client' },
    { username: 'player4', password: commonHash, role: 'client' },
    { username: 'player5', password: commonHash, role: 'client' },
    { username: 'player6', password: commonHash, role: 'client' },
    { username: 'player7', password: commonHash, role: 'client' }
  ]);
};
