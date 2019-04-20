exports.up = knex => knex.schema.createTable('articles', table => {
	table.increments();
	table.timestamps(true, true);
	table.timestamp('removed_at').index();
	table.string('title').notNullable();
	table.string('status').notNullable().defaultTo('pending').index();
	table.text('content');
	table.integer('author_id').references('users.id').index();
	table.specificType('tags', 'character varying(255)[]')
		.defaultTo('{}')
		.index('tags_articles_index', 'gin');
});

exports.down = knex => knex.schema.dropTable('articles');
