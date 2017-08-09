const { Pool } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'start123',
	port: 5432,
})

pool.connect((err, client, done) => {
	console.log('connected')
	if (err) {
		console.error(err)
	}
	client.release()
})