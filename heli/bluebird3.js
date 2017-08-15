const pg = require("pg")
const Pool = require("pg").Pool

const Promise = require("bluebird")
Promise.promisifyAll(pg, {
    multiArgs: true
})

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'start123',
    port: 5432,
    Promise: require("bluebird")
})

const withTransaction = fn =>
    Promise.using(pool.connect(), con =>
        Promise.try(() => 
            con.queryAsync('BEGIN')
            .then(() => fn(con))
        ).then(res =>
            con.queryAsync('COMMIT').then(() => {
                con.release()
                return res
            })
        ).catch(err =>
            con.queryAsync('ROLLBACK').then(() => {
                con.release()
                throw err
            })
        )
    )

withTransaction(
    tx =>
        tx.queryAsync('SELECT * FROM article')
        .then(res => console.log('res', res[0].rows))
)
