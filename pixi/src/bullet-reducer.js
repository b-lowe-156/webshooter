import { Set } from 'immutable'

export default function bulletReducer(state = {
	bullets: new Set(),
	//bullets: [],
}, action) {
	switch (action.type) {
		case 'ADD_BULLET':
			//state.bullets.push(action.payload)
			
			return {
				...state,
				//bullets: state.bullets.add(action.payload),
				bullets: state.bullets.add(action.payload),
			}
			
		case 'REMOVE_BULLET':
			delete state.bullets[action.payload]
		  
			return {
				...state,
				bullets: state.bullets.remove(action.payload),
			}
			
		default:
			return state
	}
}