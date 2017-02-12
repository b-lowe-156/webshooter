
export default function playerReducer(state = {
	players: [],
	controlledPlayer: -1,
}, action) {
	switch (action.type) {
		case 'SPAWN_PLAYER':
			const newPlayers = [...state.players]
			newPlayers.push(action.payload)
			return {
				...state,
				players: newPlayers,
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