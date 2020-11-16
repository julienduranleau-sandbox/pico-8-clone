import * as audio from './audio.js'

export const stage = []

let sfx_index = 0
/*
Each sound effect is 68 bytes 
    - 2 bytes for each of 32 notes 
    - 1 byte for the editor mode
    - 1 byte for the speed
    - 2 bytes for the loop range (start, end)

Note byte layout:
    Second byte / Hi 8 bits   First byte / Lo 8 bits
    c e	e e v v v w           w w p p p p p p

    c: when c is 1, waveform is a custom instrument corresponding to sfx 0-7; otherwise it is one of the eight built-in waveforms (PICO-8 0.1.11+)
    eee: effect (0-7)
    vvv: volume (0-7)
    www: waveform (0-7)
    pppppp: pitch (0-63) 
*/
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
            y: 30,
            w: 4,       // only 2 wide drawing
            h: 64,
            mouse_down() {
                const mem_addr = vm.addr.sfx + sfx_index * 68 + n * 2
                const pitch = this.y + this.h - my() - 1
                poke(mem_addr, (peek(mem_addr) & 0b11000000) ^ pitch)
            },
            render() {
                const mem_addr = vm.addr.sfx + sfx_index * 68 + n * 2
                const pitch = peek(mem_addr) & 0b00111111
                const volume = (peek(mem_addr + 1) & 0b00001110) >> 1

                if (pitch > 0 && volume > 0) {
                    rectfill(this.x + 1, this.y + this.h - pitch, 2, pitch, 1)
                    rectfill(this.x + 1, this.y + this.h - pitch, 2, 2, 8)
                }
            }
        }
    })

    const volumes = Array(32).fill(null).map((_, n) => {
        return {
            x: n * 4,   // _##_
            y: 101,
            w: 4,       // only 2 wide drawing
            h: 18,
            mouse_down() {
                const mem_addr = vm.addr.sfx + sfx_index * 68 + n * 2
                const volume = Math.max(0, Math.round((this.y + 14 - my()) / 2))
                poke(mem_addr + 1, (peek(mem_addr + 1) & 0b11110001) ^ (volume << 1))
            },
            render() {
                const mem_addr = vm.addr.sfx + sfx_index * 68 + n * 2
                const volume = (peek(mem_addr + 1) & 0b00001110) >> 1
                if (volume > 0) {
                    rectfill(this.x, this.y + this.h - (volume * 2) - 3, 3, 2, 14)
                }
            }
        }
    })

    const prev_sfx = {
        x: 5,
        y: 12,
        w: 3,
        h: 5,
        click() {
            sfx_index = (sfx_index === 0)
                ? 63
                : sfx_index - 1
        },
        render() {
            color(14)
            pset(this.x, this.y + 2)
            line(this.x + 1, this.y + 1, this.x + 1, this.y + this.h - 2)
            line(this.x + 2, this.y, this.x + 2, this.y + this.h - 1)
        }
    }

    const next_sfx = {
        x: 21,
        y: 12,
        w: 3,
        h: 5,
        click() {
            sfx_index = (sfx_index === 63)
                ? 0
                : sfx_index + 1
        },
        render() {
            color(14)
            pset(this.x + 2, this.y + 2)
            line(this.x + 1, this.y + 1, this.x + 1, this.y + this.h - 2)
            line(this.x, this.y, this.x, this.y + this.h - 1)
        }
    }

    const current_sfx_label = {
        render() {
            print(`${sfx_index}`.padStart(2, '0'), 11, 12, 7)
        }
    }

    const pitch_label = {
        render() {
            print(`:PITCH`, 3, 21, 13)
        }
    }

    const speed_label = {
        render() {
            print(`SPD`, 43, 12, 6)
        }
    }

    const loop_label = {
        render() {
            print(`LOOP`, 83, 12, 6)
        }
    }

    const speed = {
        x: 56,
        y: 11,
        w: 12,
        h: 7,
        render() {
            rectfill(this.x, this.y, this.w, this.h, 0)
            print("09", this.x + 1, this.y + 1, 6)
        }
    }

    const loop_start = {
        x: 100,
        y: 11,
        w: 12,
        h: 7,
        render() {
            rectfill(this.x, this.y, this.w, this.h, 0)
            print("09", this.x + 1, this.y + 1, 6)
        }
    }

    const loop_end = {
        x: 113,
        y: 11,
        w: 12,
        h: 7,
        render() {
            rectfill(this.x, this.y, this.w, this.h, 0)
            print("09", this.x + 1, this.y + 1, 6)
        }
    }

    const playback = {
        playing: false,
        render() {
            if (keyp(" ")) {
                audio.play(sfx_index)
            }
        }
    }

    stage.push(notes_bg)
    stage.push(volumes_bg)
    for (const note of notes) stage.push(note)
    for (const volume of volumes) stage.push(volume)
    stage.push(playback)
    stage.push(prev_sfx)
    stage.push(next_sfx)
    stage.push(current_sfx_label)
    stage.push(pitch_label)
    stage.push(speed_label)
    stage.push(loop_label)
    stage.push(speed)
    stage.push(loop_start)
    stage.push(loop_end)
}