const { Pool } = require('pg')
const { Future } = require('fluture')

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'start123',
	port: 5432,
})

const query = (client, query) => Future((reject, resolve) => {
	client.query(query, (err, result) => {
		if (err) {
			reject('error in query')
		} else {
			resolve(result.rows[0])
		}
	})
	//Cancellation:
	return () => { }
})

const openConnection = () => Future((reject, resolve) => {
	console.log('arquire connection')
	pool.connect((err, client, release) => {
		if (err) {
			reject('Error acquiring client')
		} else {
			console.log('connection open')
			resolve(client)
		}
	})
	// Cancellation:
	return () => release()
})

const closeConnection = client => Future((reject, resolve) => {
	console.log(`connection release`)
	client.release()
	// Cancellation:
	return () => client.release()
})

const withConnection = Future.hook(
	openConnection(),
	closeConnection
)

const qc = client =>
		query(client, 'SELECT * FROM article')
		.map(e => e.name)
		.map(e => e)
		.chain(n => query(client, 'SELECT * FROM article'))
		.map(e => e)

const tryQc = Future.try(qc)


const txDecorator = client => Future((reject, resolve) => {
	console.log('arquire connection')
	pool.connect((err, client, release) => {
		if (err) {
			reject('Error acquiring client')
		} else {
			console.log('connection open')
			resolve(client)
		}
	})
	// Cancellation:
	return () => release()
})


withConnection(qc)
.fork(
	err => {
		console.log('error')
	},
	client => {
		console.log('end')
	}
)
