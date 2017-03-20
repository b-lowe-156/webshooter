
const { Engine, World, Bodies, Render, Events } = Matter

const MutableStore = () => {
	const state = {
		input: {
			forward: false,
			backward: false,
			strafeLeft: false,
			strafeRight: false,
			leftMouseDown: false,
		},
		currentPlayer: {
			rotation: 0,
		}
	}
	return {
		getState: () => (state),
		dispatch: (action) => {
			if (action.type === 'keydown' || action.type === 'keyup') {
				const down = action.type === 'keydown'
				if (action.payload === 87) { //'w'
					state.input.forward = down
				} else if (action.payload === 65) { //'a'
					state.input.strafeLeft = down
				} else if (action.payload === 83) { //'s'
					state.input.backward = down
				} else if (action.payload === 68) { //'d'
					state.input.strafeRight = down
				}
			} else if (action.type === 'LEFT_MOUSE_DOWN') {
				state.input.leftMouseDown = true
			} else if (action.type === 'LEFT_MOUSE_UP') {
				state.input.leftMouseDown = false
			}
		},
	}
}

export default MutableStore()