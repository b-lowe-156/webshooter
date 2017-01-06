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

// and this is how the library generates the visibility polygon starting
// from an array of polygons and a source point
export function createLightPolygon(polygons, x, y){
    var segments = VisibilityPolygon.convertToSegments(polygons);
    segments = VisibilityPolygon.breakIntersections(segments);
    var position = [x, y];
    if (VisibilityPolygon.inPolygon(position, polygons[polygons.length-1])) {
        return VisibilityPolygon.compute(position, segments);
    }      
    return null;
}