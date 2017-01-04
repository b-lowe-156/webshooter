export function createLinearGradient(width, height, stops, mapFn) {
    mapFn = typeof mapFn == 'function' ? mapFn : function(canvas) {return canvas}

    var canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    var ctx = canvas.getContext('2d')
    var gradient = ctx.createLinearGradient(0, 0, width, 0)
    var stopPoints = Object.keys(stops)

    for (var i=0, n=stopPoints.length; i<n; i+=1)
        gradient.addColorStop(parseFloat(stopPoints[i]), stops[stopPoints[i]])

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    return mapFn(canvas)
}

export function createRadialGradient(width, height, stops, mapFn) {
    mapFn = typeof mapFn == 'function' ? mapFn : function(canvas) { return canvas }

    var canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    var ctx = canvas.getContext('2d')

    var centerX = width/2
    var centerY = height/2
    var radius = 700
    var gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient
    ctx.fillStyle = gradient;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    return mapFn(canvas)
}
