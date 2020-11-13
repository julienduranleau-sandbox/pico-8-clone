import pico8 from "./pico8.js"

pico8.boot(_init, _update, _draw)
pico8.scale(6)

let x = 64
let y = 64

function _init() {

}

function _update() {

}

function _draw() {
    cls(1)

    circ(mx(), my(), 10)
}