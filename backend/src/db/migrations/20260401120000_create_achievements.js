export const up = function(knex) {
  return knex.schema
    .createTable('achievements', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('description');
      table.string('icon_url');
      table.string('category'); // 'score', 'social', 'game_count'
      table.integer('threshold'); // the value needed to achieve this
      table.timestamps(true, true);
    })
    .createTable('user_achievements', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('achievement_id').unsigned().references('id').inTable('achievements').onDelete('CASCADE');
      table.timestamp('earned_at').defaultTo(knex.fn.now());
      table.unique(['user_id', 'achievement_id']);
    });
};

export const down = function(knex) {
  return knex.schema
    .dropTableIfExists('user_achievements')
    .dropTableIfExists('achievements');
};
