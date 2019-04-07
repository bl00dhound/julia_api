
const router = require('express').Router();

const service = require('../modules/users');

router.post('/registration', (req, res, next) => {
	return service.registration(req.body)
		.then(user => res.status(201).json(user))
		.catch(next);
});

router.put('/login', (req, res, next) => {
	return service.login(req.body.nickname, req.body.password)
		.then(user => res.json(user))
		.catch(next);
});

router.get('/', (req, res, next) => {
	return service.list(req.query.params)
		.then(rows => res.json(rows))
		.catch(next);
});

router.get('/:id', (req, res, next) => {
	return service.getById(req.params.id)
		.then(user => res.json(user))
		.catch(next);
});

module.exports = router;
