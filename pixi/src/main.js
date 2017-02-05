var PIXI = require('pixi.js')
import { createLightingSprite, createLightPolygon } from './lighting'
import { initLightSources } from './static_light'

window.onload = init

var controlling = new Controlling();

var player = {
    x: 40,
    y: 40,
    rotation: 0,
}

function init() {
    var { Engine, World, Bodies, Render } = Matter
    var engine = Engine.create();

    // create two boxes and a ground
    var playerPhysics = Bodies.circle(40, 40, 20, { restitution: 0.01, frictionAir: 0.5 });

    var top = Bodies.rectangle(0, 0, 1600, 10, { isStatic: true });
    var left = Bodies.rectangle(0, 0, 10, 1200, { isStatic: true });
    var ground = Bodies.rectangle(0, 600, 1800, 10, { isStatic: true });
    var right = Bodies.rectangle(800, 0, 10, 1200, { isStatic: true });

    engine.world.gravity.x = 0.0
    engine.world.gravity.y = 0.0
    // add all of the bodies to the world
    World.add(engine.world, [playerPhysics, top, left, ground, right]);

    // var render = Render.create({ element: document.body, engine: engine})
    
    Engine.run(engine)

    // Render.run(render)

    var renderCanvas = document.getElementById('renderCanvas')
    var renderer = PIXI.autoDetectRenderer(800, 600, {
        antialias: true,
        view: renderCanvas,
        backgroundColor : 0x000000
    })
    document.body.appendChild(renderer.view);

    renderCanvas.onclick = function() {
        renderCanvas.requestPointerLock();
    }

    // Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    function lockChangeAlert() {
        if (document.pointerLockElement === renderCanvas ||
            document.mozPointerLockElement === renderCanvas) {
            console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", canvasLoop, false);
        } else {
            console.log('The pointer lock status is now unlocked');
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

    fovMask.beginFill(0xFFFFFF);
    fovMask.beginFill(0xFFFFFF, 1);

    var polygons = []
    polygons.push([[-100,-100],[800+1,-100],[800+1,600+1],[-100,600+1]])	

    var lightSources = initLightSources(polygons)
    var lightingSprite = createLightingSprite(lightSources, 800, 600)

    var container = new PIXI.Container()
    var brt = new PIXI.BaseRenderTexture(800, 600, PIXI.SCALE_MODES.LINEAR, 1)
    var rt = new PIXI.RenderTexture(brt)
    var sprite = new PIXI.Sprite(rt)
    var thing = new PIXI.Graphics();
    container.addChild(thing);
    thing.lineStyle(0);
    thing.beginFill(0xFFFF0B, 1.0);
    thing.drawCircle(0, 0, 300);
    thing.endFill();

    stage.addChild(sprite)
    background.filters = [new PIXI.SpriteMaskFilter(sprite)]

background.mask = sprite

    background.mask = fovMask

    const fliesenTexture = PIXI.Texture.fromImage('texture/fliesen-textgure.jpg')
    const fliesenTextureDark = PIXI.Texture.fromImage('texture/fliesen-textgure-dark.jpg')
    const rockTexture = PIXI.Texture.fromImage('texture/rock-texture.jpg')

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
                    if( rect.transform && rect.transform.baseVal[0] && rect.transform.baseVal[0].angle ) {
                        tilingSprite.rotation = -rect.transform.baseVal[0].angle
                    }
                    background.addChild(tilingSprite)

                    const tilingSprite3 = new PIXI.extras.TilingSprite(fliesenTextureDark, rect.width.baseVal.value, rect.height.baseVal.value)
                    tilingSprite3.position.x = rect.x.baseVal.value
                    tilingSprite3.position.y = rect.y.baseVal.value
                    tilingSprite3.rotation = 0.0
                    if( rect.transform && rect.transform.baseVal[0] && rect.transform.baseVal[0].angle ) {
                        tilingSprite3.rotation = -rect.transform.baseVal[0].angle
                    }
                    backgroundInFov.addChild(tilingSprite3)

                    if (wall) {
                        const tilingSprite2 = new PIXI.extras.TilingSprite(rockTexture, rect.width.baseVal.value, rect.height.baseVal.value)
                        tilingSprite2.position.x = rect.x.baseVal.value
                        tilingSprite2.position.y = rect.y.baseVal.value
                        tilingSprite2.rotation = 0.0
                        if( rect.transform && rect.transform.baseVal[0] && rect.transform.baseVal[0].angle ) {
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

    let player = new PIXI.Graphics();
    stage.addChild(player);
    player.lineStyle(0);
    player.beginFill(0xFFFF0B, 1.0);
    player.drawCircle(0, 0, 20);
    player.endFill();

    var playerAimLine = new PIXI.Graphics();
    stage.addChild(playerAimLine);
    playerAimLine.lineStyle(1, 0xFF0000, 1);
    playerAimLine.moveTo(0, 0);
    playerAimLine.lineTo( 300, 0);
    playerAimLine.mask = fovMask

    // run the render loop
    animate();

    function animate() {
        background.clear()
        move()

        renderer.render(container, rt)
        renderer.render(stage)
        requestAnimationFrame(animate)
    }

    function move() {
        var moveSpeed = 0.01;
        if (controlling.forward) {
            playerPhysics.force.x -= Math.sin(player.rotation) * moveSpeed;
            playerPhysics.force.y -= Math.cos(player.rotation) * moveSpeed;
        }
        if (controlling.backward) {
            playerPhysics.force.x += Math.sin(player.rotation) * moveSpeed;
            playerPhysics.force.y += Math.cos(player.rotation) * moveSpeed;
        }
        if (controlling.strafeLeft) {
            playerPhysics.force.x -= Math.sin(player.rotation + Math.PI / 2) * moveSpeed;
            playerPhysics.force.y -= Math.cos(player.rotation + Math.PI / 2) * moveSpeed;
        }
        if (controlling.strafeRight) {
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

        // when the mouse is moved, we determine the new visibility polygon
        	
        var visibility = createLightPolygon(polygons, playerPhysics.position.x, playerPhysics.position.y);
        // then we draw it
        fovMask.clear();

        fovMask.lineStyle(1, 0x333333, 1.0);

        fovMask.lineStyle(1, 0xFFFFFF, 1);
        fovMask.beginFill(0xFFFFFF, 1);
        fovMask.moveTo(visibility[0][0],visibility[0][1]);	
        for(var i=1;i<=visibility.length;i++){
            fovMask.lineTo(visibility[i%visibility.length][0],visibility[i%visibility.length][1]);		
        }
        fovMask.endFill();
    }
}

function Controlling() {
    this.forward = false;
    this.backward = false;
    this.strafeLeft = false;
    this.strafeRight = false;
}

Controlling.prototype.handleKeydownEvent = function(e) {
    var code = e.keyCode;
    switch (code) {
        case 87: //'w':
            this.forward = true;
            break;
        case 65: //'a':
            this.strafeLeft = true;
            break;
        case 83: //'s':
            this.backward = true;
            break;
        case 68: //'d':
            this.strafeRight = true;
            break;
    	
        default:
    }
};

Controlling.prototype.handleKeyupEvent = function(e) {
    var code = e.keyCode;
    switch (code) {
        case 87: //'w':
            this.forward = false;
            break;
        case 65: //'a':
            this.strafeLeft = false;
            break;
        case 83: //'s':
            this.backward = false;
            break;
        case 68: //'d':
            this.strafeRight = false;
            break;

        default:
    }
};

window.addEventListener('keydown', function(e) {
    controlling.handleKeydownEvent(e);
});

window.addEventListener('keyup', function(e) {
    controlling.handleKeyupEvent(e);
});
