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

    engine.world.gravity.x = 0.0
    engine.world.gravity.y = 0.0
    // add all of the bodies to the world
    World.add(engine.world, []);

//    const render = Render.create({ element: document.body, engine: engine})
    Engine.run(engine)
//    Render.run(render)

    const renderCanvas = document.getElementById('renderCanvas')
    const renderer = PIXI.autoDetectRenderer(800, 600, {
        antialias: true,
        view: renderCanvas,
        backgroundColor: 0x000000
    })
    document.body.appendChild(renderer.view);

    const app = document.getElementById('app')
    ReactDOM.render(<Provider store={store}><DevTools /></Provider>, app)

    renderCanvas.onmousedown = (e) => {
        store.dispatch({
            type: 'LEFT_MOUSE_DOWN',
        })
    }
    renderCanvas.onmouseup = (e) => {
        store.dispatch({
            type: 'LEFT_MOUSE_UP',
        })
    }

    renderCanvas.onclick = (e) => {
        renderCanvas.requestPointerLock();
    }

    // Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    function lockChangeAlert() {
        if (document.pointerLockElement === renderCanvas ||
            document.mozPointerLockElement === renderCanvas) {
            document.addEventListener("mousemove", mousemove, false);
        } else {
            document.removeEventListener("mousemove", mousemove, false);
        }
    }

    function mousemove(e) {
        let x = e.movementX || e.mozMovementX || 0
        scene.updateRotation(state, x)
    }

    var stage = new PIXI.Container();

    scene.initScene(stage, engine)

    var background = new PIXI.Graphics();
    var fovMask = new PIXI.Graphics();
    var backgroundInFov = new PIXI.Graphics();

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

    store.dispatch({
        type: 'ADD_STATIC_LIGHT',
        payload: { id: 1, x: 120, y: 120, }
    })
    store.dispatch({
        type: 'ADD_STATIC_LIGHT',
        payload: { id: 2, x: 280, y: 480, }
    })
    store.dispatch({
        type: 'ADD_STATIC_LIGHT',
        payload: { id: 3, x: 600, y: 200, }
    })   

    $.get('map.svg').done((data) => {
        $(data)
            .find('g')
            .each((i, g) => {
                const wall = g.id === 'layer2'
                const type = wall && 'ADD_WALL_RECT' || 'ADD_FLOOR_RECT'
                for (let i = 0; i < g.children.length; i++) {
                    const rect = g.children[i]

                    store.dispatch({
                        type: type,
                        payload: {
                            id: i,
                            x: rect.x.baseVal.value,
                            y: rect.y.baseVal.value,
                            width: rect.width.baseVal.value,
                            height: rect.height.baseVal.value,
                            rotation: (rect.transform && rect.transform.baseVal[0] && rect.transform.baseVal[0].angle) || 0
                        },
                    })
                    if (wall) {
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

    store.dispatch({
        type: 'SPAWN_PLAYER',
        payload: { id: 1, name: 'Threlgor', team: 'blue', }
    })

    store.dispatch({
        type: 'CONTROLE_PLAYER',
        payload: 0
    })

    store.subscribe(() => {
        state = store.getState()
        scene.updateScene(state, stage, background, backgroundInFov, container, fovMask, engine)
    })

    animate()

    function animate() {
        background.clear()
        
        if (state) {
           scene.tick(state, stage, renderer, fovMask, polygons, engine)
        }
 
        renderer.render(container, rt)
        renderer.render(stage)
        requestAnimationFrame(animate)
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
