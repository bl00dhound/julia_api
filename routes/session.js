const jwt = require('jsonwebtoken');
const R = require('ramda');
const passport = require('passport');
const router = require('express').Router();
const httpErrors = require('http-errors');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '..', 'uploads/'));
	},
	filename: (req, file, cb) => {
		const ext = R.compose(
			R.prop(0),
			R.match(/\.[a-zA-Z0-9]{2,5}$/),
			R.prop('originalname')
		)(file);
		if (!ext) {
			return cb({ message: 'wrong file extension' });
		}
		if (!req.user.id) {
			return cb({ message: 'authorize error' });
		}
		return cb(null, `${req.user.id}${ext}`);
	}
});

const upload = multer({ storage });

const service = require('../modules/users');
const authorize = require('../middlewares/authorize');
const roles = require('../enums/roles');

router.post('/registration', (req, res, next) => {
	return service.registration(req.body)
		.then(user => res.status(201).json(user))
		.catch(next);
});

router.put('/login', (req, res) => {
	passport.authenticate('local', {
		session: false
	}, (err, user) => {
		if (err || !user) throw httpErrors.Unauthorized();
		return req.login(user, {
			session: false
		}, (e) => {
			if (e) res.send(e);
			const token = jwt.sign({
				id: user.id
			},
			process.env.JWT_SECRET, {
				expiresIn: '1d'
			});
			return res.json({
				user,
				token
			});
		});
	})(req, res);
});

router.post(
	'/avatar',
	authorize([roles.user]),
	upload.single('avatar'),
	(req, res, next) => {
		const image = req.file.filename;
		return service.update({ image }, req.user.id)
			.then(user => res.json(user))
			.catch(next);
	}
);


router.put('/current', authorize([roles.user]), (req, res, next) => {
	return service.update(req.body, req.user.id)
		.then(user => res.json(user))
		.catch(next);
});

router.put('/:user_id', authorize([roles.admin]), (req, res, next) => {
	return service.updateByAdmin(req.body, req.params.user_id)
		.then(user => res.json(user))
		.catch(next);
});

router.get('/', authorize([roles.admin]), (req, res, next) => {
	return service.list(req.query.params)
		.then(rows => res.json(rows))
		.catch(next);
});

router.get('/current', authorize([roles.user]), (req, res, next) => {
	return service.getById(req.user.id)
		.then(user => res.json(user))
		.catch(next);
});

router.get('/:id', authorize([roles.admin]), (req, res, next) => {
	return service.getById(req.params.id)
		.then(user => res.json(user))
		.catch(next);
});

module.exports = router;
