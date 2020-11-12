#ifdef GL_ES
precision highp float;
#endif

varying highp vec2 vTextureCoord;

uniform sampler2D tex;

void main() {
    // TODO Decode pixel info from high or low byte
    // Use % 2 to know if the pixel is odd or even
    // Add palette
    gl_FragColor = texture2D(tex, vTextureCoord);
}