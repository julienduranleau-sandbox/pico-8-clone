import pico8 from "./pico8.js"

pico8.boot(_init, _update, _draw, null)
pico8.scale(6)

function _init() {
    let x = 2
    for (let r = 2; r < 10; r++) {
        circ(x, 32, r)
        x += r * 2 + 4
    }

    x = 2
    for (let r = 2; r < 10; r++) {
        circfill(x, 92, r)
        x += r * 2 + 4
    }

}

function _update() {

}

function _draw() {
    cls()
    circfill(64, 64, Math.abs(((time() / 50) % 128) - 64), 3)
    // for (let i = 0; i < 1000; i++) {

    //     line(random(0, 128), random(0, 128), random(0, 128), random(0, 128))
    // }
}