const { Engine, World, Render, Bodies } = Matter

function createPhysics(withRenderer=false) {
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

const physicSystem = (withRenderer=false) => {
	let lastMapState
	let activeWallRects = []

	const playerPhysics = Bodies.circle(80, 80, 20, { restitution: 0.01, frictionAir: 0.5 })
	const engine = createPhysics(withRenderer)
	World.add(engine.world, playerPhysics)
	return {
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
 				Engine.update(engine, 16.666)
			dispatch({
				type: 'UPDATE_POS',
				payload: { x: playerPhysics.position.x, y: playerPhysics.position.y },
			})
		},
	}
}

export default physicSystem()