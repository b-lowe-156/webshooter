import { Set } from 'immutable'

export default function bulletReducer(state = {
	bullets: new Set(),
}, action) {
	switch (action.type) {
		case 'ADD_BULLET':
			return {
				...state,
				bullets: state.bullets.add(action.payload),
			}
		case 'REMOVE_BULLET':
			return {
				...state,
				bullets: state.bullets.remove(action.payload),
			}
		default:
			return state
	}
}