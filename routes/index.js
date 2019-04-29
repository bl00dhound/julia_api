const router = require('express').Router();

const sessionRouter = require('./session');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');

router.use('/session', sessionRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);

module.exports = router;
