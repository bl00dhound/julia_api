const router = require('express').Router();

const sessionRouter = require('./session');
const authorize = require('../middlewares/authorize');
const role = require('../enums/roles');

router.use('/session', authorize(role.admin), sessionRouter);

module.exports = router;
