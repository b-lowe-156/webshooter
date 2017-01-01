var PIXI = require('pixi.js')

window.onload = init

var controlling = new Controlling();

var player = {
    x: 10,
    y: 10,
    rotation: 1 * Math.PI,
}

function init() {
    var { Engine, World, Bodies } = Matter
    var engine = Engine.create();

    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // add all of the bodies to the world
    World.add(engine.world, [boxA, boxB, ground]);

    // run the engine
    Engine.run(engine);

    var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
    document.body.appendChild(renderer.view);

    // create the root of the scene graph
    var stage = new PIXI.Container();

    stage.interactive = true;

    var background = new PIXI.Graphics();
    var fovMask = new PIXI.Graphics();

    // set a fill and line style
    fovMask.beginFill(0xFFFFFF);

    var width = 120
    var height = 120
    var startX = 50
    var startY = 250

    // set a fill and a line style again and draw a rectangle
    fovMask.beginFill(0xFFFFFF, 1);
    background.drawRect(startX, startY, width, height)

    var polygons = []
    polygons.push([[startX,startY],[startX+width,startY],[startX+width,startY+height],[startX,startY+height]])
    polygons.push([[-1,-1],[800+1,-1],[800+1,600+1],[-1,600+1]]);	

    stage.addChild(background);
    stage.addChild(fovMask);

    var boxAGrapfhic = new PIXI.Graphics();
    stage.addChild(boxAGrapfhic);
    boxAGrapfhic.lineStyle(4, 0xFFFFFF, 1);
    boxAGrapfhic.drawRect(0, 0, 76, 76)
    boxAGrapfhic.rotation += 0.5
    boxAGrapfhic.mask = fovMask

    var boxBGrapfhic = new PIXI.Graphics();
    stage.addChild(boxBGrapfhic);
    boxBGrapfhic.lineStyle(4, 0xFFFFFF, 1);
    boxBGrapfhic.drawRect(0, 0, 76, 76)
    boxBGrapfhic.mask = fovMask

    background.mask = fovMask

    // run the render loop
    animate();

    function animate() {
        background.clear()
        move()
        renderer.render(stage)
        requestAnimationFrame(animate)
    }

    function move(){ 
        var moveSpeed = 5;
        if (controlling.forward) {
            player.x += Math.sin(player.rotation) * moveSpeed;
            player.y += Math.cos(player.rotation) * moveSpeed;
        }
        if (controlling.backward) {
            player.x -= Math.sin(player.rotation) * moveSpeed;
            player.y -= Math.cos(player.rotation) * moveSpeed;
        }
        if (controlling.strafeLeft) {
            player.x += Math.sin(player.rotation + Math.PI / 2) * moveSpeed;
            player.y += Math.cos(player.rotation + Math.PI / 2) * moveSpeed;
        }
        if (controlling.strafeRight) {
            player.x -= Math.sin(player.rotation + Math.PI / 2) * moveSpeed;
            player.y -= Math.cos(player.rotation + Math.PI / 2) * moveSpeed;
        }

        background.lineStyle(4, 0xFFFFFF, 1);
        background.beginFill(0xFF700B, 1);
        background.drawRect(0, 0, 800, 600);

        console.log(boxB.angle)
        background.drawRect(boxA.position.x, boxA.position.y, 76, 76)
        background.drawRect(boxB.position.x, boxB.position.y, 76, 76)

        background.lineStyle(0);
        background.beginFill(0xFFFF0B, 1.0);
        background.drawCircle(player.x, player.y, 20);
        background.endFill();

        // when the mouse is moved, we determine the new visibility polygon 	
        var visibility = createLightPolygon(player.x, player.y);
        // then we draw it
        fovMask.clear();
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
