
const { Engine, World, Bodies, Render, Events } = Matter

export default function playerReducer(state = {
	players: [],
	controlledPlayer: -1,
	player: undefined,
	playerAimLine: undefined,
	x: 0,
	y: 0,
	rot: 0,
	bodyRot: 0,
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
			const player = new PIXI.Graphics();
			player.lineStyle(0);
			player.beginFill(0xFFFF0B, 1.0);
			player.drawCircle(0, 0, 20);
			player.endFill();

			const playerAimLine = new PIXI.Graphics();
			playerAimLine.lineStyle(1, 0xFF0000, 1);
			playerAimLine.moveTo(0, 0);
			playerAimLine.lineTo(300, 0);

			return {
				...state,
				controlledPlayer: action.payload,
				player: player,
				playerAimLine: playerAimLine,
			}
		case 'UPDATE_ROTATION':
			if (state.players[state.controlledPlayer]) {
				const diff = state.rot - state.bodyRot
			
				let diffToHeight = false
				if (diff > (0.3 * Math.PI)) {
						diffToHeight = true
				}
				else if (diff < -(0.3 * Math.PI)) {
						diffToHeight = true
				}
				if (action.payload < 100 && action.payload > -100 && !diffToHeight) {
					return {
						...state,
						rot: state.rot + 0.001 * action.payload,
					}
				} else {
					return state
				}
			}
		case 'UPDATE_PHYSICS':
			return {
				...state,
				x: action.payload.x,
				y: action.payload.y,
				bodyRot: action.payload.rot,
			}
		default:
			return state
	}
}