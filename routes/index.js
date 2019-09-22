const router = new (require('restify-router')).Router();

router.post('', function (req, res, next) {
	console.log(req.body)
	res.json(200, {
		hellO:"yolo"
	})
	next();
});

module.exports = router;