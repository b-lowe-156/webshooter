
const MutableStore = () => {
	const state = {
		input: {
			forward: false,
			backward: false,
			strafeLeft: false,
			strafeRight: false,
			leftMouseDown: false,
		}
	}
	return {
		getState: () => (state),
		dispatch: (action) => {
			switch (action.type) {
				case 'keydown':
				case 'keyup': {
					const down = action.type === 'keydown'
					switch (action.payload) {
						case 87: //'w':
							state.input.forward = down
							break
						case 65: //'a':
							state.input.strafeLeft = down
							break
					case 83: //'s':
							state.input.backward = down
							break
						case 68: //'d':
							state.input.strafeRight = down
							break
					}
				}
					break
				case 'LEFT_MOUSE_DOWN': {
					state.input.leftMouseDown = true
					break
				}
				case 'LEFT_MOUSE_UP': {
					state.input.leftMouseDown = false
					break
				}
			}
		},
	}
}

export default MutableStore()