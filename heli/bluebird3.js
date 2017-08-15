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
    Promise : require("bluebird")
})

const withTransaction = fn =>
    Promise.using(pool.connect(), connection =>
        Promise.try(() => 
            connection.queryAsync('BEGIN')
            .then(() => fn(connection))
        )
            .then(function (res) {
                return connection.queryAsync('COMMIT').then(() => {
                    connection.release()
                    return res
                })
            })
            .catch(function (err) {
                return connection.queryAsync('ROLLBACK').then(() => {
                    connection.release()
                    throw err
                })
            })
    )

withTransaction(
    tx =>
        tx.queryAsync('SELECT * FROM article')
        .then(res => console.log('res', res[0].rows))
)
