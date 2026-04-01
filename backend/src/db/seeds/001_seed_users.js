import bcrypt from 'bcrypt';

export const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  const saltRounds = 10;
  const hashedAdmin1 = await bcrypt.hash('admin123', saltRounds);
  const hashedAdmin2 = await bcrypt.hash('admin456', saltRounds);
  const hashedPlayer1 = await bcrypt.hash('player1', saltRounds);
  const hashedPlayer2 = await bcrypt.hash('player2', saltRounds);
  const hashedPlayer3 = await bcrypt.hash('player3', saltRounds);
  const hashedPlayer4 = await bcrypt.hash('player4', saltRounds);
  const hashedPlayer5 = await bcrypt.hash('player5', saltRounds);
  const hashedPlayer6 = await bcrypt.hash('player6', saltRounds);
  const hashedPlayer7 = await bcrypt.hash('player7', saltRounds);

  await knex('users').insert([
    { id: 1, username: 'admin', password: hashedAdmin1, role: 'admin' },
    { id: 2, username: 'admin2', password: hashedAdmin2, role: 'admin' },
    { id: 3, username: 'player1', password: hashedPlayer1, role: 'client' },
    { id: 4, username: 'player2', password: hashedPlayer2, role: 'client' },
    { id: 5, username: 'player3', password: hashedPlayer3, role: 'client' },
    { id: 6, username: 'player4', password: hashedPlayer4, role: 'client' },
    { id: 7, username: 'player5', password: hashedPlayer5, role: 'client' },
    { id: 8, username: 'player6', password: hashedPlayer6, role: 'client' },
    { id: 9, username: 'player7', password: hashedPlayer7, role: 'client' }
  ]);
};
