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

const initScene = physicEngine => {
	Events.on(physicEngine, 'collisionStart', (event) => {
		event.pairs.forEach(p => {
			const b = bulletContainer.find(b => b.bulletBox === p.bodyB)
			if(b && b.bullet) {
				// stage.removeChild(b.bullet)
				World.remove(physicEngine.world, b.bulletBox)
			}
			const a = bulletContainer.find(b => b.bulletBox === p.bodyA)
			if(a && a.bullet) {
				// stage.removeChild(a.bullet)
				World.remove(physicEngine.world, a.bulletBox)
			}
		})
	})
}

const physicSystem = (withRenderer=true) => {
	let lastMapState
	let activeWallRects = []
	let id = 0

	const playerPhysics = Bodies.circle(80, 80, 20, { restitution: 0.01, frictionAir: 0.5 })
	const engine = createPhysics(withRenderer)

	let bullet = []

	World.add(engine.world, playerPhysics)
	return {
		init: (store) => {
			Events.on(engine, 'collisionStart', (event) => {
				event.pairs.forEach(p => {
					const found = store.getState().bullet.bullets.find(b => b === p.bodyA || b === p.bodyB)
					if (found) {
							store.dispatch({
							type: 'REMOVE_BULLET',
							payload: found,
						})
						World.remove(engine.world, found)
					}
				})
			})
		},
		update: (state) => {
			if (lastMapState !== state.map) {
				lastMapState = state.map
				state.map.wallRects.forEach(w => {
					if (!activeWallRects[w.id]) {
						const levelBox = Bodies.rectangle(
								w.x + w.width / 2,
								w.y + w.height / 2,
								w.width,
								w.height,
								{ isStatic: true }
						)
						World.add(engine.world, levelBox);
						activeWallRects[w.id] = levelBox
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

				if (state.input.leftMouseDown) {
					id++
					const dir = (Math.random() - 0.5) * 0.1 + state.player.rot - Math.PI * 0.5
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
					dispatch({
						type: 'ADD_BULLET',
						payload: {
							id: id,
							x: state.player.x,
							y: state.player.y,
							dir: dir,
						}
					})
					bullet[id] = bulletBox
				}

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