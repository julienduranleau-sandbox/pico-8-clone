// https://www.lexaloffle.com/pico-8.php?page=manual

import './libs/seedrandom.js'
import * as api from './api.js'
import * as renderer from './renderer.js'
import * as editor from './editor.js'

const canvas = document.createElement("canvas")

canvas.width = 128
canvas.height = 128

canvas.style.imageRendering = "-moz-crisp-edges"
canvas.style.imageRendering = "-webkit-crisp-edges"
canvas.style.imageRendering = "pixelated"
canvas.style.imageRendering = "crisp-edges"

let init_fn = null
let update_fn = null
let draw_fn = null

window.vm = {
    in_editor: true,
    screen_size: {
        width: canvas.width,
        height: canvas.height,
        scale: 1,
    },
    memory: null,     // defined in boot
    palette: null,    // defined in boot
    boot_time: null,  // defined in boot
    font: null,       // defined in boot
    mouse: {
        pressed: false,
        down: false,
        x: 0,
        y: 0,
    },
    keys: {
        down: {},
        pressed: {},
        mappings: {
            player1: {
                0: "ArrowLeft",
                1: "ArrowRight",
                2: "ArrowUp",
                3: "ArrowDown",
                4: "n",
                5: "m",
            },
            player2: {
                0: "s",
                1: "f",
                2: "e",
                3: "d",
                4: "Shift",
                5: "a",
            }
        }
    },
    game_loop,
}

export default {
    boot,
    scale,
}

function scale(n) {
    vm.screen_size.scale = n
    canvas.style.width = canvas.width * n + "px"
    canvas.style.height = canvas.height * n + "px"
}

async function boot(pinit_fn = null, pupdate_fn = null, pdraw_fn = null, container = null) {
    if (!container) {
        container = document.body
    }

    for (let key in api) {
        window[key] = api[key]
    }

    container.appendChild(canvas)

    init_fn = pinit_fn
    update_fn = pupdate_fn
    draw_fn = pdraw_fn

    vm.memory = init_memory()
    vm.palette = init_palette()
    vm.boot_time = Date.now()
    vm.font = await init_font()

    window.addEventListener("keydown", keydown_handler)
    window.addEventListener("keyup", keyup_handler)
    window.addEventListener("mousemove", mousemove_handler)
    window.addEventListener("mousedown", mousedown_handler)
    window.addEventListener("mouseup", mouseup_handler)

    renderer.init(canvas).then(() => {
        editor.init()
        game_loop()
        // if (init_fn !== null) {
        //     init_fn()
        // }

        // if (draw_fn) {
        //     game_loop()
        // }
    })
}

function game_loop() {
    editor.loop()

    // if (update_fn) update_fn()
    // if (draw_fn) draw_fn()

    renderer.render(vm.memory.raw.subarray(0x6000, 0x8000), vm.palette, peek(vm.memory.draw_mode))

    for (let key in vm.keys.pressed) {
        vm.keys.pressed[key] = false
    }

    vm.mouse.pressed = false

    requestAnimationFrame(game_loop)
}

function keydown_handler(e) {
    if (!vm.keys.down[e.key]) {
        vm.keys.down[e.key] = true
        vm.keys.pressed[e.key] = true
    }
}

function keyup_handler(e) {
    vm.keys.down[e.key] = false
    vm.keys.pressed[e.key] = false
}

function mousemove_handler(e) {
    const canvas_pos = canvas.getBoundingClientRect()
    vm.mouse.x = clamp(Math.floor((e.clientX - canvas_pos.left) / vm.screen_size.scale), -1, vm.screen_size.width)
    vm.mouse.y = clamp(Math.floor((e.clientY - canvas_pos.top) / vm.screen_size.scale), -1, vm.screen_size.height)
}

function mousedown_handler(e) {
    vm.mouse.pressed = true
    vm.mouse.down = true
}

function mouseup_handler(e) {
    vm.mouse.pressed = false
    vm.mouse.down = false
}

function init_font() {
    return new Promise(resolve => {
        const font_img = new Image()
        font_img.src = 'font.png'
        font_img.addEventListener('load', e => {
            let c = document.createElement('canvas')
            let ctx = c.getContext('2d')
            c.width = font_img.width
            c.height = font_img.height
            ctx.drawImage(font_img, 0, 0)
            const pixels = ctx.getImageData(0, 0, c.width, c.height).data

            const top_offset = 16
            const x_padding = 5
            const y_padding = 3
            const letter_width = 3
            const letter_height = 5
            const letter_lines = [
                ' !"#$%&\'()*+,-./',
                '0123456789:;<=>?',
                '@abcdefghijklmno',
                'pqrstuvwxyz[\\]^_',
                '`ABCDEFGHIJKLMNO',
                'PQRSTUVWXYZ{|}~'
            ].map(v => v.split(''))

            let letters = {}

            // For each lines in the image
            for (let line_i = 0; line_i < letter_lines.length; line_i++) {
                // For each characters of that line
                for (let char_i = 0; char_i < letter_lines[line_i].length; char_i++) {
                    let letter = letter_lines[line_i][char_i]
                    let x = char_i * (x_padding + letter_width)
                    let y = top_offset + line_i * (y_padding + letter_height)

                    // Read each pixel of the character in the image
                    // Create a 2d array of the pixels
                    let char_lines = []
                    for (let y_offset = 0; y_offset < letter_height; y_offset++) {
                        let char_line = []

                        for (let x_offset = 0; x_offset < letter_width; x_offset++) {
                            let px_offset = ((y + y_offset) * c.width + x + x_offset) * 4

                            if (pixels[px_offset] !== 0) {
                                char_line.push(1)
                            } else {
                                char_line.push(0)
                            }
                        }

                        char_lines.push(char_line)
                    }

                    letters[letter] = char_lines
                }
            }

            resolve(letters)
        })
    })
}

function init_memory() {
    /*
    0x0 	0x0fff 	Sprite sheet(0 - 127)
    0x1000 	0x1fff 	Sprite sheet(128 - 255) / Map(rows 32 - 63)(shared)
    0x2000 	0x2fff 	Map(rows 0 - 31)
    0x3000 	0x30ff 	Sprite flags
    0x3100 	0x31ff 	Music
    0x3200 	0x42ff 	Sound effects
    0x4300 	0x5dff 	General use(or work RAM)
    0x5e00 	0x5eff 	Persistent cart data(64 numbers = 256 bytes)
    0x5f00 	0x5f3f 	Draw state
        0x5f00-0x5f0f   Draw palette look-up table
    0x5f40 	0x5f7f 	Hardware state
    0x5f80 	0x5fff 	GPIO pins(128 bytes)
    0x6000 	0x7fff 	Screen data(8k) 
    */
    const raw = new Uint8Array(0x8000).fill(0)

    const memory = {
        raw: raw,
        clip_left: 0x5f20,
        clip_top: 0x5f21,
        clip_right: 0x5f22,
        clip_bottom: 0x5f23,
        color: 0x5f25,
        cursor_x: 0x5f26,
        cursor_y: 0x5f27,
        camera_x: 0x5f28, // and 0x5f29. 16 bit split in 2
        camera_y: 0x5f2a, // and 0x5f2b. 16 bit split in 2
        draw_mode: 0x5f2c,
    }

    raw[memory.color] = 0x6

    raw[memory.clip_right] = canvas.width
    raw[memory.clip_bottom] = canvas.height

    // for (let i = 0x6000; i < 0x8000; i++) {
    //     let low = Math.floor(Math.random() * 16)
    //     let high = Math.floor(Math.random() * 16)
    //     m[i] = (high << 4) ^ low
    // }

    return memory
}

function init_palette() {
    // https://pico-8.fandom.com/wiki/Palette

    return Float32Array.from([
        /* 0 */[0, 0, 0],           // black
        /* 1 */[29, 43, 83],        // dark-blue
        /* 2 */[126, 37, 83],       // dark-purple
        /* 3 */[0, 135, 81],        // dark-green
        /* 4 */[171, 82, 54],       // brown
        /* 5 */[95, 87, 79],        // dark-grey
        /* 6 */[194, 195, 199],     // light-grey
        /* 7 */[255, 241, 232],     // white
        /* 8 */[255, 0, 77],        // red
        /* 9 */[255, 163, 0],       // orange
        /* 10 */[255, 236, 39],     // yellow
        /* 11 */[0, 228, 54],       // green
        /* 12 */[41, 173, 255],     // blue
        /* 13 */[131, 118, 156],    // lavender
        /* 14 */[255, 119, 168],    // pink
        /* 15 */[255, 204, 170],    // light-peach 

        // /* 128 */[41, 24, 20], 	    // darkest-grey
        // /* 129 */[17, 29, 53], 	    // darker-blue
        // /* 130 */[66, 33, 54], 	    // darker-purple
        // /* 131 */[18, 83, 89], 	    // blue-green
        // /* 132 */[116, 47, 41], 	    // dark-brown
        // /* 133 */[73, 51, 59], 	    // darker-grey
        // /* 134 */[162, 136, 121], 	// medium-grey
        // /* 135 */[243, 239, 125], 	// light-yellow
        // /* 136 */[190, 18, 80], 	    // dark-red
        // /* 137 */[255, 108, 36], 	// dark-orange
        // /* 138 */[168, 231, 46], 	// light-green
        // /* 139 */[0, 181, 67], 	    // medium-green
        // /* 140 */[6, 90, 181], 	    // medium-blue
        // /* 141 */[117, 70, 101], 	// mauve
        // /* 142 */[255, 110, 89], 	// dark peach
        // /* 143 */[255, 157, 129], 	// peach 
    ].flat())
}