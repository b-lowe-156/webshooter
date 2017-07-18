const contrivedEx1 = str => {
	const trimmed = str.trim()
	const number = parseInt(trimmed)
	const nextNumber = number + 1
	return String.fromCharCode(nextNumber)
}

const Box = x => ({
	map: f => Box(f(x)),
	fold: f => f(x),
})

const boxEx = str =>
	Box(str.trim())
		.map(trimmed => parseInt(trimmed))
		.map(number => number + 1)
		.fold(nextNumber => String.fromCharCode(nextNumber))
console.log(boxEx(' 64 '))