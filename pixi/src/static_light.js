import { createLightPolygon } from './lighting'

var lightSources = new Array();


var lightLocations = [
    new LightLocation(new Vector(100, 150), 400),
    //new LightLocation(new Vector(200, 500), 250)
    ];

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
};


function LightSource(pos, radius) {
    this.pos = pos;
    this.radius = radius;
    this.canvas = document.createElement('canvas');
    this.canvas.width = radius * 2;
    this.canvas.height = radius * 2;
}

function LightLocation(pos, radius) {
    this.pos = pos;
    this.radius = radius;
}

export function initLightSources(polygons) {
    var spiralRadius = 50;
    var multiSampleOffsets = spiral(50, spiralRadius);
    for (var i = 0; i < lightLocations.length; i++) {
        var lightLocation = lightLocations[i];

        var lightSource = new LightSource(lightLocation.pos, lightLocation.radius + spiralRadius);

        var canvasTmp = document.createElement('canvas');
        canvasTmp.width = lightSource.canvas.width;
        canvasTmp.height = lightSource.canvas.height;

        var context = lightSource.canvas.getContext('2d');
        var contextTmp = canvasTmp.getContext('2d');

        context.save();
        context.globalAlpha = 1.5 / multiSampleOffsets.length;
        for (var j = 0; j < multiSampleOffsets.length; j++) {
            var pos = lightSource.pos.add(multiSampleOffsets[j]);

            contextTmp.save();
            contextTmp.clearRect(0, 0, canvasTmp.width, canvasTmp.height);
            contextTmp.translate(-lightSource.pos.x + lightSource.canvas.width / 2, -lightSource.pos.y + lightSource.canvas.height / 2);
            contextTmp.beginPath();
            var gradient = contextTmp.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, lightLocation.radius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            contextTmp.fillStyle = gradient;
            contextTmp.arc(pos.x, pos.y, lightLocation.radius, 0, 2 * Math.PI);
            contextTmp.fill();
            contextTmp.closePath();
            contextTmp.restore();

            var occlusionCanvas = document.createElement('canvas');
            occlusionCanvas.width = lightSource.canvas.width;
            occlusionCanvas.height = lightSource.canvas.height;
            var occlusionCtx = occlusionCanvas.getContext("2d");
            occlusionCtx.save();
            occlusionCtx.translate(-lightSource.pos.x + lightSource.canvas.width / 2, -lightSource.pos.y + lightSource.canvas.height / 2);
            drawPolygon(occlusionCtx, createLightPolygon(polygons, pos.x, pos.y))
            occlusionCtx.restore();

            contextTmp.save();
            /* why destination-in instead of destination-out? */
            contextTmp.globalCompositeOperation = 'destination-in';
            contextTmp.drawImage(occlusionCanvas, 0, 0, occlusionCanvas.width, occlusionCanvas.height);
            contextTmp.restore();

            context.drawImage(canvasTmp, 0, 0, canvasTmp.width, canvasTmp.height);
        }
        context.restore();

        lightSources[lightSources.length] = lightSource;
    }

    return lightSources
}

function spiral(samples, radius) {
    var res = new Array();
    var GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    for (var s = 0; s < samples; s++) {
        var a = s * GOLDEN_ANGLE;
        var r = Math.sqrt(s / samples) * radius;
        var delta = new Vector(Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r));
        res.push(delta);
    }
    return res;
};

function drawPolygon(context, visibility) {
    context.beginPath();

    context.moveTo(visibility[0][0],visibility[0][1]);	
    for(var i=1;i<=visibility.length;i++){
        context.lineTo(visibility[i%visibility.length][0],visibility[i%visibility.length][1]);		
    }

    context.fill();
};


export function draw(canvasLight, canvasLightBuffer, canvasShadow, viewport) {
    var context = canvasLight.getContext("2d");
    var ctxBuffer = canvasLightBuffer.getContext("2d");

    for (var i = 0; i < lightSources.length; i++) {
        var lightsrc = lightSources[i];
        var pos = lightsrc.pos;

        var lightAreaRaw = new Area(
                pos.x - lightsrc.canvas.width / 2,
                pos.y - lightsrc.canvas.height / 2,
                lightsrc.canvas.width,
                lightsrc.canvas.height);
        var lightArea = lightAreaRaw.clampTo(viewport);

        if (lightArea.width === 0 || lightArea.height === 0) {
            continue;
        }

        var dx = lightArea.x - lightAreaRaw.x;
        var dy = lightArea.y - lightAreaRaw.y;

        ctxBuffer.save();
        ctxBuffer.clearRect(dx, dy, lightArea.width, lightArea.height);
        ctxBuffer.fillStyle = 'black';

        // Optimally we would also like to minimize the number of entities for which shadows are drawn,
        // but the shadow locations are kind of hard to predict
        var lowEntities = EntityContainer.findEntitiesInCircle(pos, lightsrc.radius + 20).filter(function(e) {
            return e.bodyState !== "UPRIGHT";
        });
        FovService.drawEntityShadows(ctxBuffer, lowEntities, pos, canvasShadow, lightsrc.canvas.width, lightsrc.canvas.height);

        if (Canvas.lightPolys) {
            ctxBuffer.save();
            ctxBuffer.translate(-lightAreaRaw.x, -lightAreaRaw.y);
            ctxBuffer.globalCompositeOperation = 'destination-out';
            FovService.drawPolygons(ctxBuffer, Canvas.lightPolys);
            ctxBuffer.restore();
        }

        var highEntities = EntityContainer.findEntitiesInCircle(pos, lightsrc.radius + 20).filter(function(e) {
            return e.bodyState === "UPRIGHT";
        });
        FovService.drawEntityShadows(ctxBuffer, highEntities, pos, canvasShadow, lightsrc.canvas.width, lightsrc.canvas.height);



        ctxBuffer.globalCompositeOperation = 'destination-out';

        ctxBuffer.drawImage(Canvas.occlusion,
                lightArea.x - viewport.x, lightArea.y - viewport.y, lightArea.width, lightArea.height,
                dx, dy, lightArea.width, lightArea.height);
        ctxBuffer.restore();

        ctxBuffer.save();
        ctxBuffer.globalCompositeOperation = 'source-out';
        ctxBuffer.drawImage(lightsrc.canvas,
                dx, dy, lightArea.width, lightArea.height,
                dx, dy, lightArea.width, lightArea.height);
        ctxBuffer.restore();

        ctxBuffer.save();
        ctxBuffer.globalAlpha = 0.9;
        ctxBuffer.globalCompositeOperation = 'source-over';
        ctxBuffer.drawImage(lightsrc.canvas,
                dx, dy, lightArea.width, lightArea.height,
                dx, dy, lightArea.width, lightArea.height);
        ctxBuffer.restore();

        context.drawImage(ctxBuffer.canvas,
                dx, dy, lightArea.width, lightArea.height,
                lightArea.x - viewport.x, lightArea.y - viewport.y, lightArea.width, lightArea.height);
    }
}
