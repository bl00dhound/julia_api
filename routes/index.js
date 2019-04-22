const router = require('express').Router();

const authorize = require('../middlewares/authorize');
const roles = require('../enums/roles');

const sessionRouter = require('./session');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');

router.use('/session', authorize(roles.admin), sessionRouter);
router.use('/articles', authorize([roles.user, roles.admin]), articlesRouter);
router.use('/comments', authorize([roles.user, roles.admin]), commentsRouter);

module.exports = router;
