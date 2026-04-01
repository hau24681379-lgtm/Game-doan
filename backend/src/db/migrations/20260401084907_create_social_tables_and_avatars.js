export const up = function(knex) {
  return knex.schema
    .alterTable('users', (table) => {
      table.string('avatar_url').defaultTo('https://api.dicebear.com/7.x/pixel-art/svg?seed=Lucky');
    })
    .createTable('friends', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('friend_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('status').defaultTo('pending'); // 'pending', 'accepted', 'rejected'
      table.unique(['user_id', 'friend_id']);
      table.timestamps(true, true);
    })
    .createTable('messages', (table) => {
      table.increments('id').primary();
      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('receiver_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.text('content').notNullable();
      table.boolean('is_read').defaultTo(false);
      table.timestamps(true, true);
    });
};

export const down = function(knex) {
  return knex.schema
    .dropTableIfExists('messages')
    .dropTableIfExists('friends')
    .alterTable('users', (table) => {
      table.dropColumn('avatar_url');
    });
};
