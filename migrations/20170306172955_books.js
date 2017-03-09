
exports.up = function(knex) {
  return knex.schema.createTable('books', (table) => {
    // integer id
    table.increments();
    // title
    table.string('title').notNullable().defaultTo('');
    // author
    table.string('author').notNullable().defaultTo('');
    // genre
    table.string('genre').notNullable().defaultTo('');
    // description
    table.text('description').notNullable().defaultTo('');
    table.text('cover_url').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('books');
};
