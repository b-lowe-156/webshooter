// const Task = require('data.task')
// const futurize = require('futurize').futurize(Task)

const { Pool } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'start123',
	port: 5432,
})


const { Future, computation } = require('fluture')

const openConnection = () => Future(function computation(reject, resolve) {
	pool.connect((err, client, release) => {
		if (err) {
			reject('Error acquiring client')
		}
		resolve(client)
	})
	//Cancellation:
	return () => release()
})

/*.fork(console.error, client => {
	console.log('ende')
	client.release()
})
*/

const closeConnection = () => Future(function computation(reject, resolve) {
	client.release()
	resolve()
	//Cancellation:
	return () => release()
})

const query = (client, query) => Future(function computation(reject, resolve) {
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
	() => Future.of(1)
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


/*

Future(function computation(reject, resolve) {
  //Asynchronous work:
  const x = setTimeout(resolve, 1000, 'world');
  //Cancellation:
  return () => clearTimeout(x);
})
.fork(console.error, console.log)

const test2 = Future.encaseN(pool.connect)
console.log('test2', test2)
const test2 = () => 
	node(done => { pool.connect() })
	.map(client => console.log('connected', client))
	.fork(console.error, console.log)
*/


//test2()
//.fork(console.error, console.log);


/*
const connect2 = futurize(pool.connect)

const contrivedEx2 = () =>
	connect2()
	.map(client => console.log(client))

contrivedEx2().fork(e => console.error(e), r => console.log('success!'))
*/




/*
pool.query('SELECT * FROM article', (err, result) => {
	if (err) {
		return console.error('Error executing query', err.stack)
	}
//	console.log(result.rows[0])
	process.exit()
})

pool.connect()
	.then(client => {
		return client.query('SELECT * FROM users WHERE id = $1', [1])
			.then(res => {
				client.release()
				console.log(res.rows[0])
			})
			.catch(e => {
				client.release()
				console.log(err.stack)
			})
	})
*/

/*

//const connect = Future.encaseP(pool.connect)
const connect = () => Future((rej, res) => {
	pool.connect().then(client => {
		console.log('connection established')
		res(client)
	})
  .catch(e => {
		console.log('connection konnte nicht aufgebaut werden')
    client.release()
		rej()
  })
})

// const query = Future.encaseP(pool.query)
const query = Future.of(2)




withConnection(
  client => {
		console.log('withConnection')
//		query('SELECT * FROM article')
	}
)
.fork(console.error, console.log);
*/

/*
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