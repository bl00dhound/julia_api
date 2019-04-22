const router = require('express').Router();

const service = require('../modules/comments');

router.post('/', (req, res, next) => {
	return service.create(req.body, req.user.sub)
		.then(comment => res.status(201).json(comment))
		.catch(next);
});

router.get('/:article_id', (req, res, next) => {
	return service.list(req.query, req.params.article_id)
		.then(data => res.json(data))
		.catch(next);
});

module.exports = router;
