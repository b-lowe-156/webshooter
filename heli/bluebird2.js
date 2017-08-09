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
	var close;
	return pool.connectAsync().spread((client, done) => {
		close = done
		return client
	}).disposer(() => {
		if (close) {
			close()
		}
	})
}

const withTransaction = fn => {
	return Promise.using(pool.acquireConnection(), connection => {
		var tx = connection.beginTransaction()
		return Promise
			.try(fn, tx)
			.then( res => {
				return connection.commit().thenReturn(res)
			},
			function (err) {
				return connection.rollback()
					.catch(function (e) {/* maybe add the rollback error to err */ })
					.thenThrow(err)
			})
	})
}

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