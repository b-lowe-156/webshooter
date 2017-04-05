
export default function inputReducer(state = {
	forward: false,
	backward: false,
	strafeLeft: false,
	strafeRight: false,
	leftMouseDown: false,
}, action) {
	switch (action.type) {
		case 'keydown':
		case 'keyup': {
			const down = action.type === 'keydown'
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
				default:
					return state
			}
		}
		case 'LEFT_MOUSE_DOWN': {
			console.log('LEFT_MOUSE_DOWN', action.type)
			return {
				...state,
				leftMouseDown: true,
			}
		}
		case 'LEFT_MOUSE_UP': {
			console.log('LEFT_MOUSE_UP', action.type)
			return {
				...state,
				leftMouseDown: false,
			}
		}
	}

	return state
}