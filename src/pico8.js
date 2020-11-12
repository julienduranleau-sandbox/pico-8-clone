import * as api from "./api.js"

// https://www.lexaloffle.com/pico-8.php?page=manual

// https://pico-8.fandom.com/wiki/Palette

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
0x5f40 	0x5f7f 	Hardware state
0x5f80 	0x5fff 	GPIO pins(128 bytes)
0x6000 	0x7fff 	Screen data(8k) 
*/
const memory = new Array(0x8000).fill(0)

function boot() {
    define_globals()
}

function define_globals() {

}

export default {
    memory,
    boot,
}