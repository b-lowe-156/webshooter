const { Future } = require('fluture')

Future.of(1)
.map(x => x + 1)
.fork(
    () => console.log('error'),
    () => console.log('succsess')
)