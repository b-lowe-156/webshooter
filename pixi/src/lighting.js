export default function createLinearGradient(width, height, stops, mapFn) {
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