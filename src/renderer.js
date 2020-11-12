let gl = null
let glCanvas = null
let shaderProgram = null

// Aspect ratio and coordinate system
// details

let aspectRatio
let currentRotation = [0, 1]
let currentScale = [1.0, 1.0]

// Vertex information

let vertexArray
let vertexBuffer
let vertexNumComponents
let vertexCount

// Rendering data shared with the
// scalers.

let uScalingFactor
let uGlobalColor
let uRotationVector
let aVertexPosition

// Animation timing

let previousTime = 0.0
let degreesPerSecond = 90.0

export async function init(canvas) {
    glCanvas = canvas
    gl = glCanvas.getContext('webgl', {
        antialias: false,
        depth: false,
        alpha: false,
    })

    const shaders = [
        {
            type: gl.VERTEX_SHADER,
            file: 'shader.vert'
        },
        {
            type: gl.FRAGMENT_SHADER,
            file: 'shader.frag'
        }
    ]

    shaderProgram = await buildShaderProgram(shaders)

    aspectRatio = glCanvas.width / glCanvas.height
    currentScale = [1.0, aspectRatio]

    vertexArray = new Float32Array([
        -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, // top right triangle
        -1.0, 1.0, 1.0, -1.0, -1.0, -1.0 // bottom left triangle
    ])

    vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW)

    vertexNumComponents = 2
    vertexCount = vertexArray.length / vertexNumComponents
}

async function buildShaderProgram(shaders) {
    let filePromises = []
    let program = gl.createProgram()

    for (let shaderInfo of shaders) {
        let shader = await compileShader(shaderInfo.file, shaderInfo.type)

        if (shader) {
            gl.attachShader(program, shader)
        }
    }

    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log('Error linking shader program:')
        console.log(gl.getProgramInfoLog(program))
    }

    return program
}

async function compileShader(file, type) {
    let code = await fetch(file).then(resp => resp.text()).then(data => data)
    let shader = gl.createShader(type)

    gl.shaderSource(shader, code)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(`Error compiling ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader:`)
        console.log(gl.getShaderInfoLog(shader))
    }
    return shader
}

export function render() {
    gl.viewport(0, 0, glCanvas.width, glCanvas.height)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(shaderProgram)

    uScalingFactor = gl.getUniformLocation(shaderProgram, 'uScalingFactor')
    uGlobalColor = gl.getUniformLocation(shaderProgram, 'uGlobalColor')

    gl.uniform2fv(uScalingFactor, currentScale)
    gl.uniform4fv(uGlobalColor, [0.5, 0.7, 0.2, 1.0])

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    gl.enableVertexAttribArray(aVertexPosition)
    gl.vertexAttribPointer(aVertexPosition, vertexNumComponents, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
}