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
            rectfill(this.x, this.y, this.w, this.h, this.color)
        }
    }

    const spritesheet = {
        x: 0,
        y: 88,
        w: 128,
        h: 32,
        render() {
            rectfill(this.x, this.y, this.w, this.h, 0)
        }
    }

    const color_picker = {
        x: 80,
        y: 10,
        w: 9 * 4 + 2,
        h: 9 * 4 + 2,
        render() {
            rect(this.x, this.y, this.w, this.h, 0)
            for (let i = 0; i <= 15; i++) {
                let x = this.x + 1 + (i % 4) * 9
                let y = this.y + 1 + Math.floor(i / 4) * 9
                rectfill(x, y, 9, 9, i)
            }
        }
    }

    const sprite = {
        x: 10,
        y: 10,
        w: 64,
        h: 64,
        render() {
            rectfill(this.x, this.y, this.w, this.h, 0)
        }
    }

    const sprite_flags = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => {
        return {
            x: color_picker.x + n * 6,
            y: 70,
            w: 5,
            h: 5,
            active: false,
            hover: false,
            mouse_enter() {
                this.hover = true
            },
            mouse_leave() {
                this.hover = false
            },
            click() {
                this.active = !this.active
            },
            render() {
                // borders
                color(this.hover ? 1 : 0)
                line(this.x + 1, this.y, this.x + 3, this.y)
                line(this.x + 1, this.y + 4, this.x + 3, this.y + 4)
                line(this.x, this.y + 1, this.x, this.y + 3)
                line(this.x + 4, this.y + 1, this.x + 4, this.y + 3)

                // bg
                let bg_color = (this.active)
                    ? 8
                    : 1
                rectfill(this.x + 1, this.y + 1, 3, 3, bg_color)

                // highlight
                pset(this.x + 3, this.y + 1, 13)
            }
        }
    })

    sprite_flags[1].active = true
    console.log(sprite_flags[0].active)

    const drawing_tools = {}
    const spritesheet_tabs = {}
    const sprite_index = {}

    stage.push(bt_sprite_editor)
    stage.push(spritesheet)
    stage.push(sprite)
    stage.push(color_picker)

    for (let flag of sprite_flags) {
        stage.push(flag)
    }
}

export function loop() {
    cls()

    camera()

    // Header, Content and Footer backgrounds
    rectfill(0, 0, 128, 8, 8)
    rectfill(0, 8, 128, 119, 5)
    rectfill(0, 128 - 8, 128, 8, 8)

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