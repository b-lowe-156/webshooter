const { Future } = require('fluture')

const fn = () => Future.of(1)
.map(x => x.x.y + 1)
.chain(plusOne => Future.of(plusOne + 1))

Future.try(fn)
.fork(
    () => console.log('error'),
    val => console.log('succsess', val)
)