const csrf = require('csurf')
const bp = require('body-parser')
const cors = require('cors')
const flash = require('express-flash-messages')
const limiter = require('./limiter')

const csrfProtection = csrf({ cookie: true })
const formParser = bp.urlencoded({ extended: false })
const corsProtect = cors({ origin: ['http://sec.netvon.nl', 'http://localhost:3000'] })

const { Secret } = require('./models')

function addRoutes(app) {

	app.get('/', limiter, flash(), csrfProtection, (req, res) => {

		const messages = res.locals.getMessages()
		const object = {}
		const list = Object.getOwnPropertyNames(messages).forEach(x => {
			object[x] = messages[x].join(' - ')
		})

		object['csrfToken'] = req.csrfToken()

		res.render('home', object)
	})

	app.post('/do', limiter, flash(), corsProtect, formParser, csrfProtection, async (req, res) => {
		if (hasValidProperty(req.body, 'name', 'string') &&
			hasValidProperty(req.body, 'text', 'string') &&
			hasValidProperty(req.body, 'password', 'string')) {

			await handleEncrypt(req, res)

		} else if (hasValidProperty(req.body, 'name', 'string') &&
			hasValidProperty(req.body, 'password', 'string')) {

			await handleDecrypt(req, res)
		} else {
			req.flash('error', 'Missing values, please try again')
			res.redirect('/')
		}
	})
}

async function handleEncrypt(req, res) {
	const name = req.body.name
	const text = req.body.text
	const password = req.body.password

	const secret = new Secret({ name })
	const error = secret.validateSync('name')

	if (error) {
		req.flash('error', error.message)
		res.redirect('/')
		return
	}

	secret.text = text
	secret.encrypt(password)

	try {
		await secret.save()
	} catch (err) {
		req.flash('error', err.message)
		res.redirect('/')
		return
	}

	req.flash('message', 'secret created')
	res.redirect('/')
	return
}

async function handleDecrypt(req, res) {
	const name = req.body.name
	const password = req.body.password

	const secret = await Secret.findOne({ name })
	if (secret === null) {
		req.flash('error', 'No secret found by that name')
		res.redirect('/')
		return
	}

	req.flash('text', secret.decrypt(password))
	req.flash('name', name)
	res.redirect('/')
	return
}

/**
 * @param {any} object
 * @param {string} name 
 * @param {string} type 
 */
function hasValidProperty(object, name, type) {
	return typeof name === 'string' &&
		typeof type === 'string' &&
		(object[name] !== null || object[name] !== undefined) &&
		(type === 'string' && object[name] !== '') &&
		typeof object[name] === type
}

module.exports = addRoutes