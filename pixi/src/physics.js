const { Engine, Render } = Matter

export function createPhysics(withRenderer=false) {
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
