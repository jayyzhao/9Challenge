const restify = require('restify');
const router = new (require('restify-router')).Router();
const server = restify.createServer({
	name: '9Challenge',
	version: '1.0.0',
});

const logger = require('./basic-logger');

const home = require('./routes/index');

var port = process.env.PORT || 8080;

server.use(restify.plugins.throttle({
	burst: 100,  	// Max 10 concurrent requests (if tokens)
	rate: 2,  		// Steady state: 2 request / 1 seconds
	ip: true,		// throttle per IP
}));
server.use(restify.plugins.jsonBodyParser());
server.use(restify.plugins.acceptParser(server.acceptable));

router.add('/', home);
router.applyRoutes(server);

server.on('InvalidContent', function(req, res, err, callback) {
    err.toJSON = function customToJSON() {
        return {
            error: "Could not decode request: JSON parsing failed"
        };
    };
    return callback();
});

server.on('after', restify.plugins.metrics({ server: server }, function onMetrics(err, metrics) {
	logger.trace(`${metrics.method} ${metrics.path} ${metrics.statusCode} ${metrics.latency} ms`);
}));

server.listen(port, function () {
	logger.info('%s listening at %s', server.name, server.url);
});

server.on('uncaughtException', function (req, res, route, err) {
	logger.error(err);
});