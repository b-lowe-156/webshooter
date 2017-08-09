const pg = require("pg")
const Promise = require("bluebird")

const pool = new pg.Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'start123',
	port: 5432,
})

// this function gets a connection from a pool
// and releases it back when not needed
const connect = () =>
  Promise
    .fromCallback(cb => pool.connect(cb), { multiArgs: true })
    .disposer(([client, done], promise) => {
      done()
    })

Promise
  .using(
    connect(),
    ([client]) => Promise.fromCallback(cb => client.query('SELECT $1::int AS number', ['1'], cb))
  )
  .then(result => {
    console.log('db client was released to the pool');
    console.log('query result', result.rows);
    pool.end();
  })