
export default function playerReducer(state = {
	player: [],
	controlledPlayer: -1,
}, action) {
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