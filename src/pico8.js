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

const VM_STATE = {
    POWERED_OFF: 0,
    BOOTING: 1,
    BOOTED: 2,
    IN_EDITOR: 3,
    IN_GAME: 4,
}

let loaded_cart = null

const rgb_colors = new Array(150).fill([0, 0, 0])
// Original colors
rgb_colors[0] = [0, 0, 0]           // black
rgb_colors[1] = [29, 43, 83]        // dark-blue
rgb_colors[2] = [126, 37, 83]       // dark-purple
rgb_colors[3] = [0, 135, 81]        // dark-green
rgb_colors[4] = [171, 82, 54]       // brown
rgb_colors[5] = [95, 87, 79]        // dark-grey
rgb_colors[6] = [194, 195, 199]     // light-grey
rgb_colors[7] = [255, 241, 232]     // white
rgb_colors[8] = [255, 0, 77]        // red
rgb_colors[9] = [255, 163, 0]       // orange
rgb_colors[10] = [255, 236, 39]     // yellow
rgb_colors[11] = [0, 228, 54]       // green
rgb_colors[12] = [41, 173, 255]     // blue
rgb_colors[13] = [131, 118, 156]    // lavender
rgb_colors[14] = [255, 119, 168]    // pink
rgb_colors[15] = [255, 204, 170]    // light-peach 
// "Hidden" colors
rgb_colors[128] = [41, 24, 20] 	    // darkest-grey
rgb_colors[129] = [17, 29, 53] 	    // darker-blue
rgb_colors[130] = [66, 33, 54] 	    // darker-purple
rgb_colors[131] = [18, 83, 89] 	    // blue-green
rgb_colors[132] = [116, 47, 41] 	// dark-brown
rgb_colors[133] = [73, 51, 59] 	    // darker-grey
rgb_colors[134] = [162, 136, 121] 	// medium-grey
rgb_colors[135] = [243, 239, 125] 	// light-yellow
rgb_colors[136] = [190, 18, 80] 	// dark-red
rgb_colors[137] = [255, 108, 36] 	// dark-orange
rgb_colors[138] = [168, 231, 46] 	// light-green
rgb_colors[139] = [0, 181, 67] 	    // medium-green
rgb_colors[140] = [6, 90, 181] 	    // medium-blue
rgb_colors[141] = [117, 70, 101] 	// mauve
rgb_colors[142] = [255, 110, 89] 	// dark peach
rgb_colors[143] = [255, 157, 129] 	// peach 

window.vm = {
    state: VM_STATE.POWERED_OFF,
    screen_size: {
        width: canvas.width,
        height: canvas.height,
        scale: 1,
    },
    addr: {
        spritesheet: 0x0000, // up to 0x0fff for top 64 sprites, then 0x1fff for 64 bottom sprites
        sprite_flags: 0x3000, // up to 0x30ff
        palette: 0x5f00, // up to 0x5f0f
        screen_palette: 0x5f10, // up to 0x5f1f
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
        screen_palette_reset: 0x5f2e,
        fill_pattern: 0x5f31, // and 0x5f32,
        fill_pattern_transparent: 0x5f33,
    },
    memory: null,       // defined in boot
    boot_time: null,    // defined in boot
    font: null,         // defined in boot
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
}

export default window.pico8 = {
    boot,
    scale,
    load_cart,
}

function scale(n) {
    n = Math.floor(n)
    vm.screen_size.scale = n
    canvas.style.width = canvas.width * n + "px"
    canvas.style.height = canvas.height * n + "px"
}

async function boot(container_tag = null) {
    vm.state = VM_STATE.BOOTING
    if (!container_tag) {
        container_tag = document.body
    }

    for (let key in api) {
        window[key] = api[key]
    }

    container_tag.appendChild(canvas)

    vm.memory = init_memory()
    vm.boot_time = Date.now()
    vm.font = await init_font()

    window.addEventListener("keydown", keydown_handler)
    window.addEventListener("keyup", keyup_handler)
    window.addEventListener("mousemove", mousemove_handler)
    window.addEventListener("mousedown", mousedown_handler)
    window.addEventListener("mouseup", mouseup_handler)

    renderer.init(canvas).then(() => {
        if (vm.state === VM_STATE.BOOTING) {
            vm.state = VM_STATE.BOOTED
        }
        cls()
        editor.init()
        display_editor()
        game_loop()
    })
}

async function load_cart(folder) {
    const code_path = `../${folder}/main.js`

    loaded_cart = {
        code_path,
        code: await import(`${code_path}?${Date.now()}`)
    }

    if (loaded_cart.code._init) loaded_cart.code._init()

    vm.state = VM_STATE.IN_GAME
}

async function reload_cart() {
    vm.memory = init_memory()
    loaded_cart.code = await import(`${loaded_cart.code_path}?${Date.now()}`)
    if (loaded_cart.code._init) loaded_cart.code._init()
    vm.state = VM_STATE.IN_GAME
}

function display_editor() {
    // Reset palette
    if (peek(vm.addr.screen_palette_reset) !== 1) {
        for (let color = 0; color <= 0xF; color++) {
            vm.memory[vm.addr.screen_palette + color] = color
        }
    }

    // Reset fill pattern
    poke2(vm.addr.fill_pattern, 0)
    poke(vm.addr.fill_pattern_transparent, 0)

    vm.state = VM_STATE.IN_EDITOR
}

function game_loop() {
    if (vm.state === VM_STATE.IN_GAME) {
        if (loaded_cart.code._update) loaded_cart.code._update()
        if (loaded_cart.code._draw) loaded_cart.code._draw()
    } else if (vm.state === VM_STATE.IN_EDITOR) {
        editor.loop()
    }

    renderer.render(vm.memory.subarray(0x6000, 0x8000), get_gpu_palette(), peek(vm.addr.draw_mode))

    for (let key in vm.keys.pressed) {
        vm.keys.pressed[key] = false
    }

    vm.mouse.pressed = false

    requestAnimationFrame(game_loop)
}

async function keydown_handler(e) {
    if (!vm.keys.down[e.key]) {
        vm.keys.down[e.key] = true
        vm.keys.pressed[e.key] = true
    }

    if (keyp("R")) {
        reload_cart()
    }

    if (keyp("Escape")) {
        display_editor()
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
    const saved_memory = localStorage.getItem('pico8-ram')

    const memory = saved_memory
        ? Uint8Array.from(saved_memory.split(','))
        : new Uint8Array(0x8000).fill(0)

    memory[vm.addr.color] = 0x6

    memory[vm.addr.clip_right] = canvas.width
    memory[vm.addr.clip_bottom] = canvas.height

    for (let color = 0; color <= 0xF; color++) {
        memory[vm.addr.palette + color] = color
        memory[vm.addr.screen_palette + color] = color
    }
    memory[vm.addr.palette] ^= 0x10 // set black transparent

    return memory
}

function get_gpu_palette() {
    // https://pico-8.fandom.com/wiki/Palette
    return Float32Array.from(
        vm.memory.slice(
            vm.addr.screen_palette,
            vm.addr.screen_palette + 16
        ).reduce((arr, c) => {
            arr.push(...rgb_colors[c]);
            return arr
        }, [])
    )
}