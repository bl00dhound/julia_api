const router = require('express').Router();

const service = require('../modules/articles');
const roles = require('../enums/roles');
const authorize = require('../middlewares/authorize.js');

router.post('/', authorize([roles.user]), (req, res, next) => {
	return service.create(req.body, req.user.id)
		.then(article => res.status(201).json(article))
		.catch(next);
});

router.put('/:article_id', authorize([roles.user]), (req, res, next) => {
	return service.update(req.params.article_id, req.body, req.user.id)
		.then(data => res.json(data))
		.catch(next);
});

router.delete('/:article_id', authorize([roles.user]), (req, res, next) => {
	return service.remove(req.params.article_id, req.user)
		.then(data => res.json(data))
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

router.post('/:id/likes', authorize([roles.user]), (req, res, next) => {
	return service.like(req.params.id, req.user.id)
		.then(() => res.json({ ok: true }))
		.catch(next);
});

module.exports = router;
