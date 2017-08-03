const { Future } = require('fluture')

Future.of(1)
.map(x => x + 1)
.chain(plusOne => Future.of(plusOne + 1))
.fork(
    () => console.log('error'),
    val => console.log('succsess', val)
)