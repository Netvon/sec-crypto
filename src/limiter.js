const NodeRateLimiter = require('node-rate-limiter')

NodeRateLimiter.defaults.rateLimit = 300

const nodeRateLimiter = new NodeRateLimiter()

function limiter(req, res, next) {
	nodeRateLimiter.get(req.sessionID, (err, limit) => {
		if (err) {
			console.error(err)
			res.status(500).send('an error occured')
			return
		}

		res.set('X-RateLimit-Limit', limit.limit)
		res.set('X-RateLimit-Remaining', limit.remaining)
		res.set('X-RateLimit-Refresh', limit.refresh)

		if (limit.remaining) {
			return next()
		}

		res.set('Retry-After', limit.reset)
		res.status(429).send(`Rate limit exceeded, retry in ${limit.refresh} ms`)
	})
}

module.exports = limiter