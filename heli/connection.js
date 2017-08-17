const { Pool } = require('pg')
//const Promise = require("bluebird")
//Promise.promisifyAll(Pool)
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'start123',
	port: 5432
  //Promise: require("bluebird")
})

/*
pool.connect((err, client, done) => {
	console.log('connected')
	if (err) {
		console.error(err)
	}
	client.release()
})
*/

pool.query('SELECT * FROM article', (err, res) => {
  if (err) {
    throw err
  }

  console.log('user:', res.rows[0].name)
	
	pool.end()
})


/*
pool.queryAsync('SELECT * FROM article where id = 1')
.then(res => {
  console.log('user:', res.rows)
	
})
*/
