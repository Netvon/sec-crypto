const dotenv		= require('dotenv')
dotenv.config()

const compression	= require('compression')
const cp 			= require('cookie-parser')
const helmet		= require('helmet')

const express		= require('express')
const session 		= require('express-session')
const path			= require('path')
const app			= express()

const exphbs		= require('express-handlebars')

const mongoose = require('mongoose')
mongoose.Promise = Promise
mongoose.connect(process.env.DB_URL)

app.use( express.static( path.resolve( __dirname, '../public' ) ) )
app.use( compression() )
app.use( cp() )

app.use( helmet() )
app.use( helmet.contentSecurityPolicy({ directives: { defaultSrc: ['\'self\''] } }) )
app.use( helmet.referrerPolicy({ policy: 'no-referrer' }))

app.use( session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }) )
app.engine('handlebars', exphbs.create({}).engine)
app.set('view engine', 'handlebars')

require('./routes')(app)

const http = require('http')
const port = process.env.PORT || 3000
app.set('port', port)
const server = http.createServer(app)
server.listen(port)
