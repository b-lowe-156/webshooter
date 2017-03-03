import { Engine, World, Bodies, Render } from 'matter-js'

test('', () => {
	const engine = Engine.create()
	const playerPhysics = Bodies.circle(80, 80, 20, { restitution: 0.01, frictionAir: 0.5 })
	playerPhysics.force.x = 1
	World.add(engine.world, playerPhysics)

	console.log(playerPhysics.position)
	Engine.update(engine, 16.666)
	console.log(playerPhysics.position)
	Engine.update(engine, 16.666)
	console.log(playerPhysics.position)

})