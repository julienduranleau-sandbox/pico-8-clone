#version 300 es

in vec2 position;
uniform vec2 scale;
out highp vec2 texPosition;

void main() {
    texPosition = vec2(
        (position.x + 1.0) / 2.0, 
        1.0 - (position.y + 1.0) / 2.0
    );

    gl_Position = vec4(position, 0.0, 1.0);
}