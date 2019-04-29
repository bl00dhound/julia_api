const passport = require('passport');
const PassportJWT = require('passport-jwt');

const ExtractJWT = PassportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const JWTStrategy = PassportJWT.Strategy;
const userService = require('../modules/users');

passport.use(new LocalStrategy({
	usernameField: 'nickname',
	passwordField: 'password'
}, (nickname, password, cb) => {
	return userService.passportLogin(nickname, password)
		.then(user => {
			if (!user) {
				return cb(null, false, {
					message: 'Incorrect email or password.'
				});
			}
			return cb(null, user, {
				message: 'Logged In Successfully'
			});
		})
		.catch(err => cb(err));
}));

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
	ignoreExpiration: false
},
async (jwtPayload, cb) => {
	if (!jwtPayload.id) return cb(null, {});
	if (jwtPayload.exp < Math.floor(Date.now() / 1000)) return cb(null, {});
	let user;
	try {
		user = await userService.getById(jwtPayload.id);
	} catch (e) {
		user = {};
	}
	return cb(null, user);
}));
