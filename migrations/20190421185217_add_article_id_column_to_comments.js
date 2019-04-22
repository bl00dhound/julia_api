exports.up = knex => knex.schema.table('comments', table => {
	table.integer('article_id').references('articles.id').index();
});

exports.down = knex => knex.schema.table('comments', table => {
	table.dropColumn('article_id');
});
