
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'start123',
	port: 5432,
})

Promise.try = function(cb) {
	return new this(r => r(cb()))
}

Promise.try(() => console.log('lala'))