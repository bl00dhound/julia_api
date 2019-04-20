const router = require('express').Router();

const authorize = require('../middlewares/authorize');
const roles = require('../enums/roles');

const service = require('../modules/articles');

router.post('/', authorize([roles.admin, roles.user]), (req, res, next) => {
	return service.create(req.body, req.user.sub)
		.then(article => res.status(201).json(article))
		.catch(next);
});

router.get('/', (req, res, next) => {
	return service.list(req.query)
		.then(data => res.json(data))
		.catch(next);
});

module.exports = router;
