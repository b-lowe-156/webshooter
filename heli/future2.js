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
			client.errorOccured = true
			reject('error in query')
		} else {
			resolve(result.rows[0])
		}
	})
	//Cancellation:
	return () => { }
})

const openConnection = () => Future((reject, resolve) => {
	console.log('open connection')
	pool.connect((err, client, release) => {
		if (err) {
			reject('Error acquiring client')
		}
		client.query('begin', (err, result) => {
			console.log('begin transaction')
			if (err) {
				reject('error in beginning the transaction', err)
			}
			resolve(client)
		})
	})
	// Cancellation:
	return () => release()
})

const closeConnection = client => Future((reject, resolve) => {
	client.query('commit', (err, result) => {
		if (err) {
			console.log('error in commiting transaction')
		} else {
			console.log('transaction commit done')
			client.release()
			resolve()
		}
	})
	//Cancellation:
	return () => client.release()
})

const withTransaction = Future.hook(
	openConnection(),
	closeConnection
)

withTransaction(
	tx =>
		query(tx, 'SELECT * FROM article')
		.map(e => e.name)
		.map(e => e)
		.chain(n => query(tx, 'SELECT * FROM article'))
		.map(e => e)
)
.fork(
	err => {
		console.log('error')
	},
	client => {
		console.log('end')
	}
)
