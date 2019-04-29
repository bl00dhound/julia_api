const router = require('express').Router();

const service = require('../modules/articles');

router.post('/', (req, res, next) => {
	return service.create(req.body, req.user.sub)
		.then(article => res.status(201).json(article))
		.catch(next);
});

router.get('/:article_id', (req, res, next) => {
	return service.getById(req.params.article_id, req.user.id)
		.then(data => res.json(data))
		.catch(next);
});

router.get('/', (req, res, next) => {
	return service.list(req.query, req.user.id)
		.then(data => res.json(data))
		.catch(next);
});

router.post('/:id/likes', (req, res, next) => {
	return service.like(req.params.id, req.user.sub)
		.then(() => res.json({ ok: true }))
		.catch(next);
});

module.exports = router;
