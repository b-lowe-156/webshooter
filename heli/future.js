const { readFile } = require('fs')
const { node, encase } = require('fluture')

const getPackageName = file =>
	node(done => {
		readFile(file, 'utf8', done)
	})
		.chain(encase(JSON.parse))
		.map(x => x.name);

getPackageName('./files/file1.json')
	.fork(console.error, console.log);
//> "fluture"