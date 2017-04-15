const { Engine, World, Render, Bodies, Events } = Matter

const createPhysics = withRenderer => {
	const engine = Engine.create()

	engine.world.gravity.x = 0.0
	engine.world.gravity.y = 0.0

	let render
	if (withRenderer) {
		render = Render.create({ element: document.body, engine: engine})
	} 
//	Engine.run(engine)
	if (render) {
		Render.run(render)
	}

	return engine
}

const physicSystem = (withRenderer=true) => {
	let lastStates = []

	let activeWallRects = []
	let id = 0

	const playerPhysics = Bodies.circle(80, 80, 20, { restitution: 0.01, frictionAir: 0.5 })
	const engine = createPhysics(withRenderer)

	let activeBullets = []

	World.add(engine.world, playerPhysics)
	return {
		init: (store) => {
			Events.on(engine, 'collisionStart', (event) => {
				event.pairs.forEach(p => {
					const found = store.getState().bullet.bullets.find(b => b.id === p.bodyA.entityId || b.id === p.bodyB.entityId)
					if (found) {
							store.dispatch({
							type: 'REMOVE_BULLET',
							payload: found,
						})
						World.remove(engine.world, found)
						delete activeBullets[found.id]
					}
				})
			})
		},
		update: (state) => {
			if (lastStates['map'] !== state.map) {
				lastStates['map'] = state.map
				state.map.wallRects.forEach(w => {
					if (!activeWallRects[w.id]) {
						const levelBox = Bodies.rectangle(
								w.x + w.width / 2,
								w.y + w.height / 2,
								w.width,
								w.height,
								{ isStatic: true }
						)
						World.add(engine.world, levelBox)
						activeWallRects[w.id] = levelBox
					}
				})
			}
			if (lastStates['bullet'] !== state.bullet) {
				lastStates['bullet'] = state.bullet
				console.log('update bullets')
				state.bullet.bullets.forEach(b => {
					if (!activeBullets[b.id]) {
						const bulletBox = Bodies.rectangle(
							b.x,
							b.y,
							10,
							32,
							{ angle: b.dir + Math.PI * 0.5, }
						)
						bulletBox.collisionFilter.group = -5
						bulletBox.force = {
							x: 0.05 * Math.cos(b.dir),
							y: 0.05 * Math.sin(b.dir),
						}
						bulletBox.entityId = b.id
						activeBullets[b.id] = bulletBox
						World.add(engine.world, bulletBox)
					}
				})
			}
		},
		tick: (state, dispatch) => {
				const { input, player } = state
				const moveSpeed = 0.01
				if (input.forward) {
						playerPhysics.force.x -= Math.sin(-player.rot) * moveSpeed;
						playerPhysics.force.y -= Math.cos(-player.rot) * moveSpeed;
				}
				if (input.backward) {
						playerPhysics.force.x += Math.sin(-player.rot) * moveSpeed;
						playerPhysics.force.y += Math.cos(-player.rot) * moveSpeed;
				}
				if (input.strafeLeft) {
						playerPhysics.force.x -= Math.sin(-player.rot + Math.PI / 2) * moveSpeed;
						playerPhysics.force.y -= Math.cos(-player.rot + Math.PI / 2) * moveSpeed;
				}
				if (input.strafeRight) {
						playerPhysics.force.x += Math.sin(-player.rot + Math.PI / 2) * moveSpeed;
						playerPhysics.force.y += Math.cos(-player.rot + Math.PI / 2) * moveSpeed;
				}

				/*
				if (state.input.leftMouseDown) {
					id++
					const dir = (Math.random() - 0.5) * 0.1 + state.player.rot - Math.PI * 0.5
					dispatch({
						type: 'ADD_BULLET',
						payload: {
							id: id,
							x: state.player.x,
							y: state.player.y,
							dir: dir,
						}
					})
				}
				*/

				const diff = player.rot - playerPhysics.angle
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

 				Engine.update(engine, 16.666)
			dispatch({
				type: 'UPDATE_PHYSICS',
				payload: {
					x: playerPhysics.position.x,
					y: playerPhysics.position.y,
					rot: playerPhysics.angle,
				},
			})
		},
	}
}

export default physicSystem()