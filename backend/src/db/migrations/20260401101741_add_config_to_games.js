export const up = function(knex) {
  return knex.schema.table('games', (table) => {
    table.json('config').nullable();
  });
};

export const down = function(knex) {
  return knex.schema.table('games', (table) => {
    table.dropColumn('config');
  });
};
