exports.up = knex => knex.schema.createTable('likes', table => {
	table.integer('user_id').references('users.id').notNullable().index();
	table.integer('article_id').references('articles.id').notNullable().index();
	table.unique(['user_id', 'article_id']);
});

exports.down = knex => knex.schema.dropTable('likes');
