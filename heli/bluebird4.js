const pg = require("pg")
const Pool = require("pg").Pool

const Promise = require("bluebird")
Promise.promisifyAll(pg, { multiArgs: true })
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
        tx.queryAsync('SELECT * FROM article')
        .then(res => res[0].rows)
        .then(() => tx.queryAsync('SELECT * FROM article where id = 1'))
        .then(res => res[0].rows)
        .then(row => {
            console.log('rows', row)
        })
        .catch(err => {
            console.log('err', err)
        })
)

withConnection(
    connection =>
        connection.queryAsync('SELECT * FROM article')
        .then(res => res[0].rows)
        .then(() => connection.queryAsync('SELECT * FROM article where id = 1'))
        .then(res => res[0].rows)
        .then(row => {
            console.log('rows', row)
        })
        .catch(err => {
            console.log('err', err)
        })
)
