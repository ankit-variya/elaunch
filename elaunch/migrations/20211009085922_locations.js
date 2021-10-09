exports.up = function (knex, _Promise) {
    return knex.schema.createTable("locations", function (table) {
      table.increments("id").primary();
      table.string("country").notNullable();
      table.string("state").notNullable();
      table
        .timestamp("updatedAt")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      table.timestamp("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    });
  };
  
  exports.down = function (knex, _Promise) {};
  