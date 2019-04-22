const router = require('express').Router();

const service = require('../modules/articles');

router.post('/', (req, res, next) => {
	return service.create(req.body, req.user.sub)
		.then(article => res.status(201).json(article))
		.catch(next);
});

router.get('/list/:user_id', (req, res, next) => {
	return service.list(req.query, req.params.user_id)
		.then(data => res.json(data))
		.catch(next);
});

router.get('/:article_id', (req, res, next) => {
	return service.getById(req.params.article_id)
		.then(data => res.json(data))
		.catch(next);
});

router.get('/list', (req, res, next) => {
	return service.list(req.query, null)
		.then(data => res.json(data))
		.catch(next);
});

router.post('/:id/likes', (req, res, next) => {
	return service.like(req.params.id, req.user.sub)
		.then(() => res.json({ ok: true }))
		.catch(next);
});

module.exports = router;
