const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = require('express').Router();
const httpErrors = require('http-errors');

const service = require('../modules/users');

router.post('/registration', (req, res, next) => {
	return service.registration(req.body)
		.then(user => res.status(201).json(user))
		.catch(next);
});

router.put('/login', (req, res) => {
	passport.authenticate('local', { session: false }, (err, user) => {
		if (err || !user) throw httpErrors.Unauthorized();
		return req.login(user, { session: false }, (e) => {
			if (e) res.send(e);
			const token = jwt.sign(
				{ id: user.id },
				process.env.JWT_SECRET,
				{ expiresIn: '1d' }
			);
			return res.json({ user, token });
		});
	})(req, res);
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
