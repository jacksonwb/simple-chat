const express = require('express')
const logger = require('morgan')
const sqlite = require('sqlite3')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').Server(app)
const port = 4000
const io = require('socket.io')(server, {path: '/sock'})

//DB migrate
const db = new sqlite.Database(':memory:')

db.run(`
CREATE TABLE messages (
	id_msg INTEGER PRIMARY KEY AUTOINCREMENT,
	author VARCHAR,
	msg VARCHAR,
	sentDate VARCHAR
)`);

db.run(`
CREATE TABLE users (
	user VARCHAR
)`)

setTimeout(() => {addUser(db, 'jackson')}, 100)
setTimeout(() => {addMessage(db, 'jackson', 'Hey There!')}, 100)

// Models
function addMessage(db, author, msg) {
	db.run(`
		INSERT INTO messages(author, msg, sentDate)
		VALUES(?, ?, ?)
	`, [author, msg, Date.now()])
}

function getAllMessages(db, callback) {
	db.all(`
		SELECT * from messages
	`, (err, rows) => {
		if (err) {
			console.error(err)
			return;
		}
		callback(rows)
	})
}

function addUser(db, user) {
	db.run(`
		INSERT INTO users(user)
		VALUES(?)
	`, user)
}

function getAllUsers(db, callback) {
	db.all(`
		SELECT * from users
	`, (err, rows) => {
		if (err) {
			console.error(err)
			return;
		}
		callback(rows)
	})
}

// Middleware
app.use(logger('dev'))
app.use(bodyParser.json({limit: 10000000}))

// Routes
app.get('/api', (req, res) => {
	res.send('hello world')
})

app.get('/api/messages', (req, res) => {
	getAllMessages(db, (rows) => {
		res.json(rows)
	})
})

app.post('/api/messages', (req, res) => {
	if (req.body && req.body.author && req.body.message) {
		addMessage(db, req.body.author, req.body.message)
		res.sendStatus(200)
		return
	}
		res.sendStatus(400)
})

app.get('/api/users', (req, res) => {
	getAllUsers(db, rows => {
		res.json(rows)
	})
})

// Sockets
io.on('connection', (socket) => {
	let address = socket.handshake.address
	console.log(`Connection from ${address}`)
	socket.on('chatMsg', (data) => {
		if (data && data.author && data.msg) {
			addMessage(db, data.author, data.msg)
			socket.broadcast.emit('chatMsg', {...data, sentDate: Date.now()})
			console.log(data)
		}
	})
	socket.on('disconnect', () => {
		console.log('disconnect')
	})
})

server.listen(port, () => {
	console.log(`listening on port: ${port}`)
})