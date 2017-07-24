const { readFile } = require('fs')
const { Future, node, encase } = require('fluture')

const { Pool } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'start123',
	port: 5432,
})

pool.query('SELECT * FROM article', (err, result) => {
	if (err) {
		return console.error('Error executing query', err.stack)
	}
	console.log(result.rows[0])
	process.exit()
})

/*
pool.connect()
	.then(client => {
		return client.query('SELECT * FROM users WHERE id = $1', [1])
			.then(res => {
				client.release()
				console.log(res.rows[0])
			})
			.catch(e => {
				client.release()
				//console.log(err.stack)
			})
	})
*/

const connect = Future.encaseP(pool.connect)
const query = Future.encaseP(pool.query)

const disconnect = client => {
	console.log('release connection ', connection)
	client.release()
}

const withConnection = Future.hook(
	connect(),
	disconnect
)


/*
withConnection(
  client => query('SELECT * FROM article')
)
.fork(console.error, console.log);

const getPackageName = file =>
	node(done => {
		readFile(file, 'utf8', done)
	})
		.chain(encase(JSON.parse))
		.map(x => x.name);

getPackageName('./files/file1.json')
	.fork(console.error, console.log);
//> "fluture"
*/