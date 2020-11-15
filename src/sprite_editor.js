export const stage = []

const sprite_editor = {
    color: 0,
    sprite: 0,
}

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
        mouse_down() {
            sprite_editor.sprite = Math.floor((mx() - this.x) / 8) + (Math.floor((my() - this.y) / 8) * 16)
        },
        render() {
            // Copy spritesheet memory (with offset) to screen memory (with offset)
            const spritesheet_addr = vm.addr.spritesheet // + page
            const screen_memory = 0x6000 + this.y * 64
            vm.memory.copyWithin(screen_memory, spritesheet_addr, this.h * 64)

            const border_x = this.x + (sprite_editor.sprite % 16) * 8 - 1
            const border_y = this.y + Math.floor(sprite_editor.sprite / 16) * 8 - 1
            rect(border_x, border_y, 10, 10, 6)
        }
    }

    const color_picker = {
        x: 80,
        y: 10,
        w: 9 * 4 + 2,
        h: 9 * 4 + 2,
        click() {
            sprite_editor.color = Math.floor((mx() - this.x - 1) / 9) + (Math.floor((my() - this.y - 1) / 9) * 4)
        },
        render() {
            rect(this.x, this.y, this.w, this.h, 0)

            for (let i = 0; i <= 15; i++) {
                let x = this.x + 1 + (i % 4) * 9
                let y = this.y + 1 + Math.floor(i / 4) * 9
                rectfill(x, y, 9, 9, i)
            }

            const border_x = this.x + (sprite_editor.color % 4) * 9
            const border_y = this.y + Math.floor(sprite_editor.color / 4) * 9
            rect(border_x, border_y, 11, 11, 6)
        }
    }

    const sprite = {
        x: 10,
        y: 10,
        w: 64,
        h: 64,
        mouse_down() {
            const editor_px = {
                x: Math.floor((mx() - this.x) / 8),
                y: Math.floor((my() - this.y) / 8),
            }

            const spritesheet_px = {
                x: (sprite_editor.sprite % 16) * 8 + editor_px.x,
                y: Math.floor(sprite_editor.sprite / 16) * 8 + editor_px.y,
            }

            sset(spritesheet_px.x, spritesheet_px.y, sprite_editor.color)
        },
        render() {
            rectfill(this.x, this.y, this.w, this.h, 0)

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const spritesheet_px = {
                        x: (sprite_editor.sprite % 16) * 8 + col,
                        y: Math.floor(sprite_editor.sprite / 16) * 8 + row,
                    }
                    const color = sget(spritesheet_px.x, spritesheet_px.y)
                    rectfill(this.x + col * 8, this.y + row * 8, 8, 8, color)
                }
            }
        }
    }

    const sprite_flags = Array(8).fill(null).map((_, n) => {
        return {
            x: color_picker.x + n * 6,
            y: 70,
            w: 5,
            h: 5,
            hover: false,
            mouse_enter() {
                this.hover = true
            },
            mouse_leave() {
                this.hover = false
            },
            click() {
                const active = fget(sprite_editor.sprite, n)
                fset(sprite_editor.sprite, n, !active)
            },
            render() {
                const active = fget(sprite_editor.sprite, n)

                // borders
                color(this.hover ? 8 : 0)
                line(this.x + 1, this.y, this.x + 3, this.y)
                line(this.x + 1, this.y + 4, this.x + 3, this.y + 4)
                line(this.x, this.y + 1, this.x, this.y + 3)
                line(this.x + 4, this.y + 1, this.x + 4, this.y + 3)

                // bg
                const bg_color = (active) ? (8 + n) : 1
                rectfill(this.x + 1, this.y + 1, 3, 3, bg_color)

                // highlight
                const highlight_color = (active) ? 7 : 6
                pset(this.x + 3, this.y + 1, highlight_color)
            }
        }
    })

    const sprite_index = {
        x: 80,
        y: 80,
        w: 13,
        h: 7,
        render() {
            rectfill(this.x, this.y, this.w, this.h, 6)
            const sprite_label = ("" + sprite_editor.sprite).padStart(3, "0")
            print(sprite_label, this.x + 1, this.y + 1, 13)
        }
    }

    const drawing_tools = {}
    const spritesheet_tabs = {}

    stage.push(bt_sprite_editor)
    stage.push(spritesheet)
    stage.push(sprite)
    stage.push(color_picker)
    stage.push(sprite_index)
    for (const flag of sprite_flags) stage.push(flag)
}