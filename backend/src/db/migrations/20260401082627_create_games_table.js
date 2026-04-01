export const up = function(knex) {
  return knex.schema.createTable('games', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('slug').unique().notNullable(); // e.g. "caro-5", "snake"
    table.text('description');
    table.string('icon_color').defaultTo('#2196f3');
    table.integer('position_x').defaultTo(0);
    table.integer('position_y').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.integer('min_players').defaultTo(1);
    table.integer('max_players').defaultTo(2);
    table.timestamps(true, true);
  });
};

export const down = function(knex) {
  return knex.schema.dropTableIfExists('games');
};
