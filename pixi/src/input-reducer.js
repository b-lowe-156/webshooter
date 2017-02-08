
export default function inputReducer(state = {
	forward: false,
	backward: false,
	strafeLeft: false,
	strafeRight: false,
}, action) {
	if (action.type !== 'keydown' && action.type !== 'keyup') {
		return state
	}
	let down = false
	if (action.type === 'keydown') {
		down = true
	}
	switch (action.payload) {
		case 87: //'w':
			return {
				...state,
				forward: down,
			}
		case 65: //'a':
			return {
				...state,
				strafeLeft: down,
			}
		case 83: //'s':
			return {
				...state,
				backward: down,
			}
		case 68: //'d':
			return {
				...state,
				strafeRight: down,
			}
	}
	return state
}