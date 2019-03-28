const router = require('express').Router();

const sessionRouter = require('./session');

router.use('/session', sessionRouter);

module.exports = router;
