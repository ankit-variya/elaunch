exports.up = function (knex, _Promise) {
    return knex.schema.createTable("users", function (table) {
      table.increments("id").primary();
      table.string("firstname", 100).notNullable();
      table.string("lastname", 100).notNullable();
      table.string("email", 200).unique().notNullable();
      table.string("mobile", 20).unique().notNullable();
      table.string("password", 100).notNullable();
      table.string("gender", 20).notNullable();
      table.string("locationId").notNullable();
      table.string("profileImage", 200).notNullable();
      table.boolean("isVisible").defaultTo(0).notNullable();
      table.text("token").notNullable();
      table
        .timestamp("updatedAt")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
      table.timestamp("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    });
  };
  
  exports.down = function (knex, _Promise) {};
  