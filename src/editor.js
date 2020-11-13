const stage = []
const hover_list = []

export function init() {
    const bt_sprite_editor = {
        x: 1,
        y: 1,
        w: 6,
        h: 6,
        color: 2,
        click() {
            console.log("hit")
        },
        mouse_enter() {
            this.color = 3
        },
        mouse_leave() {
            this.color = 2
        },
        render() {
            rectfill(this.x, this.y, this.x + this.w, this.y + this.h, this.color)
        }
    }

    const spritesheet = {
        x: 0,
        y: 90,
        w: 128,
        h: 32,
        render() {
            rectfill(this.x, this.y, this.x + this.w, this.y + this.h, 0)
        }
    }

    const color_picker = {}
    const sprite = {}
    const sprite_flags = {}
    const drawing_tools = {}
    const spritesheet_tabs = {}
    const sprite_index = {}

    stage.push(bt_sprite_editor)
    stage.push(spritesheet)
}

export function loop() {
    cls()

    camera()

    // Header & Footer bg
    rectfill(0, 0, 128, 8, 8)
    rectfill(0, 120, 128, 128, 8)

    // Mouse events
    for (let s of stage) {
        // Mouse is above sprite
        if (mx() >= s.x && mx() < s.x + s.w && my() >= s.y && my() < s.y + s.h) {
            if ((s.mouse_enter || s.mouse_leave) && !hover_list.includes(s)) {
                hover_list.push(s)
                if (s.mouse_enter) {
                    s.mouse_enter()
                }
            }
            if (mousep() && s.click) {
                s.click()
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
    for (let s of stage) {
        s.render()
    }
}