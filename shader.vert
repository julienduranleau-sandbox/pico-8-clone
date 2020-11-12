#version 300 es

in vec2 position;

uniform vec2 scale;

out highp vec2 texPosition;

void main() {
    float x = (position.x + 1.0) / 2.0;
    float y = (position.y + 1.0) / 2.0;

    texPosition = vec2(x, y);

    gl_Position = vec4(position * scale, 0.0, 1.0);
}