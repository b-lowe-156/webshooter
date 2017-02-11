import { createLightPolygon } from './lighting'

const { Engine, World, Bodies, Render } = Matter

const scene = () => {
	let activePlayers = []
	let player
	return {
		updateScene: (state, stage, fovMask, engine) => {
			if (player !== state.player.player) {
				state.player.player.map(p => {
					if (!activePlayers[p.id]) {
						const playerPhysics = Bodies.circle(80, 80, 20, { restitution: 0.01, frictionAir: 0.5 });
						World.add(engine.world, playerPhysics);

						const player = new PIXI.Graphics();
						stage.addChild(player);
						player.lineStyle(0);
						player.beginFill(0xFF0000, 1.0);
						player.drawCircle(0, 0, 20);
						player.endFill();

						const playerAimLine = new PIXI.Graphics();
						stage.addChild(playerAimLine);
						playerAimLine.lineStyle(1, 0xFF0000, 1);
						playerAimLine.moveTo(0, 0);
						playerAimLine.lineTo(300, 0);
						playerAimLine.mask = fovMask

						activePlayers[p.id] = {
							playerPhysics,
							player,
							playerAimLine,
						}
					}
				})
				console.log(state.player.player)
			}
			player = state.player.player
		},
    tick: (state, stage, renderer, fovMask, polygons) => {
			const currentPlayer = state.player.player[state.player.controlledPlayer]
			if (currentPlayer) {
				
				const moveSpeed = 0.01
				const { playerPhysics, player, playerAimLine } = activePlayers[currentPlayer.id]

				const input = state.input
				if (input.forward) {
						playerPhysics.force.x -= Math.sin(player.rotation) * moveSpeed;
						playerPhysics.force.y -= Math.cos(player.rotation) * moveSpeed;
				}
				if (input.backward) {
						playerPhysics.force.x += Math.sin(player.rotation) * moveSpeed;
						playerPhysics.force.y += Math.cos(player.rotation) * moveSpeed;
				}
				if (input.strafeLeft) {
						playerPhysics.force.x -= Math.sin(player.rotation + Math.PI / 2) * moveSpeed;
						playerPhysics.force.y -= Math.cos(player.rotation + Math.PI / 2) * moveSpeed;
				}
				if (input.strafeRight) {
						playerPhysics.force.x += Math.sin(player.rotation + Math.PI / 2) * moveSpeed;
						playerPhysics.force.y += Math.cos(player.rotation + Math.PI / 2) * moveSpeed;
				}
				
				stage.pivot.x = playerPhysics.position.x;
				stage.pivot.y = playerPhysics.position.y;
				stage.position.x = renderer.width / 2;
				stage.position.y = renderer.height / 2 + 260;

				let diff = player.rotation - playerPhysics.angle
				const rotSpeed = 0.03
				if (diff > rotSpeed) {
						playerPhysics.torque = rotSpeed
				}
				else if (diff < -rotSpeed) {
						playerPhysics.torque = -rotSpeed
				}
				else {
						playerPhysics.torque = 0
				}
				stage.rotation = playerPhysics.angle

				playerAimLine.position.x = playerPhysics.position.x
				playerAimLine.position.y = playerPhysics.position.y
				playerAimLine.rotation = -player.rotation - 0.5 * Math.PI

				player.position.x = playerPhysics.position.x
        player.position.y = playerPhysics.position.y

		    const visibility = createLightPolygon(polygons, player.position.x, player.position.y)
				fovMask.clear()
				fovMask.lineStyle(1, 0x333333, 1.0)
				fovMask.lineStyle(1, 0xFFFFFF, 1)
				fovMask.beginFill(0xFFFFFF, 1)
				fovMask.moveTo(visibility[0][0], visibility[0][1])
				for (var i = 1; i <= visibility.length; i++) {
						fovMask.lineTo(visibility[i % visibility.length][0], visibility[i % visibility.length][1])
				}
				fovMask.endFill()

			}
		},
		updateRotation: (state, x) => {
			const currentPlayer = state.player.player[state.player.controlledPlayer]
			if (currentPlayer) {
				const { playerPhysics, player } = activePlayers[currentPlayer.id]
				var diff = player.rotation - playerPhysics.angle
				let diffToHeight = false
				if (diff > (0.5 * Math.PI)) {
						diffToHeight = true
				}
				else if (diff < -(0.5 * Math.PI)) {
						diffToHeight = true
				}
				if (x < 100 && x > -100 && !diffToHeight) {
						player.rotation -= 0.001 * x
				}
			}
		}
	}
}

export default scene()