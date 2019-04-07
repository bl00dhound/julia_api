
exports.up = knex => knex.schema.createTable('users', (table) => {
	table.increments();
	table.timestamps(true, true);
	table.timestamp('removed_at').index();
	table.string('email').notNullable().unique();
	table.string('nickname').notNullable().unique();
	table.string('password');
	table.string('phone');
	table.string('role').defaultTo('user');
});

exports.down = knex => knex.schema.dropTable('users');
