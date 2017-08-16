const pg = require("pg")
const Pool = require("pg").Pool

const Promise = require("bluebird")
Promise.promisifyAll(pg, { multiArgs: false })
Promise.promisifyAll(Pool, { multiArgs: true })

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'start123',
    port: 5432,
    Promise: require("bluebird")
})

const getDbConnection = () =>
    pool.connectAsync()
    .spread(client => client)
    .disposer(client => {
        client.release()
    })

const withTransaction = queryChain =>
    Promise.using(getDbConnection(),
        connection =>
            Promise.try(() =>
                connection.queryAsync('BEGIN')
                .then(() => queryChain(connection))
            )
            .then(res => connection.queryAsync('COMMIT').return(res))
            .catch(err => connection.queryAsync('ROLLBACK').return(err))
    )

const withConnection = queryChain =>
    Promise.using(getDbConnection(), connection =>
        Promise.try(() => queryChain(connection))
    )

withTransaction(
    tx =>
        Promise.all([
            tx.queryAsync('SELECT * FROM article where id = 1'),
            tx.queryAsync('SELECT * FROM article where id = 2'),
            tx.queryAsync('SELECT * FROM article where id = 3')
        ])
        .spread((a1, a2, a3) => {
            console.log('a1, a2, a3', a1.rows[0], a2.rows[0], a3.rows[0])
            return undefined
        })
        .then(() => tx.queryAsync('SELECT * FROM article'))
        .then(res => res.rows)
        .then(beIgnored => tx.queryAsync('SELECT * FROM article where id = 1'))
        .then(res => res.rows[0])
        .then(result => {
            console.log('result', result)
        })
        .catch(err => {
            console.log('err', err)
        })
)
