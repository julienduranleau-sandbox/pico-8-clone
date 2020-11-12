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

}

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

}

/**
 * Reads a byte from a memory location.
 * 
 * @param {number} addr The address of the memory location.
 * 
 * @ref https://pico-8.fandom.com/wiki/Peek
 */
export function peek(addr) {

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

}

/* ============================================================= */
/* ========================    INPUT   ========================= */
/**
 * Tests if a button is being pressed at this moment.
 * 
 * @param {number} n The button number.
 * @param {number} player The player number.
 * 
 * @ref https://pico-8.fandom.com/wiki/Btn
 */
export function btn(n, player = 1) {

}

/**
 * Tests if a button has just been pressed, with keyboard-style repeating.
 * 
 * @param {number} n The button number.
 * @param {number} player The player number.
 * 
 * @ref https://pico-8.fandom.com/wiki/Btnp
 */
export function btnp(i, player = 1) {

}




/* ============================================================= */
/* ========================   GRAPHICS  ======================== */

/**
 * Copies the graphics buffer to the screen, then synchronizes to the next frame.
 * 
 * @ref https://pico-8.fandom.com/wiki/Flip
 */
export function flip() {

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

}

/**
 * Draws a circle shape, without fill.
 * 
 * @param {number} x The x coordinate of the center of the circle.
 * @param {number} y The y coordinate of the center of the circle.
 * @param {number} r The radius of the circle, in pixels. If omitted, the radius will be 4. 
 * @param {number} color The color of the circle and fill. If omitted, the color from the draw state is used. 
 * 
 * @ref https://pico-8.fandom.com/wiki/Circ
 */
export function circ(x, y, r = 4, color = null) {

}

/**
 * Draws a filled-in circle shape. 
 * 
 * @param {number} x The x coordinate of the center of the circle.
 * @param {number} y The y coordinate of the center of the circle.
 * @param {number} r The radius of the circle, in pixels. If omitted, the radius will be 4. 
 * @param {number} color The color of the circle and fill. If omitted, the color from the draw state is used. 
 * 
 * @ref https://pico-8.fandom.com/wiki/Circfill
 */
export function circfill(x, y, r = 4, color = null) {

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
export function clip(x = null, y = null, w = null, h = null) {

}

/**
 * Clears the graphics buffer.
 * 
 * @param {number} color A color to use for the background.
 * 
 * @ref https://pico-8.fandom.com/wiki/Cls
 */
export function cls(color = 0) {

}

/**
 * Sets the draw color in the draw state.
 * 
 * @param {number} color The color number.
 * 
 * @ref https://pico-8.fandom.com/wiki/Color
 */
export function color(color = 6) {

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
export function cursor(x = 0, y = color, color = 0) {

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

}

/**
 * Sets the fill pattern.
 * 
 * @param {number} pat A bitfield representing the fill pattern to use.
 * 
 * @ref https://pico-8.fandom.com/wiki/Fillp
 */
export function fillp(pat) {

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
export function line(x0, y0, x1, y1, color) {

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

}

/**
 * Change the transparency of a color in the draw state for subsequent draw calls. 
 * 
 * @param {number} color The number of the color to modify. 
 * @param {bool} transparent If true, treat this color as transparent. If false, treat this color as opaque. 
 * 
 * @ref https://pico-8.fandom.com/wiki/Palt
 */
export function palt(color, transparent) {

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

}

/**
 * Sets a pixel in the graphics buffer. 
 * 
 * @param {number} x The x coordinate
 * @param {number} y The x coordinate
 * @param {number} color The color value. If not specified, uses the current color of the draw state.
 * 
 * @ref https://pico-8.fandom.com/wiki/Pset
 */
export function pset(x, y, color = null) {

}

/**
    * Draws an empty rectangle shape.
 * 
 * @param {number} x0 
 * @param {number} y0 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} color 
 * 
 * @ref https://pico-8.fandom.com/wiki/Rect
 */
export function rect(x0, y0, x1, y1, color = null) {

}

/**
 * Draws a filled-in rectangle shape.
 * 
 * @param {number} x0 
 * @param {number} y0 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} color 
 * 
 * @ref https://pico-8.fandom.com/wiki/Rectfill
 */
export function rectfill(x0, y0, x1, y1, color = null) {

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

}
