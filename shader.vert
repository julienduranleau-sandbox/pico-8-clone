attribute vec2 position;
// attribute uint pixels;

uniform vec2 scale;

varying highp vec2 vTextureCoord;

void main() {
    vTextureCoord = vec2(0.0, 0.0); // TODO: Send dynamic position (remember 2 pixels per byte)
    gl_Position = vec4(position * scale, 0.0, 1.0);
}