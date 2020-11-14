/* ============================================================= */
/* ========================    EXTRA   ========================= */

/**
 * @new
 */
export function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max)
}

/**
 * @new
 */
export function hex(n) {
    return n.toString(16)
}

/**
 * @new
 */
export function rnd_seed(seed) {
    Math.seedrandom(seed)
}

/**
 * @new
 */
export function rnd(a, b) {
    return (b === undefined)
        ? Math.random() * a
        : a + Math.random() * (b - a)
}

/**
 * @new
 */
export function rndi(a, b) {
    return (b === undefined)
        ? Math.floor(Math.random() * a)
        : Math.floor(a + Math.random() * (b - a))
}

/**
 * @new
 */
export function rnd_array(a) {
    return a[rndi(0, Math.floor(Math.random() * a.length))]
}

/* ============================================================= */
/* ========================    SYSTEM   ======================== */

/**
 * Returns the amount of time since PICO-8 was last started, as a fractional number of seconds.
 * 
 * @param {number}
 * 
 * @ref https://pico-8.fandom.com/wiki/Time
 */
export function time() {
    return Date.now() - vm.boot_time
}

export const t = time

/* ============================================================= */
/* ========================    MEMORY   ======================== */

/**
 * Store a region of memory in the cartridge file, or another cartridge file.
 * 
 * @param {number} dest_addr The address of the first byte of the destination.
 * @param {number} source_addr The address of the first byte in memory to copy.
 * @param {number} len The length of the memory region to copy, as a number of bytes.
 * 
 * @ref https://pico-8.fandom.com/wiki/Cstore
 */
export function cstore(dest_addr, source_addr, len) {
    throw new Error("Not implemented")
}

/**
 * Copies a region of memory to another location in memory.
 * 
 * @param {number} dest_addr The address of the first byte of the destination.
 * @param {number} source_addr The address of the first byte of the memory to copy.
 * @param {number} len The length of the memory region to copy, as a number of bytes.
 * 
 * @ref https://pico-8.fandom.com/wiki/Memcpy
 */
export function memcpy(dest_addr, source_addr, len) {
    let dest = vm.memory.raw.subarray(dest_addr, dest_addr + len)
    let src = vm.memory.raw.subarray(source_addr, source_addr + len)

    for (let i = 0; i < len; i++) {
        dest[i] = src[i]
    }
}

/**
 * Writes a byte value to every address in a region of memory.
 * 
 * @param {number} dest_addr The address of the first memory location to write.
 * @param {number} val The byte value to write.
 * @param {number} len The length of the region of memory to write, as a number of bytes.
 * 
 * @ref https://pico-8.fandom.com/wiki/Memset
 */
export function memset(dest_addr, val, len) {
    vm.memory.raw.subarray(dest_addr, dest_addr + len).fill(val)
}

/**
 * Reads a byte from a memory location.
 * 
 * @param {number} addr The address of the memory location.
 * 
 * @ref https://pico-8.fandom.com/wiki/Peek
 */
export function peek(addr) {
    return vm.memory.raw[addr]
}

/**
 * Reads a 16 bit value from a memory location.
 * The value is interpreted in the Little Endian representation
 * 
 * @param {number} addr The address of the memory location.
 * 
 * @ref https://pico-8.fandom.com/wiki/Peek2
 */
export function peek2(addr) {
    return (vm.memory.raw[addr + 1] << 8) ^ vm.memory.raw[addr]
}

/**
 * Reads a 32 bit value from a memory location.
 * The value is interpreted in the Little Endian representation
 * 
 * @param {number} addr The address of the memory location.
 * 
 * @ref https://pico-8.fandom.com/wiki/Peek4
 */
export function peek4(addr) {
    // `>>> 0` forces an unsigned 32 bit integer
    return ((vm.memory.raw[addr + 3] << 24) ^ (vm.memory.raw[addr + 2] << 16) ^ (vm.memory.raw[addr + 1]) << 8 ^ vm.memory.raw[addr]) >>> 0
}

/**
 * Writes a byte to a memory location.
 * 
 * @param {number} addr The address of the memory location.
 * @param {number} val The byte value.
 * 
 * @ref https://pico-8.fandom.com/wiki/Poke
 */
export function poke(addr, val) {
    vm.memory.raw[addr] = val
}

/**
 * Writes a 16-bit value to two consecutive memory locations.
 * The value is interpreted in the Little Endian representation
 * 
 * @param {number} addr The address of the memory location.
 * @param {number} val The 16-bit value.
 * 
 * @ref https://pico-8.fandom.com/wiki/Poke2
 */
export function poke2(addr, val) {
    vm.memory.raw[addr] = val & 0xFF
    vm.memory.raw[addr + 1] = (val >> 8) & 0xFF
}

/**
 * Writes a 32-bit value to two consecutive memory locations.
 * The value is interpreted in the Little Endian representation
 * 
 * @param {number} addr The address of the memory location.
 * @param {number} val The 32-bit value.
 * 
 * @ref https://pico-8.fandom.com/wiki/Poke4
 */
export function poke4(addr, val) {
    vm.memory.raw[addr] = val & 0xFF
    vm.memory.raw[addr + 1] = (val >> 8) & 0xFF
    vm.memory.raw[addr + 2] = (val >> 16) & 0xFF
    vm.memory.raw[addr + 3] = (val >> 24) & 0xFF
}

/**
 * Loads a region of data from the cartridge, or from another cartridge, into memory.
 * 
 * @param {number} dest_addr The address of the first byte of the destination in memory.
 * @param {number} source_addr The address of the first byte in the cartridge data. 
 * @param {number} len The length of the memory region to copy, as a number of bytes. 
 * 
 * @ref https://pico-8.fandom.com/wiki/Reload
 */
export function reload(dest_addr, source_addr, len) {
    throw new Error("Not implemented")
}

/* ============================================================= */
/* ========================    AUDIO   ========================= */

/**
 * Plays a music pattern, or stops playing.
 * 
 * @param {number} n The pattern number to start playing (0-63), or -1 to stop playing music.
 * @param {number} fade_len If not 0, fade in (or out) the music volume over a duration, given as a number of milliseconds.
 * @param {number} channel_mask A bitfield indicating which of the four sound channels should be reserved for music. The default is 0 (no channels reserved).
 * 
 * @ref https://pico-8.fandom.com/wiki/Music
 */
export function music(n, fade_len = 0, channel_mask = 0) {
    // TODO
}

/**
 * Plays a sound effect. 
 * 
 * @param {number} n The number of the sound effect to play (0-63), -1 to stop playing sound on the given channel, or -2 to release the sound of the given channel from looping.
 * @param {number} channel The channel to use for the sound effect (0-3). The default is -1, which chooses an available channel automatically. Can be -2 to stop playing the given sound effect on any channels it plays on.
 * @param {number} offset The note position in the sound effect to start playing (0-31). The default is 0 (the beginning).
 * @param {number} length The number of notes in the sound effect to play (0-31). The default is to play the entire sound effect.
 * 
 * @ref https://pico-8.fandom.com/wiki/Sfx
 */
export function sfx(n, channel = -1, offset = 0, length = null) {
    // TODO
}

/* ============================================================= */
/* ========================    INPUT   ========================= */
/**
 * Tests if a key is being pressed at this moment.
 * 
 * @param {string} key The key name.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 * @new
 */
export function key(key) {
    if (!vm.keys.down[key]) vm.keys.down[key] = false
    return vm.keys.down[key]
}

/**
 * Tests if a key has just been pressed, with keyboard-style repeating.
 * 
 * @param {string} key The key name.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 * @new
 */
export function keyp(key) {
    if (!vm.keys.pressed[key]) vm.keys.pressed[key] = false
    return vm.keys.pressed[key]
}

/**
 * Tests if a button is being pressed at this moment.
 * 
 * @param {number} n The button number.
 * @param {number} player The player number. 1 or 2
 * 
 * @ref https://pico-8.fandom.com/wiki/Btn
 */
export function btn(n, player = 1) {
    return key(vm.keys.mappings[`player${player}`][n])
}

/**
 * Tests if a button has just been pressed, with keyboard-style repeating.
 * 
 * @param {number} n The button number.
 * @param {number} player The player number. 1 or 2
 * 
 * @ref https://pico-8.fandom.com/wiki/Btnp
 */
export function btnp(n, player = 1) {
    return keyp(vm.keys.mappings[`player${player}`][n])
}

/**
 * Change a player btn for a new key.
 * 
 * @param {number} n The button number.
 * @param {string} key The key value.
 * @param {number} player The player number. 1 or 2
 * 
 * @ref https://pico-8.fandom.com/wiki/Btnp
 */
export function btn_map(n, key, player = 1) {
    vm.keys.mappings[`player${player}`][n] = key
}

/**
 * Tests if the mouse button has just been pressed.
 * 
 * @new
 */
export function mousep() {
    return vm.mouse.pressed
}

/**
 * Tests if the mouse button is being pressed at this moment.
 * 
 * @new
 */
export function mouse() {
    return vm.mouse.down
}

/**
 * Reads the x position of the mouse
 * 
 * @new
 */
export function mx() {
    return vm.mouse.x
}

/**
 * Reads the y position of the mouse
 * 
 * @new
 */
export function my() {
    return vm.mouse.y
}


/* ============================================================= */
/* ========================   GRAPHICS  ======================== */

/**
 * Copies the graphics buffer to the screen, then synchronizes to the next frame.
 * 
 * @ref https://pico-8.fandom.com/wiki/Flip
 */
export function flip() {
    // TODO
}

/**
 * Draws a portion of the map to the graphics buffer.
 * 
 * @param {number} cel_x The column location of the map cell in the upper left corner of the region to draw, where 0 is the leftmost column.
 * @param {number} cel_y The row location of the map cell in the upper left corner of the region to draw, where 0 is the topmost row.
 * @param {number} sx The x coordinate of the screen to place the upper left corner.
 * @param {number} sy The y coordinate of the screen to place the upper left corner.
 * @param {number} cel_w The number of map cells wide in the region to draw.
 * @param {number} cel_h The number of map cells tall in the region to draw.
 * @param {number} layer If specified, only draw sprites that have flags set for every bit in this value (a bitfield). The default is 0 (draw all sprites).
 * 
 * @ref https://pico-8.fandom.com/wiki/Map
 */
export function map(cel_x, cel_y, sx, sy, cel_w, cel_h, layer = 0) {
    // TODO
}
/**
 * Gets the sprite number assigned to a cell on the map.
 * 
 * @param {number} x The column (x) coordinate of the cell.
 * @param {number} y The row (y) coordinate of the cell.
 * 
 * @ref https://pico-8.fandom.com/wiki/Mget
 */
export function mget(x, y) {
    // TODO
}
/**
 * Sets a cell on the map to a new sprite number.
 * 
 * @param {number} x The column (x) coordinate of the cell.
 * @param {number} y The row (y) coordinate of the cell.
 * @param {number} sprite The new sprite number to store.
 * 
 * @ref https://pico-8.fandom.com/wiki/Mset
 */
export function mset(x, y, sprite) {
    // TODO
}


/**
 * Sets the camera offset in the draw state. 
 * 
 * @param {number} x The x offset, in pixels, to subtract from future draw coordinates.
 * @param {number} y The y offset, in pixels, to subtract from future draw coordinates.
 * 
 * @ref https://pico-8.fandom.com/wiki/Camera
 */
export function camera(x = 0, y = 0) {
    poke2(vm.memory.camera_x, x)
    poke2(vm.memory.camera_y, y)
}

/**
 * Draws a circle shape, without fill.
 * 
 * @param {number} xc The x coordinate of the center of the circle.
 * @param {number} yc The y coordinate of the center of the circle.
 * @param {number} r The radius of the circle, in pixels. If omitted, the radius will be 4. 
 * @param {number} color The color of the circle and fill. If omitted, the color from the draw state is used. 
 * 
 * @ref https://pico-8.fandom.com/wiki/Circ
 */
export function circ(xc, yc, r = 4, color = null) {
    r = r >> 0

    // Bresenham’s circle
    let x = 0
    let y = r
    let d = 3 - 2 * r

    pset(xc, yc + y, color)
    pset(xc, yc - y, color)
    pset(xc + y, yc, color)
    pset(xc - y, yc, color)

    while (y >= x) {
        x += 1

        if (d > 0) {
            y -= 1
            d = d + 4 * (x - y) + 10
        } else {
            d = d + 4 * x + 6
        }

        pset(xc + x, yc + y, color)
        pset(xc - x, yc + y, color)
        pset(xc + x, yc - y, color)
        pset(xc - x, yc - y, color)
        pset(xc + y, yc + x, color)
        pset(xc - y, yc + x, color)
        pset(xc + y, yc - x, color)
        pset(xc - y, yc - x, color)
    }
}

/**
 * Draws a filled-in circle shape. 
 * 
 * @param {number} xc The x coordinate of the center of the circle.
 * @param {number} yc The y coordinate of the center of the circle.
 * @param {number} r The radius of the circle, in pixels. If omitted, the radius will be 4. 
 * @param {number} color The color of the circle and fill. If omitted, the color from the draw state is used. 
 * 
 * @ref https://pico-8.fandom.com/wiki/Circfill
 */
export function circfill(xc, yc, r = 4, color = null) {
    r = r >> 0

    // Bresenham’s circle with a twist
    let x = 0
    let y = r
    let d = 3 - 2 * r

    line(xc, yc + y, xc, yc - y, color)
    line(xc + y, yc, xc - y, yc, color)

    while (y >= x) {
        x += 1

        if (d > 0) {
            y -= 1
            d = d + 4 * (x - y) + 10
        } else {
            d = d + 4 * x + 6
        }

        line(xc + x, yc + y, xc - x, yc + y, color)
        line(xc + x, yc - y, xc - x, yc - y, color)
        line(xc + y, yc + x, xc - y, yc + x, color)
        line(xc + y, yc - x, xc - y, yc - x, color)
    }
}

/**
 * Sets the clipping region in the draw state. 
 * When called without arguments, the function resets the clipping region to be the entire screen and returns the previous state as 4 return values x, y, w, h
 * 
 * @param {number} x The x coordinate of the upper left corner of the clipping rectangle. 
 * @param {number} y The y coordinate of the upper left corner of the clipping rectangle. 
 * @param {number} w The width of the clipping rectangle, in pixels. 
 * @param {number} h The height of the clipping rectangle, in pixels. 
 * 
 * @ref https://pico-8.fandom.com/wiki/Clip
 */
export function clip(x = 0, y = 0, w = null, h = null) {
    poke(vm.memory.clip_left, x)
    poke(vm.memory.clip_right, (w !== null) ? x + w : vm.screen_size.width)
    poke(vm.memory.clip_top, y)
    poke(vm.memory.clip_bottom, (h !== null) ? y + h : vm.screen_size.height)
}

/**
 * Clears the graphics buffer.
 * 
 * @param {number} color A color to use for the background.
 * 
 * @ref https://pico-8.fandom.com/wiki/Cls
 */
export function cls(color = 0) {
    cursor(0, 0)
    vm.memory.raw.subarray(0x6000, 0x8000).fill(color << 4 ^ color)
}

/**
 * Sets the draw color in the draw state.
 * 
 * @param {number} color The color number.
 * 
 * @ref https://pico-8.fandom.com/wiki/Color
 */
export function color(color = 6) {
    poke(vm.memory.color, color)
}

/**
 * Sets the left-margin cursor position for print().
 * 
 * @param {number} x The x coordinate of the upper left corner of the line.
 * @param {number} y The y coordinate of the upper left corner of the line.
 * @param {number} color The palette index to set the pen color to.
 * 
 * @ref https://pico-8.fandom.com/wiki/Cursor
 */
export function cursor(x = 0, y = 0, color = null) {
    poke(vm.memory.cursor_x, x)
    poke(vm.memory.cursor_y, y)
    if (color !== null) poke(vm.memory.color, color)
}

/**
 * Gets the value of a flag of a sprite.
 * 
 * @param {number} n The sprite number
 * @param {number} f The flag index (0-7). If omitted, a bit field of all flags is returned.
 * 
 * @ref https://pico-8.fandom.com/wiki/Fget
 */
export function fget(n, f = null) {
    // TODO
}

/**
 * Sets the fill pattern.
 * 
 * @param {number} pat A bitfield representing the fill pattern to use.
 * 
 * @ref https://pico-8.fandom.com/wiki/Fillp
 */
export function fillp(pat) {
    // TODO
}

/**
 * Sets the value of a flag of a sprite.
 * 
 * @param {number} n The sprite number.
 * @param {number} f The flag index (0-7). If omitted, a bit field of all flags is returned. 
 * @param {bool|number} v The value, either true or false if the flag index is specified, or the bit field of all flags if it is not. 
 * 
 * 
 * @ref https://pico-8.fandom.com/wiki/Fset
 */
export function fset(n, f = null, v = null) {
    // TODO
}

/**
 * Draws a line between two points.
 * 
 * @param {number} x0 The x coordinate of the start of the line. If omitted, the x coordinate of the end of the previous line is used, or 0 if no previous line has been drawn. 
 * @param {number} y0 The y coordinate of the start of the line. If omitted, the y coordinate of the end of the previous line is used, or 0 if no previous line has been drawn. 
 * @param {number} x1 The x coordinate of the end of the line. 
 * @param {number} y1 The y coordinate of the end of the line. 
 * @param {number} color The color of the line. If omitted, the color from the draw state is used. This also sets the color in the draw state. 
 * 
 * @ref https://pico-8.fandom.com/wiki/Line
 */
export function line(x0 = 0, y0 = 0, x1 = 0, y1 = 0, color) {
    // Bresenham’s Line Algorithm
    let dx = Math.abs(x1 - x0)
    let dy = Math.abs(y1 - y0)
    let x = x0
    let y = y0

    let sx = (x0 <= x1) ? 1 : -1
    let sy = (y0 <= y1) ? 1 : -1

    if (dx > dy) {
        let err = dx / 2.0
        while (x != x1) {
            pset(x, y, color)
            err -= dy
            if (err < 0) {
                y += sy
                err += dx
            }
            x += sx
        }
    } else {
        let err = dy / 2.0
        while (y != y1) {
            pset(x, y, color)
            err -= dx
            if (err < 0) {
                x += sx
                err += dy
            }
            y += sy
        }
    }

    pset(x1, y1, color)
}

/**
 * Changes the draw state so all instances of a given color are replaced with a new color. 
 * 
 * @param {number} c0 The number of the original color to replace.
 * @param {number} c1 The number of the new color to use instead. 
 * @param {number} p 0 to modify the palette used by draw operations, 1 to modify the palette for the screen already drawn
 * 
 * @ref https://pico-8.fandom.com/wiki/Pal
 */
export function pal(c0, c1, p = 0) {
    if (c0 === undefined || c1 === undefined) {
        for (let color = 0; color <= 0xF; color++) {
            vm.memory.raw[vm.memory.palette + color] = color
        }
        vm.memory.raw[vm.memory.palette] ^= 0x10
    } else {
        if (p === 0) {
            vm.memory.raw[vm.memory.palette + c0] = c1
        } else {
            vm.memory.raw[vm.memory.screen_palette + c0] = c1
        }
    }
}

/**
 * Change the transparency of a color in the draw state for subsequent draw calls.
 * When called with no parameters, resets the transparency of all colors to default
 * 
 * @param {number} color The number of the color to modify. 
 * @param {bool} transparent If true, treat this color as transparent. If false, treat this color as opaque. 
 * 
 * @ref https://pico-8.fandom.com/wiki/Palt
 */
export function palt(color, transparent = false) {
    if (color === undefined) {
        // Reset the transparency of all colors to default
        for (let i = 0; i <= 0xF; i++) {
            vm.memory.raw[vm.memory.palette + i] &= 0x0F
        }
        vm.memory.raw[vm.memory.palette] ^= 0x10 // set black transparent
    } else {
        // low is color
        // high is transparency
        if (transparent) {
            vm.memory.raw[vm.memory.palette + color] = 0x10 ^ (vm.memory.raw[vm.memory.palette + color] & 0x0F)
        } else {
            vm.memory.raw[vm.memory.palette + color] &= 0x0F
        }
    }
}

/**
 * Gets the color value of a pixel at the given coordinates. 
 * 
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 * 
 * @ref https://pico-8.fandom.com/wiki/Pget
 */
export function pget(x, y) {
    const addr = 0x6000 + Math.floor(x / 2) + y * 64
    return (x % 2 == 0)
        ? vm.memory.raw[addr] >> 4  // high
        : vm.memory.raw[addr] & 0xF  // low
}

/**
 * Prints a string of characters to the screen. 
 * 
 * @param {string} str The string of characters to print.
 * @param {number} x The x coordinate of the upper left corner to start printing. 
 * @param {number} y The y coordinate of the upper left corner to start printing.
 * @param {number} color The color to use for the text.
 * 
 * @ref https://pico-8.fandom.com/wiki/Print
 */
export function print(str, x = null, y = null, color = null) {
    if (x === null) x = peek(vm.memory.cursor_x)
    if (y === null) y = peek(vm.memory.cursor_y)

    const original_x = x
    const lines = str.split("\n")

    for (const line of lines) {
        for (const c of line.split('')) {
            const letter = vm.font[c]

            if (!letter) continue // ignore characters not in font

            for (let row = 0; row < letter.length; row++) {
                for (let col = 0; col < letter[row].length; col++) {
                    if (letter[row][col] === 1) {
                        pset(x + col, y + row, color)
                    }
                }
            }

            x += letter[0].length + 1
        }

        x = original_x
        y += 6

    }

    poke(vm.memory.cursor_y, y)
}

/**
 * Sets a pixel in the graphics buffer. 
 * 
 * @param {number} x The x coordinate
 * @param {number} y The x coordinate
 * @param {number} color The color value. If not specified, uses the current color of the draw state.
 * @param {bool} check_transparency If true, colors defined as transparent will not be drawn
 * 
 * @todo Optimize pixel batches to skip memory check (e.g. circlefill and rectfill calls)
 * 
 * @ref https://pico-8.fandom.com/wiki/Pset
 */
export function pset(x, y, color = null, check_transparency = false) {
    if (color === null) color = peek(vm.memory.color)
    else if (peek(vm.memory.color) != color) poke(vm.memory.color, color)

    const color_value = peek(vm.memory.palette + color)
    const remapped_color = color_value & 0x0F                   // low
    const is_transparent = ((color_value & 0xF0) >> 4) === 1    // high

    if (check_transparency && is_transparent) {
        return
    }

    const camera_x = peek2(vm.memory.camera_x)
    const camera_y = peek2(vm.memory.camera_y)
    const clip_left = peek(vm.memory.clip_left)
    const clip_right = peek(vm.memory.clip_right)
    const clip_top = peek(vm.memory.clip_top)
    const clip_bottom = peek(vm.memory.clip_bottom)

    x += camera_x
    y += camera_y

    if (
        x < 0 ||
        y < 0 ||
        x >= vm.screen_size.width ||
        y >= vm.screen_size.height ||
        x < clip_left ||
        x >= clip_right ||
        y < clip_top ||
        y >= clip_bottom
    ) {
        return
    }

    const addr = 0x6000 + Math.floor(x / 2) + y * 64
    const current = vm.memory.raw[addr]

    vm.memory.raw[addr] = (x % 2 == 0)
        ? (current & 0xF0) ^ remapped_color // low
        : (remapped_color << 4) ^ (current & 0xF)    // high
}

/**
 * Draws an empty rectangle shape.
 * 
 * @param {number} x The x coordinate of the upper left corner.
 * @param {number} y The y coordinate of the upper left corner.
 * @param {number} w The width of the rectangle.
 * @param {number} h The height of the rectangle.
 * @param {number} color The color of the rectangle border. If omitted, the color from the draw state is used.
 * 
 * @ref https://pico-8.fandom.com/wiki/Rect
 */
export function rect(x, y, w, h, color = null) {
    // Horizontal lines
    for (let col = x; col < x + w; col++) {
        pset(col, y, color)
        pset(col, y + h - 1, color)
    }
    // Vertical lines
    for (let row = y; row < y + h; row++) {
        pset(x, row, color)
        pset(x + w - 1, row, color)
    }
}

/**
 * Draws a filled-in rectangle shape.
 * 
 * @param {number} x0 The x coordinate of the upper left corner.
 * @param {number} y0 The y coordinate of the upper left corner.
 * @param {number} w The width of the rectangle.
 * @param {number} h The height of the rectangle.
 * @param {number} color The color of the rectangle border. If omitted, the color from the draw state is used.
 * 
 * @ref https://pico-8.fandom.com/wiki/Rectfill
 */
export function rectfill(x, y, w, h, color = null) {
    for (let row = y; row < y + h; row++) {
        for (let col = x; col < x + w; col++) {
            pset(col, row, color)
        }
    }
}

/**
 * Gets the color value of a pixel on the sprite sheet.
 * 
 * @param {number} x The x coordinate on the sprite sheet.
 * @param {number} y The y coordinate on the sprite sheet.
 * 
 * @ref https://pico-8.fandom.com/wiki/Sget
 */
export function sget(x, y) {
    const addr = vm.memory.spritesheet + Math.floor(x / 2) + y * 64

    return x % 2 == 0
        ? vm.memory.raw[addr] & 0x0F         // low
        : (vm.memory.raw[addr] & 0xF0) >> 4  // hi
}

/**
 * Draws a sprite, or a range of sprites, on the screen.
 * 
 * @param {number} n The sprite number. When drawing a range of sprites, this is the upper-left corner.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 * @param {number} w The width of the range, as a number of sprites. Non-integer values may be used to draw partial sprites.
 * @param {number} h The height of the range, as a number of sprites. Non-integer values may be used to draw partial sprites.
 * @param {bool} flip_x If true, the sprite is drawn inverted left to right.
 * @param {bool} flip_y If true, the sprite is drawn inverted top to bottom.
 * 
 * @ref https://pico-8.fandom.com/wiki/Spr
 */
export function spr(n, x, y, w = 1, h = 1, flip_x = false, flip_y = false) {
    const draw_width = (8 * w) >> 0
    const draw_height = (8 * h) >> 0

    const sprite_offset = {
        x: (n % 16) * 8,
        y: Math.floor(n / 16) * 8,
    }

    for (let row = 0; row < draw_height; row++) {
        for (let col = 0; col < draw_width; col++) {
            let screen_x = x + col
            let screen_y = y + row
            if (flip_x) screen_x = x + (draw_width - col - 1)
            if (flip_y) screen_y = y + (draw_height - row - 1)
            pset(screen_x, screen_y, sget(sprite_offset.x + col, sprite_offset.y + row), true)
        }
    }
}

/**
 * Sets the color value of a pixel on the sprite sheet.
 * 
 * @param {number} x The x coordinate on the sprite sheet.
 * @param {number} y The y coordinate on the sprite sheet.
 * @param {number} color The color value to set. If unspecified, the color of the current draw state will be used.
 * 
 * @ref https://pico-8.fandom.com/wiki/Sset
 */
export function sset(x, y, color = null) {
    const addr = vm.memory.spritesheet + Math.floor(x / 2) + y * 64

    if (x % 2 == 0) {
        // left = low
        vm.memory.raw[addr] = (vm.memory.raw[addr] & 0xF0) ^ color
    } else {
        // right = hi
        vm.memory.raw[addr] = (vm.memory.raw[addr] & 0x0F) ^ (color << 4)
    }
}

/**
 * Draws a rectangle of pixels from the sprite sheet, optionally stretching the image to fit a rectangle on the screen.
 * 
 * @param {number} sx The x coordinate of the upper left corner of the rectangle in the sprite sheet.
 * @param {number} sy The y coordinate of the upper left corner of the rectangle in the sprite sheet.
 * @param {number} sw The width of the rectangle in the sprite sheet, as a number of pixels.
 * @param {number} sh The height of the rectangle in the sprite sheet, as a number of pixels.
 * @param {number} dx The x coordinate of the upper left corner of the rectangle area of the screen.
 * @param {number} dy The y coordinate of the upper left corner of the rectangle area of the screen.
 * @param {number} dw The width of the rectangle area of the screen. The default is to match the image width (sw).
 * @param {number} dh The height of the rectangle area of the screen. The default is to match the image width (sh).
 * @param {bool} flip_x If true, the sprite is drawn inverted left to right.
 * @param {bool} flip_y If true, the sprite is drawn inverted top to bottom.
 * 
 * @ref https://pico-8.fandom.com/wiki/Sspr
 */
export function sspr(sx, sy, sw, sh, dx, dy, dw = null, dh = null, flip_x = false, flip_y = false) {
    if (dw === null) dw = sw
    if (dh === null) dh = sh

    for (let row = 0; row < dh; row++) {
        for (let col = 0; col < dw; col++) {
            let screen_x = dx + col
            let screen_y = dy + row
            if (flip_x) screen_x = dx + (dw - col - 1)
            if (flip_y) screen_y = dy + (dh - row - 1)

            const spritesheet_x = sx + Math.floor(sw / dw * col)
            const spritesheet_y = sy + Math.floor(sh / dh * row)

            pset(screen_x, screen_y, sget(spritesheet_x, spritesheet_y), true)
        }
    }
}

/**
 * Draws a textured line between two points, sampling the map for texture data.
 * 
 * @param {number} x0 The x coordinate of the start of the line.
 * @param {number} y0 The y coordinate of the start of the line.
 * @param {number} x1 The x coordinate of the end of the line.
 * @param {number} y1 The y coordinate of the end of the line.
 * @param {number} mx The x coordinate to begin sampling the map, expressed in (fractional) map tiles.
 * @param {number} my The y coordinate to begin sampling the map, expressed in (fractional) map tiles.
 * @param {number} mdx The amount to add to mx after each pixel is drawn, expressed in (fractional) map tiles. Default is 1/8 (move right one map pixel). 
 * @param {number} mdy The amount to add to mx after each pixel is drawn, expressed in (fractional) map tiles. Default is 0 (a horizontal line). 
 * 
 * @ref https://pico-8.fandom.com/wiki/Tline
 */
export function tline(x0, y0, x1, y1, mx, my, mdx = 1 / 8, mdy = 0) {
    // TODO
}
