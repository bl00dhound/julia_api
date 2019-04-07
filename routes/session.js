
const router = require('express').Router();

const service = require('../modules/users');

router.post('/authenticate', (req, res, next) => {
	return service.authenticate(req.params.email, req.params.password)
		.then(user => res.json(user))
		.catch(next);
});

router.get('/', (req, res, next) => {
	return res.send('all')
		.catch(next);
});

router.get('/:id', (req, res, next) => {
	return res.json({ user: req.params.id })
		.catch(next);
});

module.exports = router;
