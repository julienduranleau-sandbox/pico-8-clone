import * as sprite_editor from './sprite_editor.js'
import * as sound_editor from './sound_editor.js'

let last_save = Date.now()
let hover_list = null
let current_editor = null

export function init() {
    sprite_editor.init()
    sound_editor.init()

    change_editor(sound_editor)
}

export function loop() {
    cls()

    camera()

    // Header, Content and Footer backgrounds
    rectfill(0, 0, 128, 8, 8)
    rectfill(0, 8, 128, 119, 5)
    rectfill(0, 128 - 8, 128, 8, 8)

    // Mouse events
    for (let s of current_editor.stage) {
        // Mouse is above sprite
        if (mx() >= s.x && mx() < s.x + s.w && my() >= s.y && my() < s.y + s.h) {
            if ((s.mouse_enter || s.mouse_leave) && !hover_list.includes(s)) {
                hover_list.push(s)
                if (s.mouse_enter) {
                    s.mouse_enter()
                }
            }
            if (s.click && mousep()) {
                s.click()
            }
            if (s.mouse_down && mouse()) {
                s.mouse_down()
            }
        } else {
            const hover_list_index = hover_list.indexOf(s)

            if (hover_list_index > -1) {
                hover_list.splice(hover_list_index, 1)

                if (s.mouse_leave) {
                    s.mouse_leave()
                }
            }
        }
    }

    // Render stage elements
    for (let s of current_editor.stage) {
        s.render()
    }

    save_to_memory()
}

function change_editor(editor) {
    current_editor = editor
    hover_list = []
}

function save_to_memory() {
    if (Date.now() - last_save > 1000 * 2) {
        last_save = Date.now()
        localStorage.setItem('pico8-ram', vm.memory.toString());
    }
}