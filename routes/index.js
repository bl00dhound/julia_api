const router = require('express').Router();

const authorize = require('../middlewares/authorize');
const roles = require('../enums/roles');

const sessionRouter = require('./session');
const articlesRouter = require('./articles');

router.use('/session', authorize(roles.admin), sessionRouter);
router.use('/articles', articlesRouter);

module.exports = router;
