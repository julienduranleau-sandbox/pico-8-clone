#version 300 es

precision highp float;

in vec2 texPosition;
uniform sampler2D tex;
uniform vec3 palette[16];
uniform int draw_mode;
out vec4 fragColor;

void main() {
    vec2 pos = texPosition;

    // horizontal stretch
    if (draw_mode == 1) {
        pos.x *= 0.5;
    }
    // vertical stretch
    if (draw_mode == 2) {
        pos.y *= 0.5;
    }
    // both stretch
    if (draw_mode == 3) {
        pos *= 0.5;
    }
    // Horizontal mirror
    if (draw_mode == 5) {
        if (pos.x > 0.5) {
            pos.x = 0.5 - (pos.x - 0.5);
        }
    }
    // Vertical mirror
    if (draw_mode == 6) {
        if (pos.y > 0.5) {
            pos.y = 0.5 - (pos.y - 0.5);
        }
    }
    // Both mirror
    if (draw_mode == 7) {
        if (pos.x > 0.5) {
            pos.x = 0.5 - (pos.x - 0.5);
        }
        if (pos.y > 0.5) {
            pos.y = 0.5 - (pos.y - 0.5);
        }
    }
    // Horizontal flip
    if (draw_mode == 129) {
        pos.x = 1.0 - pos.x;
    }
    // Vertical flip
    if (draw_mode == 130) {
        pos.y = 1.0 - pos.y;
    }
    // Both flip
    if (draw_mode == 131 || draw_mode == 134) {
        pos.x = 1.0 - pos.x;
        pos.y = 1.0 - pos.y;
    }
    // Rotate 90deg clockwise
    if (draw_mode == 133) {
        float tmp = pos.x;
        pos.x = pos.y;
        pos.y = 1.0 - tmp;
    }
    // Rotate 90deg counterclockwise
    if (draw_mode == 135) {
        float tmp = pos.x;
        pos.x = 1.0 - pos.y;
        pos.y = tmp;
    }

    float px = texture(tex, pos).r;
    int high = (int(px * 255.0) & 0xF0) >> 4;
    int low = int(px * 255.0) & 0xF;

    if (int(pos.x * 128.0) % 2 == 0) {
        fragColor = vec4(palette[low] / 255.0, 1.0);
    } else {
        fragColor = vec4(palette[high] / 255.0, 1.0);
    }
}