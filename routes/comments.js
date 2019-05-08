const router = require('express').Router();

const service = require('../modules/comments');
const roles = require('../enums/roles');
const authorize = require('../middlewares/authorize');

router.post('/', authorize([roles.user]), (req, res, next) => {
	return service.create(req.body, req.user.id)
		.then(comment => res.status(201).json(comment))
		.catch(next);
});

router.put('/:comment_id', authorize([roles.user]), (req, res, next) => {
	return service.update(req.params.comment_id, req.body, req.user.id)
		.then(data => res.json(data))
		.catch(next);
});

router.delete('/:comment_id', authorize([roles.user]), (req, res, next) => {
	return service.remove(req.params.comment_id, req.user)
		.then(comment => res.json(comment))
		.catch(next);
});

router.get('/:article_id', (req, res, next) => {
	return service.list(req.query, req.params.article_id)
		.then(data => res.json(data))
		.catch(next);
});

module.exports = router;
