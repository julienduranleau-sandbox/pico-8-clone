export const stage = []

export function init() {
    const notes_bg = {
        render() {
            rectfill(0, 28, 128, 66, 0)
        }
    }

    const volumes_bg = {
        render() {
            print(':VOLUME', 2, 95, 12)
            rectfill(0, 101, 128, 17, 0)
        }
    }

    const notes = Array(32).fill(null).map((_, n) => {
        return {
            x: n * 4,   // _##_
            y: 29,
            w: 4,       // only 2 wide drawing
            h: 64,
            hover: false,
            pitch: 0,
            mouse_enter() {
                this.hover = true
            },
            mouse_leave() {
                this.hover = false
            },
            mouse_down() {
                this.pitch = this.y + this.h - my()
            },
            render() {
                if (this.pitch > 0) {
                    rectfill(this.x + 1, this.y + this.h - this.pitch, 2, this.pitch, 1)
                    rectfill(this.x + 1, this.y + this.h - this.pitch, 2, 2, 8)
                }
            }
        }
    })

    const volumes = Array(32).fill(null).map((_, n) => {
        return {
            x: n * 4,   // _##_
            y: 101,
            w: 4,       // only 2 wide drawing
            h: 15,
            hover: false,
            volume: 10,
            mouse_enter() {
                this.hover = true
            },
            mouse_leave() {
                this.hover = false
            },
            mouse_down() {
                this.volume = this.y + this.h - my()
            },
            render() {
                if (this.volume > 0) {
                    rectfill(this.x, this.y + this.h - this.volume, 3, 2, 14)
                }
            }
        }
    })

    stage.push(notes_bg)
    stage.push(volumes_bg)
    for (const note of notes) stage.push(note)
    for (const volume of volumes) stage.push(volume)
}