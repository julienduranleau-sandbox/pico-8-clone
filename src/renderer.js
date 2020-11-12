let gl = null
let glCanvas = null
let shaderProgram = null
let plane = null

function create_plane() {
    const vertices = new Float32Array([
        -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, // top right triangle
        -1.0, 1.0, 1.0, -1.0, -1.0, -1.0 // bottom left triangle
    ])

    const vertexNumComponents = 2

    const vertexCount = vertices.length / vertexNumComponents

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    return {
        vertices,
        vertexNumComponents,
        vertexCount,
        vertexBuffer,
    }
}

function create_texture(pixels = null) {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    const level = 0
    const internalFormat = gl.LUMINANCE
    const width = glCanvas.width / 2 /* 2 pixels per uint */
    const height = glCanvas.height
    const border = 0
    const srcFormat = internalFormat
    const srcType = gl.UNSIGNED_BYTE

    if (pixels === null) {
        pixels = new Uint8Array(width * height).fill(0)
    }

    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixels)

    // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // Prevents t-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return texture
}

export async function init(canvas) {
    glCanvas = canvas

    gl = glCanvas.getContext('webgl2', {
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

    plane = create_plane()
}

async function buildShaderProgram(shaders) {
    const program = gl.createProgram()

    for (const shaderInfo of shaders) {
        let shader = await compileShaderFile(shaderInfo.file, shaderInfo.type)

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

async function compileShaderFile(file, type) {
    const code = await fetch(file).then(resp => resp.text()).then(data => data)
    const shader = gl.createShader(type)

    gl.shaderSource(shader, code)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(`Error compiling ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader:`)
        console.log(gl.getShaderInfoLog(shader))
    }

    return shader
}

export function render(pixels) {
    gl.viewport(0, 0, glCanvas.width, glCanvas.height)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(shaderProgram)

    const uScale = gl.getUniformLocation(shaderProgram, 'scale')
    gl.uniform2fv(uScale, [1.0, glCanvas.width / glCanvas.height])

    let texture = create_texture(pixels)
    const uTex = gl.getUniformLocation(shaderProgram, 'tex')
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uTex, 0);

    const aPosition = gl.getAttribLocation(shaderProgram, 'position')
    gl.bindBuffer(gl.ARRAY_BUFFER, plane.vertexBuffer)
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, plane.vertexNumComponents, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, plane.vertexCount)
}