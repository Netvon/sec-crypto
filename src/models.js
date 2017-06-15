const mongoose 	= require('mongoose')
const crypto	= require('crypto')

const algorithm = 'aes-256-ctr'

const schema = new mongoose.Schema({
	name: { 
		type: String,
		required: true,
		unique: true,
		minlength: 3,
		maxlength: 50
	},

	text: { 
		type: String,
		required: true,
		minlength: 1,
		maxlength: 70
	}
})

schema.method('decrypt', function(password) {
	const decipher = crypto.createDecipher(algorithm, password)
	let decrypted = decipher.update(this.text, 'base64', 'utf8')
	decrypted += decipher.final('utf8')

	return decrypted
})

schema.method('encrypt', function(password) {
	const cipher = crypto.createCipher(algorithm, password)
	let crypted = cipher.update(this.text, 'utf8', 'base64')
	crypted += cipher.final('base64')

	this.text = crypted
})

module.exports = {
	Secret: mongoose.model('Secret', schema)
}