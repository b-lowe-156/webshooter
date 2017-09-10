// @flow

const Promise = require("bluebird")

new Promise((resolve, reject) => {
	resolve({
		grrr: 'asd',
		lulululu: 'dsaw',
	})
}).then(n => {
	console.log(n.grrr)
})

