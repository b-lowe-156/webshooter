var PIXI = require('pixi.js')
import { createLinearGradient, createRadialGradient } from './src/lighting'

window.onload = init

var controlling = new Controlling();

var player = {
    x: 40,
    y: 40,
    rotation: 0,
    cameraRotation: 1 * Math.PI,
}

function init() {
    var { Engine, World, Bodies, Render } = Matter
    var engine = Engine.create();

    var container = new PIXI.Container();
    var brt = new PIXI.BaseRenderTexture(800, 600, PIXI.SCALE_MODES.LINEAR, 1);
    var rt = new PIXI.RenderTexture(brt);
    var sprite = new PIXI.Sprite(rt);

    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var boxC = Bodies.rectangle(110, 310, 120, 120, { isStatic: true });
    var playerPhysics = Bodies.circle(40, 40, 20, { restitution: 0.01, frictionAir: 0.5 });

    var top = Bodies.rectangle(0, 0, 1600, 10, { isStatic: true });
    var left = Bodies.rectangle(0, 0, 10, 1200, { isStatic: true });
    var ground = Bodies.rectangle(0, 600, 1800, 10, { isStatic: true });
    var right = Bodies.rectangle(800, 0, 10, 1200, { isStatic: true });

    engine.world.gravity.x = 0.0
    engine.world.gravity.y = 0.0
    // add all of the bodies to the world
    World.add(engine.world, [boxA, boxB, boxC, playerPhysics, top, left, ground, right]);

    /*
    var render = Render.create({
        element: document.body,
        engine: engine
    });
    */
    
    // run the engine
    Engine.run(engine);

    // run the renderer
    // Render.run(render);

    var renderCanvas = document.getElementById('renderCanvas')
    var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true, view: renderCanvas });
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
        var movementX = e.movementX || e.mozMovementX || 0;
        var movementY = e.movementY || e.mozMovementY || 0;
        if (movementX < 100 && movementX > -100) {
            player.rotation += 0.001 * movementX
            player.cameraRotation += 0.00001
        }
    }


    // create the root of the scene graph
    var stage = new PIXI.Container();

    stage.interactive = true;

    var background = new PIXI.Graphics();
    var fovMask = new PIXI.Graphics();

    var gradient2 = createLinearGradient(800, 600, {
        // These are the gradients stops, starting at the beginning (0.0) with white and ending with black at the end (1.0).
        0.0: 'white',
        1.0: 'black', // black color will make pixels transparent.
    }, function mapToSprite(canvas) {
        return new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(canvas)))
    })

    var gradient = createRadialGradient(800, 600, {
        // These are the gradients stops, starting at the beginning (0.0) with white and ending with black at the end (1.0).
        0.0: 'white',
        1.0: 'black', // black color will make pixels transparent.
    }, function mapToSprite(canvas) {
        return new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(canvas)))
    })

    // set a fill and line style
    fovMask.beginFill(0xFFFFFF);

    var width = 120
    var height = 120
    var startX = 50
    var startY = 250

    // set a fill and a line style again and draw a rectangle
    fovMask.beginFill(0xFFFFFF, 1);
   // background.drawRect(startX, startY, width, height)
   
    sprite.mask = fovMask
    background.mask = gradient

    var polygons = []
    polygons.push([[startX,startY],[startX+width,startY],[startX+width,startY+height],[startX,startY+height]])
    polygons.push([[-1,-1],[800+1,-1],[800+1,600+1],[-1,600+1]]);	

    stage.addChild(fovMask)
    container.addChild(gradient)
    
    stage.addChild(sprite)
    container.addChild(background)

    var boxAGrapfhic = new PIXI.Graphics();
    stage.addChild(boxAGrapfhic);
    boxAGrapfhic.lineStyle(1, 0xFFFFFF, 1);
//    boxAGrapfhic.drawRect( 0, 0, 80, 80)

    boxAGrapfhic.moveTo(-40, -40);
    boxAGrapfhic.lineTo( 40, -40);
    boxAGrapfhic.lineTo( 40, 40);
    boxAGrapfhic.lineTo( -40, 40);
    boxAGrapfhic.lineTo( -40, -40);

    boxAGrapfhic.mask = fovMask

    var boxBGrapfhic = new PIXI.Graphics();
    stage.addChild(boxBGrapfhic);
    boxBGrapfhic.lineStyle(1, 0xFFFFFF, 1);
    boxBGrapfhic.moveTo(-40, -40);
    boxBGrapfhic.lineTo( 40, -40);
    boxBGrapfhic.lineTo( 40, 40);
    boxBGrapfhic.lineTo( -40, 40);
    boxBGrapfhic.lineTo( -40, -40);
    boxBGrapfhic.mask = fovMask

    //background.mask = fovMask

    // run the render loop
    animate();

    function animate() {
        background.clear()
        move()

        renderer.render(container, rt)
        renderer.render(stage)
        requestAnimationFrame(animate)
    }

    function move(){ 
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

        stage.pivot.x = playerPhysics.position.x;
        stage.pivot.y = playerPhysics.position.y;
        stage.position.x = renderer.width / 2;
        stage.position.y = renderer.height / 2 + 260;
        stage.rotation = player.rotation

        background.lineStyle(2, 0xFFFFFF, 1);
        background.beginFill(0xFF700B, 1);
        background.drawRect(0, 0, 800, 600);

        background.drawRect(startX, startY, width, height)

        boxAGrapfhic.position.x = boxA.position.x
        boxAGrapfhic.position.y = boxA.position.y
        boxAGrapfhic.rotation = boxA.angle
        
        boxBGrapfhic.position.x = boxB.position.x
        boxBGrapfhic.position.y = boxB.position.y
        boxBGrapfhic.rotation = boxB.angle

        background.lineStyle(0);
        background.beginFill(0xFFFF0B, 1.0);
        background.drawCircle(playerPhysics.position.x, playerPhysics.position.y, 20);
        background.endFill();

        // when the mouse is moved, we determine the new visibility polygon 	
        var visibility = createLightPolygon(playerPhysics.position.x, playerPhysics.position.y);
        // then we draw it
        fovMask.clear();

        fovMask.lineStyle(1, 0x333333, 1.0);
        fovMask.drawRect(startX, startY, width, height)

        fovMask.lineStyle(1, 0xFFFFFF, 1);
        fovMask.beginFill(0xFFFFFF, 1);
        fovMask.moveTo(visibility[0][0],visibility[0][1]);	
        for(var i=1;i<=visibility.length;i++){
            fovMask.lineTo(visibility[i%visibility.length][0],visibility[i%visibility.length][1]);		
        }
        fovMask.endFill();
    }

    // and this is how the library generates the visibility polygon starting
    // from an array of polygons and a source point
    function createLightPolygon(x,y){
        var segments = VisibilityPolygon.convertToSegments(polygons);
        segments = VisibilityPolygon.breakIntersections(segments);
        var position = [x, y];
        if (VisibilityPolygon.inPolygon(position, polygons[polygons.length-1])) {
            return VisibilityPolygon.compute(position, segments);
        }      
        return null;
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
