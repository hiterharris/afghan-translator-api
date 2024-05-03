/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('logs', tbl => {
      tbl.increments('id');
      tbl.dateTime('created_at').defaultTo(knex.fn.now());
      tbl.string('request_language').notNullable();
      tbl.string('request_text').notNullable();
      tbl.string('response_latin').notNullable();
      tbl.string('response_arabic');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('logs');
  };
  