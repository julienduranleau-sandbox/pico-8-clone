#version 300 es

precision highp float;

in vec2 texPosition;
uniform sampler2D tex;
uniform vec3 palette[15];
out vec4 fragColor;

void main() {
    float px = texture(tex, texPosition).r;
    int high = (int(px * 255.0) & 0xF0) >> 4;
    int low = int(px * 255.0) & 0xF;

    if (int(texPosition.x * 128.0) % 2 == 0) {
        fragColor = vec4(palette[high] / 255.0, 1.0);
    } else {
        fragColor = vec4(palette[low] / 255.0, 1.0);
    }
}