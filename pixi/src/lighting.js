var radialLights = [
    {
        x:200,
        y:200,
        radius:150
    },
    {
        x:500,
        y:400,
        radius:200
    }
];

var ambientLights = [
    {
        x:0,
        y:0,
        width:800,
        height:640
    }
]

export function createLightingSprite(width, height) {
    var canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    var ctx = canvas.getContext('2d')

    for (var i = 0; i < radialLights.length; i++) {
        var light = radialLights[i]
        var gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = gradient
        ctx.arc(light.x, light.y, light.radius, 0, 2 * Math.PI)
        ctx.fill()
    }

    for (var i = 0; i < ambientLights.length; i++) {
        var light = ambientLights[i]
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
        ctx.fillRect(light.x, light.y, light.width, light.height)
    }

    return new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(canvas)))
}

export function castShadow(lightingSprite) {
}

export function drawAmbientLight(lightingSprite) {
}
