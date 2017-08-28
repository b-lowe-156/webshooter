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

const articleDef = ['id', 'name']

const article = {
    id: 5,
    name: 'dudu',
}

withTransaction(
    tx => {
        const lal = 'izg'
        const `lk ${lal} jl`
        
        const query = 'insert into article (' + articleDef.join(', ') + ') VALUES (' + articleDef.map((n, i) => '$' + (i + 1)).join(', ') + ')'
        console.log(query)
        tx.queryAsync(query, [article.id, article.name])
        .then(result => {
            //console.log('result', result)
        })
        .catch(err => {
            //console.log('err', err)
        })
    }
)
