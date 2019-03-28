
const router = require('express').Router();


router.use('/', (req, res, next) => {
	return res.json({ ok: true });
});

module.exports = router;