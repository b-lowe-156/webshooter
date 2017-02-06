import { createStore } from 'redux'

const reducer = (state = {
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

const store = createStore(reducer)

store.subscribe(() => {
	console.log(store.getState())
})

export default store