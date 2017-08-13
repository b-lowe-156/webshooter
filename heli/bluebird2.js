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

const getSqlConnection = () => {
    let close;
    return pool.connectAsync().spread((client, done) => {
        close = done
        return client
    }).disposer(() => {
        if (close) {
            close()
        }
    })
}

const withTransaction = fn =>
    Promise.using(getSqlConnection(), client =>
        client.queryAsync("BEGIN")
            .then(() =>
                fn(client)
            )
            .then(
            result =>
                client.queryAsync("COMMIT").
                    thenReturn(result)
            ,
            err =>
                client.queryAsync("ROLLBACK")["catch"](err => console.log("Error rollbacking transaction", err))
                    .thenThrow(err)
            )
    )


/*

module.exports = function (connString) {
    var acquireClient=function(){
        var close;
        return pg.connectAsync(connString).spread(function(client,done){
            close=done;
            return client;
        }).disposer(function(){
            if(close) close();
        });
    };
    return {

        withTransaction: function(fn){
            return Promise.using(acquireClient(),function(client){
                return client.queryAsync("BEGIN").
                    then(function(){
                        return fn(client);
                    }).
                    then(
                        function(result){
                            return client.queryAsync("COMMIT").
                            thenReturn(result);
                        }, 
                        function(err){
                            return client.queryAsync("ROLLBACK")["catch"](function(err){console.log("Error rollbacking transaction",err);}).
                            thenThrow(err);
                        }
                    );
            });
        },
        ...
}

*/