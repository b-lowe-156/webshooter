
export default function lightReducer(state = {
	staticLights: [],
}, action) {
	switch (action.type) {
		case 'ADD_STATIC_LIGHT':
			const newStaticLights = [...state.staticLights]
			newStaticLights.push(action.payload)
			return {
				...state,
				staticLights: newStaticLights,
			}
		default:
			return state
	}
}