exports.up = function (knex, _Promise) {
    return knex.schema.createTable("chat", function (table) {
      table.increments("id").primary();
      table.string("authorId", 100).notNullable();
      table.string("clientId", 100).notNullable();
      table.text("message").notNullable();
      table
        .timestamp("updatedAt")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      table.timestamp("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    });
  };
  
  exports.down = function (knex, _Promise) {};
  