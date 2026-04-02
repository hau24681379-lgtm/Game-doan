export const up = function(knex) {
  return knex.schema
    .createTable('game_sessions', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('game_id').unsigned().references('id').inTable('games').onDelete('CASCADE');
      table.integer('score').defaultTo(0);
      table.json('game_state'); // Stores complex board states
      table.integer('seconds_left').defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('game_reviews', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('game_id').unsigned().references('id').inTable('games').onDelete('CASCADE');
      table.integer('rating').notNullable(); // 1-5
      table.text('comment');
      table.timestamps(true, true);
    });
};

export const down = function(knex) {
  return knex.schema
    .dropTableIfExists('game_reviews')
    .dropTableIfExists('game_sessions');
};
