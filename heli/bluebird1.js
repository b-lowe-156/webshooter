const Pool = require("pg").Pool
const Promise = require("bluebird")
Promise.promisifyAll(Pool)

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'start123',
	port: 5432,
})

pool
  .connectAsync()
  .then(res => { console.log('res', res) })