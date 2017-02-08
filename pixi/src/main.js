import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import DevTools from './DevTools'

import { createLightingSprite, updateFov } from './lighting'
import { initLightSources } from './static_light'
import store from './store'
import scene from './scene'

window.onload = init

let state

function init() {
    var { Engine, World, Bodies, Render } = Matter
    var engine = Engine.create();

    var top = Bodies.rectangle(0, 0, 1600, 10, { isStatic: true });
    var left = Bodies.rectangle(0, 0, 10, 1200, { isStatic: true });
    var ground = Bodies.rectangle(0, 600, 1800, 10, { isStatic: true });
    var right = Bodies.rectangle(800, 0, 10, 1200, { isStatic: true });

    engine.world.gravity.x = 0.0
    engine.world.gravity.y = 0.0
    // add all of the bodies to the world
    World.add(engine.world, [top, left, ground, right]);

    // var render = Render.create({ element: document.body, engine: engine})

    Engine.run(engine)

    // Render.run(render)

    const renderCanvas = document.getElementById('renderCanvas')
    const renderer = PIXI.autoDetectRenderer(800, 600, {
        antialias: true,
        view: renderCanvas,
        backgroundColor: 0x000000
    })
    document.body.appendChild(renderer.view);

    const app = document.getElementById('app')
    ReactDOM.render(<Provider store={store}><DevTools /></Provider>, app)

    renderCanvas.onclick = function () {
        renderCanvas.requestPointerLock();
    }

    // Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    function lockChangeAlert() {
        if (document.pointerLockElement === renderCanvas ||
            document.mozPointerLockElement === renderCanvas) {
            document.addEventListener("mousemove", canvasLoop, false);
        } else {
            document.removeEventListener("mousemove", canvasLoop, false);
        }
    }

    function canvasLoop(e) {
        let x = e.movementX || e.mozMovementX || 0

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

    var stage = new PIXI.Container();
    var background = new PIXI.Graphics();
    var fovMask = new PIXI.Graphics();
    var backgroundInFov = new PIXI.Graphics();

    store.subscribe(() => {
        state = store.getState()
        scene.render(state, stage)
    })

    fovMask.beginFill(0xFFFFFF);
    fovMask.beginFill(0xFFFFFF, 1);

    var polygons = []
    polygons.push([[-100, -100], [800 + 1, -100], [800 + 1, 600 + 1], [-100, 600 + 1]])

    var lightSources = initLightSources(polygons)
    var lightingSprite = createLightingSprite(lightSources, 800, 600)

    var container = new PIXI.Container()
    var brt = new PIXI.BaseRenderTexture(800, 600, PIXI.SCALE_MODES.LINEAR, 1)
    var rt = new PIXI.RenderTexture(brt)
    var sprite = new PIXI.Sprite(rt)
    var thing = new PIXI.Graphics();

    stage.addChild(sprite)
    background.filters = [new PIXI.SpriteMaskFilter(sprite)]

    background.mask = fovMask

    const fliesenTexture = PIXI.Texture.fromImage('texture/fliesen-textgure.jpg')
    const fliesenTextureDark = PIXI.Texture.fromImage('texture/fliesen-textgure-dark.jpg')
    const rockTexture = PIXI.Texture.fromImage('texture/rock-texture.jpg')


    const radiaLtexture = PIXI.Texture.fromImage('texture/radial-gradient.png')

    const light1 = new PIXI.Sprite(radiaLtexture)
    light1.scale.x = 3
    light1.scale.y = 3
    light1.x = 120
    light1.y = 120
    light1.anchor.set(0.5)
    container.addChild(light1)

    const light2 = new PIXI.Sprite(radiaLtexture)
    light2.scale.x = 3
    light2.scale.y = 3
    light2.x = 280
    light2.y = 480
    light2.anchor.set(0.5)
    container.addChild(light2)

    const light3 = new PIXI.Sprite(radiaLtexture)
    light3.scale.x = 3
    light3.scale.y = 3
    light3.x = 600
    light3.y = 200
    light3.anchor.set(0.5)
    container.addChild(light3)

    $.get('map.svg').done((data) => {
        $(data)
            .find('g')
            .each((i, g) => {
                const wall = g.id === 'layer2'
                for (let i = 0; i < g.children.length; i++) {
                    const rect = g.children[i]
                    let tileTexture = fliesenTexture
                    if (wall) {
                        tileTexture = rockTexture
                    }
                    const tilingSprite = new PIXI.extras.TilingSprite(fliesenTexture, rect.width.baseVal.value, rect.height.baseVal.value)
                    tilingSprite.position.x = rect.x.baseVal.value
                    tilingSprite.position.y = rect.y.baseVal.value
                    tilingSprite.rotation = 0.0
                    if (rect.transform && rect.transform.baseVal[0] && rect.transform.baseVal[0].angle) {
                        tilingSprite.rotation = -rect.transform.baseVal[0].angle
                    }
                    background.addChild(tilingSprite)

                    const tilingSprite3 = new PIXI.extras.TilingSprite(fliesenTextureDark, rect.width.baseVal.value, rect.height.baseVal.value)
                    tilingSprite3.position.x = rect.x.baseVal.value
                    tilingSprite3.position.y = rect.y.baseVal.value
                    tilingSprite3.rotation = 0.0
                    if (rect.transform && rect.transform.baseVal[0] && rect.transform.baseVal[0].angle) {
                        tilingSprite3.rotation = -rect.transform.baseVal[0].angle
                    }
                    backgroundInFov.addChild(tilingSprite3)

                    if (wall) {
                        const tilingSprite2 = new PIXI.extras.TilingSprite(rockTexture, rect.width.baseVal.value, rect.height.baseVal.value)
                        tilingSprite2.position.x = rect.x.baseVal.value
                        tilingSprite2.position.y = rect.y.baseVal.value
                        tilingSprite2.rotation = 0.0
                        if (rect.transform && rect.transform.baseVal[0] && rect.transform.baseVal[0].angle) {
                            tilingSprite2.rotation = -rect.transform.baseVal[0].angle
                        }
                        backgroundInFov.addChild(tilingSprite2)
                    }

                    if (wall) {
                        const levelBox = Bodies.rectangle(
                            rect.x.baseVal.value + rect.width.baseVal.value / 2,
                            rect.y.baseVal.value + rect.height.baseVal.value / 2,
                            rect.width.baseVal.value,
                            rect.height.baseVal.value,
                            { isStatic: true }
                        )
                        World.add(engine.world, levelBox);

                        polygons.push([[rect.x.baseVal.value, rect.y.baseVal.value],
                        [rect.x.baseVal.value + rect.width.baseVal.value, rect.y.baseVal.value],
                        [rect.x.baseVal.value + rect.width.baseVal.value, rect.y.baseVal.value + rect.height.baseVal.value],
                        [rect.x.baseVal.value, rect.y.baseVal.value + rect.height.baseVal.value]]);
                    }
                }
            })
    })


    //  stage.addChild(sprite)
    stage.addChild(fovMask)

    stage.addChild(backgroundInFov)
    stage.addChild(background)

    const playerPhysics = Bodies.circle(40, 40, 20, { restitution: 0.01, frictionAir: 0.5 });
    World.add(engine.world, playerPhysics);

    const player = new PIXI.Graphics();
    stage.addChild(player);
    player.lineStyle(0);
    player.beginFill(0xFFFF0B, 1.0);
    player.drawCircle(0, 0, 20);
    player.endFill();

    const playerAimLine = new PIXI.Graphics();
    stage.addChild(playerAimLine);
    playerAimLine.lineStyle(1, 0xFF0000, 1);
    playerAimLine.moveTo(0, 0);
    playerAimLine.lineTo(300, 0);
    playerAimLine.mask = fovMask

    store.dispatch({
        type: 'SPAWN_PLAYER', payload: {
            id: 1,
            name: 'Threlgor',
            team: 'blue',
            physics: playerPhysics,
            graphics: player,
            aimLine: playerAimLine,
        }
    })


/*
    store.dispatch({
        type: 'SPAWN_PLAYER', payload: {
            id: 2,
            name: 'Nucleon',
            team: 'red',
        }
    })
*/
    store.dispatch({
        type: 'CONTROLE_PLAYER', payload: 0
    })


    // run the render loop
    animate();

    function animate() {
        background.clear()
        
        if (state) {
            const currentPlayer = state.player.player[state.player.controlledPlayer]
            if (currentPlayer) {
                move(currentPlayer.physic, state.input)
                updateFov(fovMask, polygons, currentPlayer.physics.position.x, currentPlayer.physics.position.y)
            }
        }
 
        renderer.render(container, rt)
        renderer.render(stage)
        requestAnimationFrame(animate)
    }

    function move(physics, input) {
        var moveSpeed = 0.01;
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

        { // camera
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
        }

        player.position.x = playerPhysics.position.x
        player.position.y = playerPhysics.position.y
    }
}

window.addEventListener('keydown', function (e) {
    if (state.input.forward && e.keyCode === 87) {
        return
    }
    else if (state.input.strafeLeft && e.keyCode === 65) {
        return
    }
    else if (state.input.backward && e.keyCode === 83) {
        return
    }
    else if (state.input.strafeRight && e.keyCode === 68) {
        return
    }
    store.dispatch({ type: 'keydown', payload: e.keyCode })
});

window.addEventListener('keyup', function (e) {
    store.dispatch({ type: 'keyup', payload: e.keyCode })
});
