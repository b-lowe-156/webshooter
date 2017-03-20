
const { Engine, World, Bodies, Render, Events } = Matter

export default function playerReducer(state = {
	players: [],
	controlledPlayer: -1,
	player: undefined,
	playerAimLine: undefined,
	playerPhysics: undefined,
	playerRotation: 0,
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
			const playerPhysics = Bodies.circle(80, 80, 20, { restitution: 0.01, frictionAir: 0.5 })
			playerPhysics.collisionFilter.group = -5

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
				playerPhysics: playerPhysics,
			}
		case 'UPDATE_ROTATION':
			const currentPlayer = state.players[state.controlledPlayer]
			if (currentPlayer) {
				const { player, playerPhysics } = state
				const diff = player.rotation - playerPhysics.angle
				let diffToHeight = false
				if (diff > (0.3 * Math.PI)) {
						diffToHeight = true
				}
				else if (diff < -(0.3 * Math.PI)) {
						diffToHeight = true
				}
				if (action.payload < 100 && action.payload > -100 && !diffToHeight) {
						player.rotation += 0.001 * action.payload

						state.playerRotation = player.rotation
				}
			}
		default:
			return state
	}
}