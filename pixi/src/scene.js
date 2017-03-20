import { createLightPolygon } from './lighting'

const { Engine, World, Bodies, Render, Events } = Matter

const fliesenTexture = PIXI.Texture.fromImage('texture/fliesen-textgure.jpg')
const fliesenTextureDark = PIXI.Texture.fromImage('texture/fliesen-textgure-dark.jpg')
const rockTexture = PIXI.Texture.fromImage('texture/rock-texture.jpg')
const radiaLtexture = PIXI.Texture.fromImage('texture/radial-gradient.png')

const scene = () => {
	let lastPlayerState
	let activePlayers = []

	let lastMapState
	let activeFloorRects = []
	let activeWallRects = []
	let activeStaticLights = []

	const bulletContainer = []
	const entityContainer = []

	return {
		initScene: (stage, physicEngine) => {
			Events.on(physicEngine, 'collisionStart', (event) => {
				event.pairs.forEach(p => {
					const b = bulletContainer.find(b => b.bulletBox === p.bodyB)
					if(b && b.bullet) {
						stage.removeChild(b.bullet)
						World.remove(physicEngine.world, b.bulletBox)
					}
					const a = bulletContainer.find(b => b.bulletBox === p.bodyA)
					if(a && a.bullet) {
						stage.removeChild(a.bullet)
						World.remove(physicEngine.world, a.bulletBox)
					}
				})
			})
		},
		updateScene: (state, stage, background, backgroundInFov, container, fovMask, physicEngine) => {
			// players
			if (lastPlayerState !== state.player) {
				state.player.players.forEach(p => {
					if (!activePlayers[p.id]) {
						const playerPhysics = state.player.playerPhysics
						World.add(physicEngine.world, playerPhysics)
						const player = state.player.player
						stage.addChild(player)
						const playerAimLine = state.player.playerAimLine
						stage.addChild(playerAimLine)
						playerAimLine.mask = fovMask

						activePlayers[p.id] = {
							playerPhysics,
							player,
							playerAimLine,
						}
					}
				})
			}
			lastPlayerState = state.player
			// map
			if (lastMapState !== state.map) {
				state.map.floorRects.forEach(f => {
					if (!activeFloorRects[f.id]) {
						const floorSprite = new PIXI.extras.TilingSprite(fliesenTexture, f.width, f.height)
						floorSprite.position.x = f.x
						floorSprite.position.y = f.y
						floorSprite.rotation = 0.0
						background.addChild(floorSprite)

						const floorSpriteInFov = new PIXI.extras.TilingSprite(fliesenTextureDark, f.width, f.height)
						floorSpriteInFov.position.x = f.x
						floorSpriteInFov.position.y = f.y
						floorSpriteInFov.rotation = 0.0
						backgroundInFov.addChild(floorSpriteInFov)

						activeFloorRects[f.id] = { floorSprite, floorSpriteInFov }
					}
				})
				state.map.wallRects.forEach(w => {
					if (!activeWallRects[w.id]) {
						const wallSprite = new PIXI.extras.TilingSprite(rockTexture, w.width, w.height)
						wallSprite.position.x = w.x
						wallSprite.position.y = w.y
						wallSprite.rotation = 0.0
						backgroundInFov.addChild(wallSprite)
						const levelBox = Bodies.rectangle(
								w.x + w.width / 2,
								w.y + w.height / 2,
								w.width,
								w.height,
								{ isStatic: true }
						)
						World.add(physicEngine.world, levelBox);

						activeWallRects[w.id] = { wallSprite, levelBox }
					}
				})
				state.map.staticLights.forEach(l => {
					if (!activeStaticLights[l.id]) {
						const light = new PIXI.Sprite(radiaLtexture)
						light.scale.x = 3
						light.scale.y = 3
						light.x = l.x
						light.y = l.y
						light.anchor.set(0.5)
						container.addChild(light)
						activeStaticLights[l.id] = light
					}
				})
			}
			lastMapState = state.map
		},
    tick: (state, mutableState, stage, renderer, fovMask, physicEngine, ws) => {
			const currentPlayer = state.player.players[state.player.controlledPlayer]
			if (currentPlayer && activePlayers[currentPlayer.id]) {
				
				const moveSpeed = 0.01
				const { playerPhysics, player, playerAimLine } = activePlayers[currentPlayer.id]

				const input = mutableState.input
				if (input.forward) {
						playerPhysics.force.x -= Math.sin(-player.rotation) * moveSpeed;
						playerPhysics.force.y -= Math.cos(-player.rotation) * moveSpeed;
				}
				if (input.backward) {
						playerPhysics.force.x += Math.sin(-player.rotation) * moveSpeed;
						playerPhysics.force.y += Math.cos(-player.rotation) * moveSpeed;
				}
				if (input.strafeLeft) {
						playerPhysics.force.x -= Math.sin(-player.rotation + Math.PI / 2) * moveSpeed;
						playerPhysics.force.y -= Math.cos(-player.rotation + Math.PI / 2) * moveSpeed;
				}
				if (input.strafeRight) {
						playerPhysics.force.x += Math.sin(-player.rotation + Math.PI / 2) * moveSpeed;
						playerPhysics.force.y += Math.cos(-player.rotation + Math.PI / 2) * moveSpeed;
				}

				if (input.leftMouseDown) {
					const bullet = PIXI.Sprite.fromImage('http://pixijs.github.io/examples/required/assets/basics/bunny.png')
					bullet.anchor.set(0.5)
					stage.addChild(bullet)
					bullet.x = playerPhysics.position.x
					bullet.y = playerPhysics.position.y
					const dir = (Math.random() - 0.5) * 0.1 + player.rotation - Math.PI * 0.5
					const bulletBox = Bodies.rectangle(
						bullet.x,
						bullet.y,
						10,
						32,
						{ angle: dir + Math.PI * 0.5, }
					)
					bulletBox.collisionFilter.group = -5
					bulletBox.force = {
						x: 0.05 * Math.cos(dir),
						y: 0.05 * Math.sin(dir),
					}
					World.add(physicEngine.world, bulletBox)
					bulletContainer.push({ bullet, bulletBox })
					ws.send(JSON.stringify({
						type: 'bullet',
						x: playerPhysics.position.x,
						y: playerPhysics.position.y,
						dir: dir,
					}))
				}
				
				stage.pivot.x = playerPhysics.position.x
				stage.pivot.y = playerPhysics.position.y
				stage.position.x = renderer.width / 2
				stage.position.y = renderer.height / 2 + 260

				ws.send(JSON.stringify({
					type: 'player',
					x: playerPhysics.position.x,
					y: playerPhysics.position.y,
					angle: playerPhysics.angle
				}))

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
				stage.rotation = -playerPhysics.angle

				playerAimLine.position.x = playerPhysics.position.x
				playerAimLine.position.y = playerPhysics.position.y
				playerAimLine.rotation = player.rotation - 0.5 * Math.PI

				player.position.x = playerPhysics.position.x
        player.position.y = playerPhysics.position.y

				bulletContainer.forEach(e => {
					e.bullet.rotation = e.bulletBox.angle
					e.bullet.position.x = e.bulletBox.position.x
					e.bullet.position.y = e.bulletBox.position.y
				})

		    const visibility = createLightPolygon(state.map.polygons, player.position.x, player.position.y)
				fovMask.clear()
				fovMask.lineStyle(1, 0x333333, 1.0)
				fovMask.lineStyle(1, 0xFFFFFF, 1)
				fovMask.beginFill(0xFFFFFF, 1)
				fovMask.moveTo(visibility[0][0], visibility[0][1])
				for (let i = 1; i <= visibility.length; i++) {
						fovMask.lineTo(visibility[i % visibility.length][0], visibility[i % visibility.length][1])
				}
				fovMask.endFill()

			}
		},
		updateRotation: (state, x) => {
			const currentPlayer = state.player.players[state.player.controlledPlayer]
			if (currentPlayer) {
				const { player, playerPhysics } = activePlayers[currentPlayer.id]
				const diff = player.rotation - playerPhysics.angle
				let diffToHeight = false
				if (diff > (0.3 * Math.PI)) {
						diffToHeight = true
				}
				else if (diff < -(0.3 * Math.PI)) {
						diffToHeight = true
				}
				if (x < 100 && x > -100 && !diffToHeight) {
						player.rotation += 0.001 * x
				}
			}
		},
		updateRemoteEntities: (stage, physicEngine, data) => {
			if (data.type === 'player') {
				if (!entityContainer[data.id]) {
					const player = new PIXI.Graphics()
					stage.addChild(player)
					player.lineStyle(0)
					player.beginFill(0xFFFF0B, 1.0)
					player.drawCircle(0, 0, 20)
					player.endFill()
					entityContainer[data.id] = player
					entityContainer[data.id].position.x = data.x
					entityContainer[data.id].position.y = data.y
					entityContainer[data.id].rotation = data.angle
				} else {
					entityContainer[data.id].position.x = data.x
					entityContainer[data.id].position.y = data.y
					entityContainer[data.id].rotation = data.angle
				}
			} else if (data.type === 'bullet'){
				const bullet = PIXI.Sprite.fromImage('http://pixijs.github.io/examples/required/assets/basics/bunny.png')
				bullet.anchor.set(0.5)
				stage.addChild(bullet)
				bullet.x = data.x
				bullet.y = data.y
				const bulletBox = Bodies.rectangle(
					bullet.x,
					bullet.y,
					10,
					32,
					{ angle: data.dir + Math.PI * 0.5, }
				)
				bulletBox.collisionFilter.group = -5
				bulletBox.force = {
					x: 0.05 * Math.cos(data.dir),
					y: 0.05 * Math.sin(data.dir),
				}
				World.add(physicEngine.world, bulletBox)
				bulletContainer.push({ bullet, bulletBox })
			}
		},
	}
}

export default scene()