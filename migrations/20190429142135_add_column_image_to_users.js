exports.up = knex => knex.schema.table('users', table => {
	table.string('image', 255);
});

exports.down = knex => knex.schema.table('users', table => {
	table.dropColumn('image');
});
