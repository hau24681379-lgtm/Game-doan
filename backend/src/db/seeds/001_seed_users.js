import bcrypt from 'bcrypt';

export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  const saltRounds = 10;
  const commonHash = await bcrypt.hash('123', saltRounds);

  await knex('users').insert([
    { id: 1, username: 'admin', password: commonHash, role: 'admin' },
    { id: 2, username: 'admin2', password: commonHash, role: 'admin' },
    { id: 3, username: 'player1', password: commonHash, role: 'client' },
    { id: 4, username: 'player2', password: commonHash, role: 'client' },
    { id: 5, username: 'player3', password: commonHash, role: 'client' },
    { id: 6, username: 'player4', password: commonHash, role: 'client' },
    { id: 7, username: 'player5', password: commonHash, role: 'client' },
    { id: 8, username: 'player6', password: commonHash, role: 'client' },
    { id: 9, username: 'player7', password: commonHash, role: 'client' }
  ]);
};
