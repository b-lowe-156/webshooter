const { Pool } = require('pg')
const { Future } = require('fluture')

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'start123',
	port: 5432,
})

const openConnection = () => Future((reject, resolve) => {
	pool.connect((err, client, release) => {
		if (err) {
			reject('Error acquiring client')
		}
		resolve(client)
	})
	// Cancellation:
	return () => release()
})

const closeConnection = client => Future((reject, resolve) => {
	console.log('close connection')
	client.release()
	resolve()
	//Cancellation:
	return () => release()
})

const query = (client, query) => Future((reject, resolve) => {
	client.query(query, (err, result) => {
		if (err) {
			reject('error in query', err)
		}
		resolve(result.rows[0])
	})
	//Cancellation:
	return () => { }
})


const withTransaction = Future.hook(
	openConnection(),
	closeConnection
)

withTransaction(
	client =>
		query(client, 'SELECT * FROM article')
		.map(e => e.name)
		.map(e => e)
		.chain(n => query(client, 'SELECT * FROM article'))
		.map(e => e)
)
.fork(
	err => {
		console.log('error', err)
	},
	client => {
		console.log('end', client)
	}
)
