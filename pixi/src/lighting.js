var ambientLights = [
    {
        x:0,
        y:0,
        width:800,
        height:640
    }
]

export function createLightingSprite(lightSources, width, height) {
    var canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    var ctx = canvas.getContext('2d')

    for (var i = 0; i < lightSources.length; i++) {
        var light = lightSources[i]

        ctx.drawImage(light.canvas,
                0, 0, light.canvas.width, light.canvas.height,
                light.pos.x - light.canvas.width / 2, light.pos.y - light.canvas.height / 2, light.canvas.width, light.canvas.height,
            );

    }

    for (var i = 0; i < ambientLights.length; i++) {
        var light = ambientLights[i]
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.fillRect(light.x, light.y, light.width, light.height)
    }

    return new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(canvas)))
}

export const updateFov = (fovMask, polygons, x, y) => {
    const visibility = createLightPolygon(polygons, x, y);
    fovMask.clear();
    fovMask.lineStyle(1, 0x333333, 1.0);
    fovMask.lineStyle(1, 0xFFFFFF, 1);
    fovMask.beginFill(0xFFFFFF, 1);
    fovMask.moveTo(visibility[0][0], visibility[0][1]);
    for (var i = 1; i <= visibility.length; i++) {
        fovMask.lineTo(visibility[i % visibility.length][0], visibility[i % visibility.length][1]);
    }
    fovMask.endFill();
}

// and this is how the library generates the visibility polygon starting
// from an array of polygons and a source point
export function createLightPolygon(polygons, x, y){
    //var polys = jQuery.extend(true, [], polygons);
    var segments = VisibilityPolygon.convertToSegments(polygons);
    //segments = VisibilityPolygon.breakIntersections(segments);
    var position = [x, y];
    //if (VisibilityPolygon.inPolygon(position, polygons[polygons.length-1])) {
        return VisibilityPolygon.compute(position, segments);
    //}      
    //return null;
}