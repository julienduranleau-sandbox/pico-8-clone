import pico8 from "./pico8.js"

pico8.boot(_init, _update, _draw)
pico8.scale(6)

function _init() {

}

function _update() {

}

function _draw() {
    cls(1)
    for (let y = 0; y < 200; y += 13) {
        for (let x = 0; x < 200; x += 13) {
            const size = 1 + ((Math.sin((time() + x + y) / 500) + 1) / 2) * 4
            circfill(x, y, size, 13)
        }
    }
}