exports.up = knex => knex.schema.createTable('comments', table => {
	table.increments();
	table.timestamps(true, true);
	table.timestamp('removed_at').index();
	table.integer('author_id').notNullable().references('users.id').index();
	table.integer('parent_id').references('comments.id').index();
	table.text('content');
});

exports.down = knex => knex.schema.dropTable('comments');
