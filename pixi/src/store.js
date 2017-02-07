import { combineReducers, createStore, compose } from 'redux'
import DevTools from './DevTools'

const playerReducer = (state = {
	player: [],
	controlledPlayer: -1,
}, action) => {
	switch (action.type) {
		case 'SPAWN_PLAYER':
			const newPlayers = [...state.player]
			newPlayers.push(action.payload)
			return {
				...state,
				player: newPlayers,
			}
		case 'CONTROLE_PLAYER':
			return {
				...state,
				controlledPlayer: action.payload,
			}
		default:
			return state
	}
}

const inputReducer = (state = {
	forward: false,
	backward: false,
	strafeLeft: false,
	strafeRight: false,
}, action) => {
	if (action.type !== 'keydown' || action.type !== 'keyup') {
		return state
	}
	let down = true
	if (action.type === 'keydown') {
		down = false
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

const enhancer = compose(
    DevTools.instrument()
)

const reducers = combineReducers({
	player: playerReducer,
	input: inputReducer,
})
const store = createStore(reducers, {}, enhancer)

store.subscribe(() => {
	console.log(store.getState())
})

export default store